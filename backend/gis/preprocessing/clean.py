from typing import Dict, Any, List

def clean_geojson_geometry(geometry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates and standardizes GeoJSON geometry rings:
    - Closes open polygon rings
    - Ensures valid float precision
    """
    geom_type = geometry.get("type", "")
    coords = geometry.get("coordinates", [])

    if geom_type == "Polygon" and coords:
        ring = coords[0]
        cleaned_ring = []
        for pt in ring:
            cleaned_ring.append([round(float(pt[0]), 6), round(float(pt[1]), 6)])
        if cleaned_ring and cleaned_ring[0] != cleaned_ring[-1]:
            cleaned_ring.append(cleaned_ring[0])
        return {"type": "Polygon", "coordinates": [cleaned_ring]}

    return geometry
