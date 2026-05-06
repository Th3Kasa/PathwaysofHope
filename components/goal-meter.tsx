"use client";

import { useEffect, useRef, useState } from "react";
import { formatAUDFull } from "@/lib/utils";
import type { Goal } from "@/lib/goals";

interface GoalMeterProps {
  goal: Goal;
  raised?: number;
  supporters?: number;
}

export function GoalMeter({ goal, raised: raisedProp, supporters: supportersProp }: GoalMeterProps) {
  const raised = raisedProp ?? goal.fallbackRaised;
  const supporters = supportersProp ?? goal.fallbackSupporters;
  const percentage = Math.min(Math.round((raised / goal.goalAmount) * 100), 100);

  const barRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EDD9B4]">
      <div className="mb-4">
        <h3
          className="text-xl font-semibold text-[#1C1410] mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {goal.title}
        </h3>
        <p className="text-sm text-[#8C7B72] leading-relaxed">{goal.description}</p>
        {goal.unitLabel && (
          <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#EDD9B4] text-[#8B3E23]">
            {goal.unitLabel}
          </span>
        )}
      </div>

      {/* Bar */}
      <div ref={barRef} className="relative h-3 bg-[#F5EFE6] rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#B85C38] to-[#D4785A] transition-none"
          style={{
            width: animated ? `${percentage}%` : "0%",
            transition: animated ? "width 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-end justify-between text-sm">
        <div>
          <span className="text-xl font-bold text-[#B85C38]" style={{ fontFamily: "var(--font-serif)" }}>
            {formatAUDFull(raised)}
          </span>
          <span className="text-[#8C7B72] ml-1">raised of {formatAUDFull(goal.goalAmount)}</span>
        </div>
        <div className="text-right">
          <div className="text-[#B85C38] font-semibold">{percentage}%</div>
          <div className="text-[#8C7B72] text-xs">{supporters} supporters</div>
        </div>
      </div>
    </div>
  );
}
