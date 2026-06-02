"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

const links = [
  { href: "/", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/missions", label: { en: "Missions", ar: "مهامنا" } },
  { href: "/impact", label: { en: "Impact", ar: "الأثر" } },
  { href: "/about", label: { en: "About", ar: "من نحن" } },
  { href: "/governance", label: { en: "Governance", ar: "الحوكمة" } },
  { href: "/financials", label: { en: "Transparency", ar: "الشفافية" } },
];

const GIVE_NOW = { en: "Give Now", ar: "تبرّع الآن" };

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(253,250,246,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #DDD0C0" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image
              src="/logo.png"
              alt="Pathways of Hope logo — tree with children"
              width={40}
              height={40}
              className="object-contain"
            />
            <span
              className="text-lg font-semibold tracking-tight transition-colors duration-300"
              style={{
                fontFamily: "var(--font-serif)",
                color: scrolled ? "#3D2B1F" : "#ffffff",
              }}
            >
              Pathways of Hope
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: scrolled ? "#3D2B1F" : "rgba(255,255,255,0.9)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B85C38")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled ? "#3D2B1F" : "rgba(255,255,255,0.9)")
                }
              >
                {t(l.label)}
              </Link>
            ))}
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors duration-200"
            >
              {t(GIVE_NOW)}
            </Link>
            <LanguageToggle scrolled={scrolled} />
          </nav>

          {/* Mobile: language toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle scrolled={scrolled} />
            <button
              className="p-2 transition-colors duration-300"
              style={{ color: scrolled ? "#3D2B1F" : "#ffffff" }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="md:hidden border-t border-[#DDD0C0] bg-[#FDFAF6]"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-base font-medium text-[#3D2B1F] hover:text-[#B85C38] transition-colors py-1"
                  onClick={() => setOpen(false)}
                >
                  {t(l.label)}
                </Link>
              ))}
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors"
                onClick={() => setOpen(false)}
              >
                {t(GIVE_NOW)}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
