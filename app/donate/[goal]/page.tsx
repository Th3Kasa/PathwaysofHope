import { notFound } from "next/navigation";
import { getPart, type GoalId } from "@/lib/goals";
import { getConfig } from "@/lib/admin/store";
import { getEffectiveGoals } from "@/lib/admin/goals-helper";
import { GOAL_AR } from "@/lib/goals-i18n";
import { DonationPanel } from "@/components/donation-panel";
import { BackLink } from "@/components/back-link";
import { getConfig } from "@/lib/admin/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const config = await getConfig();
  const effectiveGoals = getEffectiveGoals(config);
  const goal = effectiveGoals.find((g) => g.id === goalId);
  return {
    title: goal ? `Donate — ${goal.title}` : "Donate",
    description: goal?.short,
  };
}

export default async function DonateGoalPage({
  params,
  searchParams,
}: {
  params: Promise<{ goal: string }>;
  searchParams: Promise<{ part?: string }>;
}) {
  const { goal: goalId } = await params;
  const { part: partId } = await searchParams;

  const config = await getConfig();
  const effectiveGoals = getEffectiveGoals(config);
  const goal = effectiveGoals.find((g) => g.id === goalId);
  if (!goal) notFound();

  const part = partId ? getPart(goal, partId) : undefined;
  const { images } = await getConfig();

  // Bundles are normally reached via their breakdown page; link back there.
  const backHref = goal.kind === "bundle" ? `/donate/${goal.id}/parts` : "/donate";
  const arGoal = GOAL_AR[goal.id as GoalId];
  const arTitle = arGoal?.title ?? goal.title;
  const backLabel =
    goal.kind === "bundle"
      ? { en: `Back to ${goal.title}`, ar: `العودة إلى ${arTitle}` }
      : { en: "All donation options", ar: "كل خيارات التبرّع" };

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:py-20 sm:pt-28">
        <BackLink href={backHref} label={backLabel} />

        <DonationPanel goal={goal} part={part} imageOverride={images[goal.id]} />
      </div>
    </div>
  );
}
