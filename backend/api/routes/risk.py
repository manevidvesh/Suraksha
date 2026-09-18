from fastapi import APIRouter, HTTPException, Query, status
from backend.schemas.risk import (
    RiskCalculationRequest,
    RiskCalculationResponse,
    TierCounts,
    HabitationRiskBreakdown,
    RiskWeights,
)
from backend.database import repo
from backend.services.risk_service import (
    process_habitations_with_scores,
    get_habitation_breakdown,
)
import logging

logger = logging.getLogger("suraksha.risk")
router = APIRouter(prefix="/risk", tags=["Risk Engine"])

@router.post("/calculate", response_model=RiskCalculationResponse, summary="Dynamic multi-criteria risk recalculation")
async def calculate_risk_scores(payload: RiskCalculationRequest):
    """
    Dynamically recalculate composite risk scores, rankings, and priority tiers
    across all habitations based on customized MCDA factor weights.
    Supports live slider updates from the frontend.
    """
    w = payload.weights
    logger.info(f"Recalculating risk scores with weights: hazard={w.hazard}, exposure={w.exposure}, vulnerability={w.vulnerability}, history={w.history}, access={w.access}")
    
    raw_habs = await repo.get_all_habitations()
    scored = process_habitations_with_scores(raw_habs, payload.weights)

    counts = {"Immediate": 0, "Short-term": 0, "Medium-term": 0}
    total_pop = 0

    for h in scored:
        counts[h.tier] = counts.get(h.tier, 0) + 1
        total_pop += h.pop

    logger.info(f"Risk recalculation complete: {counts['Immediate']} Immediate, {counts['Short-term']} Short-term, {counts['Medium-term']} Medium-term")
    return RiskCalculationResponse(
        weights=payload.weights,
        habitations=scored,
        tier_counts=TierCounts(
            immediate=counts["Immediate"],
            short_term=counts["Short-term"],
            medium_term=counts["Medium-term"],
        ),
        total_population_exposed=total_pop,
    )

@router.get("/habitations/{habitation_id}/breakdown", response_model=HabitationRiskBreakdown, summary="Factor attribution breakdown")
async def get_habitation_risk_breakdown(
    habitation_id: str,
    hazard_w: float = Query(30.0, ge=0, le=100, description="Hazard weight"),
    exposure_w: float = Query(25.0, ge=0, le=100, description="Exposure weight"),
    vulnerability_w: float = Query(20.0, ge=0, le=100, description="Vulnerability weight"),
    history_w: float = Query(15.0, ge=0, le=100, description="History weight"),
    access_w: float = Query(10.0, ge=0, le=100, description="Access weight"),
):
    """
    Get detailed factor contribution and explanatory rationale for a specific habitation.
    """
    logger.info(f"Computing risk breakdown for habitation: {habitation_id}")
    hab = await repo.get_habitation_by_id(habitation_id)
    if not hab:
        logger.warning(f"Habitation {habitation_id} not found for breakdown")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{habitation_id}' not found.",
        )

    weights = RiskWeights(
        hazard=hazard_w,
        exposure=exposure_w,
        vulnerability=vulnerability_w,
        history=history_w,
        access=access_w,
    )
    breakdown = get_habitation_breakdown(hab, weights)
    return breakdown
