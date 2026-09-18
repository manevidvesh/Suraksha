# SURAKSHA
**Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation**  
*Intelligent Identification of Hazard-Based Red Zones & Habitation Relocation Decision Support System (DSS)*

---

## 📌 Executive Summary

**SURAKSHA** is a multi-hazard spatial decision support platform designed for State and District Disaster Management Authorities (SDMA / DDMA). It replaces reactive post-disaster evacuation with proactive, data-driven resettlement planning across high-vulnerability corridors (such as the Western Ghats Zone 7 pilot region).

By fusing satellite remote sensing, PostGIS spatial analysis, machine learning risk modeling, and infrastructure carrying capacity optimization, SURAKSHA:
1. **Delineates Multi-Hazard Red Zones** from slope steepness, flood inundation models, and historical frequency.
2. **Prioritizes Endangered Habitations** into actionable relocation time windows (*Immediate*, *Short-term*, *Medium-term*) using composite risk scoring.
3. **Solves Infrastructure Carrying Capacity** under Liebig's Law of the Minimum — identifying candidate resettlement sites whose capacity is governed by the tightest infrastructure bottleneck (drinking water, sanitation, schools, primary healthcare).
4. **Simulates Relocation Outcomes** with geodesic travel friction analysis and before-vs-after risk radar assessments.
5. **Generates AI Executive Briefs** formatted for administrative sign-off and SDMA policy directives.

---

## 🏛️ System Architecture

```
SURAKSHA/
│
├── frontend/                         # Next.js 14 App Router Frontend
│   ├── app/
│   │   ├── page.tsx                  # Landing page & system introduction
│   │   ├── dashboard/page.tsx        # Decision dashboard with PostGIS layers & stats
│   │   ├── risk-map/page.tsx         # Full-screen interactive MapLibre WebGL & Schematic map
│   │   ├── habitations/page.tsx      # Settlement risk scoring, weight tuning & factor breakdown
│   │   ├── relocation/page.tsx       # Resettlement site ranking & bottleneck analysis
│   │   ├── simulation/page.tsx       # What-if relocation simulator & AI brief generator
│   │   ├── layout.tsx                # Root layout with typography & metadata
│   │   └── globals.css               # Design system & Tailwind styling
│   ├── components/
│   │   ├── Map/                      # MapLibre GL JS WebGL map & OSM geocoder
│   │   ├── RiskMap/                  # Schematic SVG multi-hazard map & legend
│   │   ├── HabitationTable/          # Searchable settlements table & add modal
│   │   ├── SiteRanking/              # Candidate resettlement sites list & cards
│   │   ├── Capacity/                 # Infrastructure capacity bars & bottleneck badges
│   │   ├── Simulation/               # What-if scenario simulator & radar visualizer
│   │   ├── Charts/                   # Recharts radar & vulnerability factor breakdown
│   │   ├── AIExplanation/            # Executive decision brief modal & exporter
│   │   ├── Navigation/               # Responsive sidebar & mobile topbar
│   │   └── Common/                   # Design tokens, badges, sliders & section headers
│   ├── lib/                          # Typed API client, map utils & offline fallbacks
│   ├── types/                        # TypeScript interfaces
│   ├── hooks/                        # Custom React hooks (useRiskData)
│   └── public/                       # Static SVGs, icons, and logos
│
├── backend/                          # FastAPI Modular Backend
│   ├── api/routes/                   # REST API endpoints (hazards, habitations, risk, sites, etc.)
│   ├── services/                     # Business logic (hazard, vulnerability, risk, simulation)
│   ├── ml/                           # Trained ML models (Random Forest hazard & vulnerability)
│   ├── gis/                          # PostGIS spatial join, flood/landslide exposure & routing
│   ├── decision/                     # Multi-criteria prioritization & capacity constraint solver
│   ├── llm/                          # Structured SDMA prompt engineering & executive explainer
│   ├── models/                       # SQLAlchemy ORM domain entities
│   ├── schemas/                      # Pydantic schemas for request validation & serialization
│   ├── config.py                     # Centralized settings & environment variables
│   ├── database.py                   # PostGIS connection pool & resilient fallback mock
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Backend environment configuration
│
├── data/                             # Raw, processed, and sample GIS datasets
│   ├── raw/                          # Rainfall, flood zones, landslide susceptibility, census, roads, DEM
│   ├── processed/                    # Preprocessed GeoJSON layers
│   └── sample/pilot_region/          # Pilot corridor metadata, habitations, and candidate sites
│
├── database/                         # Database scripts & migrations
│   ├── schema.sql                    # Full PostGIS relational schema with spatial indexes
│   ├── seed.sql                      # Realistic Zone 7 seed records
│   └── migrations/                   # Incremental SQL migration scripts
│
├── notebooks/                        # Jupyter Research & Exploratory Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_hazard_model.ipynb
│   ├── 03_vulnerability_model.ipynb
│   └── 04_site_suitability.ipynb
│
├── docs/                             # Engineering documentation
│   ├── architecture.md               # End-to-end system architecture
│   ├── data-sources.md               # Authoritative data lineage & confidence scoring
│   ├── api.md                        # Complete OpenAPI / REST specification
│   └── model-documentation.md        # Mathematical formulation & ML evaluation metrics
│
├── tests/                            # Comprehensive Test Suite
│   ├── backend/                      # API endpoint tests, health checks, uploads & E2E flows
│   ├── ml/                           # Model inference, weights, and feature processing tests
│   └── gis/                          # Spatial join, bounding box, and exposure calculations
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

### 1. Backend Setup
```bash
# From project root
python -m pip install -r backend/requirements.txt

# Run backend API server
python run.py
# Server runs on http://localhost:8000 (Swagger docs: http://localhost:8000/docs)
```

### 2. Frontend Setup
```bash
# In frontend directory
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Docker Compose (Full Stack with PostGIS)
```bash
docker-compose up --build
```

---

## 🧪 Testing

Run the automated test suite covering backend routes, machine learning inference, and GIS spatial joins:

```bash
python -m pytest tests/ -v
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check and PostGIS status |
| `GET` | `/api/v1/hazards/summary` | Multi-hazard statistical metrics |
| `GET` | `/api/v1/hazards/red-zones` | GeoJSON polygon layer of designated Red Zones |
| `GET` | `/api/v1/habitations` | Monitored settlements with risk scores and tiers |
| `POST` | `/api/v1/habitations` | Register and score a new settlement |
| `POST` | `/api/v1/risk/calculate` | Recalculate composite scores across custom weights |
| `GET` | `/api/v1/relocation/sites` | Candidate sites filtered by effective carrying capacity |
| `POST` | `/api/v1/simulation/relocate` | What-if simulation between habitation and candidate site |
| `POST` | `/api/v1/reports/executive-brief` | Generate AI executive brief for SDMA sign-off |
| `POST` | `/api/v1/upload` | Ingest CSV, GeoJSON, or zipped Shapefiles |

---

## 📜 License & Institutional Attribution
Built on authoritative datasets from:
- **GSI** (Geological Survey of India) — Landslide susceptibility maps
- **IMD** (India Meteorological Department) — High-intensity precipitation radar
- **MOSDAC / ISRO** — Flood inundation monitoring
- **Census of India** — Demographic & social vulnerability indicators
- **Survey of India / OSM** — Road accessibility & transit infrastructure
