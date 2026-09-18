import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_data_sources():
    res = client.get("/api/sources")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 6
    names = [s["name"] for s in data["items"]]
    assert any("Geological Survey of India" in n for n in names)
    assert any("Census of India" in n for n in names)
    census = next(s for s in data["items"] if "Census" in s["name"])
    assert census["stale"] is True
    print(f"PASS: test_list_data_sources ({data['count']} sources verified)")

def test_save_and_list_scenario():
    payload = {
        "title": "Phase 1 Wayanad High-Risk Landslide Evacuation",
        "habitation_id": "H1",
        "site_id": "S1",
        "population": 340,
        "hazard_reduction_pct": 82,
        "notes": "Urgent phased transfer before southwest monsoon onset"
    }
    # 1. Save scenario
    res = client.post("/api/scenarios", json=payload)
    assert res.status_code == 201
    created = res.json()
    assert created["title"] == payload["title"]
    assert created["habitation_name"] == "Kavalapara Hamlet"
    assert created["site_name"] == "Meenangadi Rehabilitation Colony"
    assert "SCN-" in created["id"]
    print(f"PASS: test_save_scenario (Created: {created['id']})")

    # 2. List scenarios
    list_res = client.get("/api/scenarios")
    assert list_res.status_code == 200
    scenarios = list_res.json()
    assert len(scenarios) >= 1
    assert any(s["id"] == created["id"] for s in scenarios)
    print(f"PASS: test_list_scenarios ({len(scenarios)} scenarios stored)")

def test_save_scenario_invalid_hab():
    payload = {
        "title": "Invalid Plan",
        "habitation_id": "NON_EXISTENT",
        "site_id": "S1",
        "population": 100,
        "hazard_reduction_pct": 50
    }
    res = client.post("/api/scenarios", json=payload)
    assert res.status_code == 404
    print("PASS: test_save_scenario_invalid_hab (Rejected with HTTP 404)")

if __name__ == "__main__":
    test_list_data_sources()
    test_save_and_list_scenario()
    test_save_scenario_invalid_hab()
    print("\nALL FEATURE 8 SCENARIOS & SOURCES TESTS PASSED!")
