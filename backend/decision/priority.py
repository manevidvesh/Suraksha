from typing import List, Dict, Any

def rank_by_priority(habitations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Ranks habitations strictly by risk score descending."""
    return sorted(habitations, key=lambda h: h.get("score", 0), reverse=True)

def classify_urgency_tier(score: float) -> str:
    """Classifies risk score into standard disaster management tiers."""
    if score >= 70.0:
        return "Immediate"
    elif score >= 45.0:
        return "Short-term"
    return "Medium-term"
