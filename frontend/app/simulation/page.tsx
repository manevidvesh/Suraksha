'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Compass, AlertTriangle } from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { WhatIfSimulator } from "@/components/Simulation";

export default function SimulationPage() {
  const { habitations, sites, selectedHabitationId } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Simulation & AI Briefs"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="What-If Relocation Simulation & AI Briefing"
            sub="Pair an endangered source habitation with a candidate resettlement site to compute geodesic displacement, hazard reduction, and site infrastructure load, then generate an executive brief for SDMA sign-off."
            action={
              <div className="flex items-center gap-2">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <Compass size={13} /> View Map
                </Link>
                <Link
                  href="/habitations"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <AlertTriangle size={13} /> Score Settlements
                </Link>
              </div>
            }
          />

          {/* What-If Simulator with Integrated Radar & AI Decision Brief */}
          <WhatIfSimulator
            habitations={habitations}
            sites={sites}
            initialHabId={selectedHabitationId}
          />
        </main>
      </div>
    </div>
  );
}
