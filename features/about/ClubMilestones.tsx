import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { ExternalLink, Milestone } from "lucide-react";
import { ENV } from "@/config/env";

export function ClubMilestones() {
  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-2.5">
          <Milestone className="w-5 h-5 sm:w-6 sm:h-6 text-[#55FF55] stroke-[2.5px]" />
          <h3 className="font-mono font-black text-base sm:text-xl uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
            CODEBREAKERS JOURNEY &amp; CAMPUS
          </h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#55FFFF] hidden sm:inline-block [text-shadow:_1px_1px_0_#000]">
          ★ 5+ YEARS OF BUILDER CULTURE ★
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-4">
          {ABOUT_DATA.club.milestones.map((m) => (
            <div
              key={m.year}
              className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:translate-y-[-1px] transition-transform"
            >
              {/* Year Block (Minecraft 3D Button Style) */}
              <div className="font-mono text-2xl sm:text-3xl font-black bg-[#5B8731] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] px-4 py-2 shrink-0 shadow-[2px_2px_0px_#000] [text-shadow:_2px_2px_0_#000]">
                {m.year}
              </div>
              <div className="space-y-1">
                <div className="font-mono font-black text-base sm:text-lg text-black uppercase tracking-tight leading-snug">
                  {m.event}
                </div>
                <p className="font-mono text-xs sm:text-sm font-bold text-[#2A2A2A] leading-relaxed">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Institution / Club Profile Sidebar (Obsidian GUI Slabs) */}
        <div className="space-y-6">
          {/* Card 1: Club Hub */}
          <div className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-[#333333] pb-3">
              {/* Logo Frame (Dark Inset Slot) */}
              <div className="w-10 h-10 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] p-1 flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] overflow-hidden shrink-0">
                <img
                  src="/cblogo.png"
                  alt="CodeBreakers Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-[#55FF55] block [text-shadow:_1px_1px_0_#000]">
                  COMMUNITY HUB
                </span>
                <h4 className="font-mono font-black text-lg text-white uppercase leading-tight [text-shadow:_1px_1px_0_#000]">
                  CODEBREAKERS GCEK
                </h4>
              </div>
            </div>

            <p className="font-mono text-xs font-bold text-[#CCCCCC] leading-relaxed">
              {ABOUT_DATA.club.bio}
            </p>

            <a
              href={ENV.OFFICIAL_CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-mono text-xs font-black uppercase w-full py-2.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
            >
              <span>VISIT CODEBREAKERS PORTAL</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
            </a>
          </div>

          {/* Card 2: Campus Info */}
          <div className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="border-b-2 border-[#333333] pb-2">
              <span className="font-mono text-[10px] font-black uppercase text-[#FFAA00] block [text-shadow:_1px_1px_0_#000]">
                HOST CAMPUS
              </span>
              <h4 className="font-mono font-black text-base text-white uppercase leading-tight mt-1 [text-shadow:_1px_1px_0_#000]">
                GOVT. COLLEGE OF ENGINEERING KALAHANDI
              </h4>
            </div>

            <p className="font-mono text-xs font-bold text-[#CCCCCC] leading-relaxed">
              {ABOUT_DATA.institution.description}
            </p>

            <a
              href={ABOUT_DATA.institution.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-mono text-xs font-black uppercase w-full py-2.5 bg-[#707070] hover:bg-[#808080] text-white border-3 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
            >
              <span>INSTITUTE WEBSITE (GCEK)</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
