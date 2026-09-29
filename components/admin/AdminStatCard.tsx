"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  colorBg?: string; // e.g. "bg-amber-400", "bg-cyan-400", "bg-lime-400", "bg-rose-400", "bg-violet-400"
  badgeText?: string;
  badgeBg?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
}

export function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  colorBg = "bg-amber-400",
  badgeText,
  badgeBg = "bg-neutral-800 text-neutral-200 border-neutral-700",
  trend,
}: AdminStatCardProps) {
  return (
    <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:border-neutral-700 hover:shadow-[5px_5px_0px_0px_#000000] text-white">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 border-2 border-black/30 ${colorBg} text-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#000000]`}
          >
            <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
          </div>
          <span className="font-mono text-xs font-black uppercase text-neutral-400 tracking-wider">
            {title}
          </span>
        </div>
        {badgeText && (
          <span
            className={`px-2 py-0.5 border font-mono text-[10px] font-black uppercase ${badgeBg}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="font-mono text-3xl md:text-4xl font-black tracking-tight text-white">
          {value}
        </div>
        {trend && (
          <span
            className={`font-mono text-xs font-bold ${
              trend.isPositive ? "text-emerald-400" : "text-neutral-500"
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>

      {description && (
        <div className="mt-2 text-xs font-medium text-neutral-400 border-t border-neutral-800 pt-2 flex items-center justify-between">
          <span className="truncate">{description}</span>
        </div>
      )}
    </div>
  );
}
