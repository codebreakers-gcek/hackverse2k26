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
  Unlock,
  EyeOff,
} from "lucide-react";
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
  | "accomodation"
  | "payments"
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

  // Filtered Squads
  const query = (searchQuery || "").toLowerCase().trim();
  const filteredSquads = registrations.filter((squad) => {
    if (!squad) return false;

    const matchesSearch =
      !query ||
      (squad.teamName || "").toLowerCase().includes(query) ||
      (squad.leaderName || "").toLowerCase().includes(query) ||
      (squad.leaderEmail || "").toLowerCase().includes(query) ||
      (squad.registrationNumber || "").toLowerCase().includes(query) ||
      (squad.collegeName || "").toLowerCase().includes(query) ||
      (squad.transactionId || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || squad.status === statusFilter;
    const matchesPs =
      psFilter === "ALL" || squad.problemStatementId === psFilter;
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
                  {activeTab === "accomodation" && "Hostel & Room Allocation"}
                  {activeTab === "payments" && "Finance & Transaction Audit"}
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
                        className="p-4 bg-neutral-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2"
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
                                : squad.status === "REJECTED"
                                  ? "bg-rose-300 text-rose-950"
                                  : "bg-amber-200 text-amber-950"
                            }`}
                          >
                            {squad.status}
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

                          <td className="p-3.5 max-w-[200px]">
                            <div className="font-medium text-black truncate">
                              {squad.collegeName}
                            </div>
                            <div className="font-mono text-[10px] text-amber-700 font-bold">
                              Track: {squad.problemStatementId || "General"}
                            </div>
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
                                  : squad.status === "REJECTED"
                                    ? "bg-rose-300 text-rose-950"
                                    : "bg-amber-200 text-amber-950"
                              }`}
                            >
                              {squad.status}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedSquad(squad);
                                  setIsSquadSheetOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black font-mono text-[10px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                              >
                                INSPECT
                              </button>

                              {squad.status !== "CONFIRMED" && (
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
          {/* TAB 5: SETTINGS & STORAGE                                             */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase">
                      UPI ID For Registrations
                    </label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) =>
                        setSettings({ ...settings, upiId: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase">
                      Payee Name
                    </label>
                    <input
                      type="text"
                      value={settings.payeeName}
                      onChange={(e) =>
                        setSettings({ ...settings, payeeName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase">
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
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs font-black uppercase">
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
                      className="w-full px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold"
                    />
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
                        : selectedSquad.status === "REJECTED"
                          ? "bg-rose-400 text-black"
                          : "bg-amber-300 text-black"
                    }`}
                  >
                    {selectedSquad.status}
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
                  <div className="font-mono text-xs font-black uppercase">
                    Decision &amp; Dispatch
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedSquad.id, "CONFIRMED")
                      }
                      disabled={isUpdating}
                      className="py-2.5 bg-emerald-400 hover:bg-emerald-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer"
                    >
                      ✓ CONFIRM SQUAD
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedSquad.id, "REJECTED")
                      }
                      disabled={isUpdating}
                      className="py-2.5 bg-rose-400 hover:bg-rose-500 text-black border-2 border-black font-black text-xs uppercase shadow-neo-sm cursor-pointer"
                    >
                      ✕ REJECT
                    </button>
                  </div>

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
                  <div className="font-mono text-xs text-neutral-700 space-y-0.5">
                    <div>📧 {selectedSquad.leaderEmail}</div>
                    <div>📱 {selectedSquad.leaderPhone}</div>
                    <div>🏛️ {selectedSquad.collegeName}</div>
                    <div>
                      🎓 {selectedSquad.leaderBranch} (
                      {selectedSquad.leaderYear})
                    </div>
                  </div>
                </div>

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
