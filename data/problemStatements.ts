import { ProblemStatement } from "@/types/problemStatement";

export const PROBLEM_STATEMENTS_DATA: ProblemStatement[] = [
  // ==========================================
  // HARDWARE TRACKS
  // ==========================================
  {
    id: "ps-hw-01",
    code: "CB-HW-01",
    title: "ENERSENSE — AI-POWERED SMART ELECTRICITY MANAGEMENT SYSTEM FOR CAMPUSES",
    domain: "GreenTech & Sustainability",
    category: "Hardware",
    difficulty: "Advanced",
    shortDescription:
      "Colleges and organisations run hundreds of fans, tube-lights, ACs, and other electrical loads that are frequently left running in empty rooms, driving up electricity bills and wearing out equipment faster than necessary. This problem calls for an AI-powered, occupancy-aware system that automatically manages electrical loads and gives facility teams real-time visibility into where energy is actually being wasted.",
    fullDescription:
      "Any mid-to-large campus or organisation — classrooms, labs, staff rooms, hostels, offices — has a large number of electrical appliances (fans, tube-lights/LED panels, ACs, projectors, plug loads) spread across many rooms. In practice, these are rarely operated efficiently: lights and fans are switched on in the morning and often stay on well after a room has emptied out, ACs run at full load regardless of actual occupancy or outside temperature, and appliances are left on overnight or over weekends simply because no one remembered to switch them off.\n\nThis has two compounding costs. First, unwanted, unnecessary energy consumption directly inflates electricity bills, and constant unnecessary run-time also shortens the operational lifespan of the equipment itself (motors, ballasts/drivers, compressors), adding avoidable maintenance and replacement costs. Second, there is typically no monitoring or automation layer in place at all — switches are manual, there's no way to know from a central point which rooms have lights/fans on, and there is certainly no automatic system that turns things off when a room becomes unoccupied and back on when someone enters.\n\nThe core challenge, then, is not just \"add a sensor to a switch\" — it's building a system that can reliably distinguish genuine occupancy from false triggers, learn usage patterns across many different room types (classroom vs. lab vs. office vs. hostel), and give administrators a simple, trustworthy way to see and reduce waste — without constant manual intervention and without annoying users with lights that switch off while they're clearly still in the room.",
    keyDeliverables: [
      "1. Sensing Layer\n• Occupancy detection — PIR motion sensors and/or ultrasonic sensors per room to detect genuine human presence (not just movement of curtains/fans), with dual-sensor logic to reduce false positives/negatives.\n• Current/energy sensing — non-invasive current sensors (e.g., clamp-on CT sensors) on key circuits to measure real-time power draw per room or per appliance group.\n• Ambient sensing (optional) — light and temperature sensors to support smarter decisions (e.g., don't turn on lights if daylight is sufficient; don't run AC at full blast if the room is already cool).",
      "2. Automated Control Layer\n• Relay-based switching — microcontroller-driven (e.g., ESP32/Arduino-class boards) relay modules that can automatically switch fans, lights, and other loads on/off based on occupancy and rules.\n• Grace-period logic — a configurable delay before auto-switch-off (e.g., 5–10 minutes of no detected occupancy) to avoid abrupt cut-offs while someone is still present but momentarily still.\n• Manual override — a physical switch or app-based override so users can retain manual control when genuinely needed, without fighting the automation.\n• AC-specific control — smart IR/relay control for ACs that adjusts based on occupancy and, where possible, temperature setpoint optimisation.",
      "3. Intelligence & Monitoring Layer\n• Central dashboard — a web/mobile dashboard showing real-time status (on/off, power draw) of every connected room/circuit across campus.\n• AI-based usage prediction — a lightweight ML model that learns typical occupancy/usage patterns per room (by day of week, time of day, room type) to anticipate needs and flag anomalies (e.g., 'Lab 3 AC has been running continuously for 48 hours with no logged occupancy').\n• Consumption analytics & reporting — historical energy-use trends, room-wise/department-wise consumption comparisons, and estimated cost savings versus a pre-automation baseline.\n• Alerts — notifications to facility staff for equipment left on unexpectedly, unusual consumption spikes, or sensor/hardware faults.\n• Scalable, retrofit-friendly design — the system should be installable on existing wiring/appliances without requiring a full electrical overhaul, so it can realistically scale across many rooms and buildings.",
    ],
    constraints: [
      "Must support retrofit installation on existing campus wiring/appliances without requiring a full electrical overhaul",
      "Robust dual-sensor logic with configurable grace-period delay (5–10 min) before auto-switch-off to prevent false cut-offs while someone is present",
      "Physical and app-based manual override to retain manual control when genuinely needed without fighting automation",
      "Reliable fail-safe operation to prevent electrical hazards and guarantee continuous power availability",
    ],
    relevantDatasets: [
      "Reference datasheets for PIR/ultrasonic occupancy sensors, CT current sensors, and relay modules (for hardware component selection and calibration).",
      "Open-source microcontroller/IoT platform documentation (e.g., ESP32, Arduino, ESP-NOW/MQTT protocols) for building the sensor-to-cloud pipeline.",
      "Sample/simulated room-occupancy and appliance-usage datasets (time-of-day, day-of-week patterns) for training and testing the AI usage-prediction model.",
      "Public building energy-benchmarking data (typical classroom/office/lab energy-use baselines) to validate expected savings estimates.",
      "Electricity tariff/billing-structure data (slab rates, time-of-day pricing if applicable) to translate energy savings into rupee-cost savings for reporting.",
      "Synthetic sensor-fault/anomaly datasets to test the alerting logic for stuck relays, faulty sensors, or abnormal consumption patterns.",
    ],
    evaluationFocus: [
      "Occupancy-detection accuracy — how reliably the system distinguishes real presence from false triggers (fans moving curtains, sensor noise), and how well it avoids annoyingly switching off while someone is present.",
      "Energy-savings impact — credible, ideally measurable, reduction in energy consumption versus a manual-control baseline.",
      "Hardware reliability & safety — robustness of the relay/switching hardware for continuous real-world use, with proper electrical safety practices.",
      "Retrofit feasibility — how easily the system can be installed on existing campus wiring/appliances without major renovation cost.",
      "Dashboard usability — clarity and actionability of the monitoring dashboard for non-technical facility staff.",
      "User experience — whether the automation feels helpful rather than intrusive (grace periods, manual override) to actual room occupants.",
      "Scalability & cost-effectiveness — realistic per-room hardware cost and feasibility of scaling the solution across an entire campus.",
      "Equipment lifespan impact — plausibility of the reduced unnecessary run-time genuinely extending appliance lifespan and cutting maintenance costs.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-HW-01.pdf",
  },

  // ==========================================
  // SOFTWARE TRACKS
  // ==========================================
  {
    id: "ps-sw-01",
    code: "CB-SW-01",
    title: "TELEHEALTH BRIDGE FOR UNDERSERVED RURAL AREAS",
    domain: "HealthTech & Wellbeing",
    category: "Software",
    difficulty: "Intermediate",
    shortDescription:
      "Small-town and rural hospitals often run at less than half their required doctor strength, forcing patients into long, often futile trips for care. This problem calls for a multilingual telemedicine solution built for genuinely low-connectivity rural conditions.",
    fullDescription:
      "Many rural and semi-urban belts face an acute healthcare access gap. A typical local hospital may operate with barely half its sanctioned doctor posts filled, while patients from dozens of surrounding villages — many of them daily-wage earners and farmers who lose a day's income to travel — frequently arrive only to find the specialist they need unavailable or medicines out of stock. Poor road conditions and weak local infrastructure compound the delay.\n\nThe consequence is preventable complications, worsening health outcomes, and financial strain concentrated among the population least able to absorb it. Rural internet penetration remains limited in many such regions, so any digital solution has to work under genuinely constrained connectivity, not assume broadband-grade bandwidth. At the same time, telemedicine adoption across India has been growing rapidly, showing real appetite for such solutions if they're designed for the actual environment.",
    keyDeliverables: [
      "Multilingual video consultation app connecting rural patients directly with available doctors/specialists.",
      "Offline-accessible digital health records so patient history is available even without a live connection.",
      "Real-time medicine-availability updates from local pharmacies, so patients aren't sent on a wasted trip.",
      "Low-bandwidth AI symptom checker to triage and guide patients before a consultation, optimised for weak/patchy networks.",
      "Scalability by design — architecture should generalise across multiple underserved regions, not just one town.",
    ],
    constraints: [
      "Must function reliably under 2G/3G or patchy, intermittent connectivity mode",
      "Zero health data loss during network drops with automatic offline queue and background synchronization",
      "Designed with high usability for low-literacy users and vernacular dialect speakers",
    ],
    evaluationFocus: [
      "Offline/low-bandwidth robustness — does the solution genuinely function on weak connectivity, or does it silently assume broadband?",
      "Multilingual & accessibility design — usability for patients with low literacy or unfamiliarity with smartphones.",
      "Clinical safety of the symptom checker — appropriate triage logic, clear escalation paths, no false reassurance on serious symptoms.",
      "Real-world integration — feasibility of syncing with actual pharmacy stock data and hospital staff schedules.",
      "Scalability & replicability — how easily the model extends to other underserved regions.",
      "Measurable impact — reduction in unnecessary travel, wait times, and missed consultations.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-SW-01.pdf",
  },
  {
    id: "ps-sw-02",
    code: "CB-SW-02",
    title: "INTELLIGENT MULTI-HAZARD DISASTER MANAGEMENT & RESPONSE SYSTEM",
    domain: "Smart Cities & Digital Governance",
    category: "Software",
    difficulty: "Advanced",
    shortDescription:
      "Coastal and flood-prone regions face multiple, overlapping hazards — cyclones, floods, droughts, heatwaves, lightning, landslides, and storm surges — but early-warning systems usually stop at 'a warning was issued,' not 'here is what will happen where, and what to do about it.' This problem calls for an AI-powered, geospatial platform that turns real-time hazard data into location-specific risk assessments and actionable response decisions across multiple disaster types at once.",
    fullDescription:
      "Regions exposed to a wide range of natural and climate-related hazards need more than a generic alert broadcast — effective disaster management means converting real-time hazard information into location-specific risk levels, predicted impact, and concrete response actions before and during an event. State-level disaster management authorities have increasingly pointed to the need for genuinely impact-based forecasting: models that combine hazard data (what's happening), exposure data (who and what is in the path), and vulnerability data (how badly they'd be affected) into one usable output, rather than treating hazard forecasting as a standalone weather problem.\n\nMost existing systems are also single-hazard — a flood tool, a cyclone tracker, a heatwave advisory — forcing emergency responders to mentally stitch together multiple disconnected sources during a crisis, when time matters most. There is a clear need for a unified platform that works across hazard types and pushes the analysis all the way through to operational decisions: which populations and locations are most vulnerable right now, what impact is likely, which evacuation routes and shelters make sense, and how to coordinate emergency resources on the ground.\n\nCore Challenge: How can heterogeneous real-time data — weather feeds, satellite imagery, river-level sensors, crowdsourced reports, and historical records — be transformed into actionable, location-specific decisions before and during a disaster?\n\nTeams are encouraged to combine AI/ML, GIS, satellite/open data, weather information, crowdsourced reports, routing algorithms, and real-time dashboards to build a system that spans the full pipeline: Hazard Detection → Risk Assessment → Impact Prediction → Resource Planning → Evacuation/Response → Real-Time Monitoring.",
    keyDeliverables: [
      "Hazard Detection & Ingestion Layer — pulls in real-time and historical data from weather feeds, satellite/open data, river-level sensors, and crowdsourced citizen reports, normalising heterogeneous sources into a common data model.",
      "Risk Assessment Engine — combines hazard, exposure, and vulnerability data to compute location-specific risk, not just raw hazard intensity.",
      "Impact Prediction Module — generates a dynamic, colour-coded risk map (Low, Moderate, High, Critical) with explainability showing why an area was classified at a particular risk level.",
      "Resource Planning Module — helps authorities identify available emergency resources (shelters, medical facilities, vehicles) and plan allocation against predicted impact zones.",
      "Evacuation & Response Module — recommends evacuation routes and nearest shelters using routing algorithms, factoring in real-time road-status data (open/blocked) and shelter capacity.",
      "Real-Time Monitoring Dashboard — a live operational dashboard for authorities to track unfolding conditions (rainfall, river levels, GPS of emergency vehicles, citizen reports) as a disaster develops.",
      "Multi-Hazard Generalisability — architecture supporting cyclones, floods, droughts, heatwaves, lightning, landslides, and storm surges rather than being hard-coded to a single hazard type.",
    ],
    constraints: [
      "Open data & datasets: Weather & rainfall data, flood zonation maps, cyclone tracks, elevation/topographic data, and district/demographic GIS layers",
      "Simulated real-time streams allowed for demo: periodic rainfall/river updates (5–15 min), emergency vehicle GPS, live citizen reports, road status updates",
      "Risk classifications must be explainable to non-technical emergency coordinators",
    ],
    relevantDatasets: [
      "Weather & Rainfall Data — historical rainfall, district/subdivision-wise rainfall, temperature, weather observations, and extreme-rainfall event records (e.g., from open-government meteorological datasets).",
      "Flood & Hazard Data — flood hazard/zonation maps, river/water-level datasets, historical flood records, digital elevation/topographic data, and flood-prone area information.",
      "Cyclone Data — historical cyclone tracks, wind speed, rainfall, storm surge, landfall information, and coastal vulnerability indices.",
      "Geographic & Population Data — district/block/village boundaries, population density, roads, rivers, bridges, hospitals, schools, relief/shelter locations, and other critical infrastructure.",
      "Historical Disaster Data — records of past floods, cyclones, and landslides, including disaster-related damage, affected population, and agricultural/property losses.",
      "Simulated Real-Time Data — for demo purposes, simulated streams such as periodic rainfall updates (every 5–15 min), river-level updates, emergency vehicle GPS feeds, live citizen reports, dynamic shelter-capacity updates, and road open/blocked status.",
    ],
    evaluationFocus: [
      "Cross-hazard generalisability — does the architecture genuinely extend across multiple hazard types, or is it a single-hazard tool with a generic wrapper?",
      "Explainability of risk classification — can the system justify why a location is Low/Moderate/High/Critical in terms a non-technical emergency responder can understand and trust?",
      "Data integration robustness — how well the platform ingests and reconciles heterogeneous, asynchronous data sources (satellite, sensor, crowdsourced, historical).",
      "Real-time performance — responsiveness of the pipeline and dashboard under simulated live-data conditions (rainfall/river-level updates every 5–15 minutes, live GPS/citizen reports).",
      "Actionability — how directly the system's output translates into concrete decisions (evacuation routes, shelter assignment, resource allocation), not just a static risk map.",
      "Usability under pressure — dashboard clarity and decision-support quality for authorities operating in a high-stress, time-critical scenario.",
      "Scalability & resilience — ability to handle multiple simultaneous hazard events and scale across different regions/geographies.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-SW-02.pdf",
  },
  {
    id: "ps-sw-03",
    code: "CB-SW-03",
    title: "OFFLINE-FIRST DIGITAL LEARNING APP FOR UNDER-RESOURCED SCHOOLS",
    domain: "EduTech & Future Learning",
    category: "Software",
    difficulty: "Intermediate",
    shortDescription:
      "Many schools in rural and low-connectivity areas lack updated computer infrastructure, reliable internet, and access to quality digital educational content, widening the gap between rural and urban education standards. This problem calls for a mobile and web learning app that works genuinely offline and in local languages.",
    fullDescription:
      "Many schools in rural and remote areas lack updated computer infrastructure, reliable internet connectivity, and access to quality digital educational resources. Teachers and students struggle with outdated systems, and digital literacy remains low. As a result, students face difficulty learning essential digital skills and accessing modern educational content, widening the gap between rural and urban education standards.\n\nThe lack of digital resources and skills limits students' academic growth and future employability. With digital literacy becoming increasingly important, students in such areas risk being left behind, perpetuating cycles of educational and economic disadvantage. Addressing this is urgent to ensure equitable access to quality education and empower under-resourced students with skills for the modern world.",
    keyDeliverables: [
      "Offline-first mobile and web app — core lessons and content accessible without an active internet connection.",
      "Interactive lessons in local languages to improve engagement and comprehension.",
      "Digital literacy modules tailored specifically for students with little prior device exposure.",
      "Teacher dashboards to track student progress even in low-connectivity settings (syncing when connectivity is available).",
      "Low-end device optimisation — the app must run smoothly on entry-level smartphones/older hardware, not just flagship devices.",
    ],
    constraints: [
      "Must function reliably without an active internet connection for everyday learning workflows",
      "Zero educational progress data loss with automatic background sync when connectivity is restored",
      "Resource-efficient runtime footprint optimised for budget and older smartphone hardware",
    ],
    relevantDatasets: [
      "Open-licence school curriculum content (NCERT/state-board equivalents, or open educational resource (OER) repositories) for lesson material.",
      "Sample multilingual content datasets (translated lesson text/audio in target regional languages).",
      "Public digital-literacy course frameworks for structuring literacy modules.",
      "Synthetic/sample student-progress datasets for testing the teacher dashboard's analytics.",
      "Device/network benchmark data (representative low-end device specs, typical rural bandwidth figures) to guide performance optimisation targets.",
    ],
    evaluationFocus: [
      "True offline capability — does core functionality genuinely work without connectivity, not just cache a login screen?",
      "Language & content quality — accuracy and clarity of localised lesson content, not machine-translated filler.",
      "Performance on low-end devices — real testing on constrained hardware/data plans, not just high-end simulators.",
      "Teacher usability — how easily a non-technical teacher can view and act on student progress data.",
      "Engagement design — whether the content format (interactivity, pacing) is genuinely suited to first-time digital learners.",
      "Scalability — feasibility of extending content coverage to additional subjects/languages/regions.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-SW-03.pdf",
  },
  {
    id: "ps-sw-04",
    code: "CB-SW-04",
    title: "AGRISAGE — UNIFIED AI FARM COPILOT, RISK INTELLIGENCE & MARKET OPTIMIZER",
    domain: "AgriTech & Rural Innovation",
    category: "Software",
    difficulty: "Advanced",
    shortDescription:
      "Farmers today need three different kinds of support that are rarely offered together: day-to-day crop guidance, early warning against risks that could wipe out a harvest, and smart decisions about what to grow and where to sell it. This problem calls for a single AI copilot that covers the entire journey — from sowing advice, through risk monitoring, to the final sell decision — instead of forcing farmers to piece together three different tools.",
    fullDescription:
      "A farmer's decision-making doesn't happen in isolated silos — advisory, risk, and market decisions are all connected parts of the same crop journey, yet most digital farming tools only address one slice of it. A chatbot might answer \"what should I do today,\" a separate risk tool might warn about pests, and a totally different app might show mandi prices — with no single system connecting what's happening in the field to what's happening in the market, or explaining why a recommendation is being made.\n\nThis creates three compounding gaps:\n\n1. Personalised, multimodal guidance is missing. Farmers rarely get advice that's genuinely tailored to their specific crop stage, field conditions, and history — most advisory is generic, text-only, and doesn't account for what a farmer can actually show (a photo of a diseased leaf) or say (a voice query in their own dialect).\n\n2. Risk is detected too late, or not explained at all. Disease outbreaks, pest infestations, extreme weather, water stress, and sudden price crashes are all threats that could be flagged early — but most tools either don't predict them at all, or issue a black-box alert with no explanation of why the risk is rising or what to actually do about it.\n\n3. The \"what to grow, where to sell\" decision is made blind. Even when a farmer successfully grows a good crop, they often have no data-backed guidance on which crop would have been most profitable to plant, which market would pay best, when to sell for the best price, or how to get the produce there efficiently — so good harvests still translate into disappointing income.\n\nThe challenge is to unify all three into a single AI copilot that accompanies a farmer through the entire crop cycle: from the decision of what to plant, through daily advisory and risk monitoring while it grows, to the final decision of when, where, and how to sell.",
    keyDeliverables: [
      "Module 1 — Farm Copilot (Personalised Advisory)\n• Multilingual voice & text interface — farmers ask questions or report issues by speaking naturally in their own language/dialect.\n• Image-based crop analysis — farmers upload/photograph crop or leaf images for AI-based identification of visible issues (disease symptoms, nutrient deficiency, pest damage).\n• Weather-aware guidance — combines local weather forecasts with crop stage to time irrigation, spraying, and other operations correctly.\n• Farm-history-aware personalisation — recommendations account for the specific farmer's past crop choices, soil type, and recorded outcomes, not generic advice.\n• Full crop-cycle coverage — guidance spans sowing, growth-stage care, harvest timing, and post-harvest handling, not just a single moment in the season.",
      "Module 2 — Crop Risk Intelligence (Early Warning)\n• Multi-threat risk modelling — predicts risk across disease outbreaks, pest infestations, extreme weather events, water stress, and market-price volatility, rather than covering only one threat type.\n• Explainable alerts — every warning states why the risk is elevated (e.g., \"high humidity + recent rainfall + susceptible crop stage → elevated fungal-disease risk\") rather than issuing an opaque red flag.\n• Severity & urgency ranking — helps farmers prioritise when facing multiple simultaneous risks.\n• Mitigation guidance — each alert comes paired with concrete, actionable mitigation steps, not just a warning.\n• Feeds back into the Copilot — risk alerts surface directly within the same conversational interface farmers already use for daily advisory, rather than a separate app.",
      "Module 3 — Farm-to-Market Optimizer (Sell-Side Intelligence)\n• Crop-choice recommendation — before the season starts, suggests what to grow based on predicted yield potential, local suitability, and anticipated demand/price trends.\n• Market-price forecasting — predicts likely price trends across nearby mandis/markets to inform the 'where to sell' decision.\n• Demand prediction — factors in anticipated regional/seasonal demand so farmers aren't blindsided by oversupply-driven price crashes.\n• Sell-timing guidance — recommends when to sell versus when to hold (where storage is feasible), based on price-trend forecasts.\n• Logistics optimisation — suggests transport options/routes to reach the most favourable market at reasonable cost, weighing price gain against transport expense.",
      "Unifying Design Principles\n• Single shared farmer profile across all three modules — location, crop history, soil data, and past interactions inform advisory, risk, and market recommendations alike.\n• One conversational entry point — farmers interact with one copilot interface, not three separate tools; risk alerts and market suggestions surface naturally within the same advisory conversation.\n• Explainability throughout — every recommendation (advisory, risk, or market) should be able to say why, not just what.\n• Offline/low-bandwidth resilience — core functionality should degrade gracefully under poor connectivity, given the target user base.",
    ],
    constraints: [
      "Single shared farmer profile across all three modules — location, crop history, soil data, and past interactions inform advisory, risk, and market recommendations alike",
      "One conversational entry point — farmers interact with one copilot interface, not three separate tools; risk alerts and market suggestions surface naturally within the same advisory conversation",
      "Explainability throughout — every recommendation (advisory, risk, or market) should be able to say why, not just what",
      "Offline/low-bandwidth resilience — core functionality should degrade gracefully under poor connectivity, given the target user base",
    ],
    relevantDatasets: [
      "Open crop-disease and pest image datasets (e.g., publicly available plant-disease image collections) for the image-analysis module.",
      "Regional-language speech/NLP datasets for building the multilingual voice interface.",
      "Open weather-forecast APIs and historical weather datasets for both advisory timing and risk modelling.",
      "Public agricultural market-price datasets (mandi/wholesale price history) for the price-forecasting and demand-prediction components.",
      "Open crop-yield and soil-suitability datasets for the crop-choice recommendation engine.",
      "Public transport/logistics and road-network data for the logistics-optimisation feature.",
      "Historical regional disease/pest outbreak records for validating the risk-intelligence module.",
      "Synthetic/sample farmer-profile and farm-history datasets to test personalisation across all three modules.",
    ],
    evaluationFocus: [
      "True integration, not three bolted-together apps — do advisory, risk, and market modules genuinely share data and context, or function as separate features under one login?",
      "Personalisation quality — how meaningfully recommendations adapt to an individual farmer's crop stage, location, and history.",
      "Multimodal robustness — real functionality across voice, text, and image inputs, not a text-only demo with token multimodal support.",
      "Explainability — whether risk alerts and market/crop recommendations clearly communicate their reasoning, not just a conclusion.",
      "Forecast/prediction accuracy — credibility of yield, price, demand, and risk predictions against historical data.",
      "End-to-end coverage — does the system genuinely span the full crop cycle (what to grow → how to grow it → how to sell it), or only address one phase well?",
      "Usability & accessibility — multilingual quality, offline resilience, and ease of use for farmers with limited digital literacy.",
      "Actionability — how directly outputs from each module translate into a concrete decision or action a farmer can take.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-SW-04.pdf",
  },
  {
    id: "ps-sw-05",
    code: "CB-SW-05",
    title: "GREENSCORE — CAMPUS SUSTAINABILITY TRACKER & AUDITOR",
    domain: "GreenTech & Sustainability",
    category: "Software",
    difficulty: "Intermediate",
    shortDescription:
      "Colleges want to track and reduce their environmental footprint — energy, water, waste, and transport — but have no structured tool to actually measure it, motivate improvement, or produce the reports accreditation bodies expect. This problem calls for a campus sustainability app that captures utility data, scores performance, gamifies reduction efforts, and auto-generates audit-ready reports.",
    fullDescription:
      "Most colleges genuinely want to reduce their environmental footprint, and many even run isolated green initiatives — a tree-plantation drive, a plastic-free week, an energy-saving notice — but there's rarely a systematic way to actually measure whether the campus's footprint is improving across the metrics that matter: energy consumption, water usage, waste generation, and transport-related emissions. Data, where it exists at all, tends to sit in scattered electricity bills, water-utility records, and manual waste logs that nobody consolidates or tracks over time.\n\nThis creates three linked problems. First, there's no baseline or trend visibility — a college can't tell if this month was better or worse than last month, let alone identify which department, hostel block, or activity is driving the footprint. Second, there's no incentive structure — sustainability efforts rely on goodwill and periodic campaigns rather than sustained, everyday behaviour change among students and staff. Third, accreditation reporting is a manual scramble — institutions preparing for green-campus or environmental-criteria audits (such as the sustainability parameters assessed under India's NAAC accreditation framework) end up compiling scattered data by hand under deadline pressure, rather than pulling from a continuously maintained record.\n\nThe challenge is to build a single platform that solves all three at once: consistent data capture, a motivating scoring/gamification layer, and audit-ready reporting — so sustainability tracking becomes a continuous, engaging habit rather than an annual scramble.",
    keyDeliverables: [
      "1. Data Capture Layer\n• Manual logging — simple mobile/web forms for students/staff/facility teams to log utility readings (electricity meter readings, water usage, waste weight/volume by category, transport mode for commutes).\n• Sensor-based auto-capture (where available) — integration with smart meters or IoT sensors (energy meters, water flow meters, smart bins) to pull readings automatically, reducing manual effort and improving accuracy.\n• Hybrid input model — works seamlessly for colleges with zero sensors (fully manual) as well as those with partial or full IoT infrastructure, without forcing hardware investment as a prerequisite.\n• Department/hostel-level granularity — data tagged by building, department, or hostel block to identify hotspots of high consumption.",
      "2. Sustainability Scoring Engine\n• Monthly sustainability score — composite score computed from energy, water, waste, and transport metrics, normalised against campus size/population for fair cross-scale evaluation.\n• Category-wise breakdown — score decomposes into sub-scores per category to pinpoint strengths and areas needing improvement.\n• Trend tracking — month-over-month and year-over-year comparison with clear visual trend lines.\n• Benchmarking — comparison against historical campus baseline and/or anonymised comparison against similar-sized institutions.",
      "3. Gamification & Engagement Layer\n• Leaderboards — rankings across departments, hostels, or student clubs to drive friendly competition around sustainability performance.\n• Green challenges — time-bound campaigns (e.g., 'cut hostel water use by 10% this month') with progress tracking and completion rewards.\n• Recognition & rewards — badges, certificates, or point systems recognising consistent, genuine improvement rather than one-off spikes.\n• Community feed — space for students and staff to share green initiatives, tips, and challenge progress, building social momentum.",
      "4. Audit & Reporting Layer\n• Automated report generation — structured sustainability reports aligned with common green-campus accreditation criteria (e.g., NAAC environmental-consciousness parameters), pulling directly from logged data.\n• Exportable formats — reports exportable as PDF/Excel for submission to accreditation bodies or internal college leadership.\n• Audit trail — maintains a verifiable history of logged data (who logged what, when) to support credibility during formal audits.\n• Custom reporting periods — supports generating reports for any custom date range, not just fixed monthly/annual cycles.",
    ],
    constraints: [
      "Hybrid input model must support campuses with zero sensors (manual logging) as well as partial or full IoT infrastructure without hardware mandates",
      "Sustainability scoring must be normalised against campus size and population for fair cross-institutional and cross-department benchmarking",
      "Immutable and verifiable audit trail of all data entries (author, timestamp, raw readings) to satisfy accreditation rigor",
      "Intuitive, friction-free logging workflows suitable for students and non-technical facility staff with zero sustainability training",
    ],
    relevantDatasets: [
      "Sample/simulated campus utility-consumption datasets (electricity, water, waste, transport) for building and testing the scoring engine.",
      "Reference datasheets for smart energy/water meters and IoT sensor modules, for the optional auto-capture integration.",
      "Public sustainability-scoring frameworks and environmental-benchmarking standards (e.g., published green-campus rating rubrics) to ground the scoring methodology.",
      "Publicly available NAAC/accreditation criteria documentation (environmental-consciousness parameters) to structure the audit-report template accurately.",
      "Open carbon-footprint conversion factors (e.g., kWh-to-CO2e, waste-category emission factors) to translate raw usage data into environmental-impact terms.",
      "Synthetic student/department activity datasets to test the leaderboard and challenge-tracking features.",
    ],
    evaluationFocus: [
      "Data capture flexibility — does the system genuinely work for colleges with no sensors as well as those with IoT infrastructure, without one mode being a poor afterthought?",
      "Scoring credibility — is the sustainability score methodologically sound and fair across different campus sizes, or an arbitrary composite?",
      "Engagement design — do the gamification features genuinely motivate sustained behaviour change, or just reward one-time app usage?",
      "Reporting accuracy & usefulness — how directly the generated audit reports would satisfy a real accreditation submission, not just a generic PDF.",
      "Data integrity — safeguards against manipulated or careless data entry undermining the score's credibility.",
      "Usability — how easy the logging process is for students/staff with no sustainability-tracking background.",
      "Scalability — feasibility of deployment across a large, multi-building campus with many contributors.",
      "Real impact potential — plausibility that continuous visibility + gamification would genuinely reduce a college's environmental footprint over time, not just improve its reported metrics.",
    ],
    driveUrl: "https://assets.cbgcek.dev/CB-SW-05.pdf",
  },
];





