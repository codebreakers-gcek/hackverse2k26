import React from "react";
import { Eye, Code2, ArrowRight } from "lucide-react";
import { ProblemStatement } from "@/types/problemStatement";

export interface ProblemStatementCardProps {
  problem: ProblemStatement;
  onOpenDetails: (problem: ProblemStatement) => void;
}

export function ProblemStatementCard({ problem, onOpenDetails }: ProblemStatementCardProps) {
  const difficultyColors = {
    Beginner: "bg-emerald-300 text-black",
    Intermediate: "bg-neo-secondary text-black",
    Advanced: "bg-neo-accent text-black",
  };

  return (
    <div
      onClick={() => onOpenDetails(problem)}
      className="border-4 border-black bg-white shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between rounded-none group cursor-pointer"
    >
      {/* Card Header Strip */}
      <div className="bg-neo-bg border-b-4 border-black p-4 flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
          {problem.code}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-black uppercase px-2 py-0.5 bg-neo-muted text-black border border-black">
            {problem.category}
          </span>
          <span
            className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black ${difficultyColors[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-mono text-[11px] font-bold text-black/60 uppercase">
            {problem.domain}
          </div>
          <h3 className="font-black text-xl text-black uppercase tracking-tight leading-snug mt-1 mb-3 line-clamp-2 group-hover:text-black">
            {problem.title}
          </h3>
          <p className="text-sm font-bold text-black/80 leading-relaxed line-clamp-3">
            {problem.shortDescription}
          </p>
        </div>

        {/* Expected Solution Preview */}
        {problem.keyDeliverables && problem.keyDeliverables.length > 0 && (
          <div className="pt-3 border-t-2 border-black/15 space-y-1.5">
            <div className="font-mono text-[10px] font-black uppercase text-black/60">
              EXPECTED SOLUTION:
            </div>
            <ul className="space-y-1 text-xs font-bold text-black/80">
              {problem.keyDeliverables.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-black font-black shrink-0">▸</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Footer Action: Full Width View Details Button */}
      <div className="border-t-4 border-black bg-neo-bg">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(problem);
          }}
          className="w-full py-3.5 px-4 text-center font-black text-xs sm:text-sm uppercase tracking-wider bg-neo-secondary text-black hover:bg-neo-accent transition-all flex items-center justify-center gap-2 group-hover:bg-neo-accent"
        >
          <Eye className="w-4 h-4 stroke-[3px] group-hover:scale-110 transition-transform" />
          <span>VIEW FULL DETAILS</span>
          <ArrowRight className="w-4 h-4 stroke-[3px] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
