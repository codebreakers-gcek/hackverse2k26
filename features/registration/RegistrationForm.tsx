"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  registrationService,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from "@/services/registrationService";
import {
  RegistrationFormData,
  TeamMember,
  ParticipantDetails,
  RegistrationSubmissionResult,
  MemberRole,
} from "@/types/registration";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/ButtonNeo";
import { RegistrationSuccessReceipt } from "./RegistrationSuccessReceipt";
import { RegisteredSquadDashboard } from "./RegisteredSquadDashboard";
import { OAuthLoginSection } from "./OAuthLoginSection";
import { useSession } from "@/lib/auth-client";
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  QrCode,
  Sparkles,
  FileText,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

const INDIAN_STATES = [
  "Odisha",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other / Union Territory",
];

const BRANCH_OPTIONS = [
  { value: "Computer Science & Engineering", label: "Computer Science & Engineering (CSE)" },
  { value: "Information Technology", label: "Information Technology (IT)" },
  { value: "Electrical Engineering", label: "Electrical Engineering (EE)" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering (ME)" },
  { value: "Civil Engineering", label: "Civil Engineering (CE)" },
  { value: "Electronics & Telecommunication", label: "Electronics & Telecomm (ETC)" },
  { value: "Artificial Intelligence & Data Science", label: "AI & Data Science (AI/DS)" },
  { value: "BCA / MCA / B.Sc / M.Sc", label: "BCA / MCA / B.Sc / M.Sc" },
  { value: "Other", label: "Other (Specify Custom Branch / Department)" },
];

const YEAR_OPTIONS = [
  { value: "1st Year", label: "1st Year (Freshman)" },
  { value: "2nd Year", label: "2nd Year (Sophomore)" },
  { value: "3rd Year", label: "3rd Year (Junior)" },
  { value: "4th Year", label: "4th Year (Senior)" },
  { value: "PG / Diploma", label: "Postgraduate / Diploma" },
];

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "Leader", label: "Leader / Squad Captain" },
  { value: "Frontend", label: "Frontend Engineer" },
  { value: "Backend", label: "Backend / Systems Engineer" },
  { value: "AI/ML", label: "AI / ML Specialist" },
  { value: "Full Stack", label: "Full Stack Generalist" },
  { value: "Designer", label: "UI / UX Designer" },
  { value: "Hardware/IoT", label: "Hardware / IoT Engineer" },
];

export function RegistrationForm() {
  const searchParams = useSearchParams();
  const preselectedPsId = searchParams?.get("psId") || "";
  const { data: session, isPending: isAuthPending } = useSession();

  const [currentStep, setCurrentStep] = useState<number>(1);

  const initialFormState: RegistrationFormData = {
    // Step 1
    teamName: "",
    collegeName: "",
    collegeAddress: {
      fullAddress: "",
      city: "",
      state: "Odisha",
      pincode: "",
    },
    // Step 2
    teamLeader: {
      fullName: "",
      email: "",
      phone: "",
      whatsappNumber: "",
      sameAsPhone: true,
      dateOfBirth: "",
      branch: "Computer Science & Engineering",
      customBranch: "",
      yearOfStudy: "3rd Year",
      role: "Leader",
      githubUsername: "",
    },
    // Initialize with 1 Co-Hacker to enforce minimum 2 squad members (1 Leader + 1 Member)
    members: [
      {
        fullName: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        sameAsPhone: true,
        dateOfBirth: "",
        role: "Frontend",
        branch: "Computer Science & Engineering",
        customBranch: "",
        yearOfStudy: "3rd Year",
        githubUsername: "",
      },
    ],
    // Step 3
    paymentDetails: {
      paymentMode: "FREE_SPONSORED",
      transactionId: "",
      status: "FREE_TIER",
    },
    // Step 4
    documentUploads: {
      collegeIdFileName: "",
      collegeIdFileSize: "",
      synopsisFileName: "",
      synopsisFileSize: "",
      githubRepoUrl: "",
    },
    agreeToGuidelines: false,
    selectedProblemStatementId: preselectedPsId || "",
  };

  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<RegistrationSubmissionResult | null>(null);

  // Registered Squad State (For Leader OR any registered Member)
  const [existingTeamData, setExistingTeamData] = useState<any>(null);
  const [userRoleInTeam, setUserRoleInTeam] = useState<"LEADER" | "MEMBER">("LEADER");
  const [isCheckingExistingTeam, setIsCheckingExistingTeam] = useState<boolean>(true);
  const [forceNewRegistration, setForceNewRegistration] = useState<boolean>(false);

  // Dynamic Payment & System Settings from Admin
  const [paymentSettings, setPaymentSettings] = useState<{
    upiId: string;
    payeeName: string;
    registrationFee: number;
    isPaymentMandatory: boolean;
    isRegistrationOpen?: boolean;
    isProblemStatementsPublished?: boolean;
  }>({
    upiId: "codebreakers@upi",
    payeeName: "HACKVERSE 2026 GCEK",
    registrationFee: 0,
    isPaymentMandatory: false,
    isRegistrationOpen: true,
    isProblemStatementsPublished: true,
  });
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch registered team data for logged-in user (as Leader OR Member)
  useEffect(() => {
    async function checkMyTeam() {
      if (session?.user) {
        try {
          setIsCheckingExistingTeam(true);
          const res = await fetch("/api/team/my-team");
          const data = await res.json();
          if (data.success && data.registered && data.team) {
            setExistingTeamData(data.team);
            setUserRoleInTeam(data.userRoleInTeam || "LEADER");
          } else {
            setExistingTeamData(null);
          }
        } catch (err) {
          console.error("Error checking existing team:", err);
          setExistingTeamData(null);
        } finally {
          setIsCheckingExistingTeam(false);
        }
      } else {
        setIsCheckingExistingTeam(false);
      }
    }

    if (!isAuthPending) {
      checkMyTeam();
    }
  }, [session, isAuthPending]);

  // File inputs ref & upload states
  const collegeIdInputRef = useRef<HTMLInputElement>(null);
  const synopsisInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCollegeId, setIsUploadingCollegeId] = useState(false);
  const [isUploadingSynopsis, setIsUploadingSynopsis] = useState(false);

  // Pre-fill user data from OAuth
  useEffect(() => {
    if (session?.user) {
      const user = session.user as { name?: string; email?: string };
      setFormData((prev) => ({
        ...prev,
        teamLeader: {
          ...prev.teamLeader,
          fullName: prev.teamLeader.fullName || user.name || "",
          email: prev.teamLeader.email || user.email || "",
        },
      }));
    }
  }, [session]);

  const handleUserPrefill = (user: { name?: string; email?: string; image?: string }) => {
    setFormData((prev) => {
      if (!prev.teamLeader.fullName && user.name) {
        return {
          ...prev,
          teamLeader: {
            ...prev.teamLeader,
            fullName: user.name || prev.teamLeader.fullName,
            email: user.email || prev.teamLeader.email,
          },
        };
      }
      return prev;
    });
  };

  // Step 1: Address Handlers
  const handleAddressChange = (field: keyof typeof formData.collegeAddress, value: string) => {
    setFormData((prev) => ({
      ...prev,
      collegeAddress: {
        ...prev.collegeAddress,
        [field]: value,
      },
    }));
    if (errors[`collegeAddress.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`collegeAddress.${field}`];
        return next;
      });
    }
  };

  // Step 2: Leader Handlers
  const handleLeaderChange = (field: keyof ParticipantDetails, value: unknown) => {
    setFormData((prev) => {
      const updatedLeader = {
        ...prev.teamLeader,
        [field]: value,
      };

      // If sameAsPhone toggled or phone updated while sameAsPhone is true
      if (field === "phone" && updatedLeader.sameAsPhone) {
        updatedLeader.whatsappNumber = value as string;
      }
      if (field === "sameAsPhone") {
        if (value === true) {
          updatedLeader.whatsappNumber = updatedLeader.phone;
        }
      }

      return {
        ...prev,
        teamLeader: updatedLeader,
      };
    });

    if (errors[`teamLeader.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`teamLeader.${field}`];
        return next;
      });
    }
  };

  // Step 2: Member Handlers (Min 1 Co-Hacker, Max 3 Co-Hackers -> Total 2 to 4 Squad Members)
  const handleAddMember = () => {
    if (formData.members.length >= 3) return; // Up to 3 co-hackers (max 4 members total)
    const newMember: TeamMember = {
      fullName: "",
      email: "",
      phone: "",
      whatsappNumber: "",
      sameAsPhone: true,
      dateOfBirth: "",
      role: "Frontend",
      branch: "Computer Science & Engineering",
      customBranch: "",
      yearOfStudy: "3rd Year",
      githubUsername: "",
    };
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
    if (errors.members) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.members;
        return next;
      });
    }
  };

  const handleRemoveMember = (index: number) => {
    if (formData.members.length <= 1) return; // Minimum 1 co-hacker required (min 2 members total)
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`members.${index}.fullName`];
      delete next[`members.${index}.email`];
      delete next[`members.${index}.phone`];
      delete next[`members.${index}.whatsappNumber`];
      delete next[`members.${index}.dateOfBirth`];
      delete next[`members.${index}.branch`];
      delete next[`members.${index}.customBranch`];
      delete next[`members.${index}.yearOfStudy`];
      return next;
    });
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: unknown) => {
    setFormData((prev) => {
      const updated = [...prev.members];
      const member = { ...updated[index], [field]: value };

      if (field === "phone" && member.sameAsPhone) {
        member.whatsappNumber = value as string;
      }
      if (field === "sameAsPhone") {
        if (value === true) {
          member.whatsappNumber = member.phone;
        }
      }

      updated[index] = member;
      return { ...prev, members: updated };
    });

    if (errors[`members.${index}.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`members.${index}.${field}`];
        return next;
      });
    }
  };

  // Step 4: File Upload Handlers (Direct Google Drive upload)
  const handleCollegeIdFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        collegeIdFileName: file.name,
        collegeIdFileSize: sizeStr,
      },
    }));

    if (errors["documentUploads.collegeIdFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.collegeIdFileName"];
        return next;
      });
    }

    // Direct Google Drive upload
    setIsUploadingCollegeId(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("teamName", formData.teamName || "Squad");
      uploadData.append("category", "college_id");

      const res = await fetch("/api/upload/drive", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      if (result.success && result.data) {
        setFormData((prev) => ({
          ...prev,
          documentUploads: {
            ...prev.documentUploads,
            collegeIdFileName: file.name,
            collegeIdFileSize: sizeStr,
            collegeIdDriveUrl: result.data.webViewLink,
            collegeIdDriveFileId: result.data.fileId,
          },
        }));
      }
    } catch (err) {
      console.warn("Drive upload error, keeping local reference:", err);
    } finally {
      setIsUploadingCollegeId(false);
    }
  };

  const handleSynopsisFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        synopsisFileName: file.name,
        synopsisFileSize: sizeStr,
      },
    }));

    if (errors["documentUploads.synopsisFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.synopsisFileName"];
        return next;
      });
    }

    // Direct Google Drive upload
    setIsUploadingSynopsis(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("teamName", formData.teamName || "Squad");
      uploadData.append("category", "synopsis");

      const res = await fetch("/api/upload/drive", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      if (result.success && result.data) {
        setFormData((prev) => ({
          ...prev,
          documentUploads: {
            ...prev.documentUploads,
            synopsisFileName: file.name,
            synopsisFileSize: sizeStr,
            synopsisDriveUrl: result.data.webViewLink,
            synopsisDriveFileId: result.data.fileId,
          },
        }));
      }
    } catch (err) {
      console.warn("Drive upload error, keeping local reference:", err);
    } finally {
      setIsUploadingSynopsis(false);
    }
  };

  // Step Navigation Handlers
  const handleNextStep = () => {
    let stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      stepErrors = validateStep1(formData);
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData);
    } else if (currentStep === 3) {
      stepErrors = validateStep3(formData);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = validateStep4(formData);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await registrationService.submitRegistration(formData);
      if (result.success) {
        setSubmissionResult(result);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: result.message });
        }
      }
    } catch {
      setErrors({ form: "Unexpected submission error. Please check your connection and retry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors({});
    setSubmissionResult(null);
  };

  if (submissionResult) {
    return <RegistrationSuccessReceipt result={submissionResult} onReset={handleResetForm} />;
  }

  const isAuthenticated = Boolean(session?.user);

  const stepsList = [
    { num: 1, title: "COLLEGE & SQUAD", icon: Building2 },
    { num: 2, title: "SQUAD MEMBERS", icon: Users },
    { num: 3, title: "PAYMENT BLOCK", icon: CreditCard },
    { num: 4, title: "UPLOAD & SUBMIT", icon: UploadCloud },
  ];

  return (
    <div className="space-y-8">
      {/* OAuth Sign-In Section (Shown when unauthenticated) */}
      <OAuthLoginSection onUserPrefill={handleUserPrefill} />

      {/* Checking squad records state */}
      {isAuthenticated && isCheckingExistingTeam && (
        <div className="border-4 border-black bg-white p-8 shadow-neo text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-black" />
          <p className="font-mono text-xs font-black uppercase tracking-wider text-black">
            Verifying squad registration records...
          </p>
        </div>
      )}

      {/* When user is NOT authenticated: Display Locked State Notice */}
      {!isAuthenticated && !isAuthPending && (
        <div className="border-4 border-black bg-neo-muted/30 p-8 shadow-neo text-center space-y-4">
          <div className="w-14 h-14 bg-white border-3 border-black mx-auto flex items-center justify-center shadow-neo-sm">
            <Lock className="w-7 h-7 text-black stroke-[2.5px]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-xl sm:text-2xl text-black uppercase tracking-tight">
              {paymentSettings?.isRegistrationOpen === false
                ? "REGISTRATION PORTAL CLOSED"
                : "REGISTRATION PORTAL LOCKED"}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-black/75 max-w-lg mx-auto">
              {paymentSettings?.isRegistrationOpen === false
                ? "Squad admissions for HACKVERSE '26 are currently closed. Existing registered squads can sign in above to access their team dashboard."
                : "Please sign in with your Google or GitHub account above. Once authenticated, the 4-step registration wizard will unlock automatically."}
            </p>
          </div>
        </div>
      )}

      {/* When Squad is ALREADY Registered (Leader or Team Member logged in) */}
      {isAuthenticated && !isCheckingExistingTeam && existingTeamData && !forceNewRegistration && (
        <RegisteredSquadDashboard
          teamData={existingTeamData}
          userRoleInTeam={userRoleInTeam}
          currentUser={session?.user || {}}
          onRegisterNewTeam={() => setForceNewRegistration(true)}
        />
      )}

      {/* When Registrations are CLOSED and user has no registered squad */}
      {isAuthenticated && !isCheckingExistingTeam && (!existingTeamData || forceNewRegistration) && paymentSettings && paymentSettings.isRegistrationOpen === false && (
        <div className="border-4 border-black bg-rose-200 p-8 shadow-neo text-center space-y-4">
          <div className="w-14 h-14 bg-white border-3 border-black mx-auto flex items-center justify-center shadow-neo-sm">
            <Lock className="w-7 h-7 text-black stroke-[2.5px]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              REGISTRATIONS ARE CURRENTLY CLOSED
            </h3>
            <p className="font-mono text-xs sm:text-sm font-bold text-black/80 max-w-lg mx-auto leading-relaxed">
              The organizing committee has closed or paused squad registrations for HACKVERSE &apos;26. No new submissions are being accepted at this time.
            </p>
          </div>
          {existingTeamData && forceNewRegistration && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setForceNewRegistration(false)}
                className="px-6 py-2.5 bg-black text-white font-black text-xs uppercase font-mono shadow-neo-sm hover:bg-neutral-800 transition-all cursor-pointer"
              >
                &larr; Return to My Squad Dossier
              </button>
            </div>
          )}
        </div>
      )}

      {/* When user IS authenticated AND either has no team or clicked to register another squad AND registration IS OPEN */}
      {isAuthenticated && !isCheckingExistingTeam && (!existingTeamData || forceNewRegistration) && (paymentSettings?.isRegistrationOpen !== false) && (
        <div className="space-y-8">
          {/* Switch back banner if user was previously registered */}
          {existingTeamData && forceNewRegistration && (
            <div className="border-3 border-black bg-neo-accent p-3 shadow-neo-sm flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-mono text-xs font-black uppercase text-black">
                Currently registered as squad: <strong>{existingTeamData.teamName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setForceNewRegistration(false)}
                className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                &larr; Return to Squad Dossier
              </button>
            </div>
          )}

          {/* Multi-Step Progress Header Stepper */}
          <div className="border-4 border-black bg-white p-4 sm:p-6 shadow-neo">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {stepsList.map((st) => {
                const Icon = st.icon;
                const isCurrent = currentStep === st.num;
                const isPassed = currentStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      if (isPassed) setCurrentStep(st.num);
                    }}
                    disabled={!isPassed && !isCurrent}
                    className={clsx(
                      "p-3 border-3 border-black flex items-center gap-2.5 transition-all text-left",
                      isCurrent
                        ? "bg-neo-secondary text-black shadow-neo-sm"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-950 hover:bg-emerald-200 cursor-pointer"
                        : "bg-neutral-100 text-black/40 opacity-70 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-8 h-8 font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-black",
                        isCurrent
                          ? "bg-black text-white"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-black"
                      )}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 stroke-[3px]" /> : `0${st.num}`}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-mono text-[9px] font-black uppercase text-black/50 leading-none">
                        STEP 0{st.num}
                      </div>
                      <div className="font-black text-xs uppercase text-black truncate leading-tight mt-0.5">
                        {st.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Form General Error Alert */}
            {errors.form && (
              <div className="border-4 border-black bg-neo-accent p-4 shadow-neo text-black flex items-center gap-3">
                <AlertCircle className="w-6 h-6 stroke-[3px] shrink-0" />
                <p className="font-black text-sm">{errors.form}</p>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 1: COLLEGE & SQUAD DETAILS                                           */}
            {/* ========================================================================= */}
            {currentStep === 1 && (
              <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b-4 border-black pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                      01
                    </span>
                    <h3 className="font-black text-xl text-black uppercase tracking-tight">
                      SQUAD PROFILE &amp; COLLEGE ADDRESS
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold bg-neo-bg px-2 py-1 border-2 border-black uppercase hidden sm:inline">
                    STEP 1 OF 4
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="SQUAD / TEAM NAME"
                    required
                    placeholder="e.g. CyberVanguard, NeuralBytes"
                    value={formData.teamName}
                    onChange={(e) => {
                      setFormData({ ...formData, teamName: e.target.value });
                      if (errors.teamName) setErrors((prev) => ({ ...prev, teamName: "" }));
                    }}
                    error={errors.teamName}
                    helperText="Strict rule: Do not use your college name or initials in your team name."
                  />

                  <Input
                    label="COLLEGE / UNIVERSITY NAME"
                    required
                    placeholder="e.g. Government College of Engineering Kalahandi"
                    value={formData.collegeName}
                    onChange={(e) => {
                      setFormData({ ...formData, collegeName: e.target.value });
                      if (errors.collegeName) setErrors((prev) => ({ ...prev, collegeName: "" }));
                    }}
                    error={errors.collegeName}
                    helperText="Official engineering college, university, or polytechnic campus."
                  />
                </div>

                {/* College Address Fields */}
                <div className="pt-4 border-t-2 border-black/15 space-y-4">
                  <div className="font-mono text-xs font-black uppercase text-black/70 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-black" />
                    <span>INSTITUTION CAMPUS ADDRESS:</span>
                  </div>

                  <Input
                    label="FULL STREET / CAMPUS ADDRESS"
                    required
                    placeholder="e.g. Bandhopala, Po - Risigaon, Bhawanipatna"
                    value={formData.collegeAddress.fullAddress}
                    onChange={(e) => handleAddressChange("fullAddress", e.target.value)}
                    error={errors["collegeAddress.fullAddress"]}
                    helperText="Complete postal street address of your college campus."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="CITY / DISTRICT"
                      required
                      placeholder="e.g. Kalahandi / Bhawanipatna"
                      value={formData.collegeAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      error={errors["collegeAddress.city"]}
                    />

                    <Select
                      label="STATE"
                      required
                      value={formData.collegeAddress.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      error={errors["collegeAddress.state"]}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </Select>

                    <Input
                      label="PIN CODE"
                      required
                      maxLength={6}
                      placeholder="e.g. 766002"
                      value={formData.collegeAddress.pincode}
                      onChange={(e) => handleAddressChange("pincode", e.target.value.replace(/\D/g, ""))}
                      error={errors["collegeAddress.pincode"]}
                    />
                  </div>
                </div>

                {/* Step 1 Navigation CTA */}
                <div className="pt-6 border-t-4 border-black flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto"
                  >
                    <span>PROCEED TO STEP 02: SQUAD MEMBERS</span>
                    <ArrowRight className="w-5 h-5 stroke-[3px]" />
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: SQUAD MEMBERS & LEADER CREDENTIALS (IDENTICAL COMPREHENSIVE FIELDS) */}
            {/* ========================================================================= */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Leader Box */}
                <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
                  <div className="border-b-4 border-black pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                        02.1
                      </span>
                      <h3 className="font-black text-xl text-black uppercase tracking-tight">
                        TEAM LEADER (PRIMARY LIAISON)
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] font-black bg-neo-secondary px-2.5 py-0.5 border border-black uppercase">
                      CAPTAIN / LEADER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="LEADER FULL NAME"
                      required
                      placeholder="e.g. Gyanranjan Priyam"
                      value={formData.teamLeader.fullName}
                      onChange={(e) => handleLeaderChange("fullName", e.target.value)}
                      error={errors["teamLeader.fullName"]}
                    />

                    <Input
                      label="LEADER EMAIL ADDRESS"
                      required
                      type="email"
                      placeholder="e.g. leader@gmail.com"
                      value={formData.teamLeader.email}
                      onChange={(e) => handleLeaderChange("email", e.target.value)}
                      error={errors["teamLeader.email"]}
                    />

                    <Input
                      label="MOBILE PHONE NUMBER"
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={formData.teamLeader.phone}
                      onChange={(e) => handleLeaderChange("phone", e.target.value.replace(/\D/g, ""))}
                      error={errors["teamLeader.phone"]}
                      helperText="10-digit primary calling number."
                    />

                    {/* WhatsApp Number with sameAsPhone toggle */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-wider text-black">
                          WHATSAPP NUMBER
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formData.teamLeader.sameAsPhone ?? true}
                            onChange={(e) => handleLeaderChange("sameAsPhone", e.target.checked)}
                            className="w-4 h-4 accent-black rounded-none border border-black cursor-pointer"
                          />
                          <span>Same as Mobile</span>
                        </label>
                      </div>
                      <Input
                        type="tel"
                        maxLength={10}
                        disabled={formData.teamLeader.sameAsPhone}
                        placeholder="e.g. 9876543210"
                        value={formData.teamLeader.whatsappNumber || ""}
                        onChange={(e) => handleLeaderChange("whatsappNumber", e.target.value.replace(/\D/g, ""))}
                        error={errors["teamLeader.whatsappNumber"]}
                        helperText="For urgent coordination and broadcast updates."
                      />
                    </div>

                    <Input
                      label="DATE OF BIRTH (DOB)"
                      required
                      type="date"
                      value={formData.teamLeader.dateOfBirth || ""}
                      onChange={(e) => handleLeaderChange("dateOfBirth", e.target.value)}
                      error={errors["teamLeader.dateOfBirth"]}
                    />

                    <Select
                      label="DOMAIN ROLE"
                      value={formData.teamLeader.role}
                      onChange={(e) => handleLeaderChange("role", e.target.value as MemberRole)}
                      options={ROLE_OPTIONS}
                    />

                    {/* Branch Selection */}
                    <div className="space-y-2">
                      <Select
                        label="ENGINEERING BRANCH / DEPT"
                        required
                        value={formData.teamLeader.branch}
                        onChange={(e) => handleLeaderChange("branch", e.target.value)}
                        error={errors["teamLeader.branch"]}
                        options={BRANCH_OPTIONS}
                      />

                      {formData.teamLeader.branch === "Other" && (
                        <div className="animate-in fade-in-50 duration-150">
                          <Input
                            label="SPECIFY CUSTOM BRANCH"
                            required
                            placeholder="e.g. Chemical Engineering, Automobile, Robotics"
                            value={formData.teamLeader.customBranch || ""}
                            onChange={(e) => handleLeaderChange("customBranch", e.target.value)}
                            error={errors["teamLeader.customBranch"]}
                            helperText="Please write your branch or specialization name."
                          />
                        </div>
                      )}
                    </div>

                    <Select
                      label="YEAR OF STUDY"
                      required
                      value={formData.teamLeader.yearOfStudy}
                      onChange={(e) => handleLeaderChange("yearOfStudy", e.target.value)}
                      error={errors["teamLeader.yearOfStudy"]}
                      options={YEAR_OPTIONS}
                    />

                    <Input
                      label="GITHUB / PORTFOLIO / LINKEDIN"
                      placeholder="e.g. github.com/leader or handle"
                      value={formData.teamLeader.githubUsername || ""}
                      onChange={(e) => handleLeaderChange("githubUsername", e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Members Box */}
                <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6">
                  <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                        02.2
                      </span>
                      <div>
                        <h3 className="font-black text-xl text-black uppercase tracking-tight">
                          ADDITIONAL SQUAD MEMBERS ({formData.members.length} OF MAX 3 CO-HACKERS)
                        </h3>
                        <p className="font-mono text-[11px] text-black/70">
                          Squad Capacity: <strong>Minimum 2 members</strong> (1 Leader + 1 Co-hacker), <strong>Maximum 4 members</strong> (1 Leader + up to 3 Co-hackers)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={formData.members.length >= 3}
                      className={clsx(
                        "px-4 py-2 bg-neo-secondary text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto",
                        formData.members.length >= 3 && "opacity-50 cursor-not-allowed bg-neutral-300"
                      )}
                    >
                      <Plus className="w-4 h-4 stroke-[3px]" />
                      <span>{formData.members.length >= 3 ? "MAX 4 SQUAD REACHED" : "ADD CO-HACKER"}</span>
                    </button>
                  </div>

                  {errors.members && (
                    <div className="p-3.5 bg-rose-50 border-2 border-rose-500 text-rose-700 font-mono text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errors.members}</span>
                    </div>
                  )}

                  {formData.members.length === 0 ? (
                    <div className="p-6 bg-amber-50 border-3 border-black text-center space-y-2">
                      <p className="font-bold text-sm text-black/90">
                        A minimum of 1 co-hacker is required (total 2 members minimum). Please click &quot;ADD CO-HACKER&quot; above.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-5 sm:p-6 bg-neo-bg border-3 border-black shadow-neo-sm space-y-5 animate-in fade-in-50 duration-200"
                        >
                          <div className="flex items-center justify-between border-b-2 border-black pb-2">
                            <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5 border border-black">
                              CO-HACKER #{idx + 2} {idx === 0 && "(MANDATORY 2ND MEMBER)"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              disabled={formData.members.length <= 1}
                              title={formData.members.length <= 1 ? "Minimum 2 squad members required (1 Leader + 1 Co-hacker)" : "Remove this co-hacker"}
                              className={clsx(
                                "px-2.5 py-1 text-white font-black text-xs uppercase border border-black flex items-center gap-1 transition-all",
                                formData.members.length <= 1
                                  ? "bg-neutral-400 opacity-60 cursor-not-allowed text-neutral-800"
                                  : "bg-rose-500 hover:bg-rose-600"
                              )}
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                              <span>{formData.members.length <= 1 ? "MIN 2 REQUIRED" : "REMOVE"}</span>
                            </button>
                          </div>

                          {/* Comprehensive identical fields for Member */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              label={`MEMBER ${idx + 2} FULL NAME`}
                              required
                              placeholder="e.g. Teammate Name"
                              value={member.fullName}
                              onChange={(e) => handleMemberChange(idx, "fullName", e.target.value)}
                              error={errors[`members.${idx}.fullName`]}
                            />

                            <Input
                              label={`MEMBER ${idx + 2} EMAIL`}
                              required
                              type="email"
                              placeholder="e.g. member@gmail.com"
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                              error={errors[`members.${idx}.email`]}
                            />

                            <Input
                              label={`MEMBER ${idx + 2} MOBILE PHONE`}
                              required
                              type="tel"
                              maxLength={10}
                              placeholder="e.g. 9876543210"
                              value={member.phone}
                              onChange={(e) => handleMemberChange(idx, "phone", e.target.value.replace(/\D/g, ""))}
                              error={errors[`members.${idx}.phone`]}
                            />

                            {/* Member WhatsApp */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-wider text-black">
                                  WHATSAPP NUMBER
                                </label>
                                <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={member.sameAsPhone ?? true}
                                    onChange={(e) => handleMemberChange(idx, "sameAsPhone", e.target.checked)}
                                    className="w-4 h-4 accent-black rounded-none border border-black cursor-pointer"
                                  />
                                  <span>Same as Mobile</span>
                                </label>
                              </div>
                              <Input
                                type="tel"
                                maxLength={10}
                                disabled={member.sameAsPhone}
                                placeholder="e.g. 9876543210"
                                value={member.whatsappNumber || ""}
                                onChange={(e) => handleMemberChange(idx, "whatsappNumber", e.target.value.replace(/\D/g, ""))}
                                error={errors[`members.${idx}.whatsappNumber`]}
                              />
                            </div>

                            <Input
                              label={`MEMBER ${idx + 2} DATE OF BIRTH`}
                              required
                              type="date"
                              value={member.dateOfBirth || ""}
                              onChange={(e) => handleMemberChange(idx, "dateOfBirth", e.target.value)}
                              error={errors[`members.${idx}.dateOfBirth`]}
                            />

                            <Select
                              label={`MEMBER ${idx + 2} DOMAIN ROLE`}
                              value={member.role}
                              onChange={(e) => handleMemberChange(idx, "role", e.target.value as MemberRole)}
                              options={ROLE_OPTIONS}
                            />

                            {/* Member Branch Selection */}
                            <div className="space-y-2">
                              <Select
                                label={`MEMBER ${idx + 2} BRANCH / DEPT`}
                                required
                                value={member.branch || "Computer Science & Engineering"}
                                onChange={(e) => handleMemberChange(idx, "branch", e.target.value)}
                                error={errors[`members.${idx}.branch`]}
                                options={BRANCH_OPTIONS}
                              />

                              {member.branch === "Other" && (
                                <div className="animate-in fade-in-50 duration-150">
                                  <Input
                                    label="SPECIFY CUSTOM BRANCH"
                                    required
                                    placeholder="e.g. Chemical, Biotechnology, Metallurgy"
                                    value={member.customBranch || ""}
                                    onChange={(e) => handleMemberChange(idx, "customBranch", e.target.value)}
                                    error={errors[`members.${idx}.customBranch`]}
                                  />
                                </div>
                              )}
                            </div>

                            <Select
                              label={`MEMBER ${idx + 2} YEAR OF STUDY`}
                              required
                              value={member.yearOfStudy || "3rd Year"}
                              onChange={(e) => handleMemberChange(idx, "yearOfStudy", e.target.value)}
                              error={errors[`members.${idx}.yearOfStudy`]}
                              options={YEAR_OPTIONS}
                            />

                            <div className="sm:col-span-2">
                              <Input
                                label={`MEMBER ${idx + 2} GITHUB / PORTFOLIO (OPTIONAL)`}
                                placeholder="e.g. github.com/member or handle"
                                value={member.githubUsername || ""}
                                onChange={(e) => handleMemberChange(idx, "githubUsername", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Step 2 Navigation Buttons */}
                <div className="pt-4 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-6 h-12 bg-white text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-100 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                    <span>PREVIOUS STEP</span>
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto"
                  >
                    <span>PROCEED TO STEP 03: PAYMENT BLOCK</span>
                    <ArrowRight className="w-5 h-5 stroke-[3px]" />
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 3: PAYMENT & REGISTRATION TIER (CONFIGURABLE / ADMIN ENABLED)         */}
            {/* ========================================================================= */}
            {currentStep === 3 && (
              <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b-4 border-black pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                      03
                    </span>
                    <h3 className="font-black text-xl text-black uppercase tracking-tight">
                      REGISTRATION PASS &amp; UPI PAYMENT BLOCK
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-black bg-neo-secondary px-2.5 py-0.5 border border-black uppercase">
                    {paymentSettings.registrationFee > 0 ? `FEE: ₹${paymentSettings.registrationFee}` : "SPONSORED PASS"}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Dynamic UPI Payment Card with QR Code */}
                  <div className="p-6 border-4 border-black bg-neo-bg shadow-neo space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Dynamic UPI QR Code */}
                      <div className="p-3 bg-white border-3 border-black shadow-neo-sm shrink-0 flex flex-col items-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                            `upi://pay?pa=${paymentSettings.upiId}&pn=${encodeURIComponent(paymentSettings.payeeName)}&am=${paymentSettings.registrationFee || ""}&cu=INR`
                          )}`}
                          alt="Official Hackathon UPI QR Code"
                          className="w-44 h-44 border border-black"
                        />
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-black/70 mt-2 flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" />
                          <span>SCAN VIA ANY UPI APP</span>
                        </span>
                      </div>

                      {/* Payee and UPI Details */}
                      <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-black uppercase text-black/60">
                            PAYEE / BENEFICIARY:
                          </span>
                          <h4 className="font-black text-lg uppercase text-black">
                            {paymentSettings.payeeName}
                          </h4>
                        </div>

                        {/* UPI ID Copy Box */}
                        <div className="p-3.5 bg-white border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-black/60 uppercase block">
                              OFFICIAL ADMIN UPI ID:
                            </span>
                            <span className="font-mono text-sm font-black text-black select-all">
                              {paymentSettings.upiId}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(paymentSettings.upiId);
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2500);
                            }}
                            className="px-3 py-1.5 bg-neo-secondary text-black font-black text-xs uppercase border-2 border-black shadow-neo-sm hover:shadow-none flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <span>{copiedUpi ? "COPIED TO CLIPBOARD!" : "COPY UPI ID"}</span>
                          </button>
                        </div>

                        <p className="font-sans text-xs font-bold text-black/75">
                          Scan the QR Code using <strong>Google Pay, PhonePe, Paytm, BHIM, or any UPI App</strong>. After successful transfer, copy the <strong>12-digit UTR / Reference Number</strong> from your banking SMS or receipt and paste it below.
                        </p>
                      </div>
                    </div>

                    {/* UTR Input Section */}
                    <div className="pt-4 border-t-2 border-black/20 space-y-3">
                      <Input
                        label="12-DIGIT TRANSACTION REFERENCE ID / UPI UTR"
                        required
                        maxLength={24}
                        placeholder="e.g. 429108492019 or UPI Ref No"
                        value={formData.paymentDetails.transactionId || ""}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            paymentDetails: {
                              ...prev.paymentDetails,
                              paymentMode: "UPI_QR",
                              transactionId: e.target.value.trim(),
                              status: "PENDING_VERIFICATION",
                            },
                          }));
                          if (errors["paymentDetails.transactionId"]) {
                            setErrors((prev) => ({ ...prev, "paymentDetails.transactionId": "" }));
                          }
                        }}
                        error={errors["paymentDetails.transactionId"]}
                        helperText="Mandatory for payment confirmation and receipt verification."
                      />
                    </div>
                  </div>

                  {/* Free Tier / Waiver Option (If not mandatory) */}
                  {!paymentSettings.isPaymentMandatory && (
                    <div
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentDetails: {
                            paymentMode: "FREE_SPONSORED",
                            transactionId: "",
                            status: "FREE_TIER",
                          },
                        }))
                      }
                      className={clsx(
                        "p-4 border-3 border-black cursor-pointer transition-all flex items-center justify-between gap-4",
                        formData.paymentDetails.paymentMode === "FREE_SPONSORED"
                          ? "bg-emerald-100 border-emerald-900 shadow-neo-sm"
                          : "bg-white hover:bg-neutral-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <div className="font-black text-sm uppercase text-black">
                            APPLY FOR FREE TIER / SPONSORED PASS WAIVER
                          </div>
                          <p className="text-[11px] font-bold text-black/70">
                            Available for eligible GCEK and affiliated college student hackathon squads.
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black bg-white px-2 py-0.5 border border-black uppercase">
                        ₹0 WAIVER
                      </span>
                    </div>
                  )}

                  {/* Amenities Breakdown Box */}
                  <div className="p-4 bg-white border-3 border-black space-y-2">
                    <div className="font-mono text-xs font-black uppercase text-black">
                      INCLUDED WITH YOUR CONFIRMED PASS:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-black">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-black">✔</span>
                        <span>24-Hour Continuous Hack Arena Access</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-black">✔</span>
                        <span>High-Speed 1Gbps Dedicated Wi-Fi &amp; Ports</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-black">✔</span>
                        <span>Complimentary Meals &amp; Energy Refreshments</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-black">✔</span>
                        <span>Official Government State Hackathon Certificate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 Navigation Buttons */}
                <div className="pt-6 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-6 h-12 bg-white text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-100 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                    <span>PREVIOUS STEP</span>
                  </button>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleNextStep}
                    className="w-full sm:w-auto"
                  >
                    <span>PROCEED TO STEP 04: DOCUMENT UPLOADS</span>
                    <ArrowRight className="w-5 h-5 stroke-[3px]" />
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: DOCUMENT UPLOADS & FINAL SUBMISSION                                */}
            {/* ========================================================================= */}
            {currentStep === 4 && (
              <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b-4 border-black pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                      04
                    </span>
                    <h3 className="font-black text-xl text-black uppercase tracking-tight">
                      DOCUMENT UPLOADS &amp; FINAL PASS CONFIRMATION
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold bg-neo-secondary px-2 py-1 border-2 border-black uppercase hidden sm:inline">
                    FINAL STEP 4
                  </span>
                </div>

                {/* Document Upload 1: College ID Card / Bonafide (REQUIRED) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-black" />
                      <span>COLLEGE ID CARDS / BONAFIDE CERTIFICATE (PDF / PNG / JPG)</span>
                    </label>
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-rose-600 text-white border border-black shadow-neo-sm">
                      REQUIRED *
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={collegeIdInputRef}
                    onChange={handleCollegeIdFile}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  <div
                    onClick={() => !isUploadingCollegeId && collegeIdInputRef.current?.click()}
                    className={clsx(
                      "p-6 border-3 border-dashed transition-all text-center space-y-2 cursor-pointer",
                      errors["documentUploads.collegeIdFileName"]
                        ? "border-rose-600 bg-rose-50"
                        : "border-black bg-neutral-50 hover:bg-neo-bg"
                    )}
                  >
                    {isUploadingCollegeId ? (
                      <div className="space-y-2 py-2">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-black" />
                        <p className="font-mono text-xs font-black uppercase text-black">
                          Uploading College ID to Google Drive...
                        </p>
                      </div>
                    ) : formData.documentUploads.collegeIdFileName ? (
                      <div className="space-y-2">
                        <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>ATTACHED: {formData.documentUploads.collegeIdFileName}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono">
                          <span className="text-black/60">{formData.documentUploads.collegeIdFileSize}</span>
                          {formData.documentUploads.collegeIdDriveUrl && (
                            <a
                              href={formData.documentUploads.collegeIdDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-800 font-bold hover:bg-blue-200"
                            >
                              <HardDrive className="w-3 h-3" />
                              <span>View in Google Drive</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <span className="text-black/60 underline">• Click to replace file</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <UploadCloud className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                        <p className="font-black text-sm uppercase text-black">
                          CLICK OR DRAG &amp; DROP COLLEGE ID CARDS
                        </p>
                        <p className="font-mono text-xs text-black/60">
                          Combined squad PDF or Leader ID card (Max 20MB) • Uploads to Google Drive
                        </p>
                      </div>
                    )}
                  </div>
                  {errors["documentUploads.collegeIdFileName"] && (
                    <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors["documentUploads.collegeIdFileName"]}
                    </p>
                  )}
                </div>

                {/* Document Upload 2: Project Abstract / Proposal (REQUIRED) */}
                <div className="space-y-2 pt-2 border-t-2 border-black/15">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>PROJECT SYNOPSIS / PROPOSAL DECK (PDF / DOCX / PPTX)</span>
                    </label>
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-rose-600 text-white border border-black shadow-neo-sm">
                      REQUIRED *
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={synopsisInputRef}
                    onChange={handleSynopsisFile}
                    accept=".pdf,.docx,.pptx,.ppt"
                    className="hidden"
                  />

                  <div
                    onClick={() => !isUploadingSynopsis && synopsisInputRef.current?.click()}
                    className={clsx(
                      "p-6 border-3 border-dashed transition-all text-center space-y-2 cursor-pointer",
                      errors["documentUploads.synopsisFileName"]
                        ? "border-rose-600 bg-rose-50"
                        : "border-black bg-neutral-50 hover:bg-neo-bg"
                    )}
                  >
                    {isUploadingSynopsis ? (
                      <div className="space-y-2 py-2">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-black" />
                        <p className="font-mono text-xs font-black uppercase text-black">
                          Uploading Synopsis Deck to Google Drive...
                        </p>
                      </div>
                    ) : formData.documentUploads.synopsisFileName ? (
                      <div className="space-y-2">
                        <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>ATTACHED: {formData.documentUploads.synopsisFileName}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono">
                          <span className="text-black/60">{formData.documentUploads.synopsisFileSize}</span>
                          {formData.documentUploads.synopsisDriveUrl && (
                            <a
                              href={formData.documentUploads.synopsisDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-800 font-bold hover:bg-blue-200"
                            >
                              <HardDrive className="w-3 h-3" />
                              <span>View in Google Drive</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <span className="text-black/60 underline">• Click to replace file</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FileCheck className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                        <p className="font-black text-sm uppercase text-black">
                          ATTACH PROJECT SYNOPSIS / IDEA BRIEF (PDF / DOCX)
                        </p>
                        <p className="font-mono text-xs text-black/60">
                          Team proposal synopsis for jury review (Max 20MB) • Uploads to Google Drive
                        </p>
                      </div>
                    )}
                  </div>
                  {errors["documentUploads.synopsisFileName"] && (
                    <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors["documentUploads.synopsisFileName"]}
                    </p>
                  )}
                </div>

                {/* Final Guidelines Acceptance Box */}
                <div className="p-5 border-4 border-black bg-neo-secondary/30 shadow-neo space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agree-checkbox-final"
                      checked={formData.agreeToGuidelines}
                      onChange={(e) => {
                        setFormData({ ...formData, agreeToGuidelines: e.target.checked });
                        if (errors.agreeToGuidelines) {
                          setErrors((prev) => ({ ...prev, agreeToGuidelines: "" }));
                        }
                      }}
                      className="w-6 h-6 border-3 border-black accent-black rounded-none cursor-pointer shrink-0 mt-0.5"
                    />
                    <label
                      htmlFor="agree-checkbox-final"
                      className="text-xs sm:text-sm font-bold text-black cursor-pointer leading-snug"
                    >
                      I verify that all submitted squad credentials and institutional details are accurate. Our team agrees to adhere strictly to the{" "}
                      <span className="font-black underline">HACKVERSE &apos;26 Code of Conduct</span>, intellectual property rules, and tournament regulations.
                    </label>
                  </div>

                  {errors.agreeToGuidelines && (
                    <p className="text-xs font-black text-red-600 flex items-center gap-1">
                      <span>⚠</span> {errors.agreeToGuidelines}
                    </p>
                  )}
                </div>

                {/* Final Navigation & Submit Buttons */}
                <div className="pt-4 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-6 h-14 bg-white text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-100 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                    <span>PREVIOUS STEP</span>
                  </button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[280px] h-14 bg-neo-accent text-black font-black text-base"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>PROCESSING SQUAD ENTRY...</span>
                      </span>
                    ) : (
                      <span>CONFIRM &amp; GENERATE PASS</span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
