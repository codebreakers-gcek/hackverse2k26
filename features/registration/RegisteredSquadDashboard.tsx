"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Users,
  FileCode2,
  Building2,
  Printer,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Crown,
  AlertTriangle,
  UserCheck,
  PlusCircle,
  Edit3,
  Lock,
  FileText,
  CreditCard,
  Eye,
  X,
  UploadCloud,
  Clock,
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
  onEditRegistration?: () => void;
}

export function RegisteredSquadDashboard({
  teamData,
  userRoleInTeam,
  currentUser,
  onRegisterNewTeam,
  onEditRegistration,
}: RegisteredSquadDashboardProps) {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isPsPublished, setIsPsPublished] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          if (typeof data.settings.isProblemStatementsPublished === "boolean") {
            setIsPsPublished(data.settings.isProblemStatementsPublished);
          }
        }
      })
      .catch(() => {});
  }, []);

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    type: "image" | "pdf" | "other";
  } | null>(null);

  const isLeader = userRoleInTeam === "LEADER";
  const status = teamData.status || "PENDING_VERIFICATION";

  // Edit count tracking (Maximum 3 edits allowed per squad)
  const MAX_EDITS = 3;
  const editCount: number =
    typeof teamData.editCount === "number"
      ? teamData.editCount
      : typeof teamData.documents?.editCount === "number"
      ? teamData.documents.editCount
      : 0;
  const remainingEdits: number = Math.max(0, MAX_EDITS - editCount);
  const canEdit: boolean = remainingEdits > 0;

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
              <span
                className={clsx(
                  "font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-neo-sm flex items-center gap-1",
                  canEdit ? "bg-amber-300 text-black" : "bg-rose-300 text-black"
                )}
              >
                {canEdit ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDITS LEFT: {remainingEdits} / {MAX_EDITS}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>EDITS USED: 3/3 (LOCKED)</span>
                  </>
                )}
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
      {/* SECTION 2: PROBLEM STATEMENT ALLOCATION STATUS */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <FileCode2 className="w-5 h-5 text-black stroke-[2.5px]" />
            <h3 className="font-black text-xl uppercase tracking-tight text-black">
              PROBLEM STATEMENT ALLOCATION (2 PREFERENCES)
            </h3>
            {isPsPublished ? (
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-400 text-black border border-black shadow-neo-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <span>LIVE &amp; ACTIVE</span>
              </span>
            ) : (
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-amber-400 text-black border border-black shadow-neo-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>COMING SOON</span>
              </span>
            )}
          </div>

          {isPsPublished ? (
            <Link
              href="/register/ps"
              className="px-4 py-2 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>{psIds.length === 2 ? "MODIFY CHOICES" : "SELECT 2 STATEMENTS NOW"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          ) : (
            <span className="px-3.5 py-1.5 bg-neutral-200 text-neutral-600 font-mono text-xs font-black uppercase border-2 border-black/40 flex items-center gap-1.5 self-start sm:self-auto cursor-not-allowed opacity-80">
              <Lock className="w-3.5 h-3.5" />
              <span>RELEASING SOON</span>
            </span>
          )}
        </div>

        {!isPsPublished ? (
          <div className="p-6 bg-amber-100 border-3 border-black space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-black text-base uppercase">
              <Clock className="w-5 h-5 text-amber-900 stroke-[2.5px] shrink-0" />
              <span>PROBLEM STATEMENTS COMING SOON</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed max-w-3xl">
              The official problem statement tracks for <strong>HACKVERSE &apos;26</strong> are currently under jury embargo and will be released live shortly. Once unlocked by the organizing committee, your squad will be able to review full problem briefs and submit your 2 choices (Preference 1 &amp; Preference 2).
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-amber-950">
              <span className="px-2.5 py-1 bg-white border-2 border-black shadow-neo-xs">
                STATUS: UNDER JURY EMBARGO
              </span>
              <span className="text-amber-900/80">• Selection portal will unlock automatically once live</span>
            </div>
          </div>
        ) : psIds.length === 2 ? (
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
              Problem statements are now <strong>LIVE</strong>! Every registered squad is required to select exactly TWO (2) problem statements (Preference 1 &amp; Preference 2). Please click below to review specifications and submit your squad choices.
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-black stroke-[2.5px]" />
            <h3 className="font-black text-xl uppercase tracking-tight text-black">
              SQUAD ROSTER &amp; MEMBER CREDENTIALS (1 LEADER + {membersList.length} CO-HACKERS)
            </h3>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onEditRegistration && canEdit && (
              <button
                type="button"
                onClick={onEditRegistration}
                className="px-3.5 py-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase shadow-neo-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT TEAM MEMBERS</span>
              </button>
            )}
            <span className="font-mono text-xs font-black bg-black text-white px-2.5 py-1.5 border-2 border-black uppercase hidden sm:inline-block">
              TOTAL: {1 + membersList.length} MEMBERS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LEADER CARD */}
          <div className="border-3 border-black bg-amber-50/70 p-5 shadow-neo-sm space-y-3 relative">
            <div className="flex items-center justify-between gap-2 border-b-2 border-black/20 pb-2">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-neo-secondary text-black border border-black flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                <span>TEAM LEADER</span>
              </span>

              <div className="flex items-center gap-1.5">
                {isLeader && (
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
                    [YOU - LOGGED IN]
                  </span>
                )}
                {onEditRegistration && canEdit && (
                  <button
                    type="button"
                    onClick={onEditRegistration}
                    className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-black border border-black shadow-neo-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>EDIT</span>
                  </button>
                )}
              </div>
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

                  <div className="flex items-center gap-1.5">
                    {isThisMemberLoggedIn && (
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
                        [YOU - LOGGED IN]
                      </span>
                    )}
                    {onEditRegistration && canEdit && (
                      <button
                        type="button"
                        onClick={onEditRegistration}
                        className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-black border border-black shadow-neo-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>EDIT</span>
                      </button>
                    )}
                  </div>
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
      {/* SECTION 4: UPLOADED VERIFICATION DOCUMENTS (PAYMENT PROOF & AUTH LETTER) */}
      {/* ========================================================================= */}
      {(() => {
        const docs = teamData.documents || {};
        const paymentProofName = docs.paymentProofFileName || docs.collegeIdFileName;
        const paymentProofSize = docs.paymentProofFileSize || docs.collegeIdFileSize;
        const paymentProofUrl = docs.paymentProofDriveUrl || docs.collegeIdDriveUrl;

        const authLetterName = docs.authorizationLetterFileName || docs.synopsisFileName;
        const authLetterSize = docs.authorizationLetterFileSize || docs.synopsisFileSize;
        const authLetterUrl = docs.authorizationLetterDriveUrl || docs.synopsisDriveUrl;

        return (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-black stroke-[2.5px]" />
                <h3 className="font-black text-xl uppercase tracking-tight text-black">
                  UPLOADED VERIFICATION DOCUMENTS
                </h3>
              </div>

              {onEditRegistration && canEdit && (
                <button
                  type="button"
                  onClick={onEditRegistration}
                  className="px-3.5 py-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase shadow-neo-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>REPLACE / UPDATE DOCUMENTS</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Document 1: Payment Proof */}
              <div className="p-5 border-3 border-black bg-neutral-50 shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>1. PAYMENT PROOF / RECEIPT</span>
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black",
                      paymentProofName ? "bg-emerald-300 text-black" : "bg-rose-400 text-white"
                    )}
                  >
                    {paymentProofName ? "✔ ATTACHED" : "MISSING"}
                  </span>
                </div>

                <div className="font-mono text-xs text-black/80 font-bold truncate">
                  {paymentProofName || "No payment proof uploaded yet"}
                </div>
                {paymentProofSize && (
                  <div className="font-mono text-[10px] text-black/60">Size: {paymentProofSize}</div>
                )}

                <div className="pt-1 flex items-center gap-2">
                  {paymentProofUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const embedUrl = paymentProofUrl.includes("drive.google.com/file/d/")
                          ? `https://drive.google.com/file/d/${paymentProofUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || ""}/preview`
                          : paymentProofUrl;

                        setPreviewModal({
                          isOpen: true,
                          title: paymentProofName || "Payment Proof",
                          url: embedUrl,
                          type: "pdf", // Uses universal embed iframe for Google Drive files
                        });
                      }}
                      className="px-3 py-1 bg-neo-accent text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs hover:bg-black hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW FILE</span>
                    </button>
                  )}
                  {onEditRegistration && canEdit && (
                    <button
                      type="button"
                      onClick={onEditRegistration}
                      className="px-3 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>UPDATE FILE</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Document 2: Institutional Authorization Letter */}
              <div className="p-5 border-3 border-black bg-neutral-50 shadow-neo-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>2. AUTHORIZATION LETTER &amp; NOC</span>
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black",
                      authLetterName ? "bg-emerald-300 text-black" : "bg-rose-400 text-white"
                    )}
                  >
                    {authLetterName ? "✔ ATTACHED" : "MISSING"}
                  </span>
                </div>

                <div className="font-mono text-xs text-black/80 font-bold truncate">
                  {authLetterName || "No authorization letter uploaded yet"}
                </div>
                {authLetterSize && (
                  <div className="font-mono text-[10px] text-black/60">Size: {authLetterSize}</div>
                )}

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {authLetterUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const embedUrl = authLetterUrl.includes("drive.google.com/file/d/")
                          ? `https://drive.google.com/file/d/${authLetterUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || ""}/preview`
                          : authLetterUrl;

                        setPreviewModal({
                          isOpen: true,
                          title: authLetterName || "Institutional Authorization Letter",
                          url: embedUrl,
                          type: "pdf", // Uses universal embed iframe for Google Drive files
                        });
                      }}
                      className="px-3 py-1 bg-neo-accent text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs hover:bg-black hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW FILE</span>
                    </button>
                  )}
                  {onEditRegistration && canEdit && (
                    <button
                      type="button"
                      onClick={onEditRegistration}
                      className="px-3 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>UPDATE FILE</span>
                    </button>
                  )}
                  <a
                    href="/documents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-blue-700 underline uppercase hover:text-blue-900 ml-auto"
                  >
                    <span>Format Template</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SECTION 5: PASS DETAILS & ACTION BAR */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-neo-secondary p-6 sm:p-8 shadow-neo flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border border-black inline-block">
              OFFICIAL TOURNAMENT PASS
            </span>
            <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-emerald-400 text-black border border-black inline-block">
              ✓ PASS ACTIVE &amp; VERIFIED
            </span>
          </div>
          <h3 className="font-black text-xl sm:text-2xl lg:text-3xl text-black uppercase tracking-tight">
            HACKVERSE &apos;26 36-HOUR PASS CONFIRMED
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
            Pass includes continuous 36H arena seating, complimentary food passes, and official state participation certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto xl:justify-end">
          {onEditRegistration && (
            <button
              type="button"
              onClick={canEdit ? onEditRegistration : undefined}
              disabled={!canEdit}
              title={
                canEdit
                  ? `Edit your squad details (${remainingEdits} of ${MAX_EDITS} edits remaining)`
                  : "Edit limit reached (3/3 edits used). Contact organizers for further updates."
              }
              className={clsx(
                "w-full sm:w-auto px-5 py-3.5 border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                canEdit
                  ? "bg-amber-400 hover:bg-amber-300 text-black shadow-neo-sm hover:shadow-none cursor-pointer"
                  : "bg-neutral-300 text-neutral-600 cursor-not-allowed opacity-80"
              )}
            >
              {canEdit ? (
                <>
                  <Edit3 className="w-4 h-4 stroke-[3px]" />
                  <span>EDIT SQUAD ({remainingEdits} LEFT)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[3px]" />
                  <span>EDIT LIMIT EXHAUSTED (3/3)</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[3px]" />
            <span>PRINT / SAVE PASS</span>
          </button>
        </div>
      </div>

      {/* Document Preview Modal Dialog in Dashboard */}
      {previewModal?.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-white border-4 border-black shadow-neo-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neo-accent border-b-4 border-black">
              <div className="flex items-center gap-2 overflow-hidden">
                <Eye className="w-5 h-5 text-black shrink-0 stroke-[2.5px]" />
                <h4 className="font-black text-sm sm:text-base uppercase text-black truncate tracking-tight">
                  PREVIEW: {previewModal.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="px-3 py-1 bg-black text-white hover:bg-rose-600 border-2 border-black font-mono text-xs font-black uppercase shadow-neo-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-auto bg-neutral-100 flex items-center justify-center min-h-[350px]">
              {previewModal.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewModal.url}
                  alt={previewModal.title}
                  className="max-h-[72vh] max-w-full object-contain border-3 border-black bg-white shadow-neo-sm"
                />
              ) : previewModal.type === "pdf" ? (
                <iframe
                  src={previewModal.url}
                  title={previewModal.title}
                  className="w-full h-[72vh] border-3 border-black bg-white shadow-neo-sm"
                />
              ) : (
                <div className="p-8 text-center space-y-4 bg-white border-3 border-black shadow-neo max-w-md mx-auto">
                  <FileText className="w-16 h-16 mx-auto text-black" />
                  <div className="space-y-1">
                    <p className="font-black text-sm uppercase text-black">FILE ATTACHED</p>
                    <p className="font-mono text-xs text-black/70 truncate">{previewModal.title}</p>
                  </div>
                  <a
                    href={previewModal.url}
                    download={previewModal.title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-mono text-xs font-bold uppercase border-2 border-black shadow-neo-sm hover:bg-neutral-800"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="px-4 py-2.5 bg-white border-t-3 border-black flex items-center justify-between text-xs font-mono">
              <span className="text-black/70 font-bold truncate">Document: {previewModal.title}</span>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="px-4 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
