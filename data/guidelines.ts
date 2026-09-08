import { GuidelineCategory, EvaluationCriterion } from "@/types/guideline";

export const GUIDELINES_CATEGORIES: GuidelineCategory[] = [
  {
    id: "eligibility",
    title: "ELIGIBILITY CRITERIA",
    shortDescription: "Who can compete, academic standing, and team credentials.",
    icon: "ShieldCheck",
    rules: [
      {
        id: "el-1",
        number: "01",
        heading: "Student Status",
        content:
          "All bonafide undergraduate, postgraduate, and diploma engineering/polytechnic students currently enrolled in recognized colleges or universities in India are eligible.",
        importantNotes: [
          "Valid institutional student ID card or bonafide certificate is required at physical check-in.",
          "Cross-college teams are permitted and encouraged.",
        ],
      },
      {
        id: "el-2",
        number: "02",
        heading: "Interdisciplinary Participation",
        content:
          "Teams are not restricted to Computer Science or IT branches. Students from Mechanical, Electrical, Civil, Electronics, and Allied Sciences are actively welcomed.",
        importantNotes: [
          "Diversity of technical disciplines within a team often yields higher evaluation scores in problem analysis.",
        ],
      },
      {
        id: "el-3",
        number: "03",
        heading: "Graduation Year",
        content:
          "Students graduating in batches 2025, 2026, 2027, 2028, and 2029 are eligible. Working professionals or full-time corporate engineers may participate only as mentors or evaluators.",
      },
    ],
  },
  {
    id: "team-formation",
    title: "TEAM FORMATION",
    shortDescription: "Squad sizes, member roles, and leadership structure.",
    icon: "Users",
    rules: [
      {
        id: "tf-1",
        number: "01",
        heading: "Team Size Limits",
        content:
          "Teams must consist of a minimum of 1 (Solo) and a maximum of 4 members. Recommended squad size is 3 to 4 members to distribute frontend, backend, AI/logic, and design responsibilities.",
        importantNotes: [
          "No changes to the roster will be entertained after registration closes.",
          "An individual student cannot be registered in more than one team.",
        ],
      },
      {
        id: "tf-2",
        number: "02",
        heading: "Team Leader Designation",
        content:
          "Every team must designate one member as the primary Team Leader. The leader will serve as the sole liaison for all official communications, credential handshakes, and prize disbursals.",
      },
      {
        id: "tf-3",
        number: "03",
        heading: "All-Women Team Incentives",
        content:
          "All-women squads are eligible for special recognition categories, dedicated mentorship hours, and exclusive innovation track prizes.",
      },
    ],
  },
  {
    id: "registration-rules",
    title: "REGISTRATION RULES",
    shortDescription: "Timelines, confirmation protocols, and verification.",
    icon: "FileText",
    rules: [
      {
        id: "reg-1",
        number: "01",
        heading: "Zero Registration Fee",
        content:
          "HACKVERSE '26 and Hack Nova have NO registration fees. Participation, hackathon lab access, power, high-speed Wi-Fi, and mentoring sessions are provided completely free of charge.",
      },
      {
        id: "reg-2",
        number: "02",
        heading: "Problem Statement Selection",
        content:
          "Teams must choose a primary problem statement during registration. If opting for 'Open Innovation', a brief 3-sentence architectural abstract must be submitted.",
        importantNotes: [
          "Problem statements can be updated up to 24 hours prior to the hackathon kickoff with organizing committee approval.",
        ],
      },
      {
        id: "reg-3",
        number: "03",
        heading: "Shortlisting & Confirmation",
        content:
          "Due to laboratory seating capacity at GCEK, the top 100 teams will be shortlisted based on submitted problem proposals and notified via email with official digital entry passes.",
      },
    ],
  },
  {
    id: "submission-rules",
    title: "SUBMISSION & PROTOTYPING RULES",
    shortDescription: "Originality, Git commit guidelines, and intellectual property.",
    icon: "Code2",
    rules: [
      {
        id: "sub-1",
        number: "01",
        heading: "Fresh Codebase Requirement",
        content:
          "All code written for the hackathon must be authored during the 36-hour sprint window. Pre-built complete applications are strictly disqualified.",
        importantNotes: [
          "Open-source libraries, UI packages, public APIs, and pretrained foundational models (HuggingFace, Ollama, OpenAI) are fully permissible.",
          "Initial commit timestamp must coincide with the official event countdown start.",
        ],
      },
      {
        id: "sub-2",
        number: "02",
        heading: "Public GitHub Repository",
        content:
          "Teams must maintain their source code in a public GitHub repository. Regular commits throughout the hackathon are mandatory to demonstrate iterative development.",
      },
      {
        id: "sub-3",
        number: "03",
        heading: "Final Deliverable Package",
        content:
          "Submissions must include: (a) Public GitHub repo with comprehensive README, (b) Working deployed URL or local test harness script, (c) 2-minute video walkthrough or pitch slide deck.",
      },
      {
        id: "sub-4",
        number: "04",
        heading: "Intellectual Property Ownership",
        content:
          "All intellectual property, source code, and design assets remain 100% the property of the participating students. CodeBreakers and GCEK claim zero IP ownership.",
      },
    ],
  },
  {
    id: "code-of-conduct",
    title: "CODE OF CONDUCT",
    shortDescription: "Ethics, sportsmanship, and inclusive campus environment.",
    icon: "Scale",
    rules: [
      {
        id: "coc-1",
        number: "01",
        heading: "Inclusive & Harassment-Free Space",
        content:
          "HACKVERSE '26 is dedicated to providing a harassment-free experience for everyone, regardless of gender, sexual orientation, disability, appearance, race, or religion. Intimidation, verbal hostility, or unwelcome physical contact results in immediate expulsion without appeal.",
      },
      {
        id: "coc-2",
        number: "02",
        heading: "Academic Integrity & Plagiarism",
        content:
          "Passing off third-party code as proprietary work without attribution will cause immediate disqualification. Automated plagiarism detection tools will audit all repository commits.",
      },
      {
        id: "coc-3",
        number: "03",
        heading: "Campus Discipline & Network Safety",
        content:
          "Attempting to penetrate, DDoS, or intercept traffic on GCEK campus networks or fellow contestants' machines is considered a cyber offense and will lead to police referral.",
      },
    ],
  },
  {
    id: "evaluation-criteria",
    title: "EVALUATION CRITERIA",
    shortDescription: "Judges scoring matrix, milestone checkpoints, and demos.",
    icon: "Award",
    rules: [
      {
        id: "ev-1",
        number: "01",
        heading: "Milestone Checkpoints (30% Progress)",
        content:
          "Mentors will conduct 3 mandatory checkpoints during the 36 hours: (1) Architecture & schema validation, (2) Midway functional MVP verification, (3) Final dry-run presentation.",
      },
      {
        id: "ev-2",
        number: "02",
        heading: "Live Demonstration & Q&A",
        content:
          "The grand jury round requires a 5-minute live working demonstration followed by 3 minutes of technical cross-examination by industry judges.",
        importantNotes: [
          "PowerPoint slides without working software or hardware will receive zero points for execution.",
        ],
      },
    ],
  },
];

export const EVALUATION_CRITERIA_MATRIX: EvaluationCriterion[] = [
  {
    parameter: "INNOVATION & ORIGINALITY",
    weightage: 25,
    description:
      "Uniqueness of the approach, novelty of the algorithmic or design solution, and degree to which the team broke away from cookie-cutter templates.",
    scoringFocus: [
      "Creative problem framing",
      "Novel architecture or integration",
      "Distinction from existing market alternatives",
    ],
  },
  {
    parameter: "TECHNICAL COMPLEXITY & ROBUSTNESS",
    weightage: 30,
    description:
      "Depth of engineering, sound architectural patterns, code quality, security considerations, and effective use of chosen frameworks.",
    scoringFocus: [
      "Scalable data structures & schemas",
      "API design and error handling",
      "Edge-case defense and stability under load",
    ],
  },
  {
    parameter: "PRACTICAL IMPACT & RELEVANCE",
    weightage: 25,
    description:
      "Tangible utility for users, real-world feasibility, alignment with rural/urban socio-economic problem spaces, and scalability.",
    scoringFocus: [
      "Clarity of target user personas",
      "Realistic deployment roadmap",
      "Measurable efficiency or cost savings",
    ],
  },
  {
    parameter: "USER EXPERIENCE & ACCESSIBILITY",
    weightage: 20,
    description:
      "Intuitive navigation, responsive interface across screen sizes, design aesthetics, semantic accessibility, and compelling presentation.",
    scoringFocus: [
      "Visual hierarchy and design polish",
      "Accessibility compliance (contrast, keyboards)",
      "Cohesive 5-minute pitch delivery",
    ],
  },
];
