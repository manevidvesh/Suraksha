import sys
from pathlib import Path

# Ensure root directory is on Python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_ROOT = Path(__file__).resolve().parent
for p in (PROJECT_ROOT, BACKEND_ROOT):
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging

from backend.config import settings
from backend.database import repo

# Import API routers
from backend.api.routes.hazards import router as hazards_router
from backend.api.routes.habitations import router as habitations_router
from backend.api.routes.risk import router as risk_router
from backend.api.routes.relocation import router as relocation_router
from backend.api.routes.sites import router as sites_router
from backend.api.routes.capacity import router as capacity_router
from backend.api.routes.simulation import router as simulation_router
from backend.api.routes.reports import router as reports_router
from backend.api.routes.sources import router as sources_router
from backend.api.routes.upload import router as upload_router
from backend.api.routes.scenarios import router as scenarios_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("suraksha")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Configured CORS origins: {settings.CORS_ORIGINS}")
    await repo.initialize()
    logger.info("SURAKSHA spatial repository and cache initialized successfully.")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "SURAKSHA: Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation. "
        "Intelligent GIS-enabled decision support platform to dynamically identify multi-hazard "
        "Red Zones, assess carrying capacity of candidate resettlement sites, and prioritize "
        "vulnerable habitations for immediate, short-term, and medium-term relocation."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if "*" not in settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Validation error handling
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

# Global unhandled exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred. Please contact system administrator."},
    )

# Mount all modular API routers
app.include_router(habitations_router, prefix=settings.API_PREFIX)
app.include_router(hazards_router, prefix=settings.API_PREFIX)
app.include_router(risk_router, prefix=settings.API_PREFIX)
app.include_router(relocation_router, prefix=settings.API_PREFIX)
app.include_router(sites_router, prefix=settings.API_PREFIX)
app.include_router(capacity_router, prefix=settings.API_PREFIX)
app.include_router(simulation_router, prefix=settings.API_PREFIX)
app.include_router(reports_router, prefix=settings.API_PREFIX)
app.include_router(sources_router, prefix=settings.API_PREFIX)
app.include_router(upload_router, prefix=settings.API_PREFIX)
app.include_router(scenarios_router, prefix=settings.API_PREFIX)

@app.get("/", tags=["System"])
async def root():
    return {
        "system": settings.PROJECT_NAME,
        "acronym": settings.SYSTEM_NAME,
        "status": "operational",
        "version": settings.VERSION,
        "docs": "/docs",
        "api_prefix": settings.API_PREFIX,
    }

@app.get("/health", tags=["System"])
async def health():
    hab_count = len(await repo.get_all_habitations())
    site_count = len(await repo.get_all_sites())
    return {
        "status": "healthy",
        "system": settings.SYSTEM_NAME,
        "environment": "production" if repo.is_db_connected else "mvp-spatial-cache",
        "postgis_connected": repo.is_db_connected,
        "habitations_loaded": hab_count,
        "candidate_sites_loaded": site_count,
    }

if __name__ == "__main__":
    import uvicorn
    print(f"Starting {settings.PROJECT_NAME} on http://localhost:{settings.PORT}")
    print(f"Interactive API Docs available at http://localhost:{settings.PORT}/docs")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
