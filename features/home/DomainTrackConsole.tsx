"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  Sparkles,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Code2,
  Flame,
  Star,
  Layers,
  Lock,
  Clock,
  AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { EVENT_DATA } from "@/data/event";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { SectionTitle } from "@/components/common/SectionTitle";

export function DomainTrackConsole() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isProblemStatementsPublished, setIsProblemStatementsPublished] =
    useState<boolean>(false);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);

  useEffect(() => {
    async function checkSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.settings) {
          if (typeof data.settings.isProblemStatementsPublished === "boolean") {
            setIsProblemStatementsPublished(
              data.settings.isProblemStatementsPublished,
            );
          }
        }
      } catch (err) {
        console.error("Error fetching system settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    checkSettings();
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal className="w-8 h-8 stroke-[3px]" />,
    Cpu: <Cpu className="w-8 h-8 stroke-[3px]" />,
    Sparkles: <Sparkles className="w-8 h-8 stroke-[3px]" />,
    GitBranch: <GitBranch className="w-8 h-8 stroke-[3px]" />,
  };

  const currentTrack = EVENT_DATA.tracks[selectedTrackIndex];

  // Map difficulty colors
  const difficultyStyles: Record<string, string> = {
    Advanced: "bg-rose-400 text-black border-black",
    Intermediate: "bg-neo-secondary text-black border-black",
    Beginner: "bg-emerald-400 text-black border-black",
  };

  return (
    <section className="py-20 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionTitle
          tag="SYS.TRACK // ARENAS"
          title="CHOOSE YOUR"
          highlightText="BATTLEGROUND"
          subtitle="Explore the technical tracks powering HACKVERSE '26. From non-stop hackathons to high-speed engineering combat."
        />

        {/* Problem Statements Marquee / Coming Soon Section */}
        <div className="border-4 border-black bg-white shadow-neo-lg overflow-hidden">
          {/* Marquee Header */}
          <div className="bg-neo-secondary px-6 py-3 border-b-4 border-black flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-black text-white font-mono text-xs font-black flex items-center justify-center border border-black">
                ★
              </div>
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-black">
                {isProblemStatementsPublished
                  ? `LIVE PROBLEM REPOSITORY BROADCAST // ${PROBLEM_STATEMENTS_DATA.length} CHALLENGES STREAMING`
                  : "OFFICIAL CHALLENGE TRACKS // PENDING EMBARGO RELEASE"}
              </span>
            </div>
            <Link
              href="/problem-statements"
              className="font-mono text-xs font-black uppercase text-black hover:underline flex items-center gap-1"
            >
              <span>
                {isProblemStatementsPublished
                  ? "EXPLORE ALL STATEMENTS"
                  : "CHECK RELEASE STATUS"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          </div>

          {!isProblemStatementsPublished ? (
            /* COMING SOON BANNER WHEN UNPUBLISHED */
            <div className="p-8 sm:p-12 bg-amber-50/70 text-center space-y-5">
              <div className="w-14 h-14 bg-neo-accent border-3 border-black mx-auto flex items-center justify-center shadow-neo-sm ">
                <Lock className="w-7 h-7 text-black stroke-[2.5px]" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black inline-block shadow-neo-sm">
                  [EMBARGO ACTIVE // REVEALING SOON]
                </span>
                <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                  PROBLEM STATEMENTS COMING SOON
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/75 max-w-xl mx-auto leading-relaxed">
                  The official problem statements and real-world engineering
                  challenge specs for{" "}
                  <span className="text-black font-black">
                    HACKVERSE &apos;26
                  </span>{" "}
                  are currently under embargo and will be published live soon.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>REGISTER SQUAD ON STANDBY</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
                <Link
                  href="/problem-statements"
                  className="px-6 py-3 bg-white hover:bg-neutral-100 text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm transition-all"
                >
                  VIEW EMBARGO NOTICE
                </Link>
              </div>
            </div>
          ) : (
            /* Marquee Ticker: Continuous Left Flow of Problem Statements when Published */
            <div className="relative w-full overflow-hidden py-5 bg-neo-bg/60 select-none">
              <div className="animate-marquee flex items-center gap-6 will-change-transform">
                {[...PROBLEM_STATEMENTS_DATA, ...PROBLEM_STATEMENTS_DATA].map(
                  (ps, idx) => (
                    <Link
                      key={`${ps.id}-${idx}`}
                      href={`/problem-statements#${ps.id}`}
                      className="group shrink-0 w-72 xs:w-80 sm:w-96 border-3 border-black bg-white p-3.5 sm:p-4 shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all duration-150 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 border-b-2 border-black/15 pb-2">
                          <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                            {ps.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-muted border border-black">
                              {ps.category}
                            </span>
                            <span
                              className={clsx(
                                "font-mono text-[10px] font-black uppercase px-2 py-0.5 border",
                                difficultyStyles[ps.difficulty] ||
                                  "bg-white text-black border-black",
                              )}
                            >
                              {ps.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-black text-sm text-black uppercase tracking-tight line-clamp-1 group-hover:text-neo-accent transition-colors">
                          {ps.title}
                        </h4>

                        {/* Short Description */}
                        <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
                          {ps.shortDescription}
                        </p>
                      </div>

                      {/* Footer CTA */}
                      <div className="mt-3 pt-2 border-t-2 border-black/15 flex items-center justify-between text-xs font-black text-black">
                        <span className="font-mono text-[10px] text-black/60 uppercase">
                          {ps.suggestedStack.slice(0, 2).join(" • ")}
                        </span>
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>VIEW PS</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                        </span>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
