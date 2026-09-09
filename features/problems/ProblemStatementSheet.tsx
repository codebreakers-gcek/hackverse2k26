"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemStatement } from "@/types/problemStatement";
import {
  CheckCircle,
  AlertTriangle,
  Code2,
  ArrowRight,
  X,
  Sparkles,
  Award,
  Compass,
  Download,
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

  const difficultyColors = {
    Beginner: "bg-emerald-300 text-black",
    Intermediate: "bg-neo-secondary text-black",
    Advanced: "bg-neo-accent text-black",
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
          {/* ========================================================================= */}
          {/* HARDWARE-ACCELERATED BACKDROP (NO BACKDROP FILTER BLUR LAG) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
            aria-hidden="true"
          />

          {/* ========================================================================= */}
          {/* HIGH-PERFORMANCE 60FPS COMPOSITED DRAWER */}
          {/* ========================================================================= */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 320,
              mass: 0.8,
            }}
            style={{ willChange: "transform" }}
            className="relative z-50 w-full sm:w-[520px] md:w-[620px] lg:w-[40vw] lg:max-w-[40vw] xl:w-[40vw] xl:max-w-[40vw] h-full max-h-screen bg-neo-bg border-l-4 border-black text-black flex flex-col overflow-hidden shadow-[-12px_0px_35px_rgba(0,0,0,0.35)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >
            {/* ------------------------------------------------------------- */}
            {/* FIXED HEADER STRIP */}
            {/* ------------------------------------------------------------- */}
            <div className="shrink-0 bg-white border-b-4 border-black p-5 sm:p-6 space-y-3 select-none">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-white border-2 border-black shadow-neo-sm">
                    {problem.code}
                  </span>
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-muted text-black border-2 border-black">
                    {problem.category}
                  </span>
                  <span
                    className={`font-mono text-xs font-black uppercase px-2.5 py-1 border-2 border-black ${difficultyColors[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                {/* Custom Neo-Brutalist Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 bg-white text-black hover:bg-neo-accent border-3 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center font-black cursor-pointer"
                  title="Close Specifications (Esc)"
                  aria-label="Close sheet"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div>
                <div className="font-mono text-[11px] font-black uppercase tracking-wider text-black/60 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>{problem.domain}</span>
                </div>
                <h2
                  id="sheet-title"
                  className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-tight mt-1"
                >
                  {problem.title}
                </h2>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SCROLLABLE BODY (LENIS PREVENTED + ZERO LAG) */}
            {/* ------------------------------------------------------------- */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-neo-bg overscroll-contain touch-pan-y"
            >
              {/* Detailed Brief Card */}
              <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-neo space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                  <Sparkles className="w-4 h-4 text-amber-500 stroke-[3px]" />
                  <span>DETAILED PROBLEM BRIEF &amp; OBJECTIVE</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-black/90 leading-relaxed">
                  {problem.fullDescription}
                </p>
              </div>

              {/* Mandatory Key Deliverables */}
              <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-neo space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-2 border-b-2 border-black/10 pb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                  <span>MANDATORY KEY DELIVERABLES (MVP SCOPE):</span>
                </h3>
                <div className="space-y-2.5">
                  {problem.keyDeliverables.map((deliv, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-neo-bg border-2 border-black text-xs sm:text-sm font-bold text-black"
                    >
                      <span className="w-6 h-6 bg-black text-white font-mono text-xs font-black flex items-center justify-center shrink-0 border border-black">
                        {idx + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="border-4 border-black bg-amber-100 p-5 sm:p-6 shadow-neo space-y-3">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-950 flex items-center gap-2 border-b-2 border-black/20 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-800 stroke-[3px]" />
                    <span>TECHNICAL BOUNDARY CONSTRAINTS &amp; RULES:</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-bold text-black/85">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-900 font-mono font-black">▸</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Toolkit & Evaluation Focus Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tech Stack */}
                <div className="border-4 border-black bg-white p-5 shadow-neo space-y-3">
                  <div className="font-mono text-xs font-black uppercase text-black/70 flex items-center gap-1.5 border-b-2 border-black/10 pb-2">
                    <Code2 className="w-4 h-4 stroke-[2.5px]" />
                    <span>RECOMMENDED TOOLKIT:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {problem.suggestedStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-bg border-2 border-black text-black shadow-neo-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evaluation Focus */}
                <div className="border-4 border-black bg-white p-5 shadow-neo space-y-3">
                  <div className="font-mono text-xs font-black uppercase text-black/70 flex items-center gap-1.5 border-b-2 border-black/10 pb-2">
                    <Award className="w-4 h-4 text-amber-500 stroke-[2.5px]" />
                    <span>EVALUATION EMPHASIS:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {problem.evaluationFocus.map((crit) => (
                      <span
                        key={crit}
                        className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-secondary border-2 border-black text-black shadow-neo-sm"
                      >
                        {crit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mentorship & Support */}
              {problem.sponsorOrMentor && (
                <div className="border-3 border-black bg-white p-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-bold text-black/70">
                    INDUSTRY SPONSOR &amp; MENTORSHIP:
                  </span>
                  <span className="font-mono text-xs font-black bg-neo-muted px-2 py-0.5 border border-black">
                    {problem.sponsorOrMentor}
                  </span>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FIXED FOOTER ACTIONS */}
            {/* ------------------------------------------------------------- */}
            <div className="shrink-0 bg-white border-t-4 border-black p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
              <a
                href={problem.driveUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 font-black text-xs uppercase tracking-wider border-3 border-black bg-white hover:bg-neutral-100 transition-all shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[3px]" />
                <span>DOWNLOAD SPEC DOCUMENT</span>
              </a>

              <Link
                href="/register"
                onClick={onClose}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
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
