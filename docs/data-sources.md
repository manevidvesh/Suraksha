# SURAKSHA Data Lineage & External Feeds

SURAKSHA synthesizes official national and global geospatial datasets into a unified spatial decision plane.

---

## Authoritative Data Sources

| Agency | Layer Name | Format | Update Frequency | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Geological Survey of India (GSI)** | Macro Landslide Susceptibility Grid (1:50,000) | Vector Polygon / Shapefile | Annual | Slope stability classification, fracture line mapping |
| **India Meteorological Department (IMD)** | Doppler Weather Radar & Automatic Weather Stations | NetCDF / Raster GeoTIFF | Real-Time (15m) | Cloudburst intensity, precipitation volume, cyclone tracking |
| **MOSDAC (ISRO)** | INSAT-3D/3DR Convective Cloud Products | HDF5 / WMS Raster | 30 Minutes | Cloud top brightness temperature, sudden storm detection |
| **Census of India** | Primary Census Abstract & Village Amenities | Delimited CSV / Tabular | Decennial | Demographics, household counts, elderly & child ratios |
| **Survey of India (SOI)** | Topographical Sheets & Cadastral Boundaries | GeoPackage / Vector | Biennial | Administrative boundaries, elevation contours, riverbanks |
| **OpenStreetMap (OSM)** | Road Network & Public Infrastructure | OSM PBF / GeoJSON | Continuous | Transit network routing, emergency accessibility analysis |

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
