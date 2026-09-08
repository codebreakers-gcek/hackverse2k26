import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SCHEDULE_DATA } from "@/data/schedule";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Schedule // HACKVERSE '26",
  description:
    "Official multi-phase competition schedule for HACKVERSE '26 from launch to the Grand Finale at GCEK Campus, Bhawanipatna.",
};

export default function SchedulePage() {
  const data = SCHEDULE_DATA;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Header Title */}
        <SectionTitle
          tag="TIMELINE // MILESTONES"
          title="EVENT"
          highlightText="SCHEDULE"
          subtitle={data.subtitle}
        />

        {/* Highlight Meta Badge Bar */}
        <div className="border-4 border-black bg-white p-4 sm:p-5 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <Calendar className="w-5 h-5 text-black stroke-[3px]" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-black uppercase text-black/60 block">
                FINALE TIMEFRAME
              </span>
              <span className="font-black text-sm sm:text-base text-black">
                {data.metaInfo.dates}
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-0.5 h-10 bg-black/20" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-accent border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <MapPin className="w-5 h-5 text-black stroke-[3px]" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-black uppercase text-black/60 block">
                VENUE LOCATION
              </span>
              <span className="font-black text-sm sm:text-base text-black">
                {data.metaInfo.venue}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Timeline Cards */}
        <div className="space-y-6">
          {data.phases.map((phase, idx) => {
            const isCompleted = phase.status === "completed";
            const isOngoing = phase.status === "ongoing";

            const statusBadge = isCompleted ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neutral-200 text-black border-2 border-black">
                COMPLETED
              </span>
            ) : isOngoing ? (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-emerald-400 text-black border-2 border-black flex items-center gap-1.5 shadow-neo-sm">
                <span className="w-2 h-2 rounded-full bg-black inline-block" />
                ONGOING PHASE
              </span>
            ) : (
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-secondary text-black border-2 border-black">
                UPCOMING
              </span>
            );

            return (
              <div
                key={idx}
                className="border-4 border-black bg-white shadow-neo p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative"
              >
                {/* Left Phase Column */}
                <div className="md:w-56 shrink-0 flex md:flex-col items-center md:items-start justify-between border-b-2 md:border-b-0 md:border-r-2 border-black pb-4 md:pb-0 md:pr-6 gap-3">
                  <div>
                    <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-black/20">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 mt-1 inline-block">
                      {phase.phase}
                    </span>
                  </div>
                  <div>{statusBadge}</div>
                </div>

                {/* Right Content Column */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/20 pb-3">
                    <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
                      {phase.title}
                    </h3>
                    <span className="font-mono text-xs sm:text-sm font-black bg-neo-bg px-3 py-1 border-2 border-black inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      {phase.displayDates}
                    </span>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2.5 pt-1">
                    {phase.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 stroke-[3px] shrink-0 mt-0.5 ${isCompleted
                            ? "text-neutral-400"
                            : isOngoing
                              ? "text-emerald-600"
                              : "text-purple-600"
                            }`}
                        />
                        <span className="font-bold text-xs sm:text-sm text-black leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Progress Indicator */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between font-mono text-[11px] font-black text-black/70 mb-1">
                      <span>PHASE PROGRESS</span>
                      <span>{phase.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 border-2 border-black bg-neutral-100 overflow-hidden">
                      <div
                        className={`h-full border-r-2 border-black transition-all duration-500 ${isCompleted
                          ? "bg-neutral-400"
                          : isOngoing
                            ? "bg-emerald-400"
                            : "bg-neo-secondary"
                          }`}
                        style={{ width: `${phase.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="border-4 border-black bg-neo-secondary p-8 sm:p-10 shadow-neo text-center space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm">
            <Flame className="w-4 h-4 text-neo-accent" />
            COMPETITION ROADMAP
          </div>

          <h3 className="font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            READY TO START YOUR JOURNEY?
          </h3>

          <p className="font-bold text-sm sm:text-base text-black/85 max-w-xl mx-auto">
            Join hundreds of collegiate innovators in this epic 36-hour coding adventure. Register your squad before the portal deadline!
          </p>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-900 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>
        </div>
      </div>

      <MarqueeBanner bg="secondary" speed="normal" />
    </div>
  );
}
