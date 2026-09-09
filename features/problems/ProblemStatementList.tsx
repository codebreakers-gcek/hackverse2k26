"use client";

import React, { useState, useEffect, useMemo } from "react";
import { problemStatementService } from "@/services/problemStatementService";
import { ProblemStatement, ProblemCategory, DifficultyLevel } from "@/types/problemStatement";
import { ProblemStatementCard } from "./ProblemStatementCard";
import { ProblemStatementFilters } from "./ProblemStatementFilters";
import { ProblemStatementSheet } from "./ProblemStatementSheet";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export function ProblemStatementList() {
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<ProblemCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | "All">("All");
  const [selectedProblem, setSelectedProblem] = useState<ProblemStatement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const categories = problemStatementService.getCategories();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [data, settingsRes] = await Promise.all([
          problemStatementService.getAll(),
          fetch("/api/settings", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        ]);
        setProblems(data);
        if (settingsRes && settingsRes.success && settingsRes.settings) {
          if (typeof settingsRes.settings.isProblemStatementsPublished === "boolean") {
            setIsPublished(settingsRes.settings.isProblemStatementsPublished);
          }
        }
      } catch (err) {
        console.error("Failed to load problem statement data", err);
      } finally {
        setLoading(false);
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

  // When unpublished, show Coming Soon immediately (no loading screen)
  if (!isPublished) {
    return (
      <div className="border-4 border-black bg-white p-8 sm:p-14 shadow-neo max-w-3xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 border-4 border-black bg-neo-accent flex items-center justify-center mx-auto shadow-neo">
          <AlertCircle className="w-8 h-8 text-black stroke-[3px]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black inline-block shadow-neo-sm">
            [COMING SOON // EMBARGO ACTIVE]
          </span>
          <h3 className="font-black text-2xl sm:text-4xl uppercase tracking-tight text-black">
            PROBLEM STATEMENTS COMING SOON
          </h3>
          <p className="text-sm sm:text-base font-bold text-black/75 max-w-xl mx-auto leading-relaxed">
            The official battle tracks and technical problem statements for <span className="text-black font-black">HACKVERSE &apos;26</span> are currently under embargo by the academic and technical evaluation committee. They will be revealed here soon!
          </p>
        </div>

        <div className="p-4 bg-amber-50 border-3 border-black text-left font-mono text-xs space-y-2 max-w-lg mx-auto shadow-neo-sm">
          <div className="font-black text-black uppercase flex items-center gap-2">
            <span>OPERATIONAL NOTICE:</span>
          </div>
          <p className="text-black/80 font-bold">
            • Statements will be officially published across AI/ML, Web Dev, Cyber Security, IoT, and Open Innovation tracks before the hacking phase commences.
          </p>
          <p className="text-black/80 font-bold">
            • Ensure your squad is registered to receive instant notification and immediate track selection rights once statements unlock.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black border-4 border-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all"
          >
            REGISTER / VIEW SQUAD DOSSIER
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm transition-all"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    );
  }

  // 3. Published State: Full Interactive Experience (Filters Bar + Problem Cards)
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
