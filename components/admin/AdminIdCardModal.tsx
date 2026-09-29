"use client";

import React, { useRef } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { QRCodeSVG } from "qrcode.react";
import { encodeCode128B } from "@/lib/barcode128";
import {
  X,
  Printer,
  Download,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export function AdminIdCardModal() {
  const { selectedPassSquad, setSelectedPassSquad } = useAdmin();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedPassSquad) return null;

  const totalMembers = 1 + (selectedPassSquad.members?.length || 0);
  const ps = PROBLEM_STATEMENTS_DATA.find(
    (p) => p.id === selectedPassSquad.problemStatementId
  );

  const barcodeData = encodeCode128B(selectedPassSquad.registrationNumber);
  const barcodeScale = 1.35;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dark fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg border-4 border-neutral-700 bg-neutral-900 shadow-[8px_8px_0px_0px_#000000] overflow-hidden animate-in fade-in zoom-in duration-200 text-white">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 bg-neutral-950 p-3.5">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-amber-400">
            <span className="w-2.5 h-2.5 bg-amber-400 inline-block" />
            OFFICIAL PARTICIPANT PASS &amp; ID
          </div>
          <button
            onClick={() => setSelectedPassSquad(null)}
            className="w-8 h-8 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center font-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ID Pass Preview Card (Printable) */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div
            ref={printRef}
            className="border-3 border-neutral-700 bg-neutral-950 p-5 space-y-5 shadow-[4px_4px_0px_0px_#000000]"
          >
            {/* Header / Event Badge */}
            <div className="flex items-start justify-between gap-2 border-b-2 border-neutral-800 pb-3">
              <div>
                <div className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  CODEBREAKERS GCEK PRESENTS
                </div>
                <div className="font-mono font-black text-xl text-amber-400 tracking-tight">
                  HACKVERSE &apos;26
                </div>
                <div className="font-mono text-[9px] text-neutral-400 font-bold">
                  24-HOUR STATE TECH FEST &amp; HACKATHON
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black bg-amber-400 text-black inline-block shadow-[1px_1px_0px_0px_#000000]">
                  {selectedPassSquad.registrationNumber}
                </span>
                <div className="font-mono text-[9px] font-bold text-emerald-400 uppercase mt-1">
                  ● {selectedPassSquad.status || "CONFIRMED"}
                </div>
              </div>
            </div>

            {/* Team Info */}
            <div className="space-y-1">
              <div className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                TEAM NAME
              </div>
              <div className="font-black text-xl text-white uppercase tracking-tight">
                {selectedPassSquad.teamName}
              </div>
              <div className="font-mono text-xs text-neutral-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                <span className="truncate">{selectedPassSquad.collegeName}</span>
              </div>
            </div>

            {/* Leader & Track Row */}
            <div className="grid grid-cols-2 gap-3 border-t border-b border-neutral-800 py-2.5 font-mono text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                  TEAM LEADER
                </span>
                <span className="font-black text-white block truncate">
                  {selectedPassSquad.leaderName}
                </span>
                <span className="text-[10px] text-neutral-400 block truncate">
                  {selectedPassSquad.leaderPhone}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                  SQUAD SIZE / CATEGORY
                </span>
                <span className="font-black text-white block">
                  {totalMembers} Hackers
                </span>
                <span className="text-[10px] text-cyan-400 font-bold block truncate">
                  {ps?.category || ps?.domain || "Open Innovation"}
                </span>
              </div>
            </div>

            {/* Barcode & QR Code Section */}
            <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-neutral-700 space-y-4 text-black">
              {/* 2D QR Code */}
              <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000]">
                <QRCodeSVG
                  value={`${
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "https://hackverse.codebreakersgcek.tech"
                  }/teams/${selectedPassSquad.registrationNumber}`}
                  size={140}
                  level="H"
                />
              </div>

              {/* 1D Barcode */}
              <div className="flex flex-col items-center justify-center w-full">
                <svg
                  width={barcodeData.totalModules * barcodeScale}
                  height={36}
                  className="max-w-full"
                >
                  {barcodeData.bars.map((bar, i) => (
                    <rect
                      key={i}
                      x={(bar.x * barcodeScale).toFixed(1)}
                      y={0}
                      width={(bar.width * barcodeScale).toFixed(1)}
                      height={36}
                      fill="#000000"
                    />
                  ))}
                </svg>
                <span className="font-mono text-[10px] font-black tracking-widest text-black mt-1">
                  * {selectedPassSquad.registrationNumber} *
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT PASS</span>
            </button>

            <a
              href={`/api/admin/registrations/pass?id=${selectedPassSquad.registrationNumber}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PNG</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
