-- SURAKSHA Database Seed Data
-- Pilot Region: Western Ghats / Kerala Disaster Management Corridor

INSERT INTO habitations (id, name, region, district, state, latitude, longitude, geom, schematic_x, schematic_y, primary_hazard, population, households, hazard_score, exposure_score, vulnerability_score, history_score, access_score, recorded_events)
VALUES
('H1', 'Kavalapara Hamlet', 'Wayanad Slope', 'Wayanad', 'Kerala', 11.4550, 76.1320, ST_SetSRID(ST_MakePoint(76.1320, 11.4550), 4326), 22, 30, 'Landslide', 340, 78, 88, 70, 74, 82, 40, 3),
('H2', 'Chellanam Coastal Ward', 'Ernakulam Coast', 'Ernakulam', 'Kerala', 9.8020, 76.2730, ST_SetSRID(ST_MakePoint(76.2730, 9.8020), 4326), 68, 72, 'Coastal erosion', 1120, 240, 76, 91, 68, 71, 62, 5),
('H3', 'Teesta Riverside Colony', 'Darjeeling Terai', 'Kalimpong', 'West Bengal', 26.9800, 88.4200, ST_SetSRID(ST_MakePoint(88.4200, 26.9800), 4326), 40, 20, 'Flood', 560, 115, 64, 58, 55, 60, 48, 4),
('H4', 'Munnar Tea Estate Line', 'Idukki Highlands', 'Idukki', 'Kerala', 10.0889, 77.0595, ST_SetSRID(ST_MakePoint(77.0595, 10.0889), 4326), 15, 55, 'Landslide', 210, 45, 92, 65, 80, 74, 30, 2),
('H5', 'Sundarbans Char Basti', 'South 24 Parganas', 'South 24 Parganas', 'West Bengal', 21.9500, 88.8000, ST_SetSRID(ST_MakePoint(88.8000, 21.9500), 4326), 75, 40, 'Cyclone & flood', 890, 195, 81, 84, 79, 88, 35, 6),
('H6', 'Idukki Reservoir Fringe', 'Idukki Highlands', 'Idukki', 'Kerala', 9.8500, 76.9700, ST_SetSRID(ST_MakePoint(76.9700, 9.8500), 4326), 30, 65, 'Landslide & flood', 430, 92, 58, 50, 47, 40, 55, 1),
('H7', 'Digha Cloudburst Belt', 'Purba Medinipur', 'Purba Medinipur', 'West Bengal', 21.6266, 87.5074, ST_SetSRID(ST_MakePoint(87.5074, 21.6266), 4326), 60, 15, 'Cloudburst', 640, 130, 47, 44, 38, 30, 68, 1),
('H8', 'Kodagu Slope Settlement', 'Kodagu Uplands', 'Kodagu', 'Karnataka', 12.4244, 75.7382, ST_SetSRID(ST_MakePoint(75.7382, 12.4244), 4326), 10, 80, 'Landslide', 175, 38, 39, 33, 41, 25, 72, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO candidate_sites (id, name, region, latitude, longitude, geom, schematic_x, schematic_y, distance_km, land_capacity, water_capacity, sanitation_capacity, healthcare_capacity, schools_capacity, allocated_population)
VALUES
('S1', 'Meenangadi Rehabilitation Colony', 'Wayanad Plateau', 11.6600, 76.1700, ST_SetSRID(ST_MakePoint(76.1700, 11.6600), 4326), 45, 45, 12, 500, 420, 380, 300, 250, 0),
('S2', 'Perumbavoor Resettlement Layout', 'Ernakulam Midland', 10.1100, 76.4780, ST_SetSRID(ST_MakePoint(76.4780, 10.1100), 4326), 55, 60, 26, 800, 650, 700, 600, 550, 0),
('S3', 'Bankura Transit Township', 'Bankura Plains', 23.2300, 87.0700, ST_SetSRID(ST_MakePoint(87.0700, 23.2300), 4326), 65, 25, 41, 300, 280, 260, 150, 200, 0),
('S4', 'Kannur Highland Plots', 'North Malabar Midland', 11.8700, 75.3700, ST_SetSRID(ST_MakePoint(75.3700, 11.8700), 4326), 25, 20, 18, 420, 390, 350, 320, 300, 0),
('S5', 'Gopeshwar Resettlement Colony', 'Chamoli Plains', 30.4100, 79.3300, ST_SetSRID(ST_MakePoint(79.3300, 30.4100), 4326), 50, 15, 24, 900, 750, 700, 650, 600, 0),
('S6', 'Jorhat Elevated Relief Township', 'Upper Assam', 26.7509, 94.2037, ST_SetSRID(ST_MakePoint(94.2037, 26.7509), 4326), 80, 25, 32, 1200, 1000, 950, 800, 750, 0)
ON CONFLICT (id) DO NOTHING;
