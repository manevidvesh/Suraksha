from typing import Dict, Any, List
from backend.services.capacity_service import compute_effective_capacity
from backend.services.hazard_service import haversine_distance_km

def optimize_relocation_allocation(
    habitations: List[Dict[str, Any]],
    sites: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Greedy optimization matching prioritized habitations to nearest viable candidate sites.
    """
    # Sort habitations by priority score descending
    sorted_habs = sorted(
        habitations,
        key=lambda h: h.get("score", 0),
        reverse=True
    )

    site_capacities = {}
    for s in sites:
        eff = compute_effective_capacity(s["cap"])
        site_capacities[s["id"]] = {
            "name": s["name"],
            "remaining": eff.value - s.get("allocated_population", 0),
            "lat": s.get("latitude", 0.0),
            "lon": s.get("longitude", 0.0),
        }

    matches = []
    unallocated = []

    for h in sorted_habs:
        pop = h.get("pop", 0)
        h_lat = h.get("latitude", 0.0)
        h_lon = h.get("longitude", 0.0)

        # Find best candidate site (capable of absorbing population, closest distance)
        candidates = []
        for s_id, s_info in site_capacities.items():
            if s_info["remaining"] >= pop:
                dist = haversine_distance_km(h_lat, h_lon, s_info["lat"], s_info["lon"])
                candidates.append((dist, s_id, s_info["name"]))

        if candidates:
            candidates.sort(key=lambda x: x[0])
            best_dist, best_id, best_name = candidates[0]
            site_capacities[best_id]["remaining"] -= pop
            matches.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "site_id": best_id,
                "site_name": best_name,
                "population": pop,
                "transit_distance_km": best_dist,
            })
        else:
            unallocated.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "population": pop,
                "reason": "No single site has sufficient remaining effective capacity",
            })

    return {
        "matched_count": len(matches),
        "unallocated_count": len(unallocated),
        "matches": matches,
        "unallocated": unallocated,
    }
