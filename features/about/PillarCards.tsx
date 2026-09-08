import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { SectionTitle } from "@/components/common/SectionTitle";

export function PillarCards() {
  const colorMap = {
    accent: "bg-neo-accent",
    secondary: "bg-neo-secondary",
    muted: "bg-neo-muted",
    white: "bg-white",
  };

  return (
    <div className="space-y-12">
      <SectionTitle
        tag="PILLARS // VALUES"
        title="CORE OPPORTUNITY"
        highlightText="PILLARS"
        subtitle="Every aspect of HACKVERSE '26 is engineered around maximizing builder value across four distinct domains."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ABOUT_DATA.pillars.map((pillar) => (
          <div
            key={pillar.number}
            className={`border-4 border-black ${colorMap[pillar.color]} p-8 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between border-b-3 border-black/20 pb-3 mb-4">
                <span className="font-mono text-2xl font-black text-black">
                  {pillar.number}
                </span>
                <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border border-black">
                  {pillar.badge}
                </span>
              </div>

              <h3 className="font-black text-2xl text-black uppercase tracking-tight mb-1">
                {pillar.title}
              </h3>
              <div className="font-mono text-xs font-black uppercase text-black/70 mb-4">
                // {pillar.subtitle}
              </div>

              <p className="text-base font-bold text-black/85 leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-black/20 font-mono text-[11px] font-black uppercase text-black/70">
              EXPLORE WITH CODEBREAKERS SQUAD
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
