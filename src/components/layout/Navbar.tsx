"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Celebrations", href: "/home#moments" },
    { name: "Facilities", href: "/facilities" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <>
      <header className="fixed top-3 md:top-5 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-5xl bg-black/65 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full p-2 pl-4 md:pl-6 pr-2 md:pr-2.5 flex items-center justify-between isolate">
          
          {/* Left: Brand Logo & Title */}
          <Link href="/home" className="flex items-center gap-3 group shrink-0 py-1 min-h-[40px]">
            <div className="relative w-8 h-8 md:w-9 md:h-9 shrink-0 flex items-center justify-center isolate" aria-hidden="true">
              <Image
                src="/images/logo.png"
                alt=""
                fill
                sizes="36px"
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span className="text-white font-sans font-medium text-base md:text-lg tracking-tight isolate">
              Murali Resort
            </span>
          </Link>

          {/* Right: Desktop Navigation Links + Enquire Now Button */}
          <div className="hidden lg:flex items-center gap-7 shrink-0 pr-0.5">
            <nav aria-label="Desktop Navigation" className="flex items-center gap-7 text-sm font-medium text-white isolate">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === "/home#moments" && (pathname === "/home" || pathname === "/")) {
                        const el = document.getElementById("moments");
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                    className={clsx(
                      "py-2 inline-flex items-center min-h-[40px] transition-colors drop-shadow-sm whitespace-nowrap isolate",
                      isActive ? "text-[#F5EBE0] font-semibold underline underline-offset-8 decoration-[#c5a880]" : "text-white hover:text-stone-300"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-white text-[#14171A] border border-white text-xs tracking-widest uppercase font-semibold hover:bg-stone-200 transition-all duration-300 shadow-sm hover:shadow-md shrink-0 whitespace-nowrap isolate"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile & Tablet View Controls */}
          <div className="lg:hidden flex items-center gap-2 pr-1">
            <Link
              href="/contact"
              className="px-4 py-1.5 rounded-full bg-white text-[#14171A] border border-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-200 transition-colors shadow-sm isolate"
            >
              Enquire
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-stone-300 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile & Tablet Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Menu Drawer Card */}
      {isMobileMenuOpen && (
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (link.href === "/home#moments" && (pathname === "/home" || pathname === "/")) {
                      document.getElementById("moments")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={clsx(
                    "py-3.5 border-b border-white/10 transition-colors",
                    isActive ? "text-[#F5EBE0] font-semibold underline underline-offset-8 decoration-[#c5a880]" : "hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
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
