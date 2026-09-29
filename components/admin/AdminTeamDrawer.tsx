"use client";

import React, { useState } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Users,
  Building2,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Globe,
  BedDouble,
  CreditCard,
  FileText,
  ExternalLink,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  QrCode,
  Sparkles,
  Loader2,
  AlertTriangle,
  FolderOpen,
  Code2,
  X,
  Edit3,
} from "lucide-react";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { getSquadProblemStatements } from "@/lib/adminProblemUtils";
import { AdminEditSquadModal } from "@/components/admin/AdminEditSquadModal";
import { toast } from "sonner";

export function AdminTeamDrawer() {
  const {
    selectedSquad,
    setSelectedSquad,
    setSelectedPassSquad,
    handleUpdateStatus,
    handleDispatchEmail,
    handleDeleteSquad,
    handleBanSquad,
    handleUnbanSquad,
    isUpdating,
    isSendingEmail,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"overview" | "members" | "docs" | "finance">("overview");
  const [cachedSquad, setCachedSquad] = useState(selectedSquad);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    if (selectedSquad) {
      setCachedSquad(selectedSquad);
    }
  }, [selectedSquad]);

  const activeSquad = selectedSquad || cachedSquad;

  if (!activeSquad) return null;

  const totalMembers = 1 + (activeSquad.members?.length || 0);

  // Problem statement lookup
  const psChoices = getSquadProblemStatements(activeSquad);

  return (
    <>
      <Sheet
        open={Boolean(selectedSquad)}
        onOpenChange={(open) => {
          if (!open) setSelectedSquad(null);
        }}
      >
        <SheetContent
          showCloseButton={false}
          className="dark w-full sm:max-w-xl md:max-w-2xl bg-neutral-900 border-l-4 border-neutral-700 p-0 flex flex-col h-full max-h-screen overflow-hidden font-sans text-white select-none shadow-2xl"
        >
          {/* Fixed Drawer Header */}
          <div className="shrink-0 p-5 md:p-6 bg-neutral-950 border-b-2 border-neutral-800">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-mono text-xs font-black uppercase px-2 py-0.5 border border-neutral-700 bg-neutral-900 text-amber-400">
                    {activeSquad.registrationNumber}
                  </span>
                  <span
                    className={`font-mono text-xs font-black uppercase px-2 py-0.5 border border-black/40 ${
                      activeSquad.status === "CONFIRMED"
                        ? "bg-emerald-400 text-black font-black"
                        : activeSquad.status === "BANNED"
                        ? "bg-rose-500 text-white font-black"
                        : activeSquad.status === "REJECTED"
                        ? "bg-rose-400 text-black font-black"
                        : "bg-amber-400 text-black font-black"
                    }`}
                  >
                    {activeSquad.status}
                  </span>
                </div>
                <SheetTitle className="text-xl md:text-2xl font-black uppercase tracking-tight text-white truncate">
                  {activeSquad.teamName}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                  <span className="truncate">{activeSquad.collegeName}</span>
                </SheetDescription>
              </div>

              {/* Header Right Action Buttons (EDIT, PASS & Close X) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-1.5 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer"
                  title="Edit team & leader details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>

                <button
                  onClick={() => setSelectedPassSquad(activeSquad)}
                  className="px-3 py-1.5 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>PASS &amp; ID</span>
                </button>

                <button
                  onClick={() => setSelectedSquad(null)}
                  className="w-8 h-8 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center font-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
                  title="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t-2 border-neutral-800 overflow-x-auto">
            {(
              [
                { id: "overview", label: "Squad Info" },
                { id: "members", label: `Roster (${totalMembers})` },
                { id: "docs", label: "Documents" },
                { id: "finance", label: "Finance & Receipt" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 border-2 font-mono text-xs font-black uppercase transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "bg-amber-400 text-black border-amber-400 shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 shadow-[1px_1px_0px_0px_#000000]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Problem Statement Card */}
              <div className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000] space-y-3">
                <div className="font-mono text-xs font-black uppercase text-neutral-400 flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>PROBLEM STATEMENT PREFERENCES</span>
                  </div>
                  {psChoices.hasSelection && (
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-mono font-bold">
                      {psChoices.secondary ? "2 CHOICES SUBMITTED" : "1 CHOICE SUBMITTED"}
                    </span>
                  )}
                </div>

                {psChoices.hasSelection ? (
                  <div className="space-y-3 font-mono text-xs">
                    {/* Primary Preference */}
                    {psChoices.primary && (
                      <div className="p-3 border-2 border-cyan-900/60 bg-cyan-950/20 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-cyan-400 text-black font-black text-[10px] uppercase">
                            PREFERENCE #1 (PRIMARY)
                          </span>
                          <span className="text-cyan-300 font-black text-xs">
                            {psChoices.primary.code} [{psChoices.primary.id}]
                          </span>
                        </div>
                        <div className="font-black text-sm text-white font-sans mt-1">
                          {psChoices.primary.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Category: <strong className="text-neutral-200">{psChoices.primary.category}</strong> ({psChoices.primary.domain})
                        </div>
                      </div>
                    )}

                    {/* Secondary Preference */}
                    {psChoices.secondary && (
                      <div className="p-3 border-2 border-purple-900/60 bg-purple-950/20 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-purple-400 text-black font-black text-[10px] uppercase">
                            PREFERENCE #2 (SECONDARY)
                          </span>
                          <span className="text-purple-300 font-black text-xs">
                            {psChoices.secondary.code} [{psChoices.secondary.id}]
                          </span>
                        </div>
                        <div className="font-black text-sm text-white font-sans mt-1">
                          {psChoices.secondary.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Category: <strong className="text-neutral-200">{psChoices.secondary.category}</strong> ({psChoices.secondary.domain})
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-mono text-xs text-neutral-500 italic py-2">
                    No problem statement chosen yet (Open Innovation / Pending selection).
                  </div>
                )}
              </div>

              {/* Leader Details Card */}
              <div className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000] space-y-3">
                <div className="font-mono text-xs font-black uppercase text-neutral-400 flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>SQUAD LEADER</span>
                  <span className="px-2 py-0.5 bg-amber-400 text-black border border-black text-[10px] font-black">
                    LEAD CONTACT
                  </span>
                </div>

                <div className="font-black text-lg text-white">{activeSquad.leaderName}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span className="truncate">{activeSquad.leaderEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{activeSquad.leaderPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <GraduationCap className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span className="truncate">
                      {activeSquad.leaderBranch} ({activeSquad.leaderYear})
                    </span>
                  </div>
                  {activeSquad.leaderGithub && (
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Code2 className="w-4 h-4 text-neutral-500 shrink-0" />
                      <a
                        href={`https://github.com/${activeSquad.leaderGithub}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        github.com/{activeSquad.leaderGithub}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* College Address */}
              {activeSquad.collegeAddress && (
                <div className="border-2 border-neutral-800 bg-neutral-950 p-4 text-xs font-mono space-y-1 shadow-[2px_2px_0px_0px_#000000]">
                  <div className="font-black uppercase text-neutral-400 mb-1">
                    INSTITUTE ADDRESS
                  </div>
                  <div className="font-bold text-neutral-200">
                    {activeSquad.collegeAddress.fullAddress ||
                      `${activeSquad.collegeAddress.street || ""}, ${activeSquad.collegeAddress.city || ""}, ${activeSquad.collegeAddress.state || ""} - ${activeSquad.collegeAddress.pincode || ""}`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEMBERS ROSTER */}
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="border-2 border-neutral-800 bg-neutral-950 p-3 flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-amber-400">
                  Squad Size: {totalMembers} Hackers
                </span>
                <span className="font-mono text-[10px] bg-neutral-800 text-neutral-200 px-2 py-0.5 font-bold">
                  VERIFIED ROSTER
                </span>
              </div>

              {/* Leader Row */}
              <div className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-black text-sm text-white">{activeSquad.leaderName}</div>
                  <span className="px-2 py-0.5 border border-black bg-amber-400 text-black font-mono text-[10px] font-black uppercase">
                    Team Leader
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-400 space-y-1">
                  <div>Email: {activeSquad.leaderEmail}</div>
                  <div>Phone: {activeSquad.leaderPhone}</div>
                  <div>
                    Branch: {activeSquad.leaderBranch} | Year: {activeSquad.leaderYear}
                  </div>
                </div>
              </div>

              {/* Members Rows */}
              {activeSquad.members && activeSquad.members.length > 0 ? (
                activeSquad.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-black text-sm text-white">{m.fullName}</div>
                      <span className="px-2 py-0.5 border border-black bg-cyan-400 text-black font-mono text-[10px] font-black uppercase">
                        Member #{idx + 1}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neutral-400 space-y-1">
                      <div>Email: {m.email}</div>
                      {m.phone && <div>Phone: {m.phone}</div>}
                      {m.branch && (
                        <div>
                          Branch: {m.branch} | Year: {m.yearOfStudy || "N/A"}
                        </div>
                      )}
                      {m.githubUsername && (
                        <div className="text-cyan-400 font-bold flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>@{m.githubUsername}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-neutral-800 text-center font-mono text-xs text-neutral-500">
                  Solo participant (No additional teammates registered).
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "docs" && (
            <div className="space-y-4">
              <div className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000] space-y-3">
                <div className="font-mono text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2">
                  UPLOADED VERIFICATION ARTIFACTS
                </div>

                {/* College ID Card */}
                <div className="flex items-center justify-between p-3 border-2 border-neutral-800 bg-neutral-900">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-white truncate">
                        {activeSquad.documents?.collegeIdFileName || "College ID Card"}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-400">
                        {activeSquad.documents?.collegeIdFileSize || "Verification Document"}
                      </div>
                    </div>
                  </div>
                  {activeSquad.documents?.collegeIdDriveUrl ||
                  activeSquad.documents?.collegeIdDriveFileId ? (
                    <a
                      href={
                        activeSquad.documents.collegeIdDriveUrl ||
                        `/api/admin/drive/preview?fileId=${activeSquad.documents.collegeIdDriveFileId}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>VIEW</span>
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] text-neutral-500">NOT UPLOADED</span>
                  )}
                </div>

                {/* Synopsis / Proposal */}
                <div className="flex items-center justify-between p-3 border-2 border-neutral-800 bg-neutral-900">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-white truncate">
                        {activeSquad.documents?.synopsisFileName || "Project Synopsis / PPT"}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-400">
                        {activeSquad.documents?.synopsisFileSize || "Synopsis Proposal"}
                      </div>
                    </div>
                  </div>
                  {activeSquad.documents?.synopsisDriveUrl ||
                  activeSquad.documents?.synopsisDriveFileId ? (
                    <a
                      href={
                        activeSquad.documents.synopsisDriveUrl ||
                        `/api/admin/drive/preview?fileId=${activeSquad.documents.synopsisDriveFileId}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>VIEW</span>
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] text-neutral-500">NOT UPLOADED</span>
                  )}
                </div>

                {/* GitHub Repo */}
                {activeSquad.documents?.githubRepoUrl && (
                  <div className="flex items-center justify-between p-3 border-2 border-neutral-800 bg-neutral-900">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 className="w-5 h-5 text-neutral-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono text-xs font-bold text-white truncate">
                          Project Source Code
                        </div>
                        <div className="font-mono text-[10px] text-cyan-400 truncate">
                          {activeSquad.documents.githubRepoUrl}
                        </div>
                      </div>
                    </div>
                    <a
                      href={activeSquad.documents.githubRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-lime-400 hover:bg-lime-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & RECEIPT */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              {/* Payment Card */}
              <div className="border-2 border-neutral-800 bg-neutral-950 p-4 shadow-[2px_2px_0px_0px_#000000] space-y-3">
                <div className="font-mono text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2 flex items-center justify-between">
                  <span>PAYMENT &amp; RECEIPT</span>
                  <span
                    className={`px-2 py-0.5 border border-black font-mono text-[10px] font-black uppercase ${
                      activeSquad.paymentStatus === "VERIFIED"
                        ? "bg-emerald-400 text-black"
                        : activeSquad.paymentStatus === "PENDING"
                        ? "bg-rose-400 text-black"
                        : "bg-cyan-400 text-black"
                    }`}
                  >
                    {activeSquad.paymentStatus || "FREE TIER"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-neutral-500 block">Fee Amount:</span>
                    <span className="font-black text-sm text-white">
                      ₹{activeSquad.amount ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Payment Mode:</span>
                    <span className="font-bold text-neutral-200">
                      {activeSquad.paymentMode || "FREE_SPONSORED"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 block">Transaction UTR:</span>
                    <span className="font-bold font-mono bg-neutral-900 px-2 py-1 border border-neutral-800 block text-neutral-200 truncate">
                      {activeSquad.transactionId || "N/A (Free Registration)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Action Footer Controls at Bottom */}
        <div className="shrink-0 p-4 md:p-5 bg-neutral-950 border-t-2 border-neutral-800 space-y-2.5">
          <div className="font-mono text-[11px] font-black uppercase text-neutral-400">
            SQUAD MANAGEMENT ACTIONS
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Confirm / Approve */}
            {activeSquad.status !== "CONFIRMED" ? (
              <button
                onClick={() => handleUpdateStatus(activeSquad.id, "CONFIRMED")}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM SQUAD</span>
              </button>
            ) : (
              <button
                onClick={() => handleUpdateStatus(activeSquad.id, "PENDING_VERIFICATION")}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>MARK PENDING</span>
              </button>
            )}

            {/* Reject / Undo */}
            {activeSquad.status !== "REJECTED" ? (
              <button
                onClick={() => handleUpdateStatus(activeSquad.id, "REJECTED")}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-rose-500 bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>REJECT SQUAD</span>
              </button>
            ) : (
              <button
                onClick={() => handleUpdateStatus(activeSquad.id, "CONFIRMED")}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>RESTORE SQUAD</span>
              </button>
            )}

            {/* Send Email */}
            <button
              onClick={() => handleDispatchEmail(activeSquad.id, "approval")}
              disabled={isSendingEmail}
              className="py-2.5 px-3 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
            >
              {isSendingEmail ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>SEND PASS EMAIL</span>
            </button>

            {/* Ban / Unban */}
            {activeSquad.status === "BANNED" ? (
              <button
                onClick={() => handleUnbanSquad(activeSquad)}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>UNBAN SQUAD</span>
              </button>
            ) : (
              <button
                onClick={() => handleBanSquad(activeSquad)}
                disabled={isUpdating}
                className="py-2.5 px-3 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-rose-400 font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>BAN SQUAD</span>
              </button>
            )}
          </div>

          {/* Edit All Squad Details Primary Action */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-2.5 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>EDIT ALL SQUAD DETAILS &amp; CREDENTIALS</span>
          </button>

          {/* Permanent Delete */}
          <button
            onClick={() => handleDeleteSquad(activeSquad.id, activeSquad.teamName)}
            disabled={isUpdating}
            className="w-full py-2 border-2 border-rose-600/50 bg-neutral-900 hover:bg-rose-950/40 text-rose-400 font-mono text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>PERMANENTLY DELETE RECORD</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>

    {/* Full Squad Details & Auth Email Edit Modal */}
    <AdminEditSquadModal
      squad={activeSquad}
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
    />
  </>
  );
}
