import React from "react";
import type { Metadata } from "next";
import { GuidelinesContent } from "@/features/guidelines/GuidelinesContent";

export const metadata: Metadata = {
  title: "Rulebook, Eligibility & Regulatory Guidelines",
  description:
    "Official hackathon rules, squad composition requirements (2-4 hackers), hardware guidelines, code of conduct, and submission regulations for HACKVERSE '26.",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/guidelines",
  },
  openGraph: {
    title: "Rulebook & Guidelines // HACKVERSE '26",
    description:
      "Official hackathon rules, squad composition, evaluation rubrics, and submission protocols.",
    url: "https://www.codebreakersgcek.tech/guidelines",
    images: [{ url: "/cbhack.png", width: 1200, height: 630, alt: "HACKVERSE '26 Guidelines" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rulebook & Guidelines // HACKVERSE '26",
    description:
      "Official hackathon rules, squad composition, evaluation rubrics, and submission protocols.",
    images: ["/cbhack.png"],
  },
};

export default function GuidelinesPage() {
  return <GuidelinesContent />;
}
