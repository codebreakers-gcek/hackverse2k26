import React from "react";
import { ABOUT_DATA } from "@/data/about";
import { ExternalLink, Terminal } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ENV } from "@/config/env";

export function ClubMilestones() {
  return (
    <div className="space-y-12">
      <SectionTitle
        tag="ORIGINS // LEGACY"
        title="CODEBREAKERS"
        highlightText="JOURNEY"
        subtitle="How a dedicated cohort of GCEK computer science students built Kalahandi's most formidable developer community."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-4">
          {ABOUT_DATA.club.milestones.map((m, idx) => (
            <div
              key={m.year}
              className="border-4 border-black bg-white p-6 shadow-neo-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:-translate-y-0.5 transition-transform"
            >
              <div className="font-mono text-2xl sm:text-3xl font-black bg-neo-secondary border-3 border-black px-4 py-2 text-black shrink-0">
                {m.year}
              </div>
              <div>
                <div className="font-black text-lg text-black uppercase tracking-tight">
                  {m.event}
                </div>
                <p className="text-sm font-bold text-black/75 mt-1 leading-snug">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Institution / Club Profile Sidebar */}
        <div className="space-y-6">
          <div className="border-4 border-black bg-neo-muted p-6 shadow-neo">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 stroke-[3px]" />
              <span className="font-mono text-xs font-black uppercase">COMMUNITY HUB</span>
            </div>
            <h4 className="font-black text-xl text-black uppercase mb-2">
              CODEBREAKERS GCEK
            </h4>
            <p className="text-xs font-bold text-black/80 leading-relaxed mb-4">
              {ABOUT_DATA.club.bio}
            </p>
            <a
              href={ENV.OFFICIAL_CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs font-black bg-black text-white px-3 py-2 border-2 border-black hover:bg-neutral-800 transition-colors"
            >
              <span>VISIT CODEBREAKERS PORTAL</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
            </a>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-neo">
            <span className="font-mono text-xs font-black uppercase text-black/60 block mb-1">
              HOST CAMPUS
            </span>
            <h4 className="font-black text-lg text-black uppercase mb-2">
              GOVT. COLLEGE OF ENGINEERING KALAHANDI
            </h4>
            <p className="text-xs font-bold text-black/75 leading-relaxed mb-4">
              {ABOUT_DATA.institution.description}
            </p>
            <a
              href={ABOUT_DATA.institution.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-black underline hover:text-neo-accent transition-colors"
            >
              <span>INSTITUTE WEBSITE (GCEK)</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
