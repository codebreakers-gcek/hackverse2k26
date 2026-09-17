"use client";

import React, { useState, useEffect } from "react";
import { problemStatementService } from "@/services/problemStatementService";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement } from "@/types/problemStatement";
import { ProblemStatementCard } from "./ProblemStatementCard";
import { ProblemStatementSheet } from "./ProblemStatementSheet";
import { AlertCircle } from "lucide-react";

export function ProblemStatementList() {
  const [problems, setProblems] = useState<ProblemStatement[]>(PROBLEM_STATEMENTS_DATA);
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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
      {problems.length === 0 ? (
        /* Empty State */
        <div className="bg-[#1E1E1E]/95 backdrop-blur-sm border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-8 sm:p-12 text-center shadow-[6px_6px_0px_#000] space-y-4 max-w-xl mx-auto text-white">
          <AlertCircle className="w-12 h-12 text-[#FFAA00] mx-auto stroke-[3px]" />
          <h3 className="font-black text-2xl uppercase tracking-tight text-white [text-shadow:_1px_1px_0_#000]">
            NO CHALLENGES FOUND
          </h3>
          <p className="text-xs sm:text-sm font-bold text-neutral-300">
            No active problem statements available at the moment.
          </p>
        </div>
      ) : (
        /* Problem Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((problem) => (
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
