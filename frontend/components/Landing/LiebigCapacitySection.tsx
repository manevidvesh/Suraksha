'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Droplet, Home, School, Stethoscope, Trees, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

interface Pillar {
  id: string;
  name: string;
  icon: any;
  capacity: number;
  unit: string;
  isBottleneck: boolean;
  notes: string;
}

const PILLARS: Pillar[] = [
  {
    id: "land",
    name: "Land Footprint",
    icon: Trees,
    capacity: 500,
    unit: "persons (at 60m²/household)",
    isBottleneck: false,
    notes: "Flat topographical gradient (<8°) with 2.5 hectares clear revenue land.",
  },
  {
    id: "water",
    name: "Drinking Water Supply",
    icon: Droplet,
    capacity: 250,
    unit: "persons (at 70 lpcd standard)",
    isBottleneck: true,
    notes: "Local borewell recovery rate and piped water scheme limits sustained intake to 250 residents.",
  },
  {
    id: "sanitation",
    name: "Sanitation & Drainage",
    icon: Home,
    capacity: 380,
    unit: "persons (septic absorption capacity)",
    isBottleneck: false,
    notes: "Soil percolation rate allows standard decentralized soak-pit infrastructure.",
  },
  {
    id: "healthcare",
    name: "Primary Healthcare",
    icon: Stethoscope,
    capacity: 300,
    unit: "persons (Primary Health Sub-centre)",
    isBottleneck: false,
    notes: "Sub-centre within 4.2 km with 1 medical officer and auxiliary nursing nurse.",
  },
  {
    id: "schools",
    name: "Primary Education",
    icon: School,
    capacity: 250,
    unit: "persons (pupil-teacher absorption)",
    isBottleneck: true,
    notes: "Local Government Upper Primary School has 45 available classroom desks.",
  },
];

export function LiebigCapacitySection() {
  const [activeSite, setActiveSite] = useState<"S1" | "S2">("S1");

  // S1 Liebig minimum: 250 (Water & Schools)
  // S2 Liebig minimum: 400 (Healthcare)
  const effectiveCapacity = activeSite === "S1" ? 250 : 400;
  const limitingResource = activeSite === "S1" ? "Water Supply & Primary Schools" : "Primary Healthcare Capacity";

  return (
    <div className="space-y-6">
      {/* Formula & Conceptual Card */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#0E1721] text-center space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BA8AE] font-bold">
          INFRASTRUCTURE BOTTLENECK FORMULA (LIEBIG&apos;S LAW OF THE MINIMUM)
        </span>

        <div className="inline-block p-3.5 sm:p-4 rounded-sm bg-[#152331] border border-white/10 shadow-inner">
          <div className="f-mono text-base sm:text-xl font-bold text-white tracking-wide">
            <span className="text-[#F7F5F1]">Effective Capacity</span> ={" "}
            <span className="text-[#E07A5F]">min</span>(
            <span className="text-[#3D6B5C]">Land</span>,{" "}
            <span className="text-[#8AB4F8]">Water</span>,{" "}
            <span className="text-[#C0872B]">Sanitation</span>,{" "}
            <span className="text-[#E07A5F]">Healthcare</span>,{" "}
            <span className="text-[#3E5E82]">Schools</span>
            )
          </div>
        </div>

        <p className="text-xs text-[#9BA8AE] max-w-2xl mx-auto leading-relaxed">
          Just as a wooden barrel holds water only up to its shortest stave, a candidate relocation site can safely accommodate only as many displaced residents as its most constrained civic infrastructure allows.
        </p>
      </div>

      {/* Visual Capacity Pillars Inspector */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#101C27] shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#9BA8AE] font-bold">
              CANDIDATE SITE CARRYING CAPACITY AUDIT
            </span>
            <h4 className="f-serif text-lg font-bold text-white mt-0.5">
              Meenangadi Plateau Sector (Candidate Site S1)
            </h4>
          </div>

          <div className="p-2.5 rounded-xs bg-[#B5462F]/20 border border-[#B5462F]/40 flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#E07A5F] shrink-0" />
            <div className="text-left text-xs font-mono">
              <span className="text-[10px] text-[#9BA8AE] block">EFFECTIVE GOVERNING CAPACITY:</span>
              <strong className="text-white text-sm">{effectiveCapacity} Residents</strong>{" "}
              <span className="text-[#E07A5F] font-semibold">({limitingResource})</span>
            </div>
          </div>
        </div>

        {/* 5 Infrastructure Pillars Bars */}
        <div className="space-y-3.5 pt-1">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            const pct = (p.capacity / 500) * 100;
            return (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={p.isBottleneck ? "text-[#E07A5F]" : "text-[#9BA8AE]"} />
                    <span className="font-semibold text-white">{p.name}</span>
                    {p.isBottleneck && (
                      <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-xs bg-[#B5462F]/20 text-[#E07A5F] border border-[#B5462F]/40 font-bold uppercase">
                        Active Bottleneck
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs">
                    <strong className="text-white">{p.capacity}</strong>
                    <span className="text-[#9BA8AE] text-[11px]"> / 500 max ({p.unit})</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-3 rounded-xs bg-white/10 overflow-hidden relative">
                  <div
                    className={`h-full rounded-xs transition-all duration-500 ${
                      p.isBottleneck ? "bg-[#B5462F]" : "bg-[#2A6B52]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Subtle Benchmark Indicator at 250 */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                    style={{ left: "50%" }}
                    title="Governing Threshold (250)"
                  />
                </div>

                <p className="text-[10.5px] text-[#9BA8AE]">{p.notes}</p>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-[#9BA8AE]">
            Even though land exists for 500 residents, allocating more than 250 would cause water depletion and school overcrowding.
          </span>
          <Link
            href="/simulation"
            className="text-white hover:text-[#E07A5F] inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Test Liebig Capacity in Simulator</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
