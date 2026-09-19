import { Habitation, CandidateSite, DisasterEvent, DataSource } from '../types';

export const FALLBACK_HABITATIONS: Habitation[] = [
  {
    id: "H1", name: "Kavalapara Hamlet", region: "Wayanad Slope", hazard: "Landslide", pop: 340,
    x: 22, y: 30, latitude: 11.4550, longitude: 76.1320,
    f: { hazard: 88, exposure: 70, vulnerability: 74, history: 82, access: 40 },
    events: 3, score: 75, tier: "Immediate"
  },
  {
    id: "H2", name: "Chellanam Coastal Ward", region: "Ernakulam Coast", hazard: "Coastal erosion", pop: 1120,
    x: 68, y: 72, latitude: 9.8020, longitude: 76.2730,
    f: { hazard: 76, exposure: 91, vulnerability: 68, history: 71, access: 62 },
    events: 5, score: 77, tier: "Immediate"
  },
  {
    id: "H3", name: "Teesta Riverside Colony", region: "Darjeeling Terai", hazard: "Flood", pop: 560,
    x: 40, y: 20, latitude: 26.9800, longitude: 88.4200,
    f: { hazard: 88, exposure: 80, vulnerability: 76, history: 84, access: 40 },
    events: 4, score: 78, tier: "Immediate"
  },
  {
    id: "H4", name: "Munnar Tea Estate Line", region: "Idukki Highlands", hazard: "Landslide", pop: 210,
    x: 15, y: 55, latitude: 10.0889, longitude: 77.0595,
    f: { hazard: 92, exposure: 65, vulnerability: 80, history: 74, access: 30 },
    events: 2, score: 75, tier: "Immediate"
  },
  {
    id: "H5", name: "Sundarbans Char Basti", region: "South 24 Parganas", hazard: "Cyclone & flood", pop: 890,
    x: 75, y: 40, latitude: 21.9500, longitude: 88.8000,
    f: { hazard: 81, exposure: 84, vulnerability: 79, history: 88, access: 35 },
    events: 6, score: 80, tier: "Immediate"
  },
  {
    id: "H6", name: "Idukki Reservoir Fringe", region: "Idukki Highlands", hazard: "Landslide & flood", pop: 430,
    x: 30, y: 65, latitude: 9.8500, longitude: 76.9700,
    f: { hazard: 58, exposure: 50, vulnerability: 47, history: 40, access: 55 },
    events: 1, score: 50, tier: "Short-term"
  },
  {
    id: "H7", name: "Digha Cloudburst Belt", region: "Purba Medinipur", hazard: "Cloudburst", pop: 640,
    x: 60, y: 15, latitude: 21.6266, longitude: 87.5074,
    f: { hazard: 47, exposure: 44, vulnerability: 38, history: 30, access: 68 },
    events: 1, score: 44, tier: "Medium-term"
  },
  {
    id: "H8", name: "Kodagu Slope Settlement", region: "Kodagu Uplands", hazard: "Landslide", pop: 175,
    x: 10, y: 80, latitude: 12.4244, longitude: 75.7382,
    f: { hazard: 39, exposure: 33, vulnerability: 41, history: 25, access: 72 },
    events: 0, score: 34, tier: "Medium-term"
  },
  {
    id: "H9", name: "Joshimath Upper Ward", region: "Chamoli Garhwal", hazard: "Land subsidence", pop: 820,
    x: 48, y: 12, latitude: 30.5564, longitude: 79.5658,
    f: { hazard: 94, exposure: 80, vulnerability: 86, history: 88, access: 32 },
    events: 4, score: 82, tier: "Immediate"
  },
  {
    id: "H10", name: "Kedarnath Valley Hamlet", region: "Rudraprayag Valley", hazard: "Flash flood & cloudburst", pop: 290,
    x: 46, y: 10, latitude: 30.7352, longitude: 79.0669,
    f: { hazard: 96, exposure: 60, vulnerability: 82, history: 92, access: 20 },
    events: 5, score: 83, tier: "Immediate"
  },
  {
    id: "H11", name: "Majuli Island River Settlement", region: "Brahmaputra Basin", hazard: "Riverine flood & erosion", pop: 1450,
    x: 82, y: 22, latitude: 26.9500, longitude: 94.2167,
    f: { hazard: 78, exposure: 88, vulnerability: 72, history: 80, access: 25 },
    events: 6, score: 76, tier: "Immediate"
  },
  {
    id: "H12", name: "Shirur Hillside Settlement", region: "Uttara Kannada Ghats", hazard: "Landslide", pop: 310,
    x: 18, y: 68, latitude: 14.7350, longitude: 74.5820,
    f: { hazard: 90, exposure: 70, vulnerability: 74, history: 80, access: 35 },
    events: 3, score: 75, tier: "Immediate"
  },
  {
    id: "H13", name: "Rohru Apple Belt Settlement", region: "Shimla Hills", hazard: "Cloudburst & flash flood", pop: 480,
    x: 44, y: 8, latitude: 31.2046, longitude: 77.7523,
    f: { hazard: 72, exposure: 52, vulnerability: 58, history: 60, access: 42 },
    events: 3, score: 61, tier: "Short-term"
  },
  {
    id: "H14", name: "Kuttanad Lowland Polder", region: "Alappuzha Backwaters", hazard: "Submergence & flood", pop: 980,
    x: 20, y: 76, latitude: 9.3564, longitude: 76.4024,
    f: { hazard: 84, exposure: 88, vulnerability: 78, history: 85, access: 50 },
    events: 5, score: 79, tier: "Immediate"
  },
  {
    id: "H15", name: "Champhai Border Settlement", region: "Champhai Hills", hazard: "Earthquake & slope failure", pop: 510,
    x: 88, y: 35, latitude: 23.4750, longitude: 93.3280,
    f: { hazard: 55, exposure: 42, vulnerability: 49, history: 38, access: 35 },
    events: 2, score: 47, tier: "Short-term"
  },
  {
    id: "H16", name: "Dharasu Bhagirathi Ridge", region: "Uttarkashi Highlands", hazard: "Landslide", pop: 390,
    x: 45, y: 14, latitude: 30.6380, longitude: 78.3180,
    f: { hazard: 48, exposure: 38, vulnerability: 40, history: 35, access: 60 },
    events: 1, score: 42, tier: "Medium-term"
  },
];

export const FALLBACK_SITES: CandidateSite[] = [
  {
    id: "S1", name: "Meenangadi Rehabilitation Colony", region: "Wayanad Plateau",
    latitude: 11.6600, longitude: 76.1700, x: 45, y: 45, distanceKm: 12,
    cap: { land: 500, water: 420, sanitation: 380, healthcare: 300, schools: 250 },
    eff: { value: 250, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 250,
    landTenure: {
      classification: "Revenue Land (Clear Title)",
      surveyNumber: "Sy. 142/2B (Vested Govt)",
      encumbranceStatus: "Zero Encumbrance / Verified",
      litigationRisk: "Low",
      clearanceTimelineMonths: 1,
      nodalDepartment: "Revenue Department (Tehsildar Sulthan Bathery)"
    }
  },
  {
    id: "S2", name: "Perumbavoor Resettlement Layout", region: "Ernakulam Midland",
    latitude: 10.1100, longitude: 76.4780, x: 55, y: 60, distanceKm: 26,
    cap: { land: 800, water: 650, sanitation: 700, healthcare: 600, schools: 550 },
    eff: { value: 550, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 550,
    landTenure: {
      classification: "Vested Government Poramboke",
      surveyNumber: "Sy. 88/1A (Kunnathunad)",
      encumbranceStatus: "Zero Encumbrance / Verified",
      litigationRisk: "Low",
      clearanceTimelineMonths: 2,
      nodalDepartment: "Revenue & LSGD District Cell"
    }
  },
  {
    id: "S3", name: "Bankura Transit Township", region: "Bankura Plains",
    latitude: 23.2300, longitude: 87.0700, x: 65, y: 25, distanceKm: 41,
    cap: { land: 300, water: 280, sanitation: 260, healthcare: 150, schools: 200 },
    eff: { value: 150, bottleneck: "healthcare" },
    allocated_population: 0, available_capacity: 150,
    landTenure: {
      classification: "Private Agricultural (LARR 2013)",
      surveyNumber: "RS Plot 412/901 (Khatiyan 44)",
      encumbranceStatus: "Gram Sabha Consent Pending",
      litigationRisk: "Moderate",
      clearanceTimelineMonths: 14,
      nodalDepartment: "Land & Land Reforms Dept (BL&LRO Bankura)"
    }
  },
  {
    id: "S4", name: "Kannur Highland Plots", region: "North Malabar Midland",
    latitude: 11.8700, longitude: 75.3700, x: 25, y: 20, distanceKm: 18,
    cap: { land: 420, water: 390, sanitation: 350, healthcare: 320, schools: 300 },
    eff: { value: 300, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 300,
    landTenure: {
      classification: "Reserve Forest (MoEFCC FCA 1980)",
      surveyNumber: "RF Compartment 54 (Taliparamba)",
      encumbranceStatus: "Statutory Forest Clearance (36mo)",
      litigationRisk: "High",
      clearanceTimelineMonths: 36,
      nodalDepartment: "Divisional Forest Officer (DFO Kannur)"
    }
  },
  {
    id: "S5", name: "Gopeshwar Resettlement Colony", region: "Chamoli Plains",
    latitude: 30.4100, longitude: 79.3300, x: 50, y: 15, distanceKm: 24,
    cap: { land: 900, water: 750, sanitation: 700, healthcare: 650, schools: 600 },
    eff: { value: 600, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 600,
    landTenure: {
      classification: "Revenue Land (Clear Title)",
      surveyNumber: "Khata 29 / Khasra 110 (Gopeshwar)",
      encumbranceStatus: "Zero Encumbrance / Verified",
      litigationRisk: "Low",
      clearanceTimelineMonths: 1,
      nodalDepartment: "Sub-Divisional Magistrate (SDM Chamoli)"
    }
  },
  {
    id: "S6", name: "Jorhat Elevated Relief Township", region: "Upper Assam",
    latitude: 26.7509, longitude: 94.2037, x: 80, y: 25, distanceKm: 32,
    cap: { land: 1200, water: 1000, sanitation: 950, healthcare: 800, schools: 750 },
    eff: { value: 750, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 750,
    landTenure: {
      classification: "Vested Government Poramboke",
      surveyNumber: "Dag 312 / Patta 14 (Jorhat East)",
      encumbranceStatus: "Zero Encumbrance / Verified",
      litigationRisk: "Low",
      clearanceTimelineMonths: 2,
      nodalDepartment: "Circle Officer (Revenue) Jorhat"
    }
  },
];

export const FALLBACK_HISTORY: DisasterEvent[] = [
  { year: 2024, place: "Chellanam Coastal Ward", type: "Coastal erosion", severity: "High", impact: "38 homes breached, 210 people evacuated" },
  { year: 2023, place: "Sundarbans Char Basti", type: "Cyclone Midhili", severity: "High", impact: "890 displaced, embankment failure" },
  { year: 2022, place: "Kavalapara Hamlet", type: "Landslide", severity: "High", impact: "6 dead, hamlet declared uninhabitable zone" },
  { year: 2021, place: "Teesta Riverside Colony", type: "Flash flood", severity: "Medium", impact: "140 households temporarily relocated" },
  { year: 2020, place: "Munnar Tea Estate Line", type: "Landslide", severity: "Medium", impact: "Estate access road severed for 11 days" },
  { year: 2019, place: "Digha Cloudburst Belt", type: "Cloudburst", severity: "Low", impact: "Localised flooding, no displacement" },
];

export const FALLBACK_SOURCES: DataSource[] = [
  { name: "Geological Survey of India (GSI)", covers: "Landslide susceptibility, slope stability", updated: "Mar 2024", confidence: "High" },
  { name: "India Meteorological Department (IMD)", covers: "Rainfall intensity, cyclone tracking", updated: "Live feed", confidence: "High" },
  { name: "MOSDAC", covers: "Satellite cloudburst & cloud-cover data", updated: "Jan 2025", confidence: "Medium" },
  { name: "Census of India", covers: "Baseline population, household counts", updated: "2011", confidence: "Medium", stale: true },
  { name: "Survey of India", covers: "Topographic sheets, cadastral boundaries", updated: "Aug 2023", confidence: "High" },
  { name: "OpenStreetMap", covers: "Road access, settlement footprints", updated: "Community-maintained", confidence: "Medium" },
];

export const FALLBACK_RED_ZONES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.09, 11.42],
            [76.17, 11.42],
            [76.18, 11.49],
            [76.12, 11.51],
            [76.08, 11.47],
            [76.09, 11.42],
          ],
        ],
      },
      properties: {
        id: "RZ-WAY-01",
        habitation_id: "H1",
        zone_code: "RED-KL-07-WAY",
        name: "Wayanad Slope High-Risk Landslide Basin",
        hazard_type: "Landslide",
        severity: "Critical",
        description: "Steep debris flow corridor with slope > 38° and recurrent failure history. Encompasses Kavalapara Hamlet.",
        source_agency: "Geological Survey of India (GSI)",
        slope_angle_deg: 41.5,
        rainfall_intensity_mm: 285.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.24, 9.76],
            [76.30, 9.76],
            [76.29, 9.86],
            [76.23, 9.85],
            [76.24, 9.76],
          ],
        ],
      },
      properties: {
        id: "RZ-ERN-01",
        habitation_id: "H2",
        zone_code: "RED-KL-07-CHE",
        name: "Chellanam Severe Inundation & Seawall Breach Strip",
        hazard_type: "Coastal erosion",
        severity: "High",
        description: "Active littoral drift zone experiencing severe wave overtopping and shoreline retreat. Encompasses Chellanam Coastal Ward.",
        source_agency: "IMD & Survey of India",
        slope_angle_deg: 2.1,
        rainfall_intensity_mm: 195.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.02, 10.04],
            [77.10, 10.04],
            [77.11, 10.13],
            [77.03, 10.14],
            [77.02, 10.04],
          ],
        ],
      },
      properties: {
        id: "RZ-IDK-01",
        habitation_id: "H4",
        zone_code: "RED-KL-07-MUN",
        name: "Munnar Highlands Valley Landslide Escarpment",
        hazard_type: "Landslide",
        severity: "Critical",
        description: "Heavily fractured metamorphic rock slopes prone to translational failure during continuous monsoon rains. Encompasses Munnar Tea Estate Line.",
        source_agency: "GSI & IMD",
        slope_angle_deg: 46.0,
        rainfall_intensity_mm: 320.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [88.37, 26.93],
            [88.47, 26.93],
            [88.48, 27.03],
            [88.38, 27.02],
            [88.37, 26.93],
          ],
        ],
      },
      properties: {
        id: "RZ-WB-01",
        habitation_id: "H3",
        zone_code: "RED-WB-03-TST",
        name: "Teesta River Active Flash Flood Channel",
        hazard_type: "Flood",
        severity: "High",
        description: "Glacial lake outburst and cloudburst discharge zone subject to rapid water level surges. Encompasses Teesta Riverside Colony.",
        source_agency: "MOSDAC & Survey of India",
        slope_angle_deg: 12.0,
        rainfall_intensity_mm: 240.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [88.72, 21.88],
            [88.89, 21.88],
            [88.90, 22.02],
            [88.73, 22.02],
            [88.72, 21.88],
          ],
        ],
      },
      properties: {
        id: "RZ-WB-02",
        habitation_id: "H5",
        zone_code: "RED-WB-03-SUN",
        name: "Sundarbans Tidal Inundation & Embankment Breach Zone",
        hazard_type: "Cyclone & flood",
        severity: "Critical",
        description: "Low-elevation delta mudflats susceptible to storm surge and saline inundation. Encompasses Sundarbans Char Basti.",
        source_agency: "IMD & MOSDAC",
        slope_angle_deg: 0.8,
        rainfall_intensity_mm: 310.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.34, 9.29],
            [76.48, 9.29],
            [76.49, 9.43],
            [76.35, 9.44],
            [76.34, 9.29],
          ],
        ],
      },
      properties: {
        id: "RZ-ALP-01",
        habitation_id: "H14",
        zone_code: "RED-KL-07-KUT",
        name: "Kuttanad Lowland Polder Submergence Belt",
        hazard_type: "Submergence & flood",
        severity: "High",
        description: "Sub-sea-level agrarian polder system subject to chronic monsoon backwater inundation with no feasible upland relocation sites nearby. Mandates in-situ amphibious adaptation.",
        source_agency: "Central Water Commission (CWC) & Kerala SDMA",
        slope_angle_deg: 0.2,
        rainfall_intensity_mm: 290.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [79.52, 30.51],
            [79.61, 30.51],
            [79.62, 30.60],
            [79.53, 30.59],
            [79.52, 30.51],
          ],
        ],
      },
      properties: {
        id: "RZ-UK-01",
        habitation_id: "H9",
        zone_code: "RED-UK-01-JOS",
        name: "Joshimath Himalayan Escarpment Subsidence Zone",
        hazard_type: "Land subsidence",
        severity: "Critical",
        description: "Tectonically active moraine slope undergoing differential ground sinking and foundation fissures requiring immediate evacuation and slope drainage. Encompasses Joshimath Upper Ward.",
        source_agency: "CBRI & Geological Survey of India (GSI)",
        slope_angle_deg: 36.5,
        rainfall_intensity_mm: 180.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [79.02, 30.70],
            [79.11, 30.70],
            [79.12, 30.78],
            [79.04, 30.78],
            [79.02, 30.70],
          ],
        ],
      },
      properties: {
        id: "RZ-UK-02",
        habitation_id: "H10",
        zone_code: "RED-UK-01-KED",
        name: "Kedarnath Glacial Outburst & Flash Flood Valley Zone",
        hazard_type: "Flash flood & cloudburst",
        severity: "Critical",
        description: "Chorabari moraine-dammed glacial breach and Mandakini headwater flood fan. High risk of torrential flash flooding. Encompasses Kedarnath Valley Hamlet.",
        source_agency: "Wadia Institute of Himalayan Geology & IMD",
        slope_angle_deg: 38.0,
        rainfall_intensity_mm: 360.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [94.12, 26.90],
            [94.28, 26.90],
            [94.30, 27.01],
            [94.14, 27.01],
            [94.12, 26.90],
          ],
        ],
      },
      properties: {
        id: "RZ-AS-01",
        habitation_id: "H11",
        zone_code: "RED-AS-02-MAJ",
        name: "Majuli Island Brahmaputra Active Riverbank Erosion Zone",
        hazard_type: "Riverine flood & erosion",
        severity: "Critical",
        description: "Unconsolidated fluvial sandbar subject to catastrophic dynamic riverbank scouring and seasonal high-discharge submergence. Encompasses Majuli Island River Settlement.",
        source_agency: "Brahmaputra Board & Assam SDMA",
        slope_angle_deg: 1.2,
        rainfall_intensity_mm: 340.0,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.53, 14.70],
            [74.63, 14.70],
            [74.64, 14.77],
            [74.54, 14.78],
            [74.53, 14.70],
          ],
        ],
      },
      properties: {
        id: "RZ-KA-01",
        habitation_id: "H12",
        zone_code: "RED-KA-05-SHI",
        name: "Shirur Western Ghats Hillside Debris Slide Zone",
        hazard_type: "Landslide",
        severity: "High",
        description: "Lateritic slope with deep regolith cutting across NH-66 corridor prone to sudden rain-induced mass wasting. Encompasses Shirur Hillside Settlement.",
        source_agency: "GSI & Karnataka SDMA",
        slope_angle_deg: 39.0,
        rainfall_intensity_mm: 310.0,
      },
    },
  ],
};

