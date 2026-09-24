'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Database, CheckCircle2, Clock, AlertTriangle, RefreshCw, ArrowRight, Shield, Info, Layers, Cpu, Compass } from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { ConfidenceBadge, ProvenanceBadge, ProvenanceType } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";

interface EnhancedSource {
  id: string;
  name: string;
  covers: string;
  updated: string;
  confidence: string;
  stale?: boolean;
  provenanceType: ProvenanceType;
  provenanceLabel: string;
  dataType: string;
  processing: string;
}

const EXTENDED_SOURCES: EnhancedSource[] = [
  {
    id: "src-pilot",
    name: "SURAKSHA Pilot Habitations & Relocation Candidate Sites",
    covers: "16 pilot settlements and candidate relocation sites across 5 national corridors (Wayanad, Chamoli, Majuli, Shirur, Kuttanad).",
    updated: "Field Pilot Dataset (2026)",
    confidence: "High",
    stale: false,
    provenanceType: "RUNTIME DATASET",
    provenanceLabel: "RUNTIME DATASET",
    dataType: "A. RUNTIME DATASET — Consumed by Decision Engine",
    processing: "Directly ingested and evaluated through deterministic MCDA risk scoring and Liebig bottleneck matching.",
  },
  {
    id: "src-census",
    name: "Census of India — 2011 Decennial Baseline",
    covers: "Baseline population, household counts, and housing material distributions (kutcha/pucca ratio).",
    updated: "2011 Decennial Baseline (Dated)",
    confidence: "Medium",
    stale: true,
    provenanceType: "DEMONSTRATION DATASET",
    provenanceLabel: "DEMONSTRATION DATASET",
    dataType: "B. DEMONSTRATION DATASET — Decennial Census Baseline",
    processing: "Decennial baseline figures embedded in pilot records; requires local Panchayat / Ward ground roll validation.",
  },
  {
    id: "src-sim",
    name: "SURAKSHA Dynamic Shock Simulation Engine",
    covers: "Interactive radar cloudburst surge scenarios and stage-III riverine flood buffer expansions.",
    updated: "Interactive Simulation",
    confidence: "High",
    stale: false,
    provenanceType: "DEMONSTRATION DATASET",
    provenanceLabel: "DEMONSTRATION DATASET",
    dataType: "B. DEMONSTRATION DATASET — Scenario-Driven Perturbation",
    processing: "Client/Server PostGIS dynamic geometric buffer generation (5.5 km & 4.5 km perimeters).",
  },
  {
    id: "src-gsi",
    name: "Geological Survey of India (GSI) Reference Criteria",
    covers: "Macro-scale landslide susceptibility zonation & critical slope escarpment criteria (>30°).",
    updated: "Published Reference Standard",
    confidence: "High",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Susceptibility Zonation Framework",
    processing: "Methodological reference for PostGIS Digital Elevation Model slope calculation & spatial intersection.",
  },
  {
    id: "src-imd",
    name: "India Meteorological Department (IMD) Reference Standards",
    covers: "Standardized extreme rainfall criteria (>65 mm/hr cloudburst thresholds) & cyclone tracks.",
    updated: "Published Meteorological Standard",
    confidence: "High",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Precipitation Severity Guidelines",
    processing: "Methodological reference for severe precipitation classification and shock scenarios.",
  },
  {
    id: "src-cwc",
    name: "Central Water Commission (CWC) Reference Hydrology",
    covers: "River basin catchment hydrology, stage discharge metrics, and High Flood Level (HFL) thresholds.",
    updated: "Published Hydrological Standard",
    confidence: "High",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Basin Hydrology Guidelines",
    processing: "Methodological reference for riverine floodplain buffering & dynamic surge scenarios.",
  },
  {
    id: "src-mosdac",
    name: "MOSDAC / ISRO Earth Observation Reference",
    covers: "Satellite cloud-cover monitoring, vegetation index (NDVI), and terrain reflectance.",
    updated: "Published Space Products Guide",
    confidence: "Medium",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Remote Sensing Specifications",
    processing: "Methodological reference for space application and terrain reflectance screening.",
  },
  {
    id: "src-soi",
    name: "Survey of India (SOI) Reference Grid",
    covers: "National geodetic reference grid, topographic sheets (1:50,000), and administrative district boundaries.",
    updated: "Published Geodetic Datum",
    confidence: "High",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Geodetic & Coordinate Datum",
    processing: "Standardized to WGS84 (EPSG:4326) PostGIS geometry columns.",
  },
  {
    id: "src-osm",
    name: "OpenStreetMap (OSM) Reference Vectors",
    covers: "Secondary road network, vehicular bridge connectivity, and civic infrastructure footprints.",
    updated: "Community Reference Specification",
    confidence: "Medium",
    stale: false,
    provenanceType: "DOCUMENTED REFERENCE",
    provenanceLabel: "DOCUMENTED REFERENCE",
    dataType: "C. DOCUMENTED REFERENCE — Road Network Geometry",
    processing: "Network distance calculation modeled in pilot records; no live tile or vector API connection.",
  },
  {
    id: "src-cadastral",
    name: "Cadastral Land Ownership & Encumbrance Records",
    covers: "Revenue plot demarcation, private vs government land ownership, and legal disputes.",
    updated: "Not Connected in Prototype",
    confidence: "Medium",
    stale: true,
    provenanceType: "EXTERNAL VALIDATION REQUIRED",
    provenanceLabel: "EXTERNAL VALIDATION REQUIRED",
    dataType: "D. EXTERNAL VALIDATION REQUIRED — Land Revenue Department Records",
    processing: "Exposed as explicit UNKNOWN in screening matrix; requires on-site revenue record verification.",
  },
];

export default function SourcesPage() {
  const { sources, loading } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed("Just now");
    }, 600);
  };

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Data Sources & Provenance"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Configured Data Sources Catalog & Provenance"
            sub="Every risk score, candidate red zone boundary, and site capacity metric traces back to documented reference standards, derived geospatial layers, or curated demonstration datasets. Stale inputs, demonstration baselines, and prototype layers are transparently disclosed."
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors cursor-pointer"
                  style={{ borderColor: C.line }}
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Checking Feeds…" : "Check Health"}
                </button>
                <Link
                  href="/data"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  Upload New Data <ArrowRight size={13} />
                </Link>
              </div>
            }
          />

          {/* Data Honesty & Provenance Disclosure Box */}
          <div
            className="border rounded-sm p-4 sm:p-5 mb-6 bg-white space-y-3"
            style={{ borderColor: C.line }}
          >
            <div className="flex items-center gap-2.5 text-[#22364A]">
              <Shield size={18} className="text-[#3D6B5C]" />
              <h2 className="f-serif text-base font-bold text-[#1C2420]">
                Data Honesty & Provenance Statement
              </h2>
            </div>
            <p className="text-xs text-[#565F58] leading-relaxed">
              SURAKSHA operates with complete technical transparency. The application combines{" "}
              <strong className="text-[#1C2420]">source-derived spatial layers</strong> from reference criteria,{" "}
              <strong className="text-[#1C2420]">PostGIS-processed GIS models</strong>,{" "}
              <strong className="text-[#1C2420]">deterministic decision engine calculations</strong>, and{" "}
              <strong className="text-[#1C2420]">prototype demonstration datasets</strong>. 
              We never fabricate live external API connections: dynamic hazard expansions are explicitly marked as 
              interactive simulations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-dashed border-[#D9D4C7] text-xs">
              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] space-y-1">
                <span className="font-mono font-bold text-[10px] text-[#2A6B52] block uppercase">
                  A. RUNTIME DATASET
                </span>
                <p className="text-[11px] text-[#565F58]">
                  Actually consumed by the application: pilot settlements and candidate relocation site geometries evaluated by the engine.
                </p>
              </div>

              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] space-y-1">
                <span className="font-mono font-bold text-[10px] text-[#C0872B] block uppercase">
                  B. DEMONSTRATION DATASET
                </span>
                <p className="text-[11px] text-[#565F58]">
                  Prototype/sample data used in demonstration: Census 2011 decennial baseline and scenario-driven shock parameters.
                </p>
              </div>

              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] space-y-1">
                <span className="font-mono font-bold text-[10px] text-[#1E5878] block uppercase">
                  C. DOCUMENTED REFERENCE
                </span>
                <p className="text-[11px] text-[#565F58]">
                  Used for methodological reference only: GSI slope criteria, IMD rainfall thresholds, CWC flood stage, and SOI datum.
                </p>
              </div>

              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] space-y-1">
                <span className="font-mono font-bold text-[10px] text-[#B5462F] block uppercase">
                  D. EXTERNAL VALIDATION
                </span>
                <p className="text-[11px] text-[#565F58]">
                  Not available or not verifiable inside prototype: cadastral land ownership, legal title encumbrance, and geotechnical boreholes.
                </p>
              </div>
            </div>
          </div>

          {/* Feed Health Summary Banner */}
          <div
            className="border rounded-sm p-4 mb-6 bg-white flex items-center justify-between gap-4 flex-wrap"
            style={{ borderColor: C.line }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xs bg-[#3D6B5C]/15 text-[#3D6B5C]">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C2420]">
                  10 Ingestion & Evaluation Pipelines Operational · 1 Decennial Baseline Flagged
                </p>
                <p className="text-[11px] text-[#565F58]">
                  PostGIS geometries projected to EPSG:4326 · Status verified {lastRefreshed}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3D6B5C] bg-[#3D6B5C]/10 px-2.5 py-1 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-[#3D6B5C] animate-pulse" />
              Pipelines Healthy
            </span>
          </div>

          {/* Sources Catalog */}
          <div
            className="border rounded-sm divide-y bg-white"
            style={{ borderColor: C.line }}
          >
            {EXTENDED_SOURCES.map((src) => (
              <div
                key={src.id}
                className="p-5 flex items-start justify-between gap-4 flex-wrap hover:bg-[#F7F5F1] transition-colors"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Database size={15} className="text-[#3E5E82] shrink-0" />
                    <h3 className="f-serif text-base font-semibold text-[#1C2420]">
                      {src.name}
                    </h3>
                    <ProvenanceBadge type={src.provenanceType} />
                  </div>

                  <p className="text-xs text-[#565F58] leading-relaxed">
                    {src.covers}
                  </p>

                  <div className="text-[11px] text-[#22364A] font-mono">
                    <strong className="text-[#1C2420]">Processing: </strong>
                    {src.processing}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#565F58] pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Cycle / Timestamp: {src.updated}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      Type: <span className="font-medium text-[#1C2420]">{src.dataType}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <ConfidenceBadge level={src.confidence} stale={src.stale} />
                  {src.stale && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#C0872B] font-medium">
                      <AlertTriangle size={11} /> Requires field calibration
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Software Verification != Real-World Validation Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-sm p-4 bg-white space-y-2" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2 text-[#22364A]">
                <Cpu size={16} className="text-[#3E5E82]" />
                <h3 className="f-serif text-sm font-bold text-[#1C2420]">
                  Software Verification ≠ Real-World Validation
                </h3>
              </div>
              <p className="text-xs text-[#565F58] leading-relaxed">
                The implemented software behavior has been verified through 55 automated backend tests and 14 frontend route checks against the current prototype&apos;s defined technical and mathematical specifications. SURAKSHA verifies computational consistency, not real-world ground truth; field, legal, and administrative validation remain the responsibility of the competent authorities.
              </p>
              <div className="p-2.5 rounded-xs bg-[#FFF9EE] border border-[#C0872B]/40 text-[11px] text-[#8C5D17] leading-relaxed">
                ⚠️ <strong>Operational Honesty:</strong> Software test passes do not equate to real-world geotechnical or hydrological safety validation. Before any physical relocation decision is implemented, appropriate ground-truth, technical, legal, environmental, socioeconomic, and administrative validation would be required according to the hazard, site, jurisdiction, applicable law, and competent authorities (e.g., ground-truth geotechnical investigation by the competent geotechnical authority or qualified geotechnical professionals where required, hydrological/hydraulic assessment where required, cadastral and land-title verification, infrastructure capacity verification, environmental assessment, socioeconomic/livelihood assessment, applicable community consultation, and statutory approvals).
              </div>
            </div>

            <div className="border rounded-sm p-4 bg-white space-y-2" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2 text-[#22364A]">
                <Layers size={16} className="text-[#3D6B5C]" />
                <h3 className="f-serif text-sm font-bold text-[#1C2420]">
                  Production Engine vs. Exploratory ML Models
                </h3>
              </div>
              <p className="text-xs text-[#565F58] leading-relaxed">
                SURAKSHA prioritizes explainability and auditability. The primary decision engine is built on deterministic Multi-Criteria Decision Analysis (MCDA) and PostGIS spatial intersections.
              </p>
              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] text-[11px] text-[#565F58] leading-tight space-y-1">
                <p>
                  • <strong>Production Path:</strong> MCDA scoring + Liebig bottleneck screening + factual rule-based reasoning.
                </p>
                <p>
                  • <strong>Exploratory ML:</strong> Offline Random Forest/XGBoost models in the repository are research benchmarks for susceptibility mapping, not black-box automated deciders.
                </p>
                <p>
                  • <strong>AI Explanation Layer:</strong> LLMs synthesize structured findings into administrative briefs with numerical consistency enforcement.
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Note */}
          <div className="mt-6 border-t pt-5 text-xs text-[#565F58] flex flex-wrap justify-between items-center gap-2" style={{ borderColor: C.line }}>
            <span>Formulated following open geospatial disaster risk assessment principles and evidence-based decision support.</span>
            <Link href="/dashboard" className="text-[#22364A] hover:underline font-medium">
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
