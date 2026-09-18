import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { C } from "./constants";

export function EmptyState({
  icon: Icon = Search,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon?: any;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 border rounded-sm"
      style={{ borderColor: C.line }}
    >
      <Icon size={28} strokeWidth={1.5} style={{ color: C.inkSoft }} />
      <p className="f-sans text-sm font-medium mt-3" style={{ color: C.ink }}>
        {title}
      </p>
      <p className="f-sans text-sm mt-1 max-w-sm" style={{ color: C.inkSoft }}>
        {body}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="f-sans text-sm mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-sm hover:bg-white focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors"
          style={{ borderColor: C.line, color: C.slate }}
        >
          <RotateCcw size={14} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
