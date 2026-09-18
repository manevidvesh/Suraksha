'use client';

import React, { useState, useMemo } from "react";
import {
  Sliders,
  FileWarning,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Compass,
  LifeBuoy,
} from "lucide-react";
import { Habitation, CandidateSite, SimulationResult, ExecutiveBrief } from "@/types";
import { api } from "@/lib/api";
import { C } from "../Common/constants";
import { EmptyState } from "../Common/EmptyState";
import { RiskRadarChart } from "../Charts/RiskRadarChart";
import { ExecutiveBriefModal } from "../AIExplanation/ExecutiveBriefModal";
import { CorridorSelector, filterHabitationsByCorridor, AdaptationStrategyModal } from "../Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";

export interface WhatIfSimulatorProps {
  habitations: Habitation[];
  sites: CandidateSite[];
  initialHabId?: string;
  initialSiteId?: string;
}

function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 50;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function WhatIfSimulator({
  habitations,
  sites,
  initialHabId = "",
  initialSiteId = "",
}: WhatIfSimulatorProps) {
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [habId, setHabId] = useState(initialHabId || (habitations[0]?.id || ""));
  const [siteId, setSiteId] = useState(initialSiteId || (sites[0]?.id || ""));
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);

  // Filter habitations by active planning corridor
  const corridorHabitations = useMemo(() => {
    return filterHabitationsByCorridor(habitations, selectedCorridor);
  }, [habitations, selectedCorridor]);

  const handleSelectCorridor = (corridorId: string) => {
    setSelectedCorridor(corridorId);
    const matching = filterHabitationsByCorridor(habitations, corridorId);
    if (matching.length > 0 && !matching.some((h) => h.id === habId)) {
      setHabId(matching[0].id);
      setStatus("idle");
    }
  };

  // AI Brief modal state
  const [brief, setBrief] = useState<ExecutiveBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [briefOpen, setBriefOpen] = useState(false);

  const selectedHab = useMemo(
    () => habitations.find((h) => h.id === habId) || habitations[0],
    [habitations, habId]
  );

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === siteId),
    [sites, siteId]
  );

  const transitDist = useMemo(() => {
    if (!selectedHab || !selectedSite) return 0;
    return computeDistanceKm(
      selectedHab.latitude,
      selectedHab.longitude,
      selectedSite.latitude,
      selectedSite.longitude
    );
  }, [selectedHab, selectedSite]);

  const isCrossState = transitDist > 200;

  // Split sites into Local Corridor vs Distant Sandbox
  const { localSites, distantSites } = useMemo(() => {
    if (!selectedHab) return { localSites: sites, distantSites: [] };
    const local: (CandidateSite & { dist: number })[] = [];
    const distant: (CandidateSite & { dist: number })[] = [];

    sites.forEach((s) => {
      const d = computeDistanceKm(
        selectedHab.latitude,
        selectedHab.longitude,
        s.latitude,
        s.longitude
      );
      if (d <= 200) {
        local.push({ ...s, dist: d });
      } else {
        distant.push({ ...s, dist: d });
      }
    });

    local.sort((a, b) => a.dist - b.dist);
    distant.sort((a, b) => a.dist - b.dist);

    return { localSites: local, distantSites: distant };
  }, [selectedHab, sites]);

  const runSimulation = async () => {
    if (!habId || !siteId) {
      setStatus("error");
      setErrorMsg("Select both a habitation and a candidate site.");
      return;
    }

    setStatus("loading");
    setBrief(null);
    setBriefError(null);

    try {
      const result = await api.simulateRelocation(habId, siteId);
      // Overwrite geodesic distance with real Haversine if available
      if (transitDist > 0) {
        result.travel_distance_km = transitDist;
      }
      setSimResult(result);
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Relocation simulation failed.");
    }
  };

  const generateBrief = async () => {
    if (!habId) return;
    setBriefLoading(true);
    setBriefError(null);
    try {
      const response = await api.generateExecutiveBrief(habId, siteId || undefined);
      setBrief(response);
      setBriefOpen(true);
    } catch (err: any) {
      console.error("AI brief error:", err);
      setBriefError(err.message || "Could not generate AI decision brief. Please retry.");
    } finally {
      setBriefLoading(false);
    }
  };

  return (
    <div>
      {/* Regional Planning Corridor Selector */}
      <div className="mb-4 bg-white border p-3.5 rounded-sm" style={{ borderColor: C.line }}>
        <CorridorSelector
          selectedCorridor={selectedCorridor}
          onSelectCorridor={handleSelectCorridor}
        />
      </div>

      {/* Parameter Selection Grid */}
      <div
        className="border rounded-sm p-4 mb-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end bg-white"
        style={{ borderColor: C.line }}
      >
        <div>
          <label className="f-sans text-xs block mb-1 font-medium" style={{ color: C.inkSoft }}>
            1. Source Habitation (Endangered)
          </label>
          <select
            value={habId}
            onChange={(e) => {
              setHabId(e.target.value);
              setStatus("idle");
            }}
            className="w-full border rounded-sm px-3 py-2 f-sans text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
            style={{ borderColor: C.line }}
          >
            <option value="">Select a habitation…</option>
            {corridorHabitations.map((h: Habitation) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.region}) · Pop: {h.pop.toLocaleString()} · {h.hazard}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="f-sans text-xs block mb-1 font-medium" style={{ color: C.inkSoft }}>
            2. Candidate Resettlement Site
          </label>
          <select
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              setStatus("idle");
            }}
            className="w-full border rounded-sm px-3 py-2 f-sans text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
            style={{ borderColor: C.line }}
          >
            <option value="">Select a site…</option>
            {localSites.length > 0 && (
              <optgroup label="Recommended Regional Corridor Sites (< 200 km)">
                {localSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.region}) — {s.dist} km transit · Cap: {s.eff.value}
                  </option>
                ))}
              </optgroup>
            )}
            {distantSites.length > 0 && (
              <optgroup label="⚠️ Other Disaster Corridors (Demo Sandbox Only)">
                {distantSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.region}) — {s.dist} km (Infeasible Inter-State)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <button
          onClick={runSimulation}
          disabled={status === "loading"}
          className="f-sans text-xs font-semibold px-4 py-2.5 rounded-sm text-white inline-flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors"
          style={{ backgroundColor: C.slate }}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Calculating…
            </>
          ) : (
            "Run Simulation"
          )}
        </button>
      </div>

      {/* Special In-Situ Directive for Zero/No-Relocation-Site Habitats (e.g. Kuttanad) */}
      {selectedHab &&
        (selectedHab.id === "H14" ||
          selectedHab.name.toLowerCase().includes("kuttanad")) && (
          <div className="border border-[#C0872B] bg-[#FFFDF7] p-4 rounded-sm mb-5 text-xs text-[#1C2420] flex items-start justify-between gap-3 flex-wrap shadow-2xs">
            <div className="flex items-start gap-2.5 max-w-2xl">
              <LifeBuoy size={20} className="text-[#C0872B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#B5462F]">
                  Special Zone Directive: {selectedHab.name} has no designated upland relocation site.
                </span>
                <p className="text-[11px] text-[#565F58] mt-1 leading-relaxed">
                  Kuttanad is India's sub-sea-level agrarian heritage polder. Total population relocation is rejected by local farming communities and unviable under state land constraints. The SDMA mandates <strong>In-Situ Adaptation Strategies</strong> (amphibious dwellings, reinforced polder ring dykes, canal de-silting, and high-ground rescue flood shelters) rather than forced resettlement.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStrategyModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-sm text-[#22364A] bg-[#FFF3D6] border border-[#C0872B] hover:bg-[#FFE8B3] transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LifeBuoy size={13} className="text-[#C0872B]" /> Inspect SDMA In-Situ Strategies
            </button>
          </div>
        )}

      {/* Cross-State Geographic Infeasibility Notice */}
      {selectedSite && isCrossState && (
        <div className="border border-[#C0872B] bg-[#FFF9EE] p-3.5 rounded-sm mb-5 text-xs text-[#1C2420] flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-[#C0872B] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#B5462F]">
              Geographical Infeasibility Warning: {selectedHab?.name} ({selectedHab?.region}) is ~{transitDist.toLocaleString()} km away from {selectedSite?.name} ({selectedSite?.region}).
            </span>
            <p className="text-[11px] text-[#565F58] mt-1">
              In actual disaster administration, planned habitation relocation is strictly restricted to local panchayats or within-state contiguous revenue districts (typically &lt; 30–50 km). The inclusion of cross-state sites (e.g. Kannur vs Bankura) in the database is solely to demonstrate how the multi-hazard mathematical algorithm scales across diverse national hazard typologies.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className="border rounded-sm p-4 flex items-start gap-3 mb-5"
          style={{ borderColor: C.immediate, backgroundColor: `${C.immediate}0D` }}
        >
          <FileWarning size={18} style={{ color: C.immediate }} className="mt-0.5" />
          <div>
            <p className="f-sans text-sm font-medium" style={{ color: C.immediate }}>
              Simulation parameters incomplete
            </p>
            <p className="f-sans text-xs mt-0.5" style={{ color: C.inkSoft }}>
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div
          className="border rounded-sm p-10 flex flex-col items-center justify-center bg-white"
          style={{ borderColor: C.line }}
        >
          <Loader2 size={24} className="animate-spin text-[#22364A]" />
          <p className="f-sans text-sm mt-3 font-semibold text-[#1C2420]">
            Solving geodesic friction and carrying capacity constraints…
          </p>
          <p className="f-sans text-xs mt-1 text-[#565F58]">
            Calculating Liebig bottleneck stress across land, water, sanitation, schools, and clinics
          </p>
        </div>
      )}

      {status === "done" && simResult && (
        <div className="space-y-5">
          <div
            className="border rounded-sm p-3.5 flex items-center justify-between gap-3 flex-wrap"
            style={{
              borderColor: simResult.capacity_exceeded ? C.shortTerm : C.pine,
              backgroundColor: simResult.capacity_exceeded ? "#FFF9EE" : C.pineSoft,
            }}
          >
            <div className="flex items-center gap-2.5">
              {simResult.capacity_exceeded ? (
                <AlertCircle size={18} style={{ color: C.shortTerm }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: C.pine }} />
              )}
              <div>
                <p className="f-sans text-sm font-semibold" style={{ color: C.ink }}>
                  Relocation Model: {simResult.habitation_name} → {simResult.site_name}
                </p>
                <p className="text-xs" style={{ color: C.inkSoft }}>
                  {simResult.summary_message}
                </p>
              </div>
            </div>

            <button
              onClick={generateBrief}
              disabled={briefLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#22364A] text-white text-xs font-medium rounded-xs hover:bg-[#3E5E82] cursor-pointer transition-colors"
            >
              {briefLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <FileText size={13} />
              )}
              Generate SDMA Decision Brief
            </button>
          </div>

          {briefError && (
            <div
              className="border rounded-sm p-3 flex items-start gap-2"
              style={{ borderColor: C.immediate, backgroundColor: `${C.immediate}0D` }}
            >
              <FileWarning size={16} style={{ color: C.immediate }} className="mt-0.5 shrink-0" />
              <p className="f-sans text-xs" style={{ color: C.immediate }}>
                {briefError}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            <div
              className="border rounded-sm p-4 bg-white"
              style={{ borderColor: C.line }}
            >
              <p className="f-sans text-sm font-semibold mb-1 text-[#1C2420]">
                Before vs. After Hazard Profile
              </p>
              <p className="text-xs mb-3 text-[#565F58]">
                Multidimensional radar comparison showing drop in hazard exposure and accessibility deficit
              </p>
              <RiskRadarChart data={simResult.radar_data} height={280} />
            </div>

            <div
              className="border rounded-sm p-4 space-y-4 bg-white"
              style={{ borderColor: C.line }}
            >
              <div>
                <p className="f-sans text-xs text-[#565F58]">
                  Resettlement Site Capacity Load
                </p>
                <p className="f-mono text-2xl font-bold text-[#1C2420]">
                  {simResult.population}{" "}
                  <span className="text-xs font-normal text-[#565F58]">
                    / {simResult.effective_capacity} capacity
                  </span>
                </p>
                <div className="h-2 rounded-full mt-2" style={{ backgroundColor: C.paperDim }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (simResult.population / (simResult.effective_capacity || 1)) * 100
                      )}%`,
                      backgroundColor: simResult.capacity_exceeded ? C.immediate : C.pine,
                    }}
                  />
                </div>
                {simResult.capacity_exceeded && (
                  <p className="f-sans text-xs mt-1.5 font-medium" style={{ color: C.immediate }}>
                    Exceeds site bottleneck ({simResult.bottleneck}) — phased relocation or utility expansion required.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t" style={{ borderColor: C.line }}>
                <p className="f-sans text-xs text-[#565F58]">
                  Actual Transit Distance
                </p>
                <p className="f-mono text-2xl font-bold text-[#1C2420]">
                  {simResult.travel_distance_km}{" "}
                  <span className="text-xs font-normal text-[#565F58]">km</span>
                </p>
                {simResult.travel_distance_km > 200 && (
                  <span className="text-[10px] text-[#B5462F] font-semibold">
                    (Out-of-Corridor / Inter-State Transit)
                  </span>
                )}
              </div>

              <div className="pt-2 border-t" style={{ borderColor: C.line }}>
                <p className="f-sans text-xs text-[#565F58]">
                  Hazard Exposure Reduction
                </p>
                <p className="f-mono text-2xl font-bold" style={{ color: C.pine }}>
                  −{simResult.hazard_reduction_pct}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "idle" && (
        <EmptyState
          icon={Sliders}
          title="No simulation run yet"
          body="Choose a source habitation and candidate site above, then click 'Run Simulation' to model transit feasibility, capacity load, and before-vs-after exposure."
        />
      )}

      {/* AI Decision Brief Modal */}
      <ExecutiveBriefModal
        brief={brief}
        isOpen={briefOpen}
        onClose={() => setBriefOpen(false)}
      />

      {/* SDMA In-Situ Adaptation Strategies Modal */}
      {selectedHab && (
        <AdaptationStrategyModal
          isOpen={strategyModalOpen}
          onClose={() => setStrategyModalOpen(false)}
          strategy={getAdaptationStrategyForEntity(selectedHab)}
          habitationName={selectedHab.name}
        />
      )}
    </div>
  );
}
