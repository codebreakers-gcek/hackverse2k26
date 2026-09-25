import React from "react";
import { Eye, ArrowRight, Compass, Terminal, Lock, Sparkles, Clock, Users } from "lucide-react";
import clsx from "clsx";
import { ProblemStatement } from "@/types/problemStatement";

export interface ProblemStatementCardProps {
  problem: ProblemStatement;
  onOpenDetails: (problem: ProblemStatement) => void;
  stats?: {
    count: number;
    primaryCount?: number;
    secondaryCount?: number;
  };
}

export function ProblemStatementCard({ problem, onOpenDetails, stats }: ProblemStatementCardProps) {
  const teamCount = stats?.count ?? 0;
  const difficultyBadgeStyle = {
    Beginner: "bg-[#008800] text-white border border-black",
    Intermediate: "bg-[#FFAA00] text-black border border-black",
    Advanced: "bg-[#FF5555] text-white border border-black",
  };

  // Special Minecraft Mystery Loot Chest Card when isLocked is true
  if (problem.isLocked) {
    return (
      <div
        onClick={() => onOpenDetails(problem)}
        className="bg-[#1C1815] border-4 border-t-[#D4A368] border-l-[#D4A368] border-r-[#3E2512] border-b-[#3E2512] shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer text-white select-none relative min-h-[460px]"
      >
        {/* Glowing Embargo Amber Accent Strip */}
        <div className="bg-[#42250F] border-b-4 border-black p-3.5 sm:p-4 flex items-center justify-between gap-2 border-t-2 border-t-[#855223]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-[#FFAA00] border-2 border-[#FFAA00] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
              <Lock className="w-3 h-3 text-[#FFAA00]" />
              {problem.code}
            </span>
            <span className="font-mono text-[11px] font-black uppercase px-2.5 py-0.5 bg-[#282828] text-[#55FFFF] border border-black shadow-[1px_1px_0px_#000]">
              {problem.category}
            </span>
          </div>
          <span className="font-mono text-[10px] font-black uppercase px-2.5 py-1 bg-[#FF5555] text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 [text-shadow:_1px_1px_0_#000]">
            <Lock className="w-3 h-3" /> SEALED CHEST
          </span>
        </div>

        {/* Chest Central Display */}
        <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col items-center text-center justify-between bg-gradient-to-b from-[#2A180C]/95 via-[#1C1815] to-[#120D0A]">
          {/* Pixelated 3D Chest Model Graphic */}
          <div className="relative my-2">
            {/* Ambient Chest Glow */}
            <div className="absolute inset-0 bg-[#FFAA00]/25 blur-xl rounded-full scale-150 pointer-events-none" />

            {/* Minecraft Double Oak Chest Box */}
            <div className="relative w-28 h-20 bg-[#8F5A2B] border-4 border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] shadow-[6px_6px_0px_#000] flex items-center justify-center">
              {/* Chest Top Lid Seam */}
              <div className="absolute top-[38%] left-0 right-0 h-1 bg-black/80 border-b border-[#B8874E]/40" />

              {/* Iron Padlock Latch */}
              <div className="absolute top-[28%] w-7 h-7 bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] flex items-center justify-center z-10">
                <Lock className="w-4 h-4 text-black stroke-[3px]" />
              </div>

              {/* Glowing Keyhole Sparkles */}
              <div className="absolute -top-3 -right-3">
                <Sparkles className="w-5 h-5 text-[#FFE655]" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-4 h-4 text-[#FFAA00]" />
              </div>

              {/* Corner Iron Reinforcements */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-[#4A4A4A] border-r border-b border-black" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#4A4A4A] border-l border-b border-black" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-[#4A4A4A] border-r border-t border-black" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4A4A4A] border-l border-t border-black" />
            </div>
          </div>

          {/* Quest Status & Mystery Title */}
          <div className="space-y-2">
            <span className="inline-block font-mono text-[11px] font-black uppercase px-2.5 py-0.5 bg-[#FFAA00] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
              [QUEST EMBARGO ACTIVE]
            </span>
            <h3 className="font-mono font-black text-xl sm:text-2xl text-[#FFE655] uppercase tracking-tight leading-tight [text-shadow:_2px_2px_0_#000]">
              NEW CHEST UNLOCKING TOMORROW
            </h3>
            <p className="text-xs sm:text-sm font-mono font-bold text-[#D0C4B4] leading-relaxed max-w-xs mx-auto">
              A mystery software challenge track is sealed in this loot chest. Full mission specifications, dataset links, and evaluation rubrics unlock tomorrow.
            </p>
          </div>

          {/* Minecraft Countdown Box */}
          <div className="w-full bg-[#150B04] border-3 border-t-[#0D0702] border-l-[#0D0702] border-r-[#42250F] border-b-[#42250F] p-3 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#55FF55] shrink-0" />
            <span className="font-mono text-xs font-black uppercase text-[#55FF55] tracking-wide [text-shadow:_1px_1px_0_#000]">
              UNLOCKS TOMORROW // STAY TUNED
            </span>
          </div>
        </div>

        {/* Card Footer Action: Chest Locked Action Button */}
        <div className="border-t-4 border-black bg-[#150B04]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(problem);
            }}
            className="w-full py-4 px-4 text-center font-mono font-black text-xs sm:text-sm uppercase tracking-wider bg-[#8F5A2B] hover:bg-[#FFAA00] text-[#FFE655] hover:text-black border-t-2 border-t-[#B8874E] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-inner"
          >
            <Lock className="w-4 h-4 stroke-[3px]" />
            <span>INSPECT SEALED CHEST</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenDetails(problem)}
      className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between overflow-hidden group cursor-pointer text-black select-none"
    >
      {/* Minecraft Top Header Strip */}
      <div className="bg-[#5B8731] border-b-4 border-black p-3.5 sm:p-4 space-y-2.5 border-t-2 border-t-[#85B745]">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
            {problem.code}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-black uppercase px-2.5 py-0.5 bg-[#282828] text-[#55FFFF] border border-black shadow-[1px_1px_0px_#000]">
              {problem.category}
            </span>
            <span
              className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 shadow-[1px_1px_0px_#000] ${difficultyBadgeStyle[problem.difficulty]}`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Minecraft Oak Wood Hanging Signboard for Organization */}
        {problem.organization && (
          <div className="bg-[#8A5A2B] border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] px-2.5 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-mono text-[9px] font-black text-[#FFE285] uppercase tracking-wider shrink-0 [text-shadow:_1px_1px_0_#000]">
                ORG //
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-white tracking-wide leading-tight [text-shadow:_1px_1px_0_#000]">
                {problem.organization}
              </span>
            </div>
          </div>
        )}

        {/* Live Squad Selection Counter Pill */}
        <div className="pt-0.5">
          <div
            className={clsx(
              "w-full px-2.5 py-1.5 flex items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] font-black uppercase shadow-[2px_2px_0px_#000] border-2 transition-all",
              teamCount > 0
                ? "bg-[#11240D] text-[#55FF55] border-[#55FF55] [text-shadow:_1px_1px_0_#000]"
                : "bg-[#222222] text-[#D4D4D4] border-[#444444]"
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Users
                className={clsx(
                  "w-3.5 h-3.5 shrink-0",
                  teamCount > 0 ? "text-[#55FF55] " : "text-[#AAAAAA]"
                )}
              />
              <span className="truncate">SQUADS SELECTED:</span>
            </div>
            <span
              className={clsx(
                "px-2 py-0.5 font-mono font-black border shadow-[1px_1px_0px_#000] shrink-0",
                teamCount > 0
                  ? "bg-black text-[#55FF55] border-[#55FF55] flex items-center gap-1"
                  : "bg-black text-[#AAAAAA] border-[#444444]"
              )}
            >
              {teamCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#55FF55] inline-block" />}
              {teamCount === 1 ? "01 SQUAD" : teamCount < 10 ? `0${teamCount} SQUADS` : `${teamCount} SQUADS`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-xs text-[#8F5500] uppercase font-black flex items-center gap-1.5 mb-1">
            <Compass className="w-3.5 h-3.5 shrink-0 stroke-[2.5px]" />
            <span className="truncate">{problem.domain}</span>
          </div>
          <h3 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-snug mt-1.5 mb-2.5 line-clamp-2">
            {problem.title}
          </h3>
          <p className="text-xs sm:text-sm font-mono font-bold text-black/85 leading-relaxed line-clamp-3">
            {problem.shortDescription}
          </p>
        </div>

        {/* Expected Solution Preview (Minecraft Inset Slot) */}
        {problem.keyDeliverables && problem.keyDeliverables.length > 0 && (
          <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-3 space-y-1.5">
            <div className="font-mono text-[10px] font-black uppercase text-black flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 stroke-[2.5px] text-black" />
              <span>EXPECTED SOLUTION:</span>
            </div>
            <ul className="space-y-1 text-xs font-mono font-bold text-black/90">
              {problem.keyDeliverables.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-black font-mono font-bold shrink-0">▸</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Footer Action: Full Width View Details Button */}
      <div className="border-t-4 border-black bg-[#C6C6C6]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(problem);
          }}
          className="w-full py-3.5 px-4 text-center font-mono font-black text-xs sm:text-sm uppercase tracking-wider bg-[#5B8731] hover:bg-[#FFAA00] group-hover:bg-[#FFAA00] text-white group-hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-inner"
        >
          <Eye className="w-4 h-4 stroke-[3px]" />
          <span>VIEW FULL DETAILS</span>
          <ArrowRight className="w-4 h-4 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
}

