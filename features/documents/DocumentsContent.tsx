"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { HACKATHON_DOCUMENTS, HackathonDocument } from "@/data/documentsData";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import Image from "next/image";
import {
  FileText,
  Presentation,
  BookOpen,
  Download,
  ExternalLink,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck,
  Building2,
  Layers,
  HelpCircle,
} from "lucide-react";
import clsx from "clsx";

type DocumentTab = "all" | "presentation" | "rulebook" | "brochure";

export function DocumentsContent() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<DocumentTab>("all");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const filteredDocs = HACKATHON_DOCUMENTS.filter((doc) => {
    if (activeTab === "all") return true;
    return doc.category === activeTab;
  });

  return (
    <div className="relative min-h-screen bg-neutral-950 text-black overflow-hidden">
      {/* Minecraft Documents Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/documentbg.webp"
          alt="HackVerse Documents Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving 100% full image clarity */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Banner Marquee */}
        <MarqueeBanner
          items={[
            "OFFICIAL HACKVERSE '26 DOCUMENTS",
            "PRESENTATION PPT TEMPLATE",
            "OFFICIAL RULE BOOK",
            "EVENT BROCHURE",
            "STANDARDIZED EVALUATION FORMAT",
            "CODEBREAKERS GCEK",
          ]}
          bg="secondary"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 w-full"
        >
          {/* ========================================================================= */}
          {/* SECTION 1: HEADER */}
          {/* ========================================================================= */}
          <motion.div variants={itemVariants} className="space-y-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <FileText className="w-3.5 h-3.5" /> CODEBREAKERS GCEK // OFFICIAL ASSETS &amp; TEMPLATES
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              DOCUMENTS &amp;{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                TEMPLATES
              </span>
            </h1>

            <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-3xl">
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                Download standardized presentation decks, the official rule book, and event brochures for HackVerse &apos;26.
              </p>
            </div>
          </motion.div>
        {/* ========================================================================= */}
        {/* SECTION 3: DOCUMENT CARDS (Minecraft GUI Box Rows) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-8 w-full">
          {filteredDocs.map((doc) => {
            const isPPT = doc.category === "presentation";
            const isRulebook = doc.category === "rulebook";
            const isBrochure = doc.category === "brochure";

            return (
              <div
                key={doc.id}
                id={doc.id}
                className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] p-4 sm:p-6 flex flex-col space-y-5 relative overflow-hidden"
              >
                {/* Minecraft Header Bar */}
                <div
                  className={clsx(
                    "border-b-4 border-black -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-white",
                    isPPT
                      ? "bg-[#5B8731] border-t-2 border-t-[#85B745]"
                      : isRulebook
                      ? "bg-[#9A3412] border-t-2 border-t-[#EA580C]"
                      : "bg-[#2C6B74] border-t-2 border-t-[#55FFFF]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#2B2B2B] border-2 border-black flex items-center justify-center text-[#55FFFF] font-mono text-xs font-black shadow-[2px_2px_0px_#000]">
                      {isPPT ? (
                        <Presentation className="w-3.5 h-3.5 text-[#55FFFF]" />
                      ) : isRulebook ? (
                        <BookOpen className="w-3.5 h-3.5 text-[#55FFFF]" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-[#55FFFF]" />
                      )}
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                      {doc.badge}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {doc.isAvailable ? (
                    <span className="font-mono text-[10px] font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#55FF55]" />
                      <span>AVAILABLE NOW</span>
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] font-black uppercase px-2.5 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#FFAA00]" />
                      <span>RELEASING SOON</span>
                    </span>
                  )}
                </div>

                {/* Main Content Grid: Info on left & Inset Preview/Action on right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                  {/* Left Column: Title, description, specs, instructions */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-mono font-black text-xl sm:text-2xl text-black uppercase tracking-wide leading-tight">
                        {doc.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-black/85 font-mono leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* Specs Matrix (Minecraft Inset Slot) */}
                    <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
                      {doc.specs.map((spec, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[9px] font-black text-black/70 uppercase tracking-wider truncate">{spec.label}</span>
                          <span className="font-black text-black bg-[#A0A0A0]/70 px-2 py-1 border border-[#606060] mt-0.5 break-words text-[11px] leading-tight">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Instructions / Key Requirements */}
                    <div className="space-y-2">
                      <h4 className="font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-black">
                        <FileCheck className="w-4 h-4 stroke-[2.5px] text-black" />
                        <span>DOCUMENT REQUIREMENTS &amp; USAGE:</span>
                      </h4>
                      <ul className="space-y-1.5 font-mono font-bold text-xs text-black/90">
                        {doc.instructions.map((inst, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-mono font-black bg-black text-[#FFAA00] border border-black text-[9px] px-1.5 py-0.2 shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
                              0{i + 1}
                            </span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Inset preview slot & Download button */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    {/* Document Preview Frame (Minecraft Inset Inventory Slot) */}
                    <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-5 text-center space-y-3 relative overflow-hidden flex-1 flex flex-col items-center justify-center">
                      {doc.isAvailable && doc.embedUrl ? (
                        <div className="aspect-video w-full border-2 border-black">
                          <iframe
                            src={doc.embedUrl}
                            title={doc.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : doc.isAvailable && doc.downloadUrl ? (
                        <div className="py-3 flex flex-col items-center justify-center space-y-3">
                          <div className="w-14 h-14 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                            {isPPT ? (
                              <Presentation className="w-7 h-7 text-[#55FF55] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            ) : isRulebook ? (
                              <BookOpen className="w-7 h-7 text-[#55FF55] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            ) : (
                              <FileText className="w-7 h-7 text-[#55FF55] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> OFFICIAL DOCUMENT READY
                            </span>
                            <p className="text-xs font-bold text-black/90 max-w-xs mx-auto font-mono">
                              {isPPT
                                ? `Download official ${doc.shortTitle} (.pptx) to structure your squad presentation.`
                                : isRulebook
                                ? `Download official ${doc.shortTitle} (.pdf) for directives and scoring rubrics.`
                                : `Download official ${doc.shortTitle} (.pdf) for event guide, tracks, and prize breakdown.`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-3 flex flex-col items-center justify-center space-y-3">
                          <div className="w-14 h-14 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                            {isPPT ? (
                              <Presentation className="w-7 h-7 text-[#FFAA00] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            ) : isRulebook ? (
                              <BookOpen className="w-7 h-7 text-[#55FFFF] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            ) : (
                              <FileText className="w-7 h-7 text-[#55FFFF] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="font-mono text-[11px] font-black uppercase px-2.5 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                              [DOCUMENT EMBARGO ACTIVE]
                            </span>
                            <p className="text-xs font-bold text-black/85 max-w-xs mx-auto font-mono">
                              The official {doc.shortTitle} format will be downloadable and embedded here once registrations open.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-2 border-t-2 border-neutral-600 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>FORMAT: {doc.format}</span>
                      </div>

                      {doc.isAvailable && doc.downloadUrl ? (
                        <a
                          href={doc.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-5 py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4 stroke-[2.5px]" />
                          <span>DOWNLOAD {doc.shortTitle}</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="bg-[#707070] text-[#D0D0D0] font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] px-5 py-2.5 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] cursor-not-allowed select-none flex items-center justify-center gap-2"
                        >
                          <Clock className="w-4 h-4 stroke-[2.5px]" />
                          <span>RELEASING SOON</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 4: SUBMISSION & EMBARGO ADVISORY (Minecraft GUI Box) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] p-4 sm:p-6 space-y-4">
            <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-black">
                <div className="w-8 h-8 bg-[#2B2B2B] text-[#FFAA00] flex items-center justify-center border-2 border-black font-mono font-black text-base shadow-[2px_2px_0px_#000]">
                  <AlertTriangle className="w-4 h-4 text-[#FFAA00] stroke-[2.5px]" />
                </div>
                <h3 className="font-mono font-black text-base sm:text-lg uppercase tracking-wider text-black">
                  IMPORTANT SUBMISSION &amp; TEMPLATE ADVISORY
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-black/90 font-mono leading-relaxed max-w-4xl">
                All participating squads are required to strictly adhere to the official presentation deck format and competition guidelines. Please review the official Rule Book and Event Brochure before submitting your project. Submissions made in unapproved custom formats may face scoring penalties during Stage 1 screening.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/guidelines"
                  className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-4 py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>VIEW COMPLETE GUIDELINES</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </Link>
                <Link
                  href="/faqs"
                  className="bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9E9E9E] active:border-b-[#9E9E9E] px-4 py-2.5 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] inline-flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>FREQUENTLY ASKED QUESTIONS</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
  );
}
