import React from "react";
import type { Metadata } from "next";
import { TeamContent } from "@/features/team/TeamContent";

export const metadata: Metadata = {
  title: "Organizing Team, Faculty Patrons & Domain Leads",
  description:
    "Meet the official patrons, core student council, faculty mentors, and technical domain leads behind HACKVERSE '26 at Government College of Engineering Kalahandi.",
  keywords: [
    "HACKVERSE 2026 team",
    "CodeBreakers GCEK team",
    "CodeBreakers organizing committee",
    "GCEK hackathon organizers",
    "Government College of Engineering Kalahandi faculty",
    "GCEK Kalahandi student council",
    "CodeBreakers club Kalahandi",
    "HACKVERSE mentors",
    "HACKVERSE tech leads",
    "HACKVERSE convenors",
    "hackathon coordinators Odisha",
    "student organizers Odisha",
    "Odisha student developers",
    "GCEK Bhawanipatna faculty convenor",
    "CodeBreakers lead developers",
    "hackathon core team 2026",
    "hackathon judges Odisha",
    "hackathon mentors 2026",
    "technical domain leads Kalahandi",
    "student coordinators GCEK",
    "Odisha tech mentors",
    "Odisha hackathon leadership",
    "coding club leads Odisha",
    "developer leads Bhawanipatna",
    "HACKVERSE 26 organizing team",
    "HACKVERSE GCEK student leads",
    "CodeBreakers dev team",
    "CodeBreakers design team",
    "CodeBreakers PR team",
    "CodeBreakers event management",
    "HACKVERSE volunteer team",
    "HACKVERSE hospitality leads",
    "HACKVERSE logistics team",
    "HACKVERSE technical team",
    "student innovators Kalahandi",
    "Odisha engineering students",
    "Bhawanipatna coding community",
    "GCEK alumni mentors",
    "tech fest organizers Odisha",
    "college tech fest team Odisha",
    "state level hackathon coordinators",
    "AI ML mentors Odisha",
    "Web3 blockchain mentors Odisha",
    "IoT mentors Kalahandi",
    "cybersecurity mentors Odisha",
    "full stack developers GCEK",
    "CodeBreakers Hackathon team",
    "Government Engineering College Kalahandi leadership",
    "Kalahandi student developers",
    "young developers Odisha",
    "Odisha coding community leads",
    "software project mentors Odisha",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/team",
  },
  openGraph: {
    title: "Organizing Team // HACKVERSE '26",
    description:
      "Meet the student builders, organizers, and mentors making HACKVERSE '26 possible at GCEK Kalahandi.",
    url: "https://hackverse.codebreakersgcek.tech/team",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organizing Committee & Tech Leads // CodeBreakers GCEK",
    description: "Meet the student engineers, faculty convenors, and developers powering HACKVERSE '26.",
    images: ["/og-image.png"],
  },
};

export default function TeamPage() {
  return <TeamContent />;
}
