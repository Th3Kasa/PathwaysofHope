"use client";

import { Heart, ShieldCheck, Users, Globe } from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

interface Item {
  icon: typeof Heart;
  heading: Dict<string>;
  body: Dict<string>;
}

const items: Item[] = [
  {
    icon: Heart,
    heading: { en: "100% to the children", ar: "100% للأطفال" },
    body: {
      en: "Every dollar reaches Kapoeta. Our volunteers self-fund all travel and operational costs — structurally, not just by promise.",
      ar: "كل دولار يصل إلى كاپويتا. يموّل متطوعونا بأنفسهم جميع نفقات السفر والتشغيل — كحقيقة في بنية عملنا، وليس مجرد وعد.",
    },
  },
  {
    icon: ShieldCheck,
    heading: { en: "DGR — tax-deductible receipt", ar: "إيصال معفى من الضرائب (DGR)" },
    body: {
      en: "Pathways of Hope Ltd · ABN 40 686 574 630. ACNC-registered and endorsed by the ATO as a Deductible Gift Recipient (DGR) — every gift of $2+ receives a tax-deductible invoice.",
      ar: "Pathways of Hope Ltd · ABN 40 686 574 630. مسجّلة لدى ACNC ومعتمدة من مكتب الضرائب الأسترالي كجهة مؤهَّلة لاستلام الهبات المعفاة (DGR) — كل تبرّع بقيمة $2 فأكثر يحصل على إيصال معفى من الضرائب.",
    },
  },
  {
    icon: Users,
    heading: { en: "On-the-ground leadership", ar: "قيادة ميدانية محلية" },
    body: {
      en: "Brother Hakim lives and works in Kapoeta — local leadership, not outsider management.",
      ar: "الأخ حكيم يعيش ويعمل في كاپويتا — قيادة محلية من القلب، لا إدارة من الخارج.",
    },
  },
  {
    icon: Globe,
    heading: { en: "Multi-continental partnership", ar: "شراكة عابرة للقارات" },
    body: {
      en: "Toongabbie Church and a community of partners across Australia, the US, UK, and Egypt.",
      ar: "كنيسة تونغابي ومجتمع من الشركاء في أستراليا والولايات المتحدة وبريطانيا ومصر.",
    },
  },
];

export function TrustStrip() {
  const t = useT();
  return (
    <section className="bg-[#f5f5f4] border-y border-[#d6d3d1] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-10"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t({ en: "Why trust us with your giving", ar: "لماذا تثق بنا في عطائك" })}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.heading.en} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#6366f1]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[#1e293b] font-semibold text-sm mb-1">{t(item.heading)}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{t(item.body)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
