'use client';

import React, { useState } from "react";
import {
  Database,
  Layers,
  Mountain,
  Users,
  Calculator,
  Compass,
  MapPin,
  TrendingDown,
  Sliders,
  Sparkles,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  Info,
} from "lucide-react";
import { C } from "./constants";

export interface DecisionStep {
  id: string;
  stepNum: number;
  title: string;
  category: "DATA" | "GIS" | "CALCULATION" | "SIMULATION" | "AI EXPLANATION" | "HUMAN DECISION" | "OUTSIDE SURAKSHA";
  categoryColor: string;
  icon: any;
  summary: string;
  details: string;
  technicalPrinciple: string;
}

const DECISION_STEPS: DecisionStep[] = [
  {
    id: "step-1",
    stepNum: 1,
    title: "Data Ingestion & Multi-Layer Provenance",
    category: "DATA",
    categoryColor: "#3D6B5C",
    icon: Database,
    summary: "Ingests topographic layers, meteorological thresholds, and demographic baselines.",
    details: "Combines GSI slope stability models, IMD precipitation standards, decennial Census demographics, and Survey of India boundary vectors. Stale feeds are explicitly flagged.",
    technicalPrinciple: "Multi-provider spatial ingestion with timestamped lineage.",
  },
  {
    id: "step-2",
    stepNum: 2,
    title: "GIS & PostGIS Spatial Coordinate Processing",
    category: "GIS",
    categoryColor: "#22364A",
    icon: Layers,
    summary: "Standardizes coordinates into WGS84 (EPSG:4326) and generates spatial buffers.",
    details: "PostGIS spatial joins compute geodesic distance vectors, buffer polygons around active drainage basins, and intersect settlement points with terrain slope contours.",
    technicalPrinciple: "GIS Measures: Exact geometry computation via PostGIS.",
  },
  {
    id: "step-3",
    stepNum: 3,
    title: "Hazard Intensity & Terrain Exposure",
    category: "GIS",
    categoryColor: "#22364A",
    icon: Mountain,
    summary: "Evaluates physical terrain risk (slope angles >30°, flood inundation plains).",
    details: "Identifies severe physical hazard exposure using Digital Elevation Models (DEM) and catchment hydrological run-off metrics across designated planning corridors.",
    technicalPrinciple: "Terrain slope gradient and flood plain spatial intersection.",
  },
  {
    id: "step-4",
    stepNum: 4,
    title: "Social Vulnerability, History & Access Deficit",
    category: "DATA",
    categoryColor: "#3D6B5C",
    icon: Users,
    summary: "Quantifies demographic vulnerability, historical recurrence, and evacuation road deficit.",
    details: "Measures distance to all-weather roads and emergency healthcare, combines kutcha housing percentages with historical disaster recurrence frequency.",
    technicalPrinciple: "Socioeconomic fragility and physical isolation index.",
  },
  {
    id: "step-5",
    stepNum: 5,
    title: "MCDA Risk Scoring & Priority Tier Engine",
    category: "CALCULATION",
    categoryColor: "#B5462F",
    icon: Calculator,
    summary: "Calculates an auditable composite score (0–100) using deterministic weighted criteria.",
    details: "Computes Composite Risk = 0.30·Hazard + 0.25·Exposure + 0.20·Vulnerability + 0.15·History + 0.10·Access. Classifies settlements into Immediate, Short-term, or Medium-term priority tiers.",
    technicalPrinciple: "The Decision Engine Calculates: Fully deterministic, auditable MCDA.",
  },
  {
    id: "step-6",
    stepNum: 6,
    title: "Candidate Resettlement Screening",
    category: "GIS",
    categoryColor: "#22364A",
    icon: Compass,
    summary: "Screens candidate sites within a viable transit radius (<40 km) against baseline exclusion criteria.",
    details: "Applies negative spatial exclusion buffers: excludes steep slopes (>15°), floodplains, and ecologically fragile reserves. Screens candidate government land and revenue plots.",
    technicalPrinciple: "Spatial multi-criteria suitability buffering.",
  },
  {
    id: "step-7",
    stepNum: 7,
    title: "Liebig Carrying Capacity & Bottleneck Analysis",
    category: "CALCULATION",
    categoryColor: "#B5462F",
    icon: TrendingDown,
    summary: "Applies Liebig's Law of the Minimum: capacity is strictly bounded by the tightest bottleneck.",
    details: "Effective Capacity = min(Land, Water, Sanitation, Healthcare, Schools). Surplus land cannot absorb displaced residents if water or sanitation infrastructure cannot support them.",
    technicalPrinciple: "Infrastructure carrying capacity bounded by limiting resource.",
  },
  {
    id: "step-8",
    stepNum: 8,
    title: "What-If Shock Simulation",
    category: "SIMULATION",
    categoryColor: "#C0872B",
    icon: Sliders,
    summary: "Simulates dynamic shocks (cloudburst surge, lifeline capacity failure, budget constraints).",
    details: "Allows disaster managers to test extreme precipitation scenarios, observe dynamic risk perimeter expansions, and inspect absorption capacity under simulated stress.",
    technicalPrinciple: "Scenario-based parameter perturbation and stress testing.",
  },
  {
    id: "step-9",
    stepNum: 9,
    title: "AI Explanation Layer (Executive Briefs)",
    category: "AI EXPLANATION",
    categoryColor: "#6B21A8",
    icon: Sparkles,
    summary: "Synthesizes structured evidence into plain-language executive briefs and tasking matrices.",
    details: "The LLM explains structured backend metrics. It does not calculate numbers, invent policies, or modify risk scores. Operates under numerical claims validation against structured assessment data.",
    technicalPrinciple: "AI Explains: Factual summarization of structured decision metrics.",
  },
  {
    id: "step-10",
    stepNum: 10,
    title: "External Human Authority Administrative & Statutory Action (Outside SURAKSHA)",
    category: "OUTSIDE SURAKSHA",
    categoryColor: "#1C2420",
    icon: UserCheck,
    summary: "Final statutory sanction, legal orders, and physical execution occur strictly outside SURAKSHA.",
    details: "SURAKSHA outputs decision-support briefs and evidence-backed recommendations. Any binding relocation, resource diversion, or statutory notification must follow the applicable legal and administrative process of the competent authority. Workflow: [SURAKSHA: Brief & Recommendations] → [OUTSIDE: Technical & Legal Assessment] → [OUTSIDE: Authority Review] → [OUTSIDE: Implementation by Competent Authority].",
    technicalPrinciple: "Humans Decide: Statutory authority and physical execution reside exclusively outside the software.",
  },
];

export function HowSurakshaDecides() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <div
      className="border rounded-sm bg-white overflow-hidden"
      style={{ borderColor: C.line }}
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b" style={{ borderColor: C.line, backgroundColor: "#FAF9F5" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-xs bg-[#22364A] text-white">
                <ShieldCheck size={14} />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#565F58]">
                Decision Governance Architecture
              </span>
            </div>
            <h2 className="f-serif text-lg font-bold text-[#1C2420]">
              How SURAKSHA Decides: End-to-End Decision Pipeline
            </h2>
            <p className="text-xs text-[#565F58] mt-1 max-w-2xl leading-relaxed">
              SURAKSHA operates on a foundational principle:{" "}
              <strong className="text-[#1C2420]">
                &ldquo;AI explains. GIS measures. The decision engine calculates. Humans decide.&rdquo;
              </strong>{" "}
              Each stage is auditable, deterministic, and transparent.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm bg-[#22364A] hover:bg-[#3E5E82] text-white cursor-pointer transition-colors shrink-0"
          >
            <span>{isOpen ? "Collapse Pipeline" : "Explore 10-Stage Pipeline"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Horizontal Mini-Pill Summary when collapsed */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-xs bg-[#3D6B5C]/15 text-[#3D6B5C] font-semibold">1. DATA</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#22364A]/15 text-[#22364A] font-semibold">2. GIS</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#22364A]/15 text-[#22364A] font-semibold">3. HAZARD</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#3D6B5C]/15 text-[#3D6B5C] font-semibold">4. VULNERABILITY</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#B5462F]/15 text-[#B5462F] font-semibold">5. MCDA RISK</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#22364A]/15 text-[#22364A] font-semibold">6. SITES</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#B5462F]/15 text-[#B5462F] font-semibold">7. LIEBIG CAPACITY</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#C0872B]/15 text-[#C0872B] font-semibold">8. WHAT-IF</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#6B21A8]/15 text-[#6B21A8] font-semibold">9. AI EXPLAIN</span>
          <span className="text-[#9BA8AE]">→</span>
          <span className="px-2 py-0.5 rounded-xs bg-[#1C2420] text-white font-semibold">10. OUTSIDE SURAKSHA: HUMAN DECIDES</span>
        </div>
      </div>

      {/* Expanded Pipeline Stages Grouped by 4 Pillars */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-6" style={{ borderColor: C.line }}>
          {/* 4 Pillars Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xs border border-[#22364A]/30 bg-[#F4F7FA] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22364A] block">
                Pillar A · Production Engine
              </span>
              <p className="text-[11px] font-semibold text-[#1C2420]">Deterministic MCDA & GIS</p>
              <p className="text-[10px] text-[#565F58] leading-tight">
                PostGIS WGS84 coordinate reprojection, Liebig minimum capacity, and mathematical weighted criteria.
              </p>
            </div>

            <div className="p-3 rounded-xs border border-[#C0872B]/30 bg-[#FFFDF9] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C0872B] block">
                Pillar B · Demonstration & Simulation
              </span>
              <p className="text-[11px] font-semibold text-[#1C2420]">Sensor Simulation Feeds</p>
              <p className="text-[10px] text-[#565F58] leading-tight">
                Simulated 5.5 km cloudburst & 4.5 km flood surge buffers; 2018–2024 prototype incident logs.
              </p>
            </div>

            <div className="p-3 rounded-xs border border-[#6B21A8]/30 bg-[#FAF5FF] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B21A8] block">
                Pillar C · AI Explanation Layer
              </span>
              <p className="text-[11px] font-semibold text-[#1C2420]">Structured Grounding LLM</p>
              <p className="text-[10px] text-[#565F58] leading-tight">
                Plain-language synthesis strictly grounded in backend numbers; automatic numerical claim validation.
              </p>
            </div>

            <div className="p-3 rounded-xs border border-[#1C2420]/30 bg-[#F7F5F1] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C2420] block">
                Pillar D · Human Authority (Outside SURAKSHA)
              </span>
              <p className="text-[11px] font-semibold text-[#1C2420]">Authority Review & Legal Execution</p>
              <p className="text-[10px] text-[#565F58] leading-tight">
                External technical assessment, cadastral verification, and statutory notification follow the applicable legal and administrative process of the competent authority.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: C.line }}>
            {DECISION_STEPS.map((step) => {
              const Icon = step.icon;
              const isExpanded = expandedStep === step.id;

              return (
                <div
                  key={step.id}
                  className="border rounded-sm p-3.5 bg-white hover:bg-[#FAF9F5] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-xs flex items-center justify-center text-white shrink-0 text-xs font-bold"
                        style={{ backgroundColor: step.categoryColor }}
                      >
                        {step.stepNum}
                      </div>
                      <div>
                        <span
                          className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-xs border"
                          style={{
                            color: step.categoryColor,
                            borderColor: `${step.categoryColor}40`,
                            backgroundColor: `${step.categoryColor}10`,
                          }}
                        >
                          {step.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#1C2420] mt-0.5 leading-tight">
                          {step.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="text-[#565F58] hover:text-[#1C2420] text-xs p-1 cursor-pointer"
                      title="View step details"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#565F58] mt-2 leading-relaxed">
                    {step.summary}
                  </p>

                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-dashed border-[#D9D4C7] space-y-1.5 text-[11px]">
                      <p className="text-[#1C2420] leading-relaxed">
                        {step.details}
                      </p>
                      <div className="p-2 rounded-xs bg-[#F4F7FA] border border-[#22364A]/20 text-[10px] text-[#22364A] font-mono leading-tight">
                        <strong>Technical Principle:</strong> {step.technicalPrinciple}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between flex-wrap gap-3 text-xs text-[#565F58] border-t" style={{ borderColor: C.line }}>
            <span className="flex items-center gap-1.5">
              <Info size={13} className="text-[#22364A]" />
              Auditable Architecture: Zero black-box scoring for transparent decision support.
            </span>
            <span className="font-mono text-[11px] text-[#1C2420]">
              MCDA Configuration: Prototype Demonstration Parameters (Configurable)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
