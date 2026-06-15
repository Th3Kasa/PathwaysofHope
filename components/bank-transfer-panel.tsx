"use client";

import { Landmark } from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

export function BankTransferPanel() {
  const t = useT();
  const rows: { label: Dict<string>; value: string }[] = [
    { label: { en: "Account name", ar: "اسم الحساب" }, value: "PATHWAYS OF HOPE LTD" },
    { label: { en: "BSB", ar: "BSB" }, value: "062-217" },
    { label: { en: "Account number", ar: "رقم الحساب" }, value: "1102 4438" },
  ];

  return (
    <div className="rounded-2xl border border-[#d6d3d1] bg-[#f5f5f4] p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
          <Landmark size={18} className="text-[#6366f1]" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-semibold text-[#1e293b] text-sm">
            {t({ en: "Prefer to give directly?", ar: "تفضّل التبرّع مباشرةً؟" })}
          </h3>
          <p className="text-xs text-[#6b7280] leading-relaxed mt-0.5">
            {t({
              en: "Donate by bank transfer to skip the card processing fee — 100% of your gift supports the children.",
              ar: "تبرّع بالتحويل المصرفي لتتجاوز رسم معالجة البطاقة — 100% من تبرّعك يدعم الأطفال.",
            })}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-[#d6d3d1] rounded-xl bg-white border border-[#d6d3d1] overflow-hidden">
        {rows.map((r) => (
          <div key={r.value} className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs uppercase tracking-wider text-[#6b7280] font-medium">
              {t(r.label)}
            </dt>
            <dd className="text-sm font-semibold text-[#1e293b] tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
