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
