import { RiskWeights } from "@/types";

export interface GazettedPreset {
  id: string;
  name: string;
  shortName: string;
  authority: string;
  statutoryBasis: string;
  description: string;
  weights: RiskWeights;
  applicableHazards: string[];
}

export const GAZETTED_PRESETS: GazettedPreset[] = [
  {
    id: "NDMA-WG-2019",
    name: "NDMA Western Ghats Landslide Protocol (2019)",
    shortName: "NDMA Landslide Zonation",
    authority: "National Disaster Management Authority & Geological Survey of India",
    statutoryBasis: "National Landslide Risk Management Strategy §4.2",
    description: "Prioritizes slope gradient (>38°) and historical geotechnical mass wasting for high-precipitation escarpments.",
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
    name: "CWC High-Discharge Riverine Flood Standard",
    shortName: "CWC Flood Exposure Model",
    authority: "Central Water Commission & Ministry of Jal Shakti",
    statutoryBasis: "CWC River Inundation & Population Exposure Framework (2023)",
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
    name: "MoEFCC Coastal Vulnerability Index (CRZ-IV)",
    shortName: "CRZ Coastal Erosion Protocol",
    authority: "Ministry of Environment, Forest & Climate Change",
    statutoryBasis: "Coastal Regulation Zone Notification 2019 & CVI Guidelines",
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
    name: "NDMA Himalayan Glacial & Cloudburst Framework",
    shortName: "Himalayan GLOF / Flash Flood",
    authority: "NDMA & Wadia Institute of Himalayan Geology",
    statutoryBasis: "Standard Operating Procedure for Glacial Lake Outburst Floods §6",
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
