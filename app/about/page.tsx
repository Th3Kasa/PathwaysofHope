"use client";

import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";
import { motion, type Variants } from "framer-motion";
import { useT, type Dict } from "@/lib/i18n";

const BOARD: { name: string; roles: Dict<string>[]; bio: Dict<string> }[] = [
  {
    name: "Waleed Mansour",
    roles: [
      { en: "Chairman", ar: "رئيس مجلس الإدارة" },
      { en: "Director", ar: "عضو مجلس إدارة" },
    ],
    bio: {
      en: "As Chairman of Pathways of Hope, Waleed brings a deep commitment to transparent governance and community-driven charity, ensuring the organisation's mission remains accountable to those it serves.",
      ar: "بصفته رئيسًا لمجلس إدارة دروب الأمل، يحمل وليد التزامًا عميقًا بالحوكمة الشفافة والعمل الخيري النابع من المجتمع، حرصًا على أن تظلّ رسالة المنظمة مسؤولة أمام من تخدمهم.",
    },
  },
  {
    name: "Sylvia Mansour",
    roles: [
      { en: "Director", ar: "عضو مجلس إدارة" },
    ],
    bio: {
      en: "Sylvia serves as a Director of Pathways of Hope, contributing her dedication and passion to advancing the organisation's mission of supporting communities in need.",
      ar: "تشغل سيلفيا منصب عضو في مجلس إدارة دروب الأمل، مُسهِمةً بتفانيها وشغفها في دفع مسيرة المنظمة نحو دعم المجتمعات المحتاجة.",
    },
  },
  {
    name: "Hanan Morkos",
    roles: [
      { en: "Director", ar: "عضو مجلس إدارة" },
    ],
    bio: {
      en: "Hanan serves as a Director of Pathways of Hope, bringing her commitment and care to help guide the organisation in fulfilling its mission of hope and service.",
      ar: "تشغل حنان منصب عضو في مجلس إدارة دروب الأمل، حاملةً التزامها واهتمامها لمساعدة المنظمة في أداء رسالتها المتمثّلة في الأمل والخدمة.",
    },
  },
];

const COMMITMENTS: { title: Dict<string>; body: Dict<string> }[] = [
  {
    title: { en: "Registered Australian Charity", ar: "جمعية خيرية أسترالية مسجّلة" },
    body: {
      en: "Pathways of Hope Ltd (ABN 40 686 574 630) is a public company limited by guarantee, registered with the Australian Charities and Not-for-profits Commission (ACNC) and endorsed by the ATO as a Deductible Gift Recipient (DGR). Gifts of $2 or more are tax-deductible and receive a tax-deductible receipt.",
      ar: "‏Pathways of Hope Ltd (ABN 40 686 574 630) شركة عامة محدودة بالضمان، مسجّلة لدى هيئة الجمعيات الخيرية والمنظمات غير الربحية الأسترالية (ACNC) ومعتمدة من مكتب الضرائب الأسترالي كجهة مؤهَّلة لاستلام الهبات المعفاة (DGR). التبرّعات بقيمة $2 فأكثر معفاة من الضرائب وتحصل على إيصال معفى من الضرائب.",
    },
  },
  {
    title: { en: "100% to the field — structurally guaranteed", ar: "100% إلى الميدان — مكفولة في بنية عملنا" },
    body: {
      en: "All volunteer travel costs — flights, accommodation, visas — are self-funded by the individuals involved. Not one cent of donor money is spent on getting people to and from our missions.",
      ar: "جميع نفقات سفر المتطوّعين — الطيران والإقامة والتأشيرات — يموّلها الأفراد المعنيّون بأنفسهم. ولا يُنفَق سنتٌ واحد من أموال المتبرّعين على نقل الأشخاص من مهامّنا وإليها.",
    },
  },
  {
    title: { en: "Full financial transparency", ar: "شفافية مالية كاملة" },
    body: {
      en: "We publish annual financial reports and make detailed statements available on request. If you want to see exactly how your donation was spent, ask us — we will show you.",
      ar: "ننشر تقارير مالية سنوية ونوفّر بيانات تفصيلية عند الطلب. وإن أردت أن ترى بدقّة كيف أُنفِق تبرّعك، فاسألنا — وسنُريك.",
    },
  },
  {
    title: { en: "Local leadership, not outsider management", ar: "قيادة محلية، لا إدارة من الخارج" },
    body: {
      en: "The local leader on the ground is the decision-maker. We do not impose Australian management on communities we serve. We resource leaders those communities already trust.",
      ar: "القائد المحلي في الميدان هو صاحب القرار. ولا نفرض إدارة أسترالية على المجتمعات التي نخدمها، بل نوفّر الموارد لقادةٍ تثق بهم تلك المجتمعات أصلًا.",
    },
  },
  {
    title: { en: "No overhead extraction", ar: "بلا اقتطاع للنفقات الإدارية" },
    body: {
      en: "Our administrative costs are covered by a small number of committed donors who specifically designate their gifts for operations. General donations are ringfenced for mission work.",
      ar: "تُغطّى نفقاتنا الإدارية من عدد قليل من المتبرّعين الملتزمين الذين يخصّصون عطاءهم تحديدًا للنفقات التشغيلية. أما التبرّعات العامة فمحجوزة بالكامل لعمل المهامّ.",
    },
  },
  {
    title: { en: "Multi-church, multi-national accountability", ar: "مساءلة متعددة الكنائس والجنسيات" },
    body: {
      en: "We are not a one-church project. Our accountability network spans churches and communities across Australia, the United Kingdom, and beyond.",
      ar: "لسنا مشروعًا لكنيسة واحدة. فشبكة مساءلتنا تمتدّ عبر كنائس ومجتمعات في أستراليا وبريطانيا وما وراءها.",
    },
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const MODEL_PARAS: Dict<string>[] = [
  {
    en: "We don't parachute in. We find people already doing the work — with the local trust, cultural knowledge, and personal commitment that no external organisation can replicate — and we fund them.",
    ar: "نحن لا نهبط فجأة من الخارج. بل نجد أشخاصًا يؤدّون العمل بالفعل — يملكون الثقة المحلية والمعرفة الثقافية والالتزام الشخصي الذي لا تستطيع أيّ منظمة خارجية أن تحاكيه — ثم نموّلهم.",
  },
  {
    en: "Every dollar donated reaches the field. Our volunteers fund their own travel. Our administrative costs are covered by designated operational donors. This isn't a promise — it's a structural fact.",
    ar: "كل دولار يُتبرَّع به يصل إلى الميدان. متطوّعونا يموّلون سفرهم بأنفسهم، ونفقاتنا الإدارية يغطّيها متبرّعون مخصَّصون للنفقات التشغيلية. وهذا ليس وعدًا — بل حقيقة في بنية عملنا.",
  },
  {
    en: "Pathways of Hope is designed to grow with new missions over time. Each new partnership follows the same principle: identify a trusted local leader, build a transparent funding structure, and mobilise a global community of support.",
    ar: "صُمِّمت دروب الأمل لتنمو بمهامّ جديدة مع مرور الوقت. وتسير كل شراكة جديدة على المبدأ ذاته: تحديد قائد محلي موثوق، وبناء هيكل تمويل شفّاف، وحشد مجتمع عالمي من الداعمين.",
  },
];

export default function AboutPage() {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4]">

      {/* Hero */}
      <section className="py-16 sm:py-28 px-4 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 sm:mb-4 font-medium"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {t({ en: "Who we are", ar: "من نحن" })}
          </motion.p>
          <motion.h1
            className="text-[2rem] sm:text-5xl font-light text-[#1e293b] mb-4 sm:mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] } } }}
          >
            {t({
              en: "A registered Australian charity built on trust, transparency, and local leadership.",
              ar: "جمعية خيرية أسترالية مسجّلة قائمة على الثقة والشفافية والقيادة المحلية.",
            })}
          </motion.h1>
          <motion.p
            className="text-[#374151] text-base sm:text-xl leading-relaxed max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } } }}
          >
            {t({
              en: "Pathways of Hope exists to resource extraordinary local leaders who are already changing lives — without bureaucratic overhead or outsider interference.",
              ar: "توجد دروب الأمل لتوفّر الموارد لقادة محليين استثنائيين يغيّرون الحياة بالفعل — دون أعباء إدارية بيروقراطية ولا تدخّل من الخارج.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Our Model */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl font-light text-[#1e293b] mb-6 sm:mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            {t({ en: "Our model", ar: "نموذجنا" })}
          </motion.h2>
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
          >
            {MODEL_PARAS.map((para, i) => (
              <motion.p
                key={i}
                className="text-[#374151] leading-relaxed text-lg pl-5 border-l-2 border-[#C9952A]"
                variants={fadeRight}
              >
                {t(para)}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="bg-[#6366f1] py-12 sm:py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <blockquote
            className="text-xl sm:text-3xl font-light text-white leading-relaxed italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: “”We make a living by what we get, but we make a life by what we give.””,
              ar: “«نحن نكسب رزقنا بما نأخذه، لكننا نصنع حياتنا بما نعطيه.»”,
            })}
          </blockquote>
          <cite className=”block mt-5 text-[#d6d3d1] text-sm not-italic tracking-wide”>
            {t({ en: “— Winston Churchill”, ar: “— ونستون تشرشل” })}
          </cite>
        </motion.div>
      </section>

      {/* Board of Directors */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 sm:mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
              {t({ en: "Governance", ar: "الحوكمة" })}
            </p>
            <h2
              className="text-4xl font-light text-[#1e293b]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "Board of Directors", ar: "مجلس الإدارة" })}
            </h2>
            <p className="text-[#6b7280] mt-3 max-w-xl">
              {t({
                en: "Pathways of Hope is governed by its Responsible People — our board of directors who ensure the organisation operates with integrity, accountability, and purpose.",
                ar: "تُحكَم دروب الأمل من قِبل المسؤولين عنها — مجلس إدارتنا الذي يكفل أن تعمل المنظمة بنزاهة ومساءلة وهدف.",
              })}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {BOARD.map((person) => (
              <motion.div
                key={person.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#d6d3d1] overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-7">
                  <h3
                    className="text-xl font-semibold text-[#1e293b] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {person.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {person.roles.map((role) => (
                      <span
                        key={role.en}
                        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#d6d3d1] text-[#4f46e5]"
                      >
                        {t(role)}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{t(person.bio)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-12 sm:py-20 px-4 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
              {t({ en: "Our commitments", ar: "التزاماتنا" })}
            </p>
            <h2
              className="text-4xl font-light text-[#1e293b]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "Why you can trust us with your giving", ar: "لماذا يمكنك أن تثق بنا في عطائك" })}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {COMMITMENTS.map((item) => (
              <motion.div key={item.title.en} variants={fadeLeft} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-[#C9952A] mt-2.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1e293b] mb-1">{t(item.title)}</h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{t(item.body)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-light text-[#1e293b] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Support our missions.", ar: "ادعم مهامّنا." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] mb-8">
            {t({
              en: "Whether you give once, give monthly, or give your time — you are part of this story.",
              ar: "سواء تبرّعت مرة واحدة، أو شهريًا، أو منحت وقتك — فأنت جزء من هذه القصة.",
            })}
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonateButton size="lg">{t({ en: "Give to Our Missions", ar: "تبرّع لمهامّنا" })}</DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
