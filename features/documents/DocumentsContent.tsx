"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { HACKATHON_DOCUMENTS, HackathonDocument } from "@/data/documentsData";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  FileText,
  Presentation,
  Download,
  ExternalLink,
  Lock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck,
  Building2,
  Layers,
  HelpCircle,
} from "lucide-react";
import clsx from "clsx";

type DocumentTab = "all" | "presentation" | "authorization";

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
    <div className="min-h-screen bg-neo-bg text-black">
      {/* Top Banner Marquee */}
      <MarqueeBanner
        items={[
          "OFFICIAL HACKVERSE '26 DOCUMENTS",
          "PRESENTATION PPT TEMPLATE",
          "INSTITUTIONAL AUTHORIZATION NOC",
          "STANDARDIZED EVALUATION FORMAT",
          "CODEBREAKERS GCEK",
        ]}
        bg="secondary"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neo-secondary" />
              <span>OFFICIAL ASSETS &amp; TEMPLATES</span>
            </span>
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-amber-300 text-black border-2 border-black shadow-neo-sm  flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>TEMPLATES COMING SOON</span>
            </span>
          </div>

          <SectionTitle
            title="DOCUMENTS &amp; TEMPLATES"
            subtitle="Download standardized presentation decks, ideation templates, and institutional NOC verification forms for HackVerse '26."
          />
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: TABS & QUICK FILTER */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {[
            { id: "all", label: "ALL DOCUMENTS", count: HACKATHON_DOCUMENTS.length },
            {
              id: "presentation",
              label: "PRESENTATION PPT",
              count: HACKATHON_DOCUMENTS.filter((d) => d.category === "presentation").length,
            },
            {
              id: "authorization",
              label: "AUTHORIZATION LETTER",
              count: HACKATHON_DOCUMENTS.filter((d) => d.category === "authorization").length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as DocumentTab)}
                className={clsx(
                  "px-4 py-2.5 border-3 border-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-black text-white shadow-neo"
                    : "bg-white text-black hover:bg-neo-secondary shadow-neo-sm hover:shadow-neo"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    "font-mono text-[10px] px-1.5 py-0.2 border",
                    isActive ? "bg-neo-secondary text-black border-black" : "bg-neutral-100 text-black border-black"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 3: DOCUMENT CARDS GRID */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredDocs.map((doc) => {
            const isPPT = doc.category === "presentation";

            return (
              <div
                key={doc.id}
                id={doc.id}
                className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                {/* Accent Top Bar */}
                <div
                  className={clsx(
                    "absolute top-0 left-0 right-0 h-3 border-b-3 border-black",
                    isPPT ? "bg-purple-500" : "bg-cyan-500"
                  )}
                />

                <div className="space-y-6 pt-2">
                  {/* Category Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={clsx(
                        "font-mono text-[11px] font-black uppercase px-2.5 py-1 border-2 border-black shadow-neo-xs flex items-center gap-1.5",
                        isPPT ? "bg-purple-200 text-purple-950" : "bg-cyan-200 text-cyan-950"
                      )}
                    >
                      {isPPT ? (
                        <Presentation className="w-3.5 h-3.5 stroke-[2.5px]" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                      )}
                      <span>{doc.badge}</span>
                    </span>

                    {/* Status Badge */}
                    <span
                      className={clsx(
                        "font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-neo-xs flex items-center gap-1",
                        doc.isAvailable ? "bg-emerald-300 text-black" : "bg-amber-300 text-black"
                      )}
                    >
                      {doc.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>AVAILABLE NOW</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>RELEASING SOON</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-black/75 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  {/* Specs Matrix */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-neo-bg border-3 border-black font-mono text-[11px]">
                    {doc.specs.map((spec, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] font-bold text-black/50 uppercase">{spec.label}</span>
                        <span className="font-black text-black truncate">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Instructions / Key Requirements */}
                  <div className="space-y-2.5">
                    <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 text-black">
                      <FileCheck className="w-4 h-4 stroke-[2.5px] text-black" />
                      <span>DOCUMENT REQUIREMENTS &amp; USAGE:</span>
                    </h4>
                    <ul className="space-y-1.5 font-bold text-xs text-black/80">
                      {doc.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-mono font-black text-neo-secondary bg-black text-[9px] px-1 py-0.2 shrink-0 mt-0.5">
                            0{i + 1}
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Document Preview Frame (Embed or Available Download Card or Coming Soon Mockup) */}
                  <div className="border-3 border-black bg-neutral-100 p-4 sm:p-6 text-center space-y-3 relative overflow-hidden shadow-neo-sm">
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
                      <div className="py-6 flex flex-col items-center justify-center space-y-3 bg-cyan-50 border-2 border-black p-4">
                        <div className="w-14 h-14 border-3 border-black bg-cyan-300 flex items-center justify-center shadow-neo-sm">
                          <FileText className="w-7 h-7 stroke-[2.5px] text-black" />
                        </div>
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-black uppercase tracking-wider block text-black">
                            OFFICIAL TEMPLATE FILE READY
                          </span>
                          <span className="font-mono text-[11px] font-bold text-black/70 bg-white border border-black px-2 py-0.5 inline-block">
                            Authorization_Letter_Head_of_Institute.docx
                          </span>
                        </div>
                        <a
                          href={doc.downloadUrl}
                          download="Authorization_Letter_Head_of_Institute.docx"
                          className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer mt-1"
                        >
                          <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>DOWNLOAD TEMPLATE (.DOCX)</span>
                        </a>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center space-y-2.5">
                        <div
                          className={clsx(
                            "w-14 h-14 border-3 border-black flex items-center justify-center shadow-neo-sm",
                            isPPT ? "bg-purple-300" : "bg-cyan-300"
                          )}
                        >
                          {isPPT ? (
                            <Presentation className="w-7 h-7 stroke-[2.5px] text-black" />
                          ) : (
                            <FileText className="w-7 h-7 stroke-[2.5px] text-black" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-black uppercase tracking-wider block text-black">
                            DOCUMENT EMBARGO ACTIVE
                          </span>
                          <p className="text-[11px] font-bold text-black/60 max-w-xs mx-auto">
                            The official {doc.shortTitle} format will be downloadable and embedded here once registrations open.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 border-t-3 border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="font-mono text-[11px] font-black uppercase text-black/70 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>FORMAT: {doc.format}</span>
                  </div>

                  {doc.isAvailable && doc.downloadUrl ? (
                    <a
                      href={doc.downloadUrl}
                      download="Authorization_Letter_Head_of_Institute.docx"
                      className="px-5 py-2.5 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-neo transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5px]" />
                      <span>DOWNLOAD {doc.shortTitle}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 bg-neutral-200 text-black/60 font-black text-xs uppercase tracking-wider border-3 border-black cursor-not-allowed flex items-center justify-center gap-2 shadow-neo-xs select-none"
                    >
                      <Clock className="w-4 h-4 stroke-[2.5px]" />
                      <span>RELEASING SOON</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 4: SUBMISSION & EMBARGO ADVISORY */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="border-4 border-black bg-amber-100 p-6 sm:p-8 shadow-neo space-y-4">
            <div className="flex items-center gap-2.5 text-amber-950">
              <AlertCircle className="w-6 h-6 stroke-[2.5px] shrink-0" />
              <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight">
                IMPORTANT SUBMISSION &amp; TEMPLATE ADVISORY
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-950/85 leading-relaxed max-w-4xl">
              All participating squads are required to strictly adhere to the official presentation deck format. Submissions made in unapproved custom formats may face scoring penalties during Stage 1 screening. The Authorization Letter (NOC) must carry the official seal of your institution to be valid for final entry passes.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/guidelines"
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all inline-flex items-center gap-1.5"
              >
                <span>VIEW COMPLETE GUIDELINES</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
              </Link>
              <Link
                href="/faqs"
                className="px-4 py-2 bg-white text-black hover:bg-neo-secondary font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 stroke-[2.5px]" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
