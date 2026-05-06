"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/missions", label: "Missions" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FDFAF6]/95 backdrop-blur-sm border-b border-[#DDD0C0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image
              src="/images/kapoeta/logo.jpg"
              alt="Pathways of Hope logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-serif)", color: "var(--terracotta-dark)" }}
            >
              Pathways of Hope
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#3D2B1F] hover:text-[#B85C38] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors"
            >
              Give Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#3D2B1F]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#DDD0C0] bg-[#FDFAF6]">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-base font-medium text-[#3D2B1F] hover:text-[#B85C38] transition-colors py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors"
              onClick={() => setOpen(false)}
            >
              Give Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
