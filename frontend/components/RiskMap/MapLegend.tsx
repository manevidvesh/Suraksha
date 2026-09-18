import React from "react";
import { C } from "../Common/constants";

export function MapLegend() {
  const tiers = [
    { c: C.immediate, l: "Immediate" },
    { c: C.shortTerm, l: "Short-term" },
    { c: C.mediumTerm, l: "Medium-term" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 f-sans text-xs" style={{ color: C.inkSoft }}>
      <span className="font-medium text-[#1C2420]">Habitations:</span>
      {tiers.map((it) => (
        <span key={it.l} className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: it.c }} />
          {it.l}
        </span>
      ))}
      <span className="text-[#D9D4C7]">|</span>
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 rotate-45" style={{ backgroundColor: C.pine }} />
        <span className="font-medium text-[#1C2420]">Safe Relocation Site</span>
      </span>
    </div>
  );
}
