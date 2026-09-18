export const SURAKSHA_COLORS = {
  paper: "#F7F5F1",
  paperDim: "#EFECE4",
  ink: "#1C2420",
  inkSoft: "#565F58",
  line: "#D9D4C7",
  slate: "#22364A",
  slateSoft: "#3E5E82",
  immediate: "#B5462F",
  shortTerm: "#C0872B",
  mediumTerm: "#3E5E82",
  pine: "#3D6B5C",
  pineSoft: "#E4ECE7",
};

export function getTierColor(tier: string): string {
  if (tier === "Immediate") return SURAKSHA_COLORS.immediate;
  if (tier === "Short-term") return SURAKSHA_COLORS.shortTerm;
  return SURAKSHA_COLORS.mediumTerm;
}

export function calculateBoundingBox(coordinates: [number, number][]): [[number, number], [number, number]] {
  if (!coordinates.length) {
    return [[75.0, 9.0], [78.0, 12.5]];
  }
  let minLon = coordinates[0][0];
  let minLat = coordinates[0][1];
  let maxLon = coordinates[0][0];
  let maxLat = coordinates[0][1];

  for (const [lon, lat] of coordinates) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  return [[minLon - 0.1, minLat - 0.1], [maxLon + 0.1, maxLat + 0.1]];
}

export function generateBufferedPolygon(
  lat: number,
  lon: number,
  radiusKm: number = 3.2,
  numPoints: number = 18
): [number, number][] {
  const coords: [number, number][] = [];
  const latDegPerKm = 1.0 / 110.574;
  const lonDegPerKm = 1.0 / (111.320 * Math.cos((lat * Math.PI) / 180) + 1e-9);

  for (let i = 0; i < numPoints; i++) {
    const theta = (2 * Math.PI * i) / numPoints;
    const dx = radiusKm * Math.cos(theta);
    const dy = radiusKm * Math.sin(theta);
    const pLat = Number((lat + dy * latDegPerKm).toFixed(6));
    const pLon = Number((lon + dx * lonDegPerKm).toFixed(6));
    coords.push([pLon, pLat]);
  }
  coords.push(coords[0]); // Close ring
  return coords;
}

export function ensureRedZonesForHabitations(baseGeoJSON: any, habitations: any[]): any {
  const existing = baseGeoJSON?.features ? [...baseGeoJSON.features] : [];

  habitations.forEach((hab) => {
    if (hab.tier === 'Immediate' && hab.latitude && hab.longitude) {
      const alreadyHasZone = existing.some((f: any) => {
        if (f.properties?.habitation_id === hab.id) return true;
        if (f.properties?.name && hab.name && f.properties.name.toLowerCase().includes(hab.name.toLowerCase().slice(0, 7))) {
          return true;
        }
        return false;
      });

      if (!alreadyHasZone) {
        const ring = generateBufferedPolygon(hab.latitude, hab.longitude, 3.4, 18);
        existing.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ring],
          },
          properties: {
            id: `RZ-AUTO-${hab.id}`,
            habitation_id: hab.id,
            zone_code: `RED-${(hab.hazard || "HAZ").slice(0, 3).toUpperCase()}-${hab.id}`,
            name: `${hab.name} Hazard Red Zone Area`,
            hazard_type: hab.hazard || "Multi-Hazard",
            severity: "Critical",
            description: `Designated dynamic high-risk Red Zone buffer area for ${hab.name}. Exposure index exceeds safe threshold requiring immediate relocation intervention.`,
            source_agency: "SURAKSHA Spatial Risk Engine",
            radius_km: 3.4,
          },
        });
      }
    }
  });

  return {
    type: "FeatureCollection",
    features: existing,
  };
}

