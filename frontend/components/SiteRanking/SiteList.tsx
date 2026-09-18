'use client';

import React, { useState, useMemo } from "react";
import { MapPin, RotateCcw, Loader2, Filter } from "lucide-react";
import { CandidateSite } from "@/types";
import { C } from "../Common/constants";
import { EmptyState } from "../Common/EmptyState";
import { SiteCard } from "./SiteCard";
import { CorridorSelector, filterSitesByCorridor, CORRIDORS } from "../Common";

export interface SiteListProps {
  sites: CandidateSite[];
  minCap: number;
  setMinCap: (cap: number) => void;
  loading?: boolean;
}

export function SiteList({ sites, minCap, setMinCap, loading }: SiteListProps) {
  const [openId, setOpenId] = useState<string | null>(sites[0]?.id || null);
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");

  const corridorSites = useMemo(() => {
    return filterSitesByCorridor(sites, selectedCorridor);
  }, [sites, selectedCorridor]);

  const filteredSites = useMemo(() => {
    return corridorSites.filter((s) => s.eff.value >= minCap);
  }, [corridorSites, minCap]);

  return (
    <div>
      {/* Region / Corridor Filter Tabs */}
      <div className="mb-4">
        <CorridorSelector
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
        />
      </div>

      {/* Capacity Slider & Stats */}
      <div className="flex items-center gap-3 mb-4 flex-wrap pt-2 border-t border-[#D9D4C7]/60">
        <label className="f-sans text-xs" style={{ color: C.inkSoft }}>
          Minimum effective capacity
        </label>
        <input
          type="range"
          min={0}
          max={600}
          step={50}
          value={minCap}
          onChange={(e) => setMinCap(Number(e.target.value))}
          style={{ accentColor: C.slate }}
          className="w-40 cursor-pointer"
        />
        <span className="f-mono text-xs font-semibold" style={{ color: C.ink }}>
          {minCap}+ people
        </span>
        {minCap > 0 && (
          <button
            onClick={() => setMinCap(0)}
            className="f-sans text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
            style={{ color: C.slate }}
          >
            <RotateCcw size={11} /> Clear filter
          </button>
        )}
        {loading && <Loader2 size={13} className="animate-spin text-[#565F58]" />}
        <span className="text-xs text-[#565F58] ml-auto font-mono">
          Showing {filteredSites.length} of {sites.length} sites
        </span>
      </div>

      {filteredSites.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No sites meet this filter"
          body="Try selecting 'All Regions' or lower the minimum effective capacity slider."
          actionLabel="Reset filters"
          onAction={() => {
            setMinCap(0);
            setSelectedCorridor("all");
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredSites.map((s: CandidateSite) => (
            <SiteCard
              key={s.id}
              site={s}
              isOpen={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
