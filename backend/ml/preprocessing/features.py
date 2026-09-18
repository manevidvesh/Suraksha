from typing import List, Dict, Any
import numpy as np

def extract_hazard_features(sample: Dict[str, Any]) -> List[float]:
    """
    Extracts numerical feature vector for hazard susceptibility estimation:
    [slope_deg, rainfall_mm, elevation_m, distance_to_fault_km, soil_permeability]
    """
    return [
        float(sample.get("slope_deg", 15.0)),
        float(sample.get("rainfall_mm", 150.0)),
        float(sample.get("elevation_m", 500.0)),
        float(sample.get("distance_to_fault_km", 10.0)),
        float(sample.get("soil_permeability", 0.5)),
    ]

def extract_vulnerability_features(sample: Dict[str, Any]) -> List[float]:
    """
    Extracts feature vector for vulnerability index modeling:
    [population, elderly_pct, kutcha_housing_pct, road_distance_km, hospital_distance_km]
    """
    return [
        float(sample.get("population", 500)),
        float(sample.get("elderly_pct", 12.0)),
        float(sample.get("kutcha_housing_pct", 35.0)),
        float(sample.get("road_distance_km", 4.5)),
        float(sample.get("hospital_distance_km", 12.0)),
    ]

def normalize_features(features: List[float], mins: List[float], maxs: List[float]) -> List[float]:
    """Min-max feature scaling."""
    norm = []
    for val, mn, mx in zip(features, mins, maxs):
        denom = (mx - mn) if (mx - mn) != 0 else 1.0
        scaled = (val - mn) / denom
        norm.append(round(float(np.clip(scaled, 0.0, 1.0)), 4))
    return norm
