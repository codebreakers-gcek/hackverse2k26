"use client";

import React, { useState } from "react";
import { RegistrationRecord } from "@/types/admin";
import { Search, QrCode, Building2 } from "lucide-react";

export function DataTable({ data = [] }: { data?: any }) {
  const squads: RegistrationRecord[] = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState("");

  const filtered = squads.filter((squad) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      squad.teamName?.toLowerCase().includes(q) ||
      squad.registrationNumber?.toLowerCase().includes(q) ||
      squad.leaderName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between gap-3 border-b-2 border-black pb-3">
        <div className="font-black uppercase text-sm">
          Squad Registry ({filtered.length})
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-8 pr-2.5 py-1.5 border-2 border-black text-xs font-bold"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-neutral-100">
              <th className="p-2.5 font-black uppercase">Reg ID</th>
              <th className="p-2.5 font-black uppercase">Squad</th>
              <th className="p-2.5 font-black uppercase">Leader</th>
              <th className="p-2.5 font-black uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filtered.slice(0, 10).map((squad, idx) => (
              <tr key={squad.id || idx} className="hover:bg-amber-50">
                <td className="p-2.5 font-black">
                  {squad.registrationNumber || `HV26-${idx}`}
                </td>
                <td className="p-2.5 font-bold uppercase">
                  {squad.teamName || "Squad"}
                </td>
                <td className="p-2.5">{squad.leaderName || "Leader"}</td>
                <td className="p-2.5">
                  <span className="px-2 py-0.5 border border-black bg-emerald-200 text-emerald-950 font-black text-[10px]">
                    {squad.status || "CONFIRMED"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
