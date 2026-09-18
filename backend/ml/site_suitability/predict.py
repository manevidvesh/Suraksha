from typing import Dict, Any

DEFAULT_WEIGHTS = {
    "slope_stability": 0.25,
    "flood_safety": 0.25,
    "water_availability": 0.20,
    "road_connectivity": 0.15,
    "social_infrastructure": 0.15,
}

def predict_site_suitability_score(site_features: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes AHP-weighted suitability score (0-100) for candidate resettlement site.
    """
    score = 0.0
    for criterion, weight in DEFAULT_WEIGHTS.items():
        val = site_features.get(criterion, 70.0)
        score += val * weight

    final_score = round(score, 1)
    return {
        "suitability_score": final_score,
        "is_suitable": final_score >= 60.0,
        "grade": "Tier-1 Highly Suitable" if final_score >= 80 else "Tier-2 Marginally Suitable" if final_score >= 60 else "Tier-3 Unsuitable",
    }
