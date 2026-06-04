"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

interface QA {
  q: Dict<string>;
  a: Dict<React.ReactNode>;
}

const GROUPS: { heading: Dict<string>; items: QA[] }[] = [
  {
    heading: { en: "Your donation", ar: "تبرّعك" },
    items: [
      {
        q: {
          en: "How much of my donation reaches the children?",
          ar: "ما المقدار الذي يصل من تبرّعي إلى الأطفال؟",
        },
        a: {
          en: (
            <>
              100%. Every volunteer self-funds their own travel and accommodation, so administration
              and travel are never paid from donations. The only deduction is the card processing fee —
              and at checkout you can choose to cover that yourself so your full gift reaches Kapoeta.
            </>
          ),
          ar: (
            <>
              100%. يموّل كل متطوّع سفره وإقامته بنفسه، فلا تُدفع نفقات الإدارة والسفر من التبرّعات أبدًا.
              والاقتطاع الوحيد هو رسم معالجة البطاقة — وعند إتمام الدفع يمكنك أن تختار تغطيته بنفسك كي يصل
              تبرّعك كاملًا إلى كاپويتا.
            </>
          ),
        },
      },
      {
        q: {
          en: "Is my donation tax-deductible?",
          ar: "هل تبرّعي معفى من الضرائب؟",
        },
        a: {
          en: (
            <>
              Yes. Pathways of Hope Ltd is an ACNC-registered charity endorsed by the ATO as a
              Deductible Gift Recipient (DGR). Gifts of $2 or more are tax-deductible, and a
              tax-deductible invoice is emailed to you automatically by Stripe as soon as your
              payment is confirmed. Keep it for your tax records.
            </>
          ),
          ar: (
            <>
              نعم. Pathways of Hope Ltd جمعية خيرية مسجّلة لدى ACNC ومعتمدة من مكتب الضرائب
              الأسترالي كجهة مؤهَّلة لاستلام الهبات المعفاة (DGR). التبرّعات بقيمة $2 فأكثر معفاة من
              الضرائب، وتُرسَل إليك فاتورة معفاة من الضرائب تلقائيًا عبر Stripe بمجرّد تأكيد دفعتك.
              احتفظ بها لسجلّاتك الضريبية.
            </>
          ),
        },
      },
      {
        q: {
          en: "How do I get a receipt?",
          ar: "كيف أحصل على إيصال؟",
        },
        a: {
          en: (
            <>
              For card donations, a DGR tax-deductible invoice is emailed automatically by Stripe
              when your payment is confirmed. If you don&apos;t receive one within a few minutes,
              check your spam folder or{" "}
              <a href="mailto:contact@pathwaysofhope.org.au" className="text-[#6366f1] underline">
                email us
              </a>{" "}
              and we&apos;ll send it through. For bank transfers, email us and we&apos;ll issue your
              receipt.
            </>
          ),
          ar: (
            <>
              للتبرّعات بالبطاقة، تُرسَل فاتورة معفاة من الضرائب (DGR) تلقائيًا عبر Stripe بمجرّد
              تأكيد الدفع. وإن لم تستلمها خلال دقائق قليلة، تفقّد مجلّد البريد غير المرغوب فيه أو
              راسلنا وسنرسلها إليك. أمّا التحويلات المصرفية فراسلنا وسنُصدر لك الإيصال.
            </>
          ),
        },
      },
      {
        q: {
          en: "Can I give monthly — and cancel later?",
          ar: "هل يمكنني التبرّع شهريًا — وإلغاؤه لاحقًا؟",
        },
        a: {
          en: (
            <>
              Yes. You can give once, or set up a recurring gift weekly, fortnightly or monthly. Recurring
              giving is the steadiest way to support the shelter&apos;s running costs, and you can change
              or cancel it at any time — just contact us and we&apos;ll take care of it.
            </>
          ),
          ar: (
            <>
              نعم. يمكنك التبرّع مرة واحدة، أو إعداد تبرّع متكرّر أسبوعيًا أو كل أسبوعين أو شهريًا. والتبرّع
              المتكرّر هو أثبت وسيلة لدعم النفقات التشغيلية للملجأ، ويمكنك تغييره أو إلغاؤه في أيّ وقت —
              تواصل معنا فحسب وسنتولّى الأمر.
            </>
          ),
        },
      },
      {
        q: {
          en: "Can I donate by bank transfer instead of card?",
          ar: "هل يمكنني التبرّع بالتحويل المصرفي بدلًا من البطاقة؟",
        },
        a: {
          en: (
            <>
              Yes. On any donation page you&apos;ll find direct bank transfer details beneath the card
              form. Bank transfers carry no processing fee, so every cent reaches the field.
            </>
          ),
          ar: (
            <>
              نعم. في أيّ صفحة تبرّع ستجد بيانات التحويل المصرفي المباشر أسفل نموذج البطاقة. ولا تتحمّل
              التحويلات المصرفية أيّ رسم معالجة، فيصل كل سنت إلى الميدان.
            </>
          ),
        },
      },
      {
        q: {
          en: "Can I donate from outside Australia?",
          ar: "هل يمكنني التبرّع من خارج أستراليا؟",
        },
        a: {
          en: (
            <>
              Yes. Donations are processed in Australian dollars (AUD) and most international cards are
              accepted. Your bank may apply its own currency conversion.
            </>
          ),
          ar: (
            <>
              نعم. تُعالَج التبرّعات بالدولار الأسترالي (AUD)، وتُقبل معظم البطاقات الدولية. وقد يطبّق
              مصرفك تحويلًا خاصًا به للعملة.
            </>
          ),
        },
      },
    ],
  },
  {
    heading: { en: "Where it goes", ar: "إلى أين يذهب" },
    items: [
      {
        q: {
          en: "What exactly does my money pay for?",
          ar: "ما الذي تموّله أموالي تحديدًا؟",
        },
        a: {
          en: (
            <>
              Gifts go to clearly defined projects at the Kapoeta Children&apos;s Shelter — a solar power
              system, an electric water pump, a chicken coop for eggs and income, the day-to-day running
              of the home, and child sponsorship. You can give to a specific project, or to wherever the
              need is greatest. See the{" "}
              <Link href="/donate" className="text-[#6366f1] font-medium hover:underline">
                donation page
              </Link>{" "}
              for each goal.
            </>
          ),
          ar: (
            <>
              تذهب التبرّعات إلى مشاريع محدّدة بوضوح في ملجأ كاپويتا للأطفال — نظام طاقة شمسية، ومضخة مياه
              كهربائية، وحظيرة دجاج للبيض والدخل، والتشغيل اليومي للبيت، وكفالة الأطفال. ويمكنك التبرّع
              لمشروع بعينه، أو حيث تشتدّ الحاجة أكثر. اطّلع على{" "}
              <Link href="/donate" className="text-[#6366f1] font-medium hover:underline">
                صفحة التبرّع
              </Link>{" "}
              لكل هدف.
            </>
          ),
        },
      },
      {
        q: {
          en: "What does it cost to sponsor a child?",
          ar: "كم تبلغ كلفة كفالة طفل؟",
        },
        a: {
          en: (
            <>
              A$600 covers one child&apos;s full year — meals, a safe bed, schooling and the dignity of
              belonging. You can sponsor one child or several.
            </>
          ),
          ar: (
            <>
              يغطّي مبلغ A$600 سنة كاملة لطفل واحد — وجبات، وسرير آمن، وتعليم، وكرامة الانتماء. ويمكنك
              كفالة طفل واحد أو عدّة أطفال.
            </>
          ),
        },
      },
      {
        q: {
          en: "How will I hear about the impact of my gift?",
          ar: "كيف سأعرف عن أثر تبرّعي؟",
        },
        a: {
          en: (
            <>
              We share milestones and news from Kapoeta on our{" "}
              <Link href="/impact" className="text-[#6366f1] font-medium hover:underline">
                Impact page
              </Link>
              , and you can follow the full story of the shelter on the{" "}
              <Link href="/missions/kapoeta" className="text-[#6366f1] font-medium hover:underline">
                Kapoeta mission page
              </Link>
              .
            </>
          ),
          ar: (
            <>
              نشارك المحطّات والأخبار من كاپويتا على{" "}
              <Link href="/impact" className="text-[#6366f1] font-medium hover:underline">
                صفحة الأثر
              </Link>
              ، ويمكنك متابعة القصّة الكاملة للملجأ على{" "}
              <Link href="/missions/kapoeta" className="text-[#6366f1] font-medium hover:underline">
                صفحة مهمّة كاپويتا
              </Link>
              .
            </>
          ),
        },
      },
    ],
  },
  {
    heading: { en: "Trust & security", ar: "الثقة والأمان" },
    items: [
      {
        q: {
          en: "Is my payment secure?",
          ar: "هل دفعتي آمنة؟",
        },
        a: {
          en: (
            <>
              Yes. Payments are handled by Stripe, a globally trusted, PCI-DSS Level 1 certified provider,
              over an encrypted connection. Your card details go directly to Stripe and are never stored
              on our servers.
            </>
          ),
          ar: (
            <>
              نعم. تُعالَج المدفوعات عبر Stripe، وهو مزوّد موثوق عالميًا ومعتمد بمستوى PCI-DSS Level 1،
              من خلال اتصال مشفّر. وتنتقل بيانات بطاقتك مباشرةً إلى Stripe ولا تُخزَّن أبدًا على خوادمنا.
            </>
          ),
        },
      },
      {
        q: {
          en: "Who runs Pathways of Hope?",
          ar: "من يدير دروب الأمل؟",
        },
        a: {
          en: (
            <>
              Pathways of Hope is an Australian charity governed by a volunteer Board, working in
              partnership with Brother Hakim Peter — a native of Kapoeta who founded the shelter and leads
              the work on the ground. You can read more on our{" "}
              <Link href="/about" className="text-[#6366f1] font-medium hover:underline">
                About
              </Link>{" "}
              and{" "}
              <Link href="/governance" className="text-[#6366f1] font-medium hover:underline">
                Governance
              </Link>{" "}
              pages.
            </>
          ),
          ar: (
            <>
              دروب الأمل جمعية خيرية أسترالية يديرها مجلس من المتطوّعين، بالشراكة مع الأخ حكيم بيتر — وهو
              من أبناء كاپويتا، أسّس الملجأ ويقود العمل في الميدان. ويمكنك قراءة المزيد على صفحتَي{" "}
              <Link href="/about" className="text-[#6366f1] font-medium hover:underline">
                من نحن
              </Link>{" "}
              و
              <Link href="/governance" className="text-[#6366f1] font-medium hover:underline">
                الحوكمة
              </Link>
              .
            </>
          ),
        },
      },
      {
        q: {
          en: "How do I know the money is well spent?",
          ar: "كيف أتأكّد من حُسن إنفاق الأموال؟",
        },
        a: {
          en: (
            <>
              We publish what we&apos;ve raised, what we&apos;ve delivered, and real monthly operating
              statements on our{" "}
              <Link href="/financials" className="text-[#6366f1] font-medium hover:underline">
                Transparency page
              </Link>
              . We operate under formal safeguarding, compliance, conflict-of-interest and
              fraud-prevention policies.
            </>
          ),
          ar: (
            <>
              ننشر ما جمعناه، وما أنجزناه، وبيانات تشغيلية شهرية حقيقية على{" "}
              <Link href="/financials" className="text-[#6366f1] font-medium hover:underline">
                صفحة الشفافية
              </Link>
              . ونعمل وفق سياسات رسمية لحماية الطفل والامتثال وتعارض المصالح ومنع الاحتيال.
            </>
          ),
        },
      },
    ],
  },
];

function FaqItem({ item }: { item: QA }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#d6d3d1] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
        aria-expanded={open}
      >
        <span className="text-[#1e293b] font-medium text-base sm:text-lg" style={{ fontFamily: "var(--font-serif)" }}>
          {t(item.q)}
        </span>
        <span className="w-8 h-8 rounded-full bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0 text-[#6366f1]">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[#6b7280] text-sm sm:text-[0.95rem] leading-relaxed">{t(item.a)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-4 font-medium"
          >
            {t({ en: "Questions, answered", ar: "أسئلة وإجابات" })}
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="text-5xl sm:text-6xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Frequently asked questions.", ar: "الأسئلة الشائعة." })}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#374151] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "Everything you might want to know before you give — about your donation, where it goes, and how we keep your trust.",
              ar: "كل ما قد ترغب في معرفته قبل أن تتبرّع — عن تبرّعك، وإلى أين يذهب، وكيف نصون ثقتك.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Groups */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-14">
          {GROUPS.map((group) => (
            <div key={group.heading.en}>
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="text-[#C9952A] text-xs font-semibold uppercase tracking-widest mb-5"
              >
                {t(group.heading)}
              </motion.h2>
              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={stagger}
              >
                {group.items.map((item) => (
                  <FaqItem key={item.q.en} item={item} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-[#f5f5f4]">
        <motion.div
          className="max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-light text-[#1e293b] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Still have a question?", ar: "أمَا زال لديك سؤال؟" })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] mb-8">
            {t({
              en: (
                <>
                  Email us at{" "}
                  <a href="mailto:pathways_of_hope@outlook.com" className="text-[#6366f1] font-medium hover:underline">
                    pathways_of_hope@outlook.com
                  </a>{" "}
                  — we&apos;d love to hear from you.
                </>
              ),
              ar: (
                <>
                  راسلنا على{" "}
                  <a href="mailto:pathways_of_hope@outlook.com" className="text-[#6366f1] font-medium hover:underline">
                    pathways_of_hope@outlook.com
                  </a>{" "}
                  — يسعدنا أن نسمع منك.
                </>
              ),
            })}
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonateButton size="lg">{t({ en: "Make a donation", ar: "تبرّع الآن" })}</DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
