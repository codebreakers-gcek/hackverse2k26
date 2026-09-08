import React from "react";
import type { Metadata } from "next";
import { GuidelinesAccordion } from "@/features/guidelines/GuidelinesAccordion";
import { EvaluationMatrix } from "@/features/guidelines/EvaluationMatrix";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "Guidelines & Rules // INNOVEX '26",
  description:
    "Official hackathon rules, eligibility criteria, code of conduct, and 100-point evaluation scoring rubric.",
};

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <SectionTitle
          tag="RULEBOOK // DIRECTIVES"
          title="HACKATHON GUIDELINES &"
          highlightText="REGULATIONS"
          subtitle="Strict adherence to the code of conduct, academic integrity, and operational guidelines is mandatory for all participating teams."
        />
        <GuidelinesAccordion />
        <EvaluationMatrix />
      </div>
      <MarqueeBanner bg="secondary" speed="normal" />
    </div>
  );
}
