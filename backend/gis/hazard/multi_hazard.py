from typing import List, Dict, Any

def aggregate_multi_hazard_layers(features: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Assembles multiple single-hazard polygon features into a unified GeoJSON FeatureCollection.
    """
    return {
        "type": "FeatureCollection",
        "features": features,
    }
