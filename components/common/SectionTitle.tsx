import React from "react";
import clsx from "clsx";

export interface SectionTitleProps {
  tag?: string;
  title: string;
  subtitle?: string;
  highlightText?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionTitle({
  tag,
  title,
  subtitle,
  highlightText,
  align = "center",
  className,
}: SectionTitleProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={clsx("flex flex-col mb-6 sm:mb-12 w-full max-w-full overflow-hidden px-1", alignStyles[align], className)}>
      {tag && (
        <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 sm:px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm mb-2 sm:mb-3 inline-block max-w-full truncate">
          [{tag}]
        </span>
      )}
      <h2 className="font-black text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-tight break-words max-w-full">
        {title}{" "}
        {highlightText && (
          <span className="inline-block bg-neo-secondary px-1.5 sm:px-2 border-2 sm:border-3 border-black shadow-neo-sm rotate-1 text-black mt-1 sm:mt-0">
            {highlightText}
          </span>
        )}
      </h2>
      {subtitle && (
        <div className="mt-2.5 sm:mt-4 max-w-2xl inline-block bg-white/95 backdrop-blur-sm border-2 border-black px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-neo-sm">
          <p className="text-xs sm:text-sm md:text-base font-bold text-black leading-relaxed break-words">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
