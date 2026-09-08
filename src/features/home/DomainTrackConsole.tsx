"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Cpu, Sparkles, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { EVENT_DATA } from "@/data/event";
import { SectionTitle } from "@/components/common/SectionTitle";

export function DomainTrackConsole() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-8 h-8 stroke-[3px]" />,
    Cpu: <Cpu className="w-8 h-8 stroke-[3px]" />,
    Sparkles: <Sparkles className="w-8 h-8 stroke-[3px]" />,
    GitBranch: <GitBranch className="w-8 h-8 stroke-[3px]" />,
  };

  const currentTrack = EVENT_DATA.tracks[selectedTrackIndex];

  return (
    <section className="py-20 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="SYS.TRACK // ARENAS"
          title="CHOOSE YOUR"
          highlightText="BATTLEGROUND"
          subtitle="Explore the four primary technical divisions powering INNOVEX '26. From non-stop hackathons to high-speed algorithmic combat."
        />

        {/* The Console Shell */}
        <div className="border-4 border-black bg-white shadow-neo-lg overflow-hidden">
          {/* Console Header Bar */}
          <div className="bg-black text-white px-6 py-3 border-b-4 border-black flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-neo-accent inline-block border border-white" />
              <span className="w-3 h-3 bg-neo-secondary inline-block border border-white" />
              <span className="w-3 h-3 bg-neo-muted inline-block border border-white" />
              <span className="font-mono text-xs font-black tracking-widest uppercase ml-2">
                INTERACTIVE DOMAIN CONSOLE // CODEBREAKERS GCEK
              </span>
            </div>
            <div className="font-mono text-[11px] font-bold text-neo-secondary">
              [ STATUS: ALL ARENAS LIVE ]
            </div>
          </div>

          {/* Console Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b-4 border-black bg-neo-bg">
            {EVENT_DATA.tracks.map((track, idx) => {
              const isSelected = idx === selectedTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackIndex(idx)}
                  className={clsx(
                    "p-4 text-left font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 flex items-center justify-between border-r-4 border-black last:border-r-0",
                    "focus:outline-none focus:bg-neo-secondary",
                    isSelected
                      ? "bg-neo-secondary text-black shadow-inner"
                      : "bg-white hover:bg-neutral-100 text-black/80"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs opacity-60">0{idx + 1}.</span>
                    <span className="truncate">{track.name.split(" ")[0]}</span>
                  </div>
                  {isSelected && <span className="w-2 h-2 bg-black rounded-full" />}
                </button>
              );
            })}
          </div>

          {/* Console Active Content Panel */}
          <div className="p-6 sm:p-10 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Column: Icon & Headline */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-neo-accent text-black border-4 border-black flex items-center justify-center shadow-neo-sm">
                    {iconMap[currentTrack.icon] || <Terminal className="w-8 h-8 stroke-[3px]" />}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 border border-black">
                      {currentTrack.code}
                    </span>
                    <h3 className="font-black text-2xl sm:text-4xl text-black uppercase tracking-tight mt-1">
                      {currentTrack.name}
                    </h3>
                  </div>
                </div>

                <div className="inline-block bg-neo-muted border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
                  {currentTrack.tagline}
                </div>

                <p className="text-base sm:text-lg font-bold text-black/85 leading-relaxed">
                  {currentTrack.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 border-t-2 border-black/15">
                  <div className="font-mono text-xs font-black text-black/60 uppercase">
                    ARENA HIGHLIGHTS:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTrack.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 font-bold text-sm text-black">
                        <CheckCircle2 className="w-4 h-4 text-neo-accent shrink-0 stroke-[3px]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions Box */}
              <div className="border-4 border-black bg-neo-bg p-6 shadow-neo space-y-4 text-center flex flex-col justify-center">
                <div className="font-mono text-xs font-black uppercase text-black/70">
                  READY TO ENTER ARENA?
                </div>
                <div className="font-black text-xl text-black uppercase">
                  SUBMIT SQUAD ENTRY
                </div>
                <p className="text-xs font-bold text-black/75">
                  Choose this track in the registration form or explore predefined problem statements.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/problem-statements"
                    className="w-full h-12 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-50 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>VIEW PROBLEM REPO</span>
                    <ArrowRight className="w-4 h-4 stroke-[3px]" />
                  </Link>

                  <Link
                    href="/register"
                    className="w-full h-12 bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neo-accent/90 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>REGISTER FOR THIS TRACK</span>
                    <ArrowRight className="w-4 h-4 stroke-[3px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
