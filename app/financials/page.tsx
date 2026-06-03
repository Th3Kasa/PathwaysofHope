"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Receipt, Target, FileDown } from "lucide-react";
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

// Verified annual operating budget — the steady cost of running the shelter
// and caring for 70 children, as set out in the charity's own newsletter.
const ANNUAL_LINES: { item: Dict<string>; note: Dict<string>; amount: number }[] = [
  {
    item: { en: "Food", ar: "الطعام" },
    note: { en: "A$2,500 / month", ar: "A$2,500 / شهريًا" },
    amount: 30000,
  },
  {
    item: { en: "Education", ar: "التعليم" },
    note: { en: "School fees, uniforms & supplies", ar: "الرسوم المدرسية والزيّ والمستلزمات" },
    amount: 6000,
  },
  {
    item: { en: "Staff salaries", ar: "رواتب العاملين" },
    note: { en: "Three caregivers", ar: "ثلاثة من القائمين على الرعاية" },
    amount: 7000,
  },
  {
    item: { en: "Medical & miscellaneous", ar: "الرعاية الطبية والمتنوّعات" },
    note: { en: "Healthcare, incidentals & emergencies", ar: "الرعاية الصحية والنفقات الطارئة" },
    amount: 2000,
  },
];

export default function FinancialsPage() {
  const t = useT();
  const goalsTotal = KAPOETA_GOALS.reduce((s, g) => s + g.goalAmount, 0);

  return (
    <div className="bg-[#e7e5e4]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#6366f1] text-sm uppercase tracking-widest mb-4 font-medium">
            {t({ en: "Transparency", ar: "الشفافية" })}
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}
            className="text-5xl sm:text-6xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Where every dollar goes.", ar: "إلى أين يذهب كل دولار." })}
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#374151] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "We keep the books open. Here is what your giving has already built, what the shelter spends each month, and what we are raising for next.",
              ar: "نُبقي دفاترنا مفتوحة. هذا ما بناه عطاؤك بالفعل، وما يُنفقه الملجأ كل شهر، وما نجمع التبرّعات من أجله تاليًا.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Headline numbers */}
      <section className="py-16 px-4 bg-[#1e293b]">
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
            <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Already delivered", ar: "أُنجزت بالفعل" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({
                en: `${formatAUDFull(DELIVERED_TOTAL)} turned into a real home.`,
                ar: `${formatAUDFull(DELIVERED_TOTAL)} تحوّلت إلى بيتٍ حقيقي.`,
              })}
            </h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {DELIVERED.map((d) => (
              <motion.div key={d.title} variants={fadeUp} className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#d6d3d1] px-5 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#C9952A] flex-shrink-0" strokeWidth={2} />
                  <span className="text-[#374151] text-sm leading-snug">{d.title}</span>
                </div>
                <span className="text-sm font-semibold text-[#1e293b] tabular-nums flex-shrink-0">{formatAUDFull(d.amount)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Annual operating budget */}
      <section className="py-20 px-4 bg-[#f5f5f4]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Running costs", ar: "تكاليف التشغيل" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "What it costs to care for 70 children.", ar: "كم تكلّف رعاية 70 طفلاً." })}
            </h2>
            <p className="text-[#6b7280] mt-3 max-w-2xl">
              {t({
                en: "This is the steady annual cost of keeping the shelter open — food, education and the people who care for the children every day.",
                ar: "هذه هي التكلفة السنوية الثابتة لإبقاء الملجأ مفتوحًا — الطعام والتعليم والأشخاص الذين يرعون الأطفال كل يوم.",
              })}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="bg-white rounded-2xl border border-[#d6d3d1] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Receipt size={18} className="text-[#6366f1]" strokeWidth={1.75} />
              <h3 className="font-semibold text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>{t({ en: "Annual operating budget", ar: "الميزانية التشغيلية السنوية" })}</h3>
            </div>
            <dl className="divide-y divide-[#e7e5e4]">
              {ANNUAL_LINES.map((l) => (
                <div key={l.item.en} className="flex items-center justify-between gap-3 py-3">
                  <dt>
                    <span className="text-sm font-medium text-[#374151]">{t(l.item)}</span>
                    <span className="block text-xs text-[#9ca3af]">{t(l.note)}</span>
                  </dt>
                  <dd className="text-sm font-semibold text-[#1e293b] tabular-nums flex-shrink-0">{formatAUDFull(l.amount)} <span className="text-xs font-normal text-[#9ca3af]">{t({ en: "/ yr", ar: "/ سنويًا" })}</span></dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-[#d6d3d1]">
              <span className="text-sm font-semibold text-[#1e293b] uppercase tracking-wide">{t({ en: "Total per year", ar: "الإجمالي سنويًا" })}</span>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>{formatAUDFull(47000)}</span>
            </div>
            <p className="text-xs text-[#6b7280] italic mt-4">
              {t({
                en: "Annual total for food, education, staff, medical care and day-to-day incidentals. That is roughly A$56 per child per month.",
                ar: "الإجمالي السنوي للطعام والتعليم والرواتب والرعاية الطبية والنفقات اليومية. أي ما يعادل نحو A$56 لكل طفل شهريًا.",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's still needed */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "What we’re raising for", ar: "ما نجمع التبرّعات من أجله" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({
                en: "The 2026 goals — $100,000 in total.",
                ar: "أهداف عام 2026 — $100,000 إجمالًا.",
              })}
            </h2>
          </motion.div>
          <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {KAPOETA_GOALS.map((g) => (
              <motion.div key={g.id} variants={fadeUp} className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#d6d3d1] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-[#6366f1] flex-shrink-0" strokeWidth={1.75} />
                  <span className="text-[#374151] text-sm">{g.title}{g.recurringByNature && g.id !== "sponsor-a-child" ? t({ en: " (annual)", ar: " (سنويًا)" }) : ""}</span>
                </div>
                <span className="text-sm font-semibold text-[#1e293b] tabular-nums flex-shrink-0">{formatAUDFull(g.goalAmount)}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-xs text-[#6b7280] italic mt-4">
            {t({
              en: "Itemised project costs total A$92,900. The A$100,000 campaign target includes a A$7,100 contingency and emergency reserve. Component breakdowns are shown on each donation page.",
              ar: "تبلغ تكاليف المشاريع المفصّلة A$92,900. ويتضمّن هدف الحملة البالغ A$100,000 احتياطيًا للطوارئ بقيمة A$7,100. تفصيل المكوّنات معروض في كل صفحة تبرّع.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Annual Reports */}
      <AnnualReports />

      <TrustStrip />

      <section className="py-20 px-4 text-center">
        <motion.div className="max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1e293b] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            {t({ en: "Be part of the next number.", ar: "كن جزءًا من الرقم القادم." })}
          </motion.h2>
          <motion.div variants={fadeUp}><DonateButton size="lg">{t({ en: "Donate now", ar: "تبرّع الآن" })}</DonateButton></motion.div>
        </motion.div>
      </section>
    </div>
  );
}

/* ─── Annual Reports ─────────────────────────────────────────── */

type ReportStatus = "available" | "preparing";

interface AnnualReport {
  year: string;
  period: string;
  status: ReportStatus;
  pdfUrl?: string;
}

const REPORTS: AnnualReport[] = [
  {
    year: "FY 2024–25",
    period: "1 July 2024 – 30 June 2025",
    status: "preparing",
  },
];

function AnnualReports() {
  const t = useT();
  return (
    <section className="py-20 px-4 bg-[#f5f5f4]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-10"
        >
          <motion.p variants={fadeUp} className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
            {t({ en: "Annual reports", ar: "التقارير السنوية" })}
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-light text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
            {t({ en: "Full income & expense statements.", ar: "بيانات الدخل والمصروفات الكاملة." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] mt-3 max-w-2xl">
            {t({
              en: "Audited financial statements prepared by our finance team and filed with the Australian Charities and Not-for-profits Commission (ACNC) each financial year.",
              ar: "بيانات مالية مدقَّقة يُعدّها فريقنا المالي وتُودَع لدى هيئة الجمعيات الخيرية والمنظمات غير الربحية الأسترالية (ACNC) كل سنة مالية.",
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          {REPORTS.map((r) => (
            <motion.div
              key={r.year}
              variants={fadeUp}
              className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#d6d3d1] px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <FileDown size={20} className="text-[#6366f1] flex-shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold text-[#1e293b]">{r.year}</p>
                  <p className="text-xs text-[#9ca3af]">{r.period}</p>
                </div>
              </div>
              {r.status === "available" && r.pdfUrl ? (
                <a
                  href={r.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors"
                >
                  <FileDown size={13} strokeWidth={2} />
                  {t({ en: "Download PDF", ar: "تحميل PDF" })}
                </a>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#e7e5e4] text-[#6b7280]">
                  {t({ en: "In preparation", ar: "قيد الإعداد" })}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-xs text-[#6b7280] italic mt-4"
        >
          {t({
            en: "To request a report or ask a question about our finances, contact our finance team at finance@pathwaysofhope.org.au",
            ar: "للاستفسار عن تقرير أو طرح سؤال حول مالياتنا، تواصل مع فريقنا المالي على finance@pathwaysofhope.org.au",
          })}
        </motion.p>
      </div>
    </section>
  );
}
