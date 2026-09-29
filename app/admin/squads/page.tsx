"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { exportSquadsAndRostersExcel } from "@/lib/adminExcelExport";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import {
  Users,
  Search,
  Download,
  Filter,
  Eye,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Building2,
  Mail,
  Phone,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSquadsPage() {
  const {
    registrations,
    isLoading,
    setSelectedSquad,
    setSelectedPassSquad,
    handleUpdateStatus,
    handleDeleteSquad,
    handleBanSquad,
    handleUnbanSquad,
    isUpdating,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [accomFilter, setAccomFilter] = useState("ALL");
  const [psFilter, setPsFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Filtered registrations
  const filteredSquads = useMemo(() => {
    return registrations.filter((squad) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = squad.teamName?.toLowerCase().includes(q);
        const matchReg = squad.registrationNumber?.toLowerCase().includes(q);
        const matchLeader = squad.leaderName?.toLowerCase().includes(q);
        const matchEmail = squad.leaderEmail?.toLowerCase().includes(q);
        const matchPhone = squad.leaderPhone?.includes(q);
        const matchCollege = squad.collegeName?.toLowerCase().includes(q);
        const matchMember = squad.members?.some(
          (m) =>
            m.fullName?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q)
        );

        if (
          !matchName &&
          !matchReg &&
          !matchLeader &&
          !matchEmail &&
          !matchPhone &&
          !matchCollege &&
          !matchMember
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "ALL" && squad.status !== statusFilter) {
        return false;
      }

      // Payment filter
      if (paymentFilter !== "ALL") {
        if (paymentFilter === "VERIFIED" && squad.paymentStatus !== "VERIFIED")
          return false;
        if (paymentFilter === "PENDING" && squad.paymentStatus !== "PENDING")
          return false;
        if (
          paymentFilter === "FREE_TIER" &&
          squad.paymentStatus !== "FREE_TIER" &&
          squad.paymentMode !== "FREE_SPONSORED"
        )
          return false;
      }

      // Accommodation filter
      if (accomFilter !== "ALL") {
        if (
          accomFilter === "REQUESTED" &&
          (!squad.accommodationRequired ||
            squad.accommodationStatus === "ALLOCATED")
        )
          return false;
        if (accomFilter === "ALLOCATED" && squad.accommodationStatus !== "ALLOCATED")
          return false;
        if (accomFilter === "NONE" && squad.accommodationRequired) return false;
      }

      // PS filter
      if (psFilter !== "ALL") {
        if (psFilter === "UNASSIGNED" && squad.problemStatementId) return false;
        if (psFilter !== "UNASSIGNED" && squad.problemStatementId !== psFilter)
          return false;
      }

      return true;
    });
  }, [
    registrations,
    searchQuery,
    statusFilter,
    paymentFilter,
    accomFilter,
    psFilter,
  ]);

  const handleExportExcel = () => {
    try {
      exportSquadsAndRostersExcel(registrations as any);
      toast.success("Squads and full rosters exported to Excel!");
    } catch {
      toast.error("Failed to export Excel file.");
    }
  };

  return (
    <div className="space-y-6 select-none text-white">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-cyan-400 bg-cyan-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● ROSTER DIRECTORY
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              {filteredSquads.length} OF {registrations.length} SQUADS MATCHING
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            SQUADS &amp; PARTICIPANT ROSTERS
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Review registered teams, verify credentials, generate participant ID cards, and export rosters.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            className="py-2.5 px-4 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-black transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT EXCEL</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center border-2 border-neutral-700 bg-neutral-950 p-0.5 shadow-[2px_2px_0px_0px_#000000]">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 cursor-pointer transition-colors ${
                viewMode === "table" ? "bg-amber-400 text-black font-bold" : "text-neutral-400"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 cursor-pointer transition-colors ${
                viewMode === "cards" ? "bg-amber-400 text-black font-bold" : "text-neutral-400"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team, reg ID, leader, email, college..."
              className="w-full pl-9 pr-3 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400"
            >
              <option value="ALL">Status: All</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING_VERIFICATION">PENDING</option>
              <option value="REJECTED">REJECTED</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>

          {/* Problem Statement Filter */}
          <div className="md:col-span-3">
            <select
              value={psFilter}
              onChange={(e) => setPsFilter(e.target.value)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer truncate focus:border-amber-400"
            >
              <option value="ALL">Problem Statement: All</option>
              <option value="UNASSIGNED">Unassigned Track</option>
              {PROBLEM_STATEMENTS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}: {p.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="md:col-span-2">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400"
            >
              <option value="ALL">Payment: All</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="FREE_TIER">FREE TIER</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-800 font-mono text-xs">
          <span className="text-neutral-400 font-bold">Quick Filters:</span>
          <button
            onClick={() => {
              setStatusFilter("PENDING_VERIFICATION");
              setPaymentFilter("ALL");
            }}
            className="px-2 py-0.5 border border-amber-800 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 font-black cursor-pointer"
          >
            Pending Verification ({registrations.filter((r) => r.status === "PENDING_VERIFICATION").length})
          </button>
          <button
            onClick={() => {
              setPsFilter("UNASSIGNED");
            }}
            className="px-2 py-0.5 border border-cyan-800 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 font-black cursor-pointer"
          >
            Unassigned Track ({registrations.filter((r) => !r.problemStatementId).length})
          </button>
          <button
            onClick={() => {
              setAccomFilter("REQUESTED");
            }}
            className="px-2 py-0.5 border border-fuchsia-800 bg-fuchsia-950/60 hover:bg-fuchsia-900/80 text-fuchsia-300 font-black cursor-pointer"
          >
            Hostel Requested ({registrations.filter((r) => r.accommodationRequired && r.accommodationStatus !== "ALLOCATED").length})
          </button>
          {(statusFilter !== "ALL" ||
            psFilter !== "ALL" ||
            paymentFilter !== "ALL" ||
            accomFilter !== "ALL" ||
            searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setPsFilter("ALL");
                setPaymentFilter("ALL");
                setAccomFilter("ALL");
                setSearchQuery("");
              }}
              className="px-2 py-0.5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white font-black ml-auto cursor-pointer"
            >
              RESET FILTERS
            </button>
          )}
        </div>
      </div>

      {/* Main Squads View */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-800 bg-neutral-950 text-neutral-400">
                  <th className="p-3 font-black uppercase">Reg ID</th>
                  <th className="p-3 font-black uppercase">Squad / College</th>
                  <th className="p-3 font-black uppercase">Leader / Contact</th>
                  <th className="p-3 font-black uppercase">Track</th>
                  <th className="p-3 font-black uppercase">Roster</th>
                  <th className="p-3 font-black uppercase">Status</th>
                  <th className="p-3 font-black uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredSquads.map((squad) => {
                  const totalMembers = 1 + (squad.members?.length || 0);
                  const ps = PROBLEM_STATEMENTS_DATA.find(
                    (p) => p.id === squad.problemStatementId
                  );

                  return (
                    <tr
                      key={squad.id}
                      className="hover:bg-neutral-800/80 transition-colors"
                    >
                      {/* Reg ID */}
                      <td className="p-3 font-black text-amber-400">
                        <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-950 shadow-[1px_1px_0px_0px_#000000]">
                          {squad.registrationNumber}
                        </span>
                      </td>

                      {/* Team Name & College */}
                      <td className="p-3">
                        <div className="font-black uppercase text-sm text-white">
                          {squad.teamName}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate max-w-[200px] flex items-center gap-1">
                          <Building2 className="w-3 h-3 shrink-0 text-neutral-500" />
                          <span>{squad.collegeName}</span>
                        </div>
                      </td>

                      {/* Leader Info */}
                      <td className="p-3">
                        <div className="font-bold text-neutral-200">
                          {squad.leaderName}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[160px]">
                          {squad.leaderEmail}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {squad.leaderPhone}
                        </div>
                      </td>

                      {/* Problem Statement Track */}
                      <td className="p-3">
                        {squad.problemStatementId ? (
                          <div className="max-w-[160px]">
                            <span className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-black text-[10px] inline-block mb-0.5">
                              {squad.problemStatementId}
                            </span>
                            <div className="text-[10px] text-neutral-300 truncate font-bold">
                              {ps?.title || squad.problemStatementId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-500 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Roster Size */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-950 text-amber-400 font-black text-[10px]">
                          {totalMembers} Hackers
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                            squad.status === "CONFIRMED"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                              : squad.status === "BANNED"
                              ? "bg-rose-950 text-rose-400 border-rose-800"
                              : squad.status === "REJECTED"
                              ? "bg-rose-950/60 text-rose-400 border-rose-800"
                              : "bg-amber-950/60 text-amber-400 border-amber-800"
                          }`}
                        >
                          {squad.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSquad(squad)}
                            title="Inspect Details"
                            className="px-2.5 py-1 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
                          >
                            INSPECT
                          </button>
                          <button
                            onClick={() => setSelectedPassSquad(squad)}
                            title="Generate Pass"
                            className="p-1 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-black"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSquads.map((squad) => {
            const totalMembers = 1 + (squad.members?.length || 0);
            const ps = PROBLEM_STATEMENTS_DATA.find(
              (p) => p.id === squad.problemStatementId
            );

            return (
              <div
                key={squad.id}
                className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 hover:border-neutral-700 hover:shadow-[5px_5px_0px_0px_#000000] transition-all text-white"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b-2 border-neutral-800 pb-2 mb-3">
                    <span className="font-mono text-xs font-black bg-neutral-950 text-amber-400 px-2 py-0.5 border border-neutral-800">
                      {squad.registrationNumber}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border ${
                        squad.status === "CONFIRMED"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                          : squad.status === "BANNED"
                          ? "bg-rose-950 text-rose-400 border-rose-800"
                          : squad.status === "REJECTED"
                          ? "bg-rose-950/60 text-rose-400 border-rose-800"
                          : "bg-amber-950/60 text-amber-400 border-amber-800"
                      }`}
                    >
                      {squad.status}
                    </span>
                  </div>

                  <h3 className="font-black text-lg uppercase text-white">
                    {squad.teamName}
                  </h3>
                  <div className="text-xs font-mono text-neutral-400 truncate flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                    <span>{squad.collegeName}</span>
                  </div>

                  {/* Leader Info */}
                  <div className="mt-3 p-2.5 border border-neutral-800 bg-neutral-950 font-mono text-xs space-y-0.5">
                    <div className="font-bold text-neutral-200 flex items-center justify-between">
                      <span>Lead: {squad.leaderName}</span>
                      <span className="text-[10px] font-normal text-neutral-500">
                        {totalMembers} Hackers
                      </span>
                    </div>
                    <div className="text-neutral-400 text-[10px] truncate">
                      {squad.leaderEmail} | {squad.leaderPhone}
                    </div>
                  </div>

                  {/* PS Badge */}
                  {squad.problemStatementId && (
                    <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 p-1.5 truncate">
                      <span className="font-black">{squad.problemStatementId}:</span>{" "}
                      {ps?.title || squad.problemStatementId}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => setSelectedSquad(squad)}
                    className="py-1.5 px-3 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-mono text-xs font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer text-center"
                  >
                    INSPECT
                  </button>
                  <button
                    onClick={() => setSelectedPassSquad(squad)}
                    className="py-1.5 px-3 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-xs font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000000] cursor-pointer flex items-center justify-center gap-1 text-black"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>PASS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredSquads.length === 0 && !isLoading && (
        <div className="border-2 border-dashed border-neutral-800 bg-neutral-900 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="font-mono text-base font-black uppercase text-neutral-300">
            NO SQUADS FOUND MATCHING CRITERIA
          </h3>
          <p className="font-mono text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the active status and problem statement filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setPaymentFilter("ALL");
              setAccomFilter("ALL");
              setPsFilter("ALL");
            }}
            className="px-4 py-2 border-2 border-amber-400 bg-amber-400 text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
          >
            CLEAR ALL FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
