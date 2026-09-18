from typing import List, Dict, Any
from backend.services.hazard_service import point_in_polygon

def spatial_join_points_to_polygons(
    points: List[Dict[str, Any]],
    polygons: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Performs a point-in-polygon spatial join between point locations (habitations)
    and hazard polygon features.
    """
    joined_results = []

    for pt in points:
        pt_lat = pt.get("latitude")
        pt_lon = pt.get("longitude")
        matched_zones = []

        if pt_lat is not None and pt_lon is not None:
            for poly in polygons:
                geom = poly.get("geometry", {})
                if geom.get("type") == "Polygon" and geom.get("coordinates"):
                    ring = geom["coordinates"][0]
                    if point_in_polygon(pt_lon, pt_lat, ring):
                        matched_zones.append(poly.get("properties", {}))

        res = dict(pt)
        res["matched_hazard_zones"] = matched_zones
        res["is_in_hazard_zone"] = len(matched_zones) > 0
        joined_results.append(res)

    return joined_results
