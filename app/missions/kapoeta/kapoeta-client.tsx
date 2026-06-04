"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
  type Variants,
} from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { GoalMeter } from "@/components/goal-meter";
import { DonateButton } from "@/components/donate-button";
import { TrustStrip } from "@/components/trust-strip";
import { Baby, Droplets, Egg, HeartHandshake, Sun, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { DELIVERED, DELIVERED_TOTAL, type Goal, type GoalId } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { useT, type Dict } from "@/lib/i18n";

interface Props {
  totals: Record<string, { raised: number; supporters: number }> | null;
  goals: Goal[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Verified timeline (from KAPOETA-FACTS.md) ─────────────── */

const TIMELINE: { period: Dict<string>; title: Dict<string>; body: Dict<string> }[] = [
  {
    period: { en: "Before 2024", ar: "قبل 2024" },
    title: { en: "The Land & First Foundations", ar: "الأرض والأسس الأولى" },
    body: {
      en: "Triple L Orphanage and Vulnerable Children Organization, the local entity in Kapoeta, was granted a 20,000 m² parcel (100 m × 200 m) by local authorities. The site was fenced — funded by a supporting family in the United States — a water well was drilled with support from Toongabbie Church and its members, and toilets and a small initial structure were built.",
      ar: "مُنحت منظمة Triple L للأيتام والأطفال المستضعفين، وهي الجهة المحلية في كاپويتا، قطعة أرض مساحتها 20,000 م² (100 م × 200 م) من السلطات المحلية. سُيّجت الأرض — بتمويل من عائلة داعمة في الولايات المتحدة — وحُفر بئر للمياه بدعم من كنيسة تونغابي وأعضائها، وبُنيت دورات مياه ومبنى أوّليّ صغير.",
    },
  },
  {
    period: { en: "May–June 2024", ar: "مايو–يونيو 2024" },
    title: { en: "The Sydney Fundraiser", ar: "حملة التبرّعات في سيدني" },
    body: {
      en: "Brother Hakim's calling drew the attention of believers in Australian churches. On 8 June 2024, Toongabbie Church hosted a fundraising event in Sydney. Within weeks, approximately AU$85,000 was raised — enough to commission a 40-foot shipping container.",
      ar: "لفتت دعوة الأخ حكيم انتباه المؤمنين في الكنائس الأسترالية. وفي 8 يونيو 2024، استضافت كنيسة تونغابي فعالية لجمع التبرّعات في سيدني. وخلال أسابيع، جُمع نحو AU$85,000 — ما يكفي لتجهيز حاوية شحن طولها 40 قدمًا.",
    },
  },
  {
    period: { en: "September–October 2024", ar: "سبتمبر–أكتوبر 2024" },
    title: { en: "Container Dispatched from Sydney", ar: "إرسال الحاوية من سيدني" },
    body: {
      en: "The container was packed in Sydney by volunteers including Elders Mamdouh Mansour, Philip Hanna, engineer Michael Elmasri, Emil Girgis and many others — and shipped via Mombasa, Kenya, then by road through Nadapal to Kapoeta South.",
      ar: "عبّأ المتطوّعون الحاوية في سيدني، ومنهم الشيخان Mamdouh Mansour وPhilip Hanna، والمهندس Michael Elmasri، وEmil Girgis وكثيرون غيرهم — ثم شُحنت عبر مومباسا في كينيا، ومنها برًّا عبر نادابال إلى كاپويتا الجنوبية.",
    },
  },
  {
    period: { en: "December 2024", ar: "ديسمبر 2024" },
    title: { en: "Construction & Completion", ar: "البناء والإنجاز" },
    body: {
      en: "A team from Sydney travelled to Kapoeta — joined by supporters from the United States and the United Kingdom. All trip expenses were paid by the individuals themselves. Together they completed the 16 m × 9 m main building and put the container's contents to use.",
      ar: "سافر فريق من سيدني إلى كاپويتا — انضمّ إليه داعمون من الولايات المتحدة والمملكة المتحدة. ودفع كلٌّ منهم نفقات رحلته بنفسه. وأنجزوا معًا المبنى الرئيسي بمساحة 16 م × 9 م، ووضعوا محتويات الحاوية قيد الاستخدام.",
    },
  },
  {
    period: { en: "January 2025", ar: "يناير 2025" },
    title: { en: "Sustainability Projects", ar: "مشاريع الاستدامة" },
    body: {
      en: "Beyond the building, donations funded 5 cows and a young bull for a small dairy, a domestic oven for the on-site bakery, a tuk-tuk for transport, and two manual cement-block machines. Foundations were laid for a future water tank tower.",
      ar: "إلى جانب المبنى، موّلت التبرّعات 5 أبقار وعجلًا صغيرًا لمزرعة ألبان صغيرة، وفرنًا منزليًا لمخبز الموقع، وتُكتُك للنقل، وآلتين يدويّتين لصناعة الطوب الإسمنتي. ووُضعت الأسس لبرج خزان مياه مستقبلي.",
    },
  },
  {
    period: { en: "Today", ar: "اليوم" },
    title: { en: "70 Children in Our Care", ar: "70 طفلاً في رعايتنا" },
    body: {
      en: "The shelter now cares for 70 children. The youngest are taught at the centre during the week, and 46 children are enrolled in the local Catholic school system for the 2026 academic year — uniforms, fees and registration paid through the shelter. That number keeps growing.",
      ar: "يرعى الملجأ الآن 70 طفلاً. يتعلّم أصغرهم في المركز خلال الأسبوع، و46 طفلاً مسجّلون في نظام المدرسة الكاثوليكية المحلية للعام الدراسي 2026 — وتُدفع تكاليف الزيّ المدرسي والرسوم والتسجيل عبر الملجأ. وهذا العدد في ازدياد مستمر.",
    },
  },
];

const GOAL_ICONS: Record<GoalId, React.ElementType> = {
  "sponsor-a-child": Baby,
  "solar-system": Sun,
  "chicken-coop": Egg,
  "water-pump": Droplets,
  "ongoing-operations": HeartHandshake,
};

const GOAL_META: Record<GoalId, { priority: number; why: Dict<string> }> = {
  "solar-system": {
    priority: 1,
    why: {
      en: "A complete solar system to power the deep-water pump and bring reliable light and electricity to the whole centre — the biggest step toward self-sufficiency.",
      ar: "نظام طاقة شمسية متكامل لتشغيل مضخة المياه العميقة وتوفير إضاءة وكهرباء موثوقة للمركز بأكمله — أكبر خطوة نحو الاكتفاء الذاتي.",
    },
  },
  "sponsor-a-child": {
    priority: 2,
    why: {
      en: "A$600 covers one child's full year — meals, shelter, schooling, and the dignity of belonging. Of the 70 children in our care, 46 are now in school. 24 names are still waiting for sponsorship.",
      ar: "يغطّي مبلغ A$600 عامًا كاملاً لطفل واحد — الطعام والمأوى والتعليم وكرامة الانتماء. من بين 70 طفلاً في رعايتنا، 46 الآن في المدرسة. وما زال 24 اسمًا في انتظار الكفالة.",
    },
  },
  "chicken-coop": {
    priority: 3,
    why: {
      en: "A predator-safe coop and 200 chicks. Daily eggs for growing children and a little income from the surplus — food that renews itself every day.",
      ar: "حظيرة آمنة من الحيوانات المفترسة و200 كتكوت. بيض يوميّ للأطفال الذين ينمون، ودخل بسيط من الفائض — غذاء يتجدّد كل يوم.",
    },
  },
  "water-pump": {
    priority: 4,
    why: {
      en: "The deep well is already drilled. An electric pump will draw clean water for drinking, cooking and the gardens — ending the daily haul by hand.",
      ar: "البئر العميق محفور بالفعل. وستضخّ مضخة كهربائية مياهًا نظيفة للشرب والطهي والحدائق — منهيةً الجلب اليومي باليد.",
    },
  },
  "ongoing-operations": {
    priority: 5,
    why: {
      en: "Stipends for the matron and evangelist, school fees and uniforms, food, medical care — the day-to-day costs of a children's shelter, beyond any single project.",
      ar: "رواتب للمشرفة والمبشّر، ورسوم مدرسية وأزياء، وطعام، ورعاية طبية — النفقات اليومية لملجأ أطفال، فيما يتجاوز أيّ مشروع بعينه.",
    },
  },
};

/* ─── Animated counter ───────────────────────────────────────── */

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (inView) animate(motionVal, value, { duration: 1.8 });
  }, [inView, motionVal, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = prefix + Math.floor(v).toLocaleString() + suffix;
    });
  }, [spring, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ─── Hero ───────────────────────────────────────────────────── */

function HeroSection() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/kapoeta/field/children-large-group-activity-kapoeta.jpg"
          alt={t({
            en: "Children gathered together at the Kapoeta Children's Shelter, South Sudan",
            ar: "أطفال مجتمعون في ملجأ كاپويتا للأطفال، جنوب السودان",
          })}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/90 via-[#1e293b]/40 to-[#1e293b]/10" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
            <Link href="/missions" className="text-[#C4AE9A] text-sm hover:text-white transition-colors">
              {t({ en: "Missions", ar: "مهامّنا" })}
            </Link>
            <span className="text-[#6B5A52]">/</span>
            <span className="text-white/80 text-sm">{t({ en: "Kapoeta, South Sudan", ar: "كاپويتا، جنوب السودان" })}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-light text-white leading-[1.05] mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: <>Kapoeta<br />Children&apos;s Shelter</>,
              ar: <>ملجأ كاپويتا<br />للأطفال</>,
            })}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#C4AE9A] text-xl sm:text-2xl max-w-xl leading-relaxed font-light">
            {t({
              en: "A children's home in South Sudan — built by a community of believers across four continents.",
              ar: "بيت للأطفال في جنوب السودان — بناه مجتمع من المؤمنين عبر أربع قارّات.",
            })}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Chapter 1: The Calling ─────────────────────────────────── */

function StoryChapter1() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="py-24 px-4 bg-[#f5f5f4]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Replace with hakim-peter-compound-kapoeta.jpg once uploaded */}
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src="/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg"
              alt={t({
                en: "Children gathered at the Kapoeta shelter — the community Brother Hakim built from nothing",
                ar: "أطفال مجتمعون في ملجأ كاپويتا — المجتمع الذي بناه الأخ حكيم من لا شيء",
              })}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            {t({ en: "Chapter 1 — The Calling", ar: "الفصل 1 — الدعوة" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "A native son returns home.", ar: "ابنٌ من أبناء البلد يعود إلى وطنه." })}
          </motion.h2>
          <motion.div variants={fadeUp} className="space-y-5 text-[#374151] text-lg leading-relaxed">
            <p>
              {t({
                en: "Brother Hakim is a native of Kapoeta who, like so many in his generation, had migrated to the United States in search of a different life. In response to a clear calling, he returned in 2020 — leaving the United States and his family behind — to the streets where he had grown up.",
                ar: "الأخ حكيم من أبناء كاپويتا، وقد هاجر، مثل كثيرين من جيله، إلى الولايات المتحدة بحثًا عن حياة مختلفة. واستجابةً لدعوة واضحة، عاد عام 2020 — تاركًا الولايات المتحدة وعائلته — إلى الشوارع التي نشأ فيها.",
              })}
            </p>
            <p>
              {t({
                en: "He found children there: approximately 320 boys and girls, sleeping near the local market, wearing tattered clothes, eating from trash bins, with no access to school. Hakim began with what he had — gathering them by day to teach Bible stories and hymns, share one meal, and offer the safety of presence.",
                ar: "هناك وجد الأطفال: نحو 320 من الأولاد والبنات، ينامون قرب السوق المحلي، يرتدون ثيابًا رثّة، يأكلون من صناديق القمامة، بلا فرصة للالتحاق بالمدرسة. وبدأ حكيم بما لديه — يجمعهم نهارًا ليعلّمهم قصص الكتاب المقدس والتراتيل، ويتقاسم معهم وجبة واحدة، ويمنحهم أمان الحضور.",
              })}
            </p>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="mt-8 pl-6 border-l-2 border-[#C9952A] italic text-[#374151] text-lg"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: "“What began as an effort to help children living on the streets — wearing tattered clothes, eating from trash bins, and with no access to education — has now become a thriving centre of hope and transformation.”",
              ar: "«ما بدأ جهدًا لمساعدة أطفال يعيشون في الشوارع — يرتدون ثيابًا رثّة، ويأكلون من صناديق القمامة، بلا فرصة للتعليم — صار اليوم مركزًا مزدهرًا للأمل والتحوّل.»",
            })}
            <cite className="block mt-3 text-sm text-[#6b7280] not-italic">
              {t({ en: "— Vision of Hope, Kapoeta", ar: "— رؤية الأمل، كاپويتا" })}
            </cite>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats strip ────────────────────────────────────────────── */

function StatsStrip() {
  const t = useT();
  const stats = [
    { value: 320, suffix: "", label: { en: "Children first gathered from the streets", ar: "أطفال جُمِعوا أوّلًا من الشوارع" } },
    { value: 70, suffix: "", label: { en: "Children currently in our care", ar: "أطفال في رعايتنا حاليًا" } },
    { value: 46, suffix: "", label: { en: "Children in school for 2026", ar: "أطفال في المدرسة لعام 2026" } },
    { value: 85000, prefix: "A$", suffix: "", label: { en: "Raised in opening campaign", ar: "جُمعت في الحملة الافتتاحية" } },
  ];

  return (
    <section className="bg-[#1e293b] py-16 px-4">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {stats.map((s) => (
          <motion.div key={s.label.en} variants={fadeUp}>
            <div
              className="text-3xl sm:text-4xl font-light mb-2 tabular-nums"
              style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
            >
              <Counter value={s.value} prefix={"prefix" in s ? (s as { prefix: string }).prefix : ""} suffix={s.suffix} />
            </div>
            <div className="text-xs sm:text-sm text-[#9A8578] uppercase tracking-wider leading-snug">
              {t(s.label)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Chapter 2: The Container ───────────────────────────────── */

function StoryChapter2() {
  const t = useT();
  const containerContents: Dict<string>[] = [
    {
      en: "Building materials — steel structure, zinc roofing, 8 windows for the main 16 m × 9 m building",
      ar: "مواد بناء — هيكل فولاذي، وأسقف من الزنك، و8 نوافذ للمبنى الرئيسي بمساحة 16 م × 9 م",
    },
    { en: "33 bunk beds, mattresses, sheets and blankets", ar: "33 سريرًا بطابقين، ومراتب، وملاءات، وبطّانيات" },
    { en: "Clothing for all ages", ar: "ملابس لجميع الأعمار" },
    { en: "Solar-powered lamps and an electricity generator", ar: "مصابيح تعمل بالطاقة الشمسية ومولّد كهرباء" },
    { en: "Medical supplies, including 6 wheelchairs", ar: "مستلزمات طبية، منها 6 كراسٍ متحرّكة" },
    { en: "Educational materials — books, stationery, toys", ar: "مواد تعليمية — كتب، وقرطاسية، وألعاب" },
    { en: "Food supplies sufficient for 4–6 months", ar: "مؤن غذائية تكفي 4–6 أشهر" },
    { en: "120 chairs, folding tables, TV and PA system", ar: "120 كرسيًا، وطاولات قابلة للطيّ، وتلفاز، ونظام صوت" },
  ];

  return (
    <section className="py-24 px-4 bg-[#e7e5e4]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="max-w-3xl mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            {t({ en: "Chapter 2 — The Container", ar: "الفصل 2 — الحاوية" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "A 40-foot box, packed in Sydney.", ar: "صندوق طوله 40 قدمًا، عُبّئ في سيدني." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#374151] text-lg leading-relaxed">
            {t({
              en: "From May 2024, believers in Australia raised approximately AU$85,000 in a few weeks. The funds were used to purchase, fill, and ship a 40-foot container from Sydney to Mombasa, Kenya — and onward by road through Nadapal to Kapoeta South. Engineer Michael Elmasri designed the on-site building. Elders Mamdouh Mansour and Philip Hanna, along with many other Sydney volunteers, organised the loading and logistics.",
              ar: "منذ مايو 2024، جمع المؤمنون في أستراليا نحو AU$85,000 في غضون أسابيع قليلة. واستُخدمت الأموال لشراء حاوية طولها 40 قدمًا وتعبئتها وشحنها من سيدني إلى مومباسا في كينيا — ومنها برًّا عبر نادابال إلى كاپويتا الجنوبية. صمّم المهندس Michael Elmasri مبنى الموقع. ونظّم الشيخان Mamdouh Mansour وPhilip Hanna، إلى جانب كثير من متطوّعي سيدني، عملية التحميل واللوجستيات.",
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={scaleIn}>
            <ContainerCarousel />
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="text-2xl font-semibold text-[#1e293b] mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "What was inside", ar: "ما كان بداخلها" })}
            </h3>
            <ul className="space-y-3">
              {containerContents.map((item) => (
                <li key={item.en} className="flex gap-3 text-[#374151] leading-relaxed">
                  <span className="text-[#C9952A] flex-shrink-0 mt-1">●</span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Chapter 3: Building & Growth (verified timeline) ───────── */

function StoryChapter3() {
  const t = useT();
  return (
    <section className="py-24 px-4 bg-[#f5f5f4]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-14 max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            {t({ en: "Chapter 3 — Building & Growth", ar: "الفصل 3 — البناء والنموّ" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "How a building rose, and a shelter took shape.", ar: "كيف نهض مبنى، وتشكّل ملجأ." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] leading-relaxed">
            {t({
              en: "Each step is taken from the project's own documents — the Vision report, sponsor letters, and the January 2025 Final Report.",
              ar: "كل خطوة مأخوذة من وثائق المشروع نفسها — تقرير الرؤية، ورسائل الكافلين، والتقرير الختامي لشهر يناير 2025.",
            })}
          </motion.p>
        </motion.div>

        <motion.ol
          className="relative space-y-10 border-l-2 border-[#C9952A]/30 pl-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {TIMELINE.map((step) => (
            <motion.li key={step.period.en} variants={fadeUp} className="relative">
              <span className="absolute -left-[42px] top-1.5 w-4 h-4 rounded-full bg-[#C9952A] ring-4 ring-[#f5f5f4]" />
              <div className="text-xs uppercase tracking-widest text-[#6366f1] font-semibold mb-1">
                {t(step.period)}
              </div>
              <h3
                className="text-xl sm:text-2xl text-[#1e293b] mb-2 font-semibold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t(step.title)}
              </h3>
              <p className="text-[#374151] leading-relaxed">{t(step.body)}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ─── On the ground today ────────────────────────────────────── */

function OnTheGround() {
  const t = useT();
  const items: { title: Dict<string>; role: Dict<string>; body: Dict<string> }[] = [
    {
      title: { en: "Madam Jackie", ar: "السيدة Jackie" },
      role: { en: "Matron", ar: "المشرفة" },
      body: {
        en: "Serves as a maternal figure and mentor for the older girls and the youngest children. The presence the children miss most when she is not there.",
        ar: "تقوم بدور الأمّ والمرشدة للفتيات الأكبر سنًّا وأصغر الأطفال. وهي الحضور الذي يفتقده الأطفال أكثر من غيره حين تغيب.",
      },
    },
    {
      title: { en: "Evangelist Simon", ar: "المبشّر Simon" },
      role: { en: "Spiritual Ministry", ar: "الخدمة الروحية" },
      body: {
        en: "Leads spiritual formation at the centre and Sunday gatherings, with all of the surrounding community welcome.",
        ar: "يقود التكوين الروحي في المركز ولقاءات الأحد، وأبواب المركز مفتوحة لكل أهل المنطقة المحيطة.",
      },
    },
    {
      title: { en: "Catholic School Partnership", ar: "شراكة المدرسة الكاثوليكية" },
      role: { en: "Education", ar: "التعليم" },
      body: {
        en: "46 children are enrolled in the local Catholic school system for the 2026 academic year. Uniforms, fees and registration are funded through the shelter.",
        ar: "46 طفلاً مسجّلون في نظام المدرسة الكاثوليكية المحلية للعام الدراسي 2026. وتُموَّل تكاليف الزيّ المدرسي والرسوم والتسجيل عبر الملجأ.",
      },
    },
    {
      title: { en: "On-site Preschool", ar: "روضة في الموقع" },
      role: { en: "Early Years", ar: "السنوات المبكرة" },
      body: {
        en: "The youngest, preschool-age children are educated at the centre by the team during the week.",
        ar: "يتعلّم أصغر الأطفال في سنّ ما قبل المدرسة في المركز على يد الفريق خلال الأسبوع.",
      },
    },
    {
      title: { en: "Dairy & Bakery", ar: "الألبان والمخبز" },
      role: { en: "Sustainability", ar: "الاستدامة" },
      body: {
        en: "5 cows and a young bull supply milk; surplus is sold. A domestic oven bakes daily bread for the children, with surplus also sold.",
        ar: "توفّر 5 أبقار وعجل صغير الحليب؛ ويُباع الفائض. ويخبز فرن منزلي خبزًا يوميًّا للأطفال، ويُباع الفائض أيضًا.",
      },
    },
    {
      title: { en: "Triple L Orphanage", ar: "منظمة Triple L للأيتام" },
      role: { en: "Local Partner", ar: "الشريك المحلي" },
      body: {
        en: "The on-ground legal entity in Kapoeta — owners of the land — through whom the work is carried out, with Simon Dador as Legal Advisor.",
        ar: "الجهة القانونية الميدانية في كاپويتا — وهي مالكة الأرض — التي يُنفَّذ العمل من خلالها، ويتولّى Simon Dador منصب المستشار القانوني.",
      },
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#e7e5e4]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-14 max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            {t({ en: "On the ground", ar: "في الميدان" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "The people who make the days work.", ar: "أناسٌ تسير الأيام بهم." })}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {items.map((it) => (
            <motion.div
              key={it.title.en}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-[#d6d3d1] shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-xs text-[#6366f1] uppercase tracking-widest font-semibold mb-2">
                {t(it.role)}
              </div>
              <h3
                className="text-xl font-semibold text-[#1e293b] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t(it.title)}
              </h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">{t(it.body)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Container Carousel ─────────────────────────────────────── */

function ContainerCarousel() {
  const t = useT();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides: { src: string; caption: Dict<string> }[] = [
    {
      src: "/images/kapoeta/field/container-contents-mattresses-materials.jpg",
      caption: { en: "Mattresses packed in Sydney, bound for Kapoeta", ar: "مراتب عُبّئت في سيدني، في طريقها إلى كاپويتا" },
    },
    {
      src: "/images/kapoeta/field/cooking-pots-donated-australia.jpg",
      caption: { en: "Donated cookware — every pot shipped from Australia", ar: "أدوات طهي مُهداة — كل قدر شُحن من أستراليا" },
    },
    {
      src: "/images/kapoeta/field/food-supplies-bags-rice-beans.jpg",
      caption: { en: "Rice and beans — months of food for the children", ar: "أرز وفاصوليا — أشهر من الطعام للأطفال" },
    },
    {
      src: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
      caption: { en: "The steel frame going up on site", ar: "الهيكل الفولاذي يرتفع في الموقع" },
    },
    {
      src: "/images/kapoeta/field/shelter-brickwall-construction-progress.jpg",
      caption: { en: "Brick by brick — walls built by hand", ar: "لبنةً فلبنة — جدران بُنيت باليد" },
    },
    {
      src: "/images/kapoeta/field/shelter-brickwall-steel-frame-kapoeta.jpg",
      caption: { en: "Brick walls meet steel frame", ar: "الجدران الطوبية تلتقي بالهيكل الفولاذي" },
    },
    {
      src: "/images/kapoeta/field/shelter-steel-frame-exterior-kapoeta.jpg",
      caption: { en: "The completed building from outside", ar: "المبنى المكتمل من الخارج" },
    },
    {
      src: "/images/kapoeta/field/bunkbeds-assembled-outdoor-kapoeta.jpg",
      caption: { en: "Bunkbeds assembled and ready to move in", ar: "الأسرّة المزدوجة جاهزة للاستخدام" },
    },
    {
      src: "/images/kapoeta/field/bunkbeds-dormitory-interior-kapoeta-2.jpg",
      caption: { en: "The dormitory inside — a bed for every child", ar: "المهجع من الداخل — سرير لكل طفل" },
    },
    {
      src: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
      caption: { en: "A gathering space and a home", ar: "مساحة للتجمّع وبيت" },
    },
  ];

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  };

  const variants: Variants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl select-none">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40) paginate(1);
            else if (info.offset.x > 40) paginate(-1);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={slides[current].src}
            alt={t(slides[current].caption)}
            fill
            className="object-cover object-center pointer-events-none"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
          <p className="absolute bottom-12 left-4 right-12 text-white text-sm font-medium leading-snug pointer-events-none">
            {t(slides[current].caption)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        aria-label="Previous photo"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        aria-label="Next photo"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`rounded-full transition-all duration-200 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/45 hover:bg-white/70"}`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 right-4 z-10 text-white/70 text-xs tabular-nums">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}

/* ─── Gallery ────────────────────────────────────────────────── */

function Gallery() {
  const t = useT();
  // Each image is a distinct moment — ordered as a story arc
  const images: { src: string; alt: Dict<string>; caption: Dict<string> }[] = [
    {
      src: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg",
      alt: { en: "A young child eating rice from a bowl", ar: "طفل صغير يأكل الأرز من وعاء" },
      caption: { en: "A child found on the streets", ar: "طفل وُجد في الشوارع" },
    },
    {
      src: "/images/kapoeta/field/child-sibling-carrying-baby-kapoeta.jpg",
      alt: { en: "An older child carrying a baby sibling", ar: "طفل أكبر سنًّا يحمل رضيعًا" },
      caption: { en: "Brothers and sisters", ar: "إخوة وأخوات" },
    },
    {
      src: "/images/kapoeta/field/children-sitting-bench-kapoeta.jpg",
      alt: { en: "Children sitting on a bench together at the Kapoeta shelter", ar: "أطفال يجلسون على مقعد معًا في ملجأ كاپويتا" },
      caption: { en: "A quiet moment", ar: "لحظة هادئة" },
    },
    {
      src: "/images/kapoeta/field/children-sitting-bench-kapoeta-2.jpg",
      alt: { en: "Children together on a bench at the shelter compound", ar: "أطفال معًا على مقعد في مجمّع الملجأ" },
      caption: { en: "All together", ar: "معًا جميعًا" },
    },
    {
      src: "/images/kapoeta/field/child-tricycle-wheelchair-kapoeta.jpg",
      alt: { en: "A child on a tricycle or wheelchair at the Kapoeta shelter — medical supplies were shipped from Australia", ar: "طفل على درّاجة ثلاثية أو كرسي متحرّك في ملجأ كاپويتا — شُحنت المستلزمات الطبية من أستراليا" },
      caption: { en: "Every child cared for", ar: "كل طفل في رعاية" },
    },
    {
      src: "/images/kapoeta/field/tukul-mud-hut-construction-kapoeta.jpg",
      alt: { en: "A traditional tukul mud hut being constructed — the kind of shelter many children had before", ar: "كوخ طيني تقليدي قيد الإنشاء — نوع المأوى الذي كان لدى كثير من الأطفال من قبل" },
      caption: { en: "Before the shelter", ar: "قبل الملجأ" },
    },
    {
      src: "/images/kapoeta/field/community-hall-chairs-interior-kapoeta.jpg",
      alt: { en: "The interior of the community hall at the Kapoeta shelter with rows of chairs", ar: "داخل قاعة المجتمع في ملجأ كاپويتا مع صفوف من الكراسي" },
      caption: { en: "The community space", ar: "مساحة المجتمع" },
    },
    {
      src: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",
      alt: { en: "Children gathered in a circle under a tree for a structured activity", ar: "أطفال مجتمعون في دائرة تحت شجرة لنشاط منظّم" },
      caption: { en: "Together every day", ar: "معًا كل يوم" },
    },
    {
      src: "/images/kapoeta/field/children-outdoor-activity-kapoeta.jpg",
      alt: { en: "Children in an outdoor activity in the shelter compound, Kapoeta", ar: "أطفال في نشاط خارجي في مجمّع الملجأ، كاپويتا" },
      caption: { en: "In the compound", ar: "في المجمّع" },
    },
    {
      src: "/images/kapoeta/field/children-coloring-activity-kapoeta.jpg",
      alt: { en: "Children coloring together at the Kapoeta Children's Shelter", ar: "أطفال يلوّنون معًا في ملجأ كاپويتا للأطفال" },
      caption: { en: "Coloring together", ar: "نلوّن معًا" },
    },
    {
      src: "/images/kapoeta/field/children-drawing-activity-outdoor-kapoeta.jpg",
      alt: { en: "Children crouched around paper doing an outdoor drawing activity under tree shade", ar: "أطفال ينحنون على أوراق في نشاط رسم خارجي تحت ظل الأشجار" },
      caption: { en: "Drawing and learning", ar: "يرسمون ويتعلّمون" },
    },
    {
      src: "/images/kapoeta/field/children-toys-activity-kapoeta.jpg",
      alt: { en: "Children playing with donated toys at the Kapoeta shelter", ar: "أطفال يلعبون بألعاب مُهداة في ملجأ كاپويتا" },
      caption: { en: "Play is learning", ar: "اللعب تعلّم" },
    },
    {
      src: "/images/kapoeta/field/children-playing-mats-evening-kapoeta.jpg",
      alt: { en: "Children playing on mats in the evening at the Kapoeta shelter", ar: "أطفال يلعبون على الحصائر في المساء في ملجأ كاپويتا" },
      caption: { en: "Evening play", ar: "اللعب المسائي" },
    },
    {
      src: "/images/kapoeta/field/children-playing-mats-evening-kapoeta-2.jpg",
      alt: { en: "Children enjoying themselves on mats together as the sun goes down in Kapoeta", ar: "أطفال يستمتعون معًا على الحصائر مع غروب الشمس في كاپويتا" },
      caption: { en: "Joy in simple things", ar: "الفرح في الأشياء البسيطة" },
    },
    {
      src: "/images/kapoeta/field/children-group-sunset-kapoeta.jpg",
      alt: { en: "A group of children at the Kapoeta shelter at golden hour — safe, together, at peace", ar: "مجموعة من الأطفال في ملجأ كاپويتا في ساعة الذهب — آمنون، معًا، في سلام" },
      caption: { en: "End of the day", ar: "نهاية اليوم" },
    },
    {
      src: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
      alt: { en: "Children in school uniforms at the Kapoeta shelter — 46 enrolled in the Catholic school system for 2026", ar: "أطفال بالزيّ المدرسي في ملجأ كاپويتا — 46 ملتحقًا بالمدرسة الكاثوليكية لعام 2026" },
      caption: { en: "Going to school", ar: "ذاهبون إلى المدرسة" },
    },
    {
      src: "/images/kapoeta/field/girl-child-water-pump-kapoeta.jpg",
      alt: { en: "A young girl collecting water at the pump on the Kapoeta shelter grounds", ar: "فتاة صغيرة تجمع الماء من المضخة في أرض ملجأ كاپويتا" },
      caption: { en: "Clean water on site", ar: "مياه نظيفة في الموقع" },
    },
    {
      src: "/images/people/mamdouh-mansour-cornfield-kapoeta.jpg",
      alt: { en: "A thriving maize crop growing on the shelter grounds", ar: "محصول ذرة مزدهر ينمو في أرض الملجأ" },
      caption: { en: "Growing their own food", ar: "يزرعون طعامهم" },
    },
    {
      src: "/images/kapoeta/field/girl-child-yellow-dress-holding-paper.jpg",
      alt: { en: "A small girl in a bright yellow dress holding a piece of paper — learning every day in Kapoeta", ar: "فتاة صغيرة بفستان أصفر زاهٍ تحمل ورقة — تتعلّم كل يوم في كاپويتا" },
      caption: { en: "Learning every day", ar: "تتعلّم كل يوم" },
    },
    {
      src: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg",
      alt: { en: "A volunteer from Australia teaching children at the Kapoeta shelter", ar: "متطوّعة من أستراليا تعلّم الأطفال في ملجأ كاپويتا" },
      caption: { en: "Teaching together", ar: "نتعلّم معًا" },
    },
    {
      src: "/images/kapoeta/field/visitor-women-session-children-kapoeta.jpg",
      alt: { en: "Visitors from Australia leading an activity session with children at the Kapoeta shelter at dusk", ar: "زوّار من أستراليا يقودون جلسة نشاط مع الأطفال في ملجأ كاپويتا عند الغسق" },
      caption: { en: "Partners from four continents", ar: "شركاء من أربع قارّات" },
    },
    {
      src: "/images/kapoeta/field/tribal-women-visitors-kapoeta.jpg",
      alt: { en: "Tribal women from the local community welcoming visitors to the Kapoeta shelter", ar: "نساء من القبيلة المحلية يرحّبن بالزوّار في ملجأ كاپويتا" },
      caption: { en: "Community welcomes visitors", ar: "المجتمع يرحّب بالزوّار" },
    },
    {
      src: "/images/people/mamdouh-mansour-children-kapoeta.jpg",
      alt: { en: "Elder Mamdouh Mansour with the children at the Kapoeta shelter — one of the Sydney volunteers who organised the container", ar: "الشيخ Mamdouh Mansour مع الأطفال في ملجأ كاپويتا — أحد متطوّعي سيدني الذين نظّموا شحن الحاوية" },
      caption: { en: "Elder Mamdouh with the children", ar: "الشيخ Mamdouh مع الأطفال" },
    },
    {
      src: "/images/people/mamdouh-mansour-kapoeta-field-2.jpg",
      alt: { en: "Mamdouh Mansour in the field in Kapoeta, South Sudan", ar: "Mamdouh Mansour في الميدان في كاپويتا، جنوب السودان" },
      caption: { en: "On the ground in Kapoeta", ar: "في الميدان في كاپويتا" },
    },
    {
      src: "/images/people/mamdouh-mansour-kapoeta-field-3.jpg",
      alt: { en: "Community partner Mamdouh Mansour in the Kapoeta compound", ar: "الشريك المجتمعي Mamdouh Mansour في مجمّع كاپويتا" },
      caption: { en: "Community partners", ar: "شركاء مجتمعيون" },
    },
    {
      src: "/images/people/mamdouh-child-woman-selfie-kapoeta.jpg",
      alt: { en: "Mamdouh Mansour sharing a joyful moment with a child and a woman at the shelter", ar: "Mamdouh Mansour يتقاسم لحظة بهيجة مع طفل وامرأة في الملجأ" },
      caption: { en: "Shared joy", ar: "فرح مشترك" },
    },
    {
      src: "/images/people/mamdouh-woman-child-selfie-kapoeta.jpg",
      alt: { en: "A warm moment between Mamdouh, a woman and a child — connection across continents", ar: "لحظة دافئة بين Mamdouh وامرأة وطفل — تواصل عبر القارّات" },
      caption: { en: "Connection across continents", ar: "تواصل عبر القارّات" },
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#1e293b] overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="mb-10">
          <p className="text-[#C9952A] text-sm uppercase tracking-widest mb-3 font-medium">{t({ en: "From the field", ar: "من الميدان" })}</p>
          <h2
            className="text-3xl font-light text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "A few moments from Kapoeta.", ar: "لحظات قليلة من كاپويتا." })}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {images.map((img) => (
            <motion.div
              key={img.src}
              variants={scaleIn}
              className="relative overflow-hidden rounded-xl group aspect-[4/3] sm:aspect-[3/2]"
            >
              <Image
                src={img.src}
                alt={t(img.alt)}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {/* Persistent caption strip at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e293b]/85 to-transparent pt-8 pb-3 px-3">
                <p className="text-white text-xs font-medium">{t(img.caption)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Already delivered (achievements) ───────────────────────── */

function Achievements() {
  const t = useT();
  return (
    <section className="py-24 px-4 bg-[#f5f5f4]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-12 max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
            {t({ en: "Already delivered", ar: "ما أُنجز فعلاً" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: <>{formatAUDFull(DELIVERED_TOTAL)} already turned into a real home.</>,
              ar: <>{formatAUDFull(DELIVERED_TOTAL)} تحوّلت بالفعل إلى بيت حقيقي.</>,
            })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] leading-relaxed">
            {t({
              en: "Every figure below is a project the community has already funded and completed. This is the track record behind the 2026 goals.",
              ar: "كل رقم في ما يلي يمثّل مشروعًا موّله المجتمع وأنجزه بالفعل. هذا هو السجلّ الذي تستند إليه أهداف 2026.",
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {DELIVERED.map((d) => (
            <motion.div
              key={d.title}
              variants={fadeUp}
              className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#d6d3d1] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#C9952A] flex-shrink-0" strokeWidth={2} />
                <span className="text-[#374151] text-sm leading-snug">{d.title}</span>
              </div>
              <span className="text-sm font-semibold text-[#1e293b] tabular-nums flex-shrink-0">
                {formatAUDFull(d.amount)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Tiered donations ───────────────────────────────────────── */

function DonationsSection({ goals, totals }: Props) {
  const t = useT();
  const sorted = [...goals].sort(
    (a, b) => (GOAL_META[a.id]?.priority ?? 99) - (GOAL_META[b.id]?.priority ?? 99)
  );

  return (
    <section className="py-24 px-4 bg-[#1e293b] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] via-[#2A1F18] to-[#1e293b] opacity-90" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#C9952A] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            {t({ en: "How to help", ar: "كيف تساعد" })}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "The 2026 goals.", ar: "أهداف 2026." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#9A8578] leading-relaxed">
            {t({
              en: "Each goal stands on its own. Together they sustain the shelter and grow it.",
              ar: "كل هدف قائم بذاته. ومعًا تُبقي هذه الأهداف الملجأ قائمًا وتنمّيه.",
            })}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {sorted.map((goal) => {
            const meta = GOAL_META[goal.id];
            const GoalIcon = GOAL_ICONS[goal.id];
            const live = totals?.[goal.id];
            return (
              <motion.div
                key={goal.id}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative bg-white rounded-2xl p-6 sm:p-8 border border-[#d6d3d1] shadow-lg flex flex-col"
              >
                {/* Priority badge */}
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#C9952A] to-[#E4B84A] text-[#1e293b] text-xs font-bold tracking-wider uppercase shadow-md">
                  {t({ en: <>Priority {meta.priority}</>, ar: <>أولوية {meta.priority}</> })}
                </div>

                <div className="flex items-start gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {GoalIcon && <GoalIcon size={20} className="text-[#6366f1]" strokeWidth={1.75} />}
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-semibold text-[#1e293b] leading-tight"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {goal.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[#6b7280] text-sm leading-relaxed mb-5 flex-grow">{t(meta.why)}</p>

                <div className="mb-6">
                  <GoalMeter
                    goal={goal}
                    raised={live?.raised}
                    supporters={live?.supporters}
                  />
                </div>

                <Link
                  href={goal.kind === "bundle" ? `/donate/${goal.id}/parts` : `/donate/${goal.id}`}
                  className="inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors"
                >
                  {goal.kind === "bundle"
                    ? t({ en: "See the breakdown →", ar: "اطّلع على التفاصيل ←" })
                    : t({ en: "Donate to This Goal →", ar: "تبرّع لهذا الهدف ←" })}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────── */

function FinalCTA() {
  const t = useT();
  return (
    <section className="py-24 px-4 bg-[#e7e5e4] text-center">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t({ en: "Join the story.", ar: "كن جزءًا من القصة." })}
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#6b7280] text-lg mb-8 leading-relaxed">
          {t({
            en: "A one-off gift, a monthly partnership, or a sponsored child — every contribution becomes someone's breakfast, school uniform, or first safe night.",
            ar: "تبرّع لمرة واحدة، أو شراكة شهرية، أو كفالة طفل — كل مساهمة تصير فطور أحدهم، أو زيّه المدرسي، أو ليلته الأولى الآمنة.",
          })}
        </motion.p>
        <motion.div variants={fadeUp}>
          <DonateButton size="lg" className="mx-auto">
            {t({ en: "Give to Kapoeta", ar: "تبرّع لكاپويتا" })}
          </DonateButton>
        </motion.div>

        {/* Kapoeta-specific contacts */}
        <motion.div
          variants={fadeUp}
          className="mt-14 pt-10 border-t border-[#d6d3d1] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center"
        >
          {[
            { label: { en: "Email", ar: "البريد الإلكتروني" }, value: "stmarknubianfoundation@gmail.com", href: "mailto:stmarknubianfoundation@gmail.com" },
            { label: { en: "Mamdouh Mansour", ar: "Mamdouh Mansour" }, value: "0402 747 292", href: "tel:+61402747292" },
            { label: { en: "Philip Hanna", ar: "Philip Hanna" }, value: "0411 401 217", href: "tel:+61411401217" },
          ].map((c) => (
            <div key={c.label.en}>
              <p className="text-xs font-semibold text-[#6366f1] uppercase tracking-widest mb-1">{t(c.label)}</p>
              <a href={c.href} className="text-[#1e293b] text-sm font-medium hover:text-[#6366f1] transition-colors break-all">
                {c.value}
              </a>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Page composition ───────────────────────────────────────── */

export default function KapoetaClient({ totals, goals }: Props) {
  return (
    <div className="bg-[#e7e5e4]">
      <HeroSection />
      <StoryChapter1 />
      <StatsStrip />
      <StoryChapter2 />
      <StoryChapter3 />
      <OnTheGround />
      <Gallery />
      <Achievements />
      <DonationsSection totals={totals} goals={goals} />
      <TrustStrip />
      <FinalCTA />
    </div>
  );
}
