import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/features/home/HeroSection";
import { QuickStats } from "@/features/home/QuickStats";
import { DomainTrackConsole } from "@/features/home/DomainTrackConsole";
import { PrizePoolBanner } from "@/features/home/PrizePoolBanner";
import { CodeBreakersSpotlight } from "@/features/home/CodeBreakersSpotlight";
import { MinecraftBlockMarquee } from "@/components/layout/MinecraftBlockMarquee";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ArrowRight, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Includes integrated Minecraft wallpaper Marquee) */}
      <HeroSection />

      {/* 2. Event High-Impact Numbers */}
      <ScrollReveal>
        <QuickStats />
      </ScrollReveal>

      {/* 3. Interactive Domain Track Console (Includes integrated Minecraft wallpaper Marquee) */}
      <ScrollReveal>
        <DomainTrackConsole />
      </ScrollReveal>

      {/* 4. Prize Pool Breakdown */}
      <ScrollReveal>
        <PrizePoolBanner />
      </ScrollReveal>

      {/* Minecraft Block Divider Marquee */}
      <MinecraftBlockMarquee speed="normal" />

      {/* 7. CodeBreakers Club & GCEK Spotlight */}
      <ScrollReveal>
        <CodeBreakersSpotlight />
      </ScrollReveal>

      {/* 8. Final Call to Action */}
      <ScrollReveal>
        <section className="py-20 bg-[#261727] border-b-4 border-black text-center relative overflow-hidden">
          {/* Left Side Minecraft Coder at Desk */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[55%] lg:w-[48%] pointer-events-none select-none z-0 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/m2klwmw6/image/upload/v1789130408/desk.jpg"
              alt="Minecraft Coder at Desk"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-left sm:object-left-center"
            />
            {/* Horizontal gradient fade: vibrant on left, seamlessly dissolving into desk room tones */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#261727]/60 to-[#261727] via-60%" />
            {/* Subtle vertical fade for small mobile viewports */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#261727]/40 to-[#261727] sm:hidden" />
          </div>

          {/* Warm Ambient Lamp & Sunset Glow Accents */}
          <div className="absolute -top-16 right-1/4 w-72 h-72 bg-[#FFAA00]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#FF6B6B]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Desktop Right Side Squad Mascot (Full Side Height) */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[380px] xl:w-[480px] 2xl:w-[540px] pointer-events-none select-none z-10 drop-shadow-[12px_12px_0px_#000]">
            <div className="relative w-full h-full">
              <Image
                src="https://res.cloudinary.com/m2klwmw6/image/upload/v1789130408/team_3.png"
                alt="Minecraft Squad Pass Mascot - Steve, Alex & Saddle Pig"
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 1280px) 380px, 540px"
              />
              <div className="absolute top-6 xl:top-8 right-6 xl:right-10 bg-[#FFAA00] text-black border-3 border-black font-mono text-xs xl:text-sm font-black uppercase px-3.5 py-1 shadow-neo rotate-2">
                ★ SQUAD ASSEMBLED ★
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            {/* Mobile Mascot Badge */}
            <div className="flex flex-col items-center gap-2 lg:hidden">
              <div className="relative w-36 h-36 xs:w-44 xs:h-44 drop-shadow-[6px_6px_0px_#000]">
                <Image
                  src="https://res.cloudinary.com/m2klwmw6/image/upload/v1789130408/team_3.png"
                  alt="Minecraft Squad Pass Mascot"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-black shadow-neo-sm inline-block">
                ★ 2-4 PLAYERS SQUAD ★
              </span>
            </div>

            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-black shadow-neo-sm inline-block">
              REGISTRATION DEADLINE // OCTOBER 10, 2026
            </span>

            <h2 className="font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000]">
              DO NOT MISS OUT. <br />
              <span className="bg-white text-black px-3 border-4 border-black shadow-neo inline-block rotate-[-1deg] mt-2">
                CLAIM YOUR SQUAD PASS
              </span>
            </h2>

            <p className="text-base sm:text-xl font-bold text-[#EADCE9] max-w-2xl mx-auto leading-relaxed [text-shadow:_1px_1px_0_#000]">
              Free participation, real-time mentorship, computing infrastructure, and a STATE stage at Government College of Engineering Kalahandi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto h-14 px-10 bg-[#FF6B6B] hover:bg-[#FF7B7B] text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <span>REGISTER SQUAD NOW</span>
                <ArrowRight className="w-5 h-5 stroke-[3px]" />
              </Link>

              <Link
                href="/problem-statements"
                className="w-full sm:w-auto h-14 px-8 bg-white text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-1 hover:bg-neutral-100 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-5 h-5 stroke-[3px]" />
                <span>EXPLORE PROBLEMS</span>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
