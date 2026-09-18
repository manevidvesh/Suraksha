from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from backend.schemas.habitations import HabitationOut, HabitationListResponse, HabitationCreate
from backend.schemas.risk import RiskWeights
from backend.database import repo
from backend.services.risk_service import process_habitations_with_scores
import logging

logger = logging.getLogger("suraksha.habitations")
router = APIRouter(prefix="/habitations", tags=["Habitations"])

@router.get("", response_model=HabitationListResponse, summary="List habitations")
async def list_habitations(
    region: Optional[str] = Query(None, description="Filter by region substring"),
    hazard: Optional[str] = Query(None, description="Filter by primary hazard type"),
    tier: Optional[str] = Query(None, description="Filter by priority tier (Immediate, Short-term, Medium-term)"),
):
    """
    Retrieve all monitored habitations along with their computed multi-hazard risk scores,
    priority tiers, and geographic coordinates.
    """
    logger.info(f"Fetching habitations (filters: region={region}, hazard={hazard}, tier={tier})")
    default_weights = RiskWeights()
    raw_habs = await repo.get_all_habitations()
    scored_habs = process_habitations_with_scores(raw_habs, default_weights)

    if region:
        scored_habs = [h for h in scored_habs if region.lower() in h.region.lower()]
    if hazard:
        scored_habs = [h for h in scored_habs if hazard.lower() in h.hazard.lower()]
    if tier:
        scored_habs = [h for h in scored_habs if tier.lower() == h.tier.lower()]

    logger.info(f"Returning {len(scored_habs)} habitations")
    return HabitationListResponse(count=len(scored_habs), items=scored_habs)

@router.get("/{habitation_id}", response_model=HabitationOut, summary="Get habitation by ID")
async def get_habitation(habitation_id: str):
    """
    Retrieve single habitation profile including risk indicators and spatial coordinates.
    """
    logger.info(f"Fetching habitation detail for id: {habitation_id}")
    hab = await repo.get_habitation_by_id(habitation_id)
    if not hab:
        logger.warning(f"Habitation with id '{habitation_id}' not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{habitation_id}' not found.",
        )
    
    scored = process_habitations_with_scores([hab], RiskWeights())[0]
    return scored

@router.post("", response_model=HabitationOut, status_code=status.HTTP_201_CREATED, summary="Register new habitation")
async def create_habitation(payload: HabitationCreate):
    """
    Register a newly surveyed vulnerable habitation into the system.
    Dynamically computes risk score and assigns priority tier.
    """
    logger.info(f"Registering new habitation: {payload.name} in {payload.region}")
    hab_dict = payload.model_dump()
    
    # Derive schematic coordinates if not provided
    if hab_dict.get("schematic_x") is None:
        hab_dict["x"] = 50.0
    else:
        hab_dict["x"] = hab_dict.pop("schematic_x")
        
    if hab_dict.get("schematic_y") is None:
        hab_dict["y"] = 50.0
    else:
        hab_dict["y"] = hab_dict.pop("schematic_y")

    new_hab = await repo.add_habitation(hab_dict)
    scored = process_habitations_with_scores([new_hab], RiskWeights())[0]
    logger.info(f"Habitation registered successfully as {scored.id} with score {scored.score} (Tier: {scored.tier})")
    return scored
