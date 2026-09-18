/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Gavel,
  ChevronLeft,
  Clock,
  Lock,
  BarChart3,
} from "lucide-react";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import Image from "next/image";

export default function TeamJudgingPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";
  const ticketId = rawId.toUpperCase().startsWith("HV26-")
    ? rawId.toUpperCase()
    : `HV26-${rawId.toUpperCase()}`;

  const [teamName, setTeamName] = useState<string>("SQUAD EVALUATION");
  const [psTitle, setPsTitle] = useState<string>("");

  useEffect(() => {
    if (!ticketId || typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem(`hackverse_auth_${ticketId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.team?.teamName) {
          setTeamName(parsed.team.teamName);
          if (parsed.team.problemStatement?.title) {
            setPsTitle(parsed.team.problemStatement.title);
          }
        }
      }
    } catch {}
  }, [ticketId]);

  const scoringCriteria = [
    {
      id: "architecture",
      title: "1. Technical Architecture & Stack Execution",
      weight: "25%",
      description: "Code modularity, system design, scalability, robust API patterns, and effective tech stack utilization.",
      maxMarks: 25,
    },
    {
      id: "innovation",
      title: "2. Innovation, Originality & Problem Fit",
      weight: "25%",
      description: "Novelty of approach, uniqueness of the algorithmic or technical solution, and adherence to track goals.",
      maxMarks: 25,
    },
    {
      id: "uiux",
      title: "3. User Experience & Prototype Completeness",
      weight: "25%",
      description: "Functional MVP workflow, intuitive UI/UX, responsive interface, and working live demonstration.",
      maxMarks: 25,
    },
    {
      id: "presentation",
      title: "4. Presentation, Q&A Defense & Milestone Progress",
      weight: "25%",
      description: "Clarity of pitch, technical defense during judge questioning, and milestone delivery under hackathon timeline.",
      maxMarks: 25,
    },
  ];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-black overflow-hidden font-sans">
      {/* Minecraft Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/documentbg.webp"
          alt="HackVerse Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Banner Marquee */}
        <MarqueeBanner
          items={[
            "HACKVERSE '26 // OFFICIAL JUDGING & SCORING PORTAL",
            `TARGET SQUAD: ${ticketId}`,
            "STAGE EVALUATION ENGINE",
            "CODEBREAKERS GCEK",
          ]}
          bg="secondary"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-6">
          {/* Back Navigation */}
          <div>
            <Link
              href={`/teams/${ticketId}`}
              className="inline-flex items-center gap-1.5 font-mono font-black text-xs uppercase px-3 py-1.5 bg-black text-white hover:bg-neutral-800 border-2 border-white shadow-neo-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>RETURN TO SQUAD DOSSIER</span>
            </Link>
          </div>

          {/* Main Container */}
          <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] p-6 sm:p-8 space-y-6">
            {/* Header Strip */}
            <div className="bg-[#2B2B2B] text-white -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-4 sm:p-5 border-b-4 border-black flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FFAA00] text-black border-2 border-black flex items-center justify-center font-black">
                  <Gavel className="w-5 h-5 stroke-[2.5px]" />
                </div>
                <div>
                  <h1 className="font-mono text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    JUDGE EVALUATION &amp; SCORING
                  </h1>
                  <span className="font-mono text-[11px] text-[#55FFFF]">
                    SQUAD PASS: {ticketId}
                  </span>
                </div>
              </div>

              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000]">
                PORTAL PREVIEW
              </span>
            </div>

            {/* Squad Banner */}
            <div className="bg-white border-3 border-black p-4 sm:p-5 space-y-1 shadow-neo-sm">
              <span className="font-mono text-[10px] font-black uppercase text-neutral-500 block">
                EVALUATING SQUAD
              </span>
              <h2 className="font-mono font-black text-2xl sm:text-3xl text-black uppercase">
                {teamName}
              </h2>
              {psTitle && (
                <p className="font-mono text-xs font-bold text-neutral-700 pt-0.5">
                  Statement: {psTitle}
                </p>
              )}
            </div>

            {/* Coming Soon Notice (Minecraft Inset Slot) */}
            <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-5 sm:p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-[#2B2B2B] border-3 border-black shadow-[3px_3px_0px_#000] mx-auto flex items-center justify-center text-[#FFAA00]">
                <Clock className="w-7 h-7 stroke-[2.5px]" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000]">
                  JUDGING SCORING ENGINE // COMING SOON
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold text-black/90 max-w-lg mx-auto leading-relaxed pt-1">
                  The live scoring rubric and round evaluation inputs will be unlocked during official judging rounds on event day. Judges will record milestone marks and feedback directly here.
                </p>
              </div>
            </div>

            {/* Rubric Preview Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-black">
                <BarChart3 className="w-4 h-4 text-black stroke-[2.5px]" />
                <span>OFFICIAL EVALUATION CRITERIA MATRIX (100 TOTAL MARKS)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {scoringCriteria.map((crit) => (
                  <div
                    key={crit.id}
                    className="bg-white border-3 border-black p-4 space-y-2 opacity-90 shadow-neo-sm relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2 border-b-2 border-black/10 pb-2">
                      <span className="font-mono font-black text-xs text-black uppercase">
                        {crit.title}
                      </span>
                      <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-black text-white shrink-0">
                        MAX: {crit.maxMarks} PTS
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-700 leading-relaxed font-bold">
                      {crit.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-black/10 text-neutral-400 font-mono text-xs">
                      <span>Weightage: {crit.weight}</span>
                      <span className="text-[10px] uppercase font-black text-amber-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        LOCKED UNTIL EVALUATION
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t-3 border-neutral-600 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/teams/${ticketId}`}
                className="bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-xs uppercase px-5 py-2.5 border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>BACK TO SQUAD DETAILS</span>
              </Link>

              <button
                type="button"
                disabled
                className="bg-[#A0A0A0] text-neutral-700 font-mono font-black text-xs uppercase px-6 py-2.5 border-4 border-t-[#C0C0C0] border-l-[#C0C0C0] border-r-[#606060] border-b-[#606060] shadow-[2px_2px_0px_#000] cursor-not-allowed select-none inline-flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>SUBMIT SCORES (ACTIVATING ON EVENT DAY)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
