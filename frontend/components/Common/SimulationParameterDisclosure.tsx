'use client';

import React from "react";
import { Sliders, AlertTriangle, ShieldCheck } from "lucide-react";
import { C } from "./constants";

export interface SimulationParameterDisclosureProps {
  scenarioType?: "cloudburst" | "flood";
  radiusKm?: number;
  className?: string;
}

export function SimulationParameterDisclosure({
  scenarioType = "cloudburst",
  radiusKm = 5.5,
  className = "",
}: SimulationParameterDisclosureProps) {
  const isCloudburst = scenarioType === "cloudburst";
  const name = isCloudburst ? "Dynamic Cloudburst Surge Simulation" : "Riverine Flood Discharge Simulation";

  return (
    <div
      className={`p-3 rounded-xs bg-[#FFFDF9] border border-[#E8DCC4] text-xs space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold text-[#1C2420]">
          <Sliders size={13} className="text-[#C0872B]" />
          <span>{name}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF1F0] text-[#B5462F] border border-[#B5462F]/30">
          DEMONSTRATION PARAMETER
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
        <div>
          <span className="text-[#565F58]">Dynamic Expansion: </span>
          <strong className="font-mono text-[#1C2420]">{radiusKm} km buffer</strong>
        </div>
        <div>
          <span className="text-[#565F58]">Simulation Purpose: </span>
          <span className="text-[#1C2420]">Stress-test dynamic buffer & relocation logic</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[#565F58]">Calibration: </span>
          <span className="text-[#C0872B] font-medium">Synthetic Demonstration Metric</span>
        </div>
      </div>

      <p className="text-[10px] text-[#8C5D17] border-t border-[#E8DCC4] pt-1.5 leading-tight">
        <strong>Notice:</strong> This buffer is a demonstration parameter used to evaluate rapid resettlement stress scenarios in planning exercises. It is NOT an operational forecast, official warning threshold, or calibrated physical prediction.
      </p>
    </div>
  );
}
