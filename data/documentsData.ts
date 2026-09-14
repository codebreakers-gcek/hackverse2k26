export interface HackathonDocument {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  category: "presentation" | "rulebook" | "brochure";
  description: string;
  isAvailable: boolean; // true when published, false for "coming soon"
  format: string;
  embedUrl?: string;
  downloadUrl?: string;
  instructions: string[];
  specs: { label: string; value: string }[];
}

export const HACKATHON_DOCUMENTS: HackathonDocument[] = [
  {
    id: "ppt-template",
    title: "Official Ideation & Presentation PPT Template",
    shortTitle: "Idea Submission PPT",
    badge: "STAGE 1 & 2 FORMAT",
    category: "presentation",
    description:
      "Standardized presentation deck required for submitting your team's solution architecture, problem analysis, technology stack, workflow, and feasibility.",
    isAvailable: true,
    format: "Microsoft PowerPoint (.pptx)",
    embedUrl: "",
    downloadUrl: "/docs/[Pub] HACKVERSE'26 _ Idea Submission Template.pptx",
    instructions: [
      "Follow the structured slide order without altering mandatory evaluation headers.",
      "Include detailed system architecture diagrams and chosen technology stack.",
      "Keep presentation focused: maximum 10-12 slides recommended.",
      "Export as PDF or submit via editable presentation link in your squad portal.",
    ],
    specs: [
      { label: "FILE FORMAT", value: "Microsoft PowerPoint (.pptx)" },
      { label: "SLIDE COUNT", value: "10 - 12 Slides Standard" },
      { label: "APPLICABILITY", value: "Stage 1 (Screening) & Stage 2 (Mid-Level)" },
      { label: "CURRENT STATUS", value: "AVAILABLE // DOWNLOAD OFFICIAL PPTX" },
    ],
  },
  {
    id: "rule-book",
    title: "Official HackVerse '26 Rule Book & Regulations",
    shortTitle: "Official Rule Book",
    badge: "RULES & DIRECTIVES",
    category: "rulebook",
    description:
      "Comprehensive regulatory guidebook detailing competition rules, eligibility criteria, code of conduct, scoring rubric, and IP guidelines.",
    isAvailable: true,
    format: "Adobe Acrobat PDF (.pdf)",
    embedUrl: "",
    downloadUrl: "https://assets.cbgcek.dev/HackVerse_26_Rulebook.pdf",
    instructions: [
      "Review all 18 core directives and eligibility guidelines before development.",
      "Strict compliance with hardware/software originality and open-source policies.",
      "Review evaluation parameters and milestone submission deadlines.",
      "Familiarize with code of conduct, anti-plagiarism, and dispute resolution policies.",
    ],
    specs: [
      { label: "FILE FORMAT", value: "Adobe Acrobat PDF (.pdf)" },
      { label: "EDITION", value: "Official Directive v1.0" },
      { label: "APPLICABILITY", value: "All Registered HackVerse Participants" },
      { label: "CURRENT STATUS", value: "AVAILABLE // DOWNLOAD OFFICIAL PDF" },
    ],
  },
  {
    id: "brochure",
    title: "Official HackVerse '26 Event Brochure",
    shortTitle: "Event Brochure",
    badge: "EVENT GUIDE & INFO",
    category: "brochure",
    description:
      "Complete event brochure featuring hackathon overview, prize pool breakdown, tracks, timeline, keynote speakers, and campus information.",
    isAvailable: true,
    format: "Adobe Acrobat PDF (.pdf)",
    embedUrl: "",
    downloadUrl: "https://assets.cbgcek.dev/HackVerse_26_Brochure.pdf",
    instructions: [
      "Explore track themes, problem statement domains, and mentor lineups.",
      "Review prize distribution, cash awards, and partner bounty opportunities.",
      "Check venue schedule, food, accommodation, and travel advisories.",
      "Share with college peers, faculty advisors, and squad members.",
    ],
    specs: [
      { label: "FILE FORMAT", value: "Adobe Acrobat PDF (.pdf)" },
      { label: "EDITION", value: "Official Event Brochure '26" },
      { label: "APPLICABILITY", value: "Students, Mentors, Faculty & Partners" },
      { label: "CURRENT STATUS", value: "AVAILABLE // DOWNLOAD OFFICIAL PDF" },
    ],
  },
];
