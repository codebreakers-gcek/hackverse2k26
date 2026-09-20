/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "@/lib/auth-client";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement } from "@/types/problemStatement";
import { ProblemStatementSheet } from "@/features/problems/ProblemStatementSheet";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  X,
  Check,
  RefreshCw,
  Eye,
  Lock,
  Building2,
  LogIn,
  Clock,
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
  const [mounted, setMounted] = useState(false);

  const isLeader =
    userRoleInTeam === "LEADER" ||
    (Boolean(teamData) &&
      Boolean(session?.user) &&
      (teamData?.leader?.email === session?.user?.email ||
        teamData?.leaderEmail === session?.user?.email ||
        teamData?.userId === session?.user?.id));

  useEffect(() => {
    setMounted(true);
  }, []);

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

      setIsPublished(true);

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

  // Lock background scroll, stop Lenis smooth scroll, and bind Escape key
  useEffect(() => {
    if (!showConfirmModal) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
    if (lenis) lenis.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        setShowConfirmModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (lenis) lenis.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirmModal, submitting]);

  const isLocked = Boolean(
    teamData?.psSubmittedAt ||
    teamData?.isPsLocked ||
    teamData?.documents?.isPsLocked ||
    teamData?.documents?.psSubmittedAt ||
    (teamData?.problemStatementId && teamData?.selectedProblemStatements?.length > 0) ||
    submitSuccess
  );

  // Handle statement selection (toggle 1st or 2nd preference)
  const handleToggleSelect = (psId: string) => {
    if (userRoleInTeam !== "LEADER") {
      setFeedbackMessage("Permission Denied: Only the designated Squad Leader (" + (teamData?.leader?.name || "Leader") + ") is authorized to select or change problem statements.");
      return;
    }

    if (isLocked) {
      setFeedbackMessage("Problem statement preferences are already locked and finalized for your squad. Further modifications are prohibited.");
      return;
    }

    setSelectedPsIds((prev) => {
      if (prev.includes(psId)) {
        // Deselect
        return prev.filter((id) => id !== psId);
      }
      if (prev.length < 2) {
        // Add as 1st (mandatory) or 2nd (optional)
        return [...prev, psId];
      }
      // If 2 already selected, replace the 2nd preference
      return [prev[0], psId];
    });
    setFeedbackMessage(null);
  };

  // Submit choices to API
  const handleConfirmSubmit = async () => {
    if (userRoleInTeam !== "LEADER") {
      setFeedbackMessage("Permission Denied: Only the designated Squad Leader is authorized to submit problem statements.");
      setShowConfirmModal(false);
      return;
    }

    if (selectedPsIds.length < 1 || selectedPsIds.length > 2) {
      setFeedbackMessage("Please select at least ONE (1) mandatory problem statement before submitting.");
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

  // Categories list dynamically derived from data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(PROBLEM_STATEMENTS_DATA.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  const filteredProblems = useMemo(() => {
    if (filterCategory === "All") return PROBLEM_STATEMENTS_DATA;
    return PROBLEM_STATEMENTS_DATA.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const pref1Obj = PROBLEM_STATEMENTS_DATA.find((p) => p.id === selectedPsIds[0]);
  const pref2Obj = PROBLEM_STATEMENTS_DATA.find((p) => p.id === selectedPsIds[1]);

  // Loading State
  if (sessionLoading || teamLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
        {/* Minecraft Wallpaper Background */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/minecraft/wallpaper.webp"
            alt="Minecraft Wallpaper"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
        </div>

        <div className="relative z-10 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 sm:p-10 shadow-[8px_8px_0px_#000] max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <RefreshCw className="w-7 h-7 text-black stroke-[3px] animate-spin" />
          </div>
          <h3 className="font-black text-xl uppercase tracking-tight text-black font-mono">
            AUTHENTICATING SQUAD
          </h3>
          <p className="text-xs font-bold text-black/75">
            Checking logged-in session, team verification records, and problem statement allocation...
          </p>
        </div>
      </div>
    );
  }

  // State 1: User is NOT logged in
  if (!session?.user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
        {/* Minecraft Wallpaper Background */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/minecraft/wallpaper.webp"
            alt="Minecraft Wallpaper"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
        </div>

        <div className="relative z-10 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 sm:p-12 shadow-[8px_8px_0px_#000] max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <LogIn className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] inline-block shadow-[2px_2px_0px_#000]">
              [AUTHENTICATION REQUIRED]
            </span>
            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              SIGN IN TO SELECT PROBLEM STATEMENTS
            </h2>
            <p className="text-sm font-bold text-black/75 leading-relaxed">
              Problem statement selection is reserved for verified Squad Leaders. Please authenticate with your registered Google or GitHub account.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => signIn.social({ provider: "google", callbackURL: "/register/ps" })}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 [text-shadow:_1px_1px_0_#000]"
            >
              <span>SIGN IN WITH GOOGLE</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
            <button
              onClick={() => signIn.social({ provider: "github", callbackURL: "/register/ps" })}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#404040] hover:bg-[#4d4d4d] text-white border-4 border-t-[#666666] border-l-[#666666] border-r-[#262626] border-b-[#262626] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-2 [text-shadow:_1px_1px_0_#000]"
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
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
        {/* Minecraft Wallpaper Background */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/minecraft/wallpaper.webp"
            alt="Minecraft Wallpaper"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
        </div>

        <div className="relative z-10 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 sm:p-12 shadow-[8px_8px_0px_#000] max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <Users className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] inline-block shadow-[2px_2px_0px_#000]">
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

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 [text-shadow:_1px_1px_0_#000]"
            >
              <span>REGISTER SQUAD NOW</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/problem-statements"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL SPECS</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2.5: Squad is registered BUT NOT yet verified by admin (status !== "CONFIRMED")
  if (teamData?.status !== "CONFIRMED") {
    const isRejectedOrBanned = teamData?.status === "REJECTED" || teamData?.status === "BANNED";

    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
        {/* Minecraft Wallpaper Background */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/minecraft/wallpaper.webp"
            alt="Minecraft Wallpaper"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
        </div>

        <div className="relative z-10 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 sm:p-12 shadow-[8px_8px_0px_#000] max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <Lock className="w-8 h-8 text-black stroke-[3px]" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                {teamData.registrationNumber}
              </span>
              <span
                className={clsx(
                  "font-mono text-xs font-black uppercase px-2.5 py-1 border-2 shadow-[2px_2px_0px_#000]",
                  isRejectedOrBanned
                    ? "bg-[#FF5555] text-white border-t-[#FF8888] border-l-[#FF8888] border-r-[#880000] border-b-[#880000]"
                    : "bg-[#FFAA00] text-black border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]"
                )}
              >
                STATUS: {teamData.status}
              </span>
            </div>

            <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-black pt-1">
              {isRejectedOrBanned ? "SQUAD REGISTRATION BLOCKED" : "ADMIN VERIFICATION REQUIRED"}
            </h2>

            <p className="text-sm font-bold text-black/75 leading-relaxed">
              {isRejectedOrBanned
                ? `Your squad "${teamData.teamName}" registration is currently marked as ${teamData.status}. Please reach out to the organizing team for assistance.`
                : `Your squad "${teamData.teamName}" is registered, but problem statement selection is locked until your squad is officially verified and approved by the admin desk.`}
            </p>
          </div>

          {/* Quick squad snapshot */}
          <div className="bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] p-4 text-left font-mono text-xs space-y-1 text-black shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <div>
              <span className="text-black/60 uppercase">SQUAD:</span>{" "}
              <strong className="text-black font-black uppercase">{teamData.teamName}</strong>
            </div>
            <div>
              <span className="text-black/60 uppercase">INSTITUTION:</span>{" "}
              <strong className="text-black font-black">{teamData.collegeName}</strong>
            </div>
            <div>
              <span className="text-black/60 uppercase">LEADER:</span>{" "}
              <strong className="text-black font-black">{teamData.leader?.name || session.user.name}</strong> ({teamData.leader?.email || session.user.email})
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 [text-shadow:_1px_1px_0_#000]"
            >
              <span>VIEW SQUAD DOSSIER</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/problem-statements"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL SPECS</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 3: User is authenticated, registered, squad is CONFIRMED, and PS selection is live!
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* High-Clarity Minecraft Wallpaper Background */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/wallpaper.webp"
          alt="Minecraft Wallpaper"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 sm:space-y-10 min-w-0">
          {/* ========================================================================= */}
          {/* HEADER & TEAM DOSSIER BANNER */}
          {/* ========================================================================= */}
          <div className="space-y-6 w-full max-w-full">
            <SectionTitle
              tag="HACKATHON PROTOCOL // PS SELECTION"
              title="SELECT PROBLEM"
              highlightText="STATEMENTS"
              subtitle="Select your squad's primary problem statement (Preference 1 is Mandatory, Preference 2 is Optional). Review specifications and submit your choice."
            />

            {/* TEAM DETAILS DOSSIER CARD */}
            <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-8 shadow-[6px_6px_0px_#000] space-y-5 w-full max-w-full overflow-hidden text-black">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#555555] pb-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                      {teamData.registrationNumber}
                    </span>
                    <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-[#DBDBDB] text-black border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                      STATUS: {teamData.status}
                    </span>
                    <span
                      className={clsx(
                        "font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 shadow-[2px_2px_0px_#000] inline-flex items-center gap-1.5",
                        userRoleInTeam === "LEADER"
                          ? "bg-[#FFAA00] text-black border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]"
                          : "bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813]"
                      )}
                    >
                      <span>YOU:</span>
                      {userRoleInTeam === "LEADER" ? (
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-black stroke-[2.5px]" />
                          <span>SQUAD LEADER</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-white stroke-[2.5px]" />
                          <span>CO-HACKER</span>
                        </span>
                      )}
                    </span>
                  </div>
                  <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                    TEAM: {teamData.teamName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-xs font-bold text-black/80 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{teamData.collegeName}</span>
                    </p>
                    <span className="text-black/40">•</span>
                    <Link
                      href="/register"
                      className="font-mono text-xs font-black uppercase text-black hover:text-[#5B8731] hover:underline flex items-center gap-1"
                    >
                      <span>View Squad Roster &amp; Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Leader Box */}
                <div className="p-3.5 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] space-y-1 font-mono text-xs shrink-0">
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
              <div className="p-3 bg-[#DBDBDB] border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "w-3 h-3 border border-black shadow-[1px_1px_0px_#000]",
                      isLocked ? "bg-[#55FF55]" : selectedPsIds.length >= 1 ? "bg-[#55FF55]" : "bg-[#FFAA00]"
                    )}
                  />
                  {isLocked ? (
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#5B8731] text-white px-2 py-0.5 border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-black uppercase text-[10px] [text-shadow:_1px_1px_0_#000]">
                        LOCKED &amp; CONFIRMED
                      </span>
                      <span className="text-black font-black">
                        SELECTION EMBARGO ACTIVE (CHANGES FROZEN)
                      </span>
                    </span>
                  ) : (
                    <span>
                      SELECTED CHOICES:{" "}
                      <strong className="text-black font-black font-mono">
                        {selectedPsIds.length} / 2 TRACKS {selectedPsIds.length >= 1 ? "(MANDATORY MET)" : "(SELECTION REQUIRED)"}
                      </strong>
                    </span>
                  )}
                  {teamData.psSubmittedAt && (
                    <span className="bg-black text-[#55FF55] px-2 py-0.5 border border-black font-black">
                      SAVED: {new Date(teamData.psSubmittedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="text-black/70 font-mono text-[11px]">
                  {isLocked
                    ? "PROTOCOL: 1 MANDATORY + OPTIONAL 2ND PREFERENCE (FINALIZED)"
                    : "RULE: PREFERENCE 1 (MANDATORY) • PREFERENCE 2 (OPTIONAL)"}
                </div>
              </div>
            </div>
          </div>

          {/* FEEDBACK ALERT */}
          {feedbackMessage && (
            <div
              className={clsx(
                "p-4 border-4 shadow-[4px_4px_0px_#000] font-bold text-xs sm:text-sm flex items-center justify-between gap-3 text-black",
                submitSuccess
                  ? "bg-[#C6C6C6] border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813]"
                  : "bg-[#C6C6C6] border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500]"
              )}
            >
              <div className="flex items-center gap-2">
                {submitSuccess ? (
                  <ShieldCheck className="w-5 h-5 text-[#256010] stroke-[3px]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#8F5500] stroke-[3px]" />
                )}
                <span>{feedbackMessage}</span>
              </div>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-black hover:text-black/70 font-black cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MAIN BODY: LOCKED SELECTION DOSSIER vs INTERACTIVE SELECTION GRID */}
          {/* ========================================================================= */}
          {isLocked ? (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* LOCKED BANNER NOTICE */}
              <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-4 text-black">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#555555] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#5B8731] border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0">
                      <Lock className="w-6 h-6 text-white stroke-[3px]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-[#55FF55] border border-black shadow-[2px_2px_0px_#000]">
                          FINAL SELECTION LOCKED
                        </span>
                        <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-[#5B8731] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] inline-flex items-center gap-1 [text-shadow:_1px_1px_0_#000]">
                          <Lock className="w-3 h-3" />
                          <span>ANTI-TAMPER ACTIVE</span>
                        </span>
                      </div>
                      <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black mt-1">
                        OFFICIAL SQUAD PROBLEM STATEMENT ALLOCATION
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/register"
                      className="px-5 py-2.5 bg-[#FFAA00] hover:bg-[#FFB82E] text-black border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-4 h-4 stroke-[3px]" />
                      <span>VIEW SQUAD DOSSIER</span>
                    </Link>
                    <Link
                      href="/problem-statements"
                      className="px-4 py-2.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 stroke-[2.5px]" />
                      <span>PUBLIC CHALLENGES</span>
                    </Link>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
                  Problem statement preferences for Squad <strong>{teamData.teamName}</strong> ({teamData.registrationNumber}) are finalized and officially registered. As per hackathon regulations, track selections cannot be modified, swapped, or re-submitted after confirmation.
                </p>
              </div>

              {/* ONLY DISPLAY SELECTED PROBLEM STATEMENTS */}
              <div className="space-y-6">
                <div className="font-mono text-xs font-black uppercase text-black flex items-center gap-2 bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-2.5 shadow-[2px_2px_0px_#000] w-fit">
                  <span>YOUR SQUAD&apos;S ALLOCATED TRACKS ({selectedPsIds.length} SELECTED)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CHOICE #1 (PRIMARY - MANDATORY) */}
                  {pref1Obj ? (
                    <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6 flex flex-col justify-between relative text-black">
                      <div className="space-y-4">
                        {/* Badge strip */}
                        <div className="space-y-2 border-b-2 border-[#555555] pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                                {pref1Obj.code}
                              </span>
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#DBDBDB] text-black border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                                {pref1Obj.category}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#5B8731] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000] inline-flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                              <Sparkles className="w-3 h-3 stroke-[2.5px]" />
                              <span>CHOICE #1 (PRIMARY - MANDATORY)</span>
                            </span>
                          </div>

                          {/* Minecraft Oak Wood Hanging Signboard for Organization */}
                          {pref1Obj.organization && (
                            <div className="bg-[#8A5A2B] border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] px-2.5 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2 w-fit">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[9px] font-black text-[#FFE285] uppercase tracking-wider shrink-0 [text-shadow:_1px_1px_0_#000]">
                                  ORG //
                                </span>
                                <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-white tracking-wide leading-tight [text-shadow:_1px_1px_0_#000]">
                                  {pref1Obj.organization}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Domain & Title */}
                        <div>
                          <div className="font-mono text-xs font-black uppercase tracking-wider text-black/70 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 shrink-0" />
                            <span>{pref1Obj.domain}</span>
                          </div>
                          <h4 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-tight mt-1">
                            {pref1Obj.title}
                          </h4>
                        </div>

                        {/* Paragraph Brief */}
                        <div className="p-4 bg-[#DBDBDB] border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] space-y-2">
                          <div className="font-mono text-[11px] font-black uppercase text-black/70">
                            PROBLEM OVERVIEW:
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-black/90 leading-relaxed">
                            {pref1Obj.shortDescription}
                          </p>
                        </div>

                        {/* Expected Solutions */}
                        <div className="space-y-2">
                          <div className="font-mono text-[11px] font-black uppercase text-black/70">
                            KEY DELIVERABLES:
                          </div>
                          <div className="space-y-2">
                            {pref1Obj.keyDeliverables.map((deliv, idx) => {
                              const lines = deliv.split("\n").filter((l) => l.trim().length > 0);
                              const hasMultipleLines = lines.length > 1;
                              const title = hasMultipleLines ? lines[0] : null;
                              const bulletLines = hasMultipleLines ? lines.slice(1) : lines;

                              return (
                                <div key={idx} className="flex items-start gap-2 p-2 bg-[#DBDBDB] border border-black text-xs font-bold text-black/90">
                                  <span className="w-4 h-4 bg-black text-[#55FF55] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-black shadow-[1px_1px_0px_#000]">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1 space-y-1">
                                    {title && (
                                      <div className="font-mono font-black uppercase text-black text-[11px] border-b border-black/20 pb-0.5">
                                        {title}
                                      </div>
                                    )}
                                    {hasMultipleLines ? (
                                      <ul className="space-y-1 pt-0.5">
                                        {bulletLines.map((line, lIdx) => (
                                          <li key={lIdx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                                            <span className="text-black font-black select-none shrink-0">•</span>
                                            <span>{line.replace(/^[•\-]\s*/, "")}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span>{deliv}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Datasets if present */}
                        {pref1Obj.relevantDatasets && pref1Obj.relevantDatasets.length > 0 && (
                          <div className="p-3 bg-[#DBDBDB] border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] space-y-1">
                            <div className="font-mono text-[10px] font-black uppercase text-black/70">
                              RELEVANT DATASETS:
                            </div>
                            <ul className="space-y-1 text-xs font-bold text-black/85">
                              {pref1Obj.relevantDatasets.map((ds, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#0055FF] font-mono font-black">▸</span>
                                  <span>{ds}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t-2 border-[#555555] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveSheetProblem(pref1Obj)}
                          className="w-full py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer text-black"
                        >
                          <Eye className="w-4 h-4 stroke-[2.5px]" />
                          <span>VIEW FULL SPECIFICATION SHEET</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-8 text-center font-mono text-sm font-bold text-black/70 shadow-[6px_6px_0px_#000]">
                      Primary track selection not found in official registry.
                    </div>
                  )}

                  {/* CHOICE #2 (SECONDARY - OPTIONAL) */}
                  {pref2Obj ? (
                    <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6 flex flex-col justify-between relative text-black">
                      <div className="space-y-4">
                        {/* Badge strip */}
                        <div className="space-y-2 border-b-2 border-[#555555] pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                                {pref2Obj.code}
                              </span>
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#DBDBDB] text-black border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                                {pref2Obj.category}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000] inline-flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 stroke-[2.5px]" />
                              <span>CHOICE #2 (SECONDARY - OPTIONAL)</span>
                            </span>
                          </div>

                          {/* Minecraft Oak Wood Hanging Signboard for Organization */}
                          {pref2Obj.organization && (
                            <div className="bg-[#8A5A2B] border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] px-2.5 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2 w-fit">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-mono text-[9px] font-black text-[#FFE285] uppercase tracking-wider shrink-0 [text-shadow:_1px_1px_0_#000]">
                                  ORG //
                                </span>
                                <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-white tracking-wide leading-tight [text-shadow:_1px_1px_0_#000]">
                                  {pref2Obj.organization}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Domain & Title */}
                        <div>
                          <div className="font-mono text-xs font-black uppercase tracking-wider text-black/70 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 shrink-0" />
                            <span>{pref2Obj.domain}</span>
                          </div>
                          <h4 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-tight mt-1">
                            {pref2Obj.title}
                          </h4>
                        </div>

                        {/* Paragraph Brief */}
                        <div className="p-4 bg-[#DBDBDB] border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] space-y-2">
                          <div className="font-mono text-[11px] font-black uppercase text-black/70">
                            PROBLEM OVERVIEW:
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-black/90 leading-relaxed">
                            {pref2Obj.shortDescription}
                          </p>
                        </div>

                        {/* Expected Solutions */}
                        <div className="space-y-2">
                          <div className="font-mono text-[11px] font-black uppercase text-black/70">
                            KEY DELIVERABLES:
                          </div>
                          <div className="space-y-2">
                            {pref2Obj.keyDeliverables.map((deliv, idx) => {
                              const lines = deliv.split("\n").filter((l) => l.trim().length > 0);
                              const hasMultipleLines = lines.length > 1;
                              const title = hasMultipleLines ? lines[0] : null;
                              const bulletLines = hasMultipleLines ? lines.slice(1) : lines;

                              return (
                                <div key={idx} className="flex items-start gap-2 p-2 bg-[#DBDBDB] border border-black text-xs font-bold text-black/90">
                                  <span className="w-4 h-4 bg-black text-[#55FF55] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-black shadow-[1px_1px_0px_#000]">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1 space-y-1">
                                    {title && (
                                      <div className="font-mono font-black uppercase text-black text-[11px] border-b border-black/20 pb-0.5">
                                        {title}
                                      </div>
                                    )}
                                    {hasMultipleLines ? (
                                      <ul className="space-y-1 pt-0.5">
                                        {bulletLines.map((line, lIdx) => (
                                          <li key={lIdx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                                            <span className="text-black font-black select-none shrink-0">•</span>
                                            <span>{line.replace(/^[•\-]\s*/, "")}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span>{deliv}</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Datasets if present */}
                        {pref2Obj.relevantDatasets && pref2Obj.relevantDatasets.length > 0 && (
                          <div className="p-3 bg-[#DBDBDB] border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] space-y-1">
                            <div className="font-mono text-[10px] font-black uppercase text-black/70">
                              RELEVANT DATASETS:
                            </div>
                            <ul className="space-y-1 text-xs font-bold text-black/85">
                              {pref2Obj.relevantDatasets.map((ds, idx) => (
                                <li key={idx} className="truncate">
                                  ▸ {ds}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t-2 border-[#555555] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveSheetProblem(pref2Obj)}
                          className="w-full py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer text-black"
                        >
                          <Eye className="w-4 h-4 stroke-[2.5px]" />
                          <span>VIEW FULL SPECIFICATION SHEET</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#C6C6C6] border-4 border-dashed border-[#555555] p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-[6px_6px_0px_#000]">
                      <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-[#DBDBDB] text-black border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                        CHOICE #2 (OPTIONAL SECONDARY TRACK)
                      </span>
                      <h4 className="font-black text-lg uppercase text-black/75">
                        No 2nd Preference Selected
                      </h4>
                      <p className="text-xs font-bold text-black/60 max-w-sm leading-relaxed">
                        Your squad is locked into 1 primary problem statement for hackathon jury evaluation and technical scoring.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Anti-Tamper Security Banner */}
              <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[6px_6px_0px_#000] space-y-2 text-black">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                  <ShieldCheck className="w-5 h-5 text-[#256010] stroke-[3px]" />
                  <span>ANTI-TAMPER EMBARGO ACTIVE &bull; JURY ROSTER LOCKED</span>
                </div>
                <p className="text-xs sm:text-sm font-bold leading-relaxed text-black/85">
                  Your squad&apos;s problem statement submission is verified and locked in the official jury roster. No additional changes or track switches are permitted. You can now focus entirely on building your prototype!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Member Read-Only Notice Banner */}
              {!isLeader && (
                <div className="bg-[#DBDBDB] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex items-start gap-3 text-black">
                  <ShieldAlert className="w-6 h-6 text-[#8F5500] stroke-[2.5px] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-mono text-xs font-black uppercase text-black">
                      MEMBER READ-ONLY ACCESS &bull; SELECTION RESERVED FOR SQUAD LEADER
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
                      You are viewing the problem statement dossier as a registered Squad Member. Only your Squad Leader (<strong>{teamData?.leader?.name || "Leader"}</strong>) is authorized to select and lock problem statements for your squad. You can review all details and specifications below.
                    </p>
                  </div>
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
                      "px-4 py-2.5 font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shadow-[3px_3px_0px_#000] active:translate-y-1",
                      filterCategory === cat
                        ? "bg-[#5B8731] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                        : "bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
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

                  if (problem.isLocked) {
                    return (
                      <div
                        key={problem.id}
                        className="bg-[#1C1815] border-4 border-t-[#D4A368] border-l-[#D4A368] border-r-[#3E2512] border-b-[#3E2512] p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between space-y-5 relative text-white"
                      >
                        {/* Header Strip */}
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#3E2512] pb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#FFAA00] border-2 border-[#FFAA00] shadow-[2px_2px_0px_#000] flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                                <Lock className="w-3 h-3 text-[#FFAA00]" />
                                {problem.code}
                              </span>
                              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#282828] text-[#55FFFF] border border-black shadow-[1px_1px_0px_#000]">
                                {problem.category}
                              </span>
                            </div>

                            <span className="font-mono text-[11px] font-black uppercase px-2.5 py-1 bg-[#FF5555] text-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 animate-pulse [text-shadow:_1px_1px_0_#000]">
                              <Lock className="w-3 h-3" /> SEALED CHEST
                            </span>
                          </div>

                          {/* 3D Chest Graphic + Title */}
                          <div className="text-center space-y-3 py-2">
                            <div className="relative my-2 flex items-center justify-center">
                              <div className="absolute inset-0 bg-[#FFAA00]/25 blur-xl rounded-full scale-150 pointer-events-none" />
                              <div className="relative w-24 h-18 bg-[#8F5A2B] border-4 border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] shadow-[6px_6px_0px_#000] flex items-center justify-center">
                                <div className="absolute top-[38%] left-0 right-0 h-1 bg-black/80 border-b border-[#B8874E]/40" />
                                <div className="absolute top-[28%] w-7 h-7 bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] flex items-center justify-center z-10">
                                  <Lock className="w-4 h-4 text-black stroke-[3px]" />
                                </div>
                                <div className="absolute -top-2.5 -right-2.5">
                                  <Sparkles className="w-4 h-4 text-[#FFE655] animate-bounce" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="inline-block font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border border-black shadow-[1px_1px_0px_#000]">
                                [CLASSIFIED TRACK // EMBARGO ACTIVE]
                              </span>
                              <h4 className="font-mono font-black text-lg sm:text-xl text-[#FFE655] uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
                                NEW CHEST UNLOCKING TOMORROW
                              </h4>
                            </div>

                            <p className="text-xs sm:text-sm font-mono font-bold text-[#D0C4B4] leading-relaxed">
                              {problem.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Minecraft Timer Strip */}
                        <div className="bg-[#150B04] border-2 border-t-[#0D0702] border-l-[#0D0702] border-r-[#42250F] border-b-[#42250F] p-2.5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-[#55FF55] shrink-0 animate-spin" />
                          <span className="font-mono text-xs font-black uppercase text-[#55FF55] tracking-wide [text-shadow:_1px_1px_0_#000]">
                            UNLOCKS TOMORROW // STAY TUNED
                          </span>
                        </div>

                        {/* Actions Row */}
                        <div className="pt-2 border-t-2 border-[#3E2512] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          <button
                            type="button"
                            onClick={() => setActiveSheetProblem(problem)}
                            className="px-3.5 py-2.5 bg-[#8F5A2B] hover:bg-[#FFAA00] border-4 border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#000] active:translate-y-1 transition-all cursor-pointer text-[#FFE655] hover:text-black"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>INSPECT CHEST</span>
                          </button>

                          <div className="px-4 py-2.5 bg-[#2B2B2B] border-4 border-t-[#444444] border-l-[#444444] border-r-[#151515] border-b-[#151515] font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-[#888888] shadow-[2px_2px_0px_#000] cursor-not-allowed">
                            <Lock className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>CHEST SEALED</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={problem.id}
                      className={clsx(
                        "bg-[#C6C6C6] p-6 transition-all flex flex-col justify-between space-y-5 relative text-black",
                        isSelected
                          ? "border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[8px_8px_0px_#000] ring-2 ring-[#FFAA00]"
                          : "border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
                      )}
                    >
                      {/* Header Strip */}
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-black shadow-[2px_2px_0px_#000]">
                              {problem.code}
                            </span>
                            <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-[#DBDBDB] text-black border-2 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF]">
                              {problem.category}
                            </span>
                          </div>

                          {/* Selection Badges */}
                          {isPref1 && (
                            <span className="font-mono text-[11px] sm:text-xs font-black uppercase px-2.5 sm:px-3 py-1 bg-[#5B8731] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000] inline-flex items-center gap-1 [text-shadow:_1px_1px_0_#000]">
                              <Sparkles className="w-3 h-3 stroke-[2.5px]" />
                              <span>PREF 1 (PRIMARY - MANDATORY)</span>
                            </span>
                          )}
                          {isPref2 && (
                            <span className="font-mono text-[11px] sm:text-xs font-black uppercase px-2.5 sm:px-3 py-1 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000] inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3 stroke-[2.5px]" />
                              <span>PREF 2 (SECONDARY - OPTIONAL)</span>
                            </span>
                          )}
                        </div>

                        {/* Minecraft Oak Wood Hanging Signboard for Organization */}
                        {problem.organization && (
                          <div className="bg-[#8A5A2B] border-2 border-black border-t-[#B8874E] border-l-[#B8874E] border-r-[#4A2D12] border-b-[#4A2D12] px-2.5 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2">
                            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                              <span className="font-mono text-[9px] font-black text-[#FFE285] uppercase tracking-wider shrink-0 [text-shadow:_1px_1px_0_#000]">
                                ORG //
                              </span>
                              <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-white tracking-wide leading-tight [text-shadow:_1px_1px_0_#000]">
                                {problem.organization}
                              </span>
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="font-mono text-[11px] font-black uppercase tracking-wider text-black/70 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{problem.domain}</span>
                          </div>
                          <h4 className="font-black text-base sm:text-lg md:text-xl text-black uppercase tracking-tight leading-tight mt-1">
                            {problem.title}
                          </h4>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed line-clamp-3">
                          {problem.shortDescription}
                        </p>
                      </div>

                      {/* Expected Solution Bullet Points */}
                      <div className="space-y-1.5 pt-2 border-t-2 border-[#555555]">
                        <div className="font-mono text-[11px] font-black uppercase text-black/70">
                          EXPECTED SOLUTION:
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
                      <div className="pt-2 border-t-2 border-[#555555] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveSheetProblem(problem)}
                          className="px-3.5 py-2.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#000] active:translate-y-1 transition-all cursor-pointer text-black"
                        >
                          <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>VIEW FULL SPEC</span>
                        </button>

                        {isLeader ? (
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(problem.id)}
                            className={clsx(
                              "px-4 sm:px-5 py-2.5 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer",
                              isSelected
                                ? "bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
                                : "bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                            )}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4 stroke-[3px] shrink-0" />
                                <span>{isPref1 ? "PREF #1 (REMOVE)" : "PREF #2 (REMOVE)"}</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 stroke-[3px] shrink-0" />
                                <span>
                                  {selectedPsIds.length === 0
                                    ? "SELECT AS PREF 1 (MANDATORY)"
                                    : "SELECT AS PREF 2 (OPTIONAL)"}
                                </span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="px-3.5 py-2 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] font-mono font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 text-black/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
                            <Lock className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>LEADER ACTION ONLY</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* STICKY BOTTOM SUBMISSION CONTROL BAR */}
              <div className="sticky bottom-3 sm:bottom-6 z-40">
                <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-6 shadow-[8px_8px_0px_#000] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-black">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                    <div className="p-2 sm:p-2.5 bg-[#DBDBDB] border-3 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] text-black font-mono text-xs font-black uppercase shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] shrink-0">
                      {isLeader ? `CHOICES: ${selectedPsIds.length} / 2` : "MEMBER PREVIEW"}
                    </div>

                    <div className="space-y-1 text-xs font-bold text-black min-w-0 flex-1">
                      {isLeader ? (
                        <>
                          <div className="truncate">
                            <span className="font-mono font-black text-[#5B8731] uppercase">
                              PREF 1 (MANDATORY):
                            </span>{" "}
                            {pref1Obj ? (
                              <strong className="font-black text-black">
                                [{pref1Obj.code}] {pref1Obj.title}
                              </strong>
                            ) : (
                              <span className="text-[#991B1B] font-black italic">
                                Selection required (Mandatory)
                              </span>
                            )}
                          </div>
                          <div className="truncate">
                            <span className="font-mono font-black text-[#8F5500] uppercase">
                              PREF 2 (OPTIONAL):
                            </span>{" "}
                            {pref2Obj ? (
                              <strong className="font-black text-black">
                                [{pref2Obj.code}] {pref2Obj.title}
                              </strong>
                            ) : (
                              <span className="text-black/50 italic">None selected (Optional)</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="leading-snug text-black/85">
                          Only Squad Leader (<strong>{teamData?.leader?.name}</strong>) can select and lock problem statements. Once submitted, your squad&apos;s locked selection will appear on your squad dashboard.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    {isLeader ? (
                      <button
                        type="button"
                        disabled={selectedPsIds.length < 1}
                        onClick={() => setShowConfirmModal(true)}
                        className={clsx(
                          "w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                          selectedPsIds.length >= 1
                            ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[4px_4px_0px_#000] active:translate-y-1 cursor-pointer [text-shadow:_1px_1px_0_#000]"
                            : "bg-[#707070] text-black/50 border-4 border-t-[#8B8B8B] border-l-[#8B8B8B] border-r-[#404040] border-b-[#404040] cursor-not-allowed shadow-none"
                        )}
                      >
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                        <span>
                          {selectedPsIds.length === 1
                            ? "SUBMIT PREFERENCES (1 TRACK SELECTED)"
                            : selectedPsIds.length === 2
                            ? "SUBMIT & LOCK 2 PREFERENCES"
                            : "SELECT AT LEAST 1 TRACK TO SUBMIT"}
                        </span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
                      </button>
                    ) : (
                      <div className="w-full sm:w-auto px-6 py-3.5 bg-[#DBDBDB] border-4 border-t-[#555555] border-l-[#555555] border-r-[#FFFFFF] border-b-[#FFFFFF] text-black/70 font-mono font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
                        <Lock className="w-4 h-4 stroke-[2.5px]" />
                        <span>AWAITING LEADER SUBMISSION</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CONFIRMATION MODAL / DIALOG (PORTAL TO DOCUMENT.BODY) */}
        {/* ========================================================================= */}
        {mounted &&
          createPortal(
            <AnimatePresence>
              {showConfirmModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs overflow-hidden">
                  {/* Backdrop click to dismiss */}
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => !submitting && setShowConfirmModal(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative z-10 bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] max-w-xl w-full max-h-[min(90vh,740px)] flex flex-col shadow-[12px_12px_0px_#000] overflow-hidden my-auto text-black"
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b-4 border-black p-4 sm:p-5 bg-[#5B8731] text-white border-t-2 border-t-[#85B745] shrink-0">
                      <div className="flex items-center gap-2 pr-2">
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3px] shrink-0" />
                        <h3 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-white line-clamp-1 [text-shadow:_1px_1px_0_#000]">
                          CONFIRM PS PREFERENCES
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => !submitting && setShowConfirmModal(false)}
                        className="p-1.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black cursor-pointer shrink-0 shadow-[2px_2px_0px_#000]"
                        aria-label="Close dialog"
                      >
                        <X className="w-5 h-5 stroke-[3px]" />
                      </button>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#DBDBDB]">
                      <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed">
                        Please confirm that you want to submit and lock the following{" "}
                        {selectedPsIds.length === 1 ? "problem statement" : "two problem statements"}{" "}
                        for your squad:
                      </p>

                      {/* Team Info Box */}
                      <div className="p-3 bg-[#C6C6C6] border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-mono text-xs space-y-1 shadow-[2px_2px_0px_#000]">
                        <div>
                          <span className="text-black/60 uppercase">SQUAD NAME:</span>{" "}
                          <strong className="text-black font-black">{teamData?.teamName}</strong>
                        </div>
                        <div>
                          <span className="text-black/60 uppercase">LEADER:</span>{" "}
                          <strong className="text-black font-black">{teamData?.leader?.name}</strong> (
                          {teamData?.leader?.email})
                        </div>
                      </div>

                      {/* Preferences Summary */}
                      <div className="space-y-3">
                        <div className="p-3.5 sm:p-4 bg-[#C6C6C6] border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] space-y-1">
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#5B8731] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] inline-flex items-center gap-1 [text-shadow:_1px_1px_0_#000]">
                            <Sparkles className="w-2.5 h-2.5 stroke-[2.5px]" />
                            <span>CHOICE #1 (PRIMARY PREFERENCE - MANDATORY)</span>
                          </span>
                          <div className="font-black text-sm uppercase text-black pt-1">
                            [{pref1Obj?.code}] {pref1Obj?.title}
                          </div>
                          <div className="font-mono text-xs text-black/70">
                            Domain: {pref1Obj?.domain}
                          </div>
                        </div>

                        {pref2Obj ? (
                          <div className="p-3.5 sm:p-4 bg-[#C6C6C6] border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[2px_2px_0px_#000] space-y-1">
                            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 stroke-[2.5px]" />
                              <span>CHOICE #2 (SECONDARY PREFERENCE - OPTIONAL)</span>
                            </span>
                            <div className="font-black text-sm uppercase text-black pt-1">
                              [{pref2Obj?.code}] {pref2Obj?.title}
                            </div>
                            <div className="font-mono text-xs text-black/70">
                              Domain: {pref2Obj?.domain}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-[#C6C6C6] border-2 border-dashed border-[#555555] font-mono text-xs text-black/60">
                            Choice #2 (Secondary): None selected (Optional track omitted)
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-[#C6C6C6] border-2 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] text-xs font-bold text-black flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#8F5500] stroke-[3px] shrink-0 mt-0.5" />
                        <span>
                          Note: Your choices will be immediately synchronized with the jury evaluation system and official admin roster.
                        </span>
                      </div>
                    </div>

                    {/* Modal Actions Footer */}
                    <div className="p-4 sm:p-5 border-t-4 border-black bg-[#C6C6C6] shrink-0 flex flex-col sm:flex-row items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(false)}
                        className="w-full sm:w-auto px-5 py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-black text-xs uppercase shadow-[3px_3px_0px_#000] active:translate-y-1 transition-all cursor-pointer"
                      >
                        CANCEL / MODIFY
                      </button>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleConfirmSubmit}
                        className="w-full sm:w-auto px-6 py-3.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 [text-shadow:_1px_1px_0_#000]"
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
            </AnimatePresence>,
            document.body
          )}

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
            "PREF 1 MANDATORY • PREF 2 OPTIONAL",
            "AI • WEB • CYBER • IOT • OPEN",
            "GCEK BHAWANIPATNA",
          ]}
          bg="secondary"
        />
      </div>
    </div>
  );
}

