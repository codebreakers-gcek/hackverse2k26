"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  User,
  Building2,
  MapPin,
  Users,
  Award,
  Calendar,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Gavel,
  Printer,
  ChevronLeft,
  Crown,
  CreditCard,
  Home,
  FileCode,
  Scan,
} from "lucide-react";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import Image from "next/image";
import { toast } from "sonner";
import clsx from "clsx";

interface TeamMember {
  fullName: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  dateOfBirth?: string;
  role?: string;
  branch?: string;
  customBranch?: string;
  yearOfStudy?: string;
  githubUsername?: string;
}

interface TeamData {
  id: string;
  registrationNumber: string;
  teamName: string;
  status: string;
  createdAt: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  problemStatementId?: string | null;
  problemStatement?: {
    id: string;
    title: string;
    category?: string;
    track?: string;
    brief?: string;
  } | null;
  leader: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    branch: string;
    customBranch?: string | null;
    yearOfStudy: string;
    role?: string;
    githubUsername?: string | null;
    dateOfBirth?: string | null;
  };
  members: TeamMember[];
  payment: {
    paymentMode: string;
    transactionId?: string | null;
    paymentStatus: string;
    amount: number;
  };
  accommodation: {
    required: boolean;
    status: string;
    roomNumber?: string | null;
    hostelBlock?: string | null;
  };
  documents?: any;
  verifiedBy?: string;
  verifiedAt?: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || "";
  const ticketId = rawId.toUpperCase().startsWith("HV26-")
    ? rawId.toUpperCase()
    : `HV26-${rawId.toUpperCase()}`;

  // Auth gate state
  const [verifierName, setVerifierName] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [team, setTeam] = useState<TeamData | null>(null);

  // Auto verify if credentials saved from /teams scanner
  const executeVerification = async (pinVal: string, nameVal: string) => {
    setIsVerifying(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/teams/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ticketId,
          pin: pinVal.trim(),
          verifierName: nameVal.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Please verify PIN.");
        return;
      }

      setTeam(data.team);
      setVerifierName(nameVal.trim());
      setPin(pinVal.trim());
      setIsAuthorized(true);

      // Cache authorization for current browser tab
      try {
        sessionStorage.setItem(
          `hackverse_auth_${ticketId}`,
          JSON.stringify({
            team: data.team,
            verifierName: nameVal.trim(),
          })
        );
      } catch {}
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMsg("Network error verifying PIN.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Restore session or auto-verify if scanner credentials exist
  useEffect(() => {
    if (!ticketId || typeof window === "undefined") return;
    try {
      const cacheKey = `hackverse_auth_${ticketId}`;
      const saved = sessionStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.team) {
          setTeam(parsed.team);
          setVerifierName(parsed.verifierName || "Authorized Verifier");
          setIsAuthorized(true);
          return;
        }
      }

      // Check if logged in via /teams scanner portal
      const scannerAuth = localStorage.getItem("hackverse_scanner_session");
      const sessionPin = sessionStorage.getItem("hackverse_auth_pin");
      const sessionName = sessionStorage.getItem("hackverse_auth_name");

      if (sessionPin && sessionName) {
        setVerifierName(sessionName);
        setPin(sessionPin);
        executeVerification(sessionPin, sessionName);
      } else if (scannerAuth) {
        const parsed = JSON.parse(scannerAuth);
        if (parsed?.pin && parsed?.verifierName) {
          setVerifierName(parsed.verifierName);
          setPin(parsed.pin);
          executeVerification(parsed.pin, parsed.verifierName);
        }
      }
    } catch {}
  }, [ticketId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!verifierName.trim()) {
      setErrorMsg("Please enter your name (Judge / Organizer / Verifier).");
      return;
    }

    if (!pin.trim()) {
      setErrorMsg("Please enter the Authorization PIN provided by Admin.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/teams/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ticketId,
          pin: pin.trim(),
          verifierName: verifierName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Authentication failed. Please verify PIN.");
        toast.error(data.error || "Authentication failed");
        return;
      }

      setTeam(data.team);
      setIsAuthorized(true);
      toast.success(`Access granted! Welcome, ${verifierName.trim()}.`);

      // Cache authorization for current browser tab
      try {
        sessionStorage.setItem(
          `hackverse_auth_${ticketId}`,
          JSON.stringify({
            team: data.team,
            verifierName: verifierName.trim(),
          })
        );
      } catch {}
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMsg("Network error. Please check your connection and retry.");
      toast.error("Network error while verifying authorization PIN.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockSession = () => {
    try {
      sessionStorage.removeItem(`hackverse_auth_${ticketId}`);
    } catch {}
    setTeam(null);
    setIsAuthorized(false);
    setPin("");
    toast.info("Session locked.");
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-black overflow-hidden font-sans">
      {/* Minecraft Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/documentbg.webp"
          alt="HackVerse Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Marquee */}
        <MarqueeBanner
          items={[
            "HACKVERSE '26 SQUAD VERIFICATION",
            `TICKET: ${ticketId}`,
            "OFFICIAL CHECK-IN & JUDGING PORTAL",
            "CODEBREAKERS GCEK",
          ]}
          bg="secondary"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          {/* ========================================================================= */}
          {/* STATE 1: SECURE PIN & NAME AUTHORIZATION GATE                             */}
          {/* ========================================================================= */}
          {!isAuthorized ? (
            <div className="max-w-md mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] p-6 sm:p-8 space-y-6 relative">
                {/* Header Strip */}
                <div className="bg-[#2B2B2B] text-white -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-4 border-b-4 border-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-400 text-black border-2 border-black flex items-center justify-center font-mono font-black text-xs">
                      🔒
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-[#55FFFF]">
                      VERIFICATION GATE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#FFAA00] border border-[#FFAA00]">
                    PASS ID: {ticketId}
                  </span>
                </div>

                <div className="space-y-2 text-center pt-2">
                  <div className="w-14 h-14 bg-amber-300 border-3 border-black shadow-[3px_3px_0px_#000] mx-auto flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-black stroke-[2.5px]" />
                  </div>
                  <h2 className="font-mono font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                    AUTHORIZATION REQUIRED
                  </h2>
                  <p className="font-mono text-xs font-bold text-black/80">
                    Scan verified for ticket <strong className="text-black">{ticketId}</strong>. Enter your name and judge/organizer PIN to access squad records.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-200 border-2 border-black text-rose-950 font-mono text-xs font-bold flex items-center gap-2 animate-in shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-800" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4 pt-1">
                  {/* Input 1: Verifier Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>YOUR FULL NAME (JUDGE / VERIFIER) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Jenkins / Lead Judge"
                      value={verifierName}
                      onChange={(e) => setVerifierName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border-3 border-black font-mono text-xs font-bold text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#000]"
                    />
                  </div>

                  {/* Input 2: Authorization PIN */}
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>AUTHORIZATION PIN *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        required
                        placeholder="Enter secret PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border-3 border-black font-mono text-sm font-black text-black tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_#000]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] font-black uppercase text-black/60 hover:text-black"
                      >
                        {showPin ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                    <span className="font-mono text-[10px] text-black/60 block">
                      • The PIN is configured by the admin organizing team.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] active:border-t-[#2C4813] active:border-l-[#2C4813] active:border-r-[#85B745] active:border-b-[#85B745] shadow-[4px_4px_0px_#000] [text-shadow:_2px_2px_0_#000] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>VERIFYING PIN...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 stroke-[2.5px]" />
                        <span>UNLOCK SQUAD DETAILS</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* STATE 2: AUTHORIZED SQUAD DOSSIER & DETAILS                                */
            /* ========================================================================= */
            team && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Top Control Bar */}
                <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FFFF] border-2 border-black">
                      IDENTIFIER: {team.registrationNumber}
                    </span>
                    <span
                      className={clsx(
                        "font-mono text-xs font-black uppercase px-2.5 py-1 border-2 border-black",
                        team.status === "CONFIRMED"
                          ? "bg-[#55FF55] text-black"
                          : team.status === "REJECTED"
                          ? "bg-rose-400 text-black"
                          : "bg-amber-300 text-black"
                      )}
                    >
                      STATUS: {team.status}
                    </span>
                    <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-white text-black border-2 border-black flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AUTH BY: {team.verifiedBy || verifierName}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/teams"
                      className="font-mono text-xs font-black uppercase px-3 py-1 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-neo-xs"
                    >
                      <Scan className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>SCAN NEXT SQUAD</span>
                    </Link>
                    <button
                      onClick={handleLockSession}
                      className="font-mono text-xs font-black uppercase px-3 py-1 bg-neutral-200 hover:bg-neutral-300 border-2 border-black flex items-center gap-1 cursor-pointer transition-colors"
                      title="Lock details and sign out"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>LOCK SESSION</span>
                    </button>
                  </div>
                </div>

                {/* Team Hero Card */}
                <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-black pb-5">
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-black uppercase text-black/60">
                        OFFICIAL SQUAD ROSTER
                      </div>
                      <h1 className="font-mono font-black text-3xl sm:text-4xl uppercase text-black tracking-tight">
                        {team.teamName}
                      </h1>
                      <p className="font-mono text-xs text-black/80 font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Registered on {new Date(team.createdAt).toLocaleString("en-IN")}</span>
                      </p>
                    </div>

                    {/* Prominent Action: Judge Scoring & Point Entry (COMING SOON) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Link
                        href={`/teams/${ticketId}/judging`}
                        className="bg-[#FFAA00] hover:bg-[#FFB733] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#FFDD55] border-l-[#FFDD55] border-r-[#AA6600] border-b-[#AA6600] px-5 py-3 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                      >
                        <Gavel className="w-4 h-4 stroke-[3px]" />
                        <span>JUDGE EVALUATION &amp; SCORING</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-black text-[#55FF55] border border-black uppercase ml-1">
                          COMING SOON
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Problem Statement Box */}
                  <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#55FFFF]">
                        PROBLEM STATEMENT SELECTION
                      </span>
                      {team.problemStatement?.category && (
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border border-black">
                          {team.problemStatement.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-mono font-black text-base sm:text-lg text-black uppercase">
                      {team.problemStatement
                        ? `${team.problemStatement.id}: ${team.problemStatement.title}`
                        : team.problemStatementId
                        ? `STATEMENT ID: ${team.problemStatementId}`
                        : "NO PROBLEM STATEMENT LINKED"}
                    </h3>
                    {team.problemStatement?.brief && (
                      <p className="font-mono text-xs font-bold text-black/85 leading-relaxed">
                        {team.problemStatement.brief}
                      </p>
                    )}
                  </div>

                  {/* Institution & Address */}
                  <div className="bg-white border-3 border-black p-4 sm:p-5 space-y-2 shadow-neo-sm">
                    <div className="flex items-center gap-2 font-mono font-black text-xs uppercase text-neutral-600 border-b-2 border-black/10 pb-2">
                      <Building2 className="w-4 h-4 text-black" />
                      <span>COLLEGE / INSTITUTION &amp; CAMPUS ADDRESS</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono font-black text-base sm:text-lg text-black">
                        {team.collegeName}
                      </div>
                      {team.collegeAddress && (
                        <div className="font-mono text-xs font-bold text-neutral-700 flex items-start gap-1.5 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-black" />
                          <span>
                            {[
                              team.collegeAddress.fullAddress,
                              team.collegeAddress.city,
                              team.collegeAddress.state,
                              team.collegeAddress.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Leader Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono font-black text-sm uppercase text-black">
                      <Crown className="w-4 h-4 text-[#FFAA00] stroke-[2.5px]" />
                      <span>TEAM LEADER PROFILE</span>
                    </div>

                    <div className="bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="bg-white border-2 border-black p-3 space-y-0.5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block">FULL NAME</span>
                        <span className="font-black text-black text-sm block">{team.leader.fullName}</span>
                        <span className="font-bold text-[10px] text-emerald-700 uppercase block">Primary Contact / Leader</span>
                      </div>

                      <div className="bg-white border-2 border-black p-3 space-y-0.5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block">EMAIL ADDRESS</span>
                        <a href={`mailto:${team.leader.email}`} className="font-bold text-black hover:underline break-all block">
                          {team.leader.email}
                        </a>
                      </div>

                      <div className="bg-white border-2 border-black p-3 space-y-0.5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block">PHONE &amp; WHATSAPP</span>
                        <div className="font-bold text-black flex flex-col">
                          <a href={`tel:${team.leader.phone}`} className="hover:underline">
                            📞 {team.leader.phone}
                          </a>
                          {team.leader.whatsapp && (
                            <a
                              href={`https://wa.me/${team.leader.whatsapp.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:underline"
                            >
                              💬 WA: {team.leader.whatsapp}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border-2 border-black p-3 space-y-0.5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase block">BRANCH &amp; YEAR</span>
                        <span className="font-bold text-black block">
                          {team.leader.customBranch || team.leader.branch} ({team.leader.yearOfStudy})
                        </span>
                      </div>

                      {team.leader.githubUsername && (
                        <div className="bg-white border-2 border-black p-3 space-y-0.5">
                          <span className="text-[10px] font-black text-neutral-500 uppercase block">GITHUB PROFILE</span>
                          <a
                            href={`https://github.com/${team.leader.githubUsername.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-black hover:underline flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            <span>@{team.leader.githubUsername.replace("@", "")}</span>
                          </a>
                        </div>
                      )}

                      {team.leader.dateOfBirth && (
                        <div className="bg-white border-2 border-black p-3 space-y-0.5">
                          <span className="text-[10px] font-black text-neutral-500 uppercase block">DATE OF BIRTH</span>
                          <span className="font-bold text-black block">{team.leader.dateOfBirth}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Members Grid */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono font-black text-sm uppercase text-black">
                        <Users className="w-4 h-4 text-black stroke-[2.5px]" />
                        <span>SQUAD MEMBERS ({team.members.length})</span>
                      </div>
                    </div>

                    {team.members.length === 0 ? (
                      <div className="p-4 bg-white border-2 border-dashed border-black font-mono text-xs font-bold text-neutral-600 text-center">
                        No additional squad members listed (Solo participant registration).
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.members.map((member, idx) => (
                          <div
                            key={idx}
                            className="bg-white border-3 border-black p-4 space-y-2.5 shadow-neo-sm"
                          >
                            <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-black text-white font-mono text-[10px] font-black flex items-center justify-center">
                                  0{idx + 1}
                                </span>
                                <span className="font-mono font-black text-sm text-black uppercase">
                                  {member.fullName}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-neutral-100 border border-black uppercase">
                                {member.role || "Member"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                              <div>
                                <span className="text-[9px] font-black text-neutral-500 uppercase block">EMAIL</span>
                                <a href={`mailto:${member.email}`} className="font-bold text-black hover:underline truncate block">
                                  {member.email}
                                </a>
                              </div>
                              <div>
                                <span className="text-[9px] font-black text-neutral-500 uppercase block">PHONE</span>
                                {member.phone ? (
                                  <a href={`tel:${member.phone}`} className="font-bold text-black hover:underline block">
                                    {member.phone}
                                  </a>
                                ) : (
                                  <span className="text-neutral-400">N/A</span>
                                )}
                              </div>
                              <div className="col-span-2">
                                <span className="text-[9px] font-black text-neutral-500 uppercase block">ACADEMIC DETAILS</span>
                                <span className="font-bold text-black block">
                                  {member.customBranch || member.branch || "Engineering"} ({member.yearOfStudy || "N/A"})
                                </span>
                              </div>
                              {member.githubUsername && (
                                <div className="col-span-2">
                                  <span className="text-[9px] font-black text-neutral-500 uppercase block">GITHUB</span>
                                  <a
                                    href={`https://github.com/${member.githubUsername.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-black hover:underline inline-flex items-center gap-1.5"
                                  >
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                    <span>@{member.githubUsername.replace("@", "")}</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment & Accommodation Status Strips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white border-3 border-black p-4 space-y-1 shadow-neo-sm">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-neutral-600">
                        <CreditCard className="w-4 h-4 text-black" />
                        <span>PAYMENT &amp; FEE STATUS</span>
                      </div>
                      <div className="font-mono font-black text-sm text-black">
                        {team.payment.paymentStatus} ({team.payment.paymentMode})
                      </div>
                      {team.payment.transactionId && (
                        <div className="font-mono text-[11px] text-neutral-600">
                          TXN: {team.payment.transactionId}
                        </div>
                      )}
                    </div>

                    <div className="bg-white border-3 border-black p-4 space-y-1 shadow-neo-sm">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-neutral-600">
                        <Home className="w-4 h-4 text-black" />
                        <span>CAMPUS ACCOMMODATION</span>
                      </div>
                      <div className="font-mono font-black text-sm text-black">
                        {team.accommodation.required
                          ? `REQUESTED (${team.accommodation.status})`
                          : "NOT REQUESTED / DAY SCHOLAR"}
                      </div>
                      {team.accommodation.roomNumber && (
                        <div className="font-mono text-[11px] text-neutral-600">
                          Allocated Room: {team.accommodation.roomNumber} (Block {team.accommodation.hostelBlock || "A"})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
