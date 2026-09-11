import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { Layers } from "lucide-react";

export function PillarCards() {
  const badgeColors: Record<string, string> = {
    "1": "bg-[#FFAA00] text-black border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]",
    "2": "bg-[#55FF55] text-black border-t-[#9EFF9E] border-l-[#9EFF9E] border-r-[#1B801B] border-b-[#1B801B]",
    "3": "bg-[#55FFFF] text-black border-t-[#A6FFFF] border-l-[#A6FFFF] border-r-[#008B8B] border-b-[#008B8B]",
    "4": "bg-[#FF5555] text-white border-t-[#FFA6A6] border-l-[#FFA6A6] border-r-[#8B0000] border-b-[#8B0000]",
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFAA00] stroke-[2.5px]" />
          <h3 className="font-mono font-black text-base sm:text-xl uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
            CORE OPPORTUNITY PILLARS
          </h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#55FFFF] hidden sm:inline-block [text-shadow:_1px_1px_0_#000]">
          ★ 4 DISTINCT VALUE DOMAINS ★
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {ABOUT_DATA.pillars.map((pillar) => {
          const badgeClass =
            badgeColors[pillar.number] ||
            "bg-[#FFAA00] text-black border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]";

          return (
            <div
              key={pillar.number}
              className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 sm:p-8 shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] transition-all duration-150 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#8B8B8B] pb-3 mb-4">
                  {/* Number Badge (Minecraft Inset Slot) */}
                  <span className="font-mono text-xl sm:text-2xl font-black bg-[#2B2B2B] text-[#55FFFF] px-3 py-1 border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] [text-shadow:_1px_1px_0_#000]">
                    0{pillar.number}
                  </span>
                  <span
                    className={`font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 shadow-[2px_2px_0px_#000] ${badgeClass}`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="font-mono font-black text-xl sm:text-2xl text-black uppercase tracking-tight mb-1">
                  {pillar.title}
                </h3>
                <div className="font-mono text-xs font-black uppercase text-[#333333] mb-4">
                  // {pillar.subtitle}
                </div>

                {/* Description Inset Slot */}
                <div className="p-3.5 bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]">
                  <p className="font-mono text-xs sm:text-sm font-bold text-white [text-shadow:_1px_1px_0_#000] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#8B8B8B] font-mono text-[11px] font-black uppercase text-black/80 flex items-center justify-between">
                <span>EXPLORE WITH CODEBREAKERS SQUAD</span>
                <span className="text-[#5B8731] font-black">★ ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
