"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

function MinecraftDiamondAxe({ isHovered, isClicking }: { isHovered: boolean; isClicking: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="36"
      height="36"
      className="pointer-events-none select-none"
      shapeRendering="crispEdges"
      style={{
        filter: isHovered
          ? "drop-shadow(0 0 8px #55FFFF) drop-shadow(2px 2px 0px #000)"
          : "drop-shadow(2px 2px 0px rgba(0,0,0,0.85))",
      }}
    >
      {/* Handle / Wooden Stick */}
      <rect x="1" y="14" width="1" height="1" fill="#2E1B0E" />
      <rect x="2" y="13" width="1" height="1" fill="#4D2E17" />
      <rect x="2" y="14" width="1" height="1" fill="#3D2412" />
      <rect x="3" y="12" width="1" height="1" fill="#693F1F" />
      <rect x="3" y="13" width="1" height="1" fill="#523118" />
      <rect x="4" y="11" width="1" height="1" fill="#875128" />
      <rect x="4" y="12" width="1" height="1" fill="#693F1F" />
      <rect x="5" y="10" width="1" height="1" fill="#875128" />
      <rect x="5" y="11" width="1" height="1" fill="#693F1F" />
      <rect x="6" y="9" width="1" height="1" fill="#A06030" />
      <rect x="6" y="10" width="1" height="1" fill="#875128" />
      <rect x="7" y="8" width="1" height="1" fill="#A06030" />
      <rect x="7" y="9" width="1" height="1" fill="#875128" />
      <rect x="8" y="7" width="1" height="1" fill="#A06030" />
      <rect x="8" y="8" width="1" height="1" fill="#875128" />
      <rect x="9" y="6" width="1" height="1" fill="#875128" />
      <rect x="9" y="7" width="1" height="1" fill="#693F1F" />
      <rect x="10" y="5" width="1" height="1" fill="#693F1F" />

      {/* Diamond Axe Head Outlines */}
      <rect x="5" y="1" width="4" height="1" fill="#0D2E35" />
      <rect x="4" y="2" width="1" height="4" fill="#0D2E35" />
      <rect x="9" y="2" width="2" height="1" fill="#0D2E35" />
      <rect x="11" y="3" width="1" height="2" fill="#0D2E35" />
      <rect x="10" y="5" width="1" height="2" fill="#0D2E35" />
      <rect x="8" y="5" width="2" height="1" fill="#0D2E35" />
      <rect x="7" y="6" width="1" height="1" fill="#0D2E35" />
      <rect x="5" y="6" width="2" height="1" fill="#0D2E35" />

      {/* Diamond Blade Fill (Highlights & Depth) */}
      <rect x="5" y="2" width="4" height="1" fill="#75FFFF" />
      <rect x="5" y="3" width="1" height="3" fill="#75FFFF" />
      <rect x="6" y="3" width="3" height="1" fill="#4AEDED" />
      <rect x="9" y="3" width="2" height="1" fill="#2CC5C5" />
      <rect x="6" y="4" width="3" height="1" fill="#2CC5C5" />
      <rect x="9" y="4" width="2" height="1" fill="#1B9B9B" />
      <rect x="6" y="5" width="2" height="1" fill="#1B9B9B" />
      <rect x="8" y="4" width="1" height="1" fill="#1B9B9B" />
      <rect x="7" y="5" width="1" height="1" fill="#126868" />
    </svg>
  );
}

export function CustomCursor() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // Only mount on devices with a mouse/fine pointer (ignore touchscreens)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Dynamic hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, input, select, textarea, [role='button'], .cursor-pointer"
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Do not show custom cursor on admin dashboard or before mounting
  if (!mounted || !isVisible || pathname?.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-[9999] select-none"
    >
      {/* Minecraft Axe Cursor Pointer */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-22%",
          translateY: "-10%",
        }}
        animate={{
          scale: isClicking ? 0.9 : isHovered ? 1.15 : 1,
          rotate: isClicking ? -38 : isHovered ? -12 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
          mass: 0.1,
        }}
        className="fixed top-0 left-0 origin-[25%_15%] pointer-events-none"
      >
        <MinecraftDiamondAxe isHovered={isHovered} isClicking={isClicking} />

        {/* Critical Hit Sparkle on Click */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 1.4, opacity: 0, x: -8, y: -8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-1 -left-1 text-xs font-mono font-black text-[#55FFFF] pointer-events-none [text-shadow:_0_0_4px_#FFF]"
            >
              ✦
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
