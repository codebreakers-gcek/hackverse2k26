import React from "react";
import type { Metadata } from "next";
import { FaqContent } from "@/features/faq/FaqContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) & Hacker Guide",
  description:
    "Everything you need to know about HACKVERSE '26: squad registration, eligibility, free hostel accommodation, food, mentorship, problem statements, and prize distributions.",
  alternates: {
    canonical: "https://www.codebreakersgcek.tech/faqs",
  },
  openGraph: {
    title: "Frequently Asked Questions // HACKVERSE '26",
    description:
      "Got questions about HACKVERSE '26? Read our comprehensive FAQ regarding eligibility, travel, lodging, prizes, and submissions.",
    url: "https://www.codebreakersgcek.tech/faqs",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HACKVERSE '26 FAQs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions // HACKVERSE '26",
    description:
      "Clear answers on squad sizes, free accommodation, food, timeline, hardware access, and judging.",
    images: ["/og-image.jpg"],
  },
};

export default function FaqsPage() {
  return <FaqContent />;
}
