from typing import Dict, Any, List
from backend.services.hazard_service import generate_buffered_polygon

def generate_flood_inundation_buffer(
    center_lat: float,
    center_lon: float,
    return_period_years: int = 50,
    base_radius_km: float = 3.0
) -> Dict[str, Any]:
    """Generates a flood risk buffer polygon scaled by return period."""
    scale = 1.0 + (return_period_years / 100.0) * 0.5
    radius = base_radius_km * scale
    coords = generate_buffered_polygon(center_lat, center_lon, radius)

    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [coords],
        },
        "properties": {
            "hazard_type": "Flood",
            "return_period_years": return_period_years,
            "buffer_radius_km": round(radius, 2),
            "severity": "High" if return_period_years >= 50 else "Medium",
        },
    }
