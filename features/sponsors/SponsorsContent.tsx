"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SPONSORS_DATA } from "@/data/sponsors";
import { ENV } from "@/config/env";
import {
  Sparkles,
  Lock,
  Crown,
  Check,
  X,
  Mail,
  ArrowRight,
  Phone,
  ShieldCheck,
  Flame,
  Award,
  Zap,
} from "lucide-react";

import {
  MinecraftCreeperBanner,
  MinecraftLantern,
  MinecraftGoldBanner,
  MinecraftSilverBanner,
  MinecraftBronzeBanner,
  MinecraftCheckmark,
  MinecraftCross,
  MinecraftPixelCrown,
} from "@/components/sponsors/MinecraftSponsorIcons";

export function SponsorsContent() {
  const data = SPONSORS_DATA;
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16 min-w-0 text-black"
    >
      {/* ========================================================================= */}
      {/* 1. TOP TITLE HEADER (Minecraft Floating Sign) */}
      {/* ========================================================================= */}
      <motion.div variants={itemVariants} className="w-full max-w-full flex flex-col items-center text-center space-y-4">
        {/* Identification Badge */}
        <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
          <span>{data.header.tag}</span>
          <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
        </span>

        {/* Main Title Heading */}
        <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
          {data.header.title}{" "}
          <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
            {data.header.highlight}
          </span>
        </h1>

        {/* Subtitle Card */}
        <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-2xl">
          <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
            {data.header.subtitle}
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL SPONSORSHIP PACKET COVER (Steve & Alex Greeting - Image 1) */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] overflow-hidden"
      >

        {/* Content Body: Steve & Alex Greeting + Invitation */}
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mascot Image (sponsor.png) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full h-64 sm:h-84 bg-[#18111B] border-3 border-t-[#3E3E50] border-l-[#3E3E50] border-r-[#0A0A10] border-b-[#0A0A10] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/minecraft/sponsor.png"
                  alt="Minecraft Steve & Alex Namaste Greeting"
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute top-2 left-2 bg-black/90 text-[#FFAA00] font-mono text-[10px] font-black px-2 py-0.5 border border-[#FFAA00] shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FFAA00] rotate-45 inline-block" />
                  <span>NAMASTE &amp; WELCOME</span>
                  <span className="w-1.5 h-1.5 bg-[#FFAA00] rotate-45 inline-block" />
                </div>
              </div>
            </div>

            {/* Information & Action Buttons */}
            <div className="md:col-span-7 space-y-4">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#FFAA00] text-black border-2 border-black inline-block shadow-[2px_2px_0px_#000]">
                OFFICIAL INVITATION // 2026 EDITION
              </span>

              <h2 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight [text-shadow:_1px_1px_0_#FFF] leading-snug">
                JOIN AS A PATRON FOR HACKVERSE &apos;26
              </h2>

              <p className="font-mono text-xs sm:text-sm font-bold text-[#2A2A2A] leading-relaxed">
                We warmly invite forward-thinking technology enterprises, cloud platforms, AI startups, and developer communities to collaborate with Government College of Engineering Kalahandi&apos;s flagship hackathon.
              </p>

              {/* In-Game Dialogue Box */}
              <div className="bg-[#1B1B1B] text-white p-3.5 sm:p-4 border-2 border-[#FFAA00] shadow-[3px_3px_0px_#000] flex items-start gap-3">
                <div className="relative w-10 h-10 shrink-0 bg-[#332211] border border-[#FFAA00] p-0.5">
                  <Image
                    src="/minecraft/wondering.webp"
                    alt="Wandering Trader"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="font-mono text-xs text-[#EAEAEA] leading-snug">
                  <span className="text-[#FFAA00] font-black uppercase">Wandering Merchant:</span> &ldquo;Exotic tooling partnerships, server credits, and bounties are arriving from distant biomes. Connect with the organizing team to reserve your tier!&rdquo;
                </p>
              </div>

              {/* 3D Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://forms.cbgcek.dev/CB-FRM-800072"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[4px_4px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>FILL SPONSORSHIP FORM</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </a>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 bg-[#FFAA00] hover:bg-[#FFB726] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] active:border-t-[#8F5500] active:border-l-[#8F5500] active:border-r-[#FFE285] active:border-b-[#FFE285] shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>CONTACT US</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Emerald Green Bottom Banner from Image 1 */}
        <div className="relative bg-[#1A521D] border-t-4 border-[#3E9845] p-3.5 sm:p-4 text-center text-[#FFEE55] font-mono text-xs sm:text-sm font-black shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] [text-shadow:_1px_1px_0_#000]">
          {/* Emerald Jewel Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#00FF55] border-2 border-[#FFEE55] rotate-45 shadow-[1px_1px_0px_#000]" />
          <span className="text-white uppercase">Organized by:</span>{" "}
          <span>{data.header.organizedBy}</span>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. "WHY TO SPONSOR US ?" WOODEN NOTICE BOARD (Exact Image 2) */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="relative bg-[#7A4B22] border-4 border-t-[#B8814A] border-l-[#B8814A] border-r-[#42250E] border-b-[#42250E] p-4 sm:p-8 md:p-10 shadow-[8px_8px_0px_#000] text-white space-y-6 overflow-hidden"
      >
        {/* Hanging Lanterns & Creeper Banners (Decorative Header Bar) */}
        <div className="flex items-center justify-between gap-2 border-b-3 border-[#42250E] pb-4">
          {/* Left Creeper Banner Flag with Lantern */}
          <div className="flex items-center gap-2">
            <MinecraftLantern className="w-5 h-7 shrink-0 hidden xs:block" />
            <div className="flex items-center gap-1.5 bg-[#003D7A] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_#000]">
              <MinecraftCreeperBanner className="w-4 h-7 shrink-0" />
              <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider hidden sm:inline-block">
                PATRON
              </span>
            </div>
          </div>

          {/* Center Title Badge */}
          <div className="bg-[#3D210B] px-4 sm:px-8 py-2 border-3 border-[#B8814A] shadow-[4px_4px_0px_#000] text-center">
            <span className="font-mono text-base sm:text-xl md:text-2xl font-black uppercase text-[#FFAA00] [text-shadow:_2px_2px_0_#000] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFAA00] rotate-45 inline-block" />
              <span>{data.whySponsor.title}</span>
              <span className="w-2 h-2 bg-[#FFAA00] rotate-45 inline-block" />
            </span>
          </div>

          {/* Right Creeper Banner Flag with Lantern */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#003D7A] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_#000]">
              <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider hidden sm:inline-block">
                PATRON
              </span>
              <MinecraftCreeperBanner className="w-4 h-7 shrink-0" />
            </div>
            <MinecraftLantern className="w-5 h-7 shrink-0 hidden xs:block" />
          </div>
        </div>

        {/* Wood Plank Background Content Box */}
        <div className="bg-[#5C3819] border-3 border-t-[#381F0A] border-l-[#381F0A] border-r-[#8F5E30] border-b-[#8F5E30] p-5 sm:p-8 md:p-10 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.6)] space-y-6 text-xs sm:text-sm md:text-base font-mono font-bold leading-relaxed text-[#F3E5D8] [text-shadow:_1px_1px_0_#000]">
          <p className="indent-2 sm:indent-4">
            {data.whySponsor.paragraph1}
          </p>
          <p className="indent-2 sm:indent-4">
            {data.whySponsor.paragraph2}
          </p>

          {/* Bottom Tagline from Image 2 */}
          <div className="pt-6 border-t-2 border-[#3D210B] text-center">
            <div className="inline-block bg-[#1B1B1B]/80 px-4 sm:px-6 py-2 border-2 border-[#55FF55] shadow-[3px_3px_0px_#000]">
              <span className="font-mono text-sm sm:text-base md:text-xl font-black text-[#55FF55] uppercase tracking-wider [text-shadow:_2px_2px_0_#000]">
                &ldquo;{data.whySponsor.tagline}&rdquo;
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. BENEFITS MATRIX TABLE (Exact Image 3 with Custom Minecraft Vector Banners) */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-3 sm:p-6 md:p-8 shadow-[8px_8px_0px_#000] space-y-6"
      >
        {/* Title Header with Custom Minecraft Crown */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-3 bg-[#3A2210] text-[#FFAA00] px-5 py-2.5 border-3 border-[#FFAA00] shadow-[4px_4px_0px_#000]">
            <MinecraftPixelCrown className="w-7 h-7 shrink-0" />
            <span className="font-mono text-base sm:text-lg md:text-xl font-black uppercase [text-shadow:_1px_1px_0_#000]">
              OFFICIAL SPONSORSHIP BENEFITS
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm font-bold text-[#2A2A2A]">
            Comprehensive deliverable breakdown across all 3 tiers (Gold, Silver, and Bronze).
          </p>
        </div>

        {/* Benefits Matrix Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-4 border-black text-left font-mono min-w-[540px]">
            {/* Table Header Row with 3 Tier Custom Vector Shield Banners & Lanterns */}
            <thead>
              <tr className="bg-[#381F0A] text-white border-b-4 border-black">
                <th className="p-3 sm:p-4 text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-[#FFAA00] [text-shadow:_1px_1px_0_#000] w-[46%] sm:w-[48%] border-r-3 border-black">
                  <div className="flex items-center gap-2">
                    <MinecraftPixelCrown className="w-5 h-5 shrink-0 hidden xs:block" />
                    <span>BENEFITS &amp; DELIVERABLES</span>
                  </div>
                </th>

                {/* Gold Tier Header with Custom Vector Banner */}
                <th className="p-2 sm:p-3 text-center w-[18%] sm:w-[17%] bg-[#FFAA00] text-black border-r-3 border-black font-black text-xs sm:text-sm shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4)]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <MinecraftLantern className="w-4 h-6 shrink-0" />
                    <MinecraftGoldBanner className="w-8 h-11 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                    <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-black">
                      GOLD
                    </span>
                  </div>
                </th>

                {/* Silver Tier Header with Custom Vector Banner */}
                <th className="p-2 sm:p-3 text-center w-[18%] sm:w-[17%] bg-[#D0D0D0] text-black border-r-3 border-black font-black text-xs sm:text-sm shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4)]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <MinecraftLantern className="w-4 h-6 shrink-0" />
                    <MinecraftSilverBanner className="w-8 h-11 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                    <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-black">
                      SILVER
                    </span>
                  </div>
                </th>

                {/* Bronze Tier Header with Custom Vector Banner */}
                <th className="p-2 sm:p-3 text-center w-[18%] sm:w-[18%] bg-[#D97706] text-white font-black text-xs sm:text-sm shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3)]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <MinecraftLantern className="w-4 h-6 shrink-0" />
                    <MinecraftBronzeBanner className="w-8 h-11 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                    <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white [text-shadow:_1px_1px_0_#000]">
                      BRONZE
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body Rows with Custom 3D Minecraft Vector Checks and Crosses */}
            <tbody>
              {data.benefitsTable.map((row, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={row.name}
                    className={`border-b-2 border-black/30 ${
                      isEven ? "bg-[#5E3717] text-white" : "bg-[#4D2D12] text-white"
                    } hover:brightness-110 transition-colors`}
                  >
                    {/* Benefit Name */}
                    <td className="p-2.5 sm:p-3 text-[10px] xs:text-xs sm:text-sm font-bold uppercase leading-snug [text-shadow:_1px_1px_0_#000] border-r-3 border-black">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#FFAA00] rotate-45 inline-block shrink-0" />
                        <span>{row.name}</span>
                      </div>
                    </td>

                    {/* Gold Tier Custom Check/Cross */}
                    <td className="p-2 sm:p-2.5 text-center bg-[#F4E2BB] border-r-3 border-black">
                      {row.gold ? (
                        <MinecraftCheckmark className="w-6 h-6" />
                      ) : (
                        <MinecraftCross className="w-6 h-6" />
                      )}
                    </td>

                    {/* Silver Tier Custom Check/Cross */}
                    <td className="p-2 sm:p-2.5 text-center bg-[#ECECEC] border-r-3 border-black">
                      {row.silver ? (
                        <MinecraftCheckmark className="w-6 h-6" />
                      ) : (
                        <MinecraftCross className="w-6 h-6" />
                      )}
                    </td>

                    {/* Bronze Tier Custom Check/Cross */}
                    <td className="p-2 sm:p-2.5 text-center bg-[#F7DFB8]">
                      {row.bronze ? (
                        <MinecraftCheckmark className="w-6 h-6" />
                      ) : (
                        <MinecraftCross className="w-6 h-6" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. TIER CARDS & EMBARGO SLOTS (Gold / Silver / Bronze) */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000]">
            ★ TIERS // PATRON REALMS ★
          </span>
          <h2 className="font-black text-2xl sm:text-4xl text-white uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
            SPONSORSHIP TIERS &amp; EMBARGO ROSTER
          </h2>
          <p className="font-mono text-xs sm:text-sm font-bold text-[#EAEAEA] max-w-xl mx-auto [text-shadow:_1px_1px_0_#000]">
            Official sponsor announcements are currently under embargo and will be unveiled soon!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.tiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              className={`bg-[#222222] border-4 ${tier.borderClass} p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4 text-white`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b-2 border-white/15 pb-3">
                  <span className={`font-mono text-[11px] font-black uppercase px-2.5 py-0.5 border-2 shadow-[2px_2px_0px_#000] ${tier.badgeClass}`}>
                    {tier.badge}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#FFAA00]">
                    36H SPRINT
                  </span>
                </div>

                <h3 className="font-mono font-black text-xl uppercase tracking-tight text-white [text-shadow:_1px_1px_0_#000]">
                  {tier.name}
                </h3>

                <p className="font-mono text-xs text-[#CCCCCC] leading-relaxed">
                  {tier.description}
                </p>

                {/* Key Features Bullet Points */}
                <div className="space-y-1.5 pt-2 border-t border-white/15">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5 text-xs font-mono font-bold text-[#EAEAEA]">
                      <span className="text-[#55FF55] shrink-0">▸</span>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mystery Slots */}
              <div className="pt-3 border-t-2 border-white/15 space-y-2">
                <div className="font-mono text-[10px] text-[#FFAA00] font-black uppercase">
                  CONFIRMED SLOTS (EMBARGO ACTIVE):
                </div>
                {tier.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-[#111116] border-2 border-[#333333] p-2 flex items-center justify-between text-[11px] font-mono font-bold"
                  >
                    <span className="text-white">{slot.title}</span>
                    <span className="flex items-center gap-1 text-[#55FF55] text-[10px] font-black animate-pulse">
                      <Lock className="w-3 h-3 stroke-[2.5px]" />
                      <span>SEALED</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. PARTNERSHIP DISPATCH DESK & CONTACT */}
      {/* ========================================================================= */}
      <motion.div
        variants={itemVariants}
        className="bg-[#241724] border-4 border-black text-white p-6 sm:p-10 shadow-[8px_8px_0px_#000] relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-black inline-block shadow-[2px_2px_0px_#000]">
              ★ PARTNERSHIP DISPATCH DESK ★
            </span>

            <h3 className="font-black text-2xl sm:text-4xl uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
              INTERESTED IN SPONSORING HACKVERSE &apos;26?
            </h3>

            <p className="font-mono text-xs sm:text-sm md:text-base font-bold text-[#E2D4E2] leading-relaxed">
              We offer customizable deliverables for Gold, Silver, and Bronze tiers along with specialized Challenge Track Bounties, Keynote Workshop Slots, and Hacker Swag distribution. Connect with our organizing team today.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`mailto:${ENV.CONTACT_EMAIL}?subject=HACKVERSE%202026%20Sponsorship%20Inquiry`}
                className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[4px_4px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 stroke-[2.5px]" />
                <span>EMAIL {ENV.CONTACT_EMAIL}</span>
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-6 bg-[#737373] hover:bg-[#858585] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#A8A8A8] border-l-[#A8A8A8] border-r-[#373737] border-b-[#373737] active:border-t-[#373737] active:border-l-[#373737] active:border-r-[#A8A8A8] active:border-b-[#A8A8A8] shadow-[4px_4px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>OPEN CONTACT DESK</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="lg:col-span-4 bg-[#150D17] border-3 border-t-[#4A304D] border-l-[#4A304D] border-r-[#0A050B] border-b-[#0A050B] p-5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] space-y-3 text-center">
            <div className="font-mono text-xs font-black uppercase text-[#FFAA00]">
              DIRECT HOTLINE
            </div>
            <div className="font-mono text-base sm:text-lg font-black text-white">
              +91 8895220675
            </div>
            <p className="font-mono text-[11px] text-[#C2B2C2]">
              Kalahandi, Bhawanipatna, Odisha - 766002
            </p>
            <div className="pt-2 border-t border-[#3B253E]">
              <span className="font-mono text-[10px] text-[#55FF55] font-black uppercase">
                FAST RESPONSE GUARANTEED
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
