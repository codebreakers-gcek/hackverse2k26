import type { Metadata } from "next";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { ProblemStatementList } from "@/features/problems/ProblemStatementList";
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
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-hidden flex flex-col selection:bg-[#FFAA00] selection:text-black">
      {/* Minecraft Problem Statements Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/wallpaper.webp"
          alt="HackVerse Problem Statements Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving image clarity */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Banner Marquee */}
        <MarqueeBanner
          items={[
            "OFFICIAL PROBLEM STATEMENTS",
            "3 LIVE CHALLENGES",
            "AUTONOMOUS ROBOTICS & IOT",
            "HEALTHCARE & DISASTER MANAGEMENT",
            "OFFLINE DIGITAL LEARNING EDUTECH",
            "₹35K+ PRIZE POOL",
          ]}
          bg="secondary"
        />

        {/* Hero Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 w-full flex-1">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>CHALLENGES // 2026 ARENA</span>
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              OFFICIAL PROBLEM{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                STATEMENTS
              </span>
            </h1>

            <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[6px_6px_0px_#000] max-w-3xl">
              <p className="text-xs sm:text-sm md:text-base font-bold text-black font-mono leading-relaxed">
                Select your arena of technical combat. Each challenge represents real-world engineering constraints with concrete evaluation criteria and industry relevance.
              </p>
            </div>
          </div>

          <ProblemStatementList />
        </div>

        <MarqueeBanner bg="secondary" speed="normal" />
      </div>
    </div>
  );
}

