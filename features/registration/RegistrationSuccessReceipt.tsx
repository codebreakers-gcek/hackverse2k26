"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Printer,
  Download,
  Loader2,
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
import { encodeCode128B } from "@/lib/barcode128";

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

  const ticketNumber =
    result.ticketId || result.registrationId || "HV26-241263";
  const baseUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://hackverse.codebreakersgcek.tech";
  const qrData = `${baseUrl}/teams/${encodeURIComponent(ticketNumber)}`;
  const barcodeData = encodeCode128B(ticketNumber);
  const barcodeScale = 1.35;

  const handlePrint = () => {
    window.print();
  };

  // Download pass as PNG
  const handleDownloadPng = async () => {
    if (!passRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `HACKVERSE-26-ENTRY-PASS-${ticketNumber}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Entry pass downloaded as PNG!");
    } catch (err) {
      console.error("Failed to export entry pass image:", err);
      toast.error("Failed to generate pass image. You can use Print instead.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
      {/* ========================================================================= */}
      {/* 1. STATUS NOTIFICATION HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[6px_6px_0px_#000] text-black print:hidden">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 bg-[#5B8731] border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
            <CheckCircle2 className="w-6 h-6 text-white stroke-[3px]" />
          </div>
          <div className="space-y-0.5">
            <h2 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              SQUAD REGISTRATION CONFIRMED!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed">
              Your squad details have been registered into the HACKVERSE &apos;26 database. Save or print your official Entry Pass below.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL TOURNAMENT ENTRY PASS (PRINT & IMAGE EXPORT CONTAINER) */}
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
            <div className="w-12 h-12 shrink-0 flex items-center justify-center relative">
              <Image
                src="/cbhack.webp"
                alt="Hackverse Logo"
                width={48}
                height={48}
                priority
                unoptimized
                className="w-full h-full object-contain"
              />
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
                <span className="font-mono text-[11px] text-emerald-600 font-bold flex items-center gap-1 tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5px] shrink-0" />
                  <span>VERIFIED ON ROSTER</span>
                </span>
              </div>
            </div>

            {/* Crisp Vector Barcode (Code 128) */}
            <div className="flex flex-col items-center sm:items-end justify-center space-y-1.5 w-full sm:w-auto">
              <div className="flex items-center h-12 overflow-hidden max-w-full">
                <svg
                  width={barcodeData.totalModules * barcodeScale}
                  height={44}
                  className="max-w-full shrink-0"
                >
                  {barcodeData.bars.map((bar, i) => (
                    <rect
                      key={i}
                      x={(bar.x * barcodeScale).toFixed(1)}
                      y={0}
                      width={(bar.width * barcodeScale).toFixed(1)}
                      height={44}
                      fill="#000000"
                    />
                  ))}
                </svg>
              </div>
              <div className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-black">
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
      <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[6px_6px_0px_#000] print:hidden">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Primary Action: Download PNG */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-black text-xs uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed [text-shadow:_1px_1px_0_#000]"
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
      <div className="text-center pt-3 print:hidden flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] font-mono text-xs font-black uppercase shadow-[4px_4px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span>RETURN TO HACKVERSE HOMEPAGE</span>
          <ArrowRight className="w-4 h-4 stroke-[3px]" />
        </Link>
      </div>
    </div>
  );
}
