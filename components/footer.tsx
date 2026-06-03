"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useT, type Dict } from "@/lib/i18n";

const NAV_LINKS: { href: string; label: Dict<string> }[] = [
  { href: "/", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/missions/kapoeta", label: { en: "Kapoeta Shelter", ar: "ملجأ كاپويتا" } },
  { href: "/impact", label: { en: "Impact", ar: "الأثر" } },
  { href: "/about", label: { en: "About Us", ar: "من نحن" } },
  { href: "/governance", label: { en: "Governance", ar: "الحوكمة" } },
  { href: "/financials", label: { en: "Transparency", ar: "الشفافية" } },
  { href: "/faq", label: { en: "FAQ", ar: "الأسئلة الشائعة" } },
  { href: "/donate", label: { en: "Give Now", ar: "تبرّع الآن" } },
];

const PROMISES: Dict<string>[] = [
  { en: "100% of donations reach the children", ar: "100% من التبرّعات تصل إلى الأطفال" },
  { en: "All travel costs self-funded by volunteers", ar: "المتطوّعون يموّلون كل نفقات سفرهم بأنفسهم" },
  { en: "Registered charity — donations tax-deductible", ar: "جمعية مسجّلة — التبرّعات معفاة من الضرائب" },
  { en: "Full financial transparency on request", ar: "شفافية مالية كاملة عند الطلب" },
  { en: "Led by Brother Hakim — on the ground in Kapoeta", ar: "بقيادة الأخ حكيم — في الميدان بكاپويتا" },
];

export function Footer() {
  const t = useT();
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
                {t({ en: "Pathways of Hope", ar: "دروب الأمل" })}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#9A8578] mb-4">
              {t({
                en: "A faith-driven charity partnering with local leaders to bring safety, dignity, and a future to children in South Sudan.",
                ar: "جمعية خيرية يحرّكها الإيمان، تشارك القادة المحليين لتوفير الأمان والكرامة ومستقبلٍ لأطفال جنوب السودان.",
              })}
            </p>
            <p className="text-xs text-[#6B5A52]">Pathways of Hope Ltd · ABN 40 686 574 630</p>
            <p className="text-xs text-[#6B5A52] mt-1">
              {t({
                en: "Registered with the ACNC · Public company limited by guarantee",
                ar: "مسجّلة لدى ACNC · شركة عامة محدودة بالضمان",
              })}
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              {t({ en: "Navigate", ar: "تصفّح" })}
            </h3>
            <nav className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#9A8578] hover:text-white transition-colors duration-200"
                >
                  {t(l.label)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Our Promise */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
              {t({ en: "Our Promise", ar: "وعدنا" })}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-[#9A8578]">
              {PROMISES.map((item) => (
                <li key={item.en} className="flex items-start gap-2">
                  <span className="text-[#C9952A] mt-0.5 flex-shrink-0">✓</span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2C1F18] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5A52]">
          <span>
            © {new Date().getFullYear()} {t({ en: "Pathways of Hope. All rights reserved.", ar: "دروب الأمل. جميع الحقوق محفوظة." })}
          </span>
          <div className="flex items-center gap-5">
            <Link href="/faq" className="hover:text-[#C4AE9A] transition-colors duration-200">
              {t({ en: "FAQ", ar: "الأسئلة الشائعة" })}
            </Link>
            <Link href="/privacy" className="hover:text-[#C4AE9A] transition-colors duration-200">
              {t({ en: "Privacy", ar: "الخصوصية" })}
            </Link>
            <Link href="/donate" className="hover:text-[#C4AE9A] transition-colors duration-200">
              {t({ en: "Donate", ar: "تبرّع" })}
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
