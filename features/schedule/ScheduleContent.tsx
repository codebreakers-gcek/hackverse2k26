"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SCHEDULE_DATA } from "@/data/schedule";
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
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-black">
      {/* Fixed Minecraft Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/schedulebg.png"
          alt="Hackverse Schedule Background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving 100% full image clarity */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 min-w-0"
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full flex justify-center">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl">
            <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
              ★ TIMELINE // MILESTONES ★
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              EVENT{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                SCHEDULE
              </span>
            </h1>

            <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000]">
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                {data.subtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* META INFO BADGE BAR (Minecraft Stone GUI Slab) */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemVariants}
          className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {/* Calendar Dark Inset Slot */}
            <div className="w-10 h-10 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
              <Calendar className="w-5 h-5 text-[#FFAA00] stroke-[2.5px]" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-[#333333] block">
                FINALE TIMEFRAME
              </span>
              <span className="font-mono font-black text-sm sm:text-base text-black">
                {data.metaInfo.dates}
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-0.5 h-10 bg-[#8B8B8B]" />

          <div className="flex items-center gap-3">
            {/* MapPin Dark Inset Slot */}
            <div className="w-10 h-10 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
              <MapPin className="w-5 h-5 text-[#55FF55] stroke-[2.5px]" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-[#333333] block">
                VENUE LOCATION
              </span>
              <span className="font-mono font-black text-sm sm:text-base text-black">
                {data.metaInfo.venue}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PHASE TIMELINE CARDS */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          {data.phases.map((phase, idx) => {
            const isCompleted = phase.status === "completed";
            const isOngoing = phase.status === "ongoing";

            const statusBadge = isCompleted ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#707070] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                COMPLETED
              </span>
            ) : isOngoing ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#5B8731] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] flex items-center gap-1.5 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                <span className="w-2 h-2 bg-[#55FFFF] inline-block animate-pulse" />
                ONGOING PHASE
              </span>
            ) : (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000]">
                UPCOMING
              </span>
            );

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative hover:translate-y-[-2px] transition-all"
              >
                {/* Left Phase Column */}
                <div className="md:w-56 shrink-0 flex md:flex-col items-center md:items-start justify-between border-b-2 md:border-b-0 md:border-r-2 border-[#8B8B8B] pb-4 md:pb-0 md:pr-6 gap-3">
                  <div>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-[#757575] [text-shadow:_1px_1px_0_#FFF]">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-xs font-black uppercase bg-black text-[#55FFFF] px-2 py-0.5 mt-1 border border-[#55FFFF] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
                      {phase.phase}
                    </span>
                  </div>
                  <div>{statusBadge}</div>
                </div>

                {/* Right Content Column */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8B8B8B] pb-3">
                    <h3 className="font-mono font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                      {phase.title}
                    </h3>
                    {/* Timeframe Inset Slot */}
                    <span className="font-mono text-xs sm:text-sm font-black bg-[#8B8B8B] text-white px-3 py-1 border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] [text-shadow:_1px_1px_0_#000] inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-[#55FFFF]" />
                      {phase.displayDates}
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2 pt-1">
                    {phase.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2.5 p-1.5 bg-[#8B8B8B]/40 border border-[#8B8B8B] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 stroke-[2.5px] shrink-0 mt-0.5 ${
                            isCompleted
                              ? "text-[#555555]"
                              : isOngoing
                                ? "text-[#2E7D32]"
                                : "text-[#D97706]"
                          }`}
                        />
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#111111] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Progress Indicator (Minecraft EXP Bar Style) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between font-mono text-[11px] font-black text-[#2A2A2A] mb-1">
                      <span>PHASE PROGRESS</span>
                      <span className="text-[#2E7D32] font-black">{phase.progressPercentage}%</span>
                    </div>
                    {/* Dark Inset EXP Bar Track */}
                    <div className="w-full h-3.5 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)] p-0.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.progressPercentage}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.2 + idx * 0.1,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                        className={`h-full border border-black ${
                          isCompleted
                            ? "bg-[#707070]"
                            : isOngoing
                              ? "bg-[#55FF55] shadow-[0_0_6px_#55FF55]"
                              : "bg-[#FFAA00]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CTA CARD (Obsidian Block) */}
        {/* ========================================================================= */}
        <motion.div
          variants={itemVariants}
          className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 sm:p-10 shadow-[8px_8px_0px_#000] text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs font-black uppercase px-3 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
            <Flame className="w-4 h-4 text-[#FFAA00]" />
            COMPETITION ROADMAP
          </div>

          <h3 className="font-mono font-black text-2xl sm:text-4xl text-white uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
            READY TO START YOUR JOURNEY?
          </h3>

          <p className="font-mono font-bold text-xs sm:text-sm text-[#CCCCCC] max-w-xl mx-auto leading-relaxed">
            Join hundreds of collegiate innovators in this epic 24-hour coding adventure. Register your squad before the portal deadline!
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] active:translate-y-1 transition-all"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Banner */}
      <div className="relative z-10">
        <MarqueeBanner bg="secondary" speed="normal" bended />
      </div>
    </div>
  );
}
