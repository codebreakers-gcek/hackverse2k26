import React from "react";
import type { Metadata } from "next";
import { ProblemStatementList } from "@/features/problems/ProblemStatementList";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "Official Problem Statements & Technical Tracks",
  description:
    "Explore the official hackathon problem tracks across AI/ML, Web3 & Decentralized Tech, Cyber Security, Smart Automation & IoT, and Open Innovation for HACKVERSE '26.",
  keywords: [
    "hackathon problem statements 2026",
    "HACKVERSE problem statements",
    "AI ML problem statements",
    "Web3 blockchain problem statements",
    "cybersecurity challenge tracks",
    "IoT smart automation tracks",
    "open innovation problem statements",
    "hackathon challenge tracks Odisha",
    "real world engineering problems",
    "machine learning problem statements",
    "generative AI hackathon challenge",
    "smart city IoT challenge",
    "ethical hacking problem statements",
    "decentralized app problem statements",
    "fintech blockchain hackathon challenge",
    "healthcare AI problem statement",
    "agriculture IoT hackathon challenge",
    "disaster management technology problem",
    "cloud computing problem statements",
    "full stack web development challenge",
    "mobile application development problem",
    "smart governance hackathon track",
    "renewable energy IoT challenge",
    "deepfake detection AI problem",
    "supply chain blockchain solution",
    "network security challenge track",
    "hardware automation problem statements",
    "natural language processing challenge",
    "computer vision hackathon challenge",
    "autonomous robotics problem statements",
    "student problem statements Odisha",
    "GCEK hackathon tracks",
    "CodeBreakers coding challenges",
    "State level hackathon problem list",
    "hackathon problem definition 2026",
    "problem statement PDF download",
    "hackathon problem code overview",
    "industry sponsored problem statements",
    "beginner friendly problem statements",
    "advanced engineering challenges",
    "intermediate coding problem tracks",
    "best problem statements for hackathons",
    "hackathon project ideas 2026",
    "hackathon MVP challenge ideas",
    "smart automation engineering track",
    "cyber defense challenge Odisha",
    "smart healthcare IoT engineering",
    "rural innovation hackathon challenge",
    "Odisha smart development challenge",
    "HACKVERSE technical tracks list",
  ],
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
