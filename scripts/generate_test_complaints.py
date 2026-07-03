import csv
import random

def generate_test_complaints():
    wards = [
        {"name": "Chinhat", "lat": 26.86, "lng": 80.94},
        {"name": "Kakori", "lat": 26.88, "lng": 80.80},
        {"name": "Sarojini Nagar", "lat": 26.82, "lng": 80.98},
        {"name": "Alambagh", "lat": 26.78, "lng": 80.92},
        {"name": "Gomti Nagar", "lat": 26.87, "lng": 80.98},
    ]
    categories = ['Water', 'Roads', 'Electricity', 'Education', 'Sanitation', 'Health']
    
    templates = {
        'Water': ['Handpump band hai, pani nahi aa raha', 'Paani ki tanki kharab hai', 'Paani ki pipeline phut gayi hai'],
        'Roads': ['Sadak mein gaddha hai', 'Sadak toot gayi hai', 'Rasta band hai'],
        'Electricity': ['Bijli nahi aa rahi hai', 'Transformer jal gaya hai', 'Street light kharab hai'],
        'Education': ['School mein toilet nahi hai', 'School building kharab hai', 'Teacher nahi aate'],
        'Sanitation': ['Garbage nahi uth raha', 'Nali band hai', 'Gutter jam gaya hai'],
        'Health': ['PHC mein dawai nahi hai', 'Doctor nahi aate PHC mein', 'Ambulance nahi hai']
    }
    
    # 5 Specific Demo Complaints needed for the 5-Minute Pitch Script
    all_complaints = [
        {"phone": "919800000001", "ward": "Chinhat", "raw_text": "Hamare mohalle mein handpump 3 hafte se band hai, pani nahi aa raha", "category": "Water", "severity": 8, "lat": 26.86, "lng": 80.94},
        {"phone": "919800000002", "ward": "Kakori", "raw_text": "The school in our area has no toilets — girls are dropping out", "category": "Education", "severity": 9, "lat": 26.88, "lng": 80.80},
        {"phone": "919800000003", "ward": "Sarojini Nagar", "raw_text": "Photo of flooded road submitted - pani bhar gaya hai sadak mein", "category": "Roads", "severity": 7, "lat": 26.82, "lng": 80.98},
        {"phone": "919800000004", "ward": "Alambagh", "raw_text": "Bijli ka khamba toot gaya hai, raat ko andhera rehta hai", "category": "Electricity", "severity": 6, "lat": 26.78, "lng": 80.92},
        {"phone": "919800000005", "ward": "Chinhat", "raw_text": "Mera handpump bhi kharab hai, 47 log ne report kiya - pani nahi aa raha", "category": "Water", "severity": 8, "lat": 26.86, "lng": 80.94}
    ]
    
    # Generate the remaining 45 validation records automatically
    phone_counter = 10000006
    for _ in range(45):
        ward = random.choice(wards)
        cat = random.choice(categories)
        text = random.choice(templates[cat])
        all_complaints.append({
            "phone": f"9198{phone_counter}",
            "ward": ward["name"],
            "raw_text": text,
            "category": cat,
            "severity": random.randint(3, 9),
            "lat": round(ward["lat"] + random.uniform(-0.01, 0.01), 4),
            "lng": round(ward["lng"] + random.uniform(-0.01, 0.01), 4)
        })
        phone_counter += 1
        
    with open("datasets/processed/test_complaints.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_complaints[0].keys())
        writer.writeheader()
        writer.writerows(all_complaints)
        
    print(f"✅ Generated {len(all_complaints)} structured test complaints in datasets/processed/!")

if __name__ == "__main__":
    generate_test_complaints()