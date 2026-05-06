export type GoalId =
  | "sponsor-a-child"
  | "water-tower"
  | "chicken-coop"
  | "general-support";

export interface Goal {
  id: GoalId;
  title: string;
  description: string;
  goalAmount: number; // AUD
  fallbackRaised: number; // AUD — used when Stripe fetch fails
  fallbackSupporters: number;
  isRecurring: boolean;
  unitLabel?: string;
}

// Goal amounts grounded in source documents where available.
// Sponsor-a-child: 35 unsponsored children × A$600/year = A$21,000 (verified from Vision doc).
// Water tower & coop figures are working project estimates pending final quotes.
export const KAPOETA_GOALS: Goal[] = [
  {
    id: "sponsor-a-child",
    title: "Sponsor a Child",
    description:
      "A$600 covers one child's full year — meals, shelter, schooling, and belonging. Of 45 children in our care, 10 are already sponsored. 35 remain.",
    goalAmount: 21000,
    fallbackRaised: 6000,
    fallbackSupporters: 10,
    isRecurring: true,
    unitLabel: "A$600 / child / year",
  },
  {
    id: "water-tower",
    title: "Water Tank Tower & Solar Pump",
    description:
      "The tower foundation has been laid. The remaining build — water tank, solar-powered pump, and irrigation lines — will bring clean water on-site and feed the gardens.",
    goalAmount: 8000,
    fallbackRaised: 1500,
    fallbackSupporters: 12,
    isRecurring: false,
  },
  {
    id: "chicken-coop",
    title: "Chicken Coop & Layers",
    description:
      "A simple coop with 10 hens and a rooster — daily eggs for the children, with modest income from surplus sales. A small project with a daily impact.",
    goalAmount: 3000,
    fallbackRaised: 600,
    fallbackSupporters: 7,
    isRecurring: false,
  },
  {
    id: "general-support",
    title: "Ongoing Operations",
    description:
      "Stipends for the matron, evangelist, and dairy caretaker; school fees and uniforms; food, medical care, and the day-to-day costs of running a children's shelter.",
    goalAmount: 15000,
    fallbackRaised: 4200,
    fallbackSupporters: 28,
    isRecurring: true,
    unitLabel: "Recurring",
  },
];

export function getGoalById(id: string): Goal | undefined {
  return KAPOETA_GOALS.find((g) => g.id === id);
}
