"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="bg-[#1C1410] text-[#C4AE9A] mt-auto relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Gold accent line */}
      <div className="h-[2px] w-full bg-[#C9952A]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Pathways of Hope logo"
                width={40}
                height={40}
                className="object-contain opacity-90"
              />
              <span
                className="text-white text-lg font-semibold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Pathways of Hope
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#9A8578] mb-4">
              A faith-driven charity partnering with local leaders to bring
              safety, dignity, and a future to children in South Sudan.
            </p>
            <p className="text-xs text-[#6B5A52]">Pathways of Hope Ltd · ABN 40 686 574 630</p>
            <p className="text-xs text-[#6B5A52] mt-1">Registered with the ACNC · Public company limited by guarantee</p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Navigate
            </h3>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/missions", label: "Missions" },
                { href: "/missions/kapoeta", label: "Kapoeta Shelter" },
                { href: "/about", label: "About Us" },
                { href: "/governance", label: "Governance" },
                { href: "/financials", label: "Transparency" },
                { href: "/donate", label: "Give Now" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#9A8578] hover:text-white transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Our Promise */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              Our Promise
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9A8578]">
              {[
                "100% of donations reach the children",
                "All travel costs self-funded by volunteers",
                "Registered charity — donations tax-deductible",
                "Full financial transparency on request",
                "Led by Brother Hakim — on the ground in Kapoeta",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C9952A] mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2C1F18] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5A52]">
          <span>© {new Date().getFullYear()} Pathways of Hope. All rights reserved.</span>
          <span className="text-[#9A8578] font-medium">100% of donations reach the children</span>
          <Link href="/donate" className="hover:text-[#C4AE9A] transition-colors duration-200">
            Donate
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
