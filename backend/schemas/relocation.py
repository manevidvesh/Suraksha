from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class SiteCapacity(BaseModel):
    land: int = Field(..., description="Max additional residents supportable by developable land")
    water: int = Field(..., description="Max residents supportable by potable water infrastructure")
    sanitation: int = Field(..., description="Max residents supportable by sewage & waste systems")
    healthcare: int = Field(..., description="Max residents supportable by primary health centers")
    schools: int = Field(..., description="Max residents supportable by local schools")

class SiteEffectiveCapacity(BaseModel):
    value: int = Field(..., description="Minimum capacity across all 5 infrastructure dimensions")
    bottleneck: str = Field(..., description="The constrained service dimension (e.g. healthcare, schools)")

class CandidateSiteOut(BaseModel):
    id: str
    name: str
    region: Optional[str] = None
    x: float = Field(..., description="Schematic SVG coordinate X")
    y: float = Field(..., description="Schematic SVG coordinate Y")
    latitude: float
    longitude: float
    distanceKm: float
    cap: SiteCapacity
    eff: SiteEffectiveCapacity
    allocated_population: int = 0
    available_capacity: int = 0

class SimulationRequest(BaseModel):
    habitation_id: str
    site_id: str

class MetricComparison(BaseModel):
    metric: str
    Before: float
    After: float

class SimulationResponse(BaseModel):
    habitation_id: str
    habitation_name: str
    site_id: str
    site_name: str
    population: int
    effective_capacity: int
    bottleneck: str
    travel_distance_km: float
    hazard_reduction_pct: int
    exposure_reduction_pct: int
    access_improvement_pct: int
    capacity_exceeded: bool
    radar_data: List[MetricComparison]
    summary_message: str
    llm_rationale: Optional[str] = None
