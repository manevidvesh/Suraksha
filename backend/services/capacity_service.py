from typing import Dict, Any
from backend.schemas.relocation import SiteEffectiveCapacity

CAP_LABELS = {
    "land": "Land availability",
    "water": "Water supply",
    "sanitation": "Sanitation",
    "healthcare": "Healthcare",
    "schools": "Schools",
}

def compute_effective_capacity(cap_dict: Dict[str, int]) -> SiteEffectiveCapacity:
    """
    Effective carrying capacity is strictly governed by Liebig's Law of the Minimum:
    The most constrained critical infrastructure dimension dictates maximum population absorption.
    """
    bottleneck_key = "land"
    min_val = float("inf")

    for k, v in cap_dict.items():
        if v < min_val:
            min_val = v
            bottleneck_key = k

    return SiteEffectiveCapacity(value=int(min_val), bottleneck=bottleneck_key)
