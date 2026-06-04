import { notFound } from "next/navigation";
import { getGoalById, getPart } from "@/lib/goals";
import { GOAL_AR } from "@/lib/goals-i18n";
import { DonationPanel } from "@/components/donation-panel";
import { BackLink } from "@/components/back-link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const goal = getGoalById(goalId);
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

  const goal = getGoalById(goalId);
  if (!goal) notFound();

  const part = partId ? getPart(goal, partId) : undefined;

  // Bundles are normally reached via their breakdown page; link back there.
  const backHref = goal.kind === "bundle" ? `/donate/${goal.id}/parts` : "/donate";
  const arTitle = GOAL_AR[goal.id].title;
  const backLabel =
    goal.kind === "bundle"
      ? { en: `Back to ${goal.title}`, ar: `العودة إلى ${arTitle}` }
      : { en: "All donation options", ar: "كل خيارات التبرّع" };

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:py-20 sm:pt-28">
        <BackLink href={backHref} label={backLabel} />

        <DonationPanel goal={goal} part={part} />
      </div>
    </div>
  );
}
