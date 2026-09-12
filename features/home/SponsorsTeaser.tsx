"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";

export function SponsorsTeaser() {
  return (
    <section className="relative py-16 sm:py-24 border-b-4 border-black overflow-hidden bg-[#18111B] text-white">
      {/* Background Graphic Layer from sponsor_bg.png */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/sponsor_bg.png"
          alt="Minecraft Sponsors Background"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-luminosity"
        />
        {/* Dark Vignette and Gradient Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Minecraft Themed Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
            <span>PATRON GUILD // TRADE NETWORK</span>
            <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
          </span>

          <h2 className="font-black text-2xl xs:text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
            OUR VALUED{" "}
            <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
              SPONSORS
            </span>
          </h2>

          <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
              Backed by visionary technology enterprises, compute platforms, and developer communities. Official sponsor lineup will be revealed soon!
            </p>
          </div>
        </div>

        {/* Minecraft GUI Box Frame (matching exact image layout) */}
        <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] overflow-hidden">
          {/* Minecraft Top Header Bar: Grass Block Green */}
          <div className="bg-[#5B8731] border-b-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
              </div>
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                OFFICIAL SPONSORS // EMBARGO SEALED IN CHEST
              </span>
            </div>

            <Link
              href="/sponsors"
              className="font-mono text-xs font-black uppercase text-[#FFE655] hover:text-white [text-shadow:_1px_1px_0_#000] flex items-center gap-1.5 transition-colors"
            >
              <span>CHECK EMBARGO STATUS</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          </div>

          {/* Minecraft Inset Inner Grey Slot Container (exact match to image) */}
          <div className="p-4 sm:p-6">
            <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-6 sm:p-12 text-center space-y-5">
              {/* Loot Chest / Lock Box */}
              <div className="w-16 h-16 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                <Lock className="w-8 h-8 text-[#FFAA00] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>

              {/* Embargo Active Badge & Typography */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                  [EMBARGO ACTIVE // CHEST LOCKED]
                </span>
                <h3 className="font-mono font-black text-2xl sm:text-3xl uppercase tracking-wider text-black">
                  SPONSORS REVEALING SOON
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/85 max-w-xl mx-auto leading-relaxed">
                  The official industry sponsors, cloud compute patrons, and track partners for <span className="font-black text-black">HACKVERSE &apos;26</span> are currently sealed in the loot chest and will be revealed soon.
                </p>
              </div>

              {/* Minecraft 3D Beveled Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a
                  href="https://forms.cbgcek.dev/CB-FRM-800072"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>SPONSORSHIP FORM</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </a>
                <Link
                  href="/contact"
                  className="bg-[#707070] hover:bg-[#808080] text-white font-mono font-black text-xs uppercase tracking-wider border-4 border-t-[#9e9e9e] border-l-[#9e9e9e] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9e9e9e] active:border-b-[#9e9e9e] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>CONTACT US</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
