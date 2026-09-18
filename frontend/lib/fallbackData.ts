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
    f: { hazard: 64, exposure: 58, vulnerability: 55, history: 60, access: 48 },
    events: 4, score: 58, tier: "Short-term"
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
    f: { hazard: 85, exposure: 55, vulnerability: 68, history: 65, access: 38 },
    events: 2, score: 68, tier: "Short-term"
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
    f: { hazard: 68, exposure: 82, vulnerability: 64, history: 75, access: 55 },
    events: 4, score: 68, tier: "Short-term"
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
    allocated_population: 0, available_capacity: 250
  },
  {
    id: "S2", name: "Perumbavoor Resettlement Layout", region: "Ernakulam Midland",
    latitude: 10.1100, longitude: 76.4780, x: 55, y: 60, distanceKm: 26,
    cap: { land: 800, water: 650, sanitation: 700, healthcare: 600, schools: 550 },
    eff: { value: 550, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 550
  },
  {
    id: "S3", name: "Bankura Transit Township", region: "Bankura Plains",
    latitude: 23.2300, longitude: 87.0700, x: 65, y: 25, distanceKm: 41,
    cap: { land: 300, water: 280, sanitation: 260, healthcare: 150, schools: 200 },
    eff: { value: 150, bottleneck: "healthcare" },
    allocated_population: 0, available_capacity: 150
  },
  {
    id: "S4", name: "Kannur Highland Plots", region: "North Malabar Midland",
    latitude: 11.8700, longitude: 75.3700, x: 25, y: 20, distanceKm: 18,
    cap: { land: 420, water: 390, sanitation: 350, healthcare: 320, schools: 300 },
    eff: { value: 300, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 300
  },
  {
    id: "S5", name: "Gopeshwar Resettlement Colony", region: "Chamoli Plains",
    latitude: 30.4100, longitude: 79.3300, x: 50, y: 15, distanceKm: 24,
    cap: { land: 900, water: 750, sanitation: 700, healthcare: 650, schools: 600 },
    eff: { value: 600, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 600
  },
  {
    id: "S6", name: "Jorhat Elevated Relief Township", region: "Upper Assam",
    latitude: 26.7509, longitude: 94.2037, x: 80, y: 25, distanceKm: 32,
    cap: { land: 1200, water: 1000, sanitation: 950, healthcare: 800, schools: 750 },
    eff: { value: 750, bottleneck: "schools" },
    allocated_population: 0, available_capacity: 750
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
