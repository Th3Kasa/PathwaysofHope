"use client";

import { motion, type Variants } from "framer-motion";
import { Bell } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { useT } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function UpdatesPage() {
  const t = useT();

  return (
    <div className="bg-[#e7e5e4] min-h-[70vh]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-4 font-medium"
          >
            {t({ en: "From the field", ar: "من الميدان" })}
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}
            className="text-5xl sm:text-6xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Latest updates.", ar: "آخر المستجدّات." })}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#374151] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "News, milestones and progress from the Kapoeta Children's Shelter — straight from the people on the ground.",
              ar: "أخبار ومحطّات وتقدّم من ملجأ كاپويتا للأطفال — مباشرةً من القائمين على العمل في الميدان.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Empty state */}
      <section className="py-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#d6d3d1] shadow-sm p-8 sm:p-12 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mx-auto mb-5">
            <Bell size={22} className="text-[#6366f1]" strokeWidth={1.75} />
          </div>
          <h2
            className="text-2xl font-light text-[#1e293b] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "New updates are on the way.", ar: "مستجدّات جديدة في الطريق." })}
          </h2>
          <p className="text-[#6b7280] leading-relaxed mb-8">
            {t({
              en: "We're preparing the first field reports from Kapoeta. Check back soon — or be part of the next chapter today.",
              ar: "نُعِدّ أوّل التقارير الميدانية من كاپويتا. عُد قريبًا — أو كن جزءًا من الفصل القادم اليوم.",
            })}
          </p>
          <DonateButton size="lg">
            {t({ en: "Support the shelter", ar: "ادعم الملجأ" })}
          </DonateButton>
        </motion.div>
      </section>
    </div>
  );
}
