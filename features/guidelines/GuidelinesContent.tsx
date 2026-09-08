"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HACKATHON_GUIDELINES_DATA } from "@/data/guidelines";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  FileCheck2,
  ListOrdered,
  CheckCircle2,
  Scale,
} from "lucide-react";

export function GuidelinesContent() {
  const data = HACKATHON_GUIDELINES_DATA;
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10"
      >
        {/* Header Title */}
        <motion.div variants={itemVariants}>
          <SectionTitle
            tag="DIRECTIVES // RULEBOOK"
            title="HACKATHON"
            highlightText="GUIDELINES"
            subtitle="Please read all instructions and regulations thoroughly before participating in the hackathon."
          />
        </motion.div>

        {/* Notice Card */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          transition={{ duration: 0.15 }}
          className="border-4 border-black bg-purple-50 p-5 sm:p-6 shadow-neo border-l-8 border-l-purple-600"
        >
          <p className="text-black font-black text-base sm:text-lg">
            {data.noticeHeader.title}
          </p>
          <p className="text-neutral-700 text-sm sm:text-base font-bold mt-1">
            {data.noticeHeader.subtitle}
          </p>
        </motion.div>

        {/* Section 1: Team Composition and Eligibility */}
        <motion.div
          variants={itemVariants}
          className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6"
        >
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <ShieldCheck className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
              {data.teamComposition.title}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Team Size */}
            <div className="p-4 bg-neo-bg border-3 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-neo-sm">
              <span className="font-mono text-xs sm:text-sm font-black uppercase text-black">
                TEAM SIZE REQUIREMENTS
              </span>
              <span className="font-black text-sm sm:text-base bg-neo-secondary px-3 py-1 border-2 border-black">
                {data.teamComposition.teamSize}
              </span>
            </div>

            {/* Eligibility List */}
            <div className="space-y-2 pt-2">
              <h3 className="font-mono text-xs font-black uppercase text-black/70">
                ELIGIBILITY DIRECTIVES:
              </h3>
              <ul className="space-y-2.5">
                {data.teamComposition.eligibilityList.map((item, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={shouldReduceMotion ? {} : { x: 3 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-black"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3px] shrink-0 mt-0.5" />
                    <span className="font-bold text-sm text-black leading-relaxed">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Warning Callouts */}
            <div className="space-y-3 pt-2">
              {data.teamComposition.callouts.map((callout, idx) => {
                const styles = {
                  note: "bg-amber-50 border-l-8 border-l-amber-500 text-amber-950",
                  important: "bg-rose-50 border-l-8 border-l-rose-500 text-rose-950",
                  danger: "bg-red-50 border-l-8 border-l-red-600 text-red-950",
                }[callout.type];

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 border-2 border-black shadow-neo-sm ${styles}`}
                  >
                    {callout.type === "danger" ? (
                      <AlertOctagon className="w-5 h-5 text-red-600 stroke-[3px] shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[3px] shrink-0 mt-0.5" />
                    )}
                    <div className="text-sm font-bold leading-relaxed">
                      <span className="font-black uppercase tracking-wide mr-1">
                        {callout.title}
                      </span>
                      <span>{callout.content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Section 2: Expected Deliverables and Outcomes */}
        <motion.div
          variants={itemVariants}
          className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6"
        >
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-accent border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <FileCheck2 className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
              {data.expectedDeliverables.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.expectedDeliverables.items.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "8px 8px 0px 0px #000" }}
                transition={{ duration: 0.12 }}
                className="p-4 bg-neo-bg border-3 border-black shadow-neo-sm flex items-start gap-3"
              >
                <div className="w-6 h-6 bg-black text-white font-mono text-xs font-black flex items-center justify-center shrink-0 border border-black">
                  {idx + 1}
                </div>
                <span className="font-bold text-sm text-black leading-snug">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 3: Guidelines and Regulations (Full List) */}
        <motion.div
          variants={itemVariants}
          className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6"
        >
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-muted border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <ListOrdered className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
              {data.regulations.title}
            </h2>
          </div>

          <div className="space-y-3">
            {data.regulations.rules.map((rule, idx) => (
              <motion.div
                key={idx}
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                transition={{ duration: 0.12 }}
                className="flex items-start gap-3.5 p-4 bg-neutral-50 border-2 border-black hover:bg-neo-bg transition-colors"
              >
                <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 shrink-0 border border-black">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="font-bold text-sm text-black leading-relaxed">
                  {rule}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section 4: Disclaimer */}
        <motion.div
          variants={itemVariants}
          className="border-4 border-black bg-amber-50 p-6 sm:p-8 shadow-neo-lg border-l-8 border-l-amber-500 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-amber-800 stroke-[3px]" />
            <h3 className="font-black text-xl uppercase tracking-tight text-amber-950">
              {data.disclaimer.title}
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
            {data.disclaimer.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <MarqueeBanner bg="secondary" speed="normal" bended />
    </div>
  );
}
