'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Sliders, ArrowRight, Info, Shield, CheckCircle2 } from "lucide-react";

interface MCDAFactor {
  symbol: string;
  weight: number;
  weightPercent: string;
  name: string;
  color: string;
  subFactors: string;
  description: string;
}

const FACTORS: MCDAFactor[] = [
  {
    symbol: "H",
    weight: 0.30,
    weightPercent: "30%",
    name: "Hazard Intensity",
    color: "#B5462F",
    subFactors: "Slope steepness (>22°), rainfall trigger intensity, active buffer intersection",
    description: "Evaluates physical susceptibility and terrain failure mechanics derived from digital elevation models and historical landslide inventories.",
  },
  {
    symbol: "E",
    weight: 0.25,
    weightPercent: "25%",
    name: "Population Exposure",
    color: "#E07A5F",
    subFactors: "Resident population count, household density, built-up footprint",
    description: "Quantifies human and structural presence inside the model-generated hazard perimeter using decennial census baselines.",
  },
  {
    symbol: "V",
    weight: 0.20,
    weightPercent: "20%",
    name: "Structural Vulnerability",
    color: "#C0872B",
    subFactors: "Kutcha roof/wall ratio, lack of drainage infrastructure, slope positioning",
    description: "Assesses dwelling fragility and community vulnerability indicators that exacerbate physical disaster impacts.",
  },
  {
    symbol: "F",
    weight: 0.15,
    weightPercent: "15%",
    name: "Disaster Recurrence (History)",
    color: "#3E5E82",
    subFactors: "Historical flood/debris flow incidents, recorded fatalities, past evacuations",
    description: "Weights documented historical incident frequency from Geological Survey of India (GSI) and State Disaster Management Authority logs.",
  },
  {
    symbol: "A",
    weight: 0.10,
    weightPercent: "10%",
    name: "Accessibility Deficit",
    color: "#3D6B5C",
    subFactors: "Single-access roads, distance to state highways, bridge vulnerability",
    description: "Measures physical egress friction during emergencies and logistical difficulty in mounting rapid evacuation operations.",
  },
];

export function EngineMCDASection() {
  const [selectedFactor, setSelectedFactor] = useState<MCDAFactor>(FACTORS[0]);

  return (
    <div className="space-y-6">
      {/* Mathematical Formula Banner */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#0E1721] text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BA8AE] font-bold">
          DETERMINISTIC MULTI-CRITERIA DECISION ANALYSIS (MCDA) FORMULA
        </span>

        {/* KaTeX / Math Typography Presentation */}
        <div className="inline-block p-4 sm:p-5 rounded-sm bg-[#152331] border border-white/10 shadow-inner">
          <div className="f-mono text-base sm:text-2xl font-bold text-white tracking-wide">
            <span className="text-[#F7F5F1]">Risk</span> ={" "}
            <span className="text-[#E07A5F]">0.30</span><span className="text-white font-serif">H</span> +{" "}
            <span className="text-[#E07A5F]">0.25</span><span className="text-white font-serif">E</span> +{" "}
            <span className="text-[#C0872B]">0.20</span><span className="text-white font-serif">V</span> +{" "}
            <span className="text-[#8AB4F8]">0.15</span><span className="text-white font-serif">F</span> +{" "}
            <span className="text-[#3D6B5C]">0.10</span><span className="text-white font-serif">A</span>
          </div>
        </div>

        <p className="text-xs text-[#9BA8AE] max-w-2xl mx-auto leading-relaxed">
          Prototype decision-model parameters configured for transparent prioritization. Weights sum strictly to 1.00 (100%), producing a normalized composite score from 0 to 100 for every evaluated settlement.
        </p>
      </div>

      {/* Interactive 5 Factor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {FACTORS.map((f) => {
          const isSelected = selectedFactor.symbol === f.symbol;
          return (
            <button
              key={f.symbol}
              onClick={() => setSelectedFactor(f)}
              className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#182635] border-white/40 shadow-lg translate-y-[-2px]"
                  : "bg-[#101C27] border-white/10 hover:border-white/20 hover:bg-[#152331]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span
                    className="w-7 h-7 rounded-xs font-serif font-bold text-sm flex items-center justify-center text-white"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.symbol}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{f.weightPercent}</span>
                </div>
                <h4 className="text-xs font-bold text-[#F7F5F1] leading-tight">{f.name}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-mono text-[#9BA8AE]">
                Weight: {f.weight.toFixed(2)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Factor Deep-Dive Detail Panel */}
      <div className="p-5 rounded-sm bg-[#101C27] border border-white/15 shadow-xl flex flex-col md:flex-row items-start justify-between gap-5">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs text-white"
              style={{ backgroundColor: selectedFactor.color }}
            >
              FACTOR {selectedFactor.symbol} ({selectedFactor.weightPercent} WEIGHT)
            </span>
            <span className="text-xs font-bold text-white">{selectedFactor.name}</span>
          </div>

          <p className="text-xs text-[#C7D0D4] leading-relaxed pt-1">
            {selectedFactor.description}
          </p>

          <div className="text-[11px] text-[#9BA8AE] pt-1">
            <strong className="text-white">Primary Indicators: </strong>
            {selectedFactor.subFactors}
          </div>
        </div>

        {/* Priority Tiers Reference */}
        <div className="p-3.5 rounded-xs bg-[#0E1721] border border-white/10 text-xs space-y-2 shrink-0 w-full md:w-64">
          <span className="text-[10px] font-mono font-bold uppercase text-[#9BA8AE] block">
            OPERATIONAL TIERS
          </span>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-center text-[#E07A5F]">
              <span>Immediate:</span>
              <strong className="font-bold">Score ≥ 70</strong>
            </div>
            <div className="flex justify-between items-center text-[#C0872B]">
              <span>Short-Term:</span>
              <strong className="font-bold">Score 45 – 69</strong>
            </div>
            <div className="flex justify-between items-center text-[#8AB4F8]">
              <span>Medium-Term:</span>
              <strong className="font-bold">Score &lt; 45</strong>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10">
            <Link
              href="/habitations"
              className="text-[11px] text-[#C7D0D4] hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Test weights in Habitation Risk</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
