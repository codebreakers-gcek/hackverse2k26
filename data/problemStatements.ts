import { ProblemStatement } from "@/types/problemStatement";

export const PROBLEM_STATEMENTS_DATA: ProblemStatement[] = [
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
];

