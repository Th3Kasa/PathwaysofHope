"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Sun, Egg, Droplets, HeartHandshake, Baby, ArrowRight } from "lucide-react";
import { KAPOETA_GOALS, type GoalId, type Goal } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { useLang, useT } from "@/lib/i18n";
import { GOAL_AR } from "@/lib/goals-i18n";

interface Props {
  totals: Record<string, { raised: number; supporters: number }> | null;
}

const ICONS: Record<GoalId, React.ElementType> = {
  "solar-system": Sun,
  "chicken-coop": Egg,
  "water-pump": Droplets,
  "ongoing-operations": HeartHandshake,
  "sponsor-a-child": Baby,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function hrefFor(goal: Goal): string {
  return goal.kind === "bundle" ? `/donate/${goal.id}/parts` : `/donate/${goal.id}`;
}

export function DonateHub({ totals }: Props) {
  const { lang } = useLang();
  const t = useT();
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {KAPOETA_GOALS.map((goal) => {
        const Icon = ICONS[goal.id];
        const arGoal = GOAL_AR[goal.id];
        const title = lang === "ar" ? arGoal.title : goal.title;
        const short = lang === "ar" ? arGoal.short : goal.short;
        const unitLabel = lang === "ar" ? arGoal.unitLabel ?? goal.unitLabel : goal.unitLabel;
        const raised = totals?.[goal.id]?.raised ?? 0;
        const supporters = totals?.[goal.id]?.supporters ?? 0;
        const pct = Math.min(Math.round((raised / goal.goalAmount) * 100), 100);

        return (
          <motion.div
            key={goal.id}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EDD9B4] shadow-sm flex flex-col"
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                {Icon && <Icon size={20} className="text-[#B85C38]" strokeWidth={1.75} />}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1C1410] leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {title}
                </h3>
                {unitLabel && (
                  <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-[#EDD9B4] text-[#8B3E23] font-medium">
                    {unitLabel}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[#8C7B72] text-sm leading-relaxed mb-5 flex-grow">{short}</p>

            {/* Compact progress meter */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>
                  {formatAUDFull(raised)}
                </span>
                <span className="text-xs text-[#8C7B72]">
                  {t({ en: "of", ar: "من" })} {formatAUDFull(goal.goalAmount)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F5EFE6] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C9952A,#E4B84A,#F0C84E)" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold" style={{ color: "#C9952A" }}>{pct}% {t({ en: "funded", ar: "مموَّل" })}</span>
                {supporters > 0 && (
                  <span className="text-xs text-[#8C7B72]">{supporters.toLocaleString()} {t({ en: "supporters", ar: "داعمًا" })}</span>
                )}
              </div>
            </div>

            <Link
              href={hrefFor(goal)}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#B85C38] text-white text-sm font-semibold hover:bg-[#8B3E23] transition-colors"
            >
              {goal.kind === "bundle" ? t({ en: "See the breakdown", ar: "اطّلع على التفاصيل" }) : t({ en: "Donate", ar: "تبرّع" })} <ArrowRight size={16} />
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
