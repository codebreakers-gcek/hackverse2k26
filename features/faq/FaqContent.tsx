"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  FAQ_SUPPORT_INFO,
} from "@/data/faqData";
import { FaqCategory } from "@/types/faq";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Search,
  ChevronDown,
  Sparkles,
  HelpCircle,
  CreditCard,
  Users,
  Building2,
  Code2,
  Award,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  Flame,
  Layers,
  X,
  Check,
  Share2,
} from "lucide-react";
import clsx from "clsx";

export function FaqContent() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "gen-1": true,
    "reg-1": true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Icon mapping for categories
  const categoryIcons: Record<string, React.ReactNode> = {
    HelpCircle: <HelpCircle className="w-4 h-4 stroke-[2.5px]" />,
    Sparkles: <Sparkles className="w-4 h-4 stroke-[2.5px]" />,
    CreditCard: <CreditCard className="w-4 h-4 stroke-[2.5px]" />,
    Users: <Users className="w-4 h-4 stroke-[2.5px]" />,
    Building2: <Building2 className="w-4 h-4 stroke-[2.5px]" />,
    Code2: <Code2 className="w-4 h-4 stroke-[2.5px]" />,
    Award: <Award className="w-4 h-4 stroke-[2.5px]" />,
  };

  // Filter FAQs based on active category and search term
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Toggle single item
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all visible items
  const expandAll = () => {
    const newState: Record<string, boolean> = {};
    filteredFaqs.forEach((item) => {
      newState[item.id] = true;
    });
    setOpenItems(newState);
  };

  // Collapse all visible items
  const collapseAll = () => {
    setOpenItems({});
  };

  // Copy link / share handler
  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/faqs#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Framer motion variants
  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.03,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-neo-bg w-full max-w-full overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-10 min-w-0"
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full">
          <SectionTitle
            tag="KNOWLEDGE BASE // QUERY DESK"
            title="FREQUENTLY ASKED"
            highlightText="QUESTIONS"
            subtitle="Everything you need to know about team formations, travel logistics, problem statements, evaluation rubrics, and the 36-hour sprint at GCEK Bhawanipatna."
          />
        </motion.div>

        {/* ========================================================================= */}
        {/* SEARCH & QUICK STATS BAR */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4 w-full max-w-full">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/60">
                <Search className="w-5 h-5 stroke-[2.5px]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords (e.g. food, team size, upi, problem statements, wifi)..."
                className="w-full pl-12 pr-10 py-3.5 bg-white border-4 border-black font-bold text-sm sm:text-base text-black placeholder:text-black/50 shadow-neo focus:outline-none focus:bg-amber-50/50 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/60 hover:text-black font-black"
                  aria-label="Clear search query"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              )}
            </div>

            {/* Expand / Collapse Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={expandAll}
                className="flex-1 sm:flex-initial px-4 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                EXPAND ALL
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="flex-1 sm:flex-initial px-4 py-3.5 bg-white hover:bg-neutral-100 text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                COLLAPSE ALL
              </button>
            </div>
          </div>

          {/* Search Result Counter / Active Filter Notice */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-black/70 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 border border-black inline-block rounded-full animate-pulse" />
              <span>
                SHOWING {filteredFaqs.length} OF {FAQ_ITEMS.length} AVAILABLE QUESTIONS
              </span>
              {searchQuery && (
                <span className="bg-neo-secondary px-2 py-0.5 border border-black text-black font-black">
                  FILTER: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
            <span>CATEGORY: {selectedCategory.toUpperCase()}</span>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER PILLS */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar select-none w-full max-w-full">
            {FAQ_CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? FAQ_ITEMS.length
                  : FAQ_ITEMS.filter((item) => item.category === cat.id).length;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 border-3 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0",
                    isActive
                      ? "bg-black text-white shadow-neo-sm translate-x-0.5 translate-y-0.5"
                      : "bg-white text-black hover:bg-neo-secondary shadow-neo-sm hover:shadow-none"
                  )}
                >
                  <span className={isActive ? "text-neo-secondary" : "text-black"}>
                    {categoryIcons[cat.iconName] || <Layers className="w-4 h-4" />}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    className={clsx(
                      "font-mono text-[10px] px-1.5 py-0.2 border",
                      isActive
                        ? "bg-neo-secondary text-black border-black font-black"
                        : "bg-neo-muted text-black border-black"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FAQ ACCORDION LIST */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredFaqs.length === 0 ? (
            /* EMPTY SEARCH STATE */
            <div className="border-4 border-black bg-white p-8 sm:p-12 text-center shadow-neo space-y-4">
              <div className="w-16 h-16 bg-neo-secondary border-3 border-black flex items-center justify-center mx-auto shadow-neo-sm">
                <HelpCircle className="w-8 h-8 text-black stroke-[2.5px]" />
              </div>
              <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                NO MATCHING QUESTIONS FOUND
              </h3>
              <p className="text-sm sm:text-base font-bold text-black/70 max-w-md mx-auto">
                We couldn&apos;t find any questions matching your query &quot;{searchQuery}&quot;.
                Try refining your keywords or reach out to our team directly.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-black text-white border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  RESET FILTERS
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-neo-secondary text-black border-3 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:bg-neo-accent transition-all flex items-center gap-2"
                >
                  <span>ASK US ON DISCORD / EMAIL</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
              </div>
            </div>
          ) : (
            /* ACCORDION ITEMS */
            filteredFaqs.map((faq, index) => {
              const isOpen = !!openItems[faq.id];
              const itemNumber = (index + 1).toString().padStart(2, "0");

              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={clsx(
                    "border-4 border-black bg-white transition-all overflow-hidden scroll-mt-24",
                    isOpen ? "shadow-neo-lg" : "shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-sm"
                  )}
                >
                  {/* ACCORDION HEADER / TRIGGER */}
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-neutral-50 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                      {/* Numeric Badge */}
                      <span className="shrink-0 w-8 h-8 bg-black text-white font-mono text-xs font-black flex items-center justify-center border-2 border-black shadow-neo-sm">
                        {itemNumber}
                      </span>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 bg-neo-muted text-black border border-black">
                            {faq.categoryLabel}
                          </span>
                          {faq.popular && (
                            <span className="font-mono text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 bg-neo-accent text-black border border-black flex items-center gap-1">
                              <Flame className="w-3 h-3 text-black fill-black" />
                              <span>POPULAR</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-base sm:text-lg text-black uppercase tracking-tight leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Right Control Icons */}
                    <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                      {/* Copy Share Link Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopy(faq.id, e)}
                        className="p-1.5 bg-white hover:bg-neo-secondary border-2 border-black text-black transition-colors hidden sm:flex items-center justify-center"
                        title="Copy direct link to this FAQ"
                        aria-label="Copy link"
                      >
                        {copiedId === faq.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3px]" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                        )}
                      </button>

                      {/* Expand / Chevron Indicator */}
                      <div
                        className={clsx(
                          "w-8 h-8 border-2 border-black flex items-center justify-center transition-transform duration-200",
                          isOpen
                            ? "bg-black text-white rotate-180"
                            : "bg-neo-secondary text-black shadow-neo-sm"
                        )}
                      >
                        <ChevronDown className="w-5 h-5 stroke-[3px]" />
                      </div>
                    </div>
                  </button>

                  {/* ACCORDION EXPANDABLE BODY */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div className="border-t-3 border-black bg-neo-bg/50 p-5 sm:p-7 space-y-4">
                          {/* Answer text */}
                          <p className="text-sm sm:text-base font-bold text-black/90 leading-relaxed">
                            {faq.answer}
                          </p>

                          {/* Search Tags & Action Link Footer */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-black/10">
                            {/* Tags */}
                            {faq.tags && faq.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-black/50 uppercase mr-1">
                                  KEYWORDS:
                                </span>
                                {faq.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-black/40 text-black/80"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Link if provided */}
                            {faq.actionLink && (
                              <Link
                                href={faq.actionLink.href}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black bg-neo-secondary hover:bg-neo-accent px-3 py-1.5 border-2 border-black shadow-neo-sm hover:shadow-none transition-all self-start sm:self-auto"
                              >
                                <span>{faq.actionLink.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>

        {/* ========================================================================= */}
        {/* STILL HAVE QUESTIONS? CALL-TO-ACTION CARD */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-neo-secondary/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-3 border-black pb-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-white border-2 border-black inline-block">
                  [DIRECT DESK]
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  STILL GOT UNANSWERED QUERIES?
                </h3>
                <p className="text-sm sm:text-base font-bold text-black/75 max-w-xl">
                  Our organizing committee and technical mentors are available 24/7 on Discord
                  and official support channels to assist your squad.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 stroke-[3px]" />
                  <span>CONTACT SUPPORT DESK</span>
                </Link>
                <a
                  href={FAQ_SUPPORT_INFO.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-3.5 bg-black text-white hover:bg-neutral-800 font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 stroke-[3px]" />
                  <span>JOIN DISCORD SERVER</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-neo-bg border-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                  <Mail className="w-5 h-5 stroke-[2.5px] text-black" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase text-black/60">
                    EMAIL INQUIRIES
                  </div>
                  <div className="font-bold text-xs text-black truncate">
                    {FAQ_SUPPORT_INFO.email}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neo-bg border-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                  <Phone className="w-5 h-5 stroke-[2.5px] text-black" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase text-black/60">
                    HELPLINE PHONE
                  </div>
                  <div className="font-bold text-xs text-black">
                    {FAQ_SUPPORT_INFO.phone}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neo-bg border-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-neo-sm">
                  <Building2 className="w-5 h-5 stroke-[2.5px] text-black" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase text-black/60">
                    CAMPUS VENUE
                  </div>
                  <div className="font-bold text-xs text-black truncate">
                    GCEK, Bhawanipatna
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Accent Banner at Bottom */}
      <MarqueeBanner
        items={[
          "HACKVERSE '26",
          "GOT QUESTIONS? WE'VE GOT ANSWERS",
          "MARCH 28-30, 2026",
          "GCEK BHAWANIPATNA",
          "36-HOUR BUILD SPRINT",
          "₹10K+ PRIZES",
          "24/7 MENTOR DESK",
        ]}
        bg="secondary"
      />
    </div>
  );
}
