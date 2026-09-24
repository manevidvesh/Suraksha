import React from "react";
import { C, tierColor } from "./constants";

export function TierBadge({ tier }: { tier: string }) {
  const color = tierColor(tier);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium f-sans"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {tier}
    </span>
  );
}

export function ConfidenceBadge({ level, stale }: { level: string; stale?: boolean }) {
  const color = level === "High" ? C.pine : level === "Medium" ? C.shortTerm : C.immediate;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium f-sans"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {level} confidence{stale ? " · dated" : ""}
    </span>
  );
}

export type ProvenanceType =
  | "RUNTIME DATASET"
  | "DEMONSTRATION DATASET"
  | "DOCUMENTED REFERENCE"
  | "EXTERNAL VALIDATION REQUIRED"
  | "OFFICIAL SOURCE"
  | "DERIVED DATA"
  | "MODEL OUTPUT"
  | "SIMULATED EVENT"
  | "PROTOTYPE DATA"
  | "AI EXPLANATION"
  | "HUMAN REVIEW REQUIRED";

export function ProvenanceBadge({ type }: { type: ProvenanceType }) {
  let bg = "#F4F7FA";
  let text = "#22364A";
  let border = "#D9D4C7";

  switch (type) {
    case "RUNTIME DATASET":
      bg = "#E8F0EC";
      text = "#2A6B52";
      border = "rgba(42, 107, 82, 0.35)";
      break;
    case "DEMONSTRATION DATASET":
      bg = "#FFF9EE";
      text = "#8C5D17";
      border = "rgba(192, 135, 43, 0.35)";
      break;
    case "DOCUMENTED REFERENCE":
      bg = "#EBF3F8";
      text = "#1E5878";
      border = "rgba(30, 88, 120, 0.35)";
      break;
    case "EXTERNAL VALIDATION REQUIRED":
      bg = "#FFF1F0";
      text = "#B5462F";
      border = "rgba(181, 70, 47, 0.35)";
      break;
    case "OFFICIAL SOURCE":
      bg = "#E8F0EC";
      text = "#2A6B52";
      border = "rgba(42, 107, 82, 0.35)";
      break;
    case "SIMULATED EVENT":
      bg = "#FFF1F0";
      text = "#B5462F";
      border = "rgba(181, 70, 47, 0.35)";
      break;
    case "MODEL OUTPUT":
      bg = "#F0F4F8";
      text = "#22364A";
      border = "rgba(34, 54, 74, 0.25)";
      break;
    case "PROTOTYPE DATA":
      bg = "#FFF9EE";
      text = "#8C5D17";
      border = "rgba(192, 135, 43, 0.35)";
      break;
    case "AI EXPLANATION":
      bg = "#F3E8FF";
      text = "#6B21A8";
      border = "rgba(168, 85, 247, 0.35)";
      break;
    case "HUMAN REVIEW REQUIRED":
      bg = "#FFF3CD";
      text = "#856404";
      border = "#FFEEBA";
      break;
    case "DERIVED DATA":
    default:
      bg = "#ECEFF1";
      text = "#37474F";
      border = "#CFD8DC";
      break;
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider border"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: text }} />
      {type}
    </span>
  );
}

