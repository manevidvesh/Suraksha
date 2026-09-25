# SURAKSHA Data Lineage & External Feeds

SURAKSHA synthesizes official national and global geospatial datasets into a unified spatial decision plane.

> **General Governance Standard:**  
> "SURAKSHA verifies computational consistency, not real-world ground truth; field, legal, and administrative validation remain the responsibility of the competent authorities."

---

## Authoritative Reference Specifications & Demonstration Datasets

| Agency | Layer Name | Format | Update Frequency / Baseline | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Geological Survey of India (GSI)** | Macro Landslide Susceptibility Grid (1:50,000) | Vector Polygon / Shapefile | Reference Specification (Annual) | Slope stability classification, fracture line mapping |
| **India Meteorological Department (IMD)** | Doppler Weather Radar & AWS Thresholds | NetCDF / Raster GeoTIFF | Reference Specification (Simulated Shocks in Demo) | Cloudburst intensity, precipitation volume, cyclone tracking |
| **MOSDAC (ISRO)** | INSAT-3D/3DR Convective Cloud Products | HDF5 / WMS Raster | Reference Specification (Space Products) | Cloud top brightness temperature, sudden storm detection |
| **Census of India** | Primary Census Abstract & Village Amenities | Delimited CSV / Tabular | Decennial Baseline (2011) | Demographics, household counts, elderly & child ratios |
| **Survey of India (SOI)** | Topographical Sheets & Cadastral Boundaries | GeoPackage / Vector | Reference Specification (1:50,000) | Administrative boundaries, elevation contours, riverbanks |
| **OpenStreetMap (OSM)** | Road Network & Public Infrastructure | OSM PBF / GeoJSON | Reference Geometry (Local Cache) | Transit network routing, emergency accessibility analysis |

---

## Data Ingestion Pipeline

```
[Raw Shapefiles / GeoJSON / CSV]
              |
              v
[Validation Guard: EPSG:4326 Datum Check & Ring Closure]
              |
              v
[Feature Extraction & Spatial Indexing]
              |
              v
[PostGIS / Spatial Cache Ingestion]
```
