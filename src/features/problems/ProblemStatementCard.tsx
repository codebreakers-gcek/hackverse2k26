import React from "react";
import Link from "next/link";
import { ArrowRight, Eye, Code2 } from "lucide-react";
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
    <div className="border-4 border-black bg-white shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between rounded-none">
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
          <h3 className="font-black text-xl text-black uppercase tracking-tight leading-snug mt-1 mb-3 line-clamp-2">
            {problem.title}
          </h3>
          <p className="text-sm font-bold text-black/80 leading-relaxed line-clamp-3">
            {problem.shortDescription}
          </p>
        </div>

        {/* Suggested Tech Stack Pills */}
        <div className="pt-3 border-t-2 border-black/15">
          <div className="flex items-center gap-1 font-mono text-[10px] font-black uppercase text-black/60 mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>TECH STACK:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {problem.suggestedStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-white border border-black text-black"
              >
                {tech}
              </span>
            ))}
            {problem.suggestedStack.length > 4 && (
              <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 bg-neutral-100 border border-black text-black/60">
                +{problem.suggestedStack.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="border-t-4 border-black grid grid-cols-2 bg-neo-bg">
        <button
          type="button"
          onClick={() => onOpenDetails(problem)}
          className="py-3 px-2 text-center font-black text-xs uppercase tracking-wider text-black hover:bg-neutral-200 border-r-2 border-black transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5 stroke-[3px]" />
          <span>DETAILS</span>
        </button>

        <Link
          href={`/register?psId=${encodeURIComponent(problem.id)}`}
          className="py-3 px-2 text-center font-black text-xs uppercase tracking-wider bg-neo-secondary text-black hover:bg-neo-accent transition-colors flex items-center justify-center gap-1"
        >
          <span>SELECT &amp; APPLY</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
        </Link>
      </div>
    </div>
  );
}
