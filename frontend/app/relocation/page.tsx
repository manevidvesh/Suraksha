'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Sliders, Compass, Info } from "lucide-react";
import { useRiskData } from "@/hooks/useRiskData";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";
import { SiteList } from "@/components/SiteRanking";

export default function RelocationSitesPage() {
  const { sites, minCap, setMinCap, loadingSites } = useRiskData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Relocation Sites"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Candidate Resettlement Sites"
            sub="Sites evaluated and ranked by effective carrying capacity — determined strictly by the tightest infrastructure bottleneck, not misleading arithmetic averages."
            action={
              <div className="flex items-center gap-2">
                <Link
                  href="/risk-map"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors"
                  style={{ borderColor: C.line }}
                >
                  <Compass size={13} /> View on Map
                </Link>
                <Link
                  href="/simulation"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  <Sliders size={13} /> Run What-If Model
                </Link>
              </div>
            }
          />

          {/* Candidate Screening & Field Verification Notice Banner */}
          <div className="mb-4 p-2.5 rounded-sm bg-[#FFF9EE] border border-[#C0872B]/40 flex items-center justify-between gap-2 text-xs text-[#8C5D17]">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-[#C0872B] shrink-0" />
              <span>
                <strong>Candidate Screening Notice:</strong> Sites listed are model-assessed alternatives. Comprehensive ground-truth geotechnical investigation by the competent geotechnical authority or qualified geotechnical professionals, hydrological assessment, and revenue title clearance by competent authorities are required prior to any resettlement action.
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white border border-[#C0872B]/40 font-semibold shrink-0">
              FIELD VERIFICATION REQUIRED
            </span>
          </div>

          {/* Educational Callout Banner */}
          <div
            className="border rounded-sm p-4 mb-6 bg-white flex items-start gap-3"
            style={{ borderColor: C.line }}
          >
            <Info size={18} className="text-[#3E5E82] mt-0.5 shrink-0" />
            <div className="text-xs text-[#565F58] leading-relaxed">
              <span className="font-semibold text-[#1C2420]">
                Liebig's Law of the Minimum in Spatial Planning:
              </span>{" "}
              A candidate site may possess ample land for 800 residents, but if its local water supply or sanitation system can only support 250, the <em>effective carrying capacity</em> is capped at 250. Expanding capacity requires targeting the explicit bottleneck before executing mass relocations.
            </div>
          </div>

          {/* Site Ranking List Component */}
          <div className="border rounded-sm p-5 bg-white" style={{ borderColor: C.line }}>
            <SiteList
              sites={sites}
              minCap={minCap}
              setMinCap={setMinCap}
              loading={loadingSites}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
