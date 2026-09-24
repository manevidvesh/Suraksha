'use client';

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  LifeBuoy,
  Zap,
  Droplet,
  HeartPulse,
  Radio,
  CheckCircle2,
  PackagePlus,
  Send,
  Fuel,
  Info,
} from "lucide-react";
import { C } from "../Common/constants";
import { HabitationReadinessProfile, LifelineItem } from "@/lib/ddmaReadinessData";

export interface LifelineReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HabitationReadinessProfile | null;
}

export function LifelineReadinessModal({
  isOpen,
  onClose,
  profile,
}: LifelineReadinessModalProps) {
  const [items, setItems] = useState<LifelineItem[]>(profile?.lifelineItems || []);
  const [dispatchRequested, setDispatchRequested] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Sync state if profile changes
  React.useEffect(() => {
    if (profile) {
      setItems(profile.lifelineItems);
      setDispatchRequested(false);
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleReplenish = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const newStock = it.requiredNorm;
          return {
            ...it,
            currentStock: newStock,
            status: "ready",
          };
        }
        return it;
      })
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "rescue_equipment":
        return <LifeBuoy size={14} className="text-[#22364A]" />;
      case "power_fuel":
        return <Zap size={14} className="text-[#C0872B]" />;
      case "water_sanitation":
        return <Droplet size={14} className="text-[#3E5E82]" />;
      case "medical_relief":
        return <HeartPulse size={14} className="text-[#B5462F]" />;
      case "telecom":
        return <Radio size={14} className="text-[#2A6B52]" />;
      default:
        return <ShieldCheck size={14} />;
    }
  };

  const totalNorm = items.reduce((acc, it) => acc + it.requiredNorm, 0);
  const totalStock = items.reduce((acc, it) => acc + Math.min(it.currentStock, it.requiredNorm), 0);
  const currentScore = totalNorm > 0 ? Math.round((totalStock / totalNorm) * 100) : profile.readinessScore;

  const deficitsCount = items.filter((it) => it.status !== "ready").length;

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((it) => it.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-[#F7F5F1] border rounded-sm shadow-2xl p-5 sm:p-6 relative f-sans my-8 max-h-[92vh] flex flex-col"
        style={{ borderColor: C.line }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-[#EFECE4] rounded-xs text-[#565F58] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="border-b pb-4 pr-8" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#22364A] text-white">
              DDMA Operational Command
            </span>
            <span className="text-[11px] text-[#565F58]">
              Audit Ref: DDMA/{profile.district.toUpperCase().slice(0, 3)}/2026
            </span>
          </div>

          <h2 className="f-serif text-xl sm:text-2xl font-bold text-[#1C2420]">
            Lifeline Readiness & Relief Inventory: {profile.habitationName}
          </h2>

          <p className="text-xs text-[#565F58] mt-1">
            {profile.district}, {profile.state} · Population: <strong>{profile.population.toLocaleString()}</strong> · Primary Hazard: <strong>{profile.primaryHazard}</strong> ({profile.hazardTier})
          </p>
        </div>

        {/* Readiness Score Bar & Alert */}
        <div className="py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
              style={{
                backgroundColor:
                  currentScore >= 80 ? "#2A6B52" : currentScore >= 60 ? "#C0872B" : "#B5462F",
              }}
            >
              <span>{currentScore}%</span>
              <span className="text-[8px] uppercase tracking-tighter -mt-1 font-normal opacity-90">Ready</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1C2420]">
                {currentScore >= 80
                  ? "Operational Pre-Disaster Readiness Standard Met"
                  : currentScore >= 60
                  ? "Moderate Readiness: Lifeline Deficits Require Local Pre-Positioning"
                  : "Critical Lifeline Deficit: Immediate Contingency Dispatch Required"}
              </p>
              <p className="text-[11px] text-[#565F58]">
                {deficitsCount === 0
                  ? "All emergency relief categories meet prototype DDMA planning norms."
                  : `${deficitsCount} critical equipment or relief stock items are below emergency norm.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setDispatchRequested(true)}
            disabled={dispatchRequested}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-sm text-white transition-colors cursor-pointer shrink-0"
            style={{
              backgroundColor: dispatchRequested ? "#2A6B52" : "#22364A",
            }}
          >
            {dispatchRequested ? (
              <>
                <CheckCircle2 size={14} /> SDMF Dispatch Requisition Logged
              </>
            ) : (
              <>
                <Send size={14} /> Request SDMF Contingency Dispatch
              </>
            )}
          </button>
        </div>

        {dispatchRequested && (
          <div className="mt-3 p-3 bg-[#EEF5F0] border border-[#2A6B52]/40 rounded-xs text-xs text-[#2A6B52] flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <div>
              <strong>Requisition #SDMF-CONT-2026-09 logged:</strong> Emergency relief stock replenishment routed to District Magistrate & State Relief Commissionerate. Priority dispatch dispatched within 48h.
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 py-3 overflow-x-auto text-[11px]">
          <span className="text-[#565F58] font-medium mr-1">Filter:</span>
          {[
            { id: "all", label: "All Supplies" },
            { id: "rescue_equipment", label: "Rescue Craft & Flotilla" },
            { id: "power_fuel", label: "Power & Dewatering" },
            { id: "water_sanitation", label: "Water & Rations" },
            { id: "medical_relief", label: "Trauma Care" },
            { id: "telecom", label: "Telecom & EWS" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-2.5 py-1 rounded-xs border font-medium transition-colors whitespace-nowrap cursor-pointer"
              style={{
                borderColor: activeCategory === cat.id ? "#22364A" : C.line,
                backgroundColor: activeCategory === cat.id ? "#22364A" : "white",
                color: activeCategory === cat.id ? "white" : "#565F58",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Inventory Checklist Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="border rounded-sm bg-white overflow-hidden" style={{ borderColor: C.line }}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F5F1] border-b text-[10px] uppercase font-semibold text-[#565F58]" style={{ borderColor: C.line }}>
                  <th className="p-2.5">Category & Lifeline Item</th>
                  <th className="p-2.5 text-center">Norm</th>
                  <th className="p-2.5 text-center">On-Ground</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-right">DDMA Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.line }}>
                {filteredItems.map((it) => {
                  const pct = Math.min(Math.round((it.currentStock / it.requiredNorm) * 100), 100);
                  return (
                    <tr key={it.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-xs bg-[#F7F5F1] border" style={{ borderColor: C.line }}>
                            {getCategoryIcon(it.category)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1C2420]">{it.name}</p>
                            {it.notes && (
                              <p className="text-[10px] text-[#B5462F] flex items-center gap-1 mt-0.5">
                                <AlertTriangle size={10} /> {it.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-2.5 text-center font-medium text-[#565F58]">
                        {it.requiredNorm} {it.unit}
                      </td>

                      <td className="p-2.5 text-center">
                        <span className="font-bold text-[#1C2420]">
                          {it.currentStock} {it.unit}
                        </span>
                        <div className="w-16 mx-auto bg-[#EFECE4] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                pct === 100 ? "#2A6B52" : pct >= 60 ? "#C0872B" : "#B5462F",
                            }}
                          />
                        </div>
                      </td>

                      <td className="p-2.5 text-center">
                        {it.status === "ready" && (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-xs bg-[#EEF5F0] text-[#2A6B52] font-semibold border border-[#2A6B52]/30">
                            Ready
                          </span>
                        )}
                        {it.status === "deficit" && (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-xs bg-[#FFF9EE] text-[#C0872B] font-semibold border border-[#C0872B]/40">
                            Deficit
                          </span>
                        )}
                        {it.status === "critical" && (
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-xs bg-[#FDF2F0] text-[#B5462F] font-semibold border border-[#B5462F]/40 animate-pulse">
                            Critical
                          </span>
                        )}
                      </td>

                      <td className="p-2.5 text-right">
                        {it.status !== "ready" ? (
                          <button
                            onClick={() => handleReplenish(it.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#22364A] hover:bg-[#3E5E82] text-white text-[11px] font-medium rounded-xs transition-colors cursor-pointer"
                          >
                            <PackagePlus size={12} /> Stock Norm
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#2A6B52] font-medium inline-flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-3 border-t flex items-center justify-between text-xs text-[#565F58]" style={{ borderColor: C.line }}>
          <div className="flex items-center gap-1.5">
            <Info size={13} />
            <span>Audited per NDMA National Disaster Management Guidelines 2025</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 border rounded-sm hover:bg-[#EFECE4] text-[#1C2420] font-medium cursor-pointer transition-colors"
            style={{ borderColor: C.line }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
