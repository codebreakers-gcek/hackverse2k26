import React from "react";
import type { Metadata } from "next";
import { ScheduleContent } from "@/features/schedule/ScheduleContent";

export const metadata: Metadata = {
  title: "Event Timeline & 24-Hour Hackathon Schedule",
  description:
    "Explore the complete 3-day competition schedule for HACKVERSE '26: Check-in, opening ceremony, 24-hour non-stop hacking sprint, mentoring checkpoints, evaluation rounds, and Grand Finale at GCEK Campus.",
  keywords: [
    "hackathon schedule 2026",
    "24 hour hackathon timeline",
    "HACKVERSE 2026 schedule",
    "HACKVERSE timeline",
    "3-day hackathon itinerary Odisha",
    "hackathon check-in time",
    "opening ceremony hackathon GCEK",
    "24 hour sprint schedule",
    "mentoring checkpoints hackathon",
    "evaluation rounds schedule",
    "judging round 1 2 3",
    "grand finale hackathon Odisha",
    "award ceremony timeline",
    "hackathon dates September 2026",
    "tech fest schedule GCEK",
    "hackathon timeline Odisha",
    "24 hours coding timeline",
    "midnight coding sprint",
    "pitch submission deadline",
    "demo day hackathon Odisha",
    "hackathon itinerary Bhawanipatna",
    "GCEK hackathon schedule",
    "CodeBreakers event timeline",
    "hardware sprint schedule",
    "AI ML evaluation rounds",
    "Web3 judging schedule",
    "Cybersecurity track timeline",
    "hackathon lunch dinner timings",
    "midnight power hour hackathon",
    "final PPT submission time",
    "presentation round schedule",
    "valedictory ceremony GCEK",
    "state hackathon event flow",
    "36 hour schedule Odisha",
    "hackathon live status",
    "hackathon milestones",
    "squad check-in verification timing",
    "opening keynote timing",
    "expert mentoring session hours",
    "round 1 ideation evaluation",
    "round 2 prototype evaluation",
    "round 3 final product deployment",
    "top 10 finalist announcement",
    "stage pitching timetable",
    "trophy distribution timing",
    "GCEK auditorium schedule",
    "Odisha student coding timetable",
    "hackathon day 1 schedule",
    "hackathon day 2 schedule",
    "hackathon day 3 schedule",
    "HACKVERSE timeline guide",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/schedule",
  },
  openGraph: {
    title: "Event Schedule & Timeline // HACKVERSE '26",
    description:
      "24 hours of non-stop hacking, mentoring sessions, tech talks, and prize ceremonies at GCEK Kalahandi.",
    url: "https://hackverse.codebreakersgcek.tech/schedule",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Schedule" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "24-Hour Timeline & Milestones // HACKVERSE '26",
    description: "From check-in and opening keynotes to 3 judging rounds and grand award ceremonies.",
    images: ["/og-image.png"],
  },
};

export default function SchedulePage() {
  return <ScheduleContent />;
}
