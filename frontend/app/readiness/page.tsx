'use client';

import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Printer,
  ClipboardCheck,
  LifeBuoy,
  AlertTriangle,
  Building2,
  Filter,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import {
  CorridorSelector,
  filterHabitationsByCorridor,
  CORRIDORS,
} from "@/components/Common";
import {
  getHabitationReadiness,
  HabitationReadinessProfile,
} from "@/lib/ddmaReadinessData";
import {
  LifelineReadinessModal,
  OfflineActionCardModal,
} from "@/components/DDMA";

export default function DdmaReadinessPage() {
  const { habitations } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");

  // Active Modals
  const [selectedProfileForChecklist, setSelectedProfileForChecklist] =
    useState<HabitationReadinessProfile | null>(null);
  const [selectedProfileForPrint, setSelectedProfileForPrint] =
    useState<HabitationReadinessProfile | null>(null);

  // Filter habitations by corridor
  const corridorHabitations = useMemo(() => {
    return filterHabitationsByCorridor(habitations, selectedCorridor);
  }, [habitations, selectedCorridor]);

  // Map to readiness profiles and filter by search
  const readinessList = useMemo(() => {
    return corridorHabitations
      .map((h) => {
        const profile = getHabitationReadiness(h.id);
        return {
          ...profile,
          habitationName: h.name,
          district: h.region,
          population: h.pop,
          primaryHazard: h.hazard,
          hazardTier: h.tier,
          latitude: h.latitude,
          longitude: h.longitude,
        };
      })
      .filter(
        (p) =>
          p.habitationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.primaryHazard.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.readinessScore - b.readinessScore); // show lowest readiness first so DDMA can act on deficits
  }, [corridorHabitations, searchQuery]);

  // Calculate high-level KPIs
  const totalTracked = readinessList.length;
  const fullyReady = readinessList.filter((p) => p.readinessScore >= 80).length;
  const moderateDeficit = readinessList.filter(
    (p) => p.readinessScore >= 60 && p.readinessScore < 80
  ).length;
  const criticalDeficit = readinessList.filter((p) => p.readinessScore < 60).length;

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="DDMA Lifeline Readiness & Action Cards"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="DDMA Lifeline Readiness & Offline Action Cards"
            sub="District Disaster Management Authority operations suite: audit emergency relief equipment, track lifeline supply deficits across high-risk settlements, and export 1-click printable A4 disaster action cards for field wardens."
          />

          {/* Internal Reference Scope Banner */}
          <div className="mb-6 p-4 rounded-sm bg-[#FFFDF7] border border-[#C0872B]/50 flex items-start gap-3">
            <Info size={18} className="text-[#C0872B] shrink-0 mt-0.5" />
            <div className="text-xs text-[#565F58] leading-relaxed">
              <strong className="text-[#1C2420]">Administrative Reference Module:</strong> This internal prototype view demonstrates how settlement-level lifeline parameters and infrastructure deficits inform candidate-site screening. Operational emergency dispatch, supply replenishment, and shelter administration are outside SURAKSHA&apos;s core decision-support boundary.
            </div>
          </div>

          {/* DDMA KPI Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white border rounded-sm" style={{ borderColor: C.line }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#565F58] block">
                Monitored Settlements
              </span>
              <p className="f-serif text-2xl font-bold text-[#1C2420] mt-1">
                {totalTracked}
              </p>
              <p className="text-[11px] text-[#565F58] mt-0.5">
                Under active DDMA jurisdiction
              </p>
            </div>

            <div className="p-4 bg-white border rounded-sm" style={{ borderColor: C.line }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A6B52] block">
                Operational Ready (≥80%)
              </span>
              <p className="f-serif text-2xl font-bold text-[#2A6B52] mt-1">
                {fullyReady}
              </p>
              <p className="text-[11px] text-[#565F58] mt-0.5">
                Full lifeline relief pre-positioned
              </p>
            </div>

            <div className="p-4 bg-white border rounded-sm" style={{ borderColor: C.line }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C0872B] block">
                Moderate Deficit (60-79%)
              </span>
              <p className="f-serif text-2xl font-bold text-[#C0872B] mt-1">
                {moderateDeficit}
              </p>
              <p className="text-[11px] text-[#565F58] mt-0.5">
                Minor stock replenishment needed
              </p>
            </div>

            <div className="p-4 bg-white border rounded-sm" style={{ borderColor: C.line }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5462F] block">
                Critical Deficit (&lt;60%)
              </span>
              <p className="f-serif text-2xl font-bold text-[#B5462F] mt-1">
                {criticalDeficit}
              </p>
              <p className="text-[11px] text-[#B5462F] mt-0.5 font-medium">
                Immediate SDMF dispatch required
              </p>
            </div>
          </div>

          {/* Regional Corridor Selector */}
          <div className="bg-white border p-3.5 rounded-sm mb-4" style={{ borderColor: C.line }}>
            <CorridorSelector
              selectedCorridor={selectedCorridor}
              onSelectCorridor={setSelectedCorridor}
            />
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565F58]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by habitation name, district, or primary hazard…"
              className="w-full pl-9 pr-4 py-2 text-xs border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
            />
          </div>

          {/* Settlements Readiness Table */}
          <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
            <div className="p-3.5 border-b bg-[#FAF9F5] flex items-center justify-between" style={{ borderColor: C.line }}>
              <div>
                <p className="f-sans text-xs font-bold text-[#1C2420]">
                  Settlement Readiness Register (Sorted by Lifeline Vulnerability)
                </p>
                <p className="text-[11px] text-[#565F58]">
                  Showing {readinessList.length} habitations in active scope
                </p>
              </div>

              <span className="text-[11px] text-[#565F58] flex items-center gap-1">
                <Filter size={12} /> Lowest Readiness First
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5F1] border-b text-[10px] uppercase font-semibold text-[#565F58]" style={{ borderColor: C.line }}>
                    <th className="p-3">Habitation & District</th>
                    <th className="p-3">Primary Hazard & Tier</th>
                    <th className="p-3">Readiness Index</th>
                    <th className="p-3">Designated Safe Haven</th>
                    <th className="p-3 text-right">DDMA Action Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: C.line }}>
                  {readinessList.map((item) => {
                    const score = item.readinessScore;
                    const deficits = item.lifelineItems.filter((i) => i.status !== "ready");

                    return (
                      <tr key={item.habitationId} className="hover:bg-[#FAF9F5] transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-[#1C2420] text-sm">{item.habitationName}</p>
                          <p className="text-[11px] text-[#565F58]">
                            {item.district} · {item.population.toLocaleString()} residents
                          </p>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold text-[#1C2420]">{item.primaryHazard}</p>
                          <span
                            className="inline-block text-[9px] px-1.5 py-0.5 rounded-xs font-semibold mt-0.5"
                            style={{
                              backgroundColor:
                                item.hazardTier === "Immediate"
                                  ? "#FDF2F0"
                                  : item.hazardTier === "Short-term"
                                  ? "#FFF9EE"
                                  : "#EEF5F0",
                              color:
                                item.hazardTier === "Immediate"
                                  ? "#B5462F"
                                  : item.hazardTier === "Short-term"
                                  ? "#C0872B"
                                  : "#2A6B52",
                            }}
                          >
                            {item.hazardTier}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-bold text-xs"
                              style={{
                                color:
                                  score >= 80
                                    ? "#2A6B52"
                                    : score >= 60
                                    ? "#C0872B"
                                    : "#B5462F",
                              }}
                            >
                              {score}%
                            </span>
                            <div className="w-20 bg-[#EFECE4] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${score}%`,
                                  backgroundColor:
                                    score >= 80
                                    ? "#2A6B52"
                                    : score >= 60
                                    ? "#C0872B"
                                    : "#B5462F",
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-1">
                            {deficits.length === 0 ? (
                              <span className="text-[10px] text-[#2A6B52] font-medium flex items-center gap-1">
                                <CheckCircle2 size={10} /> Fully Stocked
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#B5462F] font-medium flex items-center gap-1">
                                <AlertTriangle size={10} /> {deficits.length} deficits flagged
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-start gap-1.5">
                            <Building2 size={13} className="text-[#565F58] mt-0.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-[#1C2420] text-xs">
                                {item.safeHaven.name}
                              </p>
                              <p className="text-[10px] text-[#565F58]">
                                {item.safeHaven.distanceKm} km · Cap: {item.safeHaven.capacityPersons}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProfileForChecklist(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xs border border-[#22364A] text-[#22364A] hover:bg-[#22364A] hover:text-white transition-colors cursor-pointer"
                              title="Audit and replenish emergency relief equipment"
                            >
                              <ClipboardCheck size={13} /> 📋 Lifeline Checklist
                            </button>

                            <button
                              onClick={() => setSelectedProfileForPrint(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xs bg-[#B5462F] hover:bg-[#9E3B26] text-white transition-colors cursor-pointer shadow-xs"
                              title="Export printable A4 offline emergency evacuation card"
                            >
                              <Printer size={13} /> 🖨️ Print Action Card
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Lifeline Inventory Checklist Modal */}
      <LifelineReadinessModal
        isOpen={Boolean(selectedProfileForChecklist)}
        onClose={() => setSelectedProfileForChecklist(null)}
        profile={selectedProfileForChecklist}
      />

      {/* Printable Offline Action Card Modal */}
      <OfflineActionCardModal
        isOpen={Boolean(selectedProfileForPrint)}
        onClose={() => setSelectedProfileForPrint(null)}
        profile={selectedProfileForPrint}
      />
    </div>
  );
}
