export interface HabitationFactors {
  hazard: number;
  exposure: number;
  vulnerability: number;
  history: number;
  access: number;
}

export interface Habitation {
  id: string;
  name: string;
  region: string;
  hazard: string;
  pop: number;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  f: HabitationFactors;
  events: number;
  score: number;
  tier: "Immediate" | "Short-term" | "Medium-term";
  district?: string;
  state?: string;
}

export interface SiteCapacity {
  land: number;
  water: number;
  sanitation: number;
  healthcare: number;
  schools: number;
  [key: string]: number;
}

export interface SiteEffectiveCapacity {
  value: number;
  bottleneck: "land" | "water" | "sanitation" | "healthcare" | "schools";
}

export interface CandidateSite {
  id: string;
  name: string;
  region?: string;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  distanceKm: number;
  cap: SiteCapacity;
  eff: SiteEffectiveCapacity;
  allocated_population: number;
  available_capacity: number;
}

export interface DisasterEvent {
  id?: string;
  year: number;
  place: string;
  type: string;
  severity: "High" | "Medium" | "Low";
  impact: string;
  displaced?: number;
  fatalities?: number;
  latitude?: number;
  longitude?: number;
}

export interface DataSource {
  name: string;
  covers: string;
  updated: string;
  confidence: "High" | "Medium" | "Low";
  stale?: boolean;
  endpoint_status?: string;
}

export interface RiskWeights {
  hazard: number;
  exposure: number;
  vulnerability: number;
  history: number;
  access: number;
}

export interface MetricComparison {
  metric: string;
  Before: number;
  After: number;
}

export interface SimulationResult {
  habitation_id: string;
  habitation_name: string;
  site_id: string;
  site_name: string;
  population: number;
  effective_capacity: number;
  bottleneck: string;
  travel_distance_km: number;
  hazard_reduction_pct: number;
  exposure_reduction_pct: number;
  access_improvement_pct: number;
  capacity_exceeded: boolean;
  radar_data: MetricComparison[];
  summary_message: string;
  llm_rationale?: string;
}

export interface ExecutiveBrief {
  title: string;
  generated_at: string;
  habitation_name: string;
  region: string;
  risk_score: number;
  priority_tier: string;
  primary_hazard: string;
  population: number;
  executive_summary: string;
  risk_driver_analysis: string;
  relocation_site_assessment?: string;
  policy_recommendations: string[];
}

export interface UploadResult {
  filename: string;
  file_type: string;
  record_count: number;
  fields_mapped: string[];
  flagged_for_review: number;
  status: "success" | "error";
  message: string;
}
