'use client';

import React, { useState, useEffect } from "react";
import { X, UserCheck, ShieldAlert, Save, RotateCcw, AlertTriangle } from "lucide-react";
import { Habitation, HumanFieldReview } from "@/types";
import { C } from "./constants";
import { TierBadge } from "./Badges";

export interface HumanFieldReviewModalProps {
  habitation: Habitation | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSaved?: (review: HumanFieldReview) => void;
}

export function HumanFieldReviewModal({
  habitation,
  isOpen,
  onClose,
  onReviewSaved,
}: HumanFieldReviewModalProps) {
  const [status, setStatus] = useState<HumanFieldReview["status"]>("REQUIRES FIELD VERIFICATION");
  const [designation, setDesignation] = useState("DDMA Field Technical Officer / Tehsildar");
  const [notes, setNotes] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!habitation || !isOpen) return;
    try {
      const stored = localStorage.getItem("suraksha_field_reviews");
      if (stored) {
        const parsed: Record<string, HumanFieldReview> = JSON.parse(stored);
        const existing = parsed[habitation.id];
        if (existing) {
          setStatus(existing.status);
          setDesignation(existing.reviewerDesignation || designation);
          setNotes(existing.notes || "");
        } else {
          setStatus("REQUIRES FIELD VERIFICATION");
          setNotes("");
        }
      }
    } catch {
      // LocalStorage fallback
    }
    setSavedSuccess(false);
  }, [habitation?.id, isOpen]);

  if (!isOpen || !habitation) return null;

  const handleSave = () => {
    const review: HumanFieldReview = {
      habitationId: habitation.id,
      status,
      reviewerDesignation: designation,
      notes: notes.trim() || "Field observation recorded during demonstration review.",
      timestamp: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem("suraksha_field_reviews");
      const parsed: Record<string, HumanFieldReview> = stored ? JSON.parse(stored) : {};
      parsed[habitation.id] = review;
      localStorage.setItem("suraksha_field_reviews", JSON.stringify(parsed));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }

    setSavedSuccess(true);
    if (onReviewSaved) onReviewSaved(review);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto">
      <div
        className="w-full max-w-xl rounded-sm border bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{ borderColor: C.line }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#F7F5F1]" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xs bg-[#22364A] text-white">
              <UserCheck size={18} />
            </div>
            <div>
              <h2 className="f-sans text-sm font-bold text-[#1C2420]">
                Demo Field Review — Local Browser Record
              </h2>
              <p className="text-[11px] text-[#565F58]">
                Settlement: <strong className="text-[#1C2420]">{habitation.name}</strong> ({habitation.region})
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

        {/* Notice Banner */}
        <div className="px-5 py-2.5 bg-[#FFFDF9] border-b border-[#E8DCC4] flex items-center gap-2 text-[11px] text-[#8C5D17]">
          <AlertTriangle size={14} className="shrink-0 text-[#C0872B]" />
          <span>
            <strong>Demo Field Review (Local Browser Record):</strong> Current demonstration stores review notes locally in your browser and does not constitute a centralized institutional audit record. Human review preserves model transparency without mutating raw mathematical scores.
          </span>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Current Model Output Card */}
          <div className="p-3 rounded-xs bg-[#F7F5F1] border border-[#D9D4C7] space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-[#565F58] tracking-wider">
              System Assessment Baseline
            </span>
            <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
              <div className="flex items-center gap-2">
                <span className="f-mono text-base font-bold text-[#1C2420]">
                  Score: {habitation.score}/100
                </span>
                <TierBadge tier={habitation.tier} />
              </div>
              <span className="text-[11px] text-[#565F58]">
                Primary Hazard: <strong>{habitation.hazard}</strong>
              </span>
            </div>
          </div>

          {/* Review Status Radio Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[#1C2420]">
              Field Verification Determination
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                [
                  { id: "CONFIRMED", label: "Confirmed by Ground Survey", desc: "Model assessment verified on-site", color: "border-[#2A6B52] bg-[#E8F0EC]" },
                  { id: "CHALLENGED", label: "Challenged by Field Officer", desc: "Local mitigation or error identified", color: "border-[#B5462F] bg-[#FFF1F0]" },
                  { id: "REQUIRES FIELD VERIFICATION", label: "Requires Ground Verification", desc: "Pending technical inspection", color: "border-[#C0872B] bg-[#FFF9EE]" },
                  { id: "DATA OUTDATED", label: "Data Outdated / Baseline Shift", desc: "Recent physical works changed terrain", color: "border-[#3E5E82] bg-[#EFF4F9]" },
                  { id: "NOT APPLICABLE", label: "Not Applicable / In-Situ Feasible", desc: "Engineering defense preferred", color: "border-[#565F58] bg-[#F7F5F1]" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`p-2.5 rounded-xs border cursor-pointer transition-all flex flex-col justify-between ${
                    status === opt.id ? opt.color + " ring-1 ring-[#22364A]" : "border-[#D9D4C7] bg-white hover:bg-[#F7F5F1]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="review_status"
                      value={opt.id}
                      checked={status === opt.id}
                      onChange={() => setStatus(opt.id)}
                      className="cursor-pointer"
                    />
                    <span className="font-semibold text-[#1C2420] text-[11px]">{opt.label}</span>
                  </div>
                  <span className="text-[10px] text-[#565F58] mt-1 pl-5">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reviewer Designation */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#1C2420]">
              Reviewing Officer Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Sub-Divisional Magistrate / Executive Engineer PWD"
              className="w-full border rounded-xs px-2.5 py-1.5 bg-[#F7F5F1] text-xs text-[#1C2420] focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
            />
          </div>

          {/* Justification Notes */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#1C2420]">
              Ground Observation & Justification Note
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter specific field notes e.g., 'Recent slope retaining wall constructed by PWD in Q4 2024 has stabilized upper tier drainage; score challenged pending fresh survey.'"
              className="w-full border rounded-xs p-2.5 bg-[#F7F5F1] text-xs text-[#1C2420] focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-[#F7F5F1] flex items-center justify-between gap-2" style={{ borderColor: C.line }}>
          <button
            onClick={() => {
              setNotes("");
              setStatus("REQUIRES FIELD VERIFICATION");
            }}
            className="inline-flex items-center gap-1 text-[11px] text-[#565F58] hover:text-[#1C2420] cursor-pointer"
          >
            <RotateCcw size={12} /> Reset Form
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#565F58] hover:text-[#1C2420] font-medium rounded-xs border border-[#D9D4C7] bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#22364A] hover:bg-[#3E5E82] rounded-xs cursor-pointer shadow-xs"
            >
              <Save size={13} />
              {savedSuccess ? "Saved to Local Record!" : "Save Field Review (Local Record)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
