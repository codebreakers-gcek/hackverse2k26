"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Trophy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Heart,
  Rocket,
  Flame,
  Share2,
  ExternalLink,
} from "lucide-react";
import { playButtonClickSound } from "./MinecraftSoundEffects";

type ModalStep = "thank_you" | "hackverse_2";

interface EventEndedModalProps {
  /** Force open state (controlled mode) */
  isOpen?: boolean;
  /** Callback on close */
  onClose?: () => void;
  /** Initial step to display */
  initialStep?: ModalStep;
  /** Disable automatic pop-up */
  disableAutoOpen?: boolean;
}

export function EventEndedModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  initialStep = "thank_you",
  disableAutoOpen = false,
}: EventEndedModalProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [isOpenState, setIsOpenState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState<ModalStep>(initialStep);

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : isOpenState;

  // Auto-Open on Page Load (with session storage memory)
  useEffect(() => {
    setMounted(true);
    if (disableAutoOpen || isControlled) return;

    try {
      const dismissed = sessionStorage.getItem("hackverse_ended_modal_seen");
      if (dismissed === "true") {
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const timer = setTimeout(() => {
      setIsOpenState(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [disableAutoOpen, isControlled]);

  // Global event listener to allow triggering the modal from any component
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ step?: ModalStep }>;
      if (customEvent.detail?.step) {
        setActiveStep(customEvent.detail.step);
      }
      playButtonClickSound(0.4);
      setIsOpenState(true);
    };

    window.addEventListener("open-thankyou-modal", handleOpenModal);
    return () => window.removeEventListener("open-thankyou-modal", handleOpenModal);
  }, []);

  const handleClose = useCallback(() => {
    playButtonClickSound(0.4);
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setIsOpenState(false);
      try {
        sessionStorage.setItem("hackverse_ended_modal_seen", "true");
      } catch {
        // ignore
      }
    }
  }, [isControlled, controlledOnClose]);

  const handleOpen = useCallback((step: ModalStep = "thank_you") => {
    playButtonClickSound(0.4);
    setActiveStep(step);
    setIsOpenState(true);
  }, []);

  const goToStep = useCallback((step: ModalStep) => {
    playButtonClickSound(0.4);
    setActiveStep(step);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock background body scroll and pause Lenis when modal is open
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.stop();
    }

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeLenis = (window as any).__lenis;
      if (activeLenis) {
        activeLenis.start();
      }
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isOpen]);

  // Detect footer intersection to hide the floating badge smoothly when reaching the footer
  const [hideNearFooter, setHideNearFooter] = useState(false);

  useEffect(() => {
    const handleFooterScroll = () => {
      const footer = document.getElementById("main-footer") || document.querySelector("footer");
      if (!footer) {
        setHideNearFooter(false);
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top <= window.innerHeight - 30) {
        setHideNearFooter(true);
      } else {
        setHideNearFooter(false);
      }
    };

    window.addEventListener("scroll", handleFooterScroll, { passive: true });
    window.addEventListener("resize", handleFooterScroll, { passive: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && (window as any).__lenis) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis.on("scroll", handleFooterScroll);
    }

    handleFooterScroll();

    return () => {
      window.removeEventListener("scroll", handleFooterScroll);
      window.removeEventListener("resize", handleFooterScroll);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).__lenis) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__lenis.off("scroll", handleFooterScroll);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* ── Persistent Floating Minecraft Hotbar Trigger Pill ── */}
      <AnimatePresence>
        {!isOpen && !hideNearFooter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 select-none font-mono"
          >
            <button
              onClick={() => handleOpen("thank_you")}
              className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-[#212121] hover:bg-[#2C2C2C] text-white border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
              title="Open Thank You Note & HackVerse 2.0 Announcement"
            >
              <div className="w-7 h-7 bg-[#FFAA00] border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] flex items-center justify-center text-black font-black text-sm shrink-0 shadow-[1px_1px_0px_#000] group-hover:rotate-6 transition-transform">
                ★
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-[#FFAA00] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FFAA00]" />
                  HACKVERSE 2.0 COMING SOON!
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#55FFFF] tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#86EFAC]">THANK YOU FOR JOINING</span>
                  <span>•</span>
                  <span className="text-[#FFFF55]">CLICK TO VIEW</span>
                </span>
              </div>

              <div className="ml-1 bg-[#5B8731] hover:bg-[#689B37] text-white font-black text-[10px] px-2 py-1 border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[1px_1px_0px_#000] uppercase hidden xs:inline-block">
                READ
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Minecraft GUI Modal Dialog Screen ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden font-sans overscroll-contain"
          >
            {/* Atmospheric Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Authentic Minecraft GUI Window Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-ended-dialog-title"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 15 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 15 }
              }
              transition={{
                type: "spring",
                damping: 26,
                stiffness: 350,
              }}
              className="relative w-full max-w-xl bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000000] z-50 my-auto overflow-hidden select-none max-h-[88vh] sm:max-h-[85vh] flex flex-col touch-auto"
            >
              {/* ── 1. Minecraft GUI Window Header ── */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2A2A2A] border-b-3 border-b-[#555555] border-t-2 border-t-[#3A3A3A] font-mono shrink-0">
                {/* Left Title Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFAA00] border border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] flex items-center justify-center text-black font-black text-xs shadow-[1px_1px_0px_#000]">
                    ★
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase text-[#FFAA00] tracking-wider [text-shadow:_1px_1px_0_#000]">
                    {activeStep === "thank_you"
                      ? "NOTICE // HACKVERSE '26 CONCLUDED"
                      : "ANNOUNCEMENT // THE NEXT CHAPTER"}
                  </span>
                </div>

                {/* Minecraft [ ✕ ] Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="w-7 h-7 bg-[#707070] hover:bg-[#FF5555] text-white border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] active:bg-[#555555] shadow-[1px_1px_0px_#000] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>

              {/* ── 2. Navigation Steps Tabs (Clean 2-Step Flow) ── */}
              <div className="grid grid-cols-2 p-1.5 bg-[#1C1C1C] border-b-3 border-[#3A3A3A] font-mono text-xs font-black shrink-0 gap-1">
                {/* Tab 1: Thank You */}
                <button
                  type="button"
                  onClick={() => goToStep("thank_you")}
                  className={`py-2 px-3 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeStep === "thank_you"
                      ? "bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000]"
                      : "bg-[#2F2F2F] text-[#CCCCCC] hover:text-white hover:bg-[#3D3D3D] border-2 border-transparent"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 shrink-0" />
                  <span>1. THANK YOU NOTE</span>
                </button>

                {/* Tab 2: Hackverse 2.0 */}
                <button
                  type="button"
                  onClick={() => goToStep("hackverse_2")}
                  className={`py-2 px-3 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                    activeStep === "hackverse_2"
                      ? "bg-[#55FFFF] text-black border-2 border-t-[#A6FFFF] border-l-[#A6FFFF] border-r-[#008888] border-b-[#008888] shadow-[2px_2px_0px_#000]"
                      : "bg-[#2F2F2F] text-[#55FFFF] hover:text-white hover:bg-[#3D3D3D] border-2 border-transparent"
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5 shrink-0 text-[#FFAA00]" />
                  <span>2. HACKVERSE 2.0</span>
                  <span className="bg-[#FF5555] text-white text-[9px] px-1 py-0.2 border border-black uppercase font-bold animate-pulse">
                    SOON
                  </span>
                </button>
              </div>

              {/* ── 3. GUI Inner Body (Scrollable) ── */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 overscroll-contain select-text touch-pan-y retro-modal-scrollbar [scrollbar-width:thin] [scrollbar-color:#4A4A4A_#A8A8A8]"
              >
                <AnimatePresence mode="wait">
                  {/* ══════════════════════════════════════════════════════════
                     STEP 1: THANK YOU NOTE
                     ══════════════════════════════════════════════════════════ */}
                  {activeStep === "thank_you" ? (
                    <motion.div
                      key="step-thank-you"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-4"
                    >
                      {/* Headline Header */}
                      <div className="text-center space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#14532D] text-[#86EFAC] font-mono text-xs font-black border border-t-[#4ADE80] border-l-[#4ADE80] border-r-[#052E16] border-b-[#052E16] shadow-[1px_1px_0px_#000] uppercase">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>EVENT COMPLETED • OCTOBER 08-10, 2026</span>
                        </div>

                        <h2
                          id="event-ended-dialog-title"
                          className="font-black text-xl sm:text-2xl text-[#1E1B24] tracking-tight uppercase leading-snug"
                        >
                          THANK YOU FOR AN EPIC HACKATHON!
                        </h2>
                      </div>

                      {/* Recessed Note Parchment Card */}
                      <div className="p-3.5 sm:p-4 bg-[#F5EEDC] text-[#221F1F] border-3 border-t-[#D5C29D] border-l-[#D5C29D] border-r-[#7A6440] border-b-[#7A6440] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.35)] space-y-3 font-sans">
                        <div className="flex items-center gap-2 border-b-2 border-[#D5C29D] pb-2 font-mono text-xs font-black text-[#5C4318]">
                          <div className="w-5 h-5 relative shrink-0">
                            <Image
                              src="/cblogo.png"
                              alt="CodeBreakers Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>A NOTE OF GRATITUDE FROM TEAM CODEBREAKERS GCEK</span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold leading-relaxed text-black/90">
                          To all the incredible <strong className="font-black text-black">500+ participants</strong>,{" "}
                          <strong className="font-black text-black">60+ resilient squads</strong>, insightful industry mentors, honorable jury
                          panelists, supporting partners, and the entire{" "}
                          <strong className="font-black text-black">Government College of Engineering Kalahandi (GCEK)</strong> community:
                        </p>

                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/85">
                          Over 24 intense, caffeine-fueled hours, you transformed problem statements into living, breathing prototypes.
                          You engineered breakthrough architectures in AI/ML, Web3, Cyber Security, IoT, and Open Innovation. Your relentless dedication, camaraderie, and energy made{" "}
                          <strong className="font-black text-black">HACKVERSE &apos;26</strong> a legendary milestone for Odisha&apos;s developer ecosystem!
                        </p>

                        <div className="pt-1 flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold text-[#5C4318]">
                          <span>— CodeBreakers Technical Society</span>
                          <span className="text-[#8F5500]">GCEK Kalahandi</span>
                        </div>
                      </div>

                      {/* Official Winners Page Direct Link Banner */}
                      <div className="p-3.5 bg-[#1B1B1B] text-white border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[3px_3px_0px_#000] space-y-2 font-mono">
                        <div className="flex items-center justify-between text-xs font-black uppercase text-[#FFAA00]">
                          <span className="flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-[#FFAA00]" />
                            <span>OFFICIAL WINNERS ARE ANNOUNCED!</span>
                          </span>
                          <span className="text-[#55FF55] text-[10px]">HALL OF FAME</span>
                        </div>
                        <p className="text-xs text-[#EAEAEA] font-semibold leading-tight">
                          Check out the champions on the official tournament podium page, featuring Joint 1st Prize, 2nd Prize, 3rd Prize, and Best Female-Led Squad!
                        </p>
                        <Link
                          href="/winners"
                          onClick={() => {
                            playButtonClickSound(0.5);
                            handleClose();
                          }}
                          className="w-full py-2 px-3 bg-[#FFAA00] hover:bg-[#FFB72B] text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>VISIT DEDICATED WINNERS PAGE (/winners)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* 4 Inset Item Slots (Stats recap) */}
                      <div className="p-3 bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] space-y-2 font-mono">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#1B1B1B]">
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#B91C1C]" />
                            <span>HACKVERSE &apos;26 RECAP STATS</span>
                          </span>
                          <span className="text-[#333333]">ALL SQUADS HONORED</span>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                          {/* SQUADS Slot */}
                          <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                            <div className="text-xl sm:text-2xl font-black text-[#FFAA00] leading-none [text-shadow:_1px_1px_0_#000]">
                              60+
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                              SQUADS
                            </div>
                          </div>

                          {/* HOURS Slot */}
                          <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                            <div className="text-xl sm:text-2xl font-black text-[#FFFFFF] leading-none [text-shadow:_1px_1px_0_#000]">
                              24H
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                              SPRINT
                            </div>
                          </div>

                          {/* PRIZES Slot */}
                          <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                            <div className="text-xl sm:text-2xl font-black text-[#55FFFF] leading-none [text-shadow:_1px_1px_0_#000]">
                              ₹35K+
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                              REWARDS
                            </div>
                          </div>

                          {/* PAN-ODISHA Slot */}
                          <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                            <div className="text-xl sm:text-2xl font-black text-[#55FF55] leading-none [text-shadow:_1px_1px_0_#000]">
                              500+
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                              BUILDERS
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Navigation */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1.5 pb-2.5 font-mono">
                        {/* Primary Button to Step 2: Hackverse 2.0 */}
                        <button
                          type="button"
                          onClick={() => goToStep("hackverse_2")}
                          className="flex-1 h-12 px-5 bg-[#55FFFF] hover:bg-[#7EFFFF] text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#A6FFFF] border-l-[#A6FFFF] border-r-[#008888] border-b-[#008888] active:border-t-[#008888] active:border-l-[#008888] active:border-r-[#A6FFFF] active:border-b-[#A6FFFF] shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Rocket className="w-5 h-5 stroke-[2.5px] text-black shrink-0" />
                          <span>WHAT&apos;S NEXT? HACKVERSE 2.0</span>
                          <ArrowRight className="w-5 h-5 stroke-[3px]" />
                        </button>

                        {/* Secondary Dismiss Button */}
                        <button
                          type="button"
                          onClick={handleClose}
                          className="sm:w-28 h-12 px-4 bg-[#707070] hover:bg-[#858585] text-white hover:text-[#FFFF55] font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center cursor-pointer transition-colors"
                        >
                          DISMISS
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* ══════════════════════════════════════════════════════════
                       STEP 2: HACKVERSE 2.0 COMING SOON
                       ══════════════════════════════════════════════════════════ */
                    <motion.div
                      key="step-hackverse-2"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-4"
                    >
                      {/* Epic Header Announcement Banner */}
                      <div className="p-4 bg-[#100C1C] border-3 border-t-[#7E22CE] border-l-[#7E22CE] border-r-[#2E1065] border-b-[#2E1065] shadow-[3px_3px_0px_#000] flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                        {/* Background subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-amber-500/10 to-cyan-500/30 pointer-events-none" />

                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#2E1065] text-[#E9D5FF] font-mono text-[11px] font-black uppercase border border-t-[#C084FC] border-l-[#C084FC] border-r-[#1E0B36] border-b-[#1E0B36] shadow-[1px_1px_0px_#000]">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFAA00]" />
                          <span>LEVEL 2 UNLOCKED // THE SAGA CONTINUES</span>
                        </div>

                        <div className="space-y-1 relative z-10">
                          <h2 className="font-thuast text-4xl sm:text-5xl font-black text-[#55FFFF] uppercase tracking-wider text-outline-black [text-shadow:_2px_2px_0_#000]">
                            HACKVERSE 2.0
                          </h2>
                          <div className="inline-block bg-[#FFAA00] text-black font-mono font-black text-xs sm:text-sm uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] -rotate-1">
                            COMING SOON — STAY TUNED!
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-[#EADCE9] max-w-md mx-auto leading-relaxed relative z-10">
                          HackVerse &apos;26 was just the beginning. We are already architecting an even bigger, bolder, and more electrifying battlefield.
                        </p>
                      </div>

                      {/* Teasers List (What to expect in 2.0) */}
                      <div className="space-y-2 font-mono">
                        <div className="text-[11px] font-black uppercase text-[#1B1B1B] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#FFAA00]" />
                            <span>WHAT TO EXPECT IN HACKVERSE 2.0</span>
                          </span>
                          <span className="text-[#333333] text-[10px]">NEXT GENERATION</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Feature 1 */}
                          <div className="p-2.5 bg-[#2B2B2B] text-white border-2 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#141414] border-b-[#141414] shadow-[2px_2px_0px_#000] flex items-start gap-2">
                            <span className="text-[#FFAA00] font-black text-sm">01</span>
                            <div>
                              <strong className="block text-[#FFAA00] font-black text-[11px] uppercase">
                                PAN-INDIA EXPANSION
                              </strong>
                              <span className="text-[11px] text-[#D1D5DB] leading-tight block">
                                Welcoming developers, squads, and campuses across the entire country.
                              </span>
                            </div>
                          </div>

                          {/* Feature 2 */}
                          <div className="p-2.5 bg-[#2B2B2B] text-white border-2 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#141414] border-b-[#141414] shadow-[2px_2px_0px_#000] flex items-start gap-2">
                            <span className="text-[#55FFFF] font-black text-sm">02</span>
                            <div>
                              <strong className="block text-[#55FFFF] font-black text-[11px] uppercase">
                                2X+ PRIZE POOL &amp; GRANTS
                              </strong>
                              <span className="text-[11px] text-[#D1D5DB] leading-tight block">
                                Larger cash rewards, hardware prototyping bounties, and cloud compute.
                              </span>
                            </div>
                          </div>

                          {/* Feature 3 */}
                          <div className="p-2.5 bg-[#2B2B2B] text-white border-2 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#141414] border-b-[#141414] shadow-[2px_2px_0px_#000] flex items-start gap-2">
                            <span className="text-[#55FF55] font-black text-sm">03</span>
                            <div>
                              <strong className="block text-[#55FF55] font-black text-[11px] uppercase">
                                NEXT-GEN TECH TRACKS
                              </strong>
                              <span className="text-[11px] text-[#D1D5DB] leading-tight block">
                                Autonomous Agents, Robotics, Quantum algorithms &amp; Cyber arena challenges.
                              </span>
                            </div>
                          </div>

                          {/* Feature 4 */}
                          <div className="p-2.5 bg-[#2B2B2B] text-white border-2 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#141414] border-b-[#141414] shadow-[2px_2px_0px_#000] flex items-start gap-2">
                            <span className="text-[#FF8585] font-black text-sm">04</span>
                            <div>
                              <strong className="block text-[#FF8585] font-black text-[11px] uppercase">
                                TECH CARNIVAL &amp; WORKSHOPS
                              </strong>
                              <span className="text-[11px] text-[#D1D5DB] leading-tight block">
                                Hands-on industry keynotes, live coding combat stages, and swags galore.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Socials & Stay Tuned Community Links */}
                      <div className="p-3 bg-[#E0E0E0] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#888888] border-b-[#888888] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] space-y-2">
                        <div className="flex items-center justify-between font-mono text-[11px] font-black uppercase text-black">
                          <span className="flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-[#5B8731]" />
                            <span>FOLLOW US FOR INSTANT 2.0 DROPS</span>
                          </span>
                          <span className="text-black/70">@gcek.codebreakers</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <a
                            href="https://www.instagram.com/gcek.codebreakers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[120px] py-1.5 px-2.5 bg-[#E1306C] hover:bg-[#C13584] text-white font-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                          >
                            <span>INSTAGRAM</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href="https://www.linkedin.com/company/codebreakers-gce-kalahandi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[120px] py-1.5 px-2.5 bg-[#0077B5] hover:bg-[#005E93] text-white font-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                          >
                            <span>LINKEDIN</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href="https://github.com/codebreakers-gcek"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[120px] py-1.5 px-2.5 bg-[#24292E] hover:bg-[#1B1F23] text-white font-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                          >
                            <span>GITHUB</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Action Navigation */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1.5 pb-2.5 font-mono">
                        {/* Back to Thank You Note */}
                        <button
                          type="button"
                          onClick={() => goToStep("thank_you")}
                          className="sm:w-auto px-4 h-12 bg-[#707070] hover:bg-[#858585] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                          <span>THANK YOU NOTE</span>
                        </button>

                        {/* Acknowledge and Dismiss */}
                        <button
                          type="button"
                          onClick={handleClose}
                          className="flex-1 h-12 px-5 bg-[#5B8731] hover:bg-[#689B37] text-white font-black text-xs sm:text-base uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-5 h-5 text-[#FFFF55] shrink-0" />
                          <span>GOT IT, STAYING TUNED!</span>
                          <span className="text-base">🚀</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
