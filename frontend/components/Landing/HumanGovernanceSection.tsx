'use client';

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Cpu, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";

export function HumanGovernanceSection() {
  return (
    <div className="space-y-6">
      {/* Central Principle Banner */}
      <div className="p-8 sm:p-10 rounded-sm border border-white/20 bg-gradient-to-b from-[#152331] to-[#0E1721] text-center space-y-4 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#B5462F]/15 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
          <ShieldCheck size={14} className="text-[#3D6B5C]" />
          <span>STATUTORY DECISION-SUPPORT GOVERNANCE STANDARD</span>
        </div>

        {/* The 4-Pillar Core Statement */}
        <h3 className="f-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          &ldquo;AI explains. GIS measures.<br className="hidden sm:inline" />
          The decision engine calculates. <span className="text-[#E07A5F] italic">Humans decide.&rdquo;</span>
        </h3>

        <p className="text-xs sm:text-sm text-[#C7D0D4] max-w-2xl mx-auto leading-relaxed pt-2">
          SURAKSHA verifies computational consistency rather than real-world ground truth; statutory determinations, ground surveys, and administrative decisions remain the responsibility of the competent disaster management authorities.
        </p>
      </div>

      {/* 4 Architectural Role Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: AI Explains */}
        <div className="p-5 rounded-sm bg-[#101C27] border border-white/10 space-y-2.5 hover:border-white/20 transition-colors">
          <div className="w-8 h-8 rounded-xs bg-[#8AB4F8]/15 text-[#8AB4F8] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h4 className="text-sm font-bold text-white">1. AI Explains</h4>
          <p className="text-xs text-[#9BA8AE] leading-relaxed">
            LLMs synthesize structured findings into administrative executive briefs without mathematical discrepancy or autonomous hallucination.
          </p>
          <div className="pt-2 border-t border-white/10 text-[10.5px] font-mono text-white/50">
            Factual Summarization Layer
          </div>
        </div>

        {/* Pillar 2: GIS Measures */}
        <div className="p-5 rounded-sm bg-[#101C27] border border-white/10 space-y-2.5 hover:border-white/20 transition-colors">
          <div className="w-8 h-8 rounded-xs bg-[#3D6B5C]/15 text-[#3D6B5C] flex items-center justify-center">
            <Compass size={16} />
          </div>
          <h4 className="text-sm font-bold text-white">2. GIS Measures</h4>
          <p className="text-xs text-[#9BA8AE] leading-relaxed">
            PostGIS spatial algorithms compute coordinate buffers, digital elevation slope angles, and geodesic road network distances.
          </p>
          <div className="pt-2 border-t border-white/10 text-[10.5px] font-mono text-white/50">
            Spatial Measurement Layer
          </div>
        </div>

        {/* Pillar 3: Decision Engine Calculates */}
        <div className="p-5 rounded-sm bg-[#101C27] border border-white/10 space-y-2.5 hover:border-white/20 transition-colors">
          <div className="w-8 h-8 rounded-xs bg-[#C0872B]/15 text-[#C0872B] flex items-center justify-center">
            <Cpu size={16} />
          </div>
          <h4 className="text-sm font-bold text-white">3. Engine Calculates</h4>
          <p className="text-xs text-[#9BA8AE] leading-relaxed">
            Deterministic MCDA formula and Liebig bottleneck minimums calculate reproducible priority tiers and allocation proposals.
          </p>
          <div className="pt-2 border-t border-white/10 text-[10.5px] font-mono text-white/50">
            Deterministic Calculation Layer
          </div>
        </div>

        {/* Pillar 4: Humans Decide */}
        <div className="p-5 rounded-sm bg-[#101C27] border border-[#B5462F]/30 space-y-2.5 hover:border-[#B5462F]/50 transition-colors">
          <div className="w-8 h-8 rounded-xs bg-[#B5462F]/15 text-[#E07A5F] flex items-center justify-center">
            <UserCheck size={16} />
          </div>
          <h4 className="text-sm font-bold text-white">4. Humans Decide</h4>
          <p className="text-xs text-[#9BA8AE] leading-relaxed">
            District Collectors, DDMA Chairpersons, and field officers retain the sole constitutional and statutory authority to authorize relocation.
          </p>
          <div className="pt-2 border-t border-white/10 text-[10.5px] font-mono text-[#E07A5F]">
            Administrative Authority
          </div>
        </div>
      </div>
    </div>
  );
}
