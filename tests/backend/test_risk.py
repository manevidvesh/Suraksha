import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_calculate_risk_scores_default():
    payload = {
        "weights": {
            "hazard": 30.0,
            "exposure": 25.0,
            "vulnerability": 20.0,
            "history": 15.0,
            "access": 10.0
        }
    }
    res = client.post("/api/risk/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["habitations"]) >= 8
    scores = [h["score"] for h in data["habitations"]]
    assert scores == sorted(scores, reverse=True)
    tc = data["tier_counts"]
    total = tc["immediate"] + tc["short_term"] + tc["medium_term"]
    assert total == len(data["habitations"])
    assert data["total_population_exposed"] > 0
    print(f"PASS: test_calculate_risk_scores_default ({tc['immediate']} Immediate, {tc['short_term']} Short-term, {tc['medium_term']} Medium-term)")

def test_calculate_risk_scores_hazard_dominance():
    payload = {
        "weights": {
            "hazard": 50.0,
            "exposure": 0.0,
            "vulnerability": 0.0,
            "history": 0.0,
            "access": 0.0
        }
    }
    res = client.post("/api/risk/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    top_hab = data["habitations"][0]
    assert top_hab["f"]["hazard"] >= 90
    print(f"PASS: test_calculate_risk_scores_hazard_dominance (Top: {top_hab['name']} with hazard {top_hab['f']['hazard']})")

def test_calculate_risk_scores_zero_weights_safe():
    payload = {
        "weights": {
            "hazard": 0.0,
            "exposure": 0.0,
            "vulnerability": 0.0,
            "history": 0.0,
            "access": 0.0
        }
    }
    res = client.post("/api/risk/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert all(h["score"] == 0 for h in data["habitations"])
    print("PASS: test_calculate_risk_scores_zero_weights_safe (Safely returned 0 without DivByZero)")

def test_habitation_risk_breakdown_success():
    res = client.get("/api/risk/habitations/H1/breakdown")
    assert res.status_code == 200
    data = res.json()
    assert data["habitation_id"] == "H1"
    assert len(data["factors"]) == 5
    assert data["primary_driver"] != ""
    assert data["secondary_driver"] != ""
    assert "Kavalapara Hamlet" in data["explanation"]
    print(f"PASS: test_habitation_risk_breakdown_success (Primary: {data['primary_driver']}, Secondary: {data['secondary_driver']})")

def test_habitation_risk_breakdown_not_found():
    res = client.get("/api/risk/habitations/NON_EXISTENT_HAB/breakdown")
    assert res.status_code == 404
    print("PASS: test_habitation_risk_breakdown_not_found (Returned 404 correctly)")

if __name__ == "__main__":
    test_calculate_risk_scores_default()
    test_calculate_risk_scores_hazard_dominance()
    test_calculate_risk_scores_zero_weights_safe()
    test_habitation_risk_breakdown_success()
    test_habitation_risk_breakdown_not_found()
    print("\nALL FEATURE 4 RISK ENGINE TESTS PASSED!")
