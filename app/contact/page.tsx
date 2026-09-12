import React from "react";
import type { Metadata } from "next";
import { ContactContent } from "@/features/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Desk, Emergency Support & Campus Location",
  description:
    "Official contact directory for HACKVERSE '26 at Government College of Engineering Kalahandi. Reach our technical leads, hospitality team, and institutional coordinators.",
  keywords: [
    "HACKVERSE contact",
    "HACKVERSE 2026 contact number",
    "CodeBreakers GCEK contact",
    "Government College of Engineering Kalahandi address",
    "GCEK Kalahandi phone number",
    "GCEK Bhawanipatna location",
    "hackathon helpdesk Odisha",
    "HACKVERSE emergency contact",
    "HACKVERSE hospitality helpdesk",
    "hackathon student coordinators contact",
    "GCEK faculty convenor contact",
    "how to reach Government College of Engineering Kalahandi",
    "nearest railway station to GCEK Kalahandi",
    "Kesinga railway station to GCEK",
    "Bhawanipatna bus stand to GCEK",
    "nearest airport to Bhawanipatna",
    "Utkela airport Kalahandi",
    "Raipur to Bhawanipatna travel route",
    "Bhubaneswar to Bhawanipatna train route",
    "HACKVERSE email support",
    "CodeBreakers official email",
    "hackathon query helpline",
    "hackathon sponsorship enquiry",
    "hackathon partnership contact",
    "HACKVERSE Discord link",
    "HACKVERSE WhatsApp group",
    "CodeBreakers social media",
    "CodeBreakers Instagram handle",
    "CodeBreakers LinkedIn page",
    "CodeBreakers GitHub repo",
    "GCEK campus map",
    "Bandopala Bhawanipatna location",
    "Kalahandi Odisha pin code 766002",
    "hackathon accommodation contact",
    "hackathon transport helpdesk",
    "Odisha hackathon support team",
    "Bhawanipatna tech fest inquiry",
    "state level hackathon contact",
    "student developer helpdesk Odisha",
    "hackathon team registration help",
    "problem statement clarification desk",
    "hardware kit assistance hackathon",
    "emergency medical support GCEK",
    "campus security GCEK Kalahandi",
    "CodeBreakers club Bhawanipatna",
    "tech fest contact Odisha 2026",
    "engineering college Kalahandi contact",
    "GCEK official website help",
    "hackathon grievance support",
    "HACKVERSE desk phone",
    "CodeBreakers support 2026",
  ],
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
