"use client";

import { motion, type Variants } from "framer-motion";
import { ShieldCheck, ScrollText, Scale, AlertTriangle, HeartHandshake, FileCheck2 } from "lucide-react";
import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const ENTITY = [
  { label: "Legal name", value: "Pathways of Hope Ltd" },
  { label: "ABN", value: "40 686 574 630" },
  { label: "ACN", value: "686 574 630" },
  { label: "Structure", value: "Public company limited by guarantee" },
  { label: "Registered", value: "NSW · 28 April 2025" },
  { label: "Regulator", value: "Registered with the ACNC" },
];

const OBJECTS = [
  "Paying school fees, uniforms and supplies so orphans and vulnerable children can attend and complete school.",
  "Providing healthcare — preventative programs, treatment, immunisations, maternal and child health, and emergency care.",
  "Supplying regular, nutritious food to orphans, vulnerable children and adults.",
  "Funding the daily running and maintenance of orphanages — staffing, accommodation, utilities and care.",
  "Delivering training and skills development for Sudanese refugees in Egypt.",
  "Meeting other basic needs — clothing, clean water and housing support.",
  "Supporting the safe relocation of vulnerable children and adults to secure environments.",
];

const POLICIES = [
  {
    icon: ShieldCheck,
    title: "Safeguarding Policy",
    body: "A survivor-centric, zero-tolerance approach to abuse, neglect and exploitation. Everyone who interacts with our work has an equal right to protection, and we follow a defined process for managing any incident.",
  },
  {
    icon: Scale,
    title: "Compliance Policy",
    body: "Full compliance with Australian law — anti-money-laundering and counter-terrorism financing, child protection, modern slavery, sanctions, taxation and anti-corruption — aligned to ACNC Governance Standards and External Conduct Standards.",
  },
  {
    icon: ScrollText,
    title: "Conflict of Interest Policy",
    body: "Board members identify, disclose and manage any actual, potential or perceived conflicts of interest — financial or non-financial — to protect the integrity of every decision.",
  },
  {
    icon: AlertTriangle,
    title: "Fraud Prevention Policy",
    body: "Zero tolerance for fraud, bribery, corruption or misuse of funds. Resources are safeguarded and used only for proper charitable purposes, in Australia and overseas.",
  },
];

export default function GovernancePage() {
  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            Accountability
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } } }}
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Governance & safeguarding.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            We work with vulnerable children. That carries a duty of care we take seriously — backed by formal policies, a registered legal structure, and oversight from the ACNC.
          </motion.p>
        </div>
      </section>

      {/* Entity facts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}
            className="text-3xl font-light text-[#1C1410] mb-8" style={{ fontFamily: "var(--font-serif)" }}
          >
            Who we are, legally
          </motion.h2>
          <motion.dl
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EDD9B4] rounded-2xl overflow-hidden border border-[#EDD9B4]"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          >
            {ENTITY.map((e) => (
              <motion.div key={e.label} variants={fadeUp} className="bg-white p-5">
                <dt className="text-xs uppercase tracking-wider text-[#8C7B72] font-medium mb-1">{e.label}</dt>
                <dd className="text-[#1C1410] font-semibold">{e.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* Charitable purpose */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-10">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Our charitable purpose</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410] max-w-2xl leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              Benevolent relief for vulnerable children, adults and refugees.
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-2xl">
              As set out in our Constitution, Pathways of Hope exists to serve Sudanese and South Sudanese orphans, vulnerable children, vulnerable adults and refugees across South Sudan, Sudan and Egypt — by:
            </p>
          </motion.div>
          <motion.ul className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {OBJECTS.map((o) => (
              <motion.li key={o} variants={fadeUp} className="flex gap-3 bg-white rounded-xl border border-[#EDD9B4] p-4">
                <HeartHandshake size={18} className="text-[#C9952A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="text-[#3D2B1F] text-sm leading-relaxed">{o}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Safeguarding officer */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
            className="rounded-2xl bg-[#1C1410] text-white p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C9952A]/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} className="text-[#E4B84A]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-serif)" }}>A dedicated Safeguarding Officer</h2>
              <p className="text-[#C4AE9A] leading-relaxed">
                Our Board has appointed <span className="text-white font-medium">Sally Exander</span> — a trained teacher — as Pathways of Hope&apos;s Safeguarding Officer. All staff, volunteers, partners and third parties share responsibility for protecting everyone we serve from abuse, neglect or exploitation. We take a survivor-centric approach, with no exceptions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mb-12">
            <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-3 font-medium">Our policies</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
              Four policies that keep us honest.
            </h2>
            <p className="text-[#8C7B72] mt-3 max-w-2xl">
              Adopted by the Board on 30 November 2025. Full documents are available on request.
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            {POLICIES.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-white rounded-2xl border border-[#EDD9B4] p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="w-11 h-11 rounded-xl bg-[#B85C38]/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#B85C38]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C1410] mb-2" style={{ fontFamily: "var(--font-serif)" }}>{p.title}</h3>
                  <p className="text-[#8C7B72] text-sm leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
            className="mt-8 flex items-start gap-3 rounded-xl bg-white border border-[#EDD9B4] p-5"
          >
            <FileCheck2 size={18} className="text-[#C9952A] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-sm text-[#3D2B1F] leading-relaxed">
              Our work overseas is governed by the ACNC&apos;s <span className="font-medium">Governance Standards</span> and <span className="font-medium">External Conduct Standards</span>, and we lodge an annual report with the ACNC each year.
            </p>
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      <section className="py-20 px-4 text-center">
        <motion.div className="max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1C1410] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Give with confidence.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] mb-8">
            Strong governance is how we honour your trust — and the children we serve.
          </motion.p>
          <motion.div variants={fadeUp}><DonateButton size="lg">Support our missions</DonateButton></motion.div>
        </motion.div>
      </section>
    </div>
  );
}
