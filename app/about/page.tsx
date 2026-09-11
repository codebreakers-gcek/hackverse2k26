import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
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
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-black">
      {/* Fixed Minecraft Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/aboutbg.webp"
          alt="Hackverse About Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving 100% full image clarity */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 min-w-0">
        <AboutOverview />
        <PillarCards />
        <ClubMilestones />
      </div>

      <div className="relative z-10">
        <MarqueeBanner bg="secondary" speed="normal" />
      </div>
    </div>
  );
}
