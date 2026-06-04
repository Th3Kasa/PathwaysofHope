"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, CreditCard, RefreshCcw, Scale, Mail } from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const LAST_UPDATED: Dict<string> = { en: "4 June 2026", ar: "4 يونيو 2026" };
const CONTACT_EMAIL = "pathways_of_hope@outlook.com";

const SECTIONS: { icon: typeof FileText; title: Dict<string>; body: Dict<string>[] }[] = [
  {
    icon: FileText,
    title: { en: "About us", ar: "عنّا" },
    body: [
      {
        en: "Pathways of Hope Ltd (ABN 40 686 574 630) is a public company limited by guarantee, registered with the Australian Charities and Not-for-profits Commission (ACNC) and endorsed by the ATO as a Deductible Gift Recipient (DGR). By using this website or making a donation, you agree to these terms.",
        ar: "Pathways of Hope Ltd (ABN 40 686 574 630) شركة عامة محدودة بالضمان، مسجّلة لدى هيئة الجمعيات الخيرية والمنظمات غير الربحية الأسترالية (ACNC) ومعتمدة من مكتب الضرائب الأسترالي كجهة مؤهَّلة لاستلام الهبات المعفاة (DGR). باستخدامك هذا الموقع أو إجراء تبرّع، فإنك توافق على هذه الشروط.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: { en: "Donations", ar: "التبرّعات" },
    body: [
      {
        en: "All donations are made voluntarily in Australian dollars (AUD). Donations are applied to the charitable purposes of Pathways of Hope. Where you select a specific project, we apply your gift to that project. If the project is fully funded, we may redirect your gift to the area of greatest need.",
        ar: "جميع التبرّعات طوعية وبالدولار الأسترالي (AUD). تُطبَّق التبرّعات على الأغراض الخيرية لمنظمة دروب الأمل. إن اخترت مشروعًا محددًا، طبّقنا هبتك على ذلك المشروع. وإن كان المشروع ممولًا بالكامل، قد نُعيد توجيه تبرّعك إلى منطقة أشد الحاجة.",
      },
      {
        en: "Gifts of $2 or more are tax-deductible for Australian taxpayers. A tax-deductible invoice is issued by Stripe and emailed automatically for every card payment.",
        ar: "التبرّعات بمبلغ $2 أو أكثر معفاة من الضرائب لدافعي الضرائب الأستراليين. يُصدر Stripe فاتورة معفاة من الضرائب تُرسَل تلقائيًا بالبريد الإلكتروني عن كل دفعة بالبطاقة.",
      },
    ],
  },
  {
    icon: RefreshCcw,
    title: { en: "Recurring donations", ar: "التبرّعات المتكرّرة" },
    body: [
      {
        en: "If you set up a recurring (weekly, fortnightly or monthly) donation, your chosen amount will be charged automatically each period until you cancel. You can cancel at any time by emailing us at pathways_of_hope@outlook.com — we will action your request within 15 days and email you to confirm once it is done.",
        ar: "إن اخترت تبرّعًا متكرّرًا (أسبوعيًا أو كل أسبوعين أو شهريًا)، سيُخصَم المبلغ المحدد تلقائيًا في كل دورة حتى تلغي الاشتراك. يمكنك الإلغاء في أي وقت بمراسلتنا على pathways_of_hope@outlook.com — سنتخذ إجراءً في غضون 15 يومًا ونؤكد لك بالبريد الإلكتروني عند الانتهاء.",
      },
    ],
  },
  {
    icon: Scale,
    title: { en: "Payments & security", ar: "المدفوعات والأمان" },
    body: [
      {
        en: "Payments are processed securely by Stripe. We do not store your full card details. No goods or services were provided in exchange for any donation.",
        ar: "تُعالَج المدفوعات بأمان عبر Stripe. لا نحتفظ ببيانات بطاقتك الكاملة. لا تُقدَّم أيّ بضائع أو خدمات مقابل التبرّعات.",
      },
    ],
  },
  {
    icon: Mail,
    title: { en: "Contact", ar: "التواصل" },
    body: [
      {
        en: `Questions about these terms? All enquiries go to ${CONTACT_EMAIL}. This is the single point of contact for Pathways of Hope.`,
        ar: `هل لديك أسئلة حول هذه الشروط؟ جميع الاستفسارات تُوجَّه إلى ${CONTACT_EMAIL}. هذا هو نقطة الاتصال الوحيدة لمنظمة دروب الأمل.`,
      },
    ],
  },
];

export default function TermsPage() {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium">
            {t({ en: "Legal", ar: "قانوني" })}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Terms of Use", ar: "شروط الاستخدام" })}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-[#6b7280] mb-12">
            {t({ en: "Last updated:", ar: "آخر تحديث:" })} {t(LAST_UPDATED)}
          </motion.p>

          <motion.div variants={stagger} className="space-y-10">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <motion.section key={section.title.en} variants={fadeUp}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#6366f1]" strokeWidth={1.75} />
                    </div>
                    <h2
                      className="text-xl font-semibold text-[#1e293b]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {t(section.title)}
                    </h2>
                  </div>
                  <div className="space-y-3 pl-12">
                    {section.body.map((para, i) => (
                      <p key={i} className="text-[#374151] text-[15px] leading-relaxed">
                        {t(para)}
                      </p>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
