from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from backend.database import repo
import logging

logger = logging.getLogger("suraksha.sources")
router = APIRouter(prefix="/sources", tags=["Data Sources"])

class DataSourceOut(BaseModel):
    id: str
    name: str
    covers: str
    updated: str
    confidence: str
    stale: bool
    endpoint_status: str

class DataSourcesListResponse(BaseModel):
    count: int
    items: List[DataSourceOut]

@router.get("", response_model=DataSourcesListResponse, summary="List external GIS data feeds")
async def list_data_sources():
    """
    List all active external data providers (GSI, IMD, MOSDAC, Census, SOI, OSM)
    and their sync health status.
    """
    logger.info("Fetching data sources catalog")
    sources = await repo.get_data_sources()
    items = [DataSourceOut(**s) for s in sources]
    return DataSourcesListResponse(count=len(items), items=items)
