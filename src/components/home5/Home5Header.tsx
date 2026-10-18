"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Home5Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Celebrations", href: "/celebrations" },
    { name: "Facilities", href: "/facilities" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <>
      {/* Top subtle vignette gradient overlay (fades out smoothly on scroll) */}
      <div 
        aria-hidden="true"
        className={`fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/25 to-transparent pointer-events-none z-40 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`} 
      />

      {/* Main Single Continuous Header Wrapper */}
      <header
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled || mobileMenuOpen
            ? "top-2.5 md:top-5 px-3 sm:px-4"
            : "top-0 px-3.5 sm:px-6 md:px-12 py-3.5 sm:py-5"
        }`}
      >
        {/* Single Unified Capsule Container that morphs smoothly */}
        <div
          className={`w-full relative isolate flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled || mobileMenuOpen
              ? "max-w-5xl bg-black/65 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full p-1.5 sm:p-2 pl-3 sm:pl-4 md:pl-6 pr-1.5 sm:pr-2 md:pr-2.5"
              : "max-w-7xl bg-transparent border-transparent shadow-none rounded-none py-0 px-0"
          }`}
        >
          {/* Left: Brand Logo & Title */}
          <Link href="/home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Murali Resort Emblem"
                fill
                sizes="(max-width: 768px) 36px, 44px"
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span
                className={`text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled || mobileMenuOpen
                    ? "font-sans font-semibold text-sm sm:text-base md:text-lg tracking-tight"
                    : "font-serif text-sm sm:text-base md:text-xl font-medium tracking-[0.06em] sm:tracking-[0.1em] uppercase group-hover:text-[#c5a880]"
                }`}
              >
                Murali Resort
              </span>
              <span
                className={`text-xs tracking-wider text-stone-300 font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                  isScrolled || mobileMenuOpen ? "h-0 opacity-0" : "h-3.5 sm:h-4 opacity-100"
                }`}
              >
                Convention Center
              </span>
            </div>
          </Link>

          {/* 
            Center Navigation (State 1: Unscrolled)
            Guaranteed exact mathematical center between the left and right edges ("same length from right and left")
          */}
          <nav
            aria-label="Primary Center Navigation"
            className={`hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 isolate text-xs uppercase tracking-[0.22em] font-medium text-stone-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "opacity-0 -translate-y-2 pointer-events-none scale-95"
                : "opacity-100 translate-y-0 pointer-events-auto scale-100"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.href === "/celebrations" ? (e) => e.preventDefault() : undefined}
                className="hover:text-[#c5a880] transition-colors drop-shadow"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 
            Right Group (State 2: Scrolled Links + Enquire Button)
          */}
          <div className="hidden lg:flex items-center gap-7 shrink-0 pr-0.5">
            {/* Scrolled Right-Side Links: smoothly slides & fades in */}
            <nav
              aria-label="Scrolled Secondary Navigation"
              className={`flex items-center gap-7 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isScrolled
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-4 pointer-events-none"
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={link.href === "/celebrations" ? (e) => e.preventDefault() : undefined}
                  className="hover:text-stone-300 transition-colors drop-shadow-sm whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Enquire Now Button — crisp premium white */}
            <Link
              href="/contact"
              className="btn-primary-light shrink-0 whitespace-nowrap"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile & Tablet View Controls */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3 pr-0.5 sm:pr-1 shrink-0">
            <Link
              href="/contact"
              className="btn-primary-light shrink-0 whitespace-nowrap"
            >
              <span>Enquire</span>
              <span className="hidden sm:inline"> Now</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon text-white hover:text-stone-300 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed top-20 md:top-24 left-4 right-4 z-50 bg-[#0C0F12]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <nav className="flex flex-col gap-1 text-sm uppercase tracking-widest font-medium text-stone-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href === "/celebrations") {
                      e.preventDefault();
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "py-3.5 border-b border-white/10 transition-colors",
                    isActive ? "text-accent font-semibold" : "hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "py-3.5 transition-colors",
                pathname === "/contact" ? "text-accent font-semibold" : "hover:text-white"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
