import React from "react";
import Link from "next/link";
import { Terminal, Code, Users, ExternalLink, ArrowRight } from "lucide-react";
import { ENV } from "@/config/env";
import { EVENT_DATA } from "@/data/event";

export function CodeBreakersSpotlight() {
  return (
    <section className="py-20 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-4 border-black bg-white shadow-neo-lg p-8 sm:p-12 relative overflow-hidden">
          {/* Top Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neo-accent text-black border-3 border-black flex items-center justify-center shadow-neo-sm">
                <Terminal className="w-7 h-7 stroke-[3px]" />
              </div>
              <div>
                <span className="font-mono text-xs font-black uppercase text-black/60">
                  OFFICIAL HOST CLUB
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  CODEBREAKERS // GCEK
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-secondary border-2 border-black">
                ESTD. 2019
              </span>
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-muted border-2 border-black">
                500+ BUILDERS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                FOSTERING TECHNICAL EXCELLENCE &amp; HACKATHON CULTURE IN ODISHA
              </h4>
              <p className="text-base font-bold text-black/80 leading-relaxed">
                CodeBreakers is the premier student-led technical body of Government College of Engineering Kalahandi. As builders who develop and deploy the institute&apos;s digital infrastructure and manage flagship college events like INSPRANO and UDAAN, we created HACKVERSE &apos;26 to give developers nationwide a pure, non-stop platform to build real software.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="border-3 border-black bg-neo-bg p-4 shadow-neo-sm">
                  <Code className="w-6 h-6 text-black stroke-[3px] mb-2" />
                  <div className="font-black text-sm uppercase">COMPETITIVE CODING</div>
                  <p className="font-mono text-xs text-black/70 mt-1">
                    Regular 9-Lock and CodeChef contests.
                  </p>
                </div>

                <div className="border-3 border-black bg-neo-bg p-4 shadow-neo-sm">
                  <Terminal className="w-6 h-6 text-black stroke-[3px] mb-2" />
                  <div className="font-black text-sm uppercase">REAL-WORLD APPS</div>
                  <p className="font-mono text-xs text-black/70 mt-1">
                    Production systems shipped for 5000+ users.
                  </p>
                </div>

                <div className="border-3 border-black bg-neo-bg p-4 shadow-neo-sm">
                  <Users className="w-6 h-6 text-black stroke-[3px] mb-2" />
                  <div className="font-black text-sm uppercase">PEER MENTORSHIP</div>
                  <p className="font-mono text-xs text-black/70 mt-1">
                    Seniors &amp; alumni guiding juniors daily.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="border-4 border-black bg-neo-secondary p-6 shadow-neo space-y-4 text-center">
              <div className="font-mono text-xs font-black uppercase text-black/70">
                HOST INSTITUTION
              </div>
              <div className="font-black text-xl text-black uppercase leading-snug">
                GOVERNMENT COLLEGE OF ENGINEERING KALAHANDI
              </div>
              <p className="text-xs font-bold text-black/80">
                Bandopala, Bhawanipatna, Kalahandi, Odisha - 766002
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={ENV.OFFICIAL_CLUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-white text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>CLUB WEBSITE</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
                </a>

                <Link
                  href="/about"
                  className="w-full h-11 bg-black text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:bg-neutral-900 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>LEARN MORE ABOUT US</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
