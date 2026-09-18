from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class MetricComparison(BaseModel):
    metric: str
    Before: float
    After: float

class SimulationRequest(BaseModel):
    habitation_id: str
    site_id: str

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

class ScenarioCreate(BaseModel):
    title: str
    habitation_id: str
    site_id: str
    population: int
    hazard_reduction_pct: int
    notes: Optional[str] = None

class ScenarioOut(BaseModel):
    id: str
    title: str
    habitation_id: str
    site_id: str
    habitation_name: str
    site_name: str
    population: int
    hazard_reduction_pct: int
    created_at: Any

class ReportBriefRequest(BaseModel):
    habitation_id: str
    site_id: Optional[str] = None

class ReportBriefResponse(BaseModel):
    title: str
    generated_at: str
    habitation_name: str
    region: str
    risk_score: int
    priority_tier: str
    primary_hazard: str
    population: int
    executive_summary: str
    risk_driver_analysis: str
    relocation_site_assessment: Optional[str] = None
    policy_recommendations: List[str]
