"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Printer,
  Download,
  Loader2,
  Terminal,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { RegistrationSubmissionResult } from "@/types/registration";
import { EVENT_DATA } from "@/data/event";

export interface RegistrationSuccessReceiptProps {
  result: RegistrationSubmissionResult;
  onReset: () => void;
}

export function RegistrationSuccessReceipt({
  result,
  onReset,
}: RegistrationSuccessReceiptProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const ticketNumber = result.ticketId || result.registrationId || "HV26-241263";
  const qrData = `HACKVERSE26_PASS:${ticketNumber}:${result.teamName || "SQUAD"}`;

  // Download pass as PNG
  const handleDownloadPng = async () => {
    if (!passRef.current) return;
    setIsDownloading(true);

    try {
      // Ensure all styles and assets are rendered cleanly
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ultra-high resolution 3x PNG
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${ticketNumber}-PASS.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Entry pass downloaded as PNG!");
    } catch (err) {
      console.error("Failed to generate PNG pass:", err);
      toast.error("PNG export error. Opening print preview...");
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
      {/* Success Notification Alert (Hidden on print) */}
      <div className="border-4 border-black bg-emerald-300 p-6 shadow-neo text-black flex items-start gap-4 print:hidden">
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
          <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
        </div>
        <div>
          <h3 className="font-black text-xl uppercase tracking-tight">
            REGISTRATION CONFIRMED!
          </h3>
          <p className="text-sm font-bold mt-1 text-black/85">
            {result.message ||
              "Your squad entry is officially registered and verified on the HACKVERSE '26 roster."}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL BOARDING PASS TICKET (PNG EXPORT & PRINT TARGET)                 */}
      {/* ========================================================================= */}
      <div
        ref={passRef}
        id="official-boarding-pass"
        className="border-4 border-black bg-white shadow-neo-xl relative overflow-hidden print:shadow-none print:m-0 print:border-4 print:border-black text-black select-none"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      >
        {/* Left Cutout Punch Hole Notion Indicator */}
        <div className="absolute -left-3.5 top-[92px] w-7 h-7 bg-black rounded-full z-10 border-2 border-black" />

        {/* Ticket Header */}
        <div className="bg-black text-white p-5 sm:p-6 flex flex-row items-center justify-between gap-4 border-b-4 border-black">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-amber-400 text-black flex items-center justify-center border-2 border-black shrink-0 shadow-sm font-mono font-black text-xl tracking-tighter">
              &gt;_
            </div>
            <div>
              <div className="font-black text-lg sm:text-xl tracking-wider uppercase font-sans leading-tight">
                HACKVERSE &apos;26 ENTRY PASS
              </div>
              <div className="font-mono text-xs text-amber-400 font-bold tracking-wide mt-0.5">
                CODEBREAKERS // GCE KALAHANDI
              </div>
            </div>
          </div>

          <div className="text-right font-mono bg-[#141414] px-4 py-1.5 border border-white/20 rounded-md shrink-0">
            <div className="text-[9px] sm:text-[10px] uppercase text-neutral-400 font-bold tracking-wider">
              TICKET IDENTIFIER
            </div>
            <div className="text-sm sm:text-base font-black text-amber-400 tracking-wider">
              {ticketNumber}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Squad & Registration Info */}
          <div className="flex items-start justify-between gap-4 border-b-4 border-black pb-5">
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold uppercase text-neutral-500 tracking-wider">
                TEAM DESIGNATION
              </div>
              <div className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight break-words">
                {result.teamName || "JHATUGANG"}
              </div>
            </div>

            <div className="space-y-1 text-right shrink-0">
              <div className="font-mono text-xs font-bold uppercase text-neutral-500 tracking-wider">
                ACCESS TIER
              </div>
              <div className="inline-block font-mono font-black text-xs uppercase px-3 py-1 bg-[#ccfbf1] text-[#115e59] border-2 border-black tracking-wide shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                ALL-ACCESS PASS
              </div>
            </div>
          </div>

          {/* Dates & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b-4 border-black pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-rose-100 border-2 border-black flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-rose-600 stroke-[2.5px]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  EVENT DATES
                </div>
                <div className="font-black text-xs sm:text-sm text-black">
                  {EVENT_DATA.displayDates || "OCTOBER 08 - 10, 2026"}
                </div>
                <div className="font-mono text-[10px] text-neutral-600 font-medium">
                  24-Hour Continuous Hackathon
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-amber-100 border-2 border-black flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-amber-700 stroke-[2.5px]" />
              </div>
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  REPORTING VENUE
                </div>
                <div className="font-black text-xs sm:text-sm text-black leading-snug">
                  {EVENT_DATA.location.campus || "Government College of Engineering Kalahandi"}
                </div>
                <div className="font-mono text-[10px] text-neutral-600 font-medium">
                  {EVENT_DATA.location.city || "Bhawanipatna"}, {EVENT_DATA.location.state || "Odisha"}
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Perks Notice Bar */}
          <div className="p-3 bg-[#f0fdf4] border-2 border-black flex items-center justify-between gap-3 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                Includes 24h Arena Access, Snacks &amp; Certifications.
              </span>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 font-bold shrink-0 hidden sm:inline">
              SECURE #HV26
            </span>
          </div>

          {/* QR & Barcode Section */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* QR Code */}
            <div className="flex items-center gap-3.5 shrink-0 self-start sm:self-center">
              <div className="p-2 bg-white border-2 border-black shadow-sm shrink-0 flex items-center justify-center">
                <QRCodeSVG
                  value={qrData}
                  size={84}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">
                  FAST-TRACK CHECK-IN
                </span>
                <span className="font-black text-xs sm:text-sm text-black block">
                  Scan at Registration Desk
                </span>
                <span className="font-mono text-[11px] text-emerald-600 font-bold block tracking-wide">
                  ✓ VERIFIED ON ROSTER
                </span>
              </div>
            </div>

            {/* Crisp Vector Barcode */}
            <div className="flex flex-col items-center sm:items-end justify-center space-y-1.5 w-full sm:w-auto">
              <div className="flex items-center gap-0.5 sm:gap-1 h-12 overflow-hidden max-w-full">
                {[
                  3, 1, 4, 1, 2, 5, 2, 1, 3, 2, 4, 1, 5, 2, 1, 3, 2, 4, 1, 2,
                  5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 5, 1, 2, 3, 2, 4, 1, 3,
                ].map((w, i) => (
                  <div
                    key={i}
                    className="h-full bg-black shrink-0"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <div className="font-mono text-xs sm:text-sm font-black tracking-[0.3em] text-black">
                * {ticketNumber} *
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Bottom Bar */}
        <div className="bg-black text-white px-6 py-2.5 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-1 font-mono text-[10px] uppercase font-bold tracking-wider">
          <span>HACKVERSE 2026 OFFICIAL STATE HACKATHON</span>
          <span>GOVT. COLLEGE OF ENGINEERING KALAHANDI</span>
        </div>
      </div>

      {/* Ticket Action Controls */}
      <div className="border-4 border-black bg-amber-300 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-neo print:hidden">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Primary Action: Download PNG */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neutral-800 hover:shadow-none transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GENERATING PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[3px]" />
                <span>PRINT / SAVE PASS (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Return Link */}
      <div className="text-center pt-2 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase underline hover:text-amber-500 transition-colors text-black"
        >
          <span>RETURN TO TECH FEST HOMEPAGE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
