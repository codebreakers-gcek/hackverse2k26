"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export function AmbientCodeShapes() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Soft Ambient Color Glows in the background */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-neo-secondary/12 blur-[80px]" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-neo-accent/10 blur-[80px]" />
      <div className="absolute top-2/3 -left-20 w-80 h-80 rounded-full bg-neo-muted/15 blur-[80px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-neo-secondary/10 blur-[80px]" />

      {/* 2. Floating Blurry Code Snippet 1 - Top Left Terminal Call */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -14, 0],
                rotate: [-2, 1, -2],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 left-[3%] sm:left-[6%] opacity-35 blur-[1.5px]"
      >
        <div className="font-mono text-xs bg-black/5 p-3 rounded-lg border border-black/15 shadow-sm text-neutral-800">
          <span className="text-emerald-700 font-bold">$</span> cargo run
          --release --hackverse
        </div>
      </motion.div>

      {/* 3. Floating Blurry Code Snippet 2 - Top Right JSON Object */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 16, 0],
                rotate: [2, -1, 2],
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-72 right-[3%] sm:right-[5%] opacity-30 blur-[2px]"
      >
        <div className="font-mono text-xs bg-neo-secondary/20 p-3 rounded-xl border border-black/10 text-neutral-900">
          <div className="font-bold">&#123; arena: &quot;36h-sprint&quot;,</div>
          <div className="font-bold pl-4">bountyPool: 35K &#125;</div>
        </div>
      </motion.div>

      {/* 4. Large Faded & Blurred Code Brackets - Mid Left */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -20, 0],
                scale: [1, 1.04, 1],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[42%] left-[2%] opacity-15 blur-[2.5px]"
      >
        <div className="font-mono text-7xl sm:text-8xl font-black text-black">
          &lt;/&gt;
        </div>
      </motion.div>

      {/* 5. Floating Binary Stream Pill - Mid Right */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 14, 0],
                rotate: [-1, 2, -1],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-[58%] right-[2%] sm:right-[4%] opacity-25 blur-[1.5px]"
      >
        <div className="font-mono text-[11px] bg-neo-accent/15 p-2.5 rounded-lg border border-black/10 tracking-widest text-neutral-900 font-bold">
          01000011 01000010
          <br />
          // CODEBREAKERS_GCEK
        </div>
      </motion.div>

      {/* 6. Floating Async Function Snippet - Lower Left */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -12, 0],
                rotate: [1, -1, 1],
              }
        }
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[75%] left-[4%] opacity-25 blur-[2px]"
      >
        <div className="font-mono text-xs bg-neo-muted/25 p-3 rounded-lg border border-black/10 text-emerald-950 font-bold">
          async function solve() &#123;
          <br />
          &nbsp;&nbsp;await deployPrototype();
          <br />
          &#125;
        </div>
      </motion.div>

      {/* 7. Floating Hex/Status Chip - Lower Right */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 15, 0],
                rotate: [2, -2, 2],
              }
        }
        transition={{
          duration: 10.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute top-[88%] right-[5%] opacity-25 blur-[1.5px]"
      >
        <div className="font-mono text-xs bg-white/40 p-2.5 rounded-md border border-black/10 text-neutral-800 font-bold">
          [0x5351554144] =&gt; VERIFIED
        </div>
      </motion.div>
    </div>
  );
}
