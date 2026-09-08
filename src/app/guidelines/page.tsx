import React from "react";
import Link from "next/link";
import { GuidelinesAccordion } from "@/features/guidelines/GuidelinesAccordion";
import { EvaluationMatrix } from "@/features/guidelines/EvaluationMatrix";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { ArrowRight, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guidelines & Rules // INNOVEX '26 | CodeBreakers GCEK",
  description:
    "Official hackathon guidelines, eligibility criteria, submission rules, code of conduct, and evaluation score matrix for INNOVEX '26.",
};

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col">
      {/* Top Banner */}
      <section className="bg-neo-secondary border-b-4 border-black py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm inline-block">
            REGULATORY PROTOCOLS // WCAG COMPLIANT
          </span>
          <h1 className="font-black text-4xl sm:text-6xl md:text-7xl text-black uppercase tracking-tight leading-tight">
            GUIDELINES <span className="text-neo-accent">&amp;</span> RULES
          </h1>
          <p className="text-base sm:text-xl font-bold text-black/85 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know regarding team composition, fresh code requirements, repository submission protocols, and jury scoring rubrics.
          </p>
        </div>
      </section>

      {/* Marquee Banner */}
      <MarqueeBanner bg="muted" speed="normal" />

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Important Alert Callout */}
        <div className="border-4 border-black bg-white p-6 shadow-neo mb-12 flex items-start gap-4">
          <div className="w-12 h-12 bg-neo-accent text-black border-2 border-black flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[3px]" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight">
              FRESH CODE POLICY STRICTLY ENFORCED
            </h3>
            <p className="text-sm font-bold text-black/80 mt-1 leading-relaxed">
              All proprietary code submitted during the hackathon must be authored within the 36-hour sprint window. Pre-built applications are disqualified. Use of open-source frameworks, npm packages, and pretrained foundation models is fully allowed with proper attribution.
            </p>
          </div>
        </div>

        {/* 1. Categorized Accordion Rules */}
        <GuidelinesAccordion />

        {/* 2. Official Evaluation Score Matrix */}
        <EvaluationMatrix />

        {/* Bottom Registration Prompt */}
        <div className="mt-16 border-4 border-black bg-neo-bg p-8 shadow-neo text-center space-y-4">
          <h3 className="font-black text-2xl uppercase">
            HAVE YOU READ ALL GUIDELINES?
          </h3>
          <p className="text-sm font-bold text-black/75 max-w-lg mx-auto">
            Ensure all teammates comply with eligibility before securing your team slot.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-4 border-black shadow-neo-sm hover:shadow-neo transition-all"
            >
              <span>PROCEED TO REGISTRATION</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
