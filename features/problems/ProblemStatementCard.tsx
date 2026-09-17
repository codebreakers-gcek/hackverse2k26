import React from "react";
import { Eye, ArrowRight, Compass, Terminal } from "lucide-react";
import { ProblemStatement } from "@/types/problemStatement";

export interface ProblemStatementCardProps {
  problem: ProblemStatement;
  onOpenDetails: (problem: ProblemStatement) => void;
}

export function ProblemStatementCard({ problem, onOpenDetails }: ProblemStatementCardProps) {
  const difficultyBadgeStyle = {
    Beginner: "bg-[#008800] text-white border border-black",
    Intermediate: "bg-[#FFAA00] text-black border border-black",
    Advanced: "bg-[#FF5555] text-white border border-black",
  };

  return (
    <div
      onClick={() => onOpenDetails(problem)}
      className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between overflow-hidden group cursor-pointer text-black select-none"
    >
      {/* Minecraft Top Header Strip */}
      <div className="bg-[#5B8731] border-b-4 border-black p-3.5 sm:p-4 flex items-center justify-between gap-2 border-t-2 border-t-[#85B745]">
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

      {/* Card Body */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-xs text-[#8F5500] uppercase font-black flex items-center gap-1.5">
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

