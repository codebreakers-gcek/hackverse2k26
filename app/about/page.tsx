import React from "react";
import type { Metadata } from "next";
import { AboutOverview } from "@/features/about/AboutOverview";
import { PillarCards } from "@/features/about/PillarCards";
import { ClubMilestones } from "@/features/about/ClubMilestones";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "About the Fest & CodeBreakers Legacy",
  description:
    "Learn about HACKVERSE '26, our mission, core pillars, and the 5+ year legacy of CodeBreakers - the premier technical society of Government College of Engineering Kalahandi (GCEK).",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/about",
  },
  openGraph: {
    title: "About HACKVERSE '26 & CodeBreakers GCEK",
    description:
      "Explore the mission, student builder community, and state-level legacy behind HACKVERSE '26 at GCEK Bhawanipatna.",
    url: "https://www.codebreakersgcek.tech/about",
    images: [{ url: "/cbhack.png", width: 1200, height: 630, alt: "About HACKVERSE '26" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About HACKVERSE '26 & CodeBreakers GCEK",
    description:
      "Explore the mission, student builder community, and state-level legacy behind HACKVERSE '26.",
    images: ["/cbhack.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        <AboutOverview />
        <PillarCards />
        <ClubMilestones />
      </div>
      <MarqueeBanner bg="secondary" speed="normal" />
    </div>
  );
}
