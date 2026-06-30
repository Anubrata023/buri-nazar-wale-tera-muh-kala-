import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import json

from config import Config
from agents.graph import create_graph, ComplaintState
from agents.database import save_complaint_to_supabase
from agents.intake import process_voice_complaint, process_photo_complaint

from fastapi import UploadFile, File
import tempfile
import shutil

# Validate config
Config.validate()

# Create FastAPI app
app = FastAPI(
    title="JanSaath API v3.0",
    description="AI-Powered Constituency Intelligence Platform - Free Stack Edition",
    version="3.0"
)

# CORS - Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Data Models
# ============================================
class ComplaintSubmit(BaseModel):
    text: str
    lat: float = 0.0
    lng: float = 0.0
    ward: str = "Chinhat"
    phone: str = "919800000000"

class ComplaintResponse(BaseModel):
    status: str
    complaint_id: str
    analysis: dict

# ============================================
# Health Check
# ============================================
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "JanSaath Backend v3.0",
        "demo_mode": Config.DEMO_MODE,
        "gemini_configured": bool(Config.GEMINI_API_KEY),
        "supabase_configured": bool(Config.SUPABASE_URL)
    }

# ============================================
# Main Submit Endpoint
# ============================================
@app.post("/api/complaints/submit", response_model=ComplaintResponse)
async def submit_complaint(complaint: ComplaintSubmit):
    """Submit a text complaint - runs through all 4 LangGraph agents"""
    try:
        # Initialize state
        state = ComplaintState(
            raw_input=complaint.text,
            ward=complaint.ward,
            lat=complaint.lat,
            lng=complaint.lng,
            phone=complaint.phone
        )
        
        # Run through LangGraph pipeline
        graph = create_graph()
        result = graph.invoke(state)
        
        # Save to Supabase
        complaint_id = str(uuid.uuid4())[:8]
        saved = save_complaint_to_supabase({
            "id": complaint_id,
            "user_phone": complaint.phone,
            "ward": complaint.ward,
            "raw_text": complaint.text,
            "category": result.get("category"),
            "severity": result.get("severity"),
            "summary_en": result.get("summary_en"),
            "summary_hi": result.get("summary_hi"),
            "priority_score": result.get("priority_score"),
            "lat": complaint.lat,
            "lng": complaint.lng
        })
        
        return ComplaintResponse(
            status="received",
            complaint_id=complaint_id,
            analysis={
                "category": result.get("category"),
                "severity": result.get("severity"),
                "summary_en": result.get("summary_en"),
                "summary_hi": result.get("summary_hi"),
                "priority_score": result.get("priority_score")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api")
async def root():
    return {
        "message": "Welcome to JanSaath API v3.0",
        "docs": "/docs",
        "health": "/api/health"
    }

# ============================================
# Run
# ============================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENV") != "production" else False
    )

@app.post("/api/complaints/voice")
async def submit_voice(file: UploadFile = File(...), ward: str = "Chinhat"):
    """Submit a voice complaint - Gemini transcribes AND triages"""
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    
    try:
        # Process with Gemini
        result = process_voice_complaint(tmp_path)
        # Clean up
        os.unlink(tmp_path)
        return {"status": "processed", "analysis": result}
    except Exception as e:
        os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complaints/photo")
async def submit_photo(file: UploadFile = File(...), ward: str = "Chinhat"):
    """Submit a photo complaint - Gemini analyzes vision"""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    
    try:
        result = process_photo_complaint(tmp_path)
        os.unlink(tmp_path)
        return {"status": "processed", "analysis": result}
    except Exception as e:
        os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))
