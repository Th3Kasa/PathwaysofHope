"use client";

import Image from "next/image";
import Link from "next/link";
import { TrustStrip } from "@/components/trust-strip";
import { MissionCard } from "@/components/mission-card";
import { DonateButton } from "@/components/donate-button";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  type Variants,
} from "framer-motion";
import { useRef, useEffect } from "react";

/* ─── Animation variants ─────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};

const photoVariant = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] },
  },
});

/* ─── Animated Counter ───────────────────────────────────────── */

function AnimatedCounter({
  to,
  prefix = "",
  suffix = "",
  duration = 2,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      onUpdate(value) {
        node.textContent = prefix + Math.round(value).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-end"
        aria-label="Hero"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/children-group.jpg"
            alt="Children at the Kapoeta shelter — sixty young lives given safety, warmth, and hope"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Cinematic gradient — dark at bottom, slight vignette at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/95 via-[#1C1410]/45 to-[#1C1410]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1410]/30 to-transparent" />
        </div>

        {/* Hero text */}
        <motion.div
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-40 w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeUp}
            className="text-[#D4785A] text-xs uppercase tracking-[0.25em] mb-5 font-medium"
          >
            Faith · Partnership · Dignity
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.06] mb-7 max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Every child deserves a pathway&nbsp;to&nbsp;hope.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl text-[#C4AE9A] max-w-xl mb-10 leading-relaxed"
          >
            In Kapoeta, South Sudan, sixty children now sleep safely, eat daily,
            and attend school — because communities across three continents
            refused to look away.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <DonateButton size="lg">Give Now</DonateButton>
            <Link
              href="/missions/kapoeta"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full border-2 border-white/50 text-white hover:bg-white/10 hover:border-white/70 transition-all duration-300"
            >
              Read the Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: [0.42, 0, 0.58, 1] as const }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ── 2. Stats bar ─────────────────────────────────────── */}
      <section className="bg-[#1C1410] py-16 px-4" aria-label="Key statistics">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { to: 60, prefix: "", suffix: "", label: "Children sheltered" },
            { to: 45000, prefix: "A$", suffix: "", label: "Annual operating cost" },
            { to: 100, prefix: "", suffix: "%", label: "Reaches children directly" },
            { to: 2020, prefix: "", suffix: "", label: "Year the mission began" },
          ].map(({ to, prefix, suffix, label }) => (
            <motion.div key={label} variants={fadeUp} className="flex flex-col items-center">
              <div
                className="text-5xl sm:text-6xl font-light mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
              >
                <AnimatedCounter to={to} prefix={prefix} suffix={suffix} />
              </div>
              <div className="text-xs text-[#8C7B72] uppercase tracking-widest">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. Story section ─────────────────────────────────── */}
      <section className="py-28 px-4 bg-[#FDFAF6]" aria-label="Our story">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.p
              variants={fadeLeft}
              className="text-[#B85C38] text-xs uppercase tracking-[0.25em] mb-4 font-medium"
            >
              What we do
            </motion.p>
            <motion.h2
              variants={fadeLeft}
              className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Not charity from a distance.{" "}
              <em>Partnership from within.</em>
            </motion.h2>
            <motion.p
              variants={fadeLeft}
              className="text-[#3D2B1F] text-lg leading-relaxed mb-6"
            >
              Pathways of Hope partners with Brother Hakim Peter — a South
              Sudanese pastor who answered a calling in 2020 to return to his
              homeland and shelter children without families. We don&apos;t
              parachute in and leave. We walk alongside.
            </motion.p>
            <motion.p
              variants={fadeLeft}
              className="text-[#8C7B72] leading-relaxed mb-8"
            >
              Every dollar donated by our supporters reaches Kapoeta directly.
              Our volunteers — doctors, engineers, teachers — fund their own
              airfares and accommodation. The shelter costs A$45,000 per year
              to run. Sixty children depend on it.
            </motion.p>

            {/* Decorative cite */}
            <motion.blockquote
              variants={fadeLeft}
              className="border-l-4 border-[#C9952A] pl-6 my-8"
            >
              <p
                className="text-xl font-light text-[#1C1410] italic leading-relaxed"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                &ldquo;Hakim didn&apos;t ask for a salary. He asked for
                partners who would believe in what God was doing in
                Kapoeta.&rdquo;
              </p>
              <cite className="block mt-3 text-sm text-[#8C7B72] not-italic">
                — Pathways of Hope founding team
              </cite>
            </motion.blockquote>

            <motion.div variants={fadeLeft}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#B85C38] hover:text-[#8B3E23] transition-colors"
              >
                Meet the people behind the mission →
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: asymmetric photo collage */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Tall left column */}
            <div className="flex flex-col gap-4">
              <motion.div
                variants={photoVariant(0)}
                className="relative h-72 rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/kapoeta/hakim.png"
                  alt="Brother Hakim Peter — founder and director of the Kapoeta Children's Shelter"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
              <motion.div
                variants={photoVariant(0.1)}
                className="relative h-44 rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/kapoeta/water-well.jpg"
                  alt="The water well funded by Toongabbie Evangelical Church"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
            </div>

            {/* Offset right column */}
            <div className="flex flex-col gap-4 mt-12">
              <motion.div
                variants={photoVariant(0.15)}
                className="relative h-44 rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/kapoeta/children-meal.jpg"
                  alt="Children sharing a meal at the shelter"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
              <motion.div
                variants={photoVariant(0.25)}
                className="relative h-72 rounded-2xl overflow-hidden"
              >
                <Image
                  src="/images/kapoeta/children-outdoor.jpg"
                  alt="Children at play in the shelter grounds"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Pull quote ────────────────────────────────────── */}
      <section
        className="bg-[#B85C38] py-24 px-4 overflow-hidden"
        aria-label="Founder quote"
      >
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="text-[#EDD9B4]/40 text-9xl font-serif leading-none mb-2 select-none"
            aria-hidden="true"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;
          </div>
          <blockquote
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-[1.3] italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            I left a comfortable life in America. But when God calls you,
            comfort is not the point.
          </blockquote>
          <cite className="block mt-8 text-[#EDD9B4] text-sm not-italic tracking-wide">
            — Brother Hakim Peter, Founder
          </cite>
        </motion.div>
      </section>

      {/* ── 5. Impact cards ──────────────────────────────────── */}
      <section className="py-28 px-4 bg-[#F5EFE6]" aria-label="Where every dollar goes">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[#B85C38] text-xs uppercase tracking-[0.25em] mb-3 font-medium"
            >
              Impact
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-light text-[#1C1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Where every dollar goes
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                icon: "🍞",
                title: "Feed",
                stat: "A$2,500 / month",
                description:
                  "Feeds all 60 children three meals a day. Nutritious, consistent, and prepared with care by shelter staff.",
              },
              {
                icon: "📚",
                title: "Educate",
                stat: "46 enrolled in 2026",
                description:
                  "46 children are now enrolled in formal schooling — learning to read, write, and imagine a future beyond survival.",
              },
              {
                icon: "🏠",
                title: "Shelter",
                stat: "60 safe beds",
                description:
                  "Every child sleeps in a bed, not on the ground. Secure walls. A roof. A place that says: you belong here.",
              },
            ].map(({ icon, title, stat, description }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 border border-[#EDD9B4] shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-5">{icon}</div>
                <h3
                  className="text-2xl font-light text-[#1C1410] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {title}
                </h3>
                <p className="text-[#C9952A] text-sm font-semibold mb-4 uppercase tracking-wide">
                  {stat}
                </p>
                <p className="text-[#8C7B72] leading-relaxed text-sm">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. Mission card section ───────────────────────────── */}
      <section className="py-28 px-4 bg-[#FDFAF6]" aria-label="Current mission">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex items-end justify-between mb-14 flex-wrap gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <motion.p
                variants={fadeUp}
                className="text-[#B85C38] text-xs uppercase tracking-[0.25em] mb-2 font-medium"
              >
                Our Mission
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-light text-[#1C1410]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Our current mission
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                href="/missions"
                className="text-sm text-[#8C7B72] hover:text-[#B85C38] transition-colors"
              >
                View all missions →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <MissionCard
              slug="kapoeta"
              country="South Sudan"
              title="Kapoeta Children's Shelter"
              summary="Sixty children. A converted shipping container. One pastor's calling. From crisis to community — the story of how Brother Hakim Peter is rebuilding futures in one of the world's most forgotten towns."
              imageSrc="/images/kapoeta/shelter-exterior.jpg"
              imageAlt="The Kapoeta children's shelter building"
              childCount={60}
              status="active"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 7. Timeline teaser ───────────────────────────────── */}
      <section
        className="bg-[#1C1410] py-24 px-4 overflow-hidden"
        aria-label="Our journey"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#C9952A] text-xs uppercase tracking-[0.25em] mb-3 font-medium">
              Five years of faithfulness
            </p>
            <h2
              className="text-4xl font-light text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              How we got here
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-0 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Horizontal connector line (desktop) */}
            <div className="hidden md:block absolute top-[2.25rem] left-[16.67%] right-[16.67%] h-px bg-[#C9952A]/30" />

            {[
              {
                year: "2020",
                heading: "The calling",
                body: "Brother Hakim Peter returns to South Sudan and opens the shelter with a handful of children and a single room.",
              },
              {
                year: "2022",
                heading: "The partnership",
                body: "Pathways of Hope is founded. Australian, Egyptian, and British communities unite around a shared mission.",
              },
              {
                year: "2026",
                heading: "The community",
                body: "60 children. 46 in school. A water well. Livestock. A future that wasn't possible five years ago.",
              },
            ].map(({ year, heading, body }, i) => (
              <motion.div
                key={year}
                variants={fadeUp}
                className="relative flex flex-col items-center text-center px-8 pb-10"
              >
                {/* Year circle */}
                <div
                  className="w-[4.5rem] h-[4.5rem] rounded-full border-2 border-[#C9952A] flex items-center justify-center mb-6 bg-[#1C1410] relative z-10"
                >
                  <span
                    className="text-[#C9952A] text-xl font-light"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {year}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {heading}
                </h3>
                <p className="text-sm text-[#8C7B72] leading-relaxed max-w-xs">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* ── 8. Final CTA ─────────────────────────────────────── */}
      <section
        className="py-32 px-4 bg-[#FDFAF6] text-center"
        aria-label="Donate"
      >
        <motion.div
          className="max-w-2xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[#B85C38] text-xs uppercase tracking-[0.25em] mb-5 font-medium"
          >
            Join us
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A$25. One week of meals.{" "}
            <em>One life sustained.</em>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[#8C7B72] text-lg mb-10 leading-relaxed"
          >
            Every amount matters. Every month matters. Join the community of
            Australians, Egyptians, South Sudanese, and Brits who already walk
            this path.
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center">
            <DonateButton size="lg">Choose how to give</DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
