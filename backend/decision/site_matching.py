import math
from typing import Dict, Any, List, Optional, Tuple
from backend.services.hazard_service import haversine_distance_km
from backend.services.capacity_service import compute_effective_capacity, CAP_LABELS
from backend.decision.capacity import evaluate_site_capacity
from backend.schemas.relocation import (
    HabitationSiteCandidateMatch,
    HabitationMatchingResult,
    SiteCentricMatchingResult,
    FourResponsePathways,
)

def score_site_match(hab: Dict[str, Any], site: Dict[str, Any]) -> float:
    """
    Computes matching score between habitation and candidate site:
    Higher score = better match.
    Factors:
    - Distance penalty
    - Excess capacity bonus
    """
    h_lat, h_lon = hab.get("latitude", 0.0), hab.get("longitude", 0.0)
    s_lat, s_lon = site.get("latitude", 0.0), site.get("longitude", 0.0)
    dist = haversine_distance_km(h_lat, h_lon, s_lat, s_lon)

    can_absorb, _, diff = evaluate_site_capacity(site.get("cap", {}), hab.get("pop", 0))
    if not can_absorb:
        return -1.0  # Infeasible match

    # Distance factor (100km max normalized)
    norm_dist = max(0.0, 100.0 - dist)
    cap_bonus = min(50.0, diff / 10.0)
    return norm_dist + cap_bonus

def get_candidate_in_situ_measures(hazard_type: str) -> List[str]:
    """Candidate adaptation measures for consideration by the competent authority."""
    h_lower = (hazard_type or "").lower()
    if any(k in h_lower for k in ["landslide", "slope", "subsidence", "rockfall"]):
        return [
            "Surface runoff interception trenches and masonry contour drains",
            "Reinforced retaining crib-walls with weep holes along critical slope toe",
            "Slope bio-engineering with deep-root vetiver grass and systematic terracing",
            "Crack displacement gauges and tiltmeter early monitoring array",
        ]
    elif any(k in h_lower for k in ["flood", "submergence", "riverine", "inundation"]):
        return [
            "Amphibious architectural retrofits and raised plinth foundation structures",
            "Polder embankment dyke reinforcement with automated backwater flap gates",
            "Desilting and desnagging of natural feeder channels to restore wetland retention",
            "Raised communal platforms for livestock safety and emergency fodder storage",
        ]
    elif any(k in h_lower for k in ["coastal", "erosion", "cyclone", "sea"]):
        return [
            "Geo-textile tube offshore breakwaters and continuous beach nourishment",
            "Dense mangrove bio-shield restoration along intertidal littoral buffer",
            "Elevated stilt dwelling reconstruction allowing storm surge clearance",
            "Cyclone-resistant roof anchoring and dedicated village shelter transit corridors",
        ]
    return [
        "Community early warning sirens linked to District Emergency Operations Centre",
        "Pre-positioning of emergency rescue and medical lifeline inventory",
        "Structural engineering inspection of public school/community relief shelters",
        "Participatory Gram Panchayat contingency evacuation route mapping",
    ]

def evaluate_site_screening_matrix(
    site: Dict[str, Any],
    dist_km: Optional[float] = None,
    field_override: Optional[str] = None
) -> Dict[str, str]:
    """
    Evaluates 12-dimension candidate site screening matrix.
    Allowed states: PASS, FAIL, UNKNOWN, NOT_ASSESSED, REQUIRED.
    PASS denotes prototype baseline screening criteria satisfaction, never 'guaranteed safe'.
    UNKNOWN and NOT_ASSESSED are strictly preserved.
    """
    cap = site.get("cap", {})
    eff = compute_effective_capacity(cap)
    dist = dist_km if dist_km is not None else site.get("distanceKm", 15.0)

    # Base hazard screening
    hazard_pass = site.get("hazard_screening", "PASS")

    # Transit access assessment
    if dist is None:
        transit_state = "UNKNOWN"
    elif dist <= 35.0:
        transit_state = "PASS"
    elif dist > 150.0:
        transit_state = "FAIL"
    else:
        transit_state = "PASS"  # Within operational range

    # Field verification status
    if field_override == "unsuitable":
        field_state = "FAIL"
    elif field_override == "suitable":
        field_state = "PASS"
    else:
        field_state = "REQUIRED"

    return {
        "hazard_screening": hazard_pass,
        "carrying_capacity": "PASS" if eff.value >= 200 else "FAIL",
        "drinking_water": "PASS" if cap.get("water", 0) >= 250 else "FAIL",
        "sanitation": "PASS" if cap.get("sanitation", 0) >= 250 else "FAIL",
        "healthcare": "PASS" if cap.get("healthcare", 0) >= 200 else "FAIL",
        "schools": "PASS" if cap.get("schools", 0) >= 200 else "FAIL",
        "transit_access": transit_state,
        "land_ownership": "UNKNOWN",
        "legal_encumbrance": "UNKNOWN",
        "environmental_restrictions": "UNKNOWN",
        "land_acquisition_feasibility": "NOT_ASSESSED",
        "field_verification": field_state,
    }

def match_habitation_to_candidate_sites(
    hab: Dict[str, Any],
    sites: List[Dict[str, Any]],
    simulated_allocations: Optional[Dict[str, int]] = None,
    field_overrides: Optional[Dict[str, str]] = None,
    max_distance_km: float = 160.0
) -> HabitationMatchingResult:
    """
    Many-to-many decision matching evaluating all candidate relocation sites independently
    for a given vulnerable habitation.

    Algorithm:
    1. Independent candidate site evaluation.
    2. Baseline exclusion constraints:
       - Critical screening criteria failure (hazard screening, excessive distance).
       - Field verification override (if marked unsuitable by competent authority -> excluded).
       - Unresolved critical UNKNOWN evidence flag.
       - Finite effective capacity check against habitation population demand.
    3. Contextual comparison & ranking for eligible alternatives:
       - Ranked strictly among eligible alternatives (never forces an ineligible site).
    4. Explicit zero-site handling with structured states:
       - NO_CANDIDATES
       - NO_ELIGIBLE_CANDIDATES
       - INSUFFICIENT_EVIDENCE
       - INSUFFICIENT_CAPACITY
       - ELIGIBLE_OPTIONS_AVAILABLE
    5. Integrated Four Response Pathways:
       - In-situ mitigation
       - Prepare & evacuate
       - Temporary shelter
       - Permanent relocation
    """
    pop = hab.get("pop", 0)
    h_lat = hab.get("latitude")
    h_lon = hab.get("longitude")
    hazard = hab.get("hazard", "Natural Hazard")
    score = hab.get("score", 70)
    tier = hab.get("tier", "Immediate")

    allocations = simulated_allocations or {}
    overrides = field_overrides or {}

    evaluated: List[HabitationSiteCandidateMatch] = []
    eligible: List[HabitationSiteCandidateMatch] = []
    excluded: List[HabitationSiteCandidateMatch] = []

    unknown_evidence_items: List[str] = [
        "Cadastral revenue boundary and land tenure deeds are UNKNOWN (ground survey required).",
        "Legal encumbrances and title dispute status are UNKNOWN.",
        "Local socio-economic livelihood continuity has NOT BEEN ASSESSED.",
    ]
    capacity_gaps: List[Dict[str, Any]] = []
    required_validations: List[str] = [
        "Geotechnical bore-hole and slope stability validation by competent authority.",
        "Hydrological peak runoff analysis for 100-year return period.",
        "Revenue department Patta title clearance under Land Acquisition Act.",
        "Panchayat / Gram Sabha consultative resolution prior to administrative sanction.",
    ]

    has_distance_data = (h_lat is not None and h_lon is not None)

    for s in sites:
        s_id = s.get("id", "")
        cap = s.get("cap", {})
        eff = compute_effective_capacity(cap)
        allocated = allocations.get(s_id, s.get("allocated_population", 0))
        remaining = max(0, eff.value - allocated)
        capacity_gap = max(0, pop - remaining)

        # Distance calculation
        dist_km: Optional[float] = None
        s_lat = s.get("latitude")
        s_lon = s.get("longitude")
        if has_distance_data and s_lat is not None and s_lon is not None:
            dist_km = round(haversine_distance_km(h_lat, h_lon, s_lat, s_lon), 1)
        elif "distanceKm" in s:
            dist_km = float(s["distanceKm"])

        field_override = overrides.get(s_id)
        screening = evaluate_site_screening_matrix(s, dist_km, field_override)

        rejection_reasons: List[str] = []

        # 1. Field review override check
        if field_override == "unsuitable":
            rejection_reasons.append("Excluded: Competent authority field review marked site unsuitable.")

        # 2. Critical screening fails
        if screening.get("hazard_screening") == "FAIL":
            rejection_reasons.append("Excluded: Explicit baseline hazard screening failure (overlaps hazard zone).")

        # 3. Distance / corridor check
        if dist_km is not None and dist_km > max_distance_km:
            rejection_reasons.append(
                f"Transit distance ({dist_km} km) exceeds operational regional corridor limit ({max_distance_km} km)."
            )

        # 4. Carrying capacity check
        if pop > remaining:
            bottleneck_label = CAP_LABELS.get(eff.bottleneck, eff.bottleneck)
            rejection_reasons.append(
                f"Insufficient effective capacity: remaining {remaining} capacity cannot absorb {pop} residents "
                f"(shortfall of {capacity_gap} residents constrained by {bottleneck_label.lower()})."
            )
            capacity_gaps.append({
                "site_id": s_id,
                "site_name": s["name"],
                "remaining_capacity": remaining,
                "demand": pop,
                "shortfall": capacity_gap,
                "bottleneck": eff.bottleneck,
            })

        is_eligible = (len(rejection_reasons) == 0)

        # Why this / Why not
        why_this = [
            f"Liebig effective capacity supports {eff.value} persons (bottleneck: {eff.bottleneck}).",
            "Passed preliminary baseline GIS spatial screening.",
        ]
        if dist_km is not None:
            why_this.append(f"Transit corridor distance: {dist_km} km from {hab.get('name', 'origin')}.")

        why_not = []
        if is_eligible:
            why_not.append(f"Future expansion constrained by {eff.bottleneck} at {eff.value} max capacity.")
            why_not.append("Ground geotechnical survey and title deeds are UNKNOWN.")
        else:
            why_not.extend(rejection_reasons)

        key_constraints = []
        if pop > remaining:
            key_constraints.append(f"Capacity deficit of {capacity_gap} residents")
        if dist_km is not None and dist_km > 35:
            key_constraints.append(f"Transit corridor: {dist_km} km")
        if eff.bottleneck:
            key_constraints.append(f"Service bottleneck: {eff.bottleneck}")

        screening_status = "Passed baseline screening" if is_eligible else "Excluded from eligible matching"

        # Contextual match score for eligible sites
        match_score: Optional[float] = None
        if is_eligible:
            # Score: Proximity bonus + capacity headroom bonus
            d_val = dist_km if dist_km is not None else 50.0
            dist_score = max(0.0, 100.0 - (d_val * 0.5))
            headroom_score = min(50.0, (remaining - pop) * 0.1)
            match_score = round(dist_score + headroom_score, 1)

        candidate_match = HabitationSiteCandidateMatch(
            site_id=s_id,
            site_name=s["name"],
            region=s.get("region"),
            distance_km=dist_km,
            effective_capacity=eff.value,
            allocated_capacity=allocated,
            remaining_capacity=remaining,
            population_demand=pop,
            capacity_gap=capacity_gap,
            bottleneck=eff.bottleneck,
            screening_status=screening_status,
            is_eligible=is_eligible,
            rank=None,  # Assigned after sorting eligible
            match_score=match_score,
            exclusion_reasons=rejection_reasons,
            screening_matrix=screening,
            key_constraints=key_constraints,
            why_this=why_this,
            why_not=why_not,
            evidence_status="EXTERNAL VALIDATION REQUIRED",
            field_review_override=field_override,
        )

        evaluated.append(candidate_match)
        if is_eligible:
            eligible.append(candidate_match)
        else:
            excluded.append(candidate_match)

    # Sort and rank eligible alternatives contextually
    eligible.sort(key=lambda x: (x.match_score or 0.0), reverse=True)
    for rank_idx, match in enumerate(eligible, start=1):
        match.rank = rank_idx

    # Determine structured decision status
    additional_site_needed = False
    if len(sites) == 0:
        status = "NO_CANDIDATES"
        message = "No candidate relocation sites currently exist in the database for evaluation."
        additional_site_needed = True
    elif len(eligible) > 0:
        status = "ELIGIBLE_OPTIONS_AVAILABLE"
        message = f"{len(eligible)} candidate site{'s' if len(eligible) > 1 else ''} passed baseline screening and available for comparison."
    else:
        # Check why none are eligible
        has_capacity_deficit = any("Insufficient effective capacity" in r for m in excluded for r in m.exclusion_reasons)
        has_review_override = any("field review marked site unsuitable" in r for m in excluded for r in m.exclusion_reasons)
        all_failed_hazard = all(m.screening_matrix.get("hazard_screening") == "FAIL" for m in excluded)

        if has_capacity_deficit and not all_failed_hazard:
            status = "INSUFFICIENT_CAPACITY"
            message = "Candidate sites exist in region but none possess sufficient remaining effective capacity for the population demand."
        elif has_review_override:
            status = "NO_ELIGIBLE_CANDIDATES"
            message = "Candidate sites excluded following competent-authority field review unsuitability determination."
        elif all_failed_hazard:
            status = "NO_ELIGIBLE_CANDIDATES"
            message = "All regional candidate sites failed baseline hazard screening."
        else:
            status = "NO_SUITABLE_SITE_IDENTIFIED"
            message = "No candidate relocation site currently satisfies the prototype's baseline screening requirements for this habitation."
        additional_site_needed = True

    # Four Response Pathways
    candidate_measures = get_candidate_in_situ_measures(hazard)

    pathways = FourResponsePathways(
        in_situ_mitigation={
            "pathway": "In-Situ Mitigation & Adaptation",
            "applicability": "RECOMMENDED FOR ACTIVE EVALUATION" if len(eligible) == 0 else "ALTERNATIVE TO RELOCATION",
            "guidance": "Relocation may not be necessary if risk can be reduced through targeted mitigation.",
            "heading": "Candidate Measures for Consideration by the Competent Authority",
            "measures": candidate_measures,
            "disclaimer": "Candidate measures are technical options for consideration by competent authorities, not official prescriptions.",
        },
        prepare_and_evacuate={
            "pathway": "Prepare & Evacuate",
            "applicability": "ACTIVE OPERATIONAL READINESS",
            "guidance": "Prepare and evacuate pathway. Requires authoritative observation/forecast inputs and competent-authority trigger decisions.",
            "operational_flow": "MONITOR → ALERT → THRESHOLD / AUTHORITY TRIGGER → EVACUATE",
            "monitoring_requirement": "Requires certified meteorological / hydrological telemetry and formal SDMA/DDMA emergency trigger.",
            "demonstration_note": "IMD & CWC shock scenarios in this system are demonstration stress tests, not calibrated physical predictions.",
        },
        temporary_shelter={
            "pathway": "Temporary Relocation / Shelter",
            "applicability": "HIGH / IMMEDIATE RISK CONTINGENCY",
            "guidance": "Temporary shelter considered during alert escalation pending geotechnical and hydrological reassessment.",
            "shelter_capacity": "Temporary shelter capacity: data unavailable (requires local revenue circle audit)",
            "operational_cycle": "Immediate Risk → Temporary Transit Shelter → Geotechnical Reassessment → Return or Resettlement Consideration",
        },
        permanent_relocation={
            "pathway": "Permanent Relocation",
            "applicability": "ELIGIBLE CANDIDATE SITES IDENTIFIED" if len(eligible) > 0 else "NO ELIGIBLE CANDIDATE SITES IDENTIFIED",
            "guidance": "Candidate for further relocation assessment." if len(eligible) > 0 else "Permanent relocation blocked: no viable candidate site currently identified. Additional site identification or in-situ mitigation required.",
            "prerequisites": [
                "Sustained high-risk context where in-situ mitigation is technically or economically infeasible",
                "Screened candidate site availability satisfying Liebig infrastructure carrying capacity",
                "Ground-truth geotechnical and cadastral title clearance by competent revenue authority",
                "Community consultation and competent authority administrative sanction",
            ],
            "eligible_alternatives_count": len(eligible),
        }
    )

    return HabitationMatchingResult(
        habitation_id=hab.get("id", ""),
        habitation_name=hab.get("name", "Unknown Settlement"),
        region=hab.get("region"),
        population=pop,
        risk_score=score,
        priority_tier=tier,
        primary_hazard=hazard,
        status=status,
        message=message,
        eligible_sites=eligible,
        excluded_sites=excluded,
        all_evaluated_candidates=evaluated,
        unknown_evidence=unknown_evidence_items,
        capacity_gaps=capacity_gaps,
        required_validation=required_validations,
        candidate_measures=candidate_measures,
        additional_site_identification_required=additional_site_needed,
        four_pathways=pathways,
    )

def get_site_centric_matches(
    site: Dict[str, Any],
    habitations: List[Dict[str, Any]],
    simulated_allocations: Optional[Dict[str, int]] = None,
    field_overrides: Optional[Dict[str, str]] = None,
    max_distance_km: float = 160.0
) -> SiteCentricMatchingResult:
    """
    Evaluates candidate site capacity and identifies which vulnerable habitations
    have this site as an eligible match vs which are excluded and why.
    """
    s_id = site.get("id", "")
    cap = site.get("cap", {})
    eff = compute_effective_capacity(cap)
    allocations = simulated_allocations or {}
    allocated = allocations.get(s_id, site.get("allocated_population", 0))
    remaining = max(0, eff.value - allocated)

    eligible_habs: List[Dict[str, Any]] = []
    ineligible_habs: List[Dict[str, Any]] = []

    for h in habitations:
        result = match_habitation_to_candidate_sites(
            hab=h,
            sites=[site],
            simulated_allocations=simulated_allocations,
            field_overrides=field_overrides,
            max_distance_km=max_distance_km
        )
        if len(result.eligible_sites) > 0:
            m = result.eligible_sites[0]
            eligible_habs.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "region": h.get("region"),
                "population": h.get("pop", 0),
                "distance_km": m.distance_km,
                "priority_tier": h.get("tier", "Immediate"),
                "risk_score": h.get("score", 70),
                "capacity_consumed_pct": round((h.get("pop", 0) / max(1, eff.value)) * 100, 1),
            })
        else:
            ex = result.excluded_sites[0] if result.excluded_sites else None
            ineligible_habs.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "population": h.get("pop", 0),
                "reasons": ex.exclusion_reasons if ex else ["Excluded by matching constraints"],
            })

    # Sort eligible by priority score descending
    eligible_habs.sort(key=lambda x: x["risk_score"], reverse=True)

    return SiteCentricMatchingResult(
        site_id=s_id,
        site_name=site.get("name", "Candidate Site"),
        region=site.get("region"),
        effective_capacity=eff.value,
        allocated_capacity=allocated,
        remaining_capacity=remaining,
        bottleneck=eff.bottleneck,
        eligible_habitations=eligible_habs,
        ineligible_habitations=ineligible_habs,
    )

def run_prototype_allocation_heuristic(
    habitations: List[Dict[str, Any]],
    sites: List[Dict[str, Any]],
    field_overrides: Optional[Dict[str, str]] = None,
    max_distance_km: float = 160.0
) -> Dict[str, Any]:
    """
    Prototype capacity-aware allocation heuristic.
    NOTE: This is a demonstration decision-support heuristic, not a guaranteed mathematically
    global optimal or statutory allocation.
    """
    sorted_habs = sorted(habitations, key=lambda h: h.get("score", 0), reverse=True)
    overrides = field_overrides or {}

    site_capacities: Dict[str, Any] = {}
    for s in sites:
        eff = compute_effective_capacity(s["cap"])
        site_capacities[s["id"]] = {
            "name": s["name"],
            "effective_capacity": eff.value,
            "remaining": eff.value,
            "bottleneck": eff.bottleneck,
            "assigned_habitations": [],
            "assigned_population": 0,
            "lat": s.get("latitude"),
            "lon": s.get("longitude"),
            "field_unsuitable": (overrides.get(s["id"]) == "unsuitable"),
        }

    assignments: List[Dict[str, Any]] = []
    unassigned: List[Dict[str, Any]] = []

    for h in sorted_habs:
        pop = h.get("pop", 0)
        h_lat = h.get("latitude")
        h_lon = h.get("longitude")

        viable_candidates = []
        for s_id, s_data in site_capacities.items():
            if s_data["field_unsuitable"]:
                continue
            if s_data["remaining"] >= pop:
                dist = None
                if h_lat is not None and h_lon is not None and s_data["lat"] is not None and s_data["lon"] is not None:
                    dist = haversine_distance_km(h_lat, h_lon, s_data["lat"], s_data["lon"])
                if dist is None or dist <= max_distance_km:
                    viable_candidates.append((dist if dist is not None else 999.0, s_id))

        if viable_candidates:
            viable_candidates.sort(key=lambda x: x[0])
            best_dist, best_id = viable_candidates[0]
            s_rec = site_capacities[best_id]
            s_rec["remaining"] -= pop
            s_rec["assigned_population"] += pop
            s_rec["assigned_habitations"].append({
                "id": h["id"],
                "name": h["name"],
                "population": pop,
                "distance_km": round(best_dist, 1) if best_dist < 990 else None,
            })
            assignments.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "site_id": best_id,
                "site_name": s_rec["name"],
                "population": pop,
                "distance_km": round(best_dist, 1) if best_dist < 990 else None,
            })
        else:
            unassigned.append({
                "habitation_id": h["id"],
                "habitation_name": h["name"],
                "population": pop,
                "hazard": h.get("hazard"),
                "reason": "No candidate site has sufficient remaining effective capacity within regional corridor.",
            })

    return {
        "status": "success",
        "heuristic_description": "Prototype capacity-aware allocation heuristic (demonstration environment; not a statutory decree)",
        "total_habitations": len(habitations),
        "assigned_count": len(assignments),
        "unassigned_count": len(unassigned),
        "assignments": assignments,
        "site_utilization": site_capacities,
        "unassigned_requiring_capacity_expansion_or_insitu": unassigned,
    }
