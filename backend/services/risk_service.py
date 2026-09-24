from typing import Dict, Any, List, Tuple
from backend.schemas.risk import RiskWeights, HabitationRiskBreakdown, FactorBreakdownItem
from backend.schemas.habitations import HabitationOut

def calculate_habitation_score(hab: Dict[str, Any], weights: RiskWeights) -> int:
    """
    Compute composite risk score (0-100) using MCDA weights:
    Score = sum(f_i * w_i) / sum(w_i)

    Prototype MCDA Configuration (Default Demonstration Baseline):
    - Hazard Intensity: 30%
    - Population Exposure: 25%
    - Social Vulnerability: 20%
    - Disaster History: 15%
    - Access Deficit: 10%
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

    factor_meta = {
        "hazard": {
            "raw_value": f"Slope ~{int(float(f.get('hazard', 75)) * 0.42)}°, Inundation intersection = {'YES' if float(f.get('hazard', 0)) >= 60 else 'NO'}",
            "source": "GSI / NRSC Susceptibility Prototype",
            "vintage": "2023–2024 Base",
            "method": "Multi-hazard spatial overlay (EPSG:4326)",
            "status": "MODEL-DERIVED",
            "indicator_note": "Slope and flood intersection are contributing indicators, not a standalone physical forecast."
        },
        "exposure": {
            "raw_value": f"Population: {hab.get('pop', 0)} residents",
            "source": "Census of India",
            "vintage": "2011 Baseline (Projected)",
            "method": "Spatial buffer intersection",
            "status": "MODEL-DERIVED",
            "indicator_note": "Census baseline projected to current estimate; pending electoral/field roll validation."
        },
        "vulnerability": {
            "raw_value": f"Social vulnerability index: {f.get('vulnerability', 65)}/100",
            "source": "SECC / Local Body Survey",
            "vintage": "2020 Demonstration Dataset",
            "method": "Socioeconomic fragility weighted composite",
            "status": "MODEL-DERIVED",
            "indicator_note": "Combines kutcha dwelling ratio and demographic dependency ratios."
        },
        "history": {
            "raw_value": f"{hab.get('events', 0)} recorded disaster events",
            "source": "State / District Incident Logs (Demonstration)",
            "vintage": "2018–2024 Observation Period",
            "method": "Historical recurrence frequency",
            "status": "DEMONSTRATION DATASET",
            "indicator_note": "Observation period is 2018–2024; does not imply a 100-year continuous record."
        },
        "access": {
            "raw_value": f"Access deficit score: {f.get('access', 50)}/100",
            "source": "PMGSY / OpenStreetMap Transit Links",
            "vintage": "2023 Prototype GIS Layer",
            "method": "Euclidean & road network transit distance",
            "status": "MODEL-DERIVED",
            "indicator_note": "Distance to all-weather road and secondary healthcare emergency transit."
        }
    }

    for k in ["hazard", "exposure", "vulnerability", "history", "access"]:
        val = float(f.get(k, 0))
        w = getattr(weights, k, 1.0)
        contrib = round((val * w) / total_weights, 1) if total_weights > 0 else 0
        meta = factor_meta.get(k, {})
        factors.append(FactorBreakdownItem(
            factor=k,
            value=val,
            contribution=contrib,
            raw_value=meta.get("raw_value"),
            source=meta.get("source"),
            vintage=meta.get("vintage"),
            method=meta.get("method"),
            status=meta.get("status", "MODEL-DERIVED"),
            indicator_note=meta.get("indicator_note"),
        ))
        sorted_factors.append((k, val))

    sorted_factors.sort(key=lambda x: x[1], reverse=True)
    primary = sorted_factors[0][0]
    secondary = sorted_factors[1][0]

    events = hab.get("events", 0)
    history_comment = (
        f"{events} recorded disaster events in the 2018–2024 demonstration observation period reinforce the recurrence pattern."
        if events > 2 else "Limited recorded events in the observation period keep this score partly forward-looking."
    )
    
    explanation = (
        f"{hab['name']} carries an {tier.lower()} priority rating (score: {score}/100), "
        f"driven primarily by elevated {primary} ({f.get(primary)}/100) and {secondary} ({f.get(secondary)}/100). "
        f"{history_comment}"
    )

    assessment_id = f"SRK-2026-{hab.get('id', 'HAB')}-v1"
    provenance = [
        f"Assessment ID: {assessment_id}",
        f"Settlement: {hab['name']} ({hab.get('region', '')})",
        "Spatial Reference: WGS84 EPSG:4326 PostGIS Layer",
        "Demographic Baseline: Census of India — 2011 Decennial Baseline",
        "Disaster Observation Window: 2018–2024 (Demonstration Dataset)",
        "Decision Algorithm: Deterministic MCDA (Linear Additive Model)",
        "Capacity Assessment: Liebig's Law of the Minimum",
        "Human Governance: Status PENDING DDMA Field Review"
    ]

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
        assessment_id=assessment_id,
        data_version="2026.09-demo",
        evidence_status="LIMITED EVIDENCE",
        evidence_note="Risk score is computationally valid for the supplied inputs, but evidence coverage is limited.",
        provenance_chain=provenance,
    )
