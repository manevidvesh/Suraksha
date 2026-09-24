'use client';

import React from "react";
import { X, Calendar, AlertCircle, Info, ShieldAlert, History } from "lucide-react";
import { Habitation, DisasterEvent } from "@/types";
import { C } from "./constants";
import { FALLBACK_HISTORY } from "@/lib/fallbackData";

export interface HistoricalEvidenceModalProps {
  habitation: Habitation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoricalEvidenceModal({
  habitation,
  isOpen,
  onClose,
}: HistoricalEvidenceModalProps) {
  if (!isOpen || !habitation) return null;

  // Filter events related to this settlement's location or region
  const habNameLower = habitation.name.toLowerCase();
  const regionLower = habitation.region.toLowerCase();

  const relatedEvents = FALLBACK_HISTORY.filter((e) => {
    const placeLower = e.place.toLowerCase();
    const typeLower = e.type.toLowerCase();
    return (
      placeLower.includes(habNameLower) ||
      habNameLower.includes(placeLower) ||
      regionLower.includes(placeLower) ||
      placeLower.includes(regionLower)
    );
  });

  const displayEvents = relatedEvents.length > 0 ? relatedEvents : FALLBACK_HISTORY.slice(0, 4);

  // Event types tally
  const typesMap: Record<string, number> = {};
  displayEvents.forEach((e) => {
    typesMap[e.type] = (typesMap[e.type] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-2xl rounded-sm border bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ borderColor: C.line }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#F7F5F1]" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xs bg-[#3D6B5C] text-white">
              <History size={18} />
            </div>
            <div>
              <h2 className="f-sans text-sm font-bold text-[#1C2420]">
                Historical Disaster Evidence & Recurrence Record
              </h2>
              <p className="text-[11px] text-[#565F58]">
                Settlement: <strong className="text-[#1C2420]">{habitation.name}</strong> ({habitation.region})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#565F58] hover:text-[#1C2420] p-1 rounded-xs transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Observation Period & Status Strip */}
        <div className="p-4 bg-[#FFFDF9] border-b border-[#E8DCC4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Observation Period</span>
            <p className="f-mono text-sm font-bold text-[#1C2420] mt-0.5">2018–2024</p>
            <span className="text-[10px] text-[#3E5E82]">7-Year Window</span>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Recorded Incidents</span>
            <p className="f-mono text-sm font-bold text-[#1C2420] mt-0.5">
              {habitation.events || displayEvents.length} Events
            </p>
            <span className="text-[10px] text-[#565F58]">Documented Logs</span>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Event Types</span>
            <p className="text-[11px] font-semibold text-[#1C2420] mt-0.5 truncate">
              {Object.entries(typesMap)
                .map(([type, count]) => `${type} × ${count}`)
                .join(", ") || habitation.hazard}
            </p>
            <span className="text-[10px] text-[#565F58]">Corridor Breakdown</span>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Dataset Status</span>
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF1F0] text-[#B5462F] border border-[#B5462F]/30 truncate">
              DEMO DATASET
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-2.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] flex items-center gap-2 text-[11px] text-[#565F58]">
            <Info size={14} className="shrink-0 text-[#3E5E82]" />
            <span>
              <strong>Methodology Disclosure:</strong> Historical frequency contributes 15% to the composite risk score as a recurrence indicator during the available 2018–2024 observation period. It does not represent an exhaustive 100-year continuous archive.
            </span>
          </div>

          {/* Event Log Table */}
          <div className="border rounded-xs overflow-hidden" style={{ borderColor: C.line }}>
            <div className="bg-[#F7F5F1] px-3 py-2 border-b font-semibold text-[11px] text-[#1C2420]" style={{ borderColor: C.line }}>
              Recorded Disaster Incidents in Corridor ({displayEvents.length} Events)
            </div>
            <div className="divide-y max-h-56 overflow-y-auto" style={{ borderColor: C.line }}>
              {displayEvents.map((evt, idx) => (
                <div key={idx} className="p-3 bg-white hover:bg-[#F7F5F1]/50 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="f-mono text-xs font-bold px-1.5 py-0.5 rounded-xs bg-[#22364A] text-white">
                        {evt.year}
                      </span>
                      <strong className="text-[#1C2420]">{evt.place}</strong>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30">
                      {evt.type} · Severity: {evt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#565F58] pl-1">
                    {evt.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-[#F7F5F1] flex items-center justify-between" style={{ borderColor: C.line }}>
          <span className="text-[10px] text-[#565F58]">
            Source: Prototype demonstration dataset · Verification required by District Disaster Management Authority
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#22364A] hover:bg-[#3E5E82] rounded-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
