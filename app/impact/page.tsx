"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { DonateButton } from "@/components/donate-button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

interface Milestone {
  period: string;
  title: string;
  body: string;
  image?: string;
  alt?: string;
}

// Every milestone below is drawn directly from the charity's own source
// documents (see KAPOETA-FACTS.md). Dates are stated only as precisely as
// the documents support.
const MILESTONES: Milestone[] = [
  {
    period: "Before 2024",
    title: "The ground is prepared",
    body:
      "Local partner Triple L secured a 10,000 m² parcel of land in Kapoeta, fenced it, drilled a deep water well, and built the first toilets and a small building — laying the foundation for everything that followed.",
    image: "/images/kapoeta/field/children-playing-field-kapoeta.jpg",
    alt: "Children on the open ground at Kapoeta before the shelter was built",
  },
  {
    period: "May–June 2024",
    title: "A community rallies",
    body:
      "The fundraising campaign launched. At an event in Toongabbie, Sydney on 8 June 2024 and through supporters around the world, approximately A$85,000 was raised to build and equip the shelter.",
    image: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
    alt: "A gathering inside the Kapoeta community hall",
  },
  {
    period: "September 2024",
    title: "A 40-foot container sets sail",
    body:
      "A shipping container left Sydney for Mombasa, then travelled overland to Kapoeta. Inside: the complete steel building, dozens of bunk beds, mattresses, wheelchairs, 120 chairs, a generator, solar lights, food for several months, clothing, books and toys.",
    image: "/images/kapoeta/field/container-contents-mattresses-materials.jpg",
    alt: "The contents of the shipping container — mattresses and building materials",
  },
  {
    period: "December 2024",
    title: "A shelter rises",
    body:
      "A team travelled from Australia — joined by supporters from the United States, the United Kingdom and Egypt — to complete the build. The main 16 m × 9 m shelter, with its dormitories and multipurpose hall, was constructed.",
    image: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
    alt: "The steel frame of the Kapoeta shelter under construction",
  },
  {
    period: "Late 2024 – 2025",
    title: "Built to sustain itself",
    body:
      "Beyond the building, the centre gained the means to feed and fund itself: a small dairy herd, a bread oven, a tuk-tuk for transport, cement-block machines, and the foundation work for a water tank tower.",
    image: "/images/kapoeta/field/food-supplies-bags-rice-beans.jpg",
    alt: "Bags of rice and beans — food supplies for the children",
  },
  {
    period: "2025",
    title: "Back to school",
    body:
      "Eighteen of the youngest children are now taught on-site, and 26 older children are enrolled in a local school — their uniforms, tuition and registration fees all funded by supporters.",
    image: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
    alt: "Children in school uniforms at the Kapoeta shelter",
  },
];

export default function ImpactPage() {
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
            From the field
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
            The impact, milestone by milestone.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            Every gift becomes something real on the ground in Kapoeta. Here is the journey so far —
            and what your support is building next.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px bg-[#EDD9B4] sm:-translate-x-1/2" aria-hidden />

            <motion.div
              className="space-y-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={stagger}
            >
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.title}
                  variants={fadeUp}
                  className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-10 sm:items-center ${
                    i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Node */}
                  <div className="absolute left-4 sm:left-1/2 top-2 sm:top-1/2 w-3 h-3 rounded-full bg-[#B85C38] ring-4 ring-[#FDFAF6] -translate-x-1/2 sm:-translate-y-1/2 z-10" aria-hidden />

                  {/* Text */}
                  <div className={i % 2 === 1 ? "sm:text-left sm:pl-10" : "sm:text-right sm:pr-10"}>
                    <p className="text-[#C9952A] text-xs font-semibold uppercase tracking-widest mb-2">
                      {m.period}
                    </p>
                    <h2
                      className="text-2xl font-semibold text-[#1C1410] mb-3"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {m.title}
                    </h2>
                    <p className="text-[#8C7B72] text-sm leading-relaxed">{m.body}</p>
                  </div>

                  {/* Image */}
                  {m.image && (
                    <div className="mt-5 sm:mt-0">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#EDD9B4] shadow-sm">
                        <Image
                          src={m.image}
                          alt={m.alt ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 400px"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's next */}
      <section className="py-20 px-4 bg-[#1C1410]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-10"
          >
            <p className="text-[#E4B84A] text-xs font-semibold uppercase tracking-widest mb-3">
              What your support builds next
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              The road to a self-sufficient home.
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {[
              { t: "Solar power", d: "Light, electricity and the power to run the water pump across the whole centre." },
              { t: "Electric water pump", d: "Clean water drawn from the deep well already on site — no more daily haul by hand." },
              { t: "Chicken coop & 200 chicks", d: "Daily eggs for the children's meals, and surplus to sell for steady income." },
              { t: "Child sponsorship", d: "A$600 gives one child a full year of meals, shelter, schooling and belonging." },
            ].map((g) => (
              <motion.div key={g.t} variants={fadeUp} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {g.t}
                </h3>
                <p className="text-[#C4AE9A] text-sm leading-relaxed">{g.d}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mt-10"
          >
            <DonateButton size="lg">Be part of what&apos;s next</DonateButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
