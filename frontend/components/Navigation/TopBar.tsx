'use client';

import React from "react";
import { Menu, X, ShieldAlert } from "lucide-react";
import { C } from "../Common/constants";

export function TopBar({
  title,
  mobileOpen,
  setMobileOpen,
}: {
  title: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <div
      className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
      style={{ backgroundColor: C.paper, borderColor: C.line }}
    >
      <button
        aria-label="Open menu"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22364A] rounded-sm cursor-pointer text-[#1C2420]"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-xs bg-[#B5462F] flex items-center justify-center text-white text-[10px] font-bold">
          <ShieldAlert size={14} />
        </div>
        <div>
          <p className="f-serif text-sm font-bold leading-tight" style={{ color: C.ink }}>
            {title || "SURAKSHA DSS"}
          </p>
          <p className="text-[9px] uppercase tracking-wider text-[#565F58] leading-none">
            Govt of India · SDMA / DDMA
          </p>
        </div>
      </div>

      <div
        className="text-[9px] font-mono font-bold px-2 py-1 rounded-xs bg-[#FFF1F0] text-[#B5462F] border border-[#B5462F]/30 tracking-wider"
        title="Simulated Event Feeds · Prototype Datasets · Decision-Support Outputs"
      >
        SIH DEMO MODE
      </div>
    </div>
  );
}
