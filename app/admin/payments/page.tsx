"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { exportPaymentDetailsExcel } from "@/lib/adminExcelExport";
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  ExternalLink,
  FileText,
  DollarSign,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPaymentsPage() {
  const {
    registrations,
    stats,
    handleUpdatePayment,
    setSelectedSquad,
    isUpdating,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPayments = useMemo(() => {
    return registrations.filter((squad) => {
      if (statusFilter !== "ALL") {
        if (statusFilter === "VERIFIED" && squad.paymentStatus !== "VERIFIED")
          return false;
        if (statusFilter === "PENDING" && squad.paymentStatus !== "PENDING")
          return false;
        if (statusFilter === "REJECTED" && squad.paymentStatus !== "REJECTED")
          return false;
        if (
          statusFilter === "FREE_TIER" &&
          squad.paymentStatus !== "FREE_TIER" &&
          squad.paymentMode !== "FREE_SPONSORED"
        )
          return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = squad.teamName?.toLowerCase().includes(q);
        const matchReg = squad.registrationNumber?.toLowerCase().includes(q);
        const matchTxn = squad.transactionId?.toLowerCase().includes(q);
        const matchLeader = squad.leaderName?.toLowerCase().includes(q);
        const matchPhone = squad.leaderPhone?.includes(q);
        if (!matchName && !matchReg && !matchTxn && !matchLeader && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [registrations, statusFilter, searchQuery]);

  const verifiedCount =
    stats?.paymentVerified ??
    registrations.filter((r) => r.paymentStatus === "VERIFIED").length;
  const pendingCount =
    stats?.paymentPending ??
    registrations.filter((r) => r.paymentStatus === "PENDING").length;
  const freeTierCount =
    stats?.paymentFreeTier ??
    registrations.filter(
      (r) =>
        r.paymentStatus === "FREE_TIER" || r.paymentMode === "FREE_SPONSORED"
    ).length;

  const totalCollected = registrations.reduce((sum, r) => {
    if (r.paymentStatus === "VERIFIED" && typeof r.amount === "number") {
      return sum + r.amount;
    }
    return sum;
  }, 0);

  const handleExportExcel = () => {
    try {
      exportPaymentDetailsExcel(registrations as any);
      toast.success("Payment transactions exported to Excel!");
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
            <span className="px-2 py-0.5 border border-emerald-400 bg-emerald-400 text-black font-mono text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000000]">
              ● TREASURY &amp; PAYMENT VERIFICATION
            </span>
            <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
              {filteredPayments.length} SQUAD TRANSACTIONS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            PAYMENT RECONCILIATION
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Verify UPI transaction reference IDs (UTR), review invoices, approve paid registrations, and export payment records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="py-2.5 px-4 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 font-mono text-xs font-black uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-black transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT EXCEL</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-neutral-400">
              Total Revenue
            </span>
            <span className="px-2 py-0.5 bg-emerald-400 text-black font-mono text-[10px] font-black">
              VERIFIED
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-black text-emerald-400">
            ₹{totalCollected.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-1.5">
            Confirmed collected fees
          </div>
        </div>

        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-neutral-400">
              Verified Payments
            </span>
            <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-black">
              APPROVED
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-black text-white">
            {verifiedCount}
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-1.5">
            Squads fully approved
          </div>
        </div>

        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-neutral-400">
              Pending Verification
            </span>
            <span className="px-2 py-0.5 bg-rose-500 text-white font-mono text-[10px] font-black animate-pulse">
              ACTION REQUIRED
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-black text-rose-400">
            {pendingCount}
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-1.5">
            Awaiting manual UTR confirmation
          </div>
        </div>

        <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black uppercase text-neutral-400">
              Free Tier Squads
            </span>
            <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800 font-mono text-[10px] font-black">
              SPONSORED
            </span>
          </div>
          <div className="mt-3 font-mono text-3xl font-black text-cyan-400">
            {freeTierCount}
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 border-t border-neutral-800 pt-1.5">
            No registration fee required
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID / UTR, team name, leader phone..."
              className="w-full pl-9 pr-3 py-2 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-2.5 border-2 border-neutral-700 bg-neutral-950 text-white font-mono text-xs font-bold uppercase cursor-pointer focus:border-amber-400"
            >
              <option value="ALL">Payment Status: All</option>
              <option value="PENDING">Pending Verification</option>
              <option value="VERIFIED">Verified &amp; Paid</option>
              <option value="FREE_TIER">Free Tier (Sponsored)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-800 bg-neutral-950 text-neutral-400">
                <th className="p-3 font-black uppercase">Reg ID</th>
                <th className="p-3 font-black uppercase">Team / College</th>
                <th className="p-3 font-black uppercase">Amount</th>
                <th className="p-3 font-black uppercase">Mode</th>
                <th className="p-3 font-black uppercase">Transaction UTR</th>
                <th className="p-3 font-black uppercase">Status</th>
                <th className="p-3 font-black uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredPayments.map((squad) => (
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
                    <div className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                      {squad.collegeName}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="p-3 font-black text-sm text-white">
                    ₹{squad.amount ?? 0}
                  </td>

                  {/* Payment Mode */}
                  <td className="p-3 font-bold text-neutral-300">
                    <span className="px-2 py-0.5 border border-neutral-800 bg-neutral-950 text-[10px] font-black uppercase text-neutral-300">
                      {squad.paymentMode || "FREE_SPONSORED"}
                    </span>
                  </td>

                  {/* UTR */}
                  <td className="p-3 font-mono font-bold text-neutral-200 max-w-[180px] truncate">
                    {squad.transactionId ? (
                      <span className="bg-neutral-950 px-2 py-0.5 border border-neutral-800 text-amber-300">
                        {squad.transactionId}
                      </span>
                    ) : (
                      <span className="text-neutral-500 italic">N/A (Free)</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 border font-black text-[10px] uppercase ${
                        squad.paymentStatus === "VERIFIED"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                          : squad.paymentStatus === "PENDING"
                          ? "bg-rose-500 text-white animate-pulse"
                          : squad.paymentStatus === "REJECTED"
                          ? "bg-rose-950/60 text-rose-400 border-rose-800"
                          : "bg-cyan-950/60 text-cyan-300 border-cyan-800"
                      }`}
                    >
                      {squad.paymentStatus || "FREE TIER"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Approve / Verify */}
                      {squad.paymentStatus !== "VERIFIED" && (
                        <button
                          onClick={() => handleUpdatePayment(squad.id, "VERIFIED")}
                          disabled={isUpdating}
                          title="Verify & Confirm Squad"
                          className="px-2 py-1 border-2 border-emerald-400 bg-emerald-400 hover:bg-emerald-300 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-black"
                        >
                          VERIFY
                        </button>
                      )}

                      {/* Reject */}
                      {squad.paymentStatus === "PENDING" && (
                        <button
                          onClick={() => handleUpdatePayment(squad.id, "REJECTED")}
                          disabled={isUpdating}
                          title="Reject Payment"
                          className="px-2 py-1 border-2 border-rose-500 bg-rose-500 hover:bg-rose-400 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-white"
                        >
                          REJECT
                        </button>
                      )}

                      {/* Invoice Link */}
                      <a
                        href={`/api/admin/registrations/invoice?id=${squad.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Download Tax Invoice"
                        className="p-1 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 shadow-[1px_1px_0px_0px_#000000] cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setSelectedSquad(squad)}
                        className="px-2 py-1 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 font-black text-[11px] uppercase shadow-[1px_1px_0px_0px_#000000] cursor-pointer text-neutral-200"
                      >
                        INSPECT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
