import React from "react";
import type { Metadata } from "next";
import { FaqContent } from "@/features/faq/FaqContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) & Hacker Guide",
  description:
    "Everything you need to know about HACKVERSE '26: squad registration, eligibility, free hostel accommodation, food, mentorship, problem statements, and prize distributions.",
  keywords: [
    "HACKVERSE FAQ",
    "HACKVERSE 2026 questions",
    "hackathon FAQ Odisha",
    "hackathon rules Odisha",
    "hackathon eligibility criteria",
    "who can participate in HACKVERSE",
    "hackathon team size limit",
    "squad registration HACKVERSE",
    "solo participation hackathon",
    "free accommodation hackathon Odisha",
    "free food hackathon GCEK",
    "hackathon lodging Bhawanipatna",
    "hackathon travel guide Kalahandi",
    "how to reach GCEK Kalahandi",
    "GCEK Bhawanipatna campus directions",
    "hackathon registration fee",
    "is HACKVERSE free to register",
    "hackathon certificate for all participants",
    "hackathon prize distribution",
    "₹35000 prize pool details",
    "hackathon judging criteria",
    "hackathon evaluation rounds",
    "hackathon project submission rules",
    "hackathon hardware requirements",
    "IoT hardware kits provided",
    "hackathon Wi-Fi internet access",
    "24 hour hackathon survival guide",
    "hackathon beginner guide",
    "can first year students participate",
    "hackathon for non CSE students",
    "hackathon mentorship support",
    "CodeBreakers FAQ",
    "GCEK hackathon questions",
    "hackathon problem statements release date",
    "hackathon PPT template guidelines",
    "hackathon submission format",
    "hackathon intellectual property rules",
    "hackathon discord server support",
    "hackathon WhatsApp community",
    "hackathon dress code and essentials",
    "what to bring to hackathon",
    "college ID card requirement hackathon",
    "inter college hackathon eligibility",
    "diploma students hackathon Odisha",
    "B.Tech hackathon Odisha",
    "MCA MSc students hackathon",
    "hackathon emergency contact number",
    "hackathon queries GCEK",
    "student hackathon Odisha FAQ",
    "best hackathon FAQ Odisha 2026",
    "CodeBreakers GCEK hackathon support",
  ],
  alternates: {
    canonical: "https://hackverse.codebreakersgcek.tech/faqs",
  },
  openGraph: {
    title: "Frequently Asked Questions // HACKVERSE '26",
    description:
      "Got questions about HACKVERSE '26? Read our comprehensive FAQ regarding eligibility, travel, lodging, prizes, and submissions.",
    url: "https://hackverse.codebreakersgcek.tech/faqs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HACKVERSE '26 FAQs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions // HACKVERSE '26",
    description:
      "Clear answers on squad sizes, free accommodation, food, timeline, hardware access, and judging.",
    images: ["/og-image.png"],
  },
};

export default function FaqsPage() {
  return <FaqContent />;
}
