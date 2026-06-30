from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from agents.intake import triage_complaint, get_embedding
from agents.database import find_duplicate_complaints

class ComplaintState(TypedDict):
    raw_input: str
    ward: str
    lat: float
    lng: float
    phone: str
    
    # Added by agents
    transcript: Optional[str]
    category: Optional[str]
    severity: Optional[int]
    summary_en: Optional[str]
    summary_hi: Optional[str]
    sentiment: Optional[str]
    scheme_match: Optional[list]
    estimated_affected: Optional[int]
    embedding: Optional[list]
    is_duplicate: Optional[bool]
    cluster_id: Optional[str]
    geo_confidence: Optional[float]
    cost_estimate: Optional[float]
    priority_score: Optional[float]

# ============================================
# Agent 1: INTAKE ORCHESTRATOR
# ============================================
def intake_node(state: ComplaintState) -> ComplaintState:
    """Gemini triage: categorize, summarize, translate"""
    result = triage_complaint(state["raw_input"], state["ward"])
    state.update({
        "category": result.get("category"),
        "severity": result.get("severity"),
        "summary_en": result.get("summary_en"),
        "summary_hi": result.get("summary_hi"),
        "sentiment": result.get("sentiment"),
        "scheme_match": result.get("scheme_match", []),
        "estimated_affected": result.get("estimated_affected", 10)
    })
    # Get embedding for duplicate detection
    state["embedding"] = get_embedding(state["summary_en"] or state["raw_input"])
    return state

# ============================================
# Agent 2: GEOSPATIAL TRIAGE
# ============================================
def geospatial_node(state: ComplaintState) -> ComplaintState:
    """Check duplicates and verify location"""
    # Check for duplicates using pgvector
    if state.get("embedding"):
        duplicates = find_duplicate_complaints(
            state["embedding"],
            ward_id=1,  # TODO: Get actual ward ID from DB
            threshold=0.80
        )
        if duplicates:
            state["is_duplicate"] = True
            state["cluster_id"] = duplicates[0].get("cluster_id")
            state["geo_confidence"] = 0.95
        else:
            state["is_duplicate"] = False
            state["geo_confidence"] = 0.5
    else:
        state["geo_confidence"] = 0.5
    
    return state

# ============================================
# Agent 3: FISCAL UNDERWRITER
# ============================================
def fiscal_node(state: ComplaintState) -> ComplaintState:
    """Estimate cost and check budget"""
    # Simple cost estimation (Person C will replace with scikit-learn model)
    category = state.get("category", "Other")
    cost_estimates = {
        "Water": 45000,
        "Roads": 80000,
        "Electricity": 60000,
        "Education": 200000,
        "Health": 150000,
        "Sanitation": 50000,
        "Agriculture": 100000,
        "Other": 30000
    }
    state["cost_estimate"] = cost_estimates.get(category, 30000)
    return state

# ============================================
# Agent 4: PRIORITY CALCULATOR
# ============================================
def priority_node(state: ComplaintState) -> ComplaintState:
    """Calculate priority score using formula from Section 5"""
    import math
    
    severity = state.get("severity", 5)
    cost = state.get("cost_estimate", 45000)
    population = state.get("estimated_affected", 100)  # From Gemini or census
    geo_confidence = state.get("geo_confidence", 0.5)
    
    # Impact = people helped per rupee
    impact = population / max(cost, 1)
    
    # Time decay (simplified - uses days open)
    time_decay = 0.5  # Default for new complaints
    
    # Priority formula
    raw = (0.35 * severity) + (0.30 * impact * 1000) + (0.20 * geo_confidence * 10) + (0.15 * time_decay * 10)
    priority_score = round(min((raw / 4.0) * 10, 100), 1)
    
    state["priority_score"] = priority_score
    return state

# ============================================
# Build the LangGraph Workflow
# ============================================
def create_graph():
    workflow = StateGraph(ComplaintState)
    
    # Add nodes
    workflow.add_node("intake", intake_node)
    workflow.add_node("geospatial", geospatial_node)
    workflow.add_node("fiscal", fiscal_node)
    workflow.add_node("priority", priority_node)
    
    # Set entry point
    workflow.set_entry_point("intake")
    
    # Add edges (pipeline flow)
    workflow.add_edge("intake", "geospatial")
    workflow.add_edge("geospatial", "fiscal")
    workflow.add_edge("fiscal", "priority")
    workflow.add_edge("priority", END)
    
    return workflow.compile()
