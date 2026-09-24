from typing import Dict, Any, List
from backend.schemas.simulation import SimulationResponse, MetricComparison
from backend.services.capacity_service import compute_effective_capacity, CAP_LABELS
from backend.services.hazard_service import haversine_distance_km

def simulate_relocation(hab: Dict[str, Any], site: Dict[str, Any]) -> SimulationResponse:
    eff = compute_effective_capacity(site["cap"])
    pop = hab.get("pop", 0)
    f = hab.get("f", {})
    
    # Calculate GIS distance if lat/long are present
    dist_km = site.get("distanceKm", 15.0)
    if (hab.get("latitude") and hab.get("longitude") and
        site.get("latitude") and site.get("longitude")):
        dist_km = haversine_distance_km(
            hab["latitude"], hab["longitude"],
            site["latitude"], site["longitude"]
        )

    # Before metrics
    before_hazard = float(f.get("hazard", 70))
    before_exposure = float(f.get("exposure", 70))
    before_access = float(100 - f.get("access", 50))  # accessibility to services

    # After metrics
    after_hazard = float(max(8, round(before_hazard * 0.18)))
    after_exposure = float(max(10, round(before_exposure * 0.35)))
    after_access = float(max(60, min(95, 100 - round(dist_km / 2.5))))

    hazard_reduction_pct = int(round(100 - (after_hazard / max(1, before_hazard)) * 100))
    exposure_reduction_pct = int(round(100 - (after_exposure / max(1, before_exposure)) * 100))
    access_improvement_pct = int(round(after_access - before_access))

    capacity_exceeded = pop > eff.value

    radar_data = [
        MetricComparison(metric="Hazard exposure", Before=before_hazard, After=after_hazard),
        MetricComparison(metric="Population exposure", Before=before_exposure, After=after_exposure),
        MetricComparison(metric="Service access", Before=before_access, After=after_access),
    ]

    bottleneck_label = CAP_LABELS.get(eff.bottleneck, eff.bottleneck)
    if capacity_exceeded:
        summary_msg = (
            f"Relocating {pop} residents exceeds {site['name']}'s effective capacity of {eff.value} "
            f"(bottleneck: {bottleneck_label.lower()}). Phased relocation or expanding {bottleneck_label.lower()} required."
        )
    else:
        summary_msg = (
            f"Relocation viable: {site['name']} can accommodate all {pop} residents with "
            f"{eff.value - pop} spare capacity before reaching {bottleneck_label.lower()} bottleneck."
        )

    import math
    from backend.schemas.simulation import FinancialOutlayBreakdown, DepartmentActionTask

    households = max(1, int(math.ceil(pop / 4.2)))
    pmay_crores = round((households * 1.30) / 100, 2)
    land_dev_crores = round((households * 0.80) / 100, 2)
    infra_crores = round((households * 1.20) / 100, 2)
    total_crores = round(pmay_crores + land_dev_crores + infra_crores, 2)
    ndrf_crores = round(total_crores * 0.75, 2)
    sdrf_crores = round(total_crores - ndrf_crores, 2)

    fin_outlay = FinancialOutlayBreakdown(
        households_count=households,
        total_crores=total_crores,
        pmay_housing_crores=pmay_crores,
        land_development_crores=land_dev_crores,
        infrastructure_crores=infra_crores,
        ndrf_central_share_crores=ndrf_crores,
        sdrf_state_share_crores=sdrf_crores,
    )

    dept_matrix = [
        DepartmentActionTask(
            department="Revenue & Land Records",
            designation="Tehsildar / Sub-Collector",
            mandate=f"Cadastral survey of {site['name']}, demarcation of {households} plots (3 cents each), and distribution of freehold title deeds (Pattas).",
            timeline="30 Days"
        ),
        DepartmentActionTask(
            department="Public Works Department (PWD)",
            designation="Executive Engineer (Roads & Bridges)",
            mandate=f"Slope grading, construction of all-weather bituminous access road ({dist_km} km transit link), and stormwater masonry drains.",
            timeline="60 Days"
        ),
        DepartmentActionTask(
            department="Public Health Engineering / Jal Shakti",
            designation="Executive Engineer (PHED)",
            mandate=f"Drilling deep bore-well, overhead distribution reservoir, and piped drinking water grid for {pop} residents under Jal Jeevan Mission.",
            timeline="45 Days"
        ),
        DepartmentActionTask(
            department="Health & Family Welfare",
            designation="District Medical Officer (DMO)",
            mandate="Operationalization of Ayushman Bharat Health & Wellness Sub-Centre with cold-chain immunization and bi-weekly mobile medical unit.",
            timeline="60 Days"
        ),
        DepartmentActionTask(
            department="School Education & Literacy",
            designation="District Education Officer (DEO)",
            mandate=f"Expansion of classroom capacity at nearest Government Primary School and establishment of Anganwadi feeding centre.",
            timeline="90 Days"
        ),
    ]

    if capacity_exceeded:
        decision_status = "NO SUITABLE RELOCATION OPTION IDENTIFIED WITH CURRENT EVIDENCE"
        blockers = [
            f"Carrying capacity exceeded: population of {pop} exceeds site limit of {eff.value} residents",
            f"Constrained by {bottleneck_label.lower()} infrastructure threshold",
            "Cadastral land ownership is UNKNOWN (FIELD VERIFICATION REQUIRED)",
        ]
        why_not = [
            f"Cannot accommodate complete population of {pop} (capacity shortfall of {pop - eff.value} residents).",
            f"Primary infrastructure bottleneck is {bottleneck_label.lower()} at {eff.value} residents.",
            "Cadastral land ownership and legal encumbrances are UNKNOWN.",
            "Livelihood continuity is NOT ASSESSED (requires socioeconomic field survey).",
        ]
    else:
        decision_status = "VIABLE CANDIDATE MATCH"
        blockers = [
            "Cadastral land ownership is UNKNOWN (FIELD VERIFICATION REQUIRED)",
            "Livelihood continuity requires local socioeconomic survey",
        ]
        why_not = [
            f"Future settlement expansion strictly bounded by {bottleneck_label.lower()} bottleneck ({eff.value} max).",
            "Land title, encumbrance, and Gram Sabha consent are UNKNOWN.",
            "Livelihood continuity is NOT ASSESSED in prototype dataset.",
        ]

    why_this = [
        f"Significant hazard reduction: estimated {hazard_reduction_pct}% reduction in multi-hazard vulnerability.",
        f"Road transit distance: {dist_km} km between origin and candidate resettlement site.",
        f"Liebig effective carrying capacity can absorb {min(pop, eff.value)} residents.",
    ]

    assessment_id = f"SRK-2026-{hab.get('id', 'HAB')}-{site.get('id', 'SITE')}"

    return SimulationResponse(
        habitation_id=hab["id"],
        habitation_name=hab["name"],
        site_id=site["id"],
        site_name=site["name"],
        population=pop,
        effective_capacity=eff.value,
        bottleneck=eff.bottleneck,
        travel_distance_km=dist_km,
        hazard_reduction_pct=hazard_reduction_pct,
        exposure_reduction_pct=exposure_reduction_pct,
        access_improvement_pct=access_improvement_pct,
        capacity_exceeded=capacity_exceeded,
        radar_data=radar_data,
        summary_message=summary_msg,
        financial_outlay=fin_outlay,
        department_matrix=dept_matrix,
        decision_status=decision_status,
        why_this_site=why_this,
        why_not_this_site=why_not,
        primary_blockers=blockers,
        source_assessment_id=assessment_id,
        source_evidence_version="2026.09-demo",
        explanation_layer="SURAKSHA AI Explainer",
        human_review_status="PENDING DDMA REVIEW",
    )
