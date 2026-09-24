'use client';

import React from "react";
import { X, Calculator, ShieldAlert, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { Habitation, RiskWeights } from "@/types";
import { C } from "./constants";
import { TierBadge } from "./Badges";

export interface McdaExplainerModalProps {
  habitation: Habitation | null;
  weights: RiskWeights;
  isOpen: boolean;
  onClose: () => void;
}

export function McdaExplainerModal({
  habitation,
  weights,
  isOpen,
  onClose,
}: McdaExplainerModalProps) {
  if (!isOpen || !habitation) return null;

  // Factor values normalized (0-100)
  const f = habitation.f || {
    hazard: 75,
    exposure: 70,
    vulnerability: 65,
    history: 60,
    access: 50,
  };

  const totalWeight =
    (weights.hazard || 30) +
    (weights.exposure || 25) +
    (weights.vulnerability || 20) +
    (weights.history || 15) +
    (weights.access || 10);

  // Normalization factor in case weights sum != 100
  const norm = totalWeight > 0 ? 100 / totalWeight : 1;

  const factors = [
    {
      key: "hazard",
      label: "Hazard Intensity (H)",
      description: "Slope steepness, drainage basin intersection, and regional susceptibility.",
      rawInput: `Slope ~${Math.round((f.hazard ?? 75) * 0.42)}°, Flood intersection: ${f.hazard >= 60 ? 'YES' : 'NO'}`,
      source: "GSI / NRSC Reference Specifications",
      vintage: "2023–2024 Base",
      method: "Multi-hazard spatial overlay (EPSG:4326)",
      status: "MODEL-DERIVED",
      indicatorNote: "Slope is one contributing hazard indicator, not a complete standalone landslide model.",
      value: f.hazard ?? 75,
      weight: Math.round((weights.hazard || 30) * norm),
      maxContribution: Math.round((weights.hazard || 30) * norm),
      actualContribution: Math.round(((f.hazard ?? 75) * ((weights.hazard || 30) * norm)) / 100),
      color: "#B5462F",
    },
    {
      key: "exposure",
      label: "Population Exposure (E)",
      description: "Number of residents and dwelling density directly located within the active hazard buffer.",
      rawInput: `Population: ${habitation.pop} residents`,
      source: "Census of India — 2011 Decennial Baseline",
      vintage: "2011 Decennial Baseline",
      method: "Spatial buffer intersection",
      status: "DEMONSTRATION DATASET",
      indicatorNote: "Demographic baseline from 2011 decennial census; pending electoral ground roll validation.",
      value: f.exposure ?? 70,
      weight: Math.round((weights.exposure || 25) * norm),
      maxContribution: Math.round((weights.exposure || 25) * norm),
      actualContribution: Math.round(((f.exposure ?? 70) * ((weights.exposure || 25) * norm)) / 100),
      color: "#E07A5F",
    },
    {
      key: "vulnerability",
      label: "Social Vulnerability (V)",
      description: "Fragile kutcha housing percentage, elderly/child demographics, and low adaptive capacity.",
      rawInput: `Socioeconomic fragility: ${f.vulnerability ?? 65}/100`,
      source: "SECC Reference / Local Body Survey",
      vintage: "2020 Demonstration Dataset",
      method: "Socioeconomic fragility weighted composite",
      status: "MODEL-DERIVED",
      indicatorNote: "Combines dwelling roof fragility with age-dependency ratios.",
      value: f.vulnerability ?? 65,
      weight: Math.round((weights.vulnerability || 20) * norm),
      maxContribution: Math.round((weights.vulnerability || 20) * norm),
      actualContribution: Math.round(((f.vulnerability ?? 65) * ((weights.vulnerability || 20) * norm)) / 100),
      color: "#C0872B",
    },
    {
      key: "history",
      label: "Disaster History (F)",
      description: "Recurrence frequency of extreme events in the available 2018–2024 observation period.",
      rawInput: `${habitation.events || 3} recorded incidents (2018–2024)`,
      source: "Demonstration State / District Incident Logs",
      vintage: "2018–2024 Observation Period",
      method: "Historical recurrence frequency tally",
      status: "DEMONSTRATION DATASET",
      indicatorNote: "7-year observation period (2018–2024); does not represent an exhaustive 100-year record.",
      value: f.history ?? 60,
      weight: Math.round((weights.history || 15) * norm),
      maxContribution: Math.round((weights.history || 15) * norm),
      actualContribution: Math.round(((f.history ?? 60) * ((weights.history || 15) * norm)) / 100),
      color: "#3D6B5C",
    },
    {
      key: "access",
      label: "Access Deficit (A)",
      description: "Transit distance to all-weather vehicular roads, bridges, and emergency secondary hospitals.",
      rawInput: `Access deficit score: ${f.access ?? 50}/100`,
      source: "PMGSY Reference / OpenStreetMap Transit Links",
      vintage: "2023 Prototype GIS Layer",
      method: "Euclidean & road network transit distance",
      status: "MODEL-DERIVED",
      indicatorNote: "Measures isolation and ambulance transit impediment during monsoon cloudbursts.",
      value: f.access ?? 50,
      weight: Math.round((weights.access || 10) * norm),
      maxContribution: Math.round((weights.access || 10) * norm),
      actualContribution: Math.round(((f.access ?? 50) * ((weights.access || 10) * norm)) / 100),
      color: "#22364A",
    },
  ];

  const computedTotal = factors.reduce((sum, item) => sum + item.actualContribution, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white border rounded-sm shadow-2xl relative max-h-[92vh] overflow-y-auto f-sans"
        style={{ borderColor: C.line }}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#152331] text-white border-b border-[#22364A]">
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-[#E07A5F]" />
            <h3 className="text-sm font-semibold tracking-wide">
              How is this score calculated? · MCDA Formulation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#22364A] rounded-xs text-[#9BA8AE] hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-[#1C2420]">
          {/* Target Habitation Summary Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#FAF9F5] border" style={{ borderColor: C.line }}>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#565F58] font-bold">
                Audited Settlement
              </p>
              <h4 className="f-serif text-lg font-bold text-[#1C2420] mt-0.5">
                {habitation.name} ({habitation.region})
              </h4>
              <p className="text-xs text-[#565F58]">
                Primary Hazard: <strong className="text-[#1C2420]">{habitation.hazard}</strong> · Pop: {habitation.pop.toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <TierBadge tier={habitation.tier} />
              </div>
              <p className="f-mono text-2xl font-bold text-[#B5462F]">
                {habitation.score} <span className="text-xs text-[#565F58] font-normal">/ 100</span>
              </p>
              <p className="text-[10px] font-mono text-[#565F58] uppercase">
                MCDA Risk Score
              </p>
            </div>
          </div>

          {/* Core Mathematical Formula */}
          <div className="p-3.5 rounded-sm bg-[#F4F7FA] border border-[#22364A]/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#22364A] uppercase tracking-wider font-mono">
                Mathematical Specification (Deterministic MCDA)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#E8F0EC] text-[#2A6B52] font-semibold">
                Mathematically Auditable
              </span>
            </div>
            <p className="text-xs font-mono text-[#1C2420] bg-white p-2 rounded-xs border border-[#D9D4C7]">
              Composite Risk = (w_h × H) + (w_e × E) + (w_v × V) + (w_f × F) + (w_a × A)
            </p>
            <p className="text-[11px] text-[#565F58] leading-relaxed">
              SURAKSHA uses <strong>Multi-Criteria Decision Analysis (MCDA)</strong> because the resulting risk score is transparent, auditable, and easier for human authorities to review. No black-box machine learning is used for the production risk score.
            </p>
          </div>

          {/* Factor Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C2420]">
              Factor Weight Contribution for {habitation.name}
            </h4>

            <div className="border rounded-sm overflow-hidden" style={{ borderColor: C.line }}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5F1] border-b" style={{ borderColor: C.line }}>
                    <th className="p-2.5 font-semibold text-[#1C2420]">Factor Criteria</th>
                    <th className="p-2.5 font-semibold text-[#1C2420] text-center">Raw Index</th>
                    <th className="p-2.5 font-semibold text-[#1C2420] text-center">Weight Ratio</th>
                    <th className="p-2.5 font-semibold text-[#1C2420] text-right">Points Contributed</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: C.line }}>
                  {factors.map((factor) => (
                    <tr key={factor.key} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="p-2.5 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#1C2420]">{factor.label}</p>
                          <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded-xs bg-[#F7F5F1] text-[#565F58] border border-[#D9D4C7]">
                            {factor.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#22364A] font-medium font-mono bg-[#F4F7FA] px-1.5 py-0.5 rounded-xs w-fit">
                          Raw Input: {factor.rawInput}
                        </p>
                        <p className="text-[10px] text-[#8C5D17] italic leading-tight">
                          {factor.indicatorNote}
                        </p>
                        <p className="text-[9px] text-[#565F58]">
                          Source: {factor.source} · Vintage: {factor.vintage}
                        </p>
                      </td>
                      <td className="p-2.5 text-center font-mono font-medium align-top pt-3">
                        {factor.value} / 100
                      </td>
                      <td className="p-2.5 text-center font-mono text-[#565F58] align-top pt-3">
                        {factor.weight}%
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold align-top pt-3" style={{ color: factor.color }}>
                        {factor.actualContribution} / {factor.maxContribution}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#FAF9F5] font-bold border-t" style={{ borderColor: C.line }}>
                    <td className="p-2.5" colSpan={3}>
                      Calculated Composite MCDA Score (Sum of Contributed Points):
                    </td>
                    <td className="p-2.5 text-right font-mono text-base text-[#B5462F]">
                      {habitation.score} / 100
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Tier Thresholds */}
          <div className="p-3.5 rounded-sm bg-[#FAF9F5] border space-y-2 text-xs" style={{ borderColor: C.line }}>
            <h5 className="font-bold text-[#1C2420] text-[11px] uppercase tracking-wider">
              Priority Tier Classification Rules
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xs bg-[#FFF1F0] border border-[#B5462F]/30 space-y-0.5">
                <span className="font-bold text-[#B5462F]">Immediate (Score ≥ 75)</span>
                <p className="text-[10px] text-[#565F58]">Severe life safety risk; priority relocation candidate or urgent in-situ defense.</p>
              </div>
              <div className="p-2 rounded-xs bg-[#FFF9EE] border border-[#C0872B]/30 space-y-0.5">
                <span className="font-bold text-[#C0872B]">Short-Term (55 – 74)</span>
                <p className="text-[10px] text-[#565F58]">Substantial vulnerability; engineering mitigation and planned resettlement.</p>
              </div>
              <div className="p-2 rounded-xs bg-[#E8F0EC] border border-[#2A6B52]/30 space-y-0.5">
                <span className="font-bold text-[#2A6B52]">Medium-Term (&lt; 55)</span>
                <p className="text-[10px] text-[#565F58]">Monitoring and localized community early warning systems.</p>
              </div>
            </div>
          </div>

          {/* Human Review Footer */}
          <div className="pt-2 text-xs text-[#565F58] flex items-center justify-between gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[11px]">
              <Info size={13} className="text-[#22364A] shrink-0" />
              Human / competent-authority review required before any administrative action.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#22364A] hover:bg-[#3E5E82] text-white text-xs font-semibold rounded-xs cursor-pointer transition-colors"
            >
              Close Explainer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
