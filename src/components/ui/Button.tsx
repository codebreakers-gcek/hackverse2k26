import React, { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "muted" | "black";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-100 rounded-none border-4 border-black select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-neo-accent text-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
      secondary:
        "bg-neo-secondary text-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
      outline:
        "bg-white text-black shadow-neo hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
      muted:
        "bg-neo-muted text-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none",
      black:
        "bg-black text-white shadow-neo-yellow hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_#FFD93D] active:translate-x-1 active:translate-y-1 active:shadow-none",
    };

    const sizeStyles = {
      sm: "h-10 px-4 text-xs font-black",
      md: "h-12 px-6 text-sm font-black",
      lg: "h-14 px-8 text-base font-black",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
