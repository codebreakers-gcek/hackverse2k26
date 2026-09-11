"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Sparkles, Terminal, Award } from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { CountdownTimer } from "./CountdownTimer";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

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
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-between items-center pt-12 pb-0 sm:pt-16 sm:pb-0 border-b-4 border-black">
      {/* Minecraft Theme Responsive Background Layer (Full Viewport Height) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/1.webp"
          alt="HackVerse Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Backdrop Filter Layer */}
        <div className="absolute inset-0 backdrop-blur-xs sm:backdrop-blur-sm bg-black/10" />
      </div>

      {/* Decorative Floating Stickers */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -10, rotate: -4 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, rotate: -4 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-6 left-4 sm:left-12 hidden lg:block select-none pointer-events-none"
      >
        <div className="bg-neo-accent text-black font-black text-xs uppercase px-3 py-1.5 border-3 border-black shadow-neo-sm">
          ★ FLAGSHIP 24H HACKATHON
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
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
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
        <motion.div variants={itemVariants} className="relative inline-block mb-3 max-w-full">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-black uppercase leading-none break-words text-outline-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
            <span className="font-thuast tracking-wider">HACKVERSE</span>{" "}
            <span className="font-thuast tracking-tighter text-neo-accent">&apos;26</span>
          </h1>
        </motion.div>

        {/* Tagline sticker */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto my-2 sm:my-3 px-2 flex flex-col items-center gap-2">
          <div className="inline-block bg-neo-muted border-3 border-black px-3 sm:px-4 py-1.5 sm:py-2 shadow-neo -rotate-1 max-w-full">
            <p className="font-black text-sm xs:text-base sm:text-xl md:text-2xl text-black uppercase tracking-tight break-words">
              &ldquo;{EVENT_DATA.tagline}&rdquo;
            </p>
          </div>
          <div className="inline-block bg-black text-white font-mono text-xs sm:text-sm font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase px-3 py-1 border-2 border-black shadow-neo-sm">
            {EVENT_DATA.edition}
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto my-3 px-2">
          <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-3.5 sm:p-5 shadow-[4px_4px_0px_#000] text-center">
            <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
              {EVENT_DATA.shortDescription}
            </p>
          </div>
        </motion.div>

        {/* Event Date & Location Chips */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 my-4 sm:my-5 px-2"
        >
          <div className="inline-flex items-center gap-2 bg-[#1B1B1B] text-white border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-[3px_3px_0px_#000] font-mono text-[11px] sm:text-sm font-black">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFAA00] stroke-[3px]" />
            <span>{EVENT_DATA.displayDates}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#1B1B1B] text-white border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-[3px_3px_0px_#000] font-mono text-[11px] sm:text-sm font-black">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#55FF55] stroke-[3px]" />
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
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-7 px-2"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            whileTap={shouldReduceMotion ? {} : { y: 1 }}
            transition={{ duration: 0.12 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-8 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 transition-colors"
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
              className="w-full sm:w-auto h-13 sm:h-14 px-6 sm:px-8 bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-sm sm:text-base uppercase tracking-wider border-4 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9E9E9E] active:border-b-[#9E9E9E] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 transition-colors"
            >
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
              <span>BROWSE PROBLEM STATEMENTS</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 2. Scrolling Ticker Marquee (Embedded over Minecraft hero image with zero white gaps) */}
      <div className="w-full relative z-20 mt-8 overflow-hidden">
        <MarqueeBanner bg="secondary" speed="normal" bended />
      </div>
    </section>
  );
}
