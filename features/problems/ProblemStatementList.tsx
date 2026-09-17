"use client";

import React, { useState, useEffect, useMemo } from "react";
import { problemStatementService } from "@/services/problemStatementService";
import { PROBLEM_STATEMENTS_DATA } from "@/data/problemStatements";
import { ProblemStatement, ProblemCategory, DifficultyLevel } from "@/types/problemStatement";
import { ProblemStatementCard } from "./ProblemStatementCard";
import { ProblemStatementFilters } from "./ProblemStatementFilters";
import { ProblemStatementSheet } from "./ProblemStatementSheet";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export function ProblemStatementList() {
  const [problems, setProblems] = useState<ProblemStatement[]>(PROBLEM_STATEMENTS_DATA);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProblemCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | "All">("All");
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const categories = problemStatementService.getCategories();

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

  // Filtered list
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Category filter
      if (activeCategory !== "All" && p.category !== activeCategory) {
        return false;
      }
      // Difficulty filter
      if (activeDifficulty !== "All" && p.difficulty !== activeDifficulty) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDomain = p.domain.toLowerCase().includes(q);
        const matchDesc = p.shortDescription.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q);
        const matchStack = p.suggestedStack?.some((s) => s.toLowerCase().includes(q)) ?? false;
        if (!matchTitle && !matchDomain && !matchDesc && !matchCode && !matchStack) {
          return false;
        }
      }
      return true;
    });
  }, [problems, activeCategory, activeDifficulty, searchQuery]);

  const handleOpenDetails = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setSelectedProblem(null);
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setActiveDifficulty("All");
  };

  // Published State: Full Interactive Experience (Filters Bar + Problem Cards)
  return (
    <div>
      {/* Interactive Filters Bar */}
      <ProblemStatementFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeDifficulty={activeDifficulty}
        onSelectDifficulty={setActiveDifficulty}
        totalCount={filteredProblems.length}
      />

      {filteredProblems.length === 0 ? (
        /* Empty State */
        <div className="border-4 border-black bg-white p-12 text-center shadow-neo space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-neo-accent mx-auto stroke-[3px]" />
          <h3 className="font-black text-2xl uppercase tracking-tight">
            NO PROBLEM STATEMENTS FOUND
          </h3>
          <p className="text-sm font-bold text-black/70">
            No matching problems found for your current search criteria. Try clearing filters or searching for alternative technologies.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neo-secondary text-black font-black text-xs uppercase tracking-wider border-3 border-black shadow-neo-sm hover:bg-neo-secondary/90 transition-all"
          >
            <RotateCcw className="w-4 h-4 stroke-[3px]" />
            <span>RESET ALL FILTERS</span>
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
