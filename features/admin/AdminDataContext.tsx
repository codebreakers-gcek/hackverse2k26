"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import {
  RegistrationRecord,
  AdminStats,
  SystemSettingsState,
  ScannerPinData,
} from "@/types/admin";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  onConfirm: () => void | Promise<void>;
}

interface AdminContextValue {
  // Data State
  registrations: RegistrationRecord[];
  stats: AdminStats | null;
  settings: SystemSettingsState;
  scannerData: ScannerPinData;
  isLoading: boolean;
  isUpdating: boolean;
  isSavingSettings: boolean;
  isSendingEmail: boolean;
  isTestingDrive: boolean;
  isSyncingPermissions: boolean;
  isDisconnectingDrive: boolean;
  driveTestResult: {
    success: boolean;
    message: string;
    folderName?: string;
    folderId?: string;
    webViewLink?: string;
  } | null;

  // Selected for modals
  selectedSquad: RegistrationRecord | null;
  setSelectedSquad: (squad: RegistrationRecord | null) => void;
  selectedPassSquad: RegistrationRecord | null;
  setSelectedPassSquad: (squad: RegistrationRecord | null) => void;

  // Confirm Dialog
  confirmDialog: ConfirmDialogState;
  openConfirm: (options: Omit<ConfirmDialogState, "isOpen">) => void;
  closeConfirm: () => void;

  // Actions
  fetchData: () => Promise<void>;
  fetchScannerData: () => Promise<void>;
  handleUpdateStatus: (id: string, newStatus: string) => Promise<void>;
  handleDispatchEmail: (
    registrationId: string,
    type: "submission" | "approval"
  ) => Promise<void>;
  handleSaveAccommodation: (
    id: string,
    hostelBlock: string,
    roomNumber: string
  ) => Promise<boolean>;
  handleUpdatePayment: (
    id: string,
    newPaymentStatus: string
  ) => Promise<void>;
  handleDeleteSquad: (id: string, teamName: string) => void;
  handleBanSquad: (squad: RegistrationRecord) => void;
  handleUnbanSquad: (squad: RegistrationRecord) => void;
  handleUpdateProblemStatement: (
    id: string,
    pref1: string,
    pref2?: string,
    clearOrUnlock?: "clear" | "unlock" | null
  ) => Promise<boolean>;
  handleSaveFullSquad: (
    id: string,
    updatedData: Partial<RegistrationRecord>
  ) => Promise<{ success: boolean; data?: RegistrationRecord; message?: string }>;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettingsState>>;
  handleSaveSettings: (customSettings?: SystemSettingsState) => Promise<boolean>;
  handleToggleSetting: (
    key: "isRegistrationOpen" | "isProblemStatementsPublished",
    newValue: boolean
  ) => Promise<boolean>;
  handleTestDriveConnection: () => Promise<void>;
  handleSyncPermissions: () => Promise<void>;
  handleDisconnectDrive: () => Promise<void>;
  handleGenerateScannerPin: (
    label?: string,
    role?: string,
    expiresInHours?: number
  ) => Promise<boolean>;
  handleRevokeScannerPin: (sessionId?: string) => Promise<boolean>;
}

const defaultSettings: SystemSettingsState = {
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
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [settings, setSettings] = useState<SystemSettingsState>(defaultSettings);
  const [scannerData, setScannerData] = useState<ScannerPinData>({
    active: false,
    remainingSeconds: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDisconnectingDrive, setIsDisconnectingDrive] = useState(false);
  const [isTestingDrive, setIsTestingDrive] = useState(false);
  const [isSyncingPermissions, setIsSyncingPermissions] = useState(false);
  const [driveTestResult, setDriveTestResult] = useState<{
    success: boolean;
    message: string;
    folderName?: string;
    folderId?: string;
    webViewLink?: string;
  } | null>(null);

  // Selected squad for inspecting / ID Card modals
  const [selectedSquad, setSelectedSquad] = useState<RegistrationRecord | null>(
    null
  );
  const [selectedPassSquad, setSelectedPassSquad] =
    useState<RegistrationRecord | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const openConfirm = useCallback(
    (options: Omit<ConfirmDialogState, "isOpen">) => {
      setConfirmDialog({ ...options, isOpen: true });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Fetch all primary admin records
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [regRes, statsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/registrations", { cache: "no-store" }),
        fetch("/api/admin/stats", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);

      if (regRes.ok) {
        const data = await regRes.json();
        const list = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.registrations)
          ? data.registrations
          : [];
        setRegistrations(list);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats || null);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
      toast.error("Failed to load real-time telemetry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch scanner PIN data
  const fetchScannerData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scanner-pin", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setScannerData(data);
      }
    } catch (err) {
      console.error("Failed to fetch scanner PIN:", err);
    }
  }, []);

  // Initial load & scanner polling
  useEffect(() => {
    fetchData();
    fetchScannerData();
  }, [fetchData, fetchScannerData]);

  // Scanner countdown timer
  useEffect(() => {
    if (!scannerData.active || scannerData.remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setScannerData((prev) => {
        if (prev.remainingSeconds <= 1) {
          fetchScannerData();
          return { ...prev, active: false, remainingSeconds: 0 };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [scannerData.active, scannerData.remainingSeconds, fetchScannerData]);

  // Status update
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
          `Squad status updated to ${newStatus}.${
            newStatus === "CONFIRMED" ? " Confirmation email & pass ready." : ""
          }`
        );
        await fetchData();
        if (selectedSquad?.id === id) {
          setSelectedSquad((prev) =>
            prev ? { ...prev, status: newStatus } : null
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

  // Dispatch confirmation / submission email
  const handleDispatchEmail = async (
    registrationId: string,
    type: "submission" | "approval"
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
            ? "Pass & Confirmation Email dispatched!"
            : "Submission Receipt Email dispatched!"
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

  // Accommodation update
  const handleSaveAccommodation = async (
    id: string,
    hostelBlock: string,
    roomNumber: string
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          accommodationStatus: "ALLOCATED",
          hostelBlock,
          roomNumber,
        }),
      });
      if (res.ok) {
        toast.success(`Allocated Room ${roomNumber} (${hostelBlock}).`);
        await fetchData();
        if (selectedSquad?.id === id) {
          setSelectedSquad((prev) =>
            prev
              ? {
                  ...prev,
                  accommodationStatus: "ALLOCATED",
                  hostelBlock,
                  roomNumber,
                }
              : null
          );
        }
        return true;
      } else {
        toast.error("Failed to allocate room.");
        return false;
      }
    } catch {
      toast.error("Network error.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Payment status update
  const handleUpdatePayment = async (
    id: string,
    newPaymentStatus: string
  ) => {
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
          toast.success("Payment verified! Team marked as CONFIRMED.");
        } else if (newPaymentStatus === "REJECTED") {
          toast.error("Payment rejected.");
        } else {
          toast.success(`Payment marked as ${newPaymentStatus}.`);
        }
        await fetchData();
        if (selectedSquad?.id === id) {
          setSelectedSquad((prev) =>
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
              : null
          );
        }
      } else {
        toast.error("Failed to update payment status.");
      }
    } catch {
      toast.error("Error updating payment.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Squad Record
  const handleDeleteSquad = (id: string, teamName: string) => {
    openConfirm({
      title: "Delete Squad Roster",
      description: `Are you sure you want to permanently delete squad "${teamName}"? All member rosters and verification documents will be permanently erased.`,
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
            if (selectedSquad?.id === id) setSelectedSquad(null);
            closeConfirm();
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

  // Ban Squad
  const handleBanSquad = (squad: RegistrationRecord) => {
    openConfirm({
      title: "BAN / DISQUALIFY SQUAD",
      description: `Are you sure you want to BAN squad "${squad.teamName}" (${squad.registrationNumber})? This squad will be disqualified from HACKVERSE '26.`,
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
            toast.error(`Squad "${squad.teamName}" has been BANNED.`);
            closeConfirm();
            await fetchData();
            if (selectedSquad?.id === squad.id) {
              setSelectedSquad((prev) =>
                prev ? { ...prev, status: "BANNED" } : null
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

  // Unban Squad
  const handleUnbanSquad = (squad: RegistrationRecord) => {
    openConfirm({
      title: "UNBAN & RESTORE SQUAD",
      description: `Are you sure you want to lift the ban and restore squad "${squad.teamName}" to CONFIRMED status?`,
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
            closeConfirm();
            await fetchData();
            if (selectedSquad?.id === squad.id) {
              setSelectedSquad((prev) =>
                prev ? { ...prev, status: "CONFIRMED" } : null
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

  // Problem statement update
  const handleUpdateProblemStatement = async (
    id: string,
    pref1: string,
    pref2?: string,
    clearOrUnlock?: "clear" | "unlock" | null
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const payload: any = { id };
      if (clearOrUnlock === "unlock") {
        payload.unlockPsSelection = true;
      } else if (clearOrUnlock === "clear") {
        payload.problemStatementId = null;
        payload.problemStatement2 = null;
        payload.selectedProblemStatements = [];
      } else {
        if (!pref1) {
          toast.error("Please select a primary problem statement.");
          setIsUpdating(false);
          return false;
        }
        if (pref2 && pref1 === pref2) {
          toast.error("Choice #1 and Choice #2 must be different problem statements.");
          setIsUpdating(false);
          return false;
        }
        payload.problemStatementId = pref1;
        payload.problemStatement2 = pref2 || null;
        payload.selectedProblemStatements = [pref1, ...(pref2 ? [pref2] : [])];
      }

      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        toast.success(
          clearOrUnlock === "unlock"
            ? "Problem statement selection unlocked for squad."
            : clearOrUnlock === "clear"
            ? "Problem statement cleared for squad."
            : "Problem statement updated successfully!"
        );
        await fetchData();
        if (selectedSquad?.id === id) {
          setSelectedSquad(data.data);
        }
        return true;
      } else {
        toast.error(data.error || "Failed to update problem statement.");
        return false;
      }
    } catch {
      toast.error("Network error while updating problem statement.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Full Squad Edit by Admin
  const handleSaveFullSquad = async (
    id: string,
    updatedData: Partial<RegistrationRecord>
  ): Promise<{ success: boolean; data?: RegistrationRecord; message?: string }> => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedData }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        toast.success(resData.message || "Squad details updated successfully.");
        if (resData.audit?.emailChangesCount > 0) {
          toast.info(
            `Auth email migrated for ${resData.audit.emailChangesCount} user(s). Security notifications dispatched to both old and new emails.`
          );
        }
        await fetchData();
        if (resData.data) {
          setSelectedSquad(resData.data);
        }
        return { success: true, data: resData.data, message: resData.message };
      } else {
        toast.error(resData.error || "Failed to update squad details.");
        return { success: false, message: resData.error };
      }
    } catch (err: any) {
      toast.error(err.message || "Network error updating squad details.");
      return { success: false, message: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (
    customSettings?: SystemSettingsState
  ): Promise<boolean> => {
    setIsSavingSettings(true);
    const toSave = customSettings || settings;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      if (res.ok) {
        toast.success("Admin system settings persisted successfully.");
        await fetchData();
        return true;
      } else {
        toast.error("Failed to persist settings.");
        return false;
      }
    } catch {
      toast.error("Network error saving settings.");
      return false;
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Fast Toggle Setting
  const handleToggleSetting = async (
    key: "isRegistrationOpen" | "isProblemStatementsPublished",
    newValue: boolean
  ): Promise<boolean> => {
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
              ? "✓ Registrations are now OPEN."
              : "✕ Registrations are now CLOSED."
            : newValue
            ? "✓ Problem Statements are PUBLISHED."
            : "✕ Problem Statements are UNPUBLISHED."
        );
        await fetchData();
        return true;
      } else {
        toast.error("Failed to toggle setting.");
        return false;
      }
    } catch {
      toast.error("Network error.");
      return false;
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Test Drive
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
          message: data.data?.message || "Google Drive connection verified!",
          folderName: data.data?.folderName,
          folderId: data.data?.folderId,
          webViewLink: data.data?.webViewLink,
        });
        toast.success("Google Drive connected and verified!");
      } else {
        setDriveTestResult({
          success: false,
          message: data.error || "Failed to authenticate Drive API.",
        });
        toast.error(`Drive test failed: ${data.error || "Check credentials"}`);
      }
    } catch (err: any) {
      setDriveTestResult({
        success: false,
        message: err.message || "Network error.",
      });
      toast.error("Network error during Drive test.");
    } finally {
      setIsTestingDrive(false);
    }
  };

  // Sync Permissions
  const handleSyncPermissions = async () => {
    setIsSyncingPermissions(true);
    try {
      const res = await fetch("/api/admin/drive/sync-permissions", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Drive permissions synchronized!");
      } else {
        toast.error(data.error || "Failed to sync Drive permissions.");
      }
    } catch {
      toast.error("Network error during permission sync.");
    } finally {
      setIsSyncingPermissions(false);
    }
  };

  // Disconnect Drive
  const handleDisconnectDrive = async () => {
    if (!confirm("Are you sure you want to disconnect Google Drive?")) return;
    setIsDisconnectingDrive(true);
    try {
      const res = await fetch("/api/admin/drive/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Google Drive disconnected.");
        setDriveTestResult(null);
        await fetchData();
      } else {
        toast.error("Failed to disconnect Drive.");
      }
    } catch {
      toast.error("Network error disconnecting Drive.");
    } finally {
      setIsDisconnectingDrive(false);
    }
  };

  // Scanner PIN Generation
  const handleGenerateScannerPin = async (
    label: string = "Admin Session",
    role: string = "admin",
    expiresInHours: number = 8
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/scanner-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, role, expiresInHours }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Generated new PIN: ${data.pin}`);
        await fetchScannerData();
        return true;
      } else {
        toast.error(data.error || "Failed to generate PIN.");
        return false;
      }
    } catch {
      toast.error("Network error generating PIN.");
      return false;
    }
  };

  // Revoke PIN
  const handleRevokeScannerPin = async (sessionId?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/scanner-pin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("PIN revoked and scanner sessions invalidated.");
        await fetchScannerData();
        return true;
      } else {
        toast.error(data.error || "Failed to revoke PIN.");
        return false;
      }
    } catch {
      toast.error("Network error revoking PIN.");
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        registrations,
        stats,
        settings,
        scannerData,
        isLoading,
        isUpdating,
        isSavingSettings,
        isSendingEmail,
        isTestingDrive,
        isSyncingPermissions,
        isDisconnectingDrive,
        driveTestResult,
        selectedSquad,
        setSelectedSquad,
        selectedPassSquad,
        setSelectedPassSquad,
        confirmDialog,
        openConfirm,
        closeConfirm,
        fetchData,
        fetchScannerData,
        handleUpdateStatus,
        handleDispatchEmail,
        handleSaveAccommodation,
        handleUpdatePayment,
        handleDeleteSquad,
        handleBanSquad,
        handleUnbanSquad,
        handleUpdateProblemStatement,
        handleSaveFullSquad,
        setSettings,
        handleSaveSettings,
        handleToggleSetting,
        handleTestDriveConnection,
        handleSyncPermissions,
        handleDisconnectDrive,
        handleGenerateScannerPin,
        handleRevokeScannerPin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
