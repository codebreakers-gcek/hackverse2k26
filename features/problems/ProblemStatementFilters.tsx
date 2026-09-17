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
    <div className="bg-[#1E1E1E]/95 backdrop-blur-sm border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-5 sm:p-6 shadow-[6px_6px_0px_#000] mb-8 sm:mb-10 space-y-5 text-white">
      {/* Top Search & Results Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#55FF55]">
            <Search className="w-4 h-4 stroke-[3px]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search challenges by keyword, track, tech stack..."
            className="w-full h-12 pl-10 pr-10 text-xs sm:text-sm font-mono font-bold text-[#55FF55] bg-[#111111] border-3 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#4A4A4A] border-b-[#4A4A4A] focus:outline-none focus:border-[#55FF55] placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-[#FF5555] cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[3px]" />
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-mono text-xs font-black uppercase text-[#FFAA00]">
            DIFFICULTY:
          </span>
          <select
            value={activeDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as DifficultyLevel | "All")}
            className="h-12 px-3 text-xs font-mono font-black uppercase bg-[#111111] text-[#FFAA00] border-3 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#4A4A4A] border-b-[#4A4A4A] focus:outline-none cursor-pointer"
          >
            <option value="All">ALL LEVELS</option>
            <option value="Beginner">BEGINNER</option>
            <option value="Intermediate">INTERMEDIATE</option>
            <option value="Advanced">ADVANCED</option>
          </select>
        </div>
      </div>

      {/* Domain Category Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between font-mono text-xs font-black uppercase text-neutral-400">
          <span>SELECT TECHNICAL TRACK:</span>
          <span className="text-[#55FF55]">{totalCount} CHALLENGES AVAILABLE</span>
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
                  "px-3.5 py-2 text-xs font-mono font-black uppercase tracking-wider transition-all select-none cursor-pointer",
                  isActive
                    ? "bg-[#FFAA00] text-black border-3 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                    : "bg-[#2D2D2D] hover:bg-[#383838] hover:text-[#FFAA00] text-[#D0D0D0] border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]"
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

