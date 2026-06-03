"use client";

import { MissionCard } from "@/components/mission-card";
import { DonateButton } from "@/components/donate-button";
import { Compass } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function MissionsClient() {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4]">
      {/* Header */}
      <section className="py-20 px-4 bg-[#f5f5f4]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-4 font-medium">
            {t({ en: "Where we work", ar: "أين نعمل" })}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1e293b] mb-6 max-w-2xl leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({
              en: "Missions grounded in place, led by locals.",
              ar: "مهامّ راسخة في مكانها، يقودها أبناء المجتمع المحلي.",
            })}
          </h1>
          <p className="text-[#6b7280] text-lg max-w-xl leading-relaxed">
            {t({
              en: "Each Pathways of Hope mission is led by a local partner with deep roots in their community. We come alongside — not to manage, but to resource and support.",
              ar: "تقود كلَّ مهمّة من مهامّ دروب الأمل شراكةٌ محلية ذات جذور عميقة في مجتمعها. نحن نقف إلى جانبهم — لا لندير، بل لنوفّر الموارد ونقدّم الدعم.",
            })}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MissionCard
              slug="kapoeta"
              country={t({ en: "South Sudan", ar: "جنوب السودان" })}
              title={t({ en: "Kapoeta Children's Shelter", ar: "ملجأ كاپويتا للأطفال" })}
              summary={t({
                en: "Brother Hakim Peter shelters 70 children in Kapoeta — providing food, safety, and schooling to children who had none. Supported by communities across Australia, the US, the UK, and Egypt.",
                ar: "يأوي الأخ حكيم بيتر 70 طفلاً في كاپويتا — موفّرًا الطعام والأمان والتعليم لأطفال لم يكن لديهم شيء من ذلك. وتدعمه مجتمعات في أستراليا والولايات المتحدة وبريطانيا ومصر.",
              })}
              imageSrc="/images/kapoeta/field/children-group-portrait-shelter.jpg"
              imageAlt={t({
                en: "Children gathered at the Kapoeta shelter",
                ar: "أطفال مجتمعون في ملجأ كاپويتا",
              })}
              childCount={70}
              status="active"
            />
            {/* Future missions will be added here as MissionCard entries */}
            <div className="rounded-2xl border-2 border-dashed border-[#d6d3d1] flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
              <Compass className="h-9 w-9 mb-4 text-[#6366f1] opacity-30" strokeWidth={1.5} />
              <p className="text-[#6b7280] font-medium mb-2">
                {t({ en: "Next mission coming", ar: "المهمّة القادمة في الطريق" })}
              </p>
              <p className="text-sm text-[#6b7280]">
                {t({
                  en: "We are prayerfully discerning where God calls us next. Stay connected.",
                  ar: "نتبيّن بالصلاة إلى أين يدعونا الله بعد ذلك. ابقَ على تواصل معنا.",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center border-t border-[#d6d3d1]">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-3xl font-light text-[#1e293b] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Ready to partner with us?", ar: "هل أنت مستعدّ لتكون شريكًا لنا؟" })}
          </h2>
          <p className="text-[#6b7280] mb-8">
            {t({
              en: "100% of what you give reaches the children. No exceptions.",
              ar: "‏100% مما تتبرّع به يصل إلى الأطفال. دون استثناء.",
            })}
          </p>
          <DonateButton size="lg">{t({ en: "Give to Kapoeta", ar: "تبرّع لكاپويتا" })}</DonateButton>
        </div>
      </section>
    </div>
  );
}
