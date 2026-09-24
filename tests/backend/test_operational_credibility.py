import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app
from backend.llm.explainer import validate_numerical_claims

client = TestClient(app)

def test_mcda_factor_methodology_and_audit_provenance():
    """Verify deterministic Assessment ID, data version, and methodology in breakdown."""
    res = client.get("/api/risk/habitations/H1/breakdown")
    assert res.status_code == 200
    data = res.json()
    assert data["assessment_id"] == "SRK-2026-H1-v1"
    assert data["data_version"] == "2026.09-demo"
    assert "LIMITED EVIDENCE" in data["evidence_status"]
    assert "provenance_chain" in data
    assert len(data["provenance_chain"]) >= 6

    # Verify factor methodological transparency
    factors = data["factors"]
    assert len(factors) == 5
    for f in factors:
        assert "factor" in f
        assert "value" in f
        assert "contribution" in f
        assert "raw_value" in f
        assert "source" in f
        assert "vintage" in f
        assert "method" in f
        assert "status" in f
        assert "indicator_note" in f

    # Verify slope phrasing honesty
    hazard_factor = next(x for x in factors if x["factor"] == "hazard")
    assert "slope" in hazard_factor["indicator_note"].lower()
    assert "contributing indicator" in hazard_factor["indicator_note"].lower()
    print("PASS: test_mcda_factor_methodology_and_audit_provenance")

def test_candidate_site_screening_matrix_and_unknown_preservation():
    """Verify candidate screening matrix preserves UNKNOWN states without false PASS conversions."""
    res = client.get("/api/relocation/sites")
    assert res.status_code == 200
    sites = res.json()
    assert len(sites) > 0

    first = sites[0]
    assert "MODEL-SCREENED" in first["site_status"] and "EXTERNAL VALIDATION REQUIRED" in first["site_status"]
    assert "screening_matrix" in first
    sm = first["screening_matrix"]

    # Verify 12-dimension candidate site screening matrix presence
    expected_dims = [
        "hazard_screening", "carrying_capacity", "drinking_water",
        "sanitation", "healthcare", "schools", "transit_access",
        "land_ownership", "legal_encumbrance", "environmental_restrictions",
        "land_acquisition_feasibility", "field_verification"
    ]
    assert len(expected_dims) == 12
    for dim in expected_dims:
        assert dim in sm, f"Missing screening dimension: {dim}"

    # Verify unassessed legal and revenue dimensions remain UNKNOWN
    assert sm["land_ownership"] == "UNKNOWN"
    assert sm["legal_encumbrance"] == "UNKNOWN"
    assert sm["field_verification"] == "REQUIRED"

    # Verify why this / why not this site & primary blockers
    assert "why_this_site" in first
    assert len(first["why_this_site"]) > 0
    assert "why_not_this_site" in first
    assert len(first["why_not_this_site"]) > 0
    assert "primary_blockers" in first
    assert len(first["primary_blockers"]) > 0
    print("PASS: test_candidate_site_screening_matrix_and_unknown_preservation")

def test_simulation_decision_status_and_blockers():
    """Verify simulation generates honest decision status, blockers, and AI explanation tags."""
    payload = {"habitation_id": "H1", "site_id": "S1"}
    res = client.post("/api/relocation/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert "decision_status" in data
    assert data["decision_status"] in [
        "VIABLE CANDIDATE MATCH",
        "NO SUITABLE RELOCATION OPTION IDENTIFIED WITH CURRENT EVIDENCE"
    ]
    assert "primary_blockers" in data
    assert isinstance(data["primary_blockers"], list)
    assert "why_this_site" in data
    assert "why_not_this_site" in data
    assert data["source_assessment_id"] == "SRK-2026-H1-S1"
    assert data["source_evidence_version"] == "2026.09-demo"
    assert "AI Explainer" in data["explanation_layer"] or "AI EXPLANATION" in data["explanation_layer"].upper()
    assert "DDMA" in data["human_review_status"] or "HUMAN" in data["human_review_status"]
    print(f"PASS: test_simulation_decision_status_and_blockers (Decision Status: {data['decision_status']})")

def test_llm_numerical_claims_validation():
    """Verify numerical claims validator detects discrepancies between LLM text and structured facts."""
    facts = {
        "habitation_name": "Chooralmala",
        "population": 1250,
        "score": 84,
        "effective_capacity": 300,
        "travel_distance_km": 14,
    }

    # Consistent narrative
    truthful_narrative = (
        "Chooralmala has an exposed population of 1,250 residents and a composite risk score of 84/100. "
        "The candidate relocation site offers an effective carrying capacity of 300 persons over a 14 km transit corridor."
    )
    is_valid, unverified = validate_numerical_claims(truthful_narrative, facts)
    assert is_valid is True
    assert len(unverified) == 0

    # Hallucinated narrative with fabricated figures
    hallucinated_narrative = (
        "Chooralmala houses 9,800 people with a risk index of 99/100. "
        "The new site accommodates 5,000 residents across a 120 km highway."
    )
    is_valid_bad, unverified_bad = validate_numerical_claims(hallucinated_narrative, facts)
    assert is_valid_bad is False
    assert len(unverified_bad) > 0
    assert any("9800" in u for u in unverified_bad)
    print("PASS: test_llm_numerical_claims_validation")

def test_executive_brief_no_statutory_decree():
    """Verify executive brief uses decision-support language rather than statutory order decree."""
    payload = {"habitation_id": "H1", "site_id": "S1"}
    res = client.post("/api/reports/generate-brief", json=payload)
    assert res.status_code == 200
    data = res.json()

    # Title check
    assert "OFFICE MEMORANDUM: Statutory Relocation Order" not in data["title"]
    assert "EXECUTIVE DECISION-SUPPORT BRIEF" in data["title"]
    assert "Kavalapara Hamlet" in data["title"]

    # Verification consistency check
    assert "is_verified_against_evidence" in data
    assert isinstance(data["is_verified_against_evidence"], bool)
    assert "unverified_claims" in data
    assert isinstance(data["unverified_claims"], list)
    assert "evidence_grounding_summary" in data

    # Governance metadata
    assert data["source_assessment_id"] == "SRK-2026-H1"
    assert data["source_evidence_version"] == "2026.09-demo"
    assert "AI Explainer" in data["explanation_layer"] or "AI EXPLANATION" in data["explanation_layer"].upper()
    assert "DDMA" in data["human_review_status"] or "HUMAN" in data["human_review_status"]
    print("PASS: test_executive_brief_no_statutory_decree")

if __name__ == "__main__":
    test_mcda_factor_methodology_and_audit_provenance()
    test_candidate_site_screening_matrix_and_unknown_preservation()
    test_simulation_decision_status_and_blockers()
    test_llm_numerical_claims_validation()
    test_executive_brief_no_statutory_decree()
    print("ALL OPERATIONAL CREDIBILITY TESTS PASSED!")
