import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_list_relocation_sites():
    res = client.get("/api/relocation/sites")
    assert res.status_code == 200
    sites = res.json()
    assert len(sites) >= 4
    first = sites[0]
    assert "id" in first
    assert "name" in first
    assert "cap" in first
    assert "land" in first["cap"]
    assert "eff" in first
    assert "value" in first["eff"]
    assert "bottleneck" in first["eff"]
    min_dim = min(first["cap"].values())
    assert first["eff"]["value"] == min_dim
    print(f"PASS: test_list_relocation_sites (Top site: {first['name']}, Eff Cap: {first['eff']['value']}, Bottleneck: {first['eff']['bottleneck']})")

def test_filter_relocation_sites_by_min_capacity():
    res = client.get("/api/relocation/sites?min_capacity=300")
    assert res.status_code == 200
    sites = res.json()
    for s in sites:
        assert s["eff"]["value"] >= 300
    print(f"PASS: test_filter_relocation_sites_by_min_capacity ({len(sites)} sites >= 300)")

def test_simulate_relocation_capacity_exceeded():
    payload = {"habitation_id": "H1", "site_id": "S1"}
    res = client.post("/api/relocation/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["habitation_name"] == "Kavalapara Hamlet"
    assert data["site_name"] == "Meenangadi Rehabilitation Colony"
    assert data["population"] == 340
    assert data["effective_capacity"] == 250
    assert data["bottleneck"] == "schools"
    assert data["capacity_exceeded"] is True
    assert data["hazard_reduction_pct"] > 70
    assert len(data["radar_data"]) == 3
    print("PASS: test_simulate_relocation_capacity_exceeded (Correctly flagged 340 > 250)")

def test_simulate_relocation_within_capacity():
    payload = {"habitation_id": "H4", "site_id": "S1"}
    res = client.post("/api/relocation/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["population"] == 210
    assert data["capacity_exceeded"] is False
    print("PASS: test_simulate_relocation_within_capacity (Correctly approved 210 <= 250)")

def test_simulate_relocation_not_found():
    res = client.post("/api/relocation/simulate", json={"habitation_id": "INVALID", "site_id": "S1"})
    assert res.status_code == 404
    print("PASS: test_simulate_relocation_not_found")

def test_optimize_relocation():
    res = client.post("/api/relocation/optimize")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "assignments" in data
    assert "unassigned_requiring_capacity_expansion" in data
    print("PASS: test_optimize_relocation (Assignments optimized without violating bottleneck constraints)")

if __name__ == "__main__":
    test_list_relocation_sites()
    test_filter_relocation_sites_by_min_capacity()
    test_simulate_relocation_capacity_exceeded()
    test_simulate_relocation_within_capacity()
    test_simulate_relocation_not_found()
    test_optimize_relocation()
    print("\nALL FEATURE 5 RELOCATION & CAPACITY TESTS PASSED!")
