import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_get_hazard_red_zones_geojson():
    res = client.get("/api/hazards/red-zones")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 5
    first = data["features"][0]
    assert first["type"] == "Feature"
    assert first["geometry"]["type"] == "Polygon"
    assert len(first["geometry"]["coordinates"][0]) >= 4  # Valid closed polygon
    props = first["properties"]
    assert "zone_code" in props
    assert "hazard_type" in props
    assert "severity" in props
    print(f"PASS: test_get_hazard_red_zones_geojson ({len(data['features'])} zones loaded)")

def test_simulate_dynamic_red_zone_buffer():
    payload = {
        "latitude": 11.5000,
        "longitude": 76.1000,
        "radius_km": 8.5,
        "hazard_type": "Landslide",
        "severity": "Critical",
        "zone_name": "Wayanad Active Surge Buffer"
    }
    res = client.post("/api/hazards/red-zones/simulate-buffer", json=payload)
    assert res.status_code == 201
    feature = res.json()
    assert feature["type"] == "Feature"
    assert feature["geometry"]["type"] == "Polygon"
    assert len(feature["geometry"]["coordinates"][0]) == 17  # Closed 16-point circle
    assert feature["properties"]["radius_km"] == 8.5
    print("PASS: test_simulate_dynamic_red_zone_buffer (Dynamic polygon generated)")

def test_get_disaster_history():
    res = client.get("/api/hazards/history")
    assert res.status_code == 200
    events = res.json()
    assert len(events) >= 6
    first = events[0]
    assert "year" in first
    assert "place" in first
    assert "severity" in first
    print(f"PASS: test_get_disaster_history ({len(events)} events returned)")

def test_filter_disaster_history_by_severity():
    res = client.get("/api/hazards/history?severity=High")
    assert res.status_code == 200
    events = res.json()
    assert len(events) > 0
    for e in events:
        assert e["severity"].lower() == "high"
    print(f"PASS: test_filter_disaster_history_by_severity ({len(events)} High severity events)")

def test_list_hazard_layers():
    res = client.get("/api/hazards/layers")
    assert res.status_code == 200
    layers = res.json()
    assert len(layers) >= 4
    agencies = [l["agency"] for l in layers]
    assert any("Geological Survey of India" in a for a in agencies)
    assert any("India Meteorological Department" in a for a in agencies)
    print(f"PASS: test_list_hazard_layers ({len(layers)} official GIS feeds)")

if __name__ == "__main__":
    test_get_hazard_red_zones_geojson()
    test_simulate_dynamic_red_zone_buffer()
    test_get_disaster_history()
    test_filter_disaster_history_by_severity()
    test_list_hazard_layers()
    print("\nALL FEATURE 3 HAZARDS & RED ZONES TESTS PASSED!")
