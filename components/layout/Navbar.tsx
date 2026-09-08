"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Terminal } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { HEADER_UPDATES } from "@/data/updates";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Primary navigation links strictly requested
  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "PROBLEM STATEMENTS", href: "/problem-statements" },
    { label: "GUIDELINES / RULES", href: "/guidelines" },
    { label: "EVENT FORMAT", href: "/event-format" },
    { label: "SCHEDULE", href: "/schedule" },
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

  // Track scroll position to blur header background on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Outside Content Blur Overlay when Mobile Menu is Open */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header
        className={clsx(
          "sticky top-0 z-50 w-full border-b-4 border-black transition-all duration-200",
          isScrolled
            ? "bg-neo-bg/85 backdrop-blur-md shadow-neo-sm"
            : "bg-neo-bg"
        )}
      >
        {/* Top Header Marquee: Live Updates (Flowing Right to Left) */}
        <div className="bg-black text-white border-b-2 border-black flex items-center text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase overflow-hidden h-8 select-none">
          <div className="shrink-0 bg-neo-secondary text-black px-3 h-full flex items-center gap-1.5 font-black z-10 border-r-2 border-black shadow-neo-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            <span>LIVE UPDATES</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap flex-1 flex items-center">
            <div className="animate-marquee-header flex items-center gap-8">
              {[...HEADER_UPDATES, ...HEADER_UPDATES].map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-6">
                  <span>{item}</span>
                  <span className="text-neo-secondary font-black">★</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navbar Bar with Smooth Scroll Collapse */}
        <div
          className={clsx(
            "mx-auto flex items-center transition-all duration-300 ease-out",
            isScrolled
              ? "max-w-5xl px-4 sm:px-6 h-16 justify-between md:justify-center md:gap-6 lg:gap-8"
              : "w-full px-4 sm:px-6 md:px-8 lg:px-10 h-20 justify-between"
          )}
        >
          {/* Brand / Logo (Left end initially, glides smoothly near menus on scroll) */}
          <div className="shrink-0 flex items-center transition-all duration-300">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black shrink-0"
              aria-label="CodeBreakers Tech Fest Home"
            >
              <div
                className={clsx(
                  "flex items-center justify-center border-2 rounded-xl shadow-neo-sm transition-all duration-300",
                  isScrolled ? "w-10 h-10" : "w-12 h-12"
                )}
              >
                <Image
                  src="/cbhack.png"
                  alt="CB Hackathon"
                  width={isScrolled ? 34 : 40}
                  height={isScrolled ? 34 : 40}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-thuast text-xl sm:text-2xl tracking-tighter text-black leading-none">
                  HACKVERSE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Primary Navigation */}
          <nav
            className={clsx(
              "hidden md:flex items-center transition-all duration-300",
              isScrolled
                ? "gap-1 lg:gap-1.5 shrink-0"
                : "gap-1 lg:gap-2 flex-1 justify-center"
            )}
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
                    "px-3 py-1.5 sm:px-3.5 sm:py-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-colors duration-100 border-2",
                    isActive
                      ? "bg-neo-secondary border-black text-black shadow-neo-sm"
                      : "border-transparent text-black hover:border-black hover:bg-white hover:shadow-neo-sm"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side CTA: Register button (Right end initially, glides smoothly near menus on scroll) */}
          <div className="hidden md:flex items-center shrink-0 transition-all duration-300">
            <Link
              href="/register"
              className={clsx(
                "inline-flex items-center gap-2 bg-neo-accent text-black font-black uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black",
                isScrolled ? "h-10 px-5 text-xs" : "h-12 px-6 text-sm"
              )}
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-label="Mobile Navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="md:hidden border-t-4 border-black bg-white px-6 py-8 flex flex-col gap-3 shadow-neo-lg overflow-hidden"
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
