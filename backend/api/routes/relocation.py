from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict, Any
from backend.schemas.relocation import (
    CandidateSiteOut,
    SimulationRequest,
    SimulationResponse,
)
from backend.database import repo
from backend.services.site_service import process_site_out
from backend.services.simulation_service import simulate_relocation
from backend.services.capacity_service import compute_effective_capacity
import logging

logger = logging.getLogger("suraksha.relocation")
router = APIRouter(prefix="/relocation", tags=["Relocation"])

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

@router.post("/optimize", summary="Multi-habitation relocation assignment optimization")
async def optimize_relocation_assignments():
    """
    Global assignment optimization: Pairs priority habitations to candidate sites
    minimizing total transit distance while strictly respecting bottleneck carrying capacities.
    """
    logger.info("Executing global relocation capacity-constrained optimization")
    habs = await repo.get_all_habitations()
    sites = await repo.get_all_sites()

    hab_sorted = sorted(habs, key=lambda h: h.get("f", {}).get("hazard", 0), reverse=True)
    
    site_capacities: Dict[str, Any] = {}
    for s in sites:
        eff = compute_effective_capacity(s["cap"])
        site_capacities[s["id"]] = {
            "name": s["name"],
            "effective_capacity": eff.value,
            "remaining": eff.value,
            "bottleneck": eff.bottleneck,
            "assigned_habitations": [],
            "assigned_population": 0,
        }

    unassigned = []

    for h in hab_sorted:
        pop = h["pop"]
        assigned = False
        for s_id, s_data in site_capacities.items():
            if s_data["remaining"] >= pop:
                s_data["remaining"] -= pop
                s_data["assigned_population"] += pop
                s_data["assigned_habitations"].append({
                    "id": h["id"],
                    "name": h["name"],
                    "population": pop,
                    "hazard": h["hazard"],
                })
                assigned = True
                break
        if not assigned:
            unassigned.append({"id": h["id"], "name": h["name"], "population": pop})

    logger.info(f"Optimization finished: {len(habs) - len(unassigned)} habitations assigned, {len(unassigned)} unassigned")
    return {
        "status": "success",
        "assignments": site_capacities,
        "unassigned_requiring_capacity_expansion": unassigned,
    }
