import React from "react";
import type { Metadata } from "next";
import { ScheduleContent } from "@/features/schedule/ScheduleContent";

export const metadata: Metadata = {
  title: "Event Timeline & 24-Hour Hackathon Schedule",
  description:
    "Explore the complete 3-day competition schedule for HACKVERSE '26: Check-in, opening ceremony, 24-hour non-stop hacking sprint, mentoring checkpoints, evaluation rounds, and Grand Finale at GCEK Campus.",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/schedule",
  },
  openGraph: {
    title: "Event Schedule & Timeline // HACKVERSE '26",
    description:
      "24 hours of non-stop hacking, mentoring sessions, tech talks, and prize ceremonies at GCEK Kalahandi.",
    url: "https://www.codebreakersgcek.tech/schedule",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HACKVERSE '26 Schedule" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "24-Hour Timeline & Milestones // HACKVERSE '26",
    description: "From check-in and opening keynotes to 3 judging rounds and grand award ceremonies.",
    images: ["/og-image.jpg"],
  },
};

export default function SchedulePage() {
  return <ScheduleContent />;
}
