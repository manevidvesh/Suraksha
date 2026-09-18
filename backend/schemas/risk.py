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
