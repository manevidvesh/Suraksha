import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_generate_executive_brief_with_site():
    payload = {"habitation_id": "H1", "site_id": "S1"}
    res = client.post("/api/reports/generate-brief", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "Kavalapara Hamlet" in data["title"]
    assert data["habitation_name"] == "Kavalapara Hamlet"
    assert data["priority_tier"] == "Immediate"
    assert "executive_summary" in data and len(data["executive_summary"]) > 20
    assert "risk_driver_analysis" in data
    assert data["relocation_site_assessment"] is not None
    assert len(data["policy_recommendations"]) >= 3
    print(f"PASS: test_generate_executive_brief_with_site ('{data['title']}')")

def test_generate_executive_brief_without_site():
    payload = {"habitation_id": "H2"}
    res = client.post("/api/reports/generate-brief", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["habitation_name"] == "Chellanam Coastal Ward"
    assert data["primary_hazard"] == "Coastal erosion"
    print("PASS: test_generate_executive_brief_without_site")

def test_generate_brief_habitation_not_found():
    res = client.post("/api/reports/generate-brief", json={"habitation_id": "INVALID_HAB"})
    assert res.status_code == 404
    print("PASS: test_generate_brief_habitation_not_found")

def test_generate_brief_site_not_found():
    res = client.post("/api/reports/generate-brief", json={"habitation_id": "H1", "site_id": "INVALID_SITE"})
    assert res.status_code == 404
    print("PASS: test_generate_brief_site_not_found")

if __name__ == "__main__":
    test_generate_executive_brief_with_site()
    test_generate_executive_brief_without_site()
    test_generate_brief_habitation_not_found()
    test_generate_brief_site_not_found()
    print("\nALL FEATURE 6 REPORTS & AI EXPLAINER TESTS PASSED!")
