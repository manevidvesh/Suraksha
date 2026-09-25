'use client';

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  Compass,
  AlertTriangle,
  MapPin,
  ClipboardCheck,
} from "lucide-react";
import { C } from "../components/Common/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col f-sans selection:bg-[#B5462F] selection:text-white" style={{ backgroundColor: "#152331" }}>
      {/* Top Ribbon */}
      <div className="bg-[#0E1721] px-6 sm:px-12 py-1.5 border-b border-white/5 text-[11px] text-[#7C8A90] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2A6B52]" />
          <span>SURAKSHA PROTOTYPE · Disaster Risk & Relocation Decision-Support Engine</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px]">
          <span>5 Regional Planning Corridors</span>
          <span className="font-mono text-white/70">WGS84 / PostGIS</span>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="px-6 sm:px-12 py-4 flex items-center justify-between border-b border-white/10 bg-[#152331]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#B5462F] flex items-center justify-center text-white font-bold shadow-md shadow-[#B5462F]/30">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="f-serif text-lg font-bold tracking-tight text-[#F7F5F1]">
                SURAKSHA
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs bg-white/10 text-[#C7D0D4] tracking-wider border border-white/10">
                SURAKSHA Decision Support
              </span>
            </div>
          </div>
        </div>

        {/* Header Navigation Links */}
        <nav className="flex items-center gap-3 sm:gap-6 text-xs font-medium">
          <Link
            href="/dashboard"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/risk-map"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Multi-Hazard Map
          </Link>
          <Link
            href="/habitations"
            className="text-[#C7D0D4] hover:text-white transition-colors hidden md:inline-block"
          >
            Habitation Risk
          </Link>
          <Link
            href="/relocation"
            className="text-[#C7D0D4] hover:text-white transition-colors hidden sm:inline-block"
          >
            Relocation Intelligence
          </Link>
          <Link
            href="/simulation"
            className="text-[#C7D0D4] hover:text-white transition-colors hidden lg:inline-block"
          >
            What-If Simulation
          </Link>
          <Link
            href="/sources"
            className="text-[#C7D0D4] hover:text-white transition-colors hidden xl:inline-block"
          >
            Evidence &amp; Sources
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-10 py-10 sm:py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Mission & Core Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span className="w-2 h-2 rounded-full bg-[#2A6B52]" />
              <span>POSTGIS GIS · DETERMINISTIC MCDA · AI EXPLANATION</span>
            </div>

            <h1 className="f-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-[#F7F5F1] font-bold tracking-tight">
              Move people <span className="text-[#E07A5F] italic font-serif">before</span> the ground does.
            </h1>

            <p className="f-sans text-base sm:text-lg text-[#C7D0D4] leading-relaxed max-w-2xl font-light">
              <strong className="text-white font-semibold">SURAKSHA</strong> leverages terrain slope gradients, flood hazard indicators, and carrying capacity constraints to rank vulnerable settlements and evaluate viable candidate relocation sites before disaster strikes.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10">
              <div>
                <p className="f-mono text-2xl sm:text-3xl font-bold text-white">16</p>
                <p className="text-[11px] text-[#9BA8AE] mt-0.5">Pilot Settlements</p>
              </div>
              <div>
                <p className="f-mono text-2xl sm:text-3xl font-bold text-[#E07A5F]">9,800+</p>
                <p className="text-[11px] text-[#9BA8AE] mt-0.5">Exposed Population</p>
              </div>
              <div>
                <p className="f-mono text-2xl sm:text-3xl font-bold text-[#2A6B52]">5</p>
                <p className="text-[11px] text-[#9BA8AE] mt-0.5">Regional Corridors</p>
              </div>
              <div>
                <p className="f-sans text-xs font-bold text-[#C0872B] leading-tight">GIS-Powered</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">Explainable · AI-Assisted</p>
              </div>
            </div>

            {/* THE TWO CORE ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3 rounded-sm bg-[#F7F5F1] text-[#152331] hover:bg-white shadow-xl transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Open Dashboard <ArrowRight size={16} />
              </Link>

              <Link
                href="/risk-map"
                className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3 rounded-sm border border-white/20 text-[#F7F5F1] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Compass size={16} /> Explore Multi-Hazard Map
              </Link>
            </div>
          </div>

          {/* Right Column: Spatial Multi-Hazard & Relocation Schematic (Proportioned to text height) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[355px] sm:max-w-[375px] rounded-sm border border-white/20 bg-[#1A2837]/90 p-2 shadow-xl backdrop-blur-xs">
              {/* Thin Framed Canvas */}
              <div className="rounded-xs overflow-hidden border border-white/15 bg-[#0E1721] relative aspect-square flex items-center justify-center">
                <img
                  src="/images/suraksha-spatial-schematic.png"
                  alt="Multi-Hazard Red Zone & Relocation Vector Schematic"
                  className="w-full h-full object-contain block"
                  loading="eager"
                />
              </div>

              {/* Bottom Caption Text */}
              <div className="px-1 pt-2 pb-0.5 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-medium text-[#F7F5F1]">
                  <span>Spatial Risk & Relocation Vector</span>
                  <span className="text-[#9BA8AE]">2 KM Scale</span>
                </div>
                <p className="text-[10px] text-[#9BA8AE] leading-tight font-sans">
                  PostGIS buffer across altitude contours to candidate relocation site.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Operational Principles (Informational cards, zero extra buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 pt-10 border-t border-white/10">
          <div className="p-5 rounded-sm bg-white/5 border border-white/10">
            <div className="p-2 w-fit rounded-xs bg-[#B5462F]/20 text-[#E07A5F] mb-3">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">
              1. Model-Identified High-Risk Zones
            </h3>
            <p className="text-xs text-[#9BA8AE] leading-relaxed">
              Delineates high-susceptibility zones using slope gradients, flood levels, and historical disaster recurrence for decision-support screening.
            </p>
          </div>

          <div className="p-5 rounded-sm bg-white/5 border border-white/10">
            <div className="p-2 w-fit rounded-xs bg-[#3D6B5C]/20 text-[#3D6B5C] mb-3">
              <MapPin size={18} />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">
              2. Liebig Bottleneck Capacity Matching
            </h3>
            <p className="text-xs text-[#9BA8AE] leading-relaxed">
              Applies Liebig&apos;s Law: resettlement carrying capacity is strictly determined by the tightest infrastructure bottleneck (water, sanitation, schools, healthcare).
            </p>
          </div>

          <div className="p-5 rounded-sm bg-white/5 border border-white/10">
            <div className="p-2 w-fit rounded-xs bg-[#C0872B]/20 text-[#C0872B] mb-3">
              <ClipboardCheck size={18} />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">
              3. Decision Engine & Human Authority
            </h3>
            <p className="text-xs text-[#9BA8AE] leading-relaxed">
              Calculates deterministic MCDA priority tiers, provides AI-assisted policy brief explanations, and preserves final authority with competent SDMA/DDMA officials.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="border-t border-white/10 bg-[#0E1721] px-6 sm:px-12 py-5 text-xs text-[#7C8A90] flex flex-wrap items-center justify-between gap-4">
        <span>SURAKSHA · Decision Support System · &ldquo;AI explains. GIS measures. The decision engine calculates. Humans decide.&rdquo;</span>
        <span>Notice: Model-generated outputs; not statutory designations. Data: GSI, IMD, NRSC/Bhuvan, CWC, Census baseline</span>
      </footer>
    </div>
  );
}
