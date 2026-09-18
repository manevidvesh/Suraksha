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
          <p className="f-sans text-sm font-medium" style={{ color: C.ink }}>
            {site.name}
          </p>
          <p className="f-sans text-xs mt-0.5" style={{ color: C.inkSoft }}>
            {site.distanceKm} km transit · bottleneck:{" "}
            <span className="font-semibold text-[#B5462F]">{bottleneckLabel}</span>
          </p>
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
        <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: C.line }}>
          <CapacityBreakdown cap={site.cap} bottleneck={site.eff.bottleneck} />
          <p className="f-sans text-xs mt-3" style={{ color: C.inkSoft }}>
            Effective carrying capacity is strictly constrained by{" "}
            <span className="font-medium text-[#1C2420]">{bottleneckLabel}</span> at{" "}
            {site.eff.value} additional residents.
          </p>
        </div>
      )}
    </div>
  );
}
