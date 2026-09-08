import React from "react";
import type { Metadata } from "next";
import { ScheduleContent } from "@/features/schedule/ScheduleContent";

export const metadata: Metadata = {
  title: "Event Schedule // HACKVERSE '26",
  description:
    "Official multi-phase competition schedule for HACKVERSE '26 from launch to the Grand Finale at GCEK Campus, Bhawanipatna.",
};

export default function SchedulePage() {
  return <ScheduleContent />;
}
