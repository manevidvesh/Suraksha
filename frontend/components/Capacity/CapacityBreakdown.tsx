'use client';

import React from "react";
import { Home, AlertCircle, Info } from "lucide-react";
import { C, CAP_ICONS, CAP_LABELS } from "../Common/constants";
import { SiteCapacity } from "@/types";

export interface CapacityBreakdownProps {
  cap: SiteCapacity | Record<string, number>;
  bottleneck: string;
  maxBaseline?: number;
}

export function CapacityBreakdown({
  cap,
  bottleneck,
  maxBaseline = 800,
}: CapacityBreakdownProps) {
  const entries = Object.entries(cap);
  const values = entries.map(([_, v]) => Number(v) || 0);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const bottleneckLabel = (CAP_LABELS as any)[bottleneck] || bottleneck;

  return (
    <div className="space-y-2.5 mt-2">
      {/* Liebig's Law Formula Strip */}
      <div className="p-2 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] flex items-center justify-between gap-2 flex-wrap text-[11px]">
        <span className="font-mono text-[#22364A] font-semibold">
          Effective Capacity = min(Land, Water, Sanitation, Healthcare, Schools)
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FFF1F0] text-[#B5462F] font-bold border border-[#B5462F]/30">
          Bottleneck: {bottleneckLabel} ({minVal})
        </span>
      </div>

      {/* 5-Capacities Visual Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {entries.map(([k, v]) => {
          const Icon = (CAP_ICONS as any)[k] || Home;
          const isBottleneck = k === bottleneck;
          const numVal = Number(v) || 0;
          const pct = Math.min(100, (numVal / maxBaseline) * 100);

          return (
            <div
              key={k}
              className={`p-2 rounded-xs border transition-colors ${
                isBottleneck
                  ? "bg-[#FFF8F6] border-[#B5462F]/40"
                  : "bg-white border-[#D9D4C7]/60"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1">
                  <Icon size={12} style={{ color: isBottleneck ? C.immediate : C.inkSoft }} />
                  <span
                    className="f-sans text-[10.5px] font-medium"
                    style={{ color: isBottleneck ? C.immediate : C.inkSoft }}
                  >
                    {(CAP_LABELS as any)[k] || k}
                  </span>
                </div>
                {isBottleneck && (
                  <span className="text-[9px] font-mono font-bold text-[#B5462F]">
                    LIMIT
                  </span>
                )}
              </div>

              <div className="h-1.5 rounded-full" style={{ backgroundColor: C.paperDim }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isBottleneck ? C.immediate : C.pine,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-xs">
                <p className={`f-mono font-bold ${isBottleneck ? "text-[#B5462F]" : "text-[#1C2420]"}`}>
                  {numVal}
                </p>
                <span className="text-[9px] text-[#565F58]">cap</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory note distinguishing theoretical from effective */}
      <div className="text-[11px] text-[#565F58] flex items-center justify-between flex-wrap gap-2 pt-0.5">
        <span>
          <strong>Effective carrying capacity</strong> is strictly constrained by{" "}
          <strong className="text-[#B5462F]">{bottleneckLabel}</strong> at{" "}
          <strong className="text-[#1C2420]">{minVal}</strong> residents.
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30">
          FIELD VERIFICATION REQUIRED
        </span>
      </div>

      {/* Per-Dimension Calculation Basis & Provenance */}
      <div className="p-2.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-2 text-[10px] text-[#565F58]">
        <div className="flex items-center justify-between font-semibold text-[#1C2420]">
          <span>Prototype Planning Benchmarks (Demonstration Reference Values):</span>
          <span className="font-mono text-[9px] uppercase text-[#3E5E82]">MODEL ESTIMATE</span>
        </div>
        <p className="leading-tight">
          <strong>Prototype Potable-Water Planning Parameter:</strong> 40 lpcd. Demonstration reference value; jurisdiction-specific applicability requires validation.
        </p>
        <p className="leading-tight">
          <strong>Education Infrastructure:</strong> Education capacity uses prototype school-capacity parameters. Applicable student, classroom, and teacher norms require verification against the relevant education authority and settlement context.
        </p>
        <p className="leading-tight">
          <strong>Healthcare Infrastructure:</strong> Prototype Healthcare Capacity Parameter. Applicable healthcare infrastructure standards require verification against the relevant health authority and settlement context.
        </p>
        <p className="text-[#8C5D17] italic pt-0.5 border-t border-dashed border-[#D9D4C7]">
          These prototype planning benchmarks are reference values used in the demonstration model. Their applicability varies by State/UT, terrain (hilly vs plains vs coastal), rural vs urban classification, and competent line department standards. They require site-specific engineering, PHED, health, and education administrative validation prior to official settlement sanctioning.
        </p>
      </div>
    </div>
  );
}
