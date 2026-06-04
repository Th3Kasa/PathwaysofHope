"use client";

import Image from "next/image";
import Link from "next/link";
import { TrustStrip } from "@/components/trust-strip";
import { MissionCard } from "@/components/mission-card";
import { DonateButton } from "@/components/donate-button";
import { Handshake, BadgeCheck, Globe, ArrowRight, Search, Building2, Users } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  type Variants,
} from "framer-motion";
import { useRef, useEffect } from "react";
import { useT, type Dict } from "@/lib/i18n";

/* ─── Variants ───────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ─── Bilingual content ──────────────────────────────────────── */

const STATS: { value: number; prefix?: string; suffix?: string; label: Dict<string> }[] = [
  { value: 320, suffix: "", label: { en: "Children first gathered from the streets", ar: "طفل جُمِعوا أوّلًا من الشوارع" } },
  { value: 85000, prefix: "A$", suffix: "", label: { en: "Raised in first campaign", ar: "جُمِعت في الحملة الأولى" } },
  { value: 100, suffix: "%", label: { en: "Of donations reach the field", ar: "من التبرّعات تصل إلى الميدان" } },
  { value: 46, suffix: "", label: { en: "Children in school for 2026", ar: "طفل في المدرسة لعام 2026" } },
];

const APPROACH: { icon: typeof Handshake; title: Dict<string>; body: Dict<string> }[] = [
  {
    icon: Handshake,
    title: { en: "Local partnership", ar: "شراكة محلية" },
    body: {
      en: "We find extraordinary local leaders already doing the work — with the cultural trust and personal commitment no external organisation can replicate — and we fund them.",
      ar: "نجد قادة محليين استثنائيين يؤدّون العمل بالفعل — يملكون الثقة الثقافية والالتزام الشخصي الذي لا تستطيع أيّ منظمة خارجية أن تحاكيه — ثم نموّلهم.",
    },
  },
  {
    icon: BadgeCheck,
    title: { en: "100% reaches the field", ar: "100% تصل إلى الميدان" },
    body: {
      en: "Every volunteer self-funds their travel and accommodation. Every dollar donated goes directly to the mission. This is a structural fact, not a marketing claim.",
      ar: "كل متطوّع يموّل سفره وإقامته بنفسه. وكل دولار يُتبرَّع به يذهب مباشرةً إلى المهمّة. هذه حقيقة في بنية عملنا، لا ادّعاء تسويقي.",
    },
  },
  {
    icon: Globe,
    title: { en: "Built to grow", ar: "مبنيّة لتنمو" },
    body: {
      en: "From South Sudan to wherever the next door opens. We build accountable structures that outlast any single campaign and grow with each new partnership.",
      ar: "من جنوب السودان إلى حيثما يُفتح الباب التالي. نبني هياكل خاضعة للمساءلة تدوم أبعد من أيّ حملة واحدة وتنمو مع كل شراكة جديدة.",
    },
  },
];

const STEPS: { icon: typeof Search; step: string; title: Dict<string>; body: Dict<string> }[] = [
  {
    icon: Search,
    step: "01",
    title: { en: "Identify", ar: "نكتشف" },
    body: {
      en: "We find a trusted local leader already serving their community — someone with deep roots, genuine calling, and real results on the ground.",
      ar: "نجد قائدًا محليًّا موثوقًا يخدم مجتمعه بالفعل — صاحب جذور عميقة ودعوةٍ صادقة ونتائج حقيقية في الميدان.",
    },
  },
  {
    icon: Building2,
    step: "02",
    title: { en: "Structure", ar: "نُنظّم" },
    body: {
      en: "We build a transparent, accountable funding structure with zero overhead extraction. Donors see exactly where every dollar goes.",
      ar: "نبني هيكل تمويل شفّافًا وخاضعًا للمساءلة بلا أيّ اقتطاع للنفقات الإدارية. ويرى المتبرّعون بدقّة إلى أين يذهب كل دولار.",
    },
  },
  {
    icon: Users,
    step: "03",
    title: { en: "Mobilise", ar: "نحشد" },
    body: {
      en: "We rally partners across Australia and globally — churches, families, and individuals — to resource the work for the long term.",
      ar: "نحشد الشركاء في أستراليا والعالم — كنائس وعائلات وأفرادًا — لدعم العمل على المدى الطويل.",
    },
  },
];

const PHOTOS: { src: string; alt: string; caption: Dict<string> }[] = [
  {
    src: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg",
    alt: "A young child eating rice from a bowl — one of the children found on the streets of Kapoeta",
    caption: { en: "The children we found", ar: "الأطفال الذين وجدناهم" },
  },
  {
    src: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
    alt: "The Kapoeta shelter steel frame under construction, 2024",
    caption: { en: "The building going up", ar: "البناء يرتفع" },
  },
  {
    src: "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",
    alt: "Children gathered together in the shelter compound, Kapoeta",
    caption: { en: "Home", ar: "بيت" },
  },
  {
    src: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
    alt: "Rows of white bunk beds inside the completed Kapoeta Children's Shelter dormitory",
    caption: { en: "Their first safe beds", ar: "أوّل أسرّةٍ آمنة لهم" },
  },
  {
    src: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
    alt: "Children in school uniforms enrolled in the Catholic school system, Kapoeta 2025",
    caption: { en: "Going to school", ar: "إلى المدرسة" },
  },
  {
    src: "/images/kapoeta/field/visitor-woman-teaching-children-kapoeta.jpg",
    alt: "A volunteer from Australia teaching children at the Kapoeta shelter",
    caption: { en: "Teaching together", ar: "نتعلّم معًا" },
  },
  {
    src: "/images/people/mamdouh-mansour-children-kapoeta.jpg",
    alt: "Elder Mamdouh Mansour from Sydney with the children in Kapoeta",
    caption: { en: "Partners from Australia", ar: "شركاء من أستراليا" },
  },
];

/* ─── Animated Counter ───────────────────────────────────────── */

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) animate(motionVal, value, { duration: 2 });
  }, [inView, motionVal, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = prefix + Math.floor(v).toLocaleString("en-US") + suffix;
    });
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function Home() {
  const t = useT();
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92dvh] flex items-end" aria-label="Hero">
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/field/children-group-sunset-kapoeta.jpg"
            alt="Children at sunset in Kapoeta — safe, fed, and in school through Pathways of Hope"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Top-to-bottom gradient so nav text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b]/70 via-[#1e293b]/20 to-transparent" />
          {/* Bottom-to-top gradient for hero text */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/90 via-[#1e293b]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 sm:pb-24 sm:pt-32 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="text-[#d6d3d1] text-xs font-bold uppercase tracking-[0.25em] mb-4 sm:mb-5 drop-shadow"
            >
              {t({ en: "Faith · Partnership · Dignity", ar: "إيمان · شراكة · كرامة" })}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-[2rem] sm:text-5xl lg:text-[4.5rem] font-light text-white leading-[1.1] sm:leading-[1.05] mb-5 sm:mb-7 max-w-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({
                en: "Transforming lives through faith, partnership, and dignity.",
                ar: "نحوّل الحياة بالإيمان والشراكة والكرامة.",
              })}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-xl text-[#C4AE9A] max-w-xl mb-8 sm:mb-10 leading-relaxed">
              {t({
                en: "Pathways of Hope partners with trusted local leaders to bring safety, education, and sustainable futures to vulnerable children — beginning in Kapoeta, South Sudan.",
                ar: "تشارك دروب الأمل قادةً محليين موثوقين لتوفير الأمان والتعليم ومستقبلٍ مستدام للأطفال المستضعفين — بدءًا من كاپويتا في جنوب السودان.",
              })}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/missions/kapoeta"
                className="inline-flex items-center gap-2 justify-center px-7 py-4 text-base font-semibold rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors duration-200"
              >
                {t({ en: "See the mission", ar: "شاهد المهمّة" })} <ArrowRight size={16} />
              </Link>
              <DonateButton size="lg" className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 transition-colors duration-200">
                {t({ en: "Give now", ar: "تبرّع الآن" })}
              </DonateButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar — warm dark, directly below hero, intentional */}
      <section className="bg-[#1e293b] py-8 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            {STATS.map(({ value, prefix, suffix, label }) => (
              <motion.div key={label.en} variants={fadeUp}>
                <div
                  className="text-2xl sm:text-4xl font-light mb-1 sm:mb-2 tabular-nums"
                  style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
                >
                  <AnimatedCounter value={value} prefix={prefix ?? ""} suffix={suffix} />
                </div>
                <div className="text-xs text-[#9A8578] uppercase tracking-wider leading-snug">{t(label)}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-14 sm:py-24 px-4 bg-[#e7e5e4]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 sm:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4">
              {t({ en: "Our approach", ar: "نهجنا" })}
            </p>
            <h2
              className="text-2xl sm:text-4xl font-light text-[#1e293b] max-w-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "Not aid from a distance. Partnership from within.", ar: "ليست مساعدةً من بعيد، بل شراكةٌ من الداخل." })}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {APPROACH.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title.en}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 sm:p-8 border border-[#d6d3d1] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#6366f1]" strokeWidth={1.75} />
                </div>
                <h3
                  className="text-xl font-semibold text-[#1e293b] mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {t(title)}
                </h3>
                <p className="text-[#6b7280] leading-relaxed text-sm">{t(body)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pull quote — terracotta accent band */}
      <section className="bg-[#6366f1] py-10 sm:py-16 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <blockquote
            className="text-xl sm:text-2xl lg:text-4xl font-light text-white leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: "“What began as an effort to help children living on the streets — wearing tattered clothes, eating from trash bins — has become a thriving centre of hope.”",
              ar: "«ما بدأ جهدًا لمساعدة أطفالٍ يعيشون في الشوارع — بثيابٍ ممزّقة، يأكلون من صناديق القمامة — صار مركزًا مزدهرًا للأمل.»",
            })}
          </blockquote>
          <cite className="block mt-6 text-[#d6d3d1] text-sm not-italic tracking-wide">
            {t({ en: "— Vision of Hope, Kapoeta", ar: "— رؤية الأمل، كاپويتا" })}
          </cite>
        </motion.div>
      </section>

      {/* Our Missions */}
      <section className="py-14 sm:py-24 px-4 bg-[#e7e5e4]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-8 sm:mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4">
              {t({ en: "Where we work", ar: "أين نعمل" })}
            </p>
            <h2
              className="text-2xl sm:text-4xl font-light text-[#1e293b]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "Our missions", ar: "مهامّنا" })}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-lg"
          >
            <MissionCard
              slug="kapoeta"
              country={t({ en: "South Sudan", ar: "جنوب السودان" })}
              title={t({ en: "Kapoeta Children's Shelter", ar: "ملجأ كاپويتا للأطفال" })}
              summary={t({
                en: "Children given safety, meals, and schooling in one of South Sudan's most remote towns — through the work of a local leader and a global community of believers.",
                ar: "أطفالٌ نالوا الأمان والطعام والتعليم في واحدةٍ من أبعد بلدات جنوب السودان — بفضل عمل قائدٍ محلي ومجتمعٍ عالمي من المؤمنين.",
              })}
              imageSrc="/images/kapoeta/field/children-large-group-activity-kapoeta.jpg"
              imageAlt="Children gathered together at the Kapoeta Children's Shelter"
              childCount={70}
              status="active"
            />
          </motion.div>

          <motion.p
            className="text-[#6b7280] text-sm italic mt-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {t({
              en: "More missions coming. If you know of a leader doing extraordinary work, get in touch.",
              ar: "مهامّ أخرى قادمة. إن كنت تعرف قائدًا يؤدّي عملًا استثنائيًّا، فتواصل معنا.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Photo strip — 5 images telling the arc: before → building → home → beds → school */}
      <section className="overflow-hidden bg-[#1e293b]">
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-7 h-56 sm:h-72">
          {PHOTOS.map((img, i) => (
            <motion.div
              key={img.src}
              className="relative overflow-hidden group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              {/* Caption on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs font-medium leading-tight">{t(img.caption)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works — warm cream, no more jarring dark break */}
      <section className="py-14 sm:py-24 px-4 bg-[#f5f5f4]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4">
              {t({ en: "Our process", ar: "آليّة عملنا" })}
            </p>
            <h2
              className="text-2xl sm:text-4xl font-light text-[#1e293b]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t({ en: "How it works", ar: "كيف نعمل" })}
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {STEPS.map(({ icon: Icon, step, title, body }) => (
              <motion.div key={step} variants={fadeLeft} className="flex gap-6">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#6366f1]" strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#C9952A] uppercase tracking-widest mb-1">{step}</p>
                  <h3
                    className="text-xl font-semibold text-[#1e293b] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {t(title)}
                  </h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{t(body)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Final CTA */}
      <section className="py-16 sm:py-28 px-4 bg-[#e7e5e4] text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-4xl font-light text-[#1e293b] mb-4 sm:mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Walk this path with us.", ar: "اسلك هذا الدرب معنا." })}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#6b7280] text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            {t({
              en: "Whether you give once, give monthly, or sponsor a child — you become part of a story that started in Kapoeta and will not stop there.",
              ar: "سواء تبرّعت مرة واحدة، أو شهريًا، أو كفلت طفلًا — تصبح جزءًا من قصةٍ بدأت في كاپويتا ولن تتوقّف عندها.",
            })}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <DonateButton size="lg">
              {t({ en: "Support our missions", ar: "ادعم مهامّنا" })}
            </DonateButton>
            <Link
              href="/missions/kapoeta"
              className="inline-flex items-center gap-2 justify-center px-7 py-4 text-base font-semibold rounded-full border-2 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-colors duration-200"
            >
              {t({ en: "Read the story", ar: "اقرأ القصة" })} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
