"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Goal, GoalId } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { BankTransferPanel } from "@/components/bank-transfer-panel";
import { BackLink } from "@/components/back-link";
import { useLang, useT } from "@/lib/i18n";
import { GOAL_AR } from "@/lib/goals-i18n";

export function PartsClient({ goal, imageOverride }: { goal: Goal; imageOverride?: string }) {
  const { lang } = useLang();
  const t = useT();
  const arGoal = GOAL_AR[goal.id as GoalId];
  const title = lang === "ar" ? arGoal.title : goal.title;
  const description = lang === "ar" ? arGoal.description : goal.description;
  const imageAlt = lang === "ar" ? arGoal.imageAlt ?? goal.imageAlt : goal.imageAlt;

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <BackLink href="/donate" label={{ en: "All donation options", ar: "كل خيارات التبرّع" }} />

        {/* Header */}
        <div className="relative h-52 rounded-3xl overflow-hidden mb-8">
          <Image src={imageOverride ?? goal.image} alt={imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 768px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/85 via-[#1e293b]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="text-[#d6d3d1] text-xs uppercase tracking-widest mb-1">
              {t({ en: "Total project", ar: "إجمالي المشروع" })} — {formatAUDFull(goal.goalAmount)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {title}
            </h1>
          </div>
        </div>

        <p className="text-[#374151] leading-relaxed mb-3">{description}</p>
        <p className="text-xs text-[#6b7280] italic mb-8">
          {t({
            en: "The breakdown below shows estimated component costs. Give toward any part — or fund the whole project.",
            ar: "يوضّح التفصيل أدناه التكاليف التقديرية للمكوّنات. تبرّع لأيّ جزء — أو موّل المشروع كاملًا.",
          })}
        </p>

        {/* Fund the whole thing */}
        <Link
          href={`/donate/${goal.id}`}
          className="flex items-center justify-between gap-4 rounded-2xl border-2 border-[#6366f1] bg-[#f5f5f4] p-5 mb-6 hover:bg-[#FBEDE4] transition-colors"
        >
          <div>
            <p className="font-semibold text-[#1e293b]">{t({ en: "Give to the whole project", ar: "تبرّع للمشروع كاملًا" })}</p>
            <p className="text-sm text-[#6b7280]">
              {t({ en: `Any amount toward ${goal.title.toLowerCase()}.`, ar: `أيّ مبلغ نحو ${title}.` })}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] flex-shrink-0">
            {t({ en: "Donate", ar: "تبرّع" })} <ArrowRight size={16} />
          </span>
        </Link>

        {/* Parts */}
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6b7280] mb-4">
          {t({ en: "Or fund a specific part", ar: "أو موّل جزءًا بعينه" })}
        </h2>
        <div className="space-y-3 mb-10">
          {goal.breakdown?.map((part) => {
            const partTitle = lang === "ar" ? arGoal.parts?.[part.id]?.title ?? part.title : part.title;
            const partNote = lang === "ar" ? arGoal.parts?.[part.id]?.note ?? part.note : part.note;
            return (
              <Link
                key={part.id}
                href={`/donate/${goal.id}?part=${part.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#d6d3d1] bg-white p-5 hover:border-[#6366f1] hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-[#1e293b]">{partTitle}</p>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{partNote}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>
                    {formatAUDFull(part.amount)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366f1]">
                    {t({ en: "Donate", ar: "تبرّع" })} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <BankTransferPanel />
      </div>
    </div>
  );
}
