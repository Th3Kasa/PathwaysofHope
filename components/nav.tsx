"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { AnimatedNavigationTabs } from "@/components/ui/animated-navigation-tabs";

const NAV_LINKS = [
  { id: "home",         href: "/",            label: { en: "Home",         ar: "الرئيسية"  } },
  { id: "missions",     href: "/missions",     label: { en: "Missions",     ar: "مهامنا"    } },
  { id: "about",        href: "/about",        label: { en: "About",        ar: "من نحن"    } },
  { id: "governance",   href: "/governance",   label: { en: "Governance",   ar: "الحوكمة"  } },
  { id: "transparency", href: "/financials",   label: { en: "Transparency", ar: "الشفافية" } },
];

const GIVE_NOW = { en: "Give Now", ar: "تبرّع الآن" };

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabItems = NAV_LINKS.map((l) => ({ id: l.id, href: l.href, label: t(l.label) }));

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(253,250,246,0.96)"
          : "linear-gradient(to bottom, rgba(28,20,16,0.55) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #d6d3d1" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/logo.png"
              alt="Pathways of Hope"
              width={52}
              height={52}
              className="object-contain drop-shadow-sm"
              priority
            />
            <span
              className="text-lg font-semibold tracking-tight transition-colors duration-300 drop-shadow-sm"
              style={{
                fontFamily: "var(--font-serif)",
                color: scrolled ? "#374151" : "#ffffff",
              }}
            >
              Pathways of Hope
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <AnimatedNavigationTabs
              items={tabItems}
              activeHref={pathname}
              scrolled={scrolled}
            />
            <Link
              href="/donate"
              className="ml-3 inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors duration-200 shadow-sm flex-shrink-0"
            >
              {t(GIVE_NOW)}
            </Link>
            <div className="ml-1">
              <LanguageToggle scrolled={scrolled} />
            </div>
          </nav>

          {/* Mobile: language toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle scrolled={scrolled} />
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: scrolled ? "#374151" : "#ffffff" }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
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
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-[#d6d3d1] bg-[#e7e5e4]"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {NAV_LINKS.map((l) => {
                const isActive =
                  pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#6366f1]/10 text-[#6366f1]"
                        : "text-[#374151] hover:text-[#6366f1] hover:bg-[#f5f5f4]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {t(l.label)}
                  </Link>
                );
              })}
              <Link
                href="/donate"
                className="mt-2 inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors"
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
