"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Award, Sparkles, Gift, ArrowRight, ShieldCheck, Coins } from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { ElectricGrid } from "@/components/ui/ElectricGrid";

export function PrizePoolBanner() {
  // Minecraft tier-specific styling configurations
  const tierConfigs = [
    {
      // 1st Place - Diamond / Netherite Tier
      borderClass: "border-t-[#55FFFF] border-l-[#55FFFF] border-r-[#008888] border-b-[#008888]",
      badgeText: "★ DIAMOND CHAMPION ★",
      badgeClass: "bg-black text-[#55FFFF] border-2 border-[#55FFFF]",
      rankBadge: "OVERWORLD WINNER",
      rankTextClass: "text-[#55FFFF]",
      amountColor: "text-[#FFAA00]",
      bountyTag: "GOLD + DIAMOND",
      bountyTagClass: "bg-[#55FFFF]/20 text-[#55FFFF] border-[#55FFFF]/40",
      bulletColor: "text-[#55FFFF]",
      footerStatus: "⚡ INSTANT CHEST DISBURSAL",
      footerColor: "text-[#55FF55]",
      icon: <Trophy className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5px] text-[#FFAA00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />,
    },
    {
      // 2nd Place - Gold / Emerald Tier
      borderClass: "border-t-[#FFAA00] border-l-[#FFAA00] border-r-[#8F5500] border-b-[#8F5500]",
      badgeText: "★ GOLD VANGUARD ★",
      badgeClass: "bg-black text-[#FFAA00] border-2 border-[#FFAA00]",
      rankBadge: "ELITE RUNNER UP",
      rankTextClass: "text-[#FFAA00]",
      amountColor: "text-[#FFFFFF]",
      bountyTag: "SILVER BOUNTY",
      bountyTagClass: "bg-[#FFAA00]/20 text-[#FFAA00] border-[#FFAA00]/40",
      bulletColor: "text-[#FFAA00]",
      footerStatus: "⚡ VERIFIED CASH DISBURSAL",
      footerColor: "text-[#FFAA00]",
      icon: <Award className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5px] text-[#FFAA00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />,
    },
    {
      // 3rd Place - Redstone / Iron Tier
      borderClass: "border-t-[#FF7755] border-l-[#FF7755] border-r-[#882200] border-b-[#882200]",
      badgeText: "★ REDSTONE FORGER ★",
      badgeClass: "bg-black text-[#FF7755] border-2 border-[#FF7755]",
      rankBadge: "TECH APPRENTICE",
      rankTextClass: "text-[#FF7755]",
      amountColor: "text-[#FF7755]",
      bountyTag: "BRONZE BOUNTY",
      bountyTagClass: "bg-[#FF7755]/20 text-[#FF7755] border-[#FF7755]/40",
      bulletColor: "text-[#FF7755]",
      footerStatus: "⚡ VERIFIED CASH DISBURSAL",
      footerColor: "text-[#FF7755]",
      icon: <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5px] text-[#FF7755] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />,
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 border-b-4 border-black overflow-hidden bg-neutral-900 select-none">
      {/* Minecraft Natural Landscape Background Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/minecraft natural.png"
          alt="Minecraft Natural Overworld Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        {/* Dark atmospheric overlay: keeps landscape visible while ensuring cards & text pop */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      {/* Animated Electric Grid with Moving Current Lines */}
      <ElectricGrid gridSize={32} beamCount={14} className="opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Minecraft Themed Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
            ★ BOUNTY CHEST // STATE REWARDS ★
          </span>

          <h2 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
            STATE{" "}
            <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1">
              PRIZE POOL
            </span>
          </h2>

          <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
              Compete for a total cash bounty of ₹35K+ along with server compute credits, exclusive developer swag, direct internship referrals, and prestigious winner trophies.
            </p>
          </div>
        </div>

        {/* 3 Minecraft Beveled Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {EVENT_DATA.prizes.map((prize, idx) => {
            const config = tierConfigs[idx] || tierConfigs[0];

            return (
              <div
                key={prize.position}
                className={`bg-[#222222] border-4 ${config.borderClass} p-5 sm:p-7 shadow-[6px_6px_0px_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0px_#000] transition-all duration-200 flex flex-col justify-between relative group`}
              >
                {/* Top Corner Floating Tier Badge */}
                <div
                  className={`absolute -top-4 -right-2 sm:-right-3 ${config.badgeClass} font-mono text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rotate-2 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] z-10`}
                >
                  {config.badgeText}
                </div>

                <div>
                  {/* Top Rank / Icon Row */}
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-neutral-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 bg-[#171717] border-3 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#383838] border-b-[#383838] flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                        {config.icon}
                      </div>
                      <div>
                        <span className={`font-mono text-xs font-black uppercase tracking-wider ${config.rankTextClass} block`}>
                          RANK 0{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">
                          {config.rankBadge}
                        </span>
                      </div>
                    </div>

                    <div className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border ${config.bountyTagClass}`}>
                      {config.bountyTag}
                    </div>
                  </div>

                  {/* Position Title */}
                  <h3 className="font-mono font-black text-lg sm:text-xl text-white uppercase tracking-wider leading-snug mb-2 [text-shadow:_2px_2px_0_#000]">
                    {prize.position}
                  </h3>

                  {/* Minecraft Inset Slot: Cash Bounty Amount */}
                  <div className="bg-[#121212] border-4 border-t-[#050505] border-l-[#050505] border-r-[#2E2E2E] border-b-[#2E2E2E] p-4 my-4 flex items-baseline justify-between shadow-inner">
                    <span className="font-mono text-xs font-black text-neutral-400 uppercase">
                      CASH BOUNTY
                    </span>
                    <span className={`font-mono font-black text-4xl sm:text-5xl ${config.amountColor} [text-shadow:_2px_2px_0_#000] tracking-tight`}>
                      {prize.amount}
                    </span>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-3 mt-5">
                    <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-neutral-300 tracking-wider">
                      <Coins className="w-3.5 h-3.5 text-[#FFAA00]" />
                      <span>UNLOCKED BOUNTIES &amp; PERKS:</span>
                    </div>
                    <ul className="space-y-2.5 font-mono text-xs sm:text-sm font-bold text-neutral-200">
                      {prize.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className={`${config.bulletColor} font-black text-sm shrink-0 leading-tight`}>
                            ◆
                          </span>
                          <span className="leading-snug text-[#E0E0E0]">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-8 pt-3 border-t-2 border-neutral-700">
                  <div className="bg-[#141414] border-2 border-t-[#050505] border-l-[#050505] border-r-[#2A2A2A] border-b-[#2A2A2A] py-2 px-3 text-center">
                    <span className={`font-mono text-[11px] font-black uppercase tracking-widest ${config.footerColor} [text-shadow:_1px_1px_0_#000] block`}>
                      {config.footerStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Minecraft Loot Chest Banner */}
        <div className="bg-[#2B2B2B] border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#111111] border-b-[#111111] shadow-[6px_6px_0px_#000] p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-[#171717] border-4 border-t-[#0B0B0B] border-l-[#0B0B0B] border-r-[#3E3E3E] border-b-[#3E3E3E] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#000]">
              <Gift className="w-8 h-8 text-[#FFAA00] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#55FF55]" />
                <span className="font-mono text-[11px] font-black uppercase tracking-wider text-[#55FF55] [text-shadow:_1px_1px_0_#000]">
                  UNIVERSAL PARTICIPANT REWARDS
                </span>
              </div>
              <h4 className="font-mono font-black text-lg sm:text-2xl uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000] mt-0.5">
                SWAG KITS &amp; VERIFIED STATE CERTIFICATES
              </h4>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#CCCCCC] mt-1 leading-relaxed max-w-2xl">
                Every team presenting a functional project receives verified STATE participation certificates, custom pixel sticker packs, cloud computing infrastructure credits, and food passes.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="w-full md:w-auto bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-7 py-3.5 shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <span>CLAIM SQUAD SLOT</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
