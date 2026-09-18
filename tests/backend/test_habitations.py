import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_habitations():
    res = client.get("/api/habitations")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 8
    first = data["items"][0]
    assert "id" in first
    assert "latitude" in first
    assert "longitude" in first
    assert "score" in first
    assert "tier" in first
    assert first["tier"] in ["Immediate", "Short-term", "Medium-term"]
    print("PASS: test_list_habitations")

def test_filter_habitations_by_hazard():
    res = client.get("/api/habitations?hazard=Landslide")
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert "landslide" in item["hazard"].lower()
    print(f"PASS: test_filter_habitations_by_hazard ({data['count']} found)")

def test_filter_habitations_by_tier():
    res = client.get("/api/habitations?tier=Immediate")
    assert res.status_code == 200
    data = res.json()
    for item in data["items"]:
        assert item["tier"] == "Immediate"
    print(f"PASS: test_filter_habitations_by_tier ({data['count']} found)")

def test_get_habitation_by_id_success():
    res = client.get("/api/habitations/H1")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "H1"
    assert data["name"] == "Kavalapara Hamlet"
    assert data["score"] > 0
    print("PASS: test_get_habitation_by_id_success")

def test_get_habitation_by_id_not_found():
    res = client.get("/api/habitations/UNKNOWN_ID_999")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()
    print("PASS: test_get_habitation_by_id_not_found")

def test_create_habitation_valid():
    payload = {
        "name": "Chooralmala Settlement",
        "region": "Wayanad Slope",
        "district": "Wayanad",
        "state": "Kerala",
        "hazard": "Landslide",
        "pop": 420,
        "latitude": 11.5300,
        "longitude": 76.1800,
        "f": {
            "hazard": 95,
            "exposure": 85,
            "vulnerability": 80,
            "history": 90,
            "access": 30
        },
        "events": 4
    }
    res = client.post("/api/habitations", json=payload)
    assert res.status_code == 201
    created = res.json()
    assert created["name"] == "Chooralmala Settlement"
    assert created["score"] >= 70
    assert created["tier"] == "Immediate"
    print(f"PASS: test_create_habitation_valid (Assigned: {created['id']}, Score: {created['score']}, Tier: {created['tier']})")

def test_create_habitation_invalid_payload():
    bad_payload = {
        "name": "Invalid Hab",
        "region": "Nowhere",
        "hazard": "Landslide",
        "pop": -50,
        "latitude": 125.0,
        "longitude": 76.0,
        "f": {
            "hazard": 150,
            "exposure": 50,
            "vulnerability": 50,
            "history": 50,
            "access": 50
        }
    }
    res = client.post("/api/habitations", json=bad_payload)
    assert res.status_code == 422
    print("PASS: test_create_habitation_invalid_payload (Correctly rejected with HTTP 422)")

if __name__ == "__main__":
    test_list_habitations()
    test_filter_habitations_by_hazard()
    test_filter_habitations_by_tier()
    test_get_habitation_by_id_success()
    test_get_habitation_by_id_not_found()
    test_create_habitation_valid()
    test_create_habitation_invalid_payload()
    print("\nALL FEATURE 2 HABITATIONS API TESTS PASSED!")
