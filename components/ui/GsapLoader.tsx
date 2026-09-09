"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export function GsapLoader() {
  const [isRendered, setIsRendered] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const statusTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll during initial load
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress counter object for GSAP tweening
    const counterObj = { val: 0 };

    const statusMessages = [
      "INIT SYSTEM KERNEL...",
      "LOADING TECH ARENAS (AI // WEB // CYBER // IOT)...",
      "SYNCING REPOSITORIES & ₹1,50,000 PRIZE POOL...",
      "CODEBREAKERS GCEK PROTOCOL READY.",
    ];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          setIsRendered(false);
        },
      });

      // 1. Quick initial entry of UI elements
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      );

      // Title smooth initial reveal
      tl.fromTo(
        titleRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2",
      );

      // 2. Smooth Counter Animation (0 -> 100) with custom ease
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            const current = Math.floor(counterObj.val);
            if (counterRef.current) {
              counterRef.current.innerText = String(current).padStart(2, "0");
            }
            // Update status message dynamically based on progress
            if (statusTextRef.current) {
              const msgIndex = Math.min(
                Math.floor((current / 100) * statusMessages.length),
                statusMessages.length - 1,
              );
              statusTextRef.current.innerText = `> ${statusMessages[msgIndex]}`;
            }
          },
        },
        "-=0.3",
      );

      // 3. Progress Bar Fill
      tl.fromTo(
        progressFillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: "power2.inOut",
          transformOrigin: "left center",
        },
        "<",
      );

      // 4. Brief hold at 100%
      tl.to({}, { duration: 0.15 });

      // 5. Exit sequence: HACKVERSE text glides to the right side fully and smoothly with opacity updates
      tl.addLabel("exit");

      // HACKVERSE text sweeps all the way to the right side smoothly with opacity fade
      tl.to(
        titleRef.current,
        {
          x: () =>
            typeof window !== "undefined" ? window.innerWidth * 0.65 : 500,
          opacity: 0,
          duration: 1.1,
          ease: "power2.inOut",
        },
        "exit",
      );

      // 6. Smooth Curtain Slide Up: Main Container + Trailing Yellow Wipe
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        "exit+=0.8",
      );

      tl.to(
        wipeRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        "exit+=0.9",
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
      {/* Trailing yellow wipe panel for ultra-smooth neo-brutalist exit */}
      <div
        ref={wipeRef}
        className="fixed inset-0 z-[99998] bg-neo-secondary border-b-8 border-black pointer-events-none"
      />

      {/* Main black loader canvas */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[99999] bg-[#0c0c0c] text-white flex flex-col justify-between p-6 sm:p-12 border-b-8 border-black overflow-hidden select-none"
      >
        {/* Ambient cyber dot matrix background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content Container */}
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col justify-between h-full"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b-2 border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 p-0.5 flex items-center justify-center shadow-neo-sm overflow-hidden shrink-0">
                <Image
                  src="/cblogo.png"
                  alt="HACKVERSE '26 Main Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain select-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-200">
                  CODEBREAKERS // GCEK PROTOCOL
                </span>
              </div>
            </div>
            <div className="font-mono text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest hidden sm:block">
              LOC: 19.91°N 83.16°E // BHAWANIPATNA
            </div>
          </div>

          {/* Centerpiece: Huge Brand Title + Percent Counter */}
          <div className="my-auto py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1
                  ref={titleRef}
                  className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-thuast inline-block will-change-transform"
                >
                  HACK<span className="text-neo-secondary">VERSE</span>
                </h1>
                <p
                  ref={subtitleRef}
                  className="font-mono text-xs sm:text-sm font-bold text-neutral-400 mt-2 uppercase tracking-wide"
                >
                  STATE TECH FEST // 36-HOUR INNOVATION SPRINT
                </p>
              </div>

              {/* Huge Numeric Counter */}
              <div className="text-right flex items-baseline justify-end gap-1">
                <span
                  ref={counterRef}
                  className="font-mono text-7xl sm:text-8xl lg:text-9xl font-thuast text-neo-secondary tracking-tighter"
                >
                  00
                </span>
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-thuast text-white/50">
                  %
                </span>
              </div>
            </div>

            {/* Neo-brutalist Progress Bar */}
            <div className="space-y-2 pt-4">
              <div className="w-full h-4 sm:h-5 bg-neutral-900 border-3 border-white/40 p-0.5 overflow-hidden shadow-[4px_4px_0px_0px_#ffffff]">
                <div
                  ref={progressFillRef}
                  className="h-full bg-gradient-to-r from-neo-accent via-neo-secondary to-emerald-400 origin-left"
                />
              </div>

              {/* Status Ticker */}
              <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400 pt-1">
                <div
                  ref={statusTextRef}
                  className="text-emerald-400 tracking-wider"
                >
                  &gt; INITIALIZING...
                </div>
                <div className="hidden sm:block text-neutral-500 uppercase">
                  STATUS: OPTIMAL [60 FPS]
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar Details */}
          <div className="border-t-2 border-white/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 font-mono text-xs">
            <div className="flex items-center gap-4">
              <span>PRIZE: ₹35K+</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span>TEAMS: 100+ CODES</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span>ARENAS: AI, WEB, CYBER, IOT</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
