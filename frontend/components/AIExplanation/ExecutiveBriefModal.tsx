'use client';

import React, { useState } from "react";
import { X, Copy, Check, FileText, ShieldAlert } from "lucide-react";
import { ExecutiveBrief } from "@/types";
import { C } from "../Common/constants";
import { TierBadge } from "../Common/Badges";

export interface ExecutiveBriefModalProps {
  brief: ExecutiveBrief | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveBriefModal({ brief, isOpen, onClose }: ExecutiveBriefModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !brief) return null;

  const handleCopy = () => {
    const text = `
=== ${brief.title} ===
Habitation: ${brief.habitation_name}
Priority Tier: ${brief.priority_tier}
Generated: ${brief.generated_at}

EXECUTIVE SUMMARY:
${brief.executive_summary}

RISK DRIVER ANALYSIS:
${brief.risk_driver_analysis}

${brief.relocation_site_assessment ? `SITE CARRYING CAPACITY ASSESSMENT:\n${brief.relocation_site_assessment}\n` : ""}
ACTIONABLE DIRECTIVES FOR SDMA:
${brief.policy_recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-2xl bg-white border rounded-sm shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto f-sans"
        style={{ borderColor: C.line }}
      >
        <div className="flex items-start justify-between border-b pb-4 mb-4 border-[#D9D4C7]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-sm bg-[#22364A] text-white mt-1">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="f-serif text-xl font-bold text-[#1C2420]">
                {brief.title}
              </h2>
              <p className="f-mono text-xs text-[#565F58] mt-0.5">
                Target: {brief.habitation_name} · Generated: {brief.generated_at}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TierBadge tier={brief.priority_tier} />
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#EFECE4] rounded-xs text-[#565F58] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[#1C2420]">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#565F58]">
              Executive Summary
            </h4>
            <p className="mt-1 leading-relaxed bg-[#F7F5F1] p-3 rounded-xs border border-[#D9D4C7]">
              {brief.executive_summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#565F58]">
              Risk Driver Analysis
            </h4>
            <p className="mt-1 leading-relaxed text-[#1C2420]">
              {brief.risk_driver_analysis}
            </p>
          </div>

          {brief.relocation_site_assessment && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#565F58]">
                Site Carrying Capacity Assessment
              </h4>
              <p className="mt-1 leading-relaxed text-[#1C2420]">
                {brief.relocation_site_assessment}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#565F58]">
              Actionable Directives for SDMA
            </h4>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[#1C2420]">
              {brief.policy_recommendations.map((rec, i) => (
                <li key={i} className="leading-snug">{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex items-center justify-between border-[#D9D4C7]">
          <span className="text-xs text-[#565F58] f-mono">
            SURAKSHA DSS · AI Policy Engine
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-xs font-medium hover:bg-[#F7F5F1] text-[#22364A] cursor-pointer transition-colors"
              style={{ borderColor: C.line }}
            >
              {copied ? <Check size={14} className="text-[#3D6B5C]" /> : <Copy size={14} />}
              {copied ? "Copied to Clipboard" : "Copy Brief"}
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
