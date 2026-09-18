'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Clock, Filter, Compass, AlertTriangle, ArrowRight } from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import {
  CorridorSelector,
  filterHistoryByCorridor,
  CORRIDORS,
} from "@/components/Common";

export default function HistoryPage() {
  const { history } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const corridorHistory = useMemo(() => {
    return filterHistoryByCorridor(history, selectedCorridor);
  }, [history, selectedCorridor]);

  const filteredHistory = useMemo(() => {
    if (severityFilter === "all") return corridorHistory;
    return corridorHistory.filter((h) => h.severity.toLowerCase() === severityFilter.toLowerCase());
  }, [corridorHistory, severityFilter]);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Disaster History"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Historical Disaster Layer & Recurrence"
            sub="Empirical disaster records across national planning corridors inform the historical frequency factor in settlement vulnerability scoring."
            action={
              <div className="flex items-center gap-2">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <Compass size={13} /> View Map
                </Link>
                <Link
                  href="/habitations"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  Score Settlements <ArrowRight size={13} />
                </Link>
              </div>
            }
          />

          {/* Regional Planning Corridor Selector */}
          <div className="mb-5 bg-white border p-3.5 rounded-sm" style={{ borderColor: C.line }}>
            <CorridorSelector
              selectedCorridor={selectedCorridor}
              onSelectCorridor={setSelectedCorridor}
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter size={14} className="text-[#565F58]" />
            <span className="text-xs text-[#565F58] font-medium">Filter by Severity:</span>
            {["all", "High", "Medium", "Low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 text-xs rounded-sm border transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? "bg-[#22364A] text-white border-[#22364A]"
                    : "bg-white text-[#565F58] border-[#D9D4C7] hover:bg-[#F7F5F1]"
                }`}
              >
                {sev === "all" ? "All Events" : sev}
              </button>
            ))}
            <span className="text-xs text-[#565F58] ml-auto">
              Showing <strong>{filteredHistory.length}</strong> incidents
            </span>
          </div>

          {/* Timeline */}
          <div className="border rounded-sm p-6 bg-white" style={{ borderColor: C.line }}>
            {filteredHistory.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#565F58]">
                No historical disaster incidents recorded matching the selected corridor and severity.
              </div>
            ) : (
              <ol className="relative border-l ml-3" style={{ borderColor: C.line }}>
                {filteredHistory.map((e, idx) => {
                  const color =
                    e.severity === "High"
                      ? C.immediate
                      : e.severity === "Medium"
                      ? C.shortTerm
                      : C.mediumTerm;

                  return (
                    <li key={idx} className="ml-6 mb-7 last:mb-0">
                      <span
                        className="absolute -left-[6px] h-3 w-3 rounded-full border-2 border-white shadow-xs"
                        style={{
                          backgroundColor: color,
                          marginTop: "3px",
                        }}
                      />
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="f-mono text-sm font-bold text-[#1C2420]">{e.year}</span>
                        <h4 className="text-sm font-bold text-[#1C2420]">{e.place}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-xs font-medium" style={{ backgroundColor: `${color}18`, color }}>
                          {e.type} · {e.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-[#565F58] mt-1.5 leading-relaxed">{e.impact}</p>
                      {e.displaced !== undefined && (
                        <p className="text-[11px] text-[#565F58]/80 font-mono mt-1">
                          Displaced population: {e.displaced.toLocaleString()} · Fatalities: {e.fatalities || 0}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
