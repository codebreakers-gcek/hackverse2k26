"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Sparkles, Terminal, Award } from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { CountdownTimer } from "./CountdownTimer";
import { AnimeCharacters } from "./AnimeCharacters";

export function HeroSection() {
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
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 14 },
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
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b-4 border-black bg-grid-paper">
      {/* Anime Characters: Gojo (Left) & Sukuna (Right). Remove/comment this line anytime if not needed */}
      <AnimeCharacters />

      {/* Decorative Floating Stickers */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -10, rotate: -4 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-6 left-4 sm:left-12 hidden lg:block select-none pointer-events-none"
      >
        <div className="bg-neo-accent text-black font-black text-xs uppercase px-3 py-1.5 border-3 border-black shadow-neo-sm">
          ★ FLAGSHIP 36H HACKATHON
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -10, rotate: 3 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="absolute top-10 right-4 sm:right-12 hidden lg:block select-none pointer-events-none"
      >
        <div className="bg-neo-secondary text-black font-black text-xs uppercase px-3 py-1.5 border-3 border-black shadow-neo-sm">
          🏆 ₹35K+ CASH POOL
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        {/* Top Identification Badge */}
        <motion.div variants={itemVariants} className="w-full flex items-center justify-center mb-6">
          <div className="inline-flex items-center justify-center">
            <span className="inline-flex items-center gap-3 font-mono text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-2 bg-black text-white border-2 border-black shadow-neo-sm">
              <div className="w-6 h-6 sm:w-7 sm:h-7 p-0.5 flex items-center justify-center shrink-0">
                <Image
                  src="/cblogo.png"
                  alt="CodeBreakers GCEK Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="flex items-center gap-2">
                <span>ORGANISED BY CODEBREAKERS GCEK</span>
              </span>
            </span>
          </div>
        </motion.div>

        {/* Massive Headline */}
        <motion.div variants={itemVariants} className="relative inline-block mb-4 max-w-full">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-black uppercase leading-none break-words">
            <span className="font-thuast tracking-wider">HACKVERSE</span>{" "}
            <span className="font-thuast tracking-tighter text-neo-accent">&apos;26</span>
          </h1>
        </motion.div>

        {/* Tagline sticker */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto my-3 sm:my-4 px-2">
          <div className="inline-block bg-neo-muted border-3 border-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-neo -rotate-1 max-w-full">
            <p className="font-black text-sm xs:text-base sm:text-xl md:text-2xl text-black uppercase tracking-tight break-words">
              &ldquo;{EVENT_DATA.tagline}&rdquo;
            </p>
          </div>
          <div className="mt-2 font-mono text-xs sm:text-base md:text-lg font-black tracking-[0.15em] sm:tracking-[0.25em] text-black/80 uppercase">
            {EVENT_DATA.edition}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-bold text-black/80 leading-relaxed mt-3 sm:mt-4 mb-5 sm:mb-6 px-2"
        >
          {EVENT_DATA.shortDescription}
        </motion.p>

        {/* Event Date & Location Chips */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 my-5 sm:my-6 px-2"
        >
          <div className="inline-flex items-center gap-2 bg-white border-2 sm:border-3 border-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-neo-sm font-mono text-[11px] sm:text-sm font-black text-black">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neo-accent stroke-[3px]" />
            <span>{EVENT_DATA.displayDates}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border-2 sm:border-3 border-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-neo-sm font-mono text-[11px] sm:text-sm font-black text-black">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neo-secondary stroke-[3px]" />
            <span>{EVENT_DATA.location.venue}, {EVENT_DATA.location.city}</span>
          </div>
        </motion.div>

        {/* Real-time Countdown Timer */}
        <motion.div variants={itemVariants}>
          <CountdownTimer />
        </motion.div>

        {/* Primary Call-to-Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-2"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { y: 1 }}
            transition={{ duration: 0.12 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-8 bg-neo-accent text-black font-black text-sm sm:text-base uppercase tracking-wider border-4 border-black shadow-neo hover:shadow-neo-lg active:shadow-none transition-shadow flex items-center justify-center gap-2"
            >
              <span>REGISTER YOUR TEAM</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { y: 1 }}
            transition={{ duration: 0.12 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/problem-statements"
              className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-8 bg-white text-black font-black text-sm sm:text-base uppercase tracking-wider border-4 border-black shadow-neo hover:bg-neutral-50 hover:shadow-neo-lg active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
              <span>BROWSE PROBLEM STATEMENTS</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-black/20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm font-bold text-black/70 px-2"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neo-accent shrink-0" /> NO REGISTRATION FEE
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-neo-secondary shrink-0" /> CERTIFICATES FOR ALL PARTICIPANTS
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-neo-muted shrink-0" /> HARDWARE &amp; AI TRACKS
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
