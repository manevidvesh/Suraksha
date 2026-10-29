'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Database, Clock, AlertTriangle, RefreshCw, Shield, Layers, Cpu } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const filteredSources = useMemo(() => {
    if (filterType === "ALL") return EXTENDED_SOURCES;
    return EXTENDED_SOURCES.filter((s) => s.provenanceType === filterType);
  }, [filterType]);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="Evidence & Sources Catalog"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-6 max-w-6xl space-y-5">
          <SectionHead
            title="Evidence & Sources Catalog"
            sub="Lineage, confidence, and validation requirements for all datasets and reference standards."
            action={
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors cursor-pointer"
                style={{ borderColor: C.line }}
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Verifying Catalog…" : "Verify Catalog"}
              </button>
            }
          />

          {/* Interactive Provenance Type Filter */}
          <div className="flex border-b border-[#D9D4C7] gap-2 overflow-x-auto text-xs font-medium">
            {[
              { id: "ALL", label: `All Sources (${EXTENDED_SOURCES.length})` },
              { id: "RUNTIME DATASET", label: "Runtime Datasets (1)" },
              { id: "DEMONSTRATION DATASET", label: "Demonstration Data (2)" },
              { id: "DOCUMENTED REFERENCE", label: "Reference Standards (6)" },
              { id: "EXTERNAL VALIDATION REQUIRED", label: "External Validation Required (1)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === tab.id
                    ? "border-b-2 font-bold text-[#1C2420] border-[#22364A]"
                    : "text-[#565F58] hover:text-[#1C2420] border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sources Catalog Items */}
          <div
            className="border rounded-sm divide-y bg-white shadow-2xs"
            style={{ borderColor: C.line }}
          >
            {filteredSources.map((src) => (
              <div
                key={src.id}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 flex-wrap hover:bg-[#FAF9F5] transition-colors"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Database size={15} className="text-[#3E5E82] shrink-0" />
                    <h3 className="f-serif text-sm sm:text-base font-bold text-[#1C2420]">
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
                      <Clock size={11} /> Timestamp: {src.updated}
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
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#C0872B] font-semibold">
                      <AlertTriangle size={11} /> Requires field calibration
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Core Methodological & Governance Boundary Disclosures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-sm p-4 bg-white space-y-2 shadow-2xs" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2 text-[#22364A]">
                <Cpu size={16} className="text-[#3E5E82]" />
                <h3 className="f-serif text-sm font-bold text-[#1C2420]">
                  Software Verification ≠ Real-World Safety Validation
                </h3>
              </div>
              <p className="text-xs text-[#565F58] leading-relaxed">
                SURAKSHA verifies mathematical consistency and computational rules against defined technical models. It does not replace real-world geotechnical or hydrological safety verification.
              </p>
              <div className="p-2.5 rounded-xs bg-[#FFF9EE] border border-[#C0872B]/40 text-[11px] text-[#8C5D17] leading-relaxed">
                ⚠️ <strong>Statutory Notice:</strong> Prior to any physical relocation sanction, on-site geotechnical boreholes, hydraulic flood modeling, cadastral land-title verification, and competent authority approval remain legally mandatory.
              </div>
            </div>

            <div className="border rounded-sm p-4 bg-white space-y-2 shadow-2xs" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2 text-[#22364A]">
                <Layers size={16} className="text-[#3D6B5C]" />
                <h3 className="f-serif text-sm font-bold text-[#1C2420]">
                  Deterministic Engine vs. Exploratory ML Models
                </h3>
              </div>
              <p className="text-xs text-[#565F58] leading-relaxed">
                SURAKSHA enforces auditability and transparency. The primary decision engine relies on deterministic Multi-Criteria Decision Analysis (MCDA) and PostGIS spatial queries.
              </p>
              <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] text-[11px] text-[#565F58] leading-relaxed space-y-1">
                <p>
                  • <strong>Production Path:</strong> Auditable MCDA scoring + Liebig bottleneck carrying capacity calculations.
                </p>
                <p>
                  • <strong>Exploratory ML:</strong> Offline Random Forest/XGBoost models in the repository are research benchmarks, not automated deciders.
                </p>
                <p>
                  • <strong>AI Explanation Layer:</strong> Summarizes structured metrics with strict numerical consistency checks.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
