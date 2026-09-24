'use client';

import React, { useState } from "react";
import { X, Plus, MapPin } from "lucide-react";
import { C } from "../Common/constants";

export interface HabitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habitation: {
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    hazard?: string;
    pop?: number;
  }) => void;
}

export function HabitationModal({ isOpen, onClose, onAdd }: HabitationModalProps) {
  const [lgdTemplate, setLgdTemplate] = useState("wnd");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("Wayanad, Kerala");
  const [taluka, setTaluka] = useState("Vythiri Taluka");
  const [lgdCode, setLgdCode] = useState("LGD-221804");
  const [surveyNo, setSurveyNo] = useState("Sy. 114/2A");
  const [latitude, setLatitude] = useState("11.5510");
  const [longitude, setLongitude] = useState("76.1280");
  const [hazard, setHazard] = useState("Landslide & debris flow");
  const [pop, setPop] = useState("450");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleTemplateChange = (tmplKey: string) => {
    setLgdTemplate(tmplKey);
    if (tmplKey === "wnd") {
      setRegion("Wayanad, Kerala");
      setTaluka("Vythiri Taluka (Meppadi GP)");
      setLgdCode("LGD-221804");
      setSurveyNo("Sy. 114/2A (Resurvey)");
      setLatitude("11.5510");
      setLongitude("76.1280");
      setHazard("Landslide & debris flow");
      setName("Meppadi Slope Hamlet");
    } else if (tmplKey === "chm") {
      setRegion("Chamoli, Uttarakhand");
      setTaluka("Joshimath Tehsil");
      setLgdCode("LGD-184021");
      setSurveyNo("Khata 42 / Khasra 88");
      setLatitude("30.5620");
      setLongitude("79.5710");
      setHazard("Land subsidence & slope fissure");
      setName("Urgam Valley Settlement");
    } else if (tmplKey === "idk") {
      setRegion("Idukki, Kerala");
      setTaluka("Devikulam Taluka");
      setLgdCode("LGD-222140");
      setSurveyNo("Sy. 67/1 (Munnar)");
      setLatitude("10.0920");
      setLongitude("77.0620");
      setHazard("Landslide & flash flood");
      setName("Chithirapuram Line Ward");
    } else if (tmplKey === "maj") {
      setRegion("Majuli, Assam");
      setTaluka("Ujani Majuli Revenue Circle");
      setLgdCode("LGD-281190");
      setSurveyNo("Dag 145 / Patta 12");
      setLatitude("26.9600");
      setLongitude("94.2250");
      setHazard("Riverine flood & active bank erosion");
      setName("Salmora Riverine Hamlet");
    } else if (tmplKey === "sun") {
      setRegion("South 24 Parganas, West Bengal");
      setTaluka("Gosaba Block");
      setLgdCode("LGD-312044");
      setSurveyNo("JL No. 54 / Plot 210");
      setLatitude("21.9600");
      setLongitude("88.8100");
      setHazard("Tidal surge & saline flood");
      setName("Satjelia Embankment Basti");
    } else {
      setRegion("");
      setTaluka("");
      setLgdCode("");
      setSurveyNo("");
      setLatitude("");
      setLongitude("");
      setName("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const population = parseInt(pop, 10);

    if (!name.trim() || !region.trim()) {
      setError("Please fill in official village/hamlet name and district.");
      return;
    }
    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid EPSG:4326 numeric coordinates.");
      return;
    }

    onAdd({
      name: `${name.trim()} (${lgdCode || "LGD"})`,
      region: `${region.trim()} · ${taluka || ""}`,
      latitude: lat,
      longitude: lon,
      hazard,
      pop: isNaN(population) ? 450 : population,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg bg-[#F7F5F1] border rounded-sm shadow-2xl p-5 relative f-sans max-h-[90vh] overflow-y-auto"
        style={{ borderColor: C.line }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[#EFECE4] rounded-xs text-[#565F58]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-xs bg-[#22364A] text-white">
            <Plus size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="f-serif text-base font-bold text-[#1C2420]">
                Register Settlement via LGD Registry
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#22364A] text-white font-mono">
                Panchayati Raj LGD
              </span>
            </div>
            <p className="text-[11px] text-[#565F58]">
              Revenue cadastral indexing for PostGIS multi-hazard candidate Red Zone modeling
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2 text-xs text-[#B5462F] bg-[#B5462F]/10 border border-[#B5462F]/30 rounded-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Official Administrative Corridor Preset */}
          <div className="p-2.5 rounded-xs bg-white border" style={{ borderColor: C.line }}>
            <label className="block font-semibold text-[#1C2420] mb-1">
              Select Administrative Jurisdiction / District Block
            </label>
            <select
              value={lgdTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full border rounded-xs px-2 py-1.5 bg-[#F7F5F1] text-xs text-[#1C2420] focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
            >
              <option value="wnd">Wayanad, Kerala (Vythiri / Meppadi Block · LGD 221804)</option>
              <option value="chm">Chamoli, Uttarakhand (Joshimath Tehsil · LGD 184021)</option>
              <option value="idk">Idukki, Kerala (Devikulam / Munnar · LGD 222140)</option>
              <option value="maj">Majuli, Assam (Ujani Majuli Circle · LGD 281190)</option>
              <option value="sun">South 24 Parganas, WB (Gosaba Block · LGD 312044)</option>
              <option value="custom">-- Custom Revenue Jurisdiction (Manual Entry) --</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Hamlet / Settlement Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Attamala Hamlet"
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                style={{ borderColor: C.line }}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                LGD Village Code *
              </label>
              <input
                type="text"
                value={lgdCode}
                onChange={(e) => setLgdCode(e.target.value)}
                placeholder="LGD-XXXXXX"
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white focus:outline-none font-mono"
                style={{ borderColor: C.line }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                District & State *
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Wayanad, Kerala"
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white focus:outline-none"
                style={{ borderColor: C.line }}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Cadastral Survey / Khata No.
              </label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="Sy. 142/2A"
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white focus:outline-none"
                style={{ borderColor: C.line }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Latitude (WGS84 EPSG:4326) *
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white font-mono focus:outline-none"
                style={{ borderColor: C.line }}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Longitude (WGS84 EPSG:4326) *
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white font-mono focus:outline-none"
                style={{ borderColor: C.line }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Primary Hazard
              </label>
              <input
                type="text"
                value={hazard}
                onChange={(e) => setHazard(e.target.value)}
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white focus:outline-none"
                style={{ borderColor: C.line }}
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Census Enumerated Population
              </label>
              <input
                type="number"
                value={pop}
                onChange={(e) => setPop(e.target.value)}
                className="w-full border rounded-xs px-2.5 py-1.5 bg-white font-mono focus:outline-none"
                style={{ borderColor: C.line }}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t" style={{ borderColor: C.line }}>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border rounded-sm hover:bg-white text-[#565F58] cursor-pointer"
              style={{ borderColor: C.line }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#22364A] text-white rounded-sm font-semibold hover:bg-[#3E5E82] cursor-pointer transition-colors"
            >
              Confirm LGD Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
