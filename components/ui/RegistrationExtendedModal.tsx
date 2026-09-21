"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  CheckCircle2,
  Rocket,
  Sparkles,
  Clock,
} from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { playButtonClickSound } from "./MinecraftSoundEffects";

interface RegistrationExtendedModalProps {
  /** Override previous deadline display (optional) */
  previousDeadline?: string;
  /** Override new deadline display */
  newDeadline?: string;
  /** Target ISO date for countdown calculation */
  deadlineISO?: string;
  /** Custom heading */
  heading?: string;
  /** Custom subheading */
  subheading?: string;
  /** Force open state (controlled mode) */
  isOpen?: boolean;
  /** Callback on close */
  onClose?: () => void;
  /** Disable automatic pop-up */
  disableAutoOpen?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function RegistrationExtendedModal({
  newDeadline = EVENT_DATA.registrationExtended?.newDeadline || "26th Sept, 2026",
  deadlineISO = EVENT_DATA.registrationExtended?.deadlineISO || "2026-09-26T23:59:59+05:30",
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  disableAutoOpen = false,
}: RegistrationExtendedModalProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [isOpenState, setIsOpenState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : isOpenState;

  // Real-time Countdown Calculator
  useEffect(() => {
    setMounted(true);
    const targetTime = new Date(deadlineISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isExpired: false,
        });
      } else {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadlineISO]);

  // Initial Auto-Open on Page Load (with session storage memory)
  useEffect(() => {
    if (disableAutoOpen || isControlled) return;

    try {
      const dismissed = sessionStorage.getItem("hackverse_reg_extended_modal_seen");
      if (dismissed === "true") {
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const timer = setTimeout(() => {
      setIsOpenState(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [disableAutoOpen, isControlled]);

  const handleClose = useCallback(() => {
    playButtonClickSound(0.4);
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setIsOpenState(false);
      try {
        sessionStorage.setItem("hackverse_reg_extended_modal_seen", "true");
      } catch {
        // ignore
      }
    }
  }, [isControlled, controlledOnClose]);

  const handleOpen = useCallback(() => {
    playButtonClickSound(0.4);
    setIsOpenState(true);
  }, []);

  const handleRegisterClick = useCallback(() => {
    playButtonClickSound(0.5);
    handleClose();
    router.push("/register");
  }, [handleClose, router]);

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
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeLenis = (window as any).__lenis;
      if (activeLenis) {
        activeLenis.start();
      }
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
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
      // Hide when footer top approaches the bottom viewport area
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
      {/* ── Persistent Floating Minecraft Hotbar / Trigger Pill ── */}
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
              onClick={handleOpen}
              className="group relative flex items-center gap-2.5 px-3 py-2 bg-[#212121] hover:bg-[#2C2C2C] text-white border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
              title="Open Extended Registration Notice"
            >

              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-[#FFAA00] tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FFAA00]" />
                  REGISTRATION DEADLINE!
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#55FFFF] tracking-tight">
                  UNTIL {newDeadline.toUpperCase()} •{" "}
                  {timeRemaining.isExpired
                    ? "CLOSED"
                    : `${timeRemaining.days}D ${timeRemaining.hours}H ${timeRemaining.minutes}M LEFT`}
                </span>
              </div>

              <div className="ml-1 bg-[#707070] hover:bg-[#8B8B8B] text-[#FFFF55] font-black text-[10px] px-2 py-1 border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] shadow-[1px_1px_0px_#000] uppercase hidden xs:inline-block">
                OPEN
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Minecraft GUI Inventory Dialog Screen ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto overflow-x-hidden font-sans overscroll-contain">
            {/* Dark Nether Atmospheric Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer touch-none"
              aria-hidden="true"
            />

            {/* Authentic Minecraft GUI Window */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="minecraft-reg-dialog-title"
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
              className="relative w-full max-w-lg bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000000] z-50 my-auto overflow-hidden select-none"
            >
              {/* ── 1. Minecraft GUI Window Header ── */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2A2A2A] border-b-3 border-b-[#555555] border-t-2 border-t-[#3A3A3A] font-mono">
                {/* Left Title with Gold Star */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFAA00] border border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] flex items-center justify-center text-black font-black text-xs shadow-[1px_1px_0px_#000]">
                    ★
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase text-[#FFAA00] tracking-wider [text-shadow:_1px_1px_0_#000]">
                    NOTICE // REGISTRATION DEADLINE
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

              {/* ── 2. GUI Inner Body (Recessed Stone GUI Canvas) ── */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Main Headline & Description */}
                <div className="text-center space-y-2 py-0.5">
                  <h2
                    id="minecraft-reg-dialog-title"
                    className="font-black text-xl sm:text-2xl text-[#1E1B24] tracking-tight uppercase leading-snug"
                  >
                    DID YOU MISS THE HACKVERSE&apos;26 REGISTRATION?
                  </h2>

                  <div className="text-sm text-black/80 font-bold leading-relaxed max-w-md mx-auto space-y-1">
                    <p>
                      Don’t worry,{" "}
                      <span className="inline-block px-2 py-0.5 bg-[#2E1065] text-[#E9D5FF] font-black border border-t-[#C084FC] border-l-[#C084FC] border-r-[#1E0B36] border-b-[#1E0B36] shadow-[1px_1px_0px_#000] uppercase text-xs sm:text-sm">
                        WE’VE GOT YOU!
                      </span>
                    </p>
                    <p>
                      Still you have time to register your team by{" "}
                      <span className="inline-block px-2 py-0.5 bg-[#14532D] text-[#86EFAC] font-black border border-t-[#4ADE80] border-l-[#4ADE80] border-r-[#052E16] border-b-[#052E16] shadow-[1px_1px_0px_#000] uppercase text-xs sm:text-sm">
                        {newDeadline}
                      </span>
                    </p>
                  </div>
                </div>

                {/* ── 3. Official Deadline Item Tooltip Card ── */}
                <div className="p-3 sm:p-4 bg-[#100C1C] border-3 border-t-[#7E22CE] border-l-[#7E22CE] border-r-[#2E1065] border-b-[#2E1065] shadow-[3px_3px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-black uppercase text-[#55FF55] tracking-wider mb-0.5 [text-shadow:_1px_1px_0_#000]">
                      <CheckCircle2 className="w-4 h-4 text-[#55FF55] stroke-[2.5px]" />
                      <span>OFFICIAL REGISTRATION DEADLINE</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-[#FFFF55] tracking-tight [text-shadow:_1px_1px_0_#000]">
                      {newDeadline}
                    </div>
                  </div>
                </div>

                {/* ── 4. Minecraft Inventory Recessed Item Slots (Countdown) ── */}
                <div className="p-3 bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-black uppercase tracking-wider">
                    <span className="text-[#55FFFF] flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                      <span className="w-2 h-2 bg-[#55FFFF] border border-black inline-block animate-pulse" />
                      TIME REMAINING:
                    </span>
                    <span className="text-[#FFAA00] [text-shadow:_1px_1px_0_#000]">
                      {timeRemaining.isExpired ? "CLOSED" : "LIVE TICKER"}
                    </span>
                  </div>

                  {/* 4 Inset Item Slots */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {/* DAYS Slot (Gold) */}
                    <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                      <div className="text-2xl sm:text-3xl font-black text-[#FFAA00] leading-none [text-shadow:_1px_1px_0_#000]">
                        {String(timeRemaining.days).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                        DAYS
                      </div>
                    </div>

                    {/* HOURS Slot (Iron) */}
                    <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                      <div className="text-2xl sm:text-3xl font-black text-[#FFFFFF] leading-none [text-shadow:_1px_1px_0_#000]">
                        {String(timeRemaining.hours).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                        HOURS
                      </div>
                    </div>

                    {/* MINS Slot (Diamond) */}
                    <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                      <div className="text-2xl sm:text-3xl font-black text-[#55FFFF] leading-none [text-shadow:_1px_1px_0_#000]">
                        {String(timeRemaining.minutes).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                        MINS
                      </div>
                    </div>

                    {/* SECS Slot (Redstone) */}
                    <div className="p-2 bg-[#2B2B2B] border-2 border-t-[#181818] border-l-[#181818] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                      <div className="text-2xl sm:text-3xl font-black text-[#FF5555] leading-none [text-shadow:_1px_1px_0_#000]">
                        {String(timeRemaining.seconds).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-bold text-[#E0E0E0] uppercase mt-1">
                        SECS
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 5. Action Buttons (Enchanted Primary & Stone Secondary) ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 font-mono">
                  {/* Primary CTA: Enchanted Button */}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="flex-1 h-12 px-5 bg-[#6B21A8] hover:bg-[#7E22CE] text-[#FFFF55] font-black text-sm sm:text-base uppercase tracking-wider border-3 border-t-[#C084FC] border-l-[#C084FC] border-r-[#3B0764] border-b-[#3B0764] active:border-t-[#3B0764] active:border-l-[#3B0764] active:border-r-[#C084FC] active:border-b-[#C084FC] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Rocket className="w-5 h-5 stroke-[2.5px] text-[#FFFF55]" />
                    <span>REGISTER YOUR TEAM NOW</span>
                    <span className="text-base">→</span>
                  </button>

                  {/* Secondary Dismiss Button: Stone Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="sm:w-28 h-12 px-4 bg-[#707070] hover:bg-[#858585] text-white hover:text-[#FFFF55] font-black text-sm uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    GOT IT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
