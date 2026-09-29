"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import {
  Compass,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Building2,
  Lock,
  Unlock,
  X,
  Shuffle,
  Filter,
  RotateCcw,
} from "lucide-react";
import { RegistrationRecord } from "@/types/admin";
import { toast } from "sonner";

export default function AdminProblemsPage() {
  const {
    registrations,
    stats,
    setSelectedSquad,
    handleUpdateProblemStatement,
    isUpdating,
  } = useAdmin();

  // Filters State
  const [selectedPsId, setSelectedPsId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "SW" | "HW" | "UNASSIGNED">("ALL");
  const [occupancyFilter, setOccupancyFilter] = useState<"ALL" | "OCCUPIED" | "EMPTY">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Re-assign Modal State
  const [modalSquad, setModalSquad] = useState<RegistrationRecord | null>(null);
  const [pref1Input, setPref1Input] = useState("");
  const [pref2Input, setPref2Input] = useState("");

  // Group squads by problem statement
  const psGroups = useMemo(() => {
    const map: Record<string, RegistrationRecord[]> = {
      unassigned: [],
    };

    PROBLEM_STATEMENTS_DATA.forEach((p) => {
      map[p.id] = [];
    });

    registrations.forEach((r) => {
      if (!r.problemStatementId) {
        map.unassigned.push(r);
      } else if (map[r.problemStatementId]) {
        map[r.problemStatementId].push(r);
      } else {
        if (!map[r.problemStatementId]) map[r.problemStatementId] = [];
        map[r.problemStatementId].push(r);
      }
    });

    return map;
  }, [registrations]);

  const unassignedCount = psGroups.unassigned?.length || 0;
  const totalAssigned = registrations.length - unassignedCount;

  // Helper to check if squad matches current search query & status filter
  const squadMatchesFilters = (squad: RegistrationRecord) => {
    // Status Filter
    if (statusFilter !== "ALL" && squad.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = squad.teamName?.toLowerCase().includes(q);
      const matchReg = squad.registrationNumber?.toLowerCase().includes(q);
      const matchLeader = squad.leaderName?.toLowerCase().includes(q);
      const matchEmail = squad.leaderEmail?.toLowerCase().includes(q);
      const matchPhone = squad.leaderPhone?.includes(q);
      const matchCollege = squad.collegeName?.toLowerCase().includes(q);
      const matchBranch = squad.leaderBranch?.toLowerCase().includes(q);
      const matchMember = squad.members?.some(
        (m) =>
          m.fullName?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.phone?.includes(q)
      );

      if (
        !matchName &&
        !matchReg &&
        !matchLeader &&
        !matchEmail &&
        !matchPhone &&
        !matchCollege &&
        !matchBranch &&
        !matchMember
      ) {
        return false;
      }
    }

    return true;
  };

  // Filtered Unassigned Squads
  const filteredUnassignedSquads = useMemo(() => {
    return (psGroups.unassigned || []).filter(squadMatchesFilters);
  }, [psGroups.unassigned, searchQuery, statusFilter]);

  // Filtered Problem Statement Tracks to Display
  const visibleTracks = useMemo(() => {
    return PROBLEM_STATEMENTS_DATA.filter((p) => {
      // 1. Single Track Selection Filter
      if (selectedPsId !== "ALL" && selectedPsId !== p.id) {
        return false;
      }

      // 2. Category / Domain Filter
      if (categoryFilter === "UNASSIGNED") {
        return false;
      }
      if (categoryFilter === "HW" && !p.id.includes("HW") && p.category !== "HARDWARE") {
        return false;
      }
      if (categoryFilter === "SW" && !p.id.includes("SW") && p.category !== "SOFTWARE") {
        return false;
      }

      // 3. Occupancy Filter
      const allInTrack = psGroups[p.id] || [];
      if (occupancyFilter === "OCCUPIED" && allInTrack.length === 0) {
        return false;
      }
      if (occupancyFilter === "EMPTY" && allInTrack.length > 0) {
        return false;
      }

      // 4. If search query is present, check if track title matches OR any squad in it matches
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const trackMatches =
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q);

        const hasMatchingSquad = allInTrack.some(squadMatchesFilters);

        if (!trackMatches && !hasMatchingSquad) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedPsId,
    categoryFilter,
    occupancyFilter,
    searchQuery,
    psGroups,
    statusFilter,
  ]);

  // Total matching squads count across all filtered tracks
  const totalMatchingSquads = useMemo(() => {
    let count = 0;
    if (selectedPsId === "ALL" || selectedPsId === "unassigned") {
      count += filteredUnassignedSquads.length;
    }
    visibleTracks.forEach((p) => {
      const squadsInTrack = (psGroups[p.id] || []).filter(squadMatchesFilters);
      count += squadsInTrack.length;
    });
    return count;
  }, [visibleTracks, filteredUnassignedSquads, selectedPsId, psGroups, searchQuery, statusFilter]);

  const isAnyFilterActive =
    searchQuery.trim() !== "" ||
    selectedPsId !== "ALL" ||
    categoryFilter !== "ALL" ||
    occupancyFilter !== "ALL" ||
    statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSelectedPsId("ALL");
    setSearchQuery("");
    setCategoryFilter("ALL");
    setOccupancyFilter("ALL");
    setStatusFilter("ALL");
  };

  const openAssignModal = (squad: RegistrationRecord) => {
    setModalSquad(squad);
    setPref1Input(squad.problemStatementId || "");
    setPref2Input("");
  };

  const handleSavePs = async () => {
    if (!modalSquad) return;
    const success = await handleUpdateProblemStatement(
      modalSquad.id,
      pref1Input,
      pref2Input
    );
    if (success) {
      setModalSquad(null);
    }
  };

  const handleClearPs = async (squad: RegistrationRecord) => {
    if (
      !confirm(
        `Clear problem statement for squad "${squad.teamName}"? They will return to unassigned status.`
      )
    )
      return;
    await handleUpdateProblemStatement(squad.id, "", "", "clear");
  };

  return (
    <div className="space-y-6 select-none text-white font-sans">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 border border-fuchsia-400 bg-fuchsia-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● TRACK ALLOCATION MATRIX
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              {totalAssigned} OF {registrations.length} SQUADS ASSIGNED
            </span>
            <span className="font-mono text-[10px] bg-neutral-800 text-cyan-300 px-2 py-0.5 border border-neutral-700 font-bold">
              {PROBLEM_STATEMENTS_DATA.length} OFFICIAL TRACKS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            PROBLEM STATEMENT MATRIX
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Track problem statement capacity, assign tracks to unassigned squads, and review real-time track distributions.
          </p>
        </div>

        {/* Quick Unassigned Alert */}
        {unassignedCount > 0 && (
          <button
            onClick={() => {
              setSelectedPsId("unassigned");
              setCategoryFilter("UNASSIGNED");
            }}
            className="border-2 border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/50 p-3 shadow-[2px_2px_0px_0px_#000000] flex items-center gap-3 cursor-pointer text-left transition-all"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="font-mono text-xs">
              <span className="font-black text-amber-300">
                {unassignedCount} Squads Unassigned
              </span>
              <div className="text-[10px] text-neutral-400">
                Click to view and allocate tracks
              </div>
            </div>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & MULTI-DROPDOWN FILTER CONTROLS */}
      {/* ========================================================================= */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-4 md:p-5 space-y-4">
        {/* Top Control Bar: Search + Primary Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* 1. Global Live Search Input */}
          <div className="sm:col-span-2 lg:col-span-4 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search squad, leader, reg ID, email, college..."
              className="w-full pl-9 pr-8 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 shadow-[1px_1px_0px_0px_#000000]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Specific Problem Statement Track Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedPsId}
              onChange={(e) => {
                setSelectedPsId(e.target.value);
                if (e.target.value === "unassigned") {
                  setCategoryFilter("UNASSIGNED");
                }
              }}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer truncate focus:border-amber-400 shadow-[1px_1px_0px_0px_#000000]"
            >
              <option value="ALL">All Tracks ({registrations.length} Squads)</option>
              <option value="unassigned">⚠️ Unassigned Queue ({unassignedCount})</option>
              <optgroup label="Hardware Problem Statements (HW)">
                {PROBLEM_STATEMENTS_DATA.filter((p) => p.id.includes("HW")).map((p) => {
                  const count = psGroups[p.id]?.length || 0;
                  return (
                    <option key={p.id} value={p.id}>
                      [{p.id}] {p.title.slice(0, 32)}... ({count})
                    </option>
                  );
                })}
              </optgroup>
              <optgroup label="Software Problem Statements (SW)">
                {PROBLEM_STATEMENTS_DATA.filter((p) => p.id.includes("SW")).map((p) => {
                  const count = psGroups[p.id]?.length || 0;
                  return (
                    <option key={p.id} value={p.id}>
                      [{p.id}] {p.title.slice(0, 32)}... ({count})
                    </option>
                  );
                })}
              </optgroup>
            </select>
          </div>

          {/* 3. Category / Domain Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                const val = e.target.value as any;
                setCategoryFilter(val);
                if (val === "UNASSIGNED") {
                  setSelectedPsId("unassigned");
                } else if (selectedPsId === "unassigned") {
                  setSelectedPsId("ALL");
                }
              }}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400 shadow-[1px_1px_0px_0px_#000000]"
            >
              <option value="ALL">Domain: All</option>
              <option value="SW">Software Tracks (SW)</option>
              <option value="HW">Hardware Tracks (HW)</option>
              <option value="UNASSIGNED">Unassigned Only</option>
            </select>
          </div>

          {/* 4. Occupancy / Capacity Filter */}
          <div className="lg:col-span-2">
            <select
              value={occupancyFilter}
              onChange={(e) => setOccupancyFilter(e.target.value as any)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400 shadow-[1px_1px_0px_0px_#000000]"
            >
              <option value="ALL">Occupancy: All</option>
              <option value="OCCUPIED">Assigned Only (&gt;0)</option>
              <option value="EMPTY">Zero Squads (Empty)</option>
            </select>
          </div>

          {/* 5. Squad Status Filter */}
          <div className="lg:col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400 shadow-[1px_1px_0px_0px_#000000]"
            >
              <option value="ALL">Status: All</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING_VERIFICATION">PENDING</option>
              <option value="REJECTED">REJECTED</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800 flex-wrap font-mono text-xs">
          <div className="flex items-center gap-2 text-neutral-400 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Showing <strong className="text-white">{totalMatchingSquads}</strong> squads across{" "}
              <strong className="text-white">{visibleTracks.length}</strong> tracks
            </span>
            {searchQuery && (
              <span className="px-2 py-0.5 bg-neutral-800 text-amber-300 border border-neutral-700 text-[10px]">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {categoryFilter !== "ALL" && (
              <span className="px-2 py-0.5 bg-neutral-800 text-cyan-300 border border-neutral-700 text-[10px]">
                Domain: {categoryFilter}
              </span>
            )}
            {occupancyFilter !== "ALL" && (
              <span className="px-2 py-0.5 bg-neutral-800 text-purple-300 border border-neutral-700 text-[10px]">
                Occupancy: {occupancyFilter}
              </span>
            )}
            {statusFilter !== "ALL" && (
              <span className="px-2 py-0.5 bg-neutral-800 text-emerald-300 border border-neutral-700 text-[10px]">
                Status: {statusFilter}
              </span>
            )}
          </div>

          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-[11px] font-black uppercase flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#000000] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>RESET FILTERS</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROBLEM STATEMENTS CARDS & QUEUES */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* UNASSIGNED SQUADS SECTION */}
        {(selectedPsId === "ALL" || selectedPsId === "unassigned" || categoryFilter === "UNASSIGNED") &&
          filteredUnassignedSquads.length > 0 && (
            <div className="border-2 border-amber-500/40 bg-neutral-950 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-400 border border-black inline-block" />
                  <h3 className="font-mono text-sm font-black uppercase text-amber-300">
                    UNASSIGNED SQUADS QUEUE ({filteredUnassignedSquads.length})
                  </h3>
                </div>
                <span className="font-mono text-[10px] bg-amber-400 text-black px-2 py-0.5 font-black uppercase">
                  NEEDS ALLOCATION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredUnassignedSquads.map((squad) => (
                  <div
                    key={squad.id}
                    className="border-2 border-neutral-800 bg-neutral-900 p-3.5 shadow-[2px_2px_0px_0px_#000000] space-y-2 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-black bg-neutral-950 text-amber-400 px-1.5 py-0.5 border border-neutral-800">
                        {squad.registrationNumber}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-black uppercase px-1.5 py-0.5 border ${
                          squad.status === "CONFIRMED"
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                            : "bg-amber-950/60 text-amber-400 border-amber-800"
                        }`}
                      >
                        {squad.status}
                      </span>
                    </div>

                    <div className="font-black text-sm uppercase truncate text-white">
                      {squad.teamName}
                    </div>
                    <div className="font-mono text-[11px] text-neutral-400 truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 shrink-0 text-neutral-500" />
                      <span>{squad.collegeName}</span>
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 truncate">
                      Lead: {squad.leaderName} ({squad.leaderEmail})
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => openAssignModal(squad)}
                        className="py-1 px-2 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[11px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-center"
                      >
                        ASSIGN PS
                      </button>
                      <button
                        onClick={() => setSelectedSquad(squad)}
                        className="py-1 px-2 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-mono text-[11px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-center"
                      >
                        INSPECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* OFFICIAL PROBLEM STATEMENTS TRACKS */}
        {categoryFilter !== "UNASSIGNED" &&
          visibleTracks.map((p) => {
            const allInTrack = psGroups[p.id] || [];
            const squadsInTrack = allInTrack.filter(squadMatchesFilters);

            return (
              <div
                key={p.id}
                className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4"
              >
                {/* Track Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 border border-cyan-400 bg-cyan-400 text-black font-mono text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
                        {p.id}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-400">
                        Category: {p.category} ({p.domain})
                      </span>
                    </div>
                    <h2 className="font-black text-base text-white uppercase">
                      {p.title}
                    </h2>
                  </div>

                  <span
                    className={`font-mono text-xs font-black px-3 py-1 border-2 shadow-[2px_2px_0px_0px_#000000] self-start sm:self-auto ${
                      squadsInTrack.length > 0
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-neutral-700 bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {squadsInTrack.length} SQUADS ASSIGNED
                  </span>
                </div>

                {/* Squads in this PS */}
                {squadsInTrack.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {squadsInTrack.map((squad) => (
                      <div
                        key={squad.id}
                        className="border-2 border-neutral-800 bg-neutral-950 p-3.5 shadow-[2px_2px_0px_0px_#000000] space-y-2 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-black bg-neutral-900 text-amber-400 px-1.5 py-0.5 border border-neutral-800">
                            {squad.registrationNumber}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-black uppercase px-1.5 py-0.5 border ${
                              squad.status === "CONFIRMED"
                                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                                : "bg-amber-950/60 text-amber-400 border-amber-800"
                            }`}
                          >
                            {squad.status}
                          </span>
                        </div>

                        <div className="font-black text-sm uppercase truncate text-white">
                          {squad.teamName}
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400 truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 shrink-0 text-neutral-500" />
                          <span>{squad.collegeName}</span>
                        </div>
                        <div className="font-mono text-[10px] text-neutral-500 truncate">
                          Lead: {squad.leaderName} ({squad.leaderPhone})
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-800">
                          <button
                            onClick={() => setSelectedSquad(squad)}
                            className="py-1 px-2 border-2 border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-center"
                          >
                            INSPECT
                          </button>
                          <button
                            onClick={() => openAssignModal(squad)}
                            className="py-1 px-2 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-center text-black"
                          >
                            REASSIGN
                          </button>
                          <button
                            onClick={() => handleClearPs(squad)}
                            className="py-1 px-2 border-2 border-rose-600/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-center"
                          >
                            CLEAR
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center font-mono text-xs text-neutral-500 border-2 border-dashed border-neutral-800">
                    No squads currently matching in this problem statement track.
                  </div>
                )}
              </div>
            );
          })}

        {/* Empty State when zero tracks or squads match */}
        {visibleTracks.length === 0 && filteredUnassignedSquads.length === 0 && (
          <div className="border-4 border-dashed border-neutral-800 bg-neutral-950 p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="font-black text-lg uppercase text-neutral-300">
              NO MATCHING PROBLEM STATEMENTS OR SQUADS
            </h3>
            <p className="font-mono text-xs text-neutral-500 max-w-md mx-auto">
              No problem statements or registered squads match your current combination of filters and search queries.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </div>

      {/* RE-ASSIGN MODAL (Dark Mode) */}
      {modalSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border-4 border-neutral-700 bg-neutral-900 p-6 shadow-[8px_8px_0px_0px_#000000] space-y-4 text-white">
            <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-2">
              <h3 className="font-mono text-sm font-black uppercase text-amber-400">
                RE-ASSIGN PROBLEM STATEMENT
              </h3>
              <button
                onClick={() => setModalSquad(null)}
                className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="font-mono text-xs space-y-1">
              <div className="font-black text-base text-white">
                {modalSquad.teamName}
              </div>
              <div className="text-neutral-400">{modalSquad.collegeName}</div>
              <div className="text-neutral-500">
                Reg: {modalSquad.registrationNumber}
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="font-black uppercase text-neutral-300 block mb-1">
                  Primary Problem Statement Choice #1
                </label>
                <select
                  value={pref1Input}
                  onChange={(e) => setPref1Input(e.target.value)}
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold cursor-pointer focus:border-amber-400"
                >
                  <option value="">Select Problem Statement...</option>
                  {PROBLEM_STATEMENTS_DATA.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-black uppercase text-neutral-300 block mb-1">
                  Secondary Choice #2 (Optional)
                </label>
                <select
                  value={pref2Input}
                  onChange={(e) => setPref2Input(e.target.value)}
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold cursor-pointer focus:border-amber-400"
                >
                  <option value="">None / Open</option>
                  {PROBLEM_STATEMENTS_DATA.filter((p) => p.id !== pref1Input).map(
                    (p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}: {p.title}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-neutral-800">
              <button
                onClick={handleSavePs}
                disabled={isUpdating}
                className="py-2 px-3 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] cursor-pointer text-black disabled:opacity-50"
              >
                SAVE ASSIGNMENT
              </button>
              <button
                onClick={() => setModalSquad(null)}
                className="py-2 px-3 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] cursor-pointer text-neutral-300"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
