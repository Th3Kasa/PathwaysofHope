"use client";

import { motion, type Variants } from "framer-motion";
import { ShieldCheck, ScrollText, Scale, AlertTriangle, HeartHandshake, FileCheck2 } from "lucide-react";
import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const ENTITY: { label: Dict<string>; value: Dict<string> }[] = [
  { label: { en: "Legal name", ar: "الاسم القانوني" }, value: { en: "Pathways of Hope Ltd", ar: "Pathways of Hope Ltd" } },
  { label: { en: "ABN", ar: "ABN" }, value: { en: "40 686 574 630", ar: "40 686 574 630" } },
  { label: { en: "ACN", ar: "ACN" }, value: { en: "686 574 630", ar: "686 574 630" } },
  { label: { en: "Structure", ar: "الكيان القانوني" }, value: { en: "Public company limited by guarantee", ar: "شركة عامة محدودة بالضمان" } },
  { label: { en: "Registered", ar: "تاريخ التسجيل" }, value: { en: "NSW · 28 April 2025", ar: "نيو ساوث ويلز · 28 April 2025" } },
  { label: { en: "Regulator", ar: "الجهة المنظِّمة" }, value: { en: "Registered with the ACNC", ar: "مسجّلة لدى هيئة الجمعيات الخيرية الأسترالية (ACNC)" } },
];

const OBJECTS: Dict<string>[] = [
  {
    en: "Paying school fees, uniforms and supplies so orphans and vulnerable children can attend and complete school.",
    ar: "دفع الرسوم المدرسية والأزياء واللوازم حتى يتمكّن الأيتام والأطفال المستضعفون من الالتحاق بالمدرسة وإتمام دراستهم.",
  },
  {
    en: "Providing healthcare — preventative programs, treatment, immunisations, maternal and child health, and emergency care.",
    ar: "توفير الرعاية الصحية — برامج وقائية وعلاج وتطعيمات ورعاية صحية للأمومة والطفولة ورعاية طارئة.",
  },
  {
    en: "Supplying regular, nutritious food to orphans, vulnerable children and adults.",
    ar: "توفير غذاء منتظم ومغذٍّ للأيتام والأطفال والبالغين المستضعفين.",
  },
  {
    en: "Funding the daily running and maintenance of orphanages — staffing, accommodation, utilities and care.",
    ar: "تمويل التشغيل اليومي وصيانة دور الأيتام — من طاقم العمل والإقامة والمرافق والرعاية.",
  },
  {
    en: "Delivering training and skills development for Sudanese refugees in Egypt.",
    ar: "تقديم التدريب وتنمية المهارات للاجئين السودانيين في مصر.",
  },
  {
    en: "Meeting other basic needs — clothing, clean water and housing support.",
    ar: "تلبية الاحتياجات الأساسية الأخرى — من ملبس ومياه نظيفة ودعم في السكن.",
  },
  {
    en: "Supporting the safe relocation of vulnerable children and adults to secure environments.",
    ar: "دعم النقل الآمن للأطفال والبالغين المستضعفين إلى بيئات آمنة.",
  },
];

const POLICIES: { icon: typeof ShieldCheck; title: Dict<string>; body: Dict<string> }[] = [
  {
    icon: ShieldCheck,
    title: { en: "Safeguarding Policy", ar: "سياسة حماية الطفل" },
    body: {
      en: "A survivor-centric, zero-tolerance approach to abuse, neglect and exploitation. Everyone who interacts with our work has an equal right to protection, and we follow a defined process for managing any incident.",
      ar: "نهج محوره الناجي ولا يتسامح إطلاقًا مع الإساءة أو الإهمال أو الاستغلال. لكل من يتعامل مع عملنا حقٌّ متساوٍ في الحماية، ونتّبع إجراءً محدّدًا للتعامل مع أي حادث.",
    },
  },
  {
    icon: Scale,
    title: { en: "Compliance Policy", ar: "سياسة الامتثال" },
    body: {
      en: "Full compliance with Australian law — anti-money-laundering and counter-terrorism financing, child protection, modern slavery, sanctions, taxation and anti-corruption — aligned to ACNC Governance Standards and External Conduct Standards.",
      ar: "امتثال كامل للقانون الأسترالي — مكافحة غسل الأموال وتمويل الإرهاب، وحماية الطفل، والرقّ الحديث، والعقوبات، والضرائب، ومكافحة الفساد — بما يتوافق مع معايير الحوكمة ومعايير السلوك الخارجي لدى هيئة الجمعيات الخيرية الأسترالية (ACNC).",
    },
  },
  {
    icon: ScrollText,
    title: { en: "Conflict of Interest Policy", ar: "سياسة تضارب المصالح" },
    body: {
      en: "Board members identify, disclose and manage any actual, potential or perceived conflicts of interest — financial or non-financial — to protect the integrity of every decision.",
      ar: "يحدّد أعضاء مجلس الإدارة أي تضارب فعلي أو محتمل أو متصوَّر في المصالح — مالي أو غير مالي — ويفصحون عنه ويديرونه، حمايةً لنزاهة كل قرار.",
    },
  },
  {
    icon: AlertTriangle,
    title: { en: "Fraud Prevention Policy", ar: "سياسة منع الاحتيال" },
    body: {
      en: "Zero tolerance for fraud, bribery, corruption or misuse of funds. Resources are safeguarded and used only for proper charitable purposes, in Australia and overseas.",
      ar: "لا تسامح إطلاقًا مع الاحتيال أو الرشوة أو الفساد أو إساءة استخدام الأموال. تُصان الموارد وتُستخدم فقط في الأغراض الخيرية السليمة، داخل أستراليا وخارجها.",
    },
  },
];

export default function GovernancePage() {
  const t = useT();
  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            {t({ en: "Accountability", ar: "المساءلة" })}
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } } }}
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Governance & safeguarding.", ar: "الحوكمة وحماية الطفل." })}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "We work with vulnerable children. That carries a duty of care we take seriously — backed by formal policies, a registered legal structure, and oversight from the ACNC.",
              ar: "نحن نعمل مع أطفال مستضعفين. وهذا يحمل واجب رعاية نأخذه على محمل الجدّ — تسنده سياسات رسمية، وكيان قانوني مسجّل، وإشراف من هيئة الجمعيات الخيرية الأسترالية (ACNC).",
            })}
          </motion.p>
        </div>
      </section>

      {/* Entity facts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}
            className="text-3xl font-light text-[#1C1410] mb-8" style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Who we are, legally", ar: "من نحن، قانونيًا" })}
          </motion.h2>
          <motion.dl
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EDD9B4] rounded-2xl overflow-hidden border border-[#EDD9B4]"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          >
            {ENTITY.map((e) => (
              <motion.div key={e.label.en} variants={fadeUp} className="bg-white p-5">
                <dt className="text-xs uppercase tracking-wider text-[#8C7B72] font-medium mb-1">{t(e.label)}</dt>
                <dd className="text-[#1C1410] font-semibold">{t(e.value)}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* Charitable purpose */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Our charitable purpose", ar: "غرضنا الخيري" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410] max-w-2xl leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "Benevolent relief for vulnerable children, adults and refugees.", ar: "إغاثة خيرية للأطفال والبالغين واللاجئين المستضعفين." })}
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-2xl">
              {t({
                en: "As set out in our Constitution, Pathways of Hope exists to serve Sudanese and South Sudanese orphans, vulnerable children, vulnerable adults and refugees across South Sudan, Sudan and Egypt — by:",
                ar: "كما هو منصوص عليه في نظامنا الأساسي، تأسّست دروب الأمل لخدمة الأيتام والأطفال المستضعفين والبالغين المستضعفين واللاجئين من السودان وجنوب السودان في جنوب السودان والسودان ومصر — من خلال:",
              })}
            </p>
          </motion.div>
          <motion.ul className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {OBJECTS.map((o) => (
              <motion.li key={o.en} variants={fadeUp} className="flex gap-3 bg-white rounded-xl border border-[#EDD9B4] p-4">
                <HeartHandshake size={18} className="text-[#C9952A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="text-[#3D2B1F] text-sm leading-relaxed">{t(o)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Safeguarding officer */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
            className="rounded-2xl bg-[#1C1410] text-white p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C9952A]/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} className="text-[#E4B84A]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-serif)" }}>{t({ en: "A dedicated Safeguarding Officer", ar: "مسؤولة مختصّة بحماية الطفل" })}</h2>
              <p className="text-[#C4AE9A] leading-relaxed">
                {t({
                  en: "Our Board has appointed ",
                  ar: "عيّن مجلس إدارتنا ",
                })}
                <span className="text-white font-medium">Sally Exander</span>
                {t({
                  en: " — a trained teacher — as Pathways of Hope’s Safeguarding Officer. All staff, volunteers, partners and third parties share responsibility for protecting everyone we serve from abuse, neglect or exploitation. We take a survivor-centric approach, with no exceptions.",
                  ar: " — وهي معلّمة مدرّبة — مسؤولةً عن حماية الطفل في دروب الأمل. يتقاسم جميع العاملين والمتطوّعين والشركاء والأطراف الأخرى مسؤولية حماية كل من نخدمهم من الإساءة أو الإهمال أو الاستغلال. ونتبع نهجًا محوره الناجي، دون أي استثناء.",
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-12">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "Our policies", ar: "سياساتنا" })}</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "Four policies that keep us honest.", ar: "أربع سياسات تُبقينا على استقامة." })}
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-2xl">
              {t({
                en: "Adopted by the Board on 30 November 2025. Full documents are available on request.",
                ar: "اعتمدها مجلس الإدارة في 30 November 2025. والوثائق الكاملة متاحة عند الطلب.",
              })}
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {POLICIES.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title.en} variants={fadeUp} whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-[#EDD9B4] p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#B85C38]/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#B85C38]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C1410] mb-2" style={{ fontFamily: "var(--font-serif)" }}>{t(p.title)}</h3>
                  <p className="text-[#8C7B72] text-sm leading-relaxed">{t(p.body)}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
            className="mt-8 flex items-start gap-3 rounded-xl bg-white border border-[#EDD9B4] p-5"
          >
            <FileCheck2 size={18} className="text-[#C9952A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-sm text-[#3D2B1F] leading-relaxed">
              {t({
                en: "Our work overseas is governed by the ACNC’s ",
                ar: "يخضع عملنا في الخارج لـ",
              })}
              <span className="font-medium">{t({ en: "Governance Standards", ar: "معايير الحوكمة" })}</span>
              {t({ en: " and ", ar: " و", })}
              <span className="font-medium">{t({ en: "External Conduct Standards", ar: "معايير السلوك الخارجي" })}</span>
              {t({
                en: ", and we lodge an annual report with the ACNC each year.",
                ar: " الصادرة عن هيئة الجمعيات الخيرية الأسترالية (ACNC)، ونقدّم تقريرًا سنويًا إلى الهيئة كل عام.",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      <section className="py-20 px-4 text-center">
        <motion.div className="max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1C1410] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            {t({ en: "Give with confidence.", ar: "تبرّع بثقة." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] mb-8">
            {t({
              en: "Strong governance is how we honour your trust — and the children we serve.",
              ar: "الحوكمة الرشيدة هي كيف نصون ثقتك — والأطفال الذين نخدمهم.",
            })}
          </motion.p>
          <motion.div variants={fadeUp}><DonateButton size="lg">{t({ en: "Support our missions", ar: "ادعم مهامّنا" })}</DonateButton></motion.div>
        </motion.div>
      </section>
    </div>
  );
}
