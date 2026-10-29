'use client';

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  MapIcon,
  ChevronRight,
  ArrowRight,
  Plus,
  LifeBuoy,
  MapPin,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { Habitation } from "@/types";
import { C } from "@/components/Common/constants";
import { TierBadge } from "@/components/Common/Badges";
import { SectionHead } from "@/components/Common/SectionHead";
import { EmptyState } from "@/components/Common/EmptyState";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { MapLibreView } from "@/components/Map";
import { RiskMapSvg, MapLegend } from "@/components/RiskMap";
import { HabitationModal } from "@/components/HabitationTable";
import {
  CorridorSelector,
  filterHabitationsByCorridor,
  filterSitesByCorridor,
  filterRedZonesByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
  PopulationVintageBadge,
  RiskFactorBarBreakdown,
} from "@/components/Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";

function DashboardContent() {
  const {
    habitations,
    sites,
    redZonesGeoJSON,
    selectedHabitationId,
    setSelectedHabitationId,
    loading,
    networkError,
    flyToTarget,
    addHabitation,
  } = useRiskData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mapMode, setMapMode] = useState<"maplibre" | "schematic">("maplibre");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const displayedRedZones = useMemo(() => {
    return filterRedZonesByCorridor(redZonesGeoJSON, selectedCorridor, displayedHabitations);
  }, [redZonesGeoJSON, selectedCorridor, displayedHabitations]);

  const handleSelectCorridor = (corridorId: string) => {
    setSelectedCorridor(corridorId);
    const matching = filterHabitationsByCorridor(habitations, corridorId);
    if (matching.length > 0 && !matching.some((h) => h.id === selectedHabitationId)) {
      setSelectedHabitationId(matching[0].id);
    }
  };

  const counts = useMemo(() => {
    const c = { Immediate: 0, "Short-term": 0, "Medium-term": 0 };
    displayedHabitations.forEach((h: Habitation) => {
      if (c[h.tier] !== undefined) c[h.tier]++;
    });
    return c;
  }, [displayedHabitations]);

  const totalPop = useMemo(
    () => displayedHabitations.reduce((acc, h) => acc + h.pop, 0),
    [displayedHabitations]
  );

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
          title="Overview Dashboard"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {networkError && (
          <div className="bg-[#B5462F] text-white px-5 py-2 text-xs flex items-center justify-between">
            <span>{networkError}</span>
            <button
              onClick={() => window.location.reload()}
              className="underline font-medium hover:opacity-80 ml-4 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        <main className="px-5 sm:px-8 py-6 max-w-6xl space-y-5">
          {/* Page Header */}
          <SectionHead
            title="Overview Dashboard"
            sub="Regional hazard exposure, settlement risk tiers, and candidate relocation capacity at a glance."
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] cursor-pointer transition-colors"
                >
                  <Plus size={13} /> Add Settlement
                </button>
                <div className="inline-flex rounded-sm border p-0.5 bg-white" style={{ borderColor: C.line }}>
                  <button
                    onClick={() => setMapMode("maplibre")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
                      mapMode === "maplibre"
                        ? "bg-[#22364A] text-white"
                        : "text-[#565F58] hover:text-[#1C2420]"
                    }`}
                  >
                    <MapIcon size={12} /> MapLibre
                  </button>
                  <button
                    onClick={() => setMapMode("schematic")}
                    className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                      mapMode === "schematic"
                        ? "bg-[#22364A] text-white"
                        : "text-[#565F58] hover:text-[#1C2420]"
                    }`}
                  >
                    Schematic
                  </button>
                </div>
              </div>
            }
          />

          {/* Regional Planning Corridor Selector */}
          <div className="bg-white border p-3 rounded-sm" style={{ borderColor: C.line }}>
            <CorridorSelector
              selectedCorridor={selectedCorridor}
              onSelectCorridor={handleSelectCorridor}
            />
          </div>

          {/* 4 Core Summary Metrics */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px border rounded-sm overflow-hidden"
            style={{ backgroundColor: C.line, borderColor: C.line }}
          >
            {[
              { label: "Habitations tracked", val: displayedHabitations.length },
              { label: "Population exposed", val: totalPop.toLocaleString("en-IN") },
              { label: "Immediate priority", val: counts.Immediate, color: C.immediate },
              { label: "Candidate sites", val: displayedSites.length, color: C.pine },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-white">
                <p className="f-mono text-2xl font-bold" style={{ color: stat.color || C.ink }}>
                  {loading ? "…" : stat.val}
                </p>
                <p className="f-sans text-xs mt-0.5" style={{ color: C.inkSoft }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Map + Detail Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            {/* Left: Multi-Hazard Map Container */}
            <div
              className="border rounded-sm p-4 bg-white flex flex-col justify-between"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="f-sans text-xs font-semibold text-[#1C2420]">
                  Multi-Hazard Spatial Viewer {mapMode === "maplibre" ? "(PostGIS WGS84 + Red Zones)" : "(Schematic Layout)"}
                </p>
                <MapLegend />
              </div>

              <div className="w-full min-h-[360px] flex-1">
                {mapMode === "maplibre" ? (
                  <MapLibreView
                    habitations={displayedHabitations}
                    sites={displayedSites}
                    redZonesGeoJSON={displayedRedZones}
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
                  <div className="aspect-[16/10]">
                    <RiskMapSvg
                      habitations={displayedHabitations}
                      sites={displayedSites}
                      selected={selectedHabitationId}
                      onSelect={setSelectedHabitationId}
                    />
                  </div>
                )}
              </div>

              <p className="f-sans text-[11px] mt-2.5 text-[#565F58] leading-relaxed">
                Notice: Red polygons denote model-identified candidate risk zones (decision-support outputs; not statutory designations). Click any settlement marker to inspect risk factors and evaluate relocation options.
              </p>
            </div>

            {/* Right: Selected Habitation Quick Inspector */}
            <div
              className="border rounded-sm p-4 bg-white flex flex-col justify-between"
              style={{ borderColor: C.line }}
            >
              {selectedHabitation ? (
                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#565F58]">
                        {selectedHabitation.region}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#1C2420]">
                        Score: {selectedHabitation.score}/100
                      </span>
                    </div>
                    <h3 className="f-serif text-lg font-bold text-[#1C2420] mt-0.5">
                      {selectedHabitation.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <TierBadge tier={selectedHabitation.tier} />
                      {(selectedHabitation.id === "H14" ||
                        selectedHabitation.name.toLowerCase().includes("kuttanad")) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                          In-Situ Priority
                        </span>
                      )}
                    </div>
                  </div>

                  <dl className="space-y-1.5 f-sans text-xs border-y py-2.5" style={{ borderColor: C.line }}>
                    <div className="flex justify-between items-center">
                      <dt style={{ color: C.inkSoft }}>Demographics</dt>
                      <dd>
                        <PopulationVintageBadge count={selectedHabitation.pop} />
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: C.inkSoft }}>Primary Hazard</dt>
                      <dd className="font-medium text-[#1C2420]">{selectedHabitation.hazard}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: C.inkSoft }}>Recorded Incidents</dt>
                      <dd className="f-mono">{selectedHabitation.events} past events</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: C.inkSoft }}>Coordinates</dt>
                      <dd className="f-mono text-[11px]">
                        {selectedHabitation.latitude.toFixed(3)}, {selectedHabitation.longitude.toFixed(3)}
                      </dd>
                    </div>
                  </dl>

                  {/* Visual 5-Factor MCDA Risk Breakdown */}
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-[#565F58] mb-1">
                      MCDA Risk Factor Breakdown
                    </p>
                    <RiskFactorBarBreakdown
                      factors={selectedHabitation.f}
                      compositeScore={selectedHabitation.score}
                      compact
                    />
                  </div>

                  {/* Candidate Destination Summary */}
                  <div className="p-2.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#1C2420]">Candidate Destination:</span>
                      <span className="font-mono font-bold text-[#3D6B5C]">
                        {displayedSites[0] ? displayedSites[0].name : "None in corridor"}
                      </span>
                    </div>
                    {displayedSites[0] && (
                      <p className="text-[10px] text-[#565F58]">
                        Effective Capacity: {displayedSites[0].eff?.value || 300} · Bottleneck: {displayedSites[0].eff?.bottleneck || "Water"}
                      </p>
                    )}
                  </div>

                  {/* Action Hierarchy: Clear Primary + Secondary Actions */}
                  <div className="pt-1 space-y-2">
                    <Link
                      href={`/relocation?habitation=${selectedHabitation.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2.5 rounded-sm bg-[#3D6B5C] hover:bg-[#32584B] text-white font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <MapPin size={13} /> Evaluate Relocation Sites <ArrowRight size={13} />
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/habitations`}
                        className="inline-flex items-center justify-center gap-1 f-sans text-xs py-1.5 rounded-sm border hover:bg-[#F7F5F1] text-[#22364A] transition-colors"
                        style={{ borderColor: C.line }}
                      >
                        <Sliders size={12} /> Risk Factors
                      </Link>

                      <Link
                        href={`/simulation`}
                        className="inline-flex items-center justify-center gap-1 f-sans text-xs py-1.5 rounded-sm border hover:bg-[#F7F5F1] text-[#22364A] transition-colors"
                        style={{ borderColor: C.line }}
                      >
                        Simulation <ArrowRight size={11} />
                      </Link>
                    </div>

                    {(selectedHabitation.id === "H14" ||
                      selectedHabitation.name.toLowerCase().includes("kuttanad")) && (
                      <button
                        onClick={() => {
                          setActiveStrategyEntity(selectedHabitation);
                          setStrategyModalOpen(true);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-1.5 rounded-sm bg-[#FFF9EE] border border-[#C0872B] hover:bg-[#FFF3D6] text-[#22364A] font-medium cursor-pointer transition-colors"
                      >
                        <LifeBuoy size={12} className="text-[#C0872B]" /> In-Situ Adaptation Measures
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No settlement selected"
                  body="Click a marker on the map to inspect its hazard breakdown."
                />
              )}
            </div>
          </div>

          {/* Priority Settlements Queue */}
          <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
            <div className="p-3.5 bg-[#FAF9F5] border-b flex items-center justify-between flex-wrap gap-2" style={{ borderColor: C.line }}>
              <div>
                <h3 className="f-serif text-sm font-bold text-[#1C2420]">
                  Monitored Settlements Queue ({displayedHabitations.length})
                </h3>
                <p className="text-[11px] text-[#565F58]">
                  Deterministic MCDA priority ranking for {currentCorridor.name}
                </p>
              </div>

              <Link
                href="/habitations"
                className="inline-flex items-center gap-1 text-xs text-[#22364A] hover:underline font-semibold"
              >
                <span>Full Risk Scoring Matrix &amp; Sensitivity</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: C.line }}>
              {displayedHabitations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#565F58]">
                  No habitations registered in this corridor.
                </div>
              ) : (
                displayedHabitations.map((h) => {
                  const isSelected = selectedHabitationId === h.id;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHabitationId(h.id)}
                      className={`p-3 flex items-center justify-between gap-4 hover:bg-[#FAF9F5] transition-colors cursor-pointer ${
                        isSelected ? "bg-[#FAF9F5] border-l-3 border-[#22364A]" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs text-[#1C2420] truncate">{h.name}</p>
                          <span className="text-[10px] text-[#565F58] font-mono">({h.region})</span>
                        </div>
                        <p className="text-[11px] text-[#565F58] mt-0.5">
                          {h.hazard} · {h.pop.toLocaleString()} residents · {h.events} past events
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <TierBadge tier={h.tier} />
                        <span className="f-mono text-xs font-bold text-[#1C2420]">{h.score}/100</span>
                        <Link
                          href={`/relocation?habitation=${h.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-1 text-[11px] rounded-xs bg-[#3D6B5C] hover:bg-[#32584B] text-white font-medium inline-flex items-center gap-1 transition-colors"
                          title="Evaluate relocation sites"
                        >
                          <span>Match</span>
                          <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Manual Habitation Registration Modal */}
      <HabitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabitation}
      />

      {/* Candidate In-Situ Adaptation Measures Modal */}
      <AdaptationStrategyModal
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        strategy={getAdaptationStrategyForEntity(activeStrategyEntity || selectedHabitation)}
        habitationName={activeStrategyEntity?.name || selectedHabitation?.name}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-xs text-[#565F58]">Loading Overview Dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
