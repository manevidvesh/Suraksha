'use client';

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Home,
  Sliders,
  LifeBuoy,
  MapPin,
  CheckSquare,
  Network,
  UserCheck,
  ArrowRight,
  ChevronRight,
  Shield,
} from "lucide-react";

interface DecisionStep {
  id: string;
  stepNumber: number;
  label: string;
  tagline: string;
  icon: any;
  accentColor: string;
  inputs: string[];
  methodology: string;
  output: string;
  linkedRoute: string;
  routeLabel: string;
}

const STEPS: DecisionStep[] = [
  {
    id: "hazard",
    stepNumber: 1,
    label: "HAZARD",
    tagline: "Model-Generated Hazard Identification",
    icon: AlertTriangle,
    accentColor: "#B5462F",
    inputs: ["SRTM 30m Digital Elevation Model", "GSI Landslide Susceptibility Atlas", "CWC Riverine Flood Discharge Datums"],
    methodology: "PostGIS spatial buffering and slope classification identify terrain gradients (>22°) and hydrological flood plains.",
    output: "Candidate High-Risk Perimeter Polygons (WGS84)",
    linkedRoute: "/risk-map",
    routeLabel: "Inspect on Multi-Hazard Map",
  },
  {
    id: "habitation",
    stepNumber: 2,
    label: "HABITATION",
    tagline: "Vulnerable Settlement Intersection",
    icon: Home,
    accentColor: "#E07A5F",
    inputs: ["Census 2011 Habitation Decennial Geocodes", "Local Disaster Management Incident Logs", "Field Pilot Settlement Boundaries"],
    methodology: "Spatial intersection (ST_Intersects) pairs settlements with candidate hazard perimeters to establish direct exposure.",
    output: "16 Pilot Settlements Indexed by Hazard Exposure",
    linkedRoute: "/habitations",
    routeLabel: "View Settlement Inventory",
  },
  {
    id: "risk",
    stepNumber: 3,
    label: "RISK / PRIORITY",
    tagline: "Deterministic MCDA Prioritization",
    icon: Sliders,
    accentColor: "#C0872B",
    inputs: ["Hazard (H: 30%)", "Exposure (E: 25%)", "Vulnerability (V: 20%)", "Disaster History (F: 15%)", "Access Deficit (A: 10%)"],
    methodology: "Multi-Criteria Decision Analysis computes a deterministic 0–100 composite risk score without black-box automation.",
    output: "Operational Action Tiers: Immediate (≥70), Short-Term (45–69), Medium-Term (<45)",
    linkedRoute: "/habitations",
    routeLabel: "Inspect Factor Breakdown",
  },
  {
    id: "need",
    stepNumber: 4,
    label: "RELOCATION NEED",
    tagline: "Pathway Determination & Need Assessment",
    icon: LifeBuoy,
    accentColor: "#D97706",
    inputs: ["Assessed Settlement Priority Tier", "Egress Isolation & In-Situ Feasibility", "Repeat Hazard Event Frequency"],
    methodology: "Evaluates whether in-situ structural engineering suffices or candidate planned relocation must be initiated.",
    output: "Operational Need Classification: Relocation Evaluation Required vs In-Situ Monitoring",
    linkedRoute: "/relocation",
    routeLabel: "Inspect Relocation Need",
  },
  {
    id: "sites",
    stepNumber: 5,
    label: "CANDIDATE SITES",
    tagline: "Public Land & Corridor Discovery",
    icon: MapPin,
    accentColor: "#3E5E82",
    inputs: ["District Revenue Land Inventory", "Topographic Slope Thresholds (<15°)", "Operational Travel Distance (<160 km)"],
    methodology: "Radial and corridor spatial queries discover non-forest, non-flood government land parcels accessible via roads.",
    output: "Candidate Destination Land Parcels per Planning Corridor",
    linkedRoute: "/relocation",
    routeLabel: "Explore Candidate Sites",
  },
  {
    id: "screening",
    stepNumber: 6,
    label: "SCREENING + CAPACITY",
    tagline: "12-D Matrix & Liebig Bottleneck Model",
    icon: CheckSquare,
    accentColor: "#3D6B5C",
    inputs: ["12 Exclusion Criteria (Slope, Flood, Forest)", "Land, Water, Sanitation, Healthcare, Schools Cap", "Cadastral Encumbrance Status"],
    methodology: "Applies Liebig's Law of the Minimum: Effective Capacity = min(L, W, S, H, Sc). Excludes sites breaching environmental limits.",
    output: "Effective Carrying Capacity & Limiting Infrastructure Bottlenecks",
    linkedRoute: "/relocation",
    routeLabel: "Review Screening Matrix",
  },
  {
    id: "matching",
    stepNumber: 7,
    label: "MANY-TO-MANY MATCHING",
    tagline: "Shared Finite Capacity Optimization",
    icon: Network,
    accentColor: "#2A6B52",
    inputs: ["Vulnerable Population Demand", "Site Remaining Carrying Capacity", "Geodesic Travel Distance & Friction"],
    methodology: "Matches multiple habitations to candidate sites without exceeding shared municipal infrastructure ceilings.",
    output: "Feasible Many-to-Many Relocation Allocation Proposals",
    linkedRoute: "/simulation",
    routeLabel: "Simulate Relocation Matching",
  },
  {
    id: "human",
    stepNumber: 8,
    label: "HUMAN REVIEW",
    tagline: "Field Override & DDMA Authorization",
    icon: UserCheck,
    accentColor: "#152331",
    inputs: ["Field Inspection Reports", "Ground Verification Observations", "District Collector & DDMA Administrative Review"],
    methodology: "Field officers override algorithmic ratings based on local ground truth; final statutory authority remains strictly human.",
    output: "Legally Binding Administrative Relocation Orders",
    linkedRoute: "/dashboard",
    routeLabel: "Open Decision System",
  },
];

export function DecisionFlowInteractive() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];
  const Icon = activeStep.icon;

  return (
    <div className="space-y-6">
      {/* Horizontal Step Stepper Bar */}
      <div className="relative">
        {/* Connecting Progress Line */}
        <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative z-10">
          {STEPS.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1E2E3E] border-white/40 shadow-lg translate-y-[-2px]"
                    : "bg-[#101C27] border-white/10 hover:border-white/20 hover:bg-[#152331]"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#9BA8AE]">
                    0{step.stepNumber}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? step.accentColor : "rgba(255,255,255,0.2)" }}
                  />
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <StepIcon size={14} style={{ color: step.accentColor }} />
                  <span className="text-xs font-bold text-white truncate">{step.label}</span>
                </div>

                <span className="text-[10px] text-[#9BA8AE] line-clamp-1">
                  {step.tagline.split(" ")[0]}…
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Detailed Showcase Panel */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#101C27] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: activeStep.accentColor }}
            >
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-xs bg-white/10 text-white/90">
                  STAGE 0{activeStep.stepNumber} OF 08
                </span>
                <span className="text-xs text-[#9BA8AE] uppercase tracking-wider font-semibold font-mono">
                  {activeStep.label}
                </span>
              </div>
              <h3 className="f-serif text-lg sm:text-xl font-bold text-[#F7F5F1] mt-0.5">
                {activeStep.tagline}
              </h3>
            </div>
          </div>

          <Link
            href={activeStep.linkedRoute}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#F7F5F1] border border-white/15 transition-colors shrink-0"
          >
            <span>{activeStep.routeLabel}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3-Column Specifications Grid for Active Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Column 1: Input Data Sources */}
          <div className="p-4 rounded-xs bg-[#0E1721] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
              1. INPUT DATASETS &amp; STANDARDS
            </span>
            <ul className="text-xs text-[#C7D0D4] space-y-1.5 list-disc pl-4">
              {activeStep.inputs.map((inp, idx) => (
                <li key={idx} className="leading-snug">{inp}</li>
              ))}
            </ul>
          </div>

          {/* Column 2: Mathematical / Geospatial Methodology */}
          <div className="p-4 rounded-xs bg-[#0E1721] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
              2. COMPUTATIONAL METHODOLOGY
            </span>
            <p className="text-xs text-[#C7D0D4] leading-relaxed">
              {activeStep.methodology}
            </p>
          </div>

          {/* Column 3: Structured Output Artifact */}
          <div className="p-4 rounded-xs bg-[#0E1721] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
              3. OPERATIONAL DECISION ARTIFACT
            </span>
            <p className="text-xs font-semibold text-white leading-relaxed">
              {activeStep.output}
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#9BA8AE] flex items-center gap-1">
              <Shield size={11} className="text-[#3D6B5C]" /> Verifiable Computational Record
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
