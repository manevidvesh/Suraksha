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
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [hazard, setHazard] = useState("Landslide & flood");
  const [pop, setPop] = useState("450");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const population = parseInt(pop, 10);

    if (!name.trim() || !region.trim()) {
      setError("Please fill in habitation name and region/district.");
      return;
    }
    if (isNaN(lat) || isNaN(lon)) {
      setError("Please enter valid numeric latitude and longitude.");
      return;
    }

    onAdd({
      name: name.trim(),
      region: region.trim(),
      latitude: lat,
      longitude: lon,
      hazard,
      pop: isNaN(population) ? 450 : population,
    });

    setName("");
    setRegion("");
    setLatitude("");
    setLongitude("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md bg-[#F7F5F1] border rounded-sm shadow-xl p-5 relative f-sans"
        style={{ borderColor: C.line }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[#EFECE4] rounded-xs text-[#565F58]"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-xs bg-[#22364A] text-white">
            <Plus size={16} />
          </div>
          <div>
            <h2 className="f-serif text-lg font-semibold text-[#1C2420]">
              Add New Habitation
            </h2>
            <p className="text-xs text-[#565F58]">
              Register settlement for PostGIS multi-hazard risk assessment
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 text-xs text-[#B5462F] bg-[#B5462F]/10 border border-[#B5462F]/30 rounded-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-[#1C2420] mb-1">
              Habitation Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Meppadi Hamlet"
              className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-[#1C2420] mb-1">
              Region / District *
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., Wayanad, Kerala"
              className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
              style={{ borderColor: C.line }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Latitude (EPSG:4326) *
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="11.5510"
                className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                style={{ borderColor: C.line }}
                required
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Longitude (EPSG:4326) *
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="76.1280"
                className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                style={{ borderColor: C.line }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Primary Hazard
              </label>
              <input
                type="text"
                value={hazard}
                onChange={(e) => setHazard(e.target.value)}
                className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                style={{ borderColor: C.line }}
              />
            </div>
            <div>
              <label className="block font-medium text-[#1C2420] mb-1">
                Population
              </label>
              <input
                type="number"
                value={pop}
                onChange={(e) => setPop(e.target.value)}
                className="w-full border rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#22364A]"
                style={{ borderColor: C.line }}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border rounded-sm hover:bg-white text-[#565F58]"
              style={{ borderColor: C.line }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#22364A] text-white rounded-sm font-medium hover:bg-[#3E5E82] transition-colors"
            >
              Add Habitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
