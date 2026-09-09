"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
import { SectionTitle } from "@/components/common/SectionTitle";
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
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon, WhatsappIcon } from "@/components/common/SocialIcons";
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
    <div className="flex flex-col min-h-screen bg-neo-bg w-full max-w-full overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10 sm:space-y-12 min-w-0"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER TITLE */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full">
          <SectionTitle
            tag="COMMUNICATION &amp; DISPATCH DESK"
            title="GET IN"
            highlightText="TOUCH"
            subtitle="Connect directly with our Technical Developers, Management Organizers, and Institutional In-Charge for hackathon queries, registrations, travel, and sponsorships."
          />
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: OFFICIAL EMAILS HUB (FEATURED CARDS) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="space-y-4 w-full max-w-full">
          <div className="flex items-center justify-between border-b-4 border-black pb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 stroke-[2.5px] text-black" />
              <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                OFFICIAL INBOXES &amp; MAIL DIRECTORY
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-black/60 hidden sm:inline-block">
              24/7 ACTIVE DISPATCH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OFFICIAL_EMAILS.map((inbox) => {
              const isCopied = copiedEmail === inbox.email;
              return (
                <div
                  key={inbox.id}
                  className={clsx(
                    "border-4 border-black bg-white p-5 sm:p-6 shadow-neo flex flex-col justify-between space-y-4 transition-all hover:translate-x-0.5 hover:translate-y-0.5",
                    inbox.primary && "relative overflow-hidden"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black shadow-neo-sm">
                        {inbox.badge}
                      </span>
                      {inbox.primary && (
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-neo-secondary text-black border border-black">
                          PRIMARY
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-sm uppercase tracking-tight text-black leading-snug">
                      {inbox.label}
                    </h4>

                    <div className="p-2.5 bg-neo-bg border-2 border-black font-mono text-xs font-black text-black break-all select-all flex items-center justify-between gap-2">
                      <span>{inbox.email}</span>
                    </div>

                    <p className="text-xs font-bold text-black/75 leading-relaxed">
                      {inbox.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2 border-t-2 border-black/10">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(inbox.email)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-neutral-100 border-2 border-black font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm hover:shadow-none transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                          <span className="text-emerald-700">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 stroke-[2.5px]" />
                          <span>COPY EMAIL</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`mailto:${inbox.email}?subject=${encodeURIComponent("Inquiry regarding HACKVERSE '26")}`}
                      className="py-2 px-3 bg-neo-secondary hover:bg-neo-accent border-2 border-black font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neo-sm hover:shadow-none transition-all"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 stroke-[2.5px] text-black" />
              <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                LEADERSHIP &amp; COORDINATOR DIRECTORY
              </h3>
            </div>

            {/* Category Filter Tabs */}
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
                      "px-3 py-1.5 border-2 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                      isActive
                        ? "bg-black text-white shadow-neo-sm"
                        : "bg-white text-black hover:bg-neo-secondary shadow-neo-sm hover:shadow-none"
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={clsx(
                        "font-mono text-[10px] px-1 py-0.2 border",
                        isActive ? "bg-neo-secondary text-black border-black" : "bg-neo-muted text-black border-black"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar for Directory */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black/60">
              <Search className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team by name, role, phone, or email (e.g. Subham, Ayushman, Rohan, Full-Stack, Logistics)..."
              className="w-full pl-10 pr-10 py-3 bg-white border-3 border-black font-bold text-xs sm:text-sm text-black placeholder:text-black/50 shadow-neo-sm focus:outline-none focus:bg-amber-50/50 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-black/60 hover:text-black font-black"
              >
                <X className="w-4 h-4 stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full border-4 border-black bg-white p-8 text-center shadow-neo space-y-3">
                <HelpCircle className="w-10 h-10 mx-auto text-black/60 stroke-[2px]" />
                <h4 className="font-black text-lg uppercase text-black">
                  NO TEAM MEMBERS MATCHED &quot;{searchQuery}&quot;
                </h4>
                <p className="text-xs font-bold text-black/70 max-w-sm mx-auto">
                  Try searching by first name, domain keyword, or reset the filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 bg-black text-white border-2 border-black font-black text-xs uppercase shadow-neo-sm"
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
                    className="border-4 border-black bg-white p-5 sm:p-6 shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={clsx(
                            "font-mono text-[10px] font-black uppercase px-2.5 py-0.5 border border-black shadow-neo-sm",
                            person.category === "technical"
                              ? "bg-neo-secondary text-black"
                              : person.category === "management"
                              ? "bg-neo-accent text-black"
                              : "bg-purple-300 text-black"
                          )}
                        >
                          {person.categoryLabel}
                        </span>

                        {person.featured && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-neo-secondary stroke-[2.5px]" />
                            <span>LEAD</span>
                          </span>
                        )}
                      </div>

                      {/* Header info */}
                      <div>
                        <h4 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-tight">
                          {person.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-black/75 mt-0.5">
                          {person.role}
                        </div>
                        <div className="text-[11px] font-bold text-black/60 mt-0.5">
                          {person.department}
                        </div>
                      </div>

                      {/* Bio */}
                      {person.bio && (
                        <p className="text-xs font-bold text-black/80 leading-relaxed border-l-3 border-black pl-3 py-0.5 bg-neutral-50">
                          {person.bio}
                        </p>
                      )}

                      {/* Contact Info Chips */}
                      <div className="space-y-2 pt-1 font-mono text-xs">
                        {/* Phone */}
                        <div className="flex items-center justify-between p-2 bg-neo-bg border-2 border-black">
                          <div className="flex items-center gap-2 truncate">
                            <Phone className="w-3.5 h-3.5 stroke-[2.5px] text-black shrink-0" />
                            <span className="font-black text-black">{person.displayPhone}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(person.phone, person.id)}
                            className="text-[10px] font-black uppercase underline hover:text-neo-accent shrink-0 ml-2 cursor-pointer"
                            title="Copy number"
                          >
                            {isPhoneCopied ? "COPIED!" : "COPY"}
                          </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between p-2 bg-neo-bg border-2 border-black">
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 stroke-[2.5px] text-black shrink-0" />
                            <span className="font-bold text-black truncate">{person.email}</span>
                          </div>
                          <a
                            href={`mailto:${person.email}`}
                            className="text-[10px] font-black uppercase underline hover:text-neo-accent shrink-0 ml-2"
                            title="Send email"
                          >
                            MAIL
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t-2 border-black/10">
                      <div className="flex items-center gap-2">
                        {/* Direct Call */}
                        <a
                          href={`tel:${person.phone}`}
                          className="px-3 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-neo-sm hover:shadow-none transition-all"
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
                            className="px-3 py-1.5 bg-emerald-300 hover:bg-emerald-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-neo-sm hover:shadow-none transition-all"
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
                            className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black transition-colors"
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
                            className="p-1.5 bg-white hover:bg-[#0077b5] hover:text-white border-2 border-black transition-colors"
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
          <div className="flex items-center gap-2 border-b-4 border-black pb-2">
            <MapPin className="w-5 h-5 stroke-[2.5px] text-black" />
            <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black">
              CAMPUS HEADQUARTERS, TRANSIT &amp; SUPPORT
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1: Campus Headquarters & Venue */}
            <div className="border-4 border-black bg-white p-6 shadow-neo flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-3 border-black pb-2.5">
                  <MapPin className="w-5 h-5 text-neo-accent stroke-[3px]" />
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-black">
                    CAMPUS HEADQUARTERS &amp; VENUE
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs font-bold text-black/85 leading-relaxed">
                  <div className="font-black text-sm text-black uppercase">
                    {VENUE_DETAILS.institution}
                  </div>
                  <div className="font-mono text-[11px] text-black/70">
                    {VENUE_DETAILS.department}
                  </div>
                  <p className="pt-1">
                    {VENUE_DETAILS.campus}, {VENUE_DETAILS.address}, {VENUE_DETAILS.city}, {VENUE_DETAILS.state} - {VENUE_DETAILS.pincode}
                  </p>
                </div>
              </div>

              <a
                href={VENUE_DETAILS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-black text-white hover:bg-neutral-800 border-3 border-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 stroke-[2.5px] text-neo-secondary" />
                <span>OPEN IN GOOGLE MAPS</span>
              </a>
            </div>

            {/* CARD 2: Transit & Connectivity */}
            <div className="border-4 border-black bg-white p-6 shadow-neo flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-3 border-black pb-2.5">
                  <Train className="w-5 h-5 text-black stroke-[2.5px]" />
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-black">
                    TRANSIT &amp; CONNECTIVITY
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-black/80">
                  <div>
                    <div className="font-black uppercase text-black flex items-center gap-1.5 mb-1 text-[11px]">
                      <Train className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>RAILWAY ACCESS:</span>
                    </div>
                    <ul className="space-y-1 pl-1 font-mono text-[11px]">
                      {VENUE_DETAILS.railwayStations.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-black font-black">▸</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t-2 border-black/10 pt-2">
                    <div className="font-black uppercase text-black flex items-center gap-1.5 mb-1 text-[11px]">
                      <Plane className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>AIRPORT ACCESS:</span>
                    </div>
                    <ul className="space-y-1 pl-1 font-mono text-[11px]">
                      {VENUE_DETAILS.airports.map((ap, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-black font-black">▸</span>
                          <span>{ap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-neo-bg border-2 border-black font-mono text-[11px] font-black text-black text-center">
                COLLEGE SHUTTLES AVAILABLE AT KESINGA (KSNG)
              </div>
            </div>

            {/* CARD 3: Common Questions & Community Hub */}
            <div className="border-4 border-black bg-neo-secondary p-6 shadow-neo flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-3 border-black pb-2.5">
                  <HelpCircle className="w-5 h-5 stroke-[2.5px] text-black" />
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-tight text-black">
                    FREQUENTLY ASKED QUESTIONS
                  </h4>
                </div>

                <p className="text-xs font-bold text-black/85 leading-relaxed">
                  Have questions about squad eligibility, cash prizes, food &amp; accommodation passes, or problem statement specifications? Check our live FAQ database.
                </p>

                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 bg-white border-2 border-black shadow-neo-sm">
                    <span className="font-bold text-black">COMMUNITY DISCORD</span>
                    <a
                      href={SOCIAL_CHANNELS.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[10px] uppercase underline hover:text-neo-accent"
                    >
                      JOIN SERVER ↗
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-white border-2 border-black shadow-neo-sm">
                    <span className="font-bold text-black flex items-center gap-1.5">
                      <WhatsappIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WHATSAPP DESK</span>
                    </span>
                    <a
                      href={SOCIAL_CHANNELS.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-[10px] uppercase underline hover:text-neo-accent"
                    >
                      CHAT GROUP ↗
                    </a>
                  </div>
                </div>
              </div>

              <Link
                href="/faqs"
                className="w-full py-3 bg-white hover:bg-black hover:text-white border-3 border-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-black"
              >
                <span>EXPLORE ALL FAQS</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Banner */}
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
  );
}
