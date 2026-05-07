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
      if (ref.current) ref.current.textContent = prefix + Math.floor(v).toLocaleString() + suffix;
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
      <section className="relative min-h-[92dvh] flex items-end" aria-label="Hero">
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/field/june2025-1.jpg"
            alt="Children in school uniforms — 26 children enrolled in formal education through Pathways of Hope"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/50 to-[#1C1410]/20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-32 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#D4785A] text-xs font-semibold uppercase tracking-widest mb-5">
              Faith · Partnership · Dignity
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-light text-white leading-[1.05] mb-7 max-w-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Transforming lives through faith, partnership, and dignity.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-[#C4AE9A] max-w-xl mb-10 leading-relaxed">
              Pathways of Hope partners with trusted local leaders to bring safety, education, and sustainable futures to vulnerable children — beginning in Kapoeta, South Sudan.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/missions/kapoeta"
                className="inline-flex items-center gap-2 justify-center px-7 py-4 text-base font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#8B3E23] transition-colors duration-200"
              >
                See the mission <ArrowRight size={16} />
              </Link>
              <DonateButton size="lg" className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 transition-colors duration-200">
                Give now
              </DonateButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar — warm dark, directly below hero, intentional */}
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
              { value: 150, suffix: "+", label: "Children served since 2024" },
              { value: 85000, prefix: "A$", suffix: "", label: "Raised in first campaign" },
              { value: 100, suffix: "%", label: "Of donations reach the field" },
              { value: 44, suffix: "", label: "Children in education today" },
            ].map(({ value, prefix, suffix, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <div
                  className="text-3xl sm:text-4xl font-light mb-2 tabular-nums"
                  style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}
                >
                  <AnimatedCounter value={value} prefix={prefix ?? ""} suffix={suffix} />
                </div>
                <div className="text-xs text-[#9A8578] uppercase tracking-wider leading-snug">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-4 bg-[#FDFAF6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-xs font-semibold uppercase tracking-widest mb-4">Our approach</p>
            <h2
              className="text-4xl sm:text-5xl font-light text-[#1C1410] max-w-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Not aid from a distance. Partnership from within.
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {[
              {
                icon: Handshake,
                title: "Local partnership",
                body: "We find extraordinary local leaders already doing the work — with the cultural trust and personal commitment no external organisation can replicate — and we fund them.",
              },
              {
                icon: BadgeCheck,
                title: "100% reaches the field",
                body: "Every volunteer self-funds their travel and accommodation. Every dollar donated goes directly to the mission. This is a structural fact, not a marketing claim.",
              },
              {
                icon: Globe,
                title: "Built to grow",
                body: "From South Sudan to wherever the next door opens. We build accountable structures that outlast any single campaign and grow with each new partnership.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 border border-[#EDD9B4] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-[#B85C38]/10 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#B85C38]" strokeWidth={1.75} />
                </div>
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

      {/* Pull quote — terracotta accent band */}
      <section className="bg-[#B85C38] py-16 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;What began as an effort to help children living on the streets — wearing tattered clothes, eating from trash bins — has become a thriving centre of hope.&rdquo;
          </blockquote>
          <cite className="block mt-6 text-[#EDD9B4] text-sm not-italic tracking-wide">
            — Vision of Hope, Kapoeta
          </cite>
        </motion.div>
      </section>

      {/* Our Missions */}
      <section className="py-24 px-4 bg-[#FDFAF6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-xs font-semibold uppercase tracking-widest mb-4">Where we work</p>
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
            className="max-w-lg"
          >
            <MissionCard
              slug="kapoeta"
              country="South Sudan"
              title="Kapoeta Children's Shelter"
              summary="150 children given safety, meals, and schooling in one of South Sudan's most remote towns — through the work of a local leader and a global community of believers."
              imageSrc="/images/kapoeta/field/feb2025-3.jpg"
              imageAlt="Children waving in front of the completed Kapoeta shelter"
              childCount={45}
              status="active"
            />
          </motion.div>

          <motion.p
            className="text-[#8C7B72] text-sm italic mt-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            More missions coming. If you know of a leader doing extraordinary work, get in touch.
          </motion.p>
        </div>
      </section>

      {/* Photo strip — 5 images telling the arc: before → building → home → beds → school */}
      <section className="overflow-hidden bg-[#1C1410]">
        <div className="grid grid-cols-2 sm:grid-cols-5 h-56 sm:h-72">
          {[
            {
              src: "/images/kapoeta/field/field-3.jpg",
              alt: "The children found on the streets of Kapoeta — hungry, homeless, without school",
              caption: "The children we found",
            },
            {
              src: "/images/kapoeta/field/feb2025-2.jpg",
              alt: "Children standing in front of the Kapoeta shelter during construction, 2024",
              caption: "The building going up",
            },
            {
              src: "/images/kapoeta/field/feb2025-3.jpg",
              alt: "Children waving in front of the completed shelter wall, Kapoeta",
              caption: "Home",
            },
            {
              src: "/images/kapoeta/field/feb2025-1.jpg",
              alt: "Children waving from their new bunk beds inside the Kapoeta shelter",
              caption: "Their first safe beds",
            },
            {
              src: "/images/kapoeta/field/june2025-1.jpg",
              alt: "Children in school uniforms, including a child in a wheelchair, Kapoeta 2025",
              caption: "Going to school",
            },
          ].map((img, i) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-xs font-medium leading-tight">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works — warm cream, no more jarring dark break */}
      <section className="py-24 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-xs font-semibold uppercase tracking-widest mb-4">Our process</p>
            <h2
              className="text-4xl font-light text-[#1C1410]"
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
                icon: Search,
                step: "01",
                title: "Identify",
                body: "We find a trusted local leader already serving their community — someone with deep roots, genuine calling, and real results on the ground.",
              },
              {
                icon: Building2,
                step: "02",
                title: "Structure",
                body: "We build a transparent, accountable funding structure with zero overhead extraction. Donors see exactly where every dollar goes.",
              },
              {
                icon: Users,
                step: "03",
                title: "Mobilise",
                body: "We rally partners across Australia and globally — churches, families, and individuals — to resource the work for the long term.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <motion.div key={step} variants={fadeLeft} className="flex gap-6">
                <div className="flex-shrink-0 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-[#B85C38]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#B85C38]" strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#C9952A] uppercase tracking-widest mb-1">{step}</p>
                  <h3
                    className="text-xl font-semibold text-[#1C1410] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[#8C7B72] text-sm leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Final CTA */}
      <section className="py-28 px-4 bg-[#FDFAF6] text-center">
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
          <motion.p variants={fadeUp} className="text-[#8C7B72] text-lg mb-10 leading-relaxed">
            Whether you give once, give monthly, or sponsor a child — you become part of a story that started in Kapoeta and will not stop there.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <DonateButton size="lg">
              Support our missions
            </DonateButton>
            <Link
              href="/missions/kapoeta"
              className="inline-flex items-center gap-2 justify-center px-7 py-4 text-base font-semibold rounded-full border-2 border-[#B85C38] text-[#B85C38] hover:bg-[#B85C38] hover:text-white transition-colors duration-200"
            >
              Read the story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
