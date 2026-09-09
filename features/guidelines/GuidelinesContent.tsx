"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  HACKATHON_GUIDELINES_DATA,
  STRUCTURED_RULES,
  EVALUATION_CRITERIA_MATRIX,
} from "@/data/guidelines";
import { SectionTitle } from "@/components/common/SectionTitle";
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

type FilterTab =
  | "all"
  | "team-eligibility"
  | "deliverables"
  | "fair-play"
  | "jury-eval"
  | "scoring";

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
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 16,
    },
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
    <div className="flex flex-col min-h-screen bg-neo-bg text-black selection:bg-neo-secondary selection:text-black">
      {/* Hero Header */}
      <section className="relative border-b-4 border-black bg-neo-bg pt-12 pb-14 sm:py-16 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Header Title Component */}
          <SectionTitle
            tag="CODEBREAKERS GCEK // RULEBOOK DIRECTIVES"
            title="HACKATHON"
            highlightText="GUIDELINES & REGULATIONS"
            subtitle="Official directives, squad eligibility criteria, deliverable benchmarks, and zero-tolerance compliance standards for HACKVERSE '26."
          />

          {/* Quick Telemetry & Stats Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-2"
          >
            {[
              {
                label: "SQUAD SIZE",
                val: "3 - 6 MEMBERS",
                icon: Users,
                bg: "bg-neo-secondary",
              },
              {
                label: "SPRINT DURATION",
                val: "36 HOURS LIVE",
                icon: Flame,
                bg: "bg-neo-accent",
              },
              { label: "CASH POOL", val: "₹35K+", icon: Award, bg: "bg-white" },
              {
                label: "IP OWNERSHIP",
                val: "100% CREATOR OWNED",
                icon: ShieldCheck,
                bg: "bg-emerald-300",
              },
              {
                label: "EVALUATION",
                val: "5 JUDGING CRITERIA",
                icon: Scale,
                bg: "bg-purple-300",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={clsx(
                  "border-3 border-black p-3.5 shadow-neo-sm flex items-center gap-3 transition-transform hover:-translate-y-0.5",
                  stat.bg,
                )}
              >
                <div className="w-9 h-9 bg-black text-white border-2 border-black flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5 stroke-[2.5px]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-black text-black/60 uppercase leading-none">
                    {stat.label}
                  </div>
                  <div className="font-black text-xs sm:text-sm text-black uppercase tracking-tight mt-1 leading-none">
                    {stat.val}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 flex-1 w-full">
        {/* Section 1: 4 Key Pillars / High-Impact Directives */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black text-white font-mono font-black text-xs flex items-center justify-center border border-black">
                01
              </div>
              <h2 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                CRITICAL DIRECTIVES AT A GLANCE
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-neo-secondary px-3 py-1 border-2 border-black uppercase hidden sm:inline-block shadow-neo-sm">
              MUST-READ CLAUSES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Team Composition */}
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -4, boxShadow: "8px 8px 0px 0px #000" }
              }
              transition={{ duration: 0.15 }}
              className="border-4 border-black bg-white p-5 shadow-neo flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-neo-secondary border-3 border-black shadow-neo-sm flex items-center justify-center">
                  <Users className="w-6 h-6 text-black stroke-[3px]" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                  Squad Composition
                </h3>
                <p className="text-sm font-bold text-black/80 leading-snug">
                  Each squad must comprise{" "}
                  <span className="bg-neo-secondary px-1 font-black">
                    3 to 6 members
                  </span>
                  . Enrolled UG, PG, and Diploma students are eligible.
                  Interdisciplinary roles encouraged.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/15 font-mono text-[11px] font-black uppercase text-black/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                <span>1 Squad Per Participant</span>
              </div>
            </motion.div>

            {/* Card 2: Student Status & Authentic Credentials */}
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -4, boxShadow: "8px 8px 0px 0px #000" }
              }
              transition={{ duration: 0.15 }}
              className="border-4 border-black bg-white p-5 shadow-neo flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-400 border-3 border-black shadow-neo-sm flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-black stroke-[3px]" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                  Verified Enrollment
                </h3>
                <p className="text-sm font-bold text-black/80 leading-snug">
                  All team members must carry valid institutional student ID cards
                  or proof of enrollment for physical check-in and pass verification.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/15 font-mono text-[11px] font-black uppercase text-black/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                <span>Physical ID Required</span>
              </div>
            </motion.div>

            {/* Card 3: Original Deliverables */}
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -4, boxShadow: "8px 8px 0px 0px #000" }
              }
              transition={{ duration: 0.15 }}
              className="border-4 border-black bg-white p-5 shadow-neo flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-neo-accent border-3 border-black shadow-neo-sm flex items-center justify-center">
                  <FileCode2 className="w-6 h-6 text-black stroke-[3px]" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                  MVP & Pitch Deck
                </h3>
                <p className="text-sm font-bold text-black/80 leading-snug">
                  All squads must submit a functional working prototype / MVP,
                  technical architecture documentation, and a compelling pitch
                  deck.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/15 font-mono text-[11px] font-black uppercase text-black/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                <span>100% Creator IP Rights</span>
              </div>
            </motion.div>

            {/* Card 4: Jury Decorum */}
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -4, boxShadow: "8px 8px 0px 0px #000" }
              }
              transition={{ duration: 0.15 }}
              className="border-4 border-black bg-white p-5 shadow-neo flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-400 border-3 border-black shadow-neo-sm flex items-center justify-center">
                  <Scale className="w-6 h-6 text-black stroke-[3px]" />
                </div>
                <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                  Jury Protocol
                </h3>
                <p className="text-sm font-bold text-black/80 leading-snug">
                  Participants must <strong className="font-black">NOT</strong>{" "}
                  contact or message jury members before official results. The
                  jury’s decision is final and binding.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/15 font-mono text-[11px] font-black uppercase text-black/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3px]" />
                <span>Binding Score Matrix</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Interactive Rule Explorer & Search */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black text-white font-mono font-black text-xs flex items-center justify-center border border-black">
                02
              </div>
              <div>
                <h2 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  OFFICIAL RULEBOOK EXPLORER
                </h2>
                <p className="font-mono text-xs font-bold text-black/70 mt-0.5">
                  Explore all 18 official directives or filter by category &
                  keyword
                </p>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rules (e.g. plagiarism, jury)..."
                className="w-full bg-white border-3 border-black px-3.5 py-2 pl-9 font-bold text-sm text-black placeholder:text-black/40 focus:outline-none focus:bg-neo-bg focus:ring-2 focus:ring-black shadow-neo-sm"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none stroke-[2.5px]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] font-black bg-black text-white px-1.5 py-0.5"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all" as const, label: "ALL RULES (18)", icon: Layers },
              {
                id: "team-eligibility" as const,
                label: "TEAM & ELIGIBILITY",
                icon: Users,
              },
              {
                id: "deliverables" as const,
                label: "DELIVERABLES",
                icon: FileCode2,
              },
              {
                id: "fair-play" as const,
                label: "FAIR PLAY & INTEGRITY",
                icon: ShieldCheck,
              },
              {
                id: "jury-eval" as const,
                label: "JURY & PROTOCOL",
                icon: Scale,
              },
              { id: "scoring" as const, label: "SCORE MATRIX", icon: Award },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm shrink-0 flex items-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5",
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-neo-secondary",
                  )}
                >
                  <Icon className="w-4 h-4 stroke-[2.5px]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          {activeTab === "scoring" ? (
            /* Scoring Matrix View */
            <div className="space-y-6 pt-2">
              <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
                  <div>
                    <span className="font-mono text-xs font-black uppercase bg-neo-secondary px-2 py-0.5 border-2 border-black">
                      100-POINT JURY EVALUATION BENCHMARK
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight mt-2">
                      OFFICIAL SCORING WEIGHTAGE MATRIX
                    </h3>
                  </div>
                  <div className="font-mono text-xs font-bold text-black/70">
                    5 Parameters • 100 Total Points
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {EVALUATION_CRITERIA_MATRIX.map((crit, idx) => {
                    const cardBgs = [
                      "bg-neo-secondary",
                      "bg-neo-accent",
                      "bg-emerald-200",
                      "bg-sky-200",
                      "bg-purple-200",
                    ];
                    const bg = cardBgs[idx % cardBgs.length];

                    return (
                      <div
                        key={crit.parameter}
                        className={clsx(
                          "border-4 border-black p-6 shadow-neo flex flex-col justify-between transition-transform hover:-translate-y-1",
                          bg,
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between border-b-3 border-black/30 pb-3 mb-4">
                            <span className="font-mono text-xs font-black uppercase text-black">
                              CRITERION 0{idx + 1}
                            </span>
                            <span className="font-mono text-lg font-black bg-black text-white px-2.5 py-0.5 border border-black shadow-neo-sm flex items-center gap-0.5">
                              {crit.weightage}
                              <Percent className="w-3.5 h-3.5 stroke-[3px]" />
                            </span>
                          </div>

                          <h4 className="font-black text-xl text-black uppercase tracking-tight mb-2 leading-snug">
                            {crit.parameter}
                          </h4>

                          <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed mb-4">
                            {crit.description}
                          </p>

                          {/* Progress Bar representation */}
                          <div className="w-full bg-black/15 h-3 border-2 border-black mb-4 overflow-hidden">
                            <div
                              className="bg-black h-full"
                              style={{ width: `${crit.weightage * 3.5}%` }}
                            />
                          </div>

                          <div className="space-y-2 pt-2 border-t-2 border-black/20">
                            <div className="font-mono text-[10px] font-black uppercase text-black/70">
                              EVALUATION INDICATORS:
                            </div>
                            <ul className="space-y-1.5 text-xs font-bold text-black/90">
                              {crit.scoringFocus.map((focus, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-1.5"
                                >
                                  <span className="text-black font-black">
                                    ✔
                                  </span>
                                  <span>{focus}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 pt-3 border-t-2 border-black/20 font-mono text-[10px] font-black uppercase text-black/70 text-right">
                          MAX WEIGHT: {crit.weightage} PTS
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Rules Grid View */
            <div className="space-y-4">
              {filteredRules.length === 0 ? (
                <div className="border-4 border-black bg-white p-12 text-center shadow-neo space-y-4">
                  <div className="w-14 h-14 bg-neo-bg border-3 border-black mx-auto flex items-center justify-center">
                    <Search className="w-7 h-7 text-black stroke-[3px]" />
                  </div>
                  <h3 className="font-black text-xl text-black uppercase">
                    No Directives Matched "{searchQuery}"
                  </h3>
                  <p className="font-bold text-sm text-black/70 max-w-md mx-auto">
                    Try modifying your search keywords or switch to the "All
                    Rules" tab.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="px-5 py-2 bg-neo-secondary border-3 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none"
                  >
                    RESET FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          "border-4 border-black p-5 sm:p-6 shadow-neo flex flex-col justify-between transition-all duration-150 hover:-translate-y-1 hover:shadow-neo-lg",
                          isDanger
                            ? "bg-rose-50/70 border-l-8 border-l-rose-600"
                            : isWarning
                              ? "bg-amber-50/70 border-l-8 border-l-amber-500"
                              : "bg-white",
                        )}
                      >
                        <div className="space-y-3">
                          {/* Top Meta Header */}
                          <div className="flex items-center justify-between gap-2 border-b-2 border-black/15 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                                RULE #{rule.number}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-black/60 uppercase">
                                {rule.categoryLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={clsx(
                                  "font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-neo-sm",
                                  isDanger
                                    ? "bg-rose-500 text-white"
                                    : isWarning
                                      ? "bg-amber-300 text-black"
                                      : "bg-neo-secondary text-black",
                                )}
                              >
                                {rule.tag}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyRule(
                                    `HACKVERSE '26 Directive #${rule.number}: ${rule.title} - ${rule.description}`,
                                    rule.id,
                                  )
                                }
                                title="Copy rule text"
                                className="p-1 border border-black bg-white hover:bg-neo-secondary text-black transition-colors"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 stroke-[2.5px]" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Rule Title */}
                          <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-snug">
                            {rule.title}
                          </h3>

                          {/* Rule Description */}
                          <p className="text-sm font-bold text-black/85 leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {/* Key Actionable Takeaway Box */}
                        <div className="mt-4 pt-3 border-t-2 border-black/15">
                          <div
                            className={clsx(
                              "p-2.5 border-2 border-black flex items-start gap-2 text-xs font-black uppercase leading-tight",
                              isDanger
                                ? "bg-rose-100 text-rose-950"
                                : isWarning
                                  ? "bg-amber-100 text-amber-950"
                                  : "bg-neo-bg text-black",
                            )}
                          >
                            <Terminal className="w-4 h-4 shrink-0 stroke-[2.5px] mt-0.5" />
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
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black text-white font-mono font-black text-xs flex items-center justify-center border border-black">
                03
              </div>
              <h2 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                MANDATORY DELIVERABLES & OUTCOMES
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-neo-accent px-3 py-1 border-2 border-black uppercase hidden sm:inline-block shadow-neo-sm">
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
                bg: "bg-white",
              },
              {
                num: "02",
                title: "PITCH DECK & ROADMAP",
                desc: "High-impact presentation deck detailing problem scope, solution architecture, market feasibility, and scalability.",
                badge: "MANDATORY",
                icon: Layers,
                bg: "bg-neo-secondary",
              },
              {
                num: "03",
                title: "TECH ARCHITECTURE DOC",
                desc: "Comprehensive technical document covering data flows, API specifications, and deployment topology.",
                badge: "MANDATORY",
                icon: Terminal,
                bg: "bg-white",
              },
              {
                num: "04",
                title: "LIVE DEMO / WALKTHROUGH",
                desc: "Live prototype demonstration during jury evaluation defending edge-cases and technical architecture.",
                badge: "OPTIONAL VIDEO",
                icon: Sparkles,
                bg: "bg-neo-accent",
              },
            ].map((del, idx) => {
              const Icon = del.icon;
              return (
                <div
                  key={idx}
                  className={clsx(
                    "border-4 border-black p-6 shadow-neo flex flex-col justify-between hover:-translate-y-1 transition-all duration-150",
                    del.bg,
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-black">
                        #{del.num}
                      </span>
                      <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5 border border-black">
                        {del.badge}
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm">
                      <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
                    </div>
                    <h3 className="font-black text-lg text-black uppercase tracking-tight">
                      {del.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
                      {del.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Code of Conduct & Zero-Tolerance Protocols */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-4 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black text-white font-mono font-black text-xs flex items-center justify-center border border-black">
                04
              </div>
              <h2 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                ZERO-TOLERANCE COMPLIANCE MATRIX
              </h2>
            </div>
            <span className="font-mono text-xs font-black bg-rose-500 text-white px-3 py-1 border-2 border-black uppercase hidden sm:inline-block shadow-neo-sm">
              INSTANT DISQUALIFICATION TRIGGERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border-4 border-black bg-rose-50 p-6 shadow-neo border-l-8 border-l-rose-600 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-950">
                <AlertOctagon className="w-6 h-6 text-rose-600 stroke-[3px]" />
                <h3 className="font-black text-lg uppercase tracking-tight">
                  Plagiarism &amp; Impersonation
                </h3>
              </div>
              <p className="text-sm font-bold text-rose-950 leading-relaxed">
                Copying pre-existing projects without attribution, presenting
                unauthorized work, or submitting proxy credentials will trigger
                immediate disqualified status.
              </p>
            </div>

            <div className="border-4 border-black bg-rose-50 p-6 shadow-neo border-l-8 border-l-rose-600 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-950">
                <AlertOctagon className="w-6 h-6 text-rose-600 stroke-[3px]" />
                <h3 className="font-black text-lg uppercase tracking-tight">
                  No Jury Lobbying
                </h3>
              </div>
              <p className="text-sm font-bold text-rose-950 leading-relaxed">
                Directly or indirectly contacting jury members via LinkedIn,
                email, or social media prior to official results declaration
                will lead to immediate squad disqualification.
              </p>
            </div>

            <div className="border-4 border-black bg-rose-50 p-6 shadow-neo border-l-8 border-l-rose-600 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-950">
                <AlertOctagon className="w-6 h-6 text-rose-600 stroke-[3px]" />
                <h3 className="font-black text-lg uppercase tracking-tight">
                  Infrastructure Integrity
                </h3>
              </div>
              <p className="text-sm font-bold text-rose-950 leading-relaxed">
                Any penetration testing, API tampering, DDoS attempts, or
                malicious interference against hackathon servers and contestant
                submissions is strictly forbidden.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Official Legal Disclaimer & Institute Seal */}
        <section className="border-4 border-black bg-amber-50 p-6 sm:p-10 shadow-neo-lg border-l-8 border-l-amber-500 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-black/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-400 border-3 border-black flex items-center justify-center shadow-neo-sm">
                <Scale className="w-6 h-6 text-black stroke-[3px]" />
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase text-amber-900">
                  LEGAL DIRECTIVE // INSTITUTIONAL SEAL
                </span>
                <h3 className="font-black text-2xl text-amber-950 uppercase tracking-tight">
                  {HACKATHON_GUIDELINES_DATA.disclaimer.title}
                </h3>
              </div>
            </div>
            <div className="font-mono text-xs font-black bg-black text-white px-3 py-1 border border-black uppercase">
              CODEBREAKERS GCEK APEX AUTHORITY
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
            {HACKATHON_GUIDELINES_DATA.disclaimer.paragraphs.map(
              (para, idx) => (
                <p
                  key={idx}
                  className="bg-amber-100/60 p-4 border-2 border-black"
                >
                  {para}
                </p>
              ),
            )}
          </div>
        </section>

        {/* Section 6: Bottom Action CTA */}
        <section className="border-4 border-black bg-black text-white p-6 sm:p-10 md:p-12 shadow-neo-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs font-black bg-neo-secondary text-black px-3 py-1 border-2 border-white uppercase inline-block">
              READY TO COMPETE?
            </span>
            <h3 className="font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight">
              REGISTER YOUR SQUAD TODAY
            </h3>
            <p className="font-bold text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              Equip your team with an original idea, align with the 36-hour
              sprint format, and compete for ₹35K+ in prizes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto shrink-0">
            <Link
              href="/register"
              className="h-13 sm:h-14 px-6 sm:px-8 bg-neo-accent text-black font-black text-sm sm:text-base uppercase tracking-wider border-4 border-white shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5"
            >
              <span>REGISTER SQUAD NOW</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
            </Link>

            <Link
              href="/problem-statements"
              className="h-13 sm:h-14 px-6 bg-white text-black font-black text-sm sm:text-base uppercase tracking-wider border-4 border-white shadow-neo hover:-translate-y-0.5 transition-all flex items-center justify-center"
            >
              <span>EXPLORE PROBLEMS</span>
            </Link>
          </div>
        </section>
      </div>

      <MarqueeBanner bg="secondary" speed="normal" bended />
    </div>
  );
}
