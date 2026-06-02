"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
  type Variants,
} from "framer-motion";
import React, { useRef, useEffect } from "react";
import { GoalMeter } from "@/components/goal-meter";
import { DonateButton } from "@/components/donate-button";
import { TrustStrip } from "@/components/trust-strip";
import { Baby, Droplets, Egg, HeartHandshake, Sun, CheckCircle2 } from "lucide-react";
import { DELIVERED, DELIVERED_TOTAL, type Goal, type GoalId } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";

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

const TIMELINE = [
  {
    period: "Before 2024",
    title: "The Land & First Foundations",
    body: "Triple L Orphanage and Vulnerable Children Organization, the local entity in Kapoeta, was granted a 10,000 m² parcel (100 m × 100 m) by local authorities. The site was fenced, a water well was drilled — funded by Toongabbie Church and its supporters — and toilets and a small initial structure were built.",
  },
  {
    period: "May–June 2024",
    title: "The Sydney Fundraiser",
    body: "Brother Hakim's calling drew the attention of believers in Australian churches. On 8 June 2024, Toongabbie Church hosted a fundraising event in Sydney. Within weeks, approximately AU$85,000 was raised — enough to commission a 40-foot shipping container.",
  },
  {
    period: "September–October 2024",
    title: "Container Dispatched from Sydney",
    body: "The container was packed in Sydney by volunteers including Elders Mamdouh Mansour, Philip Hanna, engineer Michael Elmasri, Emil Girgis and many others — and shipped via Mombasa, Kenya, then by road through Nadapal to Kapoeta South.",
  },
  {
    period: "December 2024",
    title: "Construction & Completion",
    body: "A team from Sydney travelled to Kapoeta — joined by 2 supporters from the United States, 1 from the United Kingdom, and 1 from Egypt. All trip expenses were paid by the individuals themselves. Together they completed the 16 m × 9 m main building and put the container's contents to use.",
  },
  {
    period: "January 2025",
    title: "Sustainability Projects",
    body: "Beyond the building, donations funded 5 cows and a young bull for a small dairy, a domestic oven for the on-site bakery, a tuk-tuk for transport, and two manual cement-block machines. Foundations were laid for a future water tank tower.",
  },
  {
    period: "Today",
    title: "70 Children in Our Care",
    body: "The shelter now cares for 70 children. 18 of the youngest are taught at the centre during the week, and 26 older children, aged 8 to 16, are enrolled at a local Catholic school — uniforms, fees and registration paid through the shelter. That number keeps growing.",
  },
];

const GOAL_ICONS: Record<GoalId, React.ElementType> = {
  "sponsor-a-child": Baby,
  "solar-system": Sun,
  "chicken-coop": Egg,
  "water-pump": Droplets,
  "ongoing-operations": HeartHandshake,
};

const GOAL_META: Record<GoalId, { priority: number; why: string }> = {
  "solar-system": {
    priority: 1,
    why: "A complete solar system to power the deep-water pump and bring reliable light and electricity to the whole centre — the biggest step toward self-sufficiency.",
  },
  "sponsor-a-child": {
    priority: 2,
    why: "A$600 covers one child's full year — meals, shelter, schooling, and the dignity of belonging. Of the 70 children in our care, 10 are already sponsored. 60 names are still waiting.",
  },
  "chicken-coop": {
    priority: 3,
    why: "A predator-safe coop and 200 chicks. Daily eggs for growing children and a little income from the surplus — food that renews itself every day.",
  },
  "water-pump": {
    priority: 4,
    why: "The deep well is already drilled. An electric pump will draw clean water for drinking, cooking and the gardens — ending the daily haul by hand.",
  },
  "ongoing-operations": {
    priority: 5,
    why: "Stipends for the matron and evangelist, school fees and uniforms, food, medical care — the day-to-day costs of a children's shelter, beyond any single project.",
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/kapoeta/field/children-group-portrait-shelter.jpg"
          alt="Children waving in front of the completed Kapoeta Children's Shelter, 2025"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/40 to-[#1C1410]/10" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
            <Link href="/missions" className="text-[#C4AE9A] text-sm hover:text-white transition-colors">
              Missions
            </Link>
            <span className="text-[#6B5A52]">/</span>
            <span className="text-white/80 text-sm">Kapoeta, South Sudan</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-light text-white leading-[1.05] mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Kapoeta<br />Children&apos;s Shelter
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#C4AE9A] text-xl sm:text-2xl max-w-xl leading-relaxed font-light">
            A children&apos;s home in South Sudan — built by a community of believers across four continents.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Chapter 1: The Calling ─────────────────────────────────── */

function StoryChapter1() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="py-24 px-4 bg-[#F5EFE6]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src="/images/kapoeta/field/children-sitting-bench-kapoeta.jpg"
              alt="Brother Hakim, founder and leader of the Kapoeta Children's Shelter, at the site in Kapoeta, South Sudan"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            Chapter 1 — The Calling
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A native son returns home.
          </motion.h2>
          <motion.div variants={fadeUp} className="space-y-5 text-[#3D2B1F] text-lg leading-relaxed">
            <p>
              Brother Hakim is a native of Kapoeta who, like so many in his generation, had migrated to the United States in search of a different life. With the encouragement of Pastor Aman — a Sudanese pastor based in the US — Hakim returned to the streets where he had grown up.
            </p>
            <p>
              He found children there: between 150 and 200 of them, aged 2 to 18, sleeping near the local market, wearing tattered clothes, eating from trash bins, with no access to school. Hakim began with what he had — gathering them by day to teach Bible stories and hymns, share one meal, and offer the safety of presence.
            </p>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="mt-8 pl-6 border-l-2 border-[#C9952A] italic text-[#3D2B1F] text-lg"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;What began as an effort to help children living on the streets — wearing tattered clothes, eating from trash bins, and with no access to education — has now become a thriving centre of hope and transformation.&rdquo;
            <cite className="block mt-3 text-sm text-[#8C7B72] not-italic">
              — Vision of Hope, Kapoeta
            </cite>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats strip ────────────────────────────────────────────── */

function StatsStrip() {
  const stats = [
    { value: 150, suffix: "+", label: "Children served since 2024" },
    { value: 70, suffix: "", label: "Children currently in our care" },
    { value: 44, suffix: "", label: "Children in formal education" },
    { value: 85000, prefix: "A$", suffix: "", label: "Raised in opening campaign" },
  ];

  return (
    <section className="bg-[#1C1410] py-16 px-4">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <div
              className="text-3xl sm:text-4xl font-light mb-2 tabular-nums"
              style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
            >
              <Counter value={s.value} prefix={"prefix" in s ? (s as { prefix: string }).prefix : ""} suffix={s.suffix} />
            </div>
            <div className="text-xs sm:text-sm text-[#9A8578] uppercase tracking-wider leading-snug">
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Chapter 2: The Container ───────────────────────────────── */

function StoryChapter2() {
  const containerContents = [
    "Building materials — steel structure, zinc roofing, 8 windows for the main 16 m × 9 m building",
    "33 bunk beds, mattresses, sheets and blankets",
    "Clothing for all ages",
    "Solar-powered lamps and an electricity generator",
    "Medical supplies, including 6 wheelchairs",
    "Educational materials — books, stationery, toys",
    "Food supplies sufficient for 4–6 months",
    "120 chairs, folding tables, TV and PA system",
  ];

  return (
    <section className="py-24 px-4 bg-[#FDFAF6]">
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
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            Chapter 2 — The Container
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A 40-foot box, packed in Sydney.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#3D2B1F] text-lg leading-relaxed">
            From May 2024, believers in Australia raised approximately AU$85,000 in a few weeks. The funds were used to purchase, fill, and ship a 40-foot container from Sydney to Mombasa, Kenya — and onward by road through Nadapal to Kapoeta South. Engineer Michael Elmasri designed the on-site building. Elders Mamdouh Mansour and Philip Hanna, along with many other Sydney volunteers, organised the loading and logistics.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={scaleIn} className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/kapoeta/field/container-contents-mattresses-materials.jpg"
              alt="Mattresses and materials from the container — packed by volunteers in Sydney and shipped to Kapoeta"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3
              className="text-2xl font-semibold text-[#1C1410] mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              What was inside
            </h3>
            <ul className="space-y-3">
              {containerContents.map((item) => (
                <li key={item} className="flex gap-3 text-[#3D2B1F] leading-relaxed">
                  <span className="text-[#C9952A] flex-shrink-0 mt-1">●</span>
                  <span>{item}</span>
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
  return (
    <section className="py-24 px-4 bg-[#F5EFE6]">
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
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            Chapter 3 — Building &amp; Growth
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How a building rose, and a shelter took shape.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] leading-relaxed">
            Each step is taken from the project&apos;s own documents — the Vision report, sponsor letters, and the January 2025 Final Report.
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
            <motion.li key={step.period} variants={fadeUp} className="relative">
              <span className="absolute -left-[42px] top-1.5 w-4 h-4 rounded-full bg-[#C9952A] ring-4 ring-[#F5EFE6]" />
              <div className="text-xs uppercase tracking-widest text-[#B85C38] font-semibold mb-1">
                {step.period}
              </div>
              <h3
                className="text-xl sm:text-2xl text-[#1C1410] mb-2 font-semibold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {step.title}
              </h3>
              <p className="text-[#3D2B1F] leading-relaxed">{step.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ─── On the ground today ────────────────────────────────────── */

function OnTheGround() {
  const items = [
    {
      title: "Madam Jackie",
      role: "Matron",
      body: "Serves as a maternal figure and mentor for the older girls and the youngest children. The presence the children miss most when she is not there.",
    },
    {
      title: "Evangelist Simon",
      role: "Spiritual Ministry",
      body: "Leads spiritual formation at the centre and Sunday gatherings, with all of the surrounding community welcome.",
    },
    {
      title: "Catholic School Partnership",
      role: "Education",
      body: "26 older children, aged 8–16, enrolled at a local Catholic school. Uniforms, fees and registration are funded through the shelter.",
    },
    {
      title: "On-site Preschool",
      role: "Early Years",
      body: "18 preschool-age children are educated at the centre by the team during the week.",
    },
    {
      title: "Dairy & Bakery",
      role: "Sustainability",
      body: "5 cows and a young bull supply milk; surplus is sold. A domestic oven bakes daily bread for the children, with surplus also sold.",
    },
    {
      title: "Triple L Orphanage",
      role: "Local Partner",
      body: "The on-ground legal entity in Kapoeta — owners of the land — through whom the work is carried out, with Simon Dador as Legal Advisor.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#FDFAF6]">
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
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium"
          >
            On the ground
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The people who make the days work.
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
              key={it.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-[#EDD9B4] shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-xs text-[#B85C38] uppercase tracking-widest font-semibold mb-2">
                {it.role}
              </div>
              <h3
                className="text-xl font-semibold text-[#1C1410] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {it.title}
              </h3>
              <p className="text-[#8C7B72] text-sm leading-relaxed">{it.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Gallery ────────────────────────────────────────────────── */

function Gallery() {
  // Each image is a distinct moment — ordered as a story arc
  const images = [
    {
      src: "/images/kapoeta/field/children-playing-field-kapoeta.jpg",
      alt: "The children of Kapoeta — before the shelter existed, gathered together outdoors",
      caption: "The children we found",
    },
    {
      src: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
      alt: "The Kapoeta shelter steel frame under construction, 2024",
      caption: "The building going up",
    },
    {
      src: "/images/kapoeta/field/children-group-portrait-shelter.jpg",
      alt: "Children waving in front of the completed shelter wall, Kapoeta 2025",
      caption: "Home — finished",
    },
    {
      src: "/images/kapoeta/field/bunkbeds-dormitory-interior-kapoeta.jpg",
      alt: "Rows of white bunk beds inside the completed Kapoeta Children's Shelter dormitory",
      caption: "Their first beds",
    },
    {
      src: "/images/kapoeta/field/children-sitting-bench-kapoeta.jpg",
      alt: "Children sitting on bamboo benches at the shelter compound, Kapoeta",
      caption: "Growing their own food",
    },
    {
      src: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
      alt: "Children in school uniforms waving, one child in a wheelchair — enrolled in formal education, June 2025",
      caption: "Going to school",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#1C1410] overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="mb-10">
          <p className="text-[#C9952A] text-sm uppercase tracking-widest mb-3 font-medium">From the field</p>
          <h2
            className="text-3xl font-light text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A few moments from Kapoeta.
          </h2>
        </motion.div>

        {/* 6-image story grid: 2 tall flanking 4 square */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {images.map((img) => (
            <motion.div
              key={img.src}
              variants={scaleIn}
              className="relative overflow-hidden rounded-xl group aspect-[4/3] sm:aspect-[3/2]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {/* Persistent caption strip at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1C1410]/85 to-transparent pt-8 pb-3 px-3">
                <p className="text-white text-xs font-medium">{img.caption}</p>
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
  return (
    <section className="py-24 px-4 bg-[#F5EFE6]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-12 max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">
            Already delivered
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {formatAUDFull(DELIVERED_TOTAL)} already turned into a real home.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] leading-relaxed">
            Every figure below is a project the community has already funded and completed. This is the track record behind the 2026 goals.
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
              className="flex items-center justify-between gap-4 rounded-xl bg-white border border-[#EDD9B4] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#C9952A] flex-shrink-0" strokeWidth={2} />
                <span className="text-[#3D2B1F] text-sm leading-snug">{d.title}</span>
              </div>
              <span className="text-sm font-semibold text-[#1C1410] tabular-nums flex-shrink-0">
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
  const sorted = [...goals].sort(
    (a, b) => (GOAL_META[a.id]?.priority ?? 99) - (GOAL_META[b.id]?.priority ?? 99)
  );

  return (
    <section className="py-24 px-4 bg-[#1C1410] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1410] via-[#2A1F18] to-[#1C1410] opacity-90" />

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
            How to help
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The 2026 goals.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#9A8578] leading-relaxed">
            Each goal stands on its own. Together they sustain the shelter and grow it.
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
                className="relative bg-white rounded-2xl p-6 sm:p-8 border border-[#EDD9B4] shadow-lg flex flex-col"
              >
                {/* Priority badge */}
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#C9952A] to-[#E4B84A] text-[#1C1410] text-xs font-bold tracking-wider uppercase shadow-md">
                  Priority {meta.priority}
                </div>

                <div className="flex items-start gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {GoalIcon && <GoalIcon size={20} className="text-[#B85C38]" strokeWidth={1.75} />}
                  </div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-semibold text-[#1C1410] leading-tight"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {goal.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[#8C7B72] text-sm leading-relaxed mb-5 flex-grow">{meta.why}</p>

                <div className="mb-6">
                  <GoalMeter
                    goal={goal}
                    raised={live?.raised}
                    supporters={live?.supporters}
                  />
                </div>

                <Link
                  href={goal.kind === "bundle" ? `/donate/${goal.id}/parts` : `/donate/${goal.id}`}
                  className="inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-[#B85C38] text-white text-sm font-semibold hover:bg-[#8B3E23] transition-colors"
                >
                  {goal.kind === "bundle" ? "See the breakdown →" : "Donate to This Goal →"}
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
  return (
    <section className="py-24 px-4 bg-[#FDFAF6] text-center">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Join the story.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#8C7B72] text-lg mb-8 leading-relaxed">
          A one-off gift, a monthly partnership, or a sponsored child — every contribution
          becomes someone&apos;s breakfast, school uniform, or first safe night.
        </motion.p>
        <motion.div variants={fadeUp}>
          <DonateButton size="lg" className="mx-auto">
            Give to Kapoeta
          </DonateButton>
        </motion.div>

        {/* Kapoeta-specific contacts */}
        <motion.div
          variants={fadeUp}
          className="mt-14 pt-10 border-t border-[#EDD9B4] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left sm:text-center"
        >
          {[
            { label: "Email", value: "stmarknubianfoundation@gmail.com", href: "mailto:stmarknubianfoundation@gmail.com" },
            { label: "Mamdouh Mansour", value: "0402 747 292", href: "tel:+61402747292" },
            { label: "Philip Hanna", value: "0411 401 217", href: "tel:+61411401217" },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-xs font-semibold text-[#B85C38] uppercase tracking-widest mb-1">{c.label}</p>
              <a href={c.href} className="text-[#1C1410] text-sm font-medium hover:text-[#B85C38] transition-colors break-all">
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
    <div className="bg-[#FDFAF6]">
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
