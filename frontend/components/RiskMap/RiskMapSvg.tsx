'use client';

import React from "react";
import { Habitation, CandidateSite } from "@/types";
import { C, tierColor } from "../Common/constants";

export function RiskMapSvg({
  habitations,
  sites,
  selected,
  onSelect,
}: {
  habitations: Habitation[];
  sites: CandidateSite[];
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      role="img"
      aria-label="Schematic multi-hazard risk map"
    >
      <rect x="0" y="0" width="100" height="100" fill={C.paperDim} />
      {[15, 35, 55, 75].map((v, i) => (
        <path
          key={i}
          d={`M0,${v} Q25,${v - 6} 50,${v} T100,${v}`}
          fill="none"
          stroke={C.line}
          strokeWidth="0.4"
        />
      ))}
      {/* Flood plain / hazard inundation zones */}
      <path
        d="M62,0 Q75,25 70,50 Q65,80 85,100 L100,100 L100,0 Z"
        fill={C.slateSoft}
        opacity="0.08"
      />
      {/* High landslide slope instability zones */}
      <path
        d="M0,60 Q20,55 35,68 Q45,78 30,95 L0,100 Z"
        fill={C.immediate}
        opacity="0.07"
      />

      {/* Candidate relocation sites */}
      {sites.map((s: CandidateSite) => (
        <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
          <rect
            x="-1.6"
            y="-1.6"
            width="3.2"
            height="3.2"
            fill={C.pine}
            stroke={C.paper}
            strokeWidth="0.4"
            transform="rotate(45)"
          />
        </g>
      ))}

      {/* Habitations */}
      {habitations.map((h: Habitation) => {
        const color = tierColor(h.tier);
        const r = 1.6 + h.pop / 500;
        const isSel = selected === h.id;
        const isImmediate = h.tier === "Immediate";
        return (
          <g
            key={h.id}
            transform={`translate(${h.x} ${h.y})`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect && onSelect(h.id)}
            role="button"
            tabIndex={0}
            aria-label={`${h.name}, ${h.tier} priority`}
            onKeyDown={(e) => e.key === "Enter" && onSelect && onSelect(h.id)}
          >
            {/* Multi-hazard Red Zone perimeter around Immediate settlements */}
            {isImmediate && (
              <g>
                <circle
                  r={r + 6}
                  fill="#DC2626"
                  fillOpacity="0.22"
                  stroke="#991B1B"
                  strokeWidth="0.45"
                  strokeDasharray="1.2 0.8"
                />
                <circle
                  r={r + 6}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.2"
                  strokeOpacity="0.3"
                />
              </g>
            )}
            {isSel && <circle r={r + 2.2} fill="none" stroke={color} strokeWidth="0.5" />}
            <circle r={r} fill={color} stroke={C.paper} strokeWidth="0.5" />
          </g>
        );
      })}
    </svg>
  );
}
