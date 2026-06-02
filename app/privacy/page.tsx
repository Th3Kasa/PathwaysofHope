"use client";

import { motion, type Variants } from "framer-motion";
import {
  Lock,
  Database,
  Share2,
  Globe2,
  Cookie,
  UserCheck,
  MessageSquareWarning,
  Mail,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const LAST_UPDATED = "2 June 2026";

const SECTIONS = [
  {
    icon: Database,
    title: "What we collect",
    body: [
      "When you donate, you provide your name, email address and billing details. Card payments are processed by Stripe — we never see or store your full card number.",
      "If you contact us, we keep the details you choose to share so we can respond. When you browse the site, our host records standard technical information such as your browser type and the pages you visit, used only to keep the site secure and working well.",
    ],
  },
  {
    icon: UserCheck,
    title: "How we use it",
    body: [
      "To process your donation and issue a receipt; to answer your questions; to send you updates about the work only if you ask us to; and to meet our legal and reporting obligations as a registered charity.",
      "We do not use your information for any purpose unrelated to our charitable work, and we never sell it.",
    ],
  },
  {
    icon: Lock,
    title: "Payments & security",
    body: [
      "All payments are handled by Stripe over an encrypted connection. Stripe is a PCI-DSS Level 1 certified provider — the highest level of payment security. Your card details go directly to Stripe and are never stored on our servers.",
    ],
  },
  {
    icon: Share2,
    title: "Who we share it with",
    body: [
      "We disclose personal information only to the service providers who help us operate — principally Stripe for payment processing — and only as far as needed to deliver the service. We may also disclose information where required by Australian law.",
    ],
  },
  {
    icon: Globe2,
    title: "Overseas handling",
    body: [
      "Our payment processor, Stripe, may process and store information on servers located outside Australia. We take reasonable steps to ensure any overseas recipient handles your information consistently with the Australian Privacy Principles.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & analytics",
    body: [
      "We keep tracking to a minimum. The site uses only the cookies necessary for it to function and to understand, in aggregate, how it is used. We do not run advertising trackers.",
    ],
  },
  {
    icon: UserCheck,
    title: "Accessing & correcting your information",
    body: [
      "You may ask us what personal information we hold about you and request that we correct it, in line with Australian Privacy Principles 12 and 13. Contact us using the details below and we will respond within a reasonable time.",
    ],
  },
  {
    icon: MessageSquareWarning,
    title: "Complaints",
    body: [
      "If you believe we have mishandled your personal information, please contact us first so we can put it right. If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="py-28 px-4 pt-36 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium"
          >
            Your privacy
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Privacy policy.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            We treat your personal information with the same care we ask you to place in us. This policy explains what we collect, why, and the control you keep over it.
          </motion.p>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.35 } } }}
            className="text-[#8C7B72] text-sm mt-6"
          >
            Pathways of Hope Ltd · ABN 40 686 574 630 · Last updated {LAST_UPDATED}
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <p className="text-[#3D2B1F] text-lg leading-relaxed">
            Pathways of Hope Ltd is committed to protecting your privacy and complying with the{" "}
            <span className="font-medium">Privacy Act 1988 (Cth)</span> and the{" "}
            <span className="font-medium">Australian Privacy Principles</span>. We collect only what we
            need to carry out our charitable work, and we handle it openly.
          </p>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="pb-12 px-4">
        <motion.div
          className="max-w-3xl mx-auto space-y-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={stagger}
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-[#EDD9B4] p-7 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#B85C38]" strokeWidth={1.75} />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1C1410]" style={{ fontFamily: "var(--font-serif)" }}>
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-3 pl-1">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[#8C7B72] text-sm leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="rounded-2xl bg-[#1C1410] text-white p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C9952A]/20 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-[#E4B84A]" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-serif)" }}>
                Privacy enquiries
              </h2>
              <p className="text-[#C4AE9A] leading-relaxed">
                For any question about this policy, or to access or correct your information, email us at{" "}
                <a
                  href="mailto:stmarknubianfoundation@gmail.com"
                  className="text-[#E4B84A] font-medium hover:underline"
                >
                  stmarknubianfoundation@gmail.com
                </a>
                . We will respond as promptly as we can.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
