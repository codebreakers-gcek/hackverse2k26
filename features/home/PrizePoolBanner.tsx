import React from "react";
import Link from "next/link";
import { Trophy, Gift, ArrowRight } from "lucide-react";
import { EVENT_DATA } from "@/data/event";

export function PrizePoolBanner() {
  const tierConfigs = [
    {
      badgeText: "★ DIAMOND CHAMPION ★",
      badgeClass:
        "bg-[#00AAAA] text-white border-2 border-t-[#55FFFF] border-l-[#55FFFF] border-r-[#004f52] border-b-[#004f52]",
      amountColor: "text-[#55FFFF]",
      bulletColor: "text-[#008888]",
    },
    {
      badgeText: "★ GOLD VANGUARD ★",
      badgeClass:
        "bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]",
      amountColor: "text-[#FFAA00]",
      bulletColor: "text-[#B87700]",
    },
    {
      badgeText: "★ REDSTONE FORGER ★",
      badgeClass:
        "bg-[#FF5555] text-white border-2 border-t-[#FFAAAA] border-l-[#FFAAAA] border-r-[#8F1A1A] border-b-[#8F1A1A]",
      amountColor: "text-[#FF5555]",
      bulletColor: "text-[#D93838]",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 border-b-4 border-black overflow-hidden bg-neo-bg bg-grid-paper select-none">
      {/* Minecraft Font Definition */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Minecraft';
              src: url('/font/Minecraft.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            .mc-font {
              font-family: 'Minecraft', 'IBM Plex Mono', monospace;
            }
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minecraft GUI Box (Exact Reference Style) */}
        <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] overflow-hidden">
          {/* Minecraft Header Bar: Grass Block Green */}
          <div className="bg-[#5B8731] border-b-4 border-black border-t-2 border-t-[#85B745] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#2B2B2B] text-[#55FF55] mc-font text-xs font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000]">
                ⚔
              </div>
              <span className="mc-font text-xs sm:text-sm font-black uppercase tracking-wider text-white [text-shadow:_2px_2px_0_#000]">
                OFFICIAL BOUNTY CHEST // ₹35,000+ CASH POOL
              </span>
            </div>

            <Link
              href="/register"
              className="mc-font text-xs font-black uppercase text-[#FFE655] hover:text-white [text-shadow:_1px_1px_0_#000] flex items-center gap-1.5 transition-colors"
            >
              <span>CLAIM SQUAD SLOT</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          </div>

          {/* Minecraft Inset Slot (Matching DomainTrackConsole Reference) */}
          <div className="p-4 sm:p-6 bg-[#C6C6C6]">
            <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-6 sm:p-8 text-center space-y-6">
              {/* Loot Chest / Trophy Box */}
              <div className="w-16 h-16 bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000]">
                <Trophy className="w-8 h-8 text-[#FFAA00] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>

              {/* Title & Tag */}
              <div className="space-y-2">
                <span className="mc-font text-xs font-black uppercase px-3 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] inline-block shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                  [BOUNTY VAULT ACTIVE // ₹35,000+ CASH]
                </span>
                <h3 className="mc-font font-black text-2xl sm:text-4xl uppercase tracking-wider text-black">
                  STATE PRIZE POOL
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/85 max-w-xl mx-auto leading-relaxed mc-font">
                  Compete for cash bounties, trophies, server compute credits, direct interview referrals, and exclusive developer swag.
                </p>
              </div>

              {/* 3 Streamlined Prize Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-left">
                {EVENT_DATA.prizes.map((prize, idx) => {
                  const config = tierConfigs[idx] || tierConfigs[0];
                  return (
                    <div
                      key={prize.position}
                      className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`mc-font text-[10px] font-black uppercase px-2 py-0.5 ${config.badgeClass} shadow-[1px_1px_0_#000] [text-shadow:_1px_1px_0_#000]`}
                          >
                            {config.badgeText}
                          </span>
                          <span className="mc-font text-[9px] font-black text-black/60 uppercase">
                            RANK 0{idx + 1}
                          </span>
                        </div>

                        {/* Cash Bounty Inset Slot */}
                        <div className="bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] p-3 my-2.5 flex items-baseline justify-between shadow-inner">
                          <span className="mc-font text-[10px] font-black text-[#A0A0A0] uppercase">
                            CASH BOUNTY
                          </span>
                          <span
                            className={`mc-font font-black text-2xl sm:text-3xl ${config.amountColor} [text-shadow:_2px_2px_0_#000]`}
                          >
                            {prize.amount}
                          </span>
                        </div>

                        {/* Perk Bullet Points */}
                        <ul className="space-y-1.5 mc-font text-xs font-bold text-black/90 mt-2">
                          {prize.perks.slice(0, 3).map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span
                                className={`${config.bulletColor} font-black text-xs shrink-0 leading-tight`}
                              >
                                ◆
                              </span>
                              <span className="leading-snug text-black/85 text-[11px] sm:text-xs">
                                {perk}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Universal Rewards Mini Hotbar */}
              <div className="bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] p-3 max-w-2xl mx-auto flex items-center justify-center gap-2 text-white mc-font text-[11px] sm:text-xs font-bold shadow-inner">
                <Gift className="w-4 h-4 text-[#FFAA00] shrink-0" />
                <span className="text-[#E0E0E0]">
                  <strong className="text-[#55FF55]">UNIVERSAL PARTICIPANT DROPS:</strong> Verified STATE Certificates • Hacker Swag Kits • Cloud Server Credits • Food Passes
                </span>
              </div>

              {/* Minecraft 3D Beveled Buttons (Exact from Reference Screenshot) */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="bg-[#5B8731] hover:bg-[#689B37] text-white mc-font font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center gap-2 transition-colors"
                >
                  <span>REGISTER SQUAD ON STANDBY</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
                <Link
                  href="/problem-statements"
                  className="bg-[#707070] hover:bg-[#808080] text-white mc-font font-black text-xs uppercase tracking-wider border-4 border-t-[#9e9e9e] border-l-[#9e9e9e] border-r-[#383838] border-b-[#383838] active:border-t-[#383838] active:border-l-[#383838] active:border-r-[#9e9e9e] active:border-b-[#9e9e9e] px-6 py-3 shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000] transition-colors"
                >
                  VIEW CHALLENGE TRACKS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


