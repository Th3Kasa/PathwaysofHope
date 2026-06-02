"use client";

import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";
import { motion, type Variants } from "framer-motion";

const BOARD = [
  {
    name: "Waleed Mansour",
    roles: ["Chairman", "Director"],
    initials: "WM",
    bio: "As Chairman of Pathways of Hope, Waleed brings a deep commitment to transparent governance and community-driven charity, ensuring the organisation's mission remains accountable to those it serves.",
  },
  {
    name: "Sylvia Mansour",
    roles: ["Director", "Legal Advisor", "Public Officer"],
    initials: "SM",
    bio: "Sylvia holds responsibility for the organisation's legal and public obligations and governance records. Her diligence ensures Pathways of Hope meets all regulatory requirements as a registered Australian charity.",
  },
  {
    name: "Hanan Mansour",
    roles: ["Director", "Coordinator"],
    initials: "HM",
    bio: "As Coordinator, Hanan is committed to building sustainable charitable structures that honour both donors and recipients. Her focus is on long-term impact over short-term visibility.",
  },
];

const COMMITMENTS = [
  {
    title: "Registered Australian Charity",
    body: "Pathways of Hope Ltd (ABN 40 686 574 630) is a public company limited by guarantee, registered with the Australian Charities and Not-for-profits Commission (ACNC). Donations are tax-deductible for Australian taxpayers.",
  },
  {
    title: "100% to the field — structurally guaranteed",
    body: "All volunteer travel costs — flights, accommodation, visas — are self-funded by the individuals involved. Not one cent of donor money is spent on getting people to and from our missions.",
  },
  {
    title: "Full financial transparency",
    body: "We publish annual financial reports and make detailed statements available on request. If you want to see exactly how your donation was spent, ask us — we will show you.",
  },
  {
    title: "Local leadership, not outsider management",
    body: "The local leader on the ground is the decision-maker. We do not impose Australian management on communities we serve. We resource leaders those communities already trust.",
  },
  {
    title: "No overhead extraction",
    body: "Our administrative costs are covered by a small number of committed donors who specifically designate their gifts for operations. General donations are ringfenced for mission work.",
  },
  {
    title: "Multi-church, multi-national accountability",
    body: "We are not a one-church project. Our accountability network spans churches and communities across Australia, the United Kingdom, and beyond.",
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
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] } } }}
          >
            A registered Australian charity built on trust, transparency, and local leadership.
          </motion.h1>
          <motion.p
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } } }}
          >
            Pathways of Hope exists to resource extraordinary local leaders who are already changing lives — without bureaucratic overhead or outsider interference.
          </motion.p>
        </div>
      </section>

      {/* Our Model */}
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
            Our model
          </motion.h2>
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
          >
            {[
              "We don't parachute in. We find people already doing the work — with the local trust, cultural knowledge, and personal commitment that no external organisation can replicate — and we fund them.",
              "Every dollar donated reaches the field. Our volunteers fund their own travel. Our administrative costs are covered by designated operational donors. This isn't a promise — it's a structural fact.",
              "Pathways of Hope is designed to grow with new missions over time. Each new partnership follows the same principle: identify a trusted local leader, build a transparent funding structure, and mobilise a global community of support.",
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
      <section className="bg-[#B85C38] py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <blockquote
            className="text-2xl sm:text-3xl font-light text-white leading-relaxed italic"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </blockquote>
          <cite className="block mt-5 text-[#EDD9B4] text-sm not-italic tracking-wide">
            — 2 Corinthians 9:7
          </cite>
        </motion.div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Governance</p>
            <h2
              className="text-4xl font-light text-[#1C1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Board of Directors
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-xl">
              Pathways of Hope is governed by its Responsible People — our board of directors who ensure the organisation operates with integrity, accountability, and purpose.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
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
                className="bg-white rounded-2xl border border-[#EDD9B4] overflow-hidden shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Avatar */}
                <div className="h-48 bg-[#F5EFE6] flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full bg-[#B85C38] flex items-center justify-center text-white text-2xl font-semibold"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {person.initials}
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-semibold text-[#1C1410] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {person.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {person.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#EDD9B4] text-[#8B3E23]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#8C7B72] text-sm leading-relaxed">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Our commitments</p>
            <h2
              className="text-4xl font-light text-[#1C1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Why you can trust us with your giving
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
              <motion.div key={item.title} variants={fadeLeft} className="flex gap-4">
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
      <section className="py-20 px-4 text-center">
        <motion.div
          className="max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Support our missions.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] mb-8">
            Whether you give once, give monthly, or give your time — you are part of this story.
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonateButton size="lg">Give to Our Missions</DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
