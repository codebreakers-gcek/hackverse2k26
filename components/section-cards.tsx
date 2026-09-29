"use client";

import React from "react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Users, Sparkles, CheckCircle2, BedDouble } from "lucide-react";

export function SectionCards({
  totalSquads = 0,
  totalParticipants = 0,
  confirmedTeams = 0,
  accommodationRequested = 0,
}: {
  totalSquads?: number;
  totalParticipants?: number;
  confirmedTeams?: number;
  accommodationRequested?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      <AdminStatCard
        title="Total Squads"
        value={totalSquads}
        description="Registered hackathon teams"
        icon={Users}
        colorBg="bg-amber-300"
        badgeText="SQUADS"
      />
      <AdminStatCard
        title="Total Hackers"
        value={totalParticipants}
        description="Verified squad members"
        icon={Sparkles}
        colorBg="bg-cyan-300"
        badgeText="ROSTER"
      />
      <AdminStatCard
        title="Confirmed Teams"
        value={confirmedTeams}
        description="Approved squads"
        icon={CheckCircle2}
        colorBg="bg-emerald-300"
        badgeText="CONFIRMED"
        badgeBg="bg-emerald-200 text-emerald-950"
      />
      <AdminStatCard
        title="Hostel Requests"
        value={accommodationRequested}
        description="Logistics & hospitality"
        icon={BedDouble}
        colorBg="bg-fuchsia-300"
        badgeText="STAY"
      />
    </div>
  );
}
