from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.schemas.simulation import (
    SimulationRequest,
    SimulationResponse,
    ScenarioCreate,
    ScenarioOut,
)
from backend.database import repo
from backend.services.simulation_service import simulate_relocation
import logging

logger = logging.getLogger("suraksha.simulation")
router = APIRouter(prefix="/simulation", tags=["Simulation"])

@router.post("/run", response_model=SimulationResponse, summary="Run relocation scenario simulation")
async def run_simulation(payload: SimulationRequest):
    """
    Simulate what-if outcome when an endangered habitation is relocated
    to a candidate resettlement site.
    """
    hab = await repo.get_habitation_by_id(payload.habitation_id)
    if not hab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Origin habitation not found")

    site = await repo.get_site_by_id(payload.site_id)
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination site not found")

    return simulate_relocation(hab, site)

@router.post("/scenarios", response_model=ScenarioOut, status_code=status.HTTP_201_CREATED, summary="Save what-if scenario")
async def save_scenario(payload: ScenarioCreate):
    """Save a simulated relocation scenario."""
    hab = await repo.get_habitation_by_id(payload.habitation_id)
    if not hab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habitation not found")

    site = await repo.get_site_by_id(payload.site_id)
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")

    scenario_data = payload.model_dump()
    scenario_data["habitation_name"] = hab["name"]
    scenario_data["site_name"] = site["name"]

    saved = await repo.save_scenario(scenario_data)
    return ScenarioOut(**saved)

@router.get("/scenarios", response_model=List[ScenarioOut], summary="List saved scenarios")
async def list_scenarios():
    """Retrieve list of all saved what-if relocation scenarios."""
    scenarios = await repo.get_scenarios()
    return [ScenarioOut(**s) for s in scenarios]
