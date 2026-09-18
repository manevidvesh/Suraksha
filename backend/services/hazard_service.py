import math
from typing import Dict, Any, List, Tuple

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points on the Earth."""
    r = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)

def generate_buffered_polygon(lat: float, lon: float, radius_km: float, num_points: int = 16) -> List[List[float]]:
    """Generates an approximate geodesic circular buffer polygon around a centroid."""
    coords: List[List[float]] = []
    lat_deg_per_km = 1.0 / 110.574
    lon_deg_per_km = 1.0 / (111.320 * math.cos(math.radians(lat)) + 1e-9)

    for i in range(num_points):
        theta = (2 * math.pi * i) / num_points
        dx = radius_km * math.cos(theta)
        dy = radius_km * math.sin(theta)
        
        p_lat = round(lat + (dy * lat_deg_per_km), 6)
        p_lon = round(lon + (dx * lon_deg_per_km), 6)
        coords.append([p_lon, p_lat])

    coords.append(coords[0])  # Close the ring
    return coords

def point_in_polygon(lon: float, lat: float, polygon_coords: List[List[float]]) -> bool:
    """Ray casting algorithm for point-in-polygon containment check."""
    inside = False
    n = len(polygon_coords)
    if n < 3:
        return False

    p1x, p1y = polygon_coords[0]
    for i in range(1, n + 1):
        p2x, p2y = polygon_coords[i % n]
        if lat > min(p1y, p2y):
            if lat <= max(p1y, p2y):
                if lon <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or lon <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y

    return inside
