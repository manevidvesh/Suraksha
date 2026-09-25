from fastapi import APIRouter, HTTPException, Query, Body, status
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.schemas.relocation import (
    CandidateSiteOut,
    SimulationRequest,
    SimulationResponse,
    HabitationMatchingResult,
    SiteCentricMatchingResult,
)
from backend.database import repo
from backend.services.site_service import process_site_out
from backend.services.simulation_service import simulate_relocation
from backend.services.capacity_service import compute_effective_capacity
from backend.decision.site_matching import (
    match_habitation_to_candidate_sites,
    get_site_centric_matches,
    run_prototype_allocation_heuristic,
)
import logging

logger = logging.getLogger("suraksha.relocation")
router = APIRouter(prefix="/relocation", tags=["Relocation"])

class AllocationSimRequest(BaseModel):
    allocations: Dict[str, int] = Field(default_factory=dict, description="Map of site_id -> allocated population")
    field_overrides: Dict[str, str] = Field(default_factory=dict, description="Map of site_id -> 'suitable' | 'unsuitable'")

@router.get("/sites", response_model=List[CandidateSiteOut], summary="List candidate resettlement sites")
async def list_relocation_sites(
    min_capacity: Optional[int] = Query(0, ge=0, description="Minimum effective carrying capacity filter")
):
    """
    List candidate resettlement sites with 5-dimensional infrastructure capacity
    and identified bottlenecks.
    """
    logger.info(f"Fetching relocation sites (filter: min_capacity >= {min_capacity})")
    sites = await repo.get_all_sites()
    processed = [process_site_out(s) for s in sites]

    if min_capacity > 0:
        processed = [s for s in processed if s.eff.value >= min_capacity]

    processed.sort(key=lambda s: s.eff.value, reverse=True)
    logger.info(f"Returning {len(processed)} candidate sites")
    return processed

@router.get("/match/{habitation_id}", response_model=HabitationMatchingResult, summary="Many-to-many candidate site matching for a habitation")
async def get_habitation_candidate_matches(
    habitation_id: str,
    max_distance_km: float = Query(160.0, ge=10.0, le=1000.0, description="Maximum operational transit corridor distance (km)")
):
    """
    Contextual many-to-many candidate site matching for a single vulnerable habitation.
    Evaluates all candidate sites independently against baseline screening constraints,
    tracks remaining effective capacity, ranks eligible alternatives contextually,
    and returns explicit structured states (such as NO_SUITABLE_SITE_IDENTIFIED)
    when no eligible sites remain.
    """
    logger.info(f"Evaluating candidate site matching for Habitation={habitation_id}")
    hab = await repo.get_habitation_by_id(habitation_id)
    if not hab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{habitation_id}' not found"
        )

    sites = await repo.get_all_sites()
    result = match_habitation_to_candidate_sites(
        hab=hab,
        sites=sites,
        simulated_allocations=None,
        field_overrides=None,
        max_distance_km=max_distance_km
    )
    return result

@router.post("/match/{habitation_id}", response_model=HabitationMatchingResult, summary="Many-to-many candidate matching with simulated allocations/overrides")
async def post_habitation_candidate_matches(
    habitation_id: str,
    payload: AllocationSimRequest,
    max_distance_km: float = Query(160.0, ge=10.0, le=1000.0)
):
    """
    Evaluates candidate matching for a habitation under simulated capacity allocations
    or competent-authority field review overrides.
    """
    logger.info(f"Evaluating candidate site matching with allocations for Habitation={habitation_id}")
    hab = await repo.get_habitation_by_id(habitation_id)
    if not hab:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{habitation_id}' not found"
        )

    sites = await repo.get_all_sites()
    result = match_habitation_to_candidate_sites(
        hab=hab,
        sites=sites,
        simulated_allocations=payload.allocations,
        field_overrides=payload.field_overrides,
        max_distance_km=max_distance_km
    )
    return result

@router.get("/site-matches/{site_id}", response_model=SiteCentricMatchingResult, summary="Site-centric matching inspection")
async def get_site_matches(
    site_id: str,
    max_distance_km: float = Query(160.0, ge=10.0, le=1000.0)
):
    """
    Inspects a candidate relocation site from a site-centric perspective, showing
    remaining effective capacity and which habitations are eligible vs ineligible.
    """
    logger.info(f"Fetching site-centric matches for Site={site_id}")
    site = await repo.get_site_by_id(site_id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate Site with ID '{site_id}' not found"
        )

    habs = await repo.get_all_habitations()
    result = get_site_centric_matches(
        site=site,
        habitations=habs,
        simulated_allocations=None,
        field_overrides=None,
        max_distance_km=max_distance_km
    )
    return result

@router.post("/simulate", response_model=SimulationResponse, summary="What-if relocation simulation")
async def run_relocation_simulation(payload: SimulationRequest):
    """
    Simulate what-if outcome when an endangered habitation is relocated
    to a candidate resettlement site.
    """
    logger.info(f"Running relocation simulation: Habitation={payload.habitation_id} -> Site={payload.site_id}")
    hab = await repo.get_habitation_by_id(payload.habitation_id)
    if not hab:
        logger.warning(f"Habitation {payload.habitation_id} not found for simulation")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Origin habitation not found")

    site = await repo.get_site_by_id(payload.site_id)
    if not site:
        logger.warning(f"Site {payload.site_id} not found for simulation")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination site not found")

    simulation_result = simulate_relocation(hab, site)
    logger.info(f"Simulation completed: Hazard reduction={simulation_result.hazard_reduction_pct}%, Capacity exceeded={simulation_result.capacity_exceeded}")
    return simulation_result

@router.post("/optimize", summary="Multi-habitation relocation assignment heuristic")
async def optimize_relocation_assignments(
    payload: Optional[AllocationSimRequest] = Body(None)
):
    """
    Prototype capacity-aware allocation heuristic:
    Evaluates prioritized habitations and candidate sites using Liebig carrying capacities
    and transit distance constraints in the demonstration environment.
    (Demonstration Decision-Support Heuristic — Not a guaranteed global mathematical optimum or statutory decree).
    """
    logger.info("Executing prototype capacity-aware relocation allocation heuristic")
    habs = await repo.get_all_habitations()
    sites = await repo.get_all_sites()

    field_overrides = payload.field_overrides if payload else None
    heuristic_res = run_prototype_allocation_heuristic(
        habitations=habs,
        sites=sites,
        field_overrides=field_overrides
    )

    # Maintain backward compatibility with existing tests
    return {
        "status": "success",
        "heuristic_description": heuristic_res["heuristic_description"],
        "assignments": heuristic_res["site_utilization"],
        "match_list": heuristic_res["assignments"],
        "unassigned_requiring_capacity_expansion": [
            {"id": u["habitation_id"], "name": u["habitation_name"], "population": u["population"]}
            for u in heuristic_res["unassigned_requiring_capacity_expansion_or_insitu"]
        ],
        "detailed_unassigned": heuristic_res["unassigned_requiring_capacity_expansion_or_insitu"],
    }
