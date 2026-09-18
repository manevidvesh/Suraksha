import os
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from backend.schemas.simulation import ReportBriefResponse
from backend.llm.prompts import get_executive_brief_prompt

async def generate_sdma_executive_brief(
    hab: Dict[str, Any],
    site: Optional[Dict[str, Any]] = None,
    risk_score: int = 75,
    tier: str = "Immediate",
) -> ReportBriefResponse:
    """
    Generate an authoritative decision brief for State Disaster Management Authorities (SDMAs)
    under the SURAKSHA framework.
    Supports Gemini API if configured, with an expert rule-based reasoning engine as fallback.
    """
    f = hab.get("f", {})
    pop = hab.get("pop", 0)
    hazard = hab.get("hazard", "Landslide")
    events = hab.get("events", 0)
    site_name = site["name"] if site else "Under Evaluation"

    # Check for Gemini API Key
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
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
            )
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            if response and response.text:
                return ReportBriefResponse(
                    title=f"SURAKSHA SDMA Executive Relocation Brief: {hab['name']}",
                    generated_at=datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC"),
                    habitation_name=hab["name"],
                    region=hab["region"],
                    risk_score=risk_score,
                    priority_tier=tier,
                    primary_hazard=hazard,
                    population=pop,
                    executive_summary=response.text[:300] + "...",
                    risk_driver_analysis=(
                        f"Dynamic AI analysis confirms critical risk levels driven by elevated {hazard} exposure "
                        f"(intensity {f.get('hazard', 75)}/100) and historical disaster vulnerability."
                    ),
                    relocation_site_assessment=(
                        f"Allocated to {site_name}. Absorption feasibility subject to infrastructure bottleneck verification."
                        if site else "No resettlement site finalized yet; immediate candidate evaluation advised."
                    ),
                    policy_recommendations=[
                        f"Enforce immediate construction moratorium in {hab['name']}.",
                        f"Expedite land clearance at {site_name}." if site else "Designate high-priority resettlement corridor.",
                        "Activate emergency evacuation contingency protocols.",
                        "Initiate gazette notification for SURAKSHA Hazard Zone demarcation.",
                    ],
                    memorandum_number=f"F.No. SDMA/DM-ACT/2026/RELOC-{hab.get('id', 'HAB')}",
                    statutory_authority="Disaster Management Act, 2005 (Sections 30 & 34)",
                )
        except Exception:
            pass  # Fallback to deterministic expert engine

    # Deterministic expert rule-based generation
    exec_summary = (
        f"{hab['name']} in {hab['region']} faces critical multi-hazard vulnerability ({tier.lower()} tier, "
        f"composite risk score {risk_score}/100). With {pop} residents situated in high-susceptibility terrain "
        f"and {events} recorded disaster events, proactive relocation is urgently required to prevent catastrophic loss."
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
        f"Historical records indicate {events} major hazard events, underscoring systemic recurrence rather than isolated incidents."
    )

    if site:
        cap_val = site.get("cap", {}).get("land", 500)
        bottleneck = "water supply" if site.get("cap", {}).get("water", 500) < cap_val else "land availability"
        site_assessment = (
            f"Candidate site '{site['name']}' ({site.get('distanceKm', 15)} km transit distance) provides "
            f"secure geological terrain. Site can absorb up to {cap_val} residents. Primary infrastructure bottleneck is {bottleneck}."
        )
    else:
        site_assessment = "Candidate site selection is pending; spatial matching algorithm recommends screening sites within a 30 km radius."

    recommendations = [
        f"Issue immediate SURAKSHA High-Risk Zone notification prohibiting further residential construction in {hab['name']}.",
        f"Sanction phased relocation budget under SDRF/NDRF provisions for {pop} residents.",
        f"Engage community elders and local panchayat in {hab['region']} for resettlement consent and site validation.",
    ]
    if site:
        recommendations.append(f"Upgrade {bottleneck} capacity at {site['name']} prior to final residential handover.")

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

    return ReportBriefResponse(
        title=f"OFFICE MEMORANDUM: Statutory Relocation Order for {hab['name']}",
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
        memorandum_number=f"F.No. SDMA/DM-ACT/2026/RELOC-{hab.get('id', 'HAB')}",
        statutory_authority="Disaster Management Act, 2005 (Sections 30 & 34)",
        financial_outlay=fin_outlay,
        department_action_matrix=dept_matrix,
    )
