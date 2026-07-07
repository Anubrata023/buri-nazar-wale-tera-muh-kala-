"""
AGENT 3: FISCAL UNDERWRITER
Estimates cost and matches government schemes using a trained scikit-learn model.
"""

import os
import joblib
import pandas as pd

# Fallback cost estimates (used if scikit-learn model is not trained yet)
FALLBACK_COSTS = {
    "Water": 45000,
    "Roads": 80000,
    "Electricity": 60000,
    "Education": 200000,
    "Health": 150000,
    "Sanitation": 50000,
    "Agriculture": 100000,
    "Other": 30000
}

# Government schemes per category
SCHEME_MAPPING = {
    "Water": ["Jal Jeevan Mission", "AMRUT"],
    "Roads": ["PMGSY", "CRIF"],
    "Education": ["Samagra Shiksha", "Mid-Day Meal"],
    "Health": ["NHM", "Ayushman Bharat"],
    "Sanitation": ["Swachh Bharat", "AMRUT"],
    "Electricity": ["DDUGJY", "IPDS"],
    "Agriculture": ["PM-KISAN", "Soil Health Card"],
    "Other": ["LADS (MP's Local Area Development Scheme)"]
}

# Ward to ward_type mapping for ML model cost predictions
WARD_TYPE_MAPPING = {
    "Chinhat": "rural",
    "Kakori": "rural",
    "Sarojini Nagar": "urban",
    "Alambagh": "urban",
    "Gomti Nagar": "urban",
    "Hazratganj": "urban",
    "Chowk": "urban",
    "Mahanagar": "urban",
    "Rajajipuram": "urban",
    "Indiranagar": "urban"
}

def estimate_cost(category: str, ward_name_or_pop = "Chinhat") -> int:
    """
    Estimate cost using trained scikit-learn Random Forest model.
    Falls back to hardcoded dictionary if model is not trained yet.
    """
    ward_name = "Chinhat"
    if isinstance(ward_name_or_pop, str):
        ward_name = ward_name_or_pop
        
    # Resolve absolute path to models directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.abspath(os.path.join(base_dir, "../models/cost_model.pkl"))
    features_path = os.path.abspath(os.path.join(base_dir, "../models/cost_model_features.pkl"))
    
    if os.path.exists(model_path) and os.path.exists(features_path):
        try:
            model = joblib.load(model_path)
            features = joblib.load(features_path)
            
            ward_type = WARD_TYPE_MAPPING.get(ward_name, "urban")
            district = "Lucknow"
            
            input_template = {col: 0 for col in features}
            if f"category_{category}" in input_template: input_template[f"category_{category}"] = 1
            if f"ward_type_{ward_type}" in input_template: input_template[f"ward_type_{ward_type}"] = 1
            if f"district_{district}" in input_template: input_template[f"district_{district}"] = 1
            
            X_input = pd.DataFrame([input_template])
            predicted = int(model.predict(X_input)[0])
            return predicted
        except Exception as e:
            print(f"⚠️ Warning: scikit-learn prediction failed ({e}). Using fallback.")
            
    return FALLBACK_COSTS.get(category, 30000)

def match_schemes(category: str) -> list:
    """Return matching government schemes for the category."""
    return SCHEME_MAPPING.get(category, ["LADS"])

def fiscal_node(state: dict) -> dict:
    """
    Agent 3: Adds cost estimate and scheme matches to the state.
    """
    category = state.get("category", "Other")
    ward = state.get("ward", "Chinhat")
    
    state["cost_estimate"] = estimate_cost(category, ward)
    state["scheme_match"] = match_schemes(category)
    
    print(f"💰 Cost estimate: ₹{state['cost_estimate']:,}")
    print(f"📜 Schemes: {state['scheme_match']}")
    
    return state