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

class FinancialOutlayBreakdown(BaseModel):
    households_count: int
    total_crores: float
    pmay_housing_crores: float
    land_development_crores: float
    infrastructure_crores: float
    ndrf_central_share_crores: float
    sdrf_state_share_crores: float

class DepartmentActionTask(BaseModel):
    department: str
    designation: str
    mandate: str
    timeline: str

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
    financial_outlay: Optional[FinancialOutlayBreakdown] = None
    department_matrix: Optional[List[DepartmentActionTask]] = None

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
    memorandum_number: Optional[str] = None
    statutory_authority: Optional[str] = None
    financial_outlay: Optional[FinancialOutlayBreakdown] = None
    department_action_matrix: Optional[List[DepartmentActionTask]] = None
