from typing import Dict, Any, List
from backend.services.hazard_service import haversine_distance_km
from backend.decision.capacity import evaluate_site_capacity

def score_site_match(hab: Dict[str, Any], site: Dict[str, Any]) -> float:
    """
    Computes matching score between habitation and candidate site:
    Higher score = better match.
    Factors:
    - Distance penalty
    - Excess capacity bonus
    """
    h_lat, h_lon = hab.get("latitude", 0.0), hab.get("longitude", 0.0)
    s_lat, s_lon = site.get("latitude", 0.0), site.get("longitude", 0.0)
    dist = haversine_distance_km(h_lat, h_lon, s_lat, s_lon)

    can_absorb, _, diff = evaluate_site_capacity(site.get("cap", {}), hab.get("pop", 0))
    if not can_absorb:
        return -1.0  # Infeasible match

    # Distance factor (100km max normalized)
    norm_dist = max(0.0, 100.0 - dist)
    cap_bonus = min(50.0, diff / 10.0)
    return norm_dist + cap_bonus
