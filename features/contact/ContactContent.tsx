"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  OFFICIAL_EMAILS,
  ALL_CONTACTS,
  TECHNICAL_TEAM,
  MANAGEMENT_TEAM,
  VENUE_DETAILS,
  SOCIAL_CHANNELS,
} from "@/data/contactData";
import { ContactCategory } from "@/types/contact";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Users,
  Search,
  Sparkles,
  Train,
  Plane,
  ArrowRight,
  HelpCircle,
  X,
  MessageSquare,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/common/SocialIcons";
import clsx from "clsx";

export function ContactContent() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<ContactCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Copy Email Handler
  const handleCopyEmail = (email: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2200);
    }
  };

  // Copy Phone Handler
  const handleCopyPhone = (phone: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(id);
      setTimeout(() => setCopiedPhone(null), 2200);
    }
  };

  // Filter Contacts
  const filteredContacts = useMemo(() => {
    return ALL_CONTACTS.filter((person) => {
      const matchesCategory =
        selectedCategory === "all" || person.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        person.name.toLowerCase().includes(q) ||
        person.role.toLowerCase().includes(q) ||
        person.department.toLowerCase().includes(q) ||
        person.email.toLowerCase().includes(q) ||
        person.phone.includes(q) ||
        person.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Framer Motion Variants
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
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
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
          src="/minecraft/contactbg.png"
          alt="Hackverse Contact Background"
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
        className="relative z-10 w-full max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-12 min-w-0"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER TITLE */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full flex justify-center">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl">
            <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
              ★ COMMUNICATION &amp; DISPATCH DESK ★
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              GET IN{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                TOUCH
              </span>
            </h1>

            <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000]">
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                Connect directly with our Technical Developers, Management Organizers, and Institutional In-Charge for hackathon queries, registrations, travel, and sponsorships.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: OFFICIAL EMAILS HUB (FEATURED CARDS) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4 w-full max-w-full">
          <div className="flex items-center justify-between bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 stroke-[2.5px] text-[#FFAA00]" />
              <h3 className="font-mono font-black text-base sm:text-lg uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
                OFFICIAL INBOXES &amp; MAIL DIRECTORY
              </h3>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#55FFFF] hidden sm:inline-block [text-shadow:_1px_1px_0_#000]">
              ★ 24/7 ACTIVE DISPATCH ★
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OFFICIAL_EMAILS.map((inbox) => {
              const isCopied = copiedEmail === inbox.email;
              return (
                <div
                  key={inbox.id}
                  className={clsx(
                    "bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4 transition-all hover:translate-y-[-2px]",
                    inbox.primary && "relative overflow-hidden"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#55FFFF] border border-[#55FFFF] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                        {inbox.badge}
                      </span>
                      {inbox.primary && (
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[2px_2px_0px_#000]">
                          PRIMARY
                        </span>
                      )}
                    </div>

                    <h4 className="font-mono font-black text-sm uppercase tracking-tight text-black leading-snug">
                      {inbox.label}
                    </h4>

                    {/* Email Inset Slot */}
                    <div className="p-2.5 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] font-mono text-xs font-black text-white break-all select-all flex items-center justify-between gap-2 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] [text-shadow:_1px_1px_0_#000]">
                      <span>{inbox.email}</span>
                    </div>

                    <p className="font-mono text-xs font-bold text-[#2A2A2A] leading-relaxed">
                      {inbox.description}
                    </p>
                  </div>

                  {/* Actions (3D Minecraft Buttons) */}
                  <div className="pt-2 flex items-center gap-2 border-t-2 border-[#8B8B8B]">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(inbox.email)}
                      className="flex-1 py-2 px-3 bg-[#707070] hover:bg-[#808080] text-white border-3 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] font-mono font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all cursor-pointer [text-shadow:_1px_1px_0_#000]"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#55FFFF] stroke-[3px]" />
                          <span className="text-[#55FFFF]">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${inbox.email}?subject=${encodeURIComponent("Inquiry regarding HACKVERSE '26")}`}
                      className="py-2 px-3 bg-[#5B8731] hover:bg-[#689B37] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>COMPOSE</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 3: DIRECTORY OF TEAMS (TECHNICAL & MANAGEMENT) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 stroke-[2.5px] text-[#55FF55]" />
              <h3 className="font-mono font-black text-base sm:text-lg uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
                LEADERSHIP &amp; COORDINATOR DIRECTORY
              </h3>
            </div>

            {/* Category Filter Tabs (3D Minecraft Buttons) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto select-none">
              {[
                { id: "all", label: "ALL DESKS", count: ALL_CONTACTS.length },
                { id: "technical", label: "TECHNICAL DEVS", count: TECHNICAL_TEAM.length },
                { id: "management", label: "MANAGEMENT TEAM", count: MANAGEMENT_TEAM.length },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id as ContactCategory)}
                    className={clsx(
                      "px-3 py-1.5 border-3 font-mono font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0px_#000]",
                      isActive
                        ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] [text-shadow:_1px_1px_0_#000]"
                        : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] [text-shadow:_1px_1px_0_#000]"
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={clsx(
                        "font-mono text-[10px] font-black px-1.5 py-0.2 border border-black",
                        isActive ? "bg-black text-[#55FFFF]" : "bg-black text-[#FFAA00]"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Directory (Minecraft Inset Slot) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#55FFFF]">
              <Search className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team by name, role, phone, or email (e.g. Subham, Ayushman, Rohan, Full-Stack, Logistics)..."
              className="w-full pl-10 pr-10 py-3 bg-[#8B8B8B] border-4 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] font-mono font-bold text-xs sm:text-sm text-white placeholder:text-white/70 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6)] [text-shadow:_1px_1px_0_#000] focus:outline-none focus:bg-[#7D7D7D] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/80 hover:text-white font-black cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full bg-[#1B1B1B]/95 border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-8 text-center shadow-[6px_6px_0px_#000] space-y-3">
                <HelpCircle className="w-10 h-10 mx-auto text-[#FFAA00] stroke-[2px]" />
                <h4 className="font-mono font-black text-lg uppercase text-white [text-shadow:_2px_2px_0_#000]">
                  NO TEAM MEMBERS MATCHED &quot;{searchQuery}&quot;
                </h4>
                <p className="font-mono text-xs font-bold text-[#CCCCCC] max-w-sm mx-auto">
                  Try searching by first name, domain keyword, or reset the filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 bg-[#707070] hover:bg-[#808080] text-white border-3 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  RESET SEARCH
                </button>
              </div>
            ) : (
              filteredContacts.map((person) => {
                const isPhoneCopied = copiedPhone === person.id;
                return (
                  <div
                    key={person.id}
                    className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-5 sm:p-6 shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 bg-[#55FF55] text-black border-2 border-t-[#9EFF9E] border-l-[#9EFF9E] border-r-[#1B801B] border-b-[#1B801B] shadow-[2px_2px_0px_#000]">
                          {person.categoryLabel}
                        </span>

                        {person.featured && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-[#FFAA00] border border-[#FFAA00] shadow-[2px_2px_0px_#000] flex items-center gap-1 [text-shadow:_1px_1px_0_#000]">
                            <Sparkles className="w-3 h-3 text-[#FFAA00] stroke-[2.5px]" />
                            <span>LEAD</span>
                          </span>
                        )}
                      </div>

                      {/* Header info */}
                      <div>
                        <h4 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-tight">
                          {person.name}
                        </h4>
                        <div className="font-mono text-xs font-black text-[#2A2A2A] mt-0.5">
                          {person.role}
                        </div>
                        <div className="font-mono text-[11px] font-bold text-[#444444] mt-0.5">
                          {person.department}
                        </div>
                      </div>

                      {/* Bio */}
                      {person.bio && (
                        <p className="font-mono text-xs font-bold text-white [text-shadow:_1px_1px_0_#000] leading-relaxed p-2.5 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                          {person.bio}
                        </p>
                      )}

                      {/* Contact Info Chips */}
                      <div className="space-y-2 pt-1 font-mono text-xs">
                        {/* Phone */}
                        <div className="flex items-center justify-between p-2 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]">
                          <div className="flex items-center gap-2 truncate">
                            <Phone className="w-3.5 h-3.5 stroke-[2.5px] text-[#55FF55] shrink-0" />
                            <span className="font-black text-white [text-shadow:_1px_1px_0_#000]">{person.displayPhone}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(person.phone, person.id)}
                            className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#5B8731] hover:bg-[#689B37] text-white border border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] cursor-pointer shadow-[1px_1px_0px_#000] ml-2 shrink-0 [text-shadow:_1px_1px_0_#000]"
                            title="Copy number"
                          >
                            {isPhoneCopied ? "COPIED!" : "COPY"}
                          </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between p-2 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 stroke-[2.5px] text-[#55FFFF] shrink-0" />
                            <span className="font-bold text-white [text-shadow:_1px_1px_0_#000] truncate">{person.email}</span>
                          </div>
                          <a
                            href={`mailto:${person.email}`}
                            className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#707070] hover:bg-[#808080] text-white border border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shrink-0 ml-2 shadow-[1px_1px_0px_#000] [text-shadow:_1px_1px_0_#000]"
                            title="Send email"
                          >
                            MAIL
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#8B8B8B]">
                      <div className="flex items-center gap-2">
                        {/* Direct Call */}
                        <a
                          href={`tel:${person.phone}`}
                          className="px-3 py-1.5 bg-[#707070] hover:bg-[#808080] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>CALL</span>
                        </a>

                        {/* WhatsApp if available */}
                        {person.whatsapp && (
                          <a
                            href={`https://wa.me/${person.whatsapp}?text=${encodeURIComponent(
                              `Hi ${person.name}, I am reaching out regarding HACKVERSE '26 at GCEK.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#5B8731] hover:bg-[#689B37] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
                          >
                            <WhatsappIcon className="w-4 h-4" />
                            <span>WHATSAPP</span>
                          </a>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-1.5">
                        {person.github && (
                          <a
                            href={person.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#707070] hover:bg-[#808080] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors"
                            aria-label={`${person.name} GitHub`}
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.linkedin && (
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#707070] hover:bg-[#0077b5] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors"
                            aria-label={`${person.name} LinkedIn`}
                          >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 4: CAMPUS HEADQUARTERS, TRANSIT & FAQS ROW IN BOTTOM */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
            <MapPin className="w-5 h-5 stroke-[2.5px] text-[#FFAA00]" />
            <h3 className="font-mono font-black text-base sm:text-lg uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
              CAMPUS HEADQUARTERS, TRANSIT &amp; SUPPORT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1: Campus Headquarters & Venue */}
            <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-[#8B8B8B] pb-2.5">
                  <MapPin className="w-5 h-5 text-[#FFAA00] stroke-[3px]" />
                  <h4 className="font-mono font-black text-sm sm:text-base uppercase tracking-tight text-black">
                    CAMPUS HEADQUARTERS &amp; VENUE
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs font-mono font-bold text-black leading-relaxed">
                  <div className="font-black text-sm text-black uppercase">
                    {VENUE_DETAILS.institution}
                  </div>
                  <div className="text-[11px] font-black text-[#333333]">
                    {VENUE_DETAILS.department}
                  </div>
                  <p className="pt-1 text-[#222222]">
                    {VENUE_DETAILS.campus}, {VENUE_DETAILS.address}, {VENUE_DETAILS.city}, {VENUE_DETAILS.state} - {VENUE_DETAILS.pincode}
                  </p>
                </div>
              </div>

              <a
                href={VENUE_DETAILS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#5B8731] hover:bg-[#689B37] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 stroke-[2.5px] text-[#55FFFF]" />
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
            </div>

            {/* CARD 2: Transit & Connectivity */}
            <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-[#8B8B8B] pb-2.5">
                  <Train className="w-5 h-5 text-[#55FF55] stroke-[2.5px]" />
                  <h4 className="font-mono font-black text-sm sm:text-base uppercase tracking-tight text-black">
                    TRANSIT &amp; CONNECTIVITY
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs font-mono font-bold text-black">
                  <div>
                    <div className="font-black uppercase text-black flex items-center gap-1.5 mb-1 text-[11px]">
                      <Train className="w-3.5 h-3.5 stroke-[2.5px] text-[#55FF55]" />
                      <span>RAILWAY ACCESS:</span>
                    </div>
                    <ul className="space-y-1 pl-1 text-[11px] text-[#222222]">
                      {VENUE_DETAILS.railwayStations.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#5B8731] font-black">▸</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t-2 border-[#8B8B8B] pt-2">
                    <div className="font-black uppercase text-black flex items-center gap-1.5 mb-1 text-[11px]">
                      <Plane className="w-3.5 h-3.5 stroke-[2.5px] text-[#55FFFF]" />
                      <span>AIRPORT ACCESS:</span>
                    </div>
                    <ul className="space-y-1 pl-1 text-[11px] text-[#222222]">
                      {VENUE_DETAILS.airports.map((ap, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#5B8731] font-black">▸</span>
                          <span>{ap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] font-mono text-[10px] font-black text-white text-center [text-shadow:_1px_1px_0_#000] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                COLLEGE SHUTTLES AVAILABLE AT KESINGA (KSNG)
              </div>
            </div>

            {/* CARD 3: Common Questions & Community Hub (Obsidian GUI Block) */}
            <div className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-[#333333] pb-2.5">
                  <HelpCircle className="w-5 h-5 stroke-[2.5px] text-[#FFAA00]" />
                  <h4 className="font-mono font-black text-sm sm:text-base uppercase tracking-tight text-white [text-shadow:_1px_1px_0_#000]">
                    FREQUENTLY ASKED QUESTIONS
                  </h4>
                </div>

                <p className="font-mono text-xs font-bold text-[#CCCCCC] leading-relaxed">
                  Have questions about squad eligibility, cash prizes, food &amp; accommodation passes, or problem statement specifications? Check our live FAQ database.
                </p>

                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
                    <span className="font-bold text-white [text-shadow:_1px_1px_0_#000]">COMMUNITY DISCORD</span>
                    <a
                      href={SOCIAL_CHANNELS.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[10px] uppercase text-[#55FFFF] underline hover:text-[#55FF55]"
                    >
                      JOIN SERVER ↗
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#2B2B2B] border-2 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
                    <span className="font-bold text-white flex items-center gap-1.5 [text-shadow:_1px_1px_0_#000]">
                      <WhatsappIcon className="w-3.5 h-3.5 text-[#55FF55]" />
                      <span>WHATSAPP DESK</span>
                    </span>
                    <a
                      href={SOCIAL_CHANNELS.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[10px] uppercase text-[#55FF55] underline hover:text-[#55FFFF]"
                    >
                      CHAT GROUP ↗
                    </a>
                  </div>
                </div>
              </div>

              <Link
                href="/faqs"
                className="w-full py-3 bg-[#5B8731] hover:bg-[#689B37] text-white border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] active:translate-y-0.5 transition-all"
              >
                <span>EXPLORE ALL FAQS</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Banner */}
      <div className="relative z-10">
        <MarqueeBanner
          items={[
            "HACKVERSE '26 CONTACT RADAR",
            "24/7 SUPPORT AVAILABLE",
            "CSE.CODEBREAKER@GCEKBPATNA.AC.IN",
            "HACKVERSE26@CODEBREAKERSGCEK.TECH",
            "HACKVERSE26@CBGCEK.DEV",
            "GCEK BHAWANIPATNA",
          ]}
          bg="accent"
        />
      </div>
    </div>
  );
}
