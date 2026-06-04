"use client";

import { motion, type Variants } from "framer-motion";
import {
  Lock,
  Database,
  Share2,
  Globe2,
  Cookie,
  UserCheck,
  MessageSquareWarning,
  Mail,
} from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const LAST_UPDATED: Dict<string> = { en: "2 June 2026", ar: "2 يونيو 2026" };

const SECTIONS: { icon: typeof Database; title: Dict<string>; body: Dict<string>[] }[] = [
  {
    icon: Database,
    title: { en: "What we collect", ar: "ما الذي نجمعه" },
    body: [
      {
        en: "When you donate, you provide your name, email address and billing details. Card payments are processed by Stripe — we never see or store your full card number.",
        ar: "عند التبرّع، تقدّم لنا اسمك وبريدك الإلكتروني وبيانات الدفع. تُعالَج مدفوعات البطاقات عبر Stripe — ونحن لا نطّلع على رقم بطاقتك الكامل ولا نخزّنه إطلاقًا.",
      },
      {
        en: "If you contact us, we keep the details you choose to share so we can respond. When you browse the site, our host records standard technical information such as your browser type and the pages you visit, used only to keep the site secure and working well.",
        ar: "إذا تواصلت معنا، نحتفظ بالبيانات التي تختار مشاركتها كي نتمكّن من الردّ عليك. وعند تصفّحك للموقع، يسجّل مضيفنا معلومات تقنية اعتيادية مثل نوع متصفّحك والصفحات التي تزورها، وتُستخدم فقط لإبقاء الموقع آمنًا وفعّالًا.",
      },
    ],
  },
  {
    icon: UserCheck,
    title: { en: "How we use it", ar: "كيف نستخدمها" },
    body: [
      {
        en: "To process your donation and issue a receipt; to answer your questions; to send you updates about the work only if you ask us to; and to meet our legal and reporting obligations as a registered charity.",
        ar: "لمعالجة تبرّعك وإصدار إيصال؛ وللإجابة عن أسئلتك؛ ولإرسال أخبار العمل إليك فقط إذا طلبت ذلك؛ وللوفاء بالتزاماتنا القانونية والتقريرية بوصفنا جمعية خيرية مسجّلة.",
      },
      {
        en: "We do not use your information for any purpose unrelated to our charitable work, and we never sell it.",
        ar: "لا نستخدم معلوماتك لأيّ غرض لا صلة له بعملنا الخيري، ولا نبيعها أبدًا.",
      },
    ],
  },
  {
    icon: Lock,
    title: { en: "Payments & security", ar: "المدفوعات والأمان" },
    body: [
      {
        en: "All payments are handled by Stripe over an encrypted connection. Stripe is a PCI-DSS Level 1 certified provider — the highest level of payment security. Your card details go directly to Stripe and are never stored on our servers.",
        ar: "تُعالَج جميع المدفوعات عبر Stripe من خلال اتصال مشفّر. وStripe مزوّد معتمد بمستوى PCI-DSS Level 1 — أعلى مستويات أمان المدفوعات. تنتقل بيانات بطاقتك مباشرةً إلى Stripe ولا تُخزَّن أبدًا على خوادمنا.",
      },
    ],
  },
  {
    icon: Share2,
    title: { en: "Who we share it with", ar: "مع من نشاركها" },
    body: [
      {
        en: "We disclose personal information only to the service providers who help us operate — principally Stripe for payment processing — and only as far as needed to deliver the service. We may also disclose information where required by Australian law.",
        ar: "لا نفصح عن المعلومات الشخصية إلا لمزوّدي الخدمات الذين يعينوننا على تشغيل عملنا — وعلى رأسهم Stripe لمعالجة المدفوعات — وبالقدر اللازم لتقديم الخدمة فقط. وقد نفصح عن المعلومات أيضًا حيثما يقتضي القانون الأسترالي ذلك.",
      },
    ],
  },
  {
    icon: Globe2,
    title: { en: "Overseas handling", ar: "المعالجة خارج أستراليا" },
    body: [
      {
        en: "Our payment processor, Stripe, may process and store information on servers located outside Australia. We take reasonable steps to ensure any overseas recipient handles your information consistently with the Australian Privacy Principles.",
        ar: "قد يعالج مزوّد المدفوعات لدينا، Stripe، المعلومات ويخزّنها على خوادم خارج أستراليا. ونتّخذ خطوات معقولة لضمان أن يتعامل أيّ متلقٍّ خارجي مع معلوماتك بما يتوافق مع مبادئ الخصوصية الأسترالية (Australian Privacy Principles).",
      },
    ],
  },
  {
    icon: Cookie,
    title: { en: "Cookies & analytics", ar: "ملفّات تعريف الارتباط والتحليلات" },
    body: [
      {
        en: "We keep tracking to a minimum. The site uses only the cookies necessary for it to function and to understand, in aggregate, how it is used. We do not run advertising trackers.",
        ar: "نُبقي التتبّع عند حدّه الأدنى. يستخدم الموقع فقط ملفّات تعريف الارتباط اللازمة لعمله ولفهم كيفية استخدامه على نحوٍ إجمالي. ولا نشغّل أيّ أدوات تتبّع إعلانية.",
      },
    ],
  },
  {
    icon: UserCheck,
    title: { en: "Accessing & correcting your information", ar: "الاطّلاع على معلوماتك وتصحيحها" },
    body: [
      {
        en: "You may ask us what personal information we hold about you and request that we correct it, in line with Australian Privacy Principles 12 and 13. Contact us using the details below and we will respond within a reasonable time.",
        ar: "يمكنك أن تسألنا عن المعلومات الشخصية التي نحتفظ بها عنك وأن تطلب تصحيحها، وفقًا لمبدأَي الخصوصية الأستراليَّين 12 و13 (Australian Privacy Principles). تواصل معنا عبر البيانات الواردة أدناه وسنردّ خلال مدّة معقولة.",
      },
    ],
  },
  {
    icon: MessageSquareWarning,
    title: { en: "Complaints", ar: "الشكاوى" },
    body: [
      {
        en: "If you believe we have mishandled your personal information, please contact us first so we can put it right. If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.",
        ar: "إذا كنت ترى أننا أسأنا التعامل مع معلوماتك الشخصية، فيُرجى التواصل معنا أولًا كي نصحّح الأمر. وإذا لم تكن راضيًا عن ردّنا، فيمكنك التواصل مع مكتب مفوّض المعلومات الأسترالي (OAIC) عبر oaic.gov.au.",
      },
    ],
  },
];

export default function PrivacyPage() {
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
            {t({ en: "Your privacy", ar: "خصوصيتك" })}
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
            {t({ en: "Privacy policy.", ar: "سياسة الخصوصية." })}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#374151] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "We treat your personal information with the same care we ask you to place in us. This policy explains what we collect, why, and the control you keep over it.",
              ar: "نتعامل مع معلوماتك الشخصية بالعناية ذاتها التي نطلب منك أن تضعها فينا. توضّح هذه السياسة ما الذي نجمعه، ولماذا، وما تحتفظ به من سيطرة عليه.",
            })}
          </motion.p>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.35 } } }}
            className="text-[#6b7280] text-sm mt-6"
          >
            {t({
              en: `Pathways of Hope Ltd · ABN 40 686 574 630 · Last updated ${LAST_UPDATED.en}`,
              ar: `Pathways of Hope Ltd · ABN 40 686 574 630 · آخر تحديث ${LAST_UPDATED.ar}`,
            })}
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <p className="text-[#374151] text-lg leading-relaxed">
            {t({
              en: (
                <>
                  Pathways of Hope Ltd is committed to protecting your privacy and complying with the{" "}
                  <span className="font-medium">Privacy Act 1988 (Cth)</span> and the{" "}
                  <span className="font-medium">Australian Privacy Principles</span>. We collect only what we
                  need to carry out our charitable work, and we handle it openly.
                </>
              ),
              ar: (
                <>
                  تلتزم Pathways of Hope Ltd بحماية خصوصيتك وبالامتثال{" "}
                  <span className="font-medium">لقانون الخصوصية لعام 1988 (Privacy Act 1988 (Cth))</span>{" "}
                  و<span className="font-medium">لمبادئ الخصوصية الأسترالية (Australian Privacy Principles)</span>.
                  ولا نجمع إلا ما نحتاج إليه للقيام بعملنا الخيري، ونتعامل معه بشفافية.
                </>
              ),
            })}
          </p>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="pb-12 px-4">
        <motion.div
          className="max-w-3xl mx-auto space-y-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={stagger}
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title.en}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#d6d3d1] p-7 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#6366f1]" strokeWidth={1.75} />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1e293b]" style={{ fontFamily: "var(--font-serif)" }}>
                    {t(s.title)}
                  </h2>
                </div>
                <div className="space-y-3 pl-1">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[#6b7280] text-sm leading-relaxed">
                      {t(p)}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="rounded-2xl bg-[#1e293b] text-white p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C9952A]/20 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-[#E4B84A]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                {t({ en: "Privacy enquiries", ar: "استفسارات الخصوصية" })}
              </h2>
              <p className="text-[#C4AE9A] leading-relaxed">
                {t({
                  en: (
                    <>
                      For any question about this policy, or to access or correct your information, email us at{" "}
                      <a
                        href="mailto:pathways_of_hope@outlook.com"
                        className="text-[#E4B84A] font-medium hover:underline"
                      >
                        pathways_of_hope@outlook.com
                      </a>
                      . We will respond as promptly as we can.
                    </>
                  ),
                  ar: (
                    <>
                      لأيّ سؤال حول هذه السياسة، أو للاطّلاع على معلوماتك أو تصحيحها، راسلنا على{" "}
                      <a
                        href="mailto:pathways_of_hope@outlook.com"
                        className="text-[#E4B84A] font-medium hover:underline"
                      >
                        pathways_of_hope@outlook.com
                      </a>
                      . وسنردّ في أسرع وقت ممكن.
                    </>
                  ),
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
