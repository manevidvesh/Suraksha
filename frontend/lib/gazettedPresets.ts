import { RiskWeights } from "@/types";

export interface ReferenceScenarioPreset {
  id: string;
  name: string;
  shortName: string;
  authority: string;
  statutoryBasis: string;
  description: string;
  weights: RiskWeights;
  applicableHazards: string[];
}

/**
 * Illustrative Scenario Reference Presets (Demonstration Configurations)
 * NOTE: These presets represent illustrative scenario weights modeled after published guidelines,
 * and do not constitute gazetted statutory rules.
 */
export const REFERENCE_SCENARIO_PRESETS: ReferenceScenarioPreset[] = [
  {
    id: "NDMA-WG-2019",
    name: "Western Ghats Landslide Reference Model (Illustrative)",
    shortName: "Landslide Zonation Reference",
    authority: "Modeled after NDMA & Geological Survey of India Guidelines",
    statutoryBasis: "Reference: National Landslide Risk Management Strategy Guidelines (Illustrative Demonstration Preset)",
    description: "Prioritizes slope gradient (>38°) and historical mass wasting for high-precipitation escarpments.",
    applicableHazards: ["Landslide", "Debris flow", "Slope subsidence"],
    weights: {
      hazard: 40,
      exposure: 20,
      vulnerability: 20,
      history: 10,
      access: 10,
    },
  },
  {
    id: "CWC-FLD-2023",
    name: "High-Discharge Riverine Flood Reference Model (Illustrative)",
    shortName: "Riverine Flood Reference",
    authority: "Modeled after Central Water Commission Frameworks",
    statutoryBasis: "Reference: CWC River Inundation & Population Exposure Modeling Framework (Illustrative Demonstration Preset)",
    description: "Heavily weights population density and embankment breach vulnerability along major river basins.",
    applicableHazards: ["Flood", "Riverine flood", "Flash flood"],
    weights: {
      hazard: 25,
      exposure: 35,
      vulnerability: 20,
      history: 10,
      access: 10,
    },
  },
  {
    id: "CRZ-COAST-2021",
    name: "Coastal Vulnerability Reference Model (Illustrative)",
    shortName: "Coastal Inundation Reference",
    authority: "Modeled after Coastal Regulation Zone Notification & CVI Studies",
    statutoryBasis: "Reference: Coastal Regulation Zone & CVI Assessment Modeling Guidelines (Illustrative Demonstration Preset)",
    description: "Evaluates chronic shoreline retreat, tidal surge exposure, and recurrent saline breach history.",
    applicableHazards: ["Coastal erosion", "Cyclone", "Tidal inundation"],
    weights: {
      hazard: 30,
      exposure: 30,
      vulnerability: 20,
      history: 15,
      access: 5,
    },
  },
  {
    id: "HIMALAYA-GLOF-2024",
    name: "Himalayan Glacial & Cloudburst Reference Model (Illustrative)",
    shortName: "Himalayan GLOF Reference",
    authority: "Modeled after Himalayan Disaster Management Studies & WIHG Protocols",
    statutoryBasis: "Reference: Glacial Lake Outburst Flood Modeling Studies (Illustrative Demonstration Preset)",
    description: "Focuses on extreme elevation gradient, rapid discharge velocity, and valley bottleneck isolation.",
    applicableHazards: ["Flash flood & cloudburst", "GLOF", "Land subsidence"],
    weights: {
      hazard: 45,
      exposure: 15,
      vulnerability: 15,
      history: 15,
      access: 10,
    },
  },
];

// Backward-compatibility aliases
export type GazettedPreset = ReferenceScenarioPreset;
export const GAZETTED_PRESETS = REFERENCE_SCENARIO_PRESETS;
