"""
Site Suitability Model Training & Configuration
Calibrates Multi-Criteria Decision Analysis (MCDA) weights using AHP (Analytic Hierarchy Process).
"""
import json
import os

AHP_CRITERIA_WEIGHTS = {
    "slope_stability": 0.25,
    "flood_safety": 0.25,
    "water_availability": 0.20,
    "road_connectivity": 0.15,
    "social_infrastructure": 0.15,
}

def export_suitability_weights(save_path: str = None):
    if save_path is None:
        save_path = os.path.join(os.path.dirname(__file__), "weights.json")

    with open(save_path, "w") as f:
        json.dump(AHP_CRITERIA_WEIGHTS, f, indent=2)

    print(f"SURAKSHA Site Suitability MCDA Weights saved to: {save_path}")

if __name__ == "__main__":
    export_suitability_weights()
