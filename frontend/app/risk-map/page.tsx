'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapIcon,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Sliders,
  LifeBuoy,
  Radio,
  CloudRain,
  Waves,
  RotateCcw,
  BellRing,
  Loader2,
  Info,
  MapPin,
  ShieldCheck,
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
  filterRedZonesByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
  SimulationParameterDisclosure,
  RiskFactorBarBreakdown,
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
    setFlyToTarget,
    addHabitation,
    triggerDynamicHazardExpansion,
    resetRedZones,
  } = useRiskData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mapMode, setMapMode] = useState<"maplibre" | "schematic">("maplibre");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [activeStrategyEntity, setActiveStrategyEntity] = useState<any>(null);

  // Early warning telemetry simulation state
  const [telemetryAlert, setTelemetryAlert] = useState<{
    type: "cloudburst" | "flood";
    message: string;
    details: string;
    targetName: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

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

  const selectedHabitation =
    displayedHabitations.find((h) => h.id === selectedHabitationId) ||
    displayedHabitations[0] ||
    habitations.find((h) => h.id === selectedHabitationId) ||
    habitations[0];

  const handleTriggerCloudburstAlert = async () => {
    if (!selectedHabitation) return;
    setIsSimulating(true);
    try {
      await triggerDynamicHazardExpansion({
        latitude: selectedHabitation.latitude,
        longitude: selectedHabitation.longitude,
        radiusKm: 5.5,
        hazardType: "IMD Extreme Cloudburst Surge",
        zoneName: `IMD-Inspired Dynamic Cloudburst Buffer: ${selectedHabitation.name}`,
        severity: "Critical Cloudburst Surge",
      });

      setFlyToTarget({
        latitude: selectedHabitation.latitude,
        longitude: selectedHabitation.longitude,
        name: selectedHabitation.name,
      });

      setTelemetryAlert({
        type: "cloudburst",
        targetName: selectedHabitation.name,
        message: `SIMULATED IMD RADAR TRIGGER: Extreme Precipitation (>68.5 mm/hr) over ${selectedHabitation.name}`,
        details: `Candidate dynamic risk zone expanded by 5.5 km buffer in simulation. Simulated stress-test scenario for district contingency review (Demonstration Run).`,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTriggerRiverineSurge = async () => {
    if (!selectedHabitation) return;
    setIsSimulating(true);
    try {
      await triggerDynamicHazardExpansion({
        latitude: selectedHabitation.latitude,
        longitude: selectedHabitation.longitude,
        radiusKm: 4.5,
        hazardType: "CWC Riverine Flood Inundation Surge",
        zoneName: `CWC Stage-III Flood Inundation Buffer: ${selectedHabitation.name}`,
        severity: "Severe Inundation",
      });

      setFlyToTarget({
        latitude: selectedHabitation.latitude,
        longitude: selectedHabitation.longitude,
        name: selectedHabitation.name,
      });

      setTelemetryAlert({
        type: "flood",
        targetName: selectedHabitation.name,
        message: `SIMULATED CWC HYDROLOGICAL ALERT: Stage-III Riverine High Inundation at ${selectedHabitation.name}`,
        details: `Simulated catchment discharge exceeding High Flood Level (HFL). Candidate risk zone dynamically expanded by 4.5 km buffer for DDMA contingency assessment.`,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetTelemetry = () => {
    resetRedZones();
    setTelemetryAlert(null);
  };

  const [disclosureOpen, setDisclosureOpen] = useState(false);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Multi-Hazard Map"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-6 max-w-6xl space-y-4">
          {/* Header & View Mode Switcher */}
          <SectionHead
            title="Multi-Hazard Spatial Viewer"
            sub="Interactive GIS visualization showing PostGIS hazard zones (flood plains, landslide corridors) and candidate resettlement sites across national planning corridors."
            action={
              <div className="inline-flex rounded-sm border p-0.5 bg-white shadow-2xs" style={{ borderColor: C.line }}>
                <button
                  onClick={() => setMapMode("maplibre")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    mapMode === "maplibre"
                      ? "bg-[#22364A] text-white"
                      : "text-[#565F58] hover:text-[#1C2420]"
                  }`}
                >
                  <MapIcon size={13} /> MapLibre WebGL
                </button>
                <button
                  onClick={() => setMapMode("schematic")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
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

          {/* Unified Map Command Bar: Corridor Selector + Legend + Quick Actions */}
          <div className="bg-white border rounded-sm p-3 shadow-2xs space-y-2.5" style={{ borderColor: C.line }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Corridor Selector */}
              <div className="w-full sm:w-80">
                <CorridorSelector
                  selectedCorridor={selectedCorridor}
                  onSelectCorridor={handleSelectCorridor}
                />
              </div>

              {/* Dynamic Simulation Triggers */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-[#565F58] uppercase tracking-wider hidden sm:inline">
                  Dynamic Stress Test:
                </span>
                <button
                  onClick={handleTriggerCloudburstAlert}
                  disabled={isSimulating}
                  className="px-2.5 py-1.5 bg-[#B5462F] hover:bg-[#9B3C27] text-white text-xs font-medium rounded-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  title="Simulate localized extreme precipitation (>65mm/hr) expanding candidate buffer"
                >
                  {isSimulating ? <Loader2 size={12} className="animate-spin" /> : <CloudRain size={12} />}
                  ⚡ Cloudburst Alert (&gt;65 mm/hr)
                </button>

                <button
                  onClick={handleTriggerRiverineSurge}
                  disabled={isSimulating}
                  className="px-2.5 py-1.5 bg-[#22364A] hover:bg-[#3E5E82] text-white text-xs font-medium rounded-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  title="Simulate high hydrological riverine discharge expanding candidate inundation zone"
                >
                  {isSimulating ? <Loader2 size={12} className="animate-spin" /> : <Waves size={12} />}
                  🌊 Flood Surge
                </button>

                {telemetryAlert && (
                  <button
                    onClick={handleResetTelemetry}
                    className="px-2 py-1.5 border border-[#D9D4C7] hover:bg-[#F7F5F1] text-[#565F58] text-xs font-medium rounded-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                    title="Restore baseline candidate risk zones"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* Sub-bar: Map Legend & Corridor Metric Summary */}
            <div className="pt-2 border-t flex items-center justify-between flex-wrap gap-2 text-xs" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5462F] animate-pulse" />
                <span className="font-semibold text-[#1C2420]">
                  {selectedCorridor === "all" ? "National Overview" : currentCorridor.name}
                </span>
                <span className="text-[#565F58] font-mono text-[11px]">
                  ({displayedHabitations.length} Monitored Settlements · {displayedSites.length} Candidate Sites)
                </span>
              </div>
              <MapLegend />
            </div>
          </div>

          {/* Active Telemetry Urgent Banner (if triggered) */}
          {telemetryAlert && (
            <div
              className="p-3.5 rounded-sm border flex items-start justify-between gap-3 animate-fadeIn"
              style={{
                borderColor: telemetryAlert.type === "cloudburst" ? "#B5462F" : "#22364A",
                backgroundColor: telemetryAlert.type === "cloudburst" ? "#FFF8F6" : "#F4F7FA",
              }}
            >
              <div className="flex items-start gap-2.5">
                <BellRing
                  size={18}
                  className={`shrink-0 mt-0.5 animate-bounce ${
                    telemetryAlert.type === "cloudburst" ? "text-[#B5462F]" : "text-[#22364A]"
                  }`}
                />
                <div>
                  <p className="text-xs font-bold" style={{ color: telemetryAlert.type === "cloudburst" ? "#B5462F" : "#22364A" }}>
                    {telemetryAlert.message}
                  </p>
                  <p className="text-[11px] text-[#565F58] mt-0.5 leading-relaxed">
                    {telemetryAlert.details}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#FFF1F0] border border-[#B5462F]/40 text-[#B5462F] font-bold shrink-0">
                SIMULATED EVENT · DYNAMIC BUFFER EXPANDED
              </span>
            </div>
          )}

          {/* 🗺️ THE MAP HERO CONTAINER */}
          <div className="border rounded-sm overflow-hidden bg-white shadow-sm" style={{ borderColor: C.line }}>
            <div className="w-full h-[560px]">
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

          {/* 🔍 SELECTED HABITATION LEVEL 1 & LEVEL 2 QUICK INSPECTOR */}
          {selectedHabitation && (
            <div
              className="border rounded-sm p-4 bg-white shadow-2xs space-y-3"
              style={{ borderColor: C.line }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Left: Identity & Core Indicators */}
                <div className="lg:col-span-4 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-1 rounded-xs bg-[#22364A] text-white">
                      <ShieldAlert size={14} />
                    </span>
                    <h3 className="f-serif text-base font-bold text-[#1C2420]">
                      {selectedHabitation.name}
                    </h3>
                    <TierBadge tier={selectedHabitation.tier} />
                  </div>

                  <p className="text-xs text-[#565F58]">
                    {selectedHabitation.region} · Hazard: <strong className="text-[#1C2420]">{selectedHabitation.hazard}</strong>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#565F58] font-mono pt-0.5">
                    <span>Pop: <strong>{selectedHabitation.pop.toLocaleString()}</strong></span>
                    <span>·</span>
                    <span>Coords: {selectedHabitation.latitude.toFixed(3)}, {selectedHabitation.longitude.toFixed(3)}</span>
                  </div>

                  {(selectedHabitation.id === "H14" ||
                    selectedHabitation.name.toLowerCase().includes("kuttanad")) && (
                    <div className="mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                        In-Situ Adaptation Priority (No Upland Site)
                      </span>
                    </div>
                  )}
                </div>

                {/* Middle: Compact 5-Factor MCDA Bar Breakdown */}
                <div className="lg:col-span-4 border-y lg:border-y-0 lg:border-x py-2 lg:py-0 lg:px-4" style={{ borderColor: C.line }}>
                  <RiskFactorBarBreakdown
                    factors={selectedHabitation.f}
                    compositeScore={selectedHabitation.score}
                    compact
                  />
                </div>

                {/* Right: Quick Operational Directives & Action Links */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs text-[#565F58] mb-1">
                    <span className="font-semibold text-[#1C2420] block">Operational Decision Chain:</span>
                    <span>Screen candidate destination sites or test in-situ adaptation fallback.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/relocation?habitation=${selectedHabitation.id}`}
                      className="px-3 py-2 text-xs font-semibold rounded-sm text-white bg-[#3D6B5C] hover:bg-[#32584B] transition-colors inline-flex items-center justify-center gap-1 shadow-2xs text-center"
                      title="Evaluate candidate resettlement sites & carrying capacity"
                    >
                      <MapPin size={12} /> Relocation Sites <ArrowRight size={11} />
                    </Link>

                    <Link
                      href="/simulation"
                      className="px-3 py-2 text-xs font-semibold rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors inline-flex items-center justify-center gap-1 shadow-2xs text-center"
                      title="Simulate relocation before-vs-after exposure reduction"
                    >
                      <Sliders size={12} /> Stress Test
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveStrategyEntity(selectedHabitation);
                        setStrategyModalOpen(true);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium rounded-sm text-[#22364A] bg-[#FFF9EE] border border-[#C0872B] hover:bg-[#FFF3D6] transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
                      title="View 3-Pillar Candidate In-Situ Adaptation Measures"
                    >
                      <LifeBuoy size={12} className="text-[#C0872B]" /> Candidate In-Situ Measures
                    </button>

                    <Link
                      href="/habitations"
                      className="px-2.5 py-1.5 text-xs font-medium border rounded-sm hover:bg-[#F7F5F1] text-[#22364A] transition-colors inline-flex items-center justify-center gap-1 shrink-0"
                      style={{ borderColor: C.line }}
                    >
                      Inspect Factors <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⚖️ TECHNICAL AUDIT & STATUTORY CREDIBILITY DRAWER */}
          <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
            <button
              onClick={() => setDisclosureOpen(!disclosureOpen)}
              className="w-full p-3 bg-[#FAF9F5] flex items-center justify-between text-left cursor-pointer hover:bg-[#F7F5F1] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck size={14} className="text-[#22364A]" />
                <span className="font-bold text-[#1C2420]">
                  Statutory Legal Disclaimers &amp; Scientific Buffer Parameters (GSI / IMD / CWC / Census 2011)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-white border border-[#D9D4C7] text-[#565F58]">
                  DECISION SUPPORT ONLY
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-[#565F58] transition-transform duration-200 ${disclosureOpen ? "rotate-180" : ""}`}
              />
            </button>

            {disclosureOpen && (
              <div className="p-4 border-t space-y-3 bg-white" style={{ borderColor: C.line }}>
                <div className="p-2.5 rounded-sm bg-[#FFF9EE] border border-[#C0872B]/40 flex items-center justify-between gap-2 text-xs text-[#8C5D17]">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-[#C0872B] shrink-0" />
                    <span>
                      <strong>Statutory Notice:</strong> SURAKSHA model-generated zones are decision-support outputs and do not constitute statutory or legal designation. Final designation remains with the competent authority.
                    </span>
                  </div>
                </div>

                <SimulationParameterDisclosure />
              </div>
            )}
          </div>
        </main>
      </div>

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
