import React from "react";
import type { Metadata } from "next";
import { ProblemSelectionContent } from "@/features/problems/ProblemSelectionContent";

export const metadata: Metadata = {
  title: "Select Problem Statements (Pref 1 & 2)",
  description:
    "Lock in your squad's primary and secondary problem statement preferences for HACKVERSE '26 hackathon at GCEK Bhawanipatna.",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/register/ps",
  },
  openGraph: {
    title: "Problem Statement Selection // HACKVERSE '26",
    description:
      "Select and lock your preferred technical tracks and challenges for your squad.",
    url: "https://www.codebreakersgcek.tech/register/ps",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HACKVERSE '26 Problem Selection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Problem Statement Selection // HACKVERSE '26",
    description:
      "Select and lock your preferred technical tracks and challenges for your squad.",
    images: ["/og-image.jpg"],
  },
};

export default function ProblemSelectionPage() {
  return <ProblemSelectionContent />;
}
