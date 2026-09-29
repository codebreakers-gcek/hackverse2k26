"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import {
  BedDouble,
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Edit,
  X,
  Sparkles,
} from "lucide-react";
import { RegistrationRecord } from "@/types/admin";
import { toast } from "sonner";

export default function AdminAccommodationPage() {
  const {
    registrations,
    stats,
    handleSaveAccommodation,
    setSelectedSquad,
    isUpdating,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalSquad, setModalSquad] = useState<RegistrationRecord | null>(null);
  const [hostelBlockInput, setHostelBlockInput] = useState("Block-A");
  const [roomNumberInput, setRoomNumberInput] = useState("");

  const accomSquads = useMemo(() => {
    return registrations.filter((squad) => {
      // Base requirement or requested
      if (!squad.accommodationRequired && !squad.accommodationStatus) {
        if (statusFilter !== "ALL" && statusFilter !== "NOT_REQUESTED") return false;
      }

      if (statusFilter === "REQUESTED") {
        if (
          !squad.accommodationRequired ||
          squad.accommodationStatus === "ALLOCATED"
        )
          return false;
      }
      if (statusFilter === "ALLOCATED") {
        if (squad.accommodationStatus !== "ALLOCATED") return false;
      }
      if (statusFilter === "NOT_REQUESTED") {
        if (squad.accommodationRequired) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = squad.teamName?.toLowerCase().includes(q);
        const matchReg = squad.registrationNumber?.toLowerCase().includes(q);
        const matchLeader = squad.leaderName?.toLowerCase().includes(q);
        const matchBlock = squad.hostelBlock?.toLowerCase().includes(q);
        const matchRoom = squad.roomNumber?.toLowerCase().includes(q);
        const matchCollege = squad.collegeName?.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchReg &&
          !matchLeader &&
          !matchBlock &&
          !matchRoom &&
          !matchCollege
        ) {
          return false;
        }
      }

      return true;
    });
  }, [registrations, statusFilter, searchQuery]);

  const totalRequested = registrations.filter(
    (r) => r.accommodationRequired
  ).length;
  const totalAllocated = registrations.filter(
    (r) => r.accommodationStatus === "ALLOCATED"
  ).length;
  const pendingAllocation = totalRequested - totalAllocated;

  const openAllocateModal = (squad: RegistrationRecord) => {
    setModalSquad(squad);
    setHostelBlockInput(squad.hostelBlock || "Boys Hostel - Block A");
    setRoomNumberInput(squad.roomNumber || "");
  };

  const handleSave = async () => {
    if (!modalSquad) return;
    if (!roomNumberInput.trim()) {
      toast.error("Please enter a valid room number.");
      return;
    }
    const success = await handleSaveAccommodation(
      modalSquad.id,
      hostelBlockInput,
      roomNumberInput
    );
    if (success) {
      setModalSquad(null);
    }
  };

  return (
    <div className="space-y-6 select-none text-white">
      {/* Top Banner */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 border border-emerald-400 bg-emerald-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● HOSTEL &amp; STAY LOGISTICS
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              {totalAllocated} OF {totalRequested} SQUADS ALLOCATED
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            HOSTEL &amp; ACCOMMODATION ALLOCATION
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Assign hostel blocks, rooms, and manage hospitality for outstation participant squads.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 border-2 border-emerald-800 bg-emerald-950/60 shadow-[2px_2px_0px_0px_#000000]">
            <span className="text-[10px] text-emerald-400 uppercase font-black block">
              ALLOCATED
            </span>
            <span className="text-xl font-black text-white">{totalAllocated}</span>
          </div>
          <div className="p-3 border-2 border-amber-800 bg-amber-950/60 shadow-[2px_2px_0px_0px_#000000]">
            <span className="text-[10px] text-amber-400 uppercase font-black block">
              PENDING
            </span>
            <span className="text-xl font-black text-white">{pendingAllocation}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team, leader, block, room number, college..."
              className="w-full pl-9 pr-3 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400"
            >
              <option value="ALL">All Accommodation Status</option>
              <option value="REQUESTED">Pending Allocation</option>
              <option value="ALLOCATED">Allocated Rooms</option>
              <option value="NOT_REQUESTED">Not Requested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accommodation Table */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-800 bg-neutral-950 text-neutral-400">
                <th className="p-3 font-black uppercase">Reg ID</th>
                <th className="p-3 font-black uppercase">Team / College</th>
                <th className="p-3 font-black uppercase">Squad Size</th>
                <th className="p-3 font-black uppercase">Hostel Block</th>
                <th className="p-3 font-black uppercase">Room No</th>
                <th className="p-3 font-black uppercase">Status</th>
                <th className="p-3 font-black uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {accomSquads.map((squad) => {
                const totalMembers = 1 + (squad.members?.length || 0);
                const isAllocated = squad.accommodationStatus === "ALLOCATED";

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

                    {/* Team & College */}
                    <td className="p-3">
                      <div className="font-black uppercase text-sm text-white">
                        {squad.teamName}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[200px] flex items-center gap-1">
                        <Building2 className="w-3 h-3 shrink-0 text-neutral-500" />
                        <span>{squad.collegeName}</span>
                      </div>
                    </td>

                    {/* Squad Members */}
                    <td className="p-3 font-bold text-neutral-300">
                      {totalMembers} Hackers
                    </td>

                    {/* Hostel Block */}
                    <td className="p-3 font-bold text-white">
                      {squad.hostelBlock ? (
                        <span className="px-2 py-0.5 border border-cyan-800 bg-cyan-950/60 text-cyan-300 font-black">
                          {squad.hostelBlock}
                        </span>
                      ) : (
                        <span className="text-neutral-500 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Room Number */}
                    <td className="p-3 font-bold text-white">
                      {squad.roomNumber ? (
                        <span className="px-2 py-0.5 border border-amber-800 bg-amber-950/60 text-amber-300 font-black">
                          Room #{squad.roomNumber}
                        </span>
                      ) : (
                        <span className="text-neutral-500 italic">N/A</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                          isAllocated
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                            : squad.accommodationRequired
                            ? "bg-amber-950/60 text-amber-400 border-amber-800"
                            : "bg-neutral-800 text-neutral-400 border-neutral-700"
                        }`}
                      >
                        {isAllocated
                          ? "ALLOCATED"
                          : squad.accommodationRequired
                          ? "REQUESTED"
                          : "NOT REQUESTED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAllocateModal(squad)}
                          className="px-2.5 py-1 border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-black"
                        >
                          {isAllocated ? "EDIT ROOM" : "ALLOCATE"}
                        </button>
                        <button
                          onClick={() => setSelectedSquad(squad)}
                          className="px-2 py-1 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
                        >
                          INSPECT
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

      {/* ALLOCATION MODAL (Dark Mode) */}
      {modalSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border-4 border-neutral-700 bg-neutral-900 p-6 shadow-[8px_8px_0px_0px_#000000] space-y-4 text-white">
            <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-2">
              <h3 className="font-mono text-sm font-black uppercase text-amber-400">
                ALLOCATE HOSTEL ROOM
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
                Squad Size: {1 + (modalSquad.members?.length || 0)} Members
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="font-black uppercase text-neutral-300 block mb-1">
                  Hostel Block Name / Wing
                </label>
                <select
                  value={hostelBlockInput}
                  onChange={(e) => setHostelBlockInput(e.target.value)}
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold cursor-pointer focus:border-amber-400"
                >
                  <option value="Boys Hostel - Block A">Boys Hostel - Block A</option>
                  <option value="Boys Hostel - Block B">Boys Hostel - Block B</option>
                  <option value="Girls Hostel - Block C">Girls Hostel - Block C</option>
                  <option value="Girls Hostel - Block D">Girls Hostel - Block D</option>
                  <option value="Guest House / Faculty Wing">Guest House / Faculty Wing</option>
                </select>
              </div>

              <div>
                <label className="font-black uppercase text-neutral-300 block mb-1">
                  Room Number / Dormitory Slot
                </label>
                <input
                  type="text"
                  value={roomNumberInput}
                  onChange={(e) => setRoomNumberInput(e.target.value)}
                  placeholder="e.g. 204, 301-B, Hall 2"
                  className="w-full p-2 border-2 border-neutral-700 bg-neutral-950 text-white font-bold placeholder:text-neutral-500 focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-neutral-800">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="py-2 px-3 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000000] cursor-pointer text-black disabled:opacity-50"
              >
                CONFIRM ALLOCATION
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
