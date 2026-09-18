'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  AlertTriangle,
  MapPin,
  Sliders,
  Clock,
  Database,
  Upload as UploadIcon,
  ShieldAlert,
  Compass,
  ClipboardCheck,
} from "lucide-react";
import { C } from "../Common/constants";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Home },
  { id: "risk-map", label: "Multi-Hazard Map", href: "/risk-map", icon: Compass },
  { id: "habitations", label: "Risk Scoring", href: "/habitations", icon: AlertTriangle },
  { id: "relocation", label: "Relocation Sites", href: "/relocation", icon: MapPin },
  { id: "simulation", label: "What-If Simulator", href: "/simulation", icon: Sliders },
];

export const SECONDARY_NAV: NavItem[] = [
  { id: "readiness", label: "DDMA Readiness & Cards", href: "/readiness", icon: ClipboardCheck },
  { id: "sources", label: "Data Sources", href: "/sources", icon: Database },
  { id: "data", label: "Data Ingestion", href: "/data", icon: UploadIcon },
  { id: "history", label: "Disaster History", href: "/history", icon: Clock },
];

export function Sidebar({
  view,
  setView,
  mobileOpen,
  setMobileOpen,
}: {
  view?: string;
  setView?: (v: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const isCurrentActive = (item: NavItem) => {
    if (view && setView) {
      return view === item.id;
    }
    if (pathname === item.href) return true;
    if (item.id === "data" && (pathname === "/data" || pathname === "/upload")) return true;
    return false;
  };

  const handleClick = (item: NavItem) => {
    if (setView) {
      setView(item.id);
    }
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const body = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#152331]">
        <Link href="/" className="group block">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#B5462F] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-bold text-[#9BA8AE]">
                Government of India
              </p>
              <p className="f-serif text-lg font-bold tracking-tight text-[#F7F5F1] group-hover:text-white transition-colors leading-none mt-0.5">
                SURAKSHA
              </p>
            </div>
          </div>
          <p className="f-sans text-[10.5px] mt-2 text-[#9BA8AE] leading-tight">
            SDMA / DDMA Disaster Relocation Decision Support System
          </p>
        </Link>
      </div>

      <div className="px-3 pt-3 pb-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9BA8AE]/70 f-sans">
          Core Workflows
        </p>
      </div>

      <nav className="py-1 space-y-0.5" aria-label="Primary">
        {NAV_ITEMS.map((n) => {
          const active = isCurrentActive(n);
          const Icon = n.icon;

          if (setView) {
            return (
              <button
                key={n.id}
                aria-current={active ? "page" : undefined}
                onClick={() => handleClick(n)}
                className="w-full flex items-center gap-3 px-5 py-2.5 f-sans text-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset cursor-pointer transition-colors"
                style={{
                  color: active ? C.paper : "#9BA8AE",
                  backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                  borderLeft: `2px solid ${active ? C.paper : "transparent"}`,
                }}
              >
                <Icon size={16} strokeWidth={1.75} />
                {n.label}
              </button>
            );
          }

          return (
            <Link
              key={n.id}
              href={n.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className="w-full flex items-center gap-3 px-5 py-2.5 f-sans text-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset cursor-pointer transition-colors"
              style={{
                color: active ? C.paper : "#9BA8AE",
                backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                borderLeft: `2px solid ${active ? C.paper : "transparent"}`,
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 pb-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#9BA8AE]/70 f-sans">
          Data & Operations
        </p>
      </div>

      <div className="py-1 space-y-0.5">
        {SECONDARY_NAV.map((n) => {
          const active = isCurrentActive(n);
          const Icon = n.icon;

          if (setView) {
            return (
              <button
                key={n.id}
                aria-current={active ? "page" : undefined}
                onClick={() => handleClick(n)}
                className="w-full flex items-center gap-3 px-5 py-2 f-sans text-xs text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset cursor-pointer transition-colors"
                style={{
                  color: active ? C.paper : "#9BA8AE",
                  backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                  borderLeft: `2px solid ${active ? C.paper : "transparent"}`,
                }}
              >
                <Icon size={14} strokeWidth={1.75} />
                {n.label}
              </button>
            );
          }

          return (
            <Link
              key={n.id}
              href={n.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className="w-full flex items-center gap-3 px-5 py-2 f-sans text-xs text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset cursor-pointer transition-colors"
              style={{
                color: active ? C.paper : "#9BA8AE",
                backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                borderLeft: `2px solid ${active ? C.paper : "transparent"}`,
              }}
            >
              <Icon size={14} strokeWidth={1.75} />
              {n.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-4 py-3.5 border-t border-[#152331] f-sans text-[11px] bg-[#101C27]/60">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-[#3D6B5C] animate-pulse" />
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#9BA8AE]">
            Authorized Official
          </p>
        </div>
        <p className="font-semibold text-[#F7F5F1] leading-tight">
          District Collector & DDMA Chairperson
        </p>
        <p className="mt-0.5 text-[10px] text-[#9BA8AE]/80">
          Disaster Management Act 2005 · All-India
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden lg:flex lg:flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-[#152331]"
        style={{ backgroundColor: C.slate }}
      >
        {body}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 h-full" style={{ backgroundColor: C.slate }}>
            {body}
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="flex-1 bg-black/30"
          />
        </div>
      )}
    </>
  );
}
