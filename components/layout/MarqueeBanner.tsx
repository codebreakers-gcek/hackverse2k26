import React from "react";
import clsx from "clsx";
import { Star } from "lucide-react";

export interface MarqueeBannerProps {
  items?: string[];
  bg?: "secondary" | "accent" | "muted" | "black" | "white";
  speed?: "normal" | "fast";
  direction?: "left" | "right";
  bended?: boolean;
  className?: string;
}

export function MarqueeBanner({
  items = [
    "HACKVERSE '26",
    "36-HOUR SPRINT",
    "₹35K+ PRIZE POOL",
    "CODEBREAKERS GCEK",
    "AI / ML TRACK",
    "CYBERSECURITY ARENA",
    "BHABANIPATNA ODISHA",
  ],
  bg = "secondary",
  speed = "normal",
  bended = false,
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

  const bannerElement = (
    <div
      className={clsx(
        "relative w-full max-w-full overflow-hidden py-3.5 select-none flex items-center shadow-neo",
        bgStyles[bg],
        bended && "rotate-[-2deg] sm:rotate-[-1.5deg] scale-[1.03] my-4 shadow-neo-lg z-20",
        className
      )}
    >
      <div className={clsx("flex items-center gap-8 whitespace-nowrap will-change-transform min-w-0", animClass)}>
        {[...items, ...items, ...items, ...items].map((text, i) => (
          <div key={i} className="inline-flex items-center gap-6 font-black text-sm sm:text-base tracking-widest uppercase">
            <span>{text}</span>
            <Star className="w-5 h-5 fill-current stroke-[2.5px] text-current inline-block" />
          </div>
        ))}
      </div>
    </div>
  );

  if (bended) {
    return (
      <div className="relative w-full max-w-full overflow-hidden py-3">
        {bannerElement}
      </div>
    );
  }

  return bannerElement;
}
