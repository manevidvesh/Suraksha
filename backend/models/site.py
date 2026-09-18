from typing import Optional, Dict
from pydantic import BaseModel, Field

class SiteCapacity(BaseModel):
    land: int = Field(..., ge=0)
    water: int = Field(..., ge=0)
    sanitation: int = Field(..., ge=0)
    healthcare: int = Field(..., ge=0)
    schools: int = Field(..., ge=0)

class SiteModel(BaseModel):
    id: str
    name: str
    region: Optional[str] = None
    latitude: float
    longitude: float
    x: Optional[float] = 50
    y: Optional[float] = 50
    distanceKm: float = 0.0
    cap: SiteCapacity
    allocated_population: int = 0
