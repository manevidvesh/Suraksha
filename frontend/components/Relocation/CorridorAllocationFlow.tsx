'use client';

import React, { useState, useMemo } from "react";
import { Habitation, CandidateSite } from "@/types";
import { C, tierColor, CAP_LABELS } from "../Common/constants";
import { TierBadge } from "../Common/Badges";
import { ArrowRight, MapPin, Building, CheckCircle2, AlertTriangle, XCircle, Compass } from "lucide-react";

export interface CorridorAllocationFlowProps {
  habitations: Habitation[];
  sites: CandidateSite[];
  selectedHabitationId: string;
  onSelectHabitation: (id: string) => void;
  selectedSiteId?: string;
  onSelectSite?: (id: string) => void;
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

export function CorridorAllocationFlow({
  habitations,
  sites,
  selectedHabitationId,
  onSelectHabitation,
  selectedSiteId,
  onSelectSite,
}: CorridorAllocationFlowProps) {
  // Limit to reasonable display set for clear visual comprehension
  const displayHabs = habitations.slice(0, 6);
  const displaySites = sites.slice(0, 6);

  const activeHab = useMemo(
    () => habitations.find((h) => h.id === selectedHabitationId) || displayHabs[0],
    [habitations, selectedHabitationId, displayHabs]
  );

  // Compute matches for the active habitation
  const relationships = useMemo(() => {
    if (!activeHab) return [];

    return displaySites.map((site) => {
      const dist = computeDistanceKm(
        activeHab.latitude,
        activeHab.longitude,
        site.latitude,
        site.longitude
      );

      const effCap = site.eff?.value ?? 300;
      const bottleneck = site.eff?.bottleneck ?? "water";
      const demand = activeHab.pop;
      const isTooFar = dist > 180;
      const isCapDeficit = demand > effCap;

      let status: "eligible" | "capacity_deficit" | "ineligible";
      let statusLabel = "";

      if (isTooFar) {
        status = "ineligible";
        statusLabel = `Infeasible Distance (${dist} km)`;
      } else if (isCapDeficit) {
        status = "capacity_deficit";
        statusLabel = `Capacity Deficit (Limit: ${bottleneck})`;
      } else {
        status = "eligible";
        statusLabel = `Viable (+${effCap - demand} headroom)`;
      }

      return {
        site,
        dist,
        effCap,
        bottleneck,
        status,
        statusLabel,
      };
    });
  }, [activeHab, displaySites]);

  return (
    <div
      className="border rounded-sm p-4 bg-white space-y-4 overflow-hidden"
      style={{ borderColor: C.line }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b" style={{ borderColor: C.line }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-xs bg-[#22364A] text-white">
              <Compass size={13} />
            </span>
            <h4 className="f-serif text-sm font-bold text-[#1C2420]">
              Many-to-Many Relocation Allocation Visualizer
            </h4>
          </div>
          <p className="text-[11px] text-[#565F58] mt-0.5">
            Interactive visual mapping between vulnerable source habitations and finite-capacity destination sites.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-[#2A6B52]">
            <span className="w-2 h-2 rounded-full bg-[#2A6B52]" /> Viable Alternative
          </span>
          <span className="flex items-center gap-1 text-[#C0872B]">
            <span className="w-2 h-2 rounded-full bg-[#C0872B]" /> Capacity Strained
          </span>
          <span className="flex items-center gap-1 text-[#B5462F]">
            <span className="w-2 h-2 rounded-full bg-[#B5462F]" /> Out of Range
          </span>
        </div>
      </div>

      {/* 3-Column Visual Flow: Habitations (Left) → Vectors (Center) → Sites (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        {/* Left Column: Monitored Settlements */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#565F58] pb-1">
            <span className="uppercase tracking-wider text-[10px]">
              Vulnerable Source Settlements ({habitations.length})
            </span>
            <span className="text-[10px]">Demand (Pop)</span>
          </div>

          <div className="space-y-1.5">
            {displayHabs.map((h) => {
              const isSelected = h.id === activeHab?.id;
              return (
                <div
                  key={h.id}
                  onClick={() => onSelectHabitation(h.id)}
                  className={`p-2.5 rounded-sm border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#22364A] text-white border-[#22364A] shadow-xs"
                      : "bg-[#FAF9F5] border-[#D9D4C7] hover:bg-white"
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: isSelected ? "#F7F5F1" : tierColor(h.tier) }}
                      />
                      <span className="font-bold text-xs truncate">{h.name}</span>
                    </div>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isSelected ? "text-[#C7D0D4]" : "text-[#565F58]"
                      }`}
                    >
                      {h.region} · {h.hazard}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`f-mono text-xs font-bold block ${
                        isSelected ? "text-white" : "text-[#1C2420]"
                      }`}
                    >
                      {h.pop.toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-mono ${
                        isSelected ? "text-[#EFECE4]" : "text-[#565F58]"
                      }`}
                    >
                      Risk: {h.score}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right Column: Active Relationships to Candidate Sites */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#565F58] pb-1">
            <span className="uppercase tracking-wider text-[10px]">
              Candidate Relocation Options for {activeHab?.name}
            </span>
            <span className="text-[10px]">Liebig Cap (Limiting)</span>
          </div>

          <div className="space-y-1.5">
            {relationships.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#565F58] bg-[#FAF9F5] rounded-sm border" style={{ borderColor: C.line }}>
                No candidate sites registered in this corridor.
              </div>
            ) : (
              relationships.map((rel) => {
                const s = rel.site;
                const isEligible = rel.status === "eligible";
                const isCapDeficit = rel.status === "capacity_deficit";

                return (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-sm border transition-all flex items-center justify-between gap-3 ${
                      isEligible
                        ? "bg-[#E8F0EC]/60 border-[#2A6B52]/40"
                        : isCapDeficit
                        ? "bg-[#FFF9EE]/70 border-[#C0872B]/40"
                        : "bg-[#FFF1F0]/50 border-[#B5462F]/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-2 truncate">
                      {isEligible ? (
                        <CheckCircle2 size={15} className="text-[#2A6B52] shrink-0 mt-0.5" />
                      ) : isCapDeficit ? (
                        <AlertTriangle size={15} className="text-[#C0872B] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={15} className="text-[#B5462F] shrink-0 mt-0.5" />
                      )}

                      <div className="truncate">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-xs text-[#1C2420] truncate">
                            {s.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#565F58]">
                            · {rel.dist} km transit
                          </span>
                        </div>

                        <p className="text-[10px] text-[#565F58] mt-0.5">
                          Status:{" "}
                          <strong
                            className={
                              isEligible
                                ? "text-[#2A6B52]"
                                : isCapDeficit
                                ? "text-[#C0872B]"
                                : "text-[#B5462F]"
                            }
                          >
                            {rel.statusLabel}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="f-mono text-xs font-bold text-[#1C2420] block">
                        {rel.effCap.toLocaleString()} cap
                      </span>
                      <span className="text-[9px] font-mono text-[#B5462F] block">
                        Limit: {rel.bottleneck}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t flex items-center justify-between flex-wrap gap-2 text-[10px] text-[#565F58]" style={{ borderColor: C.line }}>
        <span>
          Showing allocation vectors for active settlement: <strong>{activeHab?.name}</strong> (Demand: {activeHab?.pop.toLocaleString()} residents).
        </span>
        <span className="font-mono">
          Prototype Allocation Model · Finite Municipal Ceiling
        </span>
      </div>
    </div>
  );
}
