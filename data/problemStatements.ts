import { ProblemStatement } from "@/types/problemStatement";

export const PROBLEM_STATEMENTS_DATA: ProblemStatement[] = [
  {
    id: "ps-ai-01",
    code: "CB-AI-01",
    title: "AGRINEURAL: LOCALIZED MULTILINGUAL CROP DISEASE DIAGNOSTIC AGENT",
    domain: "Artificial Intelligence & Computer Vision",
    category: "AI / ML",
    difficulty: "Advanced",
    shortDescription:
      "Develop an offline-first, multimodal AI agent that diagnoses crop leaf diseases via mobile photos and provides remedies in regional dialects (Odia, Hindi, Sambalpuri).",
    fullDescription:
      "Smallholder farmers across rural Odisha face massive crop yield reductions due to late pest and disease detection. Existing solutions require persistent high-speed internet and output scientific jargon in English. Build a lightweight edge or hybrid vision model that identifies 25+ common agricultural diseases from mobile camera snapshots, quantifies disease severity, and speaks step-by-step organic or chemical treatment regimens in local regional languages with low latency.",
    suggestedStack: ["PyTorch", "TensorFlow Lite", "FastAPI", "Next.js", "Whisper TTS/STT", "LangChain"],
    keyDeliverables: [
      "Trained computer vision classifier with >90% validation accuracy on leaf blight/fungal datasets",
      "Offline/PWA mobile-responsive web dashboard for field testing",
      "Multilingual voice-guided diagnostic readout (Odia / Hindi audio output)",
      "Severity heatmapping using Grad-CAM or bounding boxes",
    ],
    constraints: [
      "Inference on mobile/client device must execute in under 3.5 seconds",
      "Core features must function in intermittent connectivity mode",
    ],
    evaluationFocus: ["Model Accuracy & Latency", "Offline Usability", "Accessibility in Vernacular Dialects"],
    sponsorOrMentor: "CodeBreakers AI Lab // Dept. of CSE, GCEK",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-ai-01-placeholder",
  },
  {
    id: "ps-web-02",
    code: "CB-WEB-02",
    title: "CAMPUSGRID: DECENTRALIZED STUDENT EVENT & RESOURCE EXCHANGE PLATFORM",
    domain: "Full-Stack Web Architecture",
    category: "Web Development",
    difficulty: "Intermediate",
    shortDescription:
      "Architect a resilient, real-time campus operating system for student hackathons, laboratory equipment bookings, and peer-to-peer technical knowledge trading.",
    fullDescription:
      "Colleges often grapple with fragmented communication across messaging groups for lab gear sharing, hackathon squad formation, and club notifications. Build an integrated, high-performance web platform featuring live collaborative whiteboarding, automated role-based team matchmaking, peer-to-peer textbook and hardware sensor borrowing with digital token receipts, and institutional verification.",
    suggestedStack: ["Next.js", "TypeScript", "Tailwind CSS", "WebSockets / Socket.io", "PostgreSQL / Supabase", "Redis"],
    keyDeliverables: [
      "Dynamic team formation matchmaking based on skills gap analysis",
      "Real-time laboratory slot reservation calendar with conflict resolution",
      "Audit-logged asset sharing ledger with verifiable cryptographic QR passes",
      "Live notifications dashboard using Web Push / Server-Sent Events",
    ],
    constraints: [
      "Zero client-side state loss during network drops",
      "Sub-100ms UI interaction latency on complex schedule tables",
    ],
    evaluationFocus: ["System Scalability", "UX Responsiveness", "State Management & Realtime Sync"],
    sponsorOrMentor: "CodeBreakers Web Team",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-web-02-placeholder",
  },
  {
    id: "ps-sec-03",
    code: "CB-SEC-03",
    title: "SENTINELCORE: ZERO-TRUST API ANOMALY & THREAT FORENSICS SUITE",
    domain: "Cybersecurity & DevSecOps",
    category: "Cybersecurity",
    difficulty: "Advanced",
    shortDescription:
      "Engineer a real-time behavioral API security gateway that intercepts, analyzes, and blocks credential stuffing, BOLA/IDOR exploits, and automated bots.",
    fullDescription:
      "Modern web microservices are constantly targeted by Broken Object Level Authorization (BOLA), SQLi, and AI-driven automated credential stuffing. Develop a reverse-proxy security engine that inspects incoming HTTP/JSON payloads, runs entropy and payload behavior scoring, detects anomalous token patterns, and renders visual attack graphs with incident response containment controls.",
    suggestedStack: ["Go / Rust / Node.js", "Next.js", "eBPF / OpenTelemetry", "DuckDB", "Chart.js"],
    keyDeliverables: [
      "High-throughput middleware proxy intercepting API traffic",
      "Heuristic rule engine detecting OWASP Top 10 API vulnerabilities",
      "Interactive threat telemetry console with IP reputation heatmaps",
      "Automated automated blocking and rate-limiting policy generator",
    ],
    constraints: [
      "Proxy latency overhead must not exceed 15ms per request under 500 RPS",
      "False positive rate strictly below 2% on legitimate traffic simulation",
    ],
    evaluationFocus: ["Detection Accuracy", "Throughput Benchmark", "Forensics Dashboard Clarity"],
    sponsorOrMentor: "Cyber Defense Wing // GCEK",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-sec-03-placeholder",
  },
  {
    id: "ps-iot-04",
    code: "CB-IOT-04",
    title: "JAL-RAKSHAK: SMART WATER CONSERVATION & PURITY MONITORING TELEMETRY",
    domain: "IoT, Embedded Systems & Telemetry",
    category: "IoT",
    difficulty: "Intermediate",
    shortDescription:
      "Build an end-to-end IoT sensory telemetry system that tracks pH, turbidity, TDS, and reservoir overflow with predictive leak detection.",
    fullDescription:
      "Institutional campuses and rural municipalities suffer from unmonitored water wastage and contamination in overhead storage tanks. Build a complete hardware simulation or prototype interface that aggregates sensor streams (pH, TDS, ultrasonic water level, flow rates) via MQTT, predicts pipeline bursts using time-series anomaly detection, and triggers automated pump shutoffs.",
    suggestedStack: ["ESP32 / Arduino / Wokwi Simulator", "MQTT (EMQX)", "Next.js Dashboard", "TimescaleDB", "Leaflet GIS"],
    keyDeliverables: [
      "Simulated or physical ESP32 sensor transmitter broadcasting telemetry",
      "Real-time GIS map displaying water purity index across multiple nodes",
      "Automated SMS/Webhook alert engine on hazard threshold breach",
      "Predictive tank depletion calculation based on usage trends",
    ],
    constraints: [
      "Bandwidth-efficient payload (under 256 bytes per telemetry ping)",
      "Battery-efficient sensor sleep-cycle scheduling logic",
    ],
    evaluationFocus: ["Hardware-Software Integration", "Telemetry Stability", "Practical Campus Utility"],
    sponsorOrMentor: "GCEK IoT & Embedded Systems Group",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-iot-04-placeholder",
  },
  {
    id: "ps-open-05",
    code: "CB-OPEN-05",
    title: "ACCESSIWEB: NEURODIVERGENT & LOW-VISION COGNITIVE WEB ASSISTANT",
    domain: "Accessibility & Assistive Tech",
    category: "Open Innovation",
    difficulty: "Beginner",
    shortDescription:
      "Create an assistive browsing engine and screen-reader companion designed for ADHD, dyslexia, and low-vision users to transform complex web content.",
    fullDescription:
      "Millions of users struggle with sensory overload, wall-of-text layouts, and non-accessible web interfaces. Build an innovative browser extension, companion proxy, or web reader that parses arbitrary web articles, highlights phonetic reading rulers, simplifies dense jargon into digestible bullet points, generates bionic reading typography, and provides accessible auditory navigation.",
    suggestedStack: ["Next.js", "Web Speech API", "Readability.js", "Tailwind CSS", "W3C ARIA Standards"],
    keyDeliverables: [
      "Distraction-free bionic and dyslexic-friendly text rendering engine",
      "Speech-driven keyboard navigation without touch or mouse",
      "Instant cognitive complexity simplification slider (Grade 5 to Graduate)",
      "Full compliance with WCAG 2.2 AAA guidelines on test pages",
    ],
    constraints: [
      "Zero collection of personal reading history or behavioral tracking",
      "Lightweight footprint (< 300KB bundle overhead)",
    ],
    evaluationFocus: ["User Empathy & Experience", "Accessibility Standards Adherence", "Innovation Quality"],
    sponsorOrMentor: "CodeBreakers Open Source Initiative",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-open-05-placeholder",
  },
  {
    id: "ps-ai-06",
    code: "CB-AI-06",
    title: "CODE-DOCEX: AUTONOMOUS REPOSITORY REVERSE ENGINEERING & DOC GENERATOR",
    domain: "Developer Tooling & Generative AI",
    category: "AI / ML",
    difficulty: "Intermediate",
    shortDescription:
      "Build a local LLM-powered tool that parses legacy codebases, draws interactive architectural dependency graphs, and generates living documentation.",
    fullDescription:
      "When developers inherit legacy repositories with zero documentation, days are lost tracing spaghetti code. Develop an intelligent developer utility that analyzes Git repositories, extracts ASTs (Abstract Syntax Trees), auto-generates mermaid diagrams of architectural components, flags dead code, and generates production-ready OpenAPI / Markdown documentation.",
    suggestedStack: ["Tree-sitter / Babel AST", "Ollama / Groq API", "Next.js", "Mermaid.js / React Flow", "TypeScript"],
    keyDeliverables: [
      "AST code parser analyzing functions, dependencies, and circular imports",
      "Interactive 2D architectural visualizer depicting modules and data flows",
      "Auto-generated searchable documentation with interactive run examples",
      "Security antipattern linter flagging hardcoded secrets and unhandled promises",
    ],
    constraints: [
      "Support JavaScript/TypeScript and Python codebases out of the box",
      "Provide offline local inference capability (e.g. Ollama integration)",
    ],
    evaluationFocus: ["Developer Utility", "AST Parsing Depth", "Visual Graph Interactivity"],
    sponsorOrMentor: "CodeBreakers Dev Core",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-ai-06-placeholder",
  },
  {
    id: "ps-web-07",
    code: "CB-WEB-07",
    title: "ODISHA-HERITAGE: HIGH-FIDELITY IMMERSIVE CULTURAL ARCHIVE",
    domain: "Web 3D & Digital Preservation",
    category: "Web Development",
    difficulty: "Intermediate",
    shortDescription:
      "Craft a fast, responsive 3D web showcase preserving Western Odisha's temple architecture, Sambalpuri handloom weaving patterns, and tribal folklore.",
    fullDescription:
      "Western Odisha possesses world-renowned cultural heritage—from the intricate weaves of Sambalpuri Ikat to the sculptural marvels of Kalahandi's historic sites. Build an immersive digital cultural archive featuring interactive 3D model viewers, generative pattern exploration tools, multi-tier audio narratives, and interactive timeline maps.",
    suggestedStack: ["Three.js / React Three Fiber", "Next.js", "Tailwind CSS", "Web Audio API", "GLTF/USDZ"],
    keyDeliverables: [
      "60 FPS interactive 3D model viewer with annotations and exploded views",
      "Generative Ikat geometry pattern designer that exports high-res SVGs",
      "Bilingual historical narrative audio tracks in Odia & English",
      "Interactive geographical map of Kalahandi heritage sites",
    ],
    constraints: [
      "Maintain > 50 FPS performance on mid-range Android mobile devices",
      "Progressive asset loading to ensure sub-2-second first meaningful paint",
    ],
    evaluationFocus: ["Visual Polish", "3D Rendering Performance", "Cultural Respect & Accuracy"],
    sponsorOrMentor: "Dept. of Humanities & Technology // GCEK",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-web-07-placeholder",
  },
  {
    id: "ps-open-08",
    code: "CB-OPEN-08",
    title: "FREE-DISASTER-NET: OFFLINE PEER-TO-PEER SOS EMERGENCY RELAY",
    domain: "Disaster Management & P2P Protocols",
    category: "Open Innovation",
    difficulty: "Advanced",
    shortDescription:
      "Engineer a decentralized browser-to-browser emergency broadcast web app using WebRTC, Bluetooth Mesh, and local caching when cellular towers fail.",
    fullDescription:
      "During cyclone and flood emergencies in coastal and tribal districts, conventional cellular towers and electrical grids collapse within hours. Build an zero-infrastructure emergency relay web app that leverages WebRTC mesh networks and Web Bluetooth to hop SOS messages, medical aid requests, and verified evacuation coordinates from phone to phone until an uplink node is reached.",
    suggestedStack: ["WebRTC / DataChannels", "Web Bluetooth API", "Service Workers / IndexedDB", "Next.js", "Leaflet Offline"],
    keyDeliverables: [
      "Decentralized peer-to-peer message gossip protocol with message deduplication",
      "Offline GIS evacuation map stored via IndexedDB and vector tiles",
      "Cryptographically signed SOS beacon with battery status and GPS fix",
      "Emergency broadcast dashboard for rescue coordinator nodes",
    ],
    constraints: [
      "Zero dependency on external internet servers once PWA is cached",
      "Ultra-low battery consumption mode (black high-contrast UI)",
    ],
    evaluationFocus: ["Protocol Resilience", "Mesh Relay Reliability", "Life-Safety Impact"],
    sponsorOrMentor: "CodeBreakers Social Impact Division",
    driveUrl: "https://drive.google.com/drive/folders/hackverse2026-ps-open-08-placeholder",
  },
];
