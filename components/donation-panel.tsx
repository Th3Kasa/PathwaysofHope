"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Minus, Plus } from "lucide-react";
import { cn, formatAUDFull } from "@/lib/utils";
import type { BreakdownPart, Frequency, Goal } from "@/lib/goals";
import {
  FREQUENCIES,
  feeFor,
  frequencySuffix,
  funFact,
  isRecurring,
} from "@/lib/donation";
import { BankTransferPanel } from "@/components/bank-transfer-panel";

interface Props {
  goal: Goal;
  part?: BreakdownPart;
}

function formatMoney(n: number): string {
  // Whole dollars stay clean; cents shown only when present (e.g. the fee).
  return Number.isInteger(n) ? formatAUDFull(n) : `A$${n.toFixed(2)}`;
}

export function DonationPanel({ goal, part }: Props) {
  const isSponsor = goal.kind === "leaf-qty";
  const unit = goal.unitAmount ?? 600;

  const [frequency, setFrequency] = useState<Frequency>(
    goal.recurringByNature && !isSponsor ? "monthly" : "once"
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    part ? part.amount : goal.presets[1] ?? goal.presets[0] ?? 50
  );
  const [customAmount, setCustomAmount] = useState("");
  const [coverFee, setCoverFee] = useState(true);
  const [recurringConsent, setRecurringConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recurring = isRecurring(frequency);

  const base = isSponsor
    ? quantity * unit
    : customAmount
    ? parseFloat(customAmount) || 0
    : selectedPreset ?? 0;

  const fee = coverFee ? feeFor(base) : 0;
  const total = Math.round((base + fee) * 100) / 100;

  // Presets, with the part total surfaced first when funding a bundle part.
  const presets = part
    ? [part.amount, ...goal.presets.filter((p) => p !== part.amount)]
    : goal.presets;

  const handlePreset = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!base || base < 1) {
      setError("Please choose an amount of at least A$1.");
      return;
    }
    if (base > 50000) {
      setError("Maximum single gift is A$50,000. For larger gifts, please contact us directly.");
      return;
    }
    if (recurring && !recurringConsent) {
      setError("Please confirm you understand this is a recurring payment.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: goal.id,
          partId: part?.id,
          amountAud: base,
          frequency,
          quantity: isSponsor ? quantity : undefined,
          coverFee,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Something went wrong. Please try again.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const fact = funFact(goal.id, base);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl shadow-sm border border-[#EDD9B4] overflow-hidden"
    >
      {/* Header image + title */}
      <div className="relative h-44 sm:h-52">
        <Image src={goal.image} alt={goal.imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 768px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/85 via-[#1C1410]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {part && (
            <p className="text-[#EDD9B4] text-xs uppercase tracking-widest mb-1">{goal.title}</p>
          )}
          <h2 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: "var(--font-serif)" }}>
            {part ? part.title : goal.title}
          </h2>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        <p className="text-[#8C7B72] text-sm leading-relaxed">
          {part ? part.note : goal.description}
        </p>

        {/* Frequency */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-3">
            Donation frequency
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl overflow-hidden border border-[#DDD0C0]">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                onClick={() => { setFrequency(f.value); setError(null); }}
                className={cn(
                  "py-3 text-sm font-semibold transition-colors focus:outline-none",
                  frequency === f.value ? "bg-[#B85C38] text-white" : "bg-white text-[#3D2B1F] hover:bg-[#F5EFE6]"
                )}
                aria-pressed={frequency === f.value}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Recurring consent — only when a recurring frequency is chosen */}
          <AnimatePresence initial={false}>
            {recurring && (
              <motion.label
                key="recurring-consent"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 rounded-xl bg-[#FDF5F0] border border-[#EDD9B4] p-4 cursor-pointer overflow-hidden"
              >
                <input
                  type="checkbox"
                  checked={recurringConsent}
                  onChange={(e) => { setRecurringConsent(e.target.checked); setError(null); }}
                  className="mt-0.5 w-4 h-4 accent-[#B85C38]"
                />
                <span className="text-sm text-[#3D2B1F] leading-relaxed">
                  I understand this will be set up as a recurring payment, starting today.
                </span>
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Sponsor-a-child quantity selector */}
        {isSponsor ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-3">
              How many children? (A$600 each)
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 rounded-xl border-2 border-[#DDD0C0] flex items-center justify-center text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38] transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Fewer children"
              >
                <Minus size={18} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-light text-[#1C1410] tabular-nums" style={{ fontFamily: "var(--font-serif)" }}>
                  {quantity}
                </span>
                <span className="text-[#8C7B72] text-sm ml-2">{quantity === 1 ? "child" : "children"}</span>
              </div>
              <button
                onClick={() => setQuantity((q) => Math.min(35, q + 1))}
                className="w-11 h-11 rounded-xl border-2 border-[#DDD0C0] flex items-center justify-center text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38] transition-colors disabled:opacity-40"
                disabled={quantity >= 35}
                aria-label="More children"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* Amount selector */
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-3">
              Choose an amount (AUD)
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePreset(p)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none",
                    !customAmount && selectedPreset === p
                      ? "border-[#B85C38] bg-[#B85C38] text-white"
                      : "border-[#DDD0C0] text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38]"
                  )}
                >
                  {formatAUDFull(p)}
                  {part && p === part.amount && <span className="block text-[10px] font-normal opacity-80">full part</span>}
                </button>
              ))}
              <button
                onClick={() => { setSelectedPreset(null); document.getElementById("custom-input")?.focus(); }}
                className={cn(
                  "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none",
                  customAmount ? "border-[#B85C38] bg-[#B85C38] text-white" : "border-[#DDD0C0] text-[#3D2B1F] hover:border-[#B85C38] hover:text-[#B85C38]"
                )}
              >
                Custom
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7B72] font-medium text-sm">A$</span>
              <input
                id="custom-input"
                type="number"
                min="1"
                max="50000"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); setError(null); }}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#DDD0C0] rounded-xl text-sm text-[#1C1410] focus:outline-none focus:border-[#B85C38] transition-colors"
                aria-label="Custom donation amount in AUD"
              />
            </div>
          </div>
        )}

        {/* Fun fact */}
        <AnimatePresence mode="wait">
          {fact && (
            <motion.div
              key={fact}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl bg-[#F5EFE6] border border-[#EDD9B4] px-4 py-3 flex gap-2.5"
            >
              <span className="text-base leading-none">💡</span>
              <p className="text-sm text-[#3D2B1F] leading-relaxed">{fact}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fee opt-in */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#B85C38]"
          />
          <span className="text-sm text-[#3D2B1F] leading-relaxed">
            Add the card processing fee ({formatMoney(fee || feeFor(base || 1))}) so 100% of my gift reaches the children.
          </span>
        </label>

        {/* Total breakdown */}
        {coverFee && base > 0 && (
          <div className="text-xs text-[#8C7B72] -mt-4 pl-7">
            Gift {formatMoney(base)} + fee {formatMoney(fee)} = <span className="font-semibold text-[#1C1410]">{formatMoney(total)}</span>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !base}
          className={cn(
            "w-full py-4 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#B85C38] focus:ring-offset-2",
            loading || !base ? "bg-[#DDD0C0] text-[#8C7B72] cursor-not-allowed" : "bg-[#B85C38] text-white hover:bg-[#8B3E23]"
          )}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Redirecting to Stripe…
            </span>
          ) : (
            `Continue — ${formatMoney(total || base)}${frequencySuffix(frequency)}`
          )}
        </button>
        <p className="text-xs text-center text-[#8C7B72] -mt-4">
          Secure, encrypted checkout via Stripe.{recurring && " Cancel recurring giving anytime."}
        </p>

        <BankTransferPanel />
      </div>
    </motion.div>
  );
}
