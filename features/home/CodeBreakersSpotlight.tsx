import React from "react";
import Link from "next/link";
import { Terminal, Code, Users, ExternalLink, ArrowRight } from "lucide-react";
import { ENV } from "@/config/env";
import { EVENT_DATA } from "@/data/event";
import Image from "next/image";

export function CodeBreakersSpotlight() {
  return (
    <section className="relative py-12 sm:py-20 border-b-4 border-black overflow-hidden">
      {/* Minecraft Background Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/minecraft_2.webp"
          alt="CodeBreakers Spotlight Minecraft Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark vignette overlay for depth & contrast */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Frosted Glass Blurred & Semi-Transparent Container Card */}
        <div className="border-4 border-black bg-white/30 backdrop-blur-xl shadow-neo-lg p-5 sm:p-8 md:p-12 relative overflow-hidden">
          {/* Top Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4 sm:pb-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm border-3 border-black flex items-center justify-center shadow-neo-sm overflow-hidden p-1 shrink-0">
                <Image
                  src="/cblogo.webp"
                  alt="CodeBreakers Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase text-black/70">
                  OFFICIAL HOST CLUB
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  CODEBREAKERS // GCEK
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-secondary/90 border-2 border-black shadow-neo-sm">
                ESTD. 2019
              </span>
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-muted/90 border-2 border-black shadow-neo-sm">
                500+ BUILDERS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Content Column */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                  FOSTERING TECHNICAL EXCELLENCE &amp; HACKATHON CULTURE IN ODISHA
                </h4>
                <p className="text-base font-bold text-black/90 leading-relaxed">
                  CodeBreakers is the premier student-led technical body of Government College of Engineering Kalahandi. As builders who develop and deploy the institute&apos;s digital infrastructure and manage flagship college events like INSPRANO and UDAAN, we created HACKVERSE &apos;26 to give developers nationwide a pure, non-stop platform to build real software.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="border-3 border-black bg-white/40 backdrop-blur-md p-4 shadow-neo-sm hover:bg-white/70 transition-all flex flex-col justify-between">
                  <div>
                    <Code className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase">COMPETITIVE CODING</div>
                  </div>
                  <p className="font-mono text-xs text-black/80 mt-2">
                    Regular 9-Lock and CodeChef contests.
                  </p>
                </div>

                <div className="border-3 border-black bg-white/40 backdrop-blur-md p-4 shadow-neo-sm hover:bg-white/70 transition-all flex flex-col justify-between">
                  <div>
                    <Terminal className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase">REAL-WORLD APPS</div>
                  </div>
                  <p className="font-mono text-xs text-black/80 mt-2">
                    Production systems shipped for 5000+ users.
                  </p>
                </div>

                <div className="border-3 border-black bg-white/40 backdrop-blur-md p-4 shadow-neo-sm hover:bg-white/70 transition-all flex flex-col justify-between">
                  <div>
                    <Users className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase">PEER MENTORSHIP</div>
                  </div>
                  <p className="font-mono text-xs text-black/80 mt-2">
                    Seniors &amp; alumni guiding juniors daily.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-4 border-4 border-black bg-neo-secondary/80 backdrop-blur-lg p-6 sm:p-8 shadow-neo flex flex-col justify-between text-center space-y-6">
              <div className="space-y-3">
                <div className="font-mono text-xs font-black uppercase text-black/70 inline-block bg-white/50 border border-black px-2 py-0.5 shadow-neo-xs">
                  HOST INSTITUTION
                </div>
                <div className="font-black text-xl sm:text-2xl text-black uppercase leading-snug">
                  GOVERNMENT COLLEGE OF ENGINEERING KALAHANDI
                </div>
                <p className="text-xs sm:text-sm font-bold text-black/80">
                  Bandopala, Bhawanipatna, Kalahandi, Odisha - 766002
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={ENV.OFFICIAL_CLUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-white text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>CLUB WEBSITE</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
                </a>

                <Link
                  href="/about"
                  className="w-full h-11 bg-black text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:bg-neutral-900 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>LEARN MORE ABOUT US</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
