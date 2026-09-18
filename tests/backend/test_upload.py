import io
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_upload_valid_csv():
    csv_content = (
        "name,region,hazard,pop,latitude,longitude\n"
        "Meppadi East,Wayanad,Landslide,280,11.54,76.12\n"
        "Puthumala Hamlet,Wayanad,Landslide,190,11.51,76.15\n"
    )
    files = {"file": ("wayanad-survey.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["record_count"] == 2
    assert "name" in data["fields_mapped"]
    print(f"PASS: test_upload_valid_csv ({data['record_count']} records parsed)")

def test_upload_valid_geojson():
    geojson_obj = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[76.1, 11.4], [76.2, 11.4], [76.2, 11.5], [76.1, 11.5], [76.1, 11.4]]]
                },
                "properties": {
                    "hazard_type": "Landslide",
                    "severity": "Critical",
                    "source_agency": "Field Survey Team"
                }
            }
        ]
    }
    geojson_bytes = json.dumps(geojson_obj).encode("utf-8")
    files = {"file": ("new-redzone.geojson", io.BytesIO(geojson_bytes), "application/geo+json")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["record_count"] == 1
    print("PASS: test_upload_valid_geojson")

def test_upload_corrupt_geojson():
    corrupt_bytes = b"INVALID NOT JSON AT ALL"
    files = {"file": ("corrupt.geojson", io.BytesIO(corrupt_bytes), "application/geo+json")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "error"
    assert "Invalid GeoJSON" in data["message"]
    print("PASS: test_upload_corrupt_geojson (Handled gracefully)")

def test_upload_empty_file():
    files = {"file": ("empty.csv", io.BytesIO(b""), "text/csv")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 400
    print("PASS: test_upload_empty_file (Rejected with HTTP 400)")

def test_upload_unsupported_format():
    files = {"file": ("virus.exe", io.BytesIO(b"dummy binary data"), "application/octet-stream")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 400
    assert "Unsupported format" in res.json()["detail"]
    print("PASS: test_upload_unsupported_format (Rejected with HTTP 400)")

if __name__ == "__main__":
    test_upload_valid_csv()
    test_upload_valid_geojson()
    test_upload_corrupt_geojson()
    test_upload_empty_file()
    test_upload_unsupported_format()
    print("\nALL FEATURE 7 UPLOAD & DATA INGESTION TESTS PASSED!")
