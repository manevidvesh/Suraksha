export interface LifelineItem {
  id: string;
  name: string;
  category: 'rescue_equipment' | 'power_fuel' | 'water_sanitation' | 'medical_relief' | 'telecom';
  requiredNorm: number;
  currentStock: number;
  unit: string;
  status: 'ready' | 'deficit' | 'critical';
  notes?: string;
}

export interface SafeHavenShelter {
  name: string;
  type: string; // e.g. "Elevated Multi-Purpose Cyclone Shelter", "Reinforced School Hall"
  latitude: number;
  longitude: number;
  capacityPersons: number;
  elevationAboveGroundM: number;
  distanceKm: number;
  inChargeName: string;
  inChargePhone: string;
  hasBackupPower: boolean;
  hasDrinkingWaterPlant: boolean;
}

export interface EvacuationRoute {
  primaryRouteName: string;
  primaryDistanceKm: number;
  primaryTransitTimeMin: number;
  chokepoints: string[];
  secondaryRouteName: string;
  secondaryDistanceKm: number;
  terrainHazardWarnings: string[];
}

export interface EmergencyPhoneTree {
  districtControlRoom: string;
  stateDisasterControl: string;
  ndrfBattalionControl: string;
  localTehsildar: string;
  stationFireOfficer: string;
  vhfRadioChannel: string;
  allIndiaRadioEmergencyFreq: string;
}

export interface HabitationReadinessProfile {
  habitationId: string;
  habitationName: string;
  district: string;
  state: string;
  corridor: string;
  population: number;
  primaryHazard: string;
  hazardTier: 'Immediate' | 'Short-term' | 'Medium-term';
  latitude: number;
  longitude: number;
  lastAuditedDate: string;
  readinessScore: number; // 0 - 100
  lifelineItems: LifelineItem[];
  safeHaven: SafeHavenShelter;
  evacuationRoute: EvacuationRoute;
  phoneTree: EmergencyPhoneTree;
  preZeroHourChecklist: string[];
}

export const DDMA_READINESS_PROFILES: Record<string, HabitationReadinessProfile> = {
  H1: {
    habitationId: "H1",
    habitationName: "Kavalapara Hamlet",
    district: "Wayanad",
    state: "Kerala",
    corridor: "western_ghats",
    population: 340,
    primaryHazard: "Debris Flow & Slope Failure",
    hazardTier: "Immediate",
    latitude: 11.4550,
    longitude: 76.1320,
    lastAuditedDate: "2026-09-12",
    readinessScore: 68,
    lifelineItems: [
      { id: "L1", name: "Heavy Earthmovers / JCB on Standby", category: "rescue_equipment", requiredNorm: 3, currentStock: 2, unit: "units", status: "deficit", notes: "1 JCB stationed at Pothukal PWD yard" },
      { id: "L2", name: "Terrain Rescue Stretchers & Slings", category: "rescue_equipment", requiredNorm: 15, currentStock: 15, unit: "kits", status: "ready" },
      { id: "L3", name: "Emergency Diesel Generators (15 kVA)", category: "power_fuel", requiredNorm: 2, currentStock: 1, unit: "generators", status: "deficit" },
      { id: "L4", name: "Diesel Fuel Reserve (for Gen & JCB)", category: "power_fuel", requiredNorm: 500, currentStock: 420, unit: "litres", status: "ready" },
      { id: "L5", name: "Packaged Drinking Water (20L Cans)", category: "water_sanitation", requiredNorm: 250, currentStock: 180, unit: "cans", status: "deficit" },
      { id: "L6", name: "Mobile Trauma Resuscitation Kits", category: "medical_relief", requiredNorm: 4, currentStock: 4, unit: "kits", status: "ready" },
      { id: "L7", name: "VHF Handheld Wireless Transceivers", category: "telecom", requiredNorm: 6, currentStock: 4, unit: "radios", status: "deficit" },
    ],
    safeHaven: {
      name: "St. Mary's Higher Secondary Safe Relief Haven",
      type: "Reinforced Hillside School Complex",
      latitude: 11.4720,
      longitude: 76.1550,
      capacityPersons: 650,
      elevationAboveGroundM: 3.5,
      distanceKm: 3.8,
      inChargeName: "Father Joseph Mathew (Camp Warden)",
      inChargePhone: "+91 94471 23091",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Kavalapara-Bhoodanam PWD Hill Highway",
      primaryDistanceKm: 3.8,
      primaryTransitTimeMin: 18,
      chokepoints: ["Pothukal Bridge narrow causeway", "Hairpin bend #4 prone to culvert washouts"],
      secondaryRouteName: "Upper Forest Fringe Foot Track via Kurumbalakotta",
      secondaryDistanceKm: 5.4,
      terrainHazardWarnings: ["Severe debris slide danger if rainfall exceeds 120mm in 12h", "Avoid valley drainage ravines"],
    },
    phoneTree: {
      districtControlRoom: "04936-204151 (DDMA Wayanad Collectorate)",
      stateDisasterControl: "1070 (SEOC Thiruvananthapuram)",
      ndrfBattalionControl: "0471-2401078 (4th NDRF Battalion Arakkonam Detachment)",
      localTehsildar: "+91 94470 33812 (Nilambur/Wayanad Border Tehsildar)",
      stationFireOfficer: "04936-220101 (Kalpetta Fire Station)",
      vhfRadioChannel: "Channel 14 (156.700 MHz - Forest & Disaster Grid)",
      allIndiaRadioEmergencyFreq: "103.6 MHz FM (AIR Kozhikode Emergency Relay)",
    },
    preZeroHourChecklist: [
      "Isolate overhead electrical feeds at the Bhoodanam transformer junction.",
      "Dispatch Village Revenue Officer to complete head-count of elderly and infant residents.",
      "Deploy 2 tractor-trailers to evacuate small livestock to Nilambur Veterinary Shed.",
      "Verify VHF repeater link between Pothukal base station and District Collectorate.",
      "Stage JCB at Causeway Point A before hill stream flood crests.",
    ],
  },
  H2: {
    habitationId: "H2",
    habitationName: "Chellanam Coastal Ward",
    district: "Ernakulam",
    state: "Kerala",
    corridor: "western_ghats",
    population: 1120,
    primaryHazard: "Sea Surge Inundation & Wave Overtopping",
    hazardTier: "Immediate",
    latitude: 9.8020,
    longitude: 76.2730,
    lastAuditedDate: "2026-09-14",
    readinessScore: 74,
    lifelineItems: [
      { id: "L1", name: "Inflatable Gemini Rescue Craft (OBL Motor)", category: "rescue_equipment", requiredNorm: 6, currentStock: 5, unit: "boats", status: "ready" },
      { id: "L2", name: "High-Capacity Dewatering Sump Pumps (10 HP)", category: "power_fuel", requiredNorm: 8, currentStock: 6, unit: "pumps", status: "deficit", notes: "2 pumps in PWD workshop for seal overhaul" },
      { id: "L3", name: "Geotextile Sandbags Pre-filled & Stacked", category: "rescue_equipment", requiredNorm: 5000, currentStock: 4600, unit: "bags", status: "ready" },
      { id: "L4", name: "Drinking Water Tankers (5000L)", category: "water_sanitation", requiredNorm: 5, currentStock: 3, unit: "tankers", status: "deficit" },
      { id: "L5", name: "Life Jackets (SOLAS Marine Standard)", category: "rescue_equipment", requiredNorm: 400, currentStock: 350, unit: "jackets", status: "ready" },
      { id: "L6", name: "Anti-Diarrheal & Cholera Relief Packs", category: "medical_relief", requiredNorm: 200, currentStock: 200, unit: "kits", status: "ready" },
      { id: "L7", name: "Coastal Emergency Siren & PA System", category: "telecom", requiredNorm: 3, currentStock: 3, unit: "units", status: "ready" },
    ],
    safeHaven: {
      name: "St. Mary's High School Elevated Tsunami Shelter",
      type: "Multi-Purpose Cyclone & Surge Haven (NDMA Type)",
      latitude: 9.8250,
      longitude: 76.2840,
      capacityPersons: 1400,
      elevationAboveGroundM: 4.8,
      distanceKm: 2.1,
      inChargeName: "V. R. Antony (Ward Disaster Convenor)",
      inChargePhone: "+91 98472 99401",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Chellanam-Kandakkadavu Coastal Arterial Road",
      primaryDistanceKm: 2.1,
      primaryTransitTimeMin: 12,
      chokepoints: ["Kannamaly sea dyke overflow stretch", "Bazaar culvert #2 tidal back-up"],
      secondaryRouteName: "Inland Backwater Ferry Transit to Kumbalangi",
      secondaryDistanceKm: 3.5,
      terrainHazardWarnings: ["High-tide surge above 2.8m breaches southern earthen sea-wall", "Saline water corrosiveness to vehicles"],
    },
    phoneTree: {
      districtControlRoom: "0484-2423513 (Ernakulam Collectorate DDMA)",
      stateDisasterControl: "1070 (SEOC Kerala)",
      ndrfBattalionControl: "0484-2200100 (Indian Coast Guard Kochi / NDRF)",
      localTehsildar: "+91 94477 11204 (Kochi Taluk Tehsildar)",
      stationFireOfficer: "0484-2224000 (Mattancherry Fire Rescue)",
      vhfRadioChannel: "Marine VHF Channel 16 & DDMA Channel 08",
      allIndiaRadioEmergencyFreq: "102.3 MHz (AIR Kochi Rainbow FM)",
    },
    preZeroHourChecklist: [
      "Confirm high-tide peak timing with Indian National Centre for Ocean Information Services (INCOIS).",
      "Deploy 4 Gemini boats at Kandakkadavu boat jetty for zero-hour water extraction.",
      "Order Fishermen Association trawlers to remain moored inside inner port basin.",
      "Distribute chlorine tablets and oral rehydration salt packets to low-lying households.",
      "Check generator fuel levels at St. Mary's Shelter for continuous cold storage of insulin.",
    ],
  },
  H9: {
    habitationId: "H9",
    habitationName: "Joshimath Upper Ward",
    district: "Chamoli",
    state: "Uttarakhand",
    corridor: "himalayas",
    population: 820,
    primaryHazard: "Progressive Land Subsidence & Structural Fissuring",
    hazardTier: "Immediate",
    latitude: 30.5564,
    longitude: 79.5658,
    lastAuditedDate: "2026-09-15",
    readinessScore: 59,
    lifelineItems: [
      { id: "L1", name: "Precision Geotechnical Crack Gauges Active", category: "telecom", requiredNorm: 20, currentStock: 16, unit: "monitors", status: "ready" },
      { id: "L2", name: "Structural Shoring Props & Steel Braces", category: "rescue_equipment", requiredNorm: 50, currentStock: 25, unit: "props", status: "critical", notes: "Urgent shoring needed for Sunil Ward municipal wall" },
      { id: "L3", name: "Winterized Heated Relief Tents (Sub-Zero)", category: "rescue_equipment", requiredNorm: 80, currentStock: 45, unit: "tents", status: "deficit" },
      { id: "L4", name: "High-Altitude Snow Cutters & JCBs", category: "rescue_equipment", requiredNorm: 4, currentStock: 3, unit: "units", status: "deficit" },
      { id: "L5", name: "High-Altitude Thermal Blankets & Rations", category: "medical_relief", requiredNorm: 1000, currentStock: 950, unit: "packs", status: "ready" },
      { id: "L6", name: "Kerosene & LPG Cylinder Buffer (Cold Wave)", category: "power_fuel", requiredNorm: 300, currentStock: 180, unit: "cylinders", status: "deficit" },
      { id: "L7", name: "Satellite Phone (ISRO GSAT Terminal)", category: "telecom", requiredNorm: 2, currentStock: 2, unit: "handsets", status: "ready" },
    ],
    safeHaven: {
      name: "Pipalkoti Safe Transit Complex (NH-07 Plateau)",
      type: "Bedrock-Founded Pre-Fabricated Transit Township",
      latitude: 30.4280,
      longitude: 79.4320,
      capacityPersons: 1200,
      elevationAboveGroundM: 0.0,
      distanceKm: 28.5,
      inChargeName: "Dr. Arvind Rawat (Sub-Divisional Magistrate)",
      inChargePhone: "+91 94120 77610",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Joshimath-Helang-Pipalkoti Highway (NH-07)",
      primaryDistanceKm: 28.5,
      primaryTransitTimeMin: 45,
      chokepoints: ["Helang bottleneck zone", "Chatturchatti slope slide sector"],
      secondaryRouteName: "Auli-Gorson Ridge Trail (Non-Motorable Foot Evacuation)",
      secondaryDistanceKm: 14.0,
      terrainHazardWarnings: ["Severe structural collapse if water drainage is blocked", "Do not operate heavy transit trucks during active tremor or rain"],
    },
    phoneTree: {
      districtControlRoom: "01372-251437 (Chamoli Collectorate Gopeshwar)",
      stateDisasterControl: "1070 / 0135-2710334 (USDMA Dehradun)",
      ndrfBattalionControl: "0135-2410100 (8th NDRF Battalion Uttarakhand)",
      localTehsildar: "+91 94111 88402 (Joshimath Tehsildar)",
      stationFireOfficer: "01372-222101 (Joshimath Fire Station)",
      vhfRadioChannel: "Chamoli Police Disaster Repeater Ch 04",
      allIndiaRadioEmergencyFreq: "101.4 MHz (AIR Gopeshwar/Dehradun)",
    },
    preZeroHourChecklist: [
      "Inspect crack gauges along Sunil and Manohar Bagh ward every 3 hours.",
      "Shut off domestic LPG pipeline distribution and drain overhead municipal water tanks.",
      "Requisition 12 Uttarakhand Transport buses from Joshimath bus depot for zero-hour transfer.",
      "Verify heating stoves and woollen kit stockpiles at Pipalkoti transit accommodation.",
      "Maintain active telemetry link on ISRO satellite transceiver with Dehradun SEOC.",
    ],
  },
  H14: {
    habitationId: "H14",
    habitationName: "Kuttanad Lowland Polder",
    district: "Alappuzha",
    state: "Kerala",
    corridor: "western_ghats",
    population: 980,
    primaryHazard: "Below-Sea-Level Polder Inundation & Dyke Breach",
    hazardTier: "Short-term",
    latitude: 9.3564,
    longitude: 76.4024,
    lastAuditedDate: "2026-09-16",
    readinessScore: 82,
    lifelineItems: [
      { id: "L1", name: "Inflatable Heavy-Duty Motorized Rescue Boats", category: "rescue_equipment", requiredNorm: 10, currentStock: 8, unit: "boats", status: "ready" },
      { id: "L2", name: "Dewatering Box Polder Sump Pumps (100 HP)", category: "power_fuel", requiredNorm: 6, currentStock: 5, unit: "pumps", status: "ready" },
      { id: "L3", name: "Diesel Fuel Stock for 72-Hour Continuous Pumping", category: "power_fuel", requiredNorm: 1500, currentStock: 1400, unit: "litres", status: "ready" },
      { id: "L4", name: "Clay Bund Sandbags (Jute & Polypropylene)", category: "rescue_equipment", requiredNorm: 8000, currentStock: 7800, unit: "bags", status: "ready" },
      { id: "L5", name: "Mobile Reverse Osmosis Drinking Water Barges", category: "water_sanitation", requiredNorm: 2, currentStock: 2, unit: "barges", status: "ready" },
      { id: "L6", name: "Anti-Snake Venom (ASV) & Doxycycline Stock", category: "medical_relief", requiredNorm: 60, currentStock: 45, unit: "vials", status: "deficit", notes: "15 ASV vials requisitioned from Alappuzha TD Medical College" },
      { id: "L7", name: "Waterproof VHF Transceivers for Boat Wardens", category: "telecom", requiredNorm: 8, currentStock: 6, unit: "radios", status: "deficit" },
    ],
    safeHaven: {
      name: "St. Aloysius College Elevated Multi-Deck Haven",
      type: "Engineered Elevated Safe Haven (Non-Relocation Safe Deck)",
      latitude: 9.3750,
      longitude: 76.4210,
      capacityPersons: 1600,
      elevationAboveGroundM: 5.2,
      distanceKm: 2.8,
      inChargeName: "Prof. K. Kurian (Camp Coordinator)",
      inChargePhone: "+91 94473 11809",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Alappuzha-Changanassery (AC) Elevated Highway Canal Link",
      primaryDistanceKm: 2.8,
      primaryTransitTimeMin: 20,
      chokepoints: ["Kidangara Bridge canal bottleneck", "Ponga dyke breach sector"],
      secondaryRouteName: "Inland Waterways Boat Channel via Pallathuruthy",
      secondaryDistanceKm: 4.2,
      terrainHazardWarnings: ["Sub-sea-level elevation causes reverse flood surge when Thanneermukkom barrage shutters close", "Strict reliance on watercraft"],
    },
    phoneTree: {
      districtControlRoom: "0477-2238630 (DDMA Alappuzha Collectorate)",
      stateDisasterControl: "1070 (SEOC Thiruvananthapuram)",
      ndrfBattalionControl: "0477-2244100 (Kerala Fire & Rescue Water Wing)",
      localTehsildar: "+91 94470 55102 (Kuttanad Taluk Tehsildar Mankombu)",
      stationFireOfficer: "0477-2252101 (Alappuzha Marine Fire Station)",
      vhfRadioChannel: "Kerala Inland Waterways Emergency Ch 12",
      allIndiaRadioEmergencyFreq: "102.8 MHz (AIR Alappuzha)",
    },
    preZeroHourChecklist: [
      "Monitor Thottappally Spillway and Thanneermukkom Barrage discharge gates.",
      "Power up dewatering polder engines at Pamba-Manimala confluence points.",
      "Pre-position 6 country boats and 2 motorized life craft at Mankombu jetty.",
      "Transfer insulin patients, pregnant women, and infants to St. Aloysius upper floor deck.",
      "Distribute water purification drops (potassium permanganate & chlorine tablets).",
    ],
  },
  H10: {
    habitationId: "H10",
    habitationName: "Kedarnath Valley Hamlet",
    district: "Rudraprayag",
    state: "Uttarakhand",
    corridor: "himalayas",
    population: 290,
    primaryHazard: "Glacial Outburst & Torrential Cloudburst Flood",
    hazardTier: "Immediate",
    latitude: 30.7352,
    longitude: 79.0669,
    lastAuditedDate: "2026-09-11",
    readinessScore: 62,
    lifelineItems: [
      { id: "L1", name: "High-Altitude Mountain Rescue Gear & Ropes", category: "rescue_equipment", requiredNorm: 10, currentStock: 8, unit: "kits", status: "ready" },
      { id: "L2", name: "Portable VHF Repeaters on Mountain Ridges", category: "telecom", requiredNorm: 3, currentStock: 2, unit: "repeaters", status: "deficit" },
      { id: "L3", name: "Emergency Helipad Clearing & Flare Signals", category: "rescue_equipment", requiredNorm: 2, currentStock: 2, unit: "pads", status: "ready" },
      { id: "L4", name: "Emergency Ration Biscuits & Dry Fuel Tins", category: "water_sanitation", requiredNorm: 400, currentStock: 280, unit: "boxes", status: "deficit" },
      { id: "L5", name: "Hypothermia Sleeping Pods & Thermal Suites", category: "medical_relief", requiredNorm: 120, currentStock: 90, unit: "pods", status: "deficit" },
      { id: "L6", name: "Solar Battery Storage Banks (24V 200Ah)", category: "power_fuel", requiredNorm: 4, currentStock: 3, unit: "batteries", status: "deficit" },
      { id: "L7", name: "Automatic Mandakini River Level Radar Gauge", category: "telecom", requiredNorm: 2, currentStock: 2, unit: "gauges", status: "ready" },
    ],
    safeHaven: {
      name: "Guptkashi Bedrock Community Transit Facility",
      type: "Reinforced Mountain Plateau Disaster Refuge",
      latitude: 30.5220,
      longitude: 79.0810,
      capacityPersons: 700,
      elevationAboveGroundM: 0.0,
      distanceKm: 24.0,
      inChargeName: "Subhash Negi (Executive Magistrate)",
      inChargePhone: "+91 94129 44301",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Gaurikund-Sonprayag-Guptkashi Valley Highway",
      primaryDistanceKm: 24.0,
      primaryTransitTimeMin: 60,
      chokepoints: ["Sonprayag confluence bridge", "Kund bridge culvert bypass"],
      secondaryRouteName: "Triyuginarayan Ridge Bypass Trail",
      secondaryDistanceKm: 18.5,
      terrainHazardWarnings: ["Flash flood surge wave travel time is under 22 minutes from Chorabari Lake catchment", "Bridge washouts likely"],
    },
    phoneTree: {
      districtControlRoom: "01364-233727 (Rudraprayag DDMA Control)",
      stateDisasterControl: "1070 (USDMA Dehradun)",
      ndrfBattalionControl: "01364-233100 (SDRF Rudraprayag Command)",
      localTehsildar: "+91 94113 77209 (Ukhimath Tehsildar)",
      stationFireOfficer: "01364-233201 (Rudraprayag Fire HQ)",
      vhfRadioChannel: "Kedarnath Police Disaster Tactical Ch 09",
      allIndiaRadioEmergencyFreq: "100.5 MHz (AIR Srinagar Garhwal)",
    },
    preZeroHourChecklist: [
      "Acoustic siren broadcast if Mandakini gauge rises more than 1.5m in 15 minutes.",
      "Immediate closure of pedestrian pilgrims path and riverbank ghats.",
      "Engage SDRF rope-rescue teams at Sonprayag bridge choke point.",
      "Switch communication to satellite radio if optical fiber line snaps.",
      "Clear Guptkashi emergency helipad for Indian Air Force Mi-17 casualty evacuation.",
    ],
  },
  H11: {
    habitationId: "H11",
    habitationName: "Majuli Island River Settlement",
    district: "Majuli",
    state: "Assam",
    corridor: "northeast",
    population: 1450,
    primaryHazard: "Braided River Erosion & Flood Inundation",
    hazardTier: "Immediate",
    latitude: 26.9500,
    longitude: 94.2167,
    lastAuditedDate: "2026-09-13",
    readinessScore: 71,
    lifelineItems: [
      { id: "L1", name: "Mechanized Country Engine Boats (Bhuts-bhuti)", category: "rescue_equipment", requiredNorm: 12, currentStock: 10, unit: "boats", status: "ready" },
      { id: "L2", name: "Porcupine Geo-Bags for Embankment Shoring", category: "rescue_equipment", requiredNorm: 10000, currentStock: 8200, unit: "bags", status: "ready" },
      { id: "L3", name: "Mobile Water Chlorination Filtration Plants", category: "water_sanitation", requiredNorm: 4, currentStock: 3, unit: "plants", status: "deficit" },
      { id: "L4", name: "Cattle Fodder & Grain Storage Silos", category: "water_sanitation", requiredNorm: 50, currentStock: 35, unit: "tonnes", status: "deficit" },
      { id: "L5", name: "Portable Solar Floodlights for Night Evacuation", category: "power_fuel", requiredNorm: 25, currentStock: 20, unit: "lights", status: "ready" },
      { id: "L6", name: "Japanese Encephalitis Vaccine & Med Kits", category: "medical_relief", requiredNorm: 300, currentStock: 280, unit: "doses", status: "ready" },
      { id: "L7", name: "Satellite Link at Garamur District HQ", category: "telecom", requiredNorm: 1, currentStock: 1, unit: "terminal", status: "ready" },
    ],
    safeHaven: {
      name: "Garamur High School Elevated Flood Platform",
      type: "Engineered High-Stilt Flood Platform (High-Ground Chang)",
      latitude: 26.9850,
      longitude: 94.2400,
      capacityPersons: 1800,
      elevationAboveGroundM: 4.5,
      distanceKm: 3.4,
      inChargeName: "Pranjal Saikia (District Project Officer)",
      inChargePhone: "+91 94350 88219",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Kamalabari-Garamur Embankment Bund Road",
      primaryDistanceKm: 3.4,
      primaryTransitTimeMin: 25,
      chokepoints: ["Brahmaputra bank breach point at Salmora", "Subansiri tributary cut-off"],
      secondaryRouteName: "River Channel Flotilla via Nimati Ghat",
      secondaryDistanceKm: 12.0,
      terrainHazardWarnings: ["Sudden bank erosion can collapse road foundations within 30 minutes", "Heavy whirlpool currents"],
    },
    phoneTree: {
      districtControlRoom: "03775-274444 (Majuli DDMA Control)",
      stateDisasterControl: "1070 (ASDMA Guwahati)",
      ndrfBattalionControl: "0361-2849005 (1st NDRF Battalion Patgaon Guwahati)",
      localTehsildar: "+91 98540 12190 (Majuli Circle Officer)",
      stationFireOfficer: "03775-274101 (Kamalabari Fire Station)",
      vhfRadioChannel: "Brahmaputra Disaster Flotilla Ch 06",
      allIndiaRadioEmergencyFreq: "101.9 MHz (AIR Jorhat)",
    },
    preZeroHourChecklist: [
      "Check river stage at Nematighat water level telemetry post.",
      "Muster 10 mechanized country boats at Salmora jetty for animal and child evacuation.",
      "Stack 2,000 sandbags at vulnerable bund culvert #14.",
      "Pre-position bleaching powder and alum for water treatment at Garamur haven.",
      "Activate community tom-tom drummers and village mike announcements.",
    ],
  },
  H3: {
    habitationId: "H3",
    habitationName: "Teesta Riverside Colony",
    district: "Kalimpong",
    state: "West Bengal",
    corridor: "eastern_plains",
    population: 560,
    primaryHazard: "Riverine Flash Flood & Bank Scour",
    hazardTier: "Short-term",
    latitude: 26.9800,
    longitude: 88.4200,
    lastAuditedDate: "2026-09-10",
    readinessScore: 65,
    lifelineItems: [
      { id: "L1", name: "River Rescue Rafts with Outboard Motors", category: "rescue_equipment", requiredNorm: 5, currentStock: 3, unit: "crafts", status: "deficit" },
      { id: "L2", name: "High-Intensity Search & Flood Towers", category: "power_fuel", requiredNorm: 6, currentStock: 4, unit: "units", status: "deficit" },
      { id: "L3", name: "Emergency Diesel Generator (20 kVA)", category: "power_fuel", requiredNorm: 2, currentStock: 2, unit: "generators", status: "ready" },
      { id: "L4", name: "Clean Potable Water Tankers (3000L)", category: "water_sanitation", requiredNorm: 3, currentStock: 2, unit: "tankers", status: "deficit" },
      { id: "L5", name: "Emergency Antibiotics & Water Purification Kits", category: "medical_relief", requiredNorm: 150, currentStock: 150, unit: "kits", status: "ready" },
      { id: "L6", name: "Teesta Dam Release Warning Sirens", category: "telecom", requiredNorm: 2, currentStock: 2, unit: "sirens", status: "ready" },
    ],
    safeHaven: {
      name: "Relli Valley Multi-Purpose Community Shelter",
      type: "Reinforced Hill Slope Community Center",
      latitude: 27.0100,
      longitude: 88.4500,
      capacityPersons: 850,
      elevationAboveGroundM: 3.0,
      distanceKm: 4.1,
      inChargeName: "Pemba Sherpa (Block Disaster Warden)",
      inChargePhone: "+91 97330 65123",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Teesta Bazaar-Kalimpong Arterial Road (NH-10)",
      primaryDistanceKm: 4.1,
      primaryTransitTimeMin: 22,
      chokepoints: ["Teesta bridge causeway", "29th Mile mudslide sector"],
      secondaryRouteName: "Upper Peshok Tea Garden Ridge Road",
      secondaryDistanceKm: 7.2,
      terrainHazardWarnings: ["NH-10 collapses during Teesta reservoir sudden discharge", "Mud slurry hazard"],
    },
    phoneTree: {
      districtControlRoom: "03552-255648 (Kalimpong DDMA Control)",
      stateDisasterControl: "1070 (WBDMA Kolkata)",
      ndrfBattalionControl: "0353-2571000 (2nd NDRF Siliguri Detachment)",
      localTehsildar: "+91 94340 99120 (Teesta Block Officer)",
      stationFireOfficer: "03552-255101 (Kalimpong Fire Service)",
      vhfRadioChannel: "NH-10 Emergency VHF Ch 07",
      allIndiaRadioEmergencyFreq: "103.5 MHz (AIR Kurseong)",
    },
    preZeroHourChecklist: [
      "Continuous coordination with NHPC Teesta Low Dam Project stage discharge logs.",
      "Sound sirens 45 minutes prior to sluice gate opening.",
      "Clear all roadside tea stalls and riverside habitations below water mark.",
      "Stage rescue boats at 29th Mile relief outpost.",
      "Isolate roadside electrical transformers.",
    ],
  },
  H5: {
    habitationId: "H5",
    habitationName: "Sundarbans Char Basti",
    district: "South 24 Parganas",
    state: "West Bengal",
    corridor: "eastern_plains",
    population: 890,
    primaryHazard: "Cyclone Storm Surge & Tidal Embankment Collapse",
    hazardTier: "Immediate",
    latitude: 21.9500,
    longitude: 88.8000,
    lastAuditedDate: "2026-09-14",
    readinessScore: 78,
    lifelineItems: [
      { id: "L1", name: "Fiberglass Speed Rescue Launches", category: "rescue_equipment", requiredNorm: 6, currentStock: 5, unit: "crafts", status: "ready" },
      { id: "L2", name: "High-Tide Poly-Woven Sandbags & Bamboo Baling", category: "rescue_equipment", requiredNorm: 12000, currentStock: 11000, unit: "bags", status: "ready" },
      { id: "L3", name: "Solar Desalination Drinking Water Units", category: "water_sanitation", requiredNorm: 4, currentStock: 3, unit: "units", status: "deficit" },
      { id: "L4", name: "Emergency Rice, Dal & Flattened Rice Stocks", category: "water_sanitation", requiredNorm: 20, currentStock: 18, unit: "tonnes", status: "ready" },
      { id: "L5", name: "Anti-Venom, Tetanus & Saline Hydration Packs", category: "medical_relief", requiredNorm: 100, currentStock: 90, unit: "kits", status: "ready" },
      { id: "L6", name: "High-Decibel Cyclone Warning Siren on Mast", category: "telecom", requiredNorm: 2, currentStock: 2, unit: "sirens", status: "ready" },
      { id: "L7", name: "Satellite Navigational Handsets for Coastal Wardens", category: "telecom", requiredNorm: 4, currentStock: 3, unit: "sets", status: "deficit" },
    ],
    safeHaven: {
      name: "Gosaba Multi-Purpose Cyclone Shelter (MPCS-04)",
      type: "Elevated High-Strength Concrete Multi-Story Cyclone Haven",
      latitude: 21.9800,
      longitude: 88.8200,
      capacityPersons: 1500,
      elevationAboveGroundM: 6.0,
      distanceKm: 2.6,
      inChargeName: "Subrata Mandal (BDO Gosaba)",
      inChargePhone: "+91 94341 00214",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Gosaba Island Earthen Bund Embankment Trail",
      primaryDistanceKm: 2.6,
      primaryTransitTimeMin: 18,
      chokepoints: ["Bidya river creek tidal crossing", "Embankment breach mile 4"],
      secondaryRouteName: "Inland Creek Boat Transit via Choto Mollakhali",
      secondaryDistanceKm: 4.8,
      terrainHazardWarnings: ["Storm surge exceeding 4.5m submerges all connecting earthen dykes", "Mud tidal surge traps wheeled vehicles"],
    },
    phoneTree: {
      districtControlRoom: "033-24791010 (South 24 Parganas Alipore Control)",
      stateDisasterControl: "1070 (Nabanna WBDMA)",
      ndrfBattalionControl: "033-2571234 (2nd NDRF Battalion Kalyani)",
      localTehsildar: "+91 94340 77112 (Gosaba Block Development Officer)",
      stationFireOfficer: "033-24792222 (Canning Fire Station)",
      vhfRadioChannel: "Sundarbans Biosphere Radio Ch 11",
      allIndiaRadioEmergencyFreq: "100.1 MHz (AIR Kolkata)",
    },
    preZeroHourChecklist: [
      "Broadcast IMD cyclone track advisories through village loudspeaker carts.",
      "Pre-position 5 motorized launches at Gosaba ferry ghat.",
      "Relocate pregnant women and disabled citizens 24 hours before landfall.",
      "Move livestock into ground floor cattle pen of MPCS-04.",
      "Distribute emergency waterproof identification tags and family medicine packs.",
    ],
  },
};

// Fallback generator for other habitations not explicitly defined above
export function getHabitationReadiness(habitationId: string): HabitationReadinessProfile {
  if (DDMA_READINESS_PROFILES[habitationId]) {
    return DDMA_READINESS_PROFILES[habitationId];
  }

  // Sensible default prototype profile
  return {
    habitationId,
    habitationName: `Monitored Settlement ${habitationId}`,
    district: "District Operations Center",
    state: "State Jurisdiction",
    corridor: "all",
    population: 450,
    primaryHazard: "Multi-Hazard Susceptibility",
    hazardTier: "Short-term",
    latitude: 15.0000,
    longitude: 77.0000,
    lastAuditedDate: "2026-09-10",
    readinessScore: 70,
    lifelineItems: [
      { id: "L1", name: "Emergency Rescue Craft / First Response Vehicles", category: "rescue_equipment", requiredNorm: 4, currentStock: 3, unit: "units", status: "deficit" },
      { id: "L2", name: "Heavy Duty Dewatering / Sump Pumps", category: "power_fuel", requiredNorm: 3, currentStock: 3, unit: "pumps", status: "ready" },
      { id: "L3", name: "Backup Diesel Generators", category: "power_fuel", requiredNorm: 2, currentStock: 1, unit: "units", status: "deficit" },
      { id: "L4", name: "Safe Potable Drinking Water Supply", category: "water_sanitation", requiredNorm: 200, currentStock: 180, unit: "cans", status: "ready" },
      { id: "L5", name: "First Aid & Trauma Stabilization Supplies", category: "medical_relief", requiredNorm: 50, currentStock: 50, unit: "kits", status: "ready" },
      { id: "L6", name: "VHF Tactical Wireless Handsets", category: "telecom", requiredNorm: 4, currentStock: 3, unit: "radios", status: "deficit" },
    ],
    safeHaven: {
      name: "Designated Taluk High-Ground Disaster Haven",
      type: "Multi-Purpose Concrete Safe Haven",
      latitude: 15.0200,
      longitude: 77.0300,
      capacityPersons: 800,
      elevationAboveGroundM: 3.5,
      distanceKm: 3.2,
      inChargeName: "Taluk Disaster Nodal Officer",
      inChargePhone: "+91 98400 11223",
      hasBackupPower: true,
      hasDrinkingWaterPlant: true,
    },
    evacuationRoute: {
      primaryRouteName: "Primary PWD High-Embankment Arterial Road",
      primaryDistanceKm: 3.2,
      primaryTransitTimeMin: 18,
      chokepoints: ["Culvert bottleneck at Mile 1.2", "Low bridge underpass"],
      secondaryRouteName: "Secondary Ring Bypass via Upper Hamlet",
      secondaryDistanceKm: 5.1,
      terrainHazardWarnings: ["Flash inundation risk during intense precipitation", "Avoid open electrical transformers"],
    },
    phoneTree: {
      districtControlRoom: "1077 (District Collectorate DDMA)",
      stateDisasterControl: "1070 (SEOC Command)",
      ndrfBattalionControl: "1078 (National Disaster Response Force)",
      localTehsildar: "+91 94440 12345 (Taluk Executive Magistrate)",
      stationFireOfficer: "101 (Station Fire & Emergency)",
      vhfRadioChannel: "DDMA Tactical Channel 03",
      allIndiaRadioEmergencyFreq: "102.4 MHz FM",
    },
    preZeroHourChecklist: [
      "Conduct door-to-door verification of vulnerable population list.",
      "Shut off municipal power transformers before flood waters reach ground plinth.",
      "Check diesel fuel levels in backup generators at safe haven.",
      "Position rescue vehicles along primary evacuation arterial corridor.",
      "Maintain active radio check with District Disaster Management Authority every 30 mins.",
    ],
  };
}

export function getAllReadinessProfiles(habitations: any[]): HabitationReadinessProfile[] {
  return habitations.map((h) => {
    const existing = DDMA_READINESS_PROFILES[h.id];
    if (existing) {
      return {
        ...existing,
        habitationName: h.name,
        population: h.pop,
        hazardTier: h.tier,
      };
    }
    const generic = getHabitationReadiness(h.id);
    return {
      ...generic,
      habitationName: h.name,
      district: h.region,
      population: h.pop,
      primaryHazard: h.hazard,
      hazardTier: h.tier,
      latitude: h.latitude,
      longitude: h.longitude,
    };
  });
}
