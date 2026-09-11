import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { Sparkles, Target, Zap } from "lucide-react";

export function AboutOverview() {
  return (
    <div className="space-y-10">
      {/* Minecraft Header */}
      <div className="flex justify-center w-full max-w-full">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl">
          <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
            ★ ABOUT // ORIGIN ★
          </span>

          <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
            WHERE COGNITIVE PASSION{" "}
            <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
              BECOMES CODE
            </span>
          </h1>

          <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000]">
            <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
              {ABOUT_DATA.festOverview.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Main Narrative Card (Minecraft Stone GUI Slab) */}
      <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] p-6 sm:p-10 space-y-6">
        <div className="border-b-3 border-[#8B8B8B] pb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-black uppercase bg-[#55FF55] text-black px-3 py-1 border-2 border-t-[#9EFF9E] border-l-[#9EFF9E] border-r-[#1B801B] border-b-[#1B801B] shadow-[2px_2px_0px_#000]">
            ★ MISSION DIRECTIVE ★
          </span>
          <span className="font-mono text-xs font-bold text-[#2A2A2A]">
            DISPATCH // GCEK CSE LABS
          </span>
        </div>

        <div className="space-y-4 text-sm sm:text-base font-mono font-bold text-[#151515] leading-relaxed">
          {ABOUT_DATA.festOverview.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* 3 Core Fest Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-3 border-[#8B8B8B]">
          <div className="bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-8 h-8 text-[#FFAA00] stroke-[2.5px] mb-3" />
            <h4 className="font-mono font-black text-base uppercase mb-2 text-white [text-shadow:_1px_1px_0_#000]">
              UNFILTERED INNOVATION
            </h4>
            <p className="font-mono text-xs font-bold text-white/90 leading-snug [text-shadow:_1px_1px_0_#000]">
              Encourage student engineers to build unapologetically bold solutions to messy, authentic problems.
            </p>
          </div>

          <div className="bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
            <Target className="w-8 h-8 text-[#55FF55] stroke-[2.5px] mb-3" />
            <h4 className="font-mono font-black text-base uppercase mb-2 text-white [text-shadow:_1px_1px_0_#000]">
              INDUSTRY READINESS
            </h4>
            <p className="font-mono text-xs font-bold text-white/90 leading-snug [text-shadow:_1px_1px_0_#000]">
              Expose students to real-time code reviews, Git collaboration, production deployment, and stress-testing.
            </p>
          </div>

          <div className="bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
            <Zap className="w-8 h-8 text-[#55FFFF] stroke-[2.5px] mb-3" />
            <h4 className="font-mono font-black text-base uppercase mb-2 text-white [text-shadow:_1px_1px_0_#000]">
              STATE CONNECTIVITY
            </h4>
            <p className="font-mono text-xs font-bold text-white/90 leading-snug [text-shadow:_1px_1px_0_#000]">
              Unite developers across state borders to exchange techniques, build open-source tools, and forge lasting squads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
