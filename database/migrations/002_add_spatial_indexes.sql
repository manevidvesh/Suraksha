-- Migration 002: Add Spatial GIST Indexes and Hazard Zone Table
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

CREATE INDEX IF NOT EXISTS idx_habitations_geom ON habitations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_candidate_sites_geom ON candidate_sites USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hazard_red_zones_geom ON hazard_red_zones USING GIST (geom);
