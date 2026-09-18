'use client';

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { C } from "../Common/constants";

export interface RadarDataPoint {
  metric: string;
  Before: number;
  After: number;
}

export interface RiskRadarChartProps {
  data: RadarDataPoint[];
  height?: number;
}

export function RiskRadarChart({ data, height = 260 }: RiskRadarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-[#565F58]"
        style={{ height }}
      >
        No radar comparison data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke={C.line} />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: C.inkSoft }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: C.inkSoft }} />
          <Radar
            name="Before Relocation"
            dataKey="Before"
            stroke={C.immediate}
            fill={C.immediate}
            fillOpacity={0.18}
          />
          <Radar
            name="After Relocation"
            dataKey="After"
            stroke={C.pine}
            fill={C.pine}
            fillOpacity={0.22}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "IBM Plex Sans" }} />
          <Tooltip contentStyle={{ fontSize: 12, fontFamily: "IBM Plex Sans" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
