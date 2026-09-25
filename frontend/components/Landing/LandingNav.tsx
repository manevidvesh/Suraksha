'use client';

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Menu, X, ArrowRight, Compass, LayoutDashboard, Sliders, MapPin, Activity, Database } from "lucide-react";

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Technical Status Ribbon */}
      <div className="bg-[#0E1721] px-6 sm:px-12 py-1.5 border-b border-white/5 text-[11px] text-[#7C8A90] flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2A6B52] animate-pulse" />
          <span className="font-mono text-white/90">SURAKSHA PROTOTYPE</span>
          <span className="text-white/30">·</span>
          <span className="hidden sm:inline">Disaster Risk &amp; Relocation Decision-Support Engine</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="hidden md:inline text-[#9BA8AE]">5 Regional Planning Corridors</span>
          <span className="text-white/30 hidden md:inline">|</span>
          <span className="text-white/70">WGS84 / PostGIS</span>
          <span className="px-1.5 py-0.2 rounded-xs bg-[#B5462F]/20 text-[#E07A5F] border border-[#B5462F]/30 font-bold">
            SIH 2026
          </span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="px-6 sm:px-12 py-3.5 flex items-center justify-between border-b border-white/10 bg-[#152331]/95 backdrop-blur-md sticky top-0 z-40">
        {/* Logo / Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-sm bg-[#B5462F] flex items-center justify-center text-white font-bold shadow-md shadow-[#B5462F]/30 group-hover:bg-[#C84F36] transition-colors">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="f-serif text-lg font-bold tracking-tight text-[#F7F5F1] leading-none">
                SURAKSHA
              </span>
              <span className="px-1.5 py-0.5 text-[9.5px] uppercase font-bold rounded-xs bg-white/10 text-[#C7D0D4] tracking-wider border border-white/10 font-mono">
                DSS
              </span>
            </div>
            <p className="text-[10px] text-[#9BA8AE] font-mono leading-none mt-1">
              SDMA / DDMA Decision Support
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links (The 6 Core Modules) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium" aria-label="Landing Navigation">
          <Link
            href="/dashboard"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/risk-map"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Multi-Hazard Map
          </Link>
          <Link
            href="/habitations"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Habitation Risk
          </Link>
          <Link
            href="/relocation"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Relocation Intelligence
          </Link>
          <Link
            href="/simulation"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            What-If Simulation
          </Link>
          <Link
            href="/sources"
            className="text-[#C7D0D4] hover:text-white transition-colors"
          >
            Evidence &amp; Sources
          </Link>
        </nav>

        {/* Header Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-sm bg-[#F7F5F1] text-[#152331] hover:bg-white transition-colors shadow-sm cursor-pointer"
          >
            <span>Launch DSS</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-sm text-[#C7D0D4] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] z-50 bg-[#0E1721]/95 backdrop-blur-lg border-b border-white/10 p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#7C8A90] px-2 block mb-2 font-bold">
              Core Decision-Support Modules
            </span>

            {[
              { href: "/dashboard", label: "Executive Overview", icon: LayoutDashboard },
              { href: "/risk-map", label: "Multi-Hazard Spatial Map", icon: Compass },
              { href: "/habitations", label: "Habitation Risk Assessment", icon: Sliders },
              { href: "/relocation", label: "Relocation Intelligence & Matching", icon: MapPin },
              { href: "/simulation", label: "What-If Relocation Simulation", icon: Activity },
              { href: "/sources", label: "Data Lineage & Evidence Catalog", icon: Database },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-sm text-sm text-[#C7D0D4] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon size={16} className="text-[#3E5E82]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-[#F7F5F1] text-[#152331] font-semibold text-xs shadow-md"
            >
              <span>Open SURAKSHA Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
