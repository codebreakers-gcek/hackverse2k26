"use client";

import React, { useState, useEffect, useMemo } from "react";
import { problemStatementService } from "@/services/problemStatementService";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement } from "@/types/problemStatement";
import { ProblemStatementCard } from "./ProblemStatementCard";
import { ProblemStatementSheet } from "./ProblemStatementSheet";
import { AlertCircle, Cpu, Code2, Layers, Filter, RefreshCw } from "lucide-react";
import clsx from "clsx";

type FilterType = "ALL" | "HARDWARE" | "SOFTWARE";

export function ProblemStatementList() {
  const [problems, setProblems] = useState<ProblemStatement[]>(PROBLEM_STATEMENTS_DATA);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await problemStatementService.getAll();
        if (data && data.length > 0) {
          setProblems(data);
        }
      } catch (err) {
        console.error("Failed to load problem statement data", err);
      }
    }
    loadData();
  }, []);

  const totalCount = problems.length;
  const hwCount = useMemo(
    () => problems.filter((p) => p.category?.toLowerCase() === "hardware").length,
    [problems]
  );
  const swCount = useMemo(
    () => problems.filter((p) => p.category?.toLowerCase() === "software").length,
    [problems]
  );

  const filteredProblems = useMemo(() => {
    if (activeFilter === "HARDWARE") {
      return problems.filter((p) => p.category?.toLowerCase() === "hardware");
    }
    if (activeFilter === "SOFTWARE") {
      return problems.filter((p) => p.category?.toLowerCase() === "software");
    }
    return problems;
  }, [problems, activeFilter]);

  const handleOpenDetails = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedProblem(null);
  };

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* FILTER & STATS CONTROL PANEL (Minecraft GUI Box) */}
      {/* ========================================================================= */}
      <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-3.5 sm:p-5 shadow-[6px_6px_0px_#000] mb-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Filter Pills Container: vertical stack on mobile, horizontal row on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
            <div className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 stroke-[3px]" />
              <span>FILTER:</span>
            </div>

            {/* Buttons: Full width single column on mobile (<sm), horizontal on sm+ */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              {/* ALL / TOTAL PS BUTTON */}
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={clsx(
                  "w-full sm:w-auto px-3.5 sm:px-4 py-2.5 sm:py-2 font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_#000] flex items-center justify-between sm:justify-start gap-3 select-none active:translate-y-0.5",
                  activeFilter === "ALL"
                    ? "bg-[#5B8731] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                    : "bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>TOTAL PS</span>
                </div>
                <span
                  className={clsx(
                    "px-2 py-0.5 text-[10px] font-mono font-black border shadow-[1px_1px_0px_#000] shrink-0",
                    activeFilter === "ALL"
                      ? "bg-black text-[#55FF55] border-[#55FF55]"
                      : "bg-black text-white border-black"
                  )}
                >
                  {totalCount < 10 ? `0${totalCount}` : totalCount}
                </span>
              </button>

              {/* HARDWARE (HW) BUTTON */}
              <button
                type="button"
                onClick={() => setActiveFilter("HARDWARE")}
                className={clsx(
                  "w-full sm:w-auto px-3.5 sm:px-4 py-2.5 sm:py-2 font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_#000] flex items-center justify-between sm:justify-start gap-3 select-none active:translate-y-0.5",
                  activeFilter === "HARDWARE"
                    ? "bg-[#9A3412] text-white border-3 border-t-[#EA580C] border-l-[#EA580C] border-r-[#431407] border-b-[#431407] [text-shadow:_1px_1px_0_#000]"
                    : "bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>HARDWARE (HW)</span>
                </div>
                <span
                  className={clsx(
                    "px-2 py-0.5 text-[10px] font-mono font-black border shadow-[1px_1px_0px_#000] shrink-0",
                    activeFilter === "HARDWARE"
                      ? "bg-black text-[#55FFFF] border-[#55FFFF]"
                      : "bg-black text-white border-black"
                  )}
                >
                  {hwCount < 10 ? `0${hwCount}` : hwCount}
                </span>
              </button>

              {/* SOFTWARE (SW) BUTTON */}
              <button
                type="button"
                onClick={() => setActiveFilter("SOFTWARE")}
                className={clsx(
                  "w-full sm:w-auto px-3.5 sm:px-4 py-2.5 sm:py-2 font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_#000] flex items-center justify-between sm:justify-start gap-3 select-none active:translate-y-0.5",
                  activeFilter === "SOFTWARE"
                    ? "bg-[#2C6B74] text-white border-3 border-t-[#55FFFF] border-l-[#55FFFF] border-r-[#133E43] border-b-[#133E43] [text-shadow:_1px_1px_0_#000]"
                    : "bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 shrink-0" />
                  <span>SOFTWARE (SW)</span>
                </div>
                <span
                  className={clsx(
                    "px-2 py-0.5 text-[10px] font-mono font-black border shadow-[1px_1px_0px_#000] shrink-0",
                    activeFilter === "SOFTWARE"
                      ? "bg-black text-[#55FF55] border-[#55FF55]"
                      : "bg-black text-white border-black"
                  )}
                >
                  {swCount < 10 ? `0${swCount}` : swCount}
                </span>
              </button>
            </div>
          </div>

          {/* Status Indicator Badge */}
          <div className="bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] px-3.5 py-2 sm:py-1.5 flex items-center justify-between sm:justify-start gap-2 font-mono text-xs font-black text-black shrink-0 w-full lg:w-auto">
            <span className="text-[10px] uppercase text-black/70">STATUS:</span>
            <span className="text-[#005500] font-black uppercase">
              SHOWING {filteredProblems.length} OF {totalCount} TRACKS
            </span>
          </div>
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        /* Empty State */
        <div className="bg-[#1E1E1E]/95 backdrop-blur-sm border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-8 sm:p-12 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-xl mx-auto text-white">
          <AlertCircle className="w-12 h-12 text-[#FFAA00] mx-auto stroke-[3px]" />
          <h3 className="font-black text-2xl uppercase tracking-tight text-white [text-shadow:_1px_1px_0_#000]">
            NO CHALLENGES FOUND
          </h3>
          <p className="text-xs sm:text-sm font-bold text-neutral-300">
            No active problem statements found under the selected category.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET FILTER</span>
          </button>
        </div>
      ) : (
        /* Problem Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProblems.map((problem) => (
            <ProblemStatementCard
              key={problem.id}
              problem={problem}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      )}

      {/* Full Problem Spec Side Sheet Drawer */}
      <ProblemStatementSheet
        problem={selectedProblem}
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
}
