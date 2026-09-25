from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

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

class FourResponsePathways(BaseModel):
    in_situ_mitigation: Dict[str, Any] = Field(default_factory=dict)
    prepare_and_evacuate: Dict[str, Any] = Field(default_factory=dict)
    temporary_shelter: Dict[str, Any] = Field(default_factory=dict)
    permanent_relocation: Dict[str, Any] = Field(default_factory=dict)

class HabitationSiteCandidateMatch(BaseModel):
    site_id: str
    site_name: str
    region: Optional[str] = None
    distance_km: Optional[float] = None
    effective_capacity: int
    allocated_capacity: int = 0
    remaining_capacity: int
    population_demand: int
    capacity_gap: int = 0
    bottleneck: str
    screening_status: str
    is_eligible: bool
    rank: Optional[int] = None
    match_score: Optional[float] = None
    exclusion_reasons: List[str] = Field(default_factory=list)
    screening_matrix: Dict[str, str] = Field(default_factory=dict)
    key_constraints: List[str] = Field(default_factory=list)
    why_this: List[str] = Field(default_factory=list)
    why_not: List[str] = Field(default_factory=list)
    evidence_status: str = "EXTERNAL VALIDATION REQUIRED"
    field_review_override: Optional[str] = None

class HabitationMatchingResult(BaseModel):
    habitation_id: str
    habitation_name: str
    region: Optional[str] = None
    population: int
    risk_score: int
    priority_tier: str
    primary_hazard: Optional[str] = None
    status: str
    message: str
    eligible_sites: List[HabitationSiteCandidateMatch] = Field(default_factory=list)
    excluded_sites: List[HabitationSiteCandidateMatch] = Field(default_factory=list)
    all_evaluated_candidates: List[HabitationSiteCandidateMatch] = Field(default_factory=list)
    unknown_evidence: List[str] = Field(default_factory=list)
    capacity_gaps: List[Dict[str, Any]] = Field(default_factory=list)
    required_validation: List[str] = Field(default_factory=list)
    candidate_measures: List[str] = Field(default_factory=list)
    additional_site_identification_required: bool = False
    four_pathways: Optional[FourResponsePathways] = None

class SiteCentricMatchingResult(BaseModel):
    site_id: str
    site_name: str
    region: Optional[str] = None
    effective_capacity: int
    allocated_capacity: int = 0
    remaining_capacity: int
    bottleneck: str
    eligible_habitations: List[Dict[str, Any]] = Field(default_factory=list)
    ineligible_habitations: List[Dict[str, Any]] = Field(default_factory=list)

from backend.schemas.simulation import MetricComparison, SimulationRequest, SimulationResponse

