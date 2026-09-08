import React from "react";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-neo-lg max-w-lg space-y-6">
        <div className="w-16 h-16 bg-neo-accent border-4 border-black flex items-center justify-center mx-auto shadow-neo-sm">
          <Terminal className="w-8 h-8 text-black stroke-[3px]" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-neo-secondary border-2 border-black">
            ERROR 404 // ROUTE NOT FOUND
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-black tracking-tight pt-2">
            PAGE DOES NOT EXIST
          </h1>
          <p className="text-sm font-bold text-black/70">
            The requested terminal coordinates could not be resolved on the HACKVERSE &apos;26 mainframe.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-secondary text-black font-black text-sm uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neo-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span>RETURN TO BASE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
