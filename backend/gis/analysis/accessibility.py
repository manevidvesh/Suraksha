from typing import Dict, Any, List
from backend.services.hazard_service import haversine_distance_km

def compute_transit_distance_matrix(
    habitations: List[Dict[str, Any]],
    sites: List[Dict[str, Any]]
) -> Dict[str, Dict[str, float]]:
    """
    Computes pairwise Haversine distance matrix between all habitations and candidate sites.
    """
    matrix: Dict[str, Dict[str, float]] = {}

    for h in habitations:
        h_id = h["id"]
        matrix[h_id] = {}
        for s in sites:
            s_id = s["id"]
            dist = haversine_distance_km(
                h.get("latitude", 0.0), h.get("longitude", 0.0),
                s.get("latitude", 0.0), s.get("longitude", 0.0)
            )
            matrix[h_id][s_id] = dist

    return matrix
