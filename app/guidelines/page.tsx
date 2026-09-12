import React from "react";
import type { Metadata } from "next";
import { GuidelinesContent } from "@/features/guidelines/GuidelinesContent";

export const metadata: Metadata = {
  title: "Rulebook, Eligibility & Regulatory Guidelines",
  description:
    "Official hackathon rules, squad composition requirements (2-4 hackers), hardware guidelines, code of conduct, and submission regulations for HACKVERSE '26.",
  keywords: [
    "hackathon rules",
    "hackathon guidelines 2026",
    "HACKVERSE guidelines",
    "hackathon rulebook Odisha",
    "hackathon eligibility criteria",
    "team size 2 to 4 members",
    "hackathon squad requirements",
    "hardware hackathon rules",
    "code of conduct hackathon",
    "hackathon submission guidelines",
    "plagiarism rules hackathon",
    "open source hackathon rules",
    "intellectual property hackathon",
    "hackathon evaluation criteria",
    "judging rubric hackathon",
    "hackathon disqualification rules",
    "college student eligibility",
    "engineering student hackathon rules",
    "inter-college hackathon rules Odisha",
    "solo participation rules hackathon",
    "GitHub repository submission rules",
    "live demo requirements hackathon",
    "AI generated code policy hackathon",
    "pre-existing code rules hackathon",
    "hackathon presentation guidelines",
    "hardware components allowed hackathon",
    "NOC letter submission guidelines",
    "student ID card mandatory hackathon",
    "hostel accommodation rules GCEK",
    "campus safety guidelines hackathon",
    "overnight hacking rules GCEK",
    "hackathon evaluation weightage",
    "innovation criteria hackathon",
    "technical feasibility criteria",
    "UI UX evaluation criteria",
    "business impact criteria hackathon",
    "mentor consultation rules",
    "hackathon dispute resolution",
    "organizing committee decision policy",
    "Odisha hackathon official rules",
    "GCEK hackathon rulebook",
    "CodeBreakers tournament policy",
    "fair play policy hackathon",
    "anti-harassment policy tech fest",
    "food and hospitality guidelines",
    "electricity and wifi usage rules",
    "lab access guidelines GCEK",
    "presentation time limit 5 minutes",
    "Q&A judging round rules",
    "certificate eligibility criteria",
    "prize claim guidelines hackathon",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/guidelines",
  },
  openGraph: {
    title: "Rulebook & Guidelines // HACKVERSE '26",
    description:
      "Official hackathon rules, squad composition, evaluation rubrics, and submission protocols.",
    url: "https://hackverse.codebreakersgcek.tech/guidelines",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Guidelines" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Tournament Rules & Protocols // HACKVERSE '26",
    description:
      "Review the hackathon code of conduct, IP rights, submission rules, and judging criteria.",
    images: ["/og-image.png"],
  },
};

export default function GuidelinesPage() {
  return <GuidelinesContent />;
}
