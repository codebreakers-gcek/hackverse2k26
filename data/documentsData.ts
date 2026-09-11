export interface HackathonDocument {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  category: "presentation" | "authorization";
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
    shortTitle: "Presentation PPT",
    badge: "STAGE 1 & 2 FORMAT",
    category: "presentation",
    description:
      "Standardized presentation deck required for submitting your team's solution architecture, problem analysis, technology stack, workflow, and feasibility.",
    isAvailable: false,
    format: "PPTX / Google Slides",
    embedUrl: "",
    downloadUrl: "",
    instructions: [
      "Follow the structured slide order without altering mandatory evaluation headers.",
      "Include detailed system architecture diagrams and chosen technology stack.",
      "Keep presentation focused: maximum 10-12 slides recommended.",
      "Export as PDF or submit via editable presentation link in your squad portal.",
    ],
    specs: [
      { label: "FILE FORMAT", value: "Microsoft PowerPoint (.pptx) / PDF" },
      { label: "SLIDE COUNT", value: "10 - 12 Slides Standard" },
      { label: "APPLICABILITY", value: "Stage 1 (Screening) & Stage 2 (Mid-Level)" },
      { label: "CURRENT STATUS", value: "RELEASING SOON // UNDER EMBARGO" },
    ],
  },
  {
    id: "authorization-letter",
    title: "Institutional Authorization Letter & NOC Format",
    shortTitle: "Authorization Letter",
    badge: "COLLEGE NOC / CONSENT",
    category: "authorization",
    description:
      "Official institutional endorsement and verification letter to be endorsed with seal and signature by the Head of Department (HOD), Dean, or Principal.",
    isAvailable: true,
    format: "Microsoft Word (.docx) / Printable Template",
    embedUrl: "",
    downloadUrl: "/docs/Authorization_Letter_Head_of_Institute.docx",
    instructions: [
      "Print on official college/university letterhead.",
      "Fill in student details: Names, Roll Numbers, Department, and Team Name.",
      "Mandatory seal and physical signature from HOD, Dean, or Principal.",
      "Upload scanned copy during the final qualification round & on-campus check-in.",
    ],
    specs: [
      { label: "FILE FORMAT", value: "Microsoft Word (.docx)" },
      { label: "SIGNATORY", value: "Head of Department (HOD) / Dean / Principal" },
      { label: "APPLICABILITY", value: "All Shortlisted Finalist Squads" },
      { label: "CURRENT STATUS", value: "AVAILABLE // DOWNLOAD OFFICIAL DOCX" },
    ],
  },
];
