import React from "react";
import type { Metadata } from "next";
import { TeamContent } from "@/features/team/TeamContent";

export const metadata: Metadata = {
  title: "Organizing Team, Faculty Patrons & Domain Leads",
  description:
    "Meet the official patrons, core student council, faculty mentors, and technical domain leads behind HACKVERSE '26 at Government College of Engineering Kalahandi.",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/team",
  },
  openGraph: {
    title: "Organizing Team // HACKVERSE '26",
    description:
      "Meet the student builders, organizers, and mentors making HACKVERSE '26 possible at GCEK Kalahandi.",
    url: "https://www.codebreakersgcek.tech/team",
    images: [{ url: "/cbhack.png", width: 1200, height: 630, alt: "HACKVERSE '26 Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organizing Team // HACKVERSE '26",
    description:
      "Meet the student builders, organizers, and mentors making HACKVERSE '26 possible at GCEK Kalahandi.",
    images: ["/cbhack.png"],
  },
};

export default function TeamPage() {
  return <TeamContent />;
}
