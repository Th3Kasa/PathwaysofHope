import type { Frequency, GoalId } from "@/lib/goals";
import type { Dict, Lang } from "@/lib/i18n";

// ─── Stripe fee (AU domestic card: 1.75% + A$0.30) ─────────────────────────
export const FEE_PERCENT = 0.0175;
export const FEE_FIXED = 0.3;

/** The fee a donor opts to cover, so close to 100% of the gift reaches the field. */
export function feeFor(amountAud: number): number {
  if (amountAud <= 0) return 0;
  return Math.round((amountAud * FEE_PERCENT + FEE_FIXED) * 100) / 100;
}

// ─── Frequency helpers ─────────────────────────────────────────────────────
// `value` is the Stripe-facing frequency and must never change; only the
// `label` shown to donors is translated.
export const FREQUENCIES: { value: Frequency; label: Dict<string> }[] = [
  { value: "once", label: { en: "Give Once", ar: "تبرّع مرة واحدة" } },
  { value: "weekly", label: { en: "Weekly", ar: "أسبوعيًا" } },
  { value: "fortnightly", label: { en: "Fortnightly", ar: "كل أسبوعين" } },
  { value: "monthly", label: { en: "Monthly", ar: "شهريًا" } },
];

export function isRecurring(freq: Frequency): boolean {
  return freq !== "once";
}

/** Suffix for the Continue button, e.g. "per week". */
export function frequencySuffix(freq: Frequency, lang: Lang = "en"): string {
  const suffixes: Record<Exclude<Frequency, "once">, Dict<string>> = {
    weekly: { en: " per week", ar: " أسبوعيًا" },
    fortnightly: { en: " per fortnight", ar: " كل أسبوعين" },
    monthly: { en: " per month", ar: " شهريًا" },
  };
  if (freq === "once") return "";
  return suffixes[freq][lang];
}

/** Maps a frequency to a Stripe recurring config. */
export function stripeRecurring(
  freq: Frequency
): { interval: "week" | "month"; interval_count: number } | null {
  switch (freq) {
    case "weekly":
      return { interval: "week", interval_count: 1 };
    case "fortnightly":
      return { interval: "week", interval_count: 2 };
    case "monthly":
      return { interval: "month", interval_count: 1 };
    default:
      return null;
  }
}

// ─── Fun facts (educated estimates, grounded in the project's real work) ───
// Returns a short, encouraging fact tuned to the item and the amount given.

export function funFact(goalId: GoalId, amount: number, lang: Lang = "en"): string {
  if (!amount || amount < 1) return "";
  const pick = (pair: Dict<string>) => pair[lang];

  switch (goalId) {
    case "sponsor-a-child": {
      const kids = Math.max(1, Math.round(amount / 600));
      return kids === 1
        ? pick({
            en: "That's one child's entire year — meals, a safe bed, school and belonging.",
            ar: "هذه سنة كاملة لطفل واحد — وجبات وسرير آمن وتعليم وانتماء.",
          })
        : pick({
            en: `That's a full year for ${kids} children — meals, safe beds, school and belonging.`,
            ar: `هذه سنة كاملة لـ${kids} أطفال — وجبات وأسرّة آمنة وتعليم وانتماء.`,
          });
    }
    case "solar-system":
      if (amount >= 9000) return pick({ en: "Enough to fund the entire solar panel array — the heart of the system.", ar: "ما يكفي لتمويل مصفوفة الألواح الشمسية بأكملها — قلب النظام." });
      if (amount >= 3000) return pick({ en: "That could cover the inverter and charge controller that make the whole system safe to use.", ar: "قد يغطّي ذلك العاكس ومنظّم الشحن اللذين يجعلان استخدام النظام بأكمله آمنًا." });
      if (amount >= 500) return pick({ en: "Roughly a fifth of the wiring and lighting that will reach every room.", ar: "نحو خُمس الأسلاك والإنارة التي ستصل إلى كل غرفة." });
      if (amount >= 100) return pick({ en: "That's a real chunk of cabling carrying power across the site.", ar: "هذا جزء حقيقي من الكابلات التي تنقل الطاقة عبر الموقع." });
      return pick({ en: "Every dollar brings the lights one step closer to coming on.", ar: "كل دولار يقرّب الأنوار خطوة من أن تُضاء." });
    case "chicken-coop":
      if (amount >= 2500) return pick({ en: "Enough to build the entire predator-proof coop the flock will live in.", ar: "ما يكفي لبناء الحظيرة الآمنة من المفترسات بأكملها التي سيعيش فيها القطيع." });
      if (amount >= 1200) return pick({ en: "That could buy all 200 chicks at once.", ar: "قد يشتري ذلك جميع الكتاكيت الـ200 دفعة واحدة." });
      if (amount >= 800) return pick({ en: "That's three months of feed — enough to raise the chicks to laying age.", ar: "هذا علف ثلاثة أشهر — يكفي لتربية الكتاكيت حتى سنّ وضع البيض." });
      if (amount >= 100) return pick({ en: "Roughly 20 chicks, plus a little feed to get them started.", ar: "نحو 20 كتكوتًا، مع قليل من العلف لبدايتها." });
      return pick({ en: "A few chicks today; a steady supply of eggs tomorrow.", ar: "بضعة كتاكيت اليوم؛ وإمدادٌ ثابت من البيض غدًا." });
    case "water-pump":
      if (amount >= 1500) return pick({ en: "That funds the whole pump — clean water drawn for the entire shelter.", ar: "هذا يموّل المضخة بأكملها — مياه نظيفة تُسحب للملجأ بأكمله." });
      if (amount >= 500) return pick({ en: "A third of the pump that ends the daily haul of water by hand.", ar: "ثلث المضخة التي تنهي نقل المياه اليومي باليد." });
      if (amount >= 100) return pick({ en: "A meaningful step toward running water on-site.", ar: "خطوة ذات معنى نحو توفير مياه جارية في الموقع." });
      return pick({ en: "Every gift helps lift water from the well that's already been dug.", ar: "كل هدية تساعد على رفع المياه من البئر المحفورة بالفعل." });
    case "ongoing-operations":
      if (amount >= 600) return pick({ en: "About a month of stipends for the staff who care for the children daily.", ar: "نحو شهر من المخصّصات للموظفين الذين يرعون الأطفال يوميًا." });
      if (amount >= 250) return pick({ en: "Roughly a month of medical care for the whole shelter.", ar: "نحو شهر من الرعاية الطبية للملجأ بأكمله." });
      if (amount >= 100) return pick({ en: "A month of school supplies for the children in our care.", ar: "شهر من المستلزمات المدرسية للأطفال في رعايتنا." });
      if (amount >= 25) return pick({ en: `Feeds a child for about ${Math.floor(amount / 3.5)} days.`, ar: `يُطعم طفلاً نحو ${Math.floor(amount / 3.5)} يومًا.` });
      return pick({ en: "Every dollar keeps the everyday work of the shelter going.", ar: "كل دولار يُبقي العمل اليومي للملجأ مستمرًا." });
    default:
      return "";
  }
}
