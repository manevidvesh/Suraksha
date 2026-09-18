from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from backend.database import repo
from backend.services.capacity_service import compute_effective_capacity, CAP_LABELS
from backend.schemas.relocation import SiteEffectiveCapacity

router = APIRouter(prefix="/capacity", tags=["Carrying Capacity"])

@router.get("/sites/{site_id}", response_model=SiteEffectiveCapacity, summary="Get effective carrying capacity of a site")
async def get_site_capacity(site_id: str):
    """
    Computes effective capacity and identifies bottleneck infrastructure component.
    """
    site = await repo.get_site_by_id(site_id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Site with ID '{site_id}' not found.",
        )
    return compute_effective_capacity(site["cap"])
