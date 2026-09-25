'use client';

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Home, MapPin, Compass, ArrowRight, ShieldCheck, Layers, Activity } from "lucide-react";

interface IntelligenceCard {
  id: string;
  category: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  technicalSpecs: { label: string; value: string }[];
  principles: string[];
}

const PILLARS: IntelligenceCard[] = [
  {
    id: "hazard",
    category: "GEOSPATIAL HAZARD SCREENING",
    title: "Hazard Indicators & Slope Gradient Buffering",
    badge: "PostGIS Spatial Buffers",
    badgeColor: "#B5462F",
    summary: "Delineates high-susceptibility zones based on digital elevation slope steepness (>22°), historical landslide scars, and riverine flood inundation thresholds.",
    technicalSpecs: [
      { label: "Elevation Datum", value: "SRTM 30m / ALOS PALSAR DEM" },
      { label: "Slope Threshold", value: ">22° High Landslide Susceptibility" },
      { label: "Dynamic Telemetry", value: "Simulated IMD precipitation (>65mm/hr)" },
      { label: "Spatial Geometry", value: "EPSG:4326 PostGIS Polygons" },
    ],
    principles: [
      "Buffers expand dynamically under simulated extreme weather shocks.",
      "Identifies model-generated perimeters for decision screening.",
      "Clear disclaimer: does not constitute statutory Red Zone decree.",
    ],
  },
  {
    id: "habitation",
    category: "EXPOSURE & VULNERABILITY MODEL",
    title: "Settlement Demographics & Egress Isolation",
    badge: "16 Pilot Settlements",
    badgeColor: "#E07A5F",
    summary: "Maps vulnerable rural hamlets and tribal settlements against terrain hazards, incorporating population exposure, housing types, and road egress connectivity.",
    technicalSpecs: [
      { label: "Demographic Source", value: "Census 2011 Decennial Baseline" },
      { label: "Exposure Universe", value: "9,800+ Residents in 5 Pilot Corridors" },
      { label: "Housing Resilience", value: "Kutcha / Pucca Structural Ratios" },
      { label: "Evacuation Egress", value: "Network distance to arterial highways" },
    ],
    principles: [
      "Identifies settlements requiring immediate preventive relocation evaluation.",
      "Accounts for socioeconomic isolation and terrain bottlenecks.",
      "Preserves local community identity across corridor clusters.",
    ],
  },
  {
    id: "sites",
    category: "DESTINATION SITE SELECTION",
    title: "12-Dimensional Candidate Site Screening",
    badge: "Multi-Criteria Matrix",
    badgeColor: "#2A6B52",
    summary: "Screens candidate government revenue land parcels against 12 environmental, legal, and terrain criteria to ensure non-hazard destination alternatives.",
    technicalSpecs: [
      { label: "Terrain Screening", value: "Slope <15° and zero flood intersection" },
      { label: "Land Tenure", value: "Clear Title Revenue / Vested Poramboke" },
      { label: "Forest Clearance", value: "Excludes Reserve Forest (FCA 1980)" },
      { label: "Search Radius", value: "Operational distance threshold (≤160 km)" },
    ],
    principles: [
      "A site that passes screening is NOT automatically certified safe.",
      "Screening PASS denotes baseline suitability for formal ground investigation.",
      "Unknown geotechnical evidence is explicitly preserved for field review.",
    ],
  },
  {
    id: "relationships",
    category: "SPATIAL GEODESIC RELATIONSHIPS",
    title: "Corridor Connectivity & Friction Analysis",
    badge: "Geodesic Friction",
    badgeColor: "#3E5E82",
    summary: "Evaluates spatial proximity, road gradient friction, and administrative corridor boundaries between vulnerable habitations and candidate sites.",
    technicalSpecs: [
      { label: "Distance Model", value: "Haversine & Network Geodesic Distance" },
      { label: "Corridor Clusters", value: "5 Active Regional Demonstration Corridors" },
      { label: "Shared Infrastructure", value: "Joint municipal service absorption limits" },
      { label: "Coordinate Integrity", value: "Validated WGS84 coordinates (EPSG:4326)" },
    ],
    principles: [
      "Minimizes cultural dislocation by favoring proximate corridor sites.",
      "Evaluates travel impedance during active monsoon seasons.",
      "Ensures inter-departmental visibility for District Collectors.",
    ],
  },
];

export function SpatialIntelligenceSection() {
  const [activePillarId, setActivePillarId] = useState("hazard");
  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];

  return (
    <div className="space-y-6">
      {/* 4 Interactive Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((p) => {
          const isSelected = activePillarId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillarId(p.id)}
              className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#182635] border-white/40 shadow-lg translate-y-[-2px]"
                  : "bg-[#101C27] border-white/10 hover:border-white/20 hover:bg-[#152331]"
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 text-[#9BA8AE]">
                {p.category.split(" ")[0]}
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
              <div className="mt-2.5 flex items-center justify-between">
                <span
                  className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-xs font-bold"
                  style={{
                    backgroundColor: p.badgeColor + "25",
                    color: p.badgeColor === "#B5462F" ? "#E07A5F" : p.badgeColor === "#2A6B52" ? "#3D6B5C" : "#8AB4F8",
                    border: `1px solid ${p.badgeColor}40`,
                  }}
                >
                  {p.badge}
                </span>
                <ChevronRight size={13} className={isSelected ? "text-white" : "text-white/20"} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Technical Deep-Dive Card */}
      <div className="p-6 rounded-sm border border-white/15 bg-[#101C27] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE]">
              {activePillar.category}
            </span>
            <h3 className="f-serif text-xl font-bold text-white mt-0.5">{activePillar.title}</h3>
          </div>
          <Link
            href="/risk-map"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xs bg-[#22364A] hover:bg-[#3E5E82] text-white border border-white/15 transition-colors self-start md:self-auto"
          >
            <span>Explore Spatial Layers</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <p className="text-xs text-[#C7D0D4] leading-relaxed my-4">
          {activePillar.summary}
        </p>

        {/* 2-Column Specs and Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Technical Parameters */}
          <div className="p-4 rounded-xs bg-[#0E1721] border border-white/10 space-y-2.5">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
              GEOSPATIAL CRITERIA &amp; METRICS
            </span>
            <div className="space-y-2 text-xs divide-y divide-white/5">
              {activePillar.technicalSpecs.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0">
                  <span className="text-[#9BA8AE]">{spec.label}</span>
                  <span className="font-mono font-semibold text-white text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Principles */}
          <div className="p-4 rounded-xs bg-[#0E1721] border border-white/10 space-y-2.5">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#9BA8AE] block">
              OPERATIONAL GOVERNANCE PRINCIPLES
            </span>
            <ul className="text-xs text-[#C7D0D4] space-y-2 list-disc pl-4">
              {activePillar.principles.map((pr, idx) => (
                <li key={idx} className="leading-snug">{pr}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
