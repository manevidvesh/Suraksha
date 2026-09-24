import json
from typing import Dict, Any, Optional

SURAKSHA_SYSTEM_INSTRUCTION = """You are the explanation layer for SURAKSHA (Spatial Unified Risk Assessment & Knowledge-based Settlement Housing Allocation).

STRICT TECHNICAL GOVERNANCE & ANTI-HALLUCINATION RULES:
1. You are an explanation layer. Use ONLY the structured evidence supplied by the backend.
2. Do not invent numerical values, locations, government policies, hazard classifications, infrastructure capacity, historical events, legal designations, or recommendations unsupported by the supplied evidence.
3. Do not modify backend scores or calculations.
4. Do not create missing data. If information is unavailable, explicitly state that it is unavailable.
5. Explain the supplied assessment clearly, rigorously, and objectively for human decision-makers (District Collector & DDMA officials).
6. Remind decision-makers that final statutory designation and administrative action under the Disaster Management Act, 2005 occur outside this system and require competent human authority approval."""

def get_executive_brief_prompt(
    hab_name: str,
    region: str,
    pop: int,
    hazard: str,
    risk_score: int,
    tier: str,
    factors: dict,
    events: int,
    site_name: str = "Under Evaluation",
    bottleneck: Optional[str] = None,
    capacity_val: Optional[int] = None,
) -> str:
    """Prompt template for SDMA executive briefs with strict factual grounding."""
    structured_payload = {
        "habitation": hab_name,
        "region": region,
        "population": pop,
        "primary_hazard": hazard,
        "mcda_risk_score": risk_score,
        "priority_tier": tier,
        "factor_indices": {
            "hazard_intensity": factors.get("hazard", 0),
            "population_exposure": factors.get("exposure", 0),
            "social_vulnerability": factors.get("vulnerability", 0),
            "historical_frequency": factors.get("history", 0),
            "access_deficit": factors.get("access", 0),
        },
        "recorded_past_disaster_events": events,
        "candidate_relocation_site": site_name,
        "infrastructure_bottleneck": bottleneck or "under evaluation",
        "effective_capacity": capacity_val if capacity_val is not None else "pending verification",
        "provenance": "SURAKSHA PostGIS Spatial + Deterministic MCDA Engine",
    }

    return f"""{SURAKSHA_SYSTEM_INSTRUCTION}

STRUCTURED EVIDENCE SUPPLIED BY BACKEND:
{json.dumps(structured_payload, indent=2)}

TASK:
Synthesize a concise, fact-grounded relocation decision brief based strictly on the above structured evidence:
1. Executive Summary (2-3 sentences reflecting the exact population and priority tier)
2. Risk Driver Analysis (explain the primary risk factors based on the factor indices provided)
3. Candidate Site Carrying Capacity Assessment (highlight the bottleneck constraint and effective capacity)
4. Actionable Policy Recommendations (concrete, standard inter-agency tasks for DDMA/SDMA review)

Maintain an objective, factual, and policy-focused tone. Do not fabricate external data.
"""
