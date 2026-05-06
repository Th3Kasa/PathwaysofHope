export type GoalId =
  | "water-tower"
  | "poultry-project"
  | "sponsor-a-child"
  | "general-support";

export interface Goal {
  id: GoalId;
  title: string;
  description: string;
  goalAmount: number; // AUD
  fallbackRaised: number; // AUD — used when Stripe fetch fails
  fallbackSupporters: number;
  isRecurring: boolean;
  unitLabel?: string; // e.g. "per child / year"
}

export const KAPOETA_GOALS: Goal[] = [
  {
    id: "water-tower",
    title: "Water Tower & Solar Pump",
    description:
      "A permanent water tower with solar-powered pump brings clean water to all 60 children — no more carrying by hand from distant sources.",
    goalAmount: 12500,
    fallbackRaised: 3200,
    fallbackSupporters: 28,
    isRecurring: false,
  },
  {
    id: "poultry-project",
    title: "Poultry Project — 200 Chickens",
    description:
      "A chicken coop housing 200 birds creates daily eggs for nutrition and a sustainable income stream that outlasts any single donation.",
    goalAmount: 12500,
    fallbackRaised: 1800,
    fallbackSupporters: 14,
    isRecurring: false,
  },
  {
    id: "sponsor-a-child",
    title: "Sponsor a Child",
    description:
      "A$600 covers one child's full year: food, shelter, schooling, and belonging. Sixty children are waiting.",
    goalAmount: 36000, // 60 children × $600
    fallbackRaised: 7800,
    fallbackSupporters: 13,
    isRecurring: true,
    unitLabel: "A$600 / child / year",
  },
  {
    id: "general-support",
    title: "General Annual Support",
    description:
      "The baseline cost to keep the shelter running — staff, food, utilities, and everything Brother Hakim's volunteers cannot cover themselves.",
    goalAmount: 45000,
    fallbackRaised: 12400,
    fallbackSupporters: 67,
    isRecurring: true,
    unitLabel: "A$45,000 / year",
  },
];

export function getGoalById(id: string): Goal | undefined {
  return KAPOETA_GOALS.find((g) => g.id === id);
}
