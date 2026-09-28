'use client';

import React from "react";
import { Home, AlertCircle, Info, ArrowDown, Droplet, Trees, Stethoscope, School } from "lucide-react";
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
  maxBaseline,
}: CapacityBreakdownProps) {
  const standardKeys = ["land", "water", "sanitation", "healthcare", "schools"];
  const entries = standardKeys.map((k) => [k, Number((cap as any)[k]) || 0]);
  const values = entries.map(([_, v]) => Number(v) || 0);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values, 100);
  const scaleMax = maxBaseline || Math.max(maxVal * 1.15, 600);
  const bottleneckLabel = (CAP_LABELS as any)[bottleneck] || bottleneck;

  // Percentage position of the Liebig bottleneck line
  const bottleneckPct = Math.min(100, Math.max(8, (minVal / scaleMax) * 100));

  return (
    <div className="space-y-3 mt-2">
      {/* Liebig's Law Formula Strip */}
      <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[#22364A] font-semibold">
          <span className="text-[10px] uppercase tracking-wider text-[#565F58]">Formula:</span>
          <span>Effective Capacity = min(Land, Water, Sanitation, Healthcare, Schools)</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#FFF1F0] text-[#B5462F] font-bold border border-[#B5462F]/40 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F] animate-pulse" />
          Bottleneck: {bottleneckLabel} ({minVal})
        </span>
      </div>

      {/* Aligned Horizontal Comparative Liebig Bottleneck Chart */}
      <div className="p-4 rounded-sm border bg-white relative space-y-3" style={{ borderColor: C.line }}>
        <div className="flex items-center justify-between text-[11px] text-[#565F58] border-b pb-1.5" style={{ borderColor: C.line }}>
          <span className="font-semibold text-[#1C2420] uppercase tracking-wider text-[10px]">
            Infrastructure Dimension
          </span>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>0</span>
            <span>Scale: max {Math.round(scaleMax)}</span>
            <span className="font-bold text-[#1C2420]">Dimension Capacity</span>
          </div>
        </div>

        {/* Stacked Comparative Rows */}
        <div className="space-y-2.5 relative">
          {entries.map(([k, v]) => {
            const Icon = (CAP_ICONS as any)[k] || Home;
            const isBottleneck = String(k).toLowerCase() === String(bottleneck).toLowerCase();
            const numVal = Number(v) || 0;
            const barWidthPct = Math.min(100, Math.max(3, (numVal / scaleMax) * 100));

            return (
              <div
                key={k}
                className={`p-2 rounded-xs border transition-colors ${
                  isBottleneck
                    ? "bg-[#FFF8F6] border-[#B5462F]/40 shadow-2xs"
                    : "bg-[#FAF9F5] border-[#D9D4C7]/60"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs mb-1">
                  <div className="flex items-center gap-2 w-36 sm:w-44 shrink-0">
                    <Icon
                      size={13}
                      className={isBottleneck ? "text-[#B5462F]" : "text-[#565F58]"}
                    />
                    <span
                      className={`font-semibold capitalize text-xs ${
                        isBottleneck ? "text-[#B5462F]" : "text-[#1C2420]"
                      }`}
                    >
                      {(CAP_LABELS as any)[k] || k}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isBottleneck && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#B5462F] text-white tracking-wider animate-pulse">
                        ← LIMITING BOTTLENECK
                      </span>
                    )}
                    <span
                      className={`f-mono text-xs font-bold ${
                        isBottleneck ? "text-[#B5462F]" : "text-[#1C2420]"
                      }`}
                    >
                      {numVal.toLocaleString()}{" "}
                      <span className="text-[10px] font-normal text-[#565F58]">residents</span>
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar with Bottleneck Threshold Reference */}
                <div className="h-3 w-full bg-[#EFECE4] rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${barWidthPct}%`,
                      backgroundColor: isBottleneck ? "#B5462F" : "#3D6B5C",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Effective Capacity Summary Banner */}
        <div className="p-3 rounded-xs bg-[#E8F0EC] border border-[#2A6B52]/30 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2A6B52]" />
            <span className="text-[#1C2420]">
              <strong>Effective Absorption Capacity:</strong>{" "}
              <span className="f-mono text-base font-bold text-[#2A6B52] ml-1">
                {minVal.toLocaleString()}
              </span>{" "}
              persons
            </span>
          </div>

          <span className="text-[11px] font-medium text-[#565F58]">
            Governed by Liebig&apos;s Law: strictly bounded by{" "}
            <strong className="text-[#B5462F]">{bottleneckLabel}</strong>.
          </span>
        </div>
      </div>

      {/* Explanatory Context */}
      <div className="p-2.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-1.5 text-[10px] text-[#565F58]">
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
