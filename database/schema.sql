-- SURAKSHA PostGIS Database Schema
-- Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation
-- Compatible with PostgreSQL 15+ & PostGIS 3.3+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Monitored Habitations
CREATE TABLE IF NOT EXISTS habitations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    schematic_x DOUBLE PRECISION,
    schematic_y DOUBLE PRECISION,
    primary_hazard VARCHAR(100) NOT NULL,
    population INT NOT NULL,
    households INT,
    hazard_score DOUBLE PRECISION NOT NULL DEFAULT 50,
    exposure_score DOUBLE PRECISION NOT NULL DEFAULT 50,
    vulnerability_score DOUBLE PRECISION NOT NULL DEFAULT 50,
    history_score DOUBLE PRECISION NOT NULL DEFAULT 50,
    access_score DOUBLE PRECISION NOT NULL DEFAULT 50,
    recorded_events INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habitations_geom ON habitations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_habitations_region ON habitations (region);

-- 2. Candidate Resettlement Sites
CREATE TABLE IF NOT EXISTS candidate_sites (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    schematic_x DOUBLE PRECISION,
    schematic_y DOUBLE PRECISION,
    distance_km DOUBLE PRECISION NOT NULL DEFAULT 15,
    land_capacity INT NOT NULL,
    water_capacity INT NOT NULL,
    sanitation_capacity INT NOT NULL,
    healthcare_capacity INT NOT NULL,
    schools_capacity INT NOT NULL,
    allocated_population INT NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_candidate_sites_geom ON candidate_sites USING GIST (geom);

-- 3. Dynamic Hazard Red Zones (Polygons)
CREATE TABLE IF NOT EXISTS hazard_red_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_code VARCHAR(50) NOT NULL,
    hazard_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT,
    source_agency VARCHAR(100) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    slope_angle_deg DOUBLE PRECISION,
    rainfall_intensity_mm DOUBLE PRECISION,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hazard_red_zones_geom ON hazard_red_zones USING GIST (geom);

-- 4. Historical Disaster Events
CREATE TABLE IF NOT EXISTS disaster_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INT NOT NULL,
    event_date DATE,
    place_name VARCHAR(255) NOT NULL,
    habitation_id VARCHAR(50) REFERENCES habitations(id) ON DELETE SET NULL,
    hazard_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    impact_summary TEXT NOT NULL,
    displaced_count INT DEFAULT 0,
    fatalities INT DEFAULT 0,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disaster_events_geom ON disaster_events USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_disaster_events_year ON disaster_events (year DESC);

-- 5. Relocation Scenarios / What-If Plans
CREATE TABLE IF NOT EXISTS relocation_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    habitation_id VARCHAR(50) REFERENCES habitations(id) ON DELETE CASCADE,
    site_id VARCHAR(50) REFERENCES candidate_sites(id) ON DELETE CASCADE,
    population_moved INT NOT NULL,
    hazard_reduction_pct DOUBLE PRECISION NOT NULL,
    exposure_reduction_pct DOUBLE PRECISION NOT NULL,
    access_improvement_pct DOUBLE PRECISION NOT NULL,
    travel_distance_km DOUBLE PRECISION NOT NULL,
    is_capacity_exceeded BOOLEAN NOT NULL DEFAULT FALSE,
    llm_rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. External Data Sources Sync Log
CREATE TABLE IF NOT EXISTS data_sources_metadata (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    covers VARCHAR(255) NOT NULL,
    updated VARCHAR(100) NOT NULL,
    confidence VARCHAR(50) NOT NULL,
    stale BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
