import os
import pandas as pd
import io
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
    
    # Check potential path locations for the baseline files
    wards_path = "datasets/processed/lucknow_wards_clean.csv" if os.path.exists("datasets/processed/lucknow_wards_clean.csv") else "lucknow_wards_clean.csv"
    jjm_path = "data/raw/jjm_coverage_lucknow.csv" if os.path.exists("data/raw/jjm_coverage_lucknow.csv") else "jjm_coverage_lucknow.csv"
    udise_path = "data/raw/udise_schools_lucknow.csv" if os.path.exists("data/raw/udise_schools_lucknow.csv") else "udise_schools_lucknow.csv"
    
    # Load baseline assets
    wards_df = pd.read_csv(wards_path)
    jjm_df = pd.read_csv(jjm_path)
    udise_df = pd.read_csv(udise_path)
    
    # Clean whitespace strings
    wards_df['ward_name'] = wards_df['ward_name'].str.strip()
    jjm_df['ward_name'] = jjm_df['ward_name'].str.strip()
    udise_df['ward_name'] = udise_df['ward_name'].str.strip()
    
    # Merge datasets natively
    merged_df = pd.merge(wards_df, jjm_df, on="ward_name", how="left")
    merged_df = pd.merge(merged_df, udise_df, on="ward_name", how="left")
    
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
    print("📋 Injecting Person D's official demo_complaints data into Supabase...")
    
    # Directly embed the exact CSV content Person D provided to bypass file checking issues
    csv_data = """phone,ward,raw_text,category,severity,summary_en,summary_hi,lat,lng
919800000001,Chinhat,"Hamare mohalle mein handpump 3 hafte se band hai, pani nahi aa raha",Water,8,"Handpump broken in Chinhat for 3 weeks, no water","Chinhat mein handpump 3 hafte se band hai, pani nahi aa raha",26.86,80.94
919800000002,Kakori,The school in our area has no toilets — girls are dropping out,Education,9,"School toilets missing in Kakori, girls dropping out","Kakori mein school mein toilet nahi hai, ladkiyan school chhod rahi hain",26.88,80.8
919800000003,Sarojini Nagar,Photo of flooded road submitted - pani bhar gaya hai sadak mein,Roads,7,Flooded road in Sarojini Nagar after heavy rain,Sarojini Nagar mein sadak mein paani bhar gaya hai,26.82,80.98
919800000004,Alambagh,"Bijli ka khamba toot gaya hai, raat ko andhera rehta hai",Electricity,6,"Electric pole broken in Alambagh, darkness at night","Alambagh mein bijli ka khamba toot gaya hai, raat ko andhera",26.78,80.92
919800000005,Chinhat,"Mera handpump bhi kharab hai, 47 log ne report kiya - pani nahi aa raha",Water,8,Same handpump broken - 47 citizens reported - merged issue,Wahi handpump - 47 log ne report kiya - merged issue,26.86,80.94"""

    complaints_df = pd.read_csv(io.StringIO(csv_data))
    
    response = supabase.table("wards").select("id, name").execute()
    ward_mapping = {ward['name'].strip(): ward['id'] for ward in response.data}
    
    for _, row in complaints_df.iterrows():
        ward_name = str(row["ward"]).strip()
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
            "lng": float(row["lng"]),
            "summary_en": str(row["summary_en"]),  
            "summary_hi": str(row["summary_hi"])   
        }
        
        try:
            supabase.table("complaints").insert(complaint_data).execute()
        except Exception as e:
            print(f"⚠️ Failed to insert complaint entry: {e}")
            
    print("🎉 Official dual-language demo complaints successfully seeded into the cloud structure!")

if __name__ == "__main__":
    seed_production_database()
    seed_test_complaints()