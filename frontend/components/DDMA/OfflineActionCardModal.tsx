'use client';

import React from "react";
import {
  X,
  Printer,
  ShieldAlert,
  MapPin,
  Radio,
  PhoneCall,
  CheckSquare,
  AlertTriangle,
  Compass,
  Building2,
  Navigation2,
} from "lucide-react";
import { C } from "../Common/constants";
import { HabitationReadinessProfile } from "@/lib/ddmaReadinessData";

export interface OfflineActionCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HabitationReadinessProfile | null;
}

export function OfflineActionCardModal({
  isOpen,
  onClose,
  profile,
}: OfflineActionCardModalProps) {
  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Print-specific style override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ddma-card,
          #printable-ddma-card * {
            visibility: visible;
          }
          #printable-ddma-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 12mm 15mm;
            border: 2px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-white border rounded-sm shadow-2xl relative f-sans my-6 max-h-[94vh] flex flex-col print:max-h-none print:border-none print:shadow-none print:my-0">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-[#22364A] text-white flex items-center justify-between rounded-t-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#E07A5F]" />
            <div>
              <p className="font-semibold text-sm">
                DDMA Printable Offline Disaster Action Card
              </p>
              <p className="text-[11px] text-[#9BA8AE]">
                Standard Operating Plan for Field Wardens when telecommunications & power grids fail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#B5462F] hover:bg-[#9E3B26] text-white font-medium text-xs rounded-xs shadow-sm cursor-pointer transition-colors"
            >
              <Printer size={15} /> 🖨️ Print Action Card (A4 / PDF)
            </button>

            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-xs text-[#9BA8AE] hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div
          id="printable-ddma-card"
          className="p-6 sm:p-8 overflow-y-auto flex-1 text-black bg-white"
        >
          {/* Official Document Header */}
          <div className="border-b-2 border-black pb-4 mb-4 text-center relative">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2 text-[10px] uppercase font-bold tracking-wider text-gray-700">
              <span>Prototype Decision-Support Framework</span>
              <span>State Disaster Management Authority ({profile.state})</span>
              <span>District Disaster Management Authority ({profile.district})</span>
            </div>

            <div className="py-1">
              <h1 className="f-serif text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                SURAKSHA EMERGENCY EVACUATION & ACTION CARD
              </h1>
              <p className="text-xs font-mono font-semibold uppercase text-gray-800 mt-0.5">
                EMERGENCY OPERATIONAL READINESS TEMPLATE · FORM DDMA-AC-01 (PROTOTYPE)
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left bg-gray-100 p-2.5 rounded-xs border border-gray-300 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 block">Habitation</span>
                <span className="font-bold text-sm text-black">{profile.habitationName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 block">District / State</span>
                <span className="font-semibold text-black">{profile.district}, {profile.state}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 block">Population & Urgency</span>
                <span className="font-semibold text-black">{profile.population.toLocaleString()} Residents ({profile.hazardTier})</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 block">PostGIS Coordinates</span>
                <span className="font-mono text-[11px] font-semibold text-black">
                  {profile.latitude.toFixed(4)}°N, {profile.longitude.toFixed(4)}°E
                </span>
              </div>
            </div>
          </div>

          {/* Core Warning Box */}
          <div className="mb-4 p-3 border-2 border-black bg-gray-50 flex items-start gap-3">
            <AlertTriangle size={24} className="shrink-0 text-black mt-0.5" />
            <div className="text-xs">
              <p className="font-black uppercase tracking-wide text-sm">
                PRIMARY HAZARD TRIGGER: {profile.primaryHazard}
              </p>
              <p className="text-gray-800 mt-0.5 leading-snug">
                This document is the legal pre-evacuation blueprint for Village Revenue Officers, Wardens, and Police Detachments. In the event of optical fiber cut or cellular blackout, follow the physical route instructions and radio frequencies below.
              </p>
            </div>
          </div>

          {/* Grid Layout: Section 1 & 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Section 1: Evacuation Route */}
            <div className="border border-black p-3 rounded-xs">
              <div className="flex items-center gap-1.5 border-b border-black pb-1.5 mb-2">
                <Navigation2 size={14} />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  1. Designated Evacuation Corridors
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-gray-100 p-2 border border-gray-300 rounded-xs">
                  <span className="text-[10px] font-black uppercase text-black block">
                    PRIMARY SAFE ROUTE:
                  </span>
                  <p className="font-bold text-black text-sm">
                    {profile.evacuationRoute.primaryRouteName}
                  </p>
                  <p className="text-[11px] text-gray-700 mt-0.5">
                    Distance: <strong>{profile.evacuationRoute.primaryDistanceKm} km</strong> · Safe Transit: <strong>~{profile.evacuationRoute.primaryTransitTimeMin} mins</strong>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-700 block">
                    Critical Chokepoints / Bottlenecks:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-gray-900 space-y-0.5 mt-0.5">
                    {profile.evacuationRoute.chokepoints.map((cp, idx) => (
                      <li key={idx} className="font-medium">{cp}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-1.5">
                  <span className="text-[10px] font-bold uppercase text-gray-700 block">
                    Secondary Alternate Route:
                  </span>
                  <p className="font-semibold text-[11px] text-black">
                    {profile.evacuationRoute.secondaryRouteName} ({profile.evacuationRoute.secondaryDistanceKm} km)
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-red-700 block">
                    Terrain Hazard Warnings:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-red-900 space-y-0.5">
                    {profile.evacuationRoute.terrainHazardWarnings.map((th, idx) => (
                      <li key={idx}>{th}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Safe Haven Shelter */}
            <div className="border border-black p-3 rounded-xs">
              <div className="flex items-center gap-1.5 border-b border-black pb-1.5 mb-2">
                <Building2 size={14} />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  2. Designated Safe Haven Shelter
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-gray-100 p-2 border border-gray-300 rounded-xs">
                  <span className="text-[10px] font-black uppercase text-black block">
                    SANCTIONED RELIEF DESTINATION:
                  </span>
                  <p className="font-bold text-black text-sm">
                    {profile.safeHaven.name}
                  </p>
                  <p className="text-[11px] text-gray-700 mt-0.5">
                    Type: <strong>{profile.safeHaven.type}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">Capacity</span>
                    <span className="font-bold text-black">{profile.safeHaven.capacityPersons} Persons</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">Structure Height</span>
                    <span className="font-bold text-black">{profile.safeHaven.elevationAboveGroundM} m above plinth</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-1.5">
                  <span className="text-[10px] font-bold uppercase text-gray-700 block">
                    Shelter In-Charge / Camp Warden:
                  </span>
                  <p className="font-bold text-sm text-black">
                    {profile.safeHaven.inChargeName}
                  </p>
                  <p className="font-mono font-bold text-xs text-blue-900">
                    📞 {profile.safeHaven.inChargePhone}
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded-xs border border-gray-200 text-[10px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Auxiliary Diesel Generator:</span>
                    <span className="font-bold">{profile.safeHaven.hasBackupPower ? "✓ EQUIPPED" : "✗ DEFICIT"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Drinking Water RO Filtration:</span>
                    <span className="font-bold">{profile.safeHaven.hasDrinkingWaterPlant ? "✓ OPERATIONAL" : "✗ DEFICIT"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Communications & Radio Frequencies */}
          <div className="border border-black p-3 rounded-xs mb-4">
            <div className="flex items-center gap-1.5 border-b border-black pb-1.5 mb-2">
              <Radio size={14} />
              <h3 className="text-xs font-black uppercase tracking-wider">
                3. Emergency Communications & Tactical Radio Directory (Zero-Tower Grid)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-1.5 bg-gray-50 border border-gray-300">
                <span className="text-[9px] font-bold uppercase text-gray-600 block">District Control Room</span>
                <span className="font-bold text-black text-[11px]">{profile.phoneTree.districtControlRoom}</span>
              </div>
              <div className="p-1.5 bg-gray-50 border border-gray-300">
                <span className="text-[9px] font-bold uppercase text-gray-600 block">State SEOC Control</span>
                <span className="font-bold text-black text-[11px]">{profile.phoneTree.stateDisasterControl}</span>
              </div>
              <div className="p-1.5 bg-gray-50 border border-gray-300">
                <span className="text-[9px] font-bold uppercase text-gray-600 block">NDRF Command</span>
                <span className="font-bold text-black text-[11px]">{profile.phoneTree.ndrfBattalionControl}</span>
              </div>
              <div className="p-1.5 bg-gray-50 border border-gray-300">
                <span className="text-[9px] font-bold uppercase text-gray-600 block">Local Tehsildar</span>
                <span className="font-bold text-black text-[11px]">{profile.phoneTree.localTehsildar}</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-gray-100 p-2 border border-gray-300">
              <div>
                <span className="text-[9px] font-black uppercase text-black">VHF / Tactical Radio Channel:</span>
                <p className="font-mono font-black text-sm text-blue-900">{profile.phoneTree.vhfRadioChannel}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-black">All India Radio (AIR) Emergency Broadcast:</span>
                <p className="font-mono font-black text-sm text-blue-900">{profile.phoneTree.allIndiaRadioEmergencyFreq}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Pre-Zero-Hour Action Checklist */}
          <div className="border border-black p-3 rounded-xs mb-4">
            <div className="flex items-center gap-1.5 border-b border-black pb-1.5 mb-2">
              <CheckSquare size={14} />
              <h3 className="text-xs font-black uppercase tracking-wider">
                4. Field Officer & Ward In-Charge Pre-Zero-Hour Checklist
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              {profile.preZeroHourChecklist.map((task, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-black rounded-xs mt-0.5 shrink-0" />
                  <span className="text-gray-900 leading-tight">{task}</span>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 border-2 border-black rounded-xs mt-0.5 shrink-0" />
                <span className="text-gray-900 leading-tight">Verify all evacuees carried water-sealed Aadhaar / ration cards.</span>
              </div>
            </div>
          </div>

          {/* Template Sign-off Footer */}
          <div className="border-t-2 border-black pt-4 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-gray-400 mb-1" />
              <p className="font-bold text-[10px] uppercase text-black">Ward In-Charge / Tehsildar</p>
              <p className="text-[9px] text-gray-500">Field Operational Command</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-gray-400 mb-1" />
              <p className="font-bold text-[10px] uppercase text-black">District Collector & DM</p>
              <p className="text-[9px] text-gray-500">Chairman, DDMA</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-gray-400 mb-1 flex items-end justify-center pb-1">
                <span className="font-mono text-[10px] font-bold text-gray-700">
                  {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
                </span>
              </div>
              <p className="font-bold text-[10px] uppercase text-black">Draft Template Date</p>
              <p className="text-[9px] text-gray-500">SURAKSHA Reference ID: SK-2026-DDMA</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close Bar (Hidden when printing) */}
        <div className="no-print p-3 bg-gray-100 border-t border-gray-300 flex items-center justify-between rounded-b-sm text-xs">
          <span className="text-gray-600">
            Tip: Press <strong>Ctrl+P</strong> or click <strong>Print Action Card</strong> to save as PDF or print on standard A4 paper.
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-400 rounded-sm hover:bg-gray-200 text-gray-800 font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
