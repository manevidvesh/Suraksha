# SURAKSHA REST API Specifications

The SURAKSHA backend exposes standard RESTful endpoints mounted under `/api`.

Interactive OpenAPI Swagger docs are accessible at:
`http://localhost:8000/docs`

---

## Endpoint Reference

### 1. Habitations (`/api/habitations`)
- `GET /api/habitations`: Retrieve all monitored habitations with computed risk scores.
  - Query params: `region`, `hazard`, `tier`
- `GET /api/habitations/{id}`: Detailed habitation profile and factor indicators.
- `POST /api/habitations`: Register a newly surveyed settlement.

### 2. Hazards & Red Zones (`/api/hazards`)
- `GET /api/hazards/red-zones`: Returns GeoJSON FeatureCollection of high-risk hazard zones.
- `POST /api/hazards/red-zones/simulate-buffer`: Dynamically generates and overlays an expanded hazard buffer.
- `GET /api/hazards/history`: Chronological disaster events log.
- `GET /api/hazards/layers`: Catalog of GIS layer metadata.

### 3. Risk Engine (`/api/risk`)
- `POST /api/risk/calculate`: Dynamic MCDA risk score recalculation using custom factor weights.
- `GET /api/risk/habitations/{id}/breakdown`: Factor contribution breakdown and risk driver rationale.

### 4. Relocation & Carrying Capacity (`/api/relocation` & `/api/sites` & `/api/capacity`)
- `GET /api/relocation/sites`: List candidate resettlement sites with capacity and bottlenecks.
- `POST /api/relocation/simulate`: What-if simulation pairing a habitation to a site.
- `POST /api/relocation/optimize`: Global capacity-constrained bipartite relocation matching.
- `GET /api/capacity/sites/{id}`: Effective carrying capacity and Liebig bottleneck analysis.

### 5. Simulation & Reports (`/api/simulation` & `/api/reports`)
- `POST /api/simulation/run`: Execute relocation impact simulation.
- `POST /api/simulation/scenarios`: Save a relocation scenario.
- `GET /api/simulation/scenarios`: Retrieve saved scenarios.
- `POST /api/reports/generate-brief`: Authoritative SDMA executive relocation brief with policy recommendations.

### 6. Data Ingestion (`/api/upload`)
- `POST /api/upload`: Ingest field survey CSVs, GeoJSON layers, or ESRI Shapefiles.
