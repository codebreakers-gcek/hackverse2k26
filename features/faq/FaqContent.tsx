"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  FAQ_ITEMS,
  FAQ_SUPPORT_INFO,
} from "@/data/faqData";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  ChevronDown,
  MessageSquare,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  ExternalLink,
  Flame,
  Check,
  Share2,
} from "lucide-react";
import clsx from "clsx";

export function FaqContent() {
  const shouldReduceMotion = useReducedMotion();
  const [openItemId, setOpenItemId] = useState<string | null>("gen-1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle single item - only one open at a time
  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
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
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-black">
      {/* Fixed Minecraft Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/faqbg.png"
          alt="Hackverse FAQ Background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle dark tint to guarantee readability while preserving 100% full image clarity */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-10 min-w-0"
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full flex justify-center">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl">
            <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
              ★ KNOWLEDGE BASE // QUERY DESK ★
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              FREQUENTLY ASKED{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                QUESTIONS
              </span>
            </h1>

            <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000]">
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                Everything you need to know about team formations, travel logistics, problem statements, evaluation rubrics, and the 24-hour sprint at GCEK Bhawanipatna.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* FAQ ACCORDION LIST */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openItemId === faq.id;
            const itemNumber = (index + 1).toString().padStart(2, "0");

            return (
              <div
                key={faq.id}
                id={faq.id}
                className={clsx(
                  "bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[6px_6px_0px_#000] transition-all overflow-hidden scroll-mt-24",
                  isOpen ? "translate-y-[-2px]" : "hover:translate-y-[-1px]"
                )}
              >
                {/* ACCORDION HEADER / TRIGGER */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-[#C6C6C6] hover:bg-[#D4D4D4] transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                    {/* Numeric Badge (Minecraft Dark Inset Slot) */}
                    <span className="shrink-0 w-8 h-8 bg-[#2B2B2B] text-[#55FFFF] font-mono text-xs font-black flex items-center justify-center border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)] [text-shadow:_1px_1px_0_#000]">
                      {itemNumber}
                    </span>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#8B8B8B] text-white border border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] [text-shadow:_1px_1px_0_#000]">
                          {faq.categoryLabel}
                        </span>
                        {faq.popular && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] flex items-center gap-1 shadow-[2px_2px_0px_#000]">
                            <Flame className="w-3 h-3 text-black fill-black" />
                            <span>POPULAR</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-mono font-black text-base sm:text-lg text-black uppercase tracking-tight leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Right Control Icons */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    {/* Copy Share Link Button (span with role=button to avoid button-in-button hydration error) */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleCopy(faq.id, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy(faq.id, e as any);
                        }
                      }}
                      className="p-1.5 bg-[#707070] hover:bg-[#808080] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                      title="Copy direct link to this FAQ"
                      aria-label="Copy link"
                    >
                      {copiedId === faq.id ? (
                        <Check className="w-3.5 h-3.5 text-[#55FFFF] stroke-[3px]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 stroke-[2.5px]" />
                      )}
                    </span>

                    {/* Expand / Chevron Indicator (Minecraft 3D Button) */}
                    <div
                      className={clsx(
                        "w-8 h-8 border-2 flex items-center justify-center transition-transform duration-200 shadow-[2px_2px_0px_#000]",
                        isOpen
                          ? "bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] rotate-180"
                          : "bg-[#707070] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838]"
                      )}
                    >
                      <ChevronDown className="w-5 h-5 stroke-[3px]" />
                    </div>
                  </div>
                </button>

                {/* ACCORDION EXPANDABLE BODY (Minecraft Inset Slab) */}
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
                      <div className="border-t-3 border-[#373737] bg-[#8B8B8B] p-5 sm:p-6 space-y-4 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5)]">
                        {/* Answer text */}
                        <p className="font-mono text-xs sm:text-sm md:text-base font-bold text-white [text-shadow:_1px_1px_0_#000] leading-relaxed">
                          {faq.answer}
                        </p>

                        {/* Search Tags & Action Link Footer */}
                        <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-white/20">
                          {/* Tags */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-white/70 uppercase mr-1 [text-shadow:_1px_1px_0_#000]">
                                KEYWORDS:
                              </span>
                              {faq.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#2B2B2B] border border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] text-[#55FFFF] [text-shadow:_1px_1px_0_#000]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Link if provided (3D Minecraft Green Button) */}
                          {faq.actionLink && (
                            <Link
                              href={faq.actionLink.href}
                              className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-white bg-[#5B8731] hover:bg-[#689B37] px-3 py-1.5 border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-all self-start sm:self-auto"
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
          })}
        </motion.div>

        {/* ========================================================================= */}
        {/* STILL HAVE QUESTIONS? CALL-TO-ACTION CARD (Obsidian Block) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-3 border-[#333333] pb-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Friendly Minecraft Helper Mascot */}
                <div className="relative w-28 h-32 sm:w-36 sm:h-40 md:w-44 md:h-48 shrink-0 drop-shadow-[4px_4px_0px_#000] select-none">
                  <Image
                    src="/minecraft/hey.png"
                    alt="Friendly Minecraft Support Mascot"
                    fill
                    className="object-contain"
                  />
                  <div className="absolute -top-2 -right-1 sm:-right-2 bg-[#FFAA00] text-black font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000] rotate-6">
                    HEY HACKER!
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs font-black uppercase px-2.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
                    ★ 24/7 DIRECT MENTOR DESK ★
                  </span>
                  <h3 className="font-mono font-black text-2xl sm:text-3xl text-white uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
                    STILL GOT UNANSWERED QUERIES?
                  </h3>
                  <p className="font-mono text-xs sm:text-sm font-bold text-[#CCCCCC] max-w-xl leading-relaxed">
                    Our organizing committee and technical mentors are available 24/7 on Discord
                    and official support channels to assist your squad.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 [text-shadow:_2px_2px_0_#000]"
                >
                  <MessageSquare className="w-4 h-4 stroke-[3px]" />
                  <span>CONTACT SUPPORT DESK</span>
                </Link>
                <a
                  href={FAQ_SUPPORT_INFO.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#7983F5] border-l-[#7983F5] border-r-[#2D3480] border-b-[#2D3480] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 [text-shadow:_1px_1px_0_#000]"
                >
                  <ExternalLink className="w-4 h-4 stroke-[3px]" />
                  <span>JOIN DISCORD SERVER</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Grid (Minecraft Dark Inset Slots) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
              <div className="p-4 bg-[#2B2B2B] border-3 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center gap-3 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]">
                <div className="w-10 h-10 bg-[#1B1B1B] border-2 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#383838] border-b-[#383838] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                  <Mail className="w-5 h-5 stroke-[2.5px] text-[#55FF55]" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-black uppercase text-[#FFAA00] [text-shadow:_1px_1px_0_#000]">
                    EMAIL INQUIRIES
                  </div>
                  <div className="font-mono font-bold text-xs text-white truncate [text-shadow:_1px_1px_0_#000]">
                    {FAQ_SUPPORT_INFO.email}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#2B2B2B] border-3 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center gap-3 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]">
                <div className="w-10 h-10 bg-[#1B1B1B] border-2 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#383838] border-b-[#383838] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                  <Phone className="w-5 h-5 stroke-[2.5px] text-[#55FF55]" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-black uppercase text-[#FFAA00] [text-shadow:_1px_1px_0_#000]">
                    HELPLINE PHONE
                  </div>
                  <div className="font-mono font-bold text-xs text-white truncate [text-shadow:_1px_1px_0_#000]">
                    {FAQ_SUPPORT_INFO.phone}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#2B2B2B] border-3 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] flex items-center gap-3 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]">
                <div className="w-10 h-10 bg-[#1B1B1B] border-2 border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-[#383838] border-b-[#383838] flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)]">
                  <Building2 className="w-5 h-5 stroke-[2.5px] text-[#55FF55]" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-black uppercase text-[#FFAA00] [text-shadow:_1px_1px_0_#000]">
                    CAMPUS VENUE
                  </div>
                  <div className="font-mono font-bold text-xs text-white truncate [text-shadow:_1px_1px_0_#000]">
                    GCEK, Bhawanipatna
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Accent Banner at Bottom */}
      <div className="relative z-10">
        <MarqueeBanner
          items={[
            "HACKVERSE '26",
            "GOT QUESTIONS? WE'VE GOT ANSWERS",
            "MARCH 28-30, 2026",
            "GCEK BHAWANIPATNA",
            "24-HOUR BUILD SPRINT",
            "₹10K+ PRIZES",
            "24/7 MENTOR DESK",
          ]}
          bg="secondary"
        />
      </div>
    </div>
  );
}
