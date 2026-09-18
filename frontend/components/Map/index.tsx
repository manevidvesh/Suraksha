'use client';

import dynamic from "next/dynamic";
import React from "react";

export const MapLibreView = dynamic(() => import("./MapLibreView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 flex items-center justify-center bg-[#EFECE4] text-xs text-[#565F58]">
      Loading GIS Map…
    </div>
  ),
});

export default MapLibreView;
