"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminRegistrationChart } from "@/components/admin/AdminRegistrationChart";
import {
  LayoutDashboard,
  Users,
  Compass,
  BedDouble,
  CreditCard,
  KeyRound,
  Settings,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  HardDrive,
  QrCode,
  Building2,
  Lock,
  Unlock,
  Eye,
  Send,
  Loader2,
} from "lucide-react";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";

export default function AdminOverviewPage() {
  const {
    registrations,
    stats,
    settings,
    scannerData,
    setSelectedSquad,
    setSelectedPassSquad,
    handleToggleSetting,
    isSavingSettings,
  } = useAdmin();

  const totalSquads = stats?.totalSquads ?? registrations.length;
  const totalParticipants = stats?.totalParticipants ?? 0;
  const confirmedTeams =
    stats?.confirmedTeams ??
    registrations.filter((r) => r.status === "CONFIRMED").length;
  const pendingTeams =
    stats?.pendingTeams ??
    registrations.filter((r) => r.status === "PENDING_VERIFICATION").length;
  const accomRequested =
    stats?.accommodationRequested ??
    registrations.filter((r) => r.accommodationRequired).length;
  const paymentPending = stats?.paymentPending ?? 0;

  // Recent 5 squads
  const recentSquads = [...registrations]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 select-none text-white">
      {/* Top Banner / Hero */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-amber-400 bg-amber-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● REAL-TIME TELEMETRY
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              HACKVERSE &apos;26 OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            MISSION CONTROL &amp; TELEMETRY
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Live overview of squad submissions, problem statement distribution, accommodation, and access gates.
          </p>
        </div>

        {/* Quick Gate Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Registration Gate Switch */}
          <button
            onClick={() =>
              handleToggleSetting(
                "isRegistrationOpen",
                !settings.isRegistrationOpen
              )
            }
            disabled={isSavingSettings}
            className={`px-3 py-2 border-2 font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
              settings.isRegistrationOpen
                ? "bg-emerald-400 hover:bg-emerald-300 text-black border-emerald-400"
                : "bg-rose-500 hover:bg-rose-400 text-white border-rose-500"
            }`}
          >
            {settings.isRegistrationOpen ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>REGISTRATIONS: OPEN</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>REGISTRATIONS: CLOSED</span>
              </>
            )}
          </button>

          {/* Problem Statement Gate Switch */}
          <button
            onClick={() =>
              handleToggleSetting(
                "isProblemStatementsPublished",
                !settings.isProblemStatementsPublished
              )
            }
            disabled={isSavingSettings}
            className={`px-3 py-2 border-2 font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
              settings.isProblemStatementsPublished
                ? "bg-cyan-400 hover:bg-cyan-300 text-black border-cyan-400"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>
              PS: {settings.isProblemStatementsPublished ? "PUBLISHED" : "HIDDEN"}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Squads"
          value={totalSquads}
          description="Registered hackathon teams"
          icon={Users}
          colorBg="bg-amber-400"
          badgeText="SQUADS"
        />
        <AdminStatCard
          title="Total Hackers"
          value={totalParticipants}
          description="Verified squad members"
          icon={Sparkles}
          colorBg="bg-cyan-400"
          badgeText="ROSTER"
        />
        <AdminStatCard
          title="Confirmed Teams"
          value={confirmedTeams}
          description={`${pendingTeams} pending verification`}
          icon={CheckCircle2}
          colorBg="bg-emerald-400"
          badgeText={`${Math.round((confirmedTeams / (totalSquads || 1)) * 100)}% APPROVED`}
          badgeBg="bg-emerald-950/60 text-emerald-400 border-emerald-800"
        />
        <AdminStatCard
          title="Hostel Requests"
          value={accomRequested}
          description={`${stats?.accommodationAllocated || 0} allocated so far`}
          icon={BedDouble}
          colorBg="bg-fuchsia-400"
          badgeText="LOGISTICS"
        />
      </div>

      {/* Registration Velocity Chart */}
      <AdminRegistrationChart registrations={registrations} />

      {/* Two Column Grid: Problem Distribution & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Statements Distribution (2 cols) */}
        <div className="lg:col-span-2 border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
            <div>
              <h2 className="font-mono text-sm font-black uppercase text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                Problem Statement Track Distribution
              </h2>
              <p className="font-mono text-xs text-neutral-400">
                Squad selections across official challenge tracks
              </p>
            </div>
            <Link
              href="/admin/problems"
              className="px-2.5 py-1 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#000000] text-black"
            >
              <span>MANAGE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {PROBLEM_STATEMENTS_DATA.map((p) => {
              const assignedCount = stats?.psDistribution?.[p.id] ?? 0;
              const percentage =
                totalSquads > 0 ? Math.round((assignedCount / totalSquads) * 100) : 0;

              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-neutral-200 truncate max-w-[280px] sm:max-w-md">
                      <span className="bg-neutral-950 px-1.5 py-0.5 border border-neutral-800 text-amber-400 font-black mr-2">
                        {p.id}
                      </span>
                      {p.title}
                    </span>
                    <span className="font-black text-neutral-400 shrink-0 ml-2">
                      {assignedCount} squads ({percentage}%)
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-3 border-2 border-neutral-800 bg-neutral-950 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 border-r-2 border-black transition-all duration-500"
                      style={{ width: `${Math.max(percentage, assignedCount > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System & Gate Diagnostics (1 col) */}
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
          <div className="border-b-2 border-neutral-800 pb-3">
            <h2 className="font-mono text-sm font-black uppercase text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              SYSTEM DIAGNOSTICS
            </h2>
            <p className="font-mono text-xs text-neutral-400">
              Core services status
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Google Drive Status */}
            <div className="p-3 border-2 border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-neutral-400" />
                <span className="font-bold text-neutral-200">Google Drive</span>
              </div>
              <span
                className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                  settings.googleDriveEnabled
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}
              >
                {settings.googleDriveEnabled ? "CONNECTED" : "OFFLINE"}
              </span>
            </div>

            {/* Scanner Session Status */}
            <div className="p-3 border-2 border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-neutral-400" />
                <span className="font-bold text-neutral-200">Scanner PIN</span>
              </div>
              <span
                className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                  scannerData.active
                    ? "bg-lime-400 text-black border-lime-400"
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}
              >
                {scannerData.active ? `${scannerData.remainingSeconds}s ACTIVE` : "INACTIVE"}
              </span>
            </div>

            {/* Payment Gateway */}
            <div className="p-3 border-2 border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-400" />
                <span className="font-bold text-neutral-200">Fee Status</span>
              </div>
              <span className="px-2 py-0.5 border border-cyan-800 bg-cyan-950/60 text-cyan-300 font-black text-[10px] uppercase">
                {settings.registrationFee === 0 ? "FREE TIER (₹0)" : `₹${settings.registrationFee}`}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/settings"
              className="w-full py-2.5 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 font-mono text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000] text-neutral-200"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>CONFIGURE SYSTEM</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Registrations Quick Table */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div>
            <h2 className="font-mono text-sm font-black uppercase text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Recent Squad Submissions
            </h2>
            <p className="font-mono text-xs text-neutral-400">
              Latest teams registered in the system
            </p>
          </div>
          <Link
            href="/admin/squads"
            className="px-3 py-1.5 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] text-black"
          >
            <span>VIEW ALL ({totalSquads})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentSquads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-800 bg-neutral-950 text-neutral-400">
                  <th className="p-3 font-black uppercase">Reg ID</th>
                  <th className="p-3 font-black uppercase">Team Name</th>
                  <th className="p-3 font-black uppercase">College</th>
                  <th className="p-3 font-black uppercase">Leader</th>
                  <th className="p-3 font-black uppercase">Status</th>
                  <th className="p-3 font-black uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {recentSquads.map((squad) => (
                  <tr
                    key={squad.id}
                    className="hover:bg-neutral-800/80 transition-colors"
                  >
                    <td className="p-3 font-black text-amber-400">
                      <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-950 shadow-[1px_1px_0px_0px_#000000]">
                        {squad.registrationNumber}
                      </span>
                    </td>
                    <td className="p-3 font-black uppercase text-white">
                      {squad.teamName}
                    </td>
                    <td className="p-3 text-neutral-400 truncate max-w-[200px]">
                      {squad.collegeName}
                    </td>
                    <td className="p-3 font-bold text-neutral-300">
                      {squad.leaderName}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                          squad.status === "CONFIRMED"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                            : squad.status === "REJECTED"
                            ? "bg-rose-950/60 text-rose-400 border-rose-800"
                            : "bg-amber-950/60 text-amber-400 border-amber-800"
                        }`}
                      >
                        {squad.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSquad(squad)}
                          title="Inspect Squad Roster"
                          className="px-2 py-1 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 text-[11px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
                        >
                          INSPECT
                        </button>
                        <button
                          onClick={() => setSelectedPassSquad(squad)}
                          title="Generate Pass & ID"
                          className="p-1 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-black"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center font-mono text-xs text-neutral-500 border-2 border-dashed border-neutral-800">
            No registrations received yet.
          </div>
        )}
      </div>
    </div>
  );
}
