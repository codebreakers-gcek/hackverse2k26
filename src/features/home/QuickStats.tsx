import React from "react";
import { EVENT_DATA } from "@/data/event";

export function QuickStats() {
  const bgClasses = [
    "bg-neo-secondary",
    "bg-white",
    "bg-neo-muted",
    "bg-neo-accent",
  ];

  return (
    <section className="py-12 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {EVENT_DATA.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`border-4 border-black ${bgClasses[i % bgClasses.length]} p-6 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-150`}
            >
              <div className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-black/70 uppercase">
                {stat.change}
              </div>
              <div className="font-black text-3xl sm:text-5xl text-black my-1 font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="font-black text-xs sm:text-sm text-black uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
