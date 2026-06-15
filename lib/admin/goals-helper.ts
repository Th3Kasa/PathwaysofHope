import { KAPOETA_GOALS, type Goal, type GoalKind } from "@/lib/goals";
import type { AdminConfig } from "@/lib/admin/store";

export function getEffectiveGoals(config: AdminConfig): Goal[] {
  const disabled = new Set(config.disabledGoalIds ?? []);

  const base = KAPOETA_GOALS
    .filter((g) => !disabled.has(g.id))
    .map((g) => ({
      ...g,
      ...(config.images[g.id] ? { image: config.images[g.id] } : {}),
      ...(config.captions[g.id] ? { imageAlt: config.captions[g.id] } : {}),
    }));

  const extras: Goal[] = (config.extraGoals ?? []).map((eg) => ({
    id: eg.id,
    title: eg.title,
    short: eg.short,
    description: eg.description || eg.short,
    goalAmount: eg.goalAmount,
    kind: "leaf" as GoalKind,
    recurringByNature: eg.recurring,
    presets: [25, 50, 100, 250, 500],
    image: config.images[eg.id] ?? eg.image ?? "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg",
    imageAlt: config.captions[eg.id] ?? eg.imageAlt ?? eg.title,
    hideMeter: eg.goalAmount === 0,
  }));

  return [...base, ...extras];
}
