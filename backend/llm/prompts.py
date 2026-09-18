def get_executive_brief_prompt(
    hab_name: str,
    region: str,
    pop: int,
    hazard: str,
    risk_score: int,
    tier: str,
    factors: dict,
    events: int,
    site_name: str = "Under Evaluation"
) -> str:
    """Prompt template for SDMA executive briefs."""
    return f"""You are the Chief GIS Disaster Risk Analyst for SURAKSHA (Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation), serving State and District Disaster Management Authorities.

Prepare a formal, authoritative, and actionable relocation decision brief for:
- Habitation: {hab_name} ({region})
- Population: {pop}
- Primary Hazard: {hazard}
- Composite Risk Score: {risk_score}/100 (Tier: {tier})
- Factor Metrics: Hazard={factors.get('hazard')}, Exposure={factors.get('exposure')}, Social Vulnerability={factors.get('vulnerability')}, History={factors.get('history')}, Access Deficit={factors.get('access')}
- Recorded Past Events: {events}
- Candidate Resettlement Site: {site_name}

Provide:
1. Executive Summary (2-3 sentences)
2. Risk Driver Analysis
3. Site Carrying Capacity Assessment
4. 3-4 Concrete Policy Action Directives
Maintain an objective, authoritative, and policy-focused tone.
"""
