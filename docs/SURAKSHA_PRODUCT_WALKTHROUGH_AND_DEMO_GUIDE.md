# SURAKSHA — COMPLETE PRODUCT & FEATURE MASTER GUIDE

> **Notice for Teammates & Judges:** This guide is a complete, non-technical product walkthrough and demonstration manual for the **SURAKSHA** Disaster Relocation Decision Support System. It explains the system entirely from the user's perspective: what you see on screen, what each number and badge means, how to interact with maps and simulations, how to interpret decision outcomes, and how to confidently present the product to an evaluation panel.

---

## 1. PRODUCT OVERVIEW

### What Problem Does SURAKSHA Solve?
Across India’s hazard-prone regions—steep landslide escarpments in the Western Ghats, subsiding moraine slopes in Uttarakhand, riverbank erosion belts along the Brahmaputra, and subsiding coastal delta lands—thousands of families live in settlements under recurrent existential threat.

Traditionally, disaster management authorities faced a critical operational gap:
1. **Hazard identification** existed in technical scientific maps (geological surveys, flood discharge charts), but was disconnected from human habitations.
2. **Relocation planning** was ad-hoc: families were often moved to places with no drinking water, no road access, disputed land titles, or overwhelming pressure on local schools and clinics.
3. **Decision paralysis:** When every department (Revenue, Public Works, Water Supply, Forest, Education) works in silos, habitations remain trapped in dangerous zones for years.

**SURAKSHA** bridges this gap. It is an intelligent, auditable **Disaster Relocation Decision Support System (DSS)** designed for State and District Disaster Management Authorities (SDMAs and DDMAs).

### The Four Operational Tenets of SURAKSHA
SURAKSHA is guided by a clear operational philosophy:
> **“AI Explains. GIS Measures. The Decision Engine Calculates. Humans Decide.”**

- **GIS Measures:** Spatial systems measure real-world physical parameters—terrain slopes, catchment boundaries, flood buffers, and transit distances.
- **The Decision Engine Calculates:** Fully deterministic, transparent mathematical models calculate risk prioritization and enforce infrastructure capacity limits without hidden machine-learning bias.
- **AI Explains:** Generative AI serves purely as an executive summarizer and plain-language briefing assistant, turning complex geospatial tables into actionable administrative memorandums and inter-departmental task matrices. It never invents data or makes automated statutory decisions.
- **Humans Decide:** Relocation fundamentally alters human lives, land ownership, and community heritage. Final statutory orders and administrative approvals remain strictly with authorized human authorities (District Collectors, SDMA Chairpersons, and Revenue officials).

### Who Uses SURAKSHA?
- **District Collectors / District Magistrates:** DDMA Chairpersons needing legally defensible, multi-criteria evidence before initiating land acquisition or resettlement schemes.
- **District Disaster Management Officers (DDMOs):** Operational staff monitoring vulnerable habitations, tracking lifeline relief readiness, and coordinating emergency shelters.
- **Revenue & Land Records Officers (Tehsildars):** Officials assessing cadastral parcels, government land availability, encumbrance risks, and rehabilitation entitlements.
- **Line Department Engineers (PWD, PHED/Jal Shakti):** Infrastructure planners evaluating site absorption limits for water networks, road connectivity, and community facilities.

---

## 2. CORE USER JOURNEY

SURAKSHA takes the decision-maker through an 8-stage logical workflow:

```
[1. HAZARD]
Detection of physical hazard perimeters (steep slopes, active floodways)
    ↓
[2. HABITATION]
Intersection of human settlements with danger zones to establish exposure
    ↓
[3. RISK & PRIORITY]
Auditable Multi-Criteria Decision Analysis (MCDA) generating 0–100 urgency scores
    ↓
[4. RELOCATION NEED]
Determining whether in-situ engineering suffices or relocation must be evaluated
    ↓
[5. CANDIDATE SITES]
Discovering candidate public land parcels within viable transit corridors
    ↓
[6. SCREENING & CAPACITY]
12-dimensional negative screening & Liebig’s bottleneck capacity calculation
    ↓
[7. MANY-TO-MANY MATCHING & SIMULATION]
Optimizing population allocation against shared municipal limits & testing what-if shocks
    ↓
[8. HUMAN REVIEW & GOVERNANCE]
Recording field officer verification, institutional challenges, and issuing DDMA briefs
```

---

## 3. NAVIGATION MAP

When you launch SURAKSHA, the primary navigation sidebar gives immediate access to the six core modules:

| Navigation Item | Primary Route | Purpose & Key User Action |
|---|---|---|
| **Overview (Dashboard)** | `/dashboard` | High-level situational awareness across all 5 national corridors, top KPIs, quick risk map, settlement urgency list, and data lineage summary. |
| **Multi-Hazard Map** | `/risk-map` | Full-screen interactive WebGL GIS map showing habitations, red-zone hazard perimeters, candidate sites, and real-time storm surge stress-test controls. |
| **Habitation Risk** | `/habitations` | Detailed settlement table, interactive MCDA weight sensitivity sliders, factor contribution charts, historical disaster logs, and officer review tools. |
| **Relocation Intelligence** | `/relocation` | The core matching engine: contextual Habitation → Site matching, Site-Centric capacity allocations, and the 12-dimensional screening matrix. |
| **What-If Simulation** | `/simulation` | Interactive sandbox to pair any settlement with any resettlement site, inspect before-vs-after risk radar charts, and generate AI Executive Briefs. |
| **Evidence & Sources** | `/sources` | Complete audit catalog disclosing data provenance, baseline limitations (e.g. Census 2011), test verifications, and scientific disclaimers. |

*Additional Specialized Modules Accessible via In-App Links:*
- **Lifeline Readiness & Action Cards (`/readiness`):** DDMA emergency shelter, equipment stock audit, and printable 1-page offline disaster action cards.
- **Historical Event Explorer (`/history`):** Chronological timeline of past disaster events across corridors.
- **Data Layer Ingestion (`/data` or `/upload`):** GeoJSON and CSV schema validator for local district surveys.

---

## 4. PAGE-BY-PAGE WALKTHROUGH

---

### PAGE 1 — LANDING PAGE (`/`)

#### 1. What is this page?
The Landing Page introduces visitors and decision-makers to the SURAKSHA platform. It articulates the mission, demonstrates the core computational principles (MCDA, Liebig’s Law, many-to-many matching), and directs officials to active decision modules.

#### 2. What do I see when I open it?
The screen features a modern dark command-center aesthetic (`#0E1721`), beginning with a technical status ribbon (`SURAKSHA PROTOTYPE · SIH DEMO`), followed by a compelling hero section with headline metrics, an interactive 8-stage decision pipeline stepper, interactive showcases of the core algorithms, human governance boundaries, and quick-launch action cards.

#### 3. Every Visible Feature on the Landing Page

##### Feature: Technical Indicator Ribbon & Navigation
- **What it shows:** Status badge: `GEOSPATIAL DECISION-SUPPORT PROTOTYPE`, accompanied by quick links to all application modules and a primary CTA button: `Launch Decision System`.
- **What it means:** Confirms to the user that this is an operational decision-support tool configured for demonstration across representative national corridors.

##### Feature: Hero Section Headlines & Proof Metrics
- **Headline:** *"From Hazard Detection to Relocation Decisions."*
- **Supporting text:** Explains that SURAKSHA provides GIS-driven decision support for identifying vulnerable habitations, evaluating candidate sites, and assessing civic carrying capacity.
- **Key Metric Tiles:**
  - `16 Pilot Settlements`: Representative monitored habitations across India.
  - `9,800+ Exposed Population`: Total residents living within the pilot hazard zones.
  - `5 Regional Corridors`: Distinct geomorphological corridors (Western Ghats, Himalayas, Eastern Plains, Northeast Brahmaputra, Coastal Delta).
  - `100% Deterministic`: Highlights that production scoring uses auditable MCDA and Liebig’s Law rather than opaque black-box machine learning.
- **Action CTAs:**
  - `Explore the Decision Map`: Direct link to `/risk-map`.
  - `View Decision Framework`: Direct link to `/dashboard`.

##### Feature: Interactive Geospatial Canvas Visual
- **What it is:** A dynamic conceptual canvas displaying an illuminated elevation mesh, hazard contours, and connected habitation nodes.
- **What the user learns:** Visually communicates the transition from physical hazard isolation to connected, safe relocation corridors.

##### Feature: The Interactive 8-Stage Decision Stepper (`DecisionFlowInteractive`)
- **What it shows:** An 8-step interactive stepper: `1. HAZARD` → `2. HABITATION` → `3. RISK / PRIORITY` → `4. RELOCATION NEED` → `5. CANDIDATE SITES` → `6. SCREENING + CAPACITY` → `7. MANY-TO-MANY MATCHING` → `8. HUMAN REVIEW`.
- **Interaction:** Clicking any step updates the detailed showcase panel below, displaying the required input datasets, the exact computational methodology, and the concrete decision artifact produced. Each step contains a direct navigation button to the corresponding page.

##### Feature: Spatial Intelligence Showcase
- **What it shows:** Four foundational GIS primitives:
  1. *Slope Gradient Profiling:* Digital Elevation Models classifying slopes >22° and >38°.
  2. *Hydrological Runout Buffers:* Drainage basin buffers capturing flash flood runoffs.
  3. *Demographic Exposure Grids:* Intersecting settlement centroids with active hazard perimeters.
  4. *Transit Friction Contours:* Calculating travel distances and road access friction.

##### Feature: Deterministic MCDA Engine Showcase
- **What it shows:** Interactive breakdown of the 5-factor risk scoring formula:
  $$\text{Composite Risk} = 0.30H + 0.25E + 0.20V + 0.15F + 0.10A$$
- **What it communicates:** Demonstrates mathematical transparency. Every point in a settlement’s score can be audited back to a specific physical or demographic indicator.

##### Feature: Many-to-Many Relocation Allocation Visualizer
- **What it shows:** An interactive diagram demonstrating why 1-to-1 matching fails in real life. Multiple habitations ($H_1, H_2, H_3$) compete for capacity in destination sites ($S_1, S_2$). The system prevents over-allocation by honoring shared infrastructure ceilings.

##### Feature: Liebig’s Law of the Minimum Showcase (`LiebigCapacitySection`)
- **What it shows:** Visual comparison of a site’s five civic dimensions (Land, Water, Sanitation, Healthcare, Schools).
- **The Core Lesson:** If a site has land for 800 people but water for only 250, its *effective carrying capacity* is **250**. Moving 800 people there would create an immediate secondary public health disaster.

##### Feature: Human Governance & Statutory Boundary (`HumanGovernanceSection`)
- **What it shows:** Clear operational swimlanes distinguishing what SURAKSHA calculates inside software vs. what must be decided by human officials outside software (statutory land acquisition, Gram Sabha consent, compensation packages, and legal notifications).

##### Feature: Quick Direct Module Launch Grid & Footer
- **What it shows:** Direct launch cards for *Habitation Risk*, *Relocation Matching*, *What-If Simulation*, and *Data Lineage*, concluding with formal statutory disclaimers.

---

### PAGE 2 — DASHBOARD / OVERVIEW (`/dashboard`)

#### 1. What is this page?
The Dashboard is the command center of SURAKSHA. It provides executive leadership (District Collectors, SDMA secretaries) with an immediate, high-level overview of disaster risk across all monitored planning corridors.

#### 2. What do I see when I open it?
At the top, four summary metric cards display active counts. Below, a corridor selector allows geographic filtering. A 10-stage decision pipeline banner explains the methodology. The center of the page features a synchronized dual layout: an interactive WebGL risk map on the left and a quick settlement inspector card on the right. The lower half features three switchable tabs: *Settlements Priority*, *Disaster Events*, and *Data Sources & Lineage*, anchored by a data confidence audit panel.

#### 3. Every Visible Feature on the Dashboard

##### Feature: Top Header & Add Settlement CTA
- **What it shows:** Page title: `SURAKSHA Dashboard`, with subtext: *"Monitored settlements across national hazard corridors evaluated against PostGIS multi-hazard layers."*
- **Action Button: `+ Add Settlement`:** Opens the manual registration modal allowing officials to test adding a newly identified endangered hamlet into the engine.
- **View Toggle: `MapLibre GIS` vs. `Schematic View`:** Switches the map display between full WebGL vector map tiles and a clean schematic topological SVG diagram.

##### Feature: Regional Planning Corridor Selector (`CorridorSelector`)
- **What it is:** A five-way corridor filter allowing the user to view data nationally or focus on a specific corridor:
  1. *All India (Complete Overview)*: 16 habitations, national scope.
  2. *Western Ghats (Zone 7)*: Wayanad, Idukki, Kodagu, Shirur, Kuttanad, Chellanam.
  3. *Himalayan Corridor*: Joshimath, Kedarnath, Chamoli, Dharasu.
  4. *Eastern Plains & Delta*: Sundarbans, Digha, Teesta Riverside Colony.
  5. *North-East Corridor*: Majuli Island riverbank erosion zone, Jorhat.
- **User Action:** Selecting a corridor filters all counts, maps, tables, and candidate sites instantaneously.

##### Feature: Four Primary KPI Metric Tiles
1. **Habitations Tracked:** Displays the total count of settlements under active monitoring (e.g. `16` nationally). Represents monitored rural/tribal settlements intersecting known multi-hazard zones.
2. **Population Exposed:** Displays the aggregate resident count (e.g. `9,800+` nationally). Sum of census baseline populations currently residing inside high-hazard polygons.
3. **Immediate Priority:** Displays the count of habitations in the most urgent action tier (Composite Risk Score $\ge 70$, shown in bold crimson `#B5462F`).
4. **Candidate Sites:** Displays the number of screened resettlement land parcels registered in the corridor (shown in pine green `#2A6B52`).

##### Feature: How SURAKSHA Decides Pipeline (`HowSurakshaDecides`)
- **What it shows:** An expandable accordion explaining the 10-stage decision pipeline from data ingestion to human authority sign-off.
- **Interaction:** Clicking *“Explore 10-Stage Pipeline”* expands the full technical cards detailing inputs, formulas, and legal boundaries.

##### Feature: Synchronized Multi-Hazard Map & Legend
- **What it shows:** Vector GIS map rendering:
  - *Red Shaded Polygons:* Model-identified Candidate Risk Zones (debris flow tracks, storm surge zones, flash flood runouts).
  - *Circular Color-Coded Markers:* Monitored habitations (Crimson = Immediate, Amber = Short-term, Olive = Medium-term).
  - *Green Square Markers:* Candidate relocation sites.
- **Interaction:** Clicking any habitation marker pans the map, highlights the settlement, and instantly populates the *Quick Inspector Card* on the right.

##### Feature: Selected Habitation Quick Inspector
- **What it shows:** A profile of the currently selected settlement:
  - *Name and Region* (e.g., `Kavalapara Hamlet`, `Wayanad Slope`).
  - *Priority Tier Badge* (`Immediate`, `Short-term`, or `Medium-term`).
  - *In-Situ Priority Badge* (If `Kuttanad` is selected, an amber badge explicitly warns: `In-Situ Priority (No Relocation Site)`).
  - *Composite Risk Score:* Expressed as a score out of 100 (e.g. `75 / 100`).
  - *Demographics:* Population count with baseline vintage badge (`Census 2011 Baseline`).
  - *Primary Hazard:* Specific physical threat (e.g. `Landslide`, `Coastal erosion`).
  - *Recorded Events:* Number of past recorded disaster incidents (e.g. `3`).
  - *Coordinates:* Exact WGS84 latitude and longitude.
- **Action Buttons on the Inspector:**
  - `Candidate In-Situ Measures`: Opens the 3-Pillar In-Situ Adaptation Modal.
  - `Inspect Risk Factors ->`: Navigates to `/habitations` with this settlement focused.
  - `Evaluate Relocation Sites ->`: Navigates to `/relocation?habitation=...` to inspect candidate resettlement destinations.
  - `Simulate Relocation ->`: Navigates to `/simulation` to model before-vs-after risk reduction.

##### Feature: Lower Section Multi-Tab System
- **Tab 1: Settlements Priority Summary:** Interactive list of all monitored habitations in the corridor, displaying priority badges, scores, and one-click selection.
- **Tab 2: Disaster Events (Factor F Evidence):** Chronological timeline of historical disaster incidents (2018–2024), showing year, location, hazard type, severity dot, and documented human/infrastructure impact.
- **Tab 3: Data Sources & Lineage:** Catalog of configured data providers (GSI, IMD, MOSDAC, Census, Survey of India, OSM), displaying update vintage, confidence rating (`High`, `Medium`), and staleness flags.

##### Feature: Data Confidence & Provenance Audit Panel (`DataConfidencePanel`)
- **What it shows:** An expandable technical transparency ledger detailing data sources, quality ratings, and known limitations (e.g., noting that Census 2011 figures require local voter roll / ration card ground verification).

---

### PAGE 3 — MULTI-HAZARD MAP (`/risk-map`)

#### 1. What is this page?
The Multi-Hazard Map is SURAKSHA’s dedicated spatial workbench. It allows disaster managers and technical GIS officers to visualize spatial relationships: where endangered habitations lie relative to steep slopes and floodways, where candidate resettlement sites are located, and how dynamic weather shocks alter danger perimeters.

#### 2. What do I see when I open it?
The page presents a full-width GIS viewport with top-level controls for switching between WebGL MapLibre tiles and Schematic SVG mode, a corridor selector, a formal statutory disclaimer banner, an interactive **Dynamic Shock Simulation Console** (IMD cloudburst / CWC flood surge), the map itself, and a bottom quick-inspector action strip.

#### 3. Spatial Distinctions: Hazard vs. Exposure vs. Risk vs. Relocation Site
To explain this map to a judge, a teammate must clearly distinguish these four concepts:
- **Hazard:** The physical phenomenon itself (e.g., a steep slope subject to debris flow or a river prone to overtopping). Represented by the **red shaded polygons**.
- **Exposure:** The presence of people, homes, and infrastructure within that hazard zone. Represented by the **settlement point markers** falling inside the red polygons.
- **Risk:** The calculated probability of loss, factoring in hazard severity, population exposure, structural vulnerability, disaster history, and road isolation. Represented by the **color and priority tier** of the settlement marker.
- **Candidate Relocation Site:** Safe destination land located outside the hazard zones, evaluated for infrastructure capacity. Represented by the **green square markers**.

#### 4. Every Visible Feature on the Multi-Hazard Map

##### Feature: Statutory Legal & Decision Support Disclaimer Banner
- **What it shows:** An amber warning banner:
  > *“Notice: SURAKSHA model-generated zones are decision-support outputs and do not constitute statutory or legal designation. Final designation remains with the competent authority.”*
- **Why it matters:** Establishes legal accountability. Demonstrates to judges that the tool does not usurp the statutory powers of the District Magistrate or State Government.

##### Feature: Dynamic Event Simulation Console (IMD & CWC Shock Triggers)
- **What it is:** An interactive demonstration bar allowing the user to simulate real-time weather alerts and observe how dynamic hazard buffers expand:
  - **Button: `Simulate IMD Cloudburst Alert (>65 mm/hr)`:** Simulates an extreme localized convective rainfall event. A 5.5 km dynamic hazard buffer is generated around the selected settlement, the map smoothly flies to the location, and an urgent crimson alert banner appears.
  - **Button: `Simulate CWC Flood Surge`:** Simulates river discharge exceeding High Flood Level (HFL). Dynamically expands the active inundation buffer by 4.5 km.
  - **Button: `Reset Baseline`:** Restores original baseline GIS risk perimeters.
- **Active Telemetry Banner:** Displays the simulated radar message (e.g., `SIMULATED IMD RADAR TRIGGER: Extreme Precipitation (>68.5 mm/hr) over Kavalapara Hamlet`).
- **Transparency Disclosure (`SimulationParameterDisclosure`):** An inline disclosure explaining that the 5.5 km / 4.5 km expansions are demonstration stress parameters designed to test rapid relocation readiness, not live radar telemetry feeds.

##### Feature: Interactive Map Canvas (MapLibre WebGL View)
- **Base Map:** High-contrast geographic cartography showing topography, rivers, and highway networks.
- **Active Layers:**
  - *Candidate High-Risk Red Zones:* Semi-transparent crimson polygons with dashed borders denoting active landslide corridors or submergence zones.
  - *Monitored Settlements:* Circular markers styled by risk tier (Crimson = Immediate, Amber = Short-term, Olive = Medium-term).
  - *Candidate Resettlement Sites:* Emerald green square icons indicating surveyed relocation alternatives.
- **Interactive Map Actions:**
  - *Clicking a Habitation Marker:* Selects the habitation, highlights its boundary, and updates the bottom inspector strip.
  - *Clicking a Candidate Site Marker:* Opens a popup displaying site capacity, distance, and primary bottleneck.
  - *Clicking a Red Zone Polygon:* Opens the **Candidate In-Situ Adaptation Measures Modal**, explaining structural defenses for that specific terrain.

##### Feature: Bottom Habitation Quick Action Strip
- **What it shows:** Whenever a settlement is selected, a fixed bottom banner summarizes its identity:
  - Name, priority badge, region, hazard, and exposed population.
  - Composite Risk Score (e.g., `75 / 100`).
  - Action buttons: `Candidate In-Situ Measures`, `Inspect Factors`, `Relocation Sites`, and `Stress Test`.

---

### PAGE 4 — HABITATION RISK & MCDA SCORING (`/habitations`)

#### 1. What is this page?
The Habitation Risk page explains **why** a settlement is high risk. It removes all mystery from disaster prioritization by exposing the exact Multi-Criteria Decision Analysis (MCDA) model, allowing decision-makers to inspect factor breakdowns, test weight sensitivities, and record official field verification notes.

#### 2. What do I see when I open it?
The layout is split into two columns:
- **Left Column (Width: ~290px):** The **MCDA Weight Sensitivity & Scenario Panel**, featuring interactive sliders for each of the five criteria and pre-calibrated planning presets.
- **Right Column:** Corridor filter, search input, the primary **Habitations Data Table**, the **Selected Habitation Factor Breakdown Card** (featuring an interactive bar chart and scientific explanation), an **Evidence Gap Checklist**, and an operational audit row.

#### 3. Every Visible Feature on the Habitation Risk Page

##### Feature: MCDA Weight Sensitivity & Planning Scenario Panel (`McdaScenarioPanel`)
- **What it is:** An interactive calibration tool allowing disaster managers to test different policy priorities:
  - **Five Criterion Sliders:**
    1. *Hazard Intensity (H):* Default `30%` (Slope angle, debris runout, storm surge).
    2. *Population Exposure (E):* Default `25%` (Exposed residents, settlement footprint).
    3. *Social Vulnerability (V):* Default `20%` (Kutcha dwellings, socioeconomic fragility).
    4. *Disaster History (F):* Default `15%` (Recurrence frequency in 2018–2024 window).
    5. *Accessibility Deficit (A):* Default `10%` (Egress road isolation, distance to medical care).
  - **Interaction:** Dragging any slider instantly triggers real-time recalculation of risk scores across all 16 habitations. A `Loader2` indicator flashes *"Recalculating..."* and priority tiers adjust dynamically.
  - **Reset Button:** Restores standard default baseline weights (`30 / 25 / 20 / 15 / 10`).
  - **Scenario Reference Presets (`REFERENCE_SCENARIO_PRESETS`):**
    Allows one-click application of illustrative policy scenarios modeled after published technical guidelines:
    - *Western Ghats Landslide Reference Model:* Emphasizes slope gradients and debris flow (`40% H, 20% E, 20% V, 10% F, 10% A`).
    - *High-Discharge Riverine Flood Reference Model:* Heavily weights dense population exposure in floodplains (`25% H, 35% E, 20% V, 10% F, 10% A`).
    - *Coastal Vulnerability Reference Model:* Weights shoreline erosion and storm surge history (`30% H, 30% E, 20% V, 15% F, 5% A`).
    - *Himalayan Glacial & Cloudburst Reference Model:* Heavily weights extreme terrain and valley isolation (`45% H, 15% E, 15% V, 15% F, 10% A`).

##### Feature: Habitation Data Table (`HabitationTable`)
- **Columns:**
  - *Habitation Name:* Official village/ward name.
  - *Region / Corridor:* Planning jurisdiction.
  - *Primary Hazard:* Dominant physical threat.
  - *Population:* Exposed resident count with Census 2011 baseline flag.
  - *Priority Tier:* Visual badge (`Immediate`, `Short-term`, `Medium-term`).
  - *Composite Risk Score:* Numerical score out of 100 with visual progress bar.
- **Interactions:** Clicking any row highlights the settlement and loads its deep-dive factor analysis.

##### Feature: Selected Habitation Factor Breakdown Card
- **Headline:** *"Why [Settlement Name] scored [Score]/100"*
- **Button: `How is this score calculated?`:** Opens the **MCDA Explainer Modal** displaying the exact mathematical arithmetic and points allocation.
- **Vulnerability Bar Chart (`VulnerabilityBarChart`):** A clean horizontal bar chart displaying the 0–100 normalized value for each of the five factors, showing exactly which dimension is driving the risk.
- **Narrative Explanation Box:** A clear, plain-language paragraph explaining the primary and secondary risk drivers (e.g., *"Kavalapara Hamlet is prioritized as an Immediate resettlement urgency based on extreme slope gradient (>41°) and recurrent fatal debris flow history."*).
- **Assessment Identifier Badge:** A unique auditable record ID (e.g., `SRK-2026-H1-v1`).
- **Demographic Vintage Badge:** Notes census baseline status.
- **Recorded Past Events Link:** Displays documented disaster incidents (2018–2024); clicking opens the historical log modal.
- **Evidence Status Badge:** Displays current data confidence (e.g. `LIMITED EVIDENCE (PROTOTYPE STAGE)`).
- **Officer Review Badge:** Appears if a field officer has recorded an active verification status (e.g., `Officer Review: CONFIRMED`).

##### Feature: Operational Action Buttons Row
- **`In-Situ SDMA Strategies`:** Opens the 3-Pillar In-Situ Adaptation Modal.
- **`Historical Evidence`:** Opens the 2018–2024 incident records modal.
- **`Provenance Lineage`:** Opens the 8-Stage Assessment Provenance Modal.
- **`Officer Review`:** Opens the DDMA Field Verification Modal allowing an official to record ground truth notes.
- **`Evaluate Candidate Sites ->`:** Direct link to Relocation Intelligence for this settlement.
- **`Stress Test`:** Direct link to Simulation.

##### Feature: Evidence Gaps & Operational Limitations Panel (`EvidenceGapPanel`)
- **What it shows:** An honest operational checklist disclosing what evidence is missing:
  - *Geotechnical:* Pending core boreholes and slope shear strength testing.
  - *Cadastral:* Pending revenue title search and Gram Sabha consent.
  - *Livelihood:* Pending socioeconomic household impact surveys.

---

### PAGE 5 — RELOCATION INTELLIGENCE (`/relocation`)

#### 1. What is this page?
Relocation Intelligence is the heart of SURAKSHA’s decision-support capability. It answers the fundamental question:
> **“If a settlement must be relocated, where can its people safely and sustainably go?”**

It prevents ad-hoc, disastrous relocations by evaluating candidate resettlement sites against a **12-dimensional screening matrix**, enforcing **Liebig’s carrying capacity bottlenecks**, and categorizing findings into **5 standardized decision outcome states**.

#### 2. What do I see when I open it?
At the top, an operational standard banner reminds users that technical screening requires human administrative validation. Below, three perspective tabs provide different angles on the relocation challenge:
1. **Habitation → Candidate Matching (Contextual View)**
2. **Site-Centric Capacity & Matches**
3. **All Candidate Sites (12-D Matrix Inventory)**

---

#### 3. Deep-Dive: Perspective 1 — Habitation → Candidate Matching (Contextual View)

This view evaluates relocation alternatives specifically tailored to the active vulnerable settlement:

##### Step 1: Select Vulnerable Habitation
- Displays corridor and settlement selectors with quick demographic and risk summaries.
- Shows active demand: e.g., `Kavalapara Hamlet: 340 residents to relocate`.
- If field overrides have been applied, a reset button appears: `Reset X Override(s)`.

##### Step 2: Matching Result Status Header
Displays a color-coded status banner summarizing the matching outcome:
- **Green (`ELIGIBLE_OPTIONS_AVAILABLE`):** *"X Candidate Alternative(s) Available for Comparison."*
- **Amber (`INSUFFICIENT_CAPACITY`):** *"Eligible sites exist, but available capacity is insufficient for assessed demand."*
- **Crimson (`NO_ELIGIBLE_CANDIDATE_SITE`):** *"NO SUITABLE CANDIDATE SITE IDENTIFIED. All evaluated sites violated negative screening constraints."*

##### Step 3: Eligible Candidate Alternatives List
For each passing candidate site:
- **Header:** Displays rank (e.g. `Rank 1 among eligible alternatives`), site name, region, and green badge: `Passed baseline screening`.
- **Key Metrics:**
  - *Transit Distance:* Distance from source settlement in kilometers (e.g. `12 km`).
  - *Primary Bottleneck:* The limiting civic infrastructure dimension (e.g. `schools`).
  - *Match Score:* Composite suitability index (e.g. `82 / 100`).
  - *Remaining Capacity:* Available capacity headroom (e.g. `250 / 250 cap, Headroom: +250 persons`).
- **Action Buttons:**
  - `Run What-If`: Launches simulation with this pair pre-selected.
  - `Override Unsuitable`: Allows a visiting officer to manually mark a site as unsuitable based on local ground knowledge.
  - `Expand Details (Chevron)`: Opens the detailed evaluation drawer.
- **Expanded Evaluation Drawer:**
  - *Liebig Carrying Capacity Breakdown:* Displays bars for Land, Water, Sanitation, Healthcare, and Schools, highlighting the bottleneck.
  - *Contextual Suitability Factors (`Why This Site?`):* Plain-language merits (e.g., located outside debris flow perimeters, short transit distance).
  - *Operational Constraints & Unknowns (`Why Not This Site?`):* Specific warnings (e.g., constrained by school capacity at 250 residents, cadastral ownership unverified).
  - *12-Dimension Screening Matrix:* Grid displaying the exact status (`PASS`, `FAIL`, `UNKNOWN`, `REQUIRED`, `NOT ASSESSED`) for all 12 criteria.

##### Step 4: Excluded Candidates Accordion
- **Headline:** *"Why were X candidate site(s) excluded?"*
- **What it shows:** An accordion detailing every candidate site in the corridor that failed screening, listing the exact reasons (e.g., `Violates steep slope threshold (>18°)`, `Encroaches upon Reserve Forest boundary`, `Transit distance 41 km exceeds operational target`).
- **Officer Action:** An officer can review why a site was rejected and, if warranted, remove or apply a local override.

---

#### 4. The 5 Standardized Decision Outcome States

SURAKSHA classifies every habitation’s relocation situation into one of five standardized administrative states:

```
┌────────────────────────────────────────────────────────────────────────┐
│               SURAKSHA 5-STATE DECISION OUTCOME FRAMEWORK              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Relocation Options Available (Green)                                │
│    Candidate sites passed baseline screening and have sufficient       │
│    carrying capacity headroom.                                         │
├────────────────────────────────────────────────────────────────────────┤
│ 2. No Eligible Candidate Site (Crimson)                                │
│    All candidate sites in the search corridor violated environmental,  │
│    slope, flood, or forest exclusion constraints.                      │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Insufficient Relocation Capacity (Amber)                            │
│    Eligible candidate sites exist, but their Liebig bottleneck         │
│    capacity cannot absorb the full population demand.                  │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Insufficient / Unknown Evidence (Slate Gray)                        │
│    Critical parameters (borehole stability, legal title, forest zone)  │
│    are unverified, preventing a safe determination.                    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Field / Technical Review Required (Dark Slate)                      │
│    A field officer or technical authority recorded a suitability       │
│    challenge or manual override requiring institutional reconciliation.│
└────────────────────────────────────────────────────────────────────────┘
```

For each outcome, the system displays:
- **Decision Support Finding:** A detailed narrative summarizing the finding.
- **Pending Evidence Verification:** Items requiring ground-truth resolution before executive orders.
- **Secondary Operational Considerations:**
  - *Temporary Protective Measures:* Immediate evacuation, emergency shelters, and relief prepositioning.
  - *Candidate In-Situ Measures:* Slope stabilization, drainage canal clearing, and early-warning installation.

---

#### 5. Deep-Dive: Perspective 2 — Site-Centric Capacity & Matches

This perspective flips the relationship to answer:
> **“If we develop this resettlement site, which endangered settlements can it support without overwhelming its municipal utilities?”**

- **Candidate Resettlement Site Selector:** Choose any surveyed site (e.g. `Meenangadi Rehabilitation Colony`).
- **Site Summary Card:** Displays Liebig Effective Capacity, Available Headroom, and the governing bottleneck.
- **Potentially Matched Habitations:** List of habitations in the corridor whose population fits within the site’s remaining capacity. Shows percentage of site capacity consumed (e.g. `Kavalapara Hamlet: 340 residents (68% of capacity)`). Contains a direct button: `Simulate Pair`.
- **Ineligible Habitations:** Settlements in the corridor that *cannot* be moved here, with clear reasons (e.g. `Population 1,120 exceeds available capacity 250`, or `Transit distance 180 km exceeds regional limit`).

---

#### 6. Deep-Dive: Perspective 3 — All Candidate Sites (12-D Matrix Inventory)

Displays the complete registry of candidate sites across India:
- Features an interactive **Minimum Capacity Filter Slider (`minCap`)** to filter sites capable of absorbing at least $N$ residents.
- For every site, displays the full 12-dimensional screening matrix, Liebig capacity breakdown, and land tenure administrative status.

---

### PAGE 6 — WHAT-IF RELOCATION SIMULATION & AI BRIEFING (`/simulation`)

#### 1. What is this page?
The Simulation page is an executive sandbox where disaster managers can pair an endangered source settlement with a candidate resettlement site. It immediately calculates the real-world trade-offs: geodesic transit distance, percentage hazard reduction, and municipal infrastructure load, and can generate an executive briefing memorandum for SDMA sign-off.

#### 2. What do I see when I open it?
The screen features a parameter selection bar (Source Habitation, Candidate Site, and `Run Simulation` button), special condition notices (in-situ priority alerts or cross-state geographic infeasibility warnings), and, upon execution, a comprehensive simulation results dashboard featuring before-vs-after radar charts, capacity progress bars, operational planning phases, and an AI Decision Brief generator.

#### 3. Every Visible Feature on the Simulation Page

##### Feature: Parameter Selection Grid
- **1. Source Habitation Selector:** Choose the endangered settlement.
- **2. Candidate Resettlement Site Selector:** Dropdown intelligently grouped into:
  - *Recommended Regional Corridor Sites (<200 km):* Contiguous within-district or within-state sites.
  - *Other Disaster Corridors (Demo Sandbox Only):* Cross-state sites included to demonstrate algorithmic generality across hazard types.
- **Action Button: `Run Simulation`:** Executes the geodesic friction and Liebig load model.

##### Feature: Special Condition Alerts
- **In-Situ Adaptation Banner (Kuttanad / H14):** If Kuttanad is selected, an amber banner explains that total relocation is rejected by traditional agrarian communities and infeasible under state land constraints. An action button invites the user to inspect **Candidate In-Situ Adaptation Measures** instead.
- **Geographical Infeasibility Warning:** If a user pairs settlements across distant states (e.g. Wayanad, Kerala with Bankura, West Bengal, ~1,850 km), a prominent amber banner warns that real-world planned relocation is restricted to local panchayats or contiguous revenue districts (<30–50 km).

##### Feature: Simulation Results Dashboard
When a simulation finishes, the system renders:
- **Model Output Banner:** Summarizes the pairing (e.g., `Relocation Model: Kavalapara Hamlet → Meenangadi Rehabilitation Colony`), indicating whether capacity is respected (green check) or exceeded (amber alert).
- **Decision Status Badge:** Displays `VIABLE CANDIDATE MATCH` or `CAPACITY DEFICIT DETECTED`.
- **Button: `Generate AI Decision Brief (DDMA Review)`:** Triggers the AI Explanation Layer.
- **Three-Column Viability & Constraints Grid:**
  1. *Why This Site (Viability Drivers):* Quantifies hazard reduction (e.g. `-74% hazard exposure`) and effective capacity.
  2. *Constraints & Bottlenecks:* Highlights limiting infrastructure (e.g. `Schools bottleneck at 250 residents`).
  3. *Primary Decision Blockers:* Identifies pending cadastral clearances or capacity deficits.

##### Feature: Tab 1 — Spatial & Carrying Capacity (Radar Chart & Metrics)
- **Before vs. After Hazard Radar Chart (`RiskRadarChart`):** A multi-axis radar chart visually comparing the source settlement (*Before*, orange fill) against the candidate site (*After*, green line) across five axes: *Hazard Intensity*, *Population Exposure*, *Social Vulnerability*, *Disaster History*, and *Accessibility Deficit*. Allows instant visual verification of risk reduction.
- **Site Capacity Load Meter:** A visual progress bar showing resident demand vs. site effective capacity. Turns red if capacity is exceeded, warning that utility expansion or phased relocation is mandatory.
- **Transit Distance Metric:** Shows actual Haversine road/transit distance in kilometers.
- **Hazard Exposure Reduction Metric:** Bold percentage drop in physical danger (e.g. `−74%`).

##### Feature: Tab 2 — 3-Phase Operational Planning Strategy
Translates the computational pairing into a concrete district contingency roadmap:
- **Phase 1: Zero-Hour (0 – 48 Hours):** *Pre-emptive Evacuation to Relief Shelters.* Focuses on immediate life safety, evacuation of vulnerable demographics, and SDRF watercraft deployment. (*Nodal Lead: Tehsildar & Sub-Divisional Police Officer*).
- **Phase 2: Stabilization (1 – 6 Months):** *Site Engineering & Utility Commissioning.* Focuses on site leveling, retaining walls, PHED deep-bore tubewells to overcome infrastructure bottlenecks, and transitional shelters. (*Nodal Lead: Executive Engineers, PWD & PHED*).
- **Phase 3: Resettlement (6 – 18 Months):** *Patta Distribution & Pucca Handover.* Issuance of registered freehold title deeds (Pattas of 3 cents), release of PMAY-G direct benefit housing funds, and transfer of civil registrations. (*Nodal Lead: District Collector & DDMA Chairperson*).

##### Feature: AI Executive Decision Brief Modal (`ExecutiveBriefModal`)
- **What it is:** A clean, printable administrative briefing document synthesizing structured findings into official bureaucratic memorandum format.
- **Addressed To:** The District Magistrate & Chairperson, District Disaster Management Authority (DDMA).
- **Key Sections:**
  1. *Executive Summary & Vulnerability Findings*
  2. *Risk Driver Analysis*
  3. *Candidate Resettlement Site & Capacity Assessment*
  4. *Indicative Resettlement Financial Outlay Estimate:* Calculates estimated budget in Crores for PMAY-G housing, land development, and civic infrastructure, split into **75% Central NDRF Share** and **25% State SDRF Share**. Explicitly notes that scheme eligibility requires competent authority verification.
  5. *Inter-Departmental Tasking Matrix:* Specific operational directives with 30-to-90 day timelines assigned to the Tehsildar (Revenue), Executive Engineer (PWD), Executive Engineer (PHED), District Medical Officer (Health), and District Education Officer (Schools).
  6. *Candidate Measures for Technical Review:* Recommended policy actions.
- **Actions:**
  - `Print / Export PDF`: Formats the memorandum for official A4 printing or PDF export.
  - `Copy Plaintext`: Copies the full brief text to the clipboard.

---

### PAGE 7 — EVIDENCE, SOURCES & DATA PROVENANCE (`/sources`)

#### 1. What is this page?
The Evidence & Sources page is SURAKSHA’s data integrity ledger. In government disaster management, recommendations must be transparent, verifiable, and legally defensible. This page documents every data provider, distinguishes real-world validation from software verification, and enforces operational honesty.

#### 2. What do I see when I open it?
The page opens with a **Data Honesty & Provenance Statement**, a four-part provenance taxonomy, a verification CTA button, a catalog of all 10 configured datasets and reference criteria, and deep-dive callouts explaining software test coverage and the role of machine learning.

#### 3. The Four-Category Provenance Taxonomy
SURAKSHA classifies every data source into one of four distinct categories:
- **A. RUNTIME DATASET:** Actively consumed by the application engine (e.g., the 16 pilot settlements and candidate site coordinates).
- **B. DEMONSTRATION DATASET:** Curated representative data used for demonstration purposes (e.g., Census of India 2011 decennial baseline, simulated storm surge parameters).
- **C. DOCUMENTED REFERENCE:** Published scientific standards used to calibrate mathematical formulas (e.g., GSI slope guidelines >30°, IMD rainfall thresholds >65 mm/hr, CWC flood discharge levels, Survey of India WGS84 datum).
- **D. EXTERNAL VALIDATION REQUIRED:** Information not connected or verifiable inside the software (e.g., ground cadastral deed records, private land dispute litigation, physical geotechnical core drilling).

#### 4. Every Visible Feature on the Sources Page

##### Feature: Data Honesty & Provenance Statement
- Explains that SURAKSHA combines source-derived spatial layers, deterministic decision calculations, and demonstration datasets. Re-iterates that dynamic hazard triggers are explicitly labeled simulations, not fabricated live API feeds.

##### Feature: Configured Data Sources Catalog (10 Sources)
Each entry displays provider name, provenance badge, coverage summary, processing methodology, timestamp vintage, and confidence rating:
1. *SURAKSHA Pilot Habitations & Sites (Runtime Dataset · High Confidence)*
2. *Census of India 2011 Decennial Baseline (Demonstration Dataset · Medium Confidence · Flagged STALE)*
3. *SURAKSHA Dynamic Shock Simulation Engine (Demonstration Dataset · High Confidence)*
4. *Geological Survey of India Reference Criteria (Documented Reference · High Confidence)*
5. *India Meteorological Department Reference Standards (Documented Reference · High Confidence)*
6. *Central Water Commission Reference Hydrology (Documented Reference · High Confidence)*
7. *MOSDAC / ISRO Earth Observation Reference (Documented Reference · Medium Confidence)*
8. *Survey of India Reference Grid (Documented Reference · High Confidence)*
9. *OpenStreetMap Reference Vectors (Documented Reference · Medium Confidence)*
10. *Cadastral Land Ownership & Encumbrance Records (External Validation Required · Flagged STALE / PENDING)*

##### Feature: Software Verification $\ne$ Real-World Validation Callout
- **Critical Distinction:** Highlights that while the software logic is rigorously verified through **67 automated backend tests and 14 frontend route checks**, software verification does **not** equal real-world geotechnical or hydrological safety. Physical ground investigation, legal title verification, and statutory community consultations must occur prior to physical resettlement.

##### Feature: Production Engine vs. Exploratory ML Models Callout
- **Clarifies Architecture:** Emphasizes that SURAKSHA’s production path uses **deterministic MCDA** and **Liebig bottleneck rules** to ensure explainability. Offline machine-learning models (Random Forest, XGBoost) in the repository represent exploratory research benchmarks, not unverified automated deciders.

---

### PAGE 8 — SPECIALIZED OPERATIONAL MODULES

#### Module 1: DDMA Lifeline Readiness & Offline Action Cards (`/readiness`)
- **What it is:** An operational tool for District Disaster Management Officers to audit emergency equipment and export offline field instructions.
- **Top KPIs:** Displays tracked settlements, count of *Operationally Ready* settlements ($\ge 80\%$), *Moderate Deficit* ($60-79\%$), and *Critical Deficit* ($<60\%$).
- **Habitation Readiness Inventory:** Table ranking habitations by readiness deficit. Displays:
  - *Readiness Score (0–100)*: Calculated across lifeline supplies.
  - *Emergency Lifeline Equipment Checklist:* Stocks of heavy earthmovers (JCBs), terrain stretchers, diesel generators, drinking water cans, mobile trauma resuscitation kits, and VHF handheld radios.
  - *Safe Haven Relief Shelter Profile:* Nearest designated pucca shelter (school or cyclone hall), distance, warden name, contact phone number, backup generator status, and water plant status.
  - *Evacuation Route Profile:* Primary and secondary evacuation routes, transit times, chokepoints, and terrain warnings.
- **Button: `Print A4 Action Card` (`OfflineActionCardModal`):** Generates a formatted, single-page printable emergency card for field wardens containing offline emergency phone trees, radio channels, shelter coordinates, and pre-zero-hour checklists for use when mobile networks fail.

#### Module 2: Historical Disaster Recurrence Layer (`/history`)
- **What it is:** Dedicated chronological timeline of past disaster events across India.
- **Features:** Severity filter (`High`, `Medium`, `Low`), corridor selector, and detailed event cards displaying year, location, hazard type, displaced population, fatalities, and qualitative impact.

#### Module 3: Data Layer Ingestion & Schema Validator (`/data` or `/upload`)
- **What it is:** Ingestion portal for district officials to upload local field survey data (CSV) or hazard polygons (GeoJSON).
- **Features:** Drag-and-drop file upload, automated coordinate mapping against WGS84 (EPSG:4326), schema validation, download sample CSV template, and simulated upload stress tests.

---

## 5. CARRYING CAPACITY & LIEBIG’S BOTTLENECK PRINCIPLE

### What Problem Does Carrying Capacity Solve?
In historical disaster relocations, governments often identified vacant government land and moved thousands of displaced people there, only to discover that the local water supply could only support a fraction of the population, or that the local primary school was overwhelmed. The result was secondary displacement, severe disease outbreaks, and abandonment of the resettlement site.

SURAKSHA prevents this by implementing **Liebig’s Law of the Minimum**:
$$\text{Effective Carrying Capacity} = \min(\text{Land}, \text{Water}, \text{Sanitation}, \text{Healthcare}, \text{Schools})$$

### The Five Capacity Dimensions Explained

| Dimension | What It Represents | How It Is Measured | Why It Matters |
|---|---|---|---|
| **Land Capacity** | Physical plot area available for housing layouts | Maximum residents based on minimum plot allocations (e.g. 3 cents per family) | Ample land is necessary but never sufficient on its own. |
| **Water Capacity** | Potable drinking water availability | Supportable residents based on daily per-capita norms (e.g. 55–70 LPCD) | Without water, a relocation layout becomes immediately uninhabitable. |
| **Sanitation Capacity** | Sewage, drainage, and waste disposal capacity | Supportable residents based on decentralized septic or community treatment | Inadequate sanitation triggers immediate waterborne epidemics. |
| **Healthcare Capacity** | Proximity and capacity of primary health centers | Maximum absorbable population at local Health & Wellness Sub-Centres | Displaced communities have elevated medical and trauma needs. |
| **Schools Capacity** | Classroom absorption capacity in local primary schools | Available student desk capacity under Right to Education (RTE) norms | Lack of schooling forces families to migrate away from resettlement colonies. |

### The Concept of the Limiting Bottleneck
Consider **Meenangadi Rehabilitation Colony (Site S1)**:
- Land Capacity: `500 persons`
- Water Capacity: `420 persons`
- Sanitation Capacity: `380 persons`
- Healthcare Capacity: `300 persons`
- **Schools Capacity: `250 persons`**

**The Result:** Although Meenangadi has physical land for 500 people, its **Effective Carrying Capacity is strictly capped at 250**. Schools are the **governing bottleneck**. If the DDMA relocates 340 residents from Kavalapara to Meenangadi, the system will flag a **Capacity Deficit**, warning that 90 students will be left without school infrastructure unless educational facilities are formally expanded.

---

## 6. MULTI-CRITERIA RISK SCORING (MCDA)

SURAKSHA replaces subjective political discretion with an auditable, transparent Multi-Criteria Decision Analysis (MCDA) index:

$$\text{Composite Risk Score} = \frac{\sum_{i=1}^5 (F_i \times W_i)}{\sum_{i=1}^5 W_i}$$

### The Five Contributing Risk Factors

| Factor | UI Name & Code | Default Weight | Data Sources | What High Values Mean | What It Does NOT Mean |
|---|---|---|---|---|---|
| **Hazard Intensity** | Hazard (H) | `30%` | GSI Slope Zonation, DEM gradients, Flood layers | Slope angles $>38^\circ$, direct intersection with debris runout corridors. | Does NOT mean a landslide is guaranteed to occur tomorrow. |
| **Population Exposure** | Exposure (E) | `25%` | Census 2011 Baseline, Settlement boundaries | Dense clusters of families directly inside hazard polygons. | Does NOT reflect real-time daytime floating or tourist populations. |
| **Social Vulnerability** | Vulnerability (V) | `20%` | SECC records, Local Body surveys | High proportion of fragile kutcha dwellings, elderly, and children. | Does NOT measure personal financial wealth or income. |
| **Disaster History** | History (F) | `15%` | District incident logs (2018–2024) | Multiple recurrent flash floods, breaches, or slope failures. | Does NOT capture centuries-old historical paleofloods. |
| **Accessibility Deficit** | Access (A) | `10%` | OSM & Survey of India road vectors | Severe physical egress isolation (single bridge access, steep tracks). | Does NOT mean the community lacks mobile telephone connectivity. |

### The Priority Bands Explained
- **Immediate Priority (Score 70 – 100, Crimson `#B5462F`):** Settlements under severe compound hazard exposure, high vulnerability, and historical recurrence. Candidates for immediate relocation evaluation or priority in-situ habitational defenses.
- **Short-Term Priority (Score 45 – 69, Amber `#C0872B`):** Settlements with moderate exposure or vulnerability. Require enhanced monsoon monitoring, evacuation route clearance, and selective structural engineering.
- **Medium-Term Priority (Score 0 – 44, Olive `#3D6B5C`):** Settlements with low immediate exposure or robust access infrastructure. Subject to routine seasonal surveillance.

---

## 7. HUMAN GOVERNANCE & STATUTORY BOUNDARIES

A core evaluation criterion for judges is understanding where the software ends and human authority begins.

```
┌───────────────────────────────────────┐      ┌───────────────────────────────────────┐
│          INSIDE SURAKSHA              │      │       OUTSIDE SURAKSHA (HUMAN)        │
│    (Computational Decision Support)   │      │         (Statutory Authority)         │
├───────────────────────────────────────┤      ├───────────────────────────────────────┤
│ • Measures terrain slope gradients    │      │ • Conducts physical core drilling     │
│ • Calculates geodesic distances       │      │ • Performs cadastral title searches   │
│ • Evaluates 12-dimension screening    │  →   │ • Obtains Gram Sabha consent          │
│ • Enforces Liebig bottleneck limits   │      │ • Issues statutory relocation orders  │
│ • Generates draft AI executive briefs │      │ • Disburses financial compensation    │
│ • Flags unknown evidence & gaps       │      │ • Physically constructs pucca homes   │
└───────────────────────────────────────┘      └───────────────────────────────────────┘
```

### Why SURAKSHA Never Automates Relocation Orders
Relocation involves fundamental constitutional and statutory rights—land titles under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act (LARR 2013), forest rights under the Forest Rights Act (FRA 2006), and traditional community heritage. Software algorithms cannot and must not usurp statutory administrative powers. SURAKSHA empowers the District Magistrate with transparent mathematical evidence while leaving executive authority in human hands.

---

## 8. STATUS & BADGE DICTIONARY

Use this reference to explain any label, badge, or status visible in the application:

### Screening Matrix Statuses
- **`PASS`:** The candidate site satisfies the technical threshold for this criterion (e.g. slope $<15^\circ$, outside flood zone). *Important: PASS does not mean the site is legally ready or guaranteed safe; it only means it passed baseline digital screening.*
- **`FAIL`:** The candidate site violates an exclusion threshold (e.g. slope $>22^\circ$, inside Reserve Forest, transit distance $>40\text{ km}$).
- **`UNKNOWN`:** Required baseline data is unavailable in the prototype (e.g. cadastral land ownership, mortgage encumbrance). The system preserves honest UNKNOWN states rather than fabricating safety.
- **`REQUIRED`:** An explicit field inspection or geotechnical ground survey is mandated before this dimension can be resolved.
- **`NOT ASSESSED`:** Dimension was not evaluated in the current prototype iteration (e.g. local market economic accessibility).

### Relocation Decision Outcome Badges
- **`RELOCATION_OPTIONS_AVAILABLE` (Green):** One or more candidate sites passed the 12-dimensional screening matrix and possess sufficient effective carrying capacity.
- **`NO_ELIGIBLE_CANDIDATE_SITE` (Crimson):** All candidate sites within the operational search radius violated environmental, slope, flood, or reserve forest exclusion constraints.
- **`INSUFFICIENT_CAPACITY` (Amber):** Candidate sites passed technical screening, but their Liebig bottleneck capacity cannot absorb the full habitation population demand.
- **`INSUFFICIENT_EVIDENCE` (Slate Gray):** Critical information (borehole data, revenue title encumbrance records) is unavailable or unresolved.
- **`FIELD_REVIEW_REQUIRED` (Dark Slate):** A human field officer has recorded an active ground challenge or suitability override.

### Evidence & Provenance Badges
- **`RUNTIME DATASET` (Green):** Data actively evaluated by the decision engine (pilot settlements and sites).
- **`DEMONSTRATION DATASET` (Amber):** Representative baseline data used for demonstration (Census 2011 decennial counts, simulated storm buffers).
- **`DOCUMENTED REFERENCE` (Blue):** Published scientific standards used to calibrate mathematical formulas (GSI slope criteria, IMD rainfall thresholds).
- **`EXTERNAL VALIDATION REQUIRED` (Crimson):** Parameters requiring on-site legal or engineering investigation outside the software (cadastral records, boreholes).

---

## 9. COMPLETE FEATURE INVENTORY TABLE

| # | Page | UI Feature Name | What the User Sees | What It Means | Why It Exists | User Action | Important Limitation |
|---|---|---|---|---|---|---|---|
| 1 | Landing | Technical Ribbon | Banner with pulsing green dot & SIH prototype badge | Confirms demo environment status | Sets operational context | Click to launch dashboard | Prototype demonstration mode |
| 2 | Landing | Hero Metrics | 4 KPI cards (16 settlements, 9,800+ pop, 5 corridors, 100% deterministic) | Scope of pilot coverage | Proves mathematical transparency | Review summary figures | Pilot demonstration figures |
| 3 | Landing | Decision Flow Stepper | 8 interactive stage buttons (`HAZARD` to `HUMAN REVIEW`) | Visualizes end-to-end pipeline | Explains methodology | Click step to inspect inputs/outputs | Conceptual interactive stepper |
| 4 | Landing | Liebig Capacity Visualizer | Comparison of 5 capacity pillars | Explains bottleneck constraint | Prevents over-allocation | Review limiting principle | Illustrative demonstration graphic |
| 5 | Dashboard | Corridor Selector | Dropdown / pill bar with 5 national corridors | Filters view to specific corridor | Enables local geographic focus | Select corridor to filter | Corridors are representative pilots |
| 6 | Dashboard | Primary KPI Tiles | 4 metrics (Habitations, Population, Immediate, Sites) | Real-time regional risk aggregates | Situational awareness | Review regional baseline | Reflects Census 2011 baseline |
| 7 | Dashboard | How SURAKSHA Decides | Expandable 10-stage pipeline accordion | Step-by-step logic breakdown | Explains software governance | Click to expand cards | Explains software boundary |
| 8 | Dashboard | View Switcher | Toggle between `MapLibre GIS` & `Schematic View` | Switches WebGL vs SVG layout | Supports low-bandwidth devices | Click to toggle mode | Schematic is non-geographical |
| 9 | Dashboard | Quick Settlement Inspector | Card detailing selected habitation | Instant demographic & risk summary | Rapid triage | Click action buttons | Summarizes selected entity |
| 10 | Dashboard | In-Situ Priority Badge | Amber badge: `In-Situ Priority (No Relocation Site)` | Triggered for Kuttanad / H14 | Highlights where relocation is unviable | Click Candidate In-Situ Measures | Specific to sub-sea-level zones |
| 11 | Dashboard | Disaster Events Tab | Chronological timeline of past incidents | Empirical evidence for Factor F | Validates recurrence scoring | Scroll and review events | 2018–2024 observation window |
| 12 | Dashboard | Data Sources Tab | List of 6 configured sources with confidence badges | Provenance catalog | Transparency of data lineage | Click to open Sources page | Static reference catalog |
| 13 | Multi-Hazard Map | Statutory Disclaimer | Amber banner: `DECISION SUPPORT ONLY` | Confirms software is non-statutory | Legal accountability | Review legal boundary | Model outputs are non-statutory |
| 14 | Multi-Hazard Map | Dynamic Shock Console | 3 buttons: Cloudburst, Flood Surge, Reset Baseline | Simulates extreme weather shocks | Tests dynamic buffer resilience | Click to trigger surge | Simulated parameter (5.5 km) |
| 15 | Multi-Hazard Map | Candidate Red Zones | Semi-transparent crimson polygons on map | Model-derived high-hazard zones | Visualizes spatial threat | Click polygon to view strategy | Derived from slope & flood DEM |
| 16 | Multi-Hazard Map | Bottom Quick Strip | Fixed horizontal settlement summary | Contextual awareness while mapping | Instant transition to modules | Click to evaluate sites | Contextual to map selection |
| 17 | Habitations | MCDA Sensitivity Panel | 5 criterion sliders + reset button | Interactive weight calibration | Policy sensitivity testing | Drag slider to recalculate | Weights are decision weights |
| 18 | Habitations | Planning Presets | Dropdown with 4 scenario reference models | Standardized weight configurations | Quick policy comparison | Select model (e.g. Landslide) | Illustrative policy presets |
| 19 | Habitations | Habitations Table | Sortable data table with progress bars | Full settlement inventory | Comprehensive data browsing | Click row to select habitation | Pilot dataset records |
| 20 | Habitations | MCDA Calculation Modal | Popup with arithmetic formula and point totals | Auditable mathematical proof | Eliminates black-box opacity | Click `How is this calculated?` | Arithmetic calculation breakdown |
| 21 | Habitations | Vulnerability Bar Chart | Horizontal bar chart of 5 factor values | Shows relative factor contributions | Identifies primary risk driver | Inspect bar lengths | Normalized 0–100 scale |
| 22 | Habitations | Historical Evidence Modal | Popup showing past disaster log for settlement | Evidence supporting Factor F | Validates empirical history | Click `X recorded past events` | 2018–2024 incident window |
| 23 | Habitations | Provenance Lineage Modal | Popup showing 8-stage assessment lineage | Full audit trail with assessment ID | Forensic auditability | Click `Provenance Lineage` | Tracks software calculation |
| 24 | Habitations | Human Field Review Modal | Popup with review statuses, designation, notes | Tool to record official field override | Human oversight mechanism | Select status and save review | Stored in local browser session |
| 25 | Relocation | Operational Standard Banner | Amber banner: `HUMAN REVIEW REQUIRED` | Re-iterates administrative standard | Sets legal boundary | Review disclaimer | Non-binding technical output |
| 26 | Relocation | Perspective Tabs | 3 tabs: Contextual, Site-Centric, 12-D Inventory | Different angles on matching | Comprehensive analysis | Click to toggle perspective | Reflects prototype dataset |
| 27 | Relocation | Contextual Match List | Ranked list of eligible candidate sites | Identifies viable alternatives | Decision support | Click to expand drawer | Contextual to selected habitat |
| 28 | Relocation | Candidate Site Drawer | Drawer with Liebig bars, merits, blockers | Deep-dive site evaluation | Detailed comparison | Review merits & constraints | Reflects prototype parameters |
| 29 | Relocation | 12-D Screening Matrix | Grid of 12 criteria (Pass, Fail, Unknown) | Negative screening evaluation | Rigorous suitability audit | Inspect matrix cells | Cadastral states are UNKNOWN |
| 30 | Relocation | Excluded Sites Accordion | List of rejected sites with reasons | Explains why sites failed | Defensible decision trail | Click to expand reasons | Based on threshold criteria |
| 31 | Relocation | 5-State Decision Grid | Grid of 5 standardized outcome states | High-level administrative finding | Actionable categorization | Review active outcome | Institutional classification |
| 32 | Relocation | Override Unsuitable Button | Button on candidate site cards | Allows officer to challenge site | Human authority override | Click to toggle override | Stored in local browser session |
| 33 | Relocation | Site-Centric Inspector | Dropdown to inspect site capacity allocation | Shows which habitations fit in site | Prevents site over-allocation | Select candidate site | Models many-to-many logic |
| 34 | Simulation | Pairing Parameter Grid | Source habitation & candidate site dropdowns | Sets up relocation simulation | Scenario configuration | Select pair and run model | Categorized by corridor |
| 35 | Simulation | Geodesic Distance Metric | Bold number showing transit distance in km | Real-world relocation friction | Feasibility evaluation | Review km distance | Haversine geodesic distance |
| 36 | Simulation | Risk Radar Chart | Multi-axis Before vs After radar comparison | Visual proof of risk reduction | Demonstrates safety gain | Inspect overlapping polygons | 5-factor normalized metrics |
| 37 | Simulation | Capacity Progress Meter | Colored bar showing population vs capacity | Tests Liebig capacity stress | Prevents secondary crisis | Check if capacity exceeded | Bounded by limiting utility |
| 38 | Simulation | 3-Phase Operational Strategy | 3 cards: Zero-Hour, Stabilization, Resettlement | Concrete administrative roadmap | District execution guidance | Review departmental tasks | Operational planning template |
| 39 | Simulation | AI Executive Brief Modal | Printable administrative memorandum | Formal memorandum for DDMA | Bridges data to governance | Click Print or Copy | Synthesized by AI layer |
| 40 | Sources | Provenance Taxonomy | 4 cards: Runtime, Demo, Reference, External | Classifies data trustworthiness | Technical transparency | Review data categories | Enforces data honesty |
| 41 | Sources | Extended Sources Catalog | 10 entries with vintage & confidence ratings | Complete data provider lineage | Legal defensibility | Inspect processing details | Reference baseline catalog |
| 42 | Sources | Software vs Reality Callout | Notice: Software passes $\ne$ Geotechnical safety | Prevents overclaiming | Safety and legal integrity | Review operational warning | Software verification boundary |
| 43 | In-Situ Strategy | Adaptation Strategy Modal | 3-Pillar In-Situ Plan with costs & agencies | Alternatives for zero-relocation zones | Defends heritage wetlands | Click candidate interventions | Candidate planning framework |
| 44 | DDMA Readiness | Offline Action Card Modal | Printable single-page A4 disaster card | Field warden emergency sheet | Offline disaster resilience | Click `Print A4 Action Card` | Operational field template |

---

## 10. STEP-BY-STEP 5–10 MINUTE DEMO SCRIPT

*Use this exact script when demonstrating SURAKSHA to an evaluation panel or judge:*

---

### [0:00 – 1:00] THE PROBLEM & PHILOSOPHY (Landing Page)
- **What to click:** Start on `http://localhost:3000/`.
- **What to say:**
  > “Respected judges, extreme weather events across India are forcing communities to face an impossible choice: stay in recurrent disaster zones or be displaced into ad-hoc camps with no water, no schools, and no legal titles. 
  > 
  > SURAKSHA is India’s first **Disaster Relocation Decision Support System** built on four core tenets: **AI Explains. GIS Measures. The Decision Engine Calculates. Humans Decide.** 
  > 
  > We do not use opaque black-box machine learning to displace citizens. We use open GIS primitives, auditable Multi-Criteria Decision Analysis, and Liebig’s Law of Carrying Capacity to give District Collectors defensible, transparent relocation alternatives.”
- **What to show:** Point to the 4 proof metrics (16 settlements, 9,800+ exposed population, 5 regional corridors, 100% deterministic). Click on Step 6 of the interactive stepper to show Liebig’s bottleneck principle.

---

### [1:00 – 2:30] SITUATIONAL AWARENESS (Dashboard)
- **What to click:** Click `View Decision Framework` or navigate to `/dashboard`.
- **What to say:**
  > “This is the DDMA Command Dashboard. At a glance, an executive official sees 16 monitored habitations, over 9,800 citizens exposed, and 10 immediate priority habitations. 
  > 
  > Notice the **Corridor Selector** at the top. SURAKSHA is not hardcoded to a single village; it models five distinct Indian hazard typologies: Western Ghats debris flows, Himalayan land subsidence, Brahmaputra riverine erosion, and delta coastal inundation.
  > 
  > Let’s filter to the **Western Ghats Corridor**. The dashboard updates instantly. Notice **Kavalapara Hamlet** in Wayanad: it has a composite risk score of 75/100, placed in the Immediate Urgency tier. Notice also **Kuttanad**: SURAKSHA explicitly flags it with an amber badge: *In-Situ Priority (No Relocation Site)* because traditional heritage wetlands cannot be mass-relocated. The system evaluates candidate in-situ amphibious adaptation rather than forcing unviable relocation.”
- **What to show:** Click *Western Ghats* in the corridor selector. Click *Kavalapara Hamlet* on the map to show the Quick Inspector update.

---

### [2:30 – 4:30] SPATIAL ANALYSIS & DYNAMIC SHOCKS (Multi-Hazard Map)
- **What to click:** Click `Explore Decision Map` or navigate to `/risk-map`.
- **What to say:**
  > “On the Multi-Hazard Spatial Viewer, we see PostGIS-derived Candidate Risk Zones in red and candidate resettlement sites in green.
  > 
  > A key innovation in SURAKSHA is our **Dynamic Event Simulation Console**. During a monsoon crisis, danger perimeters are not static. Watch what happens when an extreme rainfall event occurs over Kavalapara.”
- **What to click:** Click the red button: `Simulate IMD Cloudburst Alert (>65 mm/hr)`.
- **What to say:**
  > “The map immediately flies to Kavalapara, expands a dynamic 5.5 km hazard buffer, and triggers a high-priority alert. Notice our transparency: right below, our **Parameter Disclosure** explicitly clarifies that this buffer is an operational stress-test parameter, preserving data honesty without fabricating live telemetry.”
- **What to click:** Click `Candidate In-Situ Measures` on the bottom strip to quickly show the 3-pillar engineering interventions for slope reinforcement. Close the modal.

---

### [4:30 – 6:30] AUDITABLE RISK PRIORITIZATION (Habitation Risk)
- **What to click:** Navigate to `/habitations`.
- **What to say:**
  > “Why is Kavalapara scored 75/100? In SURAKSHA, there are no black boxes. 
  > 
  > On the left, our **MCDA Scenario Panel** shows the exact weights: 30% Hazard Intensity, 25% Population Exposure, 20% Social Vulnerability, 15% Disaster History, and 10% Accessibility Deficit. If I drag the Hazard slider, every settlement recalculates deterministically in real time.
  > 
  > Let’s look at the **Factor Breakdown Card**. The bar chart proves that Kavalapara’s primary driver is extreme terrain slope (>41°) and access isolation. If the judge asks for mathematical proof, I can click **‘How is this calculated?’** to display the exact weighted arithmetic.
  > 
  > Furthermore, look at **‘Officer Review’**. A visiting Tehsildar can record field ground observations, challenge the score, and store an official review record.”
- **What to show:** Open `How is this calculated?` modal, show the points table, then open `Officer Review` to show how a human officer confirms or challenges the rating.

---

### [6:30 – 8:30] RELOCATION INTELLIGENCE & LIEBIG’S LAW (Relocation)
- **What to click:** Navigate to `/relocation`.
- **What to say:**
  > “Now we arrive at the core problem: Where can these 340 residents go?
  > 
  > In the **Contextual Matching View**, SURAKSHA evaluates candidate sites for Kavalapara. **Meenangadi Rehabilitation Colony** is ranked #1. It is 12 km away, outside active debris flow corridors.
  > 
  > But look closely at the capacity drawer: Meenangadi has land for 500 people, but its schools capacity is only 250. Under **Liebig’s Law of the Minimum**, effective capacity is strictly capped at 250. Because Kavalapara has 340 residents, the system warns that utility expansion is required.
  > 
  > Look at the **12-Dimensional Screening Matrix**: We preserve honest **UNKNOWN** states for cadastral land ownership and legal encumbrance, reminding the District Collector that formal land records search is mandatory before title allotment.
  > 
  > Finally, look at the **5-State Decision Outcome Framework**: The system categorizes this finding into a legally defensible administrative outcome.”
- **What to show:** Expand the Meenangadi card, point to the Liebig breakdown bars, show the UNKNOWN states in the 12-D matrix, and point to the active outcome badge.

---

### [8:30 – 10:00] SIMULATION & AI EXECUTIVE BRIEF (Simulation)
- **What to click:** Click `Run What-If` on the Meenangadi card or navigate to `/simulation?hab=H1&site=S1`.
- **What to say:**
  > “To finalize the decision, we run a What-If Relocation Simulation. 
  > 
  > The **Risk Radar Chart** proves the dramatic drop in risk: the orange baseline collapses into the compact green line, achieving a **74% reduction in hazard exposure**.
  > 
  > Below, SURAKSHA provides a **3-Phase District Contingency Roadmap**: Phase 1 zero-hour evacuation, Phase 2 utility commissioning by PWD and PHED, and Phase 3 freehold land Patta distribution.
  > 
  > Finally, to bridge technical GIS data to bureaucratic action, I click **‘Generate AI Decision Brief’**.”
- **What to click:** Click `Generate AI Decision Brief (DDMA Review)`.
- **What to say:**
  > “In seconds, the AI synthesizes structured findings into an official memorandum addressed to the District Magistrate. It includes an indicative financial outlay—₹4.54 Crores split into 75% Central NDRF and 25% State SDRF shares—and an inter-departmental tasking matrix assigning deadlines to the Tehsildar, PWD, and PHED. 
  > 
  > It is ready to print, export to PDF, and sign. 
  > 
  > This is SURAKSHA: AI explains, GIS measures, the decision engine calculates, and humans decide. Thank you.”

---

## 11. 100+ FEATURE-BASED JUDGE QUESTIONS & ANSWERS

---

### Category A: Core Purpose, Philosophy & Governance (Questions 1 – 15)

#### Q1: What is SURAKSHA and what problem does it solve?
- **Answer:** SURAKSHA is a GIS-driven Disaster Relocation Decision Support System designed for District and State Disaster Management Authorities. It bridges the gap between raw hazard mapping and actionable resettlement by identifying endangered settlements, evaluating candidate relocation sites against 12 baseline screening criteria, calculating infrastructure carrying capacity bottlenecks, and producing auditable executive briefs.
- **Where to demonstrate:** Landing Page (`/`) hero section and Dashboard (`/dashboard`).

#### Q2: What does "AI Explains. GIS Measures. The Decision Engine Calculates. Humans Decide" mean?
- **Answer:** It defines the software’s strict separation of concerns: GIS measures physical spatial primitives (slopes, distances); deterministic formulas calculate risk and capacity; generative AI acts solely as a plain-language briefing assistant; and final statutory relocation orders remain strictly with authorized human officials.
- **Where to demonstrate:** Landing Page (`/`) Section 7 and Dashboard accordion (`/dashboard`).

#### Q3: Does SURAKSHA automatically decide to relocate people?
- **Answer:** No. SURAKSHA is strictly a decision-support system. It produces analytical findings, highlights infrastructure bottlenecks, and suggests candidate measures. Statutory decisions regarding land acquisition, gazetted notifications, and physical resettlement reside exclusively with competent government authorities (District Magistrates and Revenue Departments).
- **Where to demonstrate:** Statutory disclaimer banners on `/risk-map` and `/relocation`.

#### Q4: What makes SURAKSHA different from existing disaster portals like Bhuvan or NDMA portals?
- **Answer:** Existing national portals provide macro-scale hazard atlases (where floods or landslides happen), but they do not connect hazard perimeters to specific habitations, do not evaluate candidate destination sites, do not calculate multi-utility carrying capacity bottlenecks, and do not provide an end-to-end relocation decision workflow.
- **Where to demonstrate:** Decision Flow Interactive stepper on `/`.

#### Q5: Is this system powered by black-box machine learning?
- **Answer:** No. The core production scoring engine uses fully deterministic Multi-Criteria Decision Analysis (MCDA) and Liebig’s Law of the Minimum. Every calculated score can be audited down to the exact points contributed by each physical and social factor. Machine learning in the repository is confined to offline research benchmarks.
- **Where to demonstrate:** MCDA Explainer Modal on `/habitations` and Production Engine callout on `/sources`.

#### Q6: Why does the system include habitations where relocation is impossible?
- **Answer:** Real disaster management requires honesty. In places like Kuttanad (a sub-sea-level agrarian heritage zone), total relocation is rejected by local farming communities and unviable across Kerala. SURAKSHA explicitly flags these as "In-Situ Priority" and evaluates 3-pillar in-situ habitational defenses rather than forcing unviable relocation.
- **Where to demonstrate:** Kuttanad badge on `/dashboard` and In-Situ Adaptation Modal on `/habitations`.

#### Q7: Can a local field officer challenge or override the system’s scores?
- **Answer:** Yes. On the Habitation Risk page, the "Officer Review" feature allows field technical officers to record ground observations, mark data as outdated, or record a formal challenge that is preserved in the audit trail.
- **Where to demonstrate:** Click `Officer Review` on `/habitations`.

#### Q8: What legal frameworks does SURAKSHA align with?
- **Answer:** It aligns with the Disaster Management Act, 2005 (DDMA operational structures), the LARR Act, 2013 (land acquisition and resettlement standards), State Revenue Codes (freehold Patta title allotments), and SDRF/NDRF financial norms.
- **Where to demonstrate:** AI Executive Brief memorandum on `/simulation`.

#### Q9: Who is the primary target end-user of SURAKSHA?
- **Answer:** The District Collector (DDMA Chairperson), Sub-Divisional Magistrates, District Disaster Management Officers, and line department engineers (Revenue, PWD, PHED).
- **Where to demonstrate:** Sidebar footer displaying `Authorized Official: District Collector & DDMA Chairperson`.

#### Q10: Does SURAKSHA require internet connectivity to work during a disaster?
- **Answer:** While the central GIS map runs in modern web environments, SURAKSHA includes an offline DDMA readiness suite that generates printable single-page A4 disaster action cards for field wardens containing offline phone trees, radio channels, and shelter checklists.
- **Where to demonstrate:** `/readiness` page and `Print A4 Action Card` modal.

#### Q11: What is a "Corridor" in SURAKSHA?
- **Answer:** A corridor is a representative regional planning zone defined by shared geomorphological and hazard characteristics (e.g. Western Ghats steep slopes vs. Brahmaputra fluvial floodplains).
- **Where to demonstrate:** Corridor Selector on `/dashboard` or `/risk-map`.

#### Q12: How many demonstration corridors are configured?
- **Answer:** Five: All India Overview, Western Ghats Corridor (Zone 7), Himalayan Corridor (Garhwal), Eastern Plains & Delta (Bengal/Sundarbans), and North-East Corridor (Assam/Majuli).
- **Where to demonstrate:** Dropdown options on `CorridorSelector`.

#### Q13: What does the "SIH DEMO MODE" badge in the top bar mean?
- **Answer:** It transparently alerts the user that the system is operating in demonstration mode using curated pilot datasets and simulated shock triggers rather than live telemetric sensor feeds.
- **Where to demonstrate:** Top bar badge on any internal page.

#### Q14: How does SURAKSHA prevent secondary disasters at resettlement sites?
- **Answer:** By enforcing Liebig’s Law of the Minimum across five civic utilities (Land, Water, Sanitation, Healthcare, Schools). It ensures people are never relocated to sites lacking basic survival and educational infrastructure.
- **Where to demonstrate:** Liebig Capacity Section on `/` and `/relocation`.

#### Q15: What is the significance of the 8-stage pipeline?
- **Answer:** It standardizes the relocation decision process into reproducible, sequential stages: Hazard → Habitation → Risk/Priority → Relocation Need → Candidate Sites → Screening & Capacity → Matching → Human Review.
- **Where to demonstrate:** Decision Flow Interactive on `/`.

---

### Category B: Multi-Hazard Map & Geospatial Features (Questions 16 – 30)

#### Q16: What do the red shaded polygons on the map represent?
- **Answer:** They represent model-derived Candidate High-Risk Zones—geospatial perimeters identifying steep debris flow corridors, riverine floodways, coastal erosion strips, or land subsidence escarpments based on DEM slope and hydrological catchment analysis.
- **Where to demonstrate:** Red zones on `/risk-map`.

#### Q17: Do the red zones represent official government notifications?
- **Answer:** No. They are decision-support outputs generated from scientific reference criteria (GSI, CWC, NRSC). Final statutory hazard zoning remains the prerogative of the state government.
- **Where to demonstrate:** Statutory disclaimer banner at top of `/risk-map`.

#### Q18: What do the circular markers represent on the map?
- **Answer:** They represent monitored human settlements (hamlets, wards, colonies). Their color reflects their calculated urgency tier: Crimson for Immediate ($\ge 70$), Amber for Short-term ($45–69$), and Olive for Medium-term ($<45$).
- **Where to demonstrate:** Map markers and Map Legend on `/risk-map`.

#### Q19: What do the green square markers represent?
- **Answer:** They represent surveyed candidate resettlement land parcels located outside the active hazard zones.
- **Where to demonstrate:** Green squares on `/risk-map`.

#### Q20: What happens if I click on a red polygon on the map?
- **Answer:** It opens the **Candidate In-Situ Adaptation Measures Modal**, detailing a 3-pillar engineering strategy (structural protection, elevated safe havens, and eco-hydrology) tailored to that specific terrain hazard.
- **Where to demonstrate:** Click any red zone polygon on `/risk-map`.

#### Q21: What happens if I click on a habitation marker?
- **Answer:** The map pans and zooms to the settlement, highlights its perimeter, and populates the bottom Quick Inspector strip with its demographic profile, risk score, and direct workflow links.
- **Where to demonstrate:** Click *Kavalapara Hamlet* on `/risk-map`.

#### Q22: What is the purpose of the "Simulate IMD Cloudburst Alert" button?
- **Answer:** It demonstrates how SURAKSHA reacts to real-time extreme precipitation. It generates a dynamic 5.5 km buffer around the active settlement, flies the camera to the location, and displays an urgent operational alert banner.
- **Where to demonstrate:** Dynamic Event Simulation Console on `/risk-map`.

#### Q23: Is the cloudburst alert connected to a live satellite radar feed?
- **Answer:** No. It is an interactive simulation using standardized IMD criteria (>65 mm/hr) to demonstrate system resilience without fabricating fake external network connections.
- **Where to demonstrate:** Simulation Parameter Disclosure box on `/risk-map`.

#### Q24: What does the "Simulate CWC Flood Surge" button do?
- **Answer:** It models a river discharge shock exceeding High Flood Level (HFL) by dynamically expanding active flood inundation zones by 4.5 km.
- **Where to demonstrate:** CWC Flood Surge button on `/risk-map`.

#### Q25: How do I restore the map to its normal state after a simulation?
- **Answer:** Click the `Reset Baseline` button that appears in the simulation console.
- **Where to demonstrate:** `Reset Baseline` button on `/risk-map`.

#### Q26: What is the difference between "MapLibre WebGL" and "Schematic SVG"?
- **Answer:** MapLibre WebGL renders real-world geospatial vector map tiles with geographic coordinates. Schematic SVG provides a simplified topological network diagram useful on low-bandwidth devices.
- **Where to demonstrate:** View toggle in SectionHead on `/risk-map` or `/dashboard`.

#### Q27: How does the map measure travel distance between settlements and sites?
- **Answer:** It calculates real-world geodesic distances using the Haversine formula across WGS84 coordinates, supplemented by OpenStreetMap vehicular road vectors.
- **Where to demonstrate:** Transit distance badge on site cards in `/relocation`.

#### Q28: Why are some candidate sites shown on the map outside the regional corridor?
- **Answer:** In the simulation sandbox, cross-state sites are accessible to demonstrate algorithmic generality across different hazard typologies, but the system displays a clear "Geographical Infeasibility Warning" if transit exceeds 200 km.
- **Where to demonstrate:** Pairing Wayanad with Bankura on `/simulation`.

#### Q29: What coordinate reference system does SURAKSHA use?
- **Answer:** WGS84 (EPSG:4326), the standard global geodetic coordinate system.
- **Where to demonstrate:** Provenance Lineage Modal on `/habitations` (Step 2).

#### Q30: What does the Map Legend show?
- **Answer:** It defines the symbology: Immediate Risk ($\ge 70$, crimson), Short-Term (45–69, amber), Medium-Term (<45, olive), Candidate Sites (green square), and High-Risk Perimeters (red hatched polygon).
- **Where to demonstrate:** Top-right corner of map container on `/risk-map`.

---

### Category C: Habitation Risk & MCDA Prioritization (Questions 31 – 45)

#### Q31: What does a Composite Risk Score of "75" mean?
- **Answer:** 75 is SURAKSHA’s internal composite priority index on a 0–100 scale, calculated from five weighted criteria. It prioritizes administrative attention; it should not be described as a statistical probability of disaster or an official government classification.
- **Where to demonstrate:** Habitation Score badge on `/habitations`.

#### Q32: What are the five criteria that make up the risk score?
- **Answer:** Hazard Intensity (30%), Population Exposure (25%), Social Vulnerability (20%), Disaster History (15%), and Accessibility Deficit (10%).
- **Where to demonstrate:** MCDA Scenario Panel sliders on `/habitations`.

#### Q33: Why is Hazard Intensity weighted at 30%?
- **Answer:** In our baseline configuration modeled after NDMA landslide management strategies, physical terrain instability is the primary gating factor for life safety.
- **Where to demonstrate:** Reference Scenario Presets on `/habitations`.

#### Q34: What happens if I drag the MCDA weight sliders?
- **Answer:** The entire settlement inventory recalculates instantly in real time. The progress bars adjust, and settlements move between priority tiers based on the new weights.
- **Where to demonstrate:** Drag sliders on `/habitations`.

#### Q35: What does the "Reset" button do in the MCDA panel?
- **Answer:** It resets all five sliders back to the baseline configuration: 30% Hazard, 25% Exposure, 20% Vulnerability, 15% History, and 10% Access.
- **Where to demonstrate:** `Reset to Standard Weights` link on `/habitations`.

#### Q36: What is a "Reference Scenario Preset"?
- **Answer:** Pre-calibrated weight combinations modeled after published guidelines (e.g. NDMA Western Ghats, CWC Riverine Flood) allowing officials to stress-test prioritization under specific hazard policies.
- **Where to demonstrate:** Dropdown selector in `McdaScenarioPanel`.

#### Q37: Are these presets legally gazetted rules?
- **Answer:** No. The system explicitly discloses that they represent illustrative demonstration configurations modeled after published studies, not gazetted statutory rules.
- **Where to demonstrate:** Heading text inside `McdaScenarioPanel`.

#### Q38: What does the Vulnerability Bar Chart show?
- **Answer:** It breaks down the selected settlement's score into five individual horizontal bars (Hazard, Exposure, Vulnerability, History, Access), showing which specific dimension is driving the risk.
- **Where to demonstrate:** Factor breakdown card on `/habitations`.

#### Q39: What does clicking "How is this score calculated?" show?
- **Answer:** It opens the MCDA Explainer Modal, which reveals the exact arithmetic formula, raw input values, normalized scores, weight percentages, and actual points contributed by each factor.
- **Where to demonstrate:** `How is this score calculated?` button on `/habitations`.

#### Q40: What does the "Census 2011 Baseline" badge indicate?
- **Answer:** It transparently discloses that demographic counts originate from the 2011 decennial census and requires local Panchayat or ration card ground validation.
- **Where to demonstrate:** `PopulationVintageBadge` on `/dashboard` and `/habitations`.

#### Q41: What does "X recorded past events (2018–2024)" mean?
- **Answer:** It represents documented local disaster incidents during the 7-year empirical observation window feeding Factor F (Disaster History). Clicking opens the full incident timeline modal.
- **Where to demonstrate:** Historical evidence button on `/habitations`.

#### Q42: What does the "Evidence Status" badge (e.g., LIMITED EVIDENCE) mean?
- **Answer:** It signifies that while the calculations are mathematically valid for the supplied data, comprehensive geotechnical boreholes and cadastral searches are pending.
- **Where to demonstrate:** Evidence status badge on `/habitations`.

#### Q43: What is the "Assessment Identifier" (e.g., SRK-2026-H1-v1)?
- **Answer:** A unique cryptographic/hash identifier attached to every assessment calculation, ensuring complete auditability and reproducibility in government records.
- **Where to demonstrate:** Top right of factor card on `/habitations`.

#### Q44: What does the "Provenance Lineage" modal show?
- **Answer:** An 8-stage audit trail tracking the calculation from raw data ingestion to GIS reprojection, factor normalization, weight synthesis, and human governance.
- **Where to demonstrate:** `Provenance Lineage` button on `/habitations`.

#### Q45: How can a teammate explain a "Medium-term" habitation to a judge?
- **Answer:** Describe it as a settlement where current hazard exposure is low or existing access infrastructure provides adequate egress, placing it in routine seasonal surveillance rather than emergency relocation.
- **Where to demonstrate:** Select *Kodagu Slope Settlement* (Score 34) on `/habitations`.

---

### Category D: Candidate Sites & 12-Dimensional Screening (Questions 46 – 60)

#### Q46: What is a candidate relocation site in SURAKSHA?
- **Answer:** A surveyed public land parcel (revenue land or vested government poramboke) located outside active hazard perimeters, evaluated for accessibility and civic capacity.
- **Where to demonstrate:** Candidate site cards on `/relocation`.

#### Q47: What are the 12 dimensions in the site screening matrix?
- **Answer:** 
  1. Hazard Screening
  2. Carrying Capacity
  3. Drinking Water
  4. Sanitation
  5. Healthcare
  6. Schools
  7. Transit Access
  8. Land Ownership
  9. Legal Encumbrance
  10. Environmental Restrictions
  11. Land Acquisition Feasibility
  12. Field Verification
- **Where to demonstrate:** 12-D Matrix grid on `/relocation`.

#### Q48: What does PASS mean in the screening matrix?
- **Answer:** It means the site satisfies the baseline threshold in the digital GIS model (e.g. slope $<15^\circ$, outside flood zone, transit distance $<35\text{ km}$). It does **not** mean the site is guaranteed safe or legally clear in the real world.
- **Where to demonstrate:** Screening matrix cells on `/relocation`.

#### Q49: What does FAIL mean in the screening matrix?
- **Answer:** The site breaches a critical threshold (e.g. healthcare capacity $<300$, transit distance $>35\text{ km}$, or slope $>22^\circ$).
- **Where to demonstrate:** Bankura Transit Township matrix on `/relocation`.

#### Q50: What does UNKNOWN mean in the screening matrix?
- **Answer:** The required data (such as cadastral revenue ownership or legal encumbrances) is not present in the prototype. SURAKSHA preserves honest UNKNOWN states rather than fabricating safety.
- **Where to demonstrate:** Land Ownership cell on `/relocation`.

#### Q51: What does NOT ASSESSED mean in the screening matrix?
- **Answer:** The dimension (such as socioeconomic livelihood continuity) requires localized household surveys that cannot be evaluated purely through digital GIS data.
- **Where to demonstrate:** Livelihood Continuity box on `/relocation`.

#### Q52: What does REQUIRED mean in the screening matrix?
- **Answer:** A physical on-site field verification or geotechnical core drilling by competent authorities is mandatory before the site can be formally approved.
- **Where to demonstrate:** Field Verification cell on `/relocation`.

#### Q53: Why are cadastral land ownership records listed as UNKNOWN?
- **Answer:** Land revenue records are maintained at state/taluk land registries (Bhoomi, Dharani, etc.) and require cadastral ground demarcation and title searches under the LARR Act, 2013 before legal allotment.
- **Where to demonstrate:** Land & Administrative Screening panel on `/relocation`.

#### Q54: Why does SURAKSHA not generate synthetic livelihood continuity scores?
- **Answer:** To protect decision integrity. Livelihood continuity (e.g., whether coastal fishermen can transition to inland farming) depends on human socioeconomic surveys; inventing a computer algorithm score would mislead decision-makers.
- **Where to demonstrate:** Livelihood Continuity panel on `/relocation`.

#### Q55: What does "Revenue Land (Clear Title)" mean on a site card?
- **Answer:** The land parcel is classified under government revenue records as unencumbered government land, presenting the lowest legal litigation risk.
- **Where to demonstrate:** Land tenure information on Meenangadi (S1) card on `/relocation`.

#### Q56: What does "Vested Government Poramboke" mean?
- **Answer:** Government-owned wasteland or communal land that requires formal de-reservation and revenue gazette notification before residential allotment.
- **Where to demonstrate:** Perumbavoor (S2) card on `/relocation`.

#### Q57: What does "Reserve Forest (MoEFCC FCA 1980)" mean?
- **Answer:** Land designated under the Forest Conservation Act, 1980. Transfer requires statutory central clearance from the Ministry of Environment, Forest and Climate Change, typically taking 36+ months and carrying high litigation risk.
- **Where to demonstrate:** Kannur Highland Plots (S4) card on `/relocation`.

#### Q58: What is the "Minimum Capacity Filter Slider" on the site list?
- **Answer:** A slider allowing disaster managers to filter candidate sites that can support at least $N$ residents across all five utilities.
- **Where to demonstrate:** `minCap` slider on `/relocation` (Perspective 3).

#### Q59: Why might a site pass hazard screening but fail carrying capacity?
- **Answer:** Because physical safety from landslides does not guarantee the presence of drinking water pipelines, sanitation networks, or primary schools.
- **Where to demonstrate:** Compare Bankura (S3) hazard pass with capacity fail on `/relocation`.

#### Q60: Can an official manually mark a site as unsuitable?
- **Answer:** Yes. Clicking `Override Unsuitable` allows a field official to exclude a site based on local knowledge, updating the decision state immediately.
- **Where to demonstrate:** `Override Unsuitable` button on `/relocation`.

---

### Category E: Carrying Capacity & Liebig’s Bottleneck (Questions 61 – 70)

#### Q61: What is Liebig’s Law of the Minimum?
- **Answer:** A foundational scientific principle adapted by SURAKSHA: effective carrying capacity is governed not by the total resources available, but by the scarcest resource (the limiting bottleneck).
- **Where to demonstrate:** Liebig Capacity Section on `/`.

#### Q62: What is the formula for Effective Carrying Capacity?
- **Answer:** $\text{Effective Capacity} = \min(\text{Land}, \text{Water}, \text{Sanitation}, \text{Healthcare}, \text{Schools})$.
- **Where to demonstrate:** Formula strip in `CapacityBreakdown` on `/relocation`.

#### Q63: What happens if a site has land for 1,000 people but water for only 200?
- **Answer:** Its effective carrying capacity is strictly 200. The system will flag a capacity violation if more than 200 people are allocated there.
- **Where to demonstrate:** CapacityBreakdown bars on `/relocation`.

#### Q64: What is the primary bottleneck for Meenangadi (Site S1)?
- **Answer:** Schools infrastructure, capped at 250 residents.
- **Where to demonstrate:** Bottleneck badge on Site S1 on `/relocation`.

#### Q65: What is the primary bottleneck for Bankura Transit Township (Site S3)?
- **Answer:** Healthcare capacity, capped at 150 residents.
- **Where to demonstrate:** Bottleneck badge on Site S3 on `/relocation`.

#### Q66: What does the "LIMIT" badge indicate on a capacity bar?
- **Answer:** It identifies the specific utility dimension that is acting as the limiting bottleneck for that site.
- **Where to demonstrate:** Red `LIMIT` badge on capacity bars in `CapacityBreakdown`.

#### Q67: Why does SURAKSHA include Schools as a carrying capacity dimension?
- **Answer:** Under the Right to Education (RTE) Act and national rehabilitation guidelines, families with children will abandon resettlement colonies if classroom capacity is unavailable, triggering secondary distress migration.
- **Where to demonstrate:** Liebig Capacity Section on `/`.

#### Q68: How is Drinking Water capacity calculated?
- **Answer:** Based on per-capita daily drinking water supply norms (55–70 liters per capita per day under Jal Jeevan Mission standards).
- **Where to demonstrate:** CapacityBreakdown water bar on `/relocation`.

#### Q69: Can a site bottleneck be overcome through engineering?
- **Answer:** Yes. That is why SURAKSHA outlines a Phase 2 Stabilization strategy: PHED can commission deep borewells or the Education department can construct additional classrooms to raise the bottleneck ceiling.
- **Where to demonstrate:** Phase 2 card on `/simulation`.

#### Q70: What does "Available Capacity Headroom" mean?
- **Answer:** The remaining effective capacity after subtracting the population demand of the vulnerable settlement ($\text{Remaining} = \text{Effective} - \text{Demand}$).
- **Where to demonstrate:** Headroom metric on `/relocation`.

---

### Category F: Relocation Matching & Decision Outcomes (Questions 71 – 85)

#### Q71: What is "Many-to-Many Matching"?
- **Answer:** In real disaster corridors, multiple habitations compete for limited land parcels. Many-to-many matching models how multiple settlements can share destination sites without exceeding municipal infrastructure limits.
- **Where to demonstrate:** Relocation Matching Section on `/` and `/relocation` (Perspective 2).

#### Q72: What does "Relocation Options Available" mean?
- **Answer:** It is Decision Outcome 1: candidate sites within the operational corridor passed all baseline screening conditions and have sufficient capacity headroom to absorb the population.
- **Where to demonstrate:** Outcome 1 badge on `/relocation`.

#### Q73: What does "No Eligible Candidate Site" mean?
- **Answer:** Decision Outcome 2: all candidate sites evaluated within the search radius violated negative environmental, slope, flood, or forest constraints.
- **Where to demonstrate:** Outcome 2 badge on `/relocation`.

#### Q74: What does "Insufficient Relocation Capacity" mean?
- **Answer:** Decision Outcome 3: candidate sites passed digital screening, but their Liebig effective capacity is smaller than the population demand of the endangered settlement.
- **Where to demonstrate:** Outcome 3 badge on `/relocation`.

#### Q75: What does "Insufficient / Unknown Evidence" mean?
- **Answer:** Decision Outcome 4: critical data (geotechnical borehole stability, revenue title records) is missing or unverified, preventing a safe determination.
- **Where to demonstrate:** Outcome 4 badge on `/relocation`.

#### Q76: What does "Field / Technical Review Required" mean?
- **Answer:** Decision Outcome 5: a visiting officer has recorded an active ground challenge or suitability override that requires institutional reconciliation.
- **Where to demonstrate:** Outcome 5 badge on `/relocation`.

#### Q77: Why are candidate sites ranked contextually for each habitation?
- **Answer:** Because suitability depends on the specific pairing: transit distance, demographic demand, and cultural/livelihood continuity differ for every settlement.
- **Where to demonstrate:** `Rank 1 among eligible alternatives` badge on `/relocation`.

#### Q78: What does the "Match Score" represent?
- **Answer:** A composite suitability index (0–100) combining transit proximity, available capacity headroom, and road network accessibility.
- **Where to demonstrate:** Match score on `/relocation`.

#### Q79: What is the maximum operational search radius for candidate sites?
- **Answer:** In the baseline matching engine, sites are searched within an operational corridor target of 40 km (with cross-corridor searches up to 160 km).
- **Where to demonstrate:** API query parameters in `RelocationContent`.

#### Q80: What does the "Site-Centric" perspective show?
- **Answer:** It selects a single candidate site and displays all habitations that could potentially be accommodated within its effective capacity headroom.
- **Where to demonstrate:** Perspective 2 tab on `/relocation`.

#### Q81: What happens if a site is over-allocated?
- **Answer:** The system moves subsequent settlements into the "Ineligible / Excluded" list, citing that the site's effective capacity has been exhausted.
- **Where to demonstrate:** Ineligible Habitations list on `/relocation` (Perspective 2).

#### Q82: What is the "Exclusion Reasons" list?
- **Answer:** An explicit bulleted list explaining the exact technical reasons why a site was rejected (e.g., `Distance 41 km exceeds operational limit`, `Healthcare capacity deficit`).
- **Where to demonstrate:** Excluded Candidates accordion on `/relocation`.

#### Q83: What should a decision-maker do if there are no eligible candidate sites?
- **Answer:** SURAKSHA advises evaluating **Temporary Protective Measures** (evacuation and shelter prepositioning) or **Candidate In-Situ Measures** (slope retaining walls, drainage canals).
- **Where to demonstrate:** Secondary Operational Considerations panel on `/relocation`.

#### Q84: Can a candidate site be suitable for one village but unsuitable for another?
- **Answer:** Yes. A site with effective capacity of 300 can accommodate Kavalapara (pop 340 with slight expansion), but is completely unsuitable for Chellanam (pop 1,120).
- **Where to demonstrate:** Compare Kavalapara vs Chellanam on `/relocation`.

#### Q85: What is the difference between "Temporary Protective Measures" and "Planned Relocation"?
- **Answer:** Temporary measures protect lives during active monsoon events (evacuation, temporary shelters); planned relocation is a permanent multi-year legal resettlement to new freehold land.
- **Where to demonstrate:** Secondary Notes box on `/relocation`.

---

### Category G: What-If Simulation & AI Executive Briefs (Questions 86 – 95)

#### Q86: What does the What-If Relocation Simulation do?
- **Answer:** It pairs an endangered source settlement with a candidate destination site, modeling transit distance, before-vs-after risk reduction, and site infrastructure load.
- **Where to demonstrate:** `/simulation` page.

#### Q87: What does the Risk Radar Chart compare?
- **Answer:** It compares the source settlement’s baseline hazard profile (Before, orange fill) against the relocation site’s profile (After, green line) across five normalized axes: Hazard, Exposure, Vulnerability, History, and Access Deficit.
- **Where to demonstrate:** `RiskRadarChart` on `/simulation`.

#### Q88: What does a "74% Hazard Exposure Reduction" mean?
- **Answer:** Moving the population to the candidate site reduces their compound exposure to steep slope gradients and flood runout corridors by 74% based on GIS overlay analysis.
- **Where to demonstrate:** Hazard Exposure Reduction card on `/simulation`.

#### Q89: What does the Resettlement Site Capacity Load meter indicate?
- **Answer:** A visual progress bar showing resident demand as a percentage of site effective capacity. Green indicates headroom; red indicates capacity exceeded.
- **Where to demonstrate:** Capacity load meter on `/simulation`.

#### Q90: What is the 3-Phase Operational Planning Strategy?
- **Answer:** A district contingency execution roadmap: Phase 1 Zero-Hour evacuation (0–48 hours), Phase 2 Utility commissioning (1–6 months), and Phase 3 Freehold Patta land distribution (6–18 months).
- **Where to demonstrate:** Tab 2 on `/simulation`.

#### Q91: What is the AI Executive Decision Brief?
- **Answer:** A formal administrative memorandum generated by the AI Explanation Layer, addressed to the District Magistrate, summarizing vulnerability findings, capacity assessments, budgets, and departmental task matrices.
- **Where to demonstrate:** Click `Generate AI Decision Brief` on `/simulation`.

#### Q92: Does the AI calculate the financial outlay numbers?
- **Answer:** No. The financial numbers are calculated deterministically by backend financial formulas based on household counts and standard PMAY-G / SDRF norms; the AI merely explains and formats them.
- **Where to demonstrate:** Section 4 of Executive Brief modal.

#### Q93: What is the Central NDRF vs. State SDRF funding split in the brief?
- **Answer:** Standard national disaster financing: 75% Central share (NDRF/CSS) and 25% State matching share (SDRF).
- **Where to demonstrate:** Financial Outlay section in `ExecutiveBriefModal`.

#### Q94: What is the Inter-Departmental Tasking Matrix in the brief?
- **Answer:** Actionable directives with 30-to-90 day timelines assigned to specific departmental officers (Tehsildar for land demarcation, PWD for road access, PHED for water pipelines, DMO for clinics, DEO for schools).
- **Where to demonstrate:** Section 5 of Executive Brief modal.

#### Q95: Can the executive brief be exported or printed?
- **Answer:** Yes. It features a 1-click `Print / Export PDF` button formatted for standard government A4 printouts, and a `Copy Plaintext` button.
- **Where to demonstrate:** Top bar of `ExecutiveBriefModal`.

---

### Category H: Evidence, Provenance & Transparency (Questions 96 – 105)

#### Q96: Where does SURAKSHA get its landslide data?
- **Answer:** From Geological Survey of India (GSI) Macro-Landslide Susceptibility zonation maps and SRTM 30m Digital Elevation Model slope classifications.
- **Where to demonstrate:** Data Sources Catalog on `/sources`.

#### Q97: Where does SURAKSHA get its demographic data?
- **Answer:** Census of India 2011 decennial baseline tables, explicitly flagged as requiring local electoral roll / ration card validation.
- **Where to demonstrate:** Census entry on `/sources`.

#### Q98: What does the "Software Verification $\ne$ Real-World Validation" callout mean?
- **Answer:** It emphasizes that passing automated software tests (67 backend tests, 14 route checks) proves the software runs correctly according to specifications, but does **not** substitute for real-world geotechnical drilling or legal title clearance.
- **Where to demonstrate:** Technical callout box on `/sources`.

#### Q99: What is the role of offline Machine Learning models in the repository?
- **Answer:** Offline Random Forest and XGBoost models are exploratory research benchmarks for susceptibility mapping; they are deliberately kept out of the production path to prevent unexplainable automated decisions.
- **Where to demonstrate:** Production Engine vs Exploratory ML box on `/sources`.

#### Q100: How does SURAKSHA ensure generative AI does not hallucinate facts?
- **Answer:** The AI Explanation Layer operates under strict grounding constraints: it can only cite numerical values and entities present in the structured assessment record, and its outputs are validated for numerical consistency.
- **Where to demonstrate:** AI Explanation Layer step in Assessment Provenance modal.

#### Q101: What happens if an evaluation panel asks: "Can I upload my own district's survey data?"
- **Answer:** Yes. The Data Layer Ingestion page (`/data`) allows officials to upload custom CSV settlement surveys or GeoJSON hazard polygons, automatically validating schemas and coordinate systems.
- **Where to demonstrate:** `/data` page.

#### Q102: What is the "Offline Action Card" on the DDMA Readiness page?
- **Answer:** A printable single-page A4 disaster card for field wardens containing offline emergency phone trees, VHF radio channels, shelter coordinates, and pre-zero-hour checklists for use when mobile networks fail.
- **Where to demonstrate:** `Print A4 Action Card` on `/readiness`.

#### Q103: Why is Kuttanad evaluated for in-situ adaptation instead of relocation?
- **Answer:** Kuttanad is India’s only sub-sea-level farming ecosystem (FAO Globally Important Agricultural Heritage System) and a Ramsar wetland. Relocation is rejected by communities and land-infeasible across Kerala.
- **Where to demonstrate:** In-Situ Adaptation Strategy Modal on `/dashboard` or `/habitations`.

#### Q104: What are the three pillars of in-situ adaptation?
- **Answer:** 
  1. *In-Situ Structural Protection* (amphibious housing, ring dyke reinforcement).
  2. *Elevated Safe Havens & Transit* (raised community shelters, emergency flotillas).
  3. *Nature-Based & Eco-Hydrology* (mangrove bio-shields, tidal canal de-silting).
- **Where to demonstrate:** Pillar tabs in `AdaptationStrategyModal`.

#### Q105: If a judge asks: "What can the human decision-maker actually do with this information tomorrow?", how do you answer?
- **Answer:** 
  1. **Immediate life-safety:** Identify high-risk settlements for pre-monsoon evacuation.
  2. **Inter-departmental alignment:** Hand the PWD and PHED clear capacity bottleneck targets.
  3. **Legal initiation:** Direct the Revenue Department to begin cadastral surveys on high-ranking government parcels.
  4. **Budget requisition:** Submit the AI-generated memorandum and financial breakdown to the State Executive Committee for NDRF/SDRF funding sanctions.
- **Where to demonstrate:** AI Executive Decision Brief memorandum on `/simulation`.

---

## 12. INTERACTION QUICK REFERENCE ("IF THE JUDGE CLICKS THIS")

| If the judge clicks... | Where it is | What happens on screen | How to explain it to the judge |
|---|---|---|---|
| **Corridor Selector** | Dashboard, Map, Habitations | All counts, map views, habitations, and candidate sites filter instantaneously | *"SURAKSHA adapts dynamically to different geomorphological hazard typologies across India."* |
| **A Habitation Marker** | Multi-Hazard Map | Camera flies to marker, boundary highlights, inspector updates | *"The spatial engine immediately connects the physical map location to demographic risk metrics."* |
| **A Red Zone Polygon** | Multi-Hazard Map | Opens In-Situ Adaptation Strategy Modal | *"Clicking any hazard perimeter reveals candidate in-situ engineering defenses for that specific terrain."* |
| **Simulate IMD Cloudburst** | Multi-Hazard Map | 5.5 km dynamic buffer expands around settlement, urgent banner appears | *"Demonstrates how the DSS stress-tests dynamic perimeter expansion during extreme rainfall alerts."* |
| **Reset Baseline** | Multi-Hazard Map | Dynamic buffer disappears, map returns to baseline GIS perimeters | *"Restores original baseline reference conditions."* |
| **Any MCDA Slider** | Habitations Page | All 16 habitation risk scores and priority tiers recalculate in real time | *"Proves 100% mathematical transparency; every score is auditable and responsive to policy weights."* |
| **How is this calculated?** | Habitations Page | Opens MCDA Explainer Modal showing formula, weights, and point contributions | *"Shows the exact mathematical arithmetic; there are no black-box machine-learning secrets."* |
| **Officer Review Button** | Habitations Page | Opens Human Field Review Modal | *"Allows a human field officer to record ground truth notes, challenge scores, and ensure human oversight."* |
| **A Candidate Site Card** | Relocation Page | Expands drawer showing Liebig capacity bars, merits, blockers, and 12-D matrix | *"Reveals the 5 civic infrastructure dimensions and evaluates negative screening constraints."* |
| **Override Unsuitable** | Relocation Page | Marks site as unsuitable; updates 5-state decision outcome immediately | *"Empowers authorized officials to override algorithmic findings based on local field knowledge."* |
| **Run What-If Button** | Relocation Page | Navigates to Simulation page with that specific pairing pre-loaded | *"Transitions from site screening directly into operational relocation modeling."* |
| **Generate AI Brief** | Simulation Page | Generates printable administrative memorandum for DDMA sign-off | *"The AI Explanation Layer synthesizes structured findings into an official executive brief with tasking matrices."* |
| **Print / Export PDF** | AI Brief Modal | Opens browser print dialog formatted for A4 official memorandum | *"Prepares a formal government memorandum ready for administrative signature."* |
| **Candidate In-Situ Measures**| Habitations / Map | Opens 3-Pillar In-Situ Plan with cost estimates and implementing agencies | *"Provides engineering defense alternatives for heritage habitations where relocation is impossible."* |

---

## 13. PRODUCT TERMINOLOGY DICTIONARY

- **Hazard:** The physical natural event or terrain condition capable of causing destruction (e.g. slope failure, storm surge, river overtopping).
- **Exposure:** The presence of people, homes, livelihoods, and civic assets within the physical reach of a hazard.
- **Social Vulnerability:** The socioeconomic susceptibility of a community to harm (e.g. kutcha thatch dwellings, elderly dependency ratios).
- **Risk:** The composite index combining hazard severity, exposure, social vulnerability, historical disaster frequency, and road isolation.
- **Candidate Relocation Site:** A surveyed land parcel located outside active hazard zones, evaluated as a potential resettlement destination.
- **Site Screening:** Negative filtering evaluating candidate sites against 12 environmental, topographical, and legal exclusion criteria.
- **Carrying Capacity:** The total population volume an area’s civic infrastructure can support without system collapse.
- **Liebig’s Limiting Bottleneck:** The single infrastructure dimension (among land, water, sanitation, clinics, schools) that sets the upper bound on usable capacity.
- **Many-to-Many Matching:** Allocating multiple endangered settlements across multiple candidate sites while respecting shared infrastructure ceilings.
- **Decision Outcome State:** One of five standardized administrative findings (Options Available, No Eligible Site, Insufficient Capacity, Insufficient Evidence, Field Review Required).
- **In-Situ Adaptation:** Engineering defenses (amphibious foundations, ring dykes, drainage canals) constructed on-site when relocation is unfeasible.
- **AI Explanation Layer:** Generative AI constrained to explaining and formatting structured backend data into official memoranda without calculating or inventing data.

---

## 14. CLAIMS TO AVOID DURING THE DEMO

To maintain scientific credibility and prevent judicial or technical skepticism, teammates must avoid overclaiming:

| ❌ BAD (DO NOT SAY THIS) | ✅ BETTER (SAY THIS INSTEAD) |
|---|---|
| *"SURAKSHA automatically decides which villages to relocate."* | *"SURAKSHA provides multi-criteria decision support to help District Collectors evaluate defensible relocation options."* |
| *"The candidate site is 100% safe."* | *"The site passed baseline digital GIS screening; ground geotechnical drilling and cadastral title searches remain mandatory."* |
| *"Our AI algorithm calculates the risk scores."* | *"Our deterministic MCDA decision engine calculates the risk scores; the AI layer strictly explains the structured findings in plain language."* |
| *"This is live real-time satellite radar telemetry."* | *"This is an interactive simulation demonstrating how dynamic event triggers expand hazard buffers under standardized IMD criteria."* |
| *"Our software has been validated in the real world."* | *"Our software implementation is verified through 67 automated backend tests; real-world physical validation requires on-site administrative surveys."* |
| *"Our MCDA weights are universally scientifically proven."* | *"Our baseline MCDA weights represent an auditable demonstration configuration modeled after published NDMA guidelines."* |
| *"The system guarantees safe relocation."* | *"The system enforces Liebig’s infrastructure bottleneck limits to prevent over-allocation and secondary public health crises."* |

---

## 15. CURRENT VS. OUTDATED FEATURES

*Audit note: In previous prototype iterations and early documentation, certain terminology and components were structured differently. Use this table to ensure you describe the CURRENT product:*

| Feature Area | Old Documentation / Legacy Terminology | Current Product Implementation |
|---|---|---|
| **Scenario Presets** | Referred to as *"Gazetted Presets"* or *"Statutory Presets"* | Renamed to **"Reference Scenario Presets (Illustrative Demonstration Presets)"** (`REFERENCE_SCENARIO_PRESETS`) to explicitly clarify they are demonstration models, not legal gazettes. |
| **Relocation Outcomes** | Binary suitable/unsuitable classifications | Standardized into the **5-State Decision Outcome Framework** (Options Available, No Eligible Site, Insufficient Capacity, Insufficient Evidence, Field Review Required). |
| **Screening Matrix** | Generic suitability checklist | Standardized **12-Dimensional Screening Matrix** preserving explicit `UNKNOWN` and `REQUIRED` states for cadastral and geotechnical parameters. |
| **Zero-Relocation Zones** | Treated as unresolvable errors | Formally integrated with the **3-Pillar Candidate In-Situ Adaptation Framework** (specifically demonstrated for Kuttanad / H14). |
| **AI Role** | Broadly described as "AI decision-making" | Formally designated as the **AI Explanation Layer**, strictly restricted to narrative briefings and inter-departmental task matrices. |
| **Field Verification** | Unrecorded manual assumption | Formally implemented as the **DDMA Human Field Review Modal** allowing officers to challenge scores and record local browser audit records. |

---

## 16. FINAL FEATURE COMPLETENESS AUDIT CHECKLIST

Before presenting to an evaluation panel, verify that you can locate and demonstrate every item on this checklist:

- [x] **Landing Page (`/`):** Hero metrics, 8-stage interactive stepper, MCDA showcase, Liebig bottleneck showcase, human governance boundary, and module links.
- [x] **Dashboard (`/dashboard`):** 4 KPI tiles, Corridor selector, How SURAKSHA Decides accordion, MapLibre WebGL map, Quick Inspector card, Priority table, Disaster events tab, and Data sources tab.
- [x] **Multi-Hazard Map (`/risk-map`):** Statutory disclaimer, Dynamic Shock Console (IMD cloudburst / CWC flood surge), Map Legend, red polygons, habitation markers, candidate site markers, and bottom quick strip.
- [x] **Habitation Risk (`/habitations`):** 5 MCDA sliders, scenario presets, settlement table, factor breakdown bar chart, MCDA explainer modal, historical evidence modal, provenance modal, and officer review modal.
- [x] **Relocation Intelligence (`/relocation`):** Contextual matching view, 5-state decision outcome grid, candidate site drawer, Liebig capacity breakdown, 12-dimensional screening matrix, excluded sites accordion, site-centric view, and all candidate sites inventory.
- [x] **Simulation (`/simulation`):** Habitation & site parameter selectors, cross-state infeasibility warning, before-vs-after risk radar chart, capacity load progress meter, 3-phase operational contingency strategy, and AI Executive Brief modal.
- [x] **Evidence & Sources (`/sources`):** 4-part provenance taxonomy, 10 catalog entries, software verification vs. real-world validation callout, and production engine vs. exploratory ML disclosure.
- [x] **Specialized Modules:** DDMA Lifeline Readiness suite with printable A4 action cards (`/readiness`), Disaster History timeline (`/history`), and Data Layer schema ingestion (`/data`).
- [x] **Operational Distinctions:** Clear differentiation between Hazard, Exposure, Risk, and Relocation Sites.
- [x] **Legal Boundaries:** Clear articulation that software assists decision-making, while statutory executive decisions remain exclusively with human authorities.

---

*SURAKSHA — Smart India Hackathon Prototype · Prepared for Evaluation Panel Demonstrations.*
