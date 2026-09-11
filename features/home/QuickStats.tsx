import React from "react";
import { EVENT_DATA } from "@/data/event";
import { Trophy, Clock, Users, Flame } from "lucide-react";

export function QuickStats() {
  const statSlotConfigs = [
    {
      slotStyle: "bg-[#FFAA00] text-black border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]",
      tagColor: "bg-black/20 text-black border-black/30",
      icon: Trophy,
      iconColor: "text-black",
    },
    {
      slotStyle: "bg-[#E6E6E6] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#888888] border-b-[#888888]",
      tagColor: "bg-black/15 text-black border-black/25",
      icon: Clock,
      iconColor: "text-black",
    },
    {
      slotStyle: "bg-[#55FFFF] text-black border-4 border-t-[#A6FFFF] border-l-[#A6FFFF] border-r-[#008888] border-b-[#008888]",
      tagColor: "bg-black/20 text-black border-black/30",
      icon: Users,
      iconColor: "text-black",
    },
    {
      slotStyle: "bg-[#FF5555] text-white border-4 border-t-[#FFAAAA] border-l-[#FFAAAA] border-r-[#880000] border-b-[#880000] [text-shadow:_1px_1px_0_#000]",
      tagColor: "bg-black/25 text-white border-white/30",
      icon: Flame,
      iconColor: "text-white",
    },
  ];

  return (
    <section className="py-12 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {EVENT_DATA.stats.map((stat, i) => {
            const config = statSlotConfigs[i % statSlotConfigs.length];
            const Icon = config.icon;

            return (
              <div
                key={stat.label}
                className={`${config.slotStyle} p-4 sm:p-6 shadow-[5px_5px_0px_#000] hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000] transition-all duration-150 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border ${config.tagColor}`}>
                    {stat.change}
                  </span>
                  <Icon className={`w-4 h-4 ${config.iconColor} stroke-[2.5px] shrink-0`} />
                </div>

                <div className="font-black text-2xl xs:text-3xl sm:text-5xl my-1.5 font-mono tracking-tight leading-none">
                  {stat.value}
                </div>

                <div className="font-mono font-black text-xs sm:text-sm uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
