"use client";

import { DonateHub } from "@/components/donate-hub";
import { useT, type Dict } from "@/lib/i18n";
import { ShieldCheck, FileText, HeartHandshake, type LucideIcon } from "lucide-react";

interface Props {
  totals: Record<string, { raised: number; supporters: number }> | null;
}

const TRUST: { icon: LucideIcon; label: Dict<string> }[] = [
  { icon: ShieldCheck, label: { en: "Secure checkout via Stripe", ar: "دفع آمن عبر Stripe" } },
  { icon: FileText, label: { en: "DGR — tax-deductible invoice emailed", ar: "فاتورة معفاة من الضرائب (DGR) تُرسل بالبريد" } },
  { icon: HeartHandshake, label: { en: "100% reaches the children", ar: "100% يصل إلى الأطفال" } },
];

export function DonateClient({ totals }: Props) {
  const t = useT();
  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="text-center mb-14">
          <p className="text-[#6366f1] text-sm uppercase tracking-widest mb-4 font-medium">
            {t({ en: "Give with confidence", ar: "تبرّع بثقة" })}
          </p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1e293b] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t({ en: "Choose where your gift goes.", ar: "اختر إلى أين يذهب تبرّعك." })}
          </h1>
          <p className="text-[#6b7280] text-lg max-w-lg mx-auto">
            {t({
              en: "Every dollar reaches the Kapoeta Children's Shelter. Pick a project below to give.",
              ar: "كل دولار يصل إلى ملجأ كاپويتا للأطفال. اختر مشروعًا أدناه للتبرّع.",
            })}
          </p>
        </div>

        <DonateHub totals={totals} />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {TRUST.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label.en} className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                <Icon className="h-4 w-4 text-[#6366f1] flex-shrink-0" strokeWidth={2} />
                <span>{t(item.label)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
