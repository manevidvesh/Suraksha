'use client';

import React from "react";
import { ChevronRight } from "lucide-react";
import { Habitation } from "@/types";
import { C } from "../Common/constants";
import { TierBadge } from "../Common/Badges";

export interface HabitationTableProps {
  habitations: Habitation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function HabitationTable({
  habitations,
  selectedId,
  onSelect,
}: HabitationTableProps) {
  if (habitations.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[#565F58] border rounded-sm" style={{ borderColor: C.line }}>
        No habitations match your criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-sm overflow-hidden" style={{ borderColor: C.line }}>
      <div className="overflow-x-auto">
        <table className="w-full f-sans text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: C.line, backgroundColor: C.paperDim }}>
              <th className="px-3 py-2 font-medium" style={{ color: C.inkSoft }}>Habitation</th>
              <th className="px-3 py-2 font-medium" style={{ color: C.inkSoft }}>Score</th>
              <th className="px-3 py-2 font-medium" style={{ color: C.inkSoft }}>Priority Tier</th>
              <th className="px-3 py-2 font-medium hidden sm:table-cell" style={{ color: C.inkSoft }}>Population</th>
              <th className="px-3 py-2 font-medium hidden md:table-cell" style={{ color: C.inkSoft }}>Events</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {habitations.map((h: Habitation) => {
              const isSelected = selectedId === h.id;
              return (
                <tr
                  key={h.id}
                  onClick={() => onSelect(h.id)}
                  className="border-b last:border-0 cursor-pointer hover:bg-white transition-colors"
                  style={{
                    borderColor: C.line,
                    backgroundColor: isSelected ? C.paperDim : "transparent",
                  }}
                >
                  <td className="px-3 py-2.5">
                    <p className="font-medium" style={{ color: C.ink }}>{h.name}</p>
                    <p className="text-xs" style={{ color: C.inkSoft }}>
                      {h.region} · {h.hazard}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 f-mono font-medium">{h.score}</td>
                  <td className="px-3 py-2.5">
                    <TierBadge tier={h.tier} />
                  </td>
                  <td className="px-3 py-2.5 f-mono hidden sm:table-cell">
                    {h.pop.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 f-mono text-xs hidden md:table-cell">
                    {h.events}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <ChevronRight size={14} style={{ color: C.inkSoft }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
