from typing import Dict, Any, List

def check_environmental_constraints(site: Dict[str, Any]) -> Dict[str, Any]:
    """
    Checks if a candidate resettlement site violates any exclusion constraints:
    - Slope > 20 degrees
    - Distance to flood zone < 500m
    - Protected forest area intersection
    """
    violations: List[str] = []
    slope = site.get("slope_deg", 5.0)
    if slope > 20.0:
        violations.append(f"Slope exceeds permissible threshold ({slope}° > 20°)")

    is_flood_prone = site.get("in_flood_plain", False)
    if is_flood_prone:
        violations.append("Site overlaps designated 100-year flood zone")

    is_forest = site.get("in_forest_reserve", False)
    if is_forest:
        violations.append("Site falls inside protected eco-sensitive forest zone")

    return {
        "is_valid": len(violations) == 0,
        "violations": violations,
    }
