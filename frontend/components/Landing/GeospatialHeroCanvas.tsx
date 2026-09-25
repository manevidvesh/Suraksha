'use client';

import React, { useState } from "react";
import { ShieldAlert, MapPin, Compass, Eye, Layers, Activity, ChevronRight } from "lucide-react";

interface NodeData {
  id: string;
  type: "habitation" | "site";
  name: string;
  region: string;
  coord: [number, number]; // [x, y] in SVG space
  metric: string;
  metricLabel: string;
  status: string;
  statusColor: string;
  desc: string;
}

const NODES: NodeData[] = [
  {
    id: "H1",
    type: "habitation",
    name: "Chooralmala Hamlet",
    region: "Wayanad Corridor",
    coord: [140, 160],
    metric: "88.4 / 100",
    metricLabel: "MCDA Risk Score",
    status: "Immediate Priority",
    statusColor: "#B5462F",
    desc: "Located on steep slope gradient (26°) intersected by historical debris flow buffer.",
  },
  {
    id: "H2",
    type: "habitation",
    name: "Attamala Settlement",
    region: "Wayanad Corridor",
    coord: [180, 260],
    metric: "82.1 / 100",
    metricLabel: "MCDA Risk Score",
    status: "Immediate Priority",
    statusColor: "#B5462F",
    desc: "Single egress road in riverine flood plain with high drainage convergence.",
  },
  {
    id: "S1",
    type: "site",
    name: "Meenangadi Plateau (S1)",
    region: "Wayanad Corridor",
    coord: [440, 140],
    metric: "250 Persons",
    metricLabel: "Liebig Bottleneck Cap",
    status: "Screening Passed",
    statusColor: "#2A6B52",
    desc: "Gentle terrain (<8°), zero landslide intersection, clear revenue title.",
  },
  {
    id: "S2",
    type: "site",
    name: "Ambalavayal Sector (S2)",
    region: "Wayanad Corridor",
    coord: [420, 290],
    metric: "400 Persons",
    metricLabel: "Liebig Bottleneck Cap",
    status: "Screening Passed",
    statusColor: "#2A6B52",
    desc: "Direct arterial highway access, augmented water storage capacity.",
  },
];

export function GeospatialHeroCanvas() {
  const [selectedNode, setSelectedNode] = useState<NodeData>(NODES[0]);
  const [showVectors, setShowVectors] = useState(true);
  const [showBuffer, setShowBuffer] = useState(true);
  const [showContours, setShowContours] = useState(true);

  return (
    <div className="relative w-full rounded-sm border border-white/15 bg-[#0E1721] overflow-hidden shadow-2xl backdrop-blur-xs select-none">
      {/* Canvas Top Bar HUD */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/10 bg-[#152331]/90 text-[11px] font-mono text-[#9BA8AE]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2A6B52] animate-pulse" />
          <span className="text-[#F7F5F1] font-semibold">GEOSPATIAL DECISION VECTOR</span>
          <span className="text-white/40">|</span>
          <span className="text-xs text-[#9BA8AE] hidden sm:inline">Corridor Simulation Canvas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 text-white/80">
            WGS84 PROJECTION
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#B5462F]/20 text-[#E07A5F] border border-[#B5462F]/30 font-bold">
            ILLUSTRATIVE GIS
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full bg-[#0a111a]">
        <svg
          viewBox="0 0 580 380"
          className="w-full h-full"
          style={{ shapeRendering: "geometricPrecision" }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="geo-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
            </pattern>

            {/* Linear Gradient for Hazard Area */}
            <radialGradient id="hazard-glow" cx="28%" cy="52%" r="40%">
              <stop offset="0%" stopColor="#B5462F" stopOpacity="0.32" />
              <stop offset="65%" stopColor="#B5462F" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#B5462F" stopOpacity="0" />
            </radialGradient>

            {/* Relocation Vector Gradients */}
            <linearGradient id="reloc-vector-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C0872B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2A6B52" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="reloc-vector-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2A6B52" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#geo-grid)" />

          {/* Topographic Contour Lines (Decorative GIS simulation) */}
          {showContours && (
            <g className="transition-opacity duration-300">
              <path
                d="M -20,20 Q 90,60 180,30 T 360,40 T 540,10 T 600,60"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <path
                d="M -20,90 Q 80,120 190,80 T 370,110 T 520,70 T 600,110"
                fill="none"
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
              <path
                d="M -20,170 Q 110,210 200,160 T 390,190 T 500,150 T 600,180"
                fill="none"
                stroke="rgba(255,255,255,0.11)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M -20,250 Q 100,290 220,240 T 400,270 T 520,230 T 600,260"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <path
                d="M -20,330 Q 120,370 240,320 T 420,350 T 540,310 T 600,340"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              {/* Elevation Labels */}
              <text x="18" y="166" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">950m</text>
              <text x="18" y="246" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="monospace">820m</text>
              <text x="18" y="326" fill="rgba(255,255,255,0.18)" fontSize="9" fontFamily="monospace">710m</text>
            </g>
          )}

          {/* Model-Generated Hazard Zone Perimeter */}
          {showBuffer && (
            <g className="transition-opacity duration-300">
              {/* Outer Glow */}
              <circle cx="160" cy="210" r="125" fill="url(#hazard-glow)" />

              {/* Delineated Hazard Polygon Buffer */}
              <path
                d="M 60,150 C 90,100 210,110 250,150 C 290,190 270,290 220,315 C 170,340 90,320 65,270 Z"
                fill="rgba(181, 70, 47, 0.12)"
                stroke="#B5462F"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />

              {/* Hazard Zone Label */}
              <g transform="translate(70, 130)">
                <rect x="0" y="0" width="112" height="18" rx="2" fill="#152331" stroke="#B5462F" strokeWidth="0.8" />
                <text x="6" y="12.5" fill="#E07A5F" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  ⚠ MODEL HAZARD ZONE
                </text>
              </g>
            </g>
          )}

          {/* Safe Corridor / Candidate Zone Boundary */}
          <g>
            <path
              d="M 360,90 C 400,60 520,70 545,120 C 570,170 560,320 500,345 C 440,370 370,340 350,280 C 330,220 320,120 360,90 Z"
              fill="rgba(42, 107, 82, 0.07)"
              stroke="#2A6B52"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
            <g transform="translate(380, 80)">
              <rect x="0" y="0" width="145" height="18" rx="2" fill="#152331" stroke="#2A6B52" strokeWidth="0.8" />
              <text x="6" y="12.5" fill="#3D6B5C" fontSize="9" fontWeight="bold" fontFamily="monospace">
                ✓ CANDIDATE RECEPTIVE ZONE
              </text>
            </g>
          </g>

          {/* Relocation Vector Paths (Many-to-Many Connections) */}
          {showVectors && (
            <g className="transition-opacity duration-300">
              {/* Path H1 -> S1 */}
              <path
                d="M 140,160 Q 280,120 440,140"
                fill="none"
                stroke="url(#reloc-vector-1)"
                strokeWidth="2"
                strokeDasharray="5 3"
                className="opacity-90"
              />

              {/* Path H1 -> S2 (Alternative) */}
              <path
                d="M 140,160 Q 280,210 420,290"
                fill="none"
                stroke="rgba(224, 122, 95, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Path H2 -> S1 (Shared Capacity) */}
              <path
                d="M 180,260 Q 300,190 440,140"
                fill="none"
                stroke="rgba(224, 122, 95, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />

              {/* Path H2 -> S2 */}
              <path
                d="M 180,260 Q 290,300 420,290"
                fill="none"
                stroke="url(#reloc-vector-2)"
                strokeWidth="2"
                strokeDasharray="5 3"
                className="opacity-90"
              />

              {/* Distance HUD on vector H1 -> S1 */}
              <g transform="translate(265, 125)">
                <rect x="0" y="0" width="56" height="15" rx="2" fill="#0E1721" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <text x="5" y="11" fill="#C7D0D4" fontSize="8.5" fontFamily="monospace">14.2 km</text>
              </g>

              {/* Distance HUD on vector H2 -> S2 */}
              <g transform="translate(285, 290)">
                <rect x="0" y="0" width="56" height="15" rx="2" fill="#0E1721" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                <text x="5" y="11" fill="#C7D0D4" fontSize="8.5" fontFamily="monospace">18.6 km</text>
              </g>
            </g>
          )}

          {/* Habitation Nodes (Red Alert Priority) */}
          {NODES.filter((n) => n.type === "habitation").map((n) => {
            const isSelected = selectedNode.id === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${n.coord[0]}, ${n.coord[1]})`}
                onClick={() => setSelectedNode(n)}
                className="cursor-pointer group"
              >
                {/* Outer Pulse Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke="#B5462F"
                  strokeWidth="1.5"
                  className={isSelected ? "animate-ping opacity-60" : "opacity-30 group-hover:opacity-75"}
                />

                {/* Inner Core */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 8 : 6}
                  fill="#B5462F"
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                {/* Node Label */}
                <g transform="translate(12, -8)">
                  <rect
                    x="0"
                    y="0"
                    width={n.id.length * 8 + 32}
                    height="18"
                    rx="2"
                    fill="#152331"
                    stroke={isSelected ? "#B5462F" : "rgba(255,255,255,0.15)"}
                    strokeWidth="1"
                  />
                  <text x="6" y="12.5" fill="#F7F5F1" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    {n.id}: {n.name.split(" ")[0]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Candidate Relocation Site Nodes (Green / Blue Receptive) */}
          {NODES.filter((n) => n.type === "site").map((n) => {
            const isSelected = selectedNode.id === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${n.coord[0]}, ${n.coord[1]})`}
                onClick={() => setSelectedNode(n)}
                className="cursor-pointer group"
              >
                {/* Outer Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke="#2A6B52"
                  strokeWidth="1.5"
                  className={isSelected ? "animate-pulse opacity-80" : "opacity-40 group-hover:opacity-75"}
                />

                {/* Inner Core Square */}
                <rect
                  x={isSelected ? -7 : -5}
                  y={isSelected ? -7 : -5}
                  width={isSelected ? 14 : 10}
                  height={isSelected ? 14 : 10}
                  fill="#2A6B52"
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2 : 1.5}
                  rx="2"
                />

                {/* Node Label */}
                <g transform="translate(14, -8)">
                  <rect
                    x="0"
                    y="0"
                    width={n.id.length * 8 + 36}
                    height="18"
                    rx="2"
                    fill="#152331"
                    stroke={isSelected ? "#2A6B52" : "rgba(255,255,255,0.15)"}
                    strokeWidth="1"
                  />
                  <text x="6" y="12.5" fill="#F7F5F1" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    {n.id}: {n.name.split(" ")[0]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Compass Rose Indicator */}
          <g transform="translate(535, 45)" className="opacity-60">
            <circle cx="0" cy="0" r="14" fill="#152331" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <polygon points="0,-10 3,0 0,2 -3,0" fill="#E07A5F" />
            <polygon points="0,10 3,0 0,2 -3,0" fill="rgba(255,255,255,0.4)" />
            <text x="-3.5" y="-12" fill="#E07A5F" fontSize="8" fontWeight="bold" fontFamily="monospace">N</text>
          </g>
        </svg>

        {/* Selected Entity HUD Overlay Card (Bottom Left inside canvas) */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-sm bg-[#152331]/95 border border-white/20 text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[9.5px] font-mono uppercase px-1.5 py-0.5 rounded-xs font-bold"
              style={{
                backgroundColor: selectedNode.statusColor + "25",
                color: selectedNode.statusColor === "#B5462F" ? "#E07A5F" : "#3D6B5C",
                border: `1px solid ${selectedNode.statusColor}50`,
              }}
            >
              {selectedNode.type === "habitation" ? "Endangered Habitation" : "Candidate Relocation Site"}
            </span>
            <span className="text-[10px] font-mono text-[#9BA8AE]">{selectedNode.region}</span>
          </div>

          <p className="font-semibold text-sm text-[#F7F5F1] leading-snug">{selectedNode.name}</p>
          <p className="text-[11px] text-[#C7D0D4] mt-1 leading-relaxed">{selectedNode.desc}</p>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-[#9BA8AE]">{selectedNode.metricLabel}:</span>
            <span className="font-mono font-bold text-white">{selectedNode.metric}</span>
          </div>
        </div>
      </div>

      {/* Canvas Interactive Controls & Legend Bar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#101C27] border-t border-white/10 text-xs gap-3">
        {/* Toggle Layers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#7C8A90] mr-1 hidden sm:inline">Layers:</span>
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-2 py-1 rounded-xs text-[10.5px] font-mono transition-colors cursor-pointer border ${
              showVectors
                ? "bg-[#22364A] text-white border-white/30"
                : "bg-white/5 text-[#7C8A90] border-transparent hover:text-white"
            }`}
          >
            Relocation Vectors {showVectors ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowBuffer(!showBuffer)}
            className={`px-2 py-1 rounded-xs text-[10.5px] font-mono transition-colors cursor-pointer border ${
              showBuffer
                ? "bg-[#22364A] text-white border-white/30"
                : "bg-white/5 text-[#7C8A90] border-transparent hover:text-white"
            }`}
          >
            Hazard Buffer {showBuffer ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowContours(!showContours)}
            className={`px-2 py-1 rounded-xs text-[10.5px] font-mono transition-colors cursor-pointer border ${
              showContours
                ? "bg-[#22364A] text-white border-white/30"
                : "bg-white/5 text-[#7C8A90] border-transparent hover:text-white"
            }`}
          >
            Contours {showContours ? "ON" : "OFF"}
          </button>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center gap-3 text-[11px] text-[#9BA8AE]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B5462F]" /> Habitations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2A6B52]" /> Candidate Sites
          </span>
          <span className="text-[10px] font-mono text-white/40 hidden md:inline">Click nodes to inspect</span>
        </div>
      </div>
    </div>
  );
}
