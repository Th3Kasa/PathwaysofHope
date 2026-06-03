"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Minus, Plus, Lightbulb } from "lucide-react";
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
import { useLang, useT } from "@/lib/i18n";
import { GOAL_AR } from "@/lib/goals-i18n";

interface Props {
  goal: Goal;
  part?: BreakdownPart;
}

function formatMoney(n: number): string {
  // Whole dollars stay clean; cents shown only when present (e.g. the fee).
  return Number.isInteger(n) ? formatAUDFull(n) : `A$${n.toFixed(2)}`;
}

export function DonationPanel({ goal, part }: Props) {
  const { lang } = useLang();
  const t = useT();
  const arGoal = GOAL_AR[goal.id];
  const goalTitle = lang === "ar" ? arGoal.title : goal.title;
  const goalDesc = lang === "ar" ? arGoal.description : goal.description;
  const partTitle = part
    ? (lang === "ar" ? arGoal.parts?.[part.id]?.title ?? part.title : part.title)
    : undefined;
  const partNote = part
    ? (lang === "ar" ? arGoal.parts?.[part.id]?.note ?? part.note : part.note)
    : undefined;

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

  // Always exactly 5 presets so the grid is 5 + Custom = 6 items (2 even rows of 3).
  const presets = part
    ? [part.amount, ...goal.presets.filter((p) => p !== part.amount).slice(0, 4)]
    : goal.presets.slice(0, 5);

  const handlePreset = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!base || base < 1) {
      setError(t({ en: "Please choose an amount of at least A$1.", ar: "يُرجى اختيار مبلغ لا يقلّ عن A$1." }));
      return;
    }
    if (base > 50000) {
      setError(t({
        en: "Maximum single gift is A$50,000. For larger gifts, please contact us directly.",
        ar: "الحدّ الأقصى للتبرّع الواحد هو A$50,000. للتبرّعات الأكبر، يُرجى التواصل معنا مباشرةً.",
      }));
      return;
    }
    if (recurring && !recurringConsent) {
      setError(t({ en: "Please confirm you understand this is a recurring payment.", ar: "يُرجى تأكيد فهمك أن هذا تبرّع متكرّر." }));
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
      const genericError = t({ en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. يُرجى المحاولة مرة أخرى." });
      if (!res.ok || !data.url) throw new Error(data.error || genericError);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t({ en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. يُرجى المحاولة مرة أخرى." }));
      setLoading(false);
    }
  };

  const fact = funFact(goal.id, base, lang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl shadow-sm border border-[#d6d3d1] overflow-hidden"
    >
      {/* Header image + title */}
      <div className="relative h-44 sm:h-52">
        <Image src={goal.image} alt={goal.imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 768px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/85 via-[#1e293b]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {part && (
            <p className="text-[#d6d3d1] text-xs uppercase tracking-widest mb-1">{goalTitle}</p>
          )}
          <h2 className="text-2xl sm:text-3xl font-light text-white" style={{ fontFamily: "var(--font-serif)" }}>
            {part ? partTitle : goalTitle}
          </h2>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        <p className="text-[#6b7280] text-sm leading-relaxed">
          {part ? partNote : goalDesc}
        </p>

        {/* Frequency */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
            {t({ en: "Donation frequency", ar: "تكرار التبرّع" })}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl overflow-hidden border border-[#d6d3d1]">
            {FREQUENCIES.map((f) => (
              <button
                key={f.value}
                onClick={() => { setFrequency(f.value); setError(null); }}
                className={cn(
                  "py-3 text-sm font-semibold transition-colors focus:outline-none",
                  frequency === f.value ? "bg-[#6366f1] text-white" : "bg-white text-[#374151] hover:bg-[#f5f5f4]"
                )}
                aria-pressed={frequency === f.value}
              >
                {t(f.label)}
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
                className="flex items-start gap-3 rounded-xl bg-[#f5f5f4] border border-[#d6d3d1] p-4 cursor-pointer overflow-hidden"
              >
                <input
                  type="checkbox"
                  checked={recurringConsent}
                  onChange={(e) => { setRecurringConsent(e.target.checked); setError(null); }}
                  className="mt-0.5 w-4 h-4 accent-[#6366f1]"
                />
                <span className="text-sm text-[#374151] leading-relaxed">
                  {t({
                    en: "I understand this will be set up as a recurring payment, starting today.",
                    ar: "أتفهّم أن هذا سيُنشأ كتبرّع متكرّر، يبدأ اليوم.",
                  })}
                </span>
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Sponsor-a-child quantity selector */}
        {isSponsor ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
              {t({ en: "How many children? (A$600 each)", ar: "كم عدد الأطفال؟ (A$600 لكلٍّ منهم)" })}
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 rounded-xl border-2 border-[#d6d3d1] flex items-center justify-center text-[#374151] hover:border-[#6366f1] hover:text-[#6366f1] transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Fewer children"
              >
                <Minus size={18} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-light text-[#1e293b] tabular-nums" style={{ fontFamily: "var(--font-serif)" }}>
                  {quantity}
                </span>
                <span className="text-[#6b7280] text-sm ml-2">{quantity === 1 ? t({ en: "child", ar: "طفل" }) : t({ en: "children", ar: "أطفال" })}</span>
              </div>
              <button
                onClick={() => setQuantity((q) => Math.min(35, q + 1))}
                className="w-11 h-11 rounded-xl border-2 border-[#d6d3d1] flex items-center justify-center text-[#374151] hover:border-[#6366f1] hover:text-[#6366f1] transition-colors disabled:opacity-40"
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
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b7280] mb-3">
              {t({ en: "Choose an amount (AUD)", ar: "اختر مبلغًا (بالدولار الأسترالي)" })}
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePreset(p)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none",
                    !customAmount && selectedPreset === p
                      ? "border-[#6366f1] bg-[#6366f1] text-white"
                      : "border-[#d6d3d1] text-[#374151] hover:border-[#6366f1] hover:text-[#6366f1]"
                  )}
                >
                  {formatAUDFull(p)}
                  {part && p === part.amount && <span className="block text-[10px] font-normal opacity-80">{t({ en: "full part", ar: "الجزء كاملًا" })}</span>}
                </button>
              ))}
              <button
                onClick={() => { setSelectedPreset(null); document.getElementById("custom-input")?.focus(); }}
                className={cn(
                  "py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none",
                  customAmount ? "border-[#6366f1] bg-[#6366f1] text-white" : "border-[#d6d3d1] text-[#374151] hover:border-[#6366f1] hover:text-[#6366f1]"
                )}
              >
                {t({ en: "Custom", ar: "مبلغ آخر" })}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] font-medium text-sm">A$</span>
              <input
                id="custom-input"
                type="number"
                min="1"
                max="50000"
                placeholder={t({ en: "Enter amount", ar: "أدخل مبلغًا" })}
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(null); setError(null); }}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#d6d3d1] rounded-xl text-sm text-[#1e293b] focus:outline-none focus:border-[#6366f1] transition-colors"
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
              className="rounded-xl bg-[#f5f5f4] border border-[#d6d3d1] px-4 py-3 flex gap-2.5"
            >
              <Lightbulb className="h-4 w-4 text-[#6366f1] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm text-[#374151] leading-relaxed">{fact}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fee opt-in */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#6366f1]"
          />
          <span className="text-sm text-[#374151] leading-relaxed">
            {t({
              en: `Add the card processing fee (${formatMoney(fee || feeFor(base || 1))}) so 100% of my gift reaches the children.`,
              ar: `أضِف رسم معالجة البطاقة (${formatMoney(fee || feeFor(base || 1))}) ليصل 100% من تبرّعي إلى الأطفال.`,
            })}
          </span>
        </label>

        {/* Total breakdown */}
        {coverFee && base > 0 && (
          <div className="text-xs text-[#6b7280] -mt-4 pl-7">
            {t({ en: "Gift", ar: "التبرّع" })} {formatMoney(base)} + {t({ en: "fee", ar: "رسم" })} {formatMoney(fee)} = <span className="font-semibold text-[#1e293b]">{formatMoney(total)}</span>
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
            "w-full py-4 rounded-xl font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2",
            loading || !base ? "bg-[#d6d3d1] text-[#6b7280] cursor-not-allowed" : "bg-[#6366f1] text-white hover:bg-[#4f46e5]"
          )}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" /> {t({ en: "Redirecting to Stripe…", ar: "يجري التحويل إلى Stripe…" })}
            </span>
          ) : (
            `${t({ en: "Continue", ar: "متابعة" })} — ${formatMoney(total || base)}${frequencySuffix(frequency, lang)}`
          )}
        </button>
        <p className="text-xs text-center text-[#6b7280] -mt-4">
          {t({ en: "Secure, encrypted checkout via Stripe.", ar: "دفع آمن ومشفّر عبر Stripe." })}
          {recurring && t({ en: " Cancel recurring giving anytime.", ar: " يمكنك إلغاء التبرّع المتكرّر في أيّ وقت." })}
        </p>

        <BankTransferPanel />
      </div>
    </motion.div>
  );
}
