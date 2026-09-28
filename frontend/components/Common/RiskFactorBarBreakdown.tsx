'use client';

import React from "react";
import { Habitation, HabitationFactors, RiskWeights } from "@/types";
import { C } from "./constants";

export interface RiskFactorBarBreakdownProps {
  factors?: HabitationFactors | Record<string, number>;
  weights?: RiskWeights | Record<string, number>;
  compositeScore?: number;
  compact?: boolean;
  className?: string;
  showFormula?: boolean;
}

const FACTOR_CONFIG: Record<
  string,
  { label: string; defaultWeight: number; color: string; desc: string }
> = {
  hazard: {
    label: "Hazard Intensity",
    defaultWeight: 30,
    color: "#B5462F",
    desc: "PostGIS slope >30°, flood plain run-off & terrain instability",
  },
  exposure: {
    label: "Demographic Exposure",
    defaultWeight: 25,
    color: "#C0872B",
    desc: "Exposed population density & built structure footprint",
  },
  vulnerability: {
    label: "Social Vulnerability",
    defaultWeight: 20,
    color: "#7D5218",
    desc: "Kutcha housing ratio, elderly & agrarian demographic ratio",
  },
  history: {
    label: "Disaster History",
    defaultWeight: 15,
    color: "#22364A",
    desc: "2018–2024 verified incident log recurrence count",
  },
  access: {
    label: "Accessibility Deficit",
    defaultWeight: 10,
    color: "#3E5E82",
    desc: "Distance to all-weather roads & emergency hospital isolation",
  },
};

export function RiskFactorBarBreakdown({
  factors,
  weights,
  compositeScore,
  compact = false,
  className = "",
  showFormula = false,
}: RiskFactorBarBreakdownProps) {
  if (!factors) return null;

  const factorKeys = ["hazard", "exposure", "vulnerability", "history", "access"];

  // Normalize factor values
  const normalizedFactors: Record<string, number> = {};
  factorKeys.forEach((key) => {
    const val = (factors as any)[key] ?? (factors as any)[key.toLowerCase()] ?? 0;
    normalizedFactors[key] = Math.max(0, Math.min(100, Math.round(Number(val) || 0)));
  });

  // Normalize weights
  const normalizedWeights: Record<string, number> = {};
  factorKeys.forEach((key) => {
    const w = (weights as any)?.[key] ?? FACTOR_CONFIG[key].defaultWeight;
    normalizedWeights[key] = Number(w) || FACTOR_CONFIG[key].defaultWeight;
  });

  // Calculate weighted points contribution
  const contributions: Record<string, number> = {};
  let totalCalculated = 0;
  factorKeys.forEach((key) => {
    const pts = (normalizedFactors[key] * normalizedWeights[key]) / 100;
    contributions[key] = Number(pts.toFixed(1));
    totalCalculated += pts;
  });

  const finalScore =
    compositeScore !== undefined ? compositeScore : Math.round(totalCalculated);

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-semibold text-[#1C2420] uppercase tracking-wider text-[10px]">
            MCDA Factor Breakdown
          </span>
          <span className="font-mono font-bold text-[#1C2420] text-xs">
            {finalScore} <span className="text-[10px] font-normal text-[#565F58]">/ 100</span>
          </span>
        </div>

        {factorKeys.map((key) => {
          const cfg = FACTOR_CONFIG[key];
          const val = normalizedFactors[key];
          const w = normalizedWeights[key];
          const pts = contributions[key];

          return (
            <div key={key} className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-[#1C2420] font-medium truncate">{cfg.label}</span>
                  <span className="text-[#565F58] font-mono text-[9px]">({w}%)</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <span className="font-semibold text-[#1C2420]">{val}</span>
                  <span className="text-[#565F58] text-[9px]">→ +{pts}pt</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[#EFECE4] rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${val}%`,
                    backgroundColor: cfg.color,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="pt-1 text-[9px] font-mono text-[#565F58] text-right">
          Deterministic MCDA Configuration
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-sm p-4 bg-white space-y-3 ${className}`} style={{ borderColor: C.line }}>
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b" style={{ borderColor: C.line }}>
        <div>
          <h4 className="f-serif text-sm font-bold text-[#1C2420]">
            Deterministic MCDA Factor Breakdown
          </h4>
          <p className="text-[11px] text-[#565F58] mt-0.5">
            5 weighted multi-criteria dimensions mathematically combined into the composite score
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-[#565F58] block">Composite Score</span>
          <span className="f-mono text-xl font-bold text-[#1C2420]">
            {finalScore} <span className="text-xs font-normal text-[#565F58]">/ 100</span>
          </span>
        </div>
      </div>

      {showFormula && (
        <div className="p-2 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] text-[10px] font-mono text-[#22364A] flex items-center justify-between flex-wrap gap-1">
          <span>Score = 0.30·H + 0.25·E + 0.20·V + 0.15·F + 0.10·A</span>
          <span className="text-[#565F58]">Auditable &amp; Reproducible</span>
        </div>
      )}

      <div className="space-y-2.5">
        {factorKeys.map((key) => {
          const cfg = FACTOR_CONFIG[key];
          const val = normalizedFactors[key];
          const w = normalizedWeights[key];
          const pts = contributions[key];

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="font-semibold text-[#1C2420]">{cfg.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] text-[#565F58]">
                    Weight: {w}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#565F58]">Intensity:</span>
                  <strong className="text-[#1C2420]">{val}/100</strong>
                  <span className="text-[#2A6B52] font-semibold text-[11px] bg-[#E8F0EC] px-1.5 py-0.2 rounded-xs">
                    +{pts} pts
                  </span>
                </div>
              </div>

              {/* Visual Horizontal Bar */}
              <div className="h-2 w-full bg-[#EFECE4] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${val}%`,
                    backgroundColor: cfg.color,
                  }}
                />
              </div>

              <p className="text-[10px] text-[#565F58] leading-tight pl-4">
                {cfg.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t flex items-center justify-between text-[10px] text-[#565F58]" style={{ borderColor: C.line }}>
        <span>Sum of weighted points = {finalScore} / 100</span>
        <span className="font-mono text-[#22364A]">Prototype MCDA Configuration</span>
      </div>
    </div>
  );
}
