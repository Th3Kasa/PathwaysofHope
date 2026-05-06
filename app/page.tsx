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
      if (ref.current) ref.current.textContent = prefix + Math.floor(v) + suffix;
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
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-end" aria-label="Hero">
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/children-group.jpg"
            alt="Children cared for through Pathways of Hope"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[#D4785A] text-sm uppercase tracking-widest mb-4 font-medium">
              Faith · Partnership · Dignity
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6 max-w-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Transforming lives through faith, partnership, and dignity.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-[#C4AE9A] max-w-xl mb-8 leading-relaxed">
              Pathways of Hope partners with local leaders on the ground to bring safety, education, and sustainable futures to vulnerable children — one mission at a time.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/missions"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors"
              >
                See Our Missions
              </Link>
              <DonateButton size="lg" className="border-2 border-white/50 bg-transparent text-white hover:bg-white/10">
                Give Now
              </DonateButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1C1410] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            {[
              { value: 60, suffix: "+", label: "Children in our care" },
              { value: 100, suffix: "%", label: "Donations reach the field" },
              { value: 1, suffix: "", label: "Active mission (growing)" },
              { value: 2020, suffix: "", label: "Year founded" },
            ].map(({ value, suffix, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <div
                  className="text-4xl sm:text-5xl font-light mb-2"
                  style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
                >
                  <AnimatedCounter value={value} suffix={suffix} />
                </div>
                <div className="text-xs text-[#9A8578] uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-4 bg-[#FDFAF6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Our approach</p>
            <h2
              className="text-4xl sm:text-5xl font-light text-[#1C1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Not aid from a distance. Partnership from within.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {[
              {
                icon: "🤝",
                title: "Local Partnership",
                body: "We find extraordinary local leaders already doing the work — with the cultural trust and personal commitment no external organisation can replicate — and we fund them.",
              },
              {
                icon: "💯",
                title: "100% Reaches the Field",
                body: "Every volunteer self-funds their travel and accommodation. Every dollar donated goes directly to the mission. This isn't a promise — it's a structural fact.",
              },
              {
                icon: "🌍",
                title: "Multi-Mission",
                body: "From South Sudan to wherever the next door opens. We build accountable structures that outlast any single campaign and grow with each new partnership.",
              },
            ].map(({ icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-8 border border-[#EDD9B4] shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3
                  className="text-xl font-semibold text-[#1C1410] mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {title}
                </h3>
                <p className="text-[#8C7B72] leading-relaxed text-sm">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-[#B85C38] py-16 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <blockquote
            className="text-3xl sm:text-4xl font-light text-white leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;We exist to remove every barrier between a generous heart and a child in need.&rdquo;
          </blockquote>
          <cite className="block mt-6 text-[#EDD9B4] text-sm not-italic tracking-wide">
            — Pathways of Hope
          </cite>
        </motion.div>
      </section>

      {/* Our Missions */}
      <section className="py-24 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Where we work</p>
            <h2
              className="text-4xl font-light text-[#1C1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Our missions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-lg mb-10"
          >
            <MissionCard
              slug="kapoeta"
              country="South Sudan"
              title="Kapoeta Children's Shelter"
              summary="Sixty children given safety, meals, and schooling in one of South Sudan's most remote towns — through the work of a local pastor and a global community of supporters."
              imageSrc="/images/kapoeta/shelter-exterior.jpg"
              imageAlt="The Kapoeta children's shelter"
              childCount={60}
              status="active"
            />
          </motion.div>

          <motion.p
            className="text-[#8C7B72] text-sm italic"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            More missions coming. If you know of a leader doing extraordinary work, get in touch.
          </motion.p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-[#1C1410]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#C9952A] text-sm uppercase tracking-widest mb-3 font-medium">Our process</p>
            <h2
              className="text-4xl font-light text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              How it works
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {[
              {
                step: "01",
                title: "Identify",
                body: "We find a trusted local leader already serving their community — someone with deep roots, genuine calling, and results.",
              },
              {
                step: "02",
                title: "Structure",
                body: "We build a transparent, accountable funding structure with zero overhead extraction. Donors see exactly where every dollar goes.",
              },
              {
                step: "03",
                title: "Mobilise",
                body: "We rally partners across Australia and globally — churches, families, and individuals — to resource the work for the long term.",
              },
            ].map(({ step, title, body }) => (
              <motion.div key={step} variants={fadeLeft} className="flex gap-6">
                <div
                  className="text-5xl font-light flex-shrink-0 leading-none"
                  style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
                >
                  {step}
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold text-white mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[#9A8578] text-sm leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Final CTA */}
      <section className="py-24 px-4 bg-[#FDFAF6] text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Walk this path with us.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] text-lg mb-8 leading-relaxed">
            Whether you give once, give monthly, or give your time — you are part of this story.
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonateButton size="lg" className="mx-auto">
              Support Our Missions
            </DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
