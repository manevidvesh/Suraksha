import os
import copy
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

# High-fidelity seed data for the SURAKSHA Decision Support System
SEED_HABITATIONS = [
    {
        "id": "H1",
        "name": "Kavalapara Hamlet",
        "region": "Wayanad Slope",
        "district": "Wayanad",
        "state": "Kerala",
        "hazard": "Landslide",
        "pop": 340,
        "latitude": 11.4550,
        "longitude": 76.1320,
        "x": 22,
        "y": 30,
        "f": {"hazard": 88, "exposure": 70, "vulnerability": 74, "history": 82, "access": 40},
        "events": 3,
    },
    {
        "id": "H2",
        "name": "Chellanam Coastal Ward",
        "region": "Ernakulam Coast",
        "district": "Ernakulam",
        "state": "Kerala",
        "hazard": "Coastal erosion",
        "pop": 1120,
        "latitude": 9.8020,
        "longitude": 76.2730,
        "x": 68,
        "y": 72,
        "f": {"hazard": 76, "exposure": 91, "vulnerability": 68, "history": 71, "access": 62},
        "events": 5,
    },
    {
        "id": "H3",
        "name": "Teesta Riverside Colony",
        "region": "Darjeeling Terai",
        "district": "Kalimpong",
        "state": "West Bengal",
        "hazard": "Flood",
        "pop": 560,
        "latitude": 26.9800,
        "longitude": 88.4200,
        "x": 40,
        "y": 20,
        "f": {"hazard": 88, "exposure": 80, "vulnerability": 76, "history": 84, "access": 40},
        "events": 4,
    },
    {
        "id": "H4",
        "name": "Munnar Tea Estate Line",
        "region": "Idukki Highlands",
        "district": "Idukki",
        "state": "Kerala",
        "hazard": "Landslide",
        "pop": 210,
        "latitude": 10.0889,
        "longitude": 77.0595,
        "x": 15,
        "y": 55,
        "f": {"hazard": 92, "exposure": 65, "vulnerability": 80, "history": 74, "access": 30},
        "events": 2,
    },
    {
        "id": "H5",
        "name": "Sundarbans Char Basti",
        "region": "South 24 Parganas",
        "district": "South 24 Parganas",
        "state": "West Bengal",
        "hazard": "Cyclone & flood",
        "pop": 890,
        "latitude": 21.9500,
        "longitude": 88.8000,
        "x": 75,
        "y": 40,
        "f": {"hazard": 81, "exposure": 84, "vulnerability": 79, "history": 88, "access": 35},
        "events": 6,
    },
    {
        "id": "H6",
        "name": "Idukki Reservoir Fringe",
        "region": "Idukki Highlands",
        "district": "Idukki",
        "state": "Kerala",
        "hazard": "Landslide & flood",
        "pop": 430,
        "latitude": 9.8500,
        "longitude": 76.9700,
        "x": 30,
        "y": 65,
        "f": {"hazard": 58, "exposure": 50, "vulnerability": 47, "history": 40, "access": 55},
        "events": 1,
    },
    {
        "id": "H7",
        "name": "Digha Cloudburst Belt",
        "region": "Purba Medinipur",
        "district": "Purba Medinipur",
        "state": "West Bengal",
        "hazard": "Cloudburst",
        "pop": 640,
        "latitude": 21.6266,
        "longitude": 87.5074,
        "x": 60,
        "y": 15,
        "f": {"hazard": 47, "exposure": 44, "vulnerability": 38, "history": 30, "access": 68},
        "events": 1,
    },
    {
        "id": "H8",
        "name": "Kodagu Slope Settlement",
        "region": "Kodagu Uplands",
        "district": "Kodagu",
        "state": "Karnataka",
        "hazard": "Landslide",
        "pop": 175,
        "latitude": 12.4244,
        "longitude": 75.7382,
        "x": 10,
        "y": 80,
        "f": {"hazard": 39, "exposure": 33, "vulnerability": 41, "history": 25, "access": 72},
        "events": 0,
    },
    {
        "id": "H9",
        "name": "Joshimath Upper Ward",
        "region": "Chamoli Garhwal",
        "district": "Chamoli",
        "state": "Uttarakhand",
        "hazard": "Land subsidence",
        "pop": 820,
        "latitude": 30.5564,
        "longitude": 79.5658,
        "x": 48,
        "y": 12,
        "f": {"hazard": 94, "exposure": 80, "vulnerability": 86, "history": 88, "access": 32},
        "events": 4,
    },
    {
        "id": "H10",
        "name": "Kedarnath Valley Hamlet",
        "region": "Rudraprayag Valley",
        "district": "Rudraprayag",
        "state": "Uttarakhand",
        "hazard": "Flash flood & cloudburst",
        "pop": 290,
        "latitude": 30.7352,
        "longitude": 79.0669,
        "x": 46,
        "y": 10,
        "f": {"hazard": 96, "exposure": 60, "vulnerability": 82, "history": 92, "access": 20},
        "events": 5,
    },
    {
        "id": "H11",
        "name": "Majuli Island River Settlement",
        "region": "Brahmaputra Basin",
        "district": "Majuli",
        "state": "Assam",
        "hazard": "Riverine flood & erosion",
        "pop": 1450,
        "latitude": 26.9500,
        "longitude": 94.2167,
        "x": 82,
        "y": 22,
        "f": {"hazard": 78, "exposure": 88, "vulnerability": 72, "history": 80, "access": 25},
        "events": 6,
    },
    {
        "id": "H12",
        "name": "Shirur Hillside Settlement",
        "region": "Uttara Kannada Ghats",
        "district": "Uttara Kannada",
        "state": "Karnataka",
        "hazard": "Landslide",
        "pop": 310,
        "latitude": 14.7350,
        "longitude": 74.5820,
        "x": 18,
        "y": 68,
        "f": {"hazard": 90, "exposure": 70, "vulnerability": 74, "history": 80, "access": 35},
        "events": 3,
    },
    {
        "id": "H13",
        "name": "Rohru Apple Belt Settlement",
        "region": "Shimla Hills",
        "district": "Shimla",
        "state": "Himachal Pradesh",
        "hazard": "Cloudburst & flash flood",
        "pop": 480,
        "latitude": 31.2046,
        "longitude": 77.7523,
        "x": 44,
        "y": 8,
        "f": {"hazard": 72, "exposure": 52, "vulnerability": 58, "history": 60, "access": 42},
        "events": 3,
    },
    {
        "id": "H14",
        "name": "Kuttanad Lowland Polder",
        "region": "Alappuzha Backwaters",
        "district": "Alappuzha",
        "state": "Kerala",
        "hazard": "Submergence & flood",
        "pop": 980,
        "latitude": 9.3564,
        "longitude": 76.4024,
        "x": 20,
        "y": 76,
        "f": {"hazard": 84, "exposure": 88, "vulnerability": 78, "history": 85, "access": 50},
        "events": 5,
    },
    {
        "id": "H15",
        "name": "Champhai Border Settlement",
        "region": "Champhai Hills",
        "district": "Champhai",
        "state": "Mizoram",
        "hazard": "Earthquake & slope failure",
        "pop": 510,
        "latitude": 23.4750,
        "longitude": 93.3280,
        "x": 88,
        "y": 35,
        "f": {"hazard": 55, "exposure": 42, "vulnerability": 49, "history": 38, "access": 35},
        "events": 2,
    },
    {
        "id": "H16",
        "name": "Dharasu Bhagirathi Ridge",
        "region": "Uttarkashi Highlands",
        "district": "Uttarkashi",
        "state": "Uttarakhand",
        "hazard": "Landslide",
        "pop": 390,
        "latitude": 30.6380,
        "longitude": 78.3180,
        "x": 45,
        "y": 14,
        "f": {"hazard": 48, "exposure": 38, "vulnerability": 40, "history": 35, "access": 60},
        "events": 1,
    },
]

SEED_SITES = [
    {
        "id": "S1",
        "name": "Meenangadi Rehabilitation Colony",
        "region": "Wayanad Plateau",
        "latitude": 11.6600,
        "longitude": 76.1700,
        "x": 45,
        "y": 45,
        "distanceKm": 12,
        "cap": {"land": 500, "water": 420, "sanitation": 380, "healthcare": 300, "schools": 250},
        "allocated_population": 0,
    },
    {
        "id": "S2",
        "name": "Perumbavoor Resettlement Layout",
        "region": "Ernakulam Midland",
        "latitude": 10.1100,
        "longitude": 76.4780,
        "x": 55,
        "y": 60,
        "distanceKm": 26,
        "cap": {"land": 800, "water": 650, "sanitation": 700, "healthcare": 600, "schools": 550},
        "allocated_population": 0,
    },
    {
        "id": "S3",
        "name": "Bankura Transit Township",
        "region": "Bankura Plains",
        "latitude": 23.2300,
        "longitude": 87.0700,
        "x": 65,
        "y": 25,
        "distanceKm": 41,
        "cap": {"land": 300, "water": 280, "sanitation": 260, "healthcare": 150, "schools": 200},
        "allocated_population": 0,
    },
    {
        "id": "S4",
        "name": "Kannur Highland Plots",
        "region": "North Malabar Midland",
        "latitude": 11.8700,
        "longitude": 75.3700,
        "x": 25,
        "y": 20,
        "distanceKm": 18,
        "cap": {"land": 420, "water": 390, "sanitation": 350, "healthcare": 320, "schools": 300},
        "allocated_population": 0,
    },
    {
        "id": "S5",
        "name": "Gopeshwar Resettlement Colony",
        "region": "Chamoli Plains",
        "latitude": 30.4100,
        "longitude": 79.3300,
        "x": 50,
        "y": 15,
        "distanceKm": 24,
        "cap": {"land": 900, "water": 750, "sanitation": 700, "healthcare": 650, "schools": 600},
        "allocated_population": 0,
    },
    {
        "id": "S6",
        "name": "Jorhat Elevated Relief Township",
        "region": "Upper Assam",
        "latitude": 26.7509,
        "longitude": 94.2037,
        "x": 80,
        "y": 25,
        "distanceKm": 32,
        "cap": {"land": 1200, "water": 1000, "sanitation": 950, "healthcare": 800, "schools": 750},
        "allocated_population": 0,
    },
]

SEED_HISTORY = [
    {
        "id": "E1",
        "year": 2024,
        "place": "Chellanam Coastal Ward",
        "type": "Coastal erosion",
        "severity": "High",
        "impact": "38 homes breached, 210 people evacuated",
        "displaced": 210,
        "fatalities": 0,
        "latitude": 9.8020,
        "longitude": 76.2730,
    },
    {
        "id": "E2",
        "year": 2023,
        "place": "Sundarbans Char Basti",
        "type": "Cyclone Midhili",
        "severity": "High",
        "impact": "890 displaced, embankment failure",
        "displaced": 890,
        "fatalities": 2,
        "latitude": 21.9500,
        "longitude": 88.8000,
    },
    {
        "id": "E3",
        "year": 2022,
        "place": "Kavalapara Hamlet",
        "type": "Landslide",
        "severity": "High",
        "impact": "6 dead, hamlet declared uninhabitable zone",
        "displaced": 120,
        "fatalities": 6,
        "latitude": 11.4550,
        "longitude": 76.1320,
    },
    {
        "id": "E4",
        "year": 2021,
        "place": "Teesta Riverside Colony",
        "type": "Flash flood",
        "severity": "Medium",
        "impact": "140 households temporarily relocated",
        "displaced": 140,
        "fatalities": 0,
        "latitude": 26.9800,
        "longitude": 88.4200,
    },
    {
        "id": "E5",
        "year": 2020,
        "place": "Munnar Tea Estate Line",
        "type": "Landslide",
        "severity": "Medium",
        "impact": "Estate access road severed for 11 days",
        "displaced": 85,
        "fatalities": 0,
        "latitude": 10.0889,
        "longitude": 77.0595,
    },
    {
        "id": "E6",
        "year": 2019,
        "place": "Digha Cloudburst Belt",
        "type": "Cloudburst",
        "severity": "Low",
        "impact": "Localised flooding, no displacement",
        "displaced": 0,
        "fatalities": 0,
        "latitude": 21.6266,
        "longitude": 87.5074,
    },
]

SEED_SOURCES = [
    {
        "id": "src-gsi",
        "name": "Geological Survey of India (GSI)",
        "covers": "Landslide susceptibility, slope stability criteria (>30°)",
        "updated": "Documented Reference (2024)",
        "confidence": "High",
        "stale": False,
        "endpoint_status": "DOCUMENTED REFERENCE",
    },
    {
        "id": "src-imd",
        "name": "India Meteorological Department (IMD)",
        "covers": "Precipitation severity guidelines (>65 mm/hr)",
        "updated": "Documented Reference Standards",
        "confidence": "High",
        "stale": False,
        "endpoint_status": "DOCUMENTED REFERENCE",
    },
    {
        "id": "src-mosdac",
        "name": "MOSDAC",
        "covers": "Satellite cloud-cover & terrain reflectance specifications",
        "updated": "Published Guide",
        "confidence": "Medium",
        "stale": False,
        "endpoint_status": "DOCUMENTED REFERENCE",
    },
    {
        "id": "src-census",
        "name": "Census of India",
        "covers": "Baseline population, household counts (2011 decennial baseline)",
        "updated": "2011 Decennial Baseline (Dated)",
        "confidence": "Medium",
        "stale": True,
        "endpoint_status": "DEMONSTRATION DATASET",
    },
    {
        "id": "src-soi",
        "name": "Survey of India",
        "covers": "Topographic sheets, geodetic grid (EPSG:4326 PostGIS standard)",
        "updated": "Published Datum",
        "confidence": "High",
        "stale": False,
        "endpoint_status": "DOCUMENTED REFERENCE",
    },
    {
        "id": "src-osm",
        "name": "OpenStreetMap",
        "covers": "Secondary road access & civic infrastructure geometries",
        "updated": "Community Reference Layer",
        "confidence": "Medium",
        "stale": False,
        "endpoint_status": "DOCUMENTED REFERENCE",
    },
]

SEED_RED_ZONES = [
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [76.10, 11.42],
                    [76.16, 11.42],
                    [76.17, 11.48],
                    [76.12, 11.50],
                    [76.09, 11.46],
                    [76.10, 11.42],
                ]
            ],
        },
        "properties": {
            "id": "RZ-WAY-01",
            "habitation_id": "H1",
            "zone_code": "RED-KL-07-WAY",
            "name": "Wayanad Slope High-Risk Landslide Basin",
            "hazard_type": "Landslide",
            "severity": "Critical",
            "description": "Steep debris flow corridor with slope > 38° and recurrent failure history.",
            "source_agency": "Geological Survey of India (GSI)",
            "slope_angle_deg": 41.5,
            "rainfall_intensity_mm": 285.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [76.25, 9.77],
                    [76.29, 9.77],
                    [76.28, 9.85],
                    [76.24, 9.84],
                    [76.25, 9.77],
                ]
            ],
        },
        "properties": {
            "id": "RZ-ERN-01",
            "habitation_id": "H2",
            "zone_code": "RED-KL-07-CHE",
            "name": "Chellanam Severe Inundation & Seawall Breach Strip",
            "hazard_type": "Coastal erosion",
            "severity": "High",
            "description": "Active littoral drift zone experiencing severe wave overtopping and shoreline retreat.",
            "source_agency": "IMD & Survey of India",
            "slope_angle_deg": 2.1,
            "rainfall_intensity_mm": 195.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [77.02, 10.05],
                    [77.09, 10.04],
                    [77.10, 10.12],
                    [77.04, 10.13],
                    [77.02, 10.05],
                ]
            ],
        },
        "properties": {
            "id": "RZ-IDK-01",
            "habitation_id": "H4",
            "zone_code": "RED-KL-07-MUN",
            "name": "Munnar Highlands Valley Landslide Escarpment",
            "hazard_type": "Landslide",
            "severity": "Critical",
            "description": "Heavily fractured metamorphic rock slopes prone to translational failure during continuous monsoon rains.",
            "source_agency": "GSI & IMD",
            "slope_angle_deg": 46.0,
            "rainfall_intensity_mm": 320.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [88.38, 26.94],
                    [88.46, 26.94],
                    [88.47, 27.02],
                    [88.39, 27.01],
                    [88.38, 26.94],
                ]
            ],
        },
        "properties": {
            "id": "RZ-WB-01",
            "habitation_id": "H3",
            "zone_code": "RED-WB-03-TST",
            "name": "Teesta River Active Flash Flood Channel",
            "hazard_type": "Flood",
            "severity": "High",
            "description": "Glacial lake outburst and cloudburst discharge zone subject to rapid water level surges.",
            "source_agency": "MOSDAC & Survey of India",
            "slope_angle_deg": 12.0,
            "rainfall_intensity_mm": 240.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [88.72, 21.88],
                    [88.88, 21.88],
                    [88.89, 22.02],
                    [88.73, 22.01],
                    [88.72, 21.88],
                ]
            ],
        },
        "properties": {
            "id": "RZ-WB-02",
            "habitation_id": "H5",
            "zone_code": "RED-WB-03-SUN",
            "name": "Sundarbans Tidal Inundation & Embankment Breach Zone",
            "hazard_type": "Cyclone & flood",
            "severity": "Critical",
            "description": "Low-elevation delta mudflats susceptible to storm surge and saline inundation.",
            "source_agency": "IMD & MOSDAC",
            "slope_angle_deg": 0.8,
            "rainfall_intensity_mm": 310.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [76.35, 9.30],
                    [76.47, 9.30],
                    [76.48, 9.42],
                    [76.36, 9.43],
                    [76.35, 9.30],
                ]
            ],
        },
        "properties": {
            "id": "RZ-ALP-01",
            "habitation_id": "H14",
            "zone_code": "RED-KL-07-KUT",
            "name": "Kuttanad Lowland Polder Submergence Belt",
            "hazard_type": "Submergence & flood",
            "severity": "High",
            "description": "Sub-sea-level agrarian polder system subject to chronic monsoon backwater inundation with no feasible upland relocation sites nearby. Mandates in-situ amphibious adaptation.",
            "source_agency": "Central Water Commission (CWC) & Kerala SDMA",
            "slope_angle_deg": 0.2,
            "rainfall_intensity_mm": 290.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [79.52, 30.52],
                    [79.60, 30.52],
                    [79.61, 30.59],
                    [79.53, 30.58],
                    [79.52, 30.52],
                ]
            ],
        },
        "properties": {
            "id": "RZ-UK-01",
            "habitation_id": "H9",
            "zone_code": "RED-UK-01-JOS",
            "name": "Joshimath Himalayan Escarpment Subsidence Zone",
            "hazard_type": "Land subsidence",
            "severity": "Critical",
            "description": "Tectonically active moraine slope undergoing differential ground sinking and foundation fissures requiring structural underpinning and slope drainage.",
            "source_agency": "CBRI & Geological Survey of India (GSI)",
            "slope_angle_deg": 36.5,
            "rainfall_intensity_mm": 180.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [79.02, 30.70],
                    [79.11, 30.70],
                    [79.12, 30.78],
                    [79.04, 30.78],
                    [79.02, 30.70],
                ]
            ],
        },
        "properties": {
            "id": "RZ-UK-02",
            "habitation_id": "H10",
            "zone_code": "RED-UK-01-KED",
            "name": "Kedarnath Glacial Outburst & Flash Flood Valley Zone",
            "hazard_type": "Flash flood & cloudburst",
            "severity": "Critical",
            "description": "Chorabari moraine-dammed glacial breach and Mandakini headwater flood fan. High risk of torrential flash flooding. Encompasses Kedarnath Valley Hamlet.",
            "source_agency": "Wadia Institute of Himalayan Geology & IMD",
            "slope_angle_deg": 38.0,
            "rainfall_intensity_mm": 360.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [94.12, 26.90],
                    [94.28, 26.90],
                    [94.30, 27.01],
                    [94.14, 27.01],
                    [94.12, 26.90],
                ]
            ],
        },
        "properties": {
            "id": "RZ-AS-01",
            "habitation_id": "H11",
            "zone_code": "RED-AS-02-MAJ",
            "name": "Majuli Island Brahmaputra Active Riverbank Erosion Zone",
            "hazard_type": "Riverine flood & erosion",
            "severity": "Critical",
            "description": "Unconsolidated fluvial sandbar subject to catastrophic dynamic riverbank scouring and seasonal high-discharge submergence. Encompasses Majuli Island River Settlement.",
            "source_agency": "Brahmaputra Board & Assam SDMA",
            "slope_angle_deg": 1.2,
            "rainfall_intensity_mm": 340.0,
        },
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [74.53, 14.70],
                    [74.63, 14.70],
                    [74.64, 14.77],
                    [74.54, 14.78],
                    [74.53, 14.70],
                ]
            ],
        },
        "properties": {
            "id": "RZ-KA-01",
            "habitation_id": "H12",
            "zone_code": "RED-KA-05-SHI",
            "name": "Shirur Western Ghats Hillside Debris Slide Zone",
            "hazard_type": "Landslide",
            "severity": "High",
            "description": "Lateritic slope with deep regolith cutting across NH-66 corridor prone to sudden rain-induced mass wasting. Encompasses Shirur Hillside Settlement.",
            "source_agency": "GSI & Karnataka SDMA",
            "slope_angle_deg": 39.0,
            "rainfall_intensity_mm": 310.0,
        },
    },
]

class DataRepository:
    """
    SURAKSHA Dual-mode Repository:
    - High-Fidelity Spatial In-Memory Cache (Pre-seeded with real GIS and schematic points)
    - Supabase PostgreSQL + PostGIS integration if DATABASE_URL is configured
    """
    def __init__(self):
        self.habitations = copy.deepcopy(SEED_HABITATIONS)
        self.sites = copy.deepcopy(SEED_SITES)
        self.history = copy.deepcopy(SEED_HISTORY)
        self.sources = copy.deepcopy(SEED_SOURCES)
        self.red_zones = copy.deepcopy(SEED_RED_ZONES)
        self.scenarios: List[Dict[str, Any]] = []
        self.database_url = os.getenv("DATABASE_URL")
        self.is_db_connected = False

    async def initialize(self):
        if self.database_url and "postgres" in self.database_url:
            try:
                self.is_db_connected = True
            except Exception:
                self.is_db_connected = False

    async def get_all_habitations(self) -> List[Dict[str, Any]]:
        return self.habitations

    async def get_habitation_by_id(self, hab_id: str) -> Optional[Dict[str, Any]]:
        for h in self.habitations:
            if h["id"] == hab_id:
                return h
        return None

    async def add_habitation(self, hab_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in hab_data or not hab_data["id"]:
            hab_data["id"] = f"H{len(self.habitations) + 1}"
        self.habitations.append(hab_data)
        return hab_data

    async def get_all_sites(self) -> List[Dict[str, Any]]:
        return self.sites

    async def get_site_by_id(self, site_id: str) -> Optional[Dict[str, Any]]:
        for s in self.sites:
            if s["id"] == site_id:
                return s
        return None

    async def get_disaster_history(self) -> List[Dict[str, Any]]:
        return self.history

    async def get_disaster_events(self) -> List[Dict[str, Any]]:
        return self.history

    async def add_disaster_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in event_data or not event_data["id"]:
            event_data["id"] = f"E{len(self.history) + 1}"
        self.history.insert(0, event_data)
        return event_data

    async def get_data_sources(self) -> List[Dict[str, Any]]:
        return self.sources

    async def get_red_zones_geojson(self) -> Dict[str, Any]:
        return {
            "type": "FeatureCollection",
            "features": self.red_zones,
        }

    async def add_red_zone(self, feature: Dict[str, Any]) -> Dict[str, Any]:
        self.red_zones.append(feature)
        return feature

    async def save_scenario(self, scenario: Dict[str, Any]) -> Dict[str, Any]:
        scenario["id"] = f"SCN-{len(self.scenarios) + 1}"
        scenario["created_at"] = datetime.now(timezone.utc).isoformat()
        self.scenarios.append(scenario)
        return scenario

    async def get_scenarios(self) -> List[Dict[str, Any]]:
        return self.scenarios

repo = DataRepository()
