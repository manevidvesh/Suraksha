'use client';

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, ChevronDown, ChevronUp, FileSearch, Check } from "lucide-react";
import { C } from "./constants";

export interface EvidenceGapPanelProps {
  className?: string;
  defaultExpanded?: boolean;
  entityName?: string;
  status?: string;
}

export function EvidenceGapPanel({
  className = "",
  defaultExpanded = false,
  entityName,
  status = "LIMITED EVIDENCE (PROTOTYPE STAGE)",
}: EvidenceGapPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`border rounded-sm bg-white overflow-hidden ${className}`}
      style={{ borderColor: C.line }}
    >
      {/* Header Bar */}
      <div className="p-3 sm:p-4 bg-[#FFFDF9] border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: C.line }}>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xs bg-[#FFF1F0] text-[#B5462F] border border-[#B5462F]/30">
            <AlertTriangle size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="f-sans text-xs font-bold text-[#1C2420] uppercase tracking-wider">
                {entityName ? `Evidence Status & Operational Gaps: ${entityName}` : "Evidence Status & Operational Gaps"}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-[#FFF1F0] text-[#B5462F] border border-[#B5462F]/30">
                {status}
              </span>
            </div>
            <p className="text-[11px] text-[#565F58] mt-0.5">
              Risk scores are computationally valid for supplied inputs, but evidence coverage requires field verification.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-xs text-[#22364A] hover:text-[#3E5E82] font-semibold cursor-pointer"
        >
          <span>{isExpanded ? "Hide Evidence Details" : "View Evidence Gap Checklist"}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expandable Gap Checklist */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* What We Know */}
            <div className="p-3 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-2">
              <div className="flex items-center gap-1.5 text-[#2A6B52] font-semibold">
                <CheckCircle2 size={14} />
                <span>WHAT WE KNOW</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#1C2420]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2A6B52] font-bold">✓</span>
                  <span><strong>GIS Coordinates:</strong> Geo-referenced habitation centroids & candidate site coordinates (WGS84).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2A6B52] font-bold">✓</span>
                  <span><strong>Deterministic MCDA:</strong> Reproducible linear weighted risk ranking without black-box drift.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#2A6B52] font-bold">✓</span>
                  <span><strong>Liebig Bottlenecks:</strong> Mathematical identification of minimum service constraints.</span>
                </li>
              </ul>
            </div>

            {/* What We Do Not Know */}
            <div className="p-3 rounded-xs bg-[#FFFDF9] border border-[#E8DCC4] space-y-2">
              <div className="flex items-center gap-1.5 text-[#C0872B] font-semibold">
                <HelpCircle size={14} />
                <span>WHAT WE DO NOT KNOW</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#1C2420]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#C0872B] font-bold">?</span>
                  <span><strong>Cadastral Titles:</strong> Land ownership and encumbrance records are unverified in prototype.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#C0872B] font-bold">?</span>
                  <span><strong>Livelihood Disruption:</strong> Occupational continuity (farming/fishing) is not assessed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#C0872B] font-bold">?</span>
                  <span><strong>Micro-Hydrology:</strong> Sub-surface pore water pressure requires geotechnical bore logs.</span>
                </li>
              </ul>
            </div>

            {/* What Requires Field Validation */}
            <div className="p-3 rounded-xs bg-[#FFF1F0] border border-[#F2C5C0] space-y-2">
              <div className="flex items-center gap-1.5 text-[#B5462F] font-semibold">
                <ShieldAlert size={14} />
                <span>FIELD VALIDATION REQUIRED</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#1C2420]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B5462F] font-bold">⚠</span>
                  <span><strong>Demographics:</strong> Census 2011 baseline requires local panchayat electoral/ration roll update.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B5462F] font-bold">⚠</span>
                  <span><strong>Infrastructure:</strong> Potable water and school capacity requires on-site PHED/DEO audit.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#B5462F] font-bold">⚠</span>
                  <span><strong>Gram Sabha Consent:</strong> Resettlement consultation under LARR Act, 2013 mandatory before physical execution.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-2.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] flex items-center justify-between text-[11px] text-[#565F58] flex-wrap gap-2">
            <span>
              <strong>Operational Notice:</strong> SURAKSHA scores are decision-support outputs, not statutory resettlement mandates. Any binding relocation, resource diversion, or statutory notification must follow the applicable legal and administrative process of the competent authority.
            </span>
            <span className="font-mono text-[10px] text-[#22364A] font-semibold">
              DECISION-SUPPORT GOVERNANCE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
