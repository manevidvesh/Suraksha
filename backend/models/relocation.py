from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class RelocationAllocation(BaseModel):
    habitation_id: str
    habitation_name: str
    site_id: str
    site_name: str
    population: int
    transit_distance_km: float
    effective_capacity: int
    bottleneck_resource: str
    is_capacity_exceeded: bool

class RelocationPlanModel(BaseModel):
    id: str
    name: str
    allocations: List[RelocationAllocation]
    total_population_relocated: int
    unallocated_habitations: List[str] = []
    created_at: str
