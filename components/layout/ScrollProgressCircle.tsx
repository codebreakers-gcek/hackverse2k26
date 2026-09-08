"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollProgressCircle() {
  const { scrollY, scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  // Update scroll percentage and visibility smoothly
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 60);
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 100));
  });

  // Check initial state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setVisible(window.scrollY > 60);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setPercent(Math.round((window.scrollY / totalHeight) * 100));
      }
    }
  }, []);

  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-progress-circle"
          initial={{ opacity: 0, scale: 0.5, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={scrollToHome}
          aria-label={`Scroll to top. Currently at ${percent}%`}
          title={`Scroll to top (${percent}%)`}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-black bg-white shadow-neo hover:shadow-neo-lg overflow-hidden flex items-center justify-center cursor-pointer transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black"
        >
          {/* Wave Water Level Layer */}
          <div
            className="absolute inset-x-0 bottom-0 bg-neo-secondary border-t-2 border-black/30 transition-[height] duration-150 ease-out pointer-events-none"
            style={{ height: `${Math.min(100, Math.max(0, percent))}%` }}
          >
            {/* Animated Wave Crest */}
            <motion.svg
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2.5 sm:-top-3 left-0 w-[200%] h-3 sm:h-3.5 fill-neo-secondary text-neo-secondary pointer-events-none"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
            >
              <path d="M 0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 20 H 0 Z" />
            </motion.svg>
          </div>

          {/* Center Arrow Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[3px]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
