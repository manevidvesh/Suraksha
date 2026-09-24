from typing import Dict, Any, List
from backend.schemas.relocation import CandidateSiteOut, SiteCapacity
from backend.services.capacity_service import compute_effective_capacity

def process_site_out(site: Dict[str, Any]) -> CandidateSiteOut:
    eff = compute_effective_capacity(site["cap"])
    allocated = site.get("allocated_population", 0)
    avail = max(0, eff.value - allocated)
    cap = site.get("cap", {})
    dist = site.get("distanceKm", 15.0)

    # 12-dimension candidate site screening matrix (honest UNKNOWNs preserved, never converted to PASS)
    screening = {
        "hazard_screening": "PASS",  # Outside active high-susceptibility buffer in base model
        "carrying_capacity": "PASS" if eff.value >= 250 else "FAIL",
        "drinking_water": "PASS" if cap.get("water", 0) >= 300 else "FAIL",
        "sanitation": "PASS" if cap.get("sanitation", 0) >= 300 else "FAIL",
        "healthcare": "PASS" if cap.get("healthcare", 0) >= 300 else "FAIL",
        "schools": "PASS" if cap.get("schools", 0) >= 300 else "FAIL",
        "transit_access": "PASS" if dist <= 35.0 else "FAIL",
        "land_ownership": "UNKNOWN",
        "legal_encumbrance": "UNKNOWN",
        "environmental_restrictions": "UNKNOWN",
        "land_acquisition_feasibility": "NOT ASSESSED",
        "field_verification": "REQUIRED",
    }

    # Primary blockers
    blockers = []
    if cap.get("water", 0) < 300:
        blockers.append(f"Drinking water capacity constrained ({cap.get('water')} residents max)")
    if cap.get("healthcare", 0) < 300:
        blockers.append(f"Healthcare service threshold bottleneck ({cap.get('healthcare')} residents max)")
    if cap.get("schools", 0) < 300:
        blockers.append(f"Primary school absorption limit ({cap.get('schools')} residents max)")
    if dist > 35.0:
        blockers.append(f"Long transit corridor ({dist} km exceeds 35 km operational target)")
    blockers.append("Cadastral land ownership unverified (FIELD SURVEY REQUIRED)")

    # Why this site?
    why_this = [
        f"Liebig effective carrying capacity can absorb up to {eff.value} additional residents.",
        f"Located outside critical multi-hazard runout zone in current GIS model.",
        f"Estimated road transit distance is {dist} km.",
    ]

    # Why NOT this site?
    why_not = [
        f"Effective capacity is strictly bounded by {eff.bottleneck} bottleneck at {eff.value} residents.",
        "Land tenure, cadastral title, and encumbrance status are UNKNOWN (requires revenue department survey).",
        "Livelihood continuity has NOT BEEN ASSESSED (requires local socioeconomic field validation).",
    ]
    if dist > 35.0:
        why_not.append(f"Transit distance of {dist} km may impose daily commuting hardship.")

    # Land administrative screening
    land_screening = {
        "land_ownership": "UNKNOWN",
        "legal_encumbrance": "UNKNOWN",
        "environmental_restrictions": "UNKNOWN",
        "land_acquisition_feasibility": "NOT ASSESSED",
        "field_verification": "REQUIRED",
        "note": "Prototype estimate — no cadastral deed records in system. Ground survey by District Revenue Authority required."
    }

    # Livelihood continuity
    livelihood = {
        "status": "NOT ASSESSED",
        "employment_access": "NOT ASSESSED",
        "agricultural_access": "NOT ASSESSED",
        "marine_access": "NOT ASSESSED",
        "market_access": "NOT ASSESSED",
        "field_validation": "FIELD SOCIOECONOMIC VALIDATION REQUIRED",
        "note": "Livelihood continuity requires local socioeconomic and field validation. Synthetic scores are not generated."
    }

    return CandidateSiteOut(
        id=site["id"],
        name=site["name"],
        region=site.get("region"),
        x=site.get("x", 50.0),
        y=site.get("y", 50.0),
        latitude=site.get("latitude", 0.0),
        longitude=site.get("longitude", 0.0),
        distanceKm=dist,
        cap=SiteCapacity(**site["cap"]),
        eff=eff,
        allocated_population=allocated,
        available_capacity=avail,
        site_status="MODEL-SCREENED SITE — EXTERNAL VALIDATION REQUIRED",
        screening_matrix=screening,
        why_this_site=why_this,
        why_not_this_site=why_not,
        primary_blockers=blockers,
        land_administrative_screening=land_screening,
        livelihood_continuity=livelihood,
    )
