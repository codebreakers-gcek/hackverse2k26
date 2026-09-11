"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SCHEDULE_DATA, calculatePhaseProgress } from "@/data/schedule";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
} from "lucide-react";

export function ScheduleContent() {
  const data = SCHEDULE_DATA;
  const shouldReduceMotion = useReducedMotion();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    setCurrentDate(new Date());
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
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
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10"
      >
        {/* Header Title */}
        <motion.div variants={itemVariants}>
          <SectionTitle
            tag="TIMELINE // MILESTONES"
            title="EVENT"
            highlightText="SCHEDULE"
            subtitle={data.subtitle}
          />
        </motion.div>

        {/* Highlight Meta Badge Bar */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          transition={{ duration: 0.15 }}
          className="border-4 border-black bg-white p-4 sm:p-5 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <Calendar className="w-5 h-5 text-black stroke-[3px]" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-black uppercase text-black/60 block">
                FINALE TIMEFRAME
              </span>
              <span className="font-black text-sm sm:text-base text-black">
                {data.metaInfo.dates}
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-0.5 h-10 bg-black/20" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-accent border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <MapPin className="w-5 h-5 text-black stroke-[3px]" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-black uppercase text-black/60 block">
                VENUE LOCATION
              </span>
              <span className="font-black text-sm sm:text-base text-black">
                {data.metaInfo.venue}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Phase Timeline Cards */}
        <div className="space-y-6">
          {data.phases.map((phase, idx) => {
            const dynamicProgress = calculatePhaseProgress(
              phase.startDate,
              phase.endDate,
              currentDate
            );
            const status = dynamicProgress.status;
            const progressPercentage = dynamicProgress.progressPercentage;

            const isCompleted = status === "completed";
            const isOngoing = status === "ongoing";

            const statusBadge = isCompleted ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neutral-200 text-black border-2 border-black">
                COMPLETED
              </span>
            ) : isOngoing ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-emerald-400 text-black border-2 border-black flex items-center gap-1.5 shadow-neo-sm">
                <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse" />
                ONGOING PHASE
              </span>
            ) : (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-secondary text-black border-2 border-black">
                UPCOMING
              </span>
            );

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "8px 8px 0px 0px #000" }}
                transition={{ duration: 0.15 }}
                className="border-4 border-black bg-white shadow-neo p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative"
              >
                {/* Left Phase Column */}
                <div className="md:w-56 shrink-0 flex md:flex-col items-center md:items-start justify-between border-b-2 md:border-b-0 md:border-r-2 border-black pb-4 md:pb-0 md:pr-6 gap-3">
                  <div>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-black/20">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 mt-1 inline-block">
                      {phase.phase}
                    </span>
                  </div>
                  <div>{statusBadge}</div>
                </div>

                {/* Right Content Column */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/20 pb-3">
                    <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                      {phase.title}
                    </h3>
                    <span className="font-mono text-xs sm:text-sm font-black bg-neo-bg px-3 py-1 border-2 border-black inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      {phase.displayDates}
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 pt-1">
                    {phase.items.map((item, itemIdx) => (
                      <motion.li
                        key={itemIdx}
                        whileHover={shouldReduceMotion ? {} : { x: 3 }}
                        transition={{ duration: 0.12 }}
                        className="flex items-start gap-2.5 p-1 rounded-none hover:bg-black/5 transition-colors"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 stroke-[3px] shrink-0 mt-0.5 ${
                            isCompleted
                              ? "text-neutral-400"
                              : isOngoing
                                ? "text-emerald-600"
                                : "text-purple-600"
                          }`}
                        />
                        <span className="font-bold text-xs sm:text-sm text-black leading-relaxed">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Progress Indicator */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between font-mono text-[11px] font-black text-black/70 mb-1">
                      <span className="flex items-center gap-1.5">
                        PHASE PROGRESS
                        {isOngoing && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 border border-emerald-400 font-mono">
                            LIVE
                          </span>
                        )}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 border-2 border-black bg-neutral-100 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + idx * 0.1,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                        className={`h-full ${
                          progressPercentage > 0 ? "border-r-2 border-black" : ""
                        } ${
                          isCompleted
                            ? "bg-neutral-400"
                            : isOngoing
                              ? "bg-emerald-400"
                              : "bg-neo-secondary"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { y: -2 }}
          transition={{ duration: 0.15 }}
          className="border-4 border-black bg-neo-secondary p-6 sm:p-10 shadow-neo text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm">
            <Flame className="w-4 h-4 text-neo-accent" />
            COMPETITION ROADMAP
          </div>

          <h3 className="font-black text-xl xs:text-2xl sm:text-4xl text-black uppercase tracking-tight">
            READY TO START YOUR JOURNEY?
          </h3>

          <p className="font-bold text-xs sm:text-base text-black/85 max-w-xl mx-auto leading-relaxed">
            Join hundreds of collegiate innovators in this epic 24-hour coding adventure. Register your squad before the portal deadline!
          </p>

          <div className="pt-2">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="inline-block w-full sm:w-auto"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-900 transition-all"
              >
                <span>REGISTER NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <MarqueeBanner bg="secondary" speed="normal" bended />
    </div>
  );
}
