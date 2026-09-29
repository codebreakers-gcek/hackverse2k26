"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdmin } from "@/features/admin/AdminDataContext";
import { RegistrationRecord } from "@/types/admin";
import {
  getSquadProblemStatements,
  resolveProblemStatement,
} from "@/lib/adminProblemUtils";
import {
  generateOnlineMidEvaluationEmailHtml,
  generateOnlineMidEvaluationEmailText,
  OnlineMidEvaluationEmailData,
  EvaluationSlot,
} from "@/lib/midEvalEmailTemplates";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Send,
  FileSpreadsheet,
  Download,
  Upload,
  User,
  Phone,
  Building2,
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Code,
  Search,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Copy,
  Layers,
  Check,
  Info,
  Users,
} from "lucide-react";

interface ImportedScheduleRow {
  teamName: string;
  registrationNumber?: string;
  leaderEmail: string;
  leaderName?: string;
  ps1Id?: string;
  ps1Date?: string;
  ps1Time?: string;
  ps1Link?: string;
  ps2Id?: string;
  ps2Date?: string;
  ps2Time?: string;
  ps2Link?: string;
  matchedSquad?: RegistrationRecord;
}

export default function AdminEmailPage() {
  const { registrations, isLoading } = useAdmin();

  // Selected Squad State
  const [selectedSquadId, setSelectedSquadId] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Slots State for currently selected team
  const [ps1Date, setPs1Date] = useState<string>("");
  const [ps1Time, setPs1Time] = useState<string>("");
  const [ps1Link, setPs1Link] = useState<string>("");

  const [ps2Date, setPs2Date] = useState<string>("");
  const [ps2Time, setPs2Time] = useState<string>("");
  const [ps2Link, setPs2Link] = useState<string>("");

  // Preview Mode: 'rendered' | 'raw'
  const [previewMode, setPreviewMode] = useState<"rendered" | "raw">("rendered");

  // Dispatch States
  const [isSendingSingle, setIsSendingSingle] = useState<boolean>(false);
  const [isSendingBatch, setIsSendingBatch] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{
    total: number;
    completed: number;
    currentTeam: string;
  } | null>(null);

  // Excel Import States
  const [importedRows, setImportedRows] = useState<ImportedScheduleRow[]>([]);
  const [showImportDrawer, setShowImportDrawer] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-select first squad if none selected once loaded
  useEffect(() => {
    if (!selectedSquadId && registrations && registrations.length > 0) {
      setSelectedSquadId(registrations[0].id);
    }
  }, [registrations, selectedSquadId]);

  // Resolve currently active squad
  const activeSquad = useMemo(() => {
    return registrations.find((s) => s.id === selectedSquadId) || null;
  }, [registrations, selectedSquadId]);

  // Resolve active squad's problem statements
  const squadPS = useMemo(() => {
    return getSquadProblemStatements(activeSquad);
  }, [activeSquad]);

  // Construct Email Data for currently active selection
  const currentEmailData: OnlineMidEvaluationEmailData = useMemo(() => {
    if (!activeSquad) {
      return {
        teamName: "Select a Team",
        leaderName: "Team Leader",
        leaderEmail: "leader@example.com",
        registrationNumber: "REG-0000",
        slots: [],
      };
    }

    const slots: EvaluationSlot[] = [];

    if (squadPS.primary) {
      slots.push({
        psId: squadPS.primary.code || squadPS.primary.id,
        psTitle: squadPS.primary.title,
        date: ps1Date || "October 15, 2026",
        time: ps1Time || "10:00 AM - 10:20 AM IST",
        meetingLink: ps1Link || "https://meet.google.com/abc-defg-hij",
      });
    }

    if (squadPS.secondary) {
      slots.push({
        psId: squadPS.secondary.code || squadPS.secondary.id,
        psTitle: squadPS.secondary.title,
        date: ps2Date || "October 15, 2026",
        time: ps2Time || "10:30 AM - 10:50 AM IST",
        meetingLink: ps2Link || "https://meet.google.com/abc-defg-hij",
      });
    }

    // Fallback if squad somehow has no PS assigned
    if (slots.length === 0) {
      slots.push({
        psId: activeSquad.problemStatementId || "GENERAL-01",
        psTitle: "Assigned Problem Statement",
        date: ps1Date || "October 15, 2026",
        time: ps1Time || "10:00 AM - 10:20 AM IST",
        meetingLink: ps1Link || "https://meet.google.com/abc-defg-hij",
      });
    }

    return {
      teamName: activeSquad.teamName,
      leaderName: activeSquad.leaderName,
      leaderEmail: activeSquad.leaderEmail,
      registrationNumber: activeSquad.registrationNumber,
      slots,
    };
  }, [activeSquad, squadPS, ps1Date, ps1Time, ps1Link, ps2Date, ps2Time, ps2Link]);

  // Filter squads for dropdown search
  const filteredSquads = useMemo(() => {
    if (!searchFilter.trim()) return registrations;
    const q = searchFilter.toLowerCase();
    return registrations.filter(
      (s) =>
        s.teamName?.toLowerCase().includes(q) ||
        s.leaderName?.toLowerCase().includes(q) ||
        s.leaderEmail?.toLowerCase().includes(q) ||
        s.registrationNumber?.toLowerCase().includes(q) ||
        s.collegeName?.toLowerCase().includes(q)
    );
  }, [registrations, searchFilter]);

  // Check if current active squad has matching row in imported excel
  const matchedExcelRow = useMemo(() => {
    if (!activeSquad || importedRows.length === 0) return null;
    return (
      importedRows.find(
        (r) =>
          (r.matchedSquad && r.matchedSquad.id === activeSquad.id) ||
          (r.registrationNumber &&
            activeSquad.registrationNumber &&
            r.registrationNumber &&
            activeSquad.registrationNumber.toLowerCase() === r.registrationNumber.toLowerCase()) ||
          (r.teamName &&
            activeSquad.teamName &&
            r.teamName &&
            activeSquad.teamName.toLowerCase() === r.teamName.toLowerCase()) ||
          (r.leaderEmail &&
            activeSquad.leaderEmail &&
            r.leaderEmail &&
            activeSquad.leaderEmail.toLowerCase() === r.leaderEmail.toLowerCase())
      ) || null
    );
  }, [activeSquad, importedRows]);

  // Handle Team selection with automatic Excel data hydration
  const handleSelectSquad = (squadId: string) => {
    setSelectedSquadId(squadId);
    const targetSquad = registrations.find((s) => s.id === squadId);
    if (!targetSquad) return;

    // Check if this squad exists in imported Excel
    const match = importedRows.find(
      (r) =>
        (r.matchedSquad && r.matchedSquad.id === squadId) ||
        (r.registrationNumber &&
          targetSquad.registrationNumber &&
          r.registrationNumber &&
          targetSquad.registrationNumber.toLowerCase() === r.registrationNumber.toLowerCase()) ||
        (r.teamName &&
          targetSquad.teamName &&
          r.teamName &&
          targetSquad.teamName.toLowerCase() === r.teamName.toLowerCase()) ||
        (r.leaderEmail &&
          targetSquad.leaderEmail &&
          r.leaderEmail &&
          targetSquad.leaderEmail.toLowerCase() === r.leaderEmail.toLowerCase())
    );

    if (match) {
      if (match.ps1Date) setPs1Date(match.ps1Date);
      if (match.ps1Time) setPs1Time(match.ps1Time);
      if (match.ps1Link) setPs1Link(match.ps1Link);
      if (match.ps2Date) setPs2Date(match.ps2Date);
      if (match.ps2Time) setPs2Time(match.ps2Time);
      if (match.ps2Link) setPs2Link(match.ps2Link);
      toast.info(`Auto-loaded Excel schedule for ${targetSquad.teamName}`);
    }
  };

  // Apply imported schedule to a squad
  const applyImportedDataToSquad = (row: ImportedScheduleRow) => {
    if (row.matchedSquad) {
      setSelectedSquadId(row.matchedSquad.id);
    }
    if (row.ps1Date) setPs1Date(row.ps1Date);
    if (row.ps1Time) setPs1Time(row.ps1Time);
    if (row.ps1Link) setPs1Link(row.ps1Link);
    if (row.ps2Date) setPs2Date(row.ps2Date);
    if (row.ps2Time) setPs2Time(row.ps2Time);
    if (row.ps2Link) setPs2Link(row.ps2Link);
    toast.success(`Loaded schedule parameters for ${row.teamName}`);
  };

  // Excel Sample Template Generator
  const handleDownloadSampleExcel = () => {
    try {
      const sampleData = registrations.slice(0, 50).map((squad) => {
        const ps = getSquadProblemStatements(squad);
        return {
          "Registration Number": squad.registrationNumber,
          "Team Name": squad.teamName,
          "Leader Name": squad.leaderName,
          "Leader Email": squad.leaderEmail,
          "PS1 Code": ps.primary?.code || squad.problemStatementId || "CB-HW-01",
          "PS1 Date": "2026-10-15",
          "PS1 Time": "10:00 AM - 10:20 AM",
          "PS1 Meeting Link": "https://meet.google.com/xxx-yyyy-zzz",
          "PS2 Code": ps.secondary?.code || "",
          "PS2 Date": ps.secondary ? "2026-10-15" : "",
          "PS2 Time": ps.secondary ? "10:30 AM - 10:50 AM" : "",
          "PS2 Meeting Link": ps.secondary ? "https://meet.google.com/xxx-yyyy-zzz" : "",
        };
      });

      // If registrations is empty, produce a fallback demo row
      if (sampleData.length === 0) {
        sampleData.push({
          "Registration Number": "HV26-0001",
          "Team Name": "Team Alpha",
          "Leader Name": "Rahul Sharma",
          "Leader Email": "rahul@example.com",
          "PS1 Code": "CB-HW-01",
          "PS1 Date": "2026-10-15",
          "PS1 Time": "10:00 AM - 10:20 AM",
          "PS1 Meeting Link": "https://meet.google.com/abc-defg-hij",
          "PS2 Code": "CB-SF-02",
          "PS2 Date": "2026-10-15",
          "PS2 Time": "10:30 AM - 10:50 AM",
          "PS2 Meeting Link": "https://meet.google.com/abc-defg-hij",
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mid_Evaluation_Slots");
      XLSX.writeFile(workbook, "hackverse26_mid_eval_schedule_template.xlsx");
      toast.success("Downloaded Excel schedule template!");
    } catch (err: any) {
      toast.error("Failed to generate template: " + err.message);
    }
  };

  // Excel Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          toast.error("The uploaded spreadsheet is empty.");
          return;
        }

        const parsedRows: ImportedScheduleRow[] = rawJson.map((row) => {
          // Normalize keys (case insensitive / trimmed)
          const getVal = (possibleKeys: string[]) => {
            for (const key of Object.keys(row)) {
              const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
              for (const pk of possibleKeys) {
                if (cleanKey === pk.toLowerCase().replace(/[^a-z0-9]/g, "")) {
                  return String(row[key] || "").trim();
                }
              }
            }
            return "";
          };

          const regNum = getVal(["registrationnumber", "regno", "regnum", "reg", "registration"]);
          const teamName = getVal(["teamname", "team", "squadname", "squad"]);
          const leaderEmail = getVal(["leaderemail", "email", "mail", "contactemail"]);
          const leaderName = getVal(["leadername", "leader", "name"]);

          const ps1Date = getVal(["ps1date", "date", "date1", "evaluationdate"]);
          const ps1Time = getVal(["ps1time", "time", "time1", "slot", "timeslot"]);
          const ps1Link = getVal(["ps1meetinglink", "ps1link", "meetinglink", "link", "joininglink", "url"]);

          const ps2Date = getVal(["ps2date", "date2"]);
          const ps2Time = getVal(["ps2time", "time2", "slot2"]);
          const ps2Link = getVal(["ps2meetinglink", "ps2link", "meetinglink2", "link2"]);

          // Match with local squad record
          const matchedSquad = registrations.find((s) => {
            if (regNum && s.registrationNumber?.toLowerCase() === regNum.toLowerCase()) return true;
            if (leaderEmail && s.leaderEmail?.toLowerCase() === leaderEmail.toLowerCase()) return true;
            if (teamName && s.teamName?.toLowerCase() === teamName.toLowerCase()) return true;
            return false;
          });

          return {
            registrationNumber: regNum || matchedSquad?.registrationNumber || "",
            teamName: teamName || matchedSquad?.teamName || "Unknown Team",
            leaderEmail: leaderEmail || matchedSquad?.leaderEmail || "",
            leaderName: leaderName || matchedSquad?.leaderName || "",
            ps1Date,
            ps1Time,
            ps1Link,
            ps2Date,
            ps2Time,
            ps2Link,
            matchedSquad,
          };
        });

        setImportedRows(parsedRows);
        setShowImportDrawer(true);

        // Auto-select and load the first matched squad or currently selected squad
        const currentMatch = parsedRows.find(
          (r) =>
            (r.matchedSquad && r.matchedSquad.id === selectedSquadId) ||
            (r.registrationNumber &&
              activeSquad?.registrationNumber &&
              r.registrationNumber &&
              activeSquad.registrationNumber.toLowerCase() === r.registrationNumber.toLowerCase()) ||
            (r.teamName &&
              activeSquad?.teamName &&
              r.teamName &&
              activeSquad.teamName.toLowerCase() === r.teamName.toLowerCase())
        );

        if (currentMatch) {
          applyImportedDataToSquad(currentMatch);
          toast.success(
            `Parsed ${parsedRows.length} rows & auto-loaded schedule for ${currentMatch.teamName}!`
          );
        } else if (parsedRows.length > 0 && parsedRows[0].matchedSquad) {
          applyImportedDataToSquad(parsedRows[0]);
          toast.success(
            `Parsed ${parsedRows.length} rows & auto-selected ${parsedRows[0].teamName}!`
          );
        } else {
          toast.success(`Successfully parsed ${parsedRows.length} rows from Excel!`);
        }
      } catch (err: any) {
        toast.error("Failed to parse Excel file: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input value so re-selecting same file triggers change
    e.target.value = "";
  };

  // Send Single Email
  const handleSendSingleEmail = async () => {
    if (!activeSquad) {
      toast.error("Please select a squad first.");
      return;
    }
    if (!activeSquad.leaderEmail) {
      toast.error(`Team "${activeSquad.teamName}" does not have a registered leader email address.`);
      return;
    }

    const toastId = toast.loading(`Sending Mid-Evaluation schedule to ${activeSquad.teamName}...`);
    setIsSendingSingle(true);

    try {
      const res = await fetch("/api/admin/email/send-mid-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEmailData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send email.");
      }

      toast.success(
        `🎯 Mid-Evaluation email sent successfully to ${activeSquad.leaderName} (${activeSquad.leaderEmail}) for Team ${activeSquad.teamName}!`,
        { id: toastId }
      );
    } catch (err: any) {
      toast.error(
        `❌ Failed to send email to ${activeSquad.teamName}: ${err.message}`,
        { id: toastId }
      );
    } finally {
      setIsSendingSingle(false);
    }
  };

  // Send Batch Emails
  const handleSendBatchEmails = async () => {
    if (importedRows.length === 0) {
      toast.error("No imported schedule rows to send.");
      return;
    }

    const payloadItems: OnlineMidEvaluationEmailData[] = [];

    for (const row of importedRows) {
      const squad = row.matchedSquad;
      const squadProblem = squad ? getSquadProblemStatements(squad) : null;
      const slots: EvaluationSlot[] = [];

      // PS 1
      const ps1Title = squadProblem?.primary?.title || "Problem Statement 1";
      const ps1Code = squadProblem?.primary?.code || squad?.problemStatementId || "PS-01";
      slots.push({
        psId: ps1Code,
        psTitle: ps1Title,
        date: row.ps1Date || ps1Date || "October 15, 2026",
        time: row.ps1Time || ps1Time || "10:00 AM - 10:20 AM IST",
        meetingLink: row.ps1Link || ps1Link || "",
      });

      // PS 2 if exists
      if (squadProblem?.secondary || row.ps2Date || row.ps2Link) {
        slots.push({
          psId: squadProblem?.secondary?.code || "PS-02",
          psTitle: squadProblem?.secondary?.title || "Problem Statement 2",
          date: row.ps2Date || ps2Date || "October 15, 2026",
          time: row.ps2Time || ps2Time || "10:30 AM - 10:50 AM IST",
          meetingLink: row.ps2Link || ps2Link || row.ps1Link || ps1Link || "",
        });
      }

      payloadItems.push({
        teamName: squad?.teamName || row.teamName,
        leaderName: squad?.leaderName || row.leaderName || "Team Leader",
        leaderEmail: squad?.leaderEmail || row.leaderEmail,
        registrationNumber: squad?.registrationNumber || row.registrationNumber,
        slots,
      });
    }

    const toastId = toast.loading(`Dispatching batch schedule emails to ${payloadItems.length} teams...`);
    setIsSendingBatch(true);
    setBatchProgress({ total: payloadItems.length, completed: 0, currentTeam: "" });

    try {
      const res = await fetch("/api/admin/email/send-mid-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Batch send failed.");
      }

      if (data.failed === 0) {
        toast.success(
          `🎉 All ${data.sent} team evaluation notices were dispatched successfully!`,
          { id: toastId }
        );
      } else if (data.sent > 0) {
        toast.warning(
          `⚠️ Batch completed with partial errors: ${data.sent} sent, ${data.failed} failed.`,
          { id: toastId }
        );
      } else {
        toast.error(
          `❌ All ${data.failed} email dispatches failed. Please check Resend configuration.`,
          { id: toastId }
        );
      }
    } catch (err: any) {
      toast.error(`❌ Batch dispatch error: ${err.message}`, { id: toastId });
    } finally {
      setIsSendingBatch(false);
      setBatchProgress(null);
    }
  };

  // Copy Preview to Clipboard
  const handleCopyTextPreview = () => {
    const text = generateOnlineMidEvaluationEmailText(currentEmailData);
    navigator.clipboard.writeText(text);
    toast.success("Plain text email content copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-2 border-neutral-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-xs font-black px-2.5 py-0.5 rounded-none font-mono uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              Evaluation Dispatcher
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono px-2 py-0.5 font-bold">
              <Sparkles className="w-3 h-3" />
              ONLINE MID-EVALUATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-mono">
            Mid-Evaluation Mail Center
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            Select participating teams, configure date/time slots and meeting links for each chosen problem statement, import from Excel, and dispatch official mid-eval notices.
          </p>
        </div>

        {/* Action Buttons: Import / Download Template */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadSampleExcel}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border-2 border-neutral-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            title="Download an Excel sheet with all registered squads"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>DOWNLOAD EXCEL TEMPLATE</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border-2 border-neutral-700 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            title="Upload completed schedule spreadsheet"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>IMPORT SCHEDULE (EXCEL)</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Team Selection, Details & Slot Inputs (7 cols) */}
        <div className="xl:col-span-6 space-y-6">
          {/* Card 1: Team Selector Dropdown */}
          <div className="bg-[#121218] border-2 border-neutral-800 p-5 shadow-[4px_4px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Participating Team
              </label>
              <span className="text-xs font-mono text-neutral-400">
                {registrations.length} Teams Registered
              </span>
            </div>

            {/* Team Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between bg-neutral-950 border-2 border-neutral-700 hover:border-amber-400/80 px-4 py-3 text-left transition-all group cursor-pointer focus:outline-none focus:border-amber-400">
                {activeSquad ? (
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-white group-hover:text-amber-300 truncate">
                        {activeSquad.teamName}
                      </span>
                      <span className="font-mono text-[11px] px-1.5 py-0.2 bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {activeSquad.registrationNumber}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 truncate">
                      Leader: <strong className="text-neutral-200">{activeSquad.leaderName}</strong> ({activeSquad.leaderEmail})
                    </span>
                  </div>
                ) : (
                  <span className="text-neutral-500 font-mono text-sm">
                    Select a team...
                  </span>
                )}
                <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 shrink-0 ml-2" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[calc(100vw-3rem)] sm:w-[480px] max-h-[380px] overflow-y-auto bg-neutral-950 border-2 border-neutral-800 text-neutral-200 p-2 shadow-2xl z-50 overscroll-contain"
                data-lenis-prevent="true"
              >
                {/* Search inside dropdown */}
                <div className="sticky top-0 bg-neutral-950 pb-2 mb-2 border-b border-neutral-800 z-10">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search squad name, leader, reg #..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 pl-9 pr-3 py-2 focus:outline-none focus:border-amber-400 placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {filteredSquads.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-neutral-500">
                    No teams found matching search.
                  </div>
                ) : (
                  filteredSquads.map((sq) => {
                    const ps = getSquadProblemStatements(sq);
                    const psCount = (ps.primary ? 1 : 0) + (ps.secondary ? 1 : 0);
                    const isSelected = sq.id === selectedSquadId;
                    const hasExcelMatch = importedRows.some(
                      (r) =>
                        (r.matchedSquad && r.matchedSquad.id === sq.id) ||
                        (r.registrationNumber &&
                          sq.registrationNumber &&
                          r.registrationNumber.toLowerCase() === sq.registrationNumber.toLowerCase()) ||
                        (r.teamName && sq.teamName && r.teamName.toLowerCase() === sq.teamName.toLowerCase()) ||
                        (r.leaderEmail && sq.leaderEmail && r.leaderEmail.toLowerCase() === sq.leaderEmail.toLowerCase())
                    );

                    return (
                      <DropdownMenuItem
                        key={sq.id}
                        onClick={() => handleSelectSquad(sq.id)}
                        className={`group flex items-start justify-between p-3 cursor-pointer rounded-none border-b border-neutral-900 transition-colors focus:outline-none ${
                          isSelected
                            ? "!bg-neutral-900 !text-white border-l-4 !border-l-amber-400"
                            : "hover:!bg-neutral-900 focus:!bg-neutral-900 !text-neutral-200 hover:!text-white focus:!text-white"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 overflow-hidden pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-neutral-100 group-hover:text-amber-300 group-focus:text-amber-300 truncate">
                              {sq.teamName}
                            </span>
                            <span className="text-[10px] font-mono bg-black text-amber-400/90 px-1.5 py-0.2 border border-neutral-700">
                              {sq.registrationNumber}
                            </span>
                            {hasExcelMatch && (
                              <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/50 px-1 py-0.2">
                                EXCEL
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400 group-hover:text-neutral-300 group-focus:text-neutral-300 truncate">
                            {sq.leaderName} • {sq.collegeName || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
                              psCount === 2
                                ? "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-600/60"
                                : psCount === 1
                                ? "bg-cyan-950 text-cyan-300 border-cyan-600/60"
                                : "bg-neutral-900 text-neutral-400 border-neutral-800"
                            }`}
                          >
                            {psCount} PS
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-400 ml-1 shrink-0" />}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Team Leader Metadata Summary */}
            {activeSquad && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-950 border border-neutral-800 p-3 flex items-center gap-3">
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Team Leader / SPOC</div>
                    <div className="text-xs font-bold text-neutral-200 truncate">{activeSquad.leaderName}</div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Leader Email</div>
                    <div className="text-xs font-bold text-neutral-200 truncate">{activeSquad.leaderEmail}</div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Leader Phone</div>
                    <div className="text-xs font-bold text-neutral-200 truncate">
                      {activeSquad.leaderPhone || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-3 flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase">Institution / College</div>
                    <div className="text-xs font-bold text-neutral-200 truncate">
                      {activeSquad.collegeName || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Problem Statements & Slot Configuration */}
          <div className="bg-[#121218] border-2 border-neutral-800 p-5 shadow-[4px_4px_0px_#000000] space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Problem Statement Evaluation Slots
                </label>
                {matchedExcelRow && (
                  <span className="inline-flex items-center gap-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono px-2 py-0.5 font-bold">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                    AUTO-LOADED FROM EXCEL
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  // Quick auto fill with same meeting link if filled in PS1
                  if (ps1Link && !ps2Link) setPs2Link(ps1Link);
                  if (ps1Date && !ps2Date) setPs2Date(ps1Date);
                  toast.success("Synced date and link between problem statements");
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-amber-400 flex items-center gap-1 underline transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Sync PS1 to PS2
              </button>
            </div>

            {/* Problem Statement 1 Block */}
            <div className="bg-neutral-950 border-2 border-neutral-800 p-4 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black bg-amber-400 text-black px-2 py-0.5">
                  PROBLEM STATEMENT 1 (PRIMARY)
                </span>
                <span className="font-mono text-xs font-bold text-neutral-300">
                  PS ID: {squadPS.primary?.code || squadPS.primary?.id || activeSquad?.problemStatementId || "TBD"}
                </span>
              </div>

              <div className="text-xs text-neutral-300 font-semibold bg-neutral-900/80 p-2.5 border border-neutral-800">
                {squadPS.primary?.title || "Assigned Primary Problem Statement"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Date Input */}
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 15, 2026 or 2026-10-15"
                    value={ps1Date}
                    onChange={(e) => setPs1Date(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-amber-400 placeholder:text-neutral-600"
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Time Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 10:20 AM IST"
                    value={ps1Time}
                    onChange={(e) => setPs1Time(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-amber-400 placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Joining Link Input */}
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                  <LinkIcon className="w-3 h-3 text-amber-400" />
                  Joining / Meeting Link
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  value={ps1Link}
                  onChange={(e) => setPs1Link(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-amber-400 placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Problem Statement 2 Block (If selected or available) */}
            {squadPS.secondary ? (
              <div className="bg-neutral-950 border-2 border-neutral-800 p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black bg-cyan-400 text-black px-2 py-0.5">
                    PROBLEM STATEMENT 2 (SECONDARY)
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-300">
                    PS ID: {squadPS.secondary.code || squadPS.secondary.id}
                  </span>
                </div>

                <div className="text-xs text-neutral-300 font-semibold bg-neutral-900/80 p-2.5 border border-neutral-800">
                  {squadPS.secondary.title}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Date Input */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. October 15, 2026 or 2026-10-15"
                      value={ps2Date}
                      onChange={(e) => setPs2Date(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-neutral-600"
                    />
                  </div>

                  {/* Time Input */}
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Time Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:30 AM - 10:50 AM IST"
                      value={ps2Time}
                      onChange={(e) => setPs2Time(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {/* Joining Link Input */}
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1 mb-1">
                    <LinkIcon className="w-3 h-3 text-cyan-400" />
                    Joining / Meeting Link
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://meet.google.com/abc-defg-hij"
                    value={ps2Link}
                    onChange={(e) => setPs2Link(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 px-3 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-neutral-600"
                  />
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-neutral-800 bg-neutral-950/50 p-3 text-center text-xs font-mono text-neutral-500">
                This team has opted for 1 Problem Statement only. Problem Statement 2 section will be omitted from their email notice.
              </div>
            )}

            {/* Send Single Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendSingleEmail}
                disabled={isSendingSingle || !activeSquad}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-mono font-black py-3.5 px-4 text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
              >
                {isSendingSingle ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>DISPATCHING EVALUATION EMAIL...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MID-EVALUATION EMAIL TO {activeSquad?.teamName?.toUpperCase() || "TEAM"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Imported Spreadsheet Overview Drawer (If loaded) */}
          {importedRows.length > 0 && (
            <div className="bg-[#121218] border-2 border-neutral-800 p-5 shadow-[4px_4px_0px_#000000] space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">
                    Imported Schedule Batch ({importedRows.length} Teams)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImportedRows([])}
                  className="text-xs font-mono text-rose-400 hover:underline"
                >
                  Clear Sheet
                </button>
              </div>

              {/* Table of imported rows */}
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                style={{ overscrollBehavior: "contain" }}
                className="max-h-60 overflow-y-auto border border-neutral-800 text-xs font-mono [scrollbar-width:thin] [scrollbar-color:#525252_transparent]"
              >
                <table className="w-full text-left border-collapse">
                  <thead className="bg-neutral-950 text-neutral-400 sticky top-0 border-b border-neutral-800">
                    <tr>
                      <th className="p-2">Team</th>
                      <th className="p-2">Leader / Email</th>
                      <th className="p-2">PS1 Slot</th>
                      <th className="p-2">PS2 Slot</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 bg-neutral-950/60">
                    {importedRows.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-900">
                        <td className="p-2 font-bold text-neutral-200">
                          {row.teamName}
                          {row.matchedSquad && (
                            <span className="block text-[10px] text-emerald-400">✓ Matched in DB</span>
                          )}
                        </td>
                        <td className="p-2 text-neutral-400">
                          <div>{row.leaderName}</div>
                          <div className="text-[10px] text-neutral-500">{row.leaderEmail}</div>
                        </td>
                        <td className="p-2 text-neutral-300">
                          {row.ps1Date ? `${row.ps1Date} ${row.ps1Time || ""}` : <span className="text-neutral-600">N/A</span>}
                        </td>
                        <td className="p-2 text-neutral-300">
                          {row.ps2Date ? `${row.ps2Date} ${row.ps2Time || ""}` : <span className="text-neutral-600">N/A</span>}
                        </td>
                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => applyImportedDataToSquad(row)}
                            className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-cyan-300 px-2 py-1 border border-neutral-700 font-bold"
                          >
                            Load
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Batch Send CTA */}
              <button
                type="button"
                onClick={handleSendBatchEmails}
                disabled={isSendingBatch}
                className="w-full flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-mono font-black py-3 px-4 text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_#000000]"
              >
                {isSendingBatch ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SENDING BATCH IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>DISPATCH BATCH EMAILS TO ALL {importedRows.length} IMPORTED TEAMS</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Email Preview (5 cols) */}
        <div className="xl:col-span-6 sticky top-6 space-y-4">
          <div className="bg-[#121218] border-2 border-neutral-800 p-4 shadow-[4px_4px_0px_#000000]">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Live Email Preview
                </span>
                <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-400">
                  REAL-TIME SYNC
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("rendered")}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 border transition-all ${
                    previewMode === "rendered"
                      ? "bg-amber-400 text-black font-black border-amber-400"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Rendered
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("raw")}
                  className={`flex items-center gap-1 text-xs font-mono px-2.5 py-1 border transition-all ${
                    previewMode === "raw"
                      ? "bg-amber-400 text-black font-black border-amber-400"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Plain Text
                </button>
                <button
                  type="button"
                  onClick={handleCopyTextPreview}
                  title="Copy Plain Text"
                  className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-neutral-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Email Meta Headers Preview */}
            <div className="bg-neutral-950 border border-neutral-800 p-3 space-y-1.5 text-xs font-mono mb-4">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase w-16">To:</span>
                <span className="text-neutral-200 font-bold">
                  {currentEmailData.leaderName} &lt;{currentEmailData.leaderEmail}&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase w-16">From:</span>
                <span className="text-neutral-400">
                  HACKVERSE &apos;26 &lt;support@hackverse.cbgcek.dev&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase w-16">Subject:</span>
                <span className="text-amber-400 font-bold">
                  HACKVERSE ’26 | Online Mid-Evaluation Schedule for Team {currentEmailData.teamName}
                </span>
              </div>
            </div>

            {/* Preview Box */}
            {previewMode === "rendered" ? (
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                style={{ overscrollBehavior: "contain" }}
                className="border-4 border-black bg-neutral-100 text-black max-h-[620px] overflow-y-auto p-4 sm:p-6 shadow-inner overscroll-contain select-text font-sans [scrollbar-width:thin] [scrollbar-color:#525252_transparent]"
              >
                {/* Email Content Frame */}
                <div className="max-w-[580px] mx-auto bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000000]">
                  {/* Top Branding Banner */}
                  <div className="bg-black text-white p-4 border-b-4 border-black mb-6">
                    <span className="bg-amber-400 text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider">
                      HACKVERSE &apos;26
                    </span>
                    <h2 className="text-lg font-mono font-black tracking-tight mt-1 text-white uppercase">
                      CodeBreakers — GCE Kalahandi
                    </h2>
                  </div>

                  {/* Header Box */}
                  <div className="bg-amber-300 border-2 border-black p-4 mb-6 shadow-[3px_3px_0px_#000000]">
                    <div className="text-[10px] font-mono font-black text-black uppercase tracking-wider">
                      OFFICIAL EVALUATION SCHEDULE
                    </div>
                    <div className="text-base font-black text-black uppercase">
                      Online Mid-Evaluation — HACKVERSE ’26
                    </div>
                  </div>

                  {/* Salutation */}
                  <p className="text-sm font-semibold text-neutral-900 mb-3">
                    Dear {currentEmailData.leaderName || "Team Leader"},
                  </p>

                  <p className="text-xs text-neutral-800 leading-relaxed mb-3">
                    Greetings from <strong>CodeBreakers, GCE Kalahandi</strong>.
                  </p>

                  <p className="text-xs text-neutral-800 leading-relaxed mb-4">
                    This is to inform you that your team is scheduled to participate in the <strong>Online Mid-Evaluation of HACKVERSE ’26</strong>. Please find your team and evaluation details below:
                  </p>

                  {/* Team Details Block */}
                  <div className="border-2 border-black bg-neutral-50 p-3.5 mb-4 shadow-[2px_2px_0px_#000000]">
                    <div className="text-[10px] font-mono font-black text-black uppercase border-b border-neutral-300 pb-1 mb-2">
                      Team Details
                    </div>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-bold text-neutral-600">Team Name: </span>
                        <strong className="text-black">{currentEmailData.teamName}</strong>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-600">Team Leader: </span>
                        <strong className="text-black">{currentEmailData.leaderName}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Selected Problem Statements Title */}
                  <div className="text-xs font-mono font-black text-black uppercase tracking-wide mb-2 mt-4">
                    Selected Problem Statement(s)
                  </div>

                  {/* Slots Cards */}
                  <div className="space-y-3 mb-4">
                    {currentEmailData.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-black bg-neutral-50 p-3.5 shadow-[2px_2px_0px_#000000]"
                      >
                        <div className="flex items-center justify-between border-b border-neutral-300 pb-1 mb-2">
                          <span className="font-mono text-[11px] font-black bg-black text-amber-300 px-1.5 py-0.5">
                            Problem Statement {idx + 1}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-black bg-neutral-200 px-1.5 py-0.5 border border-black">
                            PS ID: {slot.psId || "N/A"}
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 text-neutral-800">
                          <div>
                            <span className="font-bold text-neutral-600">Problem Statement: </span>
                            <span className="font-black text-black">{slot.psTitle}</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-600">Date: </span>
                            <span className="font-mono font-bold text-black">{slot.date}</span>
                          </div>
                          <div>
                            <span className="font-bold text-neutral-600">Time: </span>
                            <span className="font-mono font-bold text-black">{slot.time}</span>
                          </div>
                          <div className="pt-1">
                            <span className="font-bold text-neutral-600 block mb-1">Joining Link:</span>
                            {slot.meetingLink ? (
                              <a
                                href={slot.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-amber-400 text-black text-xs font-mono font-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000000]"
                              >
                                🔗 JOIN EVALUATION SESSION
                              </a>
                            ) : (
                              <span className="text-neutral-400 italic text-xs">Link will be shared shortly</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SPOC and Instructions */}
                  <div className="bg-neutral-100 border-2 border-black p-3 text-xs leading-relaxed space-y-2 mb-4">
                    <p>
                      As your team has selected{" "}
                      <strong>
                        {currentEmailData.slots.length === 1
                          ? "one Problem Statement"
                          : `${currentEmailData.slots.length} Problem Statements`}
                      </strong>
                      , please be prepared to discuss your progress, proposed solution, prototype, and implementation approach for the selected Problem Statement(s) during the evaluation.
                    </p>
                    <p>
                      The Team Leader will serve as the <strong>SPOC (Single Point of Contact)</strong> for the team and is requested to join the session on time and ensure that the required team members are available.
                    </p>
                    <p>
                      Please share the joining details with all members of your team and ensure that everyone is prepared for the evaluation.
                    </p>
                  </div>

                  <p className="text-xs text-neutral-800 mb-4">
                    We look forward to seeing your progress and ideas.
                  </p>

                  {/* Sign-off Footer */}
                  <div className="border-t-2 border-dashed border-neutral-400 pt-3 text-xs text-neutral-700 leading-relaxed font-sans">
                    <strong>Best regards,</strong><br />
                    <strong>Organising Committee</strong><br />
                    HACKVERSE ’26<br />
                    CodeBreakers, Government College of Engineering Kalahandi<br />
                    Bhawanipatna, Odisha<br />
                    <strong>📞 +91 8895220675</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                style={{ overscrollBehavior: "contain" }}
                className="border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 whitespace-pre-wrap max-h-[620px] overflow-y-auto select-text leading-relaxed [scrollbar-width:thin] [scrollbar-color:#525252_transparent]"
              >
                {generateOnlineMidEvaluationEmailText(currentEmailData)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
