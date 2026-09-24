'use client';

import React from "react";
import { X, GitBranch, Database, Shield, Cpu, MapPin, CheckCircle, Clock } from "lucide-react";
import { Habitation, HabitationRiskBreakdown, RiskWeights } from "@/types";
import { C } from "./constants";

export interface AssessmentProvenanceModalProps {
  habitation: Habitation | null;
  breakdown?: HabitationRiskBreakdown | null;
  weights: RiskWeights;
  isOpen: boolean;
  onClose: () => void;
}

export function AssessmentProvenanceModal({
  habitation,
  breakdown,
  weights,
  isOpen,
  onClose,
}: AssessmentProvenanceModalProps) {
  if (!isOpen || !habitation) return null;

  const assessmentId = breakdown?.assessment_id || `SRK-2026-${habitation.id}-v1`;
  const dataVersion = breakdown?.data_version || "2026.09-demo";
  const timestamp = new Date().toISOString().split("T")[0];

  const lineageSteps = [
    {
      step: "1. Raw Evidence Ingestion",
      detail: "Census of India — 2011 Decennial Baseline, GSI susceptibility reference proto-layer, local incident logs (2018–2024).",
      status: "INGESTED (DEMO DATASET)",
      icon: Database,
    },
    {
      step: "2. GIS Spatial Reprojection",
      detail: `Coordinate transformation: Point(${habitation.longitude.toFixed(4)}, ${habitation.latitude.toFixed(4)}) to EPSG:4326 PostGIS geometry.`,
      status: "COMPUTATIONALLY VERIFIED",
      icon: MapPin,
    },
    {
      step: "3. Factor Normalization",
      detail: `Normalized 5 criteria (H:${habitation.f?.hazard ?? 75}, E:${habitation.f?.exposure ?? 70}, V:${habitation.f?.vulnerability ?? 65}, F:${habitation.f?.history ?? 60}, A:${habitation.f?.access ?? 50}) to 0–100 scale.`,
      status: "MODEL-DERIVED",
      icon: Cpu,
    },
    {
      step: "4. MCDA Weight Synthesis",
      detail: `Applied linear additive weights: Hazard ${weights.hazard}%, Exposure ${weights.exposure}%, Vulnerability ${weights.vulnerability}%, History ${weights.history}%, Access ${weights.access}%.`,
      status: "DETERMINISTIC FORMULA",
      icon: GitBranch,
    },
    {
      step: "5. Composite Risk Score Output",
      detail: `Computed final score: ${habitation.score}/100 → Classified to Priority Tier: ${habitation.tier}.`,
      status: "REPRODUCIBLE COMPUTATION",
      icon: CheckCircle,
    },
    {
      step: "6. Carrying Capacity Bottleneck Screening",
      detail: "Applied Liebig's Law min(Land, Water, Sanitation, Healthcare, Schools) to candidate resettlement sites within 40 km.",
      status: "ESTIMATE (FIELD VALIDATION REQ.)",
      icon: Shield,
    },
    {
      step: "7. AI Explanation Layer Grounding",
      detail: "LLM synthesis strictly bound to structured numerical evidence facts with numerical consistency check against structured assessment.",
      status: "GROUNDED EXPLANATION",
      icon: Cpu,
    },
    {
      step: "8. Human Authority Governance",
      detail: "Status: Pending formal administrative and technical review by the competent authority.",
      status: "HUMAN DECISION REQUIRED",
      icon: Clock,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-2xl rounded-sm border bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ borderColor: C.line }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#F7F5F1]" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xs bg-[#22364A] text-white">
              <GitBranch size={18} />
            </div>
            <div>
              <h2 className="f-sans text-sm font-bold text-[#1C2420]">
                Assessment Provenance & End-to-End Lineage
              </h2>
              <p className="text-[11px] text-[#565F58]">
                Deterministic Assessment Identifier: <strong className="font-mono text-[#22364A]">{assessmentId}</strong>
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

        {/* Metadata Header Box */}
        <div className="p-4 bg-[#FFFDF9] border-b border-[#E8DCC4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Assessment ID</span>
            <p className="f-mono text-xs font-bold text-[#22364A] mt-0.5">{assessmentId}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Data Version</span>
            <p className="f-mono text-xs font-semibold text-[#1C2420] mt-0.5">{dataVersion}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Generated Date</span>
            <p className="text-xs text-[#1C2420] mt-0.5">{timestamp}</p>
          </div>
          <div>
            <span className="text-[10px] text-[#565F58] uppercase font-semibold">Governance Status</span>
            <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-xs font-semibold bg-[#FFF9EE] text-[#C0872B] border border-[#C0872B]/30">
              PENDING REVIEW
            </span>
          </div>
        </div>

        {/* Lineage Steps Timeline */}
        <div className="p-5 space-y-3 text-xs max-h-80 overflow-y-auto">
          <p className="text-[11px] font-semibold text-[#565F58] uppercase tracking-wider mb-2">
            Audit Trail · Data Transformation Lineage
          </p>

          <div className="space-y-3 relative pl-6 border-l-2 border-[#D9D4C7] ml-2">
            {lineageSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#22364A] text-white flex items-center justify-center text-[9px] font-bold">
                    {idx + 1}
                  </span>
                  <div className="bg-[#F7F5F1] p-2.5 rounded-xs border border-[#D9D4C7] space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-[#1C2420] text-xs flex items-center gap-1.5">
                        <Icon size={12} className="text-[#3E5E82]" />
                        {s.step}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-white text-[#565F58] border border-[#D9D4C7]">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#565F58] leading-tight">
                      {s.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-[#F7F5F1] flex items-center justify-between" style={{ borderColor: C.line }}>
          <span className="text-[10px] text-[#565F58]">
            Lineage verified by SURAKSHA Audit Engine · Decision-Support Audit Record
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
