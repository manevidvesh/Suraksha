'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload as UploadIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCcw,
  Download,
  FileSpreadsheet,
  FileCode,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { UploadResult } from "@/types";
import { C } from "@/components/Common/constants";
import { SectionHead } from "@/components/Common/SectionHead";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TopBar } from "@/components/Navigation/TopBar";

export default function DataPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "dragging" | "loading" | "success" | "error">("idle");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorDetail, setErrorDetail] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recentUploads, setRecentUploads] = useState<UploadResult[]>([
    {
      filename: "wayanad_panchayat_survey_2025.csv",
      file_type: "Delimited Survey CSV",
      record_count: 84,
      fields_mapped: ["name", "region", "hazard", "pop", "latitude"],
      flagged_for_review: 0,
      status: "success",
      message: "84 settlement survey records ingested into PostGIS layer.",
    },
    {
      filename: "western_ghats_flood_inundation.geojson",
      file_type: "GeoJSON FeatureCollection",
      record_count: 16,
      fields_mapped: ["geometry", "hazard_type", "severity"],
      flagged_for_review: 0,
      status: "success",
      message: "16 flood polygon boundaries validated against EPSG:4326.",
    },
  ]);

  const handleFileUpload = async (file: File) => {
    setStatus("loading");
    setErrorDetail("");
    try {
      const res = await api.uploadFile(file);
      setUploadResult(res);
      setStatus(res.status === "success" ? "success" : "error");
      if (res.status === "success") {
        setRecentUploads((prev) => [res, ...prev]);
      } else {
        setErrorDetail(res.message);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorDetail(err.message || "Failed to upload file to backend.");
    }
  };

  const handleSimulateUpload = async (willError: boolean = false) => {
    setStatus("loading");
    setErrorDetail("");
    try {
      const dummyCsv = willError
        ? "corrupted,file\nunknown,data"
        : "name,region,hazard,pop,latitude,longitude\nAttamala Settlement,Wayanad,Landslide,320,11.5241,76.1482\nChooralmala Hamlet,Wayanad,Debris Flow,410,11.5392,76.1620\n";
      const file = new File([dummyCsv], "simulated_wayanad_survey.csv", { type: "text/csv" });

      if (willError) {
        throw new Error("Row 87 missing required EPSG:4326 coordinate fields.");
      }

      const res = await api.uploadFile(file);
      setUploadResult(res);
      setStatus("success");
      setRecentUploads((prev) => [res, ...prev]);
    } catch (err: any) {
      setStatus("error");
      setErrorDetail(err.message);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent =
      "name,region,hazard,pop,latitude,longitude\nSample Settlement 1,Wayanad,Landslide,250,11.5510,76.1280\nSample Settlement 2,Idukki,Flood,180,9.8500,76.9700\n";
    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suraksha_survey_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="f-sans flex min-h-screen" style={{ backgroundColor: C.paper }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 min-w-0">
        <TopBar
          title="SURAKSHA Spatial Data Ingestion"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="px-5 sm:px-8 py-7 max-w-6xl">
          <SectionHead
            title="Spatial Data Ingestion & Management"
            sub="Ingest field survey spreadsheets, shapefiles, or GeoJSON vector layers into the SURAKSHA PostGIS spatial repository. Geometries are verified against WGS84 (EPSG:4326)."
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-sm hover:bg-white text-[#22364A] transition-colors cursor-pointer"
                  style={{ borderColor: C.line }}
                >
                  <Download size={13} /> Download Sample CSV
                </button>
                <Link
                  href="/sources"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-sm text-white bg-[#22364A] hover:bg-[#3E5E82] transition-colors"
                >
                  <Database size={13} /> View Data Sources
                </Link>
              </div>
            }
          />

          {/* Upload Drop Zone */}
          <div className="mb-8">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv,.geojson,.json,.shp,.zip"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setStatus("dragging");
              }}
              onDragLeave={() => setStatus("idle")}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed rounded-sm p-10 flex flex-col items-center text-center transition-colors bg-white"
              style={{
                borderColor: status === "dragging" ? C.slate : C.line,
                backgroundColor: status === "dragging" ? C.paperDim : "#FFFFFF",
              }}
            >
              {status === "idle" || status === "dragging" ? (
                <>
                  <div className="p-3 rounded-full bg-[#22364A]/10 text-[#22364A] mb-2">
                    <UploadIcon size={26} strokeWidth={1.5} />
                  </div>
                  <h3 className="f-serif text-lg font-semibold text-[#1C2420]">
                    Drag and drop your survey dataset here
                  </h3>
                  <p className="f-sans text-xs mt-1 text-[#565F58] max-w-md">
                    Accepts <code>.csv</code>, <code>.geojson</code>, or zipped <code>.shp</code> shapefiles. Automatically maps settlement coordinates, population, and hazard classifications.
                  </p>

                  <div className="flex gap-2.5 mt-5 flex-wrap justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-sm text-white text-xs font-medium bg-[#22364A] hover:bg-[#3E5E82] cursor-pointer transition-colors"
                    >
                      Select File to Upload
                    </button>
                    <button
                      onClick={() => handleSimulateUpload(false)}
                      className="px-4 py-2 rounded-sm border text-xs font-medium hover:bg-[#F7F5F1] text-[#22364A] cursor-pointer transition-colors"
                      style={{ borderColor: C.line }}
                    >
                      Simulate CSV Upload (Quick Test)
                    </button>
                  </div>
                </>
              ) : status === "loading" ? (
                <div className="py-6 flex flex-col items-center">
                  <Loader2 size={28} className="animate-spin text-[#22364A] mb-3" />
                  <p className="text-sm font-semibold text-[#1C2420]">
                    Validating spatial topology and attributes…
                  </p>
                  <p className="text-xs text-[#565F58] mt-1">
                    Ingesting into SURAKSHA PostGIS repository with EPSG:4326 verification
                  </p>
                </div>
              ) : status === "success" ? (
                <div className="py-4 flex flex-col items-center max-w-md">
                  <div className="p-2.5 rounded-full bg-[#3D6B5C]/15 text-[#3D6B5C] mb-2">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-sm font-semibold text-[#1C2420]">
                    {uploadResult?.filename} ingested successfully
                  </p>
                  <p className="text-xs text-[#565F58] mt-1">{uploadResult?.message}</p>

                  {uploadResult?.fields_mapped && uploadResult.fields_mapped.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {uploadResult.fields_mapped.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] font-mono bg-[#EFECE4] text-[#1C2420] rounded-xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-xs px-3 py-1.5 border rounded-sm hover:bg-[#F7F5F1] text-[#22364A] cursor-pointer inline-flex items-center gap-1"
                      style={{ borderColor: C.line }}
                    >
                      <RefreshCcw size={12} /> Upload another file
                    </button>
                    <Link
                      href="/habitations"
                      className="text-xs px-3 py-1.5 bg-[#22364A] text-white rounded-sm font-medium hover:bg-[#3E5E82] cursor-pointer inline-flex items-center gap-1"
                    >
                      View in Scored Settlements <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center max-w-md">
                  <div className="p-2.5 rounded-full bg-[#B5462F]/15 text-[#B5462F] mb-2">
                    <XCircle size={28} />
                  </div>
                  <p className="text-sm font-semibold text-[#B5462F]">
                    Upload validation encountered an error
                  </p>
                  <p className="text-xs text-[#565F58] mt-1">{errorDetail}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-4 py-1.5 border rounded-sm hover:bg-[#F7F5F1] text-xs font-medium text-[#22364A] cursor-pointer"
                    style={{ borderColor: C.line }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Ingested Datasets Table */}
          <div className="border rounded-sm bg-white" style={{ borderColor: C.line }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: C.line }}>
              <h3 className="f-serif text-base font-semibold text-[#1C2420]">
                Active Ingested Datasets
              </h3>
              <span className="text-xs text-[#565F58] font-mono">
                {recentUploads.length} layers active
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: C.line }}>
              {recentUploads.map((ds, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-center justify-between gap-4 flex-wrap hover:bg-[#F7F5F1] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xs bg-[#EFECE4] text-[#22364A]">
                      {ds.file_type.includes("CSV") ? (
                        <FileSpreadsheet size={16} />
                      ) : (
                        <FileCode size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1C2420]">{ds.filename}</p>
                      <p className="text-[11px] text-[#565F58]">
                        {ds.file_type} · {ds.record_count} records mapped
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3D6B5C] bg-[#3D6B5C]/10 px-2 py-0.5 rounded-xs">
                      <CheckCircle2 size={12} /> PostGIS Synchronized
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
