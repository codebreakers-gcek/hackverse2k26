"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, ExternalLink, Heart, MapPin, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from "@/components/common/SocialIcons";
import { ENV } from "@/config/env";
import { EVENT_DATA } from "@/data/event";

export function Footer() {
  const pathname = usePathname();

  // Do not show footer in dashboard/admin section
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="main-footer" className="relative z-20 bg-gradient-to-b from-[#1e1327] via-[#110a19] to-[#07040b] text-white pt-16 pb-10 border-t-4 border-black overflow-hidden">
      {/* Outer Container with Mobs Individually on Left and Right */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 xl:gap-12">

          {/* ========================================================================= */}
          {/* LEFT: Hostile Mobs (Enderman, Spider, Zombie, Creeper, Skeleton)          */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex shrink-0 w-[220px] xl:w-[270px] 2xl:w-[310px] self-end justify-start pointer-events-none select-none">
            <img
              src="/minecraft/minecraft_hostile_mob.png"
              alt="Minecraft Hostile Mobs"
              className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
              loading="lazy"
            />
          </div>

          {/* ========================================================================= */}
          {/* CENTER: Clean Content Layout (No Div Box Cards, Pure Typography)          */}
          {/* ========================================================================= */}
          <div className="flex-1 w-full max-w-6xl mx-auto py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">

              {/* Col 1: Club & Fest Branding */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/5 border border-white/15 rounded p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/cbhack.png"
                      alt="HACKVERSE '26 Main Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-11 h-11 bg-white/5 border border-white/15 rounded p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/cblogo.png"
                      alt="CodeBreakers Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tight text-white leading-tight">
                      HACKVERSE &apos;26
                    </h3>
                    <p className="font-mono text-xs font-semibold text-neutral-400">
                      CODEBREAKERS // GCEK
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  The premier coding and technical society of Government College of Engineering Kalahandi. Fostering hackathon culture, competitive programming, and engineering excellence since 2019.
                </p>

                <div>
                  <a
                    href={ENV.OFFICIAL_CLUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white underline underline-offset-4 decoration-neutral-600 hover:decoration-white transition-colors"
                  >
                    <span>VISIT OFFICIAL CLUB PORTAL</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5px]" />
                  </a>
                </div>
              </div>

              {/* Col 2: Navigation Links */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300 border-b border-white/10 pb-2">
                  NAVIGATION
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-xs font-medium text-neutral-400">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About HACKVERSE" },
                    { href: "/problem-statements", label: "Problems" },
                    { href: "/documents", label: "Documents" },
                    { href: "/guidelines", label: "Guidelines" },
                    { href: "/schedule", label: "Schedule" },
                    { href: "/faqs", label: "FAQs" },
                    { href: "/team", label: "Organizing Team" },
                    { href: "/contact", label: "Contact Desk" },
                    { href: "/register", label: "Registration Pass" },
                  ].map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-neutral-600 text-[10px]">▸</span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Event Venue & Contact */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300 border-b border-white/10 pb-2">
                  VENUE &amp; DISPATCH
                </h4>
                <div className="space-y-3 text-xs text-neutral-400">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 shrink-0 text-neutral-300 mt-0.5" />
                    <p className="leading-snug">
                      {EVENT_DATA.location.campus}, {EVENT_DATA.location.venue}, {EVENT_DATA.location.city}, {EVENT_DATA.location.state} - {EVENT_DATA.location.postalCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 shrink-0 text-neutral-300" />
                    <a
                      href={`mailto:${ENV.CONTACT_EMAIL}`}
                      className="font-mono text-xs text-neutral-300 hover:text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-white transition-colors break-all"
                    >
                      {ENV.CONTACT_EMAIL}
                    </a>
                  </div>

                  <div className="pt-1">
                    <div className="font-mono text-[11px] font-bold text-neutral-400 uppercase">
                      EMERGENCY HELPLINE:
                    </div>
                    <div className="font-mono text-xs font-bold text-white tracking-wider">
                      +91 9438-CODE-GCEK
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 4: Community & Socials */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-neutral-300 border-b border-white/10 pb-2">
                  COMMUNITY RADAR
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Connect with 500+ active student builders and alumni mentors across our official channels.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={EVENT_DATA.organizer.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="CodeBreakers GitHub"
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center justify-center"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={EVENT_DATA.organizer.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="CodeBreakers LinkedIn"
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center justify-center"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={EVENT_DATA.organizer.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="CodeBreakers Instagram"
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center justify-center"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={EVENT_DATA.organizer.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="CodeBreakers Twitter"
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white transition-all flex items-center justify-center"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: Hero Squad (Steve, Alex, Friendly Animals, Companion Creeper)      */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex shrink-0 w-[240px] xl:w-[290px] 2xl:w-[330px] self-end justify-end pointer-events-none select-none">
            <img
              src="/minecraft/minecraft_group_mob.png"
              alt="Minecraft Survivor Squad"
              className="w-full h-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
              loading="lazy"
            />
          </div>

        </div>

        {/* Mobile/Tablet Mobs Display (visible below lg screen width) */}
        <div className="lg:hidden flex items-end justify-between max-w-md mx-auto pt-8 px-4 pointer-events-none select-none">
          <img
            src="/minecraft/minecraft_hostile_mob.png"
            alt="Minecraft Hostile Mobs"
            className="w-28 sm:w-36 h-auto object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            loading="lazy"
          />
          <img
            src="/minecraft/minecraft_group_mob.png"
            alt="Minecraft Survivor Squad"
            className="w-32 sm:w-40 h-auto object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            loading="lazy"
          />
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-[11px] sm:text-xs font-normal text-neutral-400">
          <div>
            © {new Date().getFullYear()} CODEBREAKERS GCEK. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span>ENGINEERED WITH</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            <span>BY CODEBREAKERS STUDENT COMMUNITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
