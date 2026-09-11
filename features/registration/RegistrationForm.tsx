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
  Edit3,
  Eye,
  X,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

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
      paymentProofFileName: "",
      paymentProofFileSize: "",
      paymentProofDriveUrl: "",
      authorizationLetterFileName: "",
      authorizationLetterFileSize: "",
      authorizationLetterDriveUrl: "",
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

  // Form Draft Caching & Auto-Resume System
  const DRAFT_STORAGE_KEY = "hackverse26_registration_draft";
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const [draftRestoredTime, setDraftRestoredTime] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // 1. Restore draft on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.formData) {
          setFormData((prev) => ({
            ...prev,
            ...parsed.formData,
            members:
              Array.isArray(parsed.formData.members) && parsed.formData.members.length > 0
                ? parsed.formData.members
                : prev.members,
          }));
          if (typeof parsed.currentStep === "number" && parsed.currentStep >= 1 && parsed.currentStep <= 4) {
            setCurrentStep(parsed.currentStep);
          }
          setHasRestoredDraft(true);
          if (parsed.savedAt) {
            const date = new Date(parsed.savedAt);
            setDraftRestoredTime(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to load registration draft:", err);
    }
  }, []);

  // 2. Auto-save draft on form changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (submissionResult) return;

    try {
      const draftPayload = {
        formData,
        currentStep,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
    } catch (err) {
      console.error("Failed to save registration draft:", err);
    }
  }, [formData, currentStep, submissionResult]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setFormData(initialFormState);
      setCurrentStep(1);
      setHasRestoredDraft(false);
      setDraftRestoredTime(null);
      setErrors({});
    } catch (err) {
      console.error("Failed to clear draft:", err);
    }
  };

  // Registered Squad State (For Leader OR any registered Member)
  const [existingTeamData, setExistingTeamData] = useState<any>(null);
  const [userRoleInTeam, setUserRoleInTeam] = useState<"LEADER" | "MEMBER">("LEADER");
  const [isCheckingExistingTeam, setIsCheckingExistingTeam] = useState<boolean>(true);
  const [forceNewRegistration, setForceNewRegistration] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(null);

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

  const checkMyTeam = async () => {
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
  };

  // Fetch registered team data for logged-in user (as Leader OR Member)
  useEffect(() => {
    if (!isAuthPending) {
      checkMyTeam();
    }
  }, [session, isAuthPending]);

  // Start Editing Registered Squad Form (Max 3 Edits Allowed)
  const handleStartEditRegistration = () => {
    if (!existingTeamData) return;
    const currentEdits =
      typeof existingTeamData.editCount === "number"
        ? existingTeamData.editCount
        : typeof existingTeamData.documents?.editCount === "number"
        ? existingTeamData.documents.editCount
        : 0;

    const MAX_EDITS = 3;
    if (currentEdits >= MAX_EDITS) {
      alert("Edit limit reached (3/3 edits used). You cannot edit your registration form anymore.");
      return;
    }

    const leader = existingTeamData.leader || {};
    const docs = existingTeamData.documents || {};
    const addr = existingTeamData.collegeAddress || {
      fullAddress: "",
      city: "",
      state: "Odisha",
      pincode: "",
    };

    setFormData({
      teamName: existingTeamData.teamName || "",
      collegeName: existingTeamData.collegeName || "",
      collegeAddress: {
        fullAddress: addr.fullAddress || "",
        city: addr.city || "",
        state: addr.state || "Odisha",
        pincode: addr.pincode || "",
      },
      teamLeader: {
        fullName: leader.name || existingTeamData.leaderName || "",
        email: leader.email || existingTeamData.leaderEmail || "",
        phone: leader.phone || existingTeamData.leaderPhone || "",
        whatsappNumber: leader.whatsapp || existingTeamData.leaderWhatsapp || "",
        sameAsPhone: true,
        dateOfBirth: leader.dob || existingTeamData.leaderDob || "",
        branch: leader.branch || existingTeamData.leaderBranch || "Computer Science & Engineering",
        customBranch: leader.customBranch || existingTeamData.leaderCustomBranch || "",
        yearOfStudy: leader.year || existingTeamData.leaderYear || "3rd Year",
        role: leader.role || existingTeamData.leaderRole || "Leader",
        githubUsername: leader.github || existingTeamData.leaderGithub || "",
      },
      members:
        Array.isArray(existingTeamData.members) && existingTeamData.members.length > 0
          ? existingTeamData.members
          : initialFormState.members,
      paymentDetails: {
        paymentMode: existingTeamData.paymentMode || "FREE_SPONSORED",
        transactionId: existingTeamData.transactionId || "",
        status: existingTeamData.paymentStatus || "FREE_TIER",
      },
      documentUploads: {
        paymentProofFileName: docs.paymentProofFileName || docs.collegeIdFileName || "",
        paymentProofFileSize: docs.paymentProofFileSize || docs.collegeIdFileSize || "",
        paymentProofDriveUrl: docs.paymentProofDriveUrl || docs.collegeIdDriveUrl || "",
        paymentProofDriveFileId: docs.paymentProofDriveFileId || docs.collegeIdDriveFileId || "",
        authorizationLetterFileName: docs.authorizationLetterFileName || docs.synopsisFileName || "",
        authorizationLetterFileSize: docs.authorizationLetterFileSize || docs.synopsisFileSize || "",
        authorizationLetterDriveUrl: docs.authorizationLetterDriveUrl || docs.synopsisDriveUrl || "",
        authorizationLetterDriveFileId: docs.authorizationLetterDriveFileId || docs.synopsisDriveFileId || "",
        collegeIdFileName: docs.collegeIdFileName || docs.paymentProofFileName || "",
        collegeIdFileSize: docs.collegeIdFileSize || docs.paymentProofFileSize || "",
        collegeIdDriveUrl: docs.collegeIdDriveUrl || docs.paymentProofDriveUrl || "",
        synopsisFileName: docs.synopsisFileName || docs.authorizationLetterFileName || "",
        synopsisFileSize: docs.synopsisFileSize || docs.authorizationLetterFileSize || "",
        synopsisDriveUrl: docs.synopsisDriveUrl || docs.authorizationLetterDriveUrl || "",
        githubRepoUrl: docs.githubRepoUrl || "",
      },
      agreeToGuidelines: true,
      selectedProblemStatementId:
        existingTeamData.problemStatementId || existingTeamData.selectedProblemStatements?.[0] || "",
    });

    setCurrentStep(1);
    setErrors({});
    setIsEditMode(true);
    setEditSuccessMessage(null);
  };

  const handleCancelEditRegistration = () => {
    setIsEditMode(false);
    setErrors({});
  };

  // Local File instances for zero-lag client holding & smooth submit-time Drive upload
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [authLetterFile, setAuthLetterFile] = useState<File | null>(null);

  // File preview dialog state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    type: "image" | "pdf" | "other";
  } | null>(null);

  // File inputs ref
  const paymentProofInputRef = useRef<HTMLInputElement>(null);
  const authLetterInputRef = useRef<HTMLInputElement>(null);
  const collegeIdInputRef = paymentProofInputRef;
  const synopsisInputRef = authLetterInputRef;
  const [isUploadingCollegeId] = useState(false);
  const [isUploadingSynopsis] = useState(false);

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

  // Step 4: Instant Local File Handlers (Keeps file locally in browser, zero blocking)
  const handlePaymentProofFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setPaymentProofFile(file);
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        paymentProofFileName: file.name,
        paymentProofFileSize: sizeStr,
        collegeIdFileName: file.name,
        collegeIdFileSize: sizeStr,
      },
    }));

    if (errors["documentUploads.paymentProofFileName"] || errors["documentUploads.collegeIdFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.paymentProofFileName"];
        delete next["documentUploads.collegeIdFileName"];
        return next;
      });
    }
  };

  const handleAuthLetterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setAuthLetterFile(file);
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        authorizationLetterFileName: file.name,
        authorizationLetterFileSize: sizeStr,
        synopsisFileName: file.name,
        synopsisFileSize: sizeStr,
      },
    }));

    if (errors["documentUploads.authorizationLetterFileName"] || errors["documentUploads.synopsisFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.authorizationLetterFileName"];
        delete next["documentUploads.synopsisFileName"];
        return next;
      });
    }
  };

  const handleCollegeIdFile = handlePaymentProofFile;
  const handleSynopsisFile = handleAuthLetterFile;

  // Delete Handlers
  const handleDeletePaymentProof = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPaymentProofFile(null);
    if (paymentProofInputRef.current) {
      paymentProofInputRef.current.value = "";
    }
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        paymentProofFileName: "",
        paymentProofFileSize: "",
        paymentProofDriveUrl: "",
        paymentProofDriveFileId: "",
        collegeIdFileName: "",
        collegeIdFileSize: "",
        collegeIdDriveUrl: "",
        collegeIdDriveFileId: "",
      },
    }));
  };

  const handleDeleteAuthLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAuthLetterFile(null);
    if (authLetterInputRef.current) {
      authLetterInputRef.current.value = "";
    }
    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        authorizationLetterFileName: "",
        authorizationLetterFileSize: "",
        authorizationLetterDriveUrl: "",
        authorizationLetterDriveFileId: "",
        synopsisFileName: "",
        synopsisFileSize: "",
        synopsisDriveUrl: "",
        synopsisDriveFileId: "",
      },
    }));
  };

  // Helper to get embeddable preview URL (Google Drive /preview player)
  const toEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return rawUrl;
    if (rawUrl.includes("drive.google.com/file/d/")) {
      const match = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return rawUrl;
  };

  // Preview Handlers (Opens File in Dialog)
  const handlePreviewPaymentProof = (e: React.MouseEvent) => {
    e.stopPropagation();
    let url = "";
    let type: "image" | "pdf" | "other" = "other";

    if (paymentProofFile) {
      url = URL.createObjectURL(paymentProofFile);
      if (paymentProofFile.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(paymentProofFile.name)) {
        type = "image";
      } else if (paymentProofFile.type === "application/pdf" || /\.pdf$/i.test(paymentProofFile.name)) {
        type = "pdf";
      }
    } else if (formData.documentUploads?.paymentProofDriveUrl || formData.documentUploads?.collegeIdDriveUrl) {
      const rawUrl = formData.documentUploads?.paymentProofDriveUrl || formData.documentUploads?.collegeIdDriveUrl || "";
      url = toEmbedUrl(rawUrl);
      const name = formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName || "";
      if (rawUrl.includes("drive.google.com")) {
        type = "pdf"; // Google Drive /preview is universal iframe player
      } else if (/\.(png|jpe?g|webp|gif)$/i.test(name)) {
        type = "image";
      } else {
        type = "pdf";
      }
    }

    if (url) {
      setPreviewModal({
        isOpen: true,
        title: formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName || "Payment Proof",
        url,
        type,
      });
    }
  };

  const handlePreviewAuthLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    let url = "";
    let type: "image" | "pdf" | "other" = "other";

    if (authLetterFile) {
      url = URL.createObjectURL(authLetterFile);
      if (authLetterFile.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(authLetterFile.name)) {
        type = "image";
      } else if (authLetterFile.type === "application/pdf" || /\.pdf$/i.test(authLetterFile.name)) {
        type = "pdf";
      }
    } else if (formData.documentUploads?.authorizationLetterDriveUrl || formData.documentUploads?.synopsisDriveUrl) {
      const rawUrl = formData.documentUploads?.authorizationLetterDriveUrl || formData.documentUploads?.synopsisDriveUrl || "";
      url = toEmbedUrl(rawUrl);
      const name = formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName || "";
      if (rawUrl.includes("drive.google.com")) {
        type = "pdf"; // Google Drive /preview is universal iframe player
      } else if (/\.(png|jpe?g|webp|gif)$/i.test(name)) {
        type = "image";
      } else {
        type = "pdf";
      }
    }

    if (url) {
      setPreviewModal({
        isOpen: true,
        title: formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName || "Institutional Authorization Letter",
        url,
        type,
      });
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

  // Final Form Submission (Uploads held files to Google Drive in backend smoothly upon confirmation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalErrors = validateStep4(formData);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Smooth background Drive upload for any locally attached files
    const updatedDocumentUploads = { ...formData.documentUploads };

    try {
      const uploadTasks: Promise<any>[] = [];

      // 1. Upload payment proof to Drive if local file was chosen
      if (paymentProofFile && !updatedDocumentUploads.paymentProofDriveUrl) {
        const pData = new FormData();
        pData.append("file", paymentProofFile);
        pData.append("teamName", formData.teamName || "Squad");
        pData.append("category", "payment_proof");

        uploadTasks.push(
          fetch("/api/upload/drive", { method: "POST", body: pData })
            .then((r) => r.json())
            .then((res) => {
              if (res.success && res.data) {
                updatedDocumentUploads.paymentProofDriveUrl = res.data.webViewLink;
                updatedDocumentUploads.paymentProofDriveFileId = res.data.fileId;
                updatedDocumentUploads.collegeIdDriveUrl = res.data.webViewLink;
                updatedDocumentUploads.collegeIdDriveFileId = res.data.fileId;
              }
            })
            .catch((err) => console.warn("Payment proof Drive upload notice:", err))
        );
      }

      // 2. Upload authorization letter to Drive if local file was chosen
      if (authLetterFile && !updatedDocumentUploads.authorizationLetterDriveUrl) {
        const aData = new FormData();
        aData.append("file", authLetterFile);
        aData.append("teamName", formData.teamName || "Squad");
        aData.append("category", "authorization_letter");

        uploadTasks.push(
          fetch("/api/upload/drive", { method: "POST", body: aData })
            .then((r) => r.json())
            .then((res) => {
              if (res.success && res.data) {
                updatedDocumentUploads.authorizationLetterDriveUrl = res.data.webViewLink;
                updatedDocumentUploads.authorizationLetterDriveFileId = res.data.fileId;
                updatedDocumentUploads.synopsisDriveUrl = res.data.webViewLink;
                updatedDocumentUploads.synopsisDriveFileId = res.data.fileId;
              }
            })
            .catch((err) => console.warn("Authorization letter Drive upload notice:", err))
        );
      }

      if (uploadTasks.length > 0) {
        await Promise.allSettled(uploadTasks);
      }
    } catch (uploadErr) {
      console.warn("Background upload completed with notice:", uploadErr);
    }

    const payloadToSubmit: RegistrationFormData = {
      ...formData,
      documentUploads: updatedDocumentUploads,
    };

    if (isEditMode) {
      try {
        const result = await registrationService.updateRegistration(payloadToSubmit);
        if (result.success) {
          try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
          } catch {}
          setHasRestoredDraft(false);
          setIsEditMode(false);
          setEditSuccessMessage(
            result.message || "Registration details successfully updated!"
          );
          await checkMyTeam();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          if (result.errors) {
            setErrors(result.errors);
          } else {
            setErrors({ form: result.message || "Failed to update registration." });
          }
        }
      } catch {
        setErrors({ form: "Unexpected error while saving edits. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const result = await registrationService.submitRegistration(payloadToSubmit);
      if (result.success) {
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {}
        setSubmissionResult(result);
        setHasRestoredDraft(false);
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
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors({});
    setSubmissionResult(null);
    setHasRestoredDraft(false);
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

      {/* When Squad is ALREADY Registered (Leader or Team Member logged in) and NOT in Edit Mode */}
      {isAuthenticated && !isCheckingExistingTeam && existingTeamData && !forceNewRegistration && !isEditMode && (
        <div className="space-y-6">
          {editSuccessMessage && (
            <div className="p-4 bg-emerald-100 border-4 border-black shadow-neo flex items-center justify-between gap-3 text-xs sm:text-sm font-black uppercase text-emerald-950 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 stroke-[3px] shrink-0" />
                <span>{editSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditSuccessMessage(null)}
                className="px-3 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-mono text-[10px] uppercase shadow-neo-xs cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          )}

          <RegisteredSquadDashboard
            teamData={existingTeamData}
            userRoleInTeam={userRoleInTeam}
            currentUser={session?.user || {}}
            onRegisterNewTeam={() => setForceNewRegistration(true)}
            onEditRegistration={handleStartEditRegistration}
          />
        </div>
      )}

      {/* When Registrations are CLOSED and user has no registered squad and is not in edit mode */}
      {isAuthenticated && !isCheckingExistingTeam && (!existingTeamData || forceNewRegistration) && !isEditMode && paymentSettings && paymentSettings.isRegistrationOpen === false && (
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

      {/* When user IS authenticated AND (has no team OR clicked to register another squad OR is in edit mode) */}
      {isAuthenticated && !isCheckingExistingTeam && (!existingTeamData || forceNewRegistration || isEditMode) && (paymentSettings?.isRegistrationOpen !== false || isEditMode) && (
        <div className="space-y-8">
          {/* Edit Mode Top Alert Banner with remaining edits indicator */}
          {isEditMode && existingTeamData && (
            <div className="border-4 border-black bg-amber-200 p-5 sm:p-6 shadow-neo-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in-50 duration-200">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border border-black shadow-neo-xs flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT MODE ACTIVE</span>
                  </span>
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-neo-secondary text-black border border-black shadow-neo-xs">
                    EDIT ATTEMPT #{(existingTeamData.editCount ?? 0) + 1} OF 3
                  </span>
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-white text-black border border-black shadow-neo-xs">
                    {Math.max(0, 3 - (existingTeamData.editCount ?? 0))} EDITS REMAINING
                  </span>
                </div>
                <h3 className="font-black text-xl sm:text-2xl uppercase text-black tracking-tight">
                  EDITING SQUAD ENTRY: {existingTeamData.teamName} ({existingTeamData.registrationNumber})
                </h3>
                <p className="font-mono text-xs font-bold text-black/80 max-w-2xl leading-relaxed">
                  You can revise any information across all 4 steps (Squad Info, Leader details, Co-Hackers, Project Synopsis, and Problem Statement choices). Saving updates consumes 1 of your 3 allowed edits.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelEditRegistration}
                className="px-5 py-2.5 bg-white hover:bg-black hover:text-white text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none transition-all cursor-pointer shrink-0"
              >
                &larr; CANCEL &amp; RETURN
              </button>
            </div>
          )}

          {/* Switch back banner if user was previously registered and chose to register another squad */}
          {existingTeamData && forceNewRegistration && !isEditMode && (
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

          {/* Draft Auto-Restore Notification Banner */}
          {hasRestoredDraft && (
            <div className="p-3.5 bg-amber-100 border-4 border-black shadow-neo flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-black uppercase">
              <div className="flex items-center gap-2.5 text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-700 stroke-[2.5px] shrink-0" />
                <span>
                  AUTO-SAVED DRAFT RESTORED {draftRestoredTime ? `(${draftRestoredTime})` : ""} • RESUMED FROM WHERE YOU LEFT OFF (STEP 0{currentStep})
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearDraft}
                className="px-3 py-1 bg-white hover:bg-rose-500 hover:text-white border-2 border-black font-mono text-[10px] uppercase shadow-neo-xs transition-colors cursor-pointer shrink-0"
                title="Discard saved progress and start fresh"
              >
                CLEAR DRAFT &amp; RESTART
              </button>
            </div>
          )}

          {/* Multi-Step Progress Header Stepper */}
          <div className="border-4 border-black bg-white p-4 sm:p-6 shadow-neo">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {stepsList.map((st) => {
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
                  {(() => {
                    const rawFee = Number(paymentSettings.registrationFee) || 0;
                    const isPaidTier = rawFee > 0;
                    const feeAmount = isPaidTier ? rawFee.toFixed(2) : "";
                    const payeeName = paymentSettings.payeeName || "HACKVERSE 2026 GCEK";
                    const upiId = paymentSettings.upiId || "codebreakers@upi";
                    const teamRef = formData.teamName
                      ? formData.teamName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)
                      : "Squad";
                    const transactionNote = `HackVerse26-${teamRef}`;

                    // Standard NPCI UPI URI with mode=02 & exact fixed amount to prevent amount editing in UPI apps
                    const upiQrUri = isPaidTier
                      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${feeAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&mode=02&orgid=000000`
                      : `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

                    return (
                      <div className="p-6 border-4 border-black bg-neo-bg shadow-neo space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          {/* Dynamic Native Vector UPI QR Code */}
                          <div className="p-3 bg-white border-3 border-black shadow-neo-sm shrink-0 flex flex-col items-center">
                            <div className="p-2 bg-white border-2 border-black flex items-center justify-center">
                              <QRCodeSVG
                                value={upiQrUri}
                                size={176}
                                level="H"
                                includeMargin={false}
                              />
                            </div>
                            <div className="mt-2.5 flex flex-col items-center gap-1 text-center">
                              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1">
                                <QrCode className="w-3.5 h-3.5" />
                                <span>SCAN VIA ANY UPI APP</span>
                              </span>
                              {isPaidTier && (
                                <span className="font-mono text-[9px] font-black px-2 py-0.5 bg-emerald-300 text-black border border-black inline-block shadow-neo-xs">
                                  🔒 FIXED AMOUNT: ₹{rawFee} (LOCKED)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Payee and UPI Details */}
                          <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <span className="font-mono text-xs font-black uppercase text-black/60">
                                  PAYEE / BENEFICIARY:
                                </span>
                                <h4 className="font-black text-lg uppercase text-black">
                                  {payeeName}
                                </h4>
                              </div>
                              {isPaidTier && (
                                <div className="px-3 py-1 bg-neo-secondary border-2 border-black font-mono text-xs font-black text-black shadow-neo-xs">
                                  EXACT PASS FEE: ₹{rawFee}
                                </div>
                              )}
                            </div>

                            {/* UPI ID Copy Box */}
                            <div className="p-3.5 bg-white border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="font-mono text-[10px] font-bold text-black/60 uppercase block">
                                  OFFICIAL ADMIN UPI ID:
                                </span>
                                <span className="font-mono text-sm font-black text-black select-all">
                                  {upiId}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(upiId);
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2500);
                                }}
                                className="px-3 py-1.5 bg-neo-secondary text-black font-black text-xs uppercase border-2 border-black shadow-neo-sm hover:shadow-none flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                              >
                                <span>{copiedUpi ? "COPIED TO CLIPBOARD!" : "COPY UPI ID"}</span>
                              </button>
                            </div>

                            <p className="font-sans text-xs font-bold text-black/75">
                              Scan the QR Code using <strong>Google Pay, PhonePe, Paytm, BHIM, or any UPI App</strong>. The amount is automatically locked to <strong>₹{rawFee}</strong>. After successful transfer, copy the <strong>12-digit UTR / Reference Number</strong> from your payment receipt and paste it below.
                            </p>

                            {/* Mobile Deep Link Button */}
                            {isPaidTier && (
                              <div className="pt-1 sm:hidden">
                                <a
                                  href={upiQrUri}
                                  className="w-full py-2.5 px-4 bg-neo-accent hover:bg-neo-secondary text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                  <span>PAY ₹{rawFee} VIA UPI APP DIRECTLY</span>
                                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5px]" />
                                </a>
                              </div>
                            )}
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
                    );
                  })()}

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
            {/* STEP 4: MANDATORY DOCUMENT UPLOADS & FINAL PASS CONFIRMATION               */}
            {/* ========================================================================= */}
            {currentStep === 4 && (
              <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-neo space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b-4 border-black pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
                      04
                    </span>
                    <h3 className="font-black text-xl text-black uppercase tracking-tight">
                      MANDATORY DOCUMENT UPLOADS &amp; FINAL CONFIRMATION
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold bg-rose-500 text-white px-2 py-1 border-2 border-black uppercase hidden sm:inline">
                    ★ UPLOADS MANDATORY
                  </span>
                </div>

                {/* Mandatory Notice Callout */}
                <div className="p-4 bg-amber-100 border-3 border-black text-xs font-bold text-amber-950 space-y-1">
                  <div className="flex items-center gap-2 font-black uppercase text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-800 stroke-[3px] shrink-0" />
                    <span>MANDATORY VERIFICATION DOCUMENTS REQUIRED</span>
                  </div>
                  <p className="leading-relaxed">
                    Both <strong>(1) Payment Proof / Transaction Screenshot</strong> and <strong>(2) Institutional Authorization Letter &amp; NOC / Bonafide</strong> are strictly mandatory to generate your official tournament pass and seat allocation. Selected files are held locally and uploaded securely to Google Drive upon final confirmation.
                  </p>
                </div>

                {/* Document Upload 1: Payment Proof / Transaction Screenshot (MANDATORY) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-black" />
                      <span>1. PAYMENT PROOF / TRANSACTION SCREENSHOT (PDF / PNG / JPG)</span>
                    </label>
                    <span
                      className={clsx(
                        "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-neo-xs",
                        formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName
                          ? "bg-emerald-300 text-black"
                          : "bg-rose-500 text-white animate-pulse"
                      )}
                    >
                      {formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName
                        ? "✔ ATTACHED"
                        : "MANDATORY *"}
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={paymentProofInputRef}
                    onChange={handlePaymentProofFile}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  <div
                    onClick={() => paymentProofInputRef.current?.click()}
                    className={clsx(
                      "p-6 border-3 transition-all text-center space-y-2 cursor-pointer",
                      errors["documentUploads.paymentProofFileName"] || errors["documentUploads.collegeIdFileName"]
                        ? "border-rose-600 bg-rose-100 border-dashed ring-2 ring-rose-600"
                        : (formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName)
                        ? "border-emerald-700 bg-emerald-50 border-solid"
                        : "border-black border-dashed bg-neutral-50 hover:bg-neo-bg"
                    )}
                  >
                    {formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName ? (
                      <div className="space-y-3">
                        <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            ATTACHED: {formData.documentUploads?.paymentProofFileName || formData.documentUploads?.collegeIdFileName}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                          <span className="text-black/60 font-bold">
                            {formData.documentUploads?.paymentProofFileSize || formData.documentUploads?.collegeIdFileSize}
                          </span>
                          <button
                            type="button"
                            onClick={handlePreviewPaymentProof}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-neo-accent text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs hover:bg-black hover:text-white transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>VIEW FILE</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeletePaymentProof}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 border-2 border-rose-700 font-black uppercase text-[11px] shadow-neo-xs hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>DELETE</span>
                          </button>
                          <span className="text-black/60 text-[10px] underline ml-1">• Click area to replace</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <UploadCloud className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                        <p className="font-black text-sm uppercase text-black">
                          CLICK OR DRAG &amp; DROP PAYMENT PROOF <span className="text-rose-600 font-black">*</span>
                        </p>
                        <p className="font-mono text-xs text-black/60">
                          UPI transfer screenshot or payment receipt (Max 15MB) • Uploads automatically upon confirmation
                        </p>
                      </div>
                    )}
                  </div>
                  {(errors["documentUploads.paymentProofFileName"] || errors["documentUploads.collegeIdFileName"]) && (
                    <p className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-400 p-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 stroke-[2.5px] shrink-0" />
                      <span>{errors["documentUploads.paymentProofFileName"] || errors["documentUploads.collegeIdFileName"]}</span>
                    </p>
                  )}
                </div>

                {/* Document Upload 2: Institutional Authorization Letter & NOC (MANDATORY) */}
                <div className="space-y-2 pt-3 border-t-2 border-black/15">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-black" />
                      <span>2. INSTITUTIONAL AUTHORIZATION LETTER &amp; NOC / BONAFIDE (PDF / DOCX / JPG)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <a
                        href="/documents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-blue-700 underline uppercase hover:text-blue-900"
                      >
                        <span>Download Format</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span
                        className={clsx(
                          "font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-neo-xs",
                          formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName
                            ? "bg-emerald-300 text-black"
                            : "bg-rose-500 text-white animate-pulse"
                        )}
                      >
                        {formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName
                          ? "✔ ATTACHED"
                          : "MANDATORY *"}
                      </span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={authLetterInputRef}
                    onChange={handleAuthLetterFile}
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  <div
                    onClick={() => authLetterInputRef.current?.click()}
                    className={clsx(
                      "p-6 border-3 transition-all text-center space-y-2 cursor-pointer",
                      errors["documentUploads.authorizationLetterFileName"] || errors["documentUploads.synopsisFileName"]
                        ? "border-rose-600 bg-rose-100 border-dashed ring-2 ring-rose-600"
                        : (formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName)
                        ? "border-emerald-700 bg-emerald-50 border-solid"
                        : "border-black border-dashed bg-neutral-50 hover:bg-neo-bg"
                    )}
                  >
                    {formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName ? (
                      <div className="space-y-3">
                        <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            ATTACHED: {formData.documentUploads?.authorizationLetterFileName || formData.documentUploads?.synopsisFileName}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                          <span className="text-black/60 font-bold">
                            {formData.documentUploads?.authorizationLetterFileSize || formData.documentUploads?.synopsisFileSize}
                          </span>
                          <button
                            type="button"
                            onClick={handlePreviewAuthLetter}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-neo-accent text-black border-2 border-black font-black uppercase text-[11px] shadow-neo-xs hover:bg-black hover:text-white transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>VIEW FILE</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteAuthLetter}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 border-2 border-rose-700 font-black uppercase text-[11px] shadow-neo-xs hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                            <span>DELETE</span>
                          </button>
                          <span className="text-black/60 text-[10px] underline ml-1">• Click area to replace</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FileCheck className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                        <p className="font-black text-sm uppercase text-black">
                          CLICK OR DRAG &amp; DROP AUTHORIZATION LETTER &amp; NOC <span className="text-rose-600 font-black">*</span>
                        </p>
                        <p className="font-mono text-xs text-black/60">
                          Signed college NOC / Bonafide authorization (Max 20MB) • Uploads automatically upon confirmation
                        </p>
                      </div>
                    )}
                  </div>
                  {(errors["documentUploads.authorizationLetterFileName"] || errors["documentUploads.synopsisFileName"]) && (
                    <p className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-400 p-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 stroke-[2.5px] shrink-0" />
                      <span>{errors["documentUploads.authorizationLetterFileName"] || errors["documentUploads.synopsisFileName"]}</span>
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
                        <span>{isEditMode ? "SAVING SQUAD UPDATES..." : "PROCESSING SQUAD ENTRY..."}</span>
                      </span>
                    ) : isEditMode ? (
                      <span>SAVE CHANGES (USES 1 EDIT)</span>
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

      {/* Document Preview Modal Dialog */}
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
