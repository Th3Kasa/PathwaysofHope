"use client";

import { useState } from "react";
import { Landmark, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useT, type Dict } from "@/lib/i18n";

interface Props {
  /** Pass the current goalId so the receipt references the right project. */
  goalId?: string;
}

/**
 * Shown at the bottom of every donation screen — lets donors give by direct
 * bank transfer and request a receipt.
 */
export function BankTransferPanel({ goalId }: Props) {
  const t = useT();
  const rows: { label: Dict<string>; value: string }[] = [
    { label: { en: "Account name", ar: "اسم الحساب" }, value: "PATHWAYS OF HOPE LTD" },
    { label: { en: "BSB", ar: "BSB" }, value: "062-217" },
    { label: { en: "Account number", ar: "رقم الحساب" }, value: "1102 4438" },
  ];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountAud = parseFloat(amount);
    if (!name.trim() || !email.trim() || isNaN(amountAud) || amountAud < 1) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bank-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), amountAud, goalId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? t({ en: "Something went wrong.", ar: "حدث خطأ ما." }));
        setStatus("error");
      } else {
        setStatus("sent");
      }
    } catch {
      setErrorMsg(t({ en: "Network error. Please try again.", ar: "خطأ في الشبكة. حاول مجددًا." }));
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-[#EDD9B4] bg-[#FDF8F0] p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0">
          <Landmark size={18} className="text-[#B85C38]" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="font-semibold text-[#1C1410] text-sm">
            {t({ en: "Prefer to give directly?", ar: "تفضّل التبرّع مباشرةً؟" })}
          </h3>
          <p className="text-xs text-[#8C7B72] leading-relaxed mt-0.5">
            {t({
              en: "Donate by bank transfer to skip the card processing fee — 100% reaches the children.",
              ar: "تبرّع بالتحويل المصرفي لتتجاوز رسم معالجة البطاقة — 100% يصل إلى الأطفال.",
            })}
          </p>
        </div>
      </div>

      {/* Account details */}
      <dl className="divide-y divide-[#EDD9B4] rounded-xl bg-white border border-[#EDD9B4] overflow-hidden mb-4">
        {rows.map((r) => (
          <div key={r.value} className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs uppercase tracking-wider text-[#8C7B72] font-medium">
              {t(r.label)}
            </dt>
            <dd className="text-sm font-semibold text-[#1C1410] tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>

      {/* Receipt request */}
      {status === "sent" ? (
        <div className="flex items-center gap-2 rounded-xl bg-[#F0F7F0] border border-[#B8D4B8] px-4 py-3">
          <CheckCircle2 size={16} className="text-[#2D7A2D] flex-shrink-0" />
          <p className="text-sm text-[#2D5A2D]">
            {t({ en: "Receipt sent! Check your inbox.", ar: "تم إرسال الإيصال! تفقّد بريدك الوارد." })}
          </p>
        </div>
      ) : !open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#B85C38] hover:text-[#9A4A2E] transition-colors"
        >
          <Mail size={14} />
          {t({ en: "Email me a receipt", ar: "أرسِل لي إيصالًا بالبريد" })}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-[#EDD9B4] pt-4 mt-2">
          <p className="text-xs text-[#8C7B72]">
            {t({
              en: "Enter your details and we'll email a professional receipt for your records.",
              ar: "أدخل بياناتك وسنرسل إليك إيصالًا رسميًا بالبريد الإلكتروني.",
            })}
          </p>

          <input
            type="text"
            placeholder={t({ en: "Your full name", ar: "اسمك الكامل" })}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#EDD9B4] bg-white px-3 py-2 text-sm text-[#1C1410] placeholder:text-[#C0AFA6] focus:outline-none focus:ring-2 focus:ring-[#B85C38]/40 focus:border-[#B85C38]"
          />
          <input
            type="email"
            placeholder={t({ en: "Email address", ar: "البريد الإلكتروني" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[#EDD9B4] bg-white px-3 py-2 text-sm text-[#1C1410] placeholder:text-[#C0AFA6] focus:outline-none focus:ring-2 focus:ring-[#B85C38]/40 focus:border-[#B85C38]"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8C7B72] flex-shrink-0">A$</span>
            <input
              type="number"
              placeholder={t({ en: "Amount transferred", ar: "المبلغ المحوَّل" })}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              className="flex-1 rounded-lg border border-[#EDD9B4] bg-white px-3 py-2 text-sm text-[#1C1410] placeholder:text-[#C0AFA6] focus:outline-none focus:ring-2 focus:ring-[#B85C38]/40 focus:border-[#B85C38]"
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-red-600">{errorMsg}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B85C38] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9A4A2E] disabled:opacity-60 transition-colors"
            >
              {status === "sending" && <Loader2 size={14} className="animate-spin" />}
              {t({ en: "Send receipt", ar: "إرسال الإيصال" })}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setStatus("idle"); }}
              className="text-sm text-[#8C7B72] hover:text-[#5A4034] transition-colors"
            >
              {t({ en: "Cancel", ar: "إلغاء" })}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
