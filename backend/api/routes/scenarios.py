from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.schemas.simulation import ScenarioCreate, ScenarioOut
from backend.database import repo
import logging

logger = logging.getLogger("suraksha.scenarios")
router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

@router.post("", response_model=ScenarioOut, status_code=status.HTTP_201_CREATED, summary="Save relocation scenario")
async def save_scenario(payload: ScenarioCreate):
    hab = await repo.get_habitation_by_id(payload.habitation_id)
    if not hab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habitation not found")

    site = await repo.get_site_by_id(payload.site_id)
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found")

    data = payload.model_dump()
    data["habitation_name"] = hab["name"]
    data["site_name"] = site["name"]
    saved = await repo.save_scenario(data)
    return ScenarioOut(**saved)

@router.get("", response_model=List[ScenarioOut], summary="List saved relocation scenarios")
async def list_scenarios():
    scenarios = await repo.get_scenarios()
    return [ScenarioOut(**s) for s in scenarios]
