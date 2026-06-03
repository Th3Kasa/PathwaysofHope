import { notFound } from "next/navigation";
import { getGoalById } from "@/lib/goals";
import { PartsClient } from "@/app/donate/[goal]/parts/parts-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const goal = getGoalById(goalId);
  return {
    title: goal ? `${goal.title} — Cost Breakdown` : "Donate",
    description: goal?.short,
  };
}

export default async function BundleBreakdownPage({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const goal = getGoalById(goalId);

  if (!goal || goal.kind !== "bundle" || !goal.breakdown) notFound();

  return <PartsClient goal={goal} />;
}
