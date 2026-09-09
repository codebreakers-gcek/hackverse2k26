"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "@/lib/auth-client";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement } from "@/types/problemStatement";
import { ProblemStatementSheet } from "@/features/problems/ProblemStatementSheet";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  FileCode2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Code2,
  X,
  Check,
  Award,
  RefreshCw,
  Clock,
  Eye,
  Lock,
  ChevronRight,
  Building2,
  LogIn,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function ProblemSelectionContent() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [teamLoading, setTeamLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRoleInTeam, setUserRoleInTeam] = useState<"LEADER" | "MEMBER">("LEADER");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Selected 2 statements (array of problem statement IDs: [pref1, pref2])
  const [selectedPsIds, setSelectedPsIds] = useState<string[]>([]);
  const [activeSheetProblem, setActiveSheetProblem] = useState<ProblemStatement | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Fetch Team Details from API & Settings
  const fetchMyTeam = async () => {
    try {
      setTeamLoading(true);
      const [res, settingsRes] = await Promise.all([
        fetch("/api/team/my-team"),
        fetch("/api/settings").then((r) => r.json()).catch(() => null),
      ]);
      const data = await res.json();

      if (settingsRes && settingsRes.success && settingsRes.settings) {
        if (typeof settingsRes.settings.isProblemStatementsPublished === "boolean") {
          setIsPublished(settingsRes.settings.isProblemStatementsPublished);
        }
      }

      if (data.success && data.registered && data.team) {
        setIsRegistered(true);
        setTeamData(data.team);
        setUserRoleInTeam(data.userRoleInTeam || "LEADER");
        if (Array.isArray(data.team.selectedProblemStatements) && data.team.selectedProblemStatements.length > 0) {
          setSelectedPsIds(data.team.selectedProblemStatements.slice(0, 2));
        } else if (data.team.problemStatementId) {
          setSelectedPsIds([data.team.problemStatementId]);
        }
      } else {
        setIsRegistered(false);
        setTeamData(null);
      }
    } catch (err) {
      console.error("Failed to load team data:", err);
      setIsRegistered(false);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyTeam();
    } else if (!sessionLoading) {
      setTeamLoading(false);
    }
  }, [session, sessionLoading]);

  // Handle statement selection (toggle 1st or 2nd preference)
  const handleToggleSelect = (psId: string) => {
    setSelectedPsIds((prev) => {
      if (prev.includes(psId)) {
        // Deselect
        return prev.filter((id) => id !== psId);
      }
      if (prev.length < 2) {
        // Add as 1st or 2nd
        return [...prev, psId];
      }
      // If 2 already selected, replace the 2nd preference
      return [prev[0], psId];
    });
    setFeedbackMessage(null);
  };

  // Submit choices to API
  const handleConfirmSubmit = async () => {
    if (selectedPsIds.length !== 2) {
      setFeedbackMessage("Please select exactly TWO (2) problem statements before submitting.");
      setShowConfirmModal(false);
      return;
    }

    try {
      setSubmitting(true);
      setFeedbackMessage(null);

      const res = await fetch("/api/team/ps-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedProblemStatements: selectedPsIds,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        setShowConfirmModal(false);
        setFeedbackMessage(data.message || "Problem statements successfully submitted!");
        // Refresh local team data
        fetchMyTeam();
      } else {
        setFeedbackMessage(data.message || "Failed to submit problem statements. Please try again.");
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setFeedbackMessage("An unexpected network error occurred. Please try again.");
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Categories list
  const categories = ["All", "AI / ML", "Web Development", "Cybersecurity", "IoT", "Open Innovation"];

  const filteredProblems = useMemo(() => {
    if (filterCategory === "All") return PROBLEM_STATEMENTS_DATA;
    return PROBLEM_STATEMENTS_DATA.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const pref1Obj = PROBLEM_STATEMENTS_DATA.find((p) => p.id === selectedPsIds[0]);
  const pref2Obj = PROBLEM_STATEMENTS_DATA.find((p) => p.id === selectedPsIds[1]);

  // Loading State
  if (sessionLoading || teamLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-neo-bg">
        <div className="border-4 border-black bg-white p-8 shadow-neo max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 border-3 border-black bg-neo-secondary flex items-center justify-center mx-auto shadow-neo-sm animate-spin">
            <RefreshCw className="w-6 h-6 stroke-[3px]" />
          </div>
          <h3 className="font-black text-xl uppercase tracking-tight text-black">
            AUTHENTICATING SQUAD &amp; DATA
          </h3>
          <p className="text-xs font-bold text-black/70">
            Checking logged-in session, team verification records, and problem statement allocation...
          </p>
        </div>
      </div>
    );
  }

  // State 1: User is NOT logged in
  if (!session?.user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-neo-bg">
        <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-neo-lg max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 border-4 border-black bg-neo-accent flex items-center justify-center mx-auto shadow-neo">
            <LogIn className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black inline-block">
              [AUTHENTICATION REQUIRED]
            </span>
            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              SIGN IN TO SELECT PROBLEM STATEMENTS
            </h2>
            <p className="text-sm font-bold text-black/75 leading-relaxed">
              Problem statement selection is reserved for verified Squad Leaders. Please authenticate with your registered Google or GitHub account.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => signIn.social({ provider: "google", callbackURL: "/register/ps" })}
              className="w-full sm:w-auto px-6 py-3.5 bg-neo-secondary hover:bg-amber-400 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SIGN IN WITH GOOGLE</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
            <button
              onClick={() => signIn.social({ provider: "github", callbackURL: "/register/ps" })}
              className="w-full sm:w-auto px-6 py-3.5 bg-black text-white hover:bg-neutral-800 border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>SIGN IN WITH GITHUB</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User is logged in BUT has NO registered team yet
  if (!isRegistered || !teamData) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-neo-bg">
        <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-neo-lg max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 border-4 border-black bg-neo-secondary flex items-center justify-center mx-auto shadow-neo">
            <Users className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-neo-accent text-black border-2 border-black inline-block">
              [SQUAD NOT REGISTERED]
            </span>
            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              NO TEAM REGISTRATION FOUND
            </h2>
            <p className="text-sm font-bold text-black/75 leading-relaxed">
              Hello <span className="text-black font-black">{session.user.name || session.user.email}</span>!
              You need to complete your official team registration before locking in your 2 problem statements.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black border-4 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>REGISTER SQUAD NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/problem-statements"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm transition-all flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL SPECS</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2.5: Problem Statements are NOT yet published by organizers
  if (!isPublished) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-neo-bg">
        <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-neo-lg max-w-2xl w-full text-center space-y-6">
          <div className="w-16 h-16 border-4 border-black bg-neo-accent flex items-center justify-center mx-auto shadow-neo animate-bounce">
            <Lock className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black inline-block shadow-neo-sm">
              [SELECTION LOCKED // COMING SOON]
            </span>
            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              PROBLEM STATEMENTS COMING SOON
            </h2>
            <p className="text-sm font-bold text-black/75 leading-relaxed max-w-xl mx-auto">
              Greetings, Squad <span className="text-black font-black">{teamData.teamName}</span> ({teamData.registrationNumber})! The problem statements and track selection module are currently locked and coming soon once officially released.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border-3 border-black text-left font-mono text-xs space-y-2 max-w-lg mx-auto shadow-neo-sm">
            <div className="font-black text-black uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>SQUAD READINESS STATUS:</span>
            </div>
            <p className="text-black/80 font-bold">
              • Your squad registration is confirmed and on standby.
            </p>
            <p className="text-black/80 font-bold">
              • Once the organizers unlock problem statements, return to this portal to select your 2 priority tracks.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black border-4 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>VIEW SQUAD DOSSIER &amp; PASS</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm transition-all flex items-center justify-center gap-2"
            >
              <span>RETURN HOME</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 3: User is authenticated, registered, and PS is published!
  return (
    <div className="flex flex-col min-h-screen bg-neo-bg w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 sm:space-y-10 min-w-0">
        {/* ========================================================================= */}
        {/* HEADER & TEAM DOSSIER BANNER */}
        {/* ========================================================================= */}
        <div className="space-y-6 w-full max-w-full">
          <SectionTitle
            tag="HACKATHON PROTOCOL // PS SELECTION"
            title="SELECT PROBLEM"
            highlightText="STATEMENTS"
            subtitle="Select your squad's exactly TWO (2) preferred problem statements (Preference 1 & Preference 2). Review full deliverables and confirm your submission."
          />

          {/* TEAM DETAILS DOSSIER CARD */}
          <div className="border-4 border-black bg-white p-4 sm:p-8 shadow-neo space-y-5 w-full max-w-full overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-black pb-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border border-black shadow-neo-sm">
                    {teamData.registrationNumber}
                  </span>
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-neo-secondary text-black border border-black">
                    STATUS: {teamData.status}
                  </span>
                  <span
                    className={clsx(
                      "font-mono text-xs font-black uppercase px-2.5 py-0.5 border border-black shadow-neo-sm",
                      userRoleInTeam === "LEADER"
                        ? "bg-amber-300 text-black"
                        : "bg-emerald-300 text-emerald-950"
                    )}
                  >
                    YOU: {userRoleInTeam === "LEADER" ? "★ SQUAD LEADER" : "✦ CO-HACKER"}
                  </span>
                </div>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  TEAM: {teamData.teamName}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs font-bold text-black/70 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{teamData.collegeName}</span>
                  </p>
                  <span className="text-black/30">•</span>
                  <Link
                    href="/register"
                    className="font-mono text-xs font-black uppercase text-black hover:text-neo-accent hover:underline flex items-center gap-1"
                  >
                    <span>View Squad Roster &amp; Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Leader Box */}
              <div className="p-3.5 bg-neo-bg border-3 border-black space-y-1 font-mono text-xs shrink-0">
                <div className="font-black uppercase text-black/60 text-[10px]">
                  TEAM LEADER IN-CHARGE:
                </div>
                <div className="font-black text-black text-sm uppercase">
                  {teamData.leader?.name}
                </div>
                <div className="text-black/80 font-bold">{teamData.leader?.email}</div>
                <div className="text-black/80 font-bold">{teamData.leader?.phone}</div>
              </div>
            </div>

            {/* Current PS Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-black animate-pulse" />
                <span>
                  SELECTED CHOICES:{" "}
                  <strong className="text-black font-black font-mono">
                    {selectedPsIds.length} / 2 STATEMENTS
                  </strong>
                </span>
                {teamData.psSubmittedAt && (
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-black font-black">
                    LAST SAVED: {new Date(teamData.psSubmittedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="text-black/70 font-mono text-[11px]">
                RULE: EXACTLY TWO (2) DISTINCT PREFERENCES REQUIRED
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK ALERT */}
        {feedbackMessage && (
          <div
            className={clsx(
              "p-4 border-3 border-black font-bold text-xs sm:text-sm shadow-neo-sm flex items-center justify-between gap-3",
              submitSuccess ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"
            )}
          >
            <div className="flex items-center gap-2">
              {submitSuccess ? (
                <ShieldCheck className="w-5 h-5 text-emerald-700 stroke-[3px]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-700 stroke-[3px]" />
              )}
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-black hover:text-black/70 font-black"
            >
              <X className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CATEGORY FILTER PILLS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={clsx(
                "px-4 py-2 border-3 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer",
                filterCategory === cat
                  ? "bg-black text-white shadow-neo-sm"
                  : "bg-white text-black hover:bg-neo-secondary shadow-neo-sm hover:shadow-none"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 8 PROBLEM STATEMENTS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => {
            const isSelected = selectedPsIds.includes(problem.id);
            const selectionIndex = selectedPsIds.indexOf(problem.id);
            const isPref1 = selectionIndex === 0;
            const isPref2 = selectionIndex === 1;

            return (
              <div
                key={problem.id}
                className={clsx(
                  "border-4 border-black bg-white p-6 shadow-neo transition-all flex flex-col justify-between space-y-5 relative",
                  isSelected
                    ? "ring-4 ring-black bg-amber-50/40 shadow-neo-lg"
                    : "hover:translate-x-0.5 hover:translate-y-0.5"
                )}
              >
                {/* Header Strip */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-white border-2 border-black shadow-neo-sm">
                        {problem.code}
                      </span>
                      <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-muted text-black border-2 border-black">
                        {problem.category}
                      </span>
                    </div>

                    {/* Selection Badges */}
                    {isPref1 && (
                      <span className="font-mono text-[11px] sm:text-xs font-black uppercase px-2.5 sm:px-3 py-1 bg-neo-secondary text-black border-2 border-black shadow-neo-sm animate-bounce">
                        ★ PREF 1 (PRIMARY)
                      </span>
                    )}
                    {isPref2 && (
                      <span className="font-mono text-[11px] sm:text-xs font-black uppercase px-2.5 sm:px-3 py-1 bg-neo-accent text-black border-2 border-black shadow-neo-sm">
                        ★ PREF 2 (SECONDARY)
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="font-mono text-[11px] font-black uppercase tracking-wider text-black/60 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{problem.domain}</span>
                    </div>
                    <h4 className="font-black text-base sm:text-lg md:text-xl text-black uppercase tracking-tight leading-tight mt-1">
                      {problem.title}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed line-clamp-3">
                    {problem.shortDescription}
                  </p>
                </div>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-1.5 pt-2 border-t-2 border-black/10">
                  <div className="font-mono text-[11px] font-black uppercase text-black/60">
                    MANDATORY DELIVERABLES:
                  </div>
                  <ul className="space-y-1 text-xs font-bold text-black/85">
                    {problem.keyDeliverables.slice(0, 2).map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-black font-black shrink-0">▸</span>
                        <span className="line-clamp-1">{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t-2 border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveSheetProblem(problem)}
                    className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 border-2 border-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm hover:shadow-none transition-all cursor-pointer text-black"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span>VIEW FULL SPEC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSelect(problem.id)}
                    className={clsx(
                      "px-4 sm:px-5 py-2.5 border-3 border-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo-sm transition-all cursor-pointer",
                      isSelected
                        ? "bg-black text-white hover:bg-neutral-800"
                        : "bg-neo-secondary hover:bg-neo-accent text-black hover:shadow-none"
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3px] shrink-0" />
                        <span>{isPref1 ? "PREF #1" : "PREF #2"} (CHANGE)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 stroke-[3px] shrink-0" />
                        <span>SELECT THIS TRACK</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* STICKY BOTTOM SUBMISSION CONTROL BAR */}
        {/* ========================================================================= */}
        <div className="sticky bottom-3 sm:bottom-6 z-40">
          <div className="border-4 border-black bg-white p-4 sm:p-6 shadow-neo-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="p-2 sm:p-2.5 bg-black text-white font-mono text-xs font-black uppercase border border-black shadow-neo-sm shrink-0">
                CHOICES: {selectedPsIds.length} / 2
              </div>

              <div className="space-y-1 text-xs font-bold text-black min-w-0 flex-1">
                <div className="truncate">
                  <span className="font-mono font-black text-amber-700 uppercase">PREF 1:</span>{" "}
                  {pref1Obj ? (
                    <strong className="font-black text-black">
                      [{pref1Obj.code}] {pref1Obj.title}
                    </strong>
                  ) : (
                    <span className="text-black/50 italic">None selected yet</span>
                  )}
                </div>
                <div className="truncate">
                  <span className="font-mono font-black text-rose-700 uppercase">PREF 2:</span>{" "}
                  {pref2Obj ? (
                    <strong className="font-black text-black">
                      [{pref2Obj.code}] {pref2Obj.title}
                    </strong>
                  ) : (
                    <span className="text-black/50 italic">None selected yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button
                type="button"
                disabled={selectedPsIds.length !== 2}
                onClick={() => setShowConfirmModal(true)}
                className={clsx(
                  "w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-black shadow-neo transition-all flex items-center justify-center gap-2",
                  selectedPsIds.length === 2
                    ? "bg-neo-secondary hover:bg-neo-accent hover:shadow-neo-lg hover:-translate-y-0.5 text-black cursor-pointer"
                    : "bg-neutral-200 text-black/40 border-black/50 cursor-not-allowed shadow-none"
                )}
              >
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                <span>
                  {selectedPsIds.length === 2
                    ? "SUBMIT & LOCK 2 STATEMENTS"
                    : `SELECT ${2 - selectedPsIds.length} MORE TO SUBMIT`}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONFIRMATION MODAL / DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="border-4 border-black bg-white max-w-xl w-full p-6 sm:p-8 shadow-neo-xl space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-neo-secondary stroke-[3px]" />
                  <h3 className="font-black text-xl uppercase tracking-tight text-black">
                    CONFIRM PROBLEM STATEMENT PREFERENCES
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1 hover:bg-neutral-100 border border-black font-black"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
                  Please confirm that you want to submit and lock the following two problem statements for your squad:
                </p>

                {/* Team Info Box */}
                <div className="p-3.5 bg-neo-bg border-2 border-black font-mono text-xs space-y-1">
                  <div>
                    <span className="text-black/60 uppercase">SQUAD NAME:</span>{" "}
                    <strong className="text-black font-black">{teamData.teamName}</strong>
                  </div>
                  <div>
                    <span className="text-black/60 uppercase">LEADER:</span>{" "}
                    <strong className="text-black font-black">{teamData.leader?.name}</strong> ({teamData.leader?.email})
                  </div>
                </div>

                {/* Preferences Summary */}
                <div className="space-y-3">
                  <div className="p-4 bg-amber-50 border-3 border-black shadow-neo-sm space-y-1">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-secondary text-black border border-black inline-block">
                      ★ CHOICE #1 (PRIMARY PREFERENCE)
                    </span>
                    <div className="font-black text-sm uppercase text-black pt-1">
                      [{pref1Obj?.code}] {pref1Obj?.title}
                    </div>
                    <div className="font-mono text-xs text-black/70">
                      Domain: {pref1Obj?.domain}
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 border-3 border-black shadow-neo-sm space-y-1">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-accent text-black border border-black inline-block">
                      ★ CHOICE #2 (SECONDARY PREFERENCE)
                    </span>
                    <div className="font-black text-sm uppercase text-black pt-1">
                      [{pref2Obj?.code}] {pref2Obj?.title}
                    </div>
                    <div className="font-mono text-xs text-black/70">
                      Domain: {pref2Obj?.domain}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-100 border-2 border-black text-xs font-bold text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-800 stroke-[3px] shrink-0 mt-0.5" />
                  <span>
                    Note: Your choices will be immediately synchronized with the jury evaluation system and official admin roster.
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t-3 border-black flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer"
                >
                  CANCEL / MODIFY
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmSubmit}
                  className="w-full sm:w-auto px-6 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 stroke-[3px] animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>CONFIRM &amp; TRANSMIT PREFERENCES</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SPEC SHEET DRAWER */}
      <ProblemStatementSheet
        problem={activeSheetProblem}
        isOpen={!!activeSheetProblem}
        onClose={() => setActiveSheetProblem(null)}
      />

      {/* Marquee Banner */}
      <MarqueeBanner
        items={[
          "HACKVERSE '26 PROBLEM STATEMENTS",
          "CHOOSE 2 PREFERENCES",
          "AI • WEB • CYBER • IOT • OPEN",
          "GCEK BHAWANIPATNA",
        ]}
        bg="secondary"
      />
    </div>
  );
}
