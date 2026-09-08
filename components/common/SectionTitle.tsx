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
    <div className={clsx("flex flex-col mb-12", alignStyles[align], className)}>
      {tag && (
        <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm mb-3 inline-block">
          [{tag}]
        </span>
      )}
      <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-tight">
        {title}{" "}
        {highlightText && (
          <span className="inline-block bg-neo-secondary px-2 border-3 border-black shadow-neo-sm rotate-1 text-black">
            {highlightText}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base sm:text-lg font-bold text-black/75 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
