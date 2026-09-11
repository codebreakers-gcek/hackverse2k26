"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export function GsapLoader() {
  const [isRendered, setIsRendered] = useState(true);

  // DOM Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const trailingWipeRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const tipTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Check if loader has already run in this browser session
    if (typeof window !== "undefined" && sessionStorage.getItem("hackverse_loader_played")) {
      setIsRendered(false);
      return;
    }

    // Lock body scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress value container for tweening
    const counter = { val: 0 };

    const statusSteps = [
      "GENERATING TERRAIN CHUNKS...",
      "LOADING HACKVERSE '26 PROTOCOLS...",
      "SUMMONING ARENAS (AI • WEB • CYBER • IOT)...",
      "SPAWNING ₹1,50,000 PRIZE POOL...",
      "SYNCING CODEBREAKERS GCEK SERVERS...",
      "WORLD LOADED! SPAWNING IN...",
    ];

    const tips = [
      "TIP: 24-HOUR NON-STOP BUILD SPRINT AHEAD",
      "TIP: BRING YOUR LAPTOP CHARGER & SQUAD ENERGY",
      "TIP: FOOD, WIFI & MENTORSHIP SUPPLIED ON-SITE",
      "TIP: DIAMOND SWORD NOT REQUIRED, CLEAN CODE IS",
    ];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("hackverse_loader_played", "true");
          }
          setIsRendered(false);
        },
      });

      // 1. Initial State Setup
      gsap.set(containerRef.current, { yPercent: 0 });
      gsap.set(trailingWipeRef.current, { yPercent: 0 });
      gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: "left center" });

      // 2. Gentle Background Fade (no scale zoom)
      tl.fromTo(
        bgRef.current,
        { opacity: 0.7 },
        { opacity: 1, duration: 2.0, ease: "power1.out" },
        0
      );

      // 3. Central Hackverse 3D Logo Entrance (Pop & Settle)
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85, y: 25, filter: "brightness(0.6)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "brightness(1)",
          duration: 0.7,
          ease: "back.out(1.3)",
        },
        0.15
      );

      // 4. Subtle Floating Idle motion on the 3D Logo
      gsap.to(logoRef.current, {
        y: -5,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 5. Progress Bar Box Fade-In
      tl.fromTo(
        barContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        "-=0.3"
      );

      // 6. Smooth Progress Bar Tween (0 -> 100%)
      tl.to(
        counter,
        {
          val: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: () => {
            const progress = Math.min(100, Math.floor(counter.val));

            // Update fill bar
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${progress / 100})`;
            }

            // Update XP percentage number
            if (percentTextRef.current) {
              percentTextRef.current.innerText = `${progress}%`;
            }

            // Update status text dynamically based on percentage
            if (statusTextRef.current) {
              const stepIndex = Math.min(
                Math.floor((progress / 100) * (statusSteps.length - 1)),
                statusSteps.length - 1
              );
              statusTextRef.current.innerText = `> ${statusSteps[stepIndex]}`;
            }

            // Cycle tips every 25%
            if (tipTextRef.current) {
              const tipIndex = Math.min(
                Math.floor((progress / 100) * tips.length),
                tips.length - 1
              );
              tipTextRef.current.innerText = tips[tipIndex];
            }
          },
        },
        "-=0.1"
      );

      // 7. Brief celebration hold at 100%
      tl.to(
        percentTextRef.current,
        {
          scale: 1.15,
          color: "#ffffff",
          textShadow: "0 0 16px #55FF55, 0 0 24px #55FF55",
          duration: 0.18,
          yoyo: true,
          repeat: 1,
        },
        "+=0.05"
      );

      tl.to({}, { duration: 0.15 });

      // 8. Exit Sequence: Smooth Elevation & Curtain Reveal
      tl.addLabel("exit");

      // Logo & Bar elevate and fade cleanly
      tl.to(
        [logoRef.current, barContainerRef.current],
        {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        },
        "exit"
      );

      // Main container slides up like a theatrical curtain
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        "exit+=0.2"
      );

      // Trailing Minecraft grass-green panel follows for an ultra-smooth transition
      tl.to(
        trailingWipeRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        },
        "exit+=0.28"
      );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isRendered) return null;

  return (
    <>
      {/* Trailing Minecraft Green Curtain for ultra-smooth transition */}
      <div
        ref={trailingWipeRef}
        className="fixed inset-0 z-[99998] bg-[#3B6622] border-b-8 border-black pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* Main Fullscreen Minecraft Loader */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[99999] overflow-hidden select-none flex flex-col justify-between items-center text-white border-b-8 border-black"
        style={{ willChange: "transform" }}
      >
        {/* ========================================================================= */}
        {/* 1. Background Image with Cinematic Depth & Vignette                      */}
        {/* ========================================================================= */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden will-change-transform"
        >
          <Image
            src="/minecraft_loader/bg.png"
            alt="Minecraft Loader Environment"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Deep Cinematic Vignette & Ambient Darkness */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/70" />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1.5px]" />
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
        </div>

        {/* Top Spacer for balanced centering */}
        <div className="relative z-10 w-full pt-6" />

        {/* ========================================================================= */}
        {/* 2. CENTERPIECE: CodeBreakers Presents + 3D Hackverse Logo + Progress Bar  */}
        {/* ========================================================================= */}
        <main className="relative z-10 flex-1 w-full max-w-5xl px-4 flex flex-col items-center justify-center">
          {/* Centered Presenter Stamp & 3D Logo */}
          <div className="relative flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[120px] sm:h-[180px] bg-[#FFAA00]/25 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Centered "CODEBREAKERS PRESENTS HACKVERSE" above Hackverse Logo (No bg, no border, not animated) */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-2 sm:mb-3 select-none">
              <div className="w-5 h-5 sm:w-6 sm:h-6 p-0.5 shrink-0 flex items-center justify-center">
                <Image
                  src="/cblogo.png"
                  alt="CodeBreakers Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span
                className="text-[12px] sm:text-sm md:text-lg text-white font-bold tracking-wider sm:tracking-widest uppercase [text-shadow:_1px_1px_0_#000]"
                style={{ fontFamily: "'Minecraft', monospace" }}
              >
                CODEBREAKERS PRESENTS
              </span>
            </div>

            {/* Centered 3D Voxel Logo */}
            <div
              ref={logoRef}
              className="relative w-[88vw] max-w-[480px] sm:max-w-[620px] md:max-w-[740px] lg:max-w-[820px] will-change-transform drop-shadow-[0_18px_30px_rgba(0,0,0,0.95)]"
            >
              <Image
                src="/minecraft_loader/hackverse.png"
                alt="HACKVERSE '26 - Flagship Hackathon"
                width={900}
                height={260}
                priority
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* ======================================================================= */}
          {/* Minecraft Progress Bar / XP Loader (Below Logo)                         */}
          {/* ======================================================================= */}
          <div
            ref={barContainerRef}
            className="w-full max-w-[360px] sm:max-w-[480px] md:max-w-[560px] mt-4 sm:mt-6 space-y-2.5"
          >
            {/* Top Status & Percentage Row */}
            <div className="flex items-center justify-between text-xs px-1">
              {/* Dynamic Status Message */}
              <span
                ref={statusTextRef}
                className="text-xs sm:text-sm text-[#FFDF78] font-bold tracking-wide truncate max-w-[260px] sm:max-w-[380px] [text-shadow:_1px_1px_0_#000]"
                style={{ fontFamily: "'Minecraft', monospace" }}
              >
                &gt; GENERATING TERRAIN CHUNKS...
              </span>

              {/* Minecraft Glowing XP Percentage */}
              <div className="flex items-baseline gap-1 shrink-0">
                <span
                  ref={percentTextRef}
                  className="text-base sm:text-xl font-bold text-[#55FF55] tracking-wider [text-shadow:_2px_2px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_12px_rgba(85,255,85,0.7)] will-change-transform"
                  style={{ fontFamily: "'Minecraft', monospace" }}
                >
                  0%
                </span>
              </div>
            </div>

            {/* 3D Inset Minecraft Progress Bar Box */}
            <div className="relative w-full p-1 bg-[#101010] border-4 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] shadow-[4px_4px_0px_#000000,inset_2px_2px_6px_rgba(0,0,0,0.9)]">
              {/* Inner Track */}
              <div className="relative w-full h-4 sm:h-5 bg-[#1B1B1B] overflow-hidden">
                {/* Background grid groove lines (Minecraft experience bar segment marks) */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none z-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #000000 2px, transparent 2px)",
                    backgroundSize: "28px 100%",
                  }}
                />

                {/* Animated XP Green Bar Fill */}
                <div
                  ref={progressFillRef}
                  className="h-full bg-gradient-to-r from-[#2ecc71] via-[#55FF55] to-[#7fff00] border-t-2 border-[#b3ffb3] border-b border-[#248f24] shadow-[0_0_12px_#55FF55]"
                  style={{ willChange: "transform" }}
                />
              </div>
            </div>

            {/* Bottom Rotating Minecraft Tips */}
            <div className="text-center pt-1">
              <p
                ref={tipTextRef}
                className="text-[11px] sm:text-xs text-neutral-400 font-bold tracking-wide [text-shadow:_1px_1px_0_#000]"
                style={{ fontFamily: "'Minecraft', monospace" }}
              >
                TIP: 24-HOUR NON-STOP BUILD SPRINT AHEAD
              </p>
            </div>
          </div>
        </main>

        {/* ========================================================================= */}
        {/* 4. Bottom Footer Info Tag                                                 */}
        {/* ========================================================================= */}
        <footer className="relative z-10 w-full max-w-7xl px-4 sm:px-8 pb-4 sm:pb-6 flex items-center justify-between text-neutral-400 text-xs pointer-events-none">
          <div
            className="text-[10px] sm:text-xs text-neutral-300 font-bold [text-shadow:_1px_1px_0_#000]"
            style={{ fontFamily: "'Minecraft', monospace" }}
          >
            October 28-30, 2026 // GCEK CAMPUS
          </div>

          <div
            className="text-[10px] sm:text-xs text-[#FFAA00] font-bold [text-shadow:_1px_1px_0_#000]"
            style={{ fontFamily: "'Minecraft', monospace" }}
          >
            ★ ₹35,000 PRIZE POOL ★
          </div>
        </footer>
      </div>
    </>
  );
}
