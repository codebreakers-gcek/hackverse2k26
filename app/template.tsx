"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  // Ensure scroll is at the top when navigating between pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
