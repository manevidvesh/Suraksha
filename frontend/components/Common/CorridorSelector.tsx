'use client';

import React from "react";
import { Compass, Layers } from "lucide-react";
import { Habitation, CandidateSite } from "@/types";

export interface Corridor {
  id: string;
  name: string;
  shortLabel: string;
  stateDesc: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export const CORRIDORS: Corridor[] = [
  {
    id: "all",
    name: "All India · Complete National Overview",
    shortLabel: "Complete Overview",
    stateDesc: "All 4 national pilot corridors active",
    center: [78.9, 20.5],
    zoom: 4.6,
  },
  {
    id: "western_ghats",
    name: "Zone 7: Western Ghats Corridor",
    shortLabel: "Western Ghats",
    stateDesc: "Kerala & Karnataka Hill Corridors (Wayanad, Idukki, Kodagu)",
    center: [76.2, 11.2],
    zoom: 7.2,
  },
  {
    id: "himalayas",
    name: "Himalayan Corridor",
    shortLabel: "Himalayas",
    stateDesc: "Uttarakhand Upper Garhwal (Joshimath & Kedarnath)",
    center: [79.4, 30.6],
    zoom: 8.4,
  },
  {
    id: "eastern_plains",
    name: "Eastern Plains & Delta",
    shortLabel: "Eastern Plains",
    stateDesc: "West Bengal & Delta Coast (Sundarbans, Digha, Teesta)",
    center: [88.2, 23.2],
    zoom: 6.8,
  },
  {
    id: "northeast",
    name: "North-East Corridor",
    shortLabel: "North-East",
    stateDesc: "Assam Brahmaputra Basin (Majuli Island & Jorhat)",
    center: [94.2, 26.8],
    zoom: 8.5,
  },
];

export function filterHabitationsByCorridor(habitations: Habitation[], corridorId: string): Habitation[] {
  if (!corridorId || corridorId === "all") return habitations;

  return habitations.filter((h) => {
    const text = `${h.name} ${h.region} ${h.district || ""} ${h.state || ""}`.toLowerCase();
    if (corridorId === "western_ghats") {
      return (
        text.includes("wayanad") ||
        text.includes("ernakulam") ||
        text.includes("idukki") ||
        text.includes("kodagu") ||
        text.includes("kannur") ||
        text.includes("chellanam") ||
        text.includes("shirur") ||
        text.includes("kavalapara") ||
        text.includes("meppadi") ||
        text.includes("alappuzha") ||
        text.includes("kuttanad") ||
        text.includes("uttara kannada") ||
        text.includes("kerala") ||
        text.includes("karnataka")
      );
    }
    if (corridorId === "himalayas") {
      return (
        text.includes("chamoli") ||
        text.includes("rudraprayag") ||
        text.includes("joshimath") ||
        text.includes("kedarnath") ||
        text.includes("dharasu") ||
        text.includes("bhagirathi") ||
        text.includes("uttarkashi") ||
        text.includes("garhwal") ||
        text.includes("uttarakhand")
      );
    }
    if (corridorId === "eastern_plains") {
      return (
        text.includes("sundarbans") ||
        text.includes("digha") ||
        text.includes("teesta") ||
        text.includes("darjeeling") ||
        text.includes("medinipur") ||
        text.includes("bengal")
      );
    }
    if (corridorId === "northeast") {
      return (
        text.includes("majuli") ||
        text.includes("jorhat") ||
        text.includes("brahmaputra") ||
        text.includes("champhai") ||
        text.includes("mizoram") ||
        text.includes("assam")
      );
    }
    return true;
  });
}

export function filterSitesByCorridor(sites: CandidateSite[], corridorId: string): CandidateSite[] {
  if (!corridorId || corridorId === "all") return sites;

  return sites.filter((s) => {
    const text = `${s.name} ${s.region || ""}`.toLowerCase();
    if (corridorId === "western_ghats") {
      return (
        text.includes("meenangadi") ||
        text.includes("perumbavoor") ||
        text.includes("kannur") ||
        text.includes("wayanad") ||
        text.includes("ernakulam") ||
        text.includes("malabar") ||
        text.includes("kerala")
      );
    }
    if (corridorId === "himalayas") {
      return text.includes("gopeshwar") || text.includes("chamoli") || text.includes("uttarakhand");
    }
    if (corridorId === "eastern_plains") {
      return text.includes("bankura") || text.includes("bengal");
    }
    if (corridorId === "northeast") {
      return text.includes("jorhat") || text.includes("assam");
    }
    return true;
  });
}

export function filterHistoryByCorridor(
  history: { place: string; type: string; impact: string; severity?: string; year?: number }[],
  corridorId: string
): any[] {
  if (!corridorId || corridorId === "all") return history;

  return history.filter((e) => {
    const text = `${e.place} ${e.type} ${e.impact}`.toLowerCase();
    if (corridorId === "western_ghats") {
      return (
        text.includes("chellanam") ||
        text.includes("kavalapara") ||
        text.includes("munnar") ||
        text.includes("wayanad") ||
        text.includes("idukki") ||
        text.includes("kodagu") ||
        text.includes("kerala") ||
        text.includes("karnataka")
      );
    }
    if (corridorId === "himalayas") {
      return (
        text.includes("joshimath") ||
        text.includes("kedarnath") ||
        text.includes("chamoli") ||
        text.includes("uttarkashi") ||
        text.includes("uttarakhand") ||
        text.includes("garhwal")
      );
    }
    if (corridorId === "eastern_plains") {
      return (
        text.includes("sundarbans") ||
        text.includes("teesta") ||
        text.includes("digha") ||
        text.includes("bengal") ||
        text.includes("darjeeling")
      );
    }
    if (corridorId === "northeast") {
      return (
        text.includes("majuli") ||
        text.includes("jorhat") ||
        text.includes("assam") ||
        text.includes("brahmaputra") ||
        text.includes("champhai")
      );
    }
    return true;
  });
}

export function filterRedZonesByCorridor(
  redZonesGeoJSON: any,
  corridorId: string,
  matchingHabitations?: Habitation[]
): any {
  if (!corridorId || corridorId === "all") return redZonesGeoJSON;
  if (!redZonesGeoJSON || !Array.isArray(redZonesGeoJSON.features)) return redZonesGeoJSON;

  const validHabIds = matchingHabitations ? new Set(matchingHabitations.map((h) => h.id)) : null;

  const filteredFeatures = redZonesGeoJSON.features.filter((f: any) => {
    const p = f.properties || {};
    // If matching habitations were provided, match habitation_id
    if (validHabIds && p.habitation_id && validHabIds.has(p.habitation_id)) {
      return true;
    }

    const text = `${p.id || ""} ${p.zone_code || ""} ${p.name || ""} ${p.description || ""} ${p.habitation_id || ""}`.toLowerCase();
    if (corridorId === "western_ghats") {
      return (
        text.includes("way") ||
        text.includes("ern") ||
        text.includes("mun") ||
        text.includes("kut") ||
        text.includes("shi") ||
        text.includes("kl") ||
        text.includes("ka") ||
        text.includes("wayanad") ||
        text.includes("chellanam") ||
        text.includes("munnar") ||
        text.includes("kuttanad") ||
        text.includes("shirur") ||
        text.includes("idukki") ||
        text.includes("kodagu") ||
        text.includes("kerala") ||
        text.includes("karnataka")
      );
    }
    if (corridorId === "himalayas") {
      return (
        text.includes("jos") ||
        text.includes("ked") ||
        text.includes("uk") ||
        text.includes("joshimath") ||
        text.includes("kedarnath") ||
        text.includes("chamoli") ||
        text.includes("uttarakhand") ||
        text.includes("garhwal") ||
        text.includes("dharasu")
      );
    }
    if (corridorId === "eastern_plains") {
      return (
        text.includes("tst") ||
        text.includes("sun") ||
        text.includes("wb") ||
        text.includes("teesta") ||
        text.includes("sundarbans") ||
        text.includes("digha") ||
        text.includes("bengal")
      );
    }
    if (corridorId === "northeast") {
      return (
        text.includes("maj") ||
        text.includes("as") ||
        text.includes("majuli") ||
        text.includes("jorhat") ||
        text.includes("assam") ||
        text.includes("brahmaputra") ||
        text.includes("champhai")
      );
    }
    return false;
  });

  return {
    ...redZonesGeoJSON,
    features: filteredFeatures,
  };
}

export interface CorridorSelectorProps {
  selectedCorridor: string;
  onSelectCorridor: (corridorId: string) => void;
  className?: string;
  showDetails?: boolean;
}

export function CorridorSelector({
  selectedCorridor,
  onSelectCorridor,
  className = "",
  showDetails = true,
}: CorridorSelectorProps) {
  const current = CORRIDORS.find((c) => c.id === selectedCorridor) || CORRIDORS[0];

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[#565F58] font-medium">
          <Compass size={13} className="text-[#3E5E82]" />
          <span>Regional Planning Corridor:</span>
        </div>
        {showDetails && (
          <span className="text-[11px] text-[#565F58]/80 font-mono hidden sm:inline">
            Focus: <strong className="text-[#1C2420]">{current.name}</strong>
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CORRIDORS.map((c) => {
          const isSelected = c.id === selectedCorridor;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCorridor(c.id)}
              className={`px-3 py-1.5 text-xs rounded-sm border transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#22364A] text-white border-[#22364A] font-semibold shadow-xs"
                  : "bg-white text-[#565F58] border-[#D9D4C7] hover:bg-[#F7F5F1] hover:text-[#1C2420]"
              }`}
              title={c.stateDesc}
            >
              {c.id === "all" ? <Layers size={12} /> : <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? "#F7F5F1" : "#3E5E82" }} />}
              {c.shortLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
