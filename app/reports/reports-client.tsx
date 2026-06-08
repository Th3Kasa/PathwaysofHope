"use client";

import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import { useT } from "@/lib/i18n";

interface ReportItem {
  id: string;
  title: string;
  year: string;
  url: string;
  uploadedAt: string;
}

export function ReportsClient({ reports }: { reports: ReportItem[] }) {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 sm:py-24 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
            {t({ en: "Transparency", ar: "الشفافية" })}
          </p>
          <h1
            className="text-[2rem] sm:text-5xl font-light text-[#1e293b] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Annual reports", ar: "التقارير السنوية" })}
          </h1>
          <p className="text-[#6b7280] text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
            {t({
              en: "Our annual reports and financial statements, free to download. We believe in full transparency for every supporter who walks this path with us.",
              ar: "تقاريرنا السنوية وبياناتنا المالية، متاحة للتنزيل مجانًا. نؤمن بالشفافية الكاملة لكل داعمٍ يسلك هذا الدرب معنا.",
            })}
          </p>
        </motion.div>

        {reports.length > 0 ? (
          <ul className="space-y-3">
            {reports.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-white border border-[#d6d3d1] px-5 py-4 hover:border-[#6366f1] hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[#6366f1]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-[#1e293b] truncate">{r.title}</p>
                    <p className="text-xs text-[#6b7280]">{r.year}</p>
                  </div>
                  <Download size={18} className="text-[#6b7280] group-hover:text-[#6366f1] transition-colors flex-shrink-0" />
                </a>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-white border border-[#d6d3d1] px-6 py-12 text-center">
            <FileText size={28} className="text-[#9ca3af] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-[#6b7280]">
              {t({
                en: "No reports have been published yet. Please check back soon.",
                ar: "لم تُنشر أي تقارير بعد. يُرجى التحقّق لاحقًا.",
              })}
            </p>
            <p className="text-sm text-[#9ca3af] mt-2">
              {t({
                en: "For financial information in the meantime, email pathways_of_hope@outlook.com.",
                ar: "للحصول على المعلومات المالية في هذه الأثناء، راسلنا على pathways_of_hope@outlook.com.",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
