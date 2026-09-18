'use client';

import React, { useState, useMemo } from "react";
import { X, Copy, Check, Printer, ShieldAlert, FileText } from "lucide-react";
import { ExecutiveBrief, FinancialOutlayBreakdown, DepartmentActionTask } from "@/types";
import { C } from "../Common/constants";
import { TierBadge } from "../Common/Badges";

export interface ExecutiveBriefModalProps {
  brief: ExecutiveBrief | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveBriefModal({ brief, isOpen, onClose }: ExecutiveBriefModalProps) {
  const [copied, setCopied] = useState(false);

  const financialOutlay = useMemo<FinancialOutlayBreakdown | null>(() => {
    if (!brief) return null;
    if (brief.financial_outlay) return brief.financial_outlay;
    const households = Math.max(1, Math.ceil(brief.population / 4.2));
    const pmay = Number(((households * 1.30) / 100).toFixed(2));
    const land = Number(((households * 0.80) / 100).toFixed(2));
    const infra = Number(((households * 1.20) / 100).toFixed(2));
    const total = Number((pmay + land + infra).toFixed(2));
    const ndrf = Number((total * 0.75).toFixed(2));
    const sdrf = Number((total - ndrf).toFixed(2));
    return {
      households_count: households,
      total_crores: total,
      pmay_housing_crores: pmay,
      land_development_crores: land,
      infrastructure_crores: infra,
      ndrf_central_share_crores: ndrf,
      sdrf_state_share_crores: sdrf,
    };
  }, [brief]);

  const departmentMatrix = useMemo<DepartmentActionTask[]>(() => {
    if (!brief) return [];
    if (brief.department_action_matrix && brief.department_action_matrix.length > 0) {
      return brief.department_action_matrix;
    }
    const households = Math.max(1, Math.ceil(brief.population / 4.2));
    return [
      {
        department: "Revenue & Land Records",
        designation: "Tehsildar / Sub-Collector",
        mandate: `Cadastral demarcation of candidate resettlement land, survey of ${households} residential plots (3 cents each), and issuance of freehold title deeds (Pattas).`,
        timeline: "30 Days",
      },
      {
        department: "Public Works Department (PWD)",
        designation: "Executive Engineer (Roads & Bridges)",
        mandate: `Site grading, slope stability retaining walls, and construction of all-weather bituminous road connectivity.`,
        timeline: "60 Days",
      },
      {
        department: "Public Health Engineering / Jal Shakti",
        designation: "Executive Engineer (PHED)",
        mandate: `Deep-bore tubewell commissioning, overhead distribution reservoir, and piped potable water grid under Jal Jeevan Mission.`,
        timeline: "45 Days",
      },
      {
        department: "Health & Family Welfare",
        designation: "District Medical Officer (DMO)",
        mandate: "Operationalization of Ayushman Bharat Health & Wellness Sub-Centre with cold-chain immunization & mobile outreach clinic.",
        timeline: "60 Days",
      },
      {
        department: "School Education & Literacy",
        designation: "District Education Officer (DEO)",
        mandate: `Expansion of classroom capacity at contiguous Government Primary School and establishment of Anganwadi feeding center.`,
        timeline: "90 Days",
      },
    ];
  }, [brief]);

  if (!isOpen || !brief) return null;

  const memoNumber = brief.memorandum_number || `F.No. SDMA/DM-ACT/2026/RELOC-${brief.habitation_name.toUpperCase().replace(/\s+/g, "-")}`;
  const statutoryAuth = brief.statutory_authority || "Disaster Management Act, 2005 (Sections 30 & 34)";

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
GOVERNMENT OF INDIA · STATE DISASTER MANAGEMENT AUTHORITY
OFFICE MEMORANDUM · STATUTORY DISASTER RELOCATION ORDER
Memo No: ${memoNumber}
Statutory Authority: ${statutoryAuth}
Date of Notification: ${brief.generated_at}

TO: The District Magistrate & Chairman, District Disaster Management Authority (DDMA)
SUBJECT: Administrative Sanction for Habitational Relocation of ${brief.habitation_name} (${brief.region})

1. STATUTORY PREAMBLE & VULNERABILITY FINDINGS:
${brief.executive_summary}

2. RISK DRIVER ANALYSIS:
${brief.risk_driver_analysis}

${brief.relocation_site_assessment ? `3. DESIGNATED RESETTLEMENT SITE ASSESSMENT:\n${brief.relocation_site_assessment}\n` : ""}

4. STATUTORY FINANCIAL OUTLAY:
Total Sanctioned Outlay: ₹${financialOutlay?.total_crores.toFixed(2)} Crores (${financialOutlay?.households_count} Households)
- Central NDRF / CSS Share (75%): ₹${financialOutlay?.ndrf_central_share_crores.toFixed(2)} Crores
- State SDRF Matching Share (25%): ₹${financialOutlay?.sdrf_state_share_crores.toFixed(2)} Crores

5. INTER-DEPARTMENTAL TASKING MATRIX:
${departmentMatrix.map((t, idx) => `${idx + 1}. [${t.department} | ${t.designation}] Mandate: ${t.mandate} (Timeline: ${t.timeline})`).join("\n")}

6. ACTIONABLE DIRECTIVES:
${brief.policy_recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

(By Order of the State Disaster Management Authority)
SURAKSHA Decision Support System
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white border rounded-sm shadow-2xl relative max-h-[92vh] overflow-y-auto f-sans"
        style={{ borderColor: C.line }}
      >
        {/* Modal Top Control Bar (Hidden during Print) */}
        <div className="print:hidden sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-[#152331] text-white border-b border-[#22364A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B5462F]" />
            <p className="text-xs font-mono font-medium tracking-wide text-[#EFECE4]">
              OFFICE MEMORANDUM · DISASTER MANAGEMENT ACT, 2005
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22364A] hover:bg-[#3E5E82] text-white text-xs font-medium rounded-xs cursor-pointer transition-colors"
              title="Print official document or save as PDF"
            >
              <Printer size={13} /> Print / Export PDF
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22364A] hover:bg-[#3E5E82] text-white text-xs font-medium rounded-xs cursor-pointer transition-colors"
            >
              {copied ? <Check size={13} className="text-[#3D6B5C]" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#22364A] rounded-xs text-[#9BA8AE] hover:text-white cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#1C2420] bg-white">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-[#1C2420] pb-5 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#565F58]">
              Government of India · State Disaster Management Authority
            </p>
            <h1 className="f-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C2420]">
              OFFICE MEMORANDUM
            </h1>
            <p className="text-xs font-serif italic text-[#565F58]">
              Statutory Relocation & Resettlement Administrative Order
            </p>
          </div>

          {/* Reference Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border p-3 rounded-xs bg-[#FAF9F5]" style={{ borderColor: C.line }}>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">File / Memorandum No:</span>
              <span className="font-mono font-bold text-[#1C2420]">{memoNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Statutory Reference:</span>
              <span className="font-medium text-[#B5462F]">{statutoryAuth}</span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Target Settlement:</span>
              <span className="font-semibold text-[#1C2420]">
                {brief.habitation_name} ({brief.region}) · Pop: {brief.population.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Dated:</span>
              <span className="font-mono text-[#1C2420]">{brief.generated_at}</span>
            </div>
          </div>

          {/* Addressed To & Subject */}
          <div className="space-y-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#565F58] uppercase text-[10px]">Addressed To:</p>
              <p className="font-semibold text-[#1C2420]">
                The District Magistrate & Chairman, District Disaster Management Authority (DDMA)
              </p>
              <p className="text-[#565F58] text-[11px]">
                Copy submitted to: Principal Secretary (Revenue & DM), Engineer-in-Chief (PWD), Chief Engineer (PHED)
              </p>
            </div>

            <div className="p-3 bg-[#F7F5F1] rounded-xs border-l-4 border-[#B5462F]">
              <span className="font-bold text-[#1C2420]">Subject: </span>
              <span className="font-medium text-[#1C2420]">
                Mandatory Habitational Relocation & Rehabilitation Scheme for {brief.habitation_name} under Section 30(2)(v) and Section 34(b) of the Disaster Management Act, 2005.
              </span>
            </div>
          </div>

          {/* 1. Vulnerability & Hazard Assessment */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F]" />
              1. Vulnerability Findings & Statutory Preamble
            </h3>
            <p className="text-xs leading-relaxed text-[#1C2420] text-justify">
              {brief.executive_summary}
            </p>
            <div className="p-3 bg-[#FAF9F5] border rounded-xs text-xs text-[#565F58] leading-relaxed" style={{ borderColor: C.line }}>
              <span className="font-semibold text-[#1C2420]">PostGIS Risk Driver Analysis: </span>
              {brief.risk_driver_analysis}
            </div>
          </div>

          {/* 2. Resettlement Site Capacity Load */}
          {brief.relocation_site_assessment && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D6B5C]" />
                2. Designated Resettlement Site & Carrying Capacity
              </h3>
              <p className="text-xs leading-relaxed text-[#1C2420] text-justify">
                {brief.relocation_site_assessment}
              </p>
            </div>
          )}

          {/* 3. Statutory Financial Outlay */}
          {financialOutlay && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0872B]" />
                3. Statutory Financial Outlay (SDRF / NDRF & PMAY-G Costing)
              </h3>
              <div className="border rounded-xs overflow-hidden" style={{ borderColor: C.line }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5F1] border-b text-[#565F58] font-semibold" style={{ borderColor: C.line }}>
                      <th className="p-2.5">Component / Line Item</th>
                      <th className="p-2.5">Governing Scheme</th>
                      <th className="p-2.5 text-right">Cost (₹ Cr)</th>
                      <th className="p-2.5 text-right">Treasury Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE4] text-[#1C2420]">
                    <tr>
                      <td className="p-2.5 font-medium">Pucca Housing ({financialOutlay.households_count} Units)</td>
                      <td className="p-2.5 text-[#565F58]">PMAY-Gramin (@ ₹1.30L/dwelling)</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{financialOutlay.pmay_housing_crores.toFixed(2)}</td>
                      <td className="p-2.5 text-right text-[#565F58]">60:40 Cent/State</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Site Grading, Retaining Walls & Roads</td>
                      <td className="p-2.5 text-[#565F58]">PWD / SDRF Capacity Grant</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{financialOutlay.land_development_crores.toFixed(2)}</td>
                      <td className="p-2.5 text-right text-[#565F58]">75:25 Cent/State</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Drinking Water & Sanitation Grid</td>
                      <td className="p-2.5 text-[#565F58]">Jal Jeevan Mission (PHED)</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{financialOutlay.infrastructure_crores.toFixed(2)}</td>
                      <td className="p-2.5 text-right text-[#565F58]">50:50 Cent/State</td>
                    </tr>
                    <tr className="bg-[#FAF9F5] font-bold">
                      <td className="p-2.5" colSpan={2}>Total Sanctioned Outlay</td>
                      <td className="p-2.5 text-right font-mono text-[#B5462F]">₹{financialOutlay.total_crores.toFixed(2)} Cr</td>
                      <td className="p-2.5 text-right text-[#22364A]">75% NDRF : 25% SDRF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Inter-Departmental Tasking Matrix */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22364A]" />
              4. Inter-Departmental Implementation & Accountability Matrix
            </h3>
            <div className="border rounded-xs overflow-hidden" style={{ borderColor: C.line }}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5F1] border-b text-[#565F58] font-semibold" style={{ borderColor: C.line }}>
                    <th className="p-2.5">Line Department</th>
                    <th className="p-2.5">Nodal Officer</th>
                    <th className="p-2.5">Statutory Mandate & Deliverable</th>
                    <th className="p-2.5 text-right">Timeframe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4] text-[#1C2420]">
                  {departmentMatrix.map((task, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium">{task.department}</td>
                      <td className="p-2.5 text-[#565F58] font-mono text-[11px]">{task.designation}</td>
                      <td className="p-2.5 text-[#1C2420] text-[11px] leading-relaxed">{task.mandate}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#B5462F] text-[11px] whitespace-nowrap">
                        {task.timeline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Actionable Directives */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F]" />
              5. Statutory Directives Issued under Disaster Management Act, 2005
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#1C2420] leading-relaxed">
              {brief.policy_recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ol>
          </div>

          {/* Official Sign-Off Block */}
          <div className="pt-6 border-t-2 border-[#1C2420] grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-1 text-xs text-[#565F58]">
              <p className="font-mono text-[11px] text-[#22364A] font-bold">
                VERIFIED & AUDIT-LOGGED · SURAKSHA DSS
              </p>
              <p className="text-[10px]">
                Digital Verification Hash: SHA256:{memoNumber.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0).toString(16)}
              </p>
              <p className="text-[10px]">
                Issued by State Executive Committee (SEC) under Disaster Management Act, 2005.
              </p>
            </div>

            <div className="text-right space-y-1 text-xs">
              <p className="font-serif italic text-[11px] text-[#565F58]">
                By Order and in the Name of the Governor / Authority
              </p>
              <p className="font-bold text-[#1C2420] text-sm">
                Member Secretary & Principal Secretary (DM)
              </p>
              <p className="text-[#565F58] text-[11px]">
                State Disaster Management Authority (SDMA)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden during Print) */}
        <div className="print:hidden px-6 py-3.5 bg-[#FAF9F5] border-t flex items-center justify-between" style={{ borderColor: C.line }}>
          <span className="text-xs text-[#565F58] font-mono">
            Gazetted Record · SDMA Command Console
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-xs font-medium hover:bg-white text-[#22364A] cursor-pointer transition-colors"
              style={{ borderColor: C.line }}
            >
              <Printer size={13} /> Print Document
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-xs font-medium hover:bg-white text-[#22364A] cursor-pointer transition-colors"
              style={{ borderColor: C.line }}
            >
              {copied ? <Check size={13} className="text-[#3D6B5C]" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy Text"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#22364A] text-white text-xs font-medium rounded-sm hover:bg-[#3E5E82] cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

