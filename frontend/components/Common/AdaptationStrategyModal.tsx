'use client';

import React, { useState } from "react";
import {
  ShieldAlert,
  X,
  Layers,
  Clock,
  Building2,
  Coins,
  CheckCircle2,
  TrendingDown,
  Users,
  Compass,
  FileDown,
  Info,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";
import { ZoneAdaptationStrategy, AdaptationPillar, StrategyIntervention } from "@/lib/adaptationStrategies";
import { C } from "./constants";

export interface AdaptationStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: ZoneAdaptationStrategy | null;
  habitationName?: string;
}

export function AdaptationStrategyModal({
  isOpen,
  onClose,
  strategy,
  habitationName,
}: AdaptationStrategyModalProps) {
  const [activePillar, setActivePillar] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !strategy) return null;

  const currentPillar = strategy.pillars.find((p) => p.pillarNumber === activePillar) || strategy.pillars[0];

  const handleCopySummary = () => {
    const text = `SURAKSHA DISASTER MANAGEMENT DIRECTIVE: IN-SITU ADAPTATION STRATEGY
Zone: ${strategy.zoneName} (${strategy.region})
Hazard: ${strategy.hazardType}
Why Non-Relocation: ${strategy.whyNoRelocation}

ESTIMATED COST BENEFIT:
- In-Situ Protection Cost: ${strategy.costBenefitVsRelocation.estimatedInSituCost}
- Relocation Cost: ${strategy.costBenefitVsRelocation.estimatedRelocationCost}
- Budget Savings: ${strategy.costBenefitVsRelocation.costSavingsPercent}%
- Social Acceptance: ${strategy.costBenefitVsRelocation.socialAcceptanceScore}/100

PILLARS OF INTERVENTION:
${strategy.pillars
  .map(
    (p) => `
PILLAR ${p.pillarNumber}: ${p.title} (${p.category})
` +
      p.interventions
        .map(
          (i) => `  * ${i.name} [${i.engineeringType} | ${i.timeline} | ${i.estimatedCost}]\n    Agency: ${i.implementingAgency}\n    Detail: ${i.description}`
        )
        .join("\n")
  )
  .join("\n\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl rounded-sm border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] bg-white my-auto"
        style={{ borderColor: C.line }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex items-start justify-between gap-4 bg-[#22364A] text-white">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xs bg-[#B5462F] text-white shrink-0 mt-0.5">
              <LifeBuoy size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-white/15 text-[#F7F5F1] uppercase tracking-wider font-semibold">
                  Candidate In-Situ Adaptation Measures
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-xs bg-[#C0872B] text-white font-medium">
                  Alternative to Relocation
                </span>
              </div>
              <h2 className="f-serif text-lg sm:text-xl font-bold mt-1 text-white">
                {habitationName ? `${habitationName} · ` : ""}{strategy.zoneName}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {strategy.region} · Primary Hazard: <strong className="text-white">{strategy.hazardType}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Policy Rationale Banner */}
          <div className="border border-[#C0872B]/60 bg-[#FFFDF7] p-4 rounded-sm flex items-start gap-3">
            <Info size={18} className="text-[#C0872B] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-[#1C2420]">
              <span className="font-semibold text-[#B5462F]">
                Why Candidate In-Situ Adaptation Measures Are Evaluated Over Permanent Relocation:
              </span>
              <p className="mt-1 text-[#565F58]">{strategy.whyNoRelocation}</p>
            </div>
          </div>

          {/* Cost-Benefit & Feasibility Comparison Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border bg-[#D9D4C7] rounded-sm overflow-hidden">
            <div className="bg-white p-3">
              <p className="text-[11px] text-[#565F58]">In-Situ Adaptation</p>
              <p className="f-mono text-sm font-bold text-[#1C2420] mt-0.5">
                {strategy.costBenefitVsRelocation.estimatedInSituCost}
              </p>
              <span className="text-[10px] text-[#3D6B5C] font-medium">Cost-Effective</span>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] text-[#565F58]">Full Relocation Cost</p>
              <p className="f-mono text-sm font-bold text-[#565F58] line-through mt-0.5">
                {strategy.costBenefitVsRelocation.estimatedRelocationCost}
              </p>
              <span className="text-[10px] text-[#B5462F]">Prohibitive</span>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] text-[#565F58]">Exchequer Savings</p>
              <p className="f-mono text-base font-bold text-[#3D6B5C] flex items-center gap-1 mt-0.5">
                <TrendingDown size={14} /> {strategy.costBenefitVsRelocation.costSavingsPercent}%
              </p>
              <span className="text-[10px] text-[#565F58]">Fiscal Conservation</span>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] text-[#565F58]">Community Acceptance</p>
              <p className="f-mono text-base font-bold text-[#22364A] flex items-center gap-1 mt-0.5">
                <Users size={14} /> {strategy.costBenefitVsRelocation.socialAcceptanceScore}%
              </p>
              <span className="text-[10px] text-[#3D6B5C]">Overwhelming Support</span>
            </div>
          </div>

          {/* Strategic Pillars Selection Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#1C2420] uppercase tracking-wider">
                The 3 Core Strategic Pillars:
              </p>
              <span className="text-[11px] text-[#565F58]">Click pillar to inspect civil engineering actions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {strategy.pillars.map((pillar) => {
                const isSelected = pillar.pillarNumber === activePillar;
                return (
                  <button
                    key={pillar.pillarNumber}
                    onClick={() => setActivePillar(pillar.pillarNumber)}
                    className={`text-left p-3 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#22364A] text-white border-[#22364A] shadow-xs"
                        : "bg-[#F7F5F1] hover:bg-white text-[#1C2420] border-[#D9D4C7]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-[#22364A]/10 text-[#22364A]"
                        }`}
                      >
                        Pillar {pillar.pillarNumber}
                      </span>
                      {isSelected && <CheckCircle2 size={12} className="text-[#64B5F6]" />}
                    </div>
                    <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#1C2420]"}`}>
                      {pillar.title}
                    </p>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-white/80" : "text-[#565F58]"}`}>
                      {pillar.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Pillar Interventions Detail List */}
          <div className="border rounded-sm p-4 bg-[#FBFBFA]" style={{ borderColor: C.line }}>
            <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: C.line }}>
              <div>
                <span className="text-[11px] text-[#3E5E82] font-semibold uppercase tracking-wider">
                  Pillar {currentPillar.pillarNumber} Engineering Portfolio
                </span>
                <h3 className="text-sm font-bold text-[#1C2420]">{currentPillar.title}</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-xs bg-[#22364A] text-white font-medium">
                {currentPillar.category}
              </span>
            </div>

            <div className="space-y-3">
              {currentPillar.interventions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white border rounded-sm hover:border-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h4 className="text-xs font-bold text-[#1C2420] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F]" />
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2 py-0.5 rounded-xs font-medium bg-[#F7F5F1] text-[#22364A] border border-[#D9D4C7]">
                        {item.engineeringType}
                      </span>
                      <span className="px-2 py-0.5 rounded-xs font-medium bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30 flex items-center gap-1">
                        <Clock size={10} /> {item.timeline}
                      </span>
                      <span className="px-2 py-0.5 rounded-xs font-semibold bg-[#EAF3EE] text-[#3D6B5C] border border-[#3D6B5C]/30 flex items-center gap-1">
                        <Coins size={10} /> {item.estimatedCost}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#565F58] mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-dashed border-[#D9D4C7] flex items-center gap-1.5 text-[11px] text-[#565F58]">
                    <Building2 size={12} className="text-[#3E5E82] shrink-0" />
                    <span>Implementing Authority: <strong className="text-[#1C2420]">{item.implementingAgency}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-3.5 border-t flex items-center justify-between bg-white shrink-0"
          style={{ borderColor: C.line }}
        >
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-[#F7F5F1] text-[#22364A] transition-colors cursor-pointer"
            style={{ borderColor: C.line }}
          >
            {copied ? (
              <>
                <CheckCircle2 size={13} className="text-[#3D6B5C]" /> Copied to Clipboard
              </>
            ) : (
              <>
                <FileDown size={13} /> Copy Candidate In-Situ Summary
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors cursor-pointer"
          >
            Close Strategy Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
