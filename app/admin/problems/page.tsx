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

  const [selectedPsId, setSelectedPsId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="space-y-6 select-none text-white">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-fuchsia-400 bg-fuchsia-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● TRACK ALLOCATION MATRIX
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              {totalAssigned} OF {registrations.length} SQUADS ASSIGNED
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            PROBLEM STATEMENT MATRIX
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Track problem statement capacity, assign tracks to unassigned squads, and review track distributions.
          </p>
        </div>

        {/* Quick Unassigned Alert */}
        {unassignedCount > 0 && (
          <div className="border-2 border-amber-500/50 bg-amber-950/40 p-3 shadow-[2px_2px_0px_0px_#000000] flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="font-mono text-xs">
              <span className="font-black text-amber-300">
                {unassignedCount} Squads Unassigned
              </span>
              <div className="text-[10px] text-neutral-400">
                Awaiting track allocation or selection
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedPsId("ALL")}
          className={`px-3 py-1.5 border-2 font-mono text-xs font-black uppercase shrink-0 transition-all cursor-pointer ${
            selectedPsId === "ALL"
              ? "bg-amber-400 text-black border-amber-400 shadow-[2px_2px_0px_0px_#000000]"
              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800 shadow-[1px_1px_0px_0px_#000000]"
          }`}
        >
          ALL TRACKS ({registrations.length})
        </button>
        <button
          onClick={() => setSelectedPsId("unassigned")}
          className={`px-3 py-1.5 border-2 font-mono text-xs font-black uppercase shrink-0 transition-all cursor-pointer ${
            selectedPsId === "unassigned"
              ? "bg-rose-500 text-white border-rose-500 shadow-[2px_2px_0px_0px_#000000]"
              : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800 shadow-[1px_1px_0px_0px_#000000]"
          }`}
        >
          UNASSIGNED ({unassignedCount})
        </button>
        {PROBLEM_STATEMENTS_DATA.map((p) => {
          const count = psGroups[p.id]?.length || 0;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPsId(p.id)}
              className={`px-3 py-1.5 border-2 font-mono text-xs font-black uppercase shrink-0 transition-all cursor-pointer ${
                selectedPsId === p.id
                  ? "bg-cyan-400 text-black border-cyan-400 shadow-[2px_2px_0px_0px_#000000]"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800 shadow-[1px_1px_0px_0px_#000000]"
              }`}
            >
              {p.id} ({count})
            </button>
          );
        })}
      </div>

      {/* Problem Statements Cards / Groups */}
      <div className="space-y-6">
        {/* UNASSIGNED SQUADS SECTION */}
        {(selectedPsId === "ALL" || selectedPsId === "unassigned") &&
          unassignedCount > 0 && (
            <div className="border-2 border-amber-500/40 bg-neutral-950 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-400 border border-black inline-block" />
                  <h3 className="font-mono text-sm font-black uppercase text-amber-300">
                    UNASSIGNED SQUADS QUEUE ({unassignedCount})
                  </h3>
                </div>
                <span className="font-mono text-[10px] bg-amber-400 text-black px-2 py-0.5 font-black uppercase">
                  NEEDS ALLOCATION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {psGroups.unassigned.map((squad) => (
                  <div
                    key={squad.id}
                    className="border-2 border-neutral-800 bg-neutral-900 p-3.5 shadow-[2px_2px_0px_0px_#000000] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-black bg-neutral-950 text-amber-400 px-1.5 py-0.5 border border-neutral-800">
                        {squad.registrationNumber}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-neutral-400">
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

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => openAssignModal(squad)}
                        className="py-1 px-2 border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[11px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
                      >
                        ASSIGN PS
                      </button>
                      <button
                        onClick={() => setSelectedSquad(squad)}
                        className="py-1 px-2 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-mono text-[11px] font-black uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
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
        {PROBLEM_STATEMENTS_DATA.filter(
          (p) => selectedPsId === "ALL" || selectedPsId === p.id
        ).map((p) => {
          const squadsInTrack = psGroups[p.id] || [];

          return (
            <div
              key={p.id}
              className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4"
            >
              {/* Track Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 border border-cyan-400 bg-cyan-400 text-black font-mono text-xs font-black uppercase">
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

                <span className="font-mono text-xs font-black px-3 py-1 border-2 border-amber-400 bg-amber-400 text-black shadow-[2px_2px_0px_0px_#000000] self-start sm:self-auto">
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
                      <div className="font-mono text-[10px] text-neutral-500">
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
                <div className="p-6 text-center font-mono text-xs text-neutral-500 border-2 border-dashed border-neutral-800">
                  No squads currently registered under this problem statement track.
                </div>
              )}
            </div>
          );
        })}
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
