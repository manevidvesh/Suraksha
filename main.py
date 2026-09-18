import sys
from pathlib import Path

# Ensure root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Import the SURAKSHA FastAPI application
from backend.main import app

if __name__ == "__main__":
    import uvicorn
    from backend.config import settings
    print(f"Starting {settings.PROJECT_NAME} on http://localhost:{settings.PORT}")
    print(f"Interactive API Docs available at http://localhost:{settings.PORT}/docs")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
