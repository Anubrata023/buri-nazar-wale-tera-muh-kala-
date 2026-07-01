import os
import pandas as pd
from prophet import Prophet
from supabase import create_client
from dotenv import load_dotenv

# Initialize configurations and access keys
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def train_and_upload_forecasts():
    # Read the historical parameters we generated in Step 1
    if not os.path.exists("data/raw/historical_complaints.csv"):
        print("❌ Historical complaints file missing. Run generate_historical.py first!")
        return
        
    historical_df = pd.read_csv("data/raw/historical_complaints.csv")
    
    # Clean the database forecasts table before running to avoid duplicating entries during testing
    print("🧹 Purging old forecast metrics...")
    try:
        supabase.table("forecasts").delete().neq("id", 0).execute()
    except Exception as e:
        print(f"⚠️ Warning during table purge: {e}")
    
    # Process forecasts independently per ward
    ward_ids = historical_df["ward_id"].unique()
    
    for ward_id in ward_ids:
        print(f"🔮 Processing predictive mathematics for Ward ID: {ward_id}...")
        
        # Filter data for specific ward and format correctly for Meta Prophet (requires 'ds' and 'y')
        ward_data = historical_df[historical_df["ward_id"] == ward_id][["ds", "y"]].copy()
        ward_data["ds"] = pd.to_datetime(ward_data["ds"])
        
        # Initialize Prophet configured to intercept yearly fluctuations (monsoons)
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
        model.fit(ward_data)
        
        # Generate timestamps projecting out 4 weeks into the future
        future = model.make_future_dataframe(periods=4, freq="W")
        forecast = model.predict(future)
        
        # Pull only the last 4 rows (the newly predicted points)
        upcoming_forecasts = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(4)
        
        # Upload predictions row-by-row into Supabase
        for _, row in upcoming_forecasts.iterrows():
            payload = {
                "ward_id": int(ward_id),
                "forecast_date": row["ds"].date().isoformat(),
                "predicted_count": max(0, int(row["yhat"])),
                "upper_bound": max(0, int(row["yhat_upper"])),
                "lower_bound": max(0, int(row["yhat_lower"]))
            }
            supabase.table("forecasts").insert(payload).execute()
            
    print("✅ AI Forecasting run successfully pushed to cloud database!")

if __name__ == "__main__":
    train_and_upload_forecasts()