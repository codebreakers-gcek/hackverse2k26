import React from "react";
import { EVALUATION_CRITERIA_MATRIX } from "@/data/guidelines";
import { Award, Percent } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";

export function EvaluationMatrix() {
  return (
    <div className="space-y-8 mt-16">
      <SectionTitle
        tag="SCORING // JURY"
        title="OFFICIAL EVALUATION"
        highlightText="SCORE MATRIX"
        subtitle="Judges and industry reviewers evaluate team deliverables according to four weighted parameters totaling 100 points."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVALUATION_CRITERIA_MATRIX.map((crit, idx) => {
          const colors = [
            "bg-neo-secondary",
            "bg-neo-accent",
            "bg-neo-muted",
            "bg-white",
          ];
          const bg = colors[idx % colors.length];

          return (
            <div
              key={crit.parameter}
              className={`border-4 border-black ${bg} p-6 sm:p-8 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between border-b-3 border-black/20 pb-3 mb-4">
                  <span className="font-mono text-xs font-black uppercase text-black">
                    CRITERION 0{idx + 1}
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black bg-black text-white px-3 py-1 border border-black shadow-neo-sm flex items-center gap-0.5">
                    {crit.weightage}
                    <Percent className="w-4 h-4 stroke-[3px]" />
                  </span>
                </div>

                <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight mb-3 leading-snug">
                  {crit.parameter}
                </h3>

                <p className="text-sm font-bold text-black/85 leading-relaxed mb-4">
                  {crit.description}
                </p>

                <div className="space-y-2 pt-3 border-t-2 border-black/20">
                  <div className="font-mono text-[11px] font-black uppercase text-black/70">
                    JUDGING FOCUS INDICATORS:
                  </div>
                  <ul className="space-y-1 text-xs font-bold text-black/90">
                    {crit.scoringFocus.map((focus, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <span className="text-black font-black">✔</span>
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t-2 border-black/20 font-mono text-[10px] font-black uppercase text-black/60 text-right">
                MAX SCORE: {crit.weightage} PTS
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
