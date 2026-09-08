import React from "react";
import type { Metadata } from "next";
import { ProblemStatementList } from "@/features/problems/ProblemStatementList";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "Problem Statements // INNOVEX '26",
  description:
    "Explore the official hackathon problem tracks across AI/ML, Web3 & Cyber, Smart Automation, and Open Innovation.",
};

export default function ProblemStatementsPage() {
  return (
    <div className="flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <SectionTitle
          tag="CHALLENGES // 2026 ARENA"
          title="OFFICIAL PROBLEM"
          highlightText="STATEMENTS"
          subtitle="Select your arena of technical combat. Each challenge represents real-world engineering constraints with concrete evaluation criteria."
        />
        <ProblemStatementList />
      </div>
      <MarqueeBanner bg="secondary" speed="normal" />
    </div>
  );
}
