import React from "react";
import { Home } from "lucide-react";
import { C, CAP_ICONS, CAP_LABELS } from "../Common/constants";
import { SiteCapacity } from "@/types";

export interface CapacityBreakdownProps {
  cap: SiteCapacity | Record<string, number>;
  bottleneck: string;
  maxBaseline?: number;
}

export function CapacityBreakdown({
  cap,
  bottleneck,
  maxBaseline = 800,
}: CapacityBreakdownProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3">
      {Object.entries(cap).map(([k, v]) => {
        const Icon = (CAP_ICONS as any)[k] || Home;
        const isBottleneck = k === bottleneck;
        const numVal = Number(v) || 0;
        const pct = Math.min(100, (numVal / maxBaseline) * 100);

        return (
          <div key={k}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={13} style={{ color: isBottleneck ? C.immediate : C.inkSoft }} />
              <span
                className="f-sans text-[11px]"
                style={{ color: isBottleneck ? C.immediate : C.inkSoft }}
              >
                {(CAP_LABELS as any)[k] || k}
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: C.paperDim }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isBottleneck ? C.immediate : C.pine,
                }}
              />
            </div>
            <p className="f-mono text-xs mt-1" style={{ color: C.ink }}>
              {numVal}
            </p>
          </div>
        );
      })}
    </div>
  );
}
