import React from "react";
import type { Metadata } from "next";
import { EVENT_FORMAT_DATA } from "@/data/eventFormat";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Layers,
  Sparkles,
  Home,
  Wifi,
  Coffee,
  Activity,
  CheckCircle2,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Event Format // HACKVERSE '26",
  description:
    "Official multi-stage evaluation process, Grand Finale structure, accommodation, and event deliverables.",
};

export default function EventFormatPage() {
  const data = EVENT_FORMAT_DATA;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Header Title */}
        <SectionTitle
          tag="STRUCTURE // ROADMAP"
          title="EVENT"
          highlightText="FORMAT"
          subtitle="Understand the multi-stage evaluation process, Grand Finale structure, and event deliverables."
        />

        {/* Notice Card */}
        <div className="border-4 border-black bg-purple-50 p-5 sm:p-6 shadow-neo border-l-8 border-l-purple-600">
          <p className="text-black font-black text-base sm:text-lg">
            {data.noticeHeader.title}
          </p>
          <p className="text-neutral-700 text-sm sm:text-base font-bold mt-1">
            {data.noticeHeader.subtitle}
          </p>
        </div>

        {/* Section 1: Evaluation Process and Criteria (Stages 1-3) */}
        <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6">
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <Layers className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight leading-tight">
                {data.evaluationProcess.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-0.5">
                {data.evaluationProcess.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {data.evaluationProcess.stages.map((stage, idx) => (
              <div
                key={idx}
                className="border-3 border-black bg-neutral-50 p-5 sm:p-6 shadow-neo-sm space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3 border-b-2 border-black/20 pb-3">
                  <span
                    className={`font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black ${stage.stageBadgeColor}`}
                  >
                    {stage.stageNumber}
                  </span>
                  <h3 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight">
                    {stage.title}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {stage.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 stroke-[3px] shrink-0 mt-0.5" />
                      <p className="font-bold text-sm text-black leading-relaxed">
                        {pt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Accommodation, Hospitality, and Facilities */}
        <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6">
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-accent border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <Home className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight leading-tight">
                {data.facilities.title}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-neutral-600 mt-0.5">
                {data.facilities.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.facilities.items.map((facility, idx) => {
              const icons = [
                <Home key="home" className="w-5 h-5 text-emerald-600 stroke-[3px] shrink-0" />,
                <Coffee key="coffee" className="w-5 h-5 text-amber-600 stroke-[3px] shrink-0" />,
                <Activity key="activity" className="w-5 h-5 text-rose-600 stroke-[3px] shrink-0" />,
                <Wifi key="wifi" className="w-5 h-5 text-blue-600 stroke-[3px] shrink-0" />,
              ];

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 bg-neo-bg border-3 border-black shadow-neo-sm"
                >
                  <div className="mt-0.5">{icons[idx % icons.length]}</div>
                  <span className="font-bold text-sm text-black leading-snug">
                    {facility}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Expected Deliverables & Outcomes */}
        <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6">
          <div className="border-b-4 border-black pb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-muted border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
              <Trophy className="w-6 h-6 text-black stroke-[3px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
              {data.expectedOutcomes.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.expectedOutcomes.items.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-neutral-50 border-3 border-black border-l-8 border-l-purple-600 shadow-neo-sm space-y-2 hover:bg-neo-bg transition-colors"
              >
                <h4 className="font-black text-base text-black uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="font-bold text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="border-4 border-black bg-neo-secondary p-6 sm:p-8 shadow-neo flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
              READY TO BUILD &amp; COMPETE?
            </h3>
            <p className="font-bold text-xs sm:text-sm text-black/80">
              Review guidelines and register your team for the 36-hour sprint.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/guidelines"
              className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase border-3 border-black shadow-neo-sm hover:bg-neutral-100 transition-all"
            >
              RULES
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-black text-xs uppercase border-3 border-black shadow-neo-sm hover:bg-neutral-900 transition-all"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>
        </div>
      </div>

      <MarqueeBanner bg="secondary" speed="normal" />
    </div>
  );
}
