"use client";

import React, { useState, useEffect } from "react";
import { RegistrationRecord } from "@/types/admin";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { getSquadProblemStatements } from "@/lib/adminProblemUtils";
import {
  X,
  Save,
  Users,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  CreditCard,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Loader2,
  ShieldAlert,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface AdminEditSquadModalProps {
  squad: RegistrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminEditSquadModal({
  squad,
  isOpen,
  onClose,
}: AdminEditSquadModalProps) {
  const { handleSaveFullSquad, isUpdating } = useAdmin();

  const [activeTab, setActiveTab] = useState<
    "team" | "leader" | "roster" | "finance"
  >("team");

  // Editable Form State
  const [formData, setFormData] = useState({
    teamName: "",
    collegeName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    problemStatementId: "",
    problemStatement2: "",
    status: "PENDING_VERIFICATION",

    // Leader Details
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    leaderWhatsapp: "",
    leaderBranch: "",
    leaderCustomBranch: "",
    leaderYear: "3rd Year",
    leaderRole: "Full Stack Developer",
    leaderGithub: "",

    // Members Array
    members: [] as Array<{
      fullName: string;
      email: string;
      phone: string;
      branch: string;
      yearOfStudy: string;
      githubUsername: string;
      role?: string;
    }>,

    // Finance & Payment
    paymentStatus: "FREE_TIER",
    paymentMode: "FREE_SPONSORED",
    transactionId: "",
    amount: 0,
  });

  // Initial population from squad
  useEffect(() => {
    if (squad) {
      const address = squad.collegeAddress || {};
      const { primary, secondary } = getSquadProblemStatements(squad);
      const membersList = Array.isArray(squad.members)
        ? (squad.members as any[]).map((m) => ({
            fullName: m.fullName || "",
            email: m.email || "",
            phone: m.phone || "",
            branch: m.branch || "",
            yearOfStudy: m.yearOfStudy || "3rd Year",
            githubUsername: m.githubUsername || "",
            role: m.role || "Member",
          }))
        : [];

      setFormData({
        teamName: squad.teamName || "",
        collegeName: squad.collegeName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        problemStatementId: primary?.id || squad.problemStatementId || "",
        problemStatement2: secondary?.id || "",
        status: squad.status || "PENDING_VERIFICATION",

        leaderName: squad.leaderName || "",
        leaderEmail: squad.leaderEmail || "",
        leaderPhone: squad.leaderPhone || "",
        leaderWhatsapp: squad.leaderWhatsapp || "",
        leaderBranch: squad.leaderBranch || "",
        leaderCustomBranch: squad.leaderCustomBranch || "",
        leaderYear: squad.leaderYear || "3rd Year",
        leaderRole: squad.leaderRole || "Team Leader",
        leaderGithub: squad.leaderGithub || "",

        members: membersList,

        paymentStatus: squad.paymentStatus || "FREE_TIER",
        paymentMode: squad.paymentMode || "FREE_SPONSORED",
        transactionId: squad.transactionId || "",
        amount: squad.amount ?? 0,
      });
    }
  }, [squad, isOpen]);

  if (!isOpen || !squad) return null;

  // Member Management Helpers
  const handleAddMember = () => {
    if (formData.members.length >= 3) {
      toast.error("Maximum squad size is 4 (1 Leader + 3 Teammates).");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          fullName: "",
          email: "",
          phone: "",
          branch: "",
          yearOfStudy: "3rd Year",
          githubUsername: "",
          role: `Teammate #${prev.members.length + 1}`,
        },
      ],
    }));
  };

  const handleRemoveMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, idx) => idx !== index),
    }));
  };

  const handleUpdateMemberField = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.members];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, members: updated };
    });
  };

  // Submit Changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.teamName.trim()) {
      toast.error("Squad Name is required.");
      return;
    }
    if (!formData.leaderName.trim()) {
      toast.error("Leader Full Name is required.");
      return;
    }
    if (!formData.leaderEmail.trim()) {
      toast.error("Leader Email is required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.leaderEmail.trim())) {
      toast.error("Please enter a valid Leader Email address.");
      return;
    }

    for (let i = 0; i < formData.members.length; i++) {
      const mem = formData.members[i];
      if (mem.email && !emailRegex.test(mem.email.trim())) {
        toast.error(`Member #${i + 1} has an invalid email format.`);
        return;
      }
    }

    const payload = {
      teamName: formData.teamName.trim(),
      collegeName: formData.collegeName.trim(),
      collegeAddress: {
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        fullAddress: `${formData.street.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`,
      },
      problemStatementId: formData.problemStatementId || null,
      problemStatement2: formData.problemStatement2 || null,
      selectedProblemStatements: [
        formData.problemStatementId,
        ...(formData.problemStatement2 && formData.problemStatement2 !== formData.problemStatementId
          ? [formData.problemStatement2]
          : []),
      ].filter(Boolean),
      status: formData.status,

      leaderName: formData.leaderName.trim(),
      leaderEmail: formData.leaderEmail.trim().toLowerCase(),
      leaderPhone: formData.leaderPhone.trim(),
      leaderWhatsapp: formData.leaderWhatsapp.trim(),
      leaderBranch: formData.leaderBranch.trim(),
      leaderCustomBranch: formData.leaderCustomBranch.trim(),
      leaderYear: formData.leaderYear,
      leaderRole: formData.leaderRole,
      leaderGithub: formData.leaderGithub.trim().replace(/^@/, ""),

      members: formData.members.map((m) => ({
        fullName: m.fullName.trim(),
        email: m.email.trim().toLowerCase(),
        phone: m.phone.trim(),
        branch: m.branch.trim(),
        yearOfStudy: m.yearOfStudy,
        githubUsername: m.githubUsername.trim().replace(/^@/, ""),
        role: m.role || "Member",
      })),

      paymentStatus: formData.paymentStatus,
      paymentMode: formData.paymentMode,
      transactionId: formData.transactionId.trim(),
      amount: Number(formData.amount) || 0,
    };

    const res = await handleSaveFullSquad(squad.id, payload as any);
    if (res.success) {
      onClose();
    }
  };

  const isLeaderEmailChanged =
    squad.leaderEmail?.toLowerCase().trim() !==
    formData.leaderEmail?.toLowerCase().trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-900 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_#000000] text-white font-sans overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 p-4 md:p-5 bg-neutral-950 border-b-2 border-neutral-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs font-black uppercase px-2 py-0.5 border border-amber-400/40 bg-amber-400/10 text-amber-400">
                EDIT SQUAD RECORD
              </span>
              <span className="font-mono text-xs font-bold text-neutral-400">
                {squad.registrationNumber}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black uppercase text-white truncate">
              {formData.teamName || squad.teamName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center font-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="shrink-0 flex items-center gap-1 p-2 bg-neutral-950 border-b-2 border-neutral-800 overflow-x-auto select-none">
          {[
            { id: "team", label: "Team & Institute", icon: Building2 },
            { id: "leader", label: "Leader & Auth Email", icon: Mail },
            {
              id: "roster",
              label: `Roster (${1 + formData.members.length})`,
              icon: Users,
            },
            { id: "finance", label: "Finance & UTR", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 border-2 font-mono text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-amber-400 text-black border-amber-400 shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* TAB 1: TEAM & INSTITUTE */}
            {activeTab === "team" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team Name */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Squad / Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-sans text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Registration Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="PENDING_VERIFICATION">
                        PENDING_VERIFICATION
                      </option>
                      <option value="CONFIRMED">CONFIRMED (Approved)</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="BANNED">BANNED</option>
                    </select>
                  </div>
                </div>

                {/* Problem Statement Pickers (Primary & Secondary) */}
                <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-3">
                  <div className="font-mono text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2 flex items-center justify-between">
                    <span>PROBLEM STATEMENT PREFERENCES</span>
                    <span className="text-[10px] text-cyan-400 font-bold">CHOICE #1 MANDATORY / CHOICE #2 OPTIONAL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Choice #1 */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-cyan-300">
                        Primary Preference (Choice #1)
                      </label>
                      <select
                        value={formData.problemStatementId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            problemStatementId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-cyan-800/80 bg-neutral-900 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">
                          -- Unassigned / Open Innovation Track --
                        </option>
                        {PROBLEM_STATEMENTS_DATA.map((ps) => (
                          <option key={ps.id} value={ps.id}>
                            [{ps.code}] {ps.title} ({ps.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Secondary Choice #2 */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-purple-300">
                        Secondary Preference (Choice #2)
                      </label>
                      <select
                        value={formData.problemStatement2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            problemStatement2: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-purple-800/80 bg-neutral-900 text-white font-mono text-xs focus:border-purple-400 focus:outline-none"
                      >
                        <option value="">
                          -- None / No Secondary Preference --
                        </option>
                        {PROBLEM_STATEMENTS_DATA.filter(
                          (ps) => ps.id !== formData.problemStatementId
                        ).map((ps) => (
                          <option key={ps.id} value={ps.id}>
                            [{ps.code}] {ps.title} ({ps.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* College / Institute Details */}
                <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-3">
                  <div className="font-mono text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2">
                    INSTITUTE &amp; ADDRESS DETAILS
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-neutral-300">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collegeName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold text-neutral-300">
                        Street / Campus Location
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold text-neutral-300">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold text-neutral-300">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-bold text-neutral-300">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                        className="w-full px-3 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LEADER & AUTH EMAIL */}
            {activeTab === "leader" && (
              <div className="space-y-4">
                {/* Email Change Warning Alert */}
                {isLeaderEmailChanged && (
                  <div className="p-3.5 border-2 border-rose-500 bg-rose-950/40 text-rose-300 font-mono text-xs space-y-1">
                    <div className="font-black flex items-center gap-1.5 text-rose-400">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      CRITICAL: AUTHENTICATION EMAIL TRANSFER DETECTED
                    </div>
                    <div>
                      Changing the leader email from{" "}
                      <span className="font-bold underline text-white">
                        {squad.leaderEmail}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold underline text-white">
                        {formData.leaderEmail}
                      </span>{" "}
                      will immediately revoke login access from the old email,
                      terminate all active sessions, and transfer portal access
                      to the new email. Security notification emails will be
                      sent to both addresses upon saving.
                    </div>
                  </div>
                )}

                <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-4">
                  <div className="font-mono text-xs font-black uppercase text-amber-400 border-b border-neutral-800 pb-2 flex items-center justify-between">
                    <span>SQUAD LEADER PROFILE</span>
                    <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black">
                      PRIMARY ACCOUNT HOLDER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Leader Full Name */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.leaderName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-sm focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Leader Email (Auth Email) */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-cyan-300 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        Login / Auth Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.leaderEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderEmail: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 border-2 bg-neutral-900 font-mono text-xs focus:outline-none ${
                          isLeaderEmailChanged
                            ? "border-amber-400 text-amber-300"
                            : "border-neutral-700 text-white focus:border-amber-400"
                        }`}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.leaderPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderPhone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={formData.leaderWhatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderWhatsapp: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Branch */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                        Academic Branch / Major
                      </label>
                      <input
                        type="text"
                        value={formData.leaderBranch}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderBranch: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Year of Study */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                        Year of Study
                      </label>
                      <select
                        value={formData.leaderYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderYear: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate / Alumni">
                          Postgraduate / Alumni
                        </option>
                      </select>
                    </div>

                    {/* GitHub Username */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-mono text-xs font-black uppercase text-neutral-300 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-neutral-400" />
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        value={formData.leaderGithub}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leaderGithub: e.target.value,
                          })
                        }
                        placeholder="e.g. torvalds"
                        className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROSTER (MEMBERS) */}
            {activeTab === "roster" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-2 border-neutral-800 bg-neutral-950">
                  <div>
                    <div className="font-mono text-xs font-black uppercase text-amber-400">
                      TEAM MEMBERS ({formData.members.length} Registered)
                    </div>
                    <div className="text-xs text-neutral-400">
                      Total squad size: {1 + formData.members.length} (Max 4).
                    </div>
                  </div>

                  {formData.members.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-3 py-1.5 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD MEMBER</span>
                    </button>
                  )}
                </div>

                {formData.members.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-neutral-800 text-center space-y-2">
                    <p className="font-mono text-xs text-neutral-400">
                      No additional members registered (Solo Participant).
                    </p>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-3 py-1.5 border-2 border-amber-400 bg-amber-400 text-black font-mono text-xs font-black uppercase inline-flex items-center gap-1 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD FIRST MEMBER</span>
                    </button>
                  </div>
                ) : (
                  formData.members.map((mem, idx) => (
                    <div
                      key={idx}
                      className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <span className="px-2 py-0.5 border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 font-mono text-[10px] font-black uppercase">
                          Teammate #{idx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="px-2 py-0.5 border border-rose-600 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white font-mono text-[10px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>REMOVE</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-neutral-400">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={mem.fullName}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "fullName",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-cyan-300">
                            Login / Auth Email
                          </label>
                          <input
                            type="email"
                            value={mem.email}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "email",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-neutral-400">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={mem.phone}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "phone",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-neutral-400">
                            Branch
                          </label>
                          <input
                            type="text"
                            value={mem.branch}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "branch",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-sans text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-neutral-400">
                            Year
                          </label>
                          <select
                            value={mem.yearOfStudy}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "yearOfStudy",
                                e.target.value
                              )
                            }
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Postgraduate / Alumni">
                              Postgraduate / Alumni
                            </option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] font-bold text-neutral-400">
                            GitHub Username
                          </label>
                          <input
                            type="text"
                            value={mem.githubUsername}
                            onChange={(e) =>
                              handleUpdateMemberField(
                                idx,
                                "githubUsername",
                                e.target.value
                              )
                            }
                            placeholder="username"
                            className="w-full px-2.5 py-1.5 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: FINANCE & PAYMENT */}
            {activeTab === "finance" && (
              <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-4">
                <div className="font-mono text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2">
                  PAYMENT &amp; TRANSACTION RECONCILIATION
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Payment Status */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Payment Verification Status
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="FREE_TIER">FREE_TIER (Sponsored)</option>
                      <option value="VERIFIED">VERIFIED (Paid)</option>
                      <option value="PENDING">PENDING (Review needed)</option>
                      <option value="REJECTED">REJECTED (Invalid UTR)</option>
                    </select>
                  </div>

                  {/* Fee Amount */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Amount (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Payment Mode
                    </label>
                    <input
                      type="text"
                      value={formData.paymentMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMode: e.target.value,
                        })
                      }
                      placeholder="e.g. UPI_QR, FREE_SPONSORED, CASH"
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-black uppercase text-neutral-300">
                      Transaction UTR / Ref ID
                    </label>
                    <input
                      type="text"
                      value={formData.transactionId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transactionId: e.target.value,
                        })
                      }
                      placeholder="e.g. 508210394829"
                      className="w-full px-3 py-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="shrink-0 p-4 bg-neutral-950 border-t-2 border-neutral-800 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-neutral-400 hidden sm:block">
              {isLeaderEmailChanged ? (
                <span className="text-amber-400 font-bold">
                  ⚠️ Auth email transfer will trigger on save
                </span>
              ) : (
                <span>All changes will dispatch notifications automatically</span>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="px-4 py-2 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs font-black uppercase cursor-pointer disabled:opacity-50"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>SAVE SQUAD CHANGES</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
