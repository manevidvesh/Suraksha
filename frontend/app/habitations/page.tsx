'use client';

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  Loader2,
  Info,
  ArrowRight,
  Plus,
  Sliders,
  LifeBuoy,
  ClipboardCheck,
  Printer,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { Habitation } from "@/types";
import { api } from "@/lib/api";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Slider } from "@/components/Common/Slider";
import { TierBadge } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { HabitationTable, HabitationModal } from "@/components/HabitationTable";
import { VulnerabilityBarChart } from "@/components/Charts/VulnerabilityBarChart";
import {
  CorridorSelector,
  filterHabitationsByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
} from "@/components/Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";
import { getHabitationReadiness } from "@/lib/ddmaReadinessData";
import {
  LifelineReadinessModal,
  OfflineActionCardModal,
} from "@/components/DDMA";

export default function HabitationsPage() {
  const {
    habitations,
    weights,
    setWeights,
    selectedHabitationId,
    setSelectedHabitationId,
    isCalculating,
    addHabitation,
  } = useRiskData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [actionCardModalOpen, setActionCardModalOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");

  const corridorHabitations = useMemo(() => {
    return filterHabitationsByCorridor(habitations, selectedCorridor);
  }, [habitations, selectedCorridor]);

  const filteredHabitations = useMemo(() => {
    return corridorHabitations
      .filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.hazard.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);
  }, [corridorHabitations, searchQuery]);

  const handleSelectCorridor = (corridorId: string) => {
    setSelectedCorridor(corridorId);
    const matching = filterHabitationsByCorridor(habitations, corridorId);
    if (matching.length > 0 && !matching.some((h) => h.id === selectedHabitationId)) {
      setSelectedHabitationId(matching[0].id);
    }
  };

  const sel = useMemo(
    () =>
      filteredHabitations.find((h) => h.id === selectedHabitationId) ||
      filteredHabitations[0] ||
      habitations.find((h) => h.id === selectedHabitationId) ||
      habitations[0],
    [filteredHabitations, habitations, selectedHabitationId]
  );

  // Fetch breakdown for selected settlement
  useEffect(() => {
    if (!sel?.id) return;
    let active = true;
    setLoadingBreakdown(true);

    api
      .getHabitationRiskBreakdown(sel.id, weights)
      .then((data) => {
        if (active) setBreakdown(data);
      })
      .catch((err) => console.warn("Could not load risk breakdown:", err))
      .finally(() => {
        if (active) setLoadingBreakdown(false);
      });

    return () => {
      active = false;
    };
  }, [sel?.id, weights]);

  const factorList = useMemo(() => {
    if (breakdown?.factors) return breakdown.factors;
    if (sel?.f) {
      return Object.entries(sel.f).map(([k, v]) => ({
        factor: k,
        value: Number(v),
      }));
    }
    return [];
  }, [breakdown, sel]);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Settlements & Risk Scoring"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Settlements & Multi-Criteria Risk Scoring"
            sub="Calibrate weights for hazard intensity, population exposure, social vulnerability, historical frequency, and accessibility deficit to recalculate priority tiers in real time."
            action={
              <div className="flex items-center gap-3">
                {isCalculating && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#565F58]">
                    <Loader2 size={13} className="animate-spin text-[#22364A]" /> Recalculating…
                  </span>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] cursor-pointer transition-colors"
                >
                  <Plus size={13} /> Add Settlement
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Weight Adjustment Panel */}
            <div
              className="border rounded-sm p-4 h-fit bg-white"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="f-sans text-sm font-semibold text-[#1C2420]">Factor Weights</p>
                <Sliders size={15} className="text-[#565F58]" />
              </div>

              <div className="space-y-3.5">
                <Slider
                  label="Hazard Intensity"
                  value={weights.hazard}
                  onChange={(v) => setWeights({ ...weights, hazard: v })}
                />
                <Slider
                  label="Population Exposure"
                  value={weights.exposure}
                  onChange={(v) => setWeights({ ...weights, exposure: v })}
                />
                <Slider
                  label="Social Vulnerability"
                  value={weights.vulnerability}
                  onChange={(v) => setWeights({ ...weights, vulnerability: v })}
                />
                <Slider
                  label="Historical Frequency"
                  value={weights.history}
                  onChange={(v) => setWeights({ ...weights, history: v })}
                />
                <Slider
                  label="Accessibility Deficit"
                  value={weights.access}
                  onChange={(v) => setWeights({ ...weights, access: v })}
                />
              </div>

              <button
                onClick={() =>
                  setWeights({
                    hazard: 30,
                    exposure: 25,
                    vulnerability: 20,
                    history: 15,
                    access: 10,
                  })
                }
                className="w-full mt-5 inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2 border rounded-sm hover:bg-[#F7F5F1] cursor-pointer transition-colors"
                style={{ borderColor: C.line, color: C.inkSoft }}
              >
                <RotateCcw size={12} /> Reset to Default Model
              </button>
            </div>

            {/* Habitations List and Detail View */}
            <div className="space-y-4">
              {/* Regional Planning Corridor Selector */}
              <div className="bg-white border p-3.5 rounded-sm" style={{ borderColor: C.line }}>
                <CorridorSelector
                  selectedCorridor={selectedCorridor}
                  onSelectCorridor={handleSelectCorridor}
                />
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565F58]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by habitation name, district, or primary hazard…"
                  className="w-full pl-9 pr-4 py-2 text-xs border rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                  style={{ borderColor: C.line }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#565F58] px-1">
                <span>
                  Showing <strong>{filteredHabitations.length}</strong> of {habitations.length} settlements
                </span>
                {selectedCorridor !== "all" && (
                  <span className="font-medium text-[#22364A]">
                    Active Corridor: {CORRIDORS.find((c) => c.id === selectedCorridor)?.shortLabel}
                  </span>
                )}
              </div>

              {/* Habitation Table Component */}
              <HabitationTable
                habitations={filteredHabitations}
                selectedId={selectedHabitationId}
                onSelect={setSelectedHabitationId}
              />

              {/* Selected Habitation Risk Factor Breakdown Card */}
              {sel && (
                <div
                  className="border rounded-sm p-5 bg-white"
                  style={{ borderColor: C.line }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="f-serif text-lg font-bold text-[#1C2420]">
                        Why {sel.name} scored {sel.score}/100
                      </h3>
                      <TierBadge tier={sel.tier} />
                      {(sel.id === "H14" || sel.name.toLowerCase().includes("kuttanad")) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                          In-Situ Priority (No Relocation Site)
                        </span>
                      )}
                    </div>
                    {loadingBreakdown ? (
                      <Loader2 size={14} className="animate-spin text-[#565F58]" />
                    ) : (
                      <Info size={15} style={{ color: C.inkSoft }} />
                    )}
                  </div>

                  <p className="text-xs text-[#565F58] mb-4">
                    {sel.region} · {sel.pop.toLocaleString()} exposed residents · {sel.events} recorded past disasters
                  </p>

                  <div className="h-52 mb-3">
                    <VulnerabilityBarChart factors={factorList} height={200} />
                  </div>

                  <p className="f-sans text-xs text-[#565F58] leading-relaxed bg-[#F7F5F1] p-3 rounded-xs border border-[#D9D4C7]">
                    {breakdown?.explanation ||
                      `${sel.name} is prioritized as a ${sel.tier} resettlement urgency based on elevated hazard exposure and accessibility deficits.`}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2.5 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setStrategyModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9EE] hover:bg-[#FFF3D6] text-[#22364A] border border-[#C0872B] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
                        title="Inspect 3-Pillar In-Situ Adaptation Interventions"
                      >
                        <LifeBuoy size={13} className="text-[#C0872B]" /> In-Situ SDMA Strategies
                      </button>

                      <button
                        onClick={() => setReadinessModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF9F5] text-[#22364A] border border-[#22364A] text-xs font-semibold rounded-sm transition-colors cursor-pointer"
                        title="Audit and replenish DDMA lifeline equipment & stock"
                      >
                        <ClipboardCheck size={13} /> 📋 DDMA Lifeline Checklist
                      </button>

                      <button
                        onClick={() => setActionCardModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B5462F] hover:bg-[#9E3B26] text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-xs"
                        title="Export printable A4 offline emergency evacuation card"
                      >
                        <Printer size={13} /> 🖨️ Offline Action Card
                      </button>
                    </div>

                    <Link
                      href="/simulation"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#22364A] hover:bg-[#3E5E82] text-white text-xs font-medium rounded-sm transition-colors cursor-pointer"
                    >
                      Simulate Relocation <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
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

      {/* SDMA In-Situ Adaptation & Non-Relocation Strategies Modal */}
      {sel && (
        <AdaptationStrategyModal
          isOpen={strategyModalOpen}
          onClose={() => setStrategyModalOpen(false)}
          strategy={getAdaptationStrategyForEntity(sel)}
          habitationName={sel.name}
        />
      )}

      {/* DDMA Lifeline Inventory Modal */}
      {sel && (
        <LifelineReadinessModal
          isOpen={readinessModalOpen}
          onClose={() => setReadinessModalOpen(false)}
          profile={getHabitationReadiness(sel.id)}
        />
      )}

      {/* DDMA Printable Offline Action Card Modal */}
      {sel && (
        <OfflineActionCardModal
          isOpen={actionCardModalOpen}
          onClose={() => setActionCardModalOpen(false)}
          profile={getHabitationReadiness(sel.id)}
        />
      )}
    </div>
  );
}
