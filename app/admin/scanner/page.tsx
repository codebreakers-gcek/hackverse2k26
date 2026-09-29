"use client";

import React, { useState } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { QRCodeSVG } from "qrcode.react";
import {
  KeyRound,
  QrCode,
  Smartphone,
  Copy,
  CheckCheck,
  Radio,
  RefreshCw,
  Ban,
  ShieldCheck,
  Clock,
  Laptop,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

function formatTimeRemaining(seconds: number) {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function AdminScannerPage() {
  const {
    scannerData,
    fetchScannerData,
    handleGenerateScannerPin,
    handleRevokeScannerPin,
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [pinLabel, setPinLabel] = useState("Main Gate Scanner #1");
  const [pinRole, setPinRole] = useState("admin");
  const [pinExpiryHours, setPinExpiryHours] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyPin = () => {
    if (!scannerData.pin) return;
    navigator.clipboard.writeText(scannerData.pin);
    setCopied(true);
    toast.success("Scanner PIN copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await handleGenerateScannerPin(pinLabel, pinRole, pinExpiryHours);
    setIsGenerating(false);
  };

  const scannerLoginUrl =
    typeof window !== "undefined" && scannerData.pin
      ? `${window.location.origin}/scanner?pin=${scannerData.pin}`
      : `https://hackverse.codebreakersgcek.tech/scanner${
          scannerData.pin ? `?pin=${scannerData.pin}` : ""
        }`;

  return (
    <div className="space-y-6 select-none text-white">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 border font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] ${
                scannerData.active
                  ? "bg-lime-400 text-black border-lime-400 animate-pulse"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700"
              }`}
            >
              ● {scannerData.active ? "PIN ACTIVE & ONLINE" : "OFFLINE / INACTIVE"}
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              ATTENDANCE &amp; CHECK-IN GATES
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            SCANNER &amp; JUDGE AUTH PIN
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Generate secure temporary authentication PINs and QR login codes for volunteer scanner devices and judges.
          </p>
        </div>

        <button
          onClick={() => fetchScannerData()}
          className="py-2 px-3 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH SESSIONS</span>
        </button>
      </div>

      {/* Main Grid: Active PIN Card & QR Login */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active PIN Display (7 cols) */}
        <div className="lg:col-span-7 border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h2 className="font-mono text-sm font-black uppercase text-white">
                ACTIVE AUTHENTICATION PIN
              </h2>
            </div>
            {scannerData.active && (
              <span className="px-2 py-0.5 border border-lime-400 bg-lime-400 font-mono text-[10px] font-black uppercase text-black">
                AUTHORIZED SESSION
              </span>
            )}
          </div>

          {scannerData.active && scannerData.pin ? (
            <div className="space-y-6">
              {/* Giant PIN Display */}
              <div className="p-6 border-3 border-amber-400 bg-amber-400 shadow-[4px_4px_0px_0px_#000000] text-center space-y-3 text-black">
                <span className="font-mono text-xs font-black uppercase text-neutral-900 tracking-wider block">
                  TEMPORARY ACCESS PASSCODE
                </span>
                <div className="font-mono text-5xl md:text-6xl font-black tracking-widest text-black select-all">
                  {scannerData.pin}
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleCopyPin}
                    className="py-2 px-4 border-2 border-black bg-white hover:bg-neutral-100 text-black font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] cursor-pointer transition-all"
                  >
                    {copied ? (
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? "COPIED PIN" : "COPY PIN"}</span>
                  </button>

                  <button
                    onClick={() => handleRevokeScannerPin()}
                    className="py-2 px-4 border-2 border-black bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] cursor-pointer transition-all"
                  >
                    <Ban className="w-4 h-4" />
                    <span>REVOKE PIN</span>
                  </button>
                </div>
              </div>

              {/* Session Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 border-2 border-neutral-800 bg-neutral-950">
                  <span className="text-neutral-500 text-[10px] block font-bold uppercase">
                    TIME REMAINING
                  </span>
                  <span className="font-black text-sm text-amber-300 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {formatTimeRemaining(scannerData.remainingSeconds)}
                  </span>
                </div>

                <div className="p-3 border-2 border-neutral-800 bg-neutral-950">
                  <span className="text-neutral-500 text-[10px] block font-bold uppercase">
                    ACTIVE DEVICES
                  </span>
                  <span className="font-black text-sm text-cyan-300 flex items-center gap-1 mt-0.5">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                    {scannerData.session?.activeDeviceCount || 0} / 8 Allowed
                  </span>
                </div>

                <div className="p-3 border-2 border-neutral-800 bg-neutral-950 col-span-2 sm:col-span-1">
                  <span className="text-neutral-500 text-[10px] block font-bold uppercase">
                    ROLE PERMISSION
                  </span>
                  <span className="font-black text-sm text-emerald-400 uppercase mt-0.5 block truncate">
                    {scannerData.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-neutral-800 bg-neutral-950 text-center space-y-3 font-mono text-xs">
              <KeyRound className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="font-black uppercase text-neutral-300">
                NO ACTIVE SCANNER PIN SESSION
              </div>
              <p className="text-neutral-500 max-w-xs mx-auto">
                Generate a temporary passcode below to grant volunteers camera barcode scanning access without sharing passwords.
              </p>
            </div>
          )}

          {/* Generator Form */}
          <div className="border-2 border-neutral-800 bg-neutral-950 p-4 space-y-4">
            <div className="font-mono text-xs font-black uppercase text-neutral-300 flex items-center gap-2 border-b border-neutral-800 pb-2">
              <RefreshCw className="w-3.5 h-3.5" />
              GENERATE NEW ACCESS PASSCODE
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div>
                <label className="font-bold block mb-1 text-neutral-400">Session Label</label>
                <input
                  type="text"
                  value={pinLabel}
                  onChange={(e) => setPinLabel(e.target.value)}
                  placeholder="e.g. Gate 1"
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-bold focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-neutral-400">Role Level</label>
                <select
                  value={pinRole}
                  onChange={(e) => setPinRole(e.target.value)}
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-bold uppercase cursor-pointer focus:border-amber-400"
                >
                  <option value="admin">Full Admin / Scanner</option>
                  <option value="judge">Judge Evaluation</option>
                  <option value="volunteer">Volunteer Check-in</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-neutral-400">Validity Duration</label>
                <select
                  value={pinExpiryHours}
                  onChange={(e) => setPinExpiryHours(Number(e.target.value))}
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-900 text-white font-bold uppercase cursor-pointer focus:border-amber-400"
                >
                  <option value={2}>2 Hours</option>
                  <option value={6}>6 Hours</option>
                  <option value={8}>8 Hours (Full Shift)</option>
                  <option value={12}>12 Hours</option>
                  <option value={24}>24 Hours</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] cursor-pointer text-black disabled:opacity-50 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>GENERATE PASSCODE NOW</span>
            </button>
          </div>
        </div>

        {/* Right Column: QR Code Direct Login (5 cols) */}
        <div className="lg:col-span-5 border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-neutral-800 pb-3">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <h2 className="font-mono text-sm font-black uppercase text-white">
                MOBILE QUICK SCAN QR
              </h2>
            </div>
            <p className="font-mono text-xs text-neutral-400">
              Volunteers can point their smartphone camera at this QR code to automatically authenticate and launch the camera scanner without typing.
            </p>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-neutral-800 bg-neutral-950 shadow-[3px_3px_0px_0px_#000000]">
              <div className="p-3 border-2 border-neutral-700 bg-white shadow-[2px_2px_0px_0px_#000000]">
                <QRCodeSVG
                  value={scannerLoginUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase mt-3">
                ● INSTANT GATE APP LAUNCH
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/scanner"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] cursor-pointer text-black"
            >
              <ExternalLink className="w-4 h-4" />
              <span>TEST SCANNER APP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
