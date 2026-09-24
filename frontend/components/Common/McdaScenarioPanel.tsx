'use client';

import React, { useState, useMemo } from "react";
import { Sliders, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { RiskWeights, Habitation } from "@/types";
import { C } from "./constants";
import { TierBadge } from "./Badges";

export interface McdaScenarioPanelProps {
  currentWeights?: RiskWeights;
  weights?: RiskWeights;
  onWeightsChange: (weights: RiskWeights) => void;
  selectedHabitation?: Habitation | null;
  className?: string;
  isCalculating?: boolean;
  currentScore?: number;
  onReset?: () => void;
}

export const SCENARIO_PRESETS: {
  id: string;
  name: string;
  desc: string;
  weights: RiskWeights;
}[] = [
  {
    id: "baseline",
    name: "Prototype Baseline",
    desc: "Balanced prototype configuration (Hazard 30%, Exposure 25%, Vulnerability 20%, History 15%, Access 10%)",
    weights: { hazard: 30, exposure: 25, vulnerability: 20, history: 15, access: 10 },
  },
  {
    id: "monsoon_stress",
    name: "Monsoon Stress Scenario",
    desc: "Surge rainfall & hazard focus (Hazard 45%, Exposure 20%, Vulnerability 15%, History 10%, Access 10%)",
    weights: { hazard: 45, exposure: 20, vulnerability: 15, history: 10, access: 10 },
  },
  {
    id: "vulnerability_focus",
    name: "High Vulnerability Focus",
    desc: "Socioeconomic fragility priority (Hazard 20%, Exposure 20%, Vulnerability 35%, History 10%, Access 15%)",
    weights: { hazard: 20, exposure: 20, vulnerability: 35, history: 10, access: 15 },
  },
  {
    id: "access_remote",
    name: "Remote Isolation Scenario",
    desc: "Connectivity & relief access priority (Hazard 25%, Exposure 20%, Vulnerability 20%, History 10%, Access 25%)",
    weights: { hazard: 25, exposure: 20, vulnerability: 20, history: 10, access: 25 },
  },
  {
    id: "evacuation_access",
    name: "Rapid Evacuation Access Scenario",
    desc: "Isolation & transit bottleneck focus (Hazard 25%, Exposure 20%, Vulnerability 15%, History 10%, Access 30%)",
    weights: { hazard: 25, exposure: 20, vulnerability: 15, history: 10, access: 30 },
  },
];

export function McdaScenarioPanel({
  currentWeights,
  weights,
  onWeightsChange,
  selectedHabitation,
  className = "",
  isCalculating = false,
  currentScore,
  onReset,
}: McdaScenarioPanelProps) {
  const activeWeights = currentWeights || weights || {
    hazard: 30,
    exposure: 25,
    vulnerability: 20,
    history: 15,
    access: 10,
  };
  const [activePresetId, setActivePresetId] = useState<string>("baseline");

  // Sum of weights
  const sumWeights =
    (activeWeights.hazard || 0) +
    (activeWeights.exposure || 0) +
    (activeWeights.vulnerability || 0) +
    (activeWeights.history || 0) +
    (activeWeights.access || 0);

  const isSumValid = sumWeights === 100;

  // Compute scenario score for selected habitation
  const scenarioComputation = useMemo(() => {
    if (!selectedHabitation || !selectedHabitation.f) return null;
    const f = selectedHabitation.f;

    const baseWeights = SCENARIO_PRESETS[0].weights;
    const baseTotalWeight = 100;
    const baseScore = Math.round(
      (f.hazard * baseWeights.hazard +
        f.exposure * baseWeights.exposure +
        f.vulnerability * baseWeights.vulnerability +
        f.history * baseWeights.history +
        f.access * baseWeights.access) /
        baseTotalWeight
    );

    const scenarioScore =
      sumWeights > 0
        ? Math.round(
            (f.hazard * activeWeights.hazard +
              f.exposure * activeWeights.exposure +
              f.vulnerability * activeWeights.vulnerability +
              f.history * activeWeights.history +
              f.access * activeWeights.access) /
              sumWeights
          )
        : 0;

    const getTier = (score: number) => {
      if (score >= 70) return "Immediate" as const;
      if (score >= 45) return "Short-term" as const;
      return "Medium-term" as const;
    };

    return {
      baseScore,
      baseTier: getTier(baseScore),
      scenarioScore,
      scenarioTier: getTier(scenarioScore),
      delta: scenarioScore - baseScore,
    };
  }, [selectedHabitation, activeWeights, sumWeights]);

  const handleSliderChange = (key: keyof RiskWeights, val: number) => {
    const updated = { ...activeWeights, [key]: val };
    setActivePresetId("custom");
    onWeightsChange(updated);
  };

  const handlePresetSelect = (presetId: string) => {
    setActivePresetId(presetId);
    const p = SCENARIO_PRESETS.find((x) => x.id === presetId);
    if (p) onWeightsChange(p.weights);
  };

  return (
    <div
      className={`border rounded-sm p-4 bg-white space-y-4 ${className}`}
      style={{ borderColor: C.line }}
    >
      {/* Title & Badge */}
      <div>
        <div className="flex items-center justify-between">
          <p className="f-sans text-xs font-bold uppercase tracking-wider text-[#1C2420] flex items-center gap-1.5">
            <Sliders size={13} className="text-[#3E5E82]" />
            Prototype MCDA Configuration
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#F7F5F1] text-[#565F58] font-semibold border border-[#D9D4C7]">
            DEMO MODE
          </span>
        </div>
        <p className="text-[11px] text-[#565F58] mt-1 leading-tight">
          Configurable prototype parameters for demonstration and research. These are not gazetted statutory mandates.
        </p>
      </div>

      {/* Scenario Preset Selector */}
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-[#1C2420]">
          MCDA Calibration Preset
        </label>
        <select
          value={activePresetId}
          onChange={(e) => handlePresetSelect(e.target.value)}
          className="w-full border rounded-xs px-2.5 py-1.5 bg-[#F7F5F1] text-xs text-[#1C2420] focus:outline-none focus:ring-1 focus:ring-[#22364A] cursor-pointer"
          style={{ borderColor: C.line }}
        >
          {SCENARIO_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value="custom" disabled={activePresetId !== "custom"}>
            Custom Scenario Weights
          </option>
        </select>
        <p className="text-[10px] text-[#8C5D17] italic">
          ILLUSTRATIVE SCENARIO — NOT AN APPROVED OPERATIONAL WEIGHTING
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-1 border-t" style={{ borderColor: C.line }}>
        {(
          [
            { key: "hazard", label: "Hazard Intensity (H)", color: "#B5462F" },
            { key: "exposure", label: "Population Exposure (E)", color: "#E07A5F" },
            { key: "vulnerability", label: "Social Vulnerability (V)", color: "#C0872B" },
            { key: "history", label: "Disaster History (F)", color: "#3D6B5C" },
            { key: "access", label: "Access Deficit (A)", color: "#22364A" },
          ] as const
        ).map(({ key, label, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-medium text-[#1C2420]">{label}</span>
              <span className="f-mono font-semibold" style={{ color }}>
                {activeWeights[key]}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={activeWeights[key]}
              onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#D9D4C7] rounded-lg appearance-none cursor-pointer accent-[#22364A]"
            />
          </div>
        ))}
      </div>

      {/* Sum Validation Indicator */}
      <div
        className={`p-2 rounded-xs border text-[11px] flex items-center justify-between ${
          isSumValid
            ? "bg-[#E8F0EC] text-[#2A6B52] border-[#2A6B52]/40"
            : "bg-[#FFF1F0] text-[#B5462F] border-[#B5462F]/40"
        }`}
      >
        <div className="flex items-center gap-1.5 font-medium">
          {isSumValid ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          <span>Weight Sum: <strong>{sumWeights}%</strong></span>
        </div>
        <span>{isSumValid ? "Valid: 100%" : "Must equal 100%"}</span>
      </div>

      {/* Scenario Comparison Card for Selected Habitation */}
      {selectedHabitation && scenarioComputation && (
        <div className="p-2.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#1C2420]">
              Scenario Impact: {selectedHabitation.name}
            </span>
            <span className="text-[10px] text-[#565F58] uppercase font-mono">
              SCENARIO SIMULATION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-[#D9D4C7]/60">
            <div className="p-1.5 rounded-xs bg-white border border-[#D9D4C7]">
              <p className="text-[10px] text-[#565F58]">Prototype Baseline</p>
              <p className="f-mono text-sm font-bold text-[#1C2420]">
                {scenarioComputation.baseScore}/100
              </p>
              <div className="mt-1 flex justify-center">
                <TierBadge tier={scenarioComputation.baseTier} />
              </div>
            </div>

            <div className="p-1.5 rounded-xs bg-white border border-[#22364A]">
              <p className="text-[10px] text-[#3E5E82] font-semibold">Calibrated Scenario</p>
              <p className="f-mono text-sm font-bold text-[#22364A]">
                {scenarioComputation.scenarioScore}/100
              </p>
              <div className="mt-1 flex justify-center">
                <TierBadge tier={scenarioComputation.scenarioTier} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#565F58] px-1">
            <span>Score Delta: <strong className={scenarioComputation.delta >= 0 ? "text-[#B5462F]" : "text-[#2A6B52]"}>
              {scenarioComputation.delta > 0 ? `+${scenarioComputation.delta}` : scenarioComputation.delta}
            </strong></span>
            <span>{scenarioComputation.baseTier !== scenarioComputation.scenarioTier ? "⚠ Tier Changed" : "Tier Unchanged"}</span>
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => handlePresetSelect("baseline")}
        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#565F58] hover:text-[#1C2420] border border-[#D9D4C7] bg-white rounded-xs cursor-pointer transition-colors"
      >
        <RotateCcw size={12} /> Reset to Prototype Baseline
      </button>
    </div>
  );
}
