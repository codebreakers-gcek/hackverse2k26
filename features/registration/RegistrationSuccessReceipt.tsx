"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Printer, Terminal, Calendar, MapPin, ArrowRight } from "lucide-react";
import { RegistrationSubmissionResult } from "@/types/registration";
import { EVENT_DATA } from "@/data/event";

export interface RegistrationSuccessReceiptProps {
  result: RegistrationSubmissionResult;
  onReset: () => void;
}

export function RegistrationSuccessReceipt({ result, onReset }: RegistrationSuccessReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
      {/* Success Notification Alert */}
      <div className="border-4 border-black bg-emerald-300 p-6 shadow-neo text-black flex items-start gap-4">
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
          <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
        </div>
        <div>
          <h3 className="font-black text-xl uppercase tracking-tight">
            REGISTRATION CONFIRMED!
          </h3>
          <p className="text-sm font-bold mt-1 text-black/85">
            {result.message}
          </p>
        </div>
      </div>

      {/* Official Boarding Pass Ticket */}
      <div className="border-4 border-black bg-white shadow-neo-xl overflow-hidden relative print:shadow-none print:m-0">
        {/* Ticket Header */}
        <div className="bg-black text-white p-6 flex flex-wrap items-center justify-between gap-4 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-secondary text-black flex items-center justify-center border-2 border-white">
              <Terminal className="w-6 h-6 stroke-[3px]" />
            </div>
            <div>
              <div className="font-black text-lg tracking-wider">HACKVERSE &apos;26 ENTRY PASS</div>
              <div className="font-mono text-xs text-neo-secondary font-bold">
                CODEBREAKERS // GCE KALAHANDI
              </div>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-[10px] uppercase text-neutral-400">TICKET IDENTIFIER</div>
            <div className="text-sm sm:text-base font-black text-neo-accent">
              {result.ticketId || "HACKVERSE-GCEK-LIVE"}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b-3 border-black pb-6">
            <div>
              <div className="font-mono text-xs font-black uppercase text-black/60">
                TEAM DESIGNATION
              </div>
              <div className="font-black text-2xl text-black uppercase tracking-tight mt-0.5">
                {result.teamName || "REGISTERED SQUAD"}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs font-black uppercase text-black/60">
                REGISTRATION REF
              </div>
              <div className="font-mono font-black text-xl text-black mt-0.5">
                {result.registrationId || "CB-REG-ONLINE"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neo-accent stroke-[3px] shrink-0" />
              <div>
                <div className="font-mono text-[10px] font-black uppercase text-black/60">
                  EVENT DATES
                </div>
                <div className="font-bold text-xs sm:text-sm text-black">
                  {EVENT_DATA.displayDates}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-neo-secondary stroke-[3px] shrink-0" />
              <div>
                <div className="font-mono text-[10px] font-black uppercase text-black/60">
                  REPORTING VENUE
                </div>
                <div className="font-bold text-xs sm:text-sm text-black">
                  {EVENT_DATA.location.campus}, {EVENT_DATA.location.city}
                </div>
              </div>
            </div>
          </div>

          {/* Barcode Mockup */}
          <div className="pt-4 border-t-3 border-black flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-1 h-12">
              {[4, 2, 6, 2, 8, 3, 5, 2, 7, 3, 4, 6, 2, 5, 3, 7, 2, 4, 3, 6, 4, 2, 8, 3, 5, 2].map(
                (w, i) => (
                  <div
                    key={i}
                    className="h-full bg-black"
                    style={{ width: `${w}px` }}
                  />
                )
              )}
            </div>
            <div className="font-mono text-[10px] font-black tracking-[0.3em] text-black">
              * {result.ticketId || "HACKVERSE-GCEK-LIVE"} *
            </div>
          </div>
        </div>

        {/* Ticket Footer Action Bar */}
        <div className="bg-neo-secondary border-t-4 border-black p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm hover:bg-neutral-100 transition-all"
          >
            <Printer className="w-4 h-4 stroke-[3px]" />
            <span>PRINT / SAVE PASS</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-black uppercase underline decoration-2 hover:text-neo-accent transition-colors"
          >
            REGISTER ANOTHER TEAM
          </button>
        </div>
      </div>

      <div className="text-center pt-2 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase underline hover:text-neo-accent transition-colors"
        >
          <span>RETURN TO TECH FEST HOMEPAGE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
