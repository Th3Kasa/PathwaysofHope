"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Receipt, Target } from "lucide-react";
import { DELIVERED, DELIVERED_TOTAL, KAPOETA_GOALS } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// Real monthly operating statements from the field (Triple L Orphanage).
const MONTHLY: { period: Dict<string>; total: number; lines: { item: Dict<string>; amount: number }[] }[] = [
  {
    period: { en: "July 2025", ar: "July 2025" },
    total: 4160,
    lines: [
      { item: { en: "Matron (Mrs Jackie) salary", ar: "راتب المربّية (السيدة Jackie)" }, amount: 240 },
      { item: { en: "Evangelist (Mr Simon) salary", ar: "راتب المبشّر (السيد Simon)" }, amount: 160 },
      { item: { en: "Cook", ar: "الطاهي" }, amount: 160 },
      { item: { en: "Food materials", ar: "مواد غذائية" }, amount: 2400 },
      { item: { en: "School shoes", ar: "أحذية مدرسية" }, amount: 200 },
      { item: { en: "Flour for the bakery", ar: "دقيق للمخبز" }, amount: 1000 },
    ],
  },
  {
    period: { en: "March 2026", ar: "March 2026" },
    total: 7560,
    lines: [
      { item: { en: "Staff salaries (matron, evangelist, cook)", ar: "رواتب العاملين (المربّية، المبشّر، الطاهي)" }, amount: 560 },
      { item: { en: "Food materials", ar: "مواد غذائية" }, amount: 1280 },
      { item: { en: "School expenses", ar: "مصاريف مدرسية" }, amount: 1600 },
      { item: { en: "Medication", ar: "أدوية" }, amount: 80 },
      { item: { en: "Building materials (gravel, sand, cement, iron)", ar: "مواد بناء (حصى، رمل، أسمنت، حديد)" }, amount: 2540 },
      { item: { en: "Workmanship (partial payment)", ar: "أجور العمالة (دفعة جزئية)" }, amount: 1500 },
    ],
  },
];

export default function FinancialsPage() {
  const t = useT();
  const goalsTotal = KAPOETA_GOALS.reduce((s, g) => s + g.goalAmount, 0);

  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            {t({ en: "Transparency", ar: "الشفافية" })}
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Where every dollar goes.", ar: "إلى أين يذهب كل دولار." })}
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "We keep the books open. Here is what your giving has already built, what the shelter spends each month, and what we are raising for next.",
              ar: "نُبقي دفاترنا مفتوحة. هذا ما بناه عطاؤك بالفعل، وما يُنفقه الملجأ كل شهر، وما نجمع التبرّعات من أجله تاليًا.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Headline numbers */}
      <section className="py-16 px-4 bg-[#1C1410]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "A$85,000", label: { en: "Raised in the 2024 opening campaign", ar: "جُمعت في حملة الافتتاح عام 2024" } },
            { value: formatAUDFull(DELIVERED_TOTAL), label: { en: "Already delivered on the ground", ar: "أُنجزت بالفعل على أرض الواقع" } },
            { value: "100%", label: { en: "Of donations reach the field", ar: "من التبرّعات تصل إلى الميدان" } },
          ].map((s) => (
            <motion.div key={s.label.en} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
              <div className="text-3xl sm:text-4xl font-light mb-2" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>{s.value}</div>
              <div className="text-xs text-[#9A8578] uppercase tracking-wider leading-snug">{t(s.label)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Already delivered */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Already delivered", ar: "أُنجزت بالفعل" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({
                en: `${formatAUDFull(DELIVERED_TOTAL)} turned into a real home.`,
                ar: `${formatAUDFull(DELIVERED_TOTAL)} تحوّلت إلى بيتٍ حقيقي.`,
              })}
            </h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {DELIVERED.map((d) => (
              <motion.div key={d.title} variants={fadeUp} className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#EDD9B4] px-5 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#C9952A] flex-shrink-0" strokeWidth={2} />
                  <span className="text-[#3D2B1F] text-sm leading-snug">{d.title}</span>
                </div>
                <span className="text-sm font-semibold text-[#1C1410] tabular-nums flex-shrink-0">{formatAUDFull(d.amount)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Monthly operating statements */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Monthly operations", ar: "التشغيل الشهري" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "Real statements from the field.", ar: "بيانات حقيقية من الميدان." })}
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-2xl">
              {t({
                en: "Each month, the team in Kapoeta sends an itemised expense statement. Two recent examples:",
                ar: "كل شهر، يرسل الفريق في كاپويتا بيانًا مفصّلًا بالنفقات بندًا بندًا. وهذان مثالان حديثان:",
              })}
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {MONTHLY.map((m) => (
              <motion.div key={m.period.en} variants={fadeUp} className="bg-white rounded-2xl border border-[#EDD9B4] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={18} className="text-[#B85C38]" strokeWidth={1.75} />
                  <h3 className="font-semibold text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>{t(m.period)}</h3>
                </div>
                <dl className="divide-y divide-[#F0E6D6]">
                  {m.lines.map((l) => (
                    <div key={l.item.en} className="flex items-center justify-between gap-3 py-2">
                      <dt className="text-sm text-[#3D2B1F]">{t(l.item)}</dt>
                      <dd className="text-sm text-[#8C7B72] tabular-nums flex-shrink-0">{formatAUDFull(l.amount)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-[#EDD9B4]">
                  <span className="text-sm font-semibold text-[#1C1410] uppercase tracking-wide">{t({ en: "Total", ar: "الإجمالي" })}</span>
                  <span className="text-lg font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>{formatAUDFull(m.total)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What's still needed */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "What we’re raising for", ar: "ما نجمع التبرّعات من أجله" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({
                en: `The 2026 goals — ${formatAUDFull(goalsTotal)} in total.`,
                ar: `أهداف عام 2026 — ${formatAUDFull(goalsTotal)} إجمالًا.`,
              })}
            </h2>
          </motion.div>
          <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {KAPOETA_GOALS.map((g) => (
              <motion.div key={g.id} variants={fadeUp} className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#EDD9B4] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-[#B85C38] flex-shrink-0" strokeWidth={1.75} />
                  <span className="text-[#3D2B1F] text-sm">{g.title}{g.recurringByNature && g.id !== "sponsor-a-child" ? t({ en: " (annual)", ar: " (سنويًا)" }) : ""}</span>
                </div>
                <span className="text-sm font-semibold text-[#1C1410] tabular-nums flex-shrink-0">{formatAUDFull(g.goalAmount)}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-xs text-[#8C7B72] italic mt-4">
            {t({
              en: "Project totals are working estimates; component breakdowns are shown on each donation page. Detailed financial reports are available on request.",
              ar: "إجماليّات المشاريع تقديرات أوّلية؛ وتفصيل المكوّنات معروض في كل صفحة تبرّع. والتقارير المالية التفصيلية متاحة عند الطلب.",
            })}
          </motion.p>
        </div>
      </section>

      <TrustStrip />

      <section className="py-20 px-4 text-center">
        <motion.div className="max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1C1410] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            {t({ en: "Be part of the next number.", ar: "كن جزءًا من الرقم القادم." })}
          </motion.h2>
          <motion.div variants={fadeUp}><DonateButton size="lg">{t({ en: "Donate now", ar: "تبرّع الآن" })}</DonateButton></motion.div>
        </motion.div>
      </section>
    </div>
  );
}
