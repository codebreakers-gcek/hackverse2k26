"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  HACKATHON_GUIDELINES_DATA,
  STRUCTURED_RULES,
  EVALUATION_CRITERIA_MATRIX,
} from "@/data/guidelines";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Users,
  FileCode2,
  Sparkles,
  Search,
  Award,
  ArrowRight,
  Filter,
  Copy,
  Check,
  Flame,
  Layers,
  Lock,
  Percent,
  Terminal,
} from "lucide-react";
import clsx from "clsx";

type FilterTab = "all" | "team-eligibility" | "deliverables" | "fair-play" | "jury-eval" | "scoring";

export function GuidelinesContent() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.03,
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
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // Filtered rules based on active tab and search query
  const filteredRules = useMemo(() => {
    return STRUCTURED_RULES.filter((rule) => {
      const matchesTab = activeTab === "all" || rule.category === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.title.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q) ||
        rule.categoryLabel.toLowerCase().includes(q) ||
        rule.tag.toLowerCase().includes(q) ||
        rule.keyTakeaway.toLowerCase().includes(q) ||
        rule.number.includes(q);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleCopyRule = (ruleText: string, ruleId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(ruleText);
      setCopiedRuleId(ruleId);
      setTimeout(() => setCopiedRuleId(null), 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-black overflow-hidden flex flex-col selection:bg-[#FFAA00] selection:text-black">
      {/* Minecraft Guidelines Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/guidelinesbg.webp"
          alt="HackVerse Guidelines Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving 100% full image clarity */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Banner Marquee */}
        <MarqueeBanner
          items={[
            "HACKVERSE '26 DIRECTIVES",
            "3-6 SQUAD SIZE",
            "BLIND JURY EVALUATION",
            "100% CREATOR IP OWNERSHIP",
            "ZERO-TOLERANCE PLAGIARISM",
          ]}
          bg="secondary"
        />

        {/* Hero Header */}
        <section className="relative pt-8 pb-10 sm:py-14 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Minecraft Themed Header Title */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
                ★ CODEBREAKERS GCEK // RULEBOOK DIRECTIVES ★
              </span>

              <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
                HACKATHON{" "}
                <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                  GUIDELINES
                </span>
              </h1>

              <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-3xl">
                <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                  Official directives, squad eligibility criteria, deliverable benchmarks, and zero-tolerance compliance standards for HACKVERSE &apos;26.
                </p>
              </div>
            </div>

            {/* Quick Telemetry & Stats Bar (Minecraft Inventory Slots) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2"
            >
              {[
                { label: "SQUAD SIZE", val: "3 - 6 MEMBERS", icon: Users, accent: "text-[#55FFFF]" },
                { label: "SPRINT DURATION", val: "24 HOURS LIVE", icon: Flame, accent: "text-[#FFAA00]" },
                { label: "CASH POOL", val: "₹35K+", icon: Award, accent: "text-[#55FF55]" },
                { label: "IP OWNERSHIP", val: "100% CREATOR", icon: ShieldCheck, accent: "text-[#55FFFF]" },
                { label: "EVALUATION", val: "5 CRITERIA", icon: Scale, accent: "text-[#FFAA00]" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-2.5 sm:p-3 shadow-[4px_4px_0px_#000] flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2B2B2B] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <stat.icon className={clsx("w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]", stat.accent)} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] sm:text-[10px] font-black text-black/70 uppercase leading-none truncate">
                      {stat.label}
                    </div>
                    <div className="font-mono font-black text-xs sm:text-sm text-black uppercase tracking-tight mt-1 leading-none truncate">
                      {stat.val}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 flex-1 w-full">
        {/* Section 1: 4 Key Pillars / High-Impact Directives */}
        <section className="space-y-5">
          {/* Header Bar */}
          <div className="bg-[#5B8731] border-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                ⚔
              </div>
              <h2 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                01 // CRITICAL DIRECTIVES AT A GLANCE
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-black text-[#FFAA00] px-3 py-1 border-2 border-[#FFAA00] uppercase shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              MUST-READ CLAUSES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Team Composition */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[3px_3px_0px_#000] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#55FFFF] stroke-[2.5px]" />
                </div>
                <h3 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-wide">
                  Squad Composition
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/85 font-mono leading-relaxed">
                  Each squad must comprise <span className="bg-black text-[#FFAA00] px-1 font-black">3 to 6 members</span>. Enrolled UG, PG, and Diploma students are eligible. Interdisciplinary roles encouraged.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-neutral-600 font-mono text-[11px] font-black uppercase text-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2C6B2C] stroke-[3px]" />
                <span>1 Squad Per Participant</span>
              </div>
            </motion.div>

            {/* Card 2: Original Deliverables */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[3px_3px_0px_#000] flex items-center justify-center">
                  <FileCode2 className="w-6 h-6 text-[#FFAA00] stroke-[2.5px]" />
                </div>
                <h3 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-wide">
                  MVP &amp; Pitch Deck
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/85 font-mono leading-relaxed">
                  All squads must submit a functional working prototype / MVP, technical architecture documentation, and a compelling pitch deck.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-neutral-600 font-mono text-[11px] font-black uppercase text-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2C6B2C] stroke-[3px]" />
                <span>100% Creator IP Rights</span>
              </div>
            </motion.div>

            {/* Card 3: Jury Decorum */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[3px_3px_0px_#000] flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#55FF55] stroke-[2.5px]" />
                </div>
                <h3 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-wide">
                  Jury Protocol
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/85 font-mono leading-relaxed">
                  Participants must <strong className="font-black">NOT</strong> contact or message jury members before official results. The jury’s decision is final.
                </p>
              </div>
              <div className="pt-3 border-t-2 border-neutral-600 font-mono text-[11px] font-black uppercase text-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2C6B2C] stroke-[3px]" />
                <span>Binding Score Matrix</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Interactive Rule Explorer & Search */}
        <section className="space-y-5">
          {/* Header Bar */}
          <div className="bg-[#5B8731] border-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                02
              </div>
              <div>
                <h2 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                  OFFICIAL RULEBOOK EXPLORER // 18 DIRECTIVES
                </h2>
              </div>
            </div>

            {/* Live Search Input (Minecraft Inset Field) */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rules (e.g. plagiarism)..."
                className="w-full bg-[#2B2B2B] border-3 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] px-3.5 py-1.5 pl-8 font-mono font-bold text-xs text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#55FFFF]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none stroke-[2.5px]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] font-black bg-black text-[#FFAA00] px-1 py-0.5 border border-[#FFAA00]"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs Bar (Minecraft 3D Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all" as const, label: "ALL RULES (18)", icon: Layers },
              { id: "team-eligibility" as const, label: "TEAM & ELIGIBILITY", icon: Users },
              { id: "deliverables" as const, label: "DELIVERABLES", icon: FileCode2 },
              { id: "fair-play" as const, label: "FAIR PLAY & INTEGRITY", icon: ShieldCheck },
              { id: "jury-eval" as const, label: "JURY & PROTOCOL", icon: Scale },
              { id: "scoring" as const, label: "SCORE MATRIX", icon: Award },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "font-mono font-black text-xs uppercase tracking-wider px-3.5 py-2 border-4 transition-all cursor-pointer flex items-center gap-2 shrink-0",
                    isActive
                      ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000]"
                      : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          {activeTab === "scoring" ? (
            /* Scoring Matrix View (Minecraft GUI) */
            <div className="space-y-6 pt-2">
              <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-7 shadow-[6px_6px_0px_#000]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-neutral-600 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-xs font-black uppercase bg-black text-[#55FF55] px-2.5 py-1 border-2 border-[#55FF55] shadow-[2px_2px_0px_#000]">
                      100-POINT JURY EVALUATION BENCHMARK
                    </span>
                    <h3 className="font-mono font-black text-xl sm:text-2xl text-black uppercase tracking-wide mt-2">
                      OFFICIAL SCORING WEIGHTAGE MATRIX
                    </h3>
                  </div>
                  <div className="font-mono text-xs font-black text-black/80 bg-[#A0A0A0]/70 px-3 py-1 border border-[#606060]">
                    5 Parameters • 100 Total Points
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {EVALUATION_CRITERIA_MATRIX.map((crit, idx) => (
                    <div
                      key={crit.parameter}
                      className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-2.5 mb-3">
                          <span className="font-mono text-xs font-black uppercase text-black">
                            CRITERION 0{idx + 1}
                          </span>
                          <span className="font-mono text-sm font-black bg-black text-[#55FFFF] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000] flex items-center gap-0.5">
                            {crit.weightage}
                            <Percent className="w-3 h-3 stroke-[3px]" />
                          </span>
                        </div>

                        <h4 className="font-mono font-black text-base text-black uppercase tracking-wide mb-2 leading-snug">
                          {crit.parameter}
                        </h4>

                        <p className="text-xs font-bold text-black/85 font-mono leading-relaxed mb-3">
                          {crit.description}
                        </p>

                        {/* Minecraft XP / Stamina Bar */}
                        <div className="w-full bg-[#2B2B2B] h-3 border-2 border-black mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                          <div
                            className="bg-[#55FF55] h-full"
                            style={{ width: `${crit.weightage * 3.5}%` }}
                          />
                        </div>

                        <div className="space-y-1.5 pt-2 border-t-2 border-neutral-700">
                          <div className="font-mono text-[10px] font-black uppercase text-black/70">
                            EVALUATION INDICATORS:
                          </div>
                          <ul className="space-y-1 text-xs font-mono font-bold text-black/90">
                            {crit.scoringFocus.map((focus, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5">
                                <span className="text-[#2C6B2C] font-black">✔</span>
                                <span>{focus}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t-2 border-neutral-700 font-mono text-[10px] font-black uppercase text-black/70 text-right">
                        MAX WEIGHT: {crit.weightage} PTS
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Rules Grid View */
            <div className="space-y-4">
              {filteredRules.length === 0 ? (
                <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-10 text-center shadow-[6px_6px_0px_#000] space-y-3">
                  <div className="w-12 h-12 bg-[#2B2B2B] border-3 border-black mx-auto flex items-center justify-center text-[#FFAA00]">
                    <Search className="w-6 h-6 stroke-[3px]" />
                  </div>
                  <h3 className="font-mono font-black text-lg text-black uppercase">
                    No Directives Matched &quot;{searchQuery}&quot;
                  </h3>
                  <p className="font-mono font-bold text-xs text-black/70 max-w-md mx-auto">
                    Try modifying your search keywords or switch to the &quot;All Rules&quot; tab.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase px-5 py-2 border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000]"
                  >
                    RESET FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredRules.map((rule) => {
                    const isDanger = rule.severity === "danger";
                    const isWarning = rule.severity === "warning";
                    const isCopied = copiedRuleId === rule.id;

                    return (
                      <motion.div
                        key={rule.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className={clsx(
                          "bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4",
                          isDanger && "border-l-8 border-l-[#FF5555]",
                          isWarning && "border-l-8 border-l-[#FFAA00]"
                        )}
                      >
                        <div className="space-y-3">
                          {/* Top Meta Header */}
                          <div className="flex items-center justify-between gap-2 border-b-2 border-neutral-600 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black bg-black text-[#55FFFF] px-2 py-0.5 border border-black">
                                RULE #{rule.number}
                              </span>
                              <span className="font-mono text-[10px] font-black text-black/70 uppercase">
                                {rule.categoryLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={clsx(
                                  "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black",
                                  isDanger
                                    ? "bg-black text-[#FF5555]"
                                    : isWarning
                                    ? "bg-black text-[#FFAA00]"
                                    : "bg-black text-[#55FF55]"
                                )}
                              >
                                {rule.tag}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyRule(
                                    `HACKVERSE '26 Directive #${rule.number}: ${rule.title} - ${rule.description}`,
                                    rule.id
                                  )
                                }
                                title="Copy rule text"
                                className="p-1 border border-black bg-[#8B8B8B] hover:bg-[#A0A0A0] text-black transition-colors"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-[#2C6B2C] stroke-[3px]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 stroke-[2.5px]" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Rule Title */}
                          <h3 className="font-mono font-black text-base sm:text-lg text-black uppercase tracking-wide leading-snug">
                            {rule.title}
                          </h3>

                          {/* Rule Description */}
                          <p className="text-xs sm:text-sm font-bold text-black/85 font-mono leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {/* Key Actionable Takeaway Box (Minecraft Inset Slot) */}
                        <div className="pt-2">
                          <div className="bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-2.5 flex items-start gap-2 text-xs font-mono font-black uppercase text-black">
                            <Terminal className="w-3.5 h-3.5 shrink-0 stroke-[2.5px] mt-0.5 text-black" />
                            <span>{rule.keyTakeaway}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 3: Expected Deliverables Blueprint */}
        <section className="space-y-5">
          {/* Header Bar */}
          <div className="bg-[#5B8731] border-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex items-center justify-between text-white shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                03
              </div>
              <h2 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                MANDATORY DELIVERABLES &amp; OUTCOMES
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-black text-[#FFAA00] px-3 py-1 border-2 border-[#FFAA00] uppercase shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              SUBMISSION BENCHMARK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                title: "WORKING MVP / PROTOTYPE",
                desc: "A fully functioning Minimum Viable Product demonstrating core algorithmic logic, features, and UI.",
                badge: "CRITICAL",
                icon: FileCode2,
                color: "text-[#55FFFF]",
              },
              {
                num: "02",
                title: "PITCH DECK & ROADMAP",
                desc: "High-impact presentation deck detailing problem scope, solution architecture, market feasibility, and scalability.",
                badge: "MANDATORY",
                icon: Layers,
                color: "text-[#FFAA00]",
              },
              {
                num: "03",
                title: "TECH ARCHITECTURE DOC",
                desc: "Comprehensive technical document covering data flows, API specifications, and deployment topology.",
                badge: "MANDATORY",
                icon: Terminal,
                color: "text-[#55FF55]",
              },
              {
                num: "04",
                title: "LIVE DEMO / WALKTHROUGH",
                desc: "Live prototype demonstration during jury evaluation defending edge-cases and technical architecture.",
                badge: "OPTIONAL VIDEO",
                icon: Sparkles,
                color: "text-[#FF5555]",
              },
            ].map((del, idx) => {
              const Icon = del.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-black text-black">
                        #{del.num}
                      </span>
                      <span className="font-mono text-[10px] font-black bg-black text-[#55FFFF] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                        {del.badge}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center justify-center shadow-[3px_3px_0px_#000]">
                      <Icon className={clsx("w-6 h-6 stroke-[2.5px]", del.color)} />
                    </div>
                    <h3 className="font-mono font-black text-base text-black uppercase tracking-wide">
                      {del.title}
                    </h3>
                    <p className="text-xs font-bold text-black/85 font-mono leading-relaxed">
                      {del.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Code of Conduct & Zero-Tolerance Protocols */}
        <section className="space-y-5">
          {/* Header Bar */}
          <div className="bg-[#8B2020] border-4 border-black border-t-2 border-t-[#D64545] px-4 sm:px-6 py-3 flex items-center justify-between text-white shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B1B1B] text-[#FF5555] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                04
              </div>
              <h2 className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                ZERO-TOLERANCE COMPLIANCE MATRIX
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-black text-[#FF5555] px-3 py-1 border-2 border-[#FF5555] uppercase shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              INSTANT DISQUALIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#8B3A3A] border-4 border-t-[#C26B6B] border-l-[#C26B6B] border-r-[#4A1515] border-b-[#4A1515] p-5 shadow-[6px_6px_0px_#000] text-white space-y-3">
              <div className="flex items-center gap-2.5 text-[#FFEAEA]">
                <div className="w-7 h-7 bg-[#2B1B1B] border-2 border-[#FF5555] flex items-center justify-center text-[#FF5555] font-mono font-black text-xs">
                  ⛔
                </div>
                <h3 className="font-mono font-black text-base uppercase tracking-wide text-white [text-shadow:_1px_1px_0_#000]">
                  Plagiarism &amp; Pre-built Code
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#FFEAEA] font-mono leading-relaxed">
                Plagiarism, submitting pre-built commercial software, or presenting someone else&apos;s codebase as your own will lead to immediate squad disqualification.
              </p>
            </div>

            <div className="bg-[#8B3A3A] border-4 border-t-[#C26B6B] border-l-[#C26B6B] border-r-[#4A1515] border-b-[#4A1515] p-5 shadow-[6px_6px_0px_#000] text-white space-y-3">
              <div className="flex items-center gap-2.5 text-[#FFEAEA]">
                <div className="w-7 h-7 bg-[#2B1B1B] border-2 border-[#FF5555] flex items-center justify-center text-[#FF5555] font-mono font-black text-xs">
                  ⛔
                </div>
                <h3 className="font-mono font-black text-base uppercase tracking-wide text-white [text-shadow:_1px_1px_0_#000]">
                  No Jury Lobbying
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#FFEAEA] font-mono leading-relaxed">
                Directly or indirectly contacting jury members via LinkedIn, email, or social media prior to official results declaration will lead to immediate squad disqualification.
              </p>
            </div>

            <div className="bg-[#8B3A3A] border-4 border-t-[#C26B6B] border-l-[#C26B6B] border-r-[#4A1515] border-b-[#4A1515] p-5 shadow-[6px_6px_0px_#000] text-white space-y-3">
              <div className="flex items-center gap-2.5 text-[#FFEAEA]">
                <div className="w-7 h-7 bg-[#2B1B1B] border-2 border-[#FF5555] flex items-center justify-center text-[#FF5555] font-mono font-black text-xs">
                  ⛔
                </div>
                <h3 className="font-mono font-black text-base uppercase tracking-wide text-white [text-shadow:_1px_1px_0_#000]">
                  Infrastructure Integrity
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#FFEAEA] font-mono leading-relaxed">
                Any penetration testing, API tampering, DDoS attempts, or malicious interference against hackathon servers and contestant submissions is strictly forbidden.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Official Legal Disclaimer & Institute Seal */}
        <section className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-7 shadow-[6px_6px_0px_#000] space-y-5">
          <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2B2B2B] border-2 border-black flex items-center justify-center text-[#FFAA00] shadow-[2px_2px_0px_#000]">
                  <Scale className="w-5 h-5 stroke-[2.5px]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-black uppercase text-black/70">
                    LEGAL DIRECTIVE // INSTITUTIONAL SEAL
                  </span>
                  <h3 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-wide">
                    {HACKATHON_GUIDELINES_DATA.disclaimer.title}
                  </h3>
                </div>
              </div>
              <div className="font-mono text-xs font-black bg-black text-[#55FF55] px-3 py-1 border border-black uppercase shadow-[2px_2px_0px_#000]">
                CODEBREAKERS GCEK APEX AUTHORITY
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-mono font-bold text-black/90 leading-relaxed">
              {HACKATHON_GUIDELINES_DATA.disclaimer.paragraphs.map((para, idx) => (
                <p key={idx} className="bg-[#A0A0A0]/60 p-3.5 border border-[#606060]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Bottom Action CTA */}
        <section className="bg-[#1B1B1B]/95 backdrop-blur-sm border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 sm:p-10 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 text-white">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs font-black bg-black text-[#55FF55] px-3 py-1 border-2 border-[#55FF55] uppercase inline-block shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              READY TO COMPETE?
            </span>
            <h3 className="font-mono font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
              REGISTER YOUR SQUAD TODAY
            </h3>
            <p className="font-mono font-bold text-xs sm:text-sm text-[#CCCCCC] max-w-xl leading-relaxed">
              Equip your team with an original idea, align with the 24-hour sprint format, and compete for ₹35,000+ in cash prizes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto shrink-0">
            <Link
              href="/register"
              className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-6 sm:px-8 py-3.5 shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] transition-colors flex items-center justify-center gap-2"
            >
              <span>REGISTER SQUAD NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>

            <Link
              href="/problem-statements"
              className="bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-sm uppercase tracking-wider border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9E9E9E] active:border-b-[#9E9E9E] px-6 py-3.5 shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] transition-colors flex items-center justify-center"
            >
              <span>EXPLORE PROBLEMS</span>
            </Link>
          </div>
        </section>
      </div>

      <MarqueeBanner bg="secondary" speed="normal" bended />
    </div>
  </div>
  );
}
