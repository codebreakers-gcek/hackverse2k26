"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  FileCode2,
  Building2,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Crown,
  AlertTriangle,
  QrCode,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { RegistrationSuccessReceipt } from "./RegistrationSuccessReceipt";
import clsx from "clsx";

export interface RegisteredSquadDashboardProps {
  teamData: any;
  userRoleInTeam: "LEADER" | "MEMBER";
  currentUser: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onRegisterNewTeam?: () => void;
}

export function RegisteredSquadDashboard({
  teamData,
  userRoleInTeam,
  currentUser,
  onRegisterNewTeam,
}: RegisteredSquadDashboardProps) {
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isLeader = userRoleInTeam === "LEADER";
  const status = teamData.status || "PENDING_VERIFICATION";

  // Find problem statement objects if selected
  const psIds = Array.isArray(teamData.selectedProblemStatements)
    ? teamData.selectedProblemStatements
    : teamData.problemStatementId
    ? [teamData.problemStatementId]
    : [];

  const pref1 = PROBLEM_STATEMENTS_DATA.find((p) => p.id === psIds[0]);
  const pref2 = PROBLEM_STATEMENTS_DATA.find((p) => p.id === psIds[1]);

  const membersList: any[] = Array.isArray(teamData.members) ? teamData.members : [];

  if (showReceiptModal) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 border-4 border-black shadow-neo print:hidden">
          <span className="font-mono text-xs font-black uppercase text-black">
            OFFICIAL DIGITAL BOARDING PASS PREVIEW
          </span>
          <button
            type="button"
            onClick={() => setShowReceiptModal(false)}
            className="px-4 py-2 bg-neo-secondary text-black font-black text-xs uppercase border-2 border-black hover:bg-neo-accent transition-all cursor-pointer"
          >
            ← BACK TO SQUAD DASHBOARD
          </button>
        </div>
        <RegistrationSuccessReceipt
          result={{
            success: true,
            ticketId: teamData.registrationNumber,
            registrationId: teamData.registrationNumber,
            teamName: teamData.teamName,
            message: "Your squad entry is officially registered and verified on the HACKVERSE '26 roster.",
          }}
          onReset={() => setShowReceiptModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Top Registration Status Banner */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black shadow-neo-sm">
                {teamData.registrationNumber}
              </span>
              <span
                className={clsx(
                  "font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-neo-sm",
                  status === "CONFIRMED"
                    ? "bg-emerald-300 text-black"
                    : status === "REJECTED"
                    ? "bg-rose-400 text-black"
                    : "bg-neo-secondary text-black"
                )}
              >
                STATUS: {status}
              </span>
              <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-muted text-black border-2 border-black shadow-neo-sm">
                {isLeader ? "★ SQUAD CAPTAIN" : "★ SQUAD CO-HACKER"}
              </span>
            </div>

            <h2 className="font-black text-3xl sm:text-4xl text-black uppercase tracking-tight mt-1">
              TEAM: {teamData.teamName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold text-black/70 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-black" />
                <span>{teamData.collegeName}</span>
              </span>
              {teamData.collegeAddress?.city && (
                <span>
                  • {teamData.collegeAddress.city}, {teamData.collegeAddress.state}
                </span>
              )}
            </div>
          </div>

          {/* User Account Info Chip */}
          <div className="p-3.5 bg-neo-bg border-3 border-black space-y-1 font-mono text-xs shrink-0 self-start md:self-auto">
            <div className="font-black uppercase text-black/60 text-[10px] flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>CURRENT LOGGED-IN ACCOUNT:</span>
            </div>
            <div className="font-black text-black text-sm uppercase">
              {currentUser.name || "AUTHENTICATED MEMBER"}
            </div>
            <div className="text-black/80 font-bold">{currentUser.email}</div>
            <div className="text-[10px] font-black uppercase text-black/70 pt-0.5">
              ROLE: {isLeader ? "TEAM LEADER" : "REGISTERED TEAM MEMBER"}
            </div>
          </div>
        </div>

        {/* Quick Summary Notice */}
        <div className="p-4 bg-emerald-50 border-3 border-black text-xs sm:text-sm font-bold text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3px] shrink-0" />
            <span>
              Your team credentials and registration pass are active in the HACKVERSE &apos;26 system.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>VIEW DIGITAL PASS</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PROBLEM STATEMENT PREFERENCES STATUS */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
          <div className="flex items-center gap-2.5">
            <FileCode2 className="w-5 h-5 text-black stroke-[2.5px]" />
            <h3 className="font-black text-xl uppercase tracking-tight text-black">
              PROBLEM STATEMENT ALLOCATION (2 PREFERENCES)
            </h3>
          </div>

          <Link
            href="/register/ps"
            className="px-4 py-2 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>{psIds.length === 2 ? "MODIFY CHOICES" : "SELECT 2 STATEMENTS NOW"}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
          </Link>
        </div>

        {psIds.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preference 1 Card */}
            <div className="p-4 bg-amber-50 border-3 border-black shadow-neo-sm space-y-2">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-secondary text-black border border-black inline-block">
                ★ CHOICE #1 (PRIMARY PREFERENCE)
              </span>
              <div className="font-black text-base uppercase text-black">
                [{pref1?.code || psIds[0]}] {pref1?.title || "Custom Problem Statement"}
              </div>
              <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
                {pref1?.shortDescription || "Selected as 1st preference for hackathon evaluation."}
              </p>
              <div className="font-mono text-[11px] text-black/60 pt-1">
                Domain: {pref1?.domain || "Assigned Track"}
              </div>
            </div>

            {/* Preference 2 Card */}
            <div className="p-4 bg-rose-50 border-3 border-black shadow-neo-sm space-y-2">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-accent text-black border border-black inline-block">
                ★ CHOICE #2 (SECONDARY PREFERENCE)
              </span>
              <div className="font-black text-base uppercase text-black">
                [{pref2?.code || psIds[1]}] {pref2?.title || "Custom Problem Statement"}
              </div>
              <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
                {pref2?.shortDescription || "Selected as 2nd preference for hackathon evaluation."}
              </p>
              <div className="font-mono text-[11px] text-black/60 pt-1">
                Domain: {pref2?.domain || "Assigned Track"}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-amber-100 border-3 border-black space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-800 stroke-[3px]" />
              <span>PROBLEM STATEMENT PREFERENCES NOT LOCKED YET!</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
              Every registered squad is required to select exactly TWO (2) problem statements (Preference 1 & Preference 2). Please click below to review specifications and submit your squad choices.
            </p>
            <Link
              href="/register/ps"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neo-secondary hover:bg-neo-accent text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all"
            >
              <span>SELECT 2 PROBLEM STATEMENTS NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: SQUAD ROSTER (LEADER & ALL MEMBERS) */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-black stroke-[2.5px]" />
            <h3 className="font-black text-xl uppercase tracking-tight text-black">
              SQUAD ROSTER &amp; MEMBER CREDENTIALS (1 LEADER + {membersList.length} CO-HACKERS)
            </h3>
          </div>
          <span className="font-mono text-xs font-black bg-black text-white px-2.5 py-0.5 border border-black uppercase hidden sm:inline-block">
            TOTAL: {1 + membersList.length} MEMBERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LEADER CARD */}
          <div className="border-3 border-black bg-amber-50/70 p-5 shadow-neo-sm space-y-3 relative">
            <div className="flex items-center justify-between gap-2 border-b-2 border-black/20 pb-2">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-neo-secondary text-black border border-black flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                <span>TEAM LEADER</span>
              </span>

              {isLeader && (
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black animate-pulse">
                  [YOU - LOGGED IN]
                </span>
              )}
            </div>

            <div>
              <h4 className="font-black text-lg text-black uppercase tracking-tight">
                {teamData.leader?.name || teamData.leaderName}
              </h4>
              <div className="font-mono text-xs font-bold text-black/75 mt-0.5">
                {teamData.leader?.role || "Squad Captain"} • {teamData.leader?.branch || teamData.leaderBranch} ({teamData.leader?.year || teamData.leaderYear})
              </div>
            </div>

            <div className="space-y-1 font-mono text-xs text-black/85 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-black/60 shrink-0" />
                <span className="truncate">{teamData.leader?.email || teamData.leaderEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-black/60 shrink-0" />
                <span>{teamData.leader?.phone || teamData.leaderPhone}</span>
              </div>
            </div>
          </div>

          {/* MEMBER CARDS */}
          {membersList.map((member, idx) => {
            const isThisMemberLoggedIn =
              currentUser.email &&
              member.email &&
              currentUser.email.toLowerCase().trim() === member.email.toLowerCase().trim();

            return (
              <div
                key={idx}
                className={clsx(
                  "border-3 border-black p-5 shadow-neo-sm space-y-3 relative",
                  isThisMemberLoggedIn ? "bg-emerald-50 border-emerald-900 ring-2 ring-black" : "bg-neo-bg"
                )}
              >
                <div className="flex items-center justify-between gap-2 border-b-2 border-black/20 pb-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-neo-muted text-black border border-black">
                    CO-HACKER #{idx + 2}
                  </span>

                  {isThisMemberLoggedIn && (
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black animate-pulse">
                      [YOU - LOGGED IN]
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-lg text-black uppercase tracking-tight">
                    {member.fullName || member.name}
                  </h4>
                  <div className="font-mono text-xs font-bold text-black/75 mt-0.5">
                    {member.role || "Co-Hacker"} • {member.branch || "Engineering"} ({member.yearOfStudy || "Student"})
                  </div>
                </div>

                <div className="space-y-1 font-mono text-xs text-black/85 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-black/60 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-black/60 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: PASS DETAILS & ACTION BAR */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-neo-secondary p-6 sm:p-8 shadow-neo flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border border-black inline-block">
            OFFICIAL TOURNAMENT PASS
          </span>
          <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
            HACKVERSE &apos;26 24-HOUR PASS CONFIRMED
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/80 max-w-xl">
            Pass includes continuous 24H arena seating, 1Gbps high-speed network ports, complimentary food passes, and official state participation certificates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[3px]" />
            <span>PRINT / SAVE PASS</span>
          </button>

          {onRegisterNewTeam && (
            <button
              type="button"
              onClick={onRegisterNewTeam}
              className="px-5 py-3.5 bg-black text-white hover:bg-neutral-800 font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>REGISTER ANOTHER SQUAD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
