"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { DonateButton } from "@/components/donate-button";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

interface Milestone {
  period: Dict<string>;
  title: Dict<string>;
  body: Dict<string>;
  image?: string;
  alt?: Dict<string>;
}

// Every milestone below is drawn directly from the charity's own source
// documents (see KAPOETA-FACTS.md). Dates are stated only as precisely as
// the documents support.
const MILESTONES: Milestone[] = [
  {
    period: { en: "Before 2024", ar: "قبل 2024" },
    title: { en: "The ground is prepared", ar: "تهيئة الأرض" },
    body: {
      en: "Local partner Triple L secured a 20,000 m² (100 m × 200 m) parcel of land in Kapoeta, fenced it, drilled a deep water well, and built the first toilets and a small building — laying the foundation for everything that followed.",
      ar: "أمّن الشريك المحلي Triple L قطعة أرض مساحتها 20,000 م² (100 م × 200 م) في كاپويتا، وسيّجها، وحفر بئر مياه عميقة، وبنى أوّل دورات المياه ومبنى صغيرًا — ممّا أرسى الأساس لكل ما تلا ذلك.",
    },
    image: "/images/kapoeta/field/children-playing-field-kapoeta.jpg",
    alt: {
      en: "Children on the open ground at Kapoeta before the shelter was built",
      ar: "أطفال على الأرض المكشوفة في كاپويتا قبل بناء الملجأ",
    },
  },
  {
    period: { en: "May–June 2024", ar: "مايو–يونيو 2024" },
    title: { en: "A community rallies", ar: "مجتمع يهبّ للعطاء" },
    body: {
      en: "The fundraising campaign launched. At an event in Toongabbie, Sydney on 8 June 2024 and through supporters around the world, approximately A$85,000 was raised to build and equip the shelter.",
      ar: "انطلقت حملة جمع التبرّعات. ومن خلال فعالية في تونغابي بسيدني يوم 8 يونيو 2024 وبدعم من مناصرين حول العالم، جُمع نحو A$85,000 لبناء الملجأ وتجهيزه.",
    },
    image: "/images/kapoeta/field/community-hall-worship-service-kapoeta.jpg",
    alt: {
      en: "A gathering inside the Kapoeta community hall",
      ar: "تجمّع داخل قاعة مجتمع كاپويتا",
    },
  },
  {
    period: { en: "September 2024", ar: "سبتمبر 2024" },
    title: { en: "A 40-foot container sets sail", ar: "حاوية بطول 40 قدمًا تبحر" },
    body: {
      en: "A shipping container left Sydney for Mombasa, then travelled overland to Kapoeta. Inside: the complete steel building, dozens of bunk beds, mattresses, wheelchairs, 120 chairs, a generator, solar lights, food for several months, clothing, books and toys.",
      ar: "غادرت حاوية شحن سيدني إلى مومباسا، ثم سافرت برًّا إلى كاپويتا. وكان بداخلها: المبنى الفولاذي الكامل، وعشرات الأسرّة الطابقية، والمراتب، والكراسي المتحرّكة، و120 كرسيًا، ومولّد كهرباء، وأضواء شمسية، وطعام يكفي عدّة أشهر، وملابس، وكتب، وألعاب.",
    },
    image: "/images/kapoeta/field/container-contents-mattresses-materials.jpg",
    alt: {
      en: "The contents of the shipping container — mattresses and building materials",
      ar: "محتويات حاوية الشحن — مراتب ومواد بناء",
    },
  },
  {
    period: { en: "December 2024", ar: "ديسمبر 2024" },
    title: { en: "A shelter rises", ar: "ملجأ يرتفع" },
    body: {
      en: "A team travelled from Australia — joined by supporters from the United States and the United Kingdom — to complete the build. The main 16 m × 9 m shelter, with its dormitories and multipurpose hall, was constructed.",
      ar: "سافر فريق من أستراليا — انضمّ إليه مناصرون من الولايات المتحدة وبريطانيا — لإتمام البناء. وشُيّد الملجأ الرئيسي بمساحة 16 م × 9 م، بما فيه من مهاجع وقاعة متعدّدة الأغراض.",
    },
    image: "/images/kapoeta/field/shelter-steel-frame-construction-kapoeta.jpg",
    alt: {
      en: "The steel frame of the Kapoeta shelter under construction",
      ar: "الهيكل الفولاذي لملجأ كاپويتا قيد الإنشاء",
    },
  },
  {
    period: { en: "Late 2024 – 2025", ar: "أواخر 2024 – 2025" },
    title: { en: "Built to sustain itself", ar: "مبنيّ ليعيل نفسه" },
    body: {
      en: "Beyond the building, the centre gained the means to feed and fund itself: a small dairy herd, a bread oven, a tuk-tuk for transport, cement-block machines, and the foundation work for a water tank tower.",
      ar: "إلى جانب المبنى، اكتسب المركز وسائل إطعام نفسه وتمويلها: قطيع ألبان صغير، وفرن خبز، ومركبة توك توك للنقل، وآلات لصبّ القوالب الإسمنتية، وأعمال الأساس لبرج خزّان مياه.",
    },
    image: "/images/kapoeta/field/food-supplies-bags-rice-beans.jpg",
    alt: {
      en: "Bags of rice and beans — food supplies for the children",
      ar: "أكياس أرزّ وفاصولياء — مؤن غذائية للأطفال",
    },
  },
  {
    period: { en: "2025", ar: "2025" },
    title: { en: "Back to school", ar: "العودة إلى المدرسة" },
    body: {
      en: "The youngest children are now taught on-site, and 46 children are enrolled in the local Catholic school system for the 2026 academic year — their uniforms, tuition and registration fees all funded by supporters.",
      ar: "يُعلَّم الآن أصغر الأطفال داخل المركز، و46 طفلاً ملتحقون بنظام المدرسة الكاثوليكية المحلية للعام الدراسي 2026 — وقد موّل المناصرون أزياءهم المدرسية ورسومهم الدراسية ورسوم تسجيلهم بالكامل.",
    },
    image: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
    alt: {
      en: "Children in school uniforms at the Kapoeta shelter",
      ar: "أطفال يرتدون الأزياء المدرسية في ملجأ كاپويتا",
    },
  },
];

const NEXT: { title: Dict<string>; desc: Dict<string> }[] = [
  {
    title: { en: "Solar power", ar: "الطاقة الشمسية" },
    desc: {
      en: "Light, electricity and the power to run the water pump across the whole centre.",
      ar: "إنارة وكهرباء والطاقة اللازمة لتشغيل مضخة المياه في المركز بأكمله.",
    },
  },
  {
    title: { en: "Water tank tower & solar pump", ar: "برج خزان المياه والمضخة الشمسية" },
    desc: {
      en: "A tower to hold the water tank and a solar-powered electric pump — drawing clean water from the deep well to expand irrigation and end the daily haul by hand.",
      ar: "برجٌ يحمل خزان المياه ومضخة كهربائية تعمل بالطاقة الشمسية — تسحب مياهًا نظيفة من البئر العميقة لتوسيع الريّ وإنهاء النقل اليومي باليد.",
    },
  },
  {
    title: { en: "Chicken coop & 200 chicks", ar: "حظيرة دجاج و200 كتكوت" },
    desc: {
      en: "Daily eggs for the children's meals, and surplus to sell for steady income.",
      ar: "بيض يومي لوجبات الأطفال، وفائضٌ للبيع لتحقيق دخل ثابت.",
    },
  },
  {
    title: { en: "Child sponsorship", ar: "كفالة طفل" },
    desc: {
      en: "A$600 gives one child a full year of meals, shelter, schooling and belonging.",
      ar: "A$600 تمنح طفلاً واحدًا سنةً كاملة من الوجبات والمأوى والتعليم والانتماء.",
    },
  },
];

export default function ImpactPage() {
  const t = useT();
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
            {t({ en: "From the field", ar: "من الميدان" })}
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
            {t({ en: "The impact, milestone by milestone.", ar: "الأثر، محطّةً بعد محطّة." })}
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl"
          >
            {t({
              en: "Every gift becomes something real on the ground in Kapoeta. Here is the journey so far — and what your support is building next.",
              ar: "كل هديةٍ تصير شيئًا حقيقيًا على الأرض في كاپويتا. إليك الرحلة حتى الآن — وما يبنيه دعمك تاليًا.",
            })}
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
                  key={m.title.en}
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
                      {t(m.period)}
                    </p>
                    <h2
                      className="text-2xl font-semibold text-[#1C1410] mb-3"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {t(m.title)}
                    </h2>
                    <p className="text-[#8C7B72] text-sm leading-relaxed">{t(m.body)}</p>
                  </div>

                  {/* Image */}
                  {m.image && (
                    <div className="mt-5 sm:mt-0">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#EDD9B4] shadow-sm">
                        <Image
                          src={m.image}
                          alt={m.alt ? t(m.alt) : ""}
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
              {t({ en: "What your support builds next", ar: "ما يبنيه دعمك تاليًا" })}
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-white leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "The road to a self-sufficient home.", ar: "الطريق إلى دارٍ مكتفية ذاتيًا." })}
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {NEXT.map((g) => (
              <motion.div key={g.title.en} variants={fadeUp} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {t(g.title)}
                </h3>
                <p className="text-[#C4AE9A] text-sm leading-relaxed">{t(g.desc)}</p>
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
            <DonateButton size="lg">{t({ en: "Be part of what's next", ar: "كن جزءًا مما هو آتٍ" })}</DonateButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
