"use client";

import Image from "next/image";
import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";
import { motion, type Variants } from "framer-motion";

const TEAM = [
  {
    name: "Brother Hakim Peter",
    role: "Founder & Director, Kapoeta Shelter",
    image: "/images/kapoeta/hakim.png",
    bio: "A South Sudanese pastor who left a stable life in Australia to answer a calling he describes as impossible to ignore. Hakim has lived in Kapoeta since 2020, leading the shelter full-time. He knows every child by name. He is the mission.",
  },
  {
    name: "Elder Mamdouh Mansour",
    role: "Australian Coordinator",
    image: "/images/kapoeta/hakim-community.jpg",
    bio: "Elder Mamdouh coordinates Australian donations, logistics, and volunteer travel. He was instrumental in organising the original shipping container from Sydney, navigating customs across three countries to deliver supplies to Kapoeta.",
  },
  {
    name: "Philip Hanna",
    role: "Fundraising & Operations Lead",
    image: "/images/kapoeta/community-1.jpg",
    bio: "Philip oversees fundraising strategy, donor relationships, and the financial transparency that makes Pathways of Hope trustworthy. A committed volunteer, Philip has self-funded multiple visits to Kapoeta to see the impact firsthand.",
  },
];

const COMMITMENTS = [
  {
    title: "Registered Australian Charity",
    body: "Pathways of Hope is registered with the Australian Charities and Not-for-profits Commission (ACNC). Donations are tax-deductible for Australian taxpayers.",
  },
  {
    title: "100% to the children — structurally guaranteed",
    body: "All volunteer travel costs — flights, accommodation, visas — are self-funded by the individuals involved. Not one cent of donor money is spent on getting people to and from Kapoeta.",
  },
  {
    title: "Full financial transparency",
    body: "We publish annual financial reports and make detailed statements available on request. If you want to see exactly how your donation was spent, ask us — we will show you.",
  },
  {
    title: "Local leadership, not outsider management",
    body: "Brother Hakim Peter is the decision-maker on the ground. We do not impose Australian management on a Sudanese community. We resource a leader the community already trusts.",
  },
  {
    title: "No overhead extraction",
    body: "Our administrative costs are covered by a small number of committed donors who specifically designate their gifts for operations. General donations are ringfenced for Kapoeta.",
  },
  {
    title: "Multi-church, multi-national accountability",
    body: "We are not a one-church project. Our accountability network spans Toongabbie Evangelical Church, Sudanese Grace Church Melbourne, UK partners, and Egyptian Christian communities.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="py-28 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Who we are
          </motion.p>
          <motion.h1
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const } } }}
          >
            A small team. An unshakeable conviction.
          </motion.h1>
          <motion.p
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } } }}
          >
            Pathways of Hope is a registered Australian charity built on one principle: when you find a person doing extraordinary work with local trust and local knowledge, you fund them — and get out of the way.
          </motion.p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl font-light text-[#1C1410] mb-8"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            How Pathways of Hope began
          </motion.h2>
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
          >
            {[
              "In 2020, a group of Australian Christians learned of Brother Hakim Peter’s mission in Kapoeta. What moved them wasn’t a polished NGO pitch — it was the simplicity and immediacy of the need, and the quality of the person already responding to it.",
              "Hakim had gone to Kapoeta not because an organisation sent him, but because God called him. He found 320 children without shelter or food, and he stayed. The Australian community asked: how can we help?",
              "From that question, Pathways of Hope grew: a small, accountable structure that channels support to Hakim without bureaucratic overhead, political interference, or the loss that comes when organisations prioritise their own perpetuation over the mission.",
              "Today, the network spans Australia, Egypt, South Sudan, and the United Kingdom. Churches, families, and individuals give regularly. Every cent reaches Kapoeta — not because we say so, but because we’ve built a structure where that is structurally true.",
            ].map((para, i) => (
              <motion.p
                key={i}
                className="text-[#3D2B1F] leading-relaxed text-lg pl-5 border-l-2 border-[#C9952A]"
                variants={fadeRight}
              >
                {para}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="bg-[#EDD9B4] py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <blockquote
            className="text-3xl sm:text-4xl font-light text-[#1C1410] leading-relaxed italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;We don&apos;t manage from Sydney. We serve from within.&rdquo;
          </blockquote>
          <cite className="block mt-6 text-[#8C7B72] text-sm not-italic tracking-wide">
            — Elder Mamdouh Mansour
          </cite>
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            The team
          </motion.p>
          <motion.h2
            className="text-4xl font-light text-[#1C1410] mb-14"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            The people who make it possible
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {TEAM.map((person) => (
              <motion.div key={person.name} variants={fadeUp}>
                <motion.div
                  className="relative h-72 rounded-2xl overflow-hidden mb-6"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                >
                  <Image
                    src={person.image}
                    alt={`${person.name} — ${person.role}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </motion.div>
                <h3
                  className="text-xl font-semibold text-[#1C1410] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {person.name}
                </h3>
                <p className="text-[#B85C38] text-sm font-medium mb-3">{person.role}</p>
                <p className="text-[#8C7B72] text-sm leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust / Commitments */}
      <section className="py-24 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            Our commitments
          </motion.p>
          <motion.h2
            className="text-4xl font-light text-[#1C1410] mb-12"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            Why you can trust us with your giving
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {COMMITMENTS.map((item) => (
              <motion.div key={item.title} className="flex gap-4" variants={fadeLeft}>
                <div className="w-2 h-2 rounded-full bg-[#C9952A] mt-2.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1C1410] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#8C7B72] leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2
            className="text-3xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Join us. Walk this path.
          </h2>
          <p className="text-[#8C7B72] mb-8">
            Whether you give once, give monthly, or give your time — you are part of this story.
          </p>
          <DonateButton size="lg">Give to Kapoeta</DonateButton>
        </motion.div>
      </section>
    </div>
  );
}
