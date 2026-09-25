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
  { id: "dashboard", label: "Overview", href: "/dashboard", icon: Home },
  { id: "risk-map", label: "Multi-Hazard Map", href: "/risk-map", icon: Compass },
  { id: "habitations", label: "Habitation Risk", href: "/habitations", icon: AlertTriangle },
  { id: "relocation", label: "Relocation Intelligence", href: "/relocation", icon: MapPin },
  { id: "simulation", label: "What-If Simulation", href: "/simulation", icon: Sliders },
  { id: "sources", label: "Evidence & Sources", href: "/sources", icon: Database },
];

export const SECONDARY_NAV: NavItem[] = [];

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
    if (item.id === "dashboard" && pathname === "/") return true;
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
                SURAKSHA PROTOTYPE · SIH DEMO
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

      <div className="mt-auto border-t border-[#152331]">
        <div className="px-4 py-2 bg-[#0c141d] border-b border-[#152331]">
          <div
            className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-xs bg-[#1A2837] border border-[#22364A] text-[#EFECE4]"
            title="Simulated Event Feeds · Prototype Datasets · Decision-Support Outputs"
          >
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-[#E07A5F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-pulse" />
              SIH DEMO MODE
            </span>
            <span className="text-[9px] text-[#9BA8AE]">Simulated/DSS</span>
          </div>
        </div>

        <div className="px-4 py-3 f-sans text-[11px] bg-[#101C27]/60">
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
            Disaster Relocation Decision Support · Representative Corridors
          </p>
        </div>
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
