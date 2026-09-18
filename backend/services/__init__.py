from backend.services.hazard_service import (
    haversine_distance_km,
    generate_buffered_polygon,
    point_in_polygon,
)
from backend.services.vulnerability_service import compute_vulnerability_index
from backend.services.risk_service import (
    calculate_habitation_score,
    determine_priority_tier,
    process_habitations_with_scores,
    get_habitation_breakdown,
)
from backend.services.capacity_service import (
    compute_effective_capacity,
    CAP_LABELS,
)
from backend.services.site_service import process_site_out
from backend.services.simulation_service import simulate_relocation
from backend.services.relocation_service import optimize_relocation_allocation

__all__ = [
    "haversine_distance_km",
    "generate_buffered_polygon",
    "point_in_polygon",
    "compute_vulnerability_index",
    "calculate_habitation_score",
    "determine_priority_tier",
    "process_habitations_with_scores",
    "get_habitation_breakdown",
    "compute_effective_capacity",
    "CAP_LABELS",
    "process_site_out",
    "simulate_relocation",
    "optimize_relocation_allocation",
]
