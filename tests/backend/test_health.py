import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["version"] == "1.0.0"
    assert data["acronym"] == "SURAKSHA"
    print("PASS: test_root_endpoint")

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["system"] == "SURAKSHA"
    assert data["habitations_loaded"] >= 8
    assert data["candidate_sites_loaded"] >= 4
    print("PASS: test_health_endpoint")

def test_cors_headers():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    print("PASS: test_cors_headers")

if __name__ == "__main__":
    test_root_endpoint()
    test_health_endpoint()
    test_cors_headers()
    print("\nALL FEATURE 1 HEALTH & CONFIG TESTS PASSED!")
