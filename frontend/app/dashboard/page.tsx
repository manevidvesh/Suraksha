'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MapIcon,
  ChevronRight,
  ArrowRight,
  Upload as UploadIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw,
  Plus,
  Database,
  ExternalLink,
  LifeBuoy,
  ClipboardCheck,
} from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { Habitation, UploadResult } from "@/types";
import { api } from "@/lib/api";
import { C } from "@/components/Common/constants";
import { TierBadge, ConfidenceBadge } from "@/components/Common/Badges";
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
  filterHistoryByCorridor,
  CORRIDORS,
  AdaptationStrategyModal,
} from "@/components/Common";
import { getAdaptationStrategyForEntity } from "@/lib/adaptationStrategies";

function DashboardContent() {
  const {
    habitations,
    sites,
    history,
    sources,
    redZonesGeoJSON,
    selectedHabitationId,
    setSelectedHabitationId,
    loading,
    networkError,
    flyToTarget,
    setFlyToTarget,
    addHabitation,
  } = useRiskData();

  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mapMode, setMapMode] = useState<"maplibre" | "schematic">("maplibre");
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "sources" | "upload">("overview");
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

  const displayedHistory = useMemo(() => {
    return filterHistoryByCorridor(history, selectedCorridor);
  }, [history, selectedCorridor]);

  const handleSelectCorridor = (corridorId: string) => {
    setSelectedCorridor(corridorId);
    const matching = filterHabitationsByCorridor(habitations, corridorId);
    if (matching.length > 0 && !matching.some((h) => h.id === selectedHabitationId)) {
      setSelectedHabitationId(matching[0].id);
    }
  };

  // Sync tab with query param ?tab=...
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "sources") setActiveTab("sources");
    else if (tab === "upload" || tab === "data") setActiveTab("upload");
    else if (tab === "history") setActiveTab("history");
    else if (tab === "overview") setActiveTab("overview");
  }, [searchParams]);

  // Upload states
  const [uploadStatus, setUploadStatus] = useState<"idle" | "dragging" | "loading" | "success" | "error">("idle");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (file: File) => {
    setUploadStatus("loading");
    setUploadError("");
    try {
      const res = await api.uploadFile(file);
      setUploadResult(res);
      setUploadStatus(res.status === "success" ? "success" : "error");
      if (res.status === "error") setUploadError(res.message);
    } catch (err: any) {
      setUploadStatus("error");
      setUploadError(err.message || "Failed to upload spatial dataset.");
    }
  };

  const handleSimulateUpload = async () => {
    setUploadStatus("loading");
    setUploadError("");
    try {
      const dummyCsv =
        "name,region,hazard,pop,latitude,longitude\nAttamala Settlement,Wayanad,Landslide,320,11.5241,76.1482\nChooralmala Hamlet,Wayanad,Debris Flow,410,11.5392,76.1620\n";
      const file = new File([dummyCsv], "simulated_wayanad_survey.csv", { type: "text/csv" });
      const res = await api.uploadFile(file);
      setUploadResult(res);
      setUploadStatus("success");
    } catch (err: any) {
      setUploadStatus("error");
      setUploadError(err.message);
    }
  };

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Dashboard"
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

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          {/* Top Section */}
          <SectionHead
            title="Multi-Hazard Decision Support"
            sub="Monitored settlements across national hazard corridors scored live against PostGIS multi-hazard layers."
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
                    className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors flex items-center gap-1 cursor-pointer ${
                      mapMode === "maplibre"
                        ? "bg-[#22364A] text-white"
                        : "text-[#565F58] hover:text-[#1C2420]"
                    }`}
                  >
                    <MapIcon size={12} /> MapLibre GIS
                  </button>
                  <button
                    onClick={() => setMapMode("schematic")}
                    className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                      mapMode === "schematic"
                        ? "bg-[#22364A] text-white"
                        : "text-[#565F58] hover:text-[#1C2420]"
                    }`}
                  >
                    Schematic View
                  </button>
                </div>
              </div>
            }
          />

          {/* Regional Planning Corridor Selector */}
          <div className="mb-6 bg-white border p-3.5 rounded-sm" style={{ borderColor: C.line }}>
            <CorridorSelector
              selectedCorridor={selectedCorridor}
              onSelectCorridor={handleSelectCorridor}
            />
          </div>

          {/* Key Metric Tiles */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-6 border"
            style={{ backgroundColor: C.line, borderColor: C.line }}
          >
            {[
              { label: "Habitations tracked", val: displayedHabitations.length },
              { label: "Population exposed", val: totalPop.toLocaleString("en-IN") },
              { label: "Immediate priority", val: counts.Immediate, color: C.immediate },
              { label: "Candidate sites", val: displayedSites.length, color: C.pine },
            ].map((stat) => (
              <div key={stat.label} className="p-4" style={{ backgroundColor: C.paper }}>
                <p className="f-mono text-2xl font-bold" style={{ color: stat.color || C.ink }}>
                  {loading ? "…" : stat.val}
                </p>
                <p className="f-sans text-xs mt-1" style={{ color: C.inkSoft }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Map + Detail Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-8">
            <div
              className="border rounded-sm p-4"
              style={{ borderColor: C.line, backgroundColor: C.paper }}
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="f-sans text-sm font-medium" style={{ color: C.ink }}>
                  Multi-hazard risk map {mapMode === "maplibre" ? "(PostGIS WGS84 + Red Zones)" : "(Schematic Layout)"}
                </p>
                <MapLegend />
              </div>

              <div className="w-full min-h-[350px]">
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
              <p className="f-sans text-xs mt-2" style={{ color: C.inkSoft }}>
                Red polygons denote high-susceptibility Red Zones. Click any marker or red zone to view settlement profile and in-situ adaptation strategies.
              </p>
            </div>

            {/* Selected Habitation Quick Inspector */}
            <div
              className="border rounded-sm p-4 flex flex-col justify-between"
              style={{ borderColor: C.line, backgroundColor: C.paper }}
            >
              {selectedHabitation ? (
                <div>
                  <p className="f-sans text-xs" style={{ color: C.inkSoft }}>
                    {selectedHabitation.region}
                  </p>
                  <p className="f-serif text-lg font-bold mt-0.5" style={{ color: C.ink }}>
                    {selectedHabitation.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <TierBadge tier={selectedHabitation.tier} />
                    {(selectedHabitation.id === "H14" ||
                      selectedHabitation.name.toLowerCase().includes("kuttanad")) && (
                      <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF3D6] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                        In-Situ Priority (No Relocation Site)
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 space-y-2 f-sans text-sm">
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: C.line }}>
                      <dt style={{ color: C.inkSoft }}>Composite Risk</dt>
                      <dd className="f-mono font-semibold">{selectedHabitation.score} / 100</dd>
                    </div>
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: C.line }}>
                      <dt style={{ color: C.inkSoft }}>Population</dt>
                      <dd className="f-mono">{selectedHabitation.pop.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: C.line }}>
                      <dt style={{ color: C.inkSoft }}>Primary Hazard</dt>
                      <dd>{selectedHabitation.hazard}</dd>
                    </div>
                    <div className="flex justify-between border-b pb-1" style={{ borderColor: C.line }}>
                      <dt style={{ color: C.inkSoft }}>Recorded Events</dt>
                      <dd className="f-mono">{selectedHabitation.events}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: C.inkSoft }}>Coordinates</dt>
                      <dd className="f-mono text-xs">
                        {selectedHabitation.latitude.toFixed(4)}, {selectedHabitation.longitude.toFixed(4)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => {
                        setActiveStrategyEntity(selectedHabitation);
                        setStrategyModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2 rounded-sm bg-[#FFF9EE] border border-[#C0872B] hover:bg-[#FFF3D6] text-[#22364A] font-medium cursor-pointer transition-colors"
                      title="Inspect 3-Pillar In-Situ Adaptation & Mitigation Strategies"
                    >
                      <LifeBuoy size={13} className="text-[#C0872B]" /> In-Situ SDMA Strategies
                    </button>
                    <Link
                      href={`/habitations`}
                      className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2 rounded-sm text-white focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors"
                      style={{ backgroundColor: C.slate }}
                    >
                      Inspect Risk Factors <ChevronRight size={13} />
                    </Link>
                    <Link
                      href={`/readiness`}
                      className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2 rounded-sm border border-[#22364A] hover:bg-[#FAF9F5] text-[#22364A] font-semibold cursor-pointer transition-colors"
                      title="DDMA Lifeline Inventory & Offline Action Cards"
                    >
                      <ClipboardCheck size={13} /> DDMA Readiness & Action Cards
                    </Link>
                    <Link
                      href={`/simulation`}
                      className="w-full inline-flex items-center justify-center gap-1.5 f-sans text-xs py-2 rounded-sm border hover:bg-white text-[#22364A] cursor-pointer transition-colors"
                      style={{ borderColor: C.line }}
                    >
                      Simulate Relocation <ArrowRight size={13} />
                    </Link>
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

          {/* Tab Navigation for Lower Section */}
          <div className="border-b mb-6 flex gap-6 text-sm font-medium" style={{ borderColor: C.line }}>
            {[
              { id: "overview", label: "Settlements Priority" },
              { id: "history", label: "Disaster Events" },
              { id: "sources", label: "Data Sources & Lineage" },
              { id: "upload", label: "Spatial Ingestion" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-b-2 font-semibold text-[#1C2420]"
                    : "text-[#565F58] hover:text-[#1C2420]"
                }`}
                style={{
                  borderBottomColor: activeTab === tab.id ? C.slate : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Settlements Priority Summary */}
          {activeTab === "overview" && (
            <div className="border rounded-sm divide-y" style={{ borderColor: C.line, backgroundColor: C.paper }}>
              {displayedHabitations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#565F58]">
                  No habitations registered in this corridor yet.
                </div>
              ) : (
                displayedHabitations.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHabitationId(h.id)}
                    className="p-3.5 flex items-center justify-between gap-4 hover:bg-white transition-colors cursor-pointer"
                    style={{
                      backgroundColor: selectedHabitationId === h.id ? C.paperDim : "transparent",
                    }}
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1C2420]">{h.name}</p>
                      <p className="text-xs text-[#565F58] mt-0.5">
                        {h.region} · {h.hazard} · {h.pop.toLocaleString()} residents
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <TierBadge tier={h.tier} />
                      <span className="f-mono text-sm font-semibold">{h.score}/100</span>
                      <ChevronRight size={14} className="text-[#565F58]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Disaster History */}
          {activeTab === "history" && (
            <div className="border rounded-sm p-5 bg-white" style={{ borderColor: C.line }}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-semibold text-[#1C2420]">Historical Disaster Incidents</p>
                <Link
                  href="/history"
                  className="text-xs text-[#22364A] font-medium hover:underline inline-flex items-center gap-1"
                >
                  Open Dedicated History Page <ExternalLink size={12} />
                </Link>
              </div>
              {displayedHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#565F58]">
                  No historical disaster incidents recorded in this corridor.
                </div>
              ) : (
                <ol className="relative border-l ml-2" style={{ borderColor: C.line }}>
                  {displayedHistory.map((e, idx) => (
                    <li key={idx} className="ml-5 mb-5 last:mb-0">
                      <span
                        className="absolute -left-[5px] h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            e.severity === "High"
                              ? C.immediate
                              : e.severity === "Medium"
                              ? C.shortTerm
                              : C.mediumTerm,
                          marginTop: "4px",
                        }}
                      />
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="f-mono text-sm font-semibold text-[#1C2420]">{e.year}</span>
                        <span className="text-sm font-medium text-[#1C2420]">{e.place}</span>
                        <span className="text-xs text-[#565F58]">· {e.type}</span>
                      </div>
                      <p className="text-xs text-[#565F58] mt-1">{e.impact}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Tab 3: Data Lineage & Sources */}
          {activeTab === "sources" && (
            <div className="border rounded-sm divide-y bg-white" style={{ borderColor: C.line }}>
              <div className="p-3 bg-[#EFECE4]/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1C2420]">Authoritative Data Sources ({sources.length})</span>
                <Link
                  href="/sources"
                  className="text-[#22364A] font-medium hover:underline inline-flex items-center gap-1"
                >
                  Open Full Sources & Provenance Page <ExternalLink size={12} />
                </Link>
              </div>
              {sources.map((s) => (
                <div
                  key={s.name}
                  className="px-4 py-3.5 flex items-center justify-between gap-4 flex-wrap hover:bg-[#F7F5F1] transition-colors"
                >
                  <div>
                    <p className="f-sans text-sm font-medium text-[#1C2420] flex items-center gap-1.5">
                      <Database size={13} className="text-[#3E5E82]" /> {s.name}
                    </p>
                    <p className="f-sans text-xs text-[#565F58] mt-0.5">{s.covers}</p>
                  </div>
                  <div className="text-right">
                    <ConfidenceBadge level={s.confidence} stale={s.stale} />
                    <p className="f-mono text-[11px] text-[#565F58] mt-1">Updated {s.updated}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Spatial Data Ingestion */}
          {activeTab === "upload" && (
            <div className="bg-white border rounded-sm p-6" style={{ borderColor: C.line }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="f-serif text-base font-semibold text-[#1C2420]">
                    Ingest Spatial Datasets
                  </h3>
                  <p className="text-xs text-[#565F58]">
                    Live PostGIS ingestion with EPSG:4326 validation and automated attribute mapping
                  </p>
                </div>
                <Link
                  href="/data"
                  className="text-xs text-[#22364A] font-medium hover:underline inline-flex items-center gap-1"
                >
                  Open Dedicated Ingestion Portal <ExternalLink size={12} />
                </Link>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.geojson,.json,.shp,.zip"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setUploadStatus("dragging");
                }}
                onDragLeave={() => setUploadStatus("idle")}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed rounded-sm p-8 flex flex-col items-center text-center transition-colors"
                style={{
                  borderColor: uploadStatus === "dragging" ? C.slate : C.line,
                  backgroundColor: uploadStatus === "dragging" ? C.paperDim : C.paper,
                }}
              >
                {uploadStatus === "idle" || uploadStatus === "dragging" ? (
                  <>
                    <UploadIcon size={26} strokeWidth={1.5} style={{ color: C.inkSoft }} />
                    <p className="f-sans text-sm mt-3 font-medium text-[#1C2420]">
                      Drag and drop your survey file here
                    </p>
                    <p className="f-sans text-xs mt-1 text-[#565F58]">
                      Supports .csv, .geojson, .shp (zipped)
                    </p>
                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-sm text-white text-xs font-medium bg-[#22364A] hover:bg-[#3E5E82] cursor-pointer transition-colors"
                      >
                        Select File to Upload
                      </button>
                      <button
                        onClick={handleSimulateUpload}
                        className="px-4 py-2 rounded-sm border text-xs font-medium hover:bg-white text-[#22364A] cursor-pointer transition-colors"
                        style={{ borderColor: C.line }}
                      >
                        Simulate CSV Upload (Quick Test)
                      </button>
                    </div>
                  </>
                ) : uploadStatus === "loading" ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-[#22364A]" />
                    <p className="text-sm mt-3 font-medium text-[#1C2420]">
                      Validating geometries against PostGIS schema…
                    </p>
                  </>
                ) : uploadStatus === "success" ? (
                  <>
                    <CheckCircle2 size={26} style={{ color: C.pine }} />
                    <p className="text-sm mt-3 font-medium text-[#1C2420]">
                      {uploadResult?.filename} ingested successfully
                    </p>
                    <p className="text-xs text-[#565F58] mt-1">{uploadResult?.message}</p>
                    <button
                      onClick={() => setUploadStatus("idle")}
                      className="text-xs mt-4 inline-flex items-center gap-1.5 text-[#22364A] cursor-pointer hover:underline"
                    >
                      <RefreshCcw size={12} /> Upload another file
                    </button>
                  </>
                ) : (
                  <>
                    <XCircle size={26} style={{ color: C.immediate }} />
                    <p className="text-sm mt-3 font-medium text-[#1C2420]">Upload validation failed</p>
                    <p className="text-xs text-[#565F58] mt-1 max-w-sm">{uploadError}</p>
                    <button
                      onClick={() => setUploadStatus("idle")}
                      className="text-xs mt-4 px-3 py-1.5 border rounded-sm hover:bg-white text-[#22364A] cursor-pointer"
                      style={{ borderColor: C.line }}
                    >
                      Try again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Manual Habitation Registration Modal */}
      <HabitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabitation}
      />

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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-xs text-[#565F58]">Loading SURAKSHA Dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
