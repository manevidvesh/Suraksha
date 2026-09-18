from typing import Dict, Any, List
from backend.schemas.simulation import SimulationResponse, MetricComparison
from backend.services.capacity_service import compute_effective_capacity, CAP_LABELS
from backend.services.hazard_service import haversine_distance_km

def simulate_relocation(hab: Dict[str, Any], site: Dict[str, Any]) -> SimulationResponse:
    eff = compute_effective_capacity(site["cap"])
    pop = hab.get("pop", 0)
    f = hab.get("f", {})
    
    # Calculate GIS distance if lat/long are present
    dist_km = site.get("distanceKm", 15.0)
    if (hab.get("latitude") and hab.get("longitude") and
        site.get("latitude") and site.get("longitude")):
        dist_km = haversine_distance_km(
            hab["latitude"], hab["longitude"],
            site["latitude"], site["longitude"]
        )

    # Before metrics
    before_hazard = float(f.get("hazard", 70))
    before_exposure = float(f.get("exposure", 70))
    before_access = float(100 - f.get("access", 50))  # accessibility to services

    # After metrics
    after_hazard = float(max(8, round(before_hazard * 0.18)))
    after_exposure = float(max(10, round(before_exposure * 0.35)))
    after_access = float(max(60, min(95, 100 - round(dist_km / 2.5))))

    hazard_reduction_pct = int(round(100 - (after_hazard / max(1, before_hazard)) * 100))
    exposure_reduction_pct = int(round(100 - (after_exposure / max(1, before_exposure)) * 100))
    access_improvement_pct = int(round(after_access - before_access))

    capacity_exceeded = pop > eff.value

    radar_data = [
        MetricComparison(metric="Hazard exposure", Before=before_hazard, After=after_hazard),
        MetricComparison(metric="Population exposure", Before=before_exposure, After=after_exposure),
        MetricComparison(metric="Service access", Before=before_access, After=after_access),
    ]

    bottleneck_label = CAP_LABELS.get(eff.bottleneck, eff.bottleneck)
    if capacity_exceeded:
        summary_msg = (
            f"Relocating {pop} residents exceeds {site['name']}'s effective capacity of {eff.value} "
            f"(bottleneck: {bottleneck_label.lower()}). Phased relocation or expanding {bottleneck_label.lower()} required."
        )
    else:
        summary_msg = (
            f"Relocation viable: {site['name']} can accommodate all {pop} residents with "
            f"{eff.value - pop} spare capacity before reaching {bottleneck_label.lower()} bottleneck."
        )

    return SimulationResponse(
        habitation_id=hab["id"],
        habitation_name=hab["name"],
        site_id=site["id"],
        site_name=site["name"],
        population=pop,
        effective_capacity=eff.value,
        bottleneck=eff.bottleneck,
        travel_distance_km=dist_km,
        hazard_reduction_pct=hazard_reduction_pct,
        exposure_reduction_pct=exposure_reduction_pct,
        access_improvement_pct=access_improvement_pct,
        capacity_exceeded=capacity_exceeded,
        radar_data=radar_data,
        summary_message=summary_msg,
    )
