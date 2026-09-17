/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CreditCard,
  Settings,
  RefreshCw,
  Search,
  Download,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Trash2,
  LogOut,
  ChevronRight,
  PanelLeft,
  X,
  ExternalLink,
  Compass,
  Zap,
  HardDrive,
  Mail,
  Send,
  Loader2,
  FileText,
  MoreVertical,
  Eye,
  XCircle,
  Check,
  ImageIcon,
  FileX,
  Lock,
  EyeOff,
  KeyRound,
  QrCode,
  Smartphone,
  Laptop,
  Globe,
  Copy,
  CheckCheck,
  Radio,
  Printer,
  Ban,
  Building2,
  GraduationCap,
  Target,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { encodeCode128B } from "@/lib/barcode128";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

type AdminTab =
  | "dashboard"
  | "teams"
  | "problems"
  | "accomodation"
  | "payments"
  | "scanner"
  | "settings";

interface RegistrationRecord {
  id: string;
  registrationNumber: string;
  teamName: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  problemStatementId?: string;
  status: "CONFIRMED" | "PENDING_VERIFICATION" | "REJECTED" | string;

  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderWhatsapp?: string;
  leaderDob?: string;
  leaderBranch: string;
  leaderCustomBranch?: string;
  leaderYear: string;
  leaderRole?: string;
  leaderGithub?: string;

  members: Array<{
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
  }>;

  paymentMode?: string;
  transactionId?: string;
  paymentStatus?: string;
  amount?: number;

  accommodationRequired?: boolean;
  accommodationStatus?: string;
  roomNumber?: string;
  hostelBlock?: string;

  documents?: {
    collegeIdFileName?: string;
    collegeIdFileSize?: string;
    collegeIdDriveUrl?: string;
    collegeIdDriveFileId?: string;
    synopsisFileName?: string;
    synopsisFileSize?: string;
    synopsisDriveUrl?: string;
    synopsisDriveFileId?: string;
    githubRepoUrl?: string;
    driveFolderUrl?: string;
    [key: string]: any;
  };

  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalSquads: number;
  totalParticipants: number;
  confirmedTeams: number;
  pendingTeams: number;
  rejectedTeams: number;
  accommodationRequested: number;
  accommodationAllocated: number;
  paymentVerified: number;
  paymentPending: number;
  paymentFreeTier: number;
  psDistribution: Record<string, number>;
}

interface SystemSettingsState {
  upiId: string;
  payeeName: string;
  registrationFee: number;
  isPaymentMandatory: boolean;
  isRegistrationOpen: boolean;
  isProblemStatementsPublished: boolean;
  minSquadSize: number;
  maxSquadSize: number;
  contactPhone?: string;
  contactEmail?: string;
  judgeAuthPin?: string;
  googleDriveEnabled?: boolean;
  googleDriveAuthType?: string;
  googleDriveConnectedEmail?: string;
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  googleDriveClientEmail?: string;
  googleDrivePrivateKey?: string;
  googleDriveServiceAccountJson?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Data state
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<SystemSettingsState>({
    upiId: "codebreakers@upi",
    payeeName: "HACKVERSE 2026 GCEK",
    registrationFee: 0,
    isPaymentMandatory: false,
    isRegistrationOpen: true,
    isProblemStatementsPublished: true,
    minSquadSize: 2,
    maxSquadSize: 4,
    contactPhone: "+91 9876543210",
    contactEmail: "hackverse26@codebreakersgcek.tech",
    judgeAuthPin: "2026",
    googleDriveEnabled: false,
    googleDriveAuthType: "oauth",
    googleDriveConnectedEmail: "",
    googleDriveFolderId: "",
    googleDriveFolderName: "HACKVERSE 2026 Team Uploads",
    googleDriveClientEmail: "",
    googleDrivePrivateKey: "",
    googleDriveServiceAccountJson: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDisconnectingDrive, setIsDisconnectingDrive] = useState(false);

  // Google Drive Connection & Permissions State
  const [isTestingDrive, setIsTestingDrive] = useState(false);
  const [isSyncingPermissions, setIsSyncingPermissions] = useState(false);
  const [driveTestResult, setDriveTestResult] = useState<{
    success: boolean;
    message: string;
    folderName?: string;
    folderId?: string;
    webViewLink?: string;
  } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [psFilter, setPsFilter] = useState("ALL");
  const [accomFilter, setAccomFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Problem Statements Tracker Section States
  const [psViewMode, setPsViewMode] = useState<"grouped" | "table" | "unassigned">("grouped");
  const [psTrackerSearch, setPsTrackerSearch] = useState("");
  const [psTrackerFilter, setPsTrackerFilter] = useState("ALL");

  // Sheet Drawer States
  const [selectedSquad, setSelectedSquad] = useState<RegistrationRecord | null>(
    null,
  );
  const [isSquadSheetOpen, setIsSquadSheetOpen] = useState(false);

  const [selectedAccomSquad, setSelectedAccomSquad] =
    useState<RegistrationRecord | null>(null);
  const [isAccomSheetOpen, setIsAccomSheetOpen] = useState(false);
  const [hostelBlockInput, setHostelBlockInput] = useState("BH-1");
  const [roomNumberInput, setRoomNumberInput] = useState("101");

  const [selectedPaymentSquad, setSelectedPaymentSquad] =
    useState<RegistrationRecord | null>(null);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isPaymentProofModalOpen, setIsPaymentProofModalOpen] = useState(false);
  const [activeProofTab, setActiveProofTab] = useState<
    "collegeId" | "synopsis" | "payment"
  >("collegeId");

  // Pass & Check-In QR Modal for Desk Printing
  const [selectedPassSquad, setSelectedPassSquad] = useState<RegistrationRecord | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Custom Neo-Brutalist Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "success" | "neutral";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Scanner PIN & Connected Devices State (5-min PIN, max 8 devices)
  const [scannerData, setScannerData] = useState<{
    active: boolean;
    session: {
      id: string;
      pin: string;
      createdAt: string;
      expiresAt: string;
      maxDevices: number;
      activeDeviceCount: number;
      devices: Array<{
        id: string;
        verifierName: string;
        deviceInfo: string;
        ipAddress: string;
        createdAt: string;
        lastActiveAt: string;
        isActive: boolean;
      }>;
    } | null;
    remainingSeconds: number;
    recentSessions?: any[];
  }>({
    active: false,
    session: null,
    remainingSeconds: 0,
  });
  const [isGeneratingPin, setIsGeneratingPin] = useState(false);
  const [isRevokingPin, setIsRevokingPin] = useState(false);
  const [isRevokingDevice, setIsRevokingDevice] = useState<string | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);

  const openConfirm = (config: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "success" | "neutral";
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      ...config,
    });
  };

  // Close 3-dot menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-action-menu]")) {
        setOpenActionMenuId(null);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // User clearance verification
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;
  const isAuthenticated = Boolean(session?.user);
  const isAdmin = user?.role === "admin" || isAuthenticated;

  // Check URL parameters for Google OAuth callback feedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("drive") === "connected") {
        toast.success("Google Drive connected via Google OAuth successfully!");
        setActiveTab("settings");
      } else if (params.get("drive_error")) {
        toast.error(
          `Google Drive connection error: ${params.get("drive_error")}`,
        );
        setActiveTab("settings");
      }
    }
  }, []);

  // Fetch real data from backend
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [regsRes, statsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/registrations"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/settings"),
      ]);

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRegistrations(regsData.data || []);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.settings) {
          setSettings(settingsData.settings);
        }
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Network error loading live database records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Scanner PIN status
  const fetchScannerData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scanner-pin");
      if (res.ok) {
        const data = await res.json();
        setScannerData(data);
      }
    } catch (err) {
      console.error("Failed to fetch scanner PIN status:", err);
    }
  }, []);

  // Generate 5-Minute PIN
  const handleGenerateScannerPin = async () => {
    setIsGeneratingPin(true);
    try {
      const res = await fetch("/api/admin/scanner-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Generated 5-minute PIN: ${data.session?.pin}`);
        fetchScannerData();
      } else {
        toast.error(data.error || "Failed to generate PIN");
      }
    } catch {
      toast.error("Network error generating PIN");
    } finally {
      setIsGeneratingPin(false);
    }
  };

  // Revoke active PIN
  const handleRevokePin = async () => {
    setIsRevokingPin(true);
    try {
      const res = await fetch("/api/admin/scanner-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_pin" }),
      });
      if (res.ok) {
        toast.success("Active PIN session revoked");
        fetchScannerData();
      }
    } catch {
      toast.error("Network error revoking PIN");
    } finally {
      setIsRevokingPin(false);
    }
  };

  // Revoke single device session
  const handleRevokeDevice = async (deviceId: string, name: string) => {
    setIsRevokingDevice(deviceId);
    try {
      const res = await fetch("/api/admin/scanner-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_device", deviceId }),
      });
      if (res.ok) {
        toast.success(`Disconnected ${name}`);
        fetchScannerData();
      }
    } catch {
      toast.error("Failed to disconnect device");
    } finally {
      setIsRevokingDevice(null);
    }
  };

  // Scanner PIN live countdown tick
  useEffect(() => {
    if (!scannerData.active || scannerData.remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setScannerData((prev) => {
        const next = Math.max(0, prev.remainingSeconds - 1);
        if (next === 0 && prev.active) {
          fetchScannerData();
        }
        return {
          ...prev,
          remainingSeconds: next,
          active: next > 0,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scannerData.active, scannerData.remainingSeconds, fetchScannerData]);

  // Periodic polling when on scanner or dashboard tab
  useEffect(() => {
    if (activeTab === "scanner" || activeTab === "dashboard") {
      fetchScannerData();
      const poll = setInterval(fetchScannerData, 6000);
      return () => clearInterval(poll);
    }
  }, [activeTab, fetchScannerData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(
          `Squad status updated to ${newStatus}.${newStatus === "CONFIRMED" ? " Approval Email & Pass sent!" : ""}`,
        );
        await fetchData();
        if (selectedSquad?.id === id) {
          setSelectedSquad((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        }
      } else {
        toast.error("Failed to update squad status.");
      }
    } catch {
      toast.error("Server communication error.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Dispatch Email via Resend
  const handleDispatchEmail = async (
    registrationId: string,
    type: "submission" | "approval",
  ) => {
    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/admin/registrations/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, type }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          type === "approval"
            ? "Entry Pass PNG & Confirmation Email dispatched successfully!"
            : "Submission Receipt Email dispatched successfully!",
        );
      } else {
        toast.error(data.error || "Failed to dispatch email.");
      }
    } catch {
      toast.error("Network error during email dispatch.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Update Accommodation
  const handleSaveAccommodation = async () => {
    if (!selectedAccomSquad) return;
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAccomSquad.id,
          accommodationStatus: "ALLOCATED",
          hostelBlock: hostelBlockInput,
          roomNumber: roomNumberInput,
        }),
      });
      if (res.ok) {
        toast.success(
          `Allocated Room ${roomNumberInput} (${hostelBlockInput}).`,
        );
        setIsAccomSheetOpen(false);
        await fetchData();
      } else {
        toast.error("Failed to allocate room.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Payment Status (Approve / Reject)
  const handleUpdatePayment = async (id: string, newPaymentStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          paymentStatus: newPaymentStatus,
          status:
            newPaymentStatus === "VERIFIED"
              ? "CONFIRMED"
              : newPaymentStatus === "REJECTED"
                ? "REJECTED"
                : undefined,
        }),
      });
      if (res.ok) {
        if (newPaymentStatus === "VERIFIED") {
          toast.success(
            "Payment verified! Official Tax Invoice & Entry Pass dispatched.",
          );
        } else if (newPaymentStatus === "REJECTED") {
          toast.error("Payment rejected.");
        } else {
          toast.success(`Payment marked as ${newPaymentStatus}.`);
        }
        await fetchData();
        if (selectedPaymentSquad?.id === id) {
          setSelectedPaymentSquad((prev) =>
            prev
              ? {
                  ...prev,
                  paymentStatus: newPaymentStatus,
                  status:
                    newPaymentStatus === "VERIFIED"
                      ? "CONFIRMED"
                      : newPaymentStatus === "REJECTED"
                        ? "REJECTED"
                        : prev.status,
                }
              : null,
          );
        }
      } else {
        toast.error("Failed to update payment status.");
      }
    } catch {
      toast.error("Error updating payment.");
    } finally {
      setIsUpdating(false);
      setOpenActionMenuId(null);
    }
  };

  // Delete Squad Record
  const handleDeleteSquad = (id: string, teamName: string) => {
    openConfirm({
      title: "Delete Squad Roster",
      description: `Are you sure you want to permanently delete squad "${teamName}"? All member rosters, registration ticket numbers, and verification documents will be permanently erased.`,
      confirmText: "YES, DELETE SQUAD",
      cancelText: "CANCEL",
      variant: "danger",
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          const res = await fetch(`/api/admin/registrations?id=${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            toast.success(`Squad "${teamName}" deleted successfully.`);
            setIsSquadSheetOpen(false);
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            await fetchData();
          } else {
            toast.error("Failed to delete squad record.");
          }
        } catch {
          toast.error("Network error.");
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  // Ban / Disqualify Squad
  const handleBanSquad = (squad: RegistrationRecord) => {
    openConfirm({
      title: "BAN / DISQUALIFY SQUAD",
      description: `Are you sure you want to BAN squad "${squad.teamName}" (${squad.registrationNumber})? This squad will be disqualified from HACKVERSE '26 immediately and entry permissions will be revoked.`,
      confirmText: "YES, BAN SQUAD",
      cancelText: "CANCEL",
      variant: "danger",
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          const res = await fetch("/api/admin/registrations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: squad.id, status: "BANNED" }),
          });
          if (res.ok) {
            toast.error(`Squad "${squad.teamName}" has been BANNED / DISQUALIFIED.`);
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            await fetchData();
            if (selectedSquad?.id === squad.id) {
              setSelectedSquad((prev) =>
                prev ? { ...prev, status: "BANNED" } : null,
              );
            }
          } else {
            toast.error("Failed to ban squad.");
          }
        } catch {
          toast.error("Network error.");
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  // Unban / Restore Squad
  const handleUnbanSquad = (squad: RegistrationRecord) => {
    openConfirm({
      title: "UNBAN & RESTORE SQUAD",
      description: `Are you sure you want to lift the ban and restore squad "${squad.teamName}" (${squad.registrationNumber}) to CONFIRMED status?`,
      confirmText: "YES, RESTORE SQUAD",
      cancelText: "CANCEL",
      variant: "success",
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          const res = await fetch("/api/admin/registrations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: squad.id, status: "CONFIRMED" }),
          });
          if (res.ok) {
            toast.success(`Squad "${squad.teamName}" restored to CONFIRMED status.`);
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            await fetchData();
            if (selectedSquad?.id === squad.id) {
              setSelectedSquad((prev) =>
                prev ? { ...prev, status: "CONFIRMED" } : null,
              );
            }
          } else {
            toast.error("Failed to restore squad.");
          }
        } catch {
          toast.error("Network error.");
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success(
          "Admin settings & Google Drive configuration saved successfully.",
        );
        await fetchData();
      } else {
        toast.error("Failed to persist settings.");
      }
    } catch {
      toast.error("Failed to persist settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Fast Toggle Setting for Registration and Problem Statement Gates
  const handleToggleSetting = async (
    key: "isRegistrationOpen" | "isProblemStatementsPublished",
    newValue: boolean,
  ) => {
    setIsSavingSettings(true);
    const updatedSettings = { ...settings, [key]: newValue };
    setSettings(updatedSettings);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      if (res.ok) {
        toast.success(
          key === "isRegistrationOpen"
            ? newValue
              ? "✓ Squad Registrations are now ENABLED (Open)."
              : "✕ Squad Registrations are now DISABLED (Closed)."
            : newValue
              ? "✓ Problem Statements are now PUBLISHED live."
              : "✕ Problem Statements are now UNPUBLISHED & restricted.",
        );
        await fetchData();
      } else {
        toast.error("Failed to update gate control.");
      }
    } catch {
      toast.error("Network error updating gate setting.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Test Google Drive Connection
  const handleTestDriveConnection = async () => {
    setIsTestingDrive(true);
    setDriveTestResult(null);
    try {
      const res = await fetch("/api/admin/drive/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderId: settings.googleDriveFolderId,
          clientEmail: settings.googleDriveClientEmail,
          privateKey: settings.googleDrivePrivateKey,
          serviceAccountJson: settings.googleDriveServiceAccountJson,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDriveTestResult({
          success: true,
          message:
            data.data?.message ||
            "Google Drive connection verified successfully!",
          folderName: data.data?.folderName,
          folderId: data.data?.folderId,
          webViewLink: data.data?.webViewLink,
        });
        toast.success("Google Drive connected and verified!");
      } else {
        setDriveTestResult({
          success: false,
          message:
            data.error || "Failed to authenticate with Google Drive API.",
        });
        toast.error(`Drive test failed: ${data.error || "Check credentials"}`);
      }
    } catch (err: any) {
      setDriveTestResult({
        success: false,
        message:
          err.message ||
          "Network error while connecting to Drive API test endpoint.",
      });
      toast.error("Network error during Drive test.");
    } finally {
      setIsTestingDrive(false);
    }
  };

  // Sync and make all uploaded Google Drive documents accessible to anyone with the link
  const handleSyncPermissions = async () => {
    setIsSyncingPermissions(true);
    try {
      const res = await fetch("/api/admin/drive/sync-permissions", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDriveTestResult({
          success: true,
          message: data.message || "All uploaded files in Google Drive are now publicly viewable!",
        });
        toast.success(data.message || "Drive permissions successfully synchronized!");
      } else {
        toast.error(data.error || "Failed to synchronize Drive permissions.");
      }
    } catch {
      toast.error("Network error while syncing Drive permissions.");
    } finally {
      setIsSyncingPermissions(false);
    }
  };

  // Disconnect Google Drive
  const handleDisconnectDrive = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Drive? New team uploads will require re-authentication.",
      )
    ) {
      return;
    }
    setIsDisconnectingDrive(true);
    try {
      const res = await fetch("/api/admin/drive/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Google Drive disconnected successfully.");
        setDriveTestResult(null);
        await fetchData();
      } else {
        toast.error("Failed to disconnect Google Drive.");
      }
    } catch {
      toast.error("Network error while disconnecting Drive.");
    } finally {
      setIsDisconnectingDrive(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.error("No registrations available to export.");
      return;
    }

    const headers = [
      "Ticket ID",
      "Team Name",
      "Status",
      "Track ID",
      "College Name",
      "City",
      "State",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "Leader WhatsApp",
      "Total Members",
      "Payment Mode",
      "UTR Number",
      "Payment Status",
      "Accommodation Required",
      "Hostel Block",
      "Room Number",
      "College ID Drive Link",
      "Synopsis Drive Link",
      "Registered At",
    ];

    const rows = registrations.map((r) => [
      r.registrationNumber,
      `"${r.teamName.replace(/"/g, '""')}"`,
      r.status,
      r.problemStatementId || "Unassigned",
      `"${r.collegeName.replace(/"/g, '""')}"`,
      `"${r.collegeAddress?.city || ""}"`,
      `"${r.collegeAddress?.state || ""}"`,
      `"${r.leaderName.replace(/"/g, '""')}"`,
      r.leaderEmail,
      r.leaderPhone,
      r.leaderWhatsapp || "",
      1 + (r.members?.length || 0),
      r.paymentMode || "FREE",
      r.transactionId || "",
      r.paymentStatus || "FREE_TIER",
      r.accommodationRequired ? "YES" : "NO",
      r.hostelBlock || "",
      r.roomNumber || "",
      r.documents?.collegeIdDriveUrl || "",
      r.documents?.synopsisDriveUrl || "",
      new Date(r.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `hackverse2026_registrations_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export initiated.");
  };

  // Helper to extract and resolve problem statements for a squad
  const getSquadPs = useCallback((squad: RegistrationRecord | null) => {
    if (!squad) return { p1: null, p2: null, p1Raw: null, p2Raw: null, hasPs: false, psSubmittedAt: null };
    const docs = squad.documents || {};
    const selectedList: string[] = Array.isArray(docs.selectedProblemStatements)
      ? docs.selectedProblemStatements
      : [];
    const p1Raw = squad.problemStatementId || docs.problemStatement1 || selectedList[0] || null;
    const p2Raw = docs.problemStatement2 || selectedList[1] || null;

    const resolve = (val: string | null) => {
      if (!val) return null;
      return (
        PROBLEM_STATEMENTS_DATA.find(
          (p) =>
            p.id.toLowerCase() === val.toLowerCase() ||
            p.code.toLowerCase() === val.toLowerCase()
        ) || null
      );
    };

    const p1 = resolve(p1Raw);
    const p2 = resolve(p2Raw);

    return {
      p1Raw,
      p2Raw,
      p1,
      p2,
      hasPs: Boolean(p1 || p1Raw),
      psSubmittedAt: docs.psSubmittedAt || null,
    };
  }, []);

  // Filtered Squads
  const query = (searchQuery || "").toLowerCase().trim();
  const filteredSquads = registrations.filter((squad) => {
    if (!squad) return false;
    const { p1, p2, p1Raw, hasPs } = getSquadPs(squad);

    const matchesSearch =
      !query ||
      (squad.teamName || "").toLowerCase().includes(query) ||
      (squad.leaderName || "").toLowerCase().includes(query) ||
      (squad.leaderEmail || "").toLowerCase().includes(query) ||
      (squad.registrationNumber || "").toLowerCase().includes(query) ||
      (squad.collegeName || "").toLowerCase().includes(query) ||
      (squad.transactionId || "").toLowerCase().includes(query) ||
      (p1?.title || "").toLowerCase().includes(query) ||
      (p1?.code || "").toLowerCase().includes(query) ||
      (p2?.title || "").toLowerCase().includes(query) ||
      (p2?.code || "").toLowerCase().includes(query) ||
      (p1Raw || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || squad.status === statusFilter;
    const matchesPs =
      psFilter === "ALL"
        ? true
        : psFilter === "UNASSIGNED"
        ? !hasPs
        : p1?.id === psFilter ||
          p1?.code === psFilter ||
          p2?.id === psFilter ||
          p2?.code === psFilter ||
          p1Raw === psFilter;
    const matchesAccom =
      accomFilter === "ALL" ||
      (accomFilter === "REQUESTED" && squad.accommodationRequired) ||
      (accomFilter === "ALLOCATED" &&
        squad.accommodationStatus === "ALLOCATED") ||
      (accomFilter === "NOT_REQUESTED" && !squad.accommodationRequired);

    const matchesPayment =
      paymentFilter === "ALL" ||
      (paymentFilter === "FREE_TIER" &&
        (!squad.paymentStatus || squad.paymentStatus === "FREE_TIER")) ||
      squad.paymentStatus === paymentFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPs &&
      matchesAccom &&
      matchesPayment
    );
  });

  // Filtered Squads for Problem Statements Section
  const psTrackerFilteredSquads = registrations.filter((squad) => {
    if (!squad) return false;
    const { p1, p2, p1Raw, p2Raw, hasPs } = getSquadPs(squad);
    const q = (psTrackerSearch || "").toLowerCase().trim();
    const matchesSearch =
      !q ||
      (squad.teamName || "").toLowerCase().includes(q) ||
      (squad.leaderName || "").toLowerCase().includes(q) ||
      (squad.leaderEmail || "").toLowerCase().includes(q) ||
      (squad.registrationNumber || "").toLowerCase().includes(q) ||
      (squad.collegeName || "").toLowerCase().includes(q) ||
      (p1?.title || "").toLowerCase().includes(q) ||
      (p1?.code || "").toLowerCase().includes(q) ||
      (p2?.title || "").toLowerCase().includes(q) ||
      (p2?.code || "").toLowerCase().includes(q) ||
      (p1Raw || "").toLowerCase().includes(q) ||
      (p2Raw || "").toLowerCase().includes(q);

    const matchesFilter =
      psTrackerFilter === "ALL"
        ? true
        : psTrackerFilter === "UNASSIGNED"
        ? !hasPs
        : p1?.id === psTrackerFilter ||
          p1?.code === psTrackerFilter ||
          p2?.id === psTrackerFilter ||
          p2?.code === psTrackerFilter ||
          p1Raw === psTrackerFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate Metrics
  const totalSquadCount = stats?.totalSquads ?? registrations.length;
  const confirmedCount =
    stats?.confirmedTeams ??
    registrations.filter((r) => r.status === "CONFIRMED").length;
  const pendingCount =
    stats?.pendingTeams ??
    registrations.filter((r) => r.status === "PENDING_VERIFICATION").length;
  const totalHackerCount =
    stats?.totalParticipants ??
    registrations.reduce((acc, r) => acc + 1 + (r.members?.length || 0), 0);
  const accomRequestedCount =
    stats?.accommodationRequested ??
    registrations.filter((r) => r.accommodationRequired).length;
  const accomAllocatedCount =
    stats?.accommodationAllocated ??
    registrations.filter((r) => r.accommodationStatus === "ALLOCATED").length;
  const assignedPsCount = registrations.filter((r) => getSquadPs(r).hasPs).length;
  const unassignedPsCount = registrations.filter((r) => !getSquadPs(r).hasPs).length;

  // Render Authentication Warning if not logged in as Admin
  if (!isPending && !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-100 text-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md border-4 border-black bg-white p-8 space-y-6 shadow-neo-xl text-center">
          <div className="w-16 h-16 bg-rose-400 border-3 border-black text-black flex items-center justify-center mx-auto shadow-neo-sm">
            <ShieldAlert className="w-8 h-8 stroke-[2.5px]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              Administrator Clearance Required
            </h2>
            <p className="text-xs font-bold text-neutral-600 leading-relaxed font-mono">
              This terminal is reserved for authorized CodeBreakers HACKVERSE
              &apos;26 operations personnel.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-amber-300 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Authenticate with Admin OAuth</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase border-2 border-black transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex font-sans antialiased selection:bg-amber-300 selection:text-black">
      {/* ========================================================================= */}
      {/* NEO-BRUTALIST SIDEBAR NAVIGATION                                         */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r-4 border-black flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b-3 border-black">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white border-3 border-black flex items-center justify-center p-1 shadow-neo-sm overflow-hidden shrink-0">
                <img
                  src="/cbhack.png"
                  alt="HACKVERSE '26 Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight uppercase leading-none">
                  HACKVERSE &apos;26
                </span>
                <span className="text-[10px] font-mono font-bold text-neutral-600 tracking-wider mt-1">
                  CODEBREAKERS OPS
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 border-2 border-black hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="p-3 bg-amber-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-mono text-xs font-black uppercase text-emerald-950">
                LIVE OPS ACTIVE
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-neutral-600">
              {currentTime}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {[
              {
                id: "dashboard",
                label: "Dashboard Overview",
                icon: LayoutDashboard,
                badge: totalSquadCount,
              },
              {
                id: "teams",
                label: "Squads & Rosters",
                icon: Users,
                badge: totalSquadCount,
              },
              {
                id: "problems",
                label: "Problem Statements",
                icon: Compass,
                badge: assignedPsCount,
              },
              {
                id: "accomodation",
                label: "Hostel Allocation",
                icon: BedDouble,
                badge: accomRequestedCount,
              },
              {
                id: "payments",
                label: "Payment Verification",
                icon: CreditCard,
                badge: stats?.paymentPending ?? 0,
              },
              {
                id: "scanner",
                label: "Scanner & Judge PIN",
                icon: KeyRound,
                badge: scannerData.active
                  ? `${scannerData.session?.activeDeviceCount || 0}/8`
                  : undefined,
              },
              {
                id: "settings",
                label: "Storage & Settings",
                icon: Settings,
                badge: settings.googleDriveEnabled ? "DRIVE" : undefined,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 border-2 border-black font-black text-xs uppercase tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-300 text-black shadow-neo-sm translate-x-1"
                      : "bg-white hover:bg-neutral-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2.5px]" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Sign Out Footer */}
        <div className="p-4 border-t-3 border-black bg-neutral-50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-300 border-2 border-black flex items-center justify-center font-black text-xs shrink-0">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-xs truncate uppercase">
                {user?.name || "Administrator"}
              </div>
              <div className="font-mono text-[10px] text-neutral-500 truncate">
                {user?.email || "admin@gcek.ac.in"}
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full py-2 bg-white hover:bg-rose-100 text-rose-700 border-2 border-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[2.5px]" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b-4 border-black px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <PanelLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span>
                  {activeTab === "dashboard" && "Command Dashboard"}
                  {activeTab === "teams" && "Squad Rosters & Verification"}
                  {activeTab === "problems" && "Problem Statements & Squad Selections"}
                  {activeTab === "accomodation" && "Hostel & Room Allocation"}
                  {activeTab === "payments" && "Finance & Transaction Audit"}
                  {activeTab === "scanner" && "Live Scanner & Judge PIN Control"}
                  {activeTab === "settings" && "Storage & System Controls"}
                </span>
              </h1>
              <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wide hidden sm:block">
                HACKVERSE 2026 // GOVERNMENT COLLEGE OF ENGINEERING KALAHANDI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black font-mono font-black text-xs uppercase flex items-center gap-2 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">SYNC</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span className="hidden sm:inline">EXPORT CSV</span>
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* ===================================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW                                             */}
          {/* ===================================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-6 bg-amber-300 border-4 border-black shadow-neo space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      TOTAL SQUADS
                    </span>
                    <Users className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-4xl font-black font-mono text-black">
                    {totalSquadCount}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    {totalHackerCount} Registered Hackers
                  </div>
                </div>

                <div className="p-6 bg-emerald-300 border-4 border-black shadow-neo space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      ROSTER CONFIRMED
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-4xl font-black font-mono text-black">
                    {confirmedCount}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    {totalSquadCount > 0
                      ? Math.round((confirmedCount / totalSquadCount) * 100)
                      : 0}
                    % Confirmation Rate
                  </div>
                </div>

                <div className="p-6 bg-orange-200 border-4 border-black shadow-neo space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      PENDING AUDIT
                    </span>
                    <Clock className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-4xl font-black font-mono text-black">
                    {pendingCount}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    Requires ID &amp; Synopsis Verification
                  </div>
                </div>

                <div className="p-6 bg-cyan-200 border-4 border-black shadow-neo space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      HOSTEL ALLOCATED
                    </span>
                    <BedDouble className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-4xl font-black font-mono text-black">
                    {accomAllocatedCount}{" "}
                    <span className="text-lg text-black/60">
                      / {accomRequestedCount}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    {accomRequestedCount - accomAllocatedCount} Pending Room
                    Assignment
                  </div>
                </div>
              </div>

              {/* Problem Statement Track Distribution */}
              <div className="border-4 border-black bg-white p-6 shadow-neo space-y-4">
                <div className="flex items-center justify-between border-b-3 border-black pb-3">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-5 h-5 stroke-[2.5px]" />
                    <h3 className="font-black text-lg uppercase tracking-tight">
                      Track &amp; Challenge Distribution
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-1">
                    {PROBLEM_STATEMENTS_DATA.length} TRACKS LIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROBLEM_STATEMENTS_DATA.map((ps) => {
                    const count = registrations.filter(
                      (r) => r.problemStatementId === ps.id,
                    ).length;
                    return (
                      <div
                        key={ps.id}
                        onClick={() => {
                          setActiveTab("problems");
                          setPsTrackerFilter(ps.id);
                          setPsViewMode("grouped");
                        }}
                        className="p-4 bg-neutral-50 hover:bg-amber-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2 cursor-pointer transition-all hover:-translate-y-0.5"
                        title="Click to view all squads choosing this Problem Statement"
                      >
                        <div className="flex items-center justify-between font-mono text-xs font-black">
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 border border-black">
                            {ps.id}
                          </span>
                          <span className="text-black font-mono font-black">
                            {count} Squads
                          </span>
                        </div>
                        <div className="font-black text-sm text-black truncate">
                          {ps.title}
                        </div>
                        <div className="font-mono text-[10px] text-neutral-500 uppercase">
                          {ps.category}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Recent Registrations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fast Controls Card */}
                <div className="border-4 border-black bg-amber-300 p-6 shadow-neo space-y-4">
                  <h3 className="font-black text-base uppercase tracking-tight flex items-center gap-2">
                    <Zap className="w-5 h-5 stroke-[2.5px]" />
                    <span>Quick Operations</span>
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setActiveTab("teams");
                        setStatusFilter("PENDING_VERIFICATION");
                      }}
                      className="w-full px-4 py-3 bg-white text-black font-black text-xs uppercase border-3 border-black shadow-neo-sm hover:bg-neutral-100 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Review Pending Squads</span>
                      <span className="font-mono bg-black text-white px-2 py-0.5 text-[10px]">
                        {pendingCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className="w-full px-4 py-3 bg-white text-black font-black text-xs uppercase border-3 border-black shadow-neo-sm hover:bg-neutral-100 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Configure Google Drive Storage</span>
                      <HardDrive className="w-4 h-4 stroke-[2.5px]" />
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="w-full px-4 py-3 bg-black text-white font-black text-xs uppercase border-3 border-black shadow-neo-sm hover:bg-neutral-800 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Download Master CSV Sheet</span>
                      <Download className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                  </div>
                </div>

                {/* Recent Submissions Feed */}
                <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-neo space-y-4">
                  <div className="flex items-center justify-between border-b-3 border-black pb-3">
                    <h3 className="font-black text-base uppercase tracking-tight flex items-center gap-2">
                      <Clock className="w-5 h-5 stroke-[2.5px]" />
                      <span>Recent Squad Registrations</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("teams")}
                      className="font-mono text-xs font-black underline uppercase cursor-pointer"
                    >
                      VIEW ALL &rarr;
                    </button>
                  </div>

                  <div className="space-y-3">
                    {registrations.slice(0, 4).map((squad) => (
                      <div
                        key={squad.id}
                        onClick={() => {
                          setSelectedSquad(squad);
                          setIsSquadSheetOpen(true);
                        }}
                        className="p-3.5 bg-neutral-50 hover:bg-amber-50 border-2 border-black flex items-center justify-between gap-4 cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-xs text-amber-700 bg-amber-100 px-1.5 py-0.5 border border-black">
                              {squad.registrationNumber}
                            </span>
                            <span className="font-black text-sm uppercase truncate">
                              {squad.teamName}
                            </span>
                            {squad.accommodationRequired && (
                              <span className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black inline-flex items-center gap-1 ${
                                squad.accommodationStatus === "ALLOCATED"
                                  ? "bg-emerald-200 text-emerald-950"
                                  : "bg-purple-200 text-purple-950"
                              }`}>
                                <BedDouble className="w-2.5 h-2.5" />
                                {squad.accommodationStatus === "ALLOCATED" ? "HOSTEL ALLOCATED" : "HOSTEL REQ"}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-neutral-600 truncate">
                            {squad.collegeName} &bull; Leader:{" "}
                            {squad.leaderName}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${
                              squad.status === "CONFIRMED"
                                ? "bg-emerald-300 text-emerald-950"
                                : squad.status === "BANNED"
                                  ? "bg-rose-600 text-white"
                                  : squad.status === "REJECTED"
                                    ? "bg-rose-300 text-rose-950"
                                    : "bg-amber-200 text-amber-950"
                            }`}
                          >
                            {squad.status === "BANNED" ? "BANNED" : squad.status}
                          </span>
                          <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: SQUADS & ROSTERS TABLE                                         */}
          {/* ===================================================================== */}
          {activeTab === "teams" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Filter Controls Bar */}
              <div className="border-4 border-black bg-white p-5 shadow-neo space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search Input */}
                  <div className="sm:col-span-5 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 stroke-[2.5px]" />
                    <input
                      type="text"
                      placeholder="Search squad, leader, college, ticket ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="sm:col-span-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">ALL STATUSES</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PENDING_VERIFICATION">
                        PENDING VERIFICATION
                      </option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="BANNED">BANNED / DISQUALIFIED</option>
                    </select>
                  </div>

                  {/* Track Filter */}
                  <div className="sm:col-span-4">
                    <select
                      value={psFilter}
                      onChange={(e) => setPsFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">ALL TRACKS</option>
                      {PROBLEM_STATEMENTS_DATA.map((ps) => (
                        <option key={ps.id} value={ps.id}>
                          {ps.id} - {ps.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-600 pt-1 border-t-2 border-neutral-200">
                  <span>
                    SHOWING {filteredSquads.length} OF {registrations.length}{" "}
                    REGISTERED SQUADS
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-rose-700 underline cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>

              {/* Squads Neo Table */}
              <div className="border-4 border-black bg-white shadow-neo overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                      <th className="p-3.5">Ticket ID</th>
                      <th className="p-3.5">Squad Name</th>
                      <th className="p-3.5">Leader &amp; Contact</th>
                      <th className="p-3.5">College &amp; Track</th>
                      <th className="p-3.5">Documents</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black font-sans text-xs">
                    {filteredSquads.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-8 text-center font-mono font-bold text-neutral-500"
                        >
                          NO SQUADS FOUND MATCHING THE SELECTED CRITERIA.
                        </td>
                      </tr>
                    ) : (
                      filteredSquads.map((squad) => (
                        <tr
                          key={squad.id}
                          className="hover:bg-amber-50/60 transition-colors"
                        >
                          <td className="p-3.5 font-mono font-black text-amber-900 whitespace-nowrap">
                            <span className="bg-amber-100 px-2 py-1 border border-black">
                              {squad.registrationNumber}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="font-black text-sm uppercase text-black">
                              {squad.teamName}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="font-mono text-[10px] text-neutral-600 font-bold">
                                {1 + (squad.members?.length || 0)} Members
                              </span>
                              {squad.accommodationRequired && (
                                <span
                                  className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black inline-flex items-center gap-1 ${
                                    squad.accommodationStatus === "ALLOCATED"
                                      ? "bg-emerald-200 text-emerald-950"
                                      : "bg-purple-200 text-purple-950"
                                  }`}
                                  title={
                                    squad.accommodationStatus === "ALLOCATED"
                                      ? `Hostel Allocated: Block ${squad.hostelBlock || "-"}, Room ${squad.roomNumber || "-"}`
                                      : "On-Campus Hostel Accommodation Requested"
                                  }
                                >
                                  <BedDouble className="w-2.5 h-2.5 shrink-0" />
                                  <span>
                                    {squad.accommodationStatus === "ALLOCATED"
                                      ? `${squad.hostelBlock || "ALLOCATED"} • Rm ${squad.roomNumber || "-"}`
                                      : "HOSTEL: REQ"}
                                  </span>
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-black">
                              {squad.leaderName}
                            </div>
                            <div className="font-mono text-[11px] text-neutral-600">
                              {squad.leaderEmail}
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500">
                              {squad.leaderPhone}
                            </div>
                          </td>

                          <td className="p-3.5 max-w-[220px]">
                            <div className="font-medium text-black truncate">
                              {squad.collegeName}
                            </div>
                            {(() => {
                              const { p1, p2, p1Raw, hasPs } = getSquadPs(squad);
                              if (p1) {
                                return (
                                  <div className="mt-1 space-y-0.5">
                                    <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 bg-amber-300 text-amber-950 border border-black inline-block">
                                      {p1.code}
                                    </span>
                                    <div className="font-sans text-[11px] font-bold text-neutral-800 line-clamp-1">
                                      {p1.title}
                                    </div>
                                    {p2 && (
                                      <div className="font-mono text-[9px] text-neutral-500 font-bold">
                                        + #2: {p2.code}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              if (p1Raw) {
                                return (
                                  <div className="font-mono text-[10px] text-amber-800 font-bold mt-0.5">
                                    Track: {p1Raw}
                                  </div>
                                );
                              }
                              return (
                                <div className="font-mono text-[10px] text-rose-600 font-bold mt-0.5 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                                  <span>No Track Selected</span>
                                </div>
                              );
                            })()}
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-col gap-1.5">
                              {squad.documents?.collegeIdDriveUrl ||
                              squad.documents?.collegeIdUrl ||
                              squad.documents?.collegeIdFileName ? (
                                <button
                                  onClick={() => {
                                    setSelectedPaymentSquad(squad);
                                    setActiveProofTab("collegeId");
                                    setIsPaymentProofModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer text-left"
                                  title="Instant authenticated preview"
                                >
                                  <HardDrive className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate max-w-[130px]">
                                    {squad.documents?.collegeIdFileName || "Student ID"}
                                  </span>
                                </button>
                              ) : (
                                <span className="font-mono text-[10px] text-neutral-400">
                                  No ID File
                                </span>
                              )}

                              {squad.documents?.synopsisDriveUrl ||
                              squad.documents?.synopsisUrl ||
                              squad.documents?.synopsisFileName ? (
                                <button
                                  onClick={() => {
                                    setSelectedPaymentSquad(squad);
                                    setActiveProofTab("synopsis");
                                    setIsPaymentProofModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer text-left"
                                  title="Instant authenticated preview"
                                >
                                  <FileText className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate max-w-[130px]">
                                    {squad.documents?.synopsisFileName || "Synopsis"}
                                  </span>
                                </button>
                              ) : null}
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block font-mono text-[10px] font-black uppercase px-2.5 py-1 border-2 border-black ${
                                squad.status === "CONFIRMED"
                                  ? "bg-emerald-300 text-emerald-950"
                                  : squad.status === "BANNED"
                                    ? "bg-rose-600 text-white"
                                    : squad.status === "REJECTED"
                                      ? "bg-rose-300 text-rose-950"
                                      : "bg-amber-200 text-amber-950"
                              }`}
                            >
                              {squad.status === "BANNED" ? "BANNED" : squad.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedPassSquad(squad);
                                  setIsPassModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1"
                                title="Download / Print Entry Pass & Desk QR Badge"
                              >
                                <QrCode className="w-3 h-3" />
                                <span>PASS / QR</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedSquad(squad);
                                  setIsSquadSheetOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                              >
                                INSPECT
                              </button>

                              {squad.status !== "CONFIRMED" && squad.status !== "BANNED" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(squad.id, "CONFIRMED")
                                  }
                                  disabled={isUpdating}
                                  className="px-2.5 py-1.5 bg-emerald-300 hover:bg-emerald-400 border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                  title="Approve and send Entry Pass email"
                                >
                                  APPROVE
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB: PROBLEM STATEMENTS & SQUAD SELECTIONS                             */}
          {/* ===================================================================== */}
          {activeTab === "problems" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 bg-amber-300 border-4 border-black shadow-neo space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      LIVE CHALLENGES
                    </span>
                    <Compass className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-3xl font-black font-mono text-black">
                    {PROBLEM_STATEMENTS_DATA.length}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    Official Track Catalog
                  </div>
                </div>

                <div className="p-5 bg-emerald-300 border-4 border-black shadow-neo space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      ASSIGNED SQUADS
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-3xl font-black font-mono text-black">
                    {assignedPsCount}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    {totalSquadCount > 0
                      ? Math.round((assignedPsCount / totalSquadCount) * 100)
                      : 0}
                    % Squads with Selected PS
                  </div>
                </div>

                <div className="p-5 bg-rose-200 border-4 border-black shadow-neo space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      UNASSIGNED SQUADS
                    </span>
                    <ShieldAlert className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-3xl font-black font-mono text-black">
                    {unassignedPsCount}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    Awaiting Track Selection
                  </div>
                </div>

                <div className="p-5 bg-cyan-200 border-4 border-black shadow-neo space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-black/70">
                      ACTIVE RATIO
                    </span>
                    <Users className="w-5 h-5 text-black stroke-[2.5px]" />
                  </div>
                  <div className="text-3xl font-black font-mono text-black">
                    {PROBLEM_STATEMENTS_DATA.length > 0
                      ? (assignedPsCount / PROBLEM_STATEMENTS_DATA.length).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="font-mono text-xs font-bold text-black/80">
                    Avg Squads per Track
                  </div>
                </div>
              </div>

              {/* Filter Controls & View Switcher */}
              <div className="border-4 border-black bg-white p-5 shadow-neo space-y-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  {/* Search and Filter Inputs */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7 relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 stroke-[2.5px]" />
                      <input
                        type="text"
                        placeholder="Search squad name, leader, college, ticket ID, track..."
                        value={psTrackerSearch}
                        onChange={(e) => setPsTrackerSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <select
                        value={psTrackerFilter}
                        onChange={(e) => setPsTrackerFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">ALL PROBLEM STATEMENTS</option>
                        {PROBLEM_STATEMENTS_DATA.map((ps) => (
                          <option key={ps.id} value={ps.id}>
                            {ps.code || ps.id} — {ps.title.length > 30 ? ps.title.slice(0, 30) + "..." : ps.title}
                          </option>
                        ))}
                        <option value="UNASSIGNED">UNASSIGNED / NO PS SELECTED</option>
                      </select>
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 border-2 border-black p-1 bg-neutral-100 shrink-0">
                    <button
                      onClick={() => setPsViewMode("grouped")}
                      className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                        psViewMode === "grouped"
                          ? "bg-black text-white shadow-sm"
                          : "text-neutral-700 hover:text-black"
                      }`}
                    >
                      By Challenge
                    </button>
                    <button
                      onClick={() => setPsViewMode("table")}
                      className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                        psViewMode === "table"
                          ? "bg-black text-white shadow-sm"
                          : "text-neutral-700 hover:text-black"
                      }`}
                    >
                      Full Matrix
                    </button>
                    <button
                      onClick={() => {
                        setPsViewMode("unassigned");
                        setPsTrackerFilter("UNASSIGNED");
                      }}
                      className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                        psViewMode === "unassigned"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "text-neutral-700 hover:text-black"
                      }`}
                    >
                      Unassigned ({unassignedPsCount})
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-600 pt-2 border-t-2 border-neutral-200">
                  <span>
                    FILTER: {psTrackerFilter === "ALL" ? "ALL CHALLENGES" : psTrackerFilter}
                    {psTrackerSearch ? ` • QUERY: "${psTrackerSearch}"` : ""}
                  </span>
                  {(psTrackerSearch || psTrackerFilter !== "ALL") && (
                    <button
                      onClick={() => {
                        setPsTrackerSearch("");
                        setPsTrackerFilter("ALL");
                      }}
                      className="text-rose-700 underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* VIEW 1: GROUPED BY CHALLENGE TRACK */}
              {psViewMode === "grouped" && (
                <div className="space-y-6">
                  {PROBLEM_STATEMENTS_DATA.filter((ps) =>
                    psTrackerFilter === "ALL" ? true : ps.id === psTrackerFilter || ps.code === psTrackerFilter
                  ).map((ps) => {
                    const q = psTrackerSearch.toLowerCase().trim();
                    const matchingSquads = registrations.filter((squad) => {
                      const { p1, p2, p1Raw, p2Raw } = getSquadPs(squad);
                      const isMatch =
                        p1?.id === ps.id ||
                        p1?.code === ps.code ||
                        p2?.id === ps.id ||
                        p2?.code === ps.code ||
                        (p1Raw && (p1Raw.toLowerCase() === ps.id.toLowerCase() || p1Raw.toLowerCase() === ps.code.toLowerCase())) ||
                        (p2Raw && (p2Raw.toLowerCase() === ps.id.toLowerCase() || p2Raw.toLowerCase() === ps.code.toLowerCase()));

                      if (!isMatch) return false;
                      if (!q) return true;
                      return (
                        (squad.teamName || "").toLowerCase().includes(q) ||
                        (squad.leaderName || "").toLowerCase().includes(q) ||
                        (squad.leaderEmail || "").toLowerCase().includes(q) ||
                        (squad.registrationNumber || "").toLowerCase().includes(q) ||
                        (squad.collegeName || "").toLowerCase().includes(q)
                      );
                    });

                    return (
                      <div
                        key={ps.id}
                        className="border-4 border-black bg-white shadow-neo space-y-4 p-5 sm:p-6"
                      >
                        {/* Problem Statement Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-3 border-black pb-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-black text-xs text-amber-900 bg-amber-300 px-2.5 py-1 border-2 border-black">
                                {ps.code || ps.id}
                              </span>
                              <span className="font-mono font-bold text-xs bg-neutral-100 text-neutral-800 px-2.5 py-1 border-2 border-black">
                                {ps.category}
                              </span>
                              <span className="font-mono text-xs font-bold text-neutral-600">
                                Domain: {ps.domain}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                              {ps.title}
                            </h3>
                            <p className="text-xs text-neutral-600 line-clamp-2 max-w-4xl">
                              {ps.shortDescription}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-2 self-start md:self-auto">
                            <span className="font-mono font-black text-xs px-3 py-1.5 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {matchingSquads.length} SQUADS SELECTED
                            </span>
                          </div>
                        </div>

                        {/* Squads Assigned to this PS */}
                        {matchingSquads.length === 0 ? (
                          <div className="p-6 bg-neutral-50 border-2 border-dashed border-neutral-300 text-center font-mono text-xs font-bold text-neutral-500">
                            No squads matching current filter have selected this challenge yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            {matchingSquads.map((squad) => {
                              const { p1, p2, p1Raw } = getSquadPs(squad);
                              const isP1 =
                                p1?.id === ps.id ||
                                p1?.code === ps.code ||
                                (p1Raw && (p1Raw.toLowerCase() === ps.id.toLowerCase() || p1Raw.toLowerCase() === ps.code.toLowerCase()));
                              const isP2 = p2?.id === ps.id || p2?.code === ps.code;

                              return (
                                <div
                                  key={squad.id}
                                  className="p-4 bg-amber-50/50 hover:bg-amber-100/70 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3 transition-all flex flex-col justify-between"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-mono font-black text-xs text-amber-800 bg-white px-2 py-0.5 border border-black">
                                        {squad.registrationNumber}
                                      </span>
                                      <span
                                        className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black ${
                                          squad.status === "CONFIRMED"
                                            ? "bg-emerald-300 text-emerald-950"
                                            : squad.status === "BANNED"
                                            ? "bg-rose-600 text-white"
                                            : squad.status === "REJECTED"
                                            ? "bg-rose-300 text-rose-950"
                                            : "bg-amber-200 text-amber-950"
                                        }`}
                                      >
                                        {squad.status === "BANNED" ? "BANNED" : squad.status}
                                      </span>
                                    </div>

                                    <div>
                                      <div className="font-black text-sm uppercase text-black">
                                        {squad.teamName}
                                      </div>
                                      <div className="font-mono text-[11px] text-neutral-600 truncate">
                                        {squad.collegeName}
                                      </div>
                                    </div>

                                    {/* Preference Badge */}
                                    <div className="pt-0.5">
                                      {isP1 ? (
                                        <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-amber-300 text-amber-950 border border-black inline-flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                                          <span>CHOICE #1 (PRIMARY)</span>
                                        </span>
                                      ) : isP2 ? (
                                        <span className="font-mono text-[9px] font-black uppercase px-2 py-0.5 bg-blue-200 text-blue-950 border border-black inline-flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                                          <span>CHOICE #2 (BACKUP)</span>
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="p-2 bg-white border border-neutral-300 text-[11px] space-y-0.5 font-mono">
                                      <div className="font-bold text-neutral-800 truncate">
                                        Leader: {squad.leaderName}
                                      </div>
                                      <div className="text-neutral-600 truncate text-[10px]">
                                        {squad.leaderEmail}
                                      </div>
                                      <div className="text-neutral-600 text-[10px]">
                                        Phone: {squad.leaderPhone}
                                      </div>
                                      <div className="text-neutral-500 text-[10px]">
                                        Total Members: {1 + (squad.members?.length || 0)}
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => {
                                      setSelectedSquad(squad);
                                      setIsSquadSheetOpen(true);
                                    }}
                                    className="w-full py-2 bg-white hover:bg-black hover:text-white text-black border-2 border-black font-black font-mono text-[11px] uppercase transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Inspect Squad</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW 2: FULL TABULAR MATRIX */}
              {psViewMode === "table" && (
                <div className="border-4 border-black bg-white shadow-neo overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                        <th className="p-3.5">Ticket ID</th>
                        <th className="p-3.5">Squad Name</th>
                        <th className="p-3.5">Leader &amp; Contact</th>
                        <th className="p-3.5">College</th>
                        <th className="p-3.5">Choice #1 (Primary)</th>
                        <th className="p-3.5">Choice #2 (Backup)</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black font-sans text-xs">
                      {psTrackerFilteredSquads.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-8 text-center font-mono font-bold text-neutral-500"
                          >
                            NO SQUADS FOUND MATCHING THE SELECTED TRACK FILTERS.
                          </td>
                        </tr>
                      ) : (
                        psTrackerFilteredSquads.map((squad) => {
                          const { p1, p2, p1Raw, p2Raw, hasPs } = getSquadPs(squad);

                          return (
                            <tr
                              key={squad.id}
                              className="hover:bg-amber-50/60 transition-colors"
                            >
                              <td className="p-3.5 font-mono font-black">
                                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 border border-black">
                                  {squad.registrationNumber}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="font-black uppercase">{squad.teamName}</div>
                                <div className="font-mono text-[10px] text-neutral-500">
                                  {1 + (squad.members?.length || 0)} Members
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold">{squad.leaderName}</div>
                                <div className="font-mono text-[11px] text-neutral-600">
                                  {squad.leaderEmail}
                                </div>
                                <div className="font-mono text-[10px] text-neutral-500">
                                  {squad.leaderPhone}
                                </div>
                              </td>
                              <td className="p-3.5 font-mono text-[11px] text-neutral-700 max-w-xs truncate">
                                {squad.collegeName}
                              </td>
                              {/* Primary Track */}
                              <td className="p-3.5 max-w-xs">
                                {p1 ? (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono font-black text-[10px] bg-amber-300 text-amber-950 px-1.5 py-0.5 border border-black">
                                        {p1.code || p1.id}
                                      </span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">
                                        {p1.category}
                                      </span>
                                    </div>
                                    <div className="font-black text-xs text-black truncate">
                                      {p1.title}
                                    </div>
                                  </div>
                                ) : p1Raw ? (
                                  <span className="font-mono text-xs font-black text-neutral-800 bg-neutral-100 px-2 py-0.5 border border-black">
                                    {p1Raw}
                                  </span>
                                ) : (
                                  <span className="font-mono text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 border border-rose-400">
                                    UNASSIGNED
                                  </span>
                                )}
                              </td>
                              {/* Secondary Track */}
                              <td className="p-3.5 max-w-xs">
                                {p2 ? (
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono font-black text-[10px] bg-blue-200 text-blue-950 px-1.5 py-0.5 border border-black">
                                        {p2.code || p2.id}
                                      </span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">
                                        {p2.category}
                                      </span>
                                    </div>
                                    <div className="font-bold text-xs text-neutral-800 truncate">
                                      {p2.title}
                                    </div>
                                  </div>
                                ) : p2Raw ? (
                                  <span className="font-mono text-xs font-black text-neutral-800 bg-neutral-100 px-2 py-0.5 border border-black">
                                    {p2Raw}
                                  </span>
                                ) : (
                                  <span className="font-mono text-xs text-neutral-400 font-bold">
                                    — None —
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                                    squad.status === "CONFIRMED"
                                      ? "bg-emerald-300 text-emerald-950"
                                      : squad.status === "BANNED"
                                      ? "bg-rose-600 text-white"
                                      : squad.status === "REJECTED"
                                      ? "bg-rose-300 text-rose-950"
                                      : "bg-amber-200 text-amber-950"
                                  }`}
                                >
                                  {squad.status === "BANNED" ? "BANNED" : squad.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedSquad(squad);
                                    setIsSquadSheetOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                >
                                  INSPECT
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VIEW 3: UNASSIGNED SQUADS QUEUE */}
              {psViewMode === "unassigned" && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-100 border-3 border-black shadow-neo-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-700 stroke-[2.5px]" />
                      <span className="font-mono text-xs font-black uppercase text-rose-950">
                        {unassignedPsCount} Squads have not yet selected a challenge track
                      </span>
                    </div>
                  </div>

                  <div className="border-4 border-black bg-white shadow-neo overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                          <th className="p-3.5">Ticket ID</th>
                          <th className="p-3.5">Squad Name</th>
                          <th className="p-3.5">Leader &amp; Contact</th>
                          <th className="p-3.5">College</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black font-sans text-xs">
                        {registrations.filter((r) => !getSquadPs(r).hasPs).length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="p-8 text-center font-mono font-bold text-emerald-700"
                            >
                              ALL REGISTERED SQUADS HAVE SELECTED A PROBLEM STATEMENT!
                            </td>
                          </tr>
                        ) : (
                          registrations
                            .filter((r) => !getSquadPs(r).hasPs)
                            .map((squad) => (
                              <tr key={squad.id} className="hover:bg-rose-50/50">
                                <td className="p-3.5 font-mono font-black">
                                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 border border-black">
                                    {squad.registrationNumber}
                                  </span>
                                </td>
                                <td className="p-3.5 font-black uppercase">{squad.teamName}</td>
                                <td className="p-3.5">
                                  <div className="font-bold">{squad.leaderName}</div>
                                  <div className="font-mono text-[11px] text-neutral-600">
                                    {squad.leaderEmail} &bull; {squad.leaderPhone}
                                  </div>
                                </td>
                                <td className="p-3.5 font-mono text-[11px] text-neutral-700">
                                  {squad.collegeName}
                                </td>
                                <td className="p-3.5">
                                  <span
                                    className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                                      squad.status === "CONFIRMED"
                                        ? "bg-emerald-300 text-emerald-950"
                                        : "bg-amber-200 text-amber-950"
                                    }`}
                                  >
                                    {squad.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedSquad(squad);
                                      setIsSquadSheetOpen(true);
                                    }}
                                    className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                  >
                                    INSPECT
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: HOSTEL ALLOCATION                                              */}
          {/* ===================================================================== */}
          {activeTab === "accomodation" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-200 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-purple-950">
                    REQUESTED ROOMS
                  </div>
                  <div className="text-4xl font-black font-mono text-purple-950">
                    {accomRequestedCount}
                  </div>
                </div>

                <div className="p-6 bg-emerald-300 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-emerald-950">
                    ALLOCATED ROOMS
                  </div>
                  <div className="text-4xl font-black font-mono text-emerald-950">
                    {accomAllocatedCount}
                  </div>
                </div>

                <div className="p-6 bg-amber-300 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-amber-950">
                    PENDING ASSIGNMENT
                  </div>
                  <div className="text-4xl font-black font-mono text-amber-950">
                    {accomRequestedCount - accomAllocatedCount}
                  </div>
                </div>
              </div>

              <div className="border-4 border-black bg-white shadow-neo overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                      <th className="p-3.5">Ticket ID</th>
                      <th className="p-3.5">Squad Name</th>
                      <th className="p-3.5">Leader Contact</th>
                      <th className="p-3.5">Hostel Status</th>
                      <th className="p-3.5">Block / Room</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-xs font-sans">
                    {registrations
                      .filter((r) => r.accommodationRequired)
                      .map((squad) => (
                        <tr key={squad.id} className="hover:bg-purple-50">
                          <td className="p-3.5 font-mono font-black">
                            {squad.registrationNumber}
                          </td>
                          <td className="p-3.5 font-black uppercase">
                            {squad.teamName}
                          </td>
                          <td className="p-3.5 font-mono">
                            {squad.leaderName} ({squad.leaderPhone})
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                                squad.accommodationStatus === "ALLOCATED"
                                  ? "bg-emerald-300 text-emerald-950"
                                  : "bg-amber-200 text-amber-950"
                              }`}
                            >
                              {squad.accommodationStatus || "REQUESTED"}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono font-bold">
                            {squad.hostelBlock
                              ? `${squad.hostelBlock} - Room ${squad.roomNumber}`
                              : "Not Assigned"}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedAccomSquad(squad);
                                setHostelBlockInput(
                                  squad.hostelBlock || "BH-1",
                                );
                                setRoomNumberInput(squad.roomNumber || "101");
                                setIsAccomSheetOpen(true);
                              }}
                              className="px-3 py-1.5 bg-purple-300 hover:bg-purple-400 border-2 border-black font-mono font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                            >
                              ASSIGN ROOM
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: PAYMENTS & FINANCES                                            */}
          {/* ===================================================================== */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-300 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-emerald-950">
                    VERIFIED PAYMENTS
                  </div>
                  <div className="text-4xl font-black font-mono text-emerald-950">
                    {
                      registrations.filter(
                        (r) => r.paymentStatus === "VERIFIED",
                      ).length
                    }
                  </div>
                </div>

                <div className="p-6 bg-amber-300 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-amber-950">
                    PENDING UTR AUDIT
                  </div>
                  <div className="text-4xl font-black font-mono text-amber-950">
                    {
                      registrations.filter((r) => r.paymentStatus === "PENDING")
                        .length
                    }
                  </div>
                </div>

                <div className="p-6 bg-cyan-200 border-4 border-black shadow-neo space-y-1">
                  <div className="font-mono text-xs font-black uppercase text-cyan-950">
                    SPONSORED / FREE PASS
                  </div>
                  <div className="text-4xl font-black font-mono text-cyan-950">
                    {
                      registrations.filter(
                        (r) =>
                          !r.paymentStatus || r.paymentStatus === "FREE_TIER",
                      ).length
                    }
                  </div>
                </div>
              </div>

              <div className="border-4 border-black bg-white shadow-neo overflow-x-auto min-h-[380px] pb-24">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-mono text-xs uppercase border-b-4 border-black">
                      <th className="p-3.5">Ticket ID</th>
                      <th className="p-3.5">Squad Name</th>
                      <th className="p-3.5">Payment Mode</th>
                      <th className="p-3.5">Transaction UTR</th>
                      <th className="p-3.5">Payment Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-xs font-sans">
                    {registrations.map((squad) => (
                      <tr key={squad.id} className="hover:bg-emerald-50/40">
                        <td className="p-3.5 font-mono font-black">
                          {squad.registrationNumber}
                        </td>
                        <td className="p-3.5 font-black uppercase">
                          {squad.teamName}
                        </td>
                        <td className="p-3.5 font-mono">
                          {squad.paymentMode || "FREE_SPONSORED"}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-amber-800">
                          {squad.transactionId || "N/A"}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${
                              squad.paymentStatus === "VERIFIED"
                                ? "bg-emerald-300 text-emerald-950"
                                : squad.paymentStatus === "REJECTED"
                                  ? "bg-rose-300 text-rose-950"
                                  : squad.paymentStatus === "PENDING"
                                    ? "bg-amber-200 text-amber-950"
                                    : "bg-neutral-200 text-neutral-800"
                            }`}
                          >
                            {squad.paymentStatus || "FREE_TIER"}
                          </span>
                        </td>
                        <td
                          className="p-3.5 text-right relative"
                          data-action-menu
                        >
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(
                                  openActionMenuId === squad.id
                                    ? null
                                    : squad.id,
                                );
                              }}
                              className="p-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black font-mono text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center transition-all"
                              title="Payment actions menu"
                            >
                              <MoreVertical className="w-4 h-4 stroke-[2.5px]" />
                            </button>

                            {/* Neo 3-Dot Dropdown Menu */}
                            {openActionMenuId === squad.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-3.5 top-11 z-50 w-64 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left py-1.5 animate-in fade-in zoom-in-95 duration-100"
                              >
                                <div className="px-3.5 py-1.5 border-b-2 border-neutral-200 font-mono text-[10px] font-black uppercase text-neutral-600 flex items-center justify-between">
                                  <span>{squad.registrationNumber}</span>
                                  <span className="font-mono text-[9px] px-1 bg-neutral-100 border border-black">
                                    {squad.paymentStatus || "PENDING"}
                                  </span>
                                </div>

                                <button
                                  onClick={() => {
                                    setSelectedPaymentSquad(squad);
                                    setActiveProofTab("collegeId");
                                    setIsPaymentProofModalOpen(true);
                                    setOpenActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-2.5 text-xs font-bold text-black hover:bg-amber-100 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <Eye className="w-4 h-4 text-amber-900" />
                                  <span>View Payment Details</span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleUpdatePayment(squad.id, "VERIFIED")
                                  }
                                  disabled={isUpdating}
                                  className="w-full px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <Check className="w-4 h-4 stroke-[3px]" />
                                  <span>Approve Payment</span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleUpdatePayment(squad.id, "REJECTED")
                                  }
                                  disabled={isUpdating}
                                  className="w-full px-3.5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Reject Payment</span>
                                </button>

                                <a
                                  href={`/api/admin/registrations/invoice?id=${squad.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenActionMenuId(null)}
                                  className="w-full px-3.5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center justify-between transition-colors cursor-pointer border-t-2 border-neutral-100"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <FileText className="w-4 h-4 text-blue-700" />
                                    <span>View Invoice (PDF)</span>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: SCANNER & JUDGE PIN CONTROL                                    */}
          {/* ===================================================================== */}
          {activeTab === "scanner" && (
            <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl">
              {/* Header Card */}
              <div className="border-4 border-black bg-white p-6 shadow-neo space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                      <KeyRound className="w-6 h-6 stroke-[2.5px] text-black" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl uppercase tracking-tight">
                        Live Scanner &amp; Judge Access PIN
                      </h3>
                      <p className="font-mono text-xs text-neutral-600">
                        Dynamic 5-minute expiring access codes • Maximum 8 device sessions per PIN
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/teams"
                      target="_blank"
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black font-mono font-black text-xs uppercase flex items-center gap-1.5 shadow-neo-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open /teams Scanner</span>
                    </Link>
                    <button
                      onClick={fetchScannerData}
                      className="p-2 bg-white hover:bg-neutral-100 border-2 border-black font-mono text-xs font-bold flex items-center gap-1 shadow-neo-xs cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

                {/* Active PIN & Action Spotlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Active PIN Spotlight */}
                  <div
                    className={`md:col-span-2 border-3 border-black p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      scannerData.active ? "bg-amber-50" : "bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black uppercase text-neutral-700 flex items-center gap-1.5">
                        <Radio className={`w-3.5 h-3.5 ${scannerData.active ? "text-emerald-600 animate-pulse" : "text-neutral-400"}`} />
                        <span>{scannerData.active ? "ACTIVE 5-MINUTE AUTHORIZATION PIN" : "NO ACTIVE PIN SESSION"}</span>
                      </span>

                      {scannerData.active && (
                        <span className="font-mono text-xs font-black px-2.5 py-0.5 bg-emerald-300 border-2 border-black uppercase">
                          🟢 LIVE
                        </span>
                      )}
                    </div>

                    {scannerData.active && scannerData.session ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex-1 bg-white border-3 border-black p-4 flex items-center justify-between shadow-neo-sm">
                            <span className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-black">
                              {scannerData.session.pin}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(scannerData.session?.pin || "");
                                setCopiedPin(true);
                                toast.success("PIN copied to clipboard!");
                                setTimeout(() => setCopiedPin(false), 2000);
                              }}
                              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1 cursor-pointer"
                            >
                              {copiedPin ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              <span>{copiedPin ? "COPIED" : "COPY"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar & Countdown */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between font-mono text-xs font-black text-black">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              TIME REMAINING:
                            </span>
                            <span className={scannerData.remainingSeconds < 60 ? "text-rose-600 font-bold" : "text-black"}>
                              {Math.floor(scannerData.remainingSeconds / 60)}m {scannerData.remainingSeconds % 60}s
                            </span>
                          </div>
                          <div className="w-full h-3 bg-neutral-200 border-2 border-black overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                scannerData.remainingSeconds > 120
                                  ? "bg-emerald-500"
                                  : scannerData.remainingSeconds > 45
                                  ? "bg-amber-400"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(100, (scannerData.remainingSeconds / 300) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-2 border-2 border-dashed border-neutral-300">
                        <Lock className="w-8 h-8 text-neutral-400 mx-auto" />
                        <p className="font-mono text-xs font-bold text-neutral-600">
                          There is no active PIN. Click below to issue a fresh 5-minute access code for judges/staff.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleGenerateScannerPin}
                        disabled={isGeneratingPin}
                        className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-500 text-black border-3 border-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                      >
                        {isGeneratingPin ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>GENERATING...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 stroke-[2.5px]" />
                            <span>{scannerData.active ? "GENERATE FRESH PIN (REPLACES ACTIVE)" : "GENERATE NEW 5-MIN PIN"}</span>
                          </>
                        )}
                      </button>

                      {scannerData.active && (
                        <button
                          onClick={handleRevokePin}
                          disabled={isRevokingPin}
                          className="py-3 px-4 bg-rose-100 hover:bg-rose-200 text-rose-900 border-3 border-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                        >
                          {isRevokingPin ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          )}
                          <span>INVALIDATE PIN</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Device Capacity Card */}
                  <div className="border-3 border-black bg-white p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black uppercase text-neutral-600">
                          DEVICE QUOTA
                        </span>
                        <Smartphone className="w-4 h-4 text-black" />
                      </div>
                      <div className="text-3xl font-black font-mono text-black">
                        {scannerData.session?.activeDeviceCount || 0}{" "}
                        <span className="text-base text-neutral-500 font-bold">/ 8 MAX</span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-100 border-2 border-black overflow-hidden">
                        <div
                          className="h-full bg-black transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              ((scannerData.session?.activeDeviceCount || 0) / 8) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 border border-black space-y-1 text-[11px] font-mono text-neutral-600">
                      <div className="font-bold text-black uppercase">SECURITY POLICY:</div>
                      <div>• 5-min window is for PIN code entry/joining.</div>
                      <div>• Logged-in devices remain authorized indefinitely.</div>
                      <div>• Max 8 concurrent scanner devices per PIN.</div>
                      <div>• Admins can revoke any device below.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Devices Roster */}
              <div className="border-4 border-black bg-white shadow-neo">
                <div className="p-5 border-b-3 border-black flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-black stroke-[2.5px]" />
                    <h3 className="font-black text-base uppercase tracking-tight">
                      Logged-In Devices on Active PIN ({scannerData.session?.devices?.length || 0})
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-neutral-600">
                    Real-time list of scanners &amp; judges connected with the PIN
                  </span>
                </div>

                {!scannerData.session?.devices || scannerData.session.devices.length === 0 ? (
                  <div className="p-8 text-center space-y-2 font-mono text-xs font-bold text-neutral-500">
                    <Smartphone className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p>No devices currently logged in with this PIN session.</p>
                    <p className="text-[11px] text-neutral-400">
                      Devices will appear here as soon as judges or staff sign in at /teams.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-100 border-b-2 border-black uppercase text-[11px] font-black text-black">
                          <th className="p-3.5">#</th>
                          <th className="p-3.5">Verifier / Judge Name</th>
                          <th className="p-3.5">Device &amp; Browser</th>
                          <th className="p-3.5">IP Address</th>
                          <th className="p-3.5">Login Time</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10">
                        {scannerData.session.devices.map((device, idx) => (
                          <tr
                            key={device.id}
                            className={`hover:bg-amber-50/50 transition-colors ${
                              !device.isActive ? "opacity-50 bg-neutral-50" : ""
                            }`}
                          >
                            <td className="p-3.5 font-bold text-neutral-500">{idx + 1}</td>
                            <td className="p-3.5 font-black text-black text-sm flex items-center gap-2">
                              <div className="w-7 h-7 bg-amber-300 border border-black flex items-center justify-center font-mono text-xs font-black shrink-0">
                                {device.verifierName.charAt(0).toUpperCase()}
                              </div>
                              <span>{device.verifierName}</span>
                            </td>
                            <td className="p-3.5 font-bold text-neutral-700">
                              <div className="flex items-center gap-1.5">
                                {device.deviceInfo?.includes("Mobile") ? (
                                  <Smartphone className="w-3.5 h-3.5 text-black" />
                                ) : (
                                  <Laptop className="w-3.5 h-3.5 text-black" />
                                )}
                                <span>{device.deviceInfo || "Web Browser"}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-neutral-600">
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-neutral-400" />
                                <span>{device.ipAddress || "Unknown"}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-neutral-600">
                              {new Date(device.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                            </td>
                            <td className="p-3.5">
                              {device.isActive ? (
                                <span className="px-2 py-0.5 bg-emerald-200 border border-black font-black text-[10px] text-emerald-950 uppercase">
                                  ONLINE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-rose-200 border border-black font-black text-[10px] text-rose-950 uppercase">
                                  REVOKED
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              {device.isActive && (
                                <button
                                  onClick={() => handleRevokeDevice(device.id, device.verifierName)}
                                  disabled={isRevokingDevice === device.id}
                                  className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-black font-mono text-[10px] font-black uppercase cursor-pointer"
                                >
                                  {isRevokingDevice === device.id ? "DISCONNECTING..." : "DISCONNECT"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: SETTINGS & STORAGE                                             */}
          {/* ===================================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
              {/* Event Gate Controls: Enable Registration & Publish Problem Statements */}
              <div className="border-4 border-black bg-white p-6 shadow-neo space-y-6">
                <div className="flex items-center justify-between border-b-3 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-300 border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                      <Zap className="w-5 h-5 stroke-[2.5px] text-black" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tight">
                        Live Event Access Gates
                      </h3>
                      <p className="font-mono text-xs text-neutral-600">
                        Toggle public squad registrations and problem statement
                        visibility in real-time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Gate 1: Squad Registration */}
                  <div
                    className={`p-5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4 transition-all ${
                      settings.isRegistrationOpen
                        ? "bg-emerald-50/80"
                        : "bg-rose-50/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b-2 border-black/10 pb-3">
                        <div>
                          <span className="font-mono text-[11px] font-black uppercase text-neutral-600 block">
                            REGISTRATION GATE
                          </span>
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block mt-1 ${
                              settings.isRegistrationOpen
                                ? "bg-emerald-300 text-emerald-950"
                                : "bg-rose-300 text-rose-950"
                            }`}
                          >
                            {settings.isRegistrationOpen
                              ? "ACTIVE & OPEN"
                              : "RESTRICTED / CLOSED"}
                          </span>
                        </div>

                        {/* Interactive Neo-Brutalist Switch */}
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={settings.isRegistrationOpen}
                            onClick={() =>
                              handleToggleSetting(
                                "isRegistrationOpen",
                                !settings.isRegistrationOpen,
                              )
                            }
                            disabled={isSavingSettings}
                            className={`relative inline-flex h-8 w-18 items-center border-3 border-black transition-colors cursor-pointer shadow-neo-sm active:shadow-none disabled:opacity-50 ${
                              settings.isRegistrationOpen
                                ? "bg-emerald-400"
                                : "bg-neutral-300"
                            }`}
                          >
                            <span
                              className={`h-full w-8 bg-white border-r-2 border-black flex items-center justify-center font-mono text-[10px] font-black text-black transform transition-transform ${
                                settings.isRegistrationOpen
                                  ? "translate-x-10 border-r-0 border-l-2"
                                  : "translate-x-0"
                              }`}
                            >
                              {settings.isRegistrationOpen ? "ON" : "OFF"}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-between px-2 font-mono text-[9px] font-black pointer-events-none text-black/60">
                              <span
                                className={
                                  settings.isRegistrationOpen
                                    ? "opacity-0"
                                    : "opacity-100 ml-auto"
                                }
                              >
                                OFF
                              </span>
                              <span
                                className={
                                  settings.isRegistrationOpen
                                    ? "opacity-100 mr-auto"
                                    : "opacity-0"
                                }
                              >
                                ON
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="font-black text-base uppercase text-black">
                        Squad Registration Submissions
                      </div>

                      <p className="font-mono text-xs text-neutral-600 leading-relaxed">
                        {settings.isRegistrationOpen
                          ? "Registration form (/register) is active. New contestants can submit squad rosters."
                          : "Registration form is locked. New submissions are blocked with an official closed notice."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleSetting(
                          "isRegistrationOpen",
                          !settings.isRegistrationOpen,
                        )
                      }
                      disabled={isSavingSettings}
                      className={`w-full py-3 px-4 font-black font-mono text-xs uppercase border-3 border-black shadow-neo-sm cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 ${
                        settings.isRegistrationOpen
                          ? "bg-rose-400 hover:bg-rose-500 text-black"
                          : "bg-emerald-300 hover:bg-emerald-400 text-black"
                      }`}
                    >
                      {settings.isRegistrationOpen ? (
                        <>
                          <Lock className="w-4 h-4 stroke-[2.5px]" />
                          <span>SWITCH OFF (CLOSE REGISTRATIONS)</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3px]" />
                          <span>SWITCH ON (ENABLE REGISTRATIONS)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Gate 2: Publish Problem Statements */}
                  <div
                    className={`p-5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4 transition-all ${
                      settings.isProblemStatementsPublished
                        ? "bg-cyan-50/80"
                        : "bg-amber-50/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b-2 border-black/10 pb-3">
                        <div>
                          <span className="font-mono text-[11px] font-black uppercase text-neutral-600 block">
                            PROBLEM STATEMENTS GATE
                          </span>
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block mt-1 ${
                              settings.isProblemStatementsPublished
                                ? "bg-cyan-300 text-cyan-950"
                                : "bg-amber-300 text-amber-950"
                            }`}
                          >
                            {settings.isProblemStatementsPublished
                              ? "PUBLISHED LIVE"
                              : "HIDDEN / UNPUBLISHED"}
                          </span>
                        </div>

                        {/* Interactive Neo-Brutalist Switch */}
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={settings.isProblemStatementsPublished}
                            onClick={() =>
                              handleToggleSetting(
                                "isProblemStatementsPublished",
                                !settings.isProblemStatementsPublished,
                              )
                            }
                            disabled={isSavingSettings}
                            className={`relative inline-flex h-8 w-18 items-center border-3 border-black transition-colors cursor-pointer shadow-neo-sm active:shadow-none disabled:opacity-50 ${
                              settings.isProblemStatementsPublished
                                ? "bg-cyan-400"
                                : "bg-amber-300"
                            }`}
                          >
                            <span
                              className={`h-full w-8 bg-white border-r-2 border-black flex items-center justify-center font-mono text-[10px] font-black text-black transform transition-transform ${
                                settings.isProblemStatementsPublished
                                  ? "translate-x-10 border-r-0 border-l-2"
                                  : "translate-x-0"
                              }`}
                            >
                              {settings.isProblemStatementsPublished
                                ? "ON"
                                : "OFF"}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-between px-2 font-mono text-[9px] font-black pointer-events-none text-black/60">
                              <span
                                className={
                                  settings.isProblemStatementsPublished
                                    ? "opacity-0"
                                    : "opacity-100 ml-auto"
                                }
                              >
                                OFF
                              </span>
                              <span
                                className={
                                  settings.isProblemStatementsPublished
                                    ? "opacity-100 mr-auto"
                                    : "opacity-0"
                                }
                              >
                                ON
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="font-black text-base uppercase text-black">
                        Problem Statements &amp; Tracks
                      </div>

                      <p className="font-mono text-xs text-neutral-600 leading-relaxed">
                        {settings.isProblemStatementsPublished
                          ? "Problem statements are visible on /problem-statements and open for squad selection on /register/ps."
                          : "Problem statements are hidden with an unreleased teaser notice. Track selection is locked."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleSetting(
                          "isProblemStatementsPublished",
                          !settings.isProblemStatementsPublished,
                        )
                      }
                      disabled={isSavingSettings}
                      className={`w-full py-3 px-4 font-black font-mono text-xs uppercase border-3 border-black shadow-neo-sm cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 ${
                        settings.isProblemStatementsPublished
                          ? "bg-amber-300 hover:bg-amber-400 text-black"
                          : "bg-cyan-300 hover:bg-cyan-400 text-black"
                      }`}
                    >
                      {settings.isProblemStatementsPublished ? (
                        <>
                          <EyeOff className="w-4 h-4 stroke-[2.5px]" />
                          <span>SWITCH OFF (UNPUBLISH STATEMENTS)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 stroke-[2.5px]" />
                          <span>SWITCH ON (PUBLISH LIVE)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Google Drive Integration Box */}
              <div className="border-4 border-black bg-white p-6 shadow-neo space-y-6">
                <div className="flex items-center justify-between border-b-3 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-300 border-2 border-black flex items-center justify-center shrink-0">
                      <HardDrive className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tight">
                        Google Drive Cloud Storage
                      </h3>
                      <p className="font-mono text-xs text-neutral-600">
                        Auto-stream team College IDs &amp; Synopsis decks to
                        Google Drive
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs font-black uppercase px-2.5 py-1 border-2 border-black ${
                      settings.googleDriveEnabled
                        ? "bg-emerald-300 text-emerald-950"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {settings.googleDriveEnabled
                      ? "DRIVE CONNECTED"
                      : "NOT CONNECTED"}
                  </span>
                </div>

                {/* OAuth Status Card */}
                {settings.googleDriveEnabled &&
                settings.googleDriveConnectedEmail ? (
                  <div className="p-4 bg-emerald-50 border-3 border-black space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-300 border-2 border-black flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <div className="font-black text-xs uppercase">
                            Connected Account
                          </div>
                          <div className="font-mono text-xs text-emerald-900 font-bold">
                            {settings.googleDriveConnectedEmail}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDisconnectDrive}
                        disabled={isDisconnectingDrive}
                        className="px-3 py-1.5 bg-rose-200 hover:bg-rose-300 text-rose-900 border-2 border-black font-mono font-black text-xs uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                      >
                        {isDisconnectingDrive
                          ? "Disconnecting..."
                          : "Disconnect Account"}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <div>
                        Target Folder:{" "}
                        <strong>
                          {settings.googleDriveFolderName ||
                            "HACKVERSE 2026 Team Uploads"}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSyncPermissions}
                          disabled={isSyncingPermissions}
                          className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-black font-black text-xs uppercase border-2 border-black shadow-neo-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                          title="Ensure all participant files in Drive are readable with link"
                        >
                          {isSyncingPermissions ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>SYNC &amp; FIX FILE PERMISSIONS</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleTestDriveConnection}
                          disabled={isTestingDrive}
                          className="px-4 py-2 bg-black text-white font-black text-xs uppercase border-2 border-black shadow-neo-sm hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {isTestingDrive && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          )}
                          <span>TEST CONNECTION</span>
                        </button>
                      </div>
                    </div>

                    {driveTestResult && (
                      <div
                        className={`p-3 border-2 border-black font-mono text-xs font-bold ${
                          driveTestResult.success
                            ? "bg-emerald-200 text-emerald-950"
                            : "bg-rose-200 text-rose-950"
                        }`}
                      >
                        {driveTestResult.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-neutral-100 border-3 border-black text-center space-y-4">
                    <h4 className="font-black text-base uppercase">
                      One-Click Google Drive Connection
                    </h4>
                    <p className="font-mono text-xs text-neutral-600 max-w-md mx-auto">
                      Connect your Google Account. A dedicated folder
                      &quot;HACKVERSE 2026 Team Uploads&quot; will be created
                      automatically.
                    </p>
                    <a
                      href="/api/admin/drive/auth"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-300 hover:bg-amber-400 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm cursor-pointer"
                    >
                      <span>SIGN IN WITH GOOGLE TO CONNECT DRIVE</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Resend Email Configuration Info */}
              <div className="border-4 border-black bg-white p-6 shadow-neo space-y-4">
                <div className="flex items-center gap-3 border-b-3 border-black pb-3">
                  <div className="w-10 h-10 bg-cyan-300 border-2 border-black flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">
                      Transactional Email (Resend)
                    </h3>
                    <p className="font-mono text-xs text-neutral-600">
                      Dispatches registration receipts and official Entry Pass
                      PNG attachments
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-cyan-50 border-2 border-black space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">ENVIRONMENT VARIABLE:</span>
                    <span className="bg-black text-white px-2 py-0.5">
                      RESEND_API_KEY
                    </span>
                  </div>
                  <p className="text-neutral-700 font-sans text-xs">
                    Whenever an admin confirms a team or updates payment status,
                    the official Entry Pass PNG and receipt are automatically
                    rendered and emailed via Resend.
                  </p>
                </div>
              </div>

              {/* Fest Parameters Settings Form */}
              <form
                onSubmit={handleSaveSettings}
                className="border-4 border-black bg-white p-6 shadow-neo space-y-6"
              >
                <div className="flex items-center justify-between border-b-3 border-black pb-3">
                  <h3 className="font-black text-lg uppercase tracking-tight">
                    Event Parameters
                  </h3>
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-2 bg-amber-300 hover:bg-amber-400 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSavingSettings ? "SAVING..." : "SAVE SETTINGS"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Registration Fee (₹ Amount) */}
                  <div className="p-4 bg-amber-50/70 border-2 border-black space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs font-black uppercase text-black">
                        Registration Fee (₹ INR)
                      </label>
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">
                        {settings.registrationFee > 0 ? `₹${settings.registrationFee} / SQUAD` : "FREE TIER"}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-sm text-black">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0 for Free Tier"
                        value={settings.registrationFee}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            registrationFee: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="w-full pl-7 pr-3 py-2.5 bg-white border-2 border-black font-mono text-sm font-black text-black shadow-neo-xs focus:outline-none"
                      />
                    </div>
                    <p className="font-mono text-[10px] text-black/70">
                      Sets the locked amount in the dynamic UPI QR code. Enter <strong>0</strong> for Free / Sponsored tier.
                    </p>
                  </div>

                  {/* Payment Mandatory Toggle */}
                  <div className="p-4 bg-amber-50/70 border-2 border-black space-y-2 flex flex-col justify-between">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Payment Enforcement Mode
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={settings.isPaymentMandatory}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            isPaymentMandatory: e.target.checked,
                          })
                        }
                        className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer shrink-0"
                      />
                      <span className="font-sans text-xs font-bold text-black">
                        Make UPI Payment &amp; UTR mandatory before submitting registration
                      </span>
                    </label>
                    <p className="font-mono text-[10px] text-black/70">
                      {settings.isPaymentMandatory
                        ? "All squads must provide a valid UPI Transaction ID."
                        : "Squads can register on sponsored / free tier if fee is 0."}
                    </p>
                  </div>

                  {/* UPI ID */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      UPI ID For Registrations
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. codebreakers@upi"
                      value={settings.upiId}
                      onChange={(e) =>
                        setSettings({ ...settings, upiId: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Payee Name */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Payee / Beneficiary Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HACKVERSE 2026 GCEK"
                      value={settings.payeeName}
                      onChange={(e) =>
                        setSettings({ ...settings, payeeName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Min Squad Size */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Min Squad Size (Members)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.minSquadSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minSquadSize: Math.max(1, Number(e.target.value) || 2),
                        })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Max Squad Size */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Max Squad Size (Members)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.maxSquadSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxSquadSize: Math.max(1, Number(e.target.value) || 4),
                        })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Official Phone */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Official Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.contactPhone || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Official Email */}
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase text-black">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold text-black shadow-neo-xs"
                    />
                  </div>

                  {/* Judge & QR Scanner Authorization PIN */}
                  <div className="space-y-2 sm:col-span-2 p-4 bg-amber-50 border-2 border-black">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" />
                        <span>Judge &amp; Scanner QR Authorization PIN</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
                          setSettings({ ...settings, judgeAuthPin: randomPin });
                          toast.info(`Generated new PIN: ${randomPin}`);
                        }}
                        className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#55FF55] border border-black hover:bg-neutral-800 cursor-pointer"
                      >
                        Generate Random PIN
                      </button>
                    </div>
                    <input
                      type="text"
                      value={settings.judgeAuthPin || "2026"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          judgeAuthPin: e.target.value,
                        })
                      }
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-sm font-black text-black shadow-neo-xs tracking-wider"
                    />
                    <p className="font-mono text-[11px] text-neutral-600">
                      When judges or staff scan a contestant's pass QR code, they must enter their name and this PIN to unlock the team's full dossier and scoring portal.
                    </p>
                  </div>

                  {/* Registration Portal Gate */}
                  <div className="p-3 bg-neutral-50 border-2 border-black flex items-center justify-between sm:col-span-2">
                    <div className="space-y-0.5">
                      <div className="font-black text-xs uppercase text-black">
                        Registration Portal Open / Close
                      </div>
                      <div className="font-mono text-[11px] text-black/70">
                        Controls whether new registrations can be submitted.
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-black">
                      <input
                        type="checkbox"
                        checked={settings.isRegistrationOpen}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            isRegistrationOpen: e.target.checked,
                          })
                        }
                        className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer"
                      />
                      <span>{settings.isRegistrationOpen ? "OPEN (ACCEPTING)" : "CLOSED (LOCKED)"}</span>
                    </label>
                  </div>

                  {/* Problem Statements Gate */}
                  <div className="p-3 bg-neutral-50 border-2 border-black flex items-center justify-between sm:col-span-2">
                    <div className="space-y-0.5">
                      <div className="font-black text-xs uppercase text-black">
                        Problem Statements Published
                      </div>
                      <div className="font-mono text-[11px] text-black/70">
                        Allows registered squads to select their 2 problem statements.
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-black">
                      <input
                        type="checkbox"
                        checked={settings.isProblemStatementsPublished}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            isProblemStatementsPublished: e.target.checked,
                          })
                        }
                        className="w-5 h-5 border-2 border-black accent-black rounded-none cursor-pointer"
                      />
                      <span>{settings.isProblemStatementsPublished ? "PUBLISHED" : "HIDDEN / LOCKED"}</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* SQUAD DETAIL INSPECTION SHEET DRAWER                                      */}
      {/* ========================================================================= */}
      <Sheet open={isSquadSheetOpen} onOpenChange={setIsSquadSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl bg-white border-l-4 border-black p-0 overflow-y-auto text-black font-sans">
          {selectedSquad && (
            <div className="space-y-6 pb-12">
              {/* Sheet Header */}
              <div className="bg-black text-white p-6 border-b-4 border-black space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-amber-400 text-black px-2 py-0.5">
                    {selectedSquad.registrationNumber}
                  </span>
                  <span
                    className={`font-mono text-xs font-black uppercase px-2.5 py-0.5 border-2 border-white ${
                      selectedSquad.status === "CONFIRMED"
                        ? "bg-emerald-400 text-black"
                        : selectedSquad.status === "BANNED"
                          ? "bg-rose-600 text-white"
                          : selectedSquad.status === "REJECTED"
                            ? "bg-rose-400 text-black"
                            : "bg-amber-300 text-black"
                    }`}
                  >
                    {selectedSquad.status === "BANNED" ? "BANNED" : selectedSquad.status}
                  </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white break-words">
                  {selectedSquad.teamName}
                </h2>
                <p className="font-mono text-xs text-neutral-400">
                  Registered on{" "}
                  {new Date(selectedSquad.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="px-6 space-y-6">
                {/* Status Update Quick Action Strip */}
                <div className="p-4 bg-amber-100 border-3 border-black space-y-3">
                  <div className="font-mono text-xs font-black uppercase flex items-center justify-between">
                    <span>Decision &amp; Dispatch</span>
                    {selectedSquad.status === "CONFIRMED" && (
                      <span className="text-[10px] font-black bg-emerald-300 text-emerald-950 px-2 py-0.5 border border-black">
                        CONFIRMED SQUAD
                      </span>
                    )}
                    {selectedSquad.status === "BANNED" && (
                      <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 border border-black">
                        BANNED / DISQUALIFIED
                      </span>
                    )}
                  </div>

                  {/* Dynamic Action Buttons based on Squad Status */}
                  {selectedSquad.status === "CONFIRMED" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleBanSquad(selectedSquad)}
                        disabled={isUpdating}
                        className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Ban className="w-3.5 h-3.5 stroke-[2.5px]" />
                        <span>BAN SQUAD</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(selectedSquad.id, "REJECTED")
                        }
                        disabled={isUpdating}
                        className="py-2.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                        <span>REJECT</span>
                      </button>
                    </div>
                  ) : selectedSquad.status === "BANNED" ? (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-rose-200 border-2 border-rose-600 text-rose-950 font-mono text-xs font-bold flex items-center gap-2">
                        <Ban className="w-4 h-4 text-rose-700 shrink-0 stroke-[2.5px]" />
                        <span>This squad is currently BANNED from HACKVERSE &apos;26.</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleUnbanSquad(selectedSquad)}
                          disabled={isUpdating}
                          className="py-2.5 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          <span>UNBAN &amp; RESTORE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStatus(selectedSquad.id, "REJECTED")
                          }
                          disabled={isUpdating}
                          className="py-2.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>REJECT</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(selectedSquad.id, "CONFIRMED")
                        }
                        disabled={isUpdating}
                        className="py-2.5 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        <span>CONFIRM</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(selectedSquad.id, "REJECTED")
                        }
                        disabled={isUpdating}
                        className="py-2.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                        <span>REJECT</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBanSquad(selectedSquad)}
                        disabled={isUpdating}
                        className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5 stroke-[2.5px]" />
                        <span>BAN</span>
                      </button>
                    </div>
                  )}

                  {/* Email & Invoice Triggers */}
                  <div className="pt-2 border-t border-black/20 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleDispatchEmail(selectedSquad.id, "approval")
                      }
                      disabled={isSendingEmail}
                      className="w-full py-2 bg-black text-white hover:bg-neutral-800 border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-neo-sm"
                    >
                      {isSendingEmail ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>SEND ENTRY PASS &amp; INVOICE EMAIL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPassSquad(selectedSquad);
                        setIsPassModalOpen(true);
                      }}
                      className="w-full py-2 bg-emerald-300 hover:bg-emerald-400 text-emerald-950 border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-neo-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>OFFICIAL PASS &amp; DESK QR BADGE</span>
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`/api/admin/registrations/invoice?id=${selectedSquad.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-amber-300 hover:bg-amber-400 text-black border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-neo-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>VIEW OFFICIAL INVOICE (PDF)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Team Leader & Institution */}
                <div className="border-3 border-black p-4 space-y-2 bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="font-mono text-xs font-black uppercase text-neutral-600">
                    TEAM LEADER
                  </div>
                  <div className="text-base font-black uppercase">
                    {selectedSquad.leaderName}
                  </div>
                  <div className="font-mono text-xs text-neutral-700 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      <span>{selectedSquad.leaderEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      <span>{selectedSquad.leaderPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      <span>{selectedSquad.collegeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                      <span>
                        {selectedSquad.leaderBranch} ({selectedSquad.leaderYear})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Problem Statement Track Preferences */}
                {(() => {
                  const { p1, p2, p1Raw, p2Raw, hasPs, psSubmittedAt } = getSquadPs(selectedSquad);
                  return (
                    <div className="border-3 border-black p-4 space-y-3 bg-amber-50/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="font-mono text-xs font-black uppercase text-neutral-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-amber-900" />
                          <span>PROBLEM STATEMENT PREFERENCES</span>
                        </span>
                        <span
                          className={`font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black flex items-center gap-1 ${
                            hasPs ? "bg-emerald-300 text-emerald-950" : "bg-rose-200 text-rose-950"
                          }`}
                        >
                          {hasPs ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>LOCKED &amp; SUBMITTED</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>UNASSIGNED</span>
                            </>
                          )}
                        </span>
                      </div>

                      {hasPs ? (
                        <div className="space-y-2.5">
                          {/* Choice #1 (Primary) */}
                          <div className="p-3 bg-white border-2 border-black space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-black text-[10px] bg-amber-300 text-amber-950 px-2 py-0.5 border border-black">
                                CHOICE #1 (PRIMARY)
                              </span>
                              {p1 && (
                                <span className="font-mono text-[10px] font-bold text-neutral-600">
                                  {p1.category}
                                </span>
                              )}
                            </div>
                            <div className="font-black text-xs text-black">
                              {p1 ? `${p1.code} — ${p1.title}` : p1Raw}
                            </div>
                            {p1?.domain && (
                              <div className="font-mono text-[10px] text-neutral-500">
                                Domain: {p1.domain}
                              </div>
                            )}
                          </div>

                          {/* Choice #2 (Backup) */}
                          {p2 || p2Raw ? (
                            <div className="p-3 bg-white border-2 border-black space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-black text-[10px] bg-blue-200 text-blue-950 px-2 py-0.5 border border-black">
                                  CHOICE #2 (BACKUP)
                                </span>
                                {p2 && (
                                  <span className="font-mono text-[10px] font-bold text-neutral-600">
                                    {p2.category}
                                  </span>
                                )}
                              </div>
                              <div className="font-bold text-xs text-neutral-900">
                                {p2 ? `${p2.code} — ${p2.title}` : p2Raw}
                              </div>
                              {p2?.domain && (
                                <div className="font-mono text-[10px] text-neutral-500">
                                  Domain: {p2.domain}
                                </div>
                              )}
                            </div>
                          ) : null}

                          {psSubmittedAt && (
                            <div className="font-mono text-[10px] text-neutral-500">
                              Submitted: {new Date(psSubmittedAt).toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-neutral-100 border border-neutral-300 font-mono text-xs text-neutral-500">
                          Squad has not locked or submitted problem statement preferences yet.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Team Members Roster */}
                <div className="border-3 border-black p-4 space-y-3 bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="font-mono text-xs font-black uppercase text-neutral-600">
                    SQUAD MEMBERS ({selectedSquad.members?.length || 0})
                  </div>
                  {selectedSquad.members && selectedSquad.members.length > 0 ? (
                    <div className="space-y-2">
                      {selectedSquad.members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white border-2 border-black font-mono text-xs"
                        >
                          <div className="font-black text-black">
                            {m.fullName} ({m.role || "Member"})
                          </div>
                          <div className="text-neutral-600">
                            {m.email} &bull; {m.phone || "No Phone"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-neutral-500">
                      Solo participant or no additional members.
                    </div>
                  )}
                </div>

                {/* Event Accommodation Preference & Hostel Room Status */}
                <div className="border-3 border-black p-4 space-y-3 bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {/* <div className="font-mono text-xs font-black uppercase text-neutral-600 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-purple-700" />
                      <span>EVENT ACCOMMODATION PREFERENCE</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black ${
                        selectedSquad.accommodationRequired
                          ? selectedSquad.accommodationStatus === "ALLOCATED"
                            ? "bg-emerald-300 text-emerald-950"
                            : "bg-purple-200 text-purple-950"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {selectedSquad.accommodationRequired
                        ? selectedSquad.accommodationStatus === "ALLOCATED"
                          ? "ALLOCATED"
                          : "REQUESTED"
                        : "NOT REQUESTED"}
                    </span>
                  </div> */}

                  <div className="p-3 bg-white border-2 border-black space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-neutral-600">Hostel Stay:</span>
                      <span
                        className={`font-black uppercase ${
                          selectedSquad.accommodationRequired
                            ? "text-emerald-700"
                            : "text-neutral-500"
                        }`}
                      >
                        {selectedSquad.accommodationRequired
                          ? "✓ YES (On-Campus Stay Requested)"
                          : "✕ NO (Local / Day Scholar)"}
                      </span>
                    </div>

                    {selectedSquad.accommodationRequired && (
                      <>
                        <div className="flex items-center justify-between text-xs font-mono pt-1.5 border-t border-black/10">
                          <span className="font-bold text-neutral-600">Hostel Block:</span>
                          <span className="font-black text-black">
                            {selectedSquad.hostelBlock || "Not Assigned Yet"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono pt-1.5 border-t border-black/10">
                          <span className="font-bold text-neutral-600">Room / Bed:</span>
                          <span className="font-black text-black">
                            {selectedSquad.roomNumber || "Not Assigned Yet"}
                          </span>
                        </div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAccomSquad(selectedSquad);
                              setHostelBlockInput(selectedSquad.hostelBlock || "BH-1");
                              setRoomNumberInput(selectedSquad.roomNumber || "101");
                              setIsAccomSheetOpen(true);
                            }}
                            className="w-full py-2 bg-purple-300 hover:bg-purple-400 text-black border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-neo-sm"
                          >
                            <BedDouble className="w-4 h-4 stroke-[2.5px]" />
                            <span>ASSIGN / EDIT HOSTEL ROOM</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="border-3 border-black p-4 space-y-3 bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="font-mono text-xs font-black uppercase text-neutral-600 flex items-center justify-between">
                    <span>VERIFICATION DOCUMENTS</span>
                    <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 border border-black">
                      DRIVE &amp; LOCAL
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedSquad.documents?.collegeIdDriveUrl ||
                    selectedSquad.documents?.collegeIdUrl ||
                    selectedSquad.documents?.collegeIdFileName ? (
                      <div className="p-3 bg-white border-2 border-black flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <HardDrive className="w-4 h-4 text-blue-700 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-black text-xs uppercase truncate">
                              {selectedSquad.documents.collegeIdFileName ||
                                "College Student ID"}
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500">
                              {selectedSquad.documents.collegeIdFileSize ||
                                "Student Photo Verification"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedPaymentSquad(selectedSquad);
                              setActiveProofTab("collegeId");
                              setIsPaymentProofModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-amber-300 hover:bg-amber-400 border border-black font-mono font-bold text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>PREVIEW</span>
                          </button>
                          {selectedSquad.documents.collegeIdDriveUrl && (
                            <a
                              href={selectedSquad.documents.collegeIdDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-neutral-100 border border-black text-black"
                              title="Open directly in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-neutral-100 border border-neutral-300 font-mono text-xs text-neutral-500">
                        No College ID Uploaded
                      </div>
                    )}

                    {selectedSquad.documents?.synopsisDriveUrl ||
                    selectedSquad.documents?.synopsisUrl ||
                    selectedSquad.documents?.synopsisFileName ? (
                      <div className="p-3 bg-white border-2 border-black flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-black text-xs uppercase truncate">
                              {selectedSquad.documents.synopsisFileName ||
                                "Project Synopsis Deck"}
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500">
                              {selectedSquad.documents.synopsisFileSize ||
                                "Idea Presentation / PDF"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedPaymentSquad(selectedSquad);
                              setActiveProofTab("synopsis");
                              setIsPaymentProofModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-300 hover:bg-emerald-400 border border-black font-mono font-bold text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>PREVIEW</span>
                          </button>
                          {selectedSquad.documents.synopsisDriveUrl && (
                            <a
                              href={selectedSquad.documents.synopsisDriveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-neutral-100 border border-black text-black"
                              title="Open directly in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Danger Zone: Delete */}
                <div className="pt-4 border-t-2 border-neutral-200">
                  <button
                    onClick={() =>
                      handleDeleteSquad(
                        selectedSquad.id,
                        selectedSquad.teamName,
                      )
                    }
                    className="w-full py-2.5 bg-white hover:bg-rose-100 text-rose-700 border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5px]" />
                    <span>PERMANENTLY DELETE REGISTRATION</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ========================================================================= */}
      {/* HOSTEL ROOM ASSIGNMENT MODAL SHEET                                        */}
      {/* ========================================================================= */}
      <Sheet open={isAccomSheetOpen} onOpenChange={setIsAccomSheetOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white border-l-4 border-black p-6 space-y-6 text-black">
          <SheetHeader>
            <SheetTitle className="text-xl font-black uppercase">
              Assign Hostel &amp; Room
            </SheetTitle>
            <SheetDescription className="font-mono text-xs text-neutral-600">
              Allocating campus accommodation for{" "}
              <strong>{selectedAccomSquad?.teamName}</strong>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-mono text-xs font-black uppercase">
                Hostel Block
              </label>
              <select
                value={hostelBlockInput}
                onChange={(e) => setHostelBlockInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold cursor-pointer"
              >
                <option value="BH-1">Boys Hostel 1 (BH-1)</option>
                <option value="BH-2">Boys Hostel 2 (BH-2)</option>
                <option value="GH-1">Girls Hostel 1 (GH-1)</option>
                <option value="GUEST_HOUSE">GCEK Guest House</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-black uppercase">
                Room / Bed Number
              </label>
              <input
                type="text"
                value={roomNumberInput}
                onChange={(e) => setRoomNumberInput(e.target.value)}
                placeholder="e.g. 104-B"
                className="w-full px-3 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold"
              />
            </div>

            <button
              onClick={handleSaveAccommodation}
              disabled={isUpdating}
              className="w-full py-3 bg-purple-300 hover:bg-purple-400 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm cursor-pointer"
            >
              SAVE ROOM ASSIGNMENT
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ========================================================================= */}
      {/* PAYMENT PROOF & VERIFICATION PREVIEW MODAL (DARK PROOF VIEWER)             */}
      {/* ========================================================================= */}
      {isPaymentProofModalOpen &&
        selectedPaymentSquad &&
        (() => {
          const isSynopsisTab = activeProofTab === "synopsis";
          const rawDocUrl = isSynopsisTab
            ? selectedPaymentSquad.documents?.synopsisDriveUrl ||
              selectedPaymentSquad.documents?.synopsisUrl
            : selectedPaymentSquad.documents?.collegeIdDriveUrl ||
              selectedPaymentSquad.documents?.collegeIdUrl;

          const docFileId = isSynopsisTab
            ? selectedPaymentSquad.documents?.synopsisDriveFileId
            : selectedPaymentSquad.documents?.collegeIdDriveFileId;

          const docName = isSynopsisTab
            ? selectedPaymentSquad.documents?.synopsisFileName
            : selectedPaymentSquad.documents?.collegeIdFileName;

          const docSize = isSynopsisTab
            ? selectedPaymentSquad.documents?.synopsisFileSize
            : selectedPaymentSquad.documents?.collegeIdFileSize;

          const hasDoc = Boolean(rawDocUrl || docName || docFileId);

          // Authenticated streaming preview URL (bypasses Google Drive permission / account roadblocks)
          const previewUrl = docFileId
            ? `/api/admin/drive/preview?fileId=${encodeURIComponent(docFileId)}`
            : rawDocUrl
              ? `/api/admin/drive/preview?url=${encodeURIComponent(rawDocUrl)}`
              : null;

          const downloadUrl = docFileId
            ? `/api/admin/drive/preview?fileId=${encodeURIComponent(docFileId)}&download=1`
            : rawDocUrl
              ? `/api/admin/drive/preview?url=${encodeURIComponent(rawDocUrl)}&download=1`
              : null;

          const isImage = Boolean(
            docName?.match(/\.(png|jpe?g|webp|gif|svg)$/i) ||
            rawDocUrl?.match(/\.(png|jpe?g|webp|gif|svg)$/i) ||
            rawDocUrl?.startsWith("data:image/"),
          );

          const isPdf = Boolean(
            docName?.match(/\.pdf$/i) ||
            rawDocUrl?.match(/\.pdf$/i) ||
            rawDocUrl?.includes("application/pdf"),
          );

          const formatLabel = !hasDoc
            ? "No document"
            : isImage
              ? docName?.split(".").pop()?.toUpperCase() || "IMAGE"
              : isPdf
                ? "application/pdf"
                : docName?.split(".").pop()?.toUpperCase() || "DOCUMENT";

          return (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
              onClick={() => setIsPaymentProofModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#141417] text-white border-2 border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
              >
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-mono text-sm font-bold text-white truncate flex items-center gap-2">
                      {hasDoc ? (
                        isImage ? (
                          <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        )
                      ) : (
                        <FileX className="w-4 h-4 text-neutral-500 shrink-0" />
                      )}
                      <span>
                        {hasDoc
                          ? docName ||
                            (isSynopsisTab
                              ? "Synopsis Document"
                              : "Student Photo ID")
                          : "No Document Uploaded"}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-400 truncate">
                      {hasDoc && docSize && (
                        <span>Original: {docSize} &bull; </span>
                      )}
                      Squad: {selectedPaymentSquad.teamName} &bull; Leader:{" "}
                      {selectedPaymentSquad.leaderName}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPaymentProofModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Document Tabs */}
                <div className="flex items-center gap-2 px-5 pt-3 border-b border-neutral-800 bg-[#101013]">
                  <button
                    onClick={() => setActiveProofTab("collegeId")}
                    className={`px-3 py-1.5 font-mono text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeProofTab === "collegeId"
                        ? "border-emerald-400 text-emerald-400"
                        : "border-transparent text-neutral-400 hover:text-white"
                    }`}
                  >
                    Student Photo ID / Proof
                  </button>
                  <button
                    onClick={() => setActiveProofTab("synopsis")}
                    className={`px-3 py-1.5 font-mono text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeProofTab === "synopsis"
                        ? "border-emerald-400 text-emerald-400"
                        : "border-transparent text-neutral-400 hover:text-white"
                    }`}
                  >
                    Synopsis Deck / Document
                  </button>
                </div>

                {/* Modal Body: High Resolution Media Container */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[380px] max-h-[520px] bg-[#0c0c0e]">
                  {previewUrl && isImage ? (
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <img
                        src={previewUrl}
                        alt={docName || "Uploaded Document"}
                        className="max-h-[420px] max-w-full object-contain rounded-md border border-neutral-800 shadow-2xl"
                        onError={(e) => {
                          if (rawDocUrl && !e.currentTarget.src.includes(rawDocUrl)) {
                            e.currentTarget.src = rawDocUrl;
                          }
                        }}
                      />
                    </div>
                  ) : previewUrl && (isPdf || !isImage) ? (
                    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center gap-2">
                      <iframe
                        src={previewUrl}
                        title="Document Preview"
                        className="w-full h-[400px] rounded-lg border border-neutral-700 bg-neutral-900"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm bg-[#16161a] border border-neutral-800 rounded-xl p-8 space-y-3 text-center animate-in fade-in duration-150">
                      <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
                        <FileX className="w-7 h-7 stroke-[1.5px] text-neutral-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-300">
                          NO DOCUMENT UPLOADED
                        </div>
                        <div className="font-mono text-xs text-neutral-500 leading-relaxed">
                          No{" "}
                          {isSynopsisTab
                            ? "project synopsis deck"
                            : "student photo ID / proof"}{" "}
                          was uploaded for this squad.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Action Pill Bar */}
                <div className="px-5 py-3 bg-[#111114] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="text-neutral-400 flex items-center gap-2">
                    <span>
                      Format:{" "}
                      <strong className="text-neutral-200">
                        {formatLabel}
                      </strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Instant Fullscreen Preview */}
                    {previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Open document in a dedicated browser tab"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>Fullscreen Preview</span>
                      </a>
                    )}

                    {/* Direct Download */}
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        download
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Directly download document file"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Download</span>
                      </a>
                    )}

                    {/* Open in Google Drive */}
                    {rawDocUrl && !rawDocUrl.startsWith("/uploads") && (
                      <a
                        href={rawDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Open file directly in Google Drive"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                        <span>Google Drive</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}

                    {/* View Official Invoice PDF in New Tab */}
                    <a
                      href={`/api/admin/registrations/invoice?id=${selectedPaymentSquad.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Open official PDF Tax Invoice in a new tab"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice (PDF)</span>
                    </a>
                  </div>
                </div>

                {/* Bottom Verification Footer */}
                <div className="px-5 py-4 bg-[#141417] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-mono text-xs text-neutral-300">
                      <span className="text-neutral-500">Mode:</span>{" "}
                      <strong>
                        {selectedPaymentSquad.paymentMode || "UPI_QR"}
                      </strong>{" "}
                      &bull; <span className="text-neutral-500">UTR:</span>{" "}
                      <strong className="text-amber-400 font-mono">
                        {selectedPaymentSquad.transactionId || "N/A"}
                      </strong>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-400">
                      Status:{" "}
                      <span
                        className={`font-bold uppercase ${
                          selectedPaymentSquad.paymentStatus === "VERIFIED"
                            ? "text-emerald-400"
                            : selectedPaymentSquad.paymentStatus === "REJECTED"
                              ? "text-rose-400"
                              : "text-amber-400"
                        }`}
                      >
                        {selectedPaymentSquad.paymentStatus || "PENDING"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdatePayment(selectedPaymentSquad.id, "REJECTED")
                      }
                      disabled={isUpdating}
                      className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/50 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() =>
                        handleUpdatePayment(selectedPaymentSquad.id, "VERIFIED")
                      }
                      disabled={isUpdating}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-xs font-black rounded-lg flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Approve Payment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      {/* ===================================================================== */}
      {/* MODAL: OFFICIAL ENTRY PASS & DESK CHECK-IN QR CODE                    */}
      {/* ===================================================================== */}
      {isPassModalOpen && selectedPassSquad && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsPassModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border-4 border-black p-6 space-y-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-3 border-black pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-300 border-2 border-black flex items-center justify-center shadow-neo-xs">
                  <QrCode className="w-5 h-5 stroke-[2.5px] text-black" />
                </div>
                <div>
                  <h3 className="font-mono font-black text-base text-black uppercase">
                    OFFICIAL CHECK-IN BADGE &amp; QR
                  </h3>
                  <p className="font-mono text-[11px] text-neutral-600">
                    Scan at Registration Desk • Print on Badge Card
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPassModalOpen(false)}
                className="w-8 h-8 bg-black text-white hover:bg-neutral-800 border-2 border-black flex items-center justify-center font-bold text-sm cursor-pointer shadow-neo-xs"
              >
                ✕
              </button>
            </div>

            {/* Printable Pass Card Base */}
            <div
              id="hackverse-printable-desk-card"
              className="border-3 border-black p-5 bg-white space-y-4 shadow-neo-sm relative"
            >
              {/* Top Header: cbhack logo on left, HACKVERSE'26 in center, cblogo on right */}
              <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 gap-2">
                {/* Top Left: HACKVERSE Logo */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-start shrink-0">
                  <img
                    src="/cbhack.webp"
                    alt="HACKVERSE '26"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Center Title: HACKVERSE'26 in Thuast font */}
                <div className="flex items-center justify-center text-center flex-1 min-w-0 px-1">
                  <h2
                    style={{ fontFamily: "var(--font-thuast, 'Thuast'), 'Thuast', sans-serif" }}
                    className="font-thuast font-normal text-xl sm:text-2xl text-black tracking-normal uppercase leading-none whitespace-nowrap"
                  >
                    HACKVERSE&apos;26
                  </h2>
                </div>

                {/* Top Right: CodeBreakers Logo */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-end shrink-0">
                  <img
                    src="/cblogo.webp"
                    alt="CodeBreakers GCEK"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Squad Name on Left & Squad Identifier on Right */}
              <div className="flex items-start justify-between gap-4 pt-1">
                {/* Left: Squad Name & College Info */}
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-black uppercase text-neutral-500 block tracking-wider">
                    SQUAD NAME
                  </span>
                  <span className="font-sans font-black text-xl text-black uppercase block leading-tight mt-0.5 truncate">
                    {selectedPassSquad.teamName}
                  </span>
                  <span className="font-mono text-xs text-neutral-700 block truncate mt-1">
                    {selectedPassSquad.collegeName}
                  </span>
                </div>

                {/* Right: Squad Identifier */}
                <div className="space-y-1 text-right shrink-0">
                  <span className="font-mono text-[10px] font-black uppercase text-neutral-500 block tracking-wider">
                    SQUAD IDENTIFIER
                  </span>
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <span className="font-mono font-black text-lg text-black bg-amber-200 px-2.5 py-0.5 border-2 border-black inline-block shadow-neo-xs">
                      {selectedPassSquad.registrationNumber}
                    </span>
                    {selectedPassSquad.status &&
                      selectedPassSquad.status !== "PENDING_VERIFICATION" && (
                        <span className="px-2 py-0.5 bg-emerald-200 border-2 border-black font-mono font-black text-[11px] text-emerald-950 uppercase">
                          {selectedPassSquad.status}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* 2D QR Code & 1D Barcode Preview (Centered & Stacked) */}
              <div className="p-5 bg-neutral-50 border-2 border-black flex flex-col items-center justify-center gap-4 text-center">
                {/* 2D QR Code (Larger & Centered) */}
                <div className="flex flex-col items-center justify-center">
                  <div className="p-2.5 border-2 border-black bg-white shadow-neo-sm">
                    <QRCodeSVG
                      value={`${typeof window !== "undefined" ? window.location.origin : "https://hackverse.codebreakersgcek.tech"}/teams/${selectedPassSquad.registrationNumber}`}
                      size={160}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* 1D Barcode (At the Bottom of 2D QR, Centered) */}
                <div className="flex flex-col items-center justify-center space-y-1 w-full pt-1">
                  <div className="flex items-center justify-center h-11 overflow-hidden max-w-full">
                    {(() => {
                      const bData = encodeCode128B(selectedPassSquad.registrationNumber);
                      const bScale = 1.35;
                      return (
                        <svg
                          width={bData.totalModules * bScale}
                          height={42}
                          className="max-w-full shrink-0"
                        >
                          {bData.bars.map((bar, i) => (
                            <rect
                              key={i}
                              x={(bar.x * bScale).toFixed(1)}
                              y={0}
                              width={(bar.width * bScale).toFixed(1)}
                              height={42}
                              fill="#000000"
                            />
                          ))}
                        </svg>
                      );
                    })()}
                  </div>
                  <span className="font-mono text-[11px] font-black tracking-widest text-black">
                    * {selectedPassSquad.registrationNumber} *
                  </span>
                </div>
              </div>

              {/* Leader & Contact Info */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-black/15">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">TEAM LEADER:</span>
                  <span className="font-bold text-black truncate block">{selectedPassSquad.leaderName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">CONTACT:</span>
                  <span className="font-bold text-black truncate block">{selectedPassSquad.leaderPhone}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-[10px] font-mono font-bold text-neutral-500 text-center uppercase tracking-wider pt-2 border-t border-dashed border-black/25">
                HACKVERSE &apos;26 • REGISTRATION DESK PASS &amp; VERIFICATION
              </div>
            </div>

            {/* Actions: Download Pass PNG, Direct Print, View URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={`/api/admin/registrations/pass?id=${selectedPassSquad.registrationNumber}`}
                download={`${selectedPassSquad.registrationNumber}-ENTRY-PASS.png`}
                className="py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-black border-2 border-black font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-neo-sm cursor-pointer text-center"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD BADGE (PNG)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="py-2.5 px-3 bg-black hover:bg-neutral-800 text-white border-2 border-black font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-neo-sm cursor-pointer text-center"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT DESK CARD</span>
              </button>

              <Link
                href={`/teams/${selectedPassSquad.registrationNumber}`}
                target="_blank"
                className="sm:col-span-2 py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-black border-2 border-black font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-neo-xs cursor-pointer text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN SQUAD DOSSIER (/teams/{selectedPassSquad.registrationNumber})</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Neo-Brutalist Action Confirmation Alert Dialog Modal */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        isLoading={isUpdating}
      />
    </div>
  );
}
