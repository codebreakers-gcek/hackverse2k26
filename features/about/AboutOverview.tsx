import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { EVENT_DATA } from "@/data/event";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Sparkles, Target, Zap } from "lucide-react";

export function AboutOverview() {
  return (
    <div className="space-y-12">
      <SectionTitle
        tag="ABOUT // ORIGIN"
        title="WHERE COGNITIVE PASSION"
        highlightText="BECOMES CODE"
        subtitle={ABOUT_DATA.festOverview.tagline}
      />

      {/* Main Narrative Card */}
      <div className="border-4 border-black bg-white shadow-neo-lg p-6 sm:p-10 space-y-6">
        <div className="border-b-4 border-black pb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-black uppercase bg-neo-accent text-black px-3 py-1 border-2 border-black">
            MISSION DIRECTIVE
          </span>
          <span className="font-mono text-xs font-bold text-black/60">
            DISPATCH // GCEK CSE LABS
          </span>
        </div>

        <div className="space-y-4 text-base sm:text-lg font-bold text-black/85 leading-relaxed">
          {ABOUT_DATA.festOverview.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* 3 Core Fest Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-4 border-black">
          <div className="border-3 border-black bg-neo-secondary p-5 shadow-neo-sm">
            <Sparkles className="w-8 h-8 text-black stroke-[3px] mb-3" />
            <h4 className="font-black text-lg uppercase mb-2">UNFILTERED INNOVATION</h4>
            <p className="text-xs font-bold text-black/80 leading-snug">
              Encourage student engineers to build unapologetically bold solutions to messy, authentic problems.
            </p>
          </div>

          <div className="border-3 border-black bg-neo-muted p-5 shadow-neo-sm">
            <Target className="w-8 h-8 text-black stroke-[3px] mb-3" />
            <h4 className="font-black text-lg uppercase mb-2">INDUSTRY READINESS</h4>
            <p className="text-xs font-bold text-black/80 leading-snug">
              Expose students to real-time code reviews, Git collaboration, production deployment, and stress-testing.
            </p>
          </div>

          <div className="border-3 border-black bg-white p-5 shadow-neo-sm">
            <Zap className="w-8 h-8 text-black stroke-[3px] mb-3" />
            <h4 className="font-black text-lg uppercase mb-2">NATIONAL CONNECTIVITY</h4>
            <p className="text-xs font-bold text-black/80 leading-snug">
              Unite developers across state borders to exchange techniques, build open-source tools, and forge lasting squads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
