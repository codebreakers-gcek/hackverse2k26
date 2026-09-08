import React from "react";
import clsx from "clsx";
import { Star } from "lucide-react";

export interface MarqueeBannerProps {
  items?: string[];
  bg?: "secondary" | "accent" | "muted" | "black" | "white";
  speed?: "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
}

export function MarqueeBanner({
  items = [
    "HACK NOVA '26",
    "36-HOUR SPRINT",
    "₹1,50,000+ PRIZE POOL",
    "CODEBREAKERS GCEK",
    "AI / ML TRACK",
    "CYBERSECURITY ARENA",
    "ZERO REGISTRATION FEE",
    "BHAVANIPATNA ODISHA",
  ],
  bg = "secondary",
  speed = "normal",
  className,
}: MarqueeBannerProps) {
  const bgStyles = {
    secondary: "bg-neo-secondary text-black border-y-4 border-black",
    accent: "bg-neo-accent text-black border-y-4 border-black",
    muted: "bg-neo-muted text-black border-y-4 border-black",
    black: "bg-black text-white border-y-4 border-black",
    white: "bg-white text-black border-y-4 border-black",
  };

  const animClass = speed === "fast" ? "animate-marquee-fast" : "animate-marquee";

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden py-3 select-none flex items-center shadow-neo-sm",
        bgStyles[bg],
        className
      )}
    >
      <div className={clsx("flex items-center gap-8 whitespace-nowrap will-change-transform", animClass)}>
        {[...items, ...items, ...items, ...items].map((text, i) => (
          <div key={i} className="inline-flex items-center gap-6 font-black text-sm sm:text-base tracking-widest uppercase">
            <span>{text}</span>
            <Star className="w-5 h-5 fill-current stroke-[2.5px] text-current inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
