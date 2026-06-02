"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { DonateButton } from "@/components/donate-button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

interface QA {
  q: string;
  a: React.ReactNode;
}

const GROUPS: { heading: string; items: QA[] }[] = [
  {
    heading: "Your donation",
    items: [
      {
        q: "How much of my donation reaches the children?",
        a: (
          <>
            100%. Every volunteer self-funds their own travel and accommodation, so administration
            and travel are never paid from donations. The only deduction is the card processing fee —
            and at checkout you can choose to cover that yourself so your full gift reaches Kapoeta.
          </>
        ),
      },
      {
        q: "Is my donation tax-deductible?",
        a: (
          <>
            Yes. Pathways of Hope Ltd is a registered charity, and a receipt is emailed to you
            automatically as soon as your payment is confirmed. Keep it for your tax records.
          </>
        ),
      },
      {
        q: "How do I get a receipt?",
        a: (
          <>
            A receipt is sent to your email address automatically by our secure payment provider,
            Stripe, the moment your donation is processed. If you can&apos;t find it, check your spam
            folder or email us and we&apos;ll resend it.
          </>
        ),
      },
      {
        q: "Can I give monthly — and cancel later?",
        a: (
          <>
            Yes. You can give once, or set up a recurring gift weekly, fortnightly or monthly. Recurring
            giving is the steadiest way to support the shelter&apos;s running costs, and you can change
            or cancel it at any time — just contact us and we&apos;ll take care of it.
          </>
        ),
      },
      {
        q: "Can I donate by bank transfer instead of card?",
        a: (
          <>
            Yes. On any donation page you&apos;ll find direct bank transfer details beneath the card
            form. Bank transfers carry no processing fee, so every cent reaches the field.
          </>
        ),
      },
      {
        q: "Can I donate from outside Australia?",
        a: (
          <>
            Yes. Donations are processed in Australian dollars (AUD) and most international cards are
            accepted. Your bank may apply its own currency conversion.
          </>
        ),
      },
    ],
  },
  {
    heading: "Where it goes",
    items: [
      {
        q: "What exactly does my money pay for?",
        a: (
          <>
            Gifts go to clearly defined projects at the Kapoeta Children&apos;s Shelter — a solar power
            system, an electric water pump, a chicken coop for eggs and income, the day-to-day running
            of the home, and child sponsorship. You can give to a specific project, or to wherever the
            need is greatest. See the{" "}
            <Link href="/donate" className="text-[#B85C38] font-medium hover:underline">
              donation page
            </Link>{" "}
            for each goal.
          </>
        ),
      },
      {
        q: "What does it cost to sponsor a child?",
        a: (
          <>
            A$600 covers one child&apos;s full year — meals, a safe bed, schooling and the dignity of
            belonging. You can sponsor one child or several.
          </>
        ),
      },
      {
        q: "How will I hear about the impact of my gift?",
        a: (
          <>
            We share milestones and news from Kapoeta on our{" "}
            <Link href="/impact" className="text-[#B85C38] font-medium hover:underline">
              Impact page
            </Link>
            , and you can follow the full story of the shelter on the{" "}
            <Link href="/missions/kapoeta" className="text-[#B85C38] font-medium hover:underline">
              Kapoeta mission page
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    heading: "Trust & security",
    items: [
      {
        q: "Is my payment secure?",
        a: (
          <>
            Yes. Payments are handled by Stripe, a globally trusted, PCI-DSS Level 1 certified provider,
            over an encrypted connection. Your card details go directly to Stripe and are never stored
            on our servers.
          </>
        ),
      },
      {
        q: "Who runs Pathways of Hope?",
        a: (
          <>
            Pathways of Hope is an Australian charity governed by a volunteer Board, working in
            partnership with Brother Hakim Peter — a native of Kapoeta who founded the shelter and leads
            the work on the ground. You can read more on our{" "}
            <Link href="/about" className="text-[#B85C38] font-medium hover:underline">
              About
            </Link>{" "}
            and{" "}
            <Link href="/governance" className="text-[#B85C38] font-medium hover:underline">
              Governance
            </Link>{" "}
            pages.
          </>
        ),
      },
      {
        q: "How do I know the money is well spent?",
        a: (
          <>
            We publish what we&apos;ve raised, what we&apos;ve delivered, and real monthly operating
            statements on our{" "}
            <Link href="/financials" className="text-[#B85C38] font-medium hover:underline">
              Transparency page
            </Link>
            . We operate under formal safeguarding, compliance, conflict-of-interest and
            fraud-prevention policies.
          </>
        ),
      },
    ],
  },
];

function FaqItem({ item }: { item: QA }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#EDD9B4] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
        aria-expanded={open}
      >
        <span className="text-[#1C1410] font-medium text-base sm:text-lg" style={{ fontFamily: "var(--font-serif)" }}>
          {item.q}
        </span>
        <span className="w-8 h-8 rounded-full bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0 text-[#B85C38]">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[#8C7B72] text-sm sm:text-[0.95rem] leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
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
            Questions, answered
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
            Frequently asked questions.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            Everything you might want to know before you give — about your donation, where it goes, and
            how we keep your trust.
          </motion.p>
        </div>
      </section>

      {/* Groups */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-14">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="text-[#C9952A] text-xs font-semibold uppercase tracking-widest mb-5"
              >
                {group.heading}
              </motion.h2>
              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={stagger}
              >
                {group.items.map((item) => (
                  <FaqItem key={item.q} item={item} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-[#F5EFE6]">
        <motion.div
          className="max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Still have a question?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#8C7B72] mb-8">
            Email us at{" "}
            <a href="mailto:stmarknubianfoundation@gmail.com" className="text-[#B85C38] font-medium hover:underline">
              stmarknubianfoundation@gmail.com
            </a>{" "}
            — we&apos;d love to hear from you.
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonateButton size="lg">Make a donation</DonateButton>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
