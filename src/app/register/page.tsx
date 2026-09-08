import React, { Suspense } from "react";
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import { ShieldCheck, Info, Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Registration Pass // INNOVEX '26 | CodeBreakers GCEK",
  description:
    "Register your team for INNOVEX '26 and Hack Nova. Free entry, instant digital entry pass generation, and national participation.",
};

export default function RegistrationPage() {
  return (
    <div className="flex flex-col">
      {/* Top Banner */}
      <section className="bg-neo-accent border-b-4 border-black py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm inline-block">
            DISPATCH PROTOCOL // 2026
          </span>
          <h1 className="font-black text-4xl sm:text-6xl md:text-7xl text-black uppercase tracking-tight leading-tight">
            SQUAD <span className="bg-white px-3 border-4 border-black inline-block rotate-1 shadow-neo-sm">REGISTRATION</span>
          </h1>
          <p className="text-base sm:text-xl font-bold text-black max-w-2xl mx-auto leading-relaxed">
            Register your squad (1-4 members). Zero fee. Instant entry pass validation. Ensure all leader credentials match official college records.
          </p>
        </div>
      </section>

      {/* Marquee Banner */}
      <MarqueeBanner
        items={[
          "ZERO ENTRY FEE",
          "1 TO 4 MEMBERS PER SQUAD",
          "DEADLINE: OCT 10, 2026",
          "GCE KALAHANDI CAMPUS",
          "OFFICIAL ENTRY PASS DISPATCH",
        ]}
        bg="secondary"
        speed="fast"
      />

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Security / Architecture Notice */}
        <div className="border-4 border-black bg-white p-6 shadow-neo mb-10 flex items-start gap-4">
          <div className="w-10 h-10 bg-neo-secondary text-black border-2 border-black flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 stroke-[3px]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              FRONTEND VALIDATION &amp; API SECURITY NOTICE
            </h3>
            <p className="text-xs font-bold text-black/75 leading-relaxed">
              Client-side verification ensures immediate feedback for formatting errors. For security, sensitive data is never persisted in local browser storage, and the backend service executes secondary server-side sanitization, duplicate prevention, and authorization checks.
            </p>
          </div>
        </div>

        {/* Dynamic Registration Form wrapped in Suspense for search params */}
        <Suspense
          fallback={
            <div className="border-4 border-black bg-white p-12 text-center shadow-neo">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-black" />
              <p className="font-mono text-xs font-black uppercase mt-3">
                INITIALIZING REGISTRATION FORM...
              </p>
            </div>
          }
        >
          <RegistrationForm />
        </Suspense>
      </div>
    </div>
  );
}
