'use client';

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sliders,
  Compass,
  Info,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  ChevronDown,
  XCircle,
  ArrowRight,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  LifeBuoy,
  Building,
  HelpCircle,
  Layers,
  Activity,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { api } from "@/lib/api";
import { C, CAP_LABELS } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { TierBadge } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { SiteList } from "@/components/SiteRanking";
import { CapacityBreakdown } from "@/components/Capacity/CapacityBreakdown";
import { CorridorSelector, filterHabitationsByCorridor, filterSitesByCorridor } from "@/components/Common";
import {
  HabitationMatchingResult,
  HabitationSiteCandidateMatch,
  SiteCentricMatchingResult,
  CandidateSite,
  Habitation,
} from "@/types";

const DECISION_OUTCOMES = [
  {
    id: "RELOCATION_OPTIONS_AVAILABLE",
    number: "1",
    title: "Relocation Options Available",
    summary: "Candidate relocation sites passed baseline screening and have relevant capacity information.",
    detail: "One or more candidate sites passed the 12-dimensional screening matrix and possess sufficient effective carrying capacity.",
    badgeClass: "bg-[#2A6B52] text-white",
    borderClass: "border-[#2A6B52]",
    activeBgClass: "bg-[#E8F0EC]/60",
    icon: CheckCircle2,
    iconColor: "text-[#2A6B52]",
  },
  {
    id: "NO_ELIGIBLE_CANDIDATE_SITE",
    number: "2",
    title: "No Eligible Candidate Site",
    summary: "No candidate site passed the required screening conditions.",
    detail: "All candidate sites within the operational search radius violated environmental, slope, flood, or reserve forest exclusion constraints.",
    badgeClass: "bg-[#B5462F] text-white",
    borderClass: "border-[#B5462F]",
    activeBgClass: "bg-[#FFF1F0]/60",
    icon: XCircle,
    iconColor: "text-[#B5462F]",
  },
  {
    id: "INSUFFICIENT_CAPACITY",
    number: "3",
    title: "Insufficient Relocation Capacity",
    summary: "Eligible candidate sites exist, but available capacity is insufficient for the assessed demand.",
    detail: "Candidate sites passed technical screening, but their Liebig bottleneck capacity cannot absorb the full habitation population demand.",
    badgeClass: "bg-[#C0872B] text-white",
    borderClass: "border-[#C0872B]",
    activeBgClass: "bg-[#FFF9EE]/60",
    icon: AlertTriangle,
    iconColor: "text-[#C0872B]",
  },
  {
    id: "INSUFFICIENT_EVIDENCE",
    number: "4",
    title: "Insufficient / Unknown Evidence",
    summary: "Critical information required for screening or matching is unavailable or unresolved.",
    detail: "Geotechnical borehole data, revenue title encumbrance records, or localized flood hydrology layers are missing or pending verification.",
    badgeClass: "bg-[#565F58] text-white",
    borderClass: "border-[#565F58]",
    activeBgClass: "bg-[#F7F5F1]",
    icon: HelpCircle,
    iconColor: "text-[#565F58]",
  },
  {
    id: "FIELD_REVIEW_REQUIRED",
    number: "5",
    title: "Field / Technical Review Required",
    summary: "Human validation or field officer override recorded.",
    detail: "Field officer or competent authority recorded ground observations or suitability overrides that require institutional reconciliation.",
    badgeClass: "bg-[#22364A] text-white",
    borderClass: "border-[#22364A]",
    activeBgClass: "bg-[#F4F7FA]",
    icon: UserCheck,
    iconColor: "text-[#22364A]",
  },
];

function RelocationContent() {
  const { habitations, sites, minCap, setMinCap, loadingSites, selectedHabitationId, setSelectedHabitationId } = useRiskData();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState<"matching" | "site_centric" | "screening_inventory">("matching");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");

  // Habitation-centric matching state
  const [matchingResult, setMatchingResult] = useState<HabitationMatchingResult | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(null);
  const [showExcluded, setShowExcluded] = useState(true);

  // Competent authority field review overrides (stored locally in session)
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, "suitable" | "unsuitable">>({});

  // Site-centric view state
  const [selectedSiteId, setSelectedSiteId] = useState<string>("S1");
  const [siteCentricResult, setSiteCentricResult] = useState<SiteCentricMatchingResult | null>(null);
  const [siteCentricLoading, setSiteCentricLoading] = useState(false);

  // Initialize overrides from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("suraksha_site_field_overrides");
      if (stored) {
        setFieldOverrides(JSON.parse(stored));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const handleToggleOverride = (siteId: string) => {
    const current = fieldOverrides[siteId];
    const updated = { ...fieldOverrides };
    if (current === "unsuitable") {
      delete updated[siteId];
    } else {
      updated[siteId] = "unsuitable";
    }
    setFieldOverrides(updated);
    try {
      localStorage.setItem("suraksha_site_field_overrides", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleClearAllOverrides = () => {
    setFieldOverrides({});
    try {
      localStorage.removeItem("suraksha_site_field_overrides");
    } catch {
      // Ignore
    }
  };

  // Filter habitations by corridor
  const corridorHabitations = useMemo(() => {
    return filterHabitationsByCorridor(habitations, selectedCorridor);
  }, [habitations, selectedCorridor]);

  const displayedSites = useMemo(() => {
    return filterSitesByCorridor(sites, selectedCorridor);
  }, [sites, selectedCorridor]);

  const activeHabitation = useMemo(() => {
    return (
      corridorHabitations.find((h) => h.id === selectedHabitationId) ||
      corridorHabitations[0] ||
      habitations.find((h) => h.id === selectedHabitationId) ||
      habitations[0]
    );
  }, [corridorHabitations, habitations, selectedHabitationId]);

  const activeDecisionState = useMemo(() => {
    if (!matchingResult) return "NO_ELIGIBLE_CANDIDATE_SITE";
    if (Object.keys(fieldOverrides).length > 0) return "FIELD_REVIEW_REQUIRED";
    if (
      matchingResult.status === "INSUFFICIENT_EVIDENCE" ||
      (matchingResult.unknown_evidence && matchingResult.unknown_evidence.length > 0 && matchingResult.eligible_sites.length === 0)
    ) {
      return "INSUFFICIENT_EVIDENCE";
    }
    if (matchingResult.status === "INSUFFICIENT_CAPACITY") {
      return "INSUFFICIENT_CAPACITY";
    }
    if (
      matchingResult.status === "ELIGIBLE_OPTIONS_AVAILABLE" &&
      matchingResult.eligible_sites &&
      matchingResult.eligible_sites.length > 0
    ) {
      return "RELOCATION_OPTIONS_AVAILABLE";
    }
    return "NO_ELIGIBLE_CANDIDATE_SITE";
  }, [matchingResult, fieldOverrides]);

  // Fetch contextual habitation candidate matching
  useEffect(() => {
    if (!activeHabitation) return;
    let isMounted = true;
    setMatchingLoading(true);

    api
      .getHabitationCandidateMatches(activeHabitation.id, {
        maxDistanceKm: 160,
        fieldOverrides,
      })
      .then((res) => {
        if (isMounted) {
          setMatchingResult(res);
          if (res.eligible_sites.length > 0) {
            setExpandedSiteId(res.eligible_sites[0].site_id);
          } else if (res.excluded_sites.length > 0) {
            setExpandedSiteId(res.excluded_sites[0].site_id);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load candidate matches:", err);
      })
      .finally(() => {
        if (isMounted) setMatchingLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeHabitation?.id, fieldOverrides]);

  // Fetch site-centric matches when site tab is active
  useEffect(() => {
    if (activeView !== "site_centric" || !selectedSiteId) return;
    let isMounted = true;
    setSiteCentricLoading(true);

    api
      .getSiteCentricMatches(selectedSiteId, 160)
      .then((res) => {
        if (isMounted) setSiteCentricResult(res);
      })
      .catch((err) => console.error("Failed to load site centric matches:", err))
      .finally(() => {
        if (isMounted) setSiteCentricLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeView, selectedSiteId]);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Relocation Intelligence"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Many-to-Many Relocation Intelligence"
            sub="Vulnerable settlements evaluated against multiple candidate resettlement sites. Independent screening separates site-level constraints from habitation-specific matching."
            action={
              <div className="flex items-center gap-2">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <Compass size={13} /> View on Map
                </Link>
                <Link
                  href={`/simulation?hab=${activeHabitation?.id || "H1"}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  <Sliders size={13} /> Run What-If Model
                </Link>
              </div>
            }
          />

          {/* Operational Honesty Notice Banner */}
          <div className="mb-4 p-3 rounded-sm bg-[#FFF9EE] border border-[#C0872B]/40 flex items-center justify-between gap-3 text-xs text-[#8C5D17] flex-wrap">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#C0872B] shrink-0" />
              <span>
                <strong>Operational Decision Standard:</strong> SURAKSHA verifies computational consistency, not real-world ground truth; field, legal, and administrative validation remain the responsibility of the competent authorities. Candidate sites are evaluated independently; ranking is contextual to the selected habitation.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-white border border-[#C0872B]/40 font-semibold shrink-0">
              HUMAN REVIEW REQUIRED
            </span>
          </div>

          {/* Perspective Navigation Tabs */}
          <div className="border-b mb-6 flex gap-6 text-sm font-medium" style={{ borderColor: C.line }}>
            <button
              onClick={() => setActiveView("matching")}
              className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "matching"
                  ? "border-b-2 font-semibold text-[#1C2420] border-[#22364A]"
                  : "text-[#565F58] hover:text-[#1C2420] border-transparent"
              }`}
            >
              <Activity size={15} /> Habitation → Candidate Matching (Contextual)
            </button>
            <button
              onClick={() => setActiveView("site_centric")}
              className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "site_centric"
                  ? "border-b-2 font-semibold text-[#1C2420] border-[#22364A]"
                  : "text-[#565F58] hover:text-[#1C2420] border-transparent"
              }`}
            >
              <Building size={15} /> Site-Centric Capacity &amp; Matches
            </button>
            <button
              onClick={() => setActiveView("screening_inventory")}
              className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === "screening_inventory"
                  ? "border-b-2 font-semibold text-[#1C2420] border-[#22364A]"
                  : "text-[#565F58] hover:text-[#1C2420] border-transparent"
              }`}
            >
              <Layers size={15} /> All Candidate Sites (12-D Matrix)
            </button>
          </div>

          {/* VIEW 1: HABITATION -> CANDIDATE MATCHING */}
          {activeView === "matching" && (
            <div className="space-y-6">
              {/* Step 1: Regional Corridor & Habitation Selector */}
              <div className="border rounded-sm p-4 bg-white space-y-3" style={{ borderColor: C.line }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22364A] text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C2420]">
                      Select Vulnerable Habitation
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#565F58]">
                    Filtering across {corridorHabitations.length} settlements
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-[#565F58] font-medium block mb-1">
                      Regional Corridor
                    </label>
                    <CorridorSelector
                      selectedCorridor={selectedCorridor}
                      onSelectCorridor={(corr) => {
                        setSelectedCorridor(corr);
                        const list = filterHabitationsByCorridor(habitations, corr);
                        if (list.length > 0) setSelectedHabitationId(list[0].id);
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#565F58] font-medium block mb-1">
                      Monitored Settlement
                    </label>
                    <select
                      value={activeHabitation?.id || ""}
                      onChange={(e) => setSelectedHabitationId(e.target.value)}
                      className="w-full border rounded-xs px-3 py-2 text-xs bg-[#F7F5F1] text-[#1C2420] font-medium focus:outline-none focus:ring-1 focus:ring-[#22364A] cursor-pointer"
                      style={{ borderColor: C.line }}
                    >
                      {corridorHabitations.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.region}) — Pop: {h.pop.toLocaleString()} · {h.hazard} [{h.tier}]
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Habitation Quick Summary Strip */}
                {activeHabitation && (
                  <div className="p-3 bg-[#FAF9F5] border rounded-xs flex items-center justify-between flex-wrap gap-3 text-xs" style={{ borderColor: C.line }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1C2420] text-sm">
                        {activeHabitation.name}
                      </span>
                      <TierBadge tier={activeHabitation.tier} />
                      <span className="text-[#565F58]">· {activeHabitation.region}</span>
                      <span className="text-[#565F58]">· Hazard: <strong>{activeHabitation.hazard}</strong></span>
                      <span className="text-[#565F58]">· Demand: <strong>{activeHabitation.pop.toLocaleString()} residents</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="f-mono font-bold text-[#1C2420]">
                        Risk Score: {activeHabitation.score}/100
                      </span>
                      {Object.keys(fieldOverrides).length > 0 && (
                        <button
                          onClick={handleClearAllOverrides}
                          className="text-[11px] text-[#B5462F] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={11} /> Reset {Object.keys(fieldOverrides).length} Override(s)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Matching Result Status Header */}
              {matchingResult && (
                <div
                  className={`border rounded-sm p-4 flex items-start justify-between gap-3 flex-wrap ${
                    matchingResult.status === "ELIGIBLE_OPTIONS_AVAILABLE"
                      ? "bg-[#E8F0EC] border-[#2A6B52]/40"
                      : matchingResult.status === "INSUFFICIENT_CAPACITY"
                      ? "bg-[#FFF9EE] border-[#C0872B]/40"
                      : "bg-[#FFF1F0] border-[#B5462F]/40"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {matchingResult.status === "ELIGIBLE_OPTIONS_AVAILABLE" ? (
                      <CheckCircle2 size={18} className="text-[#2A6B52] mt-0.5 shrink-0" />
                    ) : matchingResult.status === "INSUFFICIENT_CAPACITY" ? (
                      <AlertTriangle size={18} className="text-[#C0872B] mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-[#B5462F] mt-0.5 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                            matchingResult.status === "ELIGIBLE_OPTIONS_AVAILABLE"
                              ? "bg-[#2A6B52] text-white"
                              : matchingResult.status === "INSUFFICIENT_CAPACITY"
                              ? "bg-[#C0872B] text-white"
                              : "bg-[#B5462F] text-white"
                          }`}
                        >
                          {matchingResult.status.replace(/_/g, " ")}
                        </span>
                        <h4 className="text-sm font-bold text-[#1C2420]">
                          {matchingResult.status === "ELIGIBLE_OPTIONS_AVAILABLE"
                            ? `${matchingResult.eligible_sites.length} Candidate Alternative${matchingResult.eligible_sites.length > 1 ? "s" : ""} Available for Comparison`
                            : "NO SUITABLE CANDIDATE SITE IDENTIFIED"}
                        </h4>
                      </div>
                      <p className="text-xs text-[#565F58] mt-1 leading-relaxed">
                        {matchingResult.message}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#565F58] bg-white/70 px-2 py-1 rounded-xs border border-[#D9D4C7] shrink-0">
                    Decision Support · Prototype Heuristic
                  </span>
                </div>
              )}

              {/* Step 3: Eligible Candidate Sites List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C2420] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#2A6B52]" />
                    Eligible Candidate Alternatives (Contextual to {activeHabitation?.name})
                  </h3>
                  <span className="text-xs text-[#565F58] font-mono">
                    {matchingResult?.eligible_sites.length || 0} Eligible Sites
                  </span>
                </div>

                {matchingLoading ? (
                  <div className="p-8 border rounded-sm bg-white text-center text-xs text-[#565F58] flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" /> Evaluating candidate sites for {activeHabitation?.name}…
                  </div>
                ) : matchingResult && matchingResult.eligible_sites.length === 0 ? (
                  <div className="p-6 border rounded-sm bg-white text-center space-y-2" style={{ borderColor: C.line }}>
                    <AlertCircle size={24} className="mx-auto text-[#C0872B]" />
                    <p className="font-serif text-sm font-bold text-[#1C2420]">
                      NO SUITABLE CANDIDATE SITE IDENTIFIED
                    </p>
                    <p className="text-xs text-[#565F58] max-w-lg mx-auto">
                      No candidate relocation site currently satisfies the prototype&apos;s baseline screening and effective capacity requirements for {activeHabitation?.name}. The decision engine does not force a destination when constraints are breached.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <a
                        href="#decision-framework"
                        className="px-3 py-1.5 text-xs font-semibold rounded-xs bg-[#FFF9EE] border border-[#C0872B] text-[#8C5D17] hover:bg-[#FFF3D6] cursor-pointer inline-flex items-center gap-1"
                      >
                        Inspect Decision Framework &amp; Candidate Measures
                      </a>
                    </div>
                  </div>
                ) : (
                  matchingResult?.eligible_sites.map((match) => {
                    const isExpanded = expandedSiteId === match.site_id;
                    const siteObj = sites.find((s) => s.id === match.site_id);
                    const isOverridden = fieldOverrides[match.site_id] === "unsuitable";

                    return (
                      <div
                        key={match.site_id}
                        className="border rounded-sm bg-white overflow-hidden transition-all shadow-2xs"
                        style={{ borderColor: C.line }}
                      >
                        {/* Header Bar */}
                        <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-[#22364A] text-white">
                                Rank {match.rank} among eligible alternatives
                              </span>
                              <h4 className="font-bold text-sm text-[#1C2420]">
                                {match.site_name}
                              </h4>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-semibold bg-[#E8F0EC] text-[#2A6B52] border border-[#2A6B52]/30">
                                Passed baseline screening
                              </span>
                            </div>

                            <p className="text-xs text-[#565F58] mt-1 flex items-center gap-3 flex-wrap">
                              <span>{match.region}</span>
                              <span>· Transit Distance: <strong>{match.distance_km ?? "Data unavailable"} km</strong></span>
                              <span>· Bottleneck: <strong className="text-[#B5462F]">{match.bottleneck}</strong></span>
                              <span>· Match Score: <strong>{match.match_score}/100</strong></span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-right">
                              <p className="f-mono text-lg font-bold text-[#2A6B52]">
                                {match.remaining_capacity}{" "}
                                <span className="text-xs font-normal text-[#565F58]">
                                  / {match.effective_capacity} cap
                                </span>
                              </p>
                              <p className="text-[10px] text-[#565F58]">
                                Headroom: +{match.remaining_capacity - match.population_demand} persons
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/simulation?hab=${activeHabitation?.id}&site=${match.site_id}`}
                                className="px-3 py-1.5 text-xs font-medium rounded-xs text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors inline-flex items-center gap-1"
                              >
                                <Sliders size={12} /> Run What-If
                              </Link>

                              <button
                                onClick={() => handleToggleOverride(match.site_id)}
                                className="px-2.5 py-1.5 text-xs border rounded-xs hover:bg-[#FFF1F0] text-[#B5462F] border-[#B5462F]/40 cursor-pointer transition-colors"
                                title="Field Review / Competent Authority Override: mark site as unsuitable"
                              >
                                <UserCheck size={12} /> Override Unsuitable
                              </button>

                              <button
                                onClick={() => setExpandedSiteId(isExpanded ? null : match.site_id)}
                                className="p-1.5 text-[#565F58] hover:text-[#1C2420] border rounded-xs cursor-pointer"
                                style={{ borderColor: C.line }}
                              >
                                <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Assessment Drawer */}
                        {isExpanded && siteObj && (
                          <div className="px-4 pb-4 pt-1 border-t space-y-4 bg-[#FAF9F5]" style={{ borderColor: C.line }}>
                            {/* Capacity Breakdown */}
                            <div>
                              <p className="text-[10px] font-semibold uppercase text-[#565F58] mb-1">
                                Liebig Infrastructure Carrying Capacity
                              </p>
                              <CapacityBreakdown cap={siteObj.cap} bottleneck={match.bottleneck} />
                            </div>

                            {/* Computational Merits vs Key Constraints */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xs bg-[#F4F7FA] border border-[#22364A]/20 space-y-1.5">
                                <span className="font-bold text-[#22364A] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 size={13} className="text-[#2A6B52]" />
                                  Contextual Suitability Factors
                                </span>
                                <ul className="space-y-1 text-[11px] text-[#1C2420]">
                                  {match.why_this.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-[#2A6B52] font-bold">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-3 rounded-xs bg-[#FFFDF9] border border-[#C0872B]/30 space-y-1.5">
                                <span className="font-bold text-[#C0872B] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                                  <AlertTriangle size={13} className="text-[#C0872B]" />
                                  Operational Constraints &amp; Unknowns
                                </span>
                                <ul className="space-y-1 text-[11px] text-[#1C2420]">
                                  {match.why_not.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-[#C0872B] font-bold">!</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* 12-Dimension Screening Matrix */}
                            <div className="border rounded-xs overflow-hidden bg-white" style={{ borderColor: C.line }}>
                              <div className="p-2 bg-[#F7F5F1] border-b flex items-center justify-between text-[11px]" style={{ borderColor: C.line }}>
                                <span className="font-bold text-[#1C2420] uppercase flex items-center gap-1.5">
                                  <ShieldCheck size={13} className="text-[#3E5E82]" />
                                  12-Dimension Baseline Screening Matrix
                                </span>
                                <span className="text-[10px] text-[#565F58] font-mono">
                                  Honest UNKNOWN States Preserved
                                </span>
                              </div>

                              <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                {Object.entries(match.screening_matrix).map(([dim, status]) => (
                                  <div key={dim} className="p-1.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7]">
                                    <p className="text-[10px] text-[#565F58] capitalize truncate">
                                      {dim.replace(/_/g, " ")}
                                    </p>
                                    <span
                                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs inline-block mt-0.5 ${
                                        status === "PASS"
                                          ? "bg-[#E8F0EC] text-[#2A6B52]"
                                          : status === "FAIL"
                                          ? "bg-[#FFF1F0] text-[#B5462F]"
                                          : "bg-[#FFF9EE] text-[#C0872B]"
                                      }`}
                                    >
                                      {status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Step 4: Excluded Candidates Accordion */}
              {matchingResult && matchingResult.excluded_sites.length > 0 && (
                <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
                  <button
                    onClick={() => setShowExcluded(!showExcluded)}
                    className="w-full p-3.5 bg-[#FAF9F5] flex items-center justify-between text-left cursor-pointer hover:bg-[#F7F5F1] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={15} className="text-[#B5462F]" />
                      <span className="font-bold text-xs text-[#1C2420]">
                        Why were {matchingResult.excluded_sites.length} candidate site(s) excluded? (Exclusion &amp; Bottleneck Reasons)
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-[#565F58] transition-transform ${showExcluded ? "rotate-180" : ""}`} />
                  </button>

                  {showExcluded && (
                    <div className="p-4 divide-y space-y-3" style={{ borderColor: C.line }}>
                      {matchingResult.excluded_sites.map((ex) => {
                        const isOverridden = fieldOverrides[ex.site_id] === "unsuitable";
                        return (
                          <div key={ex.site_id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 flex-wrap text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[#1C2420]">{ex.site_name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FFF1F0] text-[#B5462F] font-bold border border-[#B5462F]/30">
                                  EXCLUDED
                                </span>
                                {isOverridden && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FFF9EE] text-[#C0872B] font-bold border border-[#C0872B]/30">
                                    FIELD OVERRIDE ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#565F58]">
                                Effective Capacity: {ex.effective_capacity} · Remaining: {ex.remaining_capacity} · Demand: {ex.population_demand}
                                {ex.distance_km ? ` · Distance: ${ex.distance_km} km` : ""}
                              </p>

                              <ul className="text-[11px] text-[#B5462F] space-y-0.5 list-disc pl-4 mt-1">
                                {ex.exclusion_reasons.map((r, rIdx) => (
                                  <li key={rIdx}>{r}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              {isOverridden ? (
                                <button
                                  onClick={() => handleToggleOverride(ex.site_id)}
                                  className="px-2.5 py-1 text-xs border rounded-xs hover:bg-[#F7F5F1] text-[#22364A] cursor-pointer"
                                  style={{ borderColor: C.line }}
                                >
                                  Remove Unsuitable Override
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleOverride(ex.site_id)}
                                  className="px-2.5 py-1 text-xs border rounded-xs hover:bg-[#FFF1F0] text-[#B5462F] border-[#B5462F]/40 cursor-pointer"
                                >
                                  Mark Unsuitable
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Five-State Decision Outcome Framework & Operational Considerations */}
              {matchingResult && (
                <div id="decision-framework" className="border rounded-sm p-5 bg-white space-y-5" style={{ borderColor: C.line }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="f-serif text-base font-bold text-[#1C2420]">
                        Step 5: Relocation Decision Outcome Framework
                      </h3>
                      <p className="text-xs text-[#565F58] mt-0.5">
                        Institutional decision outcome classification for <strong>{activeHabitation?.name}</strong> based on technical screening, carrying capacity, and evidence completeness.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#565F58]">Active State:</span>
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                          activeDecisionState === "RELOCATION_OPTIONS_AVAILABLE"
                            ? "bg-[#2A6B52] text-white"
                            : activeDecisionState === "NO_ELIGIBLE_CANDIDATE_SITE"
                            ? "bg-[#B5462F] text-white"
                            : activeDecisionState === "INSUFFICIENT_CAPACITY"
                            ? "bg-[#C0872B] text-white"
                            : activeDecisionState === "INSUFFICIENT_EVIDENCE"
                            ? "bg-[#565F58] text-white"
                            : "bg-[#22364A] text-white"
                        }`}
                      >
                        {DECISION_OUTCOMES.find((o) => o.id === activeDecisionState)?.title || activeDecisionState}
                      </span>
                    </div>
                  </div>

                  {/* 5 Decision Outcomes Reference Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {DECISION_OUTCOMES.map((outcome) => {
                      const isActive = activeDecisionState === outcome.id;
                      const Icon = outcome.icon;
                      return (
                        <div
                          key={outcome.id}
                          className={`p-3.5 rounded-sm border flex flex-col justify-between transition-all ${
                            isActive
                              ? `${outcome.activeBgClass} ${outcome.borderClass} border-2 shadow-xs`
                              : "bg-[#FAF9F5] border-[#E5E0D5] opacity-75 hover:opacity-100"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-white border border-[#D9D4C7] text-[#565F58]">
                                Outcome {outcome.number}
                              </span>
                              {isActive && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs ${outcome.badgeClass}`}>
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex items-start gap-1.5 mb-1.5">
                              <Icon size={14} className={`${outcome.iconColor} shrink-0 mt-0.5`} />
                              <h4 className="text-xs font-bold text-[#1C2420] leading-snug">
                                {outcome.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-[#565F58] leading-relaxed">
                              {outcome.summary}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#D9D4C7]/50 text-[10px] text-[#1C2420] font-medium">
                            {outcome.detail}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Contextual Finding for Active Habitation */}
                  <div
                    className={`p-4 rounded-sm border ${
                      activeDecisionState === "RELOCATION_OPTIONS_AVAILABLE"
                        ? "bg-[#E8F0EC]/50 border-[#2A6B52]/30"
                        : activeDecisionState === "NO_ELIGIBLE_CANDIDATE_SITE"
                        ? "bg-[#FFF1F0]/50 border-[#B5462F]/30"
                        : activeDecisionState === "INSUFFICIENT_CAPACITY"
                        ? "bg-[#FFF9EE]/50 border-[#C0872B]/30"
                        : activeDecisionState === "INSUFFICIENT_EVIDENCE"
                        ? "bg-[#F7F5F1] border-[#565F58]/30"
                        : "bg-[#F4F7FA] border-[#22364A]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h4 className="text-xs font-bold text-[#1C2420] flex items-center gap-1.5">
                          <span>Decision Support Finding:</span>
                          <span className="font-semibold text-[#565F58]">{activeHabitation?.name}</span>
                        </h4>
                        <p className="text-xs text-[#1C2420] mt-1 leading-relaxed">
                          {activeDecisionState === "RELOCATION_OPTIONS_AVAILABLE" && (
                            <>
                              Candidate relocation sites passed baseline screening and have relevant capacity information. {matchingResult.eligible_sites.length} site(s) available within the search corridor. The recommended primary candidate is <strong>{matchingResult.eligible_sites[0]?.site_name}</strong> (distance: {matchingResult.eligible_sites[0]?.distance_km} km, remaining capacity: {matchingResult.eligible_sites[0]?.remaining_capacity.toLocaleString()} persons).
                            </>
                          )}
                          {activeDecisionState === "NO_ELIGIBLE_CANDIDATE_SITE" && (
                            <>
                              No candidate site passed the required screening conditions. All {matchingResult.excluded_sites.length} evaluated site(s) within the operational radius trigger environmental, steep slope (&gt;22°), or statutory reserve forest restrictions.
                            </>
                          )}
                          {activeDecisionState === "INSUFFICIENT_CAPACITY" && (
                            <>
                              Eligible candidate sites exist, but available capacity is insufficient for the assessed demand ({activeHabitation?.pop.toLocaleString()} residents). Liebig bottleneck constraints restrict absorption at current municipal infrastructure thresholds.
                            </>
                          )}
                          {activeDecisionState === "INSUFFICIENT_EVIDENCE" && (
                            <>
                              Critical information required for screening or matching is unavailable or unresolved. Field geotechnical borehole verification or revenue title verification required before formal administrative relocation orders.
                            </>
                          )}
                          {activeDecisionState === "FIELD_REVIEW_REQUIRED" && (
                            <>
                              Human validation or field officer override recorded ({Object.keys(fieldOverrides).length} override(s) active). Field, legal, and administrative validation remain the responsibility of the competent authorities.
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Pending validation or unknown evidence list if any */}
                    {matchingResult.unknown_evidence && matchingResult.unknown_evidence.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-black/10 text-[11px] text-[#565F58]">
                        <span className="font-semibold text-[#1C2420]">Pending Evidence Verification: </span>
                        {matchingResult.unknown_evidence.join(" · ")}
                      </div>
                    )}
                  </div>

                  {/* Secondary Operational Considerations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Secondary Note 1: Temporary Protective Measures */}
                    <div className="p-3.5 rounded-sm bg-[#F4F7FA] border border-[#22364A]/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#22364A]">
                        <ShieldAlert size={14} className="text-[#22364A]" />
                        <span>Temporary Protective Measures</span>
                      </div>
                      <p className="text-xs text-[#565F58] leading-relaxed">
                        Temporary protective measures may be considered during an active hazard event (e.g., immediate evacuation, temporary shelter activation, community warning alerts, and emergency relief prepositioning).
                      </p>
                    </div>

                    {/* Secondary Note 2: Candidate In-Situ Measures */}
                    <div className="p-3.5 rounded-sm bg-[#FFFDF9] border border-[#E8DCC4] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C5D17]">
                        <LifeBuoy size={14} className="text-[#C0872B]" />
                        <span>Candidate Measures for Consideration by Competent Authority</span>
                      </div>
                      <p className="text-xs text-[#565F58] leading-relaxed">
                        Candidate Measures for Consideration by the Competent Authority: When planned relocation is constrained, candidate fallback measures (slope stabilization, drainage improvement, early warning) may be evaluated by competent technical departments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: SITE-CENTRIC INVENTORY & MATCHES */}
          {activeView === "site_centric" && (
            <div className="space-y-6">
              <div className="border rounded-sm p-4 bg-white space-y-3" style={{ borderColor: C.line }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-[#3E5E82]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C2420]">
                      Site-Centric Capacity &amp; Habitation Match Inspector
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#565F58]">
                    Inspect how a single candidate site accommodates multiple habitations
                  </span>
                </div>

                <div>
                  <label className="text-[11px] text-[#565F58] font-medium block mb-1">
                    Select Candidate Resettlement Site
                  </label>
                  <select
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full border rounded-xs px-3 py-2 text-xs bg-[#F7F5F1] text-[#1C2420] font-medium focus:outline-none focus:ring-1 focus:ring-[#22364A] cursor-pointer"
                    style={{ borderColor: C.line }}
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.region}) — Liebig Eff Cap: {s.eff.value} persons [Bottleneck: {s.eff.bottleneck}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {siteCentricLoading ? (
                <div className="p-8 border rounded-sm bg-white text-center text-xs text-[#565F58] flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Evaluating site-centric relationships…
                </div>
              ) : siteCentricResult ? (
                <div className="border rounded-sm p-5 bg-white space-y-5" style={{ borderColor: C.line }}>
                  {/* Site Summary Card */}
                  <div className="p-4 bg-[#F7F5F1] rounded-sm border border-[#D9D4C7] flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#1C2420]">
                        {siteCentricResult.site_name}
                      </h4>
                      <p className="text-xs text-[#565F58] mt-0.5">
                        {siteCentricResult.region} · Governed by Liebig Bottleneck:{" "}
                        <strong className="text-[#B5462F]">{siteCentricResult.bottleneck}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="f-mono text-xl font-bold text-[#2A6B52]">
                          {siteCentricResult.effective_capacity}
                        </p>
                        <p className="text-[10px] text-[#565F58]">Liebig Effective Capacity</p>
                      </div>
                      <div>
                        <p className="f-mono text-xl font-bold text-[#22364A]">
                          {siteCentricResult.remaining_capacity}
                        </p>
                        <p className="text-[10px] text-[#565F58]">Available Capacity for Comparison</p>
                      </div>
                    </div>
                  </div>

                  {/* Potentially Matched Habitations */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A6B52] flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Potentially Matched Habitations ({siteCentricResult.eligible_habitations.length})
                    </h5>
                    <p className="text-[11px] text-[#565F58]">
                      Habitations whose population demand fits within effective capacity and within operational corridor distance:
                    </p>

                    {siteCentricResult.eligible_habitations.length === 0 ? (
                      <p className="text-xs text-[#565F58] italic p-3 bg-[#FAF9F5] border rounded-xs">
                        No habitations currently match this site within operational constraints.
                      </p>
                    ) : (
                      <div className="border rounded-xs divide-y overflow-hidden text-xs" style={{ borderColor: C.line }}>
                        {siteCentricResult.eligible_habitations.map((h) => (
                          <div key={h.habitation_id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors">
                            <div>
                              <p className="font-bold text-[#1C2420]">{h.habitation_name}</p>
                              <p className="text-[11px] text-[#565F58]">
                                {h.region} · Demand: <strong>{h.population} residents</strong> ({h.capacity_consumed_pct}% of site capacity)
                                {h.distance_km ? ` · Distance: ${h.distance_km} km` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <TierBadge tier={h.priority_tier as any} />
                              <Link
                                href={`/simulation?hab=${h.habitation_id}&site=${siteCentricResult.site_id}`}
                                className="px-2.5 py-1 text-xs font-medium rounded-xs text-[#22364A] border border-[#22364A] hover:bg-[#22364A] hover:text-white transition-colors"
                              >
                                Simulate Pair
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ineligible Habitations */}
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: C.line }}>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#B5462F] flex items-center gap-1.5">
                      <XCircle size={14} /> Excluded / Ineligible Habitations ({siteCentricResult.ineligible_habitations.length})
                    </h5>

                    <div className="border rounded-xs divide-y overflow-hidden text-xs max-h-60 overflow-y-auto" style={{ borderColor: C.line }}>
                      {siteCentricResult.ineligible_habitations.map((h) => (
                        <div key={h.habitation_id} className="p-2.5 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#1C2420]">{h.habitation_name} (Pop: {h.population})</p>
                            <p className="text-[11px] text-[#B5462F]">{h.reasons[0]}</p>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#FFF1F0] text-[#B5462F]">
                            Ineligible
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* VIEW 3: SCREENING INVENTORY (EXISTING SITE LIST) */}
          {activeView === "screening_inventory" && (
            <div className="border rounded-sm p-5 bg-white space-y-4" style={{ borderColor: C.line }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C2420]">
                    Candidate Resettlement Sites Screening Matrix
                  </h3>
                  <p className="text-xs text-[#565F58]">
                    Evaluated and ranked by Liebig effective capacity — strictly bounded by the tightest infrastructure bottleneck.
                  </p>
                </div>
              </div>

              <SiteList
                sites={sites}
                minCap={minCap}
                setMinCap={setMinCap}
                loading={loadingSites}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function RelocationSitesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#565F58]">Loading SURAKSHA Relocation Intelligence…</div>}>
      <RelocationContent />
    </Suspense>
  );
}
