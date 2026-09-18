from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class HabitationFactors(BaseModel):
    hazard: float = Field(..., ge=0, le=100, description="Hazard susceptibility & intensity score (0-100)")
    exposure: float = Field(..., ge=0, le=100, description="Population & asset exposure score (0-100)")
    vulnerability: float = Field(..., ge=0, le=100, description="Social & economic vulnerability score (0-100)")
    history: float = Field(..., ge=0, le=100, description="Past disaster recurrence frequency score (0-100)")
    access: float = Field(..., ge=0, le=100, description="Accessibility deficit score (0-100, higher = poorer access)")

class HabitationBase(BaseModel):
    id: str
    name: str = Field(..., min_length=2, max_length=150)
    region: str = Field(..., min_length=2, max_length=150)
    hazard: str = Field(..., min_length=2, max_length=100)
    pop: int = Field(..., gt=0, description="Population count")
    x: float = Field(..., description="Schematic SVG coordinate X (0-100)")
    y: float = Field(..., description="Schematic SVG coordinate Y (0-100)")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="WGS84 Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="WGS84 Longitude")
    f: HabitationFactors
    events: int = Field(0, ge=0, description="Number of documented past disaster events")
    district: Optional[str] = None
    state: Optional[str] = None

class HabitationOut(HabitationBase):
    score: int = Field(..., ge=0, le=100, description="Computed composite risk score (0-100)")
    tier: str = Field(..., description="Immediate | Short-term | Medium-term")

class HabitationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Habitation or village name")
    region: str = Field(..., min_length=2, max_length=150, description="Geographic region / basin")
    hazard: str = Field(..., min_length=2, max_length=100, description="Primary hazard type (e.g. Landslide, Flood)")
    pop: int = Field(..., gt=0, description="Habitation population (must be > 0)")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="WGS84 Latitude (-90 to 90)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="WGS84 Longitude (-180 to 180)")
    schematic_x: Optional[float] = Field(None, ge=0, le=100, description="Schematic SVG X coordinate (0-100)")
    schematic_y: Optional[float] = Field(None, ge=0, le=100, description="Schematic SVG Y coordinate (0-100)")
    f: HabitationFactors
    events: int = Field(0, ge=0, description="Number of past disaster events")
    district: Optional[str] = None
    state: Optional[str] = None

class HabitationListResponse(BaseModel):
    count: int
    items: List[HabitationOut]
