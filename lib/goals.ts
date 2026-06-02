// ─── Donation data model ──────────────────────────────────────────────────
// All figures are the charity's own corrected 2026 project costs.
// Bundle breakdowns are good-faith estimates and are labelled as such in the UI.
// No mock "raised" or "supporter" numbers live here — meters reflect live Stripe
// data only, starting from A$0.

export type GoalId =
  | "solar-system"
  | "chicken-coop"
  | "water-pump"
  | "ongoing-operations"
  | "sponsor-a-child";

export type GoalKind = "bundle" | "leaf" | "leaf-qty";

export type Frequency = "once" | "weekly" | "fortnightly" | "monthly";

export interface BreakdownPart {
  id: string;
  title: string;
  amount: number; // AUD — estimate
  note: string;
}

export interface Goal {
  id: GoalId;
  title: string;
  /** One-line summary for the hub card. */
  short: string;
  /** Fuller description for the donation page. */
  description: string;
  goalAmount: number; // AUD
  kind: GoalKind;
  /** True when the gift is naturally recurring (ongoing ops, sponsorship). */
  recurringByNature: boolean;
  unitLabel?: string;
  /** For leaf-qty goals: cost per unit (e.g. A$600 per child). */
  unitAmount?: number;
  unitNoun?: string; // e.g. "child"
  /** Suggested amounts on the donation page. */
  presets: number[];
  image: string;
  imageAlt: string;
  /** Component parts for bundle goals. */
  breakdown?: BreakdownPart[];
}

export const KAPOETA_GOALS: Goal[] = [
  {
    id: "solar-system",
    title: "Solar Power System",
    short:
      "Solar power to run the water pump and bring light and electricity to the whole centre.",
    description:
      "A complete solar system to power the deep-water pump and finally bring reliable light and electricity to the shelter — classrooms, dormitories, the kitchen and the clinic. The single largest step toward making the centre self-sufficient.",
    goalAmount: 25000,
    kind: "bundle",
    recurringByNature: false,
    presets: [50, 100, 250, 500, 1000],
    image: "/images/kapoeta/field/shelter-steel-frame-exterior-kapoeta.jpg",
    imageAlt: "The Kapoeta shelter that the solar system will power",
    breakdown: [
      {
        id: "panels",
        title: "Solar panel array",
        amount: 9000,
        note: "The panels themselves — sized to run the pump and the centre.",
      },
      {
        id: "batteries",
        title: "Battery storage bank",
        amount: 7000,
        note: "Stores power so the lights stay on after sunset.",
      },
      {
        id: "inverter",
        title: "Inverter & charge controller",
        amount: 3000,
        note: "Converts and regulates power safely for everyday use.",
      },
      {
        id: "wiring",
        title: "Wiring, lights & distribution",
        amount: 3500,
        note: "Cabling and fittings to carry power across the whole site.",
      },
      {
        id: "install",
        title: "Mounting & installation",
        amount: 2500,
        note: "Frames, mounting and the labour to install it all.",
      },
    ],
  },
  {
    id: "chicken-coop",
    title: "Chicken Coop & 200 Chicks",
    short:
      "A coop and 200 chicks — daily eggs for the children and a small, steady income.",
    description:
      "A predator-safe coop stocked with 200 chicks. As they grow, they provide daily eggs for the children's meals and surplus to sell — turning a one-off gift into food and income that renews itself every day.",
    goalAmount: 5000,
    kind: "bundle",
    recurringByNature: false,
    presets: [25, 50, 100, 250, 500],
    image: "/images/kapoeta/field/child-eating-bowl-rice-kapoeta.jpg",
    imageAlt: "Children at a meal at the Kapoeta shelter",
    breakdown: [
      {
        id: "coop",
        title: "Coop structure & predator fencing",
        amount: 2500,
        note: "A solid, predator-proof house for the flock.",
      },
      {
        id: "chicks",
        title: "200 chicks",
        amount: 1200,
        note: "The birds that will lay the eggs.",
      },
      {
        id: "feed",
        title: "Feed — first 3 months",
        amount: 800,
        note: "Enough feed to raise the chicks to laying age.",
      },
      {
        id: "equipment",
        title: "Feeders, waterers & equipment",
        amount: 500,
        note: "Everything needed to keep the flock healthy.",
      },
    ],
  },
  {
    id: "water-pump",
    title: "Water Pump",
    short:
      "An electric pump to draw water from the deep well already drilled on-site.",
    description:
      "The deep well is already drilled. An electric pump — powered by the new solar system — will draw clean water for drinking, cooking, washing and the gardens, ending the daily haul by hand.",
    goalAmount: 1500,
    kind: "leaf",
    recurringByNature: false,
    presets: [25, 50, 100, 250, 500],
    image: "/images/kapoeta/field/girl-child-water-pump-kapoeta.jpg",
    imageAlt: "A child at the water pump in Kapoeta",
  },
  {
    id: "ongoing-operations",
    title: "Ongoing Operations",
    short:
      "The day-to-day running of the shelter — staff, food, school fees and medical care.",
    description:
      "Stipends for the matron, evangelist and dairy caretaker; school fees and uniforms; food, medical care and the everyday costs of running a children's home. The steady support that keeps the doors open all year.",
    goalAmount: 45000,
    kind: "leaf",
    recurringByNature: true,
    unitLabel: "A$45,000 / year",
    presets: [50, 100, 250, 500, 1000],
    image: "/images/kapoeta/field/children-school-uniforms-group-kapoeta.jpg",
    imageAlt: "Children in school uniforms at the Kapoeta shelter",
  },
  {
    id: "sponsor-a-child",
    title: "Sponsor a Child",
    short:
      "A$600 covers one child's full year — meals, shelter, schooling and belonging.",
    description:
      "A$600 covers one child's full year: meals, a safe bed, schooling and the dignity of belonging. Of the 70 children in our care, 10 are already sponsored — 60 are still waiting. Sponsor as many as you wish.",
    goalAmount: 36000, // 60 children still needing sponsorship × A$600
    kind: "leaf-qty",
    recurringByNature: true,
    unitLabel: "A$600 / child / year",
    unitAmount: 600,
    unitNoun: "child",
    presets: [600],
    image: "/images/kapoeta/field/children-group-portrait-shelter.jpg",
    imageAlt: "Children at the Kapoeta Children's Shelter",
  },
];

export function getGoalById(id: string): Goal | undefined {
  return KAPOETA_GOALS.find((g) => g.id === id);
}

export function getPart(goal: Goal, partId: string): BreakdownPart | undefined {
  return goal.breakdown?.find((p) => p.id === partId);
}

// ─── Already delivered (achievements — not donatable) ──────────────────────
// Verified, completed project costs. Shown as proof of delivery.

export interface Delivered {
  title: string;
  amount: number;
}

export const DELIVERED: Delivered[] = [
  { title: "Deep water well with manual pump", amount: 18000 },
  { title: "40-foot container, shipped Sydney → Kapoeta", amount: 45000 },
  { title: "Main shelter building", amount: 20000 },
  { title: "Water tank tower", amount: 11000 },
  { title: "Bread oven & bakery", amount: 6000 },
  { title: "6 cows and a bull (dairy)", amount: 5000 },
  { title: "Tricycle for transport", amount: 3000 },
  { title: "Renovation of two rooms", amount: 3000 },
  { title: "Fencing the land", amount: 1800 },
];

export const DELIVERED_TOTAL = DELIVERED.reduce((sum, d) => sum + d.amount, 0); // A$112,800
