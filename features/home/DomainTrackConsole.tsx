"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Lock,
} from "lucide-react";
import clsx from "clsx";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export function DomainTrackConsole() {
  const [isProblemStatementsPublished, setIsProblemStatementsPublished] = useState<boolean>(false);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);

  useEffect(() => {
    async function checkSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.settings) {
          if (typeof data.settings.isProblemStatementsPublished === "boolean") {
            setIsProblemStatementsPublished(data.settings.isProblemStatementsPublished);
          }
        }
      } catch (err) {
        console.error("Error fetching system settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    checkSettings();
  }, []);


  // Map difficulty colors (Minecraft theme)
  const difficultyStyles: Record<string, string> = {
    Advanced: "bg-rose-500 text-white border-black",
    Intermediate: "bg-[#FFAA00] text-black border-black",
    Beginner: "bg-[#55FF55] text-black border-black",
  };

  return (
    <section className="relative pt-16 pb-0 sm:pt-24 sm:pb-0 border-b-4 border-black overflow-hidden bg-neutral-900">
      {/* Minecraft Background Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/wallpaper.webp"
          alt="Choose Your Battleground Minecraft Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center blur-[2px]"
        />
        {/* Subtle dark vignette & pixel backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Minecraft Themed Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 relative">
          {/* Minecraft Mobs Horde Dynamic Stampede */}
          {/* <div className="hidden lg:block absolute -top-8 -right-2 xl:right-4 2xl:right-8 w-56 lg:w-68 xl:w-80 h-68 lg:h-80 xl:h-96 pointer-events-none select-none z-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]">
            <div className="relative w-full h-full">
              <Image
                src="/minecraft/mobs.png"
                alt="Minecraft Mobs Battleground Rush"
                fill
                className="object-contain object-top"
                priority
              />
            </div>
          </div> */}

          <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
            ★ BIOMES &amp; REALMS // QUEST TRACKS ★
          </span>

          <h2 className="font-black text-2xl xs:text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
            CHOOSE YOUR{" "}
            <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
              BATTLEGROUND
            </span>
          </h2>

          <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
              Explore the technical dimensions powering HACKVERSE &apos;26. From Overworld AI systems to Nether cybersecurity combat.
            </p>
          </div>
        </div>

        {/* Minecraft GUI Box */}
        <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] overflow-hidden">
          {/* Minecraft Header Bar: Grass Block Green */}
          <div className="bg-[#5B8731] border-b-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                ⚔
              </div>
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                {isProblemStatementsPublished
                  ? `LIVE QUEST REPOSITORY // ${PROBLEM_STATEMENTS_DATA.length} QUESTS DISCOVERED`
                  : "OFFICIAL CHALLENGE TRACKS // EMBARGO SEALED IN CHEST"}
              </span>
            </div>
            <Link
              href="/problem-statements"
              className="font-mono text-xs font-black uppercase text-[#FFE655] hover:text-white [text-shadow:_1px_1px_0_#000] flex items-center gap-1.5 transition-colors"
            >
              <span>{isProblemStatementsPublished ? "EXPLORE ALL QUESTS" : "CHECK EMBARGO STATUS"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          </div>

          {!isProblemStatementsPublished ? (
            /* Minecraft Inset Slot: Loot Chest Locked */
            <div className="p-4 sm:p-6">
              <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-6 sm:p-10 text-center space-y-5">
                {/* Loot Chest Box */}
                <div className="w-16 h-16 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                  <Lock className="w-8 h-8 text-[#FFAA00] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                    [EMBARGO ACTIVE // CHEST LOCKED]
                  </span>
                  <h3 className="font-mono font-black text-2xl sm:text-3xl uppercase tracking-wider text-black">
                    PROBLEM STATEMENTS UNLOCKING SOON
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black/85 max-w-xl mx-auto leading-relaxed">
                    The official challenge tracks and real-world engineering specs for <span className="font-black text-black">HACKVERSE &apos;26</span> are currently sealed in the loot chest and will be unlocked soon.
                  </p>
                </div>

                {/* Minecraft 3D Beveled Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/register"
                    className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center gap-2 transition-colors"
                  >
                    <span>REGISTER SQUAD ON STANDBY</span>
                    <ArrowRight className="w-4 h-4 stroke-[3px]" />
                  </Link>
                  <Link
                    href="/problem-statements"
                    className="bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#9e9e9e] border-l-[#9e9e9e] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9e9e9e] active:border-b-[#9e9e9e] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] transition-colors"
                  >
                    VIEW EMBARGO NOTICE
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Marquee Ticker: Continuous Left Flow of Problem Statements when Published */
            <div className="relative w-full overflow-hidden py-5 bg-[#8B8B8B] border-t-4 border-black select-none">
              <div className="animate-marquee flex items-center gap-6 will-change-transform">
                {[...PROBLEM_STATEMENTS_DATA, ...PROBLEM_STATEMENTS_DATA].map((ps, idx) => (
                  <Link
                    key={`${ps.id}-${idx}`}
                    href={`/problem-statements#${ps.id}`}
                    className="group shrink-0 w-72 xs:w-80 sm:w-96 bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-3.5 sm:p-4 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 border-b-2 border-neutral-700 pb-2">
                        <span className="font-mono text-xs font-black bg-black text-[#55FFFF] px-2 py-0.5 border border-[#55FFFF]/30">
                          {ps.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#5B8731] text-white [text-shadow:_1px_1px_0_#000]">
                            {ps.category}
                          </span>
                          <span
                            className={clsx(
                              "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black",
                              difficultyStyles[ps.difficulty] || "bg-white text-black"
                            )}
                          >
                            {ps.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-mono font-black text-sm text-white uppercase tracking-wider line-clamp-1 group-hover:text-[#55FFFF] transition-colors [text-shadow:_1px_1px_0_#000]">
                        {ps.title}
                      </h4>

                      {/* Short Description */}
                      <p className="text-xs font-bold text-[#CCCCCC] line-clamp-2 leading-relaxed font-mono">
                        {ps.shortDescription}
                      </p>
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-3 pt-2 border-t-2 border-neutral-700 flex items-center justify-between text-xs font-mono font-black text-white">
                      <span className="text-neutral-400 uppercase text-[10px]">
                        {ps.suggestedStack.slice(0, 2).join(" • ")}
                      </span>
                      <span className="flex items-center gap-1 text-[#FFAA00] group-hover:translate-x-1 transition-transform [text-shadow:_1px_1px_0_#000]">
                        <span>VIEW QUEST</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Ticker Divider (Full bleed edge-to-edge over Minecraft battleground image with zero gaps) */}
      <div className="w-full relative z-20 mt-10 sm:mt-12 -mb-2 overflow-hidden">
        <MarqueeBanner
          items={[
            "CHAMPION: ₹20K CASH",
            "RUNNER UP: ₹10K CASH",
            "STATE CERTIFICATES",
            "DIRECT INTERVIEW REFERRALS",
          ]}
          bg="accent"
          speed="fast"
          bended
        />
      </div>
    </section>
  );
}
