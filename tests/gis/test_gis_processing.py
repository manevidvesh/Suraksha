import pytest
from backend.services.hazard_service import (
    haversine_distance_km,
    generate_buffered_polygon,
    point_in_polygon,
)
from backend.gis.preprocessing.reproject import (
    wgs84_to_web_mercator,
    web_mercator_to_wgs84,
)
from backend.gis.preprocessing.clean import clean_geojson_geometry

def test_haversine_distance():
    # Distance between Kavalapara (11.4550, 76.1320) and Meenangadi (11.6600, 76.1700)
    dist = haversine_distance_km(11.4550, 76.1320, 11.6600, 76.1700)
    assert 20.0 < dist < 30.0

def test_buffer_polygon_generation():
    coords = generate_buffered_polygon(11.5, 76.2, radius_km=5.0, num_points=16)
    assert len(coords) == 17  # Closed ring
    assert coords[0] == coords[-1]

def test_point_in_polygon():
    square_polygon = [
        [76.0, 11.0],
        [77.0, 11.0],
        [77.0, 12.0],
        [76.0, 12.0],
        [76.0, 11.0],
    ]
    # Inside point
    assert point_in_polygon(76.5, 11.5, square_polygon) is True
    # Outside point
    assert point_in_polygon(78.5, 13.5, square_polygon) is False

def test_coordinate_reprojection():
    lon, lat = 76.1320, 11.4550
    x, y = wgs84_to_web_mercator(lon, lat)
    un_lon, un_lat = web_mercator_to_wgs84(x, y)
    assert abs(lon - un_lon) < 0.001
    assert abs(lat - un_lat) < 0.001

def test_clean_geojson_geometry():
    # Unclosed polygon ring
    unclosed = {
        "type": "Polygon",
        "coordinates": [
            [[76.0, 11.0], [77.0, 11.0], [77.0, 12.0]]
        ]
    }
    cleaned = clean_geojson_geometry(unclosed)
    assert cleaned["coordinates"][0][0] == cleaned["coordinates"][0][-1]
