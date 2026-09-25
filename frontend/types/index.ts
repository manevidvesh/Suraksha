export interface HabitationFactors {
  hazard: number;
  exposure: number;
  vulnerability: number;
  history: number;
  access: number;
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
  source?: number;
  candidate?: number;
}

export interface FinancialOutlayBreakdown {
  households_count: number;
  total_crores: number;
  pmay_housing_crores: number;
  land_development_crores: number;
  infrastructure_crores: number;
  ndrf_central_share_crores: number;
  sdrf_state_share_crores: number;
}

export interface DepartmentActionTask {
  department: string;
  designation: string;
  mandate: string;
  timeline: string;
}

export interface DisasterEvent {
  id?: string;
  habitation_id?: string;
  habitation_name?: string;
  place: string;
  type: string;
  year: number;
  impact: string;
  event_type?: string;
  severity?: string;
  description?: string;
  fatalities?: number;
  displaced?: number;
  source?: string;
  verified?: boolean;
}

export interface DataSource {
  id?: string;
  name: string;
  covers: string;
  updated: string;
  confidence: string;
  stale?: boolean;
  provenanceType?: string;
  provenanceLabel?: string;
  dataType?: string;
  processing?: string;
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

export interface LandTenureInfo {
  classification: "Revenue Land (Clear Title)" | "Vested Government Poramboke" | "Private Agricultural (LARR 2013)" | "Reserve Forest (MoEFCC FCA 1980)";
  surveyNumber: string;
  encumbranceStatus: "Zero Encumbrance / Verified" | "Gram Sabha Consent Pending" | "Statutory Forest Clearance (36mo)" | "Disputed / Civil Injunction";
  litigationRisk: "Low" | "Moderate" | "High";
  clearanceTimelineMonths: number;
  nodalDepartment: string;
}

export interface SiteScreeningMatrix {
  hazard_screening: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  carrying_capacity: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  drinking_water: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  sanitation: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  healthcare: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  schools: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  transit_access: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  land_ownership: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  legal_encumbrance: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  environmental_restrictions: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  land_acquisition_feasibility: "PASS" | "FAIL" | "UNKNOWN" | "NOT ASSESSED";
  field_verification: "PASS" | "FAIL" | "UNKNOWN" | "REQUIRED" | "NOT ASSESSED";
}

export interface HumanFieldReview {
  habitationId: string;
  status: "CONFIRMED" | "CHALLENGED" | "REQUIRES FIELD VERIFICATION" | "DATA OUTDATED" | "NOT APPLICABLE";
  reviewerDesignation: string;
  notes: string;
  timestamp: string;
}

export interface FactorBreakdownItem {
  factor: string;
  value: number;
  contribution: number;
  raw_value?: string;
  source?: string;
  vintage?: string;
  method?: string;
  status?: string;
  indicator_note?: string;
}

export interface HabitationRiskBreakdown {
  habitation_id: string;
  name: string;
  region: string;
  score: number;
  tier: string;
  events: number;
  factors: FactorBreakdownItem[];
  primary_driver: string;
  secondary_driver: string;
  explanation: string;
  assessment_id?: string;
  data_version?: string;
  evidence_status?: string;
  evidence_note?: string;
  provenance_chain?: string[];
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
  landTenure?: LandTenureInfo;
  site_status?: string;
  screening_matrix?: Partial<SiteScreeningMatrix>;
  why_this_site?: string[];
  why_not_this_site?: string[];
  primary_blockers?: string[];
  land_administrative_screening?: {
    land_ownership: string;
    legal_encumbrance: string;
    environmental_restrictions: string;
    land_acquisition_feasibility: string;
    field_verification: string;
    note?: string;
  };
  livelihood_continuity?: {
    status: string;
    employment_access: string;
    agricultural_access: string;
    marine_access: string;
    market_access: string;
    field_validation: string;
    note: string;
  };
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
  financial_outlay?: FinancialOutlayBreakdown;
  department_matrix?: DepartmentActionTask[];
  decision_status?: string;
  why_this_site?: string[];
  why_not_this_site?: string[];
  primary_blockers?: string[];
  source_assessment_id?: string;
  source_evidence_version?: string;
  explanation_layer?: string;
  human_review_status?: string;
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
  memorandum_number?: string;
  statutory_authority?: string;
  financial_outlay?: FinancialOutlayBreakdown;
  department_action_matrix?: DepartmentActionTask[];
  source_assessment_id?: string;
  source_evidence_version?: string;
  explanation_layer?: string;
  human_review_status?: string;
  is_verified_against_evidence?: boolean;
  unverified_claims?: string[];
  evidence_grounding_summary?: Record<string, any>;
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

export interface FourResponsePathways {
  in_situ_mitigation: {
    pathway: string;
    applicability: string;
    guidance: string;
    heading: string;
    measures: string[];
    disclaimer: string;
  };
  prepare_and_evacuate: {
    pathway: string;
    applicability: string;
    guidance: string;
    operational_flow: string;
    monitoring_requirement: string;
    demonstration_note: string;
  };
  temporary_shelter: {
    pathway: string;
    applicability: string;
    guidance: string;
    shelter_capacity: string;
    operational_cycle: string;
  };
  permanent_relocation: {
    pathway: string;
    applicability: string;
    guidance: string;
    prerequisites: string[];
    eligible_alternatives_count: number;
  };
}

export interface HabitationSiteCandidateMatch {
  site_id: string;
  site_name: string;
  region?: string;
  distance_km?: number;
  effective_capacity: number;
  allocated_capacity: number;
  remaining_capacity: number;
  population_demand: number;
  capacity_gap: number;
  bottleneck: string;
  screening_status: string;
  is_eligible: boolean;
  rank?: number;
  match_score?: number;
  exclusion_reasons: string[];
  screening_matrix: Record<string, string>;
  key_constraints: string[];
  why_this: string[];
  why_not: string[];
  evidence_status: string;
  field_review_override?: string;
}

export interface HabitationMatchingResult {
  habitation_id: string;
  habitation_name: string;
  region?: string;
  population: number;
  risk_score: number;
  priority_tier: string;
  primary_hazard?: string;
  status: "ELIGIBLE_OPTIONS_AVAILABLE" | "NO_CANDIDATES" | "NO_ELIGIBLE_CANDIDATES" | "INSUFFICIENT_EVIDENCE" | "INSUFFICIENT_CAPACITY" | "NO_SUITABLE_SITE_IDENTIFIED" | string;
  message: string;
  eligible_sites: HabitationSiteCandidateMatch[];
  excluded_sites: HabitationSiteCandidateMatch[];
  all_evaluated_candidates: HabitationSiteCandidateMatch[];
  unknown_evidence: string[];
  capacity_gaps: {
    site_id: string;
    site_name: string;
    remaining_capacity: number;
    demand: number;
    shortfall: number;
    bottleneck: string;
  }[];
  required_validation: string[];
  candidate_measures: string[];
  additional_site_identification_required: boolean;
  four_pathways?: FourResponsePathways;
}

export interface SiteCentricMatchingResult {
  site_id: string;
  site_name: string;
  region?: string;
  effective_capacity: number;
  allocated_capacity: number;
  remaining_capacity: number;
  bottleneck: string;
  eligible_habitations: {
    habitation_id: string;
    habitation_name: string;
    region?: string;
    population: number;
    distance_km?: number;
    priority_tier: string;
    risk_score: number;
    capacity_consumed_pct: number;
  }[];
  ineligible_habitations: {
    habitation_id: string;
    habitation_name: string;
    population: number;
    reasons: string[];
  }[];
}

