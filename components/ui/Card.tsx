import React, { HTMLAttributes } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  liftOnHover?: boolean;
  shadowSize?: "sm" | "md" | "lg" | "xl";
  bg?: "white" | "cream" | "secondary" | "muted" | "accent" | "black";
}

export function Card({
  className,
  liftOnHover = true,
  shadowSize = "md",
  bg = "white",
  children,
  ...props
}: CardProps) {
  const bgStyles = {
    white: "bg-white text-black",
    cream: "bg-neo-bg text-black",
    secondary: "bg-neo-secondary text-black",
    muted: "bg-neo-muted text-black",
    accent: "bg-neo-accent text-black",
    black: "bg-black text-white",
  };

  const shadowStyles = {
    sm: "shadow-neo-sm",
    md: "shadow-neo",
    lg: "shadow-neo-lg",
    xl: "shadow-neo-xl",
  };

  return (
    <div
      className={clsx(
        "border-4 border-black rounded-none relative transition-all duration-150",
        bgStyles[bg],
        shadowStyles[shadowSize],
        liftOnHover && "hover:-translate-y-1 hover:shadow-neo-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  bg = "muted",
}: {
  className?: string;
  children: React.ReactNode;
  bg?: "muted" | "secondary" | "accent" | "black" | "white";
}) {
  const bgClasses = {
    muted: "bg-neo-muted text-black",
    secondary: "bg-neo-secondary text-black",
    accent: "bg-neo-accent text-black",
    black: "bg-black text-white",
    white: "bg-white text-black",
  };

  return (
    <div
      className={clsx(
        "border-b-4 border-black px-6 py-4 flex items-center justify-between font-black uppercase tracking-wider",
        bgClasses[bg],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("p-6", className)}>{children}</div>;
}
