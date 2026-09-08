import React from "react";
import type { Metadata } from "next";
import { GuidelinesContent } from "@/features/guidelines/GuidelinesContent";

export const metadata: Metadata = {
  title: "Guidelines & Regulations // HACKVERSE '26",
  description:
    "Official hackathon rules, team composition requirements, eligibility criteria, and regulatory guidelines.",
};

export default function GuidelinesPage() {
  return <GuidelinesContent />;
}
