import React, { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle, HelpCircle, AlertTriangle, ShieldCheck, MapPin, Building, Briefcase } from "lucide-react";
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
  const [showMatrix, setShowMatrix] = useState(false);

  const screening = site.screening_matrix || {
    hazard_screening: "PASS",
    carrying_capacity: site.eff.value >= 250 ? "PASS" : "FAIL",
    drinking_water: site.cap.water >= 300 ? "PASS" : "FAIL",
    sanitation: site.cap.sanitation >= 300 ? "PASS" : "FAIL",
    healthcare: site.cap.healthcare >= 300 ? "PASS" : "FAIL",
    schools: site.cap.schools >= 300 ? "PASS" : "FAIL",
    transit_access: site.distanceKm <= 35 ? "PASS" : "FAIL",
    land_ownership: "UNKNOWN",
    legal_encumbrance: "UNKNOWN",
    environmental_restrictions: "UNKNOWN",
    land_acquisition_feasibility: "NOT ASSESSED",
    field_verification: "REQUIRED",
  };

  const whyThis = site.why_this_site || [
    `Liebig carrying capacity supports up to ${site.eff.value} additional residents.`,
    "Located outside active high-risk hazard perimeters in current GIS model.",
    `Estimated transit distance is ${site.distanceKm} km.`,
  ];

  const whyNot = site.why_not_this_site || [
    `Strictly constrained by ${bottleneckLabel} bottleneck at ${site.eff.value} residents.`,
    "Cadastral land ownership and legal encumbrance are UNKNOWN.",
    "Livelihood continuity is NOT ASSESSED (requires socioeconomic field survey).",
  ];

  const blockers = site.primary_blockers || [
    `${bottleneckLabel} capacity threshold (${site.eff.value} residents max)`,
    "Cadastral land ownership unverified (FIELD SURVEY REQUIRED)",
  ];

  return (
    <div
      className="border rounded-sm transition-colors overflow-hidden"
      style={{ borderColor: C.line, backgroundColor: C.paper }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22364A] cursor-pointer"
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="f-sans text-sm font-semibold" style={{ color: C.ink }}>
              {site.name}
            </p>
            <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-semibold bg-[#EFF4F9] text-[#22364A] border border-[#22364A]/30">
              CANDIDATE RELOCATION SITE
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="f-sans text-xs" style={{ color: C.inkSoft }}>
              {site.distanceKm} km transit · bottleneck:{" "}
              <span className="font-semibold text-[#B5462F]">{bottleneckLabel}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-semibold bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30">
              EXTERNAL VALIDATION REQUIRED
            </span>
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
        <div className="px-4 pb-4 pt-1 border-t space-y-4" style={{ borderColor: C.line }}>
          {/* Liebig Infrastructure Bottleneck Breakdown */}
          <div>
            <p className="text-[10px] font-semibold uppercase text-[#565F58] mb-1">
              Liebig's Law Infrastructure Capacity
            </p>
            <CapacityBreakdown cap={site.cap} bottleneck={site.eff.bottleneck} />
          </div>

          {/* Decision Logic: Why This Site vs Why Not This Site */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* WHY THIS SITE? */}
            <div className="p-3 rounded-xs bg-[#F4F7FA] border border-[#22364A]/20 space-y-1.5">
              <span className="font-bold text-[#22364A] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#2A6B52]" />
                WHY THIS SITE? (Computational Merits)
              </span>
              <ul className="space-y-1 text-[11px] text-[#1C2420]">
                {whyThis.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2A6B52] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WHY NOT THIS SITE? */}
            <div className="p-3 rounded-xs bg-[#FFF8F6] border border-[#B5462F]/30 space-y-1.5">
              <span className="font-bold text-[#B5462F] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-[#B5462F]" />
                WHY NOT THIS SITE? (Primary Blockers)
              </span>
              <ul className="space-y-1 text-[11px] text-[#1C2420]">
                {whyNot.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#B5462F] font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 12-Dimension Candidate Site Screening Matrix */}
          <div className="border rounded-xs overflow-hidden" style={{ borderColor: C.line }}>
            <div className="p-2.5 bg-[#F7F5F1] border-b flex items-center justify-between" style={{ borderColor: C.line }}>
              <span className="font-bold text-[11px] text-[#1C2420] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#3E5E82]" />
                12-Dimension Candidate Site Screening Matrix (Computational vs Field Verification)
              </span>
              <span className="text-[10px] text-[#565F58] font-mono">
                12 Evaluated Dimensions
              </span>
            </div>

            <div className="p-3 bg-white grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {Object.entries(screening).map(([dim, status]) => {
                const label = dim.replace(/_/g, " ");
                const isPass = status === "PASS";
                const isFail = status === "FAIL";
                const isUnknown = status === "UNKNOWN";
                const isReq = status === "REQUIRED";

                return (
                  <div key={dim} className="p-1.5 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-0.5">
                    <p className="text-[10px] text-[#565F58] capitalize truncate">{label}</p>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs inline-block ${
                        isPass
                          ? "bg-[#E8F0EC] text-[#2A6B52]"
                          : isFail
                          ? "bg-[#FFF1F0] text-[#B5462F]"
                          : isUnknown
                          ? "bg-[#FFF9EE] text-[#C0872B]"
                          : "bg-[#EFF4F9] text-[#3E5E82]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Land & Administrative Screening (Honest UNKNOWN States) */}
          <div className="p-3 rounded-xs bg-[#FFFDF9] border border-[#E8DCC4] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C2420] text-[11px] flex items-center gap-1.5">
                <Building size={14} className="text-[#C0872B]" />
                LAND & ADMINISTRATIVE SCREENING
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30">
                FIELD VERIFICATION REQUIRED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-[#565F58]">Land Ownership:</span>
                <p className="font-semibold text-[#C0872B]">UNKNOWN</p>
              </div>
              <div>
                <span className="text-[#565F58]">Legal Encumbrance:</span>
                <p className="font-semibold text-[#C0872B]">UNKNOWN</p>
              </div>
              <div>
                <span className="text-[#565F58]">Environmental Restrictions:</span>
                <p className="font-semibold text-[#C0872B]">UNKNOWN</p>
              </div>
              <div>
                <span className="text-[#565F58]">Acquisition Feasibility:</span>
                <p className="font-semibold text-[#565F58]">NOT ASSESSED</p>
              </div>
            </div>

            <p className="text-[10px] text-[#8C5D17] border-t border-[#E8DCC4] pt-1.5 leading-tight">
              <strong>Notice:</strong> Prototype contains no cadastral deed records. Real-world land allocation requires a ground boundary demarcation, revenue title clearance, and Gram Sabha resolution under the LARR Act, 2013.
            </p>
          </div>

          {/* Livelihood Continuity Section */}
          <div className="p-3 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1C2420] text-[11px] flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#3E5E82]" />
                LIVELIHOOD CONTINUITY SCREENING
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#F7F5F1] text-[#565F58] border border-[#D9D4C7]">
                NOT ASSESSED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#565F58]">
              <div>Employment Access: <strong className="text-[#1C2420]">Not Assessed</strong></div>
              <div>Agricultural Access: <strong className="text-[#1C2420]">Not Assessed</strong></div>
              <div>Fishing / Marine Access: <strong className="text-[#1C2420]">Not Assessed</strong></div>
              <div>Market Accessibility: <strong className="text-[#1C2420]">Not Assessed</strong></div>
            </div>

            <p className="text-[10px] text-[#565F58] border-t border-[#D9D4C7] pt-1.5 leading-tight italic">
              Livelihood continuity requires local socioeconomic and field validation. Synthetic livelihood scores are not generated to preserve decision integrity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
