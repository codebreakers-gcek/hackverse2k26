import React from "react";
import type { Metadata } from "next";
import { ProblemStatementList } from "@/features/problems/ProblemStatementList";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "Official Problem Statements & Technical Tracks",
  description:
    "Explore the official hackathon problem tracks across AI/ML, Web3 & Decentralized Tech, Cyber Security, Smart Automation & IoT, and Open Innovation for HACKVERSE '26.",
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/problem-statements",
  },
  openGraph: {
    title: "Official Problem Statements // HACKVERSE '26",
    description:
      "Choose your battle arena: AI/ML, Cyber Security, Web3, Smart Cities, or Open Innovation with ₹35K+ in prizes.",
    url: "https://hackverse.codebreakersgcek.tech/problem-statements",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Problem Statements" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Problem Statements & Tracks // HACKVERSE '26",
    description:
      "Explore high-impact industry problem statements in AI/ML, Web3, Cyber Security, IoT, and Open Innovation.",
    images: ["/og-image.png"],
  },
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
