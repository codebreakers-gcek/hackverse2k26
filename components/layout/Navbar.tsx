"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Terminal } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Primary navigation links strictly requested
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT", href: "/about" },
    { label: "PROBLEM STATEMENTS", href: "/problem-statements" },
    { label: "GUIDELINES / RULES", href: "/guidelines" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-neo-bg border-b-4 border-black">
      {/* Top micro-bar: High-contrast alert indicator */}
      <div className="bg-black text-white px-4 py-1 flex items-center justify-between text-[11px] font-mono font-bold tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span>GOVT. COLLEGE OF ENGINEERING KALAHANDI // CSE CODEBREAKERS</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-neo-secondary">NATIONAL TECH FEST & HACKATHON 2026</span>
          <span className="text-neutral-400">OCT 16-18</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
          aria-label="CodeBreakers Tech Fest Home"
        >
          <div className="w-12 h-12 bg-neo-secondary border-4 border-black flex items-center justify-center shadow-neo-sm group-hover:bg-neo-accent group-hover:rotate-6 transition-all duration-150">
            <Terminal className="w-7 h-7 text-black stroke-[3px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl sm:text-2xl tracking-tighter text-black leading-none group-hover:text-neo-accent transition-colors">
              CODEBREAKERS
            </span>
            <span className="font-mono text-[10px] font-black tracking-widest text-black/70 mt-0.5">
              HACKVERSE &apos;26 // GCEK
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3.5 py-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-100 border-2",
                  isActive
                    ? "bg-neo-secondary border-black text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]"
                    : "border-transparent text-black hover:border-black hover:bg-white hover:shadow-neo-sm"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side CTA: Register button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-12 px-6 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
          >
            <span>REGISTER</span>
            <ArrowRight className="w-4 h-4 stroke-[3px]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="h-10 px-3 bg-neo-accent text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-neo-sm flex items-center"
          >
            REGISTER
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="w-11 h-11 bg-white border-3 border-black shadow-neo-sm flex items-center justify-center text-black active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus:bg-neo-secondary"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[3px]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[3px]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-label="Mobile Navigation"
          className="md:hidden border-t-4 border-black bg-white px-6 py-8 flex flex-col gap-3 shadow-neo-lg animate-in slide-in-from-top duration-150"
        >
          {navLinks.map((link, idx) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "px-4 py-3.5 border-3 border-black font-black text-base uppercase tracking-wider flex items-center justify-between transition-all",
                  isActive
                    ? "bg-neo-secondary shadow-neo-sm text-black"
                    : "bg-neo-bg hover:bg-neutral-100 text-black"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{link.label}</span>
                <span className="font-mono text-xs font-black text-black/50">
                  0{idx + 1}
                </span>
              </Link>
            );
          })}

          <div className="pt-4 border-t-2 border-black/20 mt-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-14 bg-neo-accent text-black font-black text-base uppercase tracking-wider border-4 border-black shadow-neo flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <span>REGISTER SQUAD NOW</span>
              <ArrowRight className="w-5 h-5 stroke-[3px]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
