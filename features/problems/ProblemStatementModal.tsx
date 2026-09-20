"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { ProblemStatement } from "@/types/problemStatement";
import { CheckCircle, AlertTriangle, Cpu, ArrowRight, Sparkles, Database, Building2 } from "lucide-react";

export interface ProblemStatementModalProps {
  problem: ProblemStatement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProblemStatementModal({ problem, isOpen, onClose }: ProblemStatementModalProps) {
  if (!problem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={problem.title}
      badge={problem.code}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b-3 border-black pb-4">
          <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-muted border-2 border-black">
            DOMAIN: {problem.domain}
          </span>
          <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-secondary border-2 border-black">
            CATEGORY: {problem.category}
          </span>
          <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-white border-2 border-black">
            DIFFICULTY: {problem.difficulty}
          </span>
          {problem.organization && (
            <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#8A5A2B] text-white border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
              <Building2 className="w-3.5 h-3.5 text-[#FFE285]" />
              <span className="text-[#FFE285]">ORG:</span> {problem.organization}
            </span>
          )}
          {problem.sponsorOrMentor && (
            <span className="font-mono text-xs font-bold text-black/70 ml-auto">
              MENTORSHIP: {problem.sponsorOrMentor}
            </span>
          )}
        </div>

        {/* Detailed Brief */}
        <div>
          <h3 className="font-black text-lg uppercase tracking-tight mb-2">
            DETAILED PROBLEM SPECIFICATION
          </h3>
          <div className="text-sm sm:text-base font-bold text-black/85 leading-relaxed bg-neo-bg p-4 border-2 border-black space-y-3">
            {problem.fullDescription.split("\n\n").map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Expected Solution */}
        <div>
          <h3 className="font-black text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[3px]" />
            <span>EXPECTED SOLUTION &amp; KEY DELIVERABLES:</span>
          </h3>
          <div className="space-y-2.5">
            {problem.keyDeliverables.map((deliv, idx) => {
              const lines = deliv.split("\n").filter((l) => l.trim().length > 0);
              const hasMultipleLines = lines.length > 1;
              const title = hasMultipleLines ? lines[0] : null;
              const bulletLines = hasMultipleLines ? lines.slice(1) : lines;

              return (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black shadow-[2px_2px_0px_#000]">
                  <span className="w-5 h-5 bg-black text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    {title ? (
                      <div className="font-black uppercase text-black text-xs sm:text-sm tracking-wide border-b border-black/20 pb-1">
                        {title}
                      </div>
                    ) : null}
                    {hasMultipleLines ? (
                      <ul className="space-y-1 pt-0.5">
                        {bulletLines.map((line, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-1.5 text-xs sm:text-[13px] leading-relaxed">
                            <span className="text-black font-black select-none shrink-0">•</span>
                            <span>{line.replace(/^[•\-]\s*/, "")}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>{deliv}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="bg-amber-50 border-3 border-black p-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 stroke-[3px]" />
              <span>TECHNICAL BOUNDARY CONSTRAINTS:</span>
            </h3>
            <ul className="space-y-1 text-xs font-bold text-black/80">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>▸</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Relevant Datasets & Data Sources */}
        {problem.relevantDatasets && problem.relevantDatasets.length > 0 && (
          <div className="bg-cyan-50 border-3 border-black p-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-cyan-900 mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-700 stroke-[3px]" />
              <span>RELEVANT DATASETS &amp; DATA SOURCES:</span>
            </h3>
            <ul className="space-y-1.5 text-xs font-bold text-black/85">
              {problem.relevantDatasets.map((ds, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-cyan-300 text-black font-mono text-[10px] font-black flex items-center justify-center shrink-0 border border-black">
                    {idx + 1}
                  </span>
                  <span>{ds}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Evaluation Focus */}
        <div className="border-2 border-black p-3 bg-white space-y-2 pt-2">
          <div className="font-mono text-[11px] font-black uppercase text-black/60 border-b border-black/10 pb-1.5">
            EVALUATION EMPHASIS:
          </div>
          <div className="flex flex-col gap-1.5">
            {problem.evaluationFocus.map((crit, idx) => (
              <div
                key={idx}
                className="font-mono text-[11px] font-black p-2 bg-neo-secondary border border-black leading-snug"
              >
                {crit}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="pt-4 border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/register?psId=${encodeURIComponent(problem.id)}`}
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-4 border-black shadow-neo-sm hover:shadow-neo transition-all flex items-center justify-center gap-2"
          >
            <span>REGISTER WITH THIS PROBLEM</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
