'use client';

import React, { useState } from "react";
import { ShieldCheck, Info, ChevronDown, Database, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";
import { C } from "./constants";
import { ProvenanceBadge, ProvenanceType } from "./Badges";

export interface DataConfidenceItem {
  name: string;
  sourceAuthority: string;
  dataType: string;
  provenanceBadge: ProvenanceType;
  processing: string;
  qualityRating: "High" | "Medium" | "Dated / Pilot";
  notes: string;
}

const DATA_CONFIDENCE_ITEMS: DataConfidenceItem[] = [
  {
    name: "Landslide Susceptibility & Slope Gradient",
    sourceAuthority: "Geological Survey of India (GSI) Reference Criteria",
    dataType: "Documented reference standard",
    provenanceBadge: "DOCUMENTED REFERENCE",
    processing: "PostGIS DEM slope calculation (>30° critical escarpments)",
    qualityRating: "High",
    notes: "Calibrated against published GSI Macro-Landslide Susceptibility zonation maps & slope guidelines.",
  },
  {
    name: "Precipitation & Cloudburst Thresholds",
    sourceAuthority: "India Meteorological Department (IMD) Reference Standards",
    dataType: "Documented reference standard",
    provenanceBadge: "DOCUMENTED REFERENCE",
    processing: "Automated trigger logic calibrated against IMD extreme event criteria (>65 mm/hr)",
    qualityRating: "High",
    notes: "Reference meteorological standards; dynamic event triggers in demo mode use simulated sensor inputs.",
  },
  {
    name: "Dynamic Hazard Expansion & Surge Triggers",
    sourceAuthority: "SURAKSHA Spatial Simulation Engine",
    dataType: "Demonstration dataset",
    provenanceBadge: "DEMONSTRATION DATASET",
    processing: "PostGIS ST_Buffer & geodesic expansion around active settlement coordinates",
    qualityRating: "High",
    notes: "Simulated demonstration scenario; illustrates real-time buffer adaptation without fake live API feeds.",
  },
  {
    name: "Demographics & Household Counts",
    sourceAuthority: "Census of India — 2011 Decennial Baseline",
    dataType: "Demonstration dataset",
    provenanceBadge: "DEMONSTRATION DATASET",
    processing: "Decennial baseline figures embedded in pilot records; requires local Panchayat / Ward ground roll validation.",
    qualityRating: "Dated / Pilot",
    notes: "Census 2011 decennial baseline requires ground validation; local LSGD electoral/ration counts recommended.",
  },
  {
    name: "Candidate Relocation Sites & Bottlenecks",
    sourceAuthority: "SURAKSHA Pilot Corridor Resettlement Dataset",
    dataType: "Runtime dataset",
    provenanceBadge: "RUNTIME DATASET",
    processing: "Liebig's Law of the Minimum: min(Land, Water, Sanitation, Healthcare, Schools)",
    qualityRating: "Medium",
    notes: "Curated demonstration sites across 5 national corridors; field engineering and legal title verification required before handover.",
  },
  {
    name: "Road Access & Evacuation Corridors",
    sourceAuthority: "OpenStreetMap (OSM) & Survey of India Reference",
    dataType: "Documented reference standard",
    provenanceBadge: "DOCUMENTED REFERENCE",
    processing: "PostGIS network distance to all-weather vehicular thoroughfares",
    qualityRating: "Medium",
    notes: "Community-maintained geometry supplemented with Survey of India topographic reference points.",
  },
];

export function DataConfidencePanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="border rounded-sm bg-white overflow-hidden"
      style={{ borderColor: C.line }}
    >
      <div className="p-4 sm:p-5 border-b" style={{ borderColor: C.line, backgroundColor: "#FAF9F5" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-xs bg-[#3D6B5C] text-white">
                <Database size={14} />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#565F58]">
                Evidentiary Integrity & Provenance
              </span>
            </div>
            <h3 className="f-serif text-base font-bold text-[#1C2420]">
              Data Quality & Source Provenance Architecture
            </h3>
            <p className="text-xs text-[#565F58] mt-0.5 max-w-xl leading-relaxed">
              SURAKSHA strictly distinguishes <strong>Source Authority</strong> from <strong>Data Quality</strong> and <strong>Model-Derived Outputs</strong>. Government origin alone does not imply complete real-time accuracy.
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border border-[#D9D4C7] hover:bg-white text-[#22364A] cursor-pointer transition-colors shrink-0"
          >
            <span>{isExpanded ? "Hide Provenance Audit" : "Inspect Data Lineage"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Mini stats */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-dashed border-[#D9D4C7] text-xs">
          <div>
            <span className="text-[10px] text-[#565F58] block uppercase font-mono">Hazard Indicators:</span>
            <strong className="text-[#2A6B52]">GSI Reference / PostGIS (High)</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] block uppercase font-mono">Demographics:</span>
            <strong className="text-[#C0872B]">Census 2011 Decennial Baseline</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] block uppercase font-mono">Event Triggers:</span>
            <strong className="text-[#B5462F]">Simulated Demonstration</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] block uppercase font-mono">Candidate Sites:</span>
            <strong className="text-[#22364A]">Pilot Runtime Dataset</strong>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="divide-y border rounded-sm" style={{ borderColor: C.line }}>
            {DATA_CONFIDENCE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 hover:bg-[#FAF9F5] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#1C2420] text-sm">
                      {item.name}
                    </span>
                    <ProvenanceBadge type={item.provenanceBadge} />
                  </div>
                  <p className="text-[#565F58] text-[11px]">
                    <strong className="text-[#1C2420]">Authority:</strong> {item.sourceAuthority} ·{" "}
                    <strong className="text-[#1C2420]">Type:</strong> {item.dataType}
                  </p>
                  <p className="text-[11px] text-[#3E5E82] font-mono">
                    <strong className="text-[#1C2420]">Processing:</strong> {item.processing}
                  </p>
                  <p className="text-[10px] text-[#565F58] italic">
                    {item.notes}
                  </p>
                </div>

                <div className="md:text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono text-[#565F58] block">
                    Quality Rating
                  </span>
                  <span
                    className={`inline-block font-semibold text-xs px-2 py-0.5 rounded-xs mt-0.5 border ${
                      item.qualityRating === "High"
                        ? "bg-[#E8F0EC] text-[#2A6B52] border-[#2A6B52]/30"
                        : item.qualityRating === "Medium"
                        ? "bg-[#F0F4F8] text-[#22364A] border-[#22364A]/30"
                        : "bg-[#FFF9EE] text-[#C0872B] border-[#C0872B]/30"
                    }`}
                  >
                    {item.qualityRating}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] text-[11px] text-[#565F58] flex items-center gap-2">
            <Info size={14} className="text-[#22364A] shrink-0" />
            <span>
              <strong>Administrative Disclosure:</strong> Datasets flagged as dated or prototype are maintained to test algorithmic robustness and decision workflows. Ground verification by the District Disaster Management Authority (DDMA) or competent local authorities is required prior to legal execution.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
