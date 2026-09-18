import React from "react";
import { AlertCircle } from "lucide-react";
import { C, CAP_LABELS } from "../Common/constants";

export function BottleneckBadge({ bottleneck }: { bottleneck: string }) {
  const label = CAP_LABELS[bottleneck]?.toLowerCase() || bottleneck;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-xs f-sans"
      style={{
        backgroundColor: `${C.immediate}18`,
        color: C.immediate,
      }}
    >
      <AlertCircle size={11} />
      Bottleneck: {label}
    </span>
  );
}
