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
  LifeBuoy,
  Activity,
  Calendar,
  IndianRupee,
  ShieldAlert,
} from "lucide-react";
import { Habitation, CandidateSite, SimulationResult, ExecutiveBrief, FinancialOutlayBreakdown } from "@/types";
import { api } from "@/lib/api";
import { C } from "../Common/constants";
import { EmptyState } from "../Common/EmptyState";
import { RiskRadarChart } from "../Charts/RiskRadarChart";
import { ExecutiveBriefModal } from "../AIExplanation/ExecutiveBriefModal";
import { CorridorSelector, filterHabitationsByCorridor, AdaptationStrategyModal, TierBadge } from "../Common";
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
  const [activeTab, setActiveTab] = useState<"blockers" | "finance" | "phases">("blockers");
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
    <div className="space-y-4">
      {/* Regional Planning Corridor Selector */}
      <div className="bg-white border p-3 rounded-sm" style={{ borderColor: C.line }}>
        <CorridorSelector
          selectedCorridor={selectedCorridor}
          onSelectCorridor={handleSelectCorridor}
        />
      </div>

      {/* Parameter Selection Grid */}
      <div
        className="border rounded-sm p-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end bg-white shadow-2xs"
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
            className="w-full border rounded-xs px-3 py-2 f-sans text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A] cursor-pointer"
            style={{ borderColor: C.line }}
          >
            <option value="">Select a habitation…</option>
            {corridorHabitations.map((h: Habitation) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.region}) · Pop: {h.pop.toLocaleString()} · {h.hazard} [{h.tier}]
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
            className="w-full border rounded-xs px-3 py-2 f-sans text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A] cursor-pointer"
            style={{ borderColor: C.line }}
          >
            <option value="">Select a site…</option>
            {localSites.length > 0 && (
              <optgroup label="Regional Corridor Sites (< 200 km)">
                {localSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.region}) — {s.dist} km transit · Cap: {s.eff.value}
                  </option>
                ))}
              </optgroup>
            )}
            {distantSites.length > 0 && (
              <optgroup label="⚠️ Other Corridors (Demo Sandbox Only)">
                {distantSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.region}) — {s.dist} km (Inter-State)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <button
          onClick={runSimulation}
          disabled={status === "loading"}
          className="f-sans text-xs font-semibold px-5 py-2.5 rounded-sm text-white inline-flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors shadow-2xs"
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

      {/* Special Zone Alert for Zero-Relocation Habitats (e.g. Kuttanad) */}
      {selectedHab &&
        (selectedHab.id === "H14" ||
          selectedHab.name.toLowerCase().includes("kuttanad")) && (
          <div className="border border-[#C0872B] bg-[#FFFDF7] p-3 rounded-sm text-xs text-[#1C2420] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <LifeBuoy size={16} className="text-[#C0872B] shrink-0" />
              <span>
                <strong>Special Zone Notice:</strong> {selectedHab.name} is India&apos;s sub-sea-level agrarian polder. In-situ adaptation (polder ring dykes, flood shelters) is evaluated rather than forced upland relocation.
              </span>
            </div>
            <button
              onClick={() => setStrategyModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-xs text-[#22364A] bg-[#FFF3D6] border border-[#C0872B] hover:bg-[#FFE8B3] transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <LifeBuoy size={12} className="text-[#C0872B]" /> In-Situ Strategies
            </button>
          </div>
        )}

      {/* Cross-State Geographic Infeasibility Notice */}
      {selectedSite && isCrossState && (
        <div className="border border-[#C0872B] bg-[#FFF9EE] p-3 rounded-sm text-xs text-[#1C2420] flex items-center gap-2">
          <AlertTriangle size={16} className="text-[#C0872B] shrink-0" />
          <span>
            <strong>Geographical Infeasibility Notice:</strong> {selectedHab?.name} is ~{transitDist.toLocaleString()} km from {selectedSite?.name}. In actual disaster administration, planned relocation is restricted to local panchayats (&lt; 30–50 km).
          </span>
        </div>
      )}

      {status === "error" && (
        <div
          className="border rounded-sm p-4 flex items-start gap-3"
          style={{ borderColor: C.immediate, backgroundColor: `${C.immediate}0D` }}
        >
          <FileWarning size={18} style={{ color: C.immediate }} className="mt-0.5 shrink-0" />
          <div>
            <p className="f-sans text-sm font-semibold" style={{ color: C.immediate }}>
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
        <div className="space-y-4">
          {/* Top Result Banner */}
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
                  Pairing: {simResult.habitation_name} → {simResult.site_name}
                </p>
                <p className="text-xs" style={{ color: C.inkSoft }}>
                  {simResult.summary_message}
                </p>
              </div>
            </div>

            <button
              onClick={generateBrief}
              disabled={briefLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#22364A] text-white text-xs font-semibold rounded-xs hover:bg-[#3E5E82] cursor-pointer transition-colors shadow-xs"
              title="Synthesize structured relocation findings into an AI explanation brief for DDMA review"
            >
              {briefLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <FileText size={13} />
              )}
              Generate AI Decision Brief (DDMA Review)
            </button>
          </div>

          {/* Primary Simulation Metrics & Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            {/* Left: Risk Radar Chart */}
            <div
              className="border rounded-sm p-4 bg-white"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="f-sans text-xs font-bold uppercase tracking-wider text-[#1C2420]">
                  Before vs. After Hazard Exposure Profile
                </p>
                <span className="text-[10px] font-mono text-[#565F58] bg-[#FAF9F5] px-2 py-0.5 rounded-xs border border-[#D9D4C7]">
                  Multidimensional Radar
                </span>
              </div>
              <RiskRadarChart data={simResult.radar_data} height={260} />
            </div>

            {/* Right: Key Displacement & Capacity Metrics */}
            <div
              className="border rounded-sm p-4 space-y-3 bg-white flex flex-col justify-between"
              style={{ borderColor: C.line }}
            >
              <div>
                <p className="f-sans text-xs text-[#565F58]">
                  Hazard Exposure Reduction
                </p>
                <p className="f-mono text-3xl font-bold" style={{ color: C.pine }}>
                  −{simResult.hazard_reduction_pct}%
                </p>
                <p className="text-[11px] text-[#565F58] mt-0.5">
                  Post-relocation multi-hazard exposure drop
                </p>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: C.line }}>
                <p className="f-sans text-xs text-[#565F58]">
                  Site Capacity Absorption
                </p>
                <p className="f-mono text-xl font-bold text-[#1C2420]">
                  {simResult.population}{" "}
                  <span className="text-xs font-normal text-[#565F58]">
                    / {simResult.effective_capacity} cap
                  </span>
                </p>
                <div className="h-2 rounded-full mt-1.5" style={{ backgroundColor: C.paperDim }}>
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
                <p className="text-[10px] text-[#565F58] mt-1">
                  Governed by Liebig Bottleneck: <strong className="text-[#B5462F]">{simResult.bottleneck}</strong>
                </p>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: C.line }}>
                <div className="flex justify-between items-baseline">
                  <span className="f-sans text-xs text-[#565F58]">Transit Distance:</span>
                  <span className="f-mono font-bold text-sm text-[#1C2420]">{simResult.travel_distance_km} km</span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="f-sans text-xs text-[#565F58]">Decision Status:</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs ${
                    simResult.capacity_exceeded ? "bg-[#FFF9EE] text-[#C0872B]" : "bg-[#E8F0EC] text-[#2A6B52]"
                  }`}>
                    {simResult.capacity_exceeded ? "Capacity Deficit" : "Viable Match"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Perspectives Tabs */}
          <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
            <div className="flex border-b bg-[#FAF9F5] px-4 gap-4 text-xs font-medium" style={{ borderColor: C.line }}>
              <button
                onClick={() => setActiveTab("blockers")}
                className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "blockers"
                    ? "border-[#22364A] text-[#1C2420] font-bold"
                    : "border-transparent text-[#565F58] hover:text-[#1C2420]"
                }`}
              >
                <Activity size={13} /> Viability Drivers &amp; Constraints
              </button>
              <button
                onClick={() => setActiveTab("finance")}
                className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "finance"
                    ? "border-[#22364A] text-[#1C2420] font-bold"
                    : "border-transparent text-[#565F58] hover:text-[#1C2420]"
                }`}
              >
                <IndianRupee size={13} /> Financial Outlay (PMAY-G / NDRF)
              </button>
              <button
                onClick={() => setActiveTab("phases")}
                className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "phases"
                    ? "border-[#22364A] text-[#1C2420] font-bold"
                    : "border-transparent text-[#565F58] hover:text-[#1C2420]"
                }`}
              >
                <Calendar size={13} /> 3-Phase District Contingency Strategy
              </button>
            </div>

            <div className="p-4">
              {/* TAB 1: Viability Drivers & Constraints */}
              {activeTab === "blockers" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xs bg-[#F6FAF8] border border-[#2A6B52]/20 space-y-1.5">
                    <p className="font-bold text-[#2A6B52] uppercase text-[10px] tracking-wider">
                      Viability Drivers (Why This Site)
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                      {(simResult.why_this_site || [
                        `Reduces hazard exposure by ${simResult.hazard_reduction_pct}%`,
                        `Effective capacity supports ${simResult.effective_capacity} persons`,
                      ]).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xs bg-[#FFFDF9] border border-[#C0872B]/30 space-y-1.5">
                    <p className="font-bold text-[#C0872B] uppercase text-[10px] tracking-wider">
                      Constraints &amp; Bottlenecks
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                      {(simResult.why_not_this_site || [
                        `Primary capacity bottleneck: ${simResult.bottleneck}`,
                        `Transit distance: ${simResult.travel_distance_km} km`,
                      ]).map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xs bg-[#FFF8F6] border border-[#B5462F]/20 space-y-1.5">
                    <p className="font-bold text-[#B5462F] uppercase text-[10px] tracking-wider">
                      Primary Decision Blockers
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#1C2420] text-[11px]">
                      {(simResult.primary_blockers && simResult.primary_blockers.length > 0 ? simResult.primary_blockers : [
                        simResult.capacity_exceeded
                          ? `Capacity deficit of ${simResult.population - simResult.effective_capacity} residents`
                          : "No structural bottlenecks exceeding threshold",
                        "Cadastral revenue clearance pending field survey",
                      ]).map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: Financial Outlay */}
              {activeTab === "finance" && financialOutlay && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 bg-[#FAF9F5] border rounded-xs" style={{ borderColor: C.line }}>
                      <p className="text-[10px] text-[#565F58]">Estimated Households</p>
                      <p className="f-mono text-lg font-bold text-[#1C2420]">{financialOutlay.households_count}</p>
                    </div>
                    <div className="p-3 bg-[#FAF9F5] border rounded-xs" style={{ borderColor: C.line }}>
                      <p className="text-[10px] text-[#565F58]">Total Estimated Outlay</p>
                      <p className="f-mono text-lg font-bold text-[#B5462F]">₹{financialOutlay.total_crores} Cr</p>
                    </div>
                    <div className="p-3 bg-[#FAF9F5] border rounded-xs" style={{ borderColor: C.line }}>
                      <p className="text-[10px] text-[#565F58]">NDRF Central Share (75%)</p>
                      <p className="f-mono text-lg font-bold text-[#2A6B52]">₹{financialOutlay.ndrf_central_share_crores} Cr</p>
                    </div>
                    <div className="p-3 bg-[#FAF9F5] border rounded-xs" style={{ borderColor: C.line }}>
                      <p className="text-[10px] text-[#565F58]">SDRF State Share (25%)</p>
                      <p className="f-mono text-lg font-bold text-[#22364A]">₹{financialOutlay.sdrf_state_share_crores} Cr</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#565F58]">
                    Breakdown: PMAY-G Housing: ₹{financialOutlay.pmay_housing_crores} Cr · Land Acquisition &amp; Leveling: ₹{financialOutlay.land_development_crores} Cr · Basic Infrastructure: ₹{financialOutlay.infrastructure_crores} Cr.
                  </p>
                </div>
              )}

              {/* TAB 3: 3-Phase Operational Strategy */}
              {activeTab === "phases" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xs border border-[#B5462F]/30 bg-[#FFFDFD] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-[#B5462F] text-white">
                        Phase 1: Zero-Hour
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#B5462F]">0 – 48 Hours</span>
                    </div>
                    <h5 className="font-bold text-xs text-[#1C2420]">Pre-emptive Evacuation</h5>
                    <p className="text-[11px] text-[#565F58] leading-relaxed">
                      Evacuate vulnerable populations from {simResult.habitation_name} to designated cyclone/flood shelters with SDRF emergency communication.
                    </p>
                  </div>

                  <div className="p-3 rounded-xs border border-[#C0872B]/30 bg-[#FFFEFA] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-[#C0872B] text-white">
                        Phase 2: Stabilization
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#C0872B]">1 – 6 Months</span>
                    </div>
                    <h5 className="font-bold text-xs text-[#1C2420]">Site Engineering &amp; Utilities</h5>
                    <p className="text-[11px] text-[#565F58] leading-relaxed">
                      Commission tubewells and utilities at {simResult.site_name} to resolve site bottleneck ({simResult.bottleneck}) and erect transitional weather-proof shelters.
                    </p>
                  </div>

                  <div className="p-3 rounded-xs border border-[#3D6B5C]/30 bg-[#F8FAF9] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-[#3D6B5C] text-white">
                        Phase 3: Resettlement
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#3D6B5C]">6 – 18 Months</span>
                    </div>
                    <h5 className="font-bold text-xs text-[#1C2420]">Permanent Housing &amp; Patta</h5>
                    <p className="text-[11px] text-[#565F58] leading-relaxed">
                      Issue registered land assignment deeds (Pattas), disburse PMAY-G direct benefit transfers, and transfer civic registrations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "idle" && (
        <EmptyState
          icon={Sliders}
          title="No simulation run yet"
          body="Select a source habitation and candidate site above, then click 'Run Simulation' to model transit feasibility, capacity load, and before-vs-after exposure reduction."
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
