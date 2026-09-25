import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.capacity_service import compute_effective_capacity
from backend.services.risk_service import calculate_habitation_score
from backend.schemas.risk import RiskWeights
from backend.llm.explainer import validate_numerical_claims
from backend.decision.site_matching import (
    match_habitation_to_candidate_sites,
    get_site_centric_matches,
)

client = TestClient(app)

def test_1_one_habitation_multiple_eligible_sites():
    """TEST 1: One habitation -> multiple eligible candidate sites produces multiple ranked alternatives."""
    # H8: Kodagu Slope Settlement (pop 175)
    # Evaluated against S4 (Kannur, cap 300, ~75 km) and S1 (Meenangadi, cap 250, ~95 km)
    res = client.get("/api/relocation/match/H8?max_distance_km=120")
    assert res.status_code == 200
    data = res.json()

    assert data["status"] == "ELIGIBLE_OPTIONS_AVAILABLE"
    assert len(data["eligible_sites"]) >= 2
    
    # Verify contextual ranking
    ranks = [s["rank"] for s in data["eligible_sites"]]
    assert ranks == [1, 2]
    assert data["eligible_sites"][0]["rank"] == 1
    assert data["eligible_sites"][1]["rank"] == 2
    # Nearest / higher headroom site is rank 1
    assert data["eligible_sites"][0]["site_id"] in ["S4", "S1"]
    print(f"PASS: TEST 1 - H8 matched with {len(data['eligible_sites'])} eligible sites: {[s['site_name'] for s in data['eligible_sites']]}")

def test_2_multiple_habitations_finite_shared_capacity():
    """TEST 2: Multiple habitations -> same candidate site. Capacity is finite and tracked."""
    # S5 (Gopeshwar, cap 600)
    # H10: Kedarnath (pop 290)
    # H16: Dharasu (pop 390)
    # S5 cannot absorb both (290 + 390 = 680 > 600)
    # Verify site-centric view shows shared capacity
    res_site = client.get("/api/relocation/site-matches/S5")
    assert res_site.status_code == 200
    site_data = res_site.json()
    assert site_data["effective_capacity"] == 600
    assert site_data["remaining_capacity"] == 600

    # Simulate allocation of H10 (290) to S5
    res_alloc = client.post("/api/relocation/match/H16", json={
        "allocations": {"S5": 290},
        "field_overrides": {}
    })
    assert res_alloc.status_code == 200
    h16_data = res_alloc.json()

    # Now S5 remaining capacity is 600 - 290 = 310, which cannot absorb H16 (pop 390)
    s5_match = next((s for s in h16_data["all_evaluated_candidates"] if s["site_id"] == "S5"), None)
    assert s5_match is not None
    assert s5_match["is_eligible"] is False
    assert s5_match["remaining_capacity"] == 310
    assert s5_match["capacity_gap"] == 80  # 390 - 310 = 80
    assert any("Insufficient effective capacity" in r for r in s5_match["exclusion_reasons"])
    print("PASS: TEST 2 - Capacity correctly tracked as finite resource across multiple habitations")

def test_3_zero_eligible_sites():
    """TEST 3: Habitation with zero eligible candidate sites (e.g. Kuttanad Lowland Polder)."""
    # H14: Kuttanad Lowland Polder (pop 980). No local site can absorb 980 within corridor.
    res = client.get("/api/relocation/match/H14?max_distance_km=100")
    assert res.status_code == 200
    data = res.json()

    assert len(data["eligible_sites"]) == 0
    assert data["status"] in ["INSUFFICIENT_CAPACITY", "NO_SUITABLE_SITE_IDENTIFIED", "NO_ELIGIBLE_CANDIDATES"]
    assert data["additional_site_identification_required"] is True
    assert "No candidate relocation site currently satisfies" in data["message"] or "none possess sufficient" in data["message"]
    # Rejection reasons and candidate in-situ measures must be returned
    assert len(data["candidate_measures"]) > 0
    assert len(data["capacity_gaps"]) > 0 or len(data["excluded_sites"]) > 0
    print(f"PASS: TEST 3 - Zero eligible sites for Kuttanad handled with structured status '{data['status']}'")

def test_4_candidate_sites_exist_but_all_fail():
    """TEST 4: Candidate sites exist but all fail screening/distance constraints."""
    # Test habitation with dummy isolated coordinates far from any site
    hab_isolated = {
        "id": "H_ISO",
        "name": "Isolated Remote Settlement",
        "region": "Remote Island",
        "pop": 500,
        "latitude": 5.0,  # Far south in Indian ocean
        "longitude": 70.0,
        "hazard": "Cyclone",
        "score": 85,
        "tier": "Immediate",
    }
    dummy_sites = [
        {
            "id": "ST_FAIL",
            "name": "Failed Geotechnical Candidate",
            "cap": {"land": 600, "water": 600, "sanitation": 600, "healthcare": 600, "schools": 600},
            "hazard_screening": "FAIL",
            "latitude": 5.1,
            "longitude": 70.1,
        }
    ]
    result = match_habitation_to_candidate_sites(hab_isolated, dummy_sites)
    assert len(result.eligible_sites) == 0
    assert result.status == "NO_ELIGIBLE_CANDIDATES"
    assert len(result.excluded_sites) == 1
    assert any("Explicit baseline hazard screening failure" in r for r in result.excluded_sites[0].exclusion_reasons)
    print("PASS: TEST 4 - Candidate sites exist but all fail screening -> NO_ELIGIBLE_CANDIDATES")

def test_5_candidate_site_unknown_critical_evidence_preserved():
    """TEST 5: Candidate site has UNKNOWN critical evidence; not converted to PASS or falsely certified."""
    res = client.get("/api/relocation/match/H1")
    assert res.status_code == 200
    data = res.json()

    for s in data["all_evaluated_candidates"]:
        sm = s["screening_matrix"]
        assert sm["land_ownership"] == "UNKNOWN"
        assert sm["legal_encumbrance"] == "UNKNOWN"
        assert sm["environmental_restrictions"] == "UNKNOWN"
        assert sm["land_acquisition_feasibility"] == "NOT_ASSESSED"
        assert sm["field_verification"] in ["REQUIRED", "FAIL", "PASS"]
    print("PASS: TEST 5 - UNKNOWN and NOT_ASSESSED states strictly preserved")

def test_6_insufficient_capacity_gap_visible():
    """TEST 6: Insufficient capacity exposes exact capacity gap and shortfall."""
    # H1: Kavalapara (pop 340) vs S1 (Meenangadi, effective capacity 250)
    hab_kav = {"id": "H1", "name": "Kavalapara", "pop": 340, "latitude": 11.455, "longitude": 76.132, "hazard": "Landslide"}
    site_s1 = {"id": "S1", "name": "Meenangadi", "cap": {"land": 500, "water": 420, "sanitation": 380, "healthcare": 300, "schools": 250}, "latitude": 11.66, "longitude": 76.17}

    res = match_habitation_to_candidate_sites(hab_kav, [site_s1])
    assert len(res.eligible_sites) == 0
    assert len(res.excluded_sites) == 1
    match_s1 = res.excluded_sites[0]
    assert match_s1.capacity_gap == 90  # 340 - 250 = 90
    assert any("shortfall of 90" in r for r in match_s1.exclusion_reasons)
    print("PASS: TEST 6 - Insufficient capacity exposes exact deficit of 90 residents")

def test_7_passed_baseline_screening_not_safe():
    """TEST 7: Site passes baseline screening -> wording is 'Passed baseline screening', NOT 'Safe' or 'Certified'."""
    res = client.get("/api/relocation/match/H8?max_distance_km=120")
    assert res.status_code == 200
    data = res.json()

    for s in data["eligible_sites"]:
        status_txt = s["screening_status"]
        assert "Passed baseline screening" in status_txt
        assert "Safe" not in status_txt
        assert "Certified" not in status_txt
        assert "Guaranteed" not in status_txt
    print("PASS: TEST 7 - Rigorous wording 'Passed baseline screening' verified")

def test_8_field_review_marks_site_unsuitable_overrides_algorithm():
    """TEST 8: Field review override > automated output. Marked unsuitable site is excluded."""
    # Kodagu (H8) normally matches S4 (Kannur)
    # Apply override marking S4 unsuitable
    payload = {
        "allocations": {},
        "field_overrides": {"S4": "unsuitable"}
    }
    res = client.post("/api/relocation/match/H8?max_distance_km=120", json=payload)
    assert res.status_code == 200
    data = res.json()

    # S4 must NOT be in eligible_sites
    assert not any(s["site_id"] == "S4" for s in data["eligible_sites"])
    # S4 must be in excluded_sites with field review rejection reason
    s4_excluded = next((s for s in data["excluded_sites"] if s["site_id"] == "S4"), None)
    assert s4_excluded is not None
    assert any("field review marked site unsuitable" in r for r in s4_excluded["exclusion_reasons"])
    print("PASS: TEST 8 - Field review unsuitability correctly overrides automated recommendation")

def test_9_simulation_uses_selected_habitation_site_relationship():
    """TEST 9: Simulation reflects selected habitation-site relationship."""
    payload = {"habitation_id": "H4", "site_id": "S2"}
    res = client.post("/api/relocation/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["habitation_id"] == "H4"
    assert data["site_id"] == "S2"
    assert data["population"] == 210
    assert data["effective_capacity"] == 550
    assert data["capacity_exceeded"] is False
    assert data["travel_distance_km"] > 0
    print("PASS: TEST 9 - Simulation accurately computes before/after metrics for H4 -> S2")

def test_10_risk_engine_formula_unchanged():
    """TEST 10: MCDA risk engine remains strictly 0.30H + 0.25E + 0.20V + 0.15F + 0.10A."""
    hab_test = {
        "id": "HT",
        "name": "Formula Verification",
        "f": {
            "hazard": 80,
            "exposure": 60,
            "vulnerability": 70,
            "history": 60,
            "access": 40,
        }
    }
    # Expected score = 0.30*80 + 0.25*60 + 0.20*70 + 0.15*60 + 0.10*40
    # = 24.0 + 15.0 + 14.0 + 9.0 + 4.0 = 66.0 -> 66
    weights = RiskWeights(hazard=30, exposure=25, vulnerability=20, history=15, access=10)
    score = calculate_habitation_score(hab_test, weights)
    assert score == 66
    print(f"PASS: TEST 10 - MCDA formula 0.30H + 0.25E + 0.20V + 0.15F + 0.10A strictly verified (score={score})")

def test_11_liebig_capacity_formula_remains():
    """TEST 11: Liebig capacity remains min(Land, Water, Sanitation, Healthcare, Schools)."""
    cap = {
        "land": 1000,
        "water": 450,
        "sanitation": 800,
        "healthcare": 600,
        "schools": 320,
    }
    eff = compute_effective_capacity(cap)
    assert eff.value == 320
    assert eff.bottleneck == "schools"
    print("PASS: TEST 11 - Liebig Law min(L, W, S, H, Sc) strictly verified (eff=320, bottleneck=schools)")

def test_12_llm_explanation_cannot_override_structured_numbers():
    """TEST 12: LLM numerical claims validator rejects ungrounded numbers in administrative narrative."""
    facts = {
        "population": 340,
        "risk_score": 78,
        "capacity": 250,
        "transit_distance": 24,
    }
    valid_text = "The settlement has 340 residents and a risk score of 78. Effective capacity is 250 with 24 km transit."
    hallucinated_text = "The settlement has 12,000 residents and risk score of 99. The site holds 5,000 people across 300 km."

    is_valid, _ = validate_numerical_claims(valid_text, facts)
    assert is_valid is True

    is_invalid, unverified = validate_numerical_claims(hallucinated_text, facts)
    assert is_invalid is False
    assert len(unverified) >= 3
    print("PASS: TEST 12 - Numerical claims validator successfully blocks hallucinated figures")

if __name__ == "__main__":
    test_1_one_habitation_multiple_eligible_sites()
    test_2_multiple_habitations_finite_shared_capacity()
    test_3_zero_eligible_sites()
    test_4_candidate_sites_exist_but_all_fail()
    test_5_candidate_site_unknown_critical_evidence_preserved()
    test_6_insufficient_capacity_gap_visible()
    test_7_passed_baseline_screening_not_safe()
    test_8_field_review_marks_site_unsuitable_overrides_algorithm()
    test_9_simulation_uses_selected_habitation_site_relationship()
    test_10_risk_engine_formula_unchanged()
    test_11_liebig_capacity_formula_remains()
    test_12_llm_explanation_cannot_override_structured_numbers()
    print("\nALL 12 MANDATORY PATCH TESTS COMPLETED SUCCESSFULLY!")
