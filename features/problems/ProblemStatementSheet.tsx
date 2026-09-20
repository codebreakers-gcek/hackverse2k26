"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemStatement } from "@/types/problemStatement";
import {
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  X,
  Sparkles,
  Award,
  Compass,
  Download,
  Database,
  Building2,
  Lock,
  Clock,
} from "lucide-react";

export interface ProblemStatementSheetProps {
  problem: ProblemStatement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProblemStatementSheet({
  problem,
  isOpen,
  onClose,
}: ProblemStatementSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll, stop Lenis smooth scroll, and bind Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
    if (lenis) lenis.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      if (lenis) lenis.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const difficultyBadgeStyle = {
    Beginner: "bg-[#008800] text-white border border-[#55FF55]",
    Intermediate: "bg-[#FFAA00] text-black border border-[#FFE285]",
    Advanced: "bg-[#FF5555] text-white border border-[#FF8888]",
  };

  const sheetPortal = (
    <AnimatePresence mode="wait">
      {isOpen && problem && (
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* HARDWARE-ACCELERATED BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 z-40 cursor-pointer"
            aria-hidden="true"
          />

          {/* MINECRAFT THEMED DRAWER */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-50 w-full sm:w-[540px] md:w-[640px] lg:w-[45vw] lg:max-w-[700px] h-full max-h-screen bg-[#C6C6C6] border-l-4 sm:border-l-6 border-black text-black flex flex-col overflow-hidden shadow-[-12px_0px_35px_rgba(0,0,0,0.7)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >
            {/* ------------------------------------------------------------- */}
            {/* FIXED HEADER STRIP */}
            {/* ------------------------------------------------------------- */}
            <div className="shrink-0 bg-[#5B8731] border-b-4 border-black p-5 sm:p-6 space-y-3.5 select-none text-white border-t-2 border-t-[#85B745]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                    {problem.code}
                  </span>
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#282828] text-[#55FFFF] border border-black shadow-[1px_1px_0px_#000]">
                    {problem.category}
                  </span>
                  <span
                    className={`font-mono text-xs font-black uppercase px-2.5 py-1 shadow-[1px_1px_0px_#000] ${difficultyBadgeStyle[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 bg-black text-white hover:bg-[#FF5555] hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center font-black cursor-pointer"
                  title="Close Specifications (Esc)"
                  aria-label="Close sheet"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              {/* Minecraft Oak Wood Hanging Signboard for Organization */}
              {problem.organization && (
                <div className="bg-[#8A5A2B] border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] px-3 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2 w-fit">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] font-black text-[#FFE285] uppercase tracking-wider shrink-0 [text-shadow:_1px_1px_0_#000]">
                      ORG //
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-black uppercase text-white tracking-wide leading-tight [text-shadow:_1px_1px_0_#000]">
                      {problem.organization}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFE285] flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                  <Compass className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>{problem.domain}</span>
                </div>
                <h2
                  id="sheet-title"
                  className="font-mono font-black text-xl sm:text-2xl text-white uppercase tracking-tight leading-tight mt-1.5 [text-shadow:_2px_2px_0_#000]"
                >
                  {problem.title}
                </h2>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SCROLLABLE BODY */}
            {/* ------------------------------------------------------------- */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#DBDBDB] overscroll-contain touch-pan-y"
            >
              {problem.isLocked ? (
                /* Minecraft Mystery Sealed Chest View */
                <div className="space-y-6">
                  <div className="bg-[#1C1815] border-4 border-t-[#D4A368] border-l-[#D4A368] border-r-[#3E2512] border-b-[#3E2512] p-6 sm:p-8 shadow-[6px_6px_0px_#000] text-center space-y-5 text-white">
                    {/* Chest Model */}
                    <div className="relative my-3 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#FFAA00]/25 blur-xl rounded-full scale-150 pointer-events-none" />
                      <div className="relative w-32 h-24 bg-[#8F5A2B] border-4 border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] shadow-[6px_6px_0px_#000] flex items-center justify-center">
                        <div className="absolute top-[38%] left-0 right-0 h-1 bg-black/80 border-b border-[#B8874E]/40" />
                        <div className="absolute top-[28%] w-8 h-8 bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] flex items-center justify-center z-10">
                          <Lock className="w-4 h-4 text-black stroke-[3px]" />
                        </div>
                        <div className="absolute -top-3 -right-3">
                          <Sparkles className="w-5 h-5 text-[#FFE655] " />
                        </div>
                        <div className="absolute -bottom-2 -left-2">
                          <Sparkles className="w-4 h-4 text-[#FFAA00]" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="inline-block font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                        [QUEST EMBARGO ACTIVE // CHEST SEALED]
                      </span>
                      <h3 className="font-mono font-black text-2xl sm:text-3xl text-[#FFE655] uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
                        OFFICIAL SOFTWARE TRACK UNLOCKING TOMORROW
                      </h3>
                      <p className="text-xs sm:text-sm font-mono font-bold text-[#E5D7C5] leading-relaxed max-w-lg mx-auto">
                        This 8th challenge track for HACKVERSE &apos;26 Software Edition is currently locked under embargo. The loot chest will officially unlock tomorrow with complete real-world problem statements, technical architecture requirements, dataset endpoints, and grading rubrics.
                      </p>
                    </div>

                    <div className="bg-[#150B04] border-3 border-t-[#0D0702] border-l-[#0D0702] border-r-[#42250F] border-b-[#42250F] p-3.5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 text-[#55FF55] shrink-0 animate-spin" />
                      <span className="font-mono text-xs sm:text-sm font-black uppercase text-[#55FF55] tracking-wide [text-shadow:_1px_1px_0_#000]">
                        UNLOCKS TOMORROW // KEEP YOUR SQUAD READY
                      </span>
                    </div>
                  </div>

                  {/* Instructions Box */}
                  <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-3">
                    <h4 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-black flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8F5500] stroke-[2.5px]" />
                      <span>HOW TO PREPARE YOUR TEAM:</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm font-mono font-bold text-black/85">
                      <li className="flex items-start gap-2">
                        <span className="text-[#8F5500] font-black">▸</span>
                        <span>Register your squad today to secure your team slot in HACKVERSE &apos;26.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#8F5500] font-black">▸</span>
                        <span>Once this chest unlocks tomorrow, team leaders will be able to select this track directly in the Problem Selection portal.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {/* Detailed Brief Card */}
                  <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#256010]">
                      <Sparkles className="w-4 h-4 stroke-[2.5px]" />
                      <span>DETAILED PROBLEM BRIEF &amp; OBJECTIVE</span>
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-black/85 leading-relaxed space-y-3.5">
                      {problem.fullDescription.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Expected Solution */}
                  <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-4">
                    <h3 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-black flex items-center gap-2 border-b-2 border-black/20 pb-2">
                      <CheckCircle className="w-4 h-4 text-[#256010] stroke-[3px]" />
                      <span>EXPECTED SOLUTION &amp; KEY DELIVERABLES:</span>
                    </h3>
                    <div className="space-y-3">
                      {problem.keyDeliverables.map((deliv, idx) => {
                        const lines = deliv.split("\n").filter((l) => l.trim().length > 0);
                        const hasMultipleLines = lines.length > 1;
                        const title = hasMultipleLines ? lines[0] : null;
                        const bulletLines = hasMultipleLines ? lines.slice(1) : lines;

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3.5 bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] text-xs sm:text-sm font-mono font-bold text-black shadow-[2px_2px_0px_#000]"
                          >
                            <span className="w-6 h-6 bg-black text-[#55FF55] font-mono text-xs font-black flex items-center justify-center shrink-0 border border-black shadow-[1px_1px_0px_#000] mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="leading-snug pt-0.5 flex-1 space-y-2">
                              {title ? (
                                <div className="font-mono font-black uppercase text-black text-sm tracking-wide border-b-2 border-black/20 pb-1">
                                  {title}
                                </div>
                              ) : null}
                              {hasMultipleLines ? (
                                <ul className="space-y-1.5 pt-0.5">
                                  {bulletLines.map((line, lIdx) => (
                                    <li key={lIdx} className="flex items-start gap-2 text-black font-mono font-bold text-xs sm:text-[13px] leading-relaxed">
                                      <span className="text-black font-black select-none shrink-0 mt-0.5">•</span>
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
                    <div className="bg-[#E8C5C5] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#883333] border-b-[#883333] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-3">
                      <h3 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#991B1B] flex items-center gap-2 border-b-2 border-[#991B1B]/30 pb-2">
                        <AlertTriangle className="w-4 h-4 text-[#991B1B] stroke-[3px]" />
                        <span>TECHNICAL BOUNDARY CONSTRAINTS &amp; RULES:</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs sm:text-sm font-mono font-bold text-black/90">
                        {problem.constraints.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#991B1B] font-mono font-black">▸</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Relevant Datasets & Data Sources */}
                  {problem.relevantDatasets && problem.relevantDatasets.length > 0 && (
                    <div className="bg-[#C5DCE8] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#336688] border-b-[#336688] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-3">
                      <h3 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#0C4A6E] flex items-center gap-2 border-b-2 border-[#0C4A6E]/30 pb-2">
                        <Database className="w-4 h-4 text-[#0C4A6E] stroke-[3px]" />
                        <span>RELEVANT DATASETS &amp; DATA SOURCES:</span>
                      </h3>
                      <div className="space-y-2">
                        {problem.relevantDatasets.map((ds, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2.5 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] text-xs sm:text-sm font-mono font-bold text-black"
                          >
                            <span className="w-5 h-5 bg-black text-[#55FFFF] font-mono text-xs font-black flex items-center justify-center shrink-0 border border-black shadow-[1px_1px_0px_#000]">
                              {idx + 1}
                            </span>
                            <span className="leading-snug pt-0.5">{ds}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evaluation Focus */}
                  <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[4px_4px_0px_#000] space-y-3">
                    <div className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5 border-b-2 border-black/20 pb-2">
                      <Award className="w-4 h-4 text-[#8F5500] stroke-[2.5px]" />
                      <span>EVALUATION EMPHASIS:</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {problem.evaluationFocus.map((crit, idx) => (
                        <div
                          key={idx}
                          className="font-mono text-xs font-black uppercase p-3 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] text-black shadow-[2px_2px_0px_#000] leading-relaxed"
                        >
                          {crit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mentorship & Support */}
                  {problem.sponsorOrMentor && (
                    <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 flex items-center justify-between gap-3 shadow-[3px_3px_0px_#000]">
                      <span className="font-mono text-xs font-bold text-black/80">
                        INDUSTRY SPONSOR &amp; MENTORSHIP:
                      </span>
                      <span className="font-mono text-xs font-black bg-black text-[#55FF55] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                        {problem.sponsorOrMentor}
                      </span>
                    </div>
                  )}

                  {/* Problem Statement Organization */}
                  {problem.organization && (
                    <div className="bg-[#8A5A2B] border-4 border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] p-4 flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
                      <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#FFE285] [text-shadow:_1px_1px_0_#000]">
                        <span>PROBLEM STATEMENT ORGANISATION / BENEFICIARY:</span>
                      </div>
                      <span className="font-mono text-xs font-black bg-[#4A2D12] text-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                        {problem.organization}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FIXED FOOTER ACTIONS */}
            {/* ------------------------------------------------------------- */}
            <div className="shrink-0 bg-[#C6C6C6] border-t-4 border-black p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
              {problem.isLocked ? (
                <div className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 font-mono font-black text-xs uppercase tracking-wider bg-[#555555] text-[#AAAAAA] border-3 border-t-[#777777] border-l-[#777777] border-r-[#222222] border-b-[#222222] shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-not-allowed">
                  <Lock className="w-4 h-4 stroke-[3px]" />
                  <span>SPEC SHEET SEALED IN CHEST</span>
                </div>
              ) : (
                <a
                  href={problem.driveUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 font-mono font-black text-xs uppercase tracking-wider bg-[#5B8731] hover:bg-[#70B237] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#38591E] border-b-[#38591E] shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[3px]" />
                  <span>DOWNLOAD SPEC DOCUMENT</span>
                </a>
              )}

              <Link
                href="/register"
                onClick={onClose}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-[#FFAA00] hover:bg-[#FFC04D] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
              >
                <span>REGISTER SQUAD FOR HACKVERSE</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(sheetPortal, document.body);
}

