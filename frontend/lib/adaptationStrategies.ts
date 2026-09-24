export interface StrategyIntervention {
  name: string;
  description: string;
  engineeringType: "Structural" | "Non-Structural" | "Nature-Based" | "Institutional";
  timeline: "Immediate (0–6 mos)" | "Short-term (6–18 mos)" | "Medium-term (1–3 yrs)";
  estimatedCost: string;
  implementingAgency: string;
}

export interface AdaptationPillar {
  pillarNumber: 1 | 2 | 3;
  title: string;
  category: "In-Situ Structural Protection" | "Elevated Safe Havens & Transit" | "Nature-Based & Eco-Hydrology";
  summary: string;
  interventions: StrategyIntervention[];
}

export interface ZoneAdaptationStrategy {
  zoneId: string;
  zoneName: string;
  hazardType: string;
  region: string;
  whyNoRelocation: string;
  status: "Candidate Measure for Technical Review" | "Pilot Deployment" | "Proposed In-Situ Framework";
  costBenefitVsRelocation: {
    estimatedInSituCost: string;
    estimatedRelocationCost: string;
    costSavingsPercent: number;
    socialAcceptanceScore: number;
  };
  pillars: AdaptationPillar[];
}

export const ADAPTATION_STRATEGIES: Record<string, ZoneAdaptationStrategy> = {
  kuttanad: {
    zoneId: "RZ-ALP-01",
    zoneName: "Kuttanad Lowland Polder Submergence Belt",
    hazardType: "Submergence & Chronic Flood",
    region: "Alappuzha Backwaters & Vembanad Basin",
    whyNoRelocation:
      "Kuttanad is India's only sub-sea-level farming ecosystem (FAO Globally Important Agricultural Heritage System) and a Ramsar wetland. Complete relocation is rejected by traditional agrarian communities, causes massive loss of paddy food security, and is land-infeasible across Kerala. In-situ flood adaptation models ('Room for the River') are evaluated for technical authority review rather than forced resettlement.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 4.80 Cr per Polder Unit",
      estimatedRelocationCost: "₹ 24.50 Cr (Land + Reconstruction)",
      costSavingsPercent: 80,
      socialAcceptanceScore: 96,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "In-Situ Amphibious & Structural Hardening",
        category: "In-Situ Structural Protection",
        summary: "Polder dyke reinforcement, amphibious housing retrofits, and dual-purpose submersible pumps.",
        interventions: [
          {
            name: "Amphibious / Stilt Housing Retrofit",
            description: "Buoyant EPS/concrete foundation retrofits on vertical guide posts allowing homes to float up to 2.2m during monsoon floods without structural displacement.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 12–16 Lakh per unit",
            implementingAgency: "Kerala State Housing Board & LSGD",
          },
          {
            name: "Polder Ring Dyke Strengthening with Geotextiles",
            description: "Raising outer bunds to +2.5m above MSL with geotextile-encased stone pitching to withstand 100-year backwater surges.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 1.20 Cr per km",
            implementingAgency: "Major Irrigation & Kuttanad Package Division",
          },
          {
            name: "Submersible Automated High-Discharge Pump Stations",
            description: "Continuous de-watering stations powered by solar hybrid microgrids to drain waterlogged paddy polders into outer backwater canals.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 45 Lakh per cluster",
            implementingAgency: "Agriculture & Water Resources Department",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Elevated Community Polders & Rescue Flotilla",
        category: "Elevated Safe Havens & Transit",
        summary: "High-ground community refuges and seasonal transit without abandoning agricultural land.",
        interventions: [
          {
            name: "Raised 'Thuruth' Multi-Purpose Flood Shelters",
            description: "Elevated community hubs built on reinforced earthen mounds above 100-year HFL. Operates as schools/panchayat halls in dry seasons and emergency shelters in floods.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 85 Lakh per shelter",
            implementingAgency: "Kerala SDMA & Revenue Department",
          },
          {
            name: "Amphibious Emergency Flotilla & Mobile Water Barges",
            description: "Stationing shallow-draft rescue catamarans, floating potable water filtration barges, and mobile medical dispensary boats during peak monsoon discharge.",
            engineeringType: "Non-Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 35 Lakh per ward",
            implementingAgency: "Inland Waterways & DDMA Alappuzha",
          },
          {
            name: "Early Telemetric Water Level Siren Grid",
            description: "IoT radar level gauges linked to local village loudspeakers giving 6-hour advance surge warning before polder overflow.",
            engineeringType: "Institutional",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 8 Lakh per polder",
            implementingAgency: "State Emergency Operations Centre (SEOC)",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Nature-Based Hydrology & 'Room for the River'",
        category: "Nature-Based & Eco-Hydrology",
        summary: "De-siltation of leading canals, modern barrage automation, and wetland retention zones.",
        interventions: [
          {
            name: "Thottappally Spillway Leading Canal De-silting",
            description: "Deepening and widening the 11 km spillway canal to dramatically accelerate flood discharge into the Arabian Sea during peak cloudburst events.",
            engineeringType: "Nature-Based",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 2.40 Cr",
            implementingAgency: "Irrigation Department & CWC",
          },
          {
            name: "Automated Thanneermukkom Barrage Operation",
            description: "Sensor-controlled hydraulic gates to optimize flood water egress while strictly buffering against saline ingress into paddy fields.",
            engineeringType: "Institutional",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 60 Lakh",
            implementingAgency: "Water Resources Dept & Kerala SPCB",
          },
          {
            name: "Vembanad Riparian Mangrove Bio-Buffers",
            description: "Planting native mangrove associates along canal edges to dissipate tidal current erosion and stabilize sub-aquatic mud banks.",
            engineeringType: "Nature-Based",
            timeline: "Medium-term (1–3 yrs)",
            estimatedCost: "₹ 25 Lakh per km",
            implementingAgency: "Social Forestry & Biodiversity Board",
          },
        ],
      },
    ],
  },
  chellanam: {
    zoneId: "RZ-ERN-01",
    zoneName: "Chellanam Coastal Ward Severe Erosion Strip",
    hazardType: "Coastal Erosion & High-Tide Surge",
    region: "Ernakulam Coast",
    whyNoRelocation:
      "Chellanam is home to an indigenous artisanal fishing community that requires direct coastal sea access for daily livelihood. Inland land in Ernakulam is extremely scarce. Candidate adaptation measures evaluate offshore wave attenuation and engineered coastal defense as alternatives to forced inland relocation.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 6.20 Cr per km",
      estimatedRelocationCost: "₹ 38.00 Cr (Inland land acquisition)",
      costSavingsPercent: 83,
      socialAcceptanceScore: 94,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "Tetrapod Armoring & Submerged Geotube Reefs",
        category: "In-Situ Structural Protection",
        summary: "Engineered hard and soft marine revetments to dissipate 85% of incoming wave surge energy.",
        interventions: [
          {
            name: "Continuous Tetrapod Seawall Installation",
            description: "Heavy concrete interlocking tetrapod armor units laid along 7.3 km of vulnerable shoreline to prevent wave overtopping.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 3.50 Cr per km",
            implementingAgency: "Kerala Irrigation Dept & Chennai Harbour Project",
          },
          {
            name: "Submerged Offshore Artificial Reefs",
            description: "Geotextile sand-filled mega-tubes deployed 200m offshore to break high-energy monsoon swell before reaching the shore.",
            engineeringType: "Nature-Based",
            timeline: "Medium-term (1–3 yrs)",
            estimatedCost: "₹ 2.10 Cr per km",
            implementingAgency: "National Institute of Ocean Technology (NIOT)",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Stilt Fisherfolk Habitations & Boat Berthing Safe Havens",
        category: "Elevated Safe Havens & Transit",
        summary: "Vertical adaptation allowing fisherfolk to live safely without severing coastal access.",
        interventions: [
          {
            name: "RCC Stilt Architecture Retrofits",
            description: "Elevating coastal residential units 2.5m on reinforced columns with wave-wash ground voids, preserving living quarters above storm surges.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 9 Lakh per home",
            implementingAgency: "Fisheries Department & LSGD",
          },
          {
            name: "High-Ground Boat Winching & Storage Hubs",
            description: "Mechanized slipways to winch fishing craft and outboard motors to elevated platforms during cyclone warnings.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 40 Lakh per landing center",
            implementingAgency: "Matsyafed & Harbour Engineering Dept",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Coastal Bio-Shields & Dune Nourishment",
        category: "Nature-Based & Eco-Hydrology",
        summary: "Vegetated coastal sand dunes and salt-tolerant mangrove buffers to resist littoral drift.",
        interventions: [
          {
            name: "Casuarina & Pandanus Bio-Shield Belts",
            description: "30-meter wide dense planting of coastal halophytes to trap moving sand and dampen wind-driven wave run-up.",
            engineeringType: "Nature-Based",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 18 Lakh per km",
            implementingAgency: "Department of Environment & Climate Change",
          },
        ],
      },
    ],
  },
  landslide: {
    zoneId: "RZ-WAY-01",
    zoneName: "Western Ghats Slopes & Debris Flow Corridors",
    hazardType: "Landslide & Slope Failure",
    region: "Wayanad & Idukki Highlands",
    whyNoRelocation:
      "While habitations situated directly in critical debris flow channels require planned relocation, intermediate buffer habitations require in-situ slope stabilization to prevent the failure zone from expanding into broader agricultural valleys.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 2.50 Cr per Slope Sector",
      estimatedRelocationCost: "₹ 18.00 Cr",
      costSavingsPercent: 86,
      socialAcceptanceScore: 91,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "Deep Dewatering & Slope Bio-Engineering",
        category: "In-Situ Structural Protection",
        summary: "Perforated drainage pipes and root-mesh turfing to relieve catastrophic pore water pressure.",
        interventions: [
          {
            name: "Sub-Surface Horizontal Perforated Drains",
            description: "Drilling 15–25m horizontal drains into slide planes to bleed trapped groundwater during torrential monsoon spells, lowering soil pore pressure by 40%.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 65 Lakh per slope",
            implementingAgency: "Competent Geotechnical Authority / PWD",
          },
          {
            name: "Vetiver Grass & Geomat Bio-Turfing",
            description: "High-density planting of Vetiver (Chrysopogon zizanioides) with 3m deep roots acting as live soil nails to arrest topsoil sloughing.",
            engineeringType: "Nature-Based",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 15 Lakh per hectare",
            implementingAgency: "Kerala Forest Research Institute (KFRI)",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Early Warning Telemetry & Ridge-Top Transition Centers",
        category: "Elevated Safe Havens & Transit",
        summary: "Real-time rain telemetry and automated community evacuation to safe ridge zones.",
        interventions: [
          {
            name: "Tipping Bucket Telemetry & Soil Moisture Sensors",
            description: "Automated threshold monitoring (trigger at 120mm/24h continuous rain) broadcasting siren alerts directly to village smartphones and loudspeakers.",
            engineeringType: "Institutional",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 12 Lakh per cluster",
            implementingAgency: "IMD & SEOC Kerala",
          },
          {
            name: "Ridge-Top Community Transition Centers",
            description: "Safe village transit dormitories located on non-hazardous valley ridges for temporary 48-hour shelter during orange/red alerts.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 70 Lakh per facility",
            implementingAgency: "DDMA Wayanad / Idukki",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Slope Land-Use Micro-Zoning & Toe Protection",
        category: "Nature-Based & Eco-Hydrology",
        summary: "Strict prohibition of toe cutting and vegetative water detention.",
        interventions: [
          {
            name: "Enforced Ban on Toe Excavation for Buildings",
            description: "Panchayat regulatory restriction halting slope toe cutting along roads and estates that trigger translational wedge failures.",
            engineeringType: "Institutional",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "Policy Measure",
            implementingAgency: "District Town Planning & Revenue Division",
          },
        ],
      },
    ],
  },
  subsidence: {
    zoneId: "RZ-UK-01",
    zoneName: "Joshimath Himalayan Escarpment Subsidence Zone",
    hazardType: "Land Subsidence & Slope Insecurity",
    region: "Chamoli, Uttarakhand",
    whyNoRelocation:
      "Joshimath is an ancient pilgrim nexus and vital strategic defense corridor. Wholesale abandonment of the town is socio-economically and geopolitically untenable. Candidate measures focus on structural underpinning and surface hydrology interception for technical authority review.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 18.50 Cr per Sector",
      estimatedRelocationCost: "₹ 110.00 Cr",
      costSavingsPercent: 83,
      socialAcceptanceScore: 89,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "Surface Drainage Channelling & Sewerage Network",
        category: "In-Situ Structural Protection",
        summary: "Intercepting hillside springs to stop internal lubrication of unconsolidated moraine soils.",
        interventions: [
          {
            name: "Perennial Stream Diversion & Lined Storm Drains",
            description: "Channelling cascading hillside torrents into impermeable RCC flumes to eliminate subterranean infiltration into moraine debris.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 8.50 Cr",
            implementingAgency: "Uttarakhand Jal Sansthan & PWD",
          },
          {
            name: "Micropiling & Pressure Grouting",
            description: "Injecting specialized cementitious grout down to bedrock and inserting micro-piles under stressed foundations.",
            engineeringType: "Structural",
            timeline: "Medium-term (1–3 yrs)",
            estimatedCost: "₹ 6.00 Cr",
            implementingAgency: "CBRI Roorkee & IIT Roorkee",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Community Monitoring & Stable Transit Centers",
        category: "Elevated Safe Havens & Transit",
        summary: "Precision tiltmeter arrays and safe transit quarters in Gopeshwar/Pipalkoti.",
        interventions: [
          {
            name: "Crack Gauge & InSAR Telemetry Early Warning",
            description: "Millimeter-level displacement telemetry alerting district magistrates to accelerated slope movement.",
            engineeringType: "Institutional",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 45 Lakh",
            implementingAgency: "ISRO NRSC & CBRI",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Riverbed Toe Retaining Walls & Green Belts",
        category: "Nature-Based & Eco-Hydrology",
        summary: "Halting river undercutting along Alaknanda riverbed.",
        interventions: [
          {
            name: "Alaknanda Toe-Erosion Massive Retaining Wall",
            description: "Heavy reinforced crib walls at the base of the gorge to stop the river from washing away the foot of the Joshimath hill.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 12.00 Cr",
            implementingAgency: "BRO & Irrigation Dept",
          },
        ],
      },
    ],
  },
  sundarbans: {
    zoneId: "RZ-WB-02",
    zoneName: "Sundarbans Tidal Inundation & Saline Breach Zone",
    hazardType: "Cyclone Surge & Saline Inundation",
    region: "South 24 Parganas, West Bengal",
    whyNoRelocation:
      "Over 4 million people inhabit the delta relying on estuarine fisheries and agriculture. Inland land is non-existent. In-situ embankment hardening and cyclone shelters are the established lifeline.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 5.50 Cr per Island",
      estimatedRelocationCost: "₹ 42.00 Cr",
      costSavingsPercent: 87,
      socialAcceptanceScore: 95,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "Heavy Earthen Ring Bunds & Tidal Sluices",
        category: "In-Situ Structural Protection",
        summary: "Armored dykes designed to withstand Category 4 storm surge.",
        interventions: [
          {
            name: "Geotextile Reinforced Island Embankments",
            description: "Multi-layered earthen dykes with heavy woven geotextiles and brick/boulder pitching along estuarine curves.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 2.80 Cr per km",
            implementingAgency: "Irrigation & Waterways Dept, West Bengal",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Multi-Purpose Cyclone Shelters with Livestock Plinths",
        category: "Elevated Safe Havens & Transit",
        summary: "3-tier cyclone refuges safeguarding both human life and livestock assets.",
        interventions: [
          {
            name: "Elevated Cyclone Shelter with Solar Polder Power",
            description: "Reinforced 3-story concrete structure on stilts with first floor dedicated to cattle and sheep (protecting livelihoods), upper floors for residents.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 1.20 Cr per shelter",
            implementingAgency: "WB Disaster Management & Civil Defence",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Mangrove Bio-Shield Expansion & Rainwater Harvesting",
        category: "Nature-Based & Eco-Hydrology",
        summary: "Dense Rhizophora belts to absorb 60% of cyclone wave force.",
        interventions: [
          {
            name: "Mangrove Plantation on Mudflat Foreshores",
            description: "Planting 100m wide mangrove belts on tidal flats fronting dykes to dampen storm surge energy.",
            engineeringType: "Nature-Based",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 30 Lakh per km",
            implementingAgency: "Sundarban Affairs Department & Forest Dept",
          },
        ],
      },
    ],
  },
  majuli: {
    zoneId: "RZ-AS-01",
    zoneName: "Majuli Island Brahmaputra Active Riverbank Erosion Zone",
    hazardType: "Riverine Flood & Dynamic Bank Erosion",
    region: "Majuli & Upper Assam Riverine Belt, Assam",
    whyNoRelocation:
      "Majuli is the world's largest populated river island, the cultural epicenter of Neo-Vaishnavite Satra culture (heritage recognition under UNESCO tentative list), and home to Mishing and indigenous riparian communities. Forced mass relocation to the mainland would erase 500-year-old monastic satras and indigenous wetland agro-ecosystems. Candidate in-situ measures (geo-bag revetments, porcupine screens, and elevated Chang Ghar stilt habitations) are evaluated for technical authority review rather than mainland resettlement.",
    status: "Candidate Measure for Technical Review",
    costBenefitVsRelocation: {
      estimatedInSituCost: "₹ 5.20 Cr per River Reach",
      estimatedRelocationCost: "₹ 34.50 Cr (Mainland Land Acquisition & Resettlement)",
      costSavingsPercent: 85,
      socialAcceptanceScore: 97,
    },
    pillars: [
      {
        pillarNumber: 1,
        title: "Riverbank Armoring & Thalweg Current Deflection",
        category: "In-Situ Structural Protection",
        summary: "Permeable RCC porcupine screens, geo-bag revetments, and underwater mattress pitching to stop bank shearing.",
        interventions: [
          {
            name: "RCC Tetrahedral Porcupine Screen Dikes",
            description: "Deploying interlocking concrete porcupines along vulnerable bank curves to induce flow deceleration, causing heavy silt deposition and natural bank reclamation.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 1.80 Cr per reach",
            implementingAgency: "Brahmaputra Board & Water Resources Dept Assam",
          },
          {
            name: "Non-Woven Geotextile Mega-Bag Revetment",
            description: "Multi-tiered sand-filled geotextile bags laid on graded riverbanks with toe pitching below scour depth to arrest catastrophic rotational bank collapse.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 2.60 Cr per km",
            implementingAgency: "Water Resources Department, Govt of Assam",
          },
          {
            name: "Submerged Deflecting Micro-Spurs",
            description: "Low-height boulder spurs angled against main river currents to divert high-velocity thalweg flow away from inhabited riverine settlements.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 80 Lakh per spur",
            implementingAgency: "Central Water Commission (CWC) & Brahmaputra Board",
          },
        ],
      },
      {
        pillarNumber: 2,
        title: "Elevated Chang Ghar Architecture & High-Plinth Safe Havens",
        category: "Elevated Safe Havens & Transit",
        summary: "Traditional elevated stilt dwellings, raised cattle plinths, and motorized emergency evacuation flotilla.",
        interventions: [
          {
            name: "Mishing 'Chang Ghar' Resilient Stilt Housing Retrofit",
            description: "Elevating rural homes 3.0m on treated bamboo-composite or reinforced concrete pillars above 100-year High Flood Level (HFL), allowing flood waters to pass underneath harmlessly.",
            engineeringType: "Structural",
            timeline: "Short-term (6–18 mos)",
            estimatedCost: "₹ 7.5 Lakh per unit",
            implementingAgency: "PMAY-G & Assam State Disaster Management Authority (ASDMA)",
          },
          {
            name: "High-Ground 'Earthen Plinths' for Livestock & Grain Silos",
            description: "Constructing 5-meter raised communal earthen mounds to safeguard cattle herds, agricultural seed banks, and farm machinery during peak monsoon inundation.",
            engineeringType: "Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 45 Lakh per village",
            implementingAgency: "Majuli District Administration & Animal Husbandry Dept",
          },
          {
            name: "Shallow-Draft Mechanized Flotilla (Bhut-bhuti Network)",
            description: "Stationing a dedicated fleet of 15-passenger diesel watercraft and mobile medical relief boats at Salmora and Kamalabari ghats for rapid zero-hour transit.",
            engineeringType: "Non-Structural",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 35 Lakh per cluster",
            implementingAgency: "Inland Water Transport (IWT) & Majuli DDMA",
          },
        ],
      },
      {
        pillarNumber: 3,
        title: "Riparian Bio-Shielding & Wetland Flood Attenuation",
        category: "Nature-Based & Eco-Hydrology",
        summary: "Bio-turfing with deep-root riparian grasses, eco-hydrological beel restoration, and real-time radar telemetry.",
        interventions: [
          {
            name: "Nal & Khagori Grass Bio-Revetment Belts",
            description: "Planting native Arundo donax (Nal) and Phragmites karka (Khagori) along high-water margins to form a dense root mattress that dampens wave scour and traps fertile silt.",
            engineeringType: "Nature-Based",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 12 Lakh per km",
            implementingAgency: "Social Forestry Division & Assam Environment Dept",
          },
          {
            name: "Beel (Wetland) Retention Re-connection",
            description: "Desilting natural feeder channels connecting river reaches to inland wetlands (beels), creating safe natural spillway reservoirs that buffer peak monsoon discharges.",
            engineeringType: "Nature-Based",
            timeline: "Medium-term (1–3 yrs)",
            estimatedCost: "₹ 1.20 Cr",
            implementingAgency: "Assam Wetland Authority & Irrigation Dept",
          },
          {
            name: "IoT Telemetric Hydrological Surge Siren Network",
            description: "Ultrasonic river stage sensors installed at Nemati Ghat and Garamur linked to automated solar sirens providing 8-hour advance flash flood alerts.",
            engineeringType: "Institutional",
            timeline: "Immediate (0–6 mos)",
            estimatedCost: "₹ 15 Lakh per station",
            implementingAgency: "CWC, IMD & ASDMA State Emergency Operations Centre",
          },
        ],
      },
    ],
  },
};

export function getAdaptationStrategyForEntity(entity: {
  id?: string;
  name?: string;
  hazard?: string;
  region?: string;
}): ZoneAdaptationStrategy {
  const text = `${entity.id || ''} ${entity.name || ''} ${entity.hazard || ''} ${entity.region || ''}`.toLowerCase();

  // 1. Majuli Island & Brahmaputra Basin (MUST be matched before generic 'erosion')
  if (
    text.includes('majuli') ||
    text.includes('brahmaputra') ||
    text.includes('jorhat') ||
    text.includes('assam') ||
    text.includes('rz-as') ||
    text.includes('h11')
  ) {
    return ADAPTATION_STRATEGIES.majuli;
  }

  // 2. Kuttanad Submergence Polder
  if (text.includes('kuttanad') || text.includes('alappuzha') || text.includes('polder') || text.includes('submergence') || text.includes('h14')) {
    return ADAPTATION_STRATEGIES.kuttanad;
  }

  // 3. Chellanam: coastal erosion specific (NOT generic riverine erosion)
  if (
    text.includes('chellanam') ||
    text.includes('coastal') ||
    text.includes('seawall') ||
    text.includes('tetrapod') ||
    text.includes('h2') ||
    text.includes('rz-ern') ||
    (text.includes('erosion') && (text.includes('coast') || text.includes('sea') || text.includes('marine') || text.includes('ernakulam') || text.includes('kerala')))
  ) {
    return ADAPTATION_STRATEGIES.chellanam;
  }

  // 4. Joshimath Subsidence
  if (text.includes('joshimath') || text.includes('subsidence') || text.includes('chamoli') || text.includes('moraine') || text.includes('h9') || text.includes('rz-uk-01')) {
    return ADAPTATION_STRATEGIES.subsidence;
  }

  // 5. Sundarbans Delta
  if (text.includes('sundarban') || text.includes('cyclone') || text.includes('delta') || text.includes('saline') || text.includes('h5') || text.includes('rz-wb-02')) {
    return ADAPTATION_STRATEGIES.sundarbans;
  }

  // 6. Western Ghats Landslide Corridor
  if (
    text.includes('landslide') ||
    text.includes('wayanad') ||
    text.includes('kavalapara') ||
    text.includes('meppadi') ||
    text.includes('munnar') ||
    text.includes('shirur') ||
    text.includes('kodagu') ||
    text.includes('slope') ||
    text.includes('h1') ||
    text.includes('h4') ||
    text.includes('h8') ||
    text.includes('rz-way') ||
    text.includes('rz-idk') ||
    text.includes('rz-ka')
  ) {
    return ADAPTATION_STRATEGIES.landslide;
  }

  return ADAPTATION_STRATEGIES.kuttanad;
}
