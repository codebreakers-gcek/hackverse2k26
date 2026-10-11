import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { WinnersContent } from "@/features/winners/WinnersContent";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";

export const metadata: Metadata = {
  title: "Tournament Winners & Hall of Fame",
  description:
    "Official winners podium and Hall of Fame of HACKVERSE '26 24-Hour State Hackathon at GCEK Kalahandi. Joint Champions: Team FPS (GCEK) & Team BRUTEFORCE (GITAM), 2nd Place: CODE WARRIORS (GCEK), 3rd Place: Team ACEBits (GCE Keonjhar), Best Female-Led Team: code_crash (GCEK).",
  keywords: [
    "HACKVERSE 2026 winners",
    "HACKVERSE winners",
    "HACKVERSE '26 winners",
    "HACKVERSE 26 hall of fame",
    "GCEK hackathon winners",
    "CodeBreakers hackathon winners",
    "Team FPS GCEK",
    "Team BRUTEFORCE GITAM",
    "CODE WARRIORS GCEK",
    "Team ACEBits GCE Keonjhar",
    "code_crash GCEK",
    "hackathon winners Odisha 2026",
    "Odisha hackathon results",
    "state level hackathon winners",
  ],
  openGraph: {
    title: "Tournament Winners & Hall of Fame // HACKVERSE '26",
    description:
      "Honoring the top squads of HACKVERSE '26. Joint 1st: Team FPS & Team BRUTEFORCE | 2nd: CODE WARRIORS | 3rd: Team ACEBits | Best Female-Led: code_crash.",
    url: "https://hackverse.codebreakersgcek.tech/winners",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "HACKVERSE '26 Winners & Hall of Fame",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tournament Winners & Hall of Fame // HACKVERSE '26",
    description:
      "Meet the official champions of HACKVERSE '26. Joint 1st: Team FPS & Team BRUTEFORCE | 2nd: CODE WARRIORS | 3rd: Team ACEBits | Best Female-Led: code_crash.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/winners",
  },
};

export default function WinnersPage() {
  return (
    <div className="relative min-h-screen text-black overflow-hidden flex flex-col selection:bg-[#FFAA00] selection:text-black">
      {/* Minecraft Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/1.webp"
          alt="HackVerse Winners Minecraft Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90" />
      </div>

      <div className="relative z-10 flex-1">
        <WinnersContent />
      </div>

      {/* Marquee Separator */}
      <div className="relative z-10">
        <MarqueeBanner
          items={[
            "HACKVERSE '26 CHAMPIONS",
            "TEAM FPS (GCEK)",
            "TEAM BRUTEFORCE (GITAM)",
            "CODE WARRIORS (GCEK)",
            "TEAM ACEBITS (GCE KEONJHAR)",
            "CODE_CRASH (GCEK)",
            "HACKVERSE 2.0 COMING SOON",
            "CODEBREAKERS GCEK",
          ]}
          bg="secondary"
          speed="normal"
        />
      </div>
    </div>
  );
}
