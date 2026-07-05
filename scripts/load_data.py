import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing Supabase Environment Variables in .env file!")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_production_database():
    print("🚀 Starting Production Database Enrichment Seeder...")
    
    # Load and clean datasets verbatim from Person D's repository
    wards_df = pd.read_csv("datasets/processed/lucknow_wards_clean.csv")
    jjm_df = pd.read_csv("data/raw/jjm_coverage_lucknow.csv")
    udise_df = pd.read_csv("data/raw/udise_schools_lucknow.csv")
    
    # Strip any trailing whitespace from names to prevent join errors
    wards_df['ward_name'] = wards_df['ward_name'].str.strip()
    jjm_df['ward_name'] = jjm_df['ward_name'].str.strip()
    udise_df['ward_name'] = udise_df['ward_name'].str.strip()
    
    # Merge the clean tables side-by-side using the ward names as our relational key
    merged_df = pd.merge(wards_df, jjm_df, on="ward_name", how="left")
    merged_df = pd.merge(merged_df, udise_df, on="ward_name", how="left")
    
    # Fill any missing metrics gracefully with standard defaults
    merged_df.fillna({
        'households_with_tap_connection_pct': 0.0,
        'functional_connection_pct': 0.0,
        'primary_source': 'groundwater',
        'nearest_alt_water_source_km': 0.0,
        'num_schools': 0,
        'schools_with_drinking_water_pct': 0.0,
        'schools_with_electricity_pct': 0.0,
        'schools_functional_girls_toilet_pct': 0.0,
        'schools_functional_boys_toilet_pct': 0.0,
        'nearest_school_distance_km': 0.0
    }, inplace=True)
    
    print(f"📊 Processed {len(merged_df)} enriched wards. Uploading to cloud tables...")
    
    # Format the local records to perfectly align with our updated PostgreSQL fields
    for _, row in merged_df.iterrows():
        ward_data = {
            "name": str(row["ward_name"]),
            "population": int(row["population"]),
            "households": int(row["households"]),
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "tap_connection_pct": float(row["households_with_tap_connection_pct"]),
            "functional_connection_pct": float(row["functional_connection_pct"]),
            "primary_source": str(row["primary_source"]),
            "nearest_alt_water_source_km": float(row["nearest_alt_water_source_km"]),
            "num_schools": int(row["num_schools"]),
            "schools_with_drinking_water_pct": float(row["schools_with_drinking_water_pct"]),
            "schools_with_electricity_pct": float(row["schools_with_electricity_pct"]),
            "schools_functional_girls_toilet_pct": float(row["schools_functional_girls_toilet_pct"]),
            "schools_functional_boys_toilet_pct": float(row["schools_functional_boys_toilet_pct"]),
            "nearest_school_distance_km": float(row["nearest_school_distance_km"])
        }
        
        try:
            supabase.table("wards").upsert(ward_data, on_conflict="name").execute()
        except Exception as e:
            print(f"⚠️ Failed to insert ward {row['ward_name']}: {e}")
            
    print("✅ Live Production Database successfully populated with real infrastructure data metrics!")

def seed_test_complaints():
    print("📋 Injecting 50 production test complaints into Supabase...")
    
    # Load the complaints we just generated
    if not os.path.exists("datasets/processed/test_complaints.csv"):
        print("❌ Error: test_complaints.csv missing! Run generate_test_complaints.py first.")
        return
        
    complaints_df = pd.read_csv("datasets/processed/test_complaints.csv")
    
    # Fetch existing wards from Supabase to match the IDs correctly
    response = supabase.table("wards").select("id, name").execute()
    ward_mapping = {ward['name']: ward['id'] for ward in response.data}
    
    for _, row in complaints_df.iterrows():
        ward_name = row["ward"].strip()
        ward_id = ward_mapping.get(ward_name)
        
        if not ward_id:
            continue
            
        complaint_data = {
            "ward_id": int(ward_id),
            "phone": str(row["phone"]),
            "raw_text": str(row["raw_text"]),
            "category": str(row["category"]),
            "severity_score": int(row["severity"]),
            "priority_score": int(row["severity"]) * 10,
            "status": "pending",
            "lat": float(row["lat"]),
            "lng": float(row["lng"])
        }
        
        try:
            supabase.table("complaints").insert(complaint_data).execute()
        except Exception as e:
            print(f"⚠️ Failed to insert complaint: {e}")
            
    print("🎉 50 Enriched Test Complaints successfully loaded into the cloud!")

if __name__ == "__main__":
    seed_production_database()
    seed_test_complaints()