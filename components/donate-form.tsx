"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { KAPOETA_GOALS, type GoalId } from "@/lib/goals";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const PRESETS = [25, 50, 100, 250, 600];

const GOAL_DESCRIPTIONS: Record<GoalId, string> = {
  "water-tower": "Fund a permanent water tower and solar-powered pump for all 60 children.",
  "poultry-project": "Build a 200-chicken coop — nutrition and sustainable income in one project.",
  "sponsor-a-child": "A$600 covers one child's full year: food, shelter, schooling, and belonging.",
  "general-support": "Keep the shelter running: food, staff, utilities, medical care.",
};

export function DonateForm() {
  const searchParams = useSearchParams();
  const initialGoal = (searchParams.get("goal") as GoalId) || "general-support";

  const [selectedGoal, setSelectedGoal] = useState<GoalId>(initialGoal);
  const [mode, setMode] = useState<"payment" | "subscription">("payment");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const g = searchParams.get("goal") as GoalId | null;
    if (g && KAPOETA_GOALS.find((x) => x.id === g)) {
      setSelectedGoal(g);
    }
  }, [searchParams]);

  const effectiveAmount = customAmount
    ? parseFloat(customAmount)
    : (selectedPreset ?? 0);

  const handlePreset = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
    setError(null);
  };

  const handleCustom = (val: string) => {
    setCustomAmount(val);
    setSelectedPreset(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!effectiveAmount || effectiveAmount < 1) {
      setError("Please enter an amount of at least A$1.");
      return;
    }
    if (effectiveAmount > 50000) {
      setError("Maximum single donation is A$50,000. For larger gifts, please contact us directly.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: selectedGoal,
          amountAud: effectiveAmount,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#EDD9B4] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left — goal selector */}
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#EDD9B4]">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-5">
            1. Choose where to give
          </h2>
          <div className="flex flex-col gap-3">
            {KAPOETA_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={cn(
                  "w-full text-left rounded-xl px-5 py-4 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#B85C38] focus:ring-offset-1",
                  selectedGoal === goal.id
                    ? "border-[#B85C38] bg-[#FDF5F0]"
                    : "border-[#DDD0C0] hover:border-[#C4AE9A]"
                )}
                aria-pressed={selectedGoal === goal.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#1C1410] text-sm">{goal.title}</p>
                    <p className="text-xs text-[#8C7B72] mt-0.5 leading-relaxed">
                      {GOAL_DESCRIPTIONS[goal.id]}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors",
                      selectedGoal === goal.id
                        ? "border-[#B85C38] bg-[#B85C38]"
                        : "border-[#DDD0C0]"
                    )}
                  />
                </div>
                {goal.unitLabel && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[#EDD9B4] text-[#8B3E23] font-medium">
                    {goal.unitLabel}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right — amount + frequency */}
        <div className="p-8 lg:p-10">
          {/* Frequency toggle */}
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-5">
            2. Give once or monthly
          </h2>
          <div className="flex rounded-xl overflow-hidden border border-[#DDD0C0] mb-8">
            <button
              onClick={() => setMode("payment")}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none",
                mode === "payment"
                  ? "bg-[#B85C38] text-white"
                  : "bg-white text-[#3D2B1F] hover:bg-[#F5EFE6]"
              )}
              aria-pressed={mode === "payment"}
            >
              Give once
            </button>
            <button
              onClick={() => setMode("subscription")}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none",
                mode === "subscription"
                  ? "bg-[#B85C38] text-white"
                  : "bg-white text-[#3D2B1F] hover:bg-[#F5EFE6]"
              )}
              aria-pressed={mode === "subscription"}
            >
              Give monthly
            </button>
          </div>

          {/* Amount presets */}
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-4">
            3. Choose an amount (AUD)
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => handlePreset(p)}
                className={cn(
                  "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#B85C38]",
                  selectedPreset === p
                    ? "border-[#B85C38] bg-[#B85C38] text-white"
                    : "border-[#DDD0C0] text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38]"
                )}
                aria-pressed={selectedPreset === p}
              >
                A${p}
              </button>
            ))}
            <button
              onClick={() => { setSelectedPreset(null); setCustomAmount(""); document.getElementById("custom-input")?.focus(); }}
              className={cn(
                "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#B85C38]",
                customAmount
                  ? "border-[#B85C38] bg-[#B85C38] text-white"
                  : "border-[#DDD0C0] text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38]"
              )}
            >
              Custom
            </button>
          </div>

          {/* Custom amount input */}
          <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B72] font-medium text-sm">
              A$
            </span>
            <input
              id="custom-input"
              type="number"
              min="1"
              max="50000"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => handleCustom(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#DDD0C0] rounded-xl text-sm text-[#1C1410] focus:outline-none focus:border-[#B85C38] transition-colors"
              aria-label="Custom donation amount in AUD"
            />
          </div>

          {/* What this covers */}
          {effectiveAmount >= 25 && (
            <p className="text-xs text-[#8C7B72] mb-6 pl-1">
              {effectiveAmount >= 600
                ? `A$${effectiveAmount} sponsors a full year for one child.`
                : effectiveAmount >= 250
                ? `A$${effectiveAmount} covers medical care for the entire shelter for a month.`
                : effectiveAmount >= 100
                ? `A$${effectiveAmount} covers a month of educational materials for all 60 children.`
                : `A$${effectiveAmount} feeds a child for ${Math.floor(effectiveAmount / 3.5)} days.`}
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !effectiveAmount}
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#B85C38] focus:ring-offset-2",
              loading || !effectiveAmount
                ? "bg-[#DDD0C0] text-[#8C7B72] cursor-not-allowed"
                : "bg-[#B85C38] text-white hover:bg-[#8B3E23]"
            )}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Redirecting to Stripe…
              </span>
            ) : (
              `Continue to Stripe${effectiveAmount ? ` — A$${effectiveAmount}` : ""}${mode === "subscription" ? "/month" : ""}`
            )}
          </button>

          <p className="text-xs text-center text-[#8C7B72] mt-4">
            You&apos;ll be redirected to Stripe — secure, encrypted checkout.
            {mode === "subscription" && " Cancel monthly giving anytime."}
          </p>
        </div>
      </div>
    </div>
  );
}
