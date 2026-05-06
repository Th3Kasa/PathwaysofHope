"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { GoalMeter } from "@/components/goal-meter";
import { DonateButton } from "@/components/donate-button";
import { TrustStrip } from "@/components/trust-strip";
import type { Goal } from "@/lib/goals";

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
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const TIMELINE = [
  {
    year: "2020",
    title: "The Calling",
    body: "Brother Hakim Peter left a stable life in America and returned to Kapoeta — one of South Sudan's most remote and conflict-scarred towns — after a call he could not ignore.",
    icon: "✦",
  },
  {
    year: "2021",
    title: "320 Children, No Resources",
    body: "He found more than 320 children without shelter, families, or food. With faith and borrowed space he began feeding and housing them, drawing on whatever the local community could spare.",
    icon: "◉",
  },
  {
    year: "2022",
    title: "The Container Arrives",
    body: "Supporters in Sydney organised a 40-foot shipping container filled with beds, clothing, medical supplies, and educational materials. It crossed two oceans to reach Kapoeta.",
    icon: "⬡",
  },
  {
    year: "2023",
    title: "Water Well & Livestock",
    body: "Toongabbie Evangelical Church funded a water well. Sudanese Grace Church Melbourne donated livestock — the shelter's first sustainable food source and small income stream.",
    icon: "◈",
  },
  {
    year: "2024",
    title: "Tuk-Tuk & UK Partnership",
    body: "British supporters funded the shelter's first vehicle, allowing Hakim to transport children to medical care and collect supplies from the market 12 km away.",
    icon: "◎",
  },
  {
    year: "2026",
    title: "46 Students Enrolled",
    body: "As of early 2026, 46 children are formally enrolled in the shelter's education programme. The goal: all 60 in school by year's end.",
    icon: "★",
  },
];

const GOAL_META: Record<string, { emoji: string; priority: number; why: string }> = {
  "water-tower": {
    emoji: "🏗️",
    priority: 1,
    why: "Children currently walk long distances to collect water from unsafe sources. A solar-powered tower on-site would end that daily risk and give them clean water on tap — forever.",
  },
  "poultry-project": {
    emoji: "🐔",
    priority: 2,
    why: "200 chickens mean daily eggs for 60 growing children and a sustainable income stream the shelter can rely on — making it less dependent on external donations.",
  },
  "sponsor-a-child": {
    emoji: "👧",
    priority: 3,
    why: "A$600 covers one child's entire year: meals, shelter, schooling, and belonging. Right now 14 children remain unsponsored. Your name can change that.",
  },
  "general-support": {
    emoji: "🤲",
    priority: 4,
    why: "Staff wages, utilities, transport, and medical care are the invisible costs that keep 60 children alive and cared for every single day of the year.",
  },
};

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          src="/images/kapoeta/shelter-exterior.jpg"
          alt="The Kapoeta children's shelter exterior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/40 to-[#1C1410]/10" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
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
            60 children. One pastor&apos;s calling. A community that refused to let them fall.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function StoryChapter1() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="py-24 px-4 bg-[#F5EFE6]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image with subtle parallax */}
        <motion.div
          className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src="/images/kapoeta/hakim.png"
              alt="Brother Hakim Peter, founder of the Kapoeta Children's Shelter"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/40 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <p className="text-white/90 text-sm font-medium">Brother Hakim Peter</p>
            <p className="text-white/60 text-xs">Founder & Director, Kapoeta</p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            Chapter 1 — The Calling
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-4xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            He left a comfortable life in America. He came home.
          </motion.h2>

          <motion.div variants={staggerContainer} className="space-y-4 text-[#3D2B1F] leading-relaxed">
            <motion.p variants={fadeUp}>
              In 2020, Brother Hakim Peter was living well. A South Sudanese pastor with a stable ministry in the United States, a community that loved him, a life that made sense. But something wouldn't leave him alone — the faces of children he'd seen on visits back to Kapoeta.
            </motion.p>
            <motion.p variants={fadeUp}>
              Children who had survived South Sudan's decades of civil war, only to be left without parents, without shelter, without any adult to notice when they were hungry. He tried to ignore the call. He couldn't.
            </motion.p>
            <motion.p variants={fadeUp}>
              He went back. He arrived with no funding, no building, no government support. What he had was faith, a knowledge of the community, and the trust of local elders who recognised a man who had come to stay — not to visit.
            </motion.p>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="mt-8 pl-6 border-l-4 border-[#B85C38]"
          >
            <p
              className="text-xl font-light text-[#1C1410] italic leading-relaxed"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;I left a comfortable life. But when God calls you, comfort is not the point.&rdquo;
            </p>
            <cite className="block mt-3 text-[#8C7B72] text-sm not-italic">— Brother Hakim Peter</cite>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: 320, label: "First children found", suffix: "" },
    { value: 60, label: "Currently sheltered", suffix: "" },
    { value: 46, label: "In school today", suffix: "" },
    { value: 2020, label: "Year founded", suffix: "" },
  ];

  return (
    <section className="bg-[#1C1410] py-16 px-4">
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} className="text-center">
            <p
              className="text-5xl sm:text-6xl font-light mb-2"
              style={{
                fontFamily: "var(--font-serif)",
                background: "linear-gradient(90deg, #C9952A, #E4B84A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {stat.value.toLocaleString()}{stat.suffix}
            </p>
            <p className="text-[#8C7B72] text-sm uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function StoryChapter2() {
  const images = [
    { src: "/images/kapoeta/container.png", alt: "The 40-foot container from Sydney", span: "md:col-span-2 md:row-span-2" },
    { src: "/images/kapoeta/children-2025.jpg", alt: "Children at the shelter in 2025", span: "" },
    { src: "/images/kapoeta/children-learning.jpg", alt: "Children engaged in learning", span: "" },
  ];

  return (
    <section className="py-24 px-4 bg-[#FDFAF6]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[480px]"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {images.map((img, i) => (
              <motion.div
                key={img.src}
                variants={scaleIn}
                custom={i}
                className={`relative rounded-xl overflow-hidden ${img.span}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
              Chapter 2 — The Container
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-light text-[#1C1410] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A shipping container from Sydney. A transformation in Kapoeta.
            </motion.h2>
            <motion.div variants={staggerContainer} className="space-y-4 text-[#3D2B1F] leading-relaxed">
              <motion.p variants={fadeUp}>
                In 2022, Elder Mamdouh Mansour and Philip Hanna — members of the Australian church community — began organising something extraordinary. A 40-foot shipping container, packed in Sydney with beds, blankets, clothing, solar lamps, medical supplies, and educational materials.
              </motion.p>
              <motion.p variants={fadeUp}>
                It crossed two oceans and the customs processes of three countries. When it finally arrived in Kapoeta, children who had been sleeping on bare ground in rags helped unload it. Within days the shelter was transformed.
              </motion.p>
              <motion.p variants={fadeUp}>
                Children who once slept on bare ground in rags now sleep in beds with covers. Children who studied under torchlight now have solar lamps. That container didn't just bring supplies — it told sixty children they were worth the effort of sending it.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StoryChapter3() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 80%", "end 20%"] });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24 px-4 bg-[#F5EFE6]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            Chapter 3 — Growing Roots
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-light text-[#1C1410] leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Six years of tangible transformation
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-2" ref={lineRef}>
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[#DDD0C0] hidden sm:block">
                <motion.div
                  className="absolute inset-x-0 top-0 bg-[#B85C38] origin-top"
                  style={{ scaleY: lineScaleY, height: "100%" }}
                />
              </div>

              <div className="flex flex-col gap-10">
                {TIMELINE.map((m, i) => (
                  <motion.div
                    key={m.year}
                    className="flex gap-6 sm:gap-10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#B85C38] flex items-center justify-center text-white text-base z-10 relative shadow-md">
                        {m.icon}
                      </div>
                    </div>
                    <div className="pb-2 pt-1">
                      <span className="text-xs font-bold text-[#B85C38] uppercase tracking-widest">
                        {m.year}
                      </span>
                      <h3
                        className="text-lg font-semibold text-[#1C1410] mt-1 mb-1.5"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-[#8C7B72] leading-relaxed text-sm">{m.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Side images */}
          <div className="flex flex-col gap-4">
            <motion.div
              className="relative h-56 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src="/images/kapoeta/water-well.jpg"
                alt="The water well that changed daily life at the shelter"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute bottom-3 left-3">
                <span className="bg-[#1C1410]/70 text-white/90 text-xs px-2.5 py-1 rounded-full">Water well — 2023</span>
              </div>
            </motion.div>
            <motion.div
              className="relative h-56 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <Image
                src="/images/kapoeta/livestock.jpg"
                alt="Livestock donated by Sudanese Grace Church Melbourne"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute bottom-3 left-3">
                <span className="bg-[#1C1410]/70 text-white/90 text-xs px-2.5 py-1 rounded-full">Livestock — 2023</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  const photos = [
    { src: "/images/kapoeta/daily-life-1.jpg", alt: "Daily life at the shelter" },
    { src: "/images/kapoeta/food-prep.jpg", alt: "Food preparation for sixty children" },
    { src: "/images/kapoeta/children-meal.jpg", alt: "Children sharing a communal meal" },
    { src: "/images/kapoeta/community-1.jpg", alt: "Community gathering in Kapoeta" },
    { src: "/images/kapoeta/children-outdoor.jpg", alt: "Children outdoors at the shelter" },
  ];

  return (
    <section className="py-16 px-4 bg-[#FDFAF6] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-[#B85C38] text-sm uppercase tracking-widest mb-6 font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Life at the shelter
        </motion.p>
        <motion.div
          className="flex gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.src}
              variants={scaleIn}
              className="relative flex-shrink-0 w-[260px] h-[340px] rounded-2xl overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="260px"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DonationSection({
  goals,
  totals,
}: {
  goals: Props["goals"];
  totals: Props["totals"];
}) {
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "#1C1410" }}
    >
      {/* Warm radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(185,92,56,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p variants={fadeUp} className="text-[#C9952A] text-sm uppercase tracking-widest mb-4 font-medium">
            Support this mission
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Four ways to change a life
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] text-lg max-w-xl mx-auto leading-relaxed">
            Each goal is critical. Together they make the shelter sustainable.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {goals.map((goal) => {
            const meta = GOAL_META[goal.id];
            if (!meta) return null;
            return (
              <motion.div
                key={goal.id}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-[#EDD9B4] relative flex flex-col"
              >
                {/* Priority badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #C9952A, #E4B84A)",
                      color: "#1C1410",
                    }}
                  >
                    PRIORITY {meta.priority}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-4 pr-24">
                  <p className="text-2xl mb-1">{meta.emoji}</p>
                  <h3
                    className="text-xl font-semibold text-[#1C1410]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {goal.title}
                  </h3>
                </div>

                {/* Why description */}
                <p className="text-sm text-[#8C7B72] leading-relaxed mb-5">{meta.why}</p>

                {/* GoalMeter */}
                <div className="mb-5">
                  <GoalMeter
                    goal={goal}
                    raised={totals?.[goal.id]?.raised}
                    supporters={totals?.[goal.id]?.supporters}
                  />
                </div>

                {/* Donate button */}
                <div className="mt-auto">
                  <Link
                    href={`/donate?goal=${goal.id}`}
                    className="block w-full text-center px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "#B85C38" }}
                  >
                    Donate to This Goal
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-[#FDFAF6] text-center">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.p variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
          Join the story
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Sixty children are waiting to be seen.
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[#8C7B72] text-lg mb-10 leading-relaxed">
          A$25 feeds a child for a week. A$600 sponsors a full year. Every dollar reaches Kapoeta directly.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
          <DonateButton />
        </motion.div>
        <motion.p variants={fadeUp} className="text-[#8C7B72] text-xs mt-6">
          All donations are tax-deductible. 100% reaches Kapoeta.
        </motion.p>
      </motion.div>
    </section>
  );
}

export default function KapoetaClient({ totals, goals }: Props) {
  return (
    <div className="bg-[#FDFAF6]">
      <HeroSection />
      <StoryChapter1 />
      <StatsStrip />
      <StoryChapter2 />
      <StoryChapter3 />
      <GalleryStrip />
      <DonationSection goals={goals} totals={totals} />
      <TrustStrip />
      <FinalCTA />
    </div>
  );
}
