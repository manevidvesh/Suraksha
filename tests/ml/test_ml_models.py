import pytest
from backend.ml.hazard_model.predict import predict_hazard_susceptibility
from backend.ml.vulnerability_model.predict import predict_vulnerability_score
from backend.ml.site_suitability.predict import predict_site_suitability_score

def test_hazard_model_inference():
    sample = {
        "slope_deg": 42.0,
        "rainfall_mm": 350.0,
        "elevation_m": 1200.0,
        "distance_to_fault_km": 1.5,
        "soil_permeability": 0.2,
    }
    result = predict_hazard_susceptibility(sample)
    assert "is_high_hazard" in result
    assert "hazard_probability" in result
    assert 0.0 <= result["hazard_probability"] <= 1.0
    assert 0 <= result["hazard_score_equivalent"] <= 100

def test_vulnerability_model_inference():
    sample = {
        "population": 850,
        "elderly_pct": 22.0,
        "kutcha_housing_pct": 55.0,
        "road_distance_km": 8.0,
        "hospital_distance_km": 25.0,
    }
    result = predict_vulnerability_score(sample)
    assert "predicted_vulnerability_score" in result
    assert "vulnerability_tier" in result
    assert 0.0 <= result["predicted_vulnerability_score"] <= 100.0
    assert result["vulnerability_tier"] in ["High", "Moderate", "Low"]

def test_site_suitability_mcda():
    site_features = {
        "slope_stability": 88.0,
        "flood_safety": 92.0,
        "water_availability": 80.0,
        "road_connectivity": 85.0,
        "social_infrastructure": 75.0,
    }
    result = predict_site_suitability_score(site_features)
    assert "suitability_score" in result
    assert result["suitability_score"] > 80.0
    assert result["is_suitable"] is True
    assert "Tier-1" in result["grade"]
