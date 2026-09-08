import React from "react";
import { ProblemStatementList } from "@/features/problems/ProblemStatementList";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem Statements // INNOVEX '26 | CodeBreakers GCEK",
  description:
    "Explore 8+ national challenge specifications across AI/ML, Web Development, Cybersecurity, IoT, and Open Innovation for INNOVEX '26.",
};

export default function ProblemStatementsPage() {
  return (
    <div className="flex flex-col">
      {/* Top Banner */}
      <section className="bg-neo-bg border-b-4 border-black py-16 px-4 sm:px-6 lg:px-8 text-center bg-grid-paper">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm inline-block">
            CHALLENGE REPOSITORY // 2026
          </span>
          <h1 className="font-black text-4xl sm:text-6xl md:text-7xl text-black uppercase tracking-tight leading-tight">
            PROBLEM <span className="text-neo-accent">STATEMENTS</span>
          </h1>
          <p className="text-base sm:text-xl font-bold text-black/85 max-w-2xl mx-auto leading-relaxed">
            Formulated in collaboration with industry engineers and regional advisors. Choose your arena, study the constraints, and forge your prototype.
          </p>
        </div>
      </section>

      {/* Marquee Divider */}
      <MarqueeBanner
        items={[
          "AI / ML TRACK",
          "WEB DEVELOPMENT TRACK",
          "CYBERSECURITY GATEWAY",
          "IOT SENSORY NETWORKS",
          "OPEN INNOVATION FORGE",
        ]}
        bg="secondary"
        speed="fast"
      />

      {/* Main Filterable List Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProblemStatementList />
      </div>
    </div>
  );
}
