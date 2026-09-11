import React from "react";
import type { Metadata } from "next";
import { ContactContent } from "@/features/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Desk, Emergency Support & Campus Location",
  description:
    "Official contact directory for HACKVERSE '26 at Government College of Engineering Kalahandi. Reach our technical leads, hospitality team, and institutional coordinators.",
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/contact",
  },
  openGraph: {
    title: "Contact & Support // HACKVERSE '26",
    description:
      "Have queries regarding participation, lodging, or sponsorship? Contact the CodeBreakers GCEK team.",
    url: "https://hackverse.codebreakersgcek.tech/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 Contact" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Operations Support & Inquiries // HACKVERSE '26",
    description:
      "Reach out to CodeBreakers GCEK student convenors, faculty coordinators, and sponsorship leads.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
