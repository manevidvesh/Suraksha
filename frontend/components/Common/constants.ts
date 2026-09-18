import { Droplet, Home, School, Stethoscope, Trees } from "lucide-react";

export const C = {
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

export const CAP_ICONS: Record<string, any> = {
  land: Trees,
  water: Droplet,
  sanitation: Home,
  healthcare: Stethoscope,
  schools: School,
};

export const CAP_LABELS: Record<string, string> = {
  land: "Land availability",
  water: "Water supply",
  sanitation: "Sanitation",
  healthcare: "Healthcare",
  schools: "Schools",
};

export function tierColor(tier: string): string {
  return tier === "Immediate" ? C.immediate : tier === "Short-term" ? C.shortTerm : C.mediumTerm;
}
