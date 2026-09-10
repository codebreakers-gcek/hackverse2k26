"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { officialIncharges, coreLeads, clubLeads } from "@/data/teamData";
import { TeamCategory, TeamMember } from "@/types/team";
import { SectionTitle } from "@/components/common/SectionTitle";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import {
  Users,
  Sparkles,
  Quote,
  Copy,
  Check,
  Globe,
  ArrowRight,
  Crown,
  Code2,
  Mail,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/common/SocialIcons";
import clsx from "clsx";

// Helper to get crystal clear high-DPI Cloudinary image URLs
function getOptimizedImageUrl(url: string, width = 800) {
  if (!url) return url;
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    if (url.includes("/image/upload/f_") || url.includes("/image/upload/q_") || url.includes("/image/upload/w_")) {
      return url;
    }
    return url.replace("/image/upload/", `/image/upload/f_auto,q_auto:best,w_${width},c_limit/`);
  }
  return url;
}

export function TeamContent() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleCopyEmail = (email: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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
        className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16 min-w-0"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER & INTRO */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full">
          <SectionTitle
            tag="THE CREW // CODEBREAKERS GCEK"
            title="MEET THE"
            highlightText="TEAM"
            subtitle="The visionary academic patrons, student leaders, and technical architects driving HACKVERSE '26 and shaping the innovation culture at GCEK."
          />
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: CATEGORY FILTER TABS */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-full">
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white border-4 border-black shadow-neo no-scrollbar select-none w-full sm:w-auto max-w-full">
            {[
              { id: "all", label: "ALL SQUAD", count: officialIncharges.length + coreLeads.length + clubLeads.length },
              { id: "officials", label: "FACULTY PATRONS", count: officialIncharges.length },
              { id: "club", label: "CO-ORDINATORS", count: clubLeads.length },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as TeamCategory)}
                  className={clsx(
                    "px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0",
                    isActive
                      ? "bg-black text-white shadow-neo-sm"
                      : "bg-white text-black hover:bg-neo-secondary shadow-neo-sm hover:shadow-none"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={clsx(
                      "font-mono text-[10px] px-1.5 py-0.2 border",
                      isActive
                        ? "bg-neo-secondary text-black border-black"
                        : "bg-neo-muted text-black border-black"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 3: OFFICIAL IN-CHARGES & PATRONS */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "officials") && (
          <motion.div variants={itemVariants} className="space-y-6 w-full max-w-full">
            <div className="flex items-center justify-between border-b-4 border-black pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-500 stroke-[2.5px]" />
                <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                  HON&apos;BLE PATRONS &amp; FACULTY ADVISORS
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-black/60 hidden sm:inline-block">
                ACADEMIC &amp; INSTITUTIONAL GOVERNANCE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {officialIncharges.map((official) => {
                const hasError = imageErrors[official.id];
                return (
                  <div
                    key={official.id}
                    className="border-4 border-black bg-white p-4 sm:p-6 shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between space-y-6 relative overflow-hidden w-full max-w-full"
                  >
                    {/* Top Accent Strip */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neo-secondary/20 rounded-full blur-xl pointer-events-none" />

                    <div className="space-y-4">
                      {/* Portrait Frame */}
                      <div
                        className="relative w-full aspect-4/3 sm:aspect-square border-4 border-black bg-neutral-100 overflow-hidden shadow-neo-sm group"
                        style={{
                          transform: "translateZ(0)",
                          isolation: "isolate",
                        }}
                      >
                        {!hasError ? (
                          <img
                            src={getOptimizedImageUrl(official.image, 800)}
                            alt={official.name}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300 select-none"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              transform: "translate3d(0, 0, 0)",
                              imageRendering: "auto",
                            }}
                            onError={() => handleImageError(official.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neo-secondary text-black p-4 text-center">
                            <Crown className="w-12 h-12 stroke-[2px] mb-2" />
                            <span className="font-black text-sm uppercase">{official.name}</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black text-white font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-neo-sm">
                          {official.id.toUpperCase()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <span className="font-mono text-[11px] font-black uppercase px-2.5 py-0.5 bg-neo-secondary text-black border border-black inline-block shadow-neo-sm">
                          {official.designation}
                        </span>
                        <h4 className="font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-snug pt-1">
                          {official.name}
                        </h4>
                        <div className="font-mono text-xs font-bold text-black/70">
                          {official.role}
                        </div>
                        <div className="text-[11px] font-bold text-black/50">
                          {official.department}
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="p-3 bg-neo-bg border-2 border-black relative">
                        <Quote className="w-4 h-4 text-black/30 stroke-[3px] mb-1" />
                        <p className="text-xs font-bold text-black/85 italic leading-relaxed">
                          &quot;{official.quote}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between font-mono text-[11px] font-black text-black">
                      <span>GOVT. COLLEGE OF ENGINEERING KALAHANDI</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}


        {/* ========================================================================= */}
        {/* SECTION 5: DOMAIN & CLUB HEADS */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "club") && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-black stroke-[2.5px]" />
                <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                  MANAGEMENT &amp; TECHNICAL EXECUTIVES
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-black/60 hidden sm:inline-block">
                SYSTEMS, PR, EVENTS &amp; DEV OPERATIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubLeads.map((member, idx) => (
                <MemberCard
                  key={idx}
                  member={member}
                  copiedEmail={copiedEmail}
                  onCopyEmail={handleCopyEmail}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: JOIN THE SQUAD / CALL TO ACTION */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants}>
          <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-neo space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-neo-secondary/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-white border-2 border-black inline-block">
                  [COMMUNITY &amp; COLLABORATION]
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  WANT TO COLLABORATE WITH CODEBREAKERS?
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/75 max-w-xl">
                  Whether you are looking to sponsor HACKVERSE &apos;26, deliver a technical workshop, or connect with our student developer community, reach out to our team desks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-3.5 bg-neo-secondary hover:bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 stroke-[3px]" />
                  <span>CONTACT CREW DIRECTLY</span>
                </Link>
                <Link
                  href="/register"
                  className="px-5 sm:px-6 py-3.5 bg-black text-white hover:bg-neutral-800 font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span>REGISTER FOR HACKVERSE</span>
                  <ArrowRight className="w-4 h-4 stroke-[3px]" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Banner */}
      <MarqueeBanner
        items={[
          "CODEBREAKERS GCEK CREW",
          "HACKVERSE '26 ARCHITECTS",
          "STUDENT-LED INNOVATION",
          "BHAWANIPATNA ODISHA",
          "BREAK CODE • FORGE REALITY",
        ]}
        bg="secondary"
      />
    </div>
  );
}

// Subcomponent for Member Cards
function MemberCard({
  member,
  copiedEmail,
  onCopyEmail,
}: {
  member: TeamMember;
  copiedEmail: string | null;
  onCopyEmail: (email: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isCopied = member.email && copiedEmail === member.email;

  return (
    <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-neo hover:shadow-neo-lg transition-all flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Avatar Frame with custom border color accent */}
        <div
          className="relative w-full aspect-square border-4 border-black bg-neutral-100 overflow-hidden shadow-neo-sm group"
          style={{
            transform: "translateZ(0)",
            isolation: "isolate",
          }}
        >
          {!imgError ? (
            <img
              src={getOptimizedImageUrl(member.image, 800)}
              alt={member.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 select-none"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translate3d(0, 0, 0)",
                imageRendering: "auto",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-black"
              style={{ backgroundColor: member.borderColor || "#FFD93D" }}
            >
              <Users className="w-12 h-12 stroke-[2px] mb-2 text-black" />
              <span className="text-sm uppercase text-black">{member.title}</span>
            </div>
          )}

          {/* Top-right handle pill */}
          <div className="absolute top-2 right-2 bg-black text-white font-mono text-[10px] font-black px-2 py-0.5 border border-black shadow-neo-sm">
            {member.handle}
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-1">
          {member.subtitle && (
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-neo-sm text-black"
                style={{ backgroundColor: member.borderColor || "#FFD93D" }}
              >
                {member.subtitle}
              </span>
            </div>
          )}

          <h4 className="font-black text-lg text-black uppercase tracking-tight leading-tight pt-1">
            {member.title}
          </h4>

          {/* Email if available */}
          {member.email && (
            <div className="pt-1.5 flex items-center justify-between p-2 bg-neo-bg border-2 border-black font-mono text-[11px]">
              <span className="font-bold text-black truncate">{member.email}</span>
              <button
                type="button"
                onClick={() => onCopyEmail(member.email!)}
                className="text-[10px] font-black uppercase underline hover:text-neo-accent shrink-0 ml-2 cursor-pointer flex items-center gap-1"
                title="Copy email address"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700 stroke-[3px]" />
                    <span className="text-emerald-700">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 stroke-[2.5px]" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Social Links & Action Row */}
      <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {member.socials?.github && member.socials.github !== "#" && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white hover:bg-black hover:text-white border-2 border-black transition-colors"
              aria-label={`${member.title} GitHub`}
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}

          {member.socials?.linkedin && member.socials.linkedin !== "#" && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white hover:bg-[#0077b5] hover:text-white border-2 border-black transition-colors"
              aria-label={`${member.title} LinkedIn`}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}

          {member.socials?.instagram && member.socials.instagram !== "#" && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white hover:bg-[#E1306C] hover:text-white border-2 border-black transition-colors"
              aria-label={`${member.title} Instagram`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Portfolio / Profile URL button if available */}
        {member.socials?.website && member.socials.website.length > 0 ? (
          <a
            href={member.socials.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-white hover:bg-neo-secondary border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-neo-sm hover:shadow-none transition-all"
          >
            <span>PORTFOLIO</span>
            <Globe className="w-3 h-3 stroke-[2.5px]" />
          </a>
        ) : member.url && member.url.length > 0 ? (
          <a
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-white hover:bg-neo-secondary border-2 border-black font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-neo-sm hover:shadow-none transition-all"
          >
            <span>PROFILE</span>
            <Globe className="w-3 h-3 stroke-[2.5px]" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
