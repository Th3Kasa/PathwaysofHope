"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Sun, Egg, Droplets, HeartHandshake, Baby, Heart, ArrowRight } from "lucide-react";
import { type GoalId, type Goal } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { useLang, useT } from "@/lib/i18n";
import { GOAL_AR } from "@/lib/goals-i18n";

interface Props {
  totals: Record<string, { raised: number; supporters: number }> | null;
  imageOverrides?: Record<string, string>;
  captionOverrides?: Record<string, string>;
  goals: Goal[];
}

const ICONS: Record<GoalId, React.ElementType> = {
  "solar-system": Sun,
  "chicken-coop": Egg,
  "water-pump": Droplets,
  "ongoing-operations": HeartHandshake,
  "sponsor-a-child": Baby,
  "where-most-needed": Heart,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function hrefFor(goal: Goal): string {
  return goal.kind === "bundle" ? `/donate/${goal.id}/parts` : `/donate/${goal.id}`;
}

export function DonateHub({ totals, goals }: Props) {
  const { lang } = useLang();
  const t = useT();
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {goals.map((goal) => {
        const Icon = ICONS[goal.id as GoalId] ?? Heart;
        const arGoal = GOAL_AR[goal.id as GoalId];
        const title = lang === "ar" && arGoal ? arGoal.title : goal.title;
        const short = lang === "ar" && arGoal ? arGoal.short : goal.short;
        const unitLabel = lang === "ar" && arGoal ? (arGoal.unitLabel ?? goal.unitLabel) : goal.unitLabel;
        const raised = totals?.[goal.id]?.raised ?? 0;
        const supporters = totals?.[goal.id]?.supporters ?? 0;
        const pct = goal.goalAmount > 0
          ? Math.min(Math.round((raised / goal.goalAmount) * 100), 100)
          : 0;

        return (
          <motion.div
            key={goal.id}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d6d3d1] shadow-sm flex flex-col"
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                {Icon && <Icon size={20} className="text-[#6366f1]" strokeWidth={1.75} />}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1e293b] leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {title}
                </h3>
                {unitLabel && (
                  <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-[#d6d3d1] text-[#4f46e5] font-medium">
                    {unitLabel}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[#6b7280] text-sm leading-relaxed mb-5 flex-grow">{short}</p>

            {/* Progress meter — hidden for open-ended custom gifts */}
            {goal.hideMeter ? (
              <div className="mb-6 rounded-xl bg-[#f5f5f4] border border-[#d6d3d1] px-4 py-3 flex items-center gap-2.5">
                <Heart size={14} className="text-[#6366f1] flex-shrink-0" />
                <span className="text-xs text-[#6b7280] leading-relaxed">
                  {t({ en: "You choose the amount — we direct it where it's needed most.", ar: "أنت تحدّد المبلغ — ونحن نوجّهه إلى حيثما يكون الاحتياج أشدّ." })}
                </span>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-lg font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>
                    {formatAUDFull(raised)}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    {t({ en: "of", ar: "من" })} {formatAUDFull(goal.goalAmount)}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#f5f5f4] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C9952A,#E4B84A,#F0C84E)" }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold" style={{ color: "#C9952A" }}>{pct}% {t({ en: "funded", ar: "مموَّل" })}</span>
                  {supporters > 0 && (
                    <span className="text-xs text-[#6b7280]">{supporters.toLocaleString()} {t({ en: "supporters", ar: "داعمًا" })}</span>
                  )}
                </div>
              </div>
            )}

            <Link
              href={hrefFor(goal)}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#4f46e5] transition-colors"
            >
              {goal.kind === "bundle" ? t({ en: "See the breakdown", ar: "اطّلع على التفاصيل" }) : t({ en: "Donate", ar: "تبرّع" })} <ArrowRight size={16} />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
