"use client";

import React from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { ProblemCategory, DifficultyLevel } from "@/types/problemStatement";

export interface ProblemStatementFiltersProps {
  categories: ProblemCategory[];
  activeCategory: ProblemCategory;
  onSelectCategory: (cat: ProblemCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeDifficulty: DifficultyLevel | "All";
  onSelectDifficulty: (diff: DifficultyLevel | "All") => void;
  totalCount: number;
}

export function ProblemStatementFilters({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeDifficulty,
  onSelectDifficulty,
  totalCount,
}: ProblemStatementFiltersProps) {
  return (
    <div className="border-4 border-black bg-white p-6 shadow-neo mb-10 space-y-6">
      {/* Top Search & Results Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
            <Search className="w-5 h-5 stroke-[3px]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems by keywords, stack (PyTorch, Go, WebRTC)..."
            className="w-full h-12 pl-10 pr-10 text-sm font-bold text-black bg-neo-bg rounded-none border-3 border-black focus:outline-none focus:bg-neo-secondary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-neo-accent"
            >
              <X className="w-5 h-5 stroke-[3px]" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-black uppercase text-black">
            DIFFICULTY:
          </span>
          <select
            value={activeDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as DifficultyLevel | "All")}
            className="h-12 px-3 text-xs font-black uppercase bg-neo-bg border-3 border-black focus:outline-none focus:bg-neo-secondary cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Domain Category Pills */}
      <div>
        <div className="flex items-center justify-between font-mono text-xs font-black uppercase text-black/70 mb-3">
          <span>SELECT TECHNICAL TRACK:</span>
          <span>{totalCount} PROBLEMS LOADED</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={clsx(
                  "px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-black transition-all duration-100 select-none",
                  "focus:outline-none focus:ring-2 focus:ring-black",
                  isActive
                    ? "bg-neo-secondary text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]"
                    : "bg-white text-black hover:bg-neutral-100 hover:shadow-neo-sm"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
