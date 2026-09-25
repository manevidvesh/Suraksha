'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Network, ArrowRight, Home, MapPin, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export function RelocationMatchingSection() {
  const [activeTab, setActiveTab] = useState<"one_to_many" | "many_to_one">("one_to_many");

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-sm bg-[#0E1721] border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab("one_to_many")}
            className={`px-4 py-2 rounded-xs font-medium transition-colors cursor-pointer ${
              activeTab === "one_to_many"
                ? "bg-[#22364A] text-white font-semibold shadow-sm"
                : "text-[#9BA8AE] hover:text-white"
            }`}
          >
            Scenario A: 1 Habitation → Multiple Candidate Sites
          </button>
          <button
            onClick={() => setActiveTab("many_to_one")}
            className={`px-4 py-2 rounded-xs font-medium transition-colors cursor-pointer ${
              activeTab === "many_to_one"
                ? "bg-[#22364A] text-white font-semibold shadow-sm"
                : "text-[#9BA8AE] hover:text-white"
            }`}
          >
            Scenario B: Multiple Habitations → Shared Finite Capacity
          </button>
        </div>
      </div>

      {/* Demonstration Card Container */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#101C27] shadow-xl">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
            {activeTab === "one_to_many" ? "ALTERNATIVE ROUTING INTELLIGENCE" : "FINITE CAPACITY COMPETITION"}
          </span>
          <h3 className="f-serif text-xl sm:text-2xl font-bold text-white mt-1">
            &ldquo;Relocation is not a simple 1-to-1 assignment.&rdquo;
          </h3>
          <p className="text-xs text-[#C7D0D4] mt-2 leading-relaxed">
            {activeTab === "one_to_many"
              ? "When a high-risk settlement requires relocation, the engine evaluates all geographically viable candidate sites within the allowable travel corridor, comparing travel friction, absorption headroom, and infrastructure bottlenecks."
              : "Multiple endangered hamlets in the same valley often compete for finite public land. SURAKSHA checks that cumulative population demand never exceeds the host site's tightest municipal infrastructure capacity."}
          </p>
        </div>

        {/* Visual Matching Representation */}
        {activeTab === "one_to_many" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2">
            {/* Left: Origin Habitation */}
            <div className="md:col-span-4 p-4 rounded-sm bg-[#152331] border border-[#B5462F]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#B5462F]/20 text-[#E07A5F] border border-[#B5462F]/30">
                  DEMAND ORIGIN
                </span>
                <span className="text-xs font-mono font-bold text-[#E07A5F]">Pop: 410</span>
              </div>
              <h4 className="text-sm font-bold text-white">Chooralmala Hamlet</h4>
              <p className="text-[11px] text-[#9BA8AE]">Wayanad Corridor · Landslide Immediate</p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-[#C7D0D4]">
                Requires <strong className="text-white">410</strong> resettlement absorption slots.
              </div>
            </div>

            {/* Middle: Routing Indicator */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-[#9BA8AE]">
              <span className="text-[10px] font-mono hidden md:block rotate-90">MATCH</span>
              <ArrowRight size={20} className="hidden md:block my-1 text-white/50" />
              <span className="text-xs md:hidden">↓ Alternative Candidate Destinations ↓</span>
            </div>

            {/* Right: Candidate Destination Sites */}
            <div className="md:col-span-7 space-y-2.5">
              {/* Candidate Site 1 */}
              <div className="p-3.5 rounded-sm bg-[#0E1721] border border-[#2A6B52]/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#2A6B52]/20 text-[#3D6B5C] border border-[#2A6B52]/40">
                      RANK #1 OPTION
                    </span>
                    <h5 className="text-xs font-bold text-white">Ambalavayal Sector (S2)</h5>
                  </div>
                  <p className="text-[11px] text-[#9BA8AE]">Distance: 18.6 km · Liebig Cap: 400 persons</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#3D6B5C]">Full Absorption</span>
                  <p className="text-[10px] text-[#9BA8AE]">No capacity gap</p>
                </div>
              </div>

              {/* Candidate Site 2 */}
              <div className="p-3.5 rounded-sm bg-[#0E1721] border border-[#C0872B]/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#C0872B]/20 text-[#C0872B] border border-[#C0872B]/40">
                      RANK #2 (PARTIAL)
                    </span>
                    <h5 className="text-xs font-bold text-white">Meenangadi Plateau (S1)</h5>
                  </div>
                  <p className="text-[11px] text-[#9BA8AE]">Distance: 14.2 km · Liebig Cap: 250 persons</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#C0872B]">Deficit: 160</span>
                  <p className="text-[10px] text-[#9BA8AE]">Multi-site split required</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2">
            {/* Left: Two Origin Habitations */}
            <div className="md:col-span-5 space-y-2.5">
              <div className="p-3 rounded-sm bg-[#152331] border border-[#B5462F]/30 flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-bold text-white">Habitation A: Chooralmala</h5>
                  <p className="text-[10.5px] text-[#9BA8AE]">Assessed Demand: 210 persons</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E07A5F]">Demand: 210</span>
              </div>

              <div className="p-3 rounded-sm bg-[#152331] border border-[#B5462F]/30 flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-bold text-white">Habitation B: Attamala</h5>
                  <p className="text-[10.5px] text-[#9BA8AE]">Assessed Demand: 180 persons</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E07A5F]">Demand: 180</span>
              </div>

              <div className="text-[11px] text-right font-mono text-[#9BA8AE]">
                Cumulative Demand: <strong className="text-white">390 Persons</strong>
              </div>
            </div>

            {/* Middle: Constraint Funnel */}
            <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono text-[#C0872B] font-bold">SHARED CEILING</span>
              <div className="h-0.5 w-12 bg-[#C0872B]/50 my-1.5" />
              <span className="text-[10px] text-[#9BA8AE]">Finite Civic Limit</span>
            </div>

            {/* Right: Shared Candidate Site */}
            <div className="md:col-span-5 p-4 rounded-sm bg-[#0E1721] border border-[#2A6B52]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#2A6B52]/20 text-[#3D6B5C] border border-[#2A6B52]/40">
                  RECEPTIVE DESTINATION
                </span>
                <span className="text-xs font-mono font-bold text-[#3D6B5C]">Cap: 400</span>
              </div>
              <h4 className="text-sm font-bold text-white">Ambalavayal Sector (S2)</h4>
              
              {/* Capacity Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#9BA8AE]">
                  <span>Allocated: 390 / 400</span>
                  <span>97.5% Utilized</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="h-full bg-[#B5462F]" style={{ width: "52.5%" }} title="Habitation A: 210" />
                  <div className="h-full bg-[#E07A5F]" style={{ width: "45%" }} title="Habitation B: 180" />
                </div>
              </div>

              <p className="text-[11px] text-[#3D6B5C] font-semibold flex items-center gap-1 pt-1">
                <CheckCircle2 size={13} /> Feasible joint allocation without bottleneck breach (10 headroom).
              </p>
            </div>
          </div>
        )}

        {/* Direct Action Link */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-[#9BA8AE]">
            Explore real-time habitation-to-candidate site allocations in the interactive matching engine.
          </span>
          <Link
            href="/relocation"
            className="text-white hover:text-[#E07A5F] inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Open Relocation Intelligence</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
