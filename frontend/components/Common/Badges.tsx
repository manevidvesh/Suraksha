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
