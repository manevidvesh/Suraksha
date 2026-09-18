from typing import Dict, Any, Tuple

def evaluate_site_capacity(cap: Dict[str, int], population_to_absorb: int) -> Tuple[bool, str, int]:
    """
    Evaluates whether site infrastructure can absorb incoming population.
    Returns: (can_absorb, bottleneck_name, remaining_or_deficit)
    """
    bottleneck = "land"
    min_cap = float("inf")

    for k, v in cap.items():
        if v < min_cap:
            min_cap = v
            bottleneck = k

    diff = int(min_cap) - population_to_absorb
    can_absorb = diff >= 0
    return can_absorb, bottleneck, diff
