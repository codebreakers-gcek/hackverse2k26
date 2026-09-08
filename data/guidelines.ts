import { GuidelineCategory, EvaluationCriterion } from "@/types/guideline";

export interface GuidelineItem {
  id: string;
  title: string;
  description: string;
}

export interface CalloutBox {
  type: "note" | "important" | "danger";
  title: string;
  content: string;
}

export const HACKATHON_GUIDELINES_DATA = {
  pageTitle: "Hackathon Guidelines",
  noticeHeader: {
    title: "Please read the guidelines carefully before participating in the hackathon.",
    subtitle: "Make sure to follow all the rules and regulations to ensure a smooth and fair experience for all teams.",
  },
  teamComposition: {
    title: "Team Composition and Eligibility",
    teamSize: "Minimum 3, Maximum 6 members",
    eligibilityList: [
      "All team members must be enrolled undergraduate, postgraduate, or diploma students from recognized engineering colleges and universities.",
      "Interdisciplinary participation is strongly encouraged (technical, management, design, etc.).",
      "Faculty mentors may accompany the teams (optional).",
    ],
    callouts: [
      {
        type: "note" as const,
        title: "Note:",
        content: "Teams must register with their final composition; no changes will be allowed post-registration.",
      },
      {
        type: "important" as const,
        title: "Important:",
        content: "A participant cannot be a member of more than one team. Violation will lead to immediate disqualification.",
      },
      {
        type: "danger" as const,
        title: "Team Name Restriction:",
        content: "The team name cannot be the college name or contain any word, acronym, or abbreviation related to the college name. Any violation will result in immediate disqualification.",
      },
    ],
  },
  expectedDeliverables: {
    title: "Expected Deliverables and Outcomes",
    items: [
      "Working prototype or MVP (Minimum Viable Product).",
      "Pitch deck explaining the problem, solution, impact, and future scalability.",
      "Technical documentation with architecture and design flow.",
      "Demo video showcasing the solution (optional).",
    ],
  },
  regulations: {
    title: "Guidelines and Regulations",
    rules: [
      "Adherence to the timeline and format is mandatory.",
      "Intellectual property rights of original solutions remain with the teams.",
      "The team name must not directly or indirectly reveal the team's college/institution. It must not contain the college name, acronym, abbreviation, short form, or any other identifiable reference. Violation may result in immediate disqualification.",
      "A participant can be registered in only one team. Participation in multiple teams is strictly prohibited.",
      "Teams must register with their final members. No addition, removal, or substitution of members will be allowed after registration, except when specifically approved by the organizing committee.",
      "All participant, mentor, college, and contact details must be accurate and authentic. False or misleading information may result in disqualification.",
      "Plagiarism, copying existing projects/solutions, or presenting someone else's work as your own is strictly prohibited. Permitted open-source tools, libraries, APIs, and datasets may be used in accordance with their licences.",
      "Select your problem statement carefully. Changes after final registration may not be permitted.",
      "Duplicate registrations, use of another person's identity/details, or attempts to bypass registration restrictions are prohibited.",
      "Cheating, impersonation, unauthorized assistance, manipulation, fraudulent activity, or any other unfair practice is strictly prohibited at all stages of the hackathon.",
      "Any attempt to exploit vulnerabilities, bypass validations, manipulate data, gain unauthorized access, disrupt services, or misuse the hackathon website, APIs, servers, databases, or related systems is strictly prohibited.",
      "Registration does not guarantee final participation. All submitted details may be verified by the organizing committee before participation is confirmed.",
      "Teams must provide valid contact details and regularly check official hackathon communications and website announcements.",
      "Participants must not contact or attempt to contact jury members regarding the hackathon until its official conclusion, including through LinkedIn, email, phone, messaging platforms, or social media. Any communication concerning evaluation, scoring, results, requests, or influence may result in immediate disqualification of the entire team.",
      "Participants must not create or spread false, misleading, defamatory, or unverified information about the hackathon, organizers, jury, teams, evaluation, or results through any channel. Violations may result in disqualification and appropriate disciplinary or legal action.",
      "Participants must not disclose or share any non-public or confidential hackathon information, including internal communications, unpublished results, evaluation details, jury discussions, participant/project data, or credentials. Unauthorized disclosure may result in disqualification and appropriate disciplinary or legal action.",
      "Teams are expected to maintain professionalism and ethical conduct.",
      "Teams are expected to maintain decorum and respect during all interactions with the jury.",
      "The jury’s decision will be final and binding.",
      "The organizing committee reserves the right to verify registrations, investigate violations, reject/disqualify teams, and take necessary action to maintain fairness. Its decision regarding eligibility and violations shall be final.",
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    paragraphs: [
      "CodeBreakers Club and the Government College of Engineering Kalahandi (GCEK) Hackathon Organizing Committee reserve the right to disqualify any registered team at any stage of the hackathon — including before, during, or after the event — should any discrepancy, misrepresentation, or violation of the hackathon rules and guidelines be identified.",
      "Furthermore, CodeBreakers GCEK and the Institute Organizing Committee reserve the right to cancel, postpone, or call off the hackathon at any point, without being obligated to furnish any reason or explanation for such a decision. In all matters pertaining to the hackathon, the decision of CodeBreakers Club and GCEK Kalahandi shall be final and binding on all registered participants.",
    ],
  },
};

export const GUIDELINES_CATEGORIES: GuidelineCategory[] = [
  {
    id: "team-composition",
    title: "TEAM COMPOSITION & ELIGIBILITY",
    shortDescription: "Size constraints, institutional affiliation, and registration rules.",
    icon: "Users",
    rules: [
      {
        id: "tc-1",
        number: "01",
        heading: "Team Size Requirements",
        content: "Minimum 3, Maximum 6 members per registered squad.",
        importantNotes: [
          "Teams must register with their final composition; no changes will be allowed post-registration.",
          "A participant cannot be a member of more than one team. Violation will lead to immediate disqualification.",
        ],
      },
      {
        id: "tc-2",
        number: "02",
        heading: "Institutional Affiliation",
        content: "Open to enrolled engineering, diploma, and technical college students across India. Interdisciplinary participation is strongly encouraged (technical, management, design, etc.).",
        importantNotes: [
          "Faculty mentors may accompany the teams (optional).",
        ],
      },
      {
        id: "tc-3",
        number: "03",
        heading: "Team Name Restriction",
        content: "The team name cannot be the college name or contain any word, acronym, or abbreviation related to the college name. Any violation will result in immediate disqualification.",
      },
    ],
  },
  {
    id: "deliverables",
    title: "EXPECTED DELIVERABLES & OUTCOMES",
    shortDescription: "Prototypes, pitch decks, documentation, and demo videos.",
    icon: "FileText",
    rules: [
      {
        id: "del-1",
        number: "01",
        heading: "Working Prototype / MVP",
        content: "Teams must develop and demonstrate a functioning Minimum Viable Product or prototype during the hackathon window.",
      },
      {
        id: "del-2",
        number: "02",
        heading: "Pitch Deck & Architecture",
        content: "Pitch deck explaining the problem, solution, impact, and future scalability. Technical documentation with architecture and design flow.",
        importantNotes: ["Demo video showcasing the solution (optional)."],
      },
    ],
  },
  {
    id: "regulations",
    title: "OFFICIAL REGULATIONS & CONDUCT",
    shortDescription: "Ethics, intellectual property, academic integrity, and jury decorum.",
    icon: "ShieldCheck",
    rules: [
      {
        id: "reg-1",
        number: "01",
        heading: "Timeline & Format Adherence",
        content: "Adherence to the timeline and format is mandatory. Intellectual property rights of original solutions remain with the teams.",
      },
      {
        id: "reg-2",
        number: "02",
        heading: "Anti-Plagiarism & Authentic Credentials",
        content: "Plagiarism, copying existing projects, or presenting someone else's work as your own is strictly prohibited. Permitted open-source tools and libraries may be used in accordance with their licenses.",
        importantNotes: [
          "All participant, mentor, college, and contact details must be accurate and authentic.",
        ],
      },
      {
        id: "reg-3",
        number: "03",
        heading: "Jury Protocol & Confidentiality",
        content: "Participants must not contact or attempt to contact jury members regarding the hackathon until its official conclusion. The jury's decision will be final and binding.",
      },
    ],
  },
];

export const EVALUATION_CRITERIA_MATRIX: EvaluationCriterion[] = [
  {
    parameter: "Innovation & Originality",
    weightage: 25,
    description: "Novelty of the concept, breakthrough approach, and creative problem solving.",
    scoringFocus: [
      "Uniqueness of the solution",
      "Creative application of modern tech stacks",
      "Differentiation from existing commercial tools",
    ],
  },
  {
    parameter: "Technical Complexity & Architecture",
    weightage: 25,
    description: "Engineering depth, prototype stability, API integration, and architectural scalability.",
    scoringFocus: [
      "Code modularity and cleanliness",
      "Robust data flow and security validations",
      "Scalability of backend and infrastructure",
    ],
  },
  {
    parameter: "Real-World Impact & Feasibility",
    weightage: 20,
    description: "Practical viability, user value proposition, and operational deployability.",
    scoringFocus: [
      "Relevance to industry problem statements",
      "Feasibility within institutional and market constraints",
      "Measurable societal or economic impact",
    ],
  },
  {
    parameter: "UI / UX Design & Experience",
    weightage: 15,
    description: "Intuitive workflows, accessibility, design responsiveness, and user experience.",
    scoringFocus: [
      "Interface clarity and aesthetics",
      "Responsive performance across devices",
      "Intuitive navigation and user onboarding",
    ],
  },
  {
    parameter: "Presentation & Demonstration Quality",
    weightage: 15,
    description: "Clarity of the pitch deck, live demo execution, and defense during jury Q&A.",
    scoringFocus: [
      "Persuasive articulation of problem & solution",
      "Smooth live prototype demonstration",
      "Precise answers to technical jury inquiries",
    ],
  },
];
