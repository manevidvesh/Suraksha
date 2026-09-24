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
    site_status: str = Field("CANDIDATE SITE — EXTERNAL VALIDATION REQUIRED", description="Hierarchical site status")
    screening_matrix: Optional[Dict[str, str]] = Field(default_factory=dict, description="12-dimension candidate site screening matrix with PASS/FAIL/UNKNOWN/NOT ASSESSED")
    why_this_site: List[str] = Field(default_factory=list, description="Computational reasons in favor of site")
    why_not_this_site: List[str] = Field(default_factory=list, description="Computational limitations and unverified factors")
    primary_blockers: List[str] = Field(default_factory=list, description="Primary capacity or access blockers")
    land_administrative_screening: Optional[Dict[str, str]] = Field(default_factory=dict, description="Honest unverified land status")
    livelihood_continuity: Optional[Dict[str, str]] = Field(default_factory=dict, description="Unassessed livelihood continuity structure")

from backend.schemas.simulation import MetricComparison, SimulationRequest, SimulationResponse
