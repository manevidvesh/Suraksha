'use client';

import React, { useState } from "react";
import { Users, Info } from "lucide-react";

export interface PopulationVintageBadgeProps {
  population?: number;
  count?: number;
  className?: string;
  showTooltip?: boolean;
}

export function PopulationVintageBadge({
  population,
  count,
  className = "",
  showTooltip = true,
}: PopulationVintageBadgeProps) {
  const [open, setOpen] = useState(false);
  const val = population ?? count ?? 0;

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <span className="f-mono font-semibold text-[#1C2420]">
        {val.toLocaleString()}
      </span>

      {showTooltip && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="text-[#565F58] hover:text-[#22364A] p-0.5 rounded cursor-pointer transition-colors"
          title="View Population Provenance"
        >
          <Info size={12} className="text-[#3E5E82]" />
        </button>
      )}

      {open && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xs bg-[#22364A] text-white text-[10px] shadow-lg z-50 pointer-events-none space-y-1"
          style={{ animation: "fadeIn 0.15s ease-out" }}
        >
          <div className="font-bold flex items-center gap-1 text-[#E07A5F] border-b border-white/20 pb-1">
            <Users size={11} /> Demographic Provenance
          </div>
          <div className="grid grid-cols-2 gap-1 pt-0.5 text-white/90">
            <span>Reference Baseline:</span>
            <strong className="text-white">Census of India</strong>
            <span>Decennial Year:</span>
            <strong className="text-white">2011 Baseline</strong>
            <span>Data Vintage:</span>
            <strong className="text-white">2011 Decennial Baseline</strong>
            <span>Field Validation:</span>
            <span className="text-[#E07A5F] font-semibold">PENDING FIELD ROLL</span>
          </div>
          <p className="text-[9px] text-white/70 italic border-t border-white/10 pt-1">
            Recorded from 2011 decennial records. Requires electoral/ration ground validation before execution.
          </p>
        </div>
      )}
    </div>
  );
}
