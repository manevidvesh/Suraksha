import React from "react";
import { C } from "./constants";

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 50,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="f-sans text-xs" style={{ color: C.inkSoft }}>
          {label}
        </label>
        <span className="f-mono text-xs" style={{ color: C.ink }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: C.slate }}
        className="w-full h-1.5 cursor-pointer"
      />
    </div>
  );
}
