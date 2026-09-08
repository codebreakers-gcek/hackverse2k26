import React from "react";
import type { Metadata } from "next";
import { AboutOverview } from "@/features/about/AboutOverview";
import { PillarCards } from "@/features/about/PillarCards";
import { ClubMilestones } from "@/features/about/ClubMilestones";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "About // INNOVEX '26 | CodeBreakers GCEK",
  description:
    "Learn about INNOVEX '26, our mission, core pillars, and the legacy of CodeBreakers GCEK.",
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
