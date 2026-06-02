import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGoalById, getPart } from "@/lib/goals";
import { DonationPanel } from "@/components/donation-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const goal = getGoalById(goalId);
  return {
    title: goal ? `Donate — ${goal.title} | Pathways of Hope` : "Donate — Pathways of Hope",
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
  const backLabel = goal.kind === "bundle" ? `Back to ${goal.title}` : "All donation options";

  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-[#8C7B72] hover:text-[#B85C38] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> {backLabel}
        </Link>

        <DonationPanel goal={goal} part={part} />
      </div>
    </div>
  );
}
