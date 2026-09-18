import React from "react";
import { C } from "./constants";

export function SectionHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
      <div>
        <h1 className="f-serif text-[26px] leading-tight" style={{ color: C.ink }}>
          {title}
        </h1>
        {sub && (
          <p className="f-sans text-sm mt-1 max-w-xl" style={{ color: C.inkSoft }}>
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
