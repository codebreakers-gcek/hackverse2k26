import React from "react";
import type { Metadata } from "next";
import { EventFormatContent } from "@/features/event-format/EventFormatContent";

export const metadata: Metadata = {
  title: "Event Format // HACKVERSE '26",
  description:
    "Official multi-stage evaluation process, Grand Finale structure, accommodation, and event deliverables.",
};

export default function EventFormatPage() {
  return <EventFormatContent />;
}
