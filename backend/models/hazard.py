from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class HazardZoneModel(BaseModel):
    id: str
    zone_code: str
    name: str
    hazard_type: str
    severity: str
    description: Optional[str] = None
    source_agency: Optional[str] = None
    slope_angle_deg: Optional[float] = None
    rainfall_intensity_mm: Optional[float] = None
    geometry: Dict[str, Any]

class DisasterEventModel(BaseModel):
    id: str
    year: int
    place: str
    type: str
    severity: str
    impact: str
    displaced: int = 0
    fatalities: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
