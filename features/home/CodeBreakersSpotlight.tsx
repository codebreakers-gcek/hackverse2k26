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
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minecraft Stone GUI Slab Container Card */}
        <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] p-5 sm:p-8 md:p-10 relative overflow-hidden text-black">
          {/* Top Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-[#8B8B8B] pb-4 sm:pb-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center p-1 shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
                <Image
                  src="/cblogo.webp"
                  alt="CodeBreakers Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase text-[#333333]">
                  OFFICIAL HOST CLUB
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  CODEBREAKERS // GCEK
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000]">
                ESTD. 2019
              </span>
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#55FF55] text-black border-2 border-t-[#9EFF9E] border-l-[#9EFF9E] border-r-[#1B801B] border-b-[#1B801B] shadow-[2px_2px_0px_#000]">
                500+ BUILDERS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Content Column */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                  FOSTERING TECHNICAL EXCELLENCE &amp; HACKATHON CULTURE IN
                  ODISHA
                </h4>
                <p className="text-sm sm:text-base font-bold text-[#1A1A1A] font-mono leading-relaxed">
                  CodeBreakers is the premier student-led technical body of
                  Government College of Engineering Kalahandi. As builders who
                  develop and deploy the institute&apos;s digital infrastructure
                  and manage flagship college events like INSPRANO and UDAAN, we
                  created HACKVERSE &apos;26 to give developers nationwide a
                  pure, non-stop platform to build real software.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] p-4 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] flex flex-col justify-between">
                  <div>
                    <Code className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase text-black">
                      COMPETITIVE CODING
                    </div>
                  </div>
                  <p className="font-mono text-xs text-[#2A2A2A] font-bold mt-2">
                    Regular 9-Lock and CodeChef contests.
                  </p>
                </div>

                <div className="bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] p-4 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] flex flex-col justify-between">
                  <div>
                    <Terminal className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase text-black">
                      REAL-WORLD APPS
                    </div>
                  </div>
                  <p className="font-mono text-xs text-[#2A2A2A] font-bold mt-2">
                    Production systems shipped for 5000+ users.
                  </p>
                </div>

                <div className="bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] p-4 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] flex flex-col justify-between">
                  <div>
                    <Users className="w-6 h-6 text-black stroke-[3px] mb-2" />
                    <div className="font-black text-sm uppercase text-black">
                      PEER MENTORSHIP
                    </div>
                  </div>
                  <p className="font-mono text-xs text-[#2A2A2A] font-bold mt-2">
                    Seniors &amp; alumni guiding juniors daily.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-4 bg-[#FFAA00] border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] p-6 sm:p-8 shadow-[4px_4px_0px_#000] flex flex-col justify-between text-center space-y-6">
              <div className="space-y-3">
                <div className="font-mono text-xs font-black uppercase text-black inline-block bg-[#DBDBDB] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">
                  HOST INSTITUTION
                </div>
                <div className="font-black text-xl sm:text-2xl text-black uppercase leading-snug">
                  GOVERNMENT COLLEGE OF ENGINEERING KALAHANDI
                </div>
                <p className="text-xs sm:text-sm font-bold text-black/90 font-mono">
                  Kandha Bando Pala, Bhawanipatna, Kalahandi, Odisha - 766002
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={ENV.OFFICIAL_CLUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] active:translate-y-0.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>CLUB WEBSITE</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
                </a>

                <Link
                  href="/about"
                  className="w-full h-11 bg-[#5B8731] hover:bg-[#689B37] text-white font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
