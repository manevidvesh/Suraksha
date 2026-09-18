from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from backend.schemas.relocation import CandidateSiteOut
from backend.database import repo
from backend.services.site_service import process_site_out
import logging

logger = logging.getLogger("suraksha.sites")
router = APIRouter(prefix="/sites", tags=["Resettlement Sites"])

@router.get("", response_model=List[CandidateSiteOut], summary="List candidate resettlement sites")
async def list_sites(
    min_capacity: Optional[int] = Query(0, ge=0, description="Minimum effective carrying capacity filter")
):
    """
    List candidate resettlement sites with 5-dimensional infrastructure capacity
    and identified bottlenecks.
    """
    logger.info(f"Fetching resettlement sites (min_capacity >= {min_capacity})")
    sites = await repo.get_all_sites()
    processed = [process_site_out(s) for s in sites]

    if min_capacity > 0:
        processed = [s for s in processed if s.eff.value >= min_capacity]

    processed.sort(key=lambda s: s.eff.value, reverse=True)
    return processed

@router.get("/{site_id}", response_model=CandidateSiteOut, summary="Get site details by ID")
async def get_site(site_id: str):
    """Retrieve detailed site profile by site ID."""
    site = await repo.get_site_by_id(site_id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Site with ID '{site_id}' not found.",
        )
    return process_site_out(site)
