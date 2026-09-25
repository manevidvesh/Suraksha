import os
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from backend.schemas.simulation import ReportBriefResponse
from backend.llm.prompts import get_executive_brief_prompt

def validate_numerical_claims(text: str, allowed_facts: Dict[str, Any]) -> tuple[bool, list[str]]:
    """
    Validates numbers in generated explanation against structured input facts.
    Checks whether numerical claims in the generated explanation are consistent with structured assessment facts available to the system.
    It does not certify the overall factual accuracy of the generated narrative.
    Returns (is_verified, unverified_claims).
    """
    import re
    text_clean = text.replace(',', '')
    numbers_in_text = re.findall(r'\b\d+(?:\.\d+)?\b', text_clean)
    allowed_values = set()
    for v in allowed_facts.values():
        if isinstance(v, (int, float)):
            allowed_values.add(str(int(v)))
            allowed_values.add(str(v))
        elif isinstance(v, dict):
            for sub_v in v.values():
                if isinstance(sub_v, (int, float)):
                    allowed_values.add(str(int(sub_v)))
                    allowed_values.add(str(sub_v))

    # Known observation years, administrative timeline days, statutory act years
    benign_numbers = {
        "2005", "2011", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "30", "45", "60", "90", "100"
    }

    unverified = []
    for num in numbers_in_text:
        if num not in allowed_values and num not in benign_numbers:
            unverified.append(f"Unverified number '{num}' in narrative requires evidence reconciliation")

    return len(unverified) == 0, unverified

async def generate_sdma_executive_brief(
    hab: Dict[str, Any],
    site: Optional[Dict[str, Any]] = None,
    risk_score: int = 75,
    tier: str = "Immediate",
) -> ReportBriefResponse:
    """
    Generate an executive decision-support brief for State Disaster Management Authorities (SDMAs)
    under the SURAKSHA framework.
    Supports Gemini API if configured, with an expert rule-based reasoning engine as fallback.
    """
    f = hab.get("f", {})
    pop = hab.get("pop", 0)
    hazard = hab.get("hazard", "Landslide")
    events = hab.get("events", 0)
    site_name = site["name"] if site else "Under Evaluation"
    assessment_id = f"SRK-2026-{hab.get('id', 'HAB')}"

    allowed_facts = {
        "population": pop,
        "risk_score": risk_score,
        "hazard_intensity": f.get("hazard", 75),
        "events": events,
        "factors": f,
    }
    if site:
        allowed_facts["capacity"] = site.get("eff", {}).get("value", 500)
        allowed_facts["transit_distance"] = site.get("distanceKm", 15)

    # Check for Gemini API Key
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            cap_info = site.get("eff", {}) if site else {}
            bottleneck = cap_info.get("bottleneck") if site else None
            capacity_val = cap_info.get("value") if site else None
            prompt = get_executive_brief_prompt(
                hab_name=hab["name"],
                region=hab["region"],
                pop=pop,
                hazard=hazard,
                risk_score=risk_score,
                tier=tier,
                factors=f,
                events=events,
                site_name=site_name,
                bottleneck=bottleneck,
                capacity_val=capacity_val,
            )
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            if response and response.text:
                exec_text = response.text[:350] + "..."
                is_verified, unverified = validate_numerical_claims(exec_text, allowed_facts)
                return ReportBriefResponse(
                    title=f"EXECUTIVE DECISION-SUPPORT BRIEF: Relocation Planning Assessment for {hab['name']}",
                    generated_at=datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC"),
                    habitation_name=hab["name"],
                    region=hab["region"],
                    risk_score=risk_score,
                    priority_tier=tier,
                    primary_hazard=hazard,
                    population=pop,
                    executive_summary=exec_text,
                    risk_driver_analysis=(
                        f"MCDA evidence analysis confirms critical risk levels driven by elevated {hazard} exposure "
                        f"(intensity {f.get('hazard', 75)}/100) and historical disaster recurrence frequency."
                    ),
                    relocation_site_assessment=(
                        f"Allocated to candidate site '{site_name}'. Absorption feasibility strictly constrained by {bottleneck or 'infrastructure'} bottleneck."
                        if site else "No resettlement site finalized yet; immediate candidate evaluation advised."
                    ),
                    policy_recommendations=[
                        f"Issue candidate High-Risk Zone advisory halting further unreinforced construction in {hab['name']}.",
                        f"Expedite field engineering and title clearance at {site_name}." if site else "Designate high-priority resettlement corridor.",
                        "Activate emergency evacuation contingency protocols.",
                        "Human / competent-authority review required prior to administrative or legal execution.",
                    ],
                    memorandum_number=f"SRK-2026-RELOC-{hab.get('id', 'HAB')}",
                    statutory_authority="Disaster Management Planning Framework · Decision Support Output",
                    source_assessment_id=assessment_id,
                    source_evidence_version="2026.09-demo",
                    explanation_layer="SURAKSHA AI Explainer",
                    human_review_status="PENDING DDMA REVIEW",
                    is_verified_against_evidence=is_verified,
                    unverified_claims=unverified,
                    evidence_grounding_summary=allowed_facts,
                )
        except Exception:
            pass  # Fallback to deterministic expert engine

    # Deterministic expert rule-based generation
    exec_summary = (
        f"{hab['name']} in {hab['region']} faces critical multi-hazard vulnerability ({tier.lower()} tier, "
        f"composite MCDA risk score {risk_score}/100). With {pop} residents situated in high-susceptibility terrain "
        f"and {events} recorded disaster events in the 2018–2024 demonstration observation period, proactive relocation planning is recommended."
    )

    drivers = []
    if f.get("hazard", 0) >= 70:
        drivers.append(f"severe natural hazard exposure ({f.get('hazard')}/100)")
    if f.get("exposure", 0) >= 70:
        drivers.append(f"high population density in active impact path ({f.get('exposure')}/100)")
    if f.get("vulnerability", 0) >= 70:
        drivers.append(f"acute socioeconomic vulnerability ({f.get('vulnerability')}/100)")
    if f.get("access", 0) >= 60:
        drivers.append(f"critical accessibility deficit ({f.get('access')}/100)")

    driver_analysis = (
        f"Primary risk drivers identified: {', '.join(drivers)}. "
        f"Historical records indicate {events} major hazard events in the 2018–2024 observation period, underscoring recurrence risks."
    )

    if site:
        cap_val = site.get("eff", {}).get("value", site.get("cap", {}).get("land", 500))
        bottleneck = site.get("eff", {}).get("bottleneck", "water")
        site_assessment = (
            f"Candidate site '{site['name']}' ({site.get('distanceKm', 15)} km transit distance) has "
            f"passed baseline GIS hazard screening in the demonstration model. Site can absorb up to {cap_val} residents under prototype capacity model. Primary infrastructure bottleneck is {bottleneck}."
        )
    else:
        site_assessment = "Candidate site selection is pending; spatial matching algorithm recommends screening sites within a 30 km radius."

    recommendations = [
        f"Issue candidate High-Risk Zone advisory halting further unreinforced construction in {hab['name']}.",
        f"Sanction phased relocation budget under SDRF/NDRF provisions for {pop} residents subject to DDMA verification.",
        f"Engage community elders and local panchayat in {hab['region']} for resettlement consent and site validation.",
    ]
    if site:
        recommendations.append(f"Upgrade {bottleneck} capacity at {site['name']} prior to final residential handover.")
    recommendations.append("Human / competent-authority review required prior to administrative or legal execution.")

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

    dest_name = site["name"] if site else "Designated District Resettlement Site"
    transit_dist = site.get("distanceKm", 15) if site else 15

    dept_matrix = [
        DepartmentActionTask(
            department="Revenue & Land Records",
            designation="Tehsildar / Sub-Collector",
            mandate=f"Cadastral survey of {dest_name}, demarcation of {households} plots (3 cents each), and distribution of freehold title deeds (Pattas).",
            timeline="30 Days"
        ),
        DepartmentActionTask(
            department="Public Works Department (PWD)",
            designation="Executive Engineer (Roads & Bridges)",
            mandate=f"Slope grading, construction of all-weather bituminous access road ({transit_dist} km transit link), and stormwater masonry drains.",
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

    is_verified, unverified = validate_numerical_claims(exec_summary + " " + driver_analysis, allowed_facts)

    return ReportBriefResponse(
        title=f"EXECUTIVE DECISION-SUPPORT BRIEF: Relocation Planning Assessment for {hab['name']}",
        generated_at=datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC"),
        habitation_name=hab["name"],
        region=hab["region"],
        risk_score=risk_score,
        priority_tier=tier,
        primary_hazard=hazard,
        population=pop,
        executive_summary=exec_summary,
        risk_driver_analysis=driver_analysis,
        relocation_site_assessment=site_assessment,
        policy_recommendations=recommendations,
        memorandum_number=f"SRK-2026-RELOC-{hab.get('id', 'HAB')}",
        statutory_authority="Disaster Management Planning Framework · Decision-Support Output (Not a Statutory Order)",
        financial_outlay=fin_outlay,
        department_action_matrix=dept_matrix,
        source_assessment_id=assessment_id,
        source_evidence_version="2026.09-demo",
        explanation_layer="SURAKSHA AI Explainer",
        human_review_status="PENDING DDMA REVIEW",
        is_verified_against_evidence=is_verified,
        unverified_claims=unverified,
        evidence_grounding_summary=allowed_facts,
    )
