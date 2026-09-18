# SURAKSHA Architecture & System Design

**SURAKSHA** (*Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation*) is an intelligent GIS-enabled decision support platform designed for State Disaster Management Authorities (SDMAs), District Collectors, and Urban Local Bodies.

---

## High-Level System Architecture

```
                 +-----------------------------------------------+
                 |              SURAKSHA Frontend                |
                 |     Next.js 14 (App Router) + TailwindCSS     |
                 |      MapLibre GL JS + Recharts + Lucide       |
                 +-----------------------+-----------------------+
                                         |  HTTPS / REST JSON
                                         v
                 +-----------------------------------------------+
                 |               FastAPI Backend                 |
                 |           Python 3.11+ / Async / CORS         |
                 +-------+---------------+---------------+-------+
                         |               |               |
                         v               v               v
                +----------------+ +------------+ +-------------+
                |   GIS Engine   | | ML Models  | | Decision/AHP|
                |  Geodesic Buf  | | Suscept RF | | Liebig Min  |
                | Point-in-Poly  | | Ridge Vuln | | TOPSIS Match|
                +----------------+ +------------+ +-------------+
                         |               |               |
                         +-------+-------+---------------+
                                 |
                                 v
                 +-----------------------------------------------+
                 |          PostgreSQL 15 + PostGIS 3.3          |
                 |        High-Fidelity Spatial Memory Cache     |
                 +-----------------------------------------------+
```

---

## Core Layers

### 1. Presentation Layer (`frontend/`)
- **Next.js App Router**: Dedicated routes for `/dashboard`, `/risk-map`, `/habitations`, `/relocation`, `/simulation`.
- **MapLibre GL JS**: GPU-accelerated vector map client rendering multi-hazard red zone polygons, habitations, and candidate relocation sites.
- **Custom Reactive Hook (`useRiskData`)**: Centralized state management for dynamic weight recalculations, site filters, and offline resilience.

### 2. Service & Decision Layer (`backend/services/` & `backend/decision/`)
- **Risk Service**: Implements MCDA / AHP multi-factor weighting:
  $$\text{Score} = \frac{\sum_{i} f_i \cdot w_i}{\sum_{i} w_i}$$
- **Capacity Service**: Enforces **Liebig's Law of the Minimum** across 5 vital infrastructure dimensions:
  $$\text{Capacity}_{\text{effective}} = \min(\text{Land}, \text{Water}, \text{Sanitation}, \text{Healthcare}, \text{Schools})$$
- **Simulation Service**: Real-time What-If scenario modeling quantifying percentage hazard reduction, population absorption, and transit accessibility.

### 3. Spatial & Machine Learning Layer (`backend/gis/` & `backend/ml/`)
- **Spatial Buffer Generator**: Geodesic buffer synthesis for dynamic hazard corridors.
- **Hazard Classification**: Random Forest model predicting multi-hazard susceptibility.
- **Vulnerability Estimation**: Ridge regression modeling socioeconomic and accessibility vulnerabilities.

### 4. Data Layer (`backend/database.py` & `database/`)
- **Dual-Mode Repository**: High-fidelity in-memory spatial cache backed by PostGIS spatial queries (GIST indexing).
