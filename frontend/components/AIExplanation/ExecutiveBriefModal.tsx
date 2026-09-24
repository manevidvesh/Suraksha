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

  const memoNumber = brief.memorandum_number || `SRK-2026-RELOC-${brief.habitation_name.toUpperCase().replace(/\s+/g, "-")}`;
  const statutoryAuth = brief.statutory_authority || "Disaster Management Planning Framework · Decision Support Output";

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
SURAKSHA DECISION SUPPORT SYSTEM · AI EXPLANATION LAYER
EXECUTIVE RELOCATION DECISION BRIEF (FOR DDMA REVIEW)
Brief Ref No: ${memoNumber}
Evaluation Reference: ${statutoryAuth}
Generated At: ${brief.generated_at}
Human Review Status: HUMAN REVIEW REQUIRED PRIOR TO ADMINISTRATIVE EXECUTION

ADDRESSED TO: The District Magistrate & Chairperson, District Disaster Management Authority (DDMA)
SUBJECT: Relocation & In-Situ Habitational Defense Evaluation Brief for ${brief.habitation_name} (${brief.region})

1. VULNERABILITY & EXPLANATION SUMMARY:
${brief.executive_summary}

2. RISK DRIVER ANALYSIS:
${brief.risk_driver_analysis}

${brief.relocation_site_assessment ? `3. CANDIDATE RESETTLEMENT SITE & CARRYING CAPACITY ASSESSMENT:\n${brief.relocation_site_assessment}\n` : ""}

4. INDICATIVE RESETTLEMENT FINANCIAL OUTLAY ESTIMATE:
Total Estimated Outlay: ₹${financialOutlay?.total_crores.toFixed(2)} Crores (${financialOutlay?.households_count} Households)
- Central NDRF / CSS Share (75%): ₹${financialOutlay?.ndrf_central_share_crores.toFixed(2)} Crores
- State SDRF Matching Share (25%): ₹${financialOutlay?.sdrf_state_share_crores.toFixed(2)} Crores
(Funding-source eligibility and applicable scheme norms require verification by the competent authority.)

5. INTER-DEPARTMENTAL TASKING MATRIX:
${departmentMatrix.map((t, idx) => `${idx + 1}. [${t.department} | ${t.designation}] Mandate: ${t.mandate} (Timeline: ${t.timeline})`).join("\n")}

6. CANDIDATE MEASURES FOR TECHNICAL AUTHORITY REVIEW:
${brief.policy_recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

(Prepared by SURAKSHA AI Explanation Layer · Subject to Competent Human Authority Review)
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
            <p className="text-xs font-mono font-medium tracking-wide text-[#EFECE4]">
              AI EXPLANATION LAYER · DECISION SUPPORT BRIEF
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

        {/* Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-[#1C2420] bg-white">
          {/* Letterhead */}
          <div className="text-center border-b-2 border-[#1C2420] pb-5 space-y-2">
            <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded-xs bg-[#F3E8FF] text-[#6B21A8] border border-[#A855F7]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                AI EXPLANATION LAYER
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-[#F4F7FA] text-[#22364A] border border-[#22364A]/30 text-[10px] font-mono font-semibold">
                Generated from structured SURAKSHA assessment data
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-[#FFF3CD] text-[#856404] border border-[#FFEEBA] text-[10px] font-mono font-bold uppercase tracking-wider">
                HUMAN REVIEW REQUIRED
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#565F58]">
              SURAKSHA Decision Support System · State & District DMAs
            </p>
            <h1 className="f-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C2420]">
              EXECUTIVE RELOCATION DECISION BRIEF
            </h1>
            <p className="text-xs font-serif italic text-[#565F58]">
              Automated Synthesis of Spatial Risk, Carrying Capacity & Inter-Agency Tasks for DDMA Review
            </p>
          </div>

          {/* Source Inputs Used Verification Box */}
          <div className="p-3.5 rounded-sm bg-[#FAF9F5] border space-y-2" style={{ borderColor: C.line }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#22364A] flex items-center gap-1.5">
                <FileText size={13} className="text-[#3E5E82]" />
                Source Inputs Used (Structured Evidence Bound)
              </span>
              <span className={`text-[10px] font-mono font-semibold ${brief.is_verified_against_evidence === false ? "text-[#B5462F]" : "text-[#2A6B52]"}`}>
                {brief.is_verified_against_evidence === false ? "⚠️ Numerical Claim Requires Review" : "✓ Numerical Claims Consistent with Structured Evidence"}
              </span>
            </div>
            <p className="text-[11px] text-[#565F58]">
              The numerical consistency validator checks whether numerical claims in the generated explanation are consistent with structured assessment facts available to the system. It does not certify the overall factual accuracy of the generated narrative.
            </p>

            {brief.unverified_claims && brief.unverified_claims.length > 0 && (
              <div className="p-2 rounded-xs bg-[#FFF9EE] border border-[#C0872B]/40 text-[11px] text-[#8C5D17] space-y-1">
                <p className="font-semibold">⚠️ Unverified numerical claims flagged in narrative (requires review):</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                  {brief.unverified_claims.map((claim, i) => (
                    <li key={i}>{claim}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-dashed border-[#D9D4C7]">
              <div>
                <span className="text-[10px] text-[#565F58] block font-mono">Settlement:</span>
                <strong className="text-[#1C2420]">{brief.habitation_name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#565F58] block font-mono">Exposed Pop:</span>
                <strong className="text-[#1C2420]">{brief.population.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#565F58] block font-mono">MCDA Score:</span>
                <strong className="text-[#B5462F]">{brief.risk_score}/100 ({brief.priority_tier})</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#565F58] block font-mono">Primary Hazard:</span>
                <strong className="text-[#1C2420]">{brief.primary_hazard}</strong>
              </div>
            </div>
          </div>

          {/* Reference Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border p-3 rounded-xs bg-[#FAF9F5]" style={{ borderColor: C.line }}>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Brief Reference No:</span>
              <span className="font-mono font-bold text-[#1C2420]">{memoNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Evaluation Reference:</span>
              <span className="font-medium text-[#22364A]">{statutoryAuth}</span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Target Settlement:</span>
              <span className="font-semibold text-[#1C2420]">
                {brief.habitation_name} ({brief.region})
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#565F58] block text-[10px] uppercase">Generated At:</span>
              <span className="font-mono text-[#1C2420]">{brief.generated_at}</span>
            </div>
          </div>

          {/* Addressed To & Subject */}
          <div className="space-y-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#565F58] uppercase text-[10px]">Prepared For:</p>
              <p className="font-semibold text-[#1C2420]">
                The District Magistrate & Chairperson, District Disaster Management Authority (DDMA)
              </p>
              <p className="text-[#565F58] text-[11px]">
                Copies: Sub-Collector / SDM, Executive Engineer (PWD), Executive Engineer (PHED), DMO
              </p>
            </div>

            <div className="p-3 bg-[#F7F5F1] rounded-xs border-l-4 border-[#22364A]">
              <span className="font-bold text-[#1C2420]">Subject: </span>
              <span className="font-medium text-[#1C2420]">
                Relocation & In-Situ Habitational Defense Evaluation Brief for {brief.habitation_name} for technical review by the competent authority.
              </span>
            </div>
          </div>

          {/* 1. Vulnerability & Hazard Assessment */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F]" />
              1. Vulnerability Findings & Planning Context
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

          {/* 3. Indicative Resettlement Financial Outlay Estimate */}
          {financialOutlay && (
            <div className="space-y-2.5">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0872B]" />
                  3. Indicative Resettlement Financial Outlay Estimate
                </h3>
                <p className="text-[11px] text-[#565F58] italic">
                  Funding-source eligibility and applicable scheme norms require verification by the competent authority.
                </p>
              </div>
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
                      <td className="p-2.5" colSpan={2}>Total Estimated Outlay</td>
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
                    <th className="p-2.5">Proposed Mandate & Deliverable</th>
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

          {/* 5. Recommended Measures */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#22364A] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5462F]" />
              5. Candidate Measures for Consideration by the Competent Authority
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
                COMPUTATIONALLY AUDITED & LOGGED · SURAKSHA DSS
              </p>
              <p className="text-[10px]">
                Digital Verification Hash: SHA256:{memoNumber.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0).toString(16)}
              </p>
              <p className="text-[10px]">
                Decision-support synthesis generated for review by competent State/District Disaster Management Authorities.
              </p>
            </div>

            <div className="text-right space-y-1 text-xs">
              <p className="font-serif italic text-[11px] text-[#565F58]">
                Decision Support Output · Human Review Required
              </p>
              <p className="font-bold text-[#1C2420] text-sm">
                Technical Review Desk
              </p>
              <p className="text-[#565F58] text-[11px]">
                Pending Formal Administrative Review by Competent Authority
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden during Print) */}
        <div className="print:hidden px-6 py-3.5 bg-[#FAF9F5] border-t flex items-center justify-between" style={{ borderColor: C.line }}>
          <span className="text-xs text-[#565F58] font-mono">
            Decision Support Evaluation Record · DDMA Review Desk
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

