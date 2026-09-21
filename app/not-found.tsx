import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Home,
  FileCode2,
  BookOpen,
  Mail,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#18141F] text-black overflow-hidden select-none font-sans">
      {/* Background Minecraft Scene with Atmospheric Dark Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/minecraft/1.webp"
          alt="Minecraft World Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#18141F]/80 to-black/95" />
      </div>

      {/* Main Minecraft GUI Screen Window */}
      <div className="relative z-10 w-full max-w-2xl bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[10px_10px_0px_0px_#000000] my-auto">
        {/* ── 1. Minecraft GUI Window Header ── */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2A2A2A] border-b-3 border-b-[#555555] border-t-2 border-t-[#3A3A3A] font-mono">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#FF5555] border border-t-[#FFAAAA] border-l-[#FFAAAA] border-r-[#880000] border-b-[#880000] flex items-center justify-center text-white font-black text-xs shadow-[1px_1px_0px_#000]">
              !
            </div>
            <span className="text-xs sm:text-sm font-black uppercase text-[#FFAA00] tracking-wider [text-shadow:_1px_1px_0_#000]">
              ERROR 404 // CHUNK NOT GENERATED
            </span>
          </div>

          <div className="px-2 py-0.5 bg-[#1B1B1B] text-[#55FF55] border border-black text-[10px] sm:text-xs font-black uppercase">
            XYZ: ~404 ~ ~404
          </div>
        </div>

        {/* ── 2. Inner Body (Stone Canvas) ── */}
        <div className="p-4 sm:p-7 space-y-6">
          {/* Top Minecraft Advancement / Alert Banner */}
          <div className="p-3 bg-[#1F1F23] border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000] flex items-center gap-3">
            {/* Recessed Item Slot holding Compass */}
            <div className="w-12 h-12 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <Compass className="w-7 h-7 text-[#0c0c0c] stroke-[2.5px]" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-[#FF5555] tracking-wider flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF5555]" />
                BIOME DISCOVERY FAILED
              </span>
              <span className="text-base sm:text-lg font-black text-[#FFFF55] leading-tight tracking-tight [text-shadow:_1px_1px_0_#000]">
                You Fell Out of the World!
              </span>
            </div>
          </div>

          {/* Central Character & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Minecraft Mascot Frame */}
            <div className="sm:col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] p-2 flex items-center justify-center overflow-hidden">
                <Image
                  src="/minecraft/wondering.webp"
                  alt="Lost Wandering Trader"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <span className="mt-2 font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#333333] text-[#A6FFFF] border border-black shadow-[1px_1px_0px_#000]">
                WANDERING TRADER LOST
              </span>
            </div>

            {/* Error Details */}
            <div className="sm:col-span-2 text-center sm:text-left space-y-2">
              <h1 className="font-black text-2xl sm:text-3xl text-[#1E1B24] uppercase tracking-tight leading-tight">
                UNRESOLVED COORDINATES
              </h1>
              <p className="text-sm font-bold text-black/80 leading-relaxed">
                The requested URL path does not exist in the{" "}
                <span className="whitespace-nowrap inline-block font-mono font-black text-[#7E22CE] bg-[#F3E8FF] px-1.5 py-0.5 border border-[#7E22CE]">
                  HACKVERSE&apos;26
                </span>{" "}
                world seed. Looks like this sector has not been generated or was consumed by the void.
              </p>
              <div className="font-mono text-xs font-bold text-black/60 pt-1">
                STATUS CODE: <span className="text-[#C53030] font-black">404 // HTTP_NOT_FOUND</span>
              </div>
            </div>
          </div>

          {/* ── 3. Quick Navigation Hub (Item Slot Links) ── */}
          <div className="space-y-2.5 pt-1">
            <div className="font-mono text-xs font-black uppercase text-black/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8F5500]" />
              <span>SELECT RESPAWN DESTINATION:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
              {/* Primary Respawn Button (Home) */}
              <Link
                href="/"
                className="h-12 px-4 bg-[#5B8731] hover:bg-[#689B37] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Home className="w-4 h-4 stroke-[2.5px]" />
                <span>RESPAWN AT SPAWN (HOME)</span>
              </Link>

              {/* Problem Statements */}
              <Link
                href="/problem-statements"
                className="h-12 px-4 bg-[#707070] hover:bg-[#858585] text-white hover:text-[#FFFF55] font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FileCode2 className="w-4 h-4 stroke-[2.5px]" />
                <span>PROBLEM STATEMENTS</span>
              </Link>

              {/* Guidelines */}
              <Link
                href="/guidelines"
                className="h-12 px-4 bg-[#707070] hover:bg-[#858585] text-white hover:text-[#FFFF55] font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                <span>RULEBOOK &amp; GUIDELINES</span>
              </Link>

              {/* Contact Guild */}
              <Link
                href="/contact"
                className="h-12 px-4 bg-[#707070] hover:bg-[#858585] text-white hover:text-[#FFFF55] font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Mail className="w-4 h-4 stroke-[2.5px]" />
                <span>CONTACT GUILD</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
