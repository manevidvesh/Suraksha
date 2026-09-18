from typing import List, Dict, Any

def estimate_exposed_population(
    habitations: List[Dict[str, Any]],
    hazard_zones: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Estimates total population residing within designated hazard zones.
    """
    total_pop = 0
    exposed_pop = 0
    exposed_habs = []

    for h in habitations:
        pop = h.get("pop", 0)
        total_pop += pop
        # If habitation has hazard factor >= 60 or tier == "Immediate"
        f = h.get("f", {})
        if f.get("hazard", 0) >= 60 or f.get("exposure", 0) >= 60:
            exposed_pop += pop
            exposed_habs.append(h["id"])

    pct = round((exposed_pop / max(1, total_pop)) * 100, 1)
    return {
        "total_population": total_pop,
        "exposed_population": exposed_pop,
        "exposure_percentage": pct,
        "exposed_habitation_ids": exposed_habs,
    }
