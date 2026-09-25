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
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  LandingNav,
  GeospatialHeroCanvas,
  DecisionFlowInteractive,
  SpatialIntelligenceSection,
  EngineMCDASection,
  RelocationMatchingSection,
  LiebigCapacitySection,
  HumanGovernanceSection,
} from "@/components/Landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col f-sans selection:bg-[#B5462F] selection:text-white bg-[#0E1721] text-[#F7F5F1]">
      {/* 1. Header & Technical Status Ribbon */}
      <LandingNav />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* ======================================================== */}
        {/* SECTION 1: HERO SECTION                                  */}
        {/* ======================================================== */}
        <section className="relative px-6 sm:px-12 py-12 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10">
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
                GIS-driven decision support for identifying vulnerable habitations, evaluating candidate relocation sites, and assessing relocation capacity.
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

              {/* The Two Primary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3.5 rounded-sm bg-[#B5462F] hover:bg-[#C84F36] text-white shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass size={17} />
                  <span>Explore the Decision Map</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 f-sans text-sm font-semibold px-6 py-3.5 rounded-sm bg-white/10 hover:bg-white/15 text-[#F7F5F1] border border-white/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>View Decision Framework</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Legal & Technical Note */}
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
        {/* SECTION 2: THE DECISION FLOW                             */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span>THE 8-STAGE RELOCATION PIPELINE</span>
            </div>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From Spatial Risk to Actionable Options
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              SURAKSHA orchestrates an end-to-end evidence chain: detecting physical hazard zones, prioritizing vulnerable hamlets, screening destination land, and respecting finite civic carrying capacity.
            </p>
          </div>

          <DecisionFlowInteractive />
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: SPATIAL INTELLIGENCE                          */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10 bg-[#0B131C]/60">
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span>GIS ANALYSIS &amp; SPATIAL SCREENING</span>
            </div>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Four Pillars of Spatial Decision Support
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              Every relocation calculation rests on rigorous geospatial primitives: slope thresholds, flood plain buffers, demographic exposure grids, and transit friction contours.
            </p>
          </div>

          <SpatialIntelligenceSection />
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: DETERMINISTIC DECISION ENGINE (MCDA)          */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span>REPRODUCIBLE SCORING ENGINE</span>
            </div>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Deterministic Multi-Criteria Risk Engine
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              Prioritizing settlements must be auditable and mathematically transparent. SURAKSHA eschews opaque black-box machine learning in its production path in favor of verified Multi-Criteria Decision Analysis.
            </p>
          </div>

          <EngineMCDASection />
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: RELOCATION INTELLIGENCE (MANY-TO-MANY)        */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10 bg-[#0B131C]/60">
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span>COMPLEX SPATIAL ALLOCATION</span>
            </div>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Many-to-Many Relocation Matching
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              Real-world disaster corridors cannot rely on one-to-one pairings. The relocation solver matches multiple habitations against multiple destination candidates while honoring shared municipal capacity ceilings.
            </p>
          </div>

          <RelocationMatchingSection />
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: CARRYING CAPACITY (LIEBIG'S BOTTLENECK)       */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10">
          <div className="mb-10 text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9BA8AE]">
              <span>CIVIC INFRASTRUCTURE CONSTRAINTS</span>
            </div>
            <h2 className="f-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Liebig&apos;s Law of Limiting Bottlenecks
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              A candidate site with ample physical land cannot safely absorb displaced citizens if its water scheme or primary schools are overwhelmed. Effective capacity is strictly governed by the tightest pillar.
            </p>
          </div>

          <LiebigCapacitySection />
        </section>

        {/* ======================================================== */}
        {/* SECTION 7: HUMAN DECISION BOUNDARY                       */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-20 max-w-7xl mx-auto w-full border-b border-white/10 bg-[#0B131C]/60">
          <HumanGovernanceSection />
        </section>

        {/* ======================================================== */}
        {/* SECTION 8: FINAL CINEMATIC CALL-TO-ACTION                */}
        {/* ======================================================== */}
        <section className="px-6 sm:px-12 py-16 sm:py-24 max-w-6xl mx-auto w-full text-center space-y-8">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9BA8AE]">
              DECISION-SUPPORT PLATFORM READY FOR EXPLORATION
            </span>
            <h2 className="f-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Explore the Geospatial Decision System
            </h2>
            <p className="text-sm text-[#C7D0D4] leading-relaxed">
              Inspect vulnerable habitations, test relocation scenarios, and review multi-criteria evidence across the 5 demonstration corridors.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-[#F7F5F1] text-[#152331] hover:bg-white text-sm font-semibold shadow-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Open SURAKSHA</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/risk-map"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-[#B5462F] hover:bg-[#C84F36] text-white text-sm font-semibold shadow-xl transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Compass size={16} />
              <span>Explore Decision Map</span>
            </Link>
          </div>

          {/* Quick Direct Module Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left">
            <Link
              href="/habitations"
              className="p-3.5 rounded-sm bg-[#152331]/80 hover:bg-[#152331] border border-white/10 hover:border-white/25 transition-colors group"
            >
              <Sliders size={16} className="text-[#C0872B] mb-2" />
              <p className="text-xs font-bold text-white group-hover:text-[#E07A5F] transition-colors">Habitation Risk</p>
              <p className="text-[10px] text-[#9BA8AE] mt-0.5">MCDA factor breakdowns</p>
            </Link>

            <Link
              href="/relocation"
              className="p-3.5 rounded-sm bg-[#152331]/80 hover:bg-[#152331] border border-white/10 hover:border-white/25 transition-colors group"
            >
              <MapPin size={16} className="text-[#3D6B5C] mb-2" />
              <p className="text-xs font-bold text-white group-hover:text-[#3D6B5C] transition-colors">Relocation Matching</p>
              <p className="text-[10px] text-[#9BA8AE] mt-0.5">5-state outcome framework</p>
            </Link>

            <Link
              href="/simulation"
              className="p-3.5 rounded-sm bg-[#152331]/80 hover:bg-[#152331] border border-white/10 hover:border-white/25 transition-colors group"
            >
              <Activity size={16} className="text-[#8AB4F8] mb-2" />
              <p className="text-xs font-bold text-white group-hover:text-[#8AB4F8] transition-colors">What-If Simulation</p>
              <p className="text-[10px] text-[#9BA8AE] mt-0.5">Before vs after radar metric</p>
            </Link>

            <Link
              href="/sources"
              className="p-3.5 rounded-sm bg-[#152331]/80 hover:bg-[#152331] border border-white/10 hover:border-white/25 transition-colors group"
            >
              <Database size={16} className="text-[#E07A5F] mb-2" />
              <p className="text-xs font-bold text-white group-hover:text-[#E07A5F] transition-colors">Data Lineage</p>
              <p className="text-[10px] text-[#9BA8AE] mt-0.5">Provenance &amp; test benchmarks</p>
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
