from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from backend.schemas.habitations import HabitationOut

class RiskWeights(BaseModel):
    hazard: float = Field(30.0, ge=0, le=100, description="Hazard intensity weight")
    exposure: float = Field(25.0, ge=0, le=100, description="Population exposure weight")
    vulnerability: float = Field(20.0, ge=0, le=100, description="Social vulnerability weight")
    history: float = Field(15.0, ge=0, le=100, description="Disaster history weight")
    access: float = Field(10.0, ge=0, le=100, description="Accessibility deficit weight")

class RiskCalculationRequest(BaseModel):
    weights: RiskWeights

class TierCounts(BaseModel):
    immediate: int
    short_term: int
    medium_term: int

class RiskCalculationResponse(BaseModel):
    weights: RiskWeights
    habitations: List[HabitationOut]
    tier_counts: TierCounts
    total_population_exposed: int

class FactorBreakdownItem(BaseModel):
    factor: str
    value: float
    contribution: float
    raw_value: Optional[str] = Field(None, description="Raw physical or census observation")
    source: Optional[str] = Field(None, description="Source provenance layer")
    vintage: Optional[str] = Field(None, description="Dataset reference period")
    method: Optional[str] = Field(None, description="Processing or normalization method")
    status: Optional[str] = Field("MODEL-DERIVED", description="Evidence status classification")
    indicator_note: Optional[str] = Field(None, description="Contextual note e.g. Slope is one contributing hazard indicator")

class HabitationRiskBreakdown(BaseModel):
    habitation_id: str
    name: str
    region: str
    score: int
    tier: str
    events: int
    factors: List[FactorBreakdownItem]
    primary_driver: str
    secondary_driver: str
    explanation: str
    assessment_id: Optional[str] = Field(None, description="Deterministic assessment identifier e.g. SRK-2026-H1-v1")
    data_version: Optional[str] = Field("2026.09-demo", description="Underlying dataset version")
    evidence_status: Optional[str] = Field("LIMITED EVIDENCE", description="Overall evidence completeness")
    evidence_note: Optional[str] = Field("Risk score is computationally valid for the supplied inputs, but evidence coverage is limited.", description="Evidence disclaimer")
    provenance_chain: Optional[List[str]] = Field(default_factory=list, description="Audit trace of data processing")
