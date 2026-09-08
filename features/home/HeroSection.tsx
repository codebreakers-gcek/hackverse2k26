import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin, Sparkles, Terminal, Award } from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { CountdownTimer } from "./CountdownTimer";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b-4 border-black bg-grid-paper">
      {/* Decorative Floating Stickers */}
      <div className="absolute top-6 left-4 sm:left-12 rotate-[-4deg] hidden lg:block select-none pointer-events-none">
        <div className="bg-neo-accent text-black font-black text-xs uppercase px-3 py-1.5 border-3 border-black shadow-neo-sm">
          ★ FLAGSHIP 36H HACKATHON
        </div>
      </div>

      <div className="absolute top-10 right-4 sm:right-12 rotate-[3deg] hidden lg:block select-none pointer-events-none">
        <div className="bg-neo-secondary text-black font-black text-xs uppercase px-3 py-1.5 border-3 border-black shadow-neo-sm">
          🏆 ₹1,50,000+ CASH POOL
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Identification Badge */}
        <div className="w-full flex items-center justify-center mb-6">
          <div className="inline-flex items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-3 font-mono text-sm sm:text-base font-black uppercase px-4 py-2 bg-black text-white border-2 border-black shadow-neo-sm">
              <Image
                src="/logo.png"
                alt="CodeBreakers Logo"
                width={38}
                height={38}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                priority
              />
              <span>ORGANIZED BY CODEBREAKERS</span>
            </span>
          </div>
        </div>

        {/* Massive Headline */}
        <div className="relative inline-block mb-4 ">
          <h1 className="font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-black uppercase leading-none">
            HACKVERSE <span className="text-neo-accent">&apos;26</span>
          </h1>
        </div>

        {/* Tagline sticker */}
        <div className="max-w-3xl mx-auto my-4">
          <div className="inline-block bg-neo-muted border-3 border-black px-4 py-2 shadow-neo -rotate-1">
            <p className="font-black text-base sm:text-xl md:text-2xl text-black uppercase tracking-tight">
              &ldquo;{EVENT_DATA.tagline}&rdquo;
            </p>
          </div>
          <div className="mt-2 font-mono text-sm sm:text-base md:text-lg font-black tracking-[0.25em] text-black/80 uppercase">
            {EVENT_DATA.edition}
          </div>
        </div>

        {/* Introduction */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg font-bold text-black/80 leading-relaxed mt-4 mb-6">
          {EVENT_DATA.shortDescription}
        </p>

        {/* Event Date & Location Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-mono text-xs sm:text-sm font-black text-black">
            <Calendar className="w-4 h-4 text-neo-accent stroke-[3px]" />
            <span>{EVENT_DATA.displayDates}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-4 py-2 shadow-neo-sm font-mono text-xs sm:text-sm font-black text-black">
            <MapPin className="w-4 h-4 text-neo-secondary stroke-[3px]" />
            <span>{EVENT_DATA.location.venue}, {EVENT_DATA.location.city}</span>
          </div>
        </div>

        {/* Real-time Countdown Timer */}
        <CountdownTimer />

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/register"
            className="w-full sm:w-auto h-14 px-8 bg-neo-accent text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 flex items-center justify-center gap-2"
          >
            <span>REGISTER YOUR TEAM</span>
            <ArrowRight className="w-5 h-5 stroke-[3px]" />
          </Link>

          <Link
            href="/problem-statements"
            className="w-full sm:w-auto h-14 px-8 bg-white text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-1 hover:bg-neutral-50 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 flex items-center justify-center gap-2"
          >
            <Terminal className="w-5 h-5 stroke-[3px]" />
            <span>BROWSE PROBLEM STATEMENTS</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t-2 border-black/20 flex flex-wrap items-center justify-center gap-6 font-mono text-xs font-bold text-black/70">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neo-accent" /> NO REGISTRATION FEE
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-neo-secondary" /> CERTIFICATES FOR ALL PARTICIPANTS
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-neo-muted" /> HARDWARE &amp; AI TRACKS
          </span>
        </div>
      </div>
    </section>
  );
}
