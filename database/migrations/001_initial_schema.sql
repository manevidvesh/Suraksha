-- Migration 001: Initial Schema for SURAKSHA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

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
