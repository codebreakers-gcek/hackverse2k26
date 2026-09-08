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
          subtitle="Compete for a total cash bounty of ₹1,50,000+ along with cloud credits, exclusive developer swag, direct internship referrals, and prestigious winner trophies."
        />

        {/* Prize Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {EVENT_DATA.prizes.map((prize, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={prize.position}
                className={`border-4 border-black ${colorMap[prize.color]} p-6 shadow-neo hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-150 flex flex-col justify-between relative`}
              >
                {isFirst && (
                  <div className="absolute -top-4 -right-3 bg-black text-white font-mono text-[10px] font-black uppercase px-3 py-1 border-2 border-black rotate-6 shadow-neo-sm">
                    ★ GRAND CHAMPION
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {isFirst ? (
                      <Trophy className="w-8 h-8 stroke-[3px] text-black" />
                    ) : (
                      <Award className="w-7 h-7 stroke-[3px] text-black" />
                    )}
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-black/70">
                      RANK 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-black uppercase tracking-tight leading-snug mb-2">
                    {prize.position}
                  </h3>

                  <div className="font-black text-4xl sm:text-5xl text-black font-mono my-3 border-y-2 border-black/20 py-2">
                    {prize.amount}
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="font-mono text-[11px] font-black uppercase text-black/60">
                      INCLUDED BOUNTIES:
                    </div>
                    <ul className="space-y-1.5 text-xs font-bold text-black/90">
                      {prize.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-black font-black">▸</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black/20">
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/70 block text-center">
                    VERIFIED CASH DISBURSAL
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="border-4 border-black bg-black text-white p-8 shadow-neo flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neo-secondary text-black border-2 border-white flex items-center justify-center shrink-0">
              <Gift className="w-8 h-8 stroke-[3px]" />
            </div>
            <div>
              <h4 className="font-black text-xl sm:text-2xl uppercase tracking-wider text-neo-secondary">
                SWAG KITS &amp; CERTIFICATES FOR EVERY PARTICIPANT
              </h4>
              <p className="text-sm font-bold text-white/80 mt-1">
                Every team presenting a functional project receives verified STATE participation certificates, sticker packs, and food/refreshment passes during the 36-hour sprint.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="h-12 px-6 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-2 border-white hover:bg-white transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <span>CLAIM YOUR SQUAD SLOT</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
