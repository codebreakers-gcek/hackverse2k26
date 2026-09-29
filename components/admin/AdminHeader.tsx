"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { RefreshCw, Radio, Sparkles, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
  const pathname = usePathname();
  const { fetchData, isLoading } = useAdmin();
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path: string) => {
    if (path === "/admin") return { title: "Overview", group: "Dashboard" };
    if (path.startsWith("/admin/squads"))
      return { title: "Squads & Rosters", group: "Operations" };
    if (path.startsWith("/admin/problems"))
      return { title: "Problem Statements", group: "Tracks" };
    if (path.startsWith("/admin/accommodation"))
      return { title: "Hostel Allocation", group: "Logistics" };
    if (path.startsWith("/admin/payments"))
      return { title: "Payment Verification", group: "Finance" };
    if (path.startsWith("/admin/scanner"))
      return { title: "Scanner & Judge PIN", group: "Check-in" };
    if (path.startsWith("/admin/settings"))
      return { title: "Storage & Settings", group: "Configuration" };
    return { title: "Admin Console", group: "Dashboard" };
  };

  const pageInfo = getPageTitle(pathname || "/admin");

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b-2 border-neutral-800 bg-[#0e0e12]/95 backdrop-blur-md px-4 md:px-6 shadow-sm select-none text-white">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 border-2 border-neutral-700 bg-neutral-900 hover:bg-amber-400 hover:text-black text-neutral-200 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer" />
        <Separator
          orientation="vertical"
          className="h-5 w-[2px] bg-neutral-800 hidden sm:block"
        />

        {/* Breadcrumb / Page Title */}
        <div className="flex items-center gap-2 font-mono text-xs font-black uppercase">
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            ADMIN
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-600 hidden md:block" />
          <span className="px-2.5 py-0.5 border-2 border-amber-400 bg-amber-400 text-black font-black shadow-[1.5px_1.5px_0px_0px_#000000]">
            {pageInfo.title}
          </span>
        </div>
      </div>

      {/* Right Telemetry Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        {timeString && (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 border-2 border-neutral-800 bg-neutral-900 font-mono text-xs font-black text-neutral-300 shadow-[2px_2px_0px_0px_#000000]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>IST {timeString}</span>
          </div>
        )}

        {/* Refresh Data Button */}
        <button
          onClick={() => fetchData()}
          disabled={isLoading}
          title="Refresh live telemetry"
          className="h-9 px-3 border-2 border-neutral-700 bg-neutral-900 hover:bg-cyan-400 hover:text-black font-mono text-xs font-black uppercase flex items-center gap-2 text-neutral-200 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50 transition-all"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 stroke-[2.5px] ${
              isLoading ? "animate-spin text-cyan-400" : ""
            }`}
          />
          <span className="hidden sm:inline">REFRESH</span>
        </button>
      </div>
    </header>
  );
}
