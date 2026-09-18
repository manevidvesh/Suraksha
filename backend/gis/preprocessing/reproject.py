import math
from typing import Tuple

def wgs84_to_web_mercator(lon: float, lat: float) -> Tuple[float, float]:
    """Projects EPSG:4326 (WGS84) coordinates to EPSG:3857 (Web Mercator meters)."""
    r = 6378137.0
    x = r * math.radians(lon)
    lat_rad = math.radians(max(min(lat, 89.5), -89.5))
    y = r * math.log(math.tan(math.pi / 4.0 + lat_rad / 2.0))
    return round(x, 2), round(y, 2)

def web_mercator_to_wgs84(x: float, y: float) -> Tuple[float, float]:
    """Unprojects EPSG:3857 (Web Mercator meters) back to EPSG:4326 (WGS84 degrees)."""
    r = 6378137.0
    lon = math.degrees(x / r)
    lat = math.degrees(2.0 * math.atan(math.exp(y / r)) - math.pi / 2.0)
    return round(lon, 6), round(lat, 6)
