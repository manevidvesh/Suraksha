'use client';

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  ArrowRight,
  Plus,
  LifeBuoy,
  Calculator,
  History,
  ShieldCheck,
  FileCheck,
  Sliders,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { api } from "@/lib/api";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { TierBadge } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { HabitationTable, HabitationModal } from "@/components/HabitationTable";
import {
  CorridorSelector,
  filterHabitationsByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
  McdaExplainerModal,
  McdaScenarioPanel,
  HistoricalEvidenceModal,
  AssessmentProvenanceModal,
  HumanFieldReviewModal,
  PopulationVintageBadge,
  RiskFactorBarBreakdown,
} from "@/components/Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";

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
  const [mcdaModalOpen, setMcdaModalOpen] = useState(false);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [historicalModalOpen, setHistoricalModalOpen] = useState(false);
  const [provenanceModalOpen, setProvenanceModalOpen] = useState(false);
  const [fieldReviewModalOpen, setFieldReviewModalOpen] = useState(false);
  const [fieldReviewStatus, setFieldReviewStatus] = useState<string | null>(null);
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

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="Settlement Risk Scoring"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-6 max-w-6xl space-y-5">
          <SectionHead
            title="Settlements & Multi-Criteria Risk Scoring"
            sub="Deterministic MCDA scoring across hazard, exposure, vulnerability, history, and accessibility deficit."
            action={
              <div className="flex items-center gap-2">
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

          <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 items-start">
            {/* MCDA Weight Sensitivity & Planning Scenario Panel */}
            <div className="sticky top-6">
              <McdaScenarioPanel
                weights={weights}
                onWeightsChange={setWeights}
                isCalculating={isCalculating}
                currentScore={sel?.score}
                onReset={() =>
                  setWeights({
                    hazard: 30,
                    exposure: 25,
                    vulnerability: 20,
                    history: 15,
                    access: 10,
                  })
                }
              />
            </div>

            {/* Habitations List and Detail View */}
            <div className="space-y-4">
              {/* Regional Corridor Selector */}
              <div className="bg-white border p-3 rounded-sm" style={{ borderColor: C.line }}>
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
                  placeholder="Filter settlements by name, district, or primary hazard…"
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
                    Corridor: {CORRIDORS.find((c) => c.id === selectedCorridor)?.shortLabel}
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
                  className="border rounded-sm p-4 sm:p-5 bg-white space-y-4 shadow-2xs"
                  style={{ borderColor: C.line }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="f-serif text-base sm:text-lg font-bold text-[#1C2420]">
                        {sel.name}
                      </h3>
                      <TierBadge tier={sel.tier} />
                      <span className="font-mono text-xs font-bold text-[#1C2420] px-2 py-0.5 rounded-xs bg-[#FAF9F5] border border-[#D9D4C7]">
                        Composite Score: {sel.score}/100
                      </span>
                      <button
                        onClick={() => setMcdaModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#22364A]/10 hover:bg-[#22364A]/20 text-[#22364A] text-xs font-medium border border-[#22364A]/20 transition-colors cursor-pointer"
                        title="View exact mathematical formulation"
                      >
                        <Calculator size={11} /> Formula
                      </button>
                      {(sel.id === "H14" || sel.name.toLowerCase().includes("kuttanad")) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                          In-Situ Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#565F58]">
                        {breakdown?.assessment_id || `SRK-2026-${sel.id}-v1`}
                      </span>
                      {loadingBreakdown && (
                        <Loader2 size={13} className="animate-spin text-[#565F58]" />
                      )}
                    </div>
                  </div>

                  {/* Demographic & Evidence Metadata Strip */}
                  <div className="flex items-center gap-3 flex-wrap text-xs text-[#565F58]">
                    <span>
                      <strong className="text-[#1C2420]">Region:</strong> {sel.region}
                    </span>
                    <span>·</span>
                    <PopulationVintageBadge count={sel.pop} />
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setHistoricalModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[#22364A] hover:underline cursor-pointer font-medium"
                    >
                      <History size={11} className="text-[#565F58]" />
                      <span>{sel.events} recorded past events (2018–2024)</span>
                    </button>
                    <span>·</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FFF9EE] text-[#8C5D17] border border-[#C0872B]/30 font-semibold">
                      {breakdown?.evidence_status || "LIMITED EVIDENCE"}
                    </span>
                    {fieldReviewStatus && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#E8F0EC] text-[#2A6B52] border border-[#2A6B52]/30 font-semibold">
                        Officer Review: {fieldReviewStatus}
                      </span>
                    )}
                  </div>

                  {/* 5-Factor MCDA Bar Breakdown */}
                  <RiskFactorBarBreakdown
                    factors={sel.f}
                    weights={weights}
                    compositeScore={sel.score}
                    showFormula
                  />

                  <p className="f-sans text-xs text-[#565F58] leading-relaxed bg-[#FAF9F5] p-3 rounded-xs border border-[#D9D4C7]">
                    {breakdown?.explanation ||
                      `${sel.name} is prioritized as a ${sel.tier} resettlement urgency based on elevated hazard exposure and accessibility deficits.`}
                  </p>

                  {/* Operational Actions */}
                  <div className="pt-3 border-t flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: C.line }}>
                    {/* Secondary Evidence Modals Group */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setStrategyModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFF9EE] hover:bg-[#FFF3D6] text-[#22364A] border border-[#C0872B] text-xs font-medium rounded-xs transition-colors cursor-pointer"
                        title="Inspect in-situ adaptation options"
                      >
                        <LifeBuoy size={12} className="text-[#C0872B]" /> In-Situ Strategies
                      </button>

                      <button
                        onClick={() => setHistoricalModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#FAF9F5] text-[#22364A] border border-[#D9D4C7] text-xs font-medium rounded-xs transition-colors cursor-pointer"
                        title="Inspect disaster history log"
                      >
                        <History size={12} /> Disaster History
                      </button>

                      <button
                        onClick={() => setProvenanceModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#FAF9F5] text-[#22364A] border border-[#D9D4C7] text-xs font-medium rounded-xs transition-colors cursor-pointer"
                        title="Trace data lineage"
                      >
                        <FileCheck size={12} /> Provenance
                      </button>

                      <button
                        onClick={() => setFieldReviewModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#22364A]/10 hover:bg-[#22364A]/20 text-[#22364A] border border-[#22364A]/20 text-xs font-medium rounded-xs transition-colors cursor-pointer"
                        title="Record DDMA field verification note"
                      >
                        <ShieldCheck size={12} /> Officer Review
                      </button>
                    </div>

                    {/* Primary Workflow Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/relocation?habitation=${sel.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#3D6B5C] hover:bg-[#32584B] text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer shadow-xs"
                      >
                        Evaluate Candidate Sites <ArrowRight size={13} />
                      </Link>

                      <Link
                        href={`/simulation?hab=${sel.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#FAF9F5] text-[#22364A] border border-[#22364A]/30 text-xs font-medium rounded-sm transition-colors cursor-pointer"
                      >
                        <Sliders size={12} /> Stress Test
                      </Link>
                    </div>
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

      {/* MCDA Formulation & Score Calculation Modal */}
      {sel && (
        <McdaExplainerModal
          isOpen={mcdaModalOpen}
          onClose={() => setMcdaModalOpen(false)}
          habitation={sel}
          weights={weights}
        />
      )}

      {/* Historical Evidence Modal (2018-2024 Window) */}
      {sel && (
        <HistoricalEvidenceModal
          isOpen={historicalModalOpen}
          onClose={() => setHistoricalModalOpen(false)}
          habitation={sel}
        />
      )}

      {/* Assessment Provenance Lineage Modal */}
      {sel && (
        <AssessmentProvenanceModal
          isOpen={provenanceModalOpen}
          onClose={() => setProvenanceModalOpen(false)}
          habitation={sel}
          breakdown={breakdown}
          weights={weights}
        />
      )}

      {/* DDMA Officer Field Review & Challenge Modal */}
      {sel && (
        <HumanFieldReviewModal
          isOpen={fieldReviewModalOpen}
          onClose={() => setFieldReviewModalOpen(false)}
          habitation={sel}
          onReviewSaved={(rev) => setFieldReviewStatus(rev.status)}
        />
      )}

      {/* Candidate In-Situ Adaptation Measures Modal */}
      {sel && (
        <AdaptationStrategyModal
          isOpen={strategyModalOpen}
          onClose={() => setStrategyModalOpen(false)}
          strategy={getAdaptationStrategyForEntity(sel)}
          habitationName={sel.name}
        />
      )}
    </div>
  );
}
