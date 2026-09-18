from fastapi import APIRouter, HTTPException, status
from backend.schemas.simulation import ReportBriefRequest, ReportBriefResponse
from backend.database import repo
from backend.services.risk_service import calculate_habitation_score, determine_priority_tier
from backend.schemas.risk import RiskWeights
from backend.llm.explainer import generate_sdma_executive_brief
import logging

logger = logging.getLogger("suraksha.reports")
router = APIRouter(prefix="/reports", tags=["Reports & AI Decision Support"])

@router.post("/generate-brief", response_model=ReportBriefResponse, summary="Generate SDMA executive relocation brief")
async def generate_executive_brief(payload: ReportBriefRequest):
    """
    Generate an authoritative relocation decision brief for SDMAs and District Collectors
    powered by the AI / LLM Explainer service with transparent policy directives.
    """
    logger.info(f"Generating SDMA executive brief: Habitation={payload.habitation_id}, Site={payload.site_id}")
    hab = await repo.get_habitation_by_id(payload.habitation_id)
    if not hab:
        logger.warning(f"Habitation {payload.habitation_id} not found for report generation")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{payload.habitation_id}' not found."
        )

    site = None
    if payload.site_id:
        site = await repo.get_site_by_id(payload.site_id)
        if not site:
            logger.warning(f"Site {payload.site_id} not found for report generation")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Candidate site with ID '{payload.site_id}' not found."
            )

    risk_score = calculate_habitation_score(hab, RiskWeights())
    tier = determine_priority_tier(risk_score)

    brief = await generate_sdma_executive_brief(
        hab=hab,
        site=site,
        risk_score=risk_score,
        tier=tier,
    )
    logger.info(f"Executive brief successfully generated: '{brief.title}' (Tier: {brief.priority_tier})")
    return brief
