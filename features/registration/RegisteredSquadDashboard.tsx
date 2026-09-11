"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Lock,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  HelpCircle,
  Home,
  Check,
} from "lucide-react";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { RegistrationSuccessReceipt } from "./RegistrationSuccessReceipt";
import { toast } from "sonner";
import clsx from "clsx";

const BRANCH_OPTIONS = [
  { value: "Computer Science & Engineering", label: "Computer Science & Engineering (CSE)" },
  { value: "Information Technology", label: "Information Technology (IT)" },
  { value: "Electrical Engineering", label: "Electrical Engineering (EE)" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering (ME)" },
  { value: "Civil Engineering", label: "Civil Engineering (CE)" },
  { value: "Electronics & Telecommunication", label: "Electronics & Telecomm (ETC)" },
  { value: "Artificial Intelligence & Data Science", label: "AI & Data Science (AI/DS)" },
  { value: "BCA / MCA / B.Sc / M.Sc", label: "BCA / MCA / B.Sc / M.Sc" },
  { value: "Other", label: "Other (Specify Custom Branch)" },
];

const YEAR_OPTIONS = [
  { value: "1st Year", label: "1st Year (Freshman)" },
  { value: "2nd Year", label: "2nd Year (Sophomore)" },
  { value: "3rd Year", label: "3rd Year (Junior)" },
  { value: "4th Year", label: "4th Year (Senior)" },
  { value: "PG / Diploma", label: "Postgraduate / Diploma" },
];

const LEADER_ROLE_OPTIONS = [
  { value: "Leader", label: "Squad Leader / Captain" },
  { value: "Full Stack", label: "Leader & Full Stack Engineer" },
  { value: "Frontend", label: "Leader & Frontend Engineer" },
  { value: "Backend", label: "Leader & Backend Engineer" },
  { value: "AI/ML", label: "Leader & AI/ML Specialist" },
  { value: "Designer", label: "Leader & UI/UX Designer" },
  { value: "Hardware/IoT", label: "Leader & Hardware/IoT Engineer" },
];

const MEMBER_ROLE_OPTIONS = [
  { value: "Frontend", label: "Frontend Engineer" },
  { value: "Backend", label: "Backend / Systems Engineer" },
  { value: "AI/ML", label: "AI / ML Specialist" },
  { value: "Full Stack", label: "Full Stack Generalist" },
  { value: "Designer", label: "UI / UX Designer" },
  { value: "Hardware/IoT", label: "Hardware / IoT Engineer" },
];

export interface RegisteredSquadDashboardProps {
  teamData: any;
  userRoleInTeam: "LEADER" | "MEMBER";
  currentUser: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isProblemStatementsPublished?: boolean;
  onRegisterNewTeam?: () => void;
}

export function RegisteredSquadDashboard({
  teamData: initialTeamData,
  userRoleInTeam,
  currentUser,
  isProblemStatementsPublished,
}: RegisteredSquadDashboardProps) {
  const [teamData, setTeamData] = useState<any>(initialTeamData);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync state if initial prop updates
  useEffect(() => {
    setTeamData(initialTeamData);
  }, [initialTeamData]);

  // Lock body scrolling when modal is open to prevent background page scroll
  useEffect(() => {
    if (showEditModal || showConfirmSaveModal || showReceiptModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showEditModal, showConfirmSaveModal, showReceiptModal]);

  const [isLive, setIsLive] = useState<boolean>(
    typeof isProblemStatementsPublished === "boolean" ? isProblemStatementsPublished : true
  );

  useEffect(() => {
    if (typeof isProblemStatementsPublished === "boolean") {
      setIsLive(isProblemStatementsPublished);
    } else {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((d) => {
          if (d?.settings && typeof d.settings.isProblemStatementsPublished === "boolean") {
            setIsLive(d.settings.isProblemStatementsPublished);
          }
        })
        .catch(() => {});
    }
  }, [isProblemStatementsPublished]);

  const isLeader = userRoleInTeam === "LEADER";
  const status = teamData.status || "PENDING_VERIFICATION";

  // Edit Quota calculations
  const maxEdits = teamData.maxEdits ?? 3;
  const editCount = teamData.editCount ?? 0;
  const remainingEdits = Math.max(0, maxEdits - editCount);
  const canLeaderEdit = isLeader && remainingEdits > 0;

  // Edit Form State
  const [editForm, setEditForm] = useState({
    teamName: "",
    collegeName: "",
    collegeAddress: {
      fullAddress: "",
      city: "",
      state: "Odisha",
      pincode: "",
    },
    leader: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      branch: "Computer Science & Engineering",
      customBranch: "",
      year: "3rd Year",
      role: "Leader",
      github: "",
      dateOfBirth: "",
    },
    members: [] as any[],
    accommodationRequired: false,
  });

  // Open Edit Modal & Populate Form
  const handleOpenEditModal = () => {
    if (!canLeaderEdit) {
      if (!isLeader) {
        toast.error("Only the Team Leader is authorized to edit squad details.");
      } else {
        toast.error("Maximum edit limit reached (3/3 edits used). Contact organizers for assistance.");
      }
      return;
    }

    const currentMembers = Array.isArray(teamData.members)
      ? JSON.parse(JSON.stringify(teamData.members))
      : [];

    setEditForm({
      teamName: teamData.teamName || "",
      collegeName: teamData.collegeName || "",
      collegeAddress: {
        fullAddress: teamData.collegeAddress?.fullAddress || "",
        city: teamData.collegeAddress?.city || "",
        state: teamData.collegeAddress?.state || "Odisha",
        pincode: teamData.collegeAddress?.pincode || "",
      },
      leader: {
        name: teamData.leader?.name || teamData.leaderName || "",
        email: teamData.leader?.email || teamData.leaderEmail || "",
        phone: teamData.leader?.phone || teamData.leaderPhone || "",
        whatsapp: teamData.leader?.whatsapp || teamData.leaderWhatsapp || teamData.leaderPhone || "",
        branch: teamData.leader?.branch || teamData.leaderBranch || "Computer Science & Engineering",
        customBranch: teamData.leader?.customBranch || teamData.leaderCustomBranch || "",
        year: teamData.leader?.year || teamData.leaderYear || "3rd Year",
        role: teamData.leader?.role || teamData.leaderRole || "Leader",
        github: teamData.leader?.github || teamData.leaderGithub || "",
        dateOfBirth: teamData.leader?.dateOfBirth || teamData.leaderDob || "",
      },
      members: currentMembers.length > 0 ? currentMembers : [
        {
          fullName: "",
          email: "",
          phone: "",
          whatsappNumber: "",
          branch: "Computer Science & Engineering",
          customBranch: "",
          yearOfStudy: "3rd Year",
          role: "Frontend",
          githubUsername: "",
        }
      ],
      accommodationRequired: Boolean(teamData.accommodationRequired),
    });

    setEditError(null);
    setShowEditModal(true);
  };

  // Add a new member in Edit Modal (Total members 1 to 3 co-hackers)
  const handleAddMember = () => {
    if (editForm.members.length >= 3) {
      toast.error("Maximum 4 total squad members allowed (1 Leader + 3 Co-Hackers).");
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          fullName: "",
          email: "",
          phone: "",
          whatsappNumber: "",
          branch: "Computer Science & Engineering",
          customBranch: "",
          yearOfStudy: "3rd Year",
          role: "Frontend",
          githubUsername: "",
        },
      ],
    }));
  };

  // Remove a member in Edit Modal (Minimum 1 co-hacker required for min squad size 2)
  const handleRemoveMember = (indexToRemove: number) => {
    if (editForm.members.length <= 1) {
      toast.error("Squad must have at least 1 Co-Hacker (minimum 2 total members).");
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Update a specific member field
  const handleMemberChange = (index: number, field: string, value: any) => {
    setEditForm((prev) => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, members: updated };
    });
  };

  // Validate and submit form
  const handleValidateBeforeConfirm = () => {
    setEditError(null);

    if (!editForm.teamName.trim()) {
      setEditError("Please enter a valid Team Name.");
      return;
    }
    if (!editForm.collegeName.trim()) {
      setEditError("Please enter your College / University name.");
      return;
    }
    if (!editForm.leader.phone.trim() || editForm.leader.phone.replace(/\D/g, "").length < 10) {
      setEditError("Leader phone number must be a valid 10-digit number.");
      return;
    }

    if (editForm.members.length < 1 || editForm.members.length > 3) {
      setEditError("Squad must have between 1 and 3 co-hackers (total 2 to 4 members).");
      return;
    }

    // Check member details & duplicate emails
    const seenEmails = new Set<string>();
    seenEmails.add(editForm.leader.email.toLowerCase().trim());

    for (let i = 0; i < editForm.members.length; i++) {
      const m = editForm.members[i];
      if (!m.fullName || !m.fullName.trim()) {
        setEditError(`Member #${i + 2}: Full Name is required.`);
        return;
      }
      if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim())) {
        setEditError(`Member #${i + 2}: Valid email address is required.`);
        return;
      }
      const normEmail = m.email.toLowerCase().trim();
      if (seenEmails.has(normEmail)) {
        setEditError(`Duplicate email "${m.email}" found. Each member must have a unique email.`);
        return;
      }
      seenEmails.add(normEmail);

      if (!m.phone || m.phone.replace(/\D/g, "").length < 10) {
        setEditError(`Member #${i + 2}: Valid 10-digit phone number is required.`);
        return;
      }
    }

    setShowConfirmSaveModal(true);
  };

  const handleExecuteSave = async () => {
    setIsSaving(true);
    setEditError(null);
    try {
      const res = await fetch("/api/team/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update team details.");
      }

      toast.success(data.message || "Squad profile updated successfully!");
      if (data.team) {
        setTeamData(data.team);
      }
      setShowConfirmSaveModal(false);
      setShowEditModal(false);
    } catch (err: any) {
      console.error("Error saving team edits:", err);
      setEditError(err.message || "An unexpected error occurred while saving.");
      toast.error(err.message || "Failed to save edits.");
      setShowConfirmSaveModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Find problem statement objects if selected (1 mandatory, optional 2nd)
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
          <div className="space-y-2">
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
              {teamData.accommodationRequired && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-black font-black text-[10px] uppercase">
                  HOSTEL ACCOMMODATION REQUESTED
                </span>
              )}
            </div>
          </div>

          {/* User Account Info Chip & Quick Edit Button */}
          <div className="flex flex-col gap-2 shrink-0">
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

            {isLeader && (
              <button
                type="button"
                onClick={handleOpenEditModal}
                disabled={!canLeaderEdit}
                className={clsx(
                  "px-4 py-2 border-3 border-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neo-sm hover:shadow-none",
                  canLeaderEdit
                    ? "bg-amber-300 hover:bg-amber-400 text-black"
                    : "bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-400"
                )}
              >
                {canLeaderEdit ? (
                  <>
                    <Edit3 className="w-4 h-4 stroke-[2.5px]" />
                    <span>EDIT SQUAD PROFILE ({remainingEdits}/3 LEFT)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>EDITS LOCKED (3/3 USED)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Notice */}
        <div className="p-3.5 sm:p-4 bg-emerald-50 border-3 border-black text-xs sm:text-sm font-bold text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[3px] shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-snug">
              Your team credentials and registration pass are active in the HACKVERSE &apos;26 system.
              {isLeader && remainingEdits > 0 && (
                <span className="text-emerald-800 block sm:inline sm:ml-1 font-extrabold">
                  (You can modify squad details {remainingEdits} more time{remainingEdits === 1 ? "" : "s"}).
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>VIEW DIGITAL PASS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PROBLEM STATEMENT PREFERENCES STATUS */}
      {/* ========================================================================= */}
      {!isLive ? (
        <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <FileCode2 className="w-5 h-5 text-black stroke-[2.5px]" />
              <h3 className="font-black text-xl uppercase tracking-tight text-black">
                PROBLEM STATEMENT ALLOCATION
              </h3>
            </div>
            <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-white border border-black shadow-neo-sm self-start sm:self-auto flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>RELEASE PENDING</span>
            </span>
          </div>

          <div className="p-5 bg-neutral-100 border-3 border-black space-y-3">
            <div className="flex items-center gap-2 text-black font-black text-sm">
              <Clock className="w-5 h-5 text-amber-700 stroke-[2.5px]" />
              <span>PROBLEM STATEMENTS COMING SOON</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-black/75 leading-relaxed">
              Problem statements are not live yet. Once officially unlocked by the organizers, you will be able to select your squad&apos;s primary (mandatory) and optional secondary track preferences here.
            </p>
            <div className="font-mono text-[11px] text-neutral-600 font-bold">
              STATUS: STANDBY • REGISTRATION LOCKED FOR SQUAD {teamData.teamName}
            </div>
          </div>
        </div>
      ) : (
        <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3">
            <div className="flex items-center gap-2.5">
              <FileCode2 className="w-5 h-5 text-black stroke-[2.5px]" />
              <h3 className="font-black text-xl uppercase tracking-tight text-black">
                PROBLEM STATEMENT ALLOCATION {psIds.length >= 1 ? `(${psIds.length} ${psIds.length === 1 ? "PREFERENCE" : "PREFERENCES"})` : ""}
              </h3>
            </div>

            <Link
              href="/register/ps"
              className="px-4 py-2 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>{psIds.length >= 1 ? "MODIFY CHOICES" : "SELECT STATEMENTS NOW"}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
            </Link>
          </div>

          {psIds.length >= 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preference 1 Card (Mandatory) */}
              <div className="p-4 bg-amber-50 border-3 border-black shadow-neo-sm space-y-2">
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-secondary text-black border border-black inline-block">
                  ★ CHOICE #1 (PRIMARY PREFERENCE - MANDATORY)
                </span>
                <div className="font-black text-base uppercase text-black">
                  [{pref1?.code || psIds[0]}] {pref1?.title || "Problem Statement"}
                </div>
                <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
                  {pref1?.shortDescription || "Selected as primary 1st preference for hackathon evaluation."}
                </p>
                <div className="font-mono text-[11px] text-black/60 pt-1">
                  Domain: {pref1?.domain || "Assigned Track"}
                </div>
              </div>

              {/* Preference 2 Card (Optional) */}
              {pref2 || psIds[1] ? (
                <div className="p-4 bg-rose-50 border-3 border-black shadow-neo-sm space-y-2">
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-accent text-black border border-black inline-block">
                    ★ CHOICE #2 (SECONDARY PREFERENCE - OPTIONAL)
                  </span>
                  <div className="font-black text-base uppercase text-black">
                    [{pref2?.code || psIds[1]}] {pref2?.title || "Problem Statement"}
                  </div>
                  <p className="text-xs font-bold text-black/75 line-clamp-2 leading-relaxed">
                    {pref2?.shortDescription || "Selected as 2nd preference for hackathon evaluation."}
                  </p>
                  <div className="font-mono text-[11px] text-black/60 pt-1">
                    Domain: {pref2?.domain || "Assigned Track"}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-neutral-50 border-3 border-dashed border-black/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-200 text-black border border-black inline-block">
                      CHOICE #2 (OPTIONAL SECONDARY PREFERENCE)
                    </span>
                    <div className="font-black text-sm uppercase text-black/70 pt-1">
                      No 2nd Preference Added (Optional)
                    </div>
                    <p className="text-xs font-bold text-black/50 leading-relaxed">
                      Your squad has locked 1 primary track. You may optionally choose a secondary track before submission closes.
                    </p>
                  </div>
                  <Link
                    href="/register/ps"
                    className="self-start px-3 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-mono font-bold text-xs uppercase shadow-neo-sm flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add 2nd Preference (Optional)</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 bg-amber-100 border-3 border-black space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-800 stroke-[3px]" />
                <span>PROBLEM STATEMENTS ARE LIVE — SELECTION REQUIRED!</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
                Problem statements are officially live! Every registered squad must select at least <strong>ONE (1) primary problem statement</strong> (Mandatory). You may optionally choose a <strong>2nd preference</strong> (Optional).
              </p>
              <Link
                href="/register/ps"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neo-secondary hover:bg-neo-accent text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
              >
                <span>SELECT PROBLEM STATEMENTS NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SQUAD ROSTER (LEADER & ALL MEMBERS) */}
      {/* ========================================================================= */}
      <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 border-b-3 border-black pb-3">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <Users className="w-5 h-5 text-black stroke-[2.5px] shrink-0 mt-0.5 sm:mt-0" />
            <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-tight">
              SQUAD ROSTER &amp; MEMBER CREDENTIALS{" "}
              <span className="text-black/60 font-mono text-xs sm:text-sm font-bold block sm:inline sm:ml-1">
                (1 LEADER + {membersList.length} CO-HACKERS)
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {isLeader && canLeaderEdit && (
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="px-3 py-1 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT ROSTER</span>
              </button>
            )}
            <span className="font-mono text-xs font-black bg-black text-white px-2.5 py-1 border border-black uppercase hidden sm:inline-block shrink-0 shadow-neo-sm">
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

              {isLeader && (
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
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
              {teamData.leader?.whatsapp && teamData.leader?.whatsapp !== teamData.leader?.phone && (
                <div className="text-[11px] text-emerald-800 font-bold">
                  WhatsApp: {teamData.leader.whatsapp}
                </div>
              )}
              {teamData.leader?.github && (
                <div className="text-[11px] text-neutral-600 font-bold">
                  GitHub: @{teamData.leader.github}
                </div>
              )}
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
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black">
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
                  {member.githubUsername && (
                    <div className="text-[11px] text-neutral-600 font-bold">
                      GitHub: @{member.githubUsername}
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
            Pass includes continuous 24H arena seating, complimentary food passes, and official state participation certificates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {isLeader && canLeaderEdit && (
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-5 py-3.5 bg-amber-300 hover:bg-amber-400 text-black border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 stroke-[3px]" />
              <span>EDIT SQUAD ({remainingEdits}/3)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[3px]" />
            <span>PRINT / SAVE PASS</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SQUAD EDIT MODAL (PORTALED TO BODY WITH TOP NAVBAR CLEARANCE) */}
      {/* ========================================================================= */}
      {showEditModal &&
        isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[9999] bg-black/85 flex flex-col items-center justify-start p-3 sm:p-6 pt-24 sm:pt-28 pb-4 sm:pb-6 backdrop-blur-xs overscroll-contain overflow-hidden"
            onClick={() => setShowEditModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl lg:max-w-4xl bg-white border-4 border-black shadow-neo-lg max-h-[calc(100dvh-125px)] sm:max-h-[calc(100vh-135px)] flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="py-3 px-4 sm:py-4 sm:px-6 bg-neo-secondary border-b-3 border-black flex items-center justify-between shrink-0">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 bg-black text-white border border-black shadow-neo-sm">
                      SQUAD MODIFICATION PORTAL
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 bg-amber-300 text-black border border-black shadow-neo-sm">
                      {remainingEdits} OF {maxEdits} EDITS REMAINING
                    </span>
                  </div>
                  <h3 className="font-black text-lg sm:text-2xl uppercase tracking-tight text-black truncate">
                    EDIT SQUAD DETAILS
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-rose-400 border-2 border-black font-black text-base flex items-center justify-center shadow-neo-sm hover:shadow-none transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              {/* Quota Warning Alert */}
              <div className="py-2.5 px-4 sm:px-6 bg-amber-100 border-b-3 border-black flex items-start gap-2.5 shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-900 stroke-[2.5px] shrink-0 mt-0.5" />
                <div className="text-xs font-bold text-amber-950">
                  <span>
                    <strong>NOTICE:</strong> Team leaders can edit team details a maximum of <strong>3 times</strong>.
                    Saving changes here will use <strong>1 of your {remainingEdits} remaining edit attempts</strong>.
                  </span>
                </div>
              </div>

              {/* Modal Body (Scrollable with Lenis prevent) */}
              <div
                data-lenis-prevent="true"
                className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1 font-sans overscroll-contain"
              >
              {editError && (
                <div className="p-4 bg-rose-100 border-3 border-black font-mono text-xs font-black text-rose-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700 stroke-[3px] shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              {/* 1. SQUAD & COLLEGE INFO */}
              <div className="border-3 border-black p-5 bg-neutral-50 space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-black/20 pb-2">
                  <Building2 className="w-5 h-5 text-black stroke-[2.5px]" />
                  <h4 className="font-black text-base uppercase text-black">
                    1. SQUAD &amp; INSTITUTE PROFILE
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Squad / Team Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.teamName}
                      onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. ByteBusters"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      College / University Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.collegeName}
                      onChange={(e) => setEditForm({ ...editForm, collegeName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. Govt College of Engineering Kalahandi"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      City / District *
                    </label>
                    <input
                      type="text"
                      value={editForm.collegeAddress.city}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          collegeAddress: { ...editForm.collegeAddress, city: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. Bhawanipatna"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      State *
                    </label>
                    <input
                      type="text"
                      value={editForm.collegeAddress.state}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          collegeAddress: { ...editForm.collegeAddress, state: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. Odisha"
                    />
                  </div>
                </div>
              </div>

              {/* 2. TEAM LEADER PROFILE */}
              <div className="border-3 border-black p-5 bg-amber-50/60 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-950 fill-amber-950" />
                    <h4 className="font-black text-base uppercase text-black">
                      2. TEAM LEADER DETAILS (YOU)
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">
                    LEADER
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Leader Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={editForm.leader.name}
                      className="w-full px-3 py-2 bg-neutral-200 border-2 border-black font-mono text-xs font-bold text-black/70 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Leader Email (Primary Account)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={editForm.leader.email}
                      className="w-full px-3 py-2 bg-neutral-200 border-2 border-black font-mono text-xs font-bold text-black/70 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Phone Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      value={editForm.leader.phone}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, phone: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.leader.whatsapp}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, whatsapp: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Branch / Department *
                    </label>
                    <select
                      value={editForm.leader.branch}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, branch: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                    >
                      {BRANCH_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Year of Study *
                    </label>
                    <select
                      value={editForm.leader.year}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, year: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y.value} value={y.value}>
                          {y.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Role in Squad
                    </label>
                    <select
                      value={editForm.leader.role}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, role: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                    >
                      {LEADER_ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={editForm.leader.github}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          leader: { ...editForm.leader, github: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none shadow-neo-sm"
                      placeholder="e.g. torvalds"
                    />
                  </div>
                </div>
              </div>

              {/* 3. CO-HACKERS ROSTER */}
              <div className="border-3 border-black p-5 bg-neutral-50 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-black stroke-[2.5px]" />
                    <h4 className="font-black text-base uppercase text-black">
                      3. SQUAD CO-HACKERS ROSTER ({editForm.members.length} MEMBERS)
                    </h4>
                  </div>
                  {editForm.members.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-3 py-1.5 bg-emerald-300 hover:bg-emerald-400 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>ADD CO-HACKER #{editForm.members.length + 2}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {editForm.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-black bg-white p-4 shadow-neo-sm space-y-4 relative"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-black/15 pb-2">
                        <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-neo-muted text-black border border-black">
                          CO-HACKER #{idx + 2}
                        </span>

                        {editForm.members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-300 text-rose-900 border border-black font-black text-[11px] uppercase flex items-center gap-1 cursor-pointer"
                            title="Remove this member from squad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>REMOVE MEMBER</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={member.fullName || member.name || ""}
                            onChange={(e) => handleMemberChange(idx, "fullName", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                            placeholder="Full Name"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={member.email || ""}
                            onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                            placeholder="email@college.edu"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={member.phone || ""}
                            onChange={(e) => handleMemberChange(idx, "phone", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                            placeholder="10-digit number"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Branch *
                          </label>
                          <select
                            value={member.branch || "Computer Science & Engineering"}
                            onChange={(e) => handleMemberChange(idx, "branch", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                          >
                            {BRANCH_OPTIONS.map((b) => (
                              <option key={b.value} value={b.value}>
                                {b.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Year *
                          </label>
                          <select
                            value={member.yearOfStudy || "3rd Year"}
                            onChange={(e) => handleMemberChange(idx, "yearOfStudy", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                          >
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y.value} value={y.value}>
                                {y.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[11px] font-black uppercase text-black">
                            Role
                          </label>
                          <select
                            value={member.role || "Frontend"}
                            onChange={(e) => handleMemberChange(idx, "role", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-black font-mono text-xs font-bold text-black focus:bg-amber-50 focus:outline-none"
                          >
                            {MEMBER_ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. ACCOMMODATION PREFERENCE */}
              {/* <div className="border-3 border-black p-5 bg-blue-50/60 space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-black/20 pb-2">
                  <Home className="w-5 h-5 text-blue-900 stroke-[2.5px]" />
                  <h4 className="font-black text-base uppercase text-black">
                    4. EVENT ACCOMMODATION PREFERENCE
                  </h4>
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editForm.accommodationRequired}
                    onChange={(e) =>
                      setEditForm({ ...editForm, accommodationRequired: e.target.checked })
                    }
                    className="w-5 h-5 border-2 border-black rounded-none text-black focus:ring-0 accent-black cursor-pointer"
                  />
                  <span className="font-bold text-xs sm:text-sm text-black">
                    Request On-Campus Hostel Accommodation for our squad during Hackathon days (Subject to availability)
                  </span>
                </label>
              </div> */}
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 bg-neutral-100 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="font-mono text-xs font-black text-black/80">
                EDIT QUOTA: <span className="text-amber-800">{remainingEdits} / {maxEdits} ATTEMPTS LEFT</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-200 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleValidateBeforeConfirm}
                  className="w-1/2 sm:w-auto px-6 py-2.5 bg-neo-secondary hover:bg-neo-accent text-black border-2 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[3px]" />
                  <span>REVIEW &amp; SAVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* CONFIRM EDIT SUBMISSION POPUP */}
      {/* ========================================================================= */}
      {showConfirmSaveModal &&
        isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[10000] bg-black/85 flex flex-col items-center justify-center p-4 pt-24 sm:pt-28 pb-4 backdrop-blur-xs overscroll-contain overflow-y-auto"
            onClick={() => setShowConfirmSaveModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border-4 border-black shadow-neo-lg p-6 space-y-5 animate-in zoom-in-95 duration-150 overflow-hidden"
            >
              <div className="w-12 h-12 bg-amber-300 border-3 border-black flex items-center justify-center shadow-neo-sm mx-auto">
                <AlertTriangle className="w-6 h-6 text-black stroke-[3px]" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-black text-xl uppercase tracking-tight text-black">
                  CONFIRM SQUAD MODIFICATION?
                </h3>
                <p className="font-bold text-xs sm:text-sm text-black/80 leading-relaxed">
                  Saving these changes will use <strong>1 of your {remainingEdits} remaining edits</strong>. After this update, you will have <strong>{remainingEdits - 1} edit{remainingEdits - 1 === 1 ? "" : "s"} left</strong>.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border-2 border-black text-xs font-mono font-bold text-amber-950 text-center">
                Target Team: <strong className="uppercase">{editForm.teamName}</strong> • {editForm.members.length + 1} Total Members
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowConfirmSaveModal(false)}
                  className="w-1/2 px-4 py-3 bg-neutral-200 hover:bg-neutral-300 text-black border-2 border-black font-black text-xs uppercase cursor-pointer"
                >
                  BACK
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleExecuteSave}
                  className="w-1/2 px-4 py-3 bg-neo-secondary hover:bg-neo-accent text-black border-2 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>CONFIRM &amp; SAVE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================================= */}
      {/* PRINT / SAVE ENTRY PASS MODAL */}
      {/* ========================================================================= */}
      {showReceiptModal &&
        isMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[9999] bg-black/85 flex flex-col items-center justify-start p-3 sm:p-6 pt-24 sm:pt-28 pb-4 sm:pb-6 backdrop-blur-xs overscroll-contain overflow-hidden"
            onClick={() => setShowReceiptModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white border-4 border-black shadow-neo-lg max-h-[calc(100dvh-125px)] sm:max-h-[calc(100vh-135px)] flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden"
            >
              <div className="py-3 px-4 sm:py-4 sm:px-6 bg-neo-secondary border-b-3 border-black flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-black stroke-[2.5px]" />
                  <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                    OFFICIAL TOURNAMENT ENTRY PASS
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-rose-400 border-2 border-black font-black text-base flex items-center justify-center shadow-neo-sm hover:shadow-none transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div
                data-lenis-prevent="true"
                className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 font-sans overscroll-contain"
              >
                <RegistrationSuccessReceipt
                  result={{
                    success: true,
                    registrationId: teamData.registrationId || teamData.id || "HV26-241263",
                    ticketId: teamData.ticketId || teamData.registrationId || teamData.id || "HV26-241263",
                    teamName: teamData.teamName || "SQUAD",
                    message: "Official Hackathon Entry Pass Confirmed",
                  }}
                  onReset={() => setShowReceiptModal(false)}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
