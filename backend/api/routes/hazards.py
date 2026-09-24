from fastapi import APIRouter, Query, status
from typing import List, Optional
from backend.schemas.hazard import (
    GeoJSONFeatureCollection,
    GeoJSONFeature,
    DisasterEvent,
    HazardLayerInfo,
    DynamicRedZoneBufferRequest,
)
from backend.database import repo
from backend.services.hazard_service import generate_buffered_polygon
import logging

logger = logging.getLogger("suraksha.hazards")
router = APIRouter(prefix="/hazards", tags=["Hazards & Red Zones"])

@router.get("/red-zones", response_model=GeoJSONFeatureCollection, summary="Get dynamic multi-hazard Red Zones")
async def get_hazard_red_zones():
    """
    Returns dynamically delineated multi-hazard Red Zones as standard GeoJSON FeatureCollection
    for MapLibre GL JS vector polygon overlay rendering.
    """
    logger.info("Fetching multi-hazard Red Zone polygons from PostGIS/spatial cache")
    geojson = await repo.get_red_zones_geojson()
    logger.info(f"Retrieved {len(geojson.get('features', []))} Red Zone polygons")
    return geojson

@router.post("/red-zones/simulate-buffer", response_model=GeoJSONFeature, status_code=status.HTTP_201_CREATED, summary="Simulate dynamic hazard expansion")
async def simulate_dynamic_red_zone_buffer(payload: DynamicRedZoneBufferRequest):
    """
    Dynamically generates and adds an expanded multi-hazard Red Zone buffer polygon around
    an epicenter (e.g. following an active cloudburst or slope failure).
    """
    logger.info(f"Simulating dynamic hazard buffer: {payload.radius_km} km around ({payload.latitude}, {payload.longitude})")
    properties = {
        "id": f"RZ-DYN-{int(payload.latitude * 100)}",
        "zone_code": f"RED-DYN-{payload.hazard_type[:3].upper()}",
        "name": payload.zone_name,
        "hazard_type": payload.hazard_type,
        "severity": payload.severity,
        "description": f"Dynamic simulation buffer: {payload.radius_km} km radius around epicenter.",
        "source_agency": "SURAKSHA Dynamic Early Warning Simulation",
        "radius_km": payload.radius_km,
    }
    
    ring = generate_buffered_polygon(payload.latitude, payload.longitude, payload.radius_km)
    buffer_feature = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [ring],
        },
        "properties": properties,
    }
    
    # Add to in-memory GeoJSON collection
    repo.red_zones.append(buffer_feature)
    logger.info("Dynamic Red Zone successfully generated and added to active layers")
    return buffer_feature

@router.get("/history", response_model=List[DisasterEvent], summary="Historical disaster layer")
async def get_disaster_history(
    severity: Optional[str] = Query(None, description="Filter by severity: High, Medium, Low"),
    year: Optional[int] = Query(None, description="Filter by event year"),
):
    """
    Retrieve chronological disaster history layer with optional severity/year filtering.
    """
    logger.info(f"Fetching disaster history (filters: severity={severity}, year={year})")
    events = await repo.get_disaster_events()
    
    if severity:
        events = [e for e in events if e.get("severity", "").lower() == severity.lower()]
    if year:
        events = [e for e in events if e.get("year") == year]
        
    logger.info(f"Returning {len(events)} disaster events")
    return [DisasterEvent(**e) for e in events]

@router.get("/layers", response_model=List[HazardLayerInfo], summary="Catalog of reference GIS hazard layers")
async def list_hazard_layers():
    """
    Catalog of reference GIS hazard layer specifications (GSI Landslide, IMD Precipitation, MOSDAC Cloudburst, Survey of India).
    """
    logger.info("Fetching available GIS hazard layers metadata")
    return [
        HazardLayerInfo(
            id="gsi-landslide-2024",
            name="GSI Macro Landslide Susceptibility Grid (1:50k Reference)",
            agency="Geological Survey of India (Reference Specification)",
            layer_type="vector",
            updated="March 2024 Reference",
            description="Slope stability, geotechnical fracture lines, and debris flow susceptibility.",
        ),
        HazardLayerInfo(
            id="imd-rainfall-radar",
            name="IMD Doppler Weather Radar Precipitation (Specification)",
            agency="India Meteorological Department (Reference Standards)",
            layer_type="raster",
            updated="Demonstration Standard",
            description="Demonstration rainfall intensity criteria based on IMD convective precipitation specifications.",
        ),
        HazardLayerInfo(
            id="mosdac-satellite-cloud",
            name="MOSDAC Convective Cloud Top Height",
            agency="ISRO / MOSDAC",
            layer_type="raster",
            updated="January 2025",
            description="Insat-3D thermal infrared storm tracking for sudden cloudburst prediction.",
        ),
        HazardLayerInfo(
            id="soi-cadastral-50k",
            name="Survey of India Cadastral & Topo Boundaries",
            agency="Survey of India",
            layer_type="vector",
            updated="August 2023",
            description="Elevation contours, drainage corridors, and administrative ward boundaries.",
        ),
    ]
