from typing import Dict, Any
from backend.services.hazard_service import generate_buffered_polygon

def compute_landslide_susceptibility_buffer(
    center_lat: float,
    center_lon: float,
    slope_angle_deg: float,
    rainfall_intensity_mm: float
) -> Dict[str, Any]:
    """
    Computes empirical landslide trigger zone buffer based on slope and rainfall.
    """
    # Base radius scales with slope steepness and precipitation
    slope_multiplier = max(1.0, slope_angle_deg / 25.0)
    rain_multiplier = max(1.0, rainfall_intensity_mm / 150.0)
    radius_km = round(2.0 * slope_multiplier * rain_multiplier, 2)
    radius_km = min(25.0, radius_km)

    coords = generate_buffered_polygon(center_lat, center_lon, radius_km)
    severity = "Critical" if slope_angle_deg > 35 and rainfall_intensity_mm > 200 else "High"

    return {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [coords],
        },
        "properties": {
            "hazard_type": "Landslide",
            "slope_deg": slope_angle_deg,
            "rainfall_mm": rainfall_intensity_mm,
            "buffer_radius_km": radius_km,
            "severity": severity,
        },
    }
