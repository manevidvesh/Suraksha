"""
SURAKSHA DSS Backend - Development Server Entry Point
Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation
Run: python run.py
"""
import sys
from pathlib import Path

# Ensure project root is on path so `backend.*` imports resolve
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import uvicorn
from backend.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f"Docs available at: http://{settings.HOST}:{settings.PORT}/docs")
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info",
    )
