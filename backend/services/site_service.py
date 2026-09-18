from typing import Dict, Any, List
from backend.schemas.relocation import CandidateSiteOut, SiteCapacity
from backend.services.capacity_service import compute_effective_capacity

def process_site_out(site: Dict[str, Any]) -> CandidateSiteOut:
    eff = compute_effective_capacity(site["cap"])
    allocated = site.get("allocated_population", 0)
    avail = max(0, eff.value - allocated)
    
    return CandidateSiteOut(
        id=site["id"],
        name=site["name"],
        region=site.get("region"),
        x=site.get("x", 50.0),
        y=site.get("y", 50.0),
        latitude=site.get("latitude", 0.0),
        longitude=site.get("longitude", 0.0),
        distanceKm=site.get("distanceKm", 15.0),
        cap=SiteCapacity(**site["cap"]),
        eff=eff,
        allocated_population=allocated,
        available_capacity=avail,
    )
