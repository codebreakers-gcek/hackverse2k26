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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HACKVERSE '26 Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organizing Committee & Tech Leads // CodeBreakers GCEK",
    description: "Meet the student engineers, faculty convenors, and developers powering HACKVERSE '26.",
    images: ["/og-image.jpg"],
  },
};

export default function TeamPage() {
  return <TeamContent />;
}
