import sys
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_e2e_overview_flow():
    print("\n[E2E Flow 1] Overview Screen Integration:")
    habs_res = client.get("/api/habitations", headers={"Origin": "http://localhost:3000"})
    assert habs_res.status_code == 200
    habs = habs_res.json()
    assert "count" in habs and "items" in habs
    assert len(habs["items"]) >= 8
    
    sites_res = client.get("/api/relocation/sites", headers={"Origin": "http://localhost:3000"})
    assert sites_res.status_code == 200
    sites = sites_res.json()
    assert len(sites) >= 4

    rz_res = client.get("/api/hazards/red-zones", headers={"Origin": "http://localhost:3000"})
    assert rz_res.status_code == 200
    rz = rz_res.json()
    assert rz["type"] == "FeatureCollection"
    assert len(rz["features"]) >= 5
    print(" -> Overview flow: Habitations, Sites, and Red Zones PostGIS GeoJSON successfully fetched.")

def test_e2e_risk_scoring_flow():
    print("\n[E2E Flow 2] Dynamic Risk Scoring & Slider Recalculation Flow:")
    custom_weights = {
        "hazard": 45.0,
        "exposure": 20.0,
        "vulnerability": 20.0,
        "history": 10.0,
        "access": 5.0
    }
    calc_res = client.post(
        "/api/risk/calculate",
        json={"weights": custom_weights},
        headers={"Origin": "http://localhost:3000"}
    )
    assert calc_res.status_code == 200
    calc_data = calc_res.json()
    assert len(calc_data["habitations"]) >= 8
    assert "tier_counts" in calc_data
    assert calc_data["tier_counts"]["immediate"] > 0

    top_hab_id = calc_data["habitations"][0]["id"]
    breakdown_res = client.get(
        f"/api/risk/habitations/{top_hab_id}/breakdown",
        headers={"Origin": "http://localhost:3000"}
    )
    assert breakdown_res.status_code == 200
    breakdown = breakdown_res.json()
    assert len(breakdown["factors"]) == 5
    assert len(breakdown["explanation"]) > 20
    print(f" -> Risk Scoring flow: Recomputed with custom weights, top hab '{breakdown['name']}' breakdown loaded.")

def test_e2e_relocation_and_ai_brief_flow():
    print("\n[E2E Flow 3] Relocation Simulation & AI Explainer Brief Flow:")
    sim_res = client.post(
        "/api/relocation/simulate",
        json={"habitation_id": "H1", "site_id": "S1"},
        headers={"Origin": "http://localhost:3000"}
    )
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert sim_data["travel_distance_km"] > 0
    assert sim_data["hazard_reduction_pct"] > 50
    assert len(sim_data["radar_data"]) == 3
    assert sim_data["capacity_exceeded"] is True

    brief_res = client.post(
        "/api/reports/generate-brief",
        json={"habitation_id": "H1", "site_id": "S1"},
        headers={"Origin": "http://localhost:3000"}
    )
    assert brief_res.status_code == 200
    brief = brief_res.json()
    assert "Kavalapara Hamlet" in brief["title"]
    assert len(brief["executive_summary"]) > 50
    assert len(brief["policy_recommendations"]) >= 3
    print(f" -> Relocation flow: Simulation computed ({sim_data['hazard_reduction_pct']}% reduction), AI Brief '{brief['title']}' generated.")

def test_e2e_upload_flow():
    print("\n[E2E Flow 4] Data Ingestion & Live Layer Update Flow:")
    survey_csv = (
        "name,region,hazard,pop,latitude,longitude\n"
        "Attappadi Highland Settlement,Palakkad,Landslide,230,11.05,76.62\n"
    )
    files = {"file": ("attappadi-survey.csv", survey_csv.encode("utf-8"), "text/csv")}
    upload_res = client.post(
        "/api/upload",
        files=files,
        headers={"Origin": "http://localhost:3000"}
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert upload_data["status"] == "success"
    assert upload_data["record_count"] == 1
    print(f" -> Upload flow: Survey parsed successfully ({upload_data['message']}).")

if __name__ == "__main__":
    test_e2e_overview_flow()
    test_e2e_risk_scoring_flow()
    test_e2e_relocation_and_ai_brief_flow()
    test_e2e_upload_flow()
    print("\n======================================================================")
    print("ALL FULL-STACK E2E INTEGRATION FLOWS VERIFIED SUCCESSFULLY!")
    print("======================================================================")
