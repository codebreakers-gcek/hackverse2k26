import React from "react";
import Link from "next/link";
import { AboutOverview } from "@/features/about/AboutOverview";
import { PillarCards } from "@/features/about/PillarCards";
import { ClubMilestones } from "@/features/about/ClubMilestones";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { ArrowRight, Terminal } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About INNOVEX '26 & CodeBreakers GCEK | National Tech Fest",
  description:
    "Learn about INNOVEX '26, its purpose, objectives, and the CodeBreakers coding club of Government College of Engineering Kalahandi.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Top Banner */}
      <section className="bg-neo-secondary border-b-4 border-black py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm inline-block">
            DOCS // MISSION // LEGACY
          </span>
          <h1 className="font-black text-4xl sm:text-6xl md:text-7xl text-black uppercase tracking-tight leading-tight">
            ABOUT INNOVEX <span className="text-neo-accent">&apos;26</span>
          </h1>
          <p className="text-base sm:text-xl font-bold text-black/85 max-w-2xl mx-auto leading-relaxed">
            The philosophy, organizing society, and institutional roots powering Western Odisha&apos;s premier national engineering symposium.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        {/* 1. Fest Overview & Objectives */}
        <AboutOverview />

        {/* 2. Four Core Pillars */}
        <PillarCards />

        {/* 3. Club Milestones & Institutional History */}
        <ClubMilestones />
      </div>

      {/* Marquee Divider */}
      <MarqueeBanner bg="black" speed="fast" />

      {/* Bottom CTA */}
      <section className="py-16 bg-white border-b-4 border-black text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h3 className="font-black text-3xl sm:text-4xl uppercase tracking-tight">
            READY TO CODE WITH US?
          </h3>
          <p className="text-base font-bold text-black/75">
            Check the challenge specifications and join 500+ builders at the GCE Kalahandi campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto h-12 px-8 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <span>REGISTER SQUAD</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/problem-statements"
              className="w-full sm:w-auto h-12 px-8 bg-neo-secondary text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 stroke-[3px]" />
              <span>PROBLEM STATEMENTS</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
