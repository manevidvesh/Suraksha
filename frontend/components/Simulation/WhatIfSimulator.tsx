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
  IndianRupee,
  Activity,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Habitation, CandidateSite, SimulationResult, ExecutiveBrief, FinancialOutlayBreakdown } from "@/types";
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
  const [activeTab, setActiveTab] = useState<"spatial" | "financial" | "phases">("spatial");
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

  const financialOutlay = useMemo<FinancialOutlayBreakdown | null>(() => {
    if (!simResult) return null;
    if (simResult.financial_outlay) return simResult.financial_outlay;
    const households = Math.max(1, Math.ceil(simResult.population / 4.2));
    const pmay = Number(((households * 1.30) / 100).toFixed(2));
    const land = Number(((households * 0.80) / 100).toFixed(2));
    const infra = Number(((households * 1.20) / 100).toFixed(2));
    const total = Number((pmay + land + infra).toFixed(2));
    const ndrf = Number((total * 0.75).toFixed(2));
    const sdrf = Number((total - ndrf).toFixed(2));
    return {
      households_count: households,
      total_crores: total,
      pmay_housing_crores: pmay,
      land_development_crores: land,
      infrastructure_crores: infra,
      ndrf_central_share_crores: ndrf,
      sdrf_state_share_crores: sdrf,
    };
  }, [simResult]);

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
      if (!result.financial_outlay) {
        const households = Math.max(1, Math.ceil(result.population / 4.2));
        const pmay = Number(((households * 1.30) / 100).toFixed(2));
        const land = Number(((households * 0.80) / 100).toFixed(2));
        const infra = Number(((households * 1.20) / 100).toFixed(2));
        const total = Number((pmay + land + infra).toFixed(2));
        const ndrf = Number((total * 0.75).toFixed(2));
        const sdrf = Number((total - ndrf).toFixed(2));
        result.financial_outlay = {
          households_count: households,
          total_crores: total,
          pmay_housing_crores: pmay,
          land_development_crores: land,
          infrastructure_crores: infra,
          ndrf_central_share_crores: ndrf,
          sdrf_state_share_crores: sdrf,
        };
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

      {/* Candidate In-Situ Measures for Zero/No-Relocation-Site Habitats (e.g. Kuttanad) */}
      {selectedHab &&
        (selectedHab.id === "H14" ||
          selectedHab.name.toLowerCase().includes("kuttanad")) && (
          <div className="border border-[#C0872B] bg-[#FFFDF7] p-4 rounded-sm mb-5 text-xs text-[#1C2420] flex items-start justify-between gap-3 flex-wrap shadow-2xs">
            <div className="flex items-start gap-2.5 max-w-2xl">
              <LifeBuoy size={20} className="text-[#C0872B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#B5462F]">
                  Special Zone Assessment: {selectedHab.name} has no designated upland relocation site.
                </span>
                <p className="text-[11px] text-[#565F58] mt-1 leading-relaxed">
                  Kuttanad is India's sub-sea-level agrarian heritage polder. Total population relocation is rejected by local farming communities and unviable under state land constraints. <strong>Candidate In-Situ Adaptation Measures</strong> (amphibious dwellings, reinforced polder ring dykes, canal de-silting, and high-ground rescue flood shelters) are evaluated for technical authority review rather than forced resettlement.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStrategyModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-sm text-[#22364A] bg-[#FFF3D6] border border-[#C0872B] hover:bg-[#FFE8B3] transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LifeBuoy size={13} className="text-[#C0872B]" /> Inspect Candidate In-Situ Measures
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
              title="Synthesizes structured relocation findings into an AI explanation brief for DDMA review"
            >
              {briefLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <FileText size={13} />
              )}
              Generate AI Decision Brief (DDMA Review)
            </button>
          </div>

          {/* Decision Support Status & Audit Metadata */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs px-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-xs font-semibold text-[11px] border ${
                  simResult.decision_status?.includes("NO SUITABLE")
                    ? "bg-[#FFF3D6] text-[#C0872B] border-[#C0872B]/40"
                    : "bg-[#E8F0EC] text-[#2A6B52] border-[#2A6B52]/40"
                }`}
              >
                {simResult.decision_status || (simResult.capacity_exceeded ? "CAPACITY DEFICIT DETECTED" : "VIABLE CANDIDATE MATCH")}
              </span>
              <span className="font-mono text-[10px] text-[#565F58] bg-[#FAF9F5] px-2 py-0.5 rounded-xs border border-[#D9D4C7]">
                Ref: {simResult.source_assessment_id || "SRK-2026-SIM-v1"}
              </span>
            </div>
            <span className="text-[10px] text-[#565F58] font-mono">
              {simResult.explanation_layer || "AI EXPLANATION LAYER — FOR HUMAN DECISION-MAKER REVIEW"}
            </span>
          </div>

          {/* Viability Drivers, Bottlenecks & Decision Blockers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#FAF9F5] p-3.5 rounded-sm border border-[#D9D4C7]">
            <div className="space-y-1">
              <p className="font-bold text-[#2A6B52] uppercase text-[10px] tracking-wider">
                Why This Site (Viability Drivers)
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                {(simResult.why_this_site || [
                  `Reduces hazard exposure by ${simResult.hazard_reduction_pct}%`,
                  `Effective capacity supports ${simResult.effective_capacity} persons`
                ]).map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-[#C0872B] uppercase text-[10px] tracking-wider">
                Constraints & Bottlenecks
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                {(simResult.why_not_this_site || [
                  `Primary capacity bottleneck: ${simResult.bottleneck}`,
                  `Transit distance: ${simResult.travel_distance_km} km`
                ]).map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-[#B5462F] uppercase text-[10px] tracking-wider">
                Primary Decision Blockers
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                {(simResult.primary_blockers && simResult.primary_blockers.length > 0 ? simResult.primary_blockers : [
                  simResult.capacity_exceeded
                    ? `Capacity deficit of ${simResult.population - simResult.effective_capacity} residents`
                    : "No structural bottlenecks exceeding threshold",
                  "Cadastral revenue clearance pending field survey"
                ]).map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
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

          {/* Operational & Financial Mode Tabs */}
          <div className="flex border-b border-[#D9D4C7] gap-2 pt-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("spatial")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === "spatial"
                  ? "border-[#22364A] text-[#22364A] font-semibold"
                  : "border-transparent text-[#565F58] hover:text-[#1C2420]"
              }`}
            >
              <Activity size={14} /> Spatial & Carrying Capacity
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === "financial"
                  ? "border-[#22364A] text-[#22364A] font-semibold"
                  : "border-transparent text-[#565F58] hover:text-[#1C2420]"
              }`}
            >
              <IndianRupee size={14} /> Indicative Resettlement Financial Outlay Estimate
            </button>
            <button
              onClick={() => setActiveTab("phases")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === "phases"
                  ? "border-[#22364A] text-[#22364A] font-semibold"
                  : "border-transparent text-[#565F58] hover:text-[#1C2420]"
              }`}
            >
              <Calendar size={14} /> 3-Phase DDMA Operational Strategy
            </button>
          </div>

          {/* TAB 1: Spatial Capacity & Risk Radar */}
          {activeTab === "spatial" && (
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
          )}

          {/* TAB 2: Indicative Resettlement Financial Outlay Estimate */}
          {activeTab === "financial" && financialOutlay && (
            <div className="border rounded-sm p-5 bg-white space-y-5" style={{ borderColor: C.line }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="f-serif text-base font-bold text-[#1C2420]">
                    Indicative Resettlement Financial Outlay Estimate
                  </h3>
                  <p className="text-xs text-[#565F58] mt-0.5">
                    Estimated under prototype financial models based on reference unit norms. Funding-source eligibility and applicable scheme norms require verification by the competent authority.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] text-[#22364A] font-semibold">
                  Reference Unit Norms: Illustrative Split
                </span>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F7F5F1] rounded-sm border border-[#D9D4C7]">
                  <p className="text-[11px] text-[#565F58]">Total Estimated Outlay</p>
                  <p className="f-mono text-xl font-bold text-[#B5462F] mt-0.5">
                    ₹{financialOutlay.total_crores.toFixed(2)} <span className="text-xs font-normal">Cr</span>
                  </p>
                  <p className="text-[10px] text-[#565F58] mt-0.5">All line items included</p>
                </div>
                <div className="p-3 bg-[#F7F5F1] rounded-sm border border-[#D9D4C7]">
                  <p className="text-[11px] text-[#565F58]">Rehabilitation Units</p>
                  <p className="f-mono text-xl font-bold text-[#1C2420] mt-0.5">
                    {financialOutlay.households_count} <span className="text-xs font-normal">Families</span>
                  </p>
                  <p className="text-[10px] text-[#565F58] mt-0.5">{simResult.population} total residents</p>
                </div>
                <div className="p-3 bg-[#F7F5F1] rounded-sm border border-[#D9D4C7]">
                  <p className="text-[11px] text-[#565F58]">Central NDRF Share (75%)</p>
                  <p className="f-mono text-xl font-bold text-[#3D6B5C] mt-0.5">
                    ₹{financialOutlay.ndrf_central_share_crores.toFixed(2)} <span className="text-xs font-normal">Cr</span>
                  </p>
                  <p className="text-[10px] text-[#565F58] mt-0.5">MHA Disaster Response Head</p>
                </div>
                <div className="p-3 bg-[#F7F5F1] rounded-sm border border-[#D9D4C7]">
                  <p className="text-[11px] text-[#565F58]">State SDRF Share (25%)</p>
                  <p className="f-mono text-xl font-bold text-[#22364A] mt-0.5">
                    ₹{financialOutlay.sdrf_state_share_crores.toFixed(2)} <span className="text-xs font-normal">Cr</span>
                  </p>
                  <p className="text-[10px] text-[#565F58] mt-0.5">State Disaster Mitigation Fund</p>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="overflow-x-auto border rounded-sm" style={{ borderColor: C.line }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5F1] border-b border-[#D9D4C7] text-[#565F58] font-semibold">
                      <th className="p-3">Component / Budget Head</th>
                      <th className="p-3">Governing Department / Scheme</th>
                      <th className="p-3">Unit Benchmark</th>
                      <th className="p-3 text-right">Cost (₹ Crores)</th>
                      <th className="p-3 text-right">Central / State Split</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE4] text-[#1C2420]">
                    <tr>
                      <td className="p-3 font-medium">Pucca Disaster-Resistant Housing</td>
                      <td className="p-3 text-[#565F58]">PMAY-Gramin / Rural Development</td>
                      <td className="p-3 font-mono">₹1.30 Lakh / Household</td>
                      <td className="p-3 text-right font-mono font-bold text-[#3D6B5C]">
                        ₹{financialOutlay.pmay_housing_crores.toFixed(2)} Cr
                      </td>
                      <td className="p-3 text-right text-[#565F58]">60% / 40%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Site Grading, Retaining Walls & Roads</td>
                      <td className="p-3 text-[#565F58]">Public Works Department (PWD) / SDRF</td>
                      <td className="p-3 font-mono">₹0.80 Lakh / Household</td>
                      <td className="p-3 text-right font-mono font-bold text-[#3D6B5C]">
                        ₹{financialOutlay.land_development_crores.toFixed(2)} Cr
                      </td>
                      <td className="p-3 text-right text-[#565F58]">75% / 25%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Piped Water Intake & Rural Sanitation</td>
                      <td className="p-3 text-[#565F58]">Jal Jeevan Mission (JJM) / PHED</td>
                      <td className="p-3 font-mono">₹1.20 Lakh / Household</td>
                      <td className="p-3 text-right font-mono font-bold text-[#3D6B5C]">
                        ₹{financialOutlay.infrastructure_crores.toFixed(2)} Cr
                      </td>
                      <td className="p-3 text-right text-[#565F58]">50% / 50%</td>
                    </tr>
                    <tr className="bg-[#FAF9F5] font-bold">
                      <td className="p-3" colSpan={3}>Consolidated Outlay Obligation</td>
                      <td className="p-3 text-right font-mono text-[#B5462F] text-sm">
                        ₹{financialOutlay.total_crores.toFixed(2)} Cr
                      </td>
                      <td className="p-3 text-right font-mono text-[#22364A]">75% Central : 25% State</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Fiscal Sharing Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-[#565F58] mb-1 font-medium">
                  <span>Central NDRF / Centrally Sponsored Head (75% · ₹{financialOutlay.ndrf_central_share_crores.toFixed(2)} Cr)</span>
                  <span>State Matching SDRF Share (25% · ₹{financialOutlay.sdrf_state_share_crores.toFixed(2)} Cr)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EFECE4] flex overflow-hidden">
                  <div className="h-full bg-[#3D6B5C] transition-all" style={{ width: "75%" }} />
                  <div className="h-full bg-[#22364A] transition-all" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3-Phase DDMA Operational Strategy */}
          {activeTab === "phases" && (
            <div className="border rounded-sm p-5 bg-white space-y-4" style={{ borderColor: C.line }}>
              <div>
                <h3 className="f-serif text-base font-bold text-[#1C2420]">
                  3-Phase District Relocation & Rehabilitation Operational Strategy
                </h3>
                <p className="text-xs text-[#565F58] mt-0.5">
                  Standard Operating Procedure (SOP) under Sections 30 and 34 of the Disaster Management Act, 2005.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phase 1 */}
                <div className="p-4 rounded-sm border border-[#B5462F]/30 bg-[#FFFDFD] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[#B5462F] text-white">
                      Phase 1: Zero-Hour
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#B5462F]">0 – 48 Hours</span>
                  </div>
                  <h4 className="f-serif text-sm font-bold text-[#1C2420]">
                    Pre-emptive Evacuation to Relief Shelters
                  </h4>
                  <ul className="text-xs text-[#565F58] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>Immediate evacuation of vulnerable elderly, pregnant women, and children from {simResult.habitation_name} to designated pucca cyclone/flood shelters.</li>
                    <li>SDRF quick-response watercraft and mobile emergency communication dispatched.</li>
                    <li>Police perimeter established under Section 34(b) DM Act prohibiting reentry into active Red Zone.</li>
                  </ul>
                  <div className="pt-2 border-t border-[#D9D4C7]/60 text-[11px] text-[#22364A] font-medium">
                    Nodal Lead: Tehsildar & Sub-Divisional Police Officer
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-sm border border-[#C0872B]/30 bg-[#FFFEFA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[#C0872B] text-white">
                      Phase 2: Stabilization
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#C0872B]">1 – 6 Months</span>
                  </div>
                  <h4 className="f-serif text-sm font-bold text-[#1C2420]">
                    Site Engineering & Utility Commissioning
                  </h4>
                  <ul className="text-xs text-[#565F58] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>PWD executes topographical site leveling, retaining walls, and {simResult.travel_distance_km} km access road link to {simResult.site_name}.</li>
                    <li>PHED commissions deep-bore tubewell and overhead storage to overcome site bottleneck ({simResult.bottleneck}).</li>
                    <li>Erection of transitional weather-proof CGI sheet transit shelters for displaced families.</li>
                  </ul>
                  <div className="pt-2 border-t border-[#D9D4C7]/60 text-[11px] text-[#22364A] font-medium">
                    Nodal Lead: Executive Engineer (PWD & PHED)
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-sm border border-[#3D6B5C]/30 bg-[#F8FAF9] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[#3D6B5C] text-white">
                      Phase 3: Resettlement
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#3D6B5C]">6 – 18 Months</span>
                  </div>
                  <h4 className="f-serif text-sm font-bold text-[#1C2420]">
                    Patta Distribution & Pucca Handover
                  </h4>
                  <ul className="text-xs text-[#565F58] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>Issuance of registered Land Assignment Deeds (Pattas) of 3 cents freehold title per eligible household under State Revenue Code.</li>
                    <li>Release of PMAY-G direct benefit transfer tranches for permanent disaster-resilient housing.</li>
                    <li>Transfer of ration cards, Anganwadi enrollments, and rural livelihoods to destination panchayat.</li>
                  </ul>
                  <div className="pt-2 border-t border-[#D9D4C7]/60 text-[11px] text-[#22364A] font-medium">
                    Nodal Lead: District Collector & DDMA Chairperson
                  </div>
                </div>
              </div>
            </div>
          )}
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

      {/* Candidate In-Situ Adaptation Measures Modal */}
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
