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
  saveDocToCache,
  getDocFromCache,
  removeDocFromCache,
  clearAllDocCache,
} from "@/lib/clientDocCache";
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
  Eye,
  X,
  Home,
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
  {
    value: "Computer Science & Engineering",
    label: "Computer Science & Engineering (CSE)",
  },
  { value: "Information Technology", label: "Information Technology (IT)" },
  { value: "Electrical Engineering", label: "Electrical Engineering (EE)" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering (ME)" },
  { value: "Civil Engineering", label: "Civil Engineering (CE)" },
  {
    value: "Electronics & Telecommunication",
    label: "Electronics & Telecomm (ETC)",
  },
  {
    value: "Artificial Intelligence & Data Science",
    label: "AI & Data Science (AI/DS)",
  },
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

const LEADER_ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "Leader", label: "Leader / Squad Captain" },
  { value: "Full Stack", label: "Leader & Full Stack Engineer" },
  { value: "Frontend", label: "Leader & Frontend Engineer" },
  { value: "Backend", label: "Leader & Backend Engineer" },
  { value: "AI/ML", label: "Leader & AI/ML Specialist" },
  { value: "Designer", label: "Leader & UI/UX Designer" },
  { value: "Hardware/IoT", label: "Leader & Hardware/IoT Engineer" },
];

const MEMBER_ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "Frontend", label: "Frontend Engineer" },
  { value: "Backend", label: "Backend / Systems Engineer" },
  { value: "AI/ML", label: "AI / ML Specialist" },
  { value: "Full Stack", label: "Full Stack Generalist" },
  { value: "Designer", label: "UI / UX Designer" },
  { value: "Hardware/IoT", label: "Hardware / IoT Engineer" },
];

// Persistent Browser Cache Keys
const REG_DRAFT_KEY = "hackverse_reg_draft_v1";
const REG_STEP_KEY = "hackverse_reg_step_v1";
const REG_AUTH_DOC_KEY = "hackverse_reg_auth_doc_v1";
const REG_PAYMENT_DOC_KEY = "hackverse_reg_payment_doc_v1";

interface CachedDocPayload {
  name: string;
  type: string;
  sizeStr: string;
  dataUrl: string;
}

function dataURLtoFile(
  dataurl: string,
  filename: string,
  mimeType?: string,
): File {
  const arr = dataurl.split(",");
  const mime =
    mimeType || arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

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

  const [formData, setFormData] =
    useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<RegistrationSubmissionResult | null>(null);

  // Registered Squad State (For Leader OR any registered Member)
  const [existingTeamData, setExistingTeamData] = useState<any>(null);
  const [userRoleInTeam, setUserRoleInTeam] = useState<"LEADER" | "MEMBER">(
    "LEADER",
  );
  const [isCheckingExistingTeam, setIsCheckingExistingTeam] =
    useState<boolean>(true);
  const [forceNewRegistration, setForceNewRegistration] =
    useState<boolean>(false);

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

  // File inputs ref & cached files state (stored locally in browser cache until registration confirmation)
  const collegeIdInputRef = useRef<HTMLInputElement>(null);
  const synopsisInputRef = useRef<HTMLInputElement>(null);
  const [authLetterFile, setAuthLetterFile] = useState<File | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [authLetterPreviewUrl, setAuthLetterPreviewUrl] = useState<
    string | null
  >(null);
  const [paymentProofPreviewUrl, setPaymentProofPreviewUrl] = useState<
    string | null
  >(null);
  const [submitProgressText, setSubmitProgressText] = useState<string>("");
  const [previewDocModal, setPreviewDocModal] = useState<{
    title: string;
    fileName: string;
    url: string;
    fileType?: string;
  } | null>(null);

  const isDraftHydratedRef = useRef<boolean>(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState<boolean>(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);

  // 1. Initial Load: Restore cached registration step and draft from browser storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Restore step
      const savedStep = localStorage.getItem(REG_STEP_KEY);
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep >= 1 && parsedStep <= 4) {
          setCurrentStep(parsedStep);
        }
      }

      // Restore form data
      const savedDraft = localStorage.getItem(REG_DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object") {
            setFormData((prev) => ({
              ...prev,
              ...parsed,
              teamLeader: {
                ...prev.teamLeader,
                ...(parsed.teamLeader || {}),
              },
              collegeAddress: {
                ...prev.collegeAddress,
                ...(parsed.collegeAddress || {}),
              },
              paymentDetails: {
                ...prev.paymentDetails,
                ...(parsed.paymentDetails || {}),
              },
              documentUploads: {
                ...prev.documentUploads,
                ...(parsed.documentUploads || {}),
              },
              members:
                Array.isArray(parsed.members) && parsed.members.length > 0
                  ? parsed.members
                  : prev.members,
              selectedProblemStatementId:
                preselectedPsId ||
                parsed.selectedProblemStatementId ||
                prev.selectedProblemStatementId ||
                "",
            }));
            setHasRestoredDraft(true);
          }
        } catch (e) {
          console.error("Failed to parse cached registration draft:", e);
        }
      }

      // Restore cached Authorization Letter file from IndexedDB (or fallback to localStorage)
      (async () => {
        try {
          const cached = await getDocFromCache(REG_AUTH_DOC_KEY);
          if (cached?.file) {
            const previewUrl = URL.createObjectURL(cached.file);
            setAuthLetterFile(cached.file);
            setAuthLetterPreviewUrl(previewUrl);
            return;
          }
        } catch (e) {
          console.warn("IndexedDB auth letter restore error:", e);
        }

        const savedAuthDoc = localStorage.getItem(REG_AUTH_DOC_KEY);
        if (savedAuthDoc) {
          try {
            const parsedDoc: CachedDocPayload = JSON.parse(savedAuthDoc);
            if (parsedDoc?.dataUrl && parsedDoc.name) {
              const reconstructed = dataURLtoFile(
                parsedDoc.dataUrl,
                parsedDoc.name,
                parsedDoc.type,
              );
              const previewUrl = URL.createObjectURL(reconstructed);
              setAuthLetterFile(reconstructed);
              setAuthLetterPreviewUrl(previewUrl);
            }
          } catch (e) {
            console.warn("Failed to reconstruct cached auth letter:", e);
          }
        }
      })();

      // Restore cached Payment Proof file from IndexedDB (or fallback to localStorage)
      (async () => {
        try {
          const cached = await getDocFromCache(REG_PAYMENT_DOC_KEY);
          if (cached?.file) {
            const previewUrl = URL.createObjectURL(cached.file);
            setPaymentProofFile(cached.file);
            setPaymentProofPreviewUrl(previewUrl);
            return;
          }
        } catch (e) {
          console.warn("IndexedDB payment proof restore error:", e);
        }

        const savedProofDoc = localStorage.getItem(REG_PAYMENT_DOC_KEY);
        if (savedProofDoc) {
          try {
            const parsedDoc: CachedDocPayload = JSON.parse(savedProofDoc);
            if (parsedDoc?.dataUrl && parsedDoc.name) {
              const reconstructed = dataURLtoFile(
                parsedDoc.dataUrl,
                parsedDoc.name,
                parsedDoc.type,
              );
              const previewUrl = URL.createObjectURL(reconstructed);
              setPaymentProofFile(reconstructed);
              setPaymentProofPreviewUrl(previewUrl);
            }
          } catch (e) {
            console.warn("Failed to reconstruct cached payment proof:", e);
          }
        }
      })();
    } catch (err) {
      console.error("Error restoring registration cache:", err);
    } finally {
      // Delay enabling the auto-save observer so the initial state update completes first
      setTimeout(() => {
        isDraftHydratedRef.current = true;
        setIsDraftLoaded(true);
      }, 60);
    }
  }, [preselectedPsId]);

  // 2. Auto-Save: Sync registration step and draft to browser cache ONLY after initial hydration finishes
  useEffect(() => {
    if (
      !isDraftLoaded ||
      !isDraftHydratedRef.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    try {
      localStorage.setItem(REG_DRAFT_KEY, JSON.stringify(formData));
      localStorage.setItem(REG_STEP_KEY, currentStep.toString());
    } catch (err) {
      console.warn("Could not save registration draft to localStorage:", err);
    }
  }, [formData, currentStep, isDraftLoaded]);

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

  const handleUserPrefill = (user: {
    name?: string;
    email?: string;
    image?: string;
  }) => {
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
  const handleAddressChange = (
    field: keyof typeof formData.collegeAddress,
    value: string,
  ) => {
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
  const handleLeaderChange = (
    field: keyof ParticipantDetails,
    value: unknown,
  ) => {
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

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: unknown,
  ) => {
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

  // Step 4: Local File Caching Handlers (Stored in IndexedDB & browser memory until final submission)
  // Step 4: Local File Caching Handlers (Stored in IndexedDB & browser memory until final submission)
  const handleCollegeIdFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const previewUrl = URL.createObjectURL(file);

    setAuthLetterFile(file);
    setAuthLetterPreviewUrl(previewUrl);

    // Save to IndexedDB (Persistent high capacity cache)
    await saveDocToCache(REG_AUTH_DOC_KEY, file, sizeStr);

    // Fallback: Also cache base64 in localStorage if file is small (<= 2.5MB)
    if (file.size <= 2.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload: CachedDocPayload = {
            name: file.name,
            type: file.type,
            sizeStr,
            dataUrl: reader.result as string,
          };
          localStorage.setItem(REG_AUTH_DOC_KEY, JSON.stringify(payload));
        } catch (err) {
          console.warn("localStorage auth doc cache quota exceeded:", err);
        }
      };
      reader.readAsDataURL(file);
    }

    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        collegeIdFileName: file.name,
        collegeIdFileSize: sizeStr,
        collegeIdDriveUrl: "",
        collegeIdDriveFileId: "",
      },
    }));

    if (errors["documentUploads.collegeIdFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.collegeIdFileName"];
        return next;
      });
    }
  };

  const handleDeleteAuthLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAuthLetterFile(null);
    setAuthLetterPreviewUrl(null);
    if (collegeIdInputRef.current) {
      collegeIdInputRef.current.value = "";
    }
    removeDocFromCache(REG_AUTH_DOC_KEY);
    try {
      localStorage.removeItem(REG_AUTH_DOC_KEY);
    } catch {}

    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        collegeIdFileName: "",
        collegeIdFileSize: "",
        collegeIdDriveUrl: "",
        collegeIdDriveFileId: "",
      },
    }));
  };

  const handlePaymentProofFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const previewUrl = URL.createObjectURL(file);

    setPaymentProofFile(file);
    setPaymentProofPreviewUrl(previewUrl);

    // Save to IndexedDB (Persistent high capacity cache)
    await saveDocToCache(REG_PAYMENT_DOC_KEY, file, sizeStr);

    // Fallback: Also cache base64 in localStorage if file is small (<= 2.5MB)
    if (file.size <= 2.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload: CachedDocPayload = {
            name: file.name,
            type: file.type,
            sizeStr,
            dataUrl: reader.result as string,
          };
          localStorage.setItem(REG_PAYMENT_DOC_KEY, JSON.stringify(payload));
        } catch (err) {
          console.warn("localStorage payment proof cache quota exceeded:", err);
        }
      };
      reader.readAsDataURL(file);
    }

    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        synopsisFileName: file.name,
        synopsisFileSize: sizeStr,
        synopsisDriveUrl: "",
        synopsisDriveFileId: "",
      },
    }));

    if (errors["documentUploads.synopsisFileName"]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next["documentUploads.synopsisFileName"];
        return next;
      });
    }
  };

  const handleDeletePaymentProof = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPaymentProofFile(null);
    setPaymentProofPreviewUrl(null);
    if (synopsisInputRef.current) {
      synopsisInputRef.current.value = "";
    }
    removeDocFromCache(REG_PAYMENT_DOC_KEY);
    try {
      localStorage.removeItem(REG_PAYMENT_DOC_KEY);
    } catch {}

    setFormData((prev) => ({
      ...prev,
      documentUploads: {
        ...prev.documentUploads,
        synopsisFileName: "",
        synopsisFileSize: "",
        synopsisDriveUrl: "",
        synopsisDriveFileId: "",
      },
    }));
  };

  // Safe Document Preview Resolver (Always generates a fresh, active Object URL from cache/file)
  const handleOpenDocPreview = async (
    type: "AUTH_LETTER" | "PAYMENT_PROOF",
  ) => {
    if (type === "AUTH_LETTER") {
      const fileName =
        formData.documentUploads.collegeIdFileName || "Authorization Letter";

      let file = authLetterFile;
      if (!file) {
        const cached = await getDocFromCache(REG_AUTH_DOC_KEY);
        if (cached?.file) {
          file = cached.file;
          setAuthLetterFile(cached.file);
        }
      }

      let url = "";
      if (file) {
        url = URL.createObjectURL(file);
        setAuthLetterPreviewUrl(url);
      } else if (formData.documentUploads.collegeIdDriveUrl) {
        url = formData.documentUploads.collegeIdDriveUrl;
      }

      setPreviewDocModal({
        title: "AUTHORIZATION LETTER",
        fileName,
        url,
        fileType: file?.type,
      });
    } else {
      const fileName =
        formData.documentUploads.synopsisFileName || "Payment Proof";

      let file = paymentProofFile;
      if (!file) {
        const cached = await getDocFromCache(REG_PAYMENT_DOC_KEY);
        if (cached?.file) {
          file = cached.file;
          setPaymentProofFile(cached.file);
        }
      }

      let url = "";
      if (file) {
        url = URL.createObjectURL(file);
        setPaymentProofPreviewUrl(url);
      } else if (formData.documentUploads.synopsisDriveUrl) {
        url = formData.documentUploads.synopsisDriveUrl;
      }

      setPreviewDocModal({
        title: "PAYMENT PROOF",
        fileName,
        url,
        fileType: file?.type,
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
    const nextStep = Math.min(currentStep + 1, 4);
    setCurrentStep(nextStep);
    try {
      localStorage.setItem(REG_STEP_KEY, nextStep.toString());
    } catch {}
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setErrors({});
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    try {
      localStorage.setItem(REG_STEP_KEY, prevStep.toString());
    } catch {}
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  // Final Form Submission (Uploads cached documents to Google Drive first, then confirms registration)
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
    setSubmitProgressText("Preparing documents for Google Drive upload...");

    try {
      const updatedDocs = { ...formData.documentUploads };

      // 1. Upload Authorization Letter to Google Drive if selected
      if (authLetterFile) {
        setSubmitProgressText("Uploading Documents ...");
        try {
          const uploadData = new FormData();
          uploadData.append("file", authLetterFile);
          uploadData.append("teamName", formData.teamName || "Squad");
          uploadData.append("category", "college_id");

          const res = await fetch("/api/upload/drive", {
            method: "POST",
            body: uploadData,
          });
          const result = await res.json();
          if (result.success && result.data) {
            updatedDocs.collegeIdDriveUrl = result.data.webViewLink;
            updatedDocs.collegeIdDriveFileId = result.data.fileId;
          }
        } catch (uploadErr) {
          console.warn(
            "Authorization letter drive upload failed, proceeding:",
            uploadErr,
          );
        }
      }

      // 2. Upload Payment Proof to Google Drive if selected
      if (paymentProofFile) {
        setSubmitProgressText("Uploading Payment Proof ...");
        try {
          const uploadData = new FormData();
          uploadData.append("file", paymentProofFile);
          uploadData.append("teamName", formData.teamName || "Squad");
          uploadData.append("category", "synopsis");

          const res = await fetch("/api/upload/drive", {
            method: "POST",
            body: uploadData,
          });
          const result = await res.json();
          if (result.success && result.data) {
            updatedDocs.synopsisDriveUrl = result.data.webViewLink;
            updatedDocs.synopsisDriveFileId = result.data.fileId;
          }
        } catch (uploadErr) {
          console.warn(
            "Payment proof drive upload failed, proceeding:",
            uploadErr,
          );
        }
      }

      setSubmitProgressText(
        "Finalizing squad credentials and generating pass...",
      );
      const finalPayload = {
        ...formData,
        documentUploads: updatedDocs,
      };

      const result = await registrationService.submitRegistration(finalPayload);
      if (result.success) {
        // Clear cached registration draft & documents on successful submission
        clearAllDocCache();
        try {
          localStorage.removeItem(REG_DRAFT_KEY);
          localStorage.removeItem(REG_STEP_KEY);
          localStorage.removeItem(REG_AUTH_DOC_KEY);
          localStorage.removeItem(REG_PAYMENT_DOC_KEY);
        } catch {}
        setSubmissionResult(result);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: result.message });
        }
      }
    } catch {
      setErrors({
        form: "Unexpected submission error. Please check your connection and retry.",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitProgressText("");
    }
  };

  const handleClearDraft = () => {
    if (typeof window !== "undefined") {
      const confirmClear = window.confirm(
        "Are you sure you want to clear your saved registration draft and restart from Step 1?",
      );
      if (!confirmClear) return;

      clearAllDocCache();
      try {
        localStorage.removeItem(REG_DRAFT_KEY);
        localStorage.removeItem(REG_STEP_KEY);
        localStorage.removeItem(REG_AUTH_DOC_KEY);
        localStorage.removeItem(REG_PAYMENT_DOC_KEY);
      } catch {}
    }
    handleResetForm();
  };

  const handleResetForm = () => {
    if (authLetterPreviewUrl) URL.revokeObjectURL(authLetterPreviewUrl);
    if (paymentProofPreviewUrl) URL.revokeObjectURL(paymentProofPreviewUrl);
    setAuthLetterFile(null);
    setPaymentProofFile(null);
    setAuthLetterPreviewUrl(null);
    setPaymentProofPreviewUrl(null);
    if (collegeIdInputRef.current) collegeIdInputRef.current.value = "";
    if (synopsisInputRef.current) synopsisInputRef.current.value = "";

    setFormData(initialFormState);
    setCurrentStep(1);
    setErrors({});
    setSubmissionResult(null);
    setHasRestoredDraft(false);

    clearAllDocCache();
    try {
      localStorage.removeItem(REG_DRAFT_KEY);
      localStorage.removeItem(REG_STEP_KEY);
      localStorage.removeItem(REG_AUTH_DOC_KEY);
      localStorage.removeItem(REG_PAYMENT_DOC_KEY);
    } catch {}
  };

  if (submissionResult) {
    return (
      <RegistrationSuccessReceipt
        result={submissionResult}
        onReset={handleResetForm}
      />
    );
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
      {isAuthenticated &&
        !isCheckingExistingTeam &&
        existingTeamData &&
        !forceNewRegistration && (
          <RegisteredSquadDashboard
            teamData={existingTeamData}
            userRoleInTeam={userRoleInTeam}
            currentUser={session?.user || {}}
            isProblemStatementsPublished={
              paymentSettings?.isProblemStatementsPublished
            }
          />
        )}

      {/* When Registrations are CLOSED and user has no registered squad */}
      {isAuthenticated &&
        !isCheckingExistingTeam &&
        (!existingTeamData || forceNewRegistration) &&
        paymentSettings &&
        paymentSettings.isRegistrationOpen === false && (
          <div className="border-4 border-black bg-rose-200 p-8 shadow-neo text-center space-y-4">
            <div className="w-14 h-14 bg-white border-3 border-black mx-auto flex items-center justify-center shadow-neo-sm">
              <Lock className="w-7 h-7 text-black stroke-[2.5px]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                REGISTRATIONS ARE CURRENTLY CLOSED
              </h3>
              <p className="font-mono text-xs sm:text-sm font-bold text-black/80 max-w-lg mx-auto leading-relaxed">
                The organizing committee has closed or paused squad
                registrations for HACKVERSE &apos;26. No new submissions are
                being accepted at this time.
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
      {isAuthenticated &&
        !isCheckingExistingTeam &&
        (!existingTeamData || forceNewRegistration) &&
        paymentSettings?.isRegistrationOpen !== false && (
          <div className="space-y-8">
            {/* Switch back banner if user was previously registered */}
            {existingTeamData && forceNewRegistration && (
              <div className="border-3 border-black bg-neo-accent p-3 shadow-neo-sm flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="font-mono text-xs font-black uppercase text-black">
                  Currently registered as squad:{" "}
                  <strong>{existingTeamData.teamName}</strong>
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
            <div className="border-4 border-black bg-white p-4 sm:p-6 shadow-neo space-y-4">
              {/* Top Cache Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span className="font-mono text-[11px] sm:text-xs font-black uppercase text-black">
                    AUTO-SAVE ACTIVE <span className="text-black/50">•</span>{" "}
                    STEP 0{currentStep} PRESERVED
                  </span>
                  {hasRestoredDraft && (
                    <span className="hidden sm:inline-block font-mono text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-800">
                      RESTORED FROM CACHE
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="font-mono text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 border-2 border-black text-black transition-colors flex items-center gap-1.5 shadow-neo-xs cursor-pointer"
                  title="Clear cached draft and start fresh"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>CLEAR DRAFT</span>
                </button>
              </div>

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
                            : "bg-neutral-100 text-black/40 opacity-70 cursor-not-allowed",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-8 h-8 font-mono font-black text-xs flex items-center justify-center shrink-0 border-2 border-black",
                          isCurrent
                            ? "bg-black text-white"
                            : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-black",
                        )}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 stroke-[3px]" />
                        ) : (
                          `0${st.num}`
                        )}
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
                        const val = e.target.value;
                        setFormData((prev) => ({ ...prev, teamName: val }));
                        if (errors.teamName)
                          setErrors((prev) => ({ ...prev, teamName: "" }));
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
                        const val = e.target.value;
                        setFormData((prev) => ({ ...prev, collegeName: val }));
                        if (errors.collegeName)
                          setErrors((prev) => ({ ...prev, collegeName: "" }));
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
                      onChange={(e) =>
                        handleAddressChange("fullAddress", e.target.value)
                      }
                      error={errors["collegeAddress.fullAddress"]}
                      helperText="Complete postal street address of your college campus."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="CITY / DISTRICT"
                        required
                        placeholder="e.g. Kalahandi / Bhawanipatna"
                        value={formData.collegeAddress.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        error={errors["collegeAddress.city"]}
                      />

                      <Select
                        label="STATE"
                        required
                        value={formData.collegeAddress.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleAddressChange(
                            "pincode",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
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
                        onChange={(e) =>
                          handleLeaderChange("fullName", e.target.value)
                        }
                        error={errors["teamLeader.fullName"]}
                      />

                      <Input
                        label="LEADER EMAIL ADDRESS"
                        required
                        type="email"
                        placeholder="e.g. leader@gmail.com"
                        value={formData.teamLeader.email}
                        onChange={(e) =>
                          handleLeaderChange("email", e.target.value)
                        }
                        error={errors["teamLeader.email"]}
                      />

                      <Input
                        label="MOBILE PHONE NUMBER"
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={formData.teamLeader.phone}
                        onChange={(e) =>
                          handleLeaderChange(
                            "phone",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
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
                              onChange={(e) =>
                                handleLeaderChange(
                                  "sameAsPhone",
                                  e.target.checked,
                                )
                              }
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
                          onChange={(e) =>
                            handleLeaderChange(
                              "whatsappNumber",
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          error={errors["teamLeader.whatsappNumber"]}
                          helperText="For urgent coordination and broadcast updates."
                        />
                      </div>

                      <Input
                        label="DATE OF BIRTH (DOB)"
                        required
                        type="date"
                        value={formData.teamLeader.dateOfBirth || ""}
                        onChange={(e) =>
                          handleLeaderChange("dateOfBirth", e.target.value)
                        }
                        error={errors["teamLeader.dateOfBirth"]}
                      />

                      <Select
                        label="DOMAIN ROLE"
                        value={formData.teamLeader.role}
                        onChange={(e) =>
                          handleLeaderChange(
                            "role",
                            e.target.value as MemberRole,
                          )
                        }
                        options={LEADER_ROLE_OPTIONS}
                      />

                      {/* Branch Selection */}
                      <div className="space-y-2">
                        <Select
                          label="ENGINEERING BRANCH / DEPT"
                          required
                          value={formData.teamLeader.branch}
                          onChange={(e) =>
                            handleLeaderChange("branch", e.target.value)
                          }
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
                              onChange={(e) =>
                                handleLeaderChange(
                                  "customBranch",
                                  e.target.value,
                                )
                              }
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
                        onChange={(e) =>
                          handleLeaderChange("yearOfStudy", e.target.value)
                        }
                        error={errors["teamLeader.yearOfStudy"]}
                        options={YEAR_OPTIONS}
                      />

                      <Input
                        label="GITHUB / PORTFOLIO / LINKEDIN"
                        placeholder="e.g. github.com/leader or handle"
                        value={formData.teamLeader.githubUsername || ""}
                        onChange={(e) =>
                          handleLeaderChange("githubUsername", e.target.value)
                        }
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
                            ADDITIONAL SQUAD MEMBERS ({formData.members.length}{" "}
                            OF MAX 3 CO-HACKERS)
                          </h3>
                          <p className="font-mono text-[11px] text-black/70">
                            Squad Capacity: <strong>Minimum 2 members</strong>{" "}
                            (1 Leader + 1 Co-hacker),{" "}
                            <strong>Maximum 4 members</strong> (1 Leader + up to
                            3 Co-hackers)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddMember}
                        disabled={formData.members.length >= 3}
                        className={clsx(
                          "px-4 py-2 bg-neo-secondary text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-none transition-all flex items-center gap-1.5 self-start sm:self-auto",
                          formData.members.length >= 3 &&
                            "opacity-50 cursor-not-allowed bg-neutral-300",
                        )}
                      >
                        <Plus className="w-4 h-4 stroke-[3px]" />
                        <span>
                          {formData.members.length >= 3
                            ? "MAX 4 SQUAD REACHED"
                            : "ADD CO-HACKER"}
                        </span>
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
                          A minimum of 1 co-hacker is required (total 2 members
                          minimum). Please click &quot;ADD CO-HACKER&quot;
                          above.
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
                                CO-HACKER #{idx + 2}{" "}
                                {idx === 0 && "(MANDATORY 2ND MEMBER)"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(idx)}
                                disabled={formData.members.length <= 1}
                                title={
                                  formData.members.length <= 1
                                    ? "Minimum 2 squad members required (1 Leader + 1 Co-hacker)"
                                    : "Remove this co-hacker"
                                }
                                className={clsx(
                                  "px-2.5 py-1 text-white font-black text-xs uppercase border border-black flex items-center gap-1 transition-all",
                                  formData.members.length <= 1
                                    ? "bg-neutral-400 opacity-60 cursor-not-allowed text-neutral-800"
                                    : "bg-rose-500 hover:bg-rose-600",
                                )}
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                                <span>
                                  {formData.members.length <= 1
                                    ? "MIN 2 REQUIRED"
                                    : "REMOVE"}
                                </span>
                              </button>
                            </div>

                            {/* Comprehensive identical fields for Member */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Input
                                label={`MEMBER ${idx + 2} FULL NAME`}
                                required
                                placeholder="e.g. Teammate Name"
                                value={member.fullName}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "fullName",
                                    e.target.value,
                                  )
                                }
                                error={errors[`members.${idx}.fullName`]}
                              />

                              <Input
                                label={`MEMBER ${idx + 2} EMAIL`}
                                required
                                type="email"
                                placeholder="e.g. member@gmail.com"
                                value={member.email}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "email",
                                    e.target.value,
                                  )
                                }
                                error={errors[`members.${idx}.email`]}
                              />

                              <Input
                                label={`MEMBER ${idx + 2} MOBILE PHONE`}
                                required
                                type="tel"
                                maxLength={10}
                                placeholder="e.g. 9876543210"
                                value={member.phone}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "phone",
                                    e.target.value.replace(/\D/g, ""),
                                  )
                                }
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
                                      onChange={(e) =>
                                        handleMemberChange(
                                          idx,
                                          "sameAsPhone",
                                          e.target.checked,
                                        )
                                      }
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
                                  onChange={(e) =>
                                    handleMemberChange(
                                      idx,
                                      "whatsappNumber",
                                      e.target.value.replace(/\D/g, ""),
                                    )
                                  }
                                  error={
                                    errors[`members.${idx}.whatsappNumber`]
                                  }
                                />
                              </div>

                              <Input
                                label={`MEMBER ${idx + 2} DATE OF BIRTH`}
                                required
                                type="date"
                                value={member.dateOfBirth || ""}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "dateOfBirth",
                                    e.target.value,
                                  )
                                }
                                error={errors[`members.${idx}.dateOfBirth`]}
                              />

                              <Select
                                label={`MEMBER ${idx + 2} DOMAIN ROLE`}
                                value={member.role}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "role",
                                    e.target.value as MemberRole,
                                  )
                                }
                                options={MEMBER_ROLE_OPTIONS}
                              />

                              {/* Member Branch Selection */}
                              <div className="space-y-2">
                                <Select
                                  label={`MEMBER ${idx + 2} BRANCH / DEPT`}
                                  required
                                  value={
                                    member.branch ||
                                    "Computer Science & Engineering"
                                  }
                                  onChange={(e) =>
                                    handleMemberChange(
                                      idx,
                                      "branch",
                                      e.target.value,
                                    )
                                  }
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
                                      onChange={(e) =>
                                        handleMemberChange(
                                          idx,
                                          "customBranch",
                                          e.target.value,
                                        )
                                      }
                                      error={
                                        errors[`members.${idx}.customBranch`]
                                      }
                                    />
                                  </div>
                                )}
                              </div>

                              <Select
                                label={`MEMBER ${idx + 2} YEAR OF STUDY`}
                                required
                                value={member.yearOfStudy || "3rd Year"}
                                onChange={(e) =>
                                  handleMemberChange(
                                    idx,
                                    "yearOfStudy",
                                    e.target.value,
                                  )
                                }
                                error={errors[`members.${idx}.yearOfStudy`]}
                                options={YEAR_OPTIONS}
                              />

                              <div className="sm:col-span-2">
                                <Input
                                  label={`MEMBER ${idx + 2} GITHUB / PORTFOLIO (OPTIONAL)`}
                                  placeholder="e.g. github.com/member or handle"
                                  value={member.githubUsername || ""}
                                  onChange={(e) =>
                                    handleMemberChange(
                                      idx,
                                      "githubUsername",
                                      e.target.value,
                                    )
                                  }
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
                      {paymentSettings.registrationFee > 0
                        ? `FEE: ₹${paymentSettings.registrationFee}`
                        : "SPONSORED PASS"}
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
                              `upi://pay?pa=${paymentSettings.upiId}&pn=${encodeURIComponent(paymentSettings.payeeName)}&am=${paymentSettings.registrationFee || ""}&cu=INR`,
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
                                navigator.clipboard.writeText(
                                  paymentSettings.upiId,
                                );
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2500);
                              }}
                              className="px-3 py-1.5 bg-neo-secondary text-black font-black text-xs uppercase border-2 border-black shadow-neo-sm hover:shadow-none flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:translate-y-0.5"
                            >
                              <span>
                                {copiedUpi
                                  ? "COPIED TO CLIPBOARD!"
                                  : "COPY UPI ID"}
                              </span>
                            </button>
                          </div>

                          {/* Scanner Fallback Instruction */}
                          <div className="p-3 bg-amber-100/90 border-2 border-amber-900/40 text-black flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5 stroke-[2.5px]" />
                            <div className="space-y-0.5">
                              <span className="font-mono text-[11px] font-black uppercase text-amber-950 block">
                                SCANNER FAILED OR UNABLE TO SCAN QR?
                              </span>
                              <p className="text-[11px] font-bold text-black/85 leading-snug">
                                If scanning the QR code fails in your
                                banking/UPI app, click{" "}
                                <strong>&quot;COPY UPI ID&quot;</strong> above,
                                open your UPI app (Google Pay, PhonePe, Paytm,
                                BHIM, etc.), select{" "}
                                <strong>Pay via UPI ID / VPA</strong>, paste{" "}
                                <strong>{paymentSettings.upiId}</strong>, and
                                complete your payment.
                              </p>
                            </div>
                          </div>

                          <p className="font-sans text-xs font-bold text-black/75">
                            After successful transfer, copy the{" "}
                            <strong>
                              12-digit numeric UTR / Reference Number
                            </strong>{" "}
                            from your banking SMS or receipt and paste it below.
                          </p>
                        </div>
                      </div>

                      {/* Numeric UTR Input Section */}
                      <div className="pt-4 border-t-2 border-black/20 space-y-3">
                        <Input
                          label="12-DIGIT TRANSACTION REFERENCE ID / UPI UTR (NUMBERS ONLY)"
                          required
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={22}
                          placeholder="e.g. 429108492019 (Only digits allowed)"
                          value={formData.paymentDetails.transactionId || ""}
                          onChange={(e) => {
                            const numericOnly = e.target.value.replace(
                              /\D/g,
                              "",
                            );
                            setFormData((prev) => ({
                              ...prev,
                              paymentDetails: {
                                ...prev.paymentDetails,
                                paymentMode: "UPI_QR",
                                transactionId: numericOnly,
                                status: "PENDING_VERIFICATION",
                              },
                            }));
                            if (errors["paymentDetails.transactionId"]) {
                              setErrors((prev) => ({
                                ...prev,
                                "paymentDetails.transactionId": "",
                              }));
                            }
                          }}
                          error={errors["paymentDetails.transactionId"]}
                          helperText="Enter only the numeric digits (no alphabets or symbols) from your UPI transaction confirmation."
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
                          formData.paymentDetails.paymentMode ===
                            "FREE_SPONSORED"
                            ? "bg-emerald-100 border-emerald-900 shadow-neo-sm"
                            : "bg-white hover:bg-neutral-50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                          <div>
                            <div className="font-black text-sm uppercase text-black">
                              APPLY FOR FREE TIER / SPONSORED PASS WAIVER
                            </div>
                            <p className="text-[11px] font-bold text-black/70">
                              Available for eligible GCEK and affiliated college
                              student hackathon squads.
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
                          <span>All Basic Amenities &amp; Power Backup</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-600 font-black">✔</span>
                          <span>
                            Complimentary Meals &amp; Energy Refreshments
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-600 font-black">✔</span>
                          <span>
                            Official Government State Hackathon Certificate
                          </span>
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

                  {/* Document Upload 1: Authorization Letter (REQUIRED) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-black" />
                        <span>AUTHORIZATION LETTER (PDF / PNG / JPG)</span>
                      </label>
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-rose-600 text-white border border-black shadow-neo-sm">
                        REQUIRED *
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={collegeIdInputRef}
                      onChange={handleCollegeIdFile}
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => collegeIdInputRef.current?.click()}
                      className={clsx(
                        "p-6 border-3 border-dashed transition-all text-center space-y-2 cursor-pointer",
                        errors["documentUploads.collegeIdFileName"]
                          ? "border-rose-600 bg-rose-50"
                          : "border-black bg-neutral-50 hover:bg-neo-bg",
                      )}
                    >
                      {formData.documentUploads.collegeIdFileName ? (
                        <div className="space-y-3">
                          <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              ATTACHED:{" "}
                              {formData.documentUploads.collegeIdFileName}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                            <span className="font-bold text-black/70">
                              {formData.documentUploads.collegeIdFileSize}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDocPreview("AUTH_LETTER");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                              <span>VIEW</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteAuthLetter}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-rose-200 hover:bg-rose-300 text-rose-950 border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                              <span>DELETE</span>
                            </button>
                            <span className="text-black/60 text-[10px] underline">
                              • Click to replace file
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                          <p className="font-black text-sm uppercase text-black">
                            CLICK OR DRAG &amp; DROP AUTHORIZATION LETTER
                          </p>
                          <p className="font-mono text-xs text-black/60">
                            College authorization letter or bonafide certificate
                            (Max 20MB) • Uploads on confirmation
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

                  {/* Document Upload 2: Payment Proof (REQUIRED) */}
                  <div className="space-y-2 pt-2 border-t-2 border-black/15">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-black" />
                        <span>PAYMENT PROOF (PDF / PNG / JPG / RECEIPT)</span>
                      </label>
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-rose-600 text-white border border-black shadow-neo-sm">
                        REQUIRED *
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={synopsisInputRef}
                      onChange={handlePaymentProofFile}
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => synopsisInputRef.current?.click()}
                      className={clsx(
                        "p-6 border-3 border-dashed transition-all text-center space-y-2 cursor-pointer",
                        errors["documentUploads.synopsisFileName"]
                          ? "border-rose-600 bg-rose-50"
                          : "border-black bg-neutral-50 hover:bg-neo-bg",
                      )}
                    >
                      {formData.documentUploads.synopsisFileName ? (
                        <div className="space-y-3">
                          <div className="font-mono text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              ATTACHED:{" "}
                              {formData.documentUploads.synopsisFileName}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                            <span className="font-bold text-black/70">
                              {formData.documentUploads.synopsisFileSize}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDocPreview("PAYMENT_PROOF");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-neutral-100 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 stroke-[2.5px]" />
                              <span>VIEW</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleDeletePaymentProof}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-rose-200 hover:bg-rose-300 text-rose-950 border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                              <span>DELETE</span>
                            </button>
                            <span className="text-black/60 text-[10px] underline">
                              • Click to replace file
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <FileCheck className="w-8 h-8 mx-auto text-black/70 stroke-[2px] mb-2" />
                          <p className="font-black text-sm uppercase text-black">
                            ATTACH PAYMENT PROOF (TRANSACTION SCREENSHOT /
                            RECEIPT)
                          </p>
                          <p className="font-mono text-xs text-black/60">
                            UPI payment screenshot or bank transfer receipt (Max
                            20MB) • Uploads on confirmation
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

                  {/* 4. EVENT ACCOMMODATION PREFERENCE */}
                  {/* <div className="border-4 border-black p-5 sm:p-6 bg-neutral-50 shadow-neo space-y-3">
                    <div className="flex items-center gap-2 border-b-2 border-black/20 pb-2">
                      <Home className="w-5 h-5 text-black stroke-[2.5px]" />
                      <h4 className="font-black text-sm sm:text-base uppercase text-black">
                        4. EVENT ACCOMMODATION PREFERENCE
                      </h4>
                    </div>

                    <label
                      htmlFor="reg-accommodation-preference"
                      className="flex items-start gap-3 cursor-pointer select-none group"
                    >
                      <input
                        type="checkbox"
                        id="reg-accommodation-preference"
                        checked={Boolean(formData.accommodationRequired)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accommodationRequired: e.target.checked,
                          }))
                        }
                        className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-black accent-black rounded-none cursor-pointer shrink-0 mt-0.5"
                      />
                      <span className="font-bold text-xs sm:text-sm text-black group-hover:text-amber-950 leading-snug">
                        Request On-Campus Hostel Accommodation for our squad during Hackathon days (Subject to availability)
                      </span>
                    </label>
                  </div> */}

                  {/* Final Guidelines Acceptance Box */}
                  <div className="p-5 border-4 border-black bg-neo-secondary/30 shadow-neo space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agree-checkbox-final"
                        checked={formData.agreeToGuidelines}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            agreeToGuidelines: checked,
                          }));
                          if (errors.agreeToGuidelines) {
                            setErrors((prev) => ({
                              ...prev,
                              agreeToGuidelines: "",
                            }));
                          }
                        }}
                        className="w-6 h-6 border-3 border-black accent-black rounded-none cursor-pointer shrink-0 mt-0.5"
                      />
                      <label
                        htmlFor="agree-checkbox-final"
                        className="text-xs sm:text-sm font-bold text-black cursor-pointer leading-snug"
                      >
                        I verify that all submitted squad credentials and
                        institutional details are accurate. Our team agrees to
                        adhere strictly to the{" "}
                        <span className="font-black underline">
                          HACKVERSE &apos;26 Code of Conduct
                        </span>
                        , intellectual property rules, and tournament
                        regulations.
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
                          <span>
                            {submitProgressText || "PROCESSING SQUAD ENTRY..."}
                          </span>
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

      {/* Document Preview Modal */}
      {previewDocModal && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-start p-3 sm:p-4 pt-24 sm:pt-28 pb-6 backdrop-blur-xs animate-in fade-in-50 duration-150 overflow-y-auto overscroll-contain"
          onClick={() => setPreviewDocModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl sm:max-w-3xl bg-white border-4 border-black shadow-neo-lg flex flex-col max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-9rem)] animate-in zoom-in-95 duration-150 overflow-hidden shrink-0 mt-0"
          >
            {/* Modal Header */}
            <div className="py-2.5 px-4 sm:py-3 sm:px-5 bg-neo-secondary border-b-3 border-black flex items-center justify-between shrink-0">
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-black text-white inline-block">
                  DOCUMENT PREVIEW
                </span>
                <h3 className="font-black text-sm sm:text-base text-black uppercase tracking-tight truncate max-w-xs sm:max-w-lg">
                  {previewDocModal.title}: {previewDocModal.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-rose-400 border-2 border-black font-black flex items-center justify-center shadow-neo-sm cursor-pointer shrink-0 transition-colors"
                title="Close preview"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
              </button>
            </div>

            {/* Modal Body - Compact Preview Viewport */}
            <div className="p-3 sm:p-4 overflow-y-auto flex-1 bg-neutral-100 flex items-center justify-center min-h-[200px] max-h-[48vh] sm:max-h-[50vh]">
              {previewDocModal.url ? (
                previewDocModal.fileType?.startsWith("image/") ||
                previewDocModal.fileName.match(
                  /\.(png|jpe?g|webp|gif|svg)$/i,
                ) ? (
                  <div className="flex items-center justify-center w-full h-full p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewDocModal.url}
                      alt={previewDocModal.fileName}
                      className="max-h-[44vh] sm:max-h-[46vh] max-w-full object-contain border-3 border-black shadow-neo-sm bg-white"
                    />
                  </div>
                ) : previewDocModal.fileType === "application/pdf" ||
                  previewDocModal.fileName.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={previewDocModal.url}
                    title={previewDocModal.fileName}
                    className="w-full h-[44vh] sm:h-[46vh] border-3 border-black bg-white shadow-neo-sm"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3 bg-white border-3 border-black shadow-neo-sm">
                    <FileText className="w-10 h-10 mx-auto text-black" />
                    <p className="font-black text-xs uppercase text-black">
                      {previewDocModal.fileName}
                    </p>
                    <p className="font-mono text-[11px] text-black/70">
                      Preview not directly embeddable for this format.
                    </p>
                    <a
                      href={previewDocModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neo-secondary border-2 border-black font-black text-xs uppercase shadow-neo-sm hover:shadow-none transition-all"
                    >
                      <span>OPEN IN NEW TAB</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )
              ) : (
                <div className="p-6 text-center space-y-2 bg-white border-3 border-black shadow-neo-sm">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />
                  <p className="font-black text-xs uppercase text-black">
                    Document preview not found in memory
                  </p>
                  <p className="font-mono text-[11px] text-black/70">
                    Please re-select the file using the upload box.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="py-2.5 px-4 bg-white border-t-3 border-black flex items-center justify-between shrink-0">
              {previewDocModal.url ? (
                <a
                  href={previewDocModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border-2 border-black font-mono text-xs font-bold text-black shadow-neo-sm cursor-pointer transition-colors"
                >
                  <span>OPEN IN FULL TAB</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-1.5 bg-black text-white hover:bg-neutral-800 border-2 border-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-neo-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
