"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  LogOut,
  Shield,
  User as UserIcon,
  ChevronDown,
  FileCode2,
  BookOpen,
  ClipboardList,
  FileText,
  Presentation,
  Building2,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { HEADER_UPDATES } from "@/data/updates";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user as { name?: string; email?: string; image?: string; role?: string } | undefined;
  const isAdmin = user?.role === "admin";
  const [isProblemStatementsPublished, setIsProblemStatementsPublished] = useState<boolean>(false);

  // Fetch live system settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.settings) {
          if (typeof data.settings.isProblemStatementsPublished === "boolean") {
            setIsProblemStatementsPublished(data.settings.isProblemStatementsPublished);
          }
        }
      } catch (err) {
        console.error("Failed to load settings in Navbar:", err);
      }
    }
    loadSettings();
  }, [pathname]);

  // Primary navigation links
  const navLinks = [
    { label: "ABOUT", href: "/about" },
    {
      label: "PROBLEM STATEMENTS",
      badge: !isProblemStatementsPublished ? "SOON" : undefined,
      href: "/problem-statements",
    },
    {
      label: "DOCUMENTS",
      href: "/documents",
    },
    { label: "GUIDELINES", href: "/guidelines" },
    { label: "SCHEDULE", href: "/schedule" },
    { label: "FAQS", href: "/faqs" },
    { label: "TEAM", href: "/team" },
    { label: "CONTACT", href: "/contact" },
  ];

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userDropdownOpen]);

  // Handle ESC key to close menus and lock body/Lenis scroll when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (userDropdownOpen) setUserDropdownOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, userDropdownOpen]);

  const headerRef = useRef<HTMLElement>(null);
  const [hideOnMobile, setHideOnMobile] = useState(false);

  // Detect when footer reaches navbar position on mobile to hide the navbar smoothly
  useEffect(() => {
    const handleFooterIntersection = () => {
      // Only apply hiding behavior on mobile screens (< 1024px)
      if (typeof window === "undefined" || window.innerWidth >= 1024) {
        setHideOnMobile(false);
        return;
      }

      const footer = document.getElementById("main-footer") || document.querySelector("footer");
      if (!footer || !headerRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const headerHeight = headerRef.current.offsetHeight || 104;

      // When the top of the footer reaches the bottom edge of the sticky navbar
      if (footerRect.top <= headerHeight + 5) {
        setHideOnMobile(true);
      } else {
        setHideOnMobile(false);
      }
    };

    window.addEventListener("scroll", handleFooterIntersection, { passive: true });
    window.addEventListener("resize", handleFooterIntersection, { passive: true });

    if (typeof window !== "undefined" && (window as any).__lenis) {
      (window as any).__lenis.on("scroll", handleFooterIntersection);
    }

    handleFooterIntersection();

    return () => {
      window.removeEventListener("scroll", handleFooterIntersection);
      window.removeEventListener("resize", handleFooterIntersection);
      if (typeof window !== "undefined" && (window as any).__lenis) {
        (window as any).__lenis.off("scroll", handleFooterIntersection);
      }
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setUserDropdownOpen(false);
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Do not render public Navbar on admin dashboard (called after all hooks to comply with React rules)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

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
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header
        ref={headerRef}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 w-full max-w-full bg-neo-bg border-b-4 border-black shadow-neo-sm transition-transform duration-300 ease-in-out",
          hideOnMobile && !mobileMenuOpen && "-translate-y-full lg:translate-y-0 opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
        )}
      >
        {/* Top Header Marquee: Live Updates */}
        <div className="w-full max-w-full bg-black text-white border-b-2 border-black flex items-center text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase overflow-hidden h-8 select-none">
          <div className="shrink-0 bg-neo-secondary text-black px-2.5 sm:px-3 h-full flex items-center gap-1.5 font-black z-10 border-r-2 border-black shadow-neo-sm text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            <span>LIVE UPDATES</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0 flex items-center">
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

        {/* Main Navbar Bar */}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
          {/* Brand / Logo */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black shrink-0"
              aria-label="CodeBreakers Tech Fest Home"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 rounded-xl shadow-neo-sm bg-white">
                <Image
                  src="/cbhack.png"
                  alt="CB Hackathon"
                  width={36}
                  height={36}
                  priority
                  className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-thuast text-lg sm:text-2xl tracking-tighter text-black leading-none">
                  HACKVERSE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Primary Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0"
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
                    "px-2 xl:px-2.5 py-1.5 font-black text-[11px] xl:text-xs uppercase tracking-wider transition-colors duration-100 border-2 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0",
                    isActive
                      ? "bg-neo-secondary border-black text-black shadow-neo-sm"
                      : "border-transparent text-black hover:border-black hover:bg-white hover:shadow-neo-sm"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-black border border-black font-mono text-[9px] font-black shadow-neo-xs animate-pulse whitespace-nowrap">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side CTA & User Dropdown */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={clsx(
                    "h-12 px-3.5 bg-white text-black border-3 border-black shadow-neo-sm hover:bg-neo-secondary transition-all flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-black",
                    userDropdownOpen && "bg-neo-secondary shadow-inner"
                  )}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 border-2 border-black object-cover rounded-none"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-neo-secondary border-2 border-black flex items-center justify-center font-mono font-black text-xs">
                      {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="font-black text-xs uppercase max-w-[120px] truncate leading-tight">
                      {user.name || "MY SQUAD"}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-black/60 leading-none">
                      {isAdmin ? "ADMIN" : "CONTESTANT"}
                    </span>
                  </div>
                  <ChevronDown
                    className={clsx(
                      "w-4 h-4 stroke-[3px] transition-transform duration-200",
                      userDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown Menu Modal */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-white border-4 border-black shadow-neo-lg z-50 overflow-hidden"
                    >
                      {/* Dropdown User Header */}
                      <div className="p-4 bg-neo-bg border-b-3 border-black">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-10 h-10 border-2 border-black object-cover rounded-none shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center font-mono font-black text-sm shrink-0">
                              {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <div className="font-black text-sm uppercase text-black truncate">
                              {user.name || "AUTHENTICATED"}
                            </div>
                            <div className="font-mono text-[10px] text-black/70 truncate">
                              {user.email}
                            </div>
                            <span
                              className={clsx(
                                "inline-block font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-black mt-1",
                                isAdmin ? "bg-rose-500 text-white" : "bg-neo-secondary text-black"
                              )}
                            >
                              {isAdmin ? "ORGANIZER ADMIN" : "VERIFIED SQUAD"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <div className="p-2 flex flex-col gap-1 text-xs font-black uppercase">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="p-2.5 bg-rose-100 hover:bg-rose-200 border-2 border-black flex items-center gap-2.5 text-rose-950 transition-colors"
                          >
                            <Shield className="w-4 h-4 stroke-[2.5px] text-rose-600" />
                            <span>ADMIN COMMAND CONSOLE</span>
                          </Link>
                        )}

                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="p-2.5 hover:bg-neo-secondary border-2 border-transparent hover:border-black flex items-center gap-2.5 transition-colors text-black"
                        >
                          <ClipboardList className="w-4 h-4 stroke-[2.5px]" />
                          <span>SQUAD REGISTRATION</span>
                        </Link>

                        {/* Problem Statement Link (Switches between Live Selection and Coming Soon) */}
                        {isProblemStatementsPublished ? (
                          <>
                            <Link
                              href="/register/ps"
                              onClick={() => setUserDropdownOpen(false)}
                              className="p-2.5 bg-amber-50 hover:bg-neo-secondary border-2 border-black flex items-center gap-2.5 transition-colors text-black shadow-neo-sm"
                            >
                              <FileCode2 className="w-4 h-4 stroke-[2.5px] text-amber-700" />
                              <div className="flex flex-col text-left">
                                <span>SELECT 2 PROBLEM STATEMENTS</span>
                                <span className="text-[9px] font-mono font-bold text-black/60">PREFERENCE 1 &amp; PREFERENCE 2</span>
                              </div>
                            </Link>

                            <Link
                              href="/problem-statements"
                              onClick={() => setUserDropdownOpen(false)}
                              className="p-2.5 hover:bg-neo-secondary border-2 border-transparent hover:border-black flex items-center gap-2.5 transition-colors text-black"
                            >
                              <FileCode2 className="w-4 h-4 stroke-[2.5px]" />
                              <span>ALL PROBLEM SPECS</span>
                            </Link>
                          </>
                        ) : (
                          <Link
                            href="/problem-statements"
                            onClick={() => setUserDropdownOpen(false)}
                            className="p-2.5 bg-amber-50 hover:bg-neo-secondary border-2 border-black flex items-center gap-2.5 transition-colors text-black shadow-neo-sm"
                          >
                            <FileCode2 className="w-4 h-4 stroke-[2.5px] text-amber-700" />
                            <div className="flex flex-col text-left">
                              <span className="flex items-center gap-1.5">
                                <span>PROBLEM STATEMENTS</span>
                                <span className="bg-amber-300 text-black text-[9px] font-mono font-black px-1.5 py-0.2 border border-black">COMING SOON</span>
                              </span>
                              <span className="text-[9px] font-mono font-bold text-black/60">UNDER EMBARGO • RELEASING SOON</span>
                            </div>
                          </Link>
                        )}

                        <Link
                          href="/guidelines"
                          onClick={() => setUserDropdownOpen(false)}
                          className="p-2.5 hover:bg-neo-secondary border-2 border-transparent hover:border-black flex items-center gap-2.5 transition-colors text-black"
                        >
                          <BookOpen className="w-4 h-4 stroke-[2.5px]" />
                          <span>RULEBOOK &amp; GUIDELINES</span>
                        </Link>
                      </div>

                      {/* Dropdown Footer Logout Button */}
                      <div className="p-2 border-t-3 border-black bg-neutral-50">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full p-2.5 bg-white hover:bg-rose-500 hover:text-white border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <LogOut className="w-4 h-4 stroke-[2.5px]" />
                          <span>LOGOUT OF SESSION</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/register"
                className="h-12 px-6 inline-flex items-center gap-2 bg-neo-accent text-black font-black text-sm uppercase tracking-wider border-4 border-black shadow-neo hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black"
              >
                <span>REGISTER</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button - Only 3-bar menu on mobile */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className="w-11 h-11 bg-white border-3 border-black shadow-neo-sm flex items-center justify-center text-black active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus:bg-neo-secondary cursor-pointer"
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
              className="lg:hidden border-t-4 border-black bg-white px-4 sm:px-6 pt-5 pb-10 flex flex-col gap-2.5 shadow-neo-lg max-h-[calc(100dvh-105px)] overflow-y-auto overscroll-contain touch-pan-y"
            >
              {/* User Identity & Actions Card (Inside 3-bar menu only) */}
              {user ? (
                <div className="p-3.5 bg-neo-bg border-3 border-black flex flex-col gap-3 shadow-neo-sm mb-2">
                  <div className="flex items-center justify-between gap-2 border-b-2 border-black/20 pb-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User Avatar"}
                          width={38}
                          height={38}
                          unoptimized
                          className="w-10 h-10 border-2 border-black object-cover rounded-none shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-neo-secondary border-2 border-black flex items-center justify-center font-mono font-black text-sm shrink-0">
                          {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="font-black text-sm uppercase text-black leading-tight truncate">
                          {user.name || "AUTHENTICATED SQUAD"}
                        </div>
                        <div className="font-mono text-[10px] font-bold text-black/60 truncate">
                          {user.email}
                        </div>
                        <span
                          className={clsx(
                            "inline-block font-mono text-[9px] font-black uppercase px-1.5 py-0.2 border border-black mt-0.5",
                            isAdmin ? "bg-rose-500 text-white" : "bg-neo-secondary text-black"
                          )}
                        >
                          {isAdmin ? "ORGANIZER ADMIN" : "LOGGED IN USER"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white border-2 border-black font-black text-[10px] uppercase shrink-0 flex items-center gap-1 shadow-neo-sm cursor-pointer"
                      title="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>LOGOUT</span>
                    </button>
                  </div>

                  {/* Problem Statement Selection / Coming Soon direct link */}
                  {isProblemStatementsPublished ? (
                    <Link
                      href="/register/ps"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full p-2.5 bg-amber-200 hover:bg-neo-secondary border-2 border-black font-black text-xs uppercase flex items-center justify-between text-black shadow-neo-sm transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-amber-950 stroke-[2.5px] shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="leading-tight">SELECT 2 PROBLEM STATEMENTS</span>
                          <span className="font-mono text-[9px] font-bold text-black/60">CHOICE #1 &amp; #2</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 stroke-[3px] shrink-0" />
                    </Link>
                  ) : (
                    <Link
                      href="/problem-statements"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full p-2.5 bg-amber-200 hover:bg-neo-secondary border-2 border-black font-black text-xs uppercase flex items-center justify-between text-black shadow-neo-sm transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-amber-950 stroke-[2.5px] shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="leading-tight flex items-center gap-1.5">
                            <span>PROBLEM STATEMENTS</span>
                            <span className="bg-black text-white text-[8px] font-mono px-1 py-0.2">SOON</span>
                          </span>
                          <span className="font-mono text-[9px] font-bold text-black/60">COMING SOON // EMBARGO</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 stroke-[3px] shrink-0" />
                    </Link>
                  )}

                  {/* Squad Dossier & Registration link */}
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full p-2 bg-white hover:bg-neutral-100 border-2 border-black font-black text-xs uppercase flex items-center justify-between text-black shadow-neo-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 stroke-[2.5px] shrink-0" />
                      <span>SQUAD REGISTRATION &amp; DOSSIER</span>
                    </div>
                    <ArrowRight className="w-4 h-4 stroke-[3px] shrink-0" />
                  </Link>
                </div>
              ) : null}

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
                      "px-3.5 py-2.5 border-2 border-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between transition-all",
                      isActive
                        ? "bg-neo-secondary shadow-neo-sm text-black"
                        : "bg-neo-bg hover:bg-neutral-100 text-black"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 bg-amber-400 text-black border border-black font-mono text-[9px] font-black shadow-neo-xs animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-black text-black/50">
                      0{idx + 1}
                    </span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t-2 border-black/20 mt-1">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-12 bg-rose-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    <Shield className="w-4 h-4 stroke-[2.5px]" />
                    <span>OPEN ADMIN CONSOLE</span>
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-12 bg-neo-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 border-black shadow-neo flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    <span>{user ? "MANAGE SQUAD ENTRY" : "REGISTER SQUAD NOW"}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3px]" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so page content below fixed navbar starts at the exact correct vertical offset */}
      <div className="h-[104px] sm:h-[112px] w-full shrink-0" aria-hidden="true" />
    </>
  );
}
