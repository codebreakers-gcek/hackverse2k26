"use client";

import React, { useState, useEffect, useMemo } from "react";
import { problemStatementService } from "@/services/problemStatementService";
import { ProblemStatement, ProblemCategory, DifficultyLevel } from "@/types/problemStatement";
import { ProblemStatementCard } from "./ProblemStatementCard";
import { ProblemStatementFilters } from "./ProblemStatementFilters";
import { ProblemStatementModal } from "./ProblemStatementModal";
import { AlertCircle, RotateCcw } from "lucide-react";

export function ProblemStatementList() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProblemCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | "All">("All");
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = problemStatementService.getCategories();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await problemStatementService.getAll();
      setProblems(data);
      setLoading(false);
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
        const matchStack = p.suggestedStack.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDomain && !matchDesc && !matchCode && !matchStack) {
          return false;
        }
      }
      return true;
    });
  }, [problems, activeCategory, activeDifficulty, searchQuery]);

  const handleOpenDetails = (problem: ProblemStatement) => {
    setSelectedProblem(problem);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProblem(null);
  };

  const handleResetFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setActiveDifficulty("All");
  };

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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="border-4 border-black bg-white p-6 shadow-neo animate-pulse space-y-4"
            >
              <div className="h-6 bg-neutral-200 w-1/3" />
              <div className="h-8 bg-neutral-200 w-3/4" />
              <div className="h-16 bg-neutral-200 w-full" />
              <div className="h-10 bg-neutral-200 w-full" />
            </div>
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
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

      {/* Full Problem Spec Modal */}
      <ProblemStatementModal
        problem={selectedProblem}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
