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

__all__ = [
    "hazards_router",
    "habitations_router",
    "risk_router",
    "relocation_router",
    "sites_router",
    "capacity_router",
    "simulation_router",
    "reports_router",
    "sources_router",
    "upload_router",
    "scenarios_router",
]
