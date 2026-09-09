import React from "react";
import Link from "next/link";
import { Trophy, Award, Gift, ArrowRight } from "lucide-react";
import { EVENT_DATA } from "@/data/event";
import { SectionTitle } from "@/components/common/SectionTitle";

export function PrizePoolBanner() {
  const colorMap = {
    secondary: "bg-neo-secondary border-black",
    accent: "bg-neo-accent border-black",
    muted: "bg-neo-muted border-black",
    white: "bg-white border-black",
  };

  return (
    <section className="py-20 bg-grid-paper border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="REWARDS // BOUNTY"
          title="STATE"
          highlightText="PRIZE POOL"
          subtitle="Compete for a total cash bounty of ₹35K+ along with cloud credits, exclusive developer swag, direct internship referrals, and prestigious winner trophies."
        />

        {/* Prize Grid: 3 Equal Wide Columns for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {EVENT_DATA.prizes.map((prize, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={prize.position}
                className={`border-4 border-black ${colorMap[prize.color]} p-6 sm:p-8 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between relative`}
              >
                {isFirst && (
                  <div className="absolute -top-4 -right-3 bg-black text-white font-mono text-[11px] font-black uppercase px-3.5 py-1 border-2 border-black rotate-3 shadow-neo-sm">
                    ★ GRAND CHAMPION
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    {isFirst ? (
                      <Trophy className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3px] text-black" />
                    ) : (
                      <Award className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3px] text-black" />
                    )}
                    <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-black/75">
                      RANK 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-snug mb-3">
                    {prize.position}
                  </h3>

                  <div className="font-black text-5xl sm:text-6xl text-black font-mono my-4 border-y-3 border-black/20 py-3 tracking-tight">
                    {prize.amount}
                  </div>

                  <div className="space-y-2.5 mt-5">
                    <div className="font-mono text-xs font-black uppercase text-black/70">
                      INCLUDED BOUNTIES:
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm font-bold text-black/90">
                      {prize.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-black font-black text-sm">▸</span>
                          <span className="leading-snug">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-black/20">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-black/80 block text-center">
                    VERIFIED CASH DISBURSAL
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="border-4 border-black bg-black text-white p-5 sm:p-8 shadow-neo flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-neo-secondary text-black border-2 border-white flex items-center justify-center shrink-0">
              <Gift className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3px]" />
            </div>
            <div>
              <h4 className="font-black text-lg sm:text-2xl uppercase tracking-wider text-neo-secondary leading-tight">
                SWAG KITS &amp; CERTIFICATES FOR EVERY PARTICIPANT
              </h4>
              <p className="text-xs sm:text-sm font-bold text-white/80 mt-1 leading-relaxed">
                Every team presenting a functional project receives verified STATE participation certificates, sticker packs, and food/refreshment passes during the 36-hour sprint.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="w-full md:w-auto h-12 px-6 bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-white hover:bg-white transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <span>CLAIM YOUR SQUAD SLOT</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
