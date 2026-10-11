"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Trophy,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Users,
  Building,
  Heart,
  Rocket,
  Coins,
  Medal,
} from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ElectricGrid } from "@/components/ui/ElectricGrid";

export function WinnersContent() {
  const shouldReduceMotion = useReducedMotion();

  const handleOpenThankYouModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-thankyou-modal", { detail: { step: "thank_you" } })
      );
    }
  };

  const handleOpen20Modal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-thankyou-modal", { detail: { step: "hackverse_2" } })
      );
    }
  };

  return (
    <div className="relative py-12 sm:py-20 text-white select-none">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <SectionTitle
          tag="OFFICIAL TOURNAMENT PODIUM"
          title="HALL OF"
          highlightText="FAME"
          subtitle="Honoring the brightest builders, engineers, and problem-solvers across Odisha. Over 24 relentless hours, these visionary squads forged breakthrough prototypes and claimed top honors at HACKVERSE '26."
        />

        {/* ── 1. FIRST PRIZE (JOINT CHAMPIONS) HERO BANNER ── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#1C1810] border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] p-6 sm:p-10 shadow-[8px_8px_0px_#000] relative overflow-hidden"
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFAA00]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#8F5500]/60 pb-4 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFAA00] border-3 border-black flex items-center justify-center text-black font-black text-2xl shadow-[3px_3px_0px_#000]">
                🥇
              </div>
              <div>
                <span className="font-mono text-xs sm:text-sm font-black uppercase text-[#FFAA00] tracking-wider block">
                  FIRST PRIZE // JOINT CHAMPIONS
                </span>
                <span className="font-mono text-xs font-bold text-[#E5E7EB]">
                  OVERWORLD TITLE • EQUAL HONORS
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#FFAA00] text-black font-mono font-black text-xs sm:text-sm uppercase px-4 py-1.5 border-3 border-black shadow-[3px_3px_0px_#000]">
              <Coins className="w-4 h-4 text-black" />
              <span>₹20,000 CASH POOL + WINNERS TROPHY</span>
            </div>
          </div>

          {/* Joint Winners Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Team 1: FPS */}
            <div className="bg-[#2B2416] border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#54380B] border-b-[#54380B] p-5 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black text-[#FFAA00] uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#FFAA00]" />
                    JOINT CHAMPION #1
                  </span>
                  <span className="bg-[#FFAA00]/20 text-[#FFAA00] border border-[#FFAA00]/40 font-mono text-[10px] font-black px-2 py-0.5 uppercase">
                    RANK 01
                  </span>
                </div>

                <h3 className="font-mono font-black text-3xl sm:text-4xl text-[#FFFF55] uppercase tracking-wider [text-shadow:_2px_2px_0_#000]">
                  Team FPS
                </h3>

                <div className="flex items-center gap-2 text-sm text-[#E5E7EB] font-mono font-bold mt-2">
                  <Building className="w-4 h-4 text-[#FFAA00] shrink-0" />
                  <span>Government College of Engineering Kalahandi (GCEK)</span>
                </div>

                <p className="font-mono text-xs text-[#D1D5DB] font-semibold mt-3 leading-relaxed">
                  Demonstrated extraordinary engineering rigour, end-to-end architecture, and relentless execution under the 24-hour clock.
                </p>
              </div>

              <div className="pt-3 border-t-2 border-[#54380B] flex items-center gap-2 text-[11px] font-mono font-black text-[#55FF55]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FIRST PLACE TROPHY • GOLD MEDALS • CERTIFICATE OF EXCELLENCE</span>
              </div>
            </div>

            {/* Team 2: BRUTEFORCE */}
            <div className="bg-[#2B2416] border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#54380B] border-b-[#54380B] p-5 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black text-[#FFAA00] uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#FFAA00]" />
                    JOINT CHAMPION #2
                  </span>
                  <span className="bg-[#FFAA00]/20 text-[#FFAA00] border border-[#FFAA00]/40 font-mono text-[10px] font-black px-2 py-0.5 uppercase">
                    RANK 01
                  </span>
                </div>

                <h3 className="font-mono font-black text-3xl sm:text-4xl text-[#FFFF55] uppercase tracking-wider [text-shadow:_2px_2px_0_#000]">
                  Team BRUTEFORCE
                </h3>

                <div className="flex items-center gap-2 text-sm text-[#E5E7EB] font-mono font-bold mt-2">
                  <Building className="w-4 h-4 text-[#FFAA00] shrink-0" />
                  <span>GITAM College, Bhubaneswar</span>
                </div>

                <p className="font-mono text-xs text-[#D1D5DB] font-semibold mt-3 leading-relaxed">
                  Engineered exceptional algorithmic solutions with cutting-edge prototype delivery, robust distributed logic, and presentation polish.
                </p>
              </div>

              <div className="pt-3 border-t-2 border-[#54380B] flex items-center gap-2 text-[11px] font-mono font-black text-[#55FF55]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FIRST PLACE TROPHY • GOLD MEDALS • CERTIFICATE OF EXCELLENCE</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. SECOND & THIRD PRIZE PODIUM CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* 🥈 SECOND PRIZE: CODE WARRIORS */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#181F1A] border-4 border-t-[#A7F3D0] border-l-[#A7F3D0] border-r-[#064E3B] border-b-[#064E3B] p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-[#064E3B] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#34D399] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[2px_2px_0px_#000]">
                    🥈
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black uppercase text-[#34D399] tracking-wider block">
                      SECOND PRIZE // 1ST RUNNER UP
                    </span>
                    <span className="font-mono text-[10px] font-bold text-neutral-400">
                      RANK 02 • ELITE VANGUARD
                    </span>
                  </div>
                </div>

                <span className="bg-[#064E3B] text-[#A7F3D0] border border-[#34D399] font-mono text-xs font-black px-3 py-1 uppercase shadow-[2px_2px_0px_#000]">
                  ₹10,000 CASH
                </span>
              </div>

              <h3 className="font-mono font-black text-2xl sm:text-3xl text-[#6EE7B7] uppercase tracking-wider [text-shadow:_2px_2px_0_#000]">
                CODE WARRIORS
              </h3>

              <div className="flex items-center gap-2 text-sm text-[#E5E7EB] font-mono font-bold mt-2">
                <Building className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>Government College of Engineering Kalahandi (GCEK)</span>
              </div>

              <p className="font-mono text-xs text-[#D1D5DB] font-semibold mt-3 leading-relaxed">
                Outstanding execution in competitive problem solving, intuitive interface ergonomics, and verified architectural resilience.
              </p>
            </div>

            <div className="pt-3 border-t-2 border-[#064E3B] flex items-center gap-2 text-[11px] font-mono font-black text-[#A7F3D0]">
              <Medal className="w-3.5 h-3.5" />
              <span>SILVER TROPHY • INDUSTRY MENTORSHIP • MERCH DOSSIER</span>
            </div>
          </motion.div>

          {/* 🥉 THIRD PRIZE: Team ACEBits */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#241A18] border-4 border-t-[#FDBA74] border-l-[#FDBA74] border-r-[#7C2D12] border-b-[#7C2D12] p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b-2 border-[#7C2D12] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#FB923C] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[2px_2px_0px_#000]">
                    🥉
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black uppercase text-[#FB923C] tracking-wider block">
                      THIRD PRIZE // 2ND RUNNER UP
                    </span>
                    <span className="font-mono text-[10px] font-bold text-neutral-400">
                      RANK 03 • TECH APPRENTICE
                    </span>
                  </div>
                </div>

                <span className="bg-[#7C2D12] text-[#FDBA74] border border-[#FB923C] font-mono text-xs font-black px-3 py-1 uppercase shadow-[2px_2px_0px_#000]">
                  ₹5,000 CASH
                </span>
              </div>

              <h3 className="font-mono font-black text-2xl sm:text-3xl text-[#FED7AA] uppercase tracking-wider [text-shadow:_2px_2px_0_#000]">
                Team ACEBits
              </h3>

              <div className="flex items-center gap-2 text-sm text-[#E5E7EB] font-mono font-bold mt-2">
                <Building className="w-4 h-4 text-[#FB923C] shrink-0" />
                <span>Government College of Engineering Keonjhar (GCE Keonjhar)</span>
              </div>

              <p className="font-mono text-xs text-[#D1D5DB] font-semibold mt-3 leading-relaxed">
                Impressive inter-college collaboration, pristine git documentation, and creative problem domain innovation.
              </p>
            </div>

            <div className="pt-3 border-t-2 border-[#7C2D12] flex items-center gap-2 text-[11px] font-mono font-black text-[#FDBA74]">
              <Medal className="w-3.5 h-3.5" />
              <span>BRONZE TROPHY • DEVELOPER SUBSCRIPTIONS • SWAG KITS</span>
            </div>
          </motion.div>
        </div>

        {/* ── 3. SPECIAL CATEGORY: BEST FEMALE-LED TEAM ── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#261528] border-4 border-t-[#F472B6] border-l-[#F472B6] border-r-[#831843] border-b-[#831843] p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-[#831843] border-3 border-[#F472B6] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-[3px_3px_0px_#000]">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#F472B6]" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#F472B6]">
                  SPECIAL RECOGNITION // WOMEN IN TECH EXCELLENCE
                </span>
              </div>
              <h3 className="font-mono font-black text-2xl sm:text-3xl uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000] mt-1">
                code_crash
              </h3>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#FDF2F8] mt-1">
                Government College of Engineering Kalahandi (GCEK)
              </p>
              <p className="font-mono text-xs text-[#E5E7EB] mt-1.5 max-w-2xl leading-relaxed">
                Awarded for exemplary squad leadership, collaborative spirit, and impactful execution, inspiring more women to lead in engineering and tech.
              </p>
            </div>
          </div>

          <div className="bg-[#831843] border-2 border-[#EC4899] p-3 text-center self-stretch sm:self-auto shrink-0 shadow-[2px_2px_0px_#000]">
            <span className="font-mono text-xs font-black text-[#FBCFE8] uppercase block">
              SPECIAL TROPHY &amp; EXCLUSIVE PERKS
            </span>
          </div>
        </motion.div>

        {/* ── 4. RECAP NUMBERS & HIGHLIGHTS ── */}
        <div className="p-4 sm:p-6 bg-[#171717] border-4 border-t-[#3E3E3E] border-l-[#3E3E3E] border-r-[#0A0A0A] border-b-[#0A0A0A] shadow-[6px_6px_0px_#000] space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs font-black uppercase text-[#FFAA00]">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FFAA00]" />
              <span>HACKVERSE &apos;26 GRAND TOURNAMENT NUMBERS</span>
            </span>
            <span className="text-[#55FF55]">CENTRAL &amp; EASTERN INDIA</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-[#262626] border-2 border-t-[#383838] border-l-[#383838] border-r-[#101010] border-b-[#101010]">
              <div className="text-2xl sm:text-3xl font-black text-[#FFAA00]">500+</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D1D5DB] uppercase mt-1">
                HACKERS ASSEMBLED
              </div>
            </div>

            <div className="p-3 bg-[#262626] border-2 border-t-[#383838] border-l-[#383838] border-r-[#101010] border-b-[#101010]">
              <div className="text-2xl sm:text-3xl font-black text-[#55FFFF]">60+</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D1D5DB] uppercase mt-1">
                SQUADS DEPLOYED
              </div>
            </div>

            <div className="p-3 bg-[#262626] border-2 border-t-[#383838] border-l-[#383838] border-r-[#101010] border-b-[#101010]">
              <div className="text-2xl sm:text-3xl font-black text-[#55FF55]">24 HRS</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D1D5DB] uppercase mt-1">
                NON-STOP PROTOTYPING
              </div>
            </div>

            <div className="p-3 bg-[#262626] border-2 border-t-[#383838] border-l-[#383838] border-r-[#101010] border-b-[#101010]">
              <div className="text-2xl sm:text-3xl font-black text-[#FF5555]">₹35K+</div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D1D5DB] uppercase mt-1">
                REWARDS DISBURSED
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. NEXT CHAPTER BANNER: HACKVERSE 2.0 CTA ── */}
        <div className="bg-[#2B2B2B] border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[8px_8px_0px_#000] p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <span className="font-mono text-xs font-black uppercase text-[#FFAA00] tracking-wider inline-flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-[#FFAA00]" />
              THE SAGA CONTINUES // NEXT GENERATION
            </span>
            <h3 className="font-black text-2xl sm:text-4xl text-white uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
              WANT TO COMPETE ON THE NATIONAL STAGE?
            </h3>
            <p className="font-mono text-xs sm:text-sm font-bold text-[#E5E7EB] max-w-2xl leading-relaxed">
              HackVerse &apos;26 was just the prologue. <strong className="text-[#55FFFF]">HACKVERSE 2.0</strong> is arriving with double the prize pool, pan-India squads, advanced hardware tracks, and an unforgettable tech carnival.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
            <button
              type="button"
              onClick={handleOpen20Modal}
              className="w-full sm:w-auto h-13 px-6 bg-[#FFAA00] hover:bg-[#FFB72B] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>EXPLORE HACKVERSE 2.0</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenThankYouModal}
              className="w-full sm:w-auto h-13 px-6 bg-[#707070] hover:bg-[#858585] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Heart className="w-4 h-4 text-[#FFAA00]" />
              <span>READ THANK NOTE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
