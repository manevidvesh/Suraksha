from typing import Optional, Dict
from pydantic import BaseModel, Field

class HabitationFactors(BaseModel):
    hazard: float = Field(..., ge=0, le=100)
    exposure: float = Field(..., ge=0, le=100)
    vulnerability: float = Field(..., ge=0, le=100)
    history: float = Field(..., ge=0, le=100)
    access: float = Field(..., ge=0, le=100)

class HabitationModel(BaseModel):
    id: str
    name: str
    region: str
    district: Optional[str] = None
    state: Optional[str] = None
    hazard: str
    pop: int = Field(..., ge=0)
    latitude: float
    longitude: float
    x: Optional[float] = 50
    y: Optional[float] = 50
    f: HabitationFactors
    events: int = 0
    score: Optional[int] = None
    tier: Optional[str] = None
