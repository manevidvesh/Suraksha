'use client';

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Sliders,
  MapPin,
  Activity,
  Database,
  Layers,
  TrendingDown,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import {
  LandingNav,
  GeospatialHeroCanvas,
} from "@/components/Landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col f-sans selection:bg-[#B5462F] selection:text-white bg-[#0E1721] text-[#F7F5F1]">
      {/* 1. Header & Status Ribbon */}
      <LandingNav />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* ======================================================== */}
        {/* HERO SECTION                                             */}
        {/* ======================================================== */}
        <section className="relative px-6 sm:px-12 py-12 sm:py-16 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Mission, Headlines, and CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Technical Indicator Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
                <span className="w-2 h-2 rounded-full bg-[#2A6B52] animate-pulse" />
                <span>GEOSPATIAL DECISION-SUPPORT PROTOTYPE</span>
              </div>

              {/* Main Headline */}
              <h1 className="f-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-white font-bold tracking-tight">
                From Hazard Detection<br />
                <span className="text-[#E07A5F] italic font-serif">to Relocation Decisions.</span>
              </h1>

              {/* Supporting Text */}
              <p className="f-sans text-base sm:text-lg text-[#C7D0D4] leading-relaxed max-w-xl font-light">
                GIS-driven decision support for identifying vulnerable habitations, evaluating candidate relocation sites, and assessing civic carrying capacity.
              </p>

              {/* Key Technical Demonstration Metrics */}
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
                  <p className="f-sans text-xs font-bold text-[#C0872B] leading-tight">100% Deterministic</p>
                  <p className="text-[10px] text-[#9BA8AE] mt-0.5">MCDA + Liebig Law</p>
                </div>
              </div>

              {/* Primary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3.5 rounded-sm bg-[#B5462F] hover:bg-[#C84F36] text-white shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass size={17} />
                  <span>Explore Multi-Hazard Map</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3.5 rounded-sm bg-white/10 hover:bg-white/15 text-[#F7F5F1] border border-white/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Open Overview Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Statutory Note */}
              <p className="text-[11px] text-[#7C8A90] font-mono leading-relaxed pt-1">
                Notice: Candidate sites are evaluated against documented baseline screening criteria. Computational outputs require formal administrative validation by competent disaster authorities.
              </p>
            </div>

            {/* Right Column: Interactive Geospatial Canvas Visual */}
            <div className="lg:col-span-6 w-full">
              <GeospatialHeroCanvas />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CORE ARCHITECTURE: 3-STAGE DECISION FRAMEWORK            */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-14 sm:py-18 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9BA8AE]">
              STRUCTURED DECISION ARCHITECTURE
            </span>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How SURAKSHA Supports Relocation Decisions
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              An evidence-backed workflow connecting spatial hazard measurement to human administrative decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Spatial Risk Assessment */}
            <div className="p-6 rounded-sm bg-[#152331]/80 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#B5462F]/20 border border-[#B5462F]/40 flex items-center justify-center text-[#E07A5F]">
                  <Layers size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E07A5F] font-bold">
                    Pillar 1 · Detection
                  </span>
                  <h3 className="f-serif text-lg font-bold text-white">
                    Deterministic MCDA Scoring
                  </h3>
                </div>
                <p className="text-xs text-[#C7D0D4] leading-relaxed">
                  Evaluates 5 auditable criteria (hazard intensity, demographic exposure, social vulnerability, historical disaster frequency, and accessibility deficit) to rank settlements into Immediate, Short-term, or Medium-term priority tiers.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/habitations"
                  className="inline-flex items-center gap-1.5 text-xs text-[#E07A5F] hover:text-white font-medium transition-colors"
                >
                  <span>Inspect Habitation Risk Scores</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Pillar 2: Candidate Screening & Capacity */}
            <div className="p-6 rounded-sm bg-[#152331]/80 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#3D6B5C]/20 border border-[#3D6B5C]/40 flex items-center justify-center text-[#3D6B5C]">
                  <TrendingDown size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#3D6B5C] font-bold">
                    Pillar 2 · Screening &amp; Capacity
                  </span>
                  <h3 className="f-serif text-lg font-bold text-white">
                    Liebig Bottlenecks &amp; Constraints
                  </h3>
                </div>
                <p className="text-xs text-[#C7D0D4] leading-relaxed">
                  Candidate sites are evaluated against a 12-dimension negative constraints matrix. Effective capacity is strictly bounded by Liebig&apos;s Law of the Minimum: excess physical land cannot compensate for water, sanitation, or schooling shortages.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/relocation"
                  className="inline-flex items-center gap-1.5 text-xs text-[#3D6B5C] hover:text-white font-medium transition-colors"
                >
                  <span>Evaluate Relocation Intelligence</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Pillar 3: Human Governance */}
            <div className="p-6 rounded-sm bg-[#152331]/80 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-[#22364A]/40 border border-[#3E5E82]/40 flex items-center justify-center text-[#8AB4F8]">
                  <UserCheck size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8AB4F8] font-bold">
                    Pillar 3 · Governance Boundary
                  </span>
                  <h3 className="f-serif text-lg font-bold text-white">
                    Human Authority Decides
                  </h3>
                </div>
                <p className="text-xs text-[#C7D0D4] leading-relaxed">
                  SURAKSHA adheres strictly to a foundational principle: &ldquo;AI explains. GIS measures. The decision engine calculates. Humans decide.&rdquo; Statutory notifications, field validation, and relocation orders remain the sole remit of competent authorities.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link
                  href="/sources"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8AB4F8] hover:text-white font-medium transition-colors"
                >
                  <span>Review Evidence Lineage &amp; Limits</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* DIRECT WORKFLOW NAVIGATION                               */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-12 sm:py-16 max-w-6xl mx-auto w-full text-center space-y-8">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="f-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore Decision-Support Workflows
            </h2>
            <p className="text-xs text-[#9BA8AE]">
              Jump directly to any phase of the disaster relocation assessment workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            <Link
              href="/dashboard"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <LayoutDashboard size={18} className="text-[#9BA8AE] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Overview</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">Dashboard metrics</p>
              </div>
            </Link>

            <Link
              href="/risk-map"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <Compass size={18} className="text-[#E07A5F] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Hazard Map</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">PostGIS spatial layers</p>
              </div>
            </Link>

            <Link
              href="/habitations"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <Sliders size={18} className="text-[#C0872B] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Habitation Risk</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">MCDA factor weights</p>
              </div>
            </Link>

            <Link
              href="/relocation"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <MapPin size={18} className="text-[#3D6B5C] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Relocation</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">Site matching &amp; Liebig</p>
              </div>
            </Link>

            <Link
              href="/simulation"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <Activity size={18} className="text-[#8AB4F8] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Simulation</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">What-if radar stress test</p>
              </div>
            </Link>

            <Link
              href="/sources"
              className="p-3.5 rounded-sm bg-[#152331] hover:bg-[#1C2C3D] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <Database size={18} className="text-[#9BA8AE] mb-3 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-bold text-white">Evidence</p>
                <p className="text-[10px] text-[#9BA8AE] mt-0.5">Data lineage catalog</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* FOOTER & STATUTORY DISCLOSURES                           */}
      {/* ======================================================== */}
      <footer className="border-t border-white/10 bg-[#091017] px-6 sm:px-12 py-8 text-xs text-[#7C8A90] space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-white/90">
              SURAKSHA · Disaster Relocation Decision Support System
            </p>
            <p className="text-[11px] text-[#9BA8AE]">
              &ldquo;AI explains. GIS measures. The decision engine calculates. Humans decide.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/dashboard" className="text-[#9BA8AE] hover:text-white transition-colors">Overview</Link>
            <span className="text-white/20">·</span>
            <Link href="/risk-map" className="text-[#9BA8AE] hover:text-white transition-colors">Map</Link>
            <span className="text-white/20">·</span>
            <Link href="/habitations" className="text-[#9BA8AE] hover:text-white transition-colors">Habitations</Link>
            <span className="text-white/20">·</span>
            <Link href="/relocation" className="text-[#9BA8AE] hover:text-white transition-colors">Relocation</Link>
            <span className="text-white/20">·</span>
            <Link href="/simulation" className="text-[#9BA8AE] hover:text-white transition-colors">Simulation</Link>
            <span className="text-white/20">·</span>
            <Link href="/sources" className="text-[#9BA8AE] hover:text-white transition-colors">Sources</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#565F58]">
          <p>
            Notice: Model-generated outputs; not statutory designations. Data sources: GSI, IMD, NRSC/Bhuvan, CWC, Census 2011 baseline.
          </p>
          <p className="font-mono">
            Smart India Hackathon (SIH 2026) · Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
