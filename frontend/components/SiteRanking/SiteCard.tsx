'use client';

import React from "react";
import { ChevronDown } from "lucide-react";
import { CandidateSite } from "@/types";
import { C, CAP_LABELS } from "../Common/constants";
import { CapacityBreakdown } from "../Capacity/CapacityBreakdown";

export interface SiteCardProps {
  site: CandidateSite;
  isOpen: boolean;
  onToggle: () => void;
}

export function SiteCard({ site, isOpen, onToggle }: SiteCardProps) {
  const bottleneckLabel = CAP_LABELS[site.eff.bottleneck]?.toLowerCase() || site.eff.bottleneck;

  return (
    <div
      className="border rounded-sm transition-colors"
      style={{ borderColor: C.line, backgroundColor: C.paper }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22364A] cursor-pointer"
      >
        <div>
          <p className="f-sans text-sm font-semibold" style={{ color: C.ink }}>
            {site.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="f-sans text-xs" style={{ color: C.inkSoft }}>
              {site.distanceKm} km transit · bottleneck:{" "}
              <span className="font-semibold text-[#B5462F]">{bottleneckLabel}</span>
            </span>
            {site.landTenure && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold border ${
                site.landTenure.litigationRisk === "Low"
                  ? "bg-[#E8F0EC] text-[#2A6B52] border-[#2A6B52]/40"
                  : site.landTenure.litigationRisk === "Moderate"
                  ? "bg-[#FFF9EE] text-[#C0872B] border-[#C0872B]/40"
                  : "bg-[#FFF1F0] text-[#B5462F] border-[#B5462F]/40"
              }`}>
                🏛️ {site.landTenure.classification}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="f-mono text-lg font-semibold" style={{ color: C.pine }}>
              {site.eff.value}
            </p>
            <p className="f-sans text-[10px]" style={{ color: C.inkSoft }}>
              effective capacity
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            style={{ color: C.inkSoft }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t space-y-3" style={{ borderColor: C.line }}>
          {/* Infrastructure Bottleneck Breakdown */}
          <div>
            <p className="text-[10px] font-semibold uppercase text-[#565F58] mb-1">
              Liebig's Law Infrastructure Capacity
            </p>
            <CapacityBreakdown cap={site.cap} bottleneck={site.eff.bottleneck} />
            <p className="f-sans text-xs mt-2" style={{ color: C.inkSoft }}>
              Effective carrying capacity is strictly constrained by{" "}
              <span className="font-medium text-[#1C2420]">{bottleneckLabel}</span> at{" "}
              {site.eff.value} additional residents.
            </p>
          </div>

          {/* Administrative Land Tenure & Statutory Clearance Box */}
          {site.landTenure && (
            <div className="p-3 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1C2420] text-[11px] flex items-center gap-1.5">
                  📋 Land Ownership & Statutory Encumbrance Audit
                </span>
                <span className="text-[10px] font-mono text-[#565F58]">
                  {site.landTenure.surveyNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-[#565F58]">Title Classification: </span>
                  <strong className="text-[#1C2420]">{site.landTenure.classification}</strong>
                </div>
                <div>
                  <span className="text-[#565F58]">Clearance Timeline: </span>
                  <strong className="text-[#1C2420]">
                    {site.landTenure.clearanceTimelineMonths} month(s) ({site.landTenure.litigationRisk} Legal Risk)
                  </strong>
                </div>
                <div>
                  <span className="text-[#565F58]">Encumbrance Status: </span>
                  <span className={site.landTenure.litigationRisk === "High" ? "text-[#B5462F] font-semibold" : "text-[#2A6B52] font-semibold"}>
                    {site.landTenure.encumbranceStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#565F58]">Nodal Authority: </span>
                  <span className="text-[#3E5E82] font-medium">{site.landTenure.nodalDepartment}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
