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
    <footer id="main-footer" className="bg-neo-secondary border-t-8 border-black text-black pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Club & Fest Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center shadow-neo-sm overflow-hidden p-1 shrink-0">
                <img
                  src="/cbhack.png"
                  alt="HACKVERSE '26 Main Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-12 h-12 bg-black text-white border-3 border-black flex items-center justify-center shadow-neo-sm overflow-hidden p-1 shrink-0">
                <img
                  src="/cblogo.png"
                  alt="CodeBreakers Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight leading-tight">
                  HACKVERSE &apos;26
                </h3>
                <p className="font-mono text-xs font-bold text-black/80">
                  CODEBREAKERS // GCEK
                </p>
              </div>
            </div>

            <p className="text-sm font-bold leading-relaxed">
              The premier coding and technical society of Government College of Engineering Kalahandi. Fostering hackathon culture, competitive programming, and engineering excellence since 2019.
            </p>

            <a
              href={ENV.OFFICIAL_CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase underline decoration-2 hover:text-neo-accent transition-colors"
            >
              <span>VISIT OFFICIAL CLUB PORTAL</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3px]" />
            </a>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-black text-base uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              NAVIGATION
            </h4>
            <ul className="space-y-2 font-bold text-sm">
              <li>
                <Link href="/" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>About HACKVERSE &amp; GCEK</span>
                </Link>
              </li>
              <li>
                <Link href="/problem-statements" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Problem Statements</span>
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Documents</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Guidelines &amp; Regulations</span>
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Event Schedule</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Contact &amp; Dispatch Desk</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline flex items-center gap-2">
                  <span>▸</span> <span>Registration Pass</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Venue & Contact */}
          <div className="space-y-4">
            <h4 className="font-black text-base uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              VENUE &amp; DISPATCH
            </h4>
            <div className="space-y-3 font-bold text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 shrink-0 stroke-[3px] mt-0.5" />
                <p className="leading-snug">
                  {EVENT_DATA.location.campus}, {EVENT_DATA.location.venue}, {EVENT_DATA.location.city}, {EVENT_DATA.location.state} - {EVENT_DATA.location.postalCode}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 shrink-0 stroke-[3px]" />
                <a
                  href={`mailto:${ENV.CONTACT_EMAIL}`}
                  className="font-mono text-xs underline hover:text-neo-accent transition-colors"
                >
                  {ENV.CONTACT_EMAIL}
                </a>
              </div>

              <div className="bg-white border-3 border-black p-3 shadow-neo-sm text-xs">
                <div className="font-black uppercase mb-1">EMERGENCY HELPLINE:</div>
                <div className="font-mono font-bold">+91 8895220675</div>
              </div>
            </div>
          </div>

          {/* Col 4: Socials & Open Source */}
          <div className="space-y-4">
            <h4 className="font-black text-base uppercase tracking-wider border-b-4 border-black pb-2 inline-block">
              COMMUNITY RADAR
            </h4>
            <p className="text-sm font-bold leading-relaxed">
              Connect with 500+ active student builders and alumni mentors across our official channels.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={EVENT_DATA.organizer.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodeBreakers GitHub"
                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm hover:bg-black hover:text-white transition-all"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={EVENT_DATA.organizer.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodeBreakers LinkedIn"
                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm hover:bg-[#0077b5] hover:text-white transition-all"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={EVENT_DATA.organizer.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodeBreakers Instagram"
                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm hover:bg-[#E1306C] hover:text-white transition-all"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={EVENT_DATA.organizer.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodeBreakers Twitter"
                className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm hover:bg-black hover:text-white transition-all"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>

            <div className="border-t-2 border-black/20 pt-4">
              <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-1">
                STATUS: 100% REGISTRATION READY
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t-4 border-black pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-mono text-[11px] sm:text-xs font-bold text-black/90 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} CODEBREAKERS GCEK. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span>ENGINEERED WITH</span>
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-neo-accent text-neo-accent inline" />
            <span>BY CODEBREAKERS STUDENT COMMUNITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
