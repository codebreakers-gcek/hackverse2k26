"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { OFFICIAL_SPONSORS, type OfficialSponsor } from "@/data/sponsors";
import { BrandLogo } from "@/components/sponsors/BrandLogos";

export function SponsorsTeaser() {
  const getTierBadgeStyle = (tier: OfficialSponsor["tier"]) => {
    switch (tier) {
      case "organizer":
        return "bg-[#18111B] text-[#55FF55] border-[#55FF55]";
      case "title":
      case "gold":
        return "bg-[#3D210B] text-[#FFAA00] border-[#FFAA00]";
      case "silver":
        return "bg-[#2A2A2A] text-[#EAEAEA] border-[#CCCCCC]";
      case "bronze":
        return "bg-[#381F0A] text-[#F59E0B] border-[#F59E0B]";
      default:
        return "bg-[#1E293B] text-[#93C5FD] border-[#60A5FA]";
    }
  };

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
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Minecraft Themed Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
            <span>PATRON GUILD // OFFICIAL PARTNERS</span>
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
              Backed by visionary technology enterprises and developer ecosystems empowering <span className="text-[#55FF55] font-black">HACKVERSE &apos;26</span>. Click any partner logo to visit their website!
            </p>
          </div>
        </div>

        {/* Minecraft GUI Box Frame */}
        <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] overflow-hidden">
          {/* Minecraft Top Header Bar: Grass Block Green */}
          <div className="bg-[#5B8731] border-b-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                <span className="w-2 h-2 bg-[#55FF55] rotate-45 inline-block" />
              </div>
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                OFFICIAL SPONSORS &amp; PARTNERS // 2026 LINEUP
              </span>
            </div>
          </div>

          {/* Minecraft Inset Inner Grey Slot Container */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-6 md:p-8 space-y-8">
              
              {/* Sponsor White Boxes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
                {OFFICIAL_SPONSORS.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#707070] border-b-[#707070] shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover:-translate-y-1.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000] transition-all duration-200 p-5 sm:p-6 flex flex-col items-center justify-between min-h-[200px] sm:min-h-[220px] cursor-pointer text-center select-none"
                    title={`Visit ${sponsor.name} (${sponsor.websiteUrl})`}
                  >
                    {/* Top Tier/Category Badge */}
                    <div className="w-full flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`font-mono text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-0.5 border shadow-[1.5px_1.5px_0px_#000] truncate max-w-[85%] ${getTierBadgeStyle(
                          sponsor.tier
                        )}`}
                      >
                        {sponsor.category}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#888888] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 stroke-[2.5px]" />
                    </div>

                    {/* Logo Center Container */}
                    <div className="my-auto py-3 flex items-center justify-center w-full min-h-[80px]">
                      <BrandLogo
                        brandKey={sponsor.brandKey}
                        logoUrl={sponsor.logoUrl}
                        name={sponsor.name}
                        className="max-h-16 sm:max-h-20 w-auto max-w-[90%]"
                      />
                    </div>

                    {/* Bottom Sponsor Info & Website Link */}
                    <div className="w-full pt-2.5 border-t border-gray-200 mt-2 flex flex-col items-center gap-0.5">
                      <span className="font-mono font-black text-sm sm:text-lg text-black group-hover:text-[#5B8731] transition-colors line-clamp-1">
                        {sponsor.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
