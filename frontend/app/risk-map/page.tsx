'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapIcon,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Sliders,
  LifeBuoy,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { TierBadge } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { MapLibreView } from "@/components/Map";
import { RiskMapSvg, MapLegend } from "@/components/RiskMap";
import {
  CorridorSelector,
  filterHabitationsByCorridor,
  filterSitesByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
} from "@/components/Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";

export default function RiskMapPage() {
  const {
    habitations,
    sites,
    redZonesGeoJSON,
    selectedHabitationId,
    setSelectedHabitationId,
    flyToTarget,
    addHabitation,
  } = useRiskData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mapMode, setMapMode] = useState<"maplibre" | "schematic">("maplibre");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [activeStrategyEntity, setActiveStrategyEntity] = useState<any>(null);

  const currentCorridor = useMemo(() => {
    return CORRIDORS.find((c) => c.id === selectedCorridor) || CORRIDORS[0];
  }, [selectedCorridor]);

  const displayedHabitations = useMemo(() => {
    return filterHabitationsByCorridor(habitations, selectedCorridor);
  }, [habitations, selectedCorridor]);

  const displayedSites = useMemo(() => {
    return filterSitesByCorridor(sites, selectedCorridor);
  }, [sites, selectedCorridor]);

  const handleSelectCorridor = (corridorId: string) => {
    setSelectedCorridor(corridorId);
    const matching = filterHabitationsByCorridor(habitations, corridorId);
    if (matching.length > 0 && !matching.some((h) => h.id === selectedHabitationId)) {
      setSelectedHabitationId(matching[0].id);
    }
  };

  const selectedHabitation =
    displayedHabitations.find((h) => h.id === selectedHabitationId) ||
    displayedHabitations[0] ||
    habitations.find((h) => h.id === selectedHabitationId) ||
    habitations[0];

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Multi-Hazard Map"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Multi-Hazard Spatial Viewer"
            sub="Interactive GIS visualization showing PostGIS hazard zones (flood plains, landslide corridors) and candidate resettlement sites across national planning corridors."
            action={
              <div className="inline-flex rounded-sm border p-0.5 bg-white" style={{ borderColor: C.line }}>
                <button
                  onClick={() => setMapMode("maplibre")}
                  className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
                    mapMode === "maplibre"
                      ? "bg-[#22364A] text-white"
                      : "text-[#565F58] hover:text-[#1C2420]"
                  }`}
                >
                  <MapIcon size={12} /> MapLibre WebGL
                </button>
                <button
                  onClick={() => setMapMode("schematic")}
                  className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                    mapMode === "schematic"
                      ? "bg-[#22364A] text-white"
                      : "text-[#565F58] hover:text-[#1C2420]"
                  }`}
                >
                  Schematic SVG
                </button>
              </div>
            }
          />

          {/* Regional Planning Corridor Selector */}
          <div className="mb-5 bg-white border p-3.5 rounded-sm" style={{ borderColor: C.line }}>
            <CorridorSelector
              selectedCorridor={selectedCorridor}
              onSelectCorridor={handleSelectCorridor}
            />
          </div>

          <div className="border rounded-sm p-4 mb-6" style={{ borderColor: C.line, backgroundColor: C.paper }}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B5462F] animate-pulse" />
                <p className="f-sans text-xs font-semibold text-[#1C2420]">
                  {selectedCorridor === "all" ? "National Overview" : currentCorridor.name} · {displayedHabitations.length} Monitored Settlements · {displayedSites.length} Resettlement Sites
                </p>
              </div>
              <MapLegend />
            </div>

            <div className="w-full h-[540px] rounded-sm overflow-hidden">
              {mapMode === "maplibre" ? (
                <MapLibreView
                  habitations={displayedHabitations}
                  sites={displayedSites}
                  redZonesGeoJSON={redZonesGeoJSON}
                  selectedId={selectedHabitationId}
                  onSelectHabitation={setSelectedHabitationId}
                  flyToTarget={flyToTarget}
                  onAddHabitation={addHabitation}
                  corridorCenter={currentCorridor.center}
                  corridorZoom={currentCorridor.zoom}
                  onSelectRedZone={(props) => {
                    setActiveStrategyEntity(props);
                    setStrategyModalOpen(true);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#EFECE4]">
                  <RiskMapSvg
                    habitations={displayedHabitations}
                    sites={displayedSites}
                    selected={selectedHabitationId}
                    onSelect={setSelectedHabitationId}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Habitation Quick Strip */}
          {selectedHabitation && (
            <div
              className="border rounded-sm p-4 flex flex-wrap items-center justify-between gap-4 bg-white"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-[#22364A] text-white">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="f-serif text-base font-bold text-[#1C2420]">
                      {selectedHabitation.name}
                    </h3>
                    <TierBadge tier={selectedHabitation.tier} />
                    {(selectedHabitation.id === "H14" ||
                      selectedHabitation.name.toLowerCase().includes("kuttanad")) && (
                      <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                        In-Situ Priority (No Candidate Site)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#565F58] mt-0.5">
                    {selectedHabitation.region} · Hazard: {selectedHabitation.hazard} · Population: {selectedHabitation.pop.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-right">
                  <p className="f-mono text-xl font-bold text-[#1C2420]">
                    {selectedHabitation.score} <span className="text-xs font-normal text-[#565F58]">/ 100</span>
                  </p>
                  <p className="text-[10px] text-[#565F58]">Composite Risk</p>
                </div>

                <button
                  onClick={() => {
                    setActiveStrategyEntity(selectedHabitation);
                    setStrategyModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm text-[#22364A] bg-[#FFF9EE] border border-[#C0872B] hover:bg-[#FFF3D6] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title="View 3-Pillar In-Situ Adaptation & Mitigation Strategies"
                >
                  <LifeBuoy size={13} className="text-[#C0872B]" /> In-Situ Strategies
                </button>

                <Link
                  href="/habitations"
                  className="px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-[#F7F5F1] text-[#22364A] transition-colors inline-flex items-center gap-1"
                  style={{ borderColor: C.line }}
                >
                  Inspect Factors <ChevronRight size={13} />
                </Link>

                <Link
                  href="/simulation"
                  className="px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors inline-flex items-center gap-1"
                >
                  <Sliders size={13} /> Simulate Relocation
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* SDMA In-Situ Adaptation & Non-Relocation Strategies Modal */}
      <AdaptationStrategyModal
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        strategy={getAdaptationStrategyForEntity(activeStrategyEntity || selectedHabitation)}
        habitationName={activeStrategyEntity?.name || selectedHabitation?.name}
      />
    </div>
  );
}
