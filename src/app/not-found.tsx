import React from "react";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-grid-paper">
      <div className="border-4 border-black bg-white p-8 sm:p-12 shadow-neo-xl max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 bg-neo-accent text-black border-4 border-black mx-auto flex items-center justify-center shadow-neo-sm">
          <Terminal className="w-8 h-8 stroke-[3px]" />
        </div>

        <div>
          <span className="font-mono text-xs font-black uppercase px-2 py-0.5 bg-black text-white">
            ERROR // 404
          </span>
          <h1 className="font-black text-4xl sm:text-5xl text-black uppercase tracking-tight mt-2">
            PAGE NOT FOUND
          </h1>
          <p className="text-sm font-bold text-black/75 mt-3">
            The route or resource you attempted to access does not exist on the INNOVEX &apos;26 server matrix.
          </p>
        </div>

        <div className="pt-2 border-t-3 border-black">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-secondary text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:shadow-neo transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span>RETURN TO HOMEPAGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
