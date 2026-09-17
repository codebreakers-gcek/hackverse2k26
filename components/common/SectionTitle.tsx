import React from "react";
import clsx from "clsx";
import { Sparkles } from "lucide-react";

export interface SectionTitleProps {
  tag?: string;
  title: string;
  subtitle?: string;
  highlightText?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionTitle({
  tag,
  title,
  subtitle,
  highlightText,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
}: SectionTitleProps) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={clsx("flex flex-col mb-6 sm:mb-10 w-full max-w-full overflow-hidden space-y-3", alignStyles[align], className)}>
      {tag && (
        <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]">
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />
          <span>{tag}</span>
        </span>
      )}
      <h2 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000] break-words max-w-full">
        <span className={titleClassName}>{title}</span>{" "}
        {highlightText && (
          <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
            {highlightText}
          </span>
        )}
      </h2>
      {subtitle && (
        <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000] max-w-3xl">
          <p className={clsx("text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed break-words", subtitleClassName)}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

