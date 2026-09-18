'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X, Loader2, MapPin, Plus, RotateCcw } from 'lucide-react';
import { Habitation, CandidateSite } from '@/types';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
}

export interface MapLibreViewProps {
  habitations: Habitation[];
  sites: CandidateSite[];
  redZonesGeoJSON: any;
  selectedId: string;
  onSelectHabitation: (id: string) => void;
  flyToTarget?: { latitude: number; longitude: number; name?: string } | null;
  onAddHabitation?: (newHab: { name: string; region: string; latitude: number; longitude: number; hazard?: string; pop?: number }) => void;
  corridorCenter?: [number, number];
  corridorZoom?: number;
  onSelectRedZone?: (redZoneProperties: any) => void;
}

export default function MapLibreView({
  habitations,
  sites,
  redZonesGeoJSON,
  selectedId,
  onSelectHabitation,
  flyToTarget,
  onAddHabitation,
  corridorCenter,
  corridorZoom,
  onSelectRedZone,
}: MapLibreViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const searchMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSearchedPlace, setActiveSearchedPlace] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

  // 1. Initialize MapLibre GL instance ONCE
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainer.current || mapInstance.current) return;
      try {
        const maplibregl = (await import('maplibre-gl')).default;

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors',
              },
            },
            layers: [
              {
                id: 'osm-tiles-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          },
          center: [76.5, 10.5], // Centered around Southern Peninsula Zone 7 corridor
          zoom: 6.8,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.on('load', () => {
          if (!isMounted) return;
          mapInstance.current = map;
          setMapLoaded(true);
        });
      } catch (err: any) {
        if (isMounted) {
          setMapError(err.message || 'MapLibre WebGL initialization failed');
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 2. Update Red Zones Layer without destroying the map
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded) return;

    try {
      if (redZonesGeoJSON && redZonesGeoJSON.features) {
        if (map.getSource('red-zones-source')) {
          map.getSource('red-zones-source').setData(redZonesGeoJSON);
        } else {
          map.addSource('red-zones-source', {
            type: 'geojson',
            data: redZonesGeoJSON,
          });

          map.addLayer({
            id: 'red-zones-fill',
            type: 'fill',
            source: 'red-zones-source',
            paint: {
              'fill-color': '#B5462F',
              'fill-opacity': 0.22,
            },
          });

          map.addLayer({
            id: 'red-zones-line',
            type: 'line',
            source: 'red-zones-source',
            paint: {
              'line-color': '#B5462F',
              'line-width': 1.8,
              'line-dasharray': [2, 1],
            },
          });

          // Interactive click listener on Red Zone hazard polygons
          map.on('click', 'red-zones-fill', (e: any) => {
            if (e.features && e.features.length > 0) {
              const feat = e.features[0];
              const props = feat.properties || {};
              if (onSelectRedZone) {
                onSelectRedZone(props);
              }
            }
          });

          map.on('mouseenter', 'red-zones-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'red-zones-fill', () => {
            map.getCanvas().style.cursor = '';
          });
        }
      }
    } catch (e) {
      console.warn('Error updating Red Zones GeoJSON layer:', e);
    }
  }, [redZonesGeoJSON, mapLoaded, onSelectRedZone]);

  // 3. Update Markers dynamically without re-creating the map
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded) return;

    import('maplibre-gl').then(({ default: maplibregl }) => {
      // Remove existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add Habitation Markers
      habitations.forEach((hab) => {
        if (!hab.latitude || !hab.longitude) return;
        const el = document.createElement('div');
        el.className = 'hab-marker cursor-pointer transition-transform hover:scale-125';

        const color =
          hab.tier === 'Immediate'
            ? '#B5462F'
            : hab.tier === 'Short-term'
            ? '#C0872B'
            : '#3E5E82';
        const radius = Math.max(12, Math.min(26, 12 + hab.pop / 80));

        el.style.width = `${radius}px`;
        el.style.height = `${radius}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.border = '2px solid #F7F5F1';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';

        if (hab.id === selectedId) {
          el.style.outline = `3px solid ${color}`;
          el.style.outlineOffset = '2px';
        }

        const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
          <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px;">
            <div style="font-weight: 600; color: #1C2420;">${hab.name}</div>
            <div style="color: #565F58; margin-top: 2px;">${hab.region} · ${hab.hazard}</div>
            <div style="margin-top: 4px; font-weight: 500; color: ${color};">
              Score: ${hab.score}/100 (${hab.tier})
            </div>
            <div style="color: #565F58; font-size: 11px;">Pop: ${hab.pop.toLocaleString()}</div>
          </div>
        `);

        el.addEventListener('click', () => {
          onSelectHabitation(hab.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([hab.longitude, hab.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Add Candidate Site Markers
      sites.forEach((site) => {
        if (!site.latitude || !site.longitude) return;
        const el = document.createElement('div');
        el.className = 'site-marker cursor-pointer transition-transform hover:scale-125';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.backgroundColor = '#3D6B5C';
        el.style.border = '2px solid #F7F5F1';
        el.style.transform = 'rotate(45deg)';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';

        const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
          <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px;">
            <div style="font-weight: 600; color: #3D6B5C;">${site.name}</div>
            <div style="color: #565F58; margin-top: 2px;">Candidate Resettlement Site</div>
            <div style="margin-top: 4px; font-size: 11px; font-weight: 600; color: #1C2420;">
              Effective Capacity: ${site.eff.value}
            </div>
            <div style="color: #B5462F; font-size: 11px;">Bottleneck: ${site.eff.bottleneck}</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([site.longitude, site.latitude])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  }, [habitations, sites, selectedId, mapLoaded, onSelectHabitation]);

  // 4. Handle External flyTo Target
  useEffect(() => {
    if (!flyToTarget || !mapInstance.current || !mapLoaded) return;
    const map = mapInstance.current;
    map.flyTo({
      center: [flyToTarget.longitude, flyToTarget.latitude],
      zoom: 12.5,
      speed: 1.2,
      essential: true,
    });

    // Place temporary search pin
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (searchMarkerRef.current) searchMarkerRef.current.remove();

      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#22364A';
      el.style.border = '3px solid #F7F5F1';
      el.style.boxShadow = '0 0 0 4px rgba(34, 54, 74, 0.4)';

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px;">
          <div style="font-weight: 600; color: #1C2420;">${flyToTarget.name || 'Selected Location'}</div>
          <div style="color: #565F58; font-size: 11px; margin-top: 2px;">
            ${flyToTarget.latitude.toFixed(4)}, ${flyToTarget.longitude.toFixed(4)}
          </div>
        </div>
      `);

      searchMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([flyToTarget.longitude, flyToTarget.latitude])
        .setPopup(popup)
        .addTo(map);

      popup.addTo(map);
    });
  }, [flyToTarget, mapLoaded]);

  // 4b. Handle Regional Planning Corridor FlyTo
  useEffect(() => {
    if (!corridorCenter || !mapInstance.current || !mapLoaded) return;
    mapInstance.current.flyTo({
      center: corridorCenter,
      zoom: corridorZoom || 7.0,
      speed: 1.2,
      essential: true,
    });
  }, [corridorCenter, corridorZoom, mapLoaded]);

  // 5. Global Nominatim Search Logic
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (!response.ok) throw new Error('Search failed');
      const data: SearchResult[] = await response.json();
      setSearchResults(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      console.warn('Geocoding search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleSelectLocation = (result: SearchResult) => {
    setShowDropdown(false);
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const placeName = result.display_name.split(',')[0];

    setActiveSearchedPlace({
      name: placeName,
      lat,
      lon,
    });

    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [lon, lat],
        zoom: 12.5,
        speed: 1.2,
        essential: true,
      });
    }

    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (!mapInstance.current) return;
      if (searchMarkerRef.current) searchMarkerRef.current.remove();

      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#22364A';
      el.style.border = '3px solid #F7F5F1';
      el.style.boxShadow = '0 0 0 4px rgba(34, 54, 74, 0.4)';

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 4px; max-width: 220px;">
          <div style="font-weight: 600; color: #1C2420;">${placeName}</div>
          <div style="color: #565F58; font-size: 11px; margin-top: 2px;">${result.display_name}</div>
          <div style="color: #565F58; font-size: 11px; margin-top: 2px;">
            Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}
          </div>
        </div>
      `);

      searchMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lon, lat])
        .setPopup(popup)
        .addTo(mapInstance.current);

      popup.addTo(mapInstance.current);
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setActiveSearchedPlace(null);
    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
      searchMarkerRef.current = null;
    }
  };

  const handleResetMapView = () => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [78.5, 20.5],
        zoom: 4.8,
        speed: 1.0,
      });
    }
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFECE4] rounded-sm text-sm text-[#565F58]">
        <p className="font-medium text-[#1C2420]">MapLibre WebGL unavailable in current browser context</p>
        <p className="text-xs mt-1">Please use the Schematic SVG view toggle above.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-sm overflow-hidden border border-[#D9D4C7]">
      {/* 🔍 Global Location Search Bar Overlay */}
      <div className="absolute top-3 left-3 z-10 w-72 sm:w-80">
        <div className="relative flex items-center bg-[#F7F5F1]/95 backdrop-blur-md rounded-sm border border-[#D9D4C7] shadow-md px-2.5 py-1.5 transition-all focus-within:border-[#22364A] focus-within:ring-1 focus-within:ring-[#22364A]">
          {isSearching ? (
            <Loader2 size={15} className="animate-spin text-[#565F58] shrink-0 mr-2" />
          ) : (
            <Search size={15} className="text-[#565F58] shrink-0 mr-2" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            placeholder="Search any place in India / global…"
            className="w-full bg-transparent text-xs text-[#1C2420] focus:outline-none placeholder:text-[#565F58]/70"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="p-1 hover:bg-[#EFECE4] rounded-sm text-[#565F58] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown Results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-[#F7F5F1] border border-[#D9D4C7] rounded-sm shadow-lg overflow-hidden max-h-56 overflow-y-auto">
            <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-[#565F58] bg-[#EFECE4]/60 border-b border-[#D9D4C7]">
              Global Places (OpenStreetMap)
            </div>
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                onClick={() => handleSelectLocation(res)}
                className="w-full text-left px-2.5 py-2 text-xs border-b border-[#D9D4C7]/50 hover:bg-white transition-colors flex items-start gap-2 cursor-pointer"
              >
                <MapPin size={13} className="text-[#3E5E82] shrink-0 mt-0.5" />
                <div className="truncate">
                  <p className="font-medium text-[#1C2420] truncate">
                    {res.display_name.split(',')[0]}
                  </p>
                  <p className="text-[10px] text-[#565F58] truncate">
                    {res.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active Searched Location Action Card */}
        {activeSearchedPlace && onAddHabitation && (
          <div className="mt-2 bg-[#F7F5F1]/95 backdrop-blur-md border border-[#D9D4C7] rounded-sm p-2 shadow-sm text-xs flex items-center justify-between gap-2">
            <div className="truncate">
              <span className="font-semibold text-[#1C2420]">{activeSearchedPlace.name}</span>
              <p className="text-[10px] text-[#565F58]">
                {activeSearchedPlace.lat.toFixed(3)}, {activeSearchedPlace.lon.toFixed(3)}
              </p>
            </div>
            <button
              onClick={() => {
                onAddHabitation({
                  name: `${activeSearchedPlace.name} Habitation`,
                  region: activeSearchedPlace.name,
                  latitude: activeSearchedPlace.lat,
                  longitude: activeSearchedPlace.lon,
                });
                handleClearSearch();
              }}
              className="inline-flex items-center gap-1 bg-[#22364A] hover:bg-[#3E5E82] text-white px-2 py-1 rounded-sm text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
              title="Add this location to monitored habitations and score it"
            >
              <Plus size={12} /> Add to Scored
            </button>
          </div>
        )}
      </div>

      {/* 🧭 Reset View Button (bottom-left) */}
      <div className="absolute bottom-3 left-3 z-10">
        <button
          onClick={handleResetMapView}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F5F1]/90 hover:bg-white text-[#1C2420] text-xs font-medium rounded-sm border border-[#D9D4C7] shadow-sm transition-colors cursor-pointer"
          title="Reset map to national view"
        >
          <RotateCcw size={12} className="text-[#565F58]" /> India Overview
        </button>
      </div>

      {/* MapLibre DOM container */}
      <div ref={mapContainer} className="w-full h-full" style={{ minHeight: '340px' }} />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F7F5F1]/80 backdrop-blur-xs text-xs text-[#565F58]">
          <Loader2 size={16} className="animate-spin text-[#22364A] mr-2" /> Initializing MapLibre GL JS & PostGIS hazard layers…
        </div>
      )}
    </div>
  );
}
