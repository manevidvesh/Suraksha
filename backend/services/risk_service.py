from typing import Dict, Any, List, Tuple
from backend.schemas.risk import RiskWeights, HabitationRiskBreakdown, FactorBreakdownItem
from backend.schemas.habitations import HabitationOut

def calculate_habitation_score(hab: Dict[str, Any], weights: RiskWeights) -> int:
    """
    Compute composite risk score (0-100) using MCDA weights:
    Score = sum(f_i * w_i) / sum(w_i)
    """
    f = hab.get("f", {})
    total_weights = (
        weights.hazard +
        weights.exposure +
        weights.vulnerability +
        weights.history +
        weights.access
    )
    if total_weights <= 0:
        return 0

    raw = (
        f.get("hazard", 0) * weights.hazard +
        f.get("exposure", 0) * weights.exposure +
        f.get("vulnerability", 0) * weights.vulnerability +
        f.get("history", 0) * weights.history +
        f.get("access", 0) * weights.access
    )
    return int(round(raw / total_weights))

def determine_priority_tier(score: int) -> str:
    if score >= 70:
        return "Immediate"
    elif score >= 45:
        return "Short-term"
    return "Medium-term"

def process_habitations_with_scores(habitations: List[Dict[str, Any]], weights: RiskWeights) -> List[HabitationOut]:
    """
    Compute scores and tiers for an entire list of habitations.
    """
    results: List[HabitationOut] = []
    for h in habitations:
        score = calculate_habitation_score(h, weights)
        tier = determine_priority_tier(score)
        
        hab_dict = dict(h)
        hab_dict["score"] = score
        hab_dict["tier"] = tier
        results.append(HabitationOut(**hab_dict))
    
    # Sort descending by score
    results.sort(key=lambda x: x.score, reverse=True)
    return results

def get_habitation_breakdown(hab: Dict[str, Any], weights: RiskWeights) -> HabitationRiskBreakdown:
    f = hab.get("f", {})
    score = calculate_habitation_score(hab, weights)
    tier = determine_priority_tier(score)

    total_weights = (
        weights.hazard + weights.exposure + weights.vulnerability +
        weights.history + weights.access
    )
    
    factors: List[FactorBreakdownItem] = []
    sorted_factors: List[Tuple[str, float]] = []

    for k in ["hazard", "exposure", "vulnerability", "history", "access"]:
        val = float(f.get(k, 0))
        w = getattr(weights, k, 1.0)
        contrib = round((val * w) / total_weights, 1) if total_weights > 0 else 0
        factors.append(FactorBreakdownItem(factor=k, value=val, contribution=contrib))
        sorted_factors.append((k, val))

    sorted_factors.sort(key=lambda x: x[1], reverse=True)
    primary = sorted_factors[0][0]
    secondary = sorted_factors[1][0]

    events = hab.get("events", 0)
    history_comment = (
        f"{events} recorded historical disaster events reinforce the recurrent risk pattern."
        if events > 2 else "Limited disaster event history keeps this risk score partly forward-looking."
    )
    
    explanation = (
        f"{hab['name']} carries an {tier.lower()} priority rating (score: {score}/100), "
        f"driven primarily by elevated {primary} ({f.get(primary)}/100) and {secondary} ({f.get(secondary)}/100). "
        f"{history_comment}"
    )

    return HabitationRiskBreakdown(
        habitation_id=hab["id"],
        name=hab["name"],
        region=hab["region"],
        score=score,
        tier=tier,
        events=events,
        factors=factors,
        primary_driver=primary,
        secondary_driver=secondary,
        explanation=explanation,
    )
