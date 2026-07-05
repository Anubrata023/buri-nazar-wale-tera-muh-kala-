DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS wards CASCADE;

-- Enhanced Wards table to store real JJM and UDISE infrastructure metrics
CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    population INT NOT NULL,
    households INT NOT NULL,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    tap_connection_pct DECIMAL(5,2) DEFAULT 0.0,
    functional_connection_pct DECIMAL(5,2) DEFAULT 0.0,
    primary_source VARCHAR(100) DEFAULT 'groundwater',
    nearest_alt_water_source_km DECIMAL(4,2) DEFAULT 0.0,
    num_schools INT DEFAULT 0,
    schools_with_drinking_water_pct DECIMAL(5,2) DEFAULT 0.0,
    schools_with_electricity_pct DECIMAL(5,2) DEFAULT 0.0,
    schools_functional_girls_toilet_pct DECIMAL(5,2) DEFAULT 0.0,
    schools_functional_boys_toilet_pct DECIMAL(5,2) DEFAULT 0.0,
    nearest_school_distance_km DECIMAL(4,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recreate complaints table linking directly to the enriched wards
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    ward_id INT REFERENCES wards(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    raw_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity_score INT NOT NULL,
    priority_score INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);