"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-black">
      {/* Fixed Minecraft Background Layer with Full Clarity */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/minecraft/teambg.webp"
          alt="Hackverse Team Background"
          fill
          priority
          unoptimized
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
        className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16 min-w-0"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: HEADER & INTRO */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="w-full max-w-full flex justify-center">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-3xl">
            <span className="font-mono text-xs sm:text-sm font-black uppercase px-3.5 py-1 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
              ★ THE CREW // CODEBREAKERS GCEK ★
            </span>

            <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight [text-shadow:_3px_3px_0_#000,_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000]">
              MEET THE{" "}
              <span className="inline-block bg-[#FFAA00] text-black px-2.5 sm:px-3 py-0.5 border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] -rotate-1 [text-shadow:none]">
                TEAM CREW
              </span>
            </h1>

            <div className="bg-[#1B1B1B]/90 backdrop-blur-sm border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] px-4 sm:px-6 py-2.5 shadow-[4px_4px_0px_#000]">
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#EAEAEA] font-mono leading-relaxed">
                The visionary academic patrons, student leaders, and technical architects driving HACKVERSE &apos;26 and shaping the innovation culture at GCEK.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 2: CATEGORY FILTER TABS (Minecraft 3D Buttons) */}
        {/* ========================================================================= */}
        <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-full">
          <div className="flex flex-wrap items-center justify-center gap-2.5 select-none w-full sm:w-auto max-w-full">
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
                    "font-mono font-black text-xs uppercase tracking-wider px-4 py-2.5 border-4 transition-all cursor-pointer flex items-center gap-2",
                    isActive
                      ? "bg-[#5B8731] hover:bg-[#689B37] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_2px_2px_0_#000]"
                      : "bg-[#707070] hover:bg-[#808080] text-white border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]"
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
        </motion.div>

        {/* ========================================================================= */}
        {/* SECTION 3: OFFICIAL IN-CHARGES & PATRONS */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "officials") && (
          <motion.div variants={itemVariants} className="space-y-6 w-full max-w-full">
            <div className="flex items-center justify-between bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFAA00] stroke-[2.5px]" />
                <h3 className="font-mono font-black text-base sm:text-xl uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
                  HON&apos;BLE PATRONS &amp; FACULTY ADVISORS
                </h3>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#55FFFF] hidden sm:inline-block [text-shadow:_1px_1px_0_#000]">
                ★ ACADEMIC &amp; INSTITUTIONAL GOVERNANCE ★
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {officialIncharges.map((official) => {
                const hasError = imageErrors[official.id];
                return (
                  <div
                    key={official.id}
                    className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-5 relative overflow-hidden w-full max-w-full"
                  >
                    <div className="space-y-4">
                      {/* Portrait Frame (Minecraft Dark Slot) */}
                      <div
                        className="relative w-full aspect-4/3 sm:aspect-square bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] overflow-hidden shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7)] group"
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
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[#2B2B2B] text-white p-4 text-center">
                            <Crown className="w-12 h-12 stroke-[2px] mb-2 text-[#FFAA00]" />
                            <span className="font-mono font-black text-sm uppercase text-white">{official.name}</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black text-[#55FFFF] font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-[#55FFFF] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
                          {official.id.toUpperCase()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFAA00] text-black border-2 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] inline-block shadow-[2px_2px_0px_#000]">
                          {official.designation}
                        </span>
                        <h4 className="font-mono font-black text-lg sm:text-xl text-black uppercase tracking-tight leading-snug pt-1">
                          {official.name}
                        </h4>
                        <div className="font-mono text-xs font-black text-[#2A2A2A]">
                          {official.role}
                        </div>
                        <div className="font-mono text-[11px] font-bold text-[#444444]">
                          {official.department}
                        </div>
                      </div>

                      {/* Quote (Minecraft Inset Slab) */}
                      <div className="p-3 bg-[#8B8B8B] border-3 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] relative shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
                        <Quote className="w-4 h-4 text-black/40 stroke-[3px] mb-1" />
                        <p className="font-mono text-xs font-bold text-white [text-shadow:_1px_1px_0_#000] italic leading-relaxed">
                          &quot;{official.quote}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t-2 border-[#8B8B8B] flex items-center justify-between font-mono text-[10px] font-black text-black/80">
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
            <div className="flex items-center justify-between bg-[#1B1B1B]/90 backdrop-blur-sm px-4 py-2.5 border-3 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] shadow-[4px_4px_0px_#000]">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#55FF55] stroke-[2.5px]" />
                <h3 className="font-mono font-black text-base sm:text-xl uppercase tracking-tight text-white [text-shadow:_2px_2px_0_#000]">
                  MANAGEMENT &amp; TECHNICAL EXECUTIVES
                </h3>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#55FFFF] hidden sm:inline-block [text-shadow:_1px_1px_0_#000]">
                ★ SYSTEMS, PR, EVENTS &amp; DEV OPERATIONS ★
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
          <div className="bg-[#1B1B1B]/95 backdrop-blur-md border-4 border-t-[#4A4A4A] border-l-[#4A4A4A] border-r-[#0D0D0D] border-b-[#0D0D0D] p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 bg-black text-[#55FF55] border-2 border-[#55FF55] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] inline-block">
                  [COMMUNITY &amp; COLLABORATION]
                </span>
                <h3 className="font-mono font-black text-2xl sm:text-3xl text-white uppercase tracking-tight [text-shadow:_2px_2px_0_#000]">
                  WANT TO COLLABORATE WITH CODEBREAKERS?
                </h3>
                <p className="font-mono text-xs sm:text-sm font-bold text-[#CCCCCC] max-w-xl leading-relaxed">
                  Whether you are looking to sponsor HACKVERSE &apos;26, deliver a technical workshop, or connect with our student developer community, reach out to our team desks.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                <Link
                  href="/contact"
                  className="px-5 sm:px-6 py-3 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2 [text-shadow:_2px_2px_0_#000]"
                >
                  <Mail className="w-4 h-4 stroke-[3px]" />
                  <span>CONTACT CREW DIRECTLY</span>
                </Link>
                <Link
                  href="/register"
                  className="px-5 sm:px-6 py-3 bg-[#FFAA00] hover:bg-[#FFC040] text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] shadow-[4px_4px_0px_#000] active:translate-y-1 transition-all flex items-center justify-center gap-2"
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
      <div className="relative z-10">
        <MarqueeBanner
          items={[
            "CODEBREAKERS GCEK CREW",
            "HACKVERSE '26 ARCHITECTS",
            "STUDENT-LED INNOVATION",
            "BHABANIPATNA ODISHA",
            "BREAK CODE • FORGE REALITY",
          ]}
          bg="secondary"
        />
      </div>
    </div>
  );
}

// Subcomponent for Member Cards (Minecraft Stone GUI Slab)
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
    <div className="bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] p-4 sm:p-5 shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        {/* Avatar Frame (Minecraft Dark Inset Slot) */}
        <div
          className="relative w-full aspect-square bg-[#2B2B2B] border-4 border-t-[#151515] border-l-[#151515] border-r-[#4F4F4F] border-b-[#4F4F4F] overflow-hidden shadow-[inset_3px_3px_6px_rgba(0,0,0,0.7)] group"
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
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-black bg-[#2B2B2B] text-white">
              <Users className="w-12 h-12 stroke-[2px] mb-2 text-[#55FF55]" />
              <span className="font-mono text-sm uppercase text-white">{member.title}</span>
            </div>
          )}

          {/* Top-right handle pill */}
          <div className="absolute top-2 right-2 bg-black text-[#55FFFF] font-mono text-[10px] font-black px-2 py-0.5 border border-[#55FFFF] shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
            {member.handle}
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-1.5">
          {member.subtitle && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#55FF55] text-black border-2 border-t-[#9EFF9E] border-l-[#9EFF9E] border-r-[#1B801B] border-b-[#1B801B] shadow-[2px_2px_0px_#000]">
                {member.subtitle}
              </span>
            </div>
          )}

          <h4 className="font-mono font-black text-base sm:text-lg text-black uppercase tracking-tight leading-tight pt-0.5">
            {member.title}
          </h4>

          {/* Email if available (Minecraft Inset Slot) */}
          {member.email && (
            <div className="pt-1 flex items-center justify-between p-2 bg-[#8B8B8B] border-2 border-t-[#373737] border-l-[#373737] border-r-[#DBDBDB] border-b-[#DBDBDB] font-mono text-[11px] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]">
              <span className="font-bold text-white [text-shadow:_1px_1px_0_#000] truncate">{member.email}</span>
              <button
                type="button"
                onClick={() => onCopyEmail(member.email!)}
                className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#5B8731] hover:bg-[#689B37] text-white border border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] cursor-pointer flex items-center gap-1 shadow-[1px_1px_0px_#000] ml-2 shrink-0 [text-shadow:_1px_1px_0_#000]"
                title="Copy email address"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-[#55FFFF] stroke-[3px]" />
                    <span className="text-[#55FFFF]">COPIED</span>
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
      <div className="pt-2 border-t-2 border-[#8B8B8B] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {member.socials?.github && member.socials.github !== "#" && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#707070] hover:bg-[#808080] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors"
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
              className="p-1.5 bg-[#707070] hover:bg-[#0077b5] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors"
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
              className="p-1.5 bg-[#707070] hover:bg-[#E1306C] text-white border-2 border-t-[#9E9E9E] border-l-[#9E9E9E] border-r-[#383838] border-b-[#383838] shadow-[2px_2px_0px_#000] transition-colors"
              aria-label={`${member.title} Instagram`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Portfolio / Profile URL button (Minecraft 3D Button) */}
        {member.socials?.website && member.socials.website.length > 0 ? (
          <a
            href={member.socials.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-[#5B8731] hover:bg-[#689B37] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-all"
          >
            <span>PORTFOLIO</span>
            <Globe className="w-3 h-3 stroke-[2.5px]" />
          </a>
        ) : member.url && member.url.length > 0 ? (
          <a
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-[#5B8731] hover:bg-[#689B37] text-white border-2 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000] transition-all"
          >
            <span>PROFILE</span>
            <Globe className="w-3 h-3 stroke-[2.5px]" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

