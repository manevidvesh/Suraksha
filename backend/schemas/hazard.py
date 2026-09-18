from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DisasterEvent(BaseModel):
    id: Optional[str] = None
    year: int = Field(..., ge=1900, le=2100)
    place: str = Field(..., min_length=2)
    type: str = Field(..., min_length=2)
    severity: str = Field(..., description="High | Medium | Low")
    impact: str = Field(..., min_length=3)
    displaced: Optional[int] = Field(0, ge=0)
    fatalities: Optional[int] = Field(0, ge=0)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: List[Any]

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: Dict[str, Any]

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]

class DynamicRedZoneBufferRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Center latitude of hazard epicenter")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Center longitude of hazard epicenter")
    radius_km: float = Field(..., gt=0, le=100.0, description="Buffer radius in kilometers (1 to 100)")
    hazard_type: str = Field("Landslide", description="Hazard type (e.g. Landslide, Flash Flood, Cloudburst)")
    severity: str = Field("Critical", description="Severity level (e.g. Critical, High)")
    zone_name: str = Field("Simulated Dynamic Hazard Corridor", description="Zone label")

class HazardLayerInfo(BaseModel):
    id: str
    name: str
    agency: str
    layer_type: str  # raster | vector
    updated: str
    description: str
