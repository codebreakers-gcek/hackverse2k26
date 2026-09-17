import React, { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { RegistrationForm } from "@/features/registration/RegistrationForm";
import { SectionTitle } from "@/components/common/SectionTitle";

export const metadata: Metadata = {
  title: "Squad Registration Portal & Verification Dossier",
  description:
    "Enroll your squad (1-4 members) for HACKVERSE '26 State Hackathon at GCEK Kalahandi. Secure your entry pass, select challenges, and unlock ₹35K+ in rewards.",
  keywords: [
    "hackathon registration 2026",
    "HACKVERSE registration",
    "register for hackathon Odisha",
    "free hackathon registration",
    "student hackathon registration",
    "team registration hackathon",
    "squad registration HACKVERSE",
    "online hackathon application",
    "college hackathon entry",
    "state level hackathon registration",
    "zero entry fee hackathon",
    "hackathon registration link",
    "GCEK hackathon registration",
    "Odisha coding competition entry",
    "hackathon team leader registration",
    "hackathon member details form",
    "college student hackathon apply",
    "engineering hackathon registration 2026",
    "BPUT hackathon registration",
    "inter-college hackathon register",
    "HACKVERSE squad pass",
    "hackathon confirmation pass",
    "student developer registration",
    "competitive coding registration Odisha",
    "AI hackathon registration",
    "Web3 hackathon registration",
    "Cybersecurity hackathon register",
    "IoT track registration hackathon",
    "Open innovation track apply",
    "hackathon application deadline September 2026",
    "last date to register hackathon Odisha",
    "instant hackathon registration portal",
    "hackathon team size 1 to 4 members",
    "GCEK Bhawanipatna hackathon register",
    "CodeBreakers hackathon form",
    "free food and stay hackathon registration",
    "hackathon ticket booking",
    "hackathon entry portal GCEK",
    "student registration dossier",
    "hackathon participant onboarding",
    "hackathon verification portal",
    "national hackathon entry India",
    "student innovation competition register",
    "college project competition apply",
    "hackathon cash prize competition register",
    "Odisha student coding entry form",
    "tech fest registration GCEK",
    "HACKVERSE pass claim",
    "apply for HACKVERSE 2026",
    "secure hackathon squad slot",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/register",
  },
  openGraph: {
    title: "Squad Registration // HACKVERSE '26",
    description:
      "Form a team of 1 to 4 members. Submit your team leader details, problem statement preference, and member credentials.",
    url: "https://hackverse.codebreakersgcek.tech/register",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Registration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Squad Registration Portal // HACKVERSE '26",
    description: "Form your squad of 1-4 hackers and compete in Odisha's premier 24H hackathon.",
    images: ["/og-image.png"],
  },
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen text-black overflow-hidden flex flex-col selection:bg-[#FFAA00] selection:text-black">
      {/* Minecraft Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/wallpaper.webp"
          alt="HackVerse Registration Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving image clarity */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 w-full">
        <SectionTitle
          tag="ENROLLMENT // ZERO ENTRY FEE"
          title="REGISTER YOUR"
          highlightText="SQUAD"
          subtitle="Form a team of 1 to 4 members. Submit your team leader details, problem statement preference, and member credentials below."
        />
        <Suspense
          fallback={
            <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 shadow-[6px_6px_0px_#000] font-black font-mono text-center text-black">
              LOADING REGISTRATION PORTAL...
            </div>
          }
        >
          <RegistrationForm />
        </Suspense>
      </div>
    </div>
  );
}
