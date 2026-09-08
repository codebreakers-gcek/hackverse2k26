import React, { HTMLAttributes } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "secondary" | "muted" | "white" | "black";
  shape?: "square" | "pill";
  rotate?: "none" | "1" | "-1" | "2" | "-2" | "3" | "-3";
  shadow?: boolean;
}

export function Badge({
  className,
  variant = "secondary",
  shape = "square",
  rotate = "none",
  shadow = true,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    accent: "bg-neo-accent text-black",
    secondary: "bg-neo-secondary text-black",
    muted: "bg-neo-muted text-black",
    white: "bg-white text-black",
    black: "bg-black text-white",
  };

  const shapeStyles = {
    square: "rounded-none border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest",
    pill: "rounded-full border-2 border-black px-4 py-1 text-xs font-black uppercase tracking-widest",
  };

  const rotateStyles = {
    none: "",
    "1": "rotate-1",
    "-1": "-rotate-1",
    "2": "rotate-2",
    "-2": "-rotate-2",
    "3": "rotate-3",
    "-3": "-rotate-3",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 select-none transition-transform duration-100",
        variantStyles[variant],
        shapeStyles[shape],
        rotateStyles[rotate],
        shadow && "shadow-neo-sm",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
