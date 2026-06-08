"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatAUDFull } from "@/lib/utils";
import type { Goal, GoalId } from "@/lib/goals";
import { useLang, useT } from "@/lib/i18n";
import { GOAL_AR } from "@/lib/goals-i18n";

interface GoalMeterProps {
  goal: Goal;
  raised?: number;
  supporters?: number;
}

export function GoalMeter({
  goal,
  raised: raisedProp,
  supporters: supportersProp,
}: GoalMeterProps) {
  const { lang } = useLang();
  const t = useT();
  const arGoal = GOAL_AR[goal.id as GoalId];
  const title = lang === "ar" ? (arGoal?.title ?? goal.title) : goal.title;
  const description = lang === "ar" ? (arGoal?.description ?? goal.description) : goal.description;
  const unitLabel = lang === "ar" ? (arGoal?.unitLabel ?? goal.unitLabel) : goal.unitLabel;

  const raised = raisedProp ?? 0;
  const supporters = supportersProp ?? 0;
  const percentage = Math.min(Math.round((raised / goal.goalAmount) * 100), 100);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Bar width spring
  const barWidth = useMotionValue(0);
  const springWidth = useSpring(barWidth, { stiffness: 60, damping: 20, mass: 1 });
  const widthPercent = useTransform(springWidth, (v) => `${v}%`);

  // Percentage badge counter
  const badgeValue = useMotionValue(0);
  const badgeSpring = useSpring(badgeValue, { stiffness: 60, damping: 20, mass: 1 });
  const badgeDisplay = useTransform(badgeSpring, (v) => `${Math.floor(v)}%`);

  // Raised amount counter
  const raisedMotion = useMotionValue(0);
  const raisedSpring = useSpring(raisedMotion, { stiffness: 50, damping: 18, mass: 1 });
  const [raisedDisplay, setRaisedDisplay] = useState(formatAUDFull(0));

  useEffect(() => {
    if (!isInView) return;
    barWidth.set(percentage);
    badgeValue.set(percentage);
    raisedMotion.set(raised);
  }, [isInView, percentage, raised, barWidth, badgeValue, raisedMotion]);

  useEffect(() => {
    const unsubscribe = raisedSpring.on("change", (v) => {
      setRaisedDisplay(formatAUDFull(Math.floor(v)));
    });
    return unsubscribe;
  }, [raisedSpring]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-6 shadow-sm border border-[#d6d3d1] w-full"
    >
      {/* Header */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        <h3
          className="text-xl font-semibold text-[#1e293b] mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-[#6b7280] leading-relaxed">{description}</p>
        {unitLabel && (
          <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#d6d3d1] text-[#4f46e5]">
            {unitLabel}
          </span>
        )}
      </motion.div>

      {/* Raised amount */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-medium text-[#6b7280] uppercase tracking-widest mb-1">
            {t({ en: "Raised", ar: "تم جمعه" })}
          </p>
          <motion.p
            className="text-3xl font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              background: "linear-gradient(90deg, #C9952A, #E4B84A, #F0C84E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {raisedDisplay}
          </motion.p>
        </div>
        <div className="text-right pb-1">
          <p className="text-xs font-medium text-[#6b7280] uppercase tracking-widest mb-1">
            {t({ en: "Goal", ar: "الهدف" })}
          </p>
          <p className="text-base font-semibold text-[#1e293b]">
            {formatAUDFull(goal.goalAmount)}
          </p>
        </div>
      </div>

      {/* Progress bar with badge */}
      <div className="relative mb-2 pt-7">
        {/* Badge */}
        <motion.div
          className="absolute top-0 flex items-center"
          style={{ left: widthPercent }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <motion.span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white shadow -translate-x-full"
            style={{
              background: "linear-gradient(90deg, #C9952A, #E4B84A)",
            }}
          >
            {badgeDisplay}
          </motion.span>
        </motion.div>

        {/* Bar track */}
        <div className="w-full h-3.5 rounded-full bg-[#f5f5f4] overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: widthPercent,
              background:
                "linear-gradient(90deg, #C9952A 0%, #E4B84A 55%, #F0C84E 100%)",
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: [0, 0, 1, 1] as const,
                repeatDelay: 0.8,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        {/* % funded */}
        <motion.p
          className="text-sm font-semibold"
          style={{ color: "#C9952A" }}
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percentage}% {t({ en: "funded", ar: "مموَّل" })}
        </motion.p>

        {/* Supporters */}
        <motion.div
          className="flex items-center gap-1.5 text-sm text-[#6b7280]"
          initial={{ opacity: 0, x: 8 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <svg
            className="w-4 h-4 text-[#6b7280]"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="font-medium text-[#1e293b]">
            {supporters.toLocaleString()}
          </span>
          <span>{t({ en: "supporters", ar: "داعمًا" })}</span>
        </motion.div>
      </div>
    </div>
  );
}
