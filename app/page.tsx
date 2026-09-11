import React from "react";
import Link from "next/link";
import { HeroSection } from "@/features/home/HeroSection";
import { QuickStats } from "@/features/home/QuickStats";
import { DomainTrackConsole } from "@/features/home/DomainTrackConsole";
import { PrizePoolBanner } from "@/features/home/PrizePoolBanner";
import { CodeBreakersSpotlight } from "@/features/home/CodeBreakersSpotlight";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ArrowRight, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Full Viewport Height Image) */}
      <HeroSection />

      {/* 2. Scrolling Ticker Marquee (Overlaying over the hero bottom edge) */}
      <div className="relative -mt-8 sm:-mt-10 z-20 overflow-hidden">
        <MarqueeBanner bg="secondary" speed="normal" bended />
      </div>

      {/* 3. Event High-Impact Numbers */}
      <ScrollReveal>
        <QuickStats />
      </ScrollReveal>

      {/* 4. Interactive Domain Track Console */}
      <ScrollReveal>
        <DomainTrackConsole />
      </ScrollReveal>

      {/* 5. Ticker Divider (Bended & Flowing Right to Left) */}
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

      {/* 6. Prize Pool Breakdown */}
      <ScrollReveal>
        <PrizePoolBanner />
      </ScrollReveal>

      {/* 7. CodeBreakers Club & GCEK Spotlight */}
      <ScrollReveal>
        <CodeBreakersSpotlight />
      </ScrollReveal>

      {/* 8. Final Call to Action */}
      <ScrollReveal>
        <section className="py-20 bg-neo-muted border-b-4 border-black text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm inline-block">
              REGISTRATION DEADLINE // OCTOBER 10, 2026
            </span>

            <h2 className="font-black text-4xl sm:text-6xl text-black uppercase tracking-tight leading-tight">
              DO NOT MISS OUT. <br />
              <span className="bg-white px-3 border-4 border-black shadow-neo inline-block rotate-[-1deg] mt-2">
                CLAIM YOUR SQUAD PASS
              </span>
            </h2>

            <p className="text-base sm:text-xl font-bold text-black/80 max-w-2xl mx-auto leading-relaxed">
              Free participation, real-time mentorship, computing infrastructure, and a STATE stage at Government College of Engineering Kalahandi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto h-14 px-10 bg-neo-accent text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
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
