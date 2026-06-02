import type { Frequency, GoalId } from "@/lib/goals";

// ─── Stripe fee (AU domestic card: 1.75% + A$0.30) ─────────────────────────
export const FEE_PERCENT = 0.0175;
export const FEE_FIXED = 0.3;

/** The fee a donor opts to cover, so close to 100% of the gift reaches the field. */
export function feeFor(amountAud: number): number {
  if (amountAud <= 0) return 0;
  return Math.round((amountAud * FEE_PERCENT + FEE_FIXED) * 100) / 100;
}

// ─── Frequency helpers ─────────────────────────────────────────────────────
export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "once", label: "Give Once" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

export function isRecurring(freq: Frequency): boolean {
  return freq !== "once";
}

/** Suffix for the Continue button, e.g. "per week". */
export function frequencySuffix(freq: Frequency): string {
  switch (freq) {
    case "weekly":
      return " per week";
    case "fortnightly":
      return " per fortnight";
    case "monthly":
      return " per month";
    default:
      return "";
  }
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

export function funFact(goalId: GoalId, amount: number): string {
  if (!amount || amount < 1) return "";

  switch (goalId) {
    case "sponsor-a-child": {
      const kids = Math.max(1, Math.round(amount / 600));
      return kids === 1
        ? "That's one child's entire year — meals, a safe bed, school and belonging."
        : `That's a full year for ${kids} children — meals, safe beds, school and belonging.`;
    }
    case "solar-system":
      if (amount >= 9000) return "Enough to fund the entire solar panel array — the heart of the system.";
      if (amount >= 3000) return "That could cover the inverter and charge controller that make the whole system safe to use.";
      if (amount >= 500) return "Roughly a fifth of the wiring and lighting that will reach every room.";
      if (amount >= 100) return "That's a real chunk of cabling carrying power across the site.";
      return "Every dollar brings the lights one step closer to coming on.";
    case "chicken-coop":
      if (amount >= 2500) return "Enough to build the entire predator-proof coop the flock will live in.";
      if (amount >= 1200) return "That could buy all 200 chicks at once.";
      if (amount >= 800) return "That's three months of feed — enough to raise the chicks to laying age.";
      if (amount >= 100) return "Roughly 20 chicks, plus a little feed to get them started.";
      return "A few chicks today; a steady supply of eggs tomorrow.";
    case "water-pump":
      if (amount >= 1500) return "That funds the whole pump — clean water drawn for the entire shelter.";
      if (amount >= 500) return "A third of the pump that ends the daily haul of water by hand.";
      if (amount >= 100) return "A meaningful step toward running water on-site.";
      return "Every gift helps lift water from the well that's already been dug.";
    case "ongoing-operations":
      if (amount >= 600) return "About a month of stipends for the staff who care for the children daily.";
      if (amount >= 250) return "Roughly a month of medical care for the whole shelter.";
      if (amount >= 100) return "A month of school supplies for the children in our care.";
      if (amount >= 25) return `Feeds a child for about ${Math.floor(amount / 3.5)} days.`;
      return "Every dollar keeps the everyday work of the shelter going.";
    default:
      return "";
  }
}
