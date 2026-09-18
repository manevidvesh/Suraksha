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
        <div className="w-5 h-5 rounded-xs bg-[#B5462F] flex items-center justify-center text-white text-[10px] font-bold">
          <ShieldAlert size={12} />
        </div>
        <p className="f-serif text-base font-semibold" style={{ color: C.ink }}>
          {title || "SURAKSHA DSS"}
        </p>
      </div>

      <span className="w-8" />
    </div>
  );
}
