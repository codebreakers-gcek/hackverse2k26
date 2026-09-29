"use client";

import React, { useState } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import {
  Settings,
  HardDrive,
  CreditCard,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  FolderOpen,
  Save,
  Loader2,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const {
    settings,
    setSettings,
    handleSaveSettings,
    handleTestDriveConnection,
    handleSyncPermissions,
    handleDisconnectDrive,
    isSavingSettings,
    isTestingDrive,
    isSyncingPermissions,
    isDisconnectingDrive,
    driveTestResult,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"gates" | "payment" | "drive" | "contact">("gates");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveSettings(settings);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 select-none text-white">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-violet-400 bg-violet-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● SYSTEM CONFIGURATION
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              HACKVERSE &apos;26 SYSTEM PARAMETERS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            STORAGE &amp; SYSTEM SETTINGS
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Manage registration gates, squad limits, UPI payment parameters, and Google Drive cloud storage.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          type="submit"
          disabled={isSavingSettings}
          className="py-3 px-6 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-black disabled:opacity-50 transition-all shrink-0"
        >
          {isSavingSettings ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>SAVE SYSTEM SETTINGS</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-neutral-800 pb-2 overflow-x-auto">
        {(
          [
            { id: "gates", label: "Registration & Gates", icon: Lock },
            { id: "payment", label: "UPI & Payment", icon: CreditCard },
            { id: "drive", label: "Google Drive Cloud", icon: HardDrive },
            { id: "contact", label: "Helpline & Contact", icon: Phone },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 border-2 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-amber-400 text-black border-amber-400 shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800 shadow-[1px_1px_0px_0px_#000000]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REGISTRATION & GATES */}
      {activeTab === "gates" && (
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-6">
          <div className="border-b-2 border-neutral-800 pb-3">
            <h2 className="font-mono text-sm font-black uppercase text-white">
              REGISTRATION GATES &amp; SQUAD SIZES
            </h2>
            <p className="font-mono text-xs text-neutral-400">
              Control public registration accessibility and allowed squad member limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Gate Toggle */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-white">
                  Public Squad Registrations
                </span>
                <input
                  type="checkbox"
                  checked={settings.isRegistrationOpen}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      isRegistrationOpen: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>
              <p className="font-mono text-[11px] text-neutral-400">
                When enabled, participants can submit new squad registrations on the public site.
              </p>
            </div>

            {/* Problem Statements Gate Toggle */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase text-white">
                  Problem Statements Live Visibility
                </span>
                <input
                  type="checkbox"
                  checked={settings.isProblemStatementsPublished}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      isProblemStatementsPublished: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>
              <p className="font-mono text-[11px] text-neutral-400">
                When enabled, challenge problem statements and track details are viewable by all participants.
              </p>
            </div>

            {/* Min Squad Size */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <label className="font-mono text-xs font-black uppercase text-white block">
                Minimum Squad Size (Hackers)
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={settings.minSquadSize}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    minSquadSize: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-sm font-black focus:border-amber-400"
              />
              <p className="font-mono text-[11px] text-neutral-500">
                Default: 2 hackers (Leader + 1 member)
              </p>
            </div>

            {/* Max Squad Size */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <label className="font-mono text-xs font-black uppercase text-white block">
                Maximum Squad Size (Hackers)
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={settings.maxSquadSize}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxSquadSize: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-sm font-black focus:border-amber-400"
              />
              <p className="font-mono text-[11px] text-neutral-500">
                Default: 4 hackers (Leader + 3 members)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPI & PAYMENT */}
      {activeTab === "payment" && (
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-6">
          <div className="border-b-2 border-neutral-800 pb-3">
            <h2 className="font-mono text-sm font-black uppercase text-white">
              UPI PAYMENT GATEWAY &amp; FEE PARAMETERS
            </h2>
            <p className="font-mono text-xs text-neutral-400">
              Configure receiver UPI ID, registration ticket price, and payment requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Registration Fee (₹) */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <label className="font-black uppercase text-white block">
                Registration Fee Amount (INR ₹)
              </label>
              <input
                type="number"
                min={0}
                value={settings.registrationFee}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    registrationFee: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-sm font-black focus:border-amber-400"
              />
              <p className="text-[11px] text-neutral-400">
                Set to 0 for Free Registration Tier (Sponsored).
              </p>
            </div>

            {/* Mandatory Payment Toggle */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-white">
                  Mandatory Payment Verification
                </span>
                <input
                  type="checkbox"
                  checked={settings.isPaymentMandatory}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      isPaymentMandatory: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 accent-amber-400 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                If checked, squads cannot submit registration without providing a valid UPI transaction reference ID.
              </p>
            </div>

            {/* UPI ID */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <label className="font-black uppercase text-white block">
                Recipient UPI VPA / ID
              </label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    upiId: e.target.value,
                  }))
                }
                placeholder="e.g. codebreakers@upi"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs font-bold focus:border-amber-400"
              />
            </div>

            {/* Payee Name */}
            <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-2">
              <label className="font-black uppercase text-white block">
                Official Payee Display Name
              </label>
              <input
                type="text"
                value={settings.payeeName}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    payeeName: e.target.value,
                  }))
                }
                placeholder="e.g. HACKVERSE 2026 GCEK"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-mono text-xs font-bold focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE DRIVE CLOUD */}
      {activeTab === "drive" && (
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-neutral-800 pb-3">
            <div>
              <h2 className="font-mono text-sm font-black uppercase text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                GOOGLE DRIVE CLOUD STORAGE
              </h2>
              <p className="font-mono text-xs text-neutral-400">
                Automated document upload storage (College ID Cards &amp; Synopsis files)
              </p>
            </div>

            <span
              className={`px-2.5 py-1 border font-mono text-[10px] font-black uppercase self-start sm:self-auto ${
                settings.googleDriveEnabled
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700"
              }`}
            >
              ● {settings.googleDriveEnabled ? "DRIVE CONNECTED" : "OFFLINE"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Folder Name */}
            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Target Google Drive Folder Name
              </label>
              <input
                type="text"
                value={settings.googleDriveFolderName || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    googleDriveFolderName: e.target.value,
                  }))
                }
                placeholder="e.g. HACKVERSE 2026 Team Uploads"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold focus:border-amber-400"
              />
            </div>

            {/* Folder ID */}
            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Target Folder ID (From Google Drive URL)
              </label>
              <input
                type="text"
                value={settings.googleDriveFolderId || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    googleDriveFolderId: e.target.value,
                  }))
                }
                placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold focus:border-amber-400"
              />
            </div>

            {/* Service Account Email */}
            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Service Account Client Email (Optional)
              </label>
              <input
                type="text"
                value={settings.googleDriveClientEmail || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    googleDriveClientEmail: e.target.value,
                  }))
                }
                placeholder="service-account@hackverse.iam.gserviceaccount.com"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold focus:border-amber-400"
              />
            </div>

            {/* Service Account JSON */}
            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Service Account Private Key / JSON (Optional)
              </label>
              <textarea
                rows={3}
                value={settings.googleDriveServiceAccountJson || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    googleDriveServiceAccountJson: e.target.value,
                  }))
                }
                placeholder='Paste service account JSON key here...'
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-[10px] focus:border-amber-400"
              />
            </div>
          </div>

          {/* Drive Actions Bar */}
          <div className="p-4 border-2 border-neutral-800 bg-neutral-950 space-y-3 font-mono text-xs">
            <div className="font-black uppercase text-neutral-300">
              DRIVE DIAGNOSTICS &amp; ACTIONS
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestDriveConnection}
                disabled={isTestingDrive}
                className="py-2 px-3 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                {isTestingDrive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>TEST DRIVE CONNECTION</span>
              </button>

              <button
                type="button"
                onClick={handleSyncPermissions}
                disabled={isSyncingPermissions}
                className="py-2 px-3 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
              >
                {isSyncingPermissions ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Shield className="w-3.5 h-3.5" />
                )}
                <span>SYNC PERMISSIONS</span>
              </button>

              {settings.googleDriveEnabled && (
                <button
                  type="button"
                  onClick={handleDisconnectDrive}
                  disabled={isDisconnectingDrive}
                  className="py-2 px-3 border-2 border-rose-500/40 bg-neutral-900 hover:bg-neutral-800 text-rose-400 font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DISCONNECT DRIVE</span>
                </button>
              )}
            </div>

            {/* Test Result Callout */}
            {driveTestResult && (
              <div
                className={`p-3 border-2 font-mono text-xs mt-3 ${
                  driveTestResult.success
                    ? "bg-emerald-950/80 border-emerald-600 text-emerald-300"
                    : "bg-rose-950/80 border-rose-600 text-rose-300"
                }`}
              >
                <div className="font-black">
                  {driveTestResult.success ? "✓ TEST PASSED" : "✕ TEST FAILED"}
                </div>
                <div className="mt-0.5">{driveTestResult.message}</div>
                {driveTestResult.folderName && (
                  <div className="mt-1 text-[10px] text-neutral-400">
                    Folder: {driveTestResult.folderName} (ID: {driveTestResult.folderId})
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HELPLINE & CONTACT */}
      {activeTab === "contact" && (
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-6">
          <div className="border-b-2 border-neutral-800 pb-3">
            <h2 className="font-mono text-sm font-black uppercase text-white">
              HELPLINE &amp; ORGANIZER CONTACT DETAILS
            </h2>
            <p className="font-mono text-xs text-neutral-400">
              Support phone and email displayed on participant receipts, invoices, and passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Organizer Helpline Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contactPhone: e.target.value,
                  }))
                }
                placeholder="+91 9876543210"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold focus:border-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="font-black uppercase text-white block">
                Official Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                placeholder="hackverse26@codebreakersgcek.tech"
                className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
