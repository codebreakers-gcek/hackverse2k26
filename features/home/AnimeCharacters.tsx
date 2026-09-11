"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * ============================================================================
 * ANIME HERO CHARACTERS
 * ============================================================================
 * - Left: Gojo Satoru (/anime/gojo.png)
 * - Right: Ryomen Sukuna (/anime/sukuna.png)
 * 
 * HOW TO REMOVE OR DISABLE:
 * 1. Set `SHOW_ANIME_CHARACTERS = false` below, OR
 * 2. Remove or comment out `<AnimeCharacters />` inside `features/home/HeroSection.tsx`.
 * ============================================================================
 */

export const SHOW_ANIME_CHARACTERS = true;

export function AnimeCharacters() {
  const shouldReduceMotion = useReducedMotion();

  if (!SHOW_ANIME_CHARACTERS) return null;

  return (
    <>
      {/* Gojo Satoru - Left Side */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 xl:left-2 2xl:left-6 bottom-0 z-[1] pointer-events-none select-none hidden lg:block"
        initial={shouldReduceMotion ? { opacity: 0.95 } : { opacity: 0, x: -30 }}
        animate={shouldReduceMotion ? { opacity: 0.95 } : { opacity: 0.95, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -6, 0],
                  transition: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
          className="relative w-56 lg:w-64 xl:w-80 2xl:w-96 h-[400px] lg:h-[460px] xl:h-[540px] 2xl:h-[620px] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]"
        >
          <Image
            src="/anime/gojo.png"
            alt="Gojo Satoru"
            fill
            sizes="(max-width: 1280px) 256px, (max-width: 1536px) 320px, 384px"
            className="object-contain object-bottom"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Ryomen Sukuna - Right Side */}
      <motion.div
        aria-hidden="true"
        className="absolute right-0 xl:right-2 2xl:right-6 bottom-0 z-[1] pointer-events-none select-none hidden lg:block"
        initial={shouldReduceMotion ? { opacity: 0.95 } : { opacity: 0, x: 30 }}
        animate={shouldReduceMotion ? { opacity: 0.95 } : { opacity: 0.95, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, 6, 0],
                  transition: {
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
          className="relative w-56 lg:w-64 xl:w-80 2xl:w-96 h-[400px] lg:h-[460px] xl:h-[540px] 2xl:h-[620px] drop-shadow-[-6px_6px_0px_rgba(0,0,0,1)]"
        >
          <Image
            src="/anime/sukuna.png"
            alt="Ryomen Sukuna"
            fill
            sizes="(max-width: 1280px) 256px, (max-width: 1536px) 320px, 384px"
            className="object-contain object-bottom"
            priority
          />
        </motion.div>
      </motion.div>
    </>
  );
}
