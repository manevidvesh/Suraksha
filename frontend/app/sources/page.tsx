'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Database, CheckCircle2, Clock, AlertTriangle, RefreshCw, ArrowRight, Shield } from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { ConfidenceBadge } from "@/components/Common/Badges";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";

export default function SourcesPage() {
  const { sources, loading } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed("Just now");
    }, 600);
  };

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Data Sources"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Authoritative Data Feeds & Provenance"
            sub="Every risk score, red zone boundary, and site capacity metric traces back to a timestamped, accredited institutional provider. Stale inputs are flagged, not hidden."
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors cursor-pointer"
                  style={{ borderColor: C.line }}
                >
                  <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Checking Feeds…" : "Check Health"}
                </button>
                <Link
                  href="/data"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  Upload New Data <ArrowRight size={13} />
                </Link>
              </div>
            }
          />

          {/* Health Summary Banner */}
          <div
            className="border rounded-sm p-4 mb-6 bg-white flex items-center justify-between gap-4 flex-wrap"
            style={{ borderColor: C.line }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xs bg-[#3D6B5C]/15 text-[#3D6B5C]">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C2420]">
                  5 Active Provider Feeds · 1 Dated Feed Flagged
                </p>
                <p className="text-[11px] text-[#565F58]">
                  IMD real-time precipitation radar & GSI slope stability models synced · Status checked {lastRefreshed}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3D6B5C] bg-[#3D6B5C]/10 px-2.5 py-1 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-[#3D6B5C] animate-pulse" />
              Ingestion Pipelines Healthy
            </span>
          </div>

          {/* Sources Catalog */}
          <div
            className="border rounded-sm divide-y bg-white"
            style={{ borderColor: C.line }}
          >
            {sources.map((src, idx) => (
              <div
                key={src.name || idx}
                className="p-5 flex items-start justify-between gap-4 flex-wrap hover:bg-[#F7F5F1] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <Database size={15} className="text-[#3E5E82] shrink-0" />
                    <h3 className="f-serif text-base font-semibold text-[#1C2420]">
                      {src.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#565F58] leading-relaxed">
                    {src.covers}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#565F58] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Last refreshed: {src.updated}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      Feed status:{" "}
                      <span
                        className={`font-medium ${
                          src.stale ? "text-[#C0872B]" : "text-[#3D6B5C]"
                        }`}
                      >
                        {src.stale ? "Dated / Decennial" : "Active / Automated"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <ConfidenceBadge level={src.confidence} stale={src.stale} />
                  {src.stale && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#C0872B] font-medium">
                      <AlertTriangle size={11} /> Requires field calibration
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Note */}
          <div className="mt-6 border-t pt-5 text-xs text-[#565F58] flex flex-wrap justify-between items-center gap-2" style={{ borderColor: C.line }}>
            <span>Complies with NDMA Guidelines on Geospatial Hazard Mapping (2024)</span>
            <Link href="/dashboard" className="text-[#22364A] hover:underline font-medium">
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
