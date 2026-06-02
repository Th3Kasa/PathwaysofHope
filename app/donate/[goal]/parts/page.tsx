import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getGoalById } from "@/lib/goals";
import { formatAUDFull } from "@/lib/utils";
import { BankTransferPanel } from "@/components/bank-transfer-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal: goalId } = await params;
  const goal = getGoalById(goalId);
  return {
    title: goal ? `${goal.title} — Cost Breakdown | Pathways of Hope` : "Donate — Pathways of Hope",
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

  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 text-sm text-[#8C7B72] hover:text-[#B85C38] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> All donation options
        </Link>

        {/* Header */}
        <div className="relative h-52 rounded-3xl overflow-hidden mb-8">
          <Image src={goal.image} alt={goal.imageAlt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 768px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/85 via-[#1C1410]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="text-[#EDD9B4] text-xs uppercase tracking-widest mb-1">
              Total project — {formatAUDFull(goal.goalAmount)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {goal.title}
            </h1>
          </div>
        </div>

        <p className="text-[#3D2B1F] leading-relaxed mb-3">{goal.description}</p>
        <p className="text-xs text-[#8C7B72] italic mb-8">
          The breakdown below shows estimated component costs. Give toward any part — or fund the whole project.
        </p>

        {/* Fund the whole thing */}
        <Link
          href={`/donate/${goal.id}`}
          className="flex items-center justify-between gap-4 rounded-2xl border-2 border-[#B85C38] bg-[#FDF5F0] p-5 mb-6 hover:bg-[#FBEDE4] transition-colors"
        >
          <div>
            <p className="font-semibold text-[#1C1410]">Give to the whole project</p>
            <p className="text-sm text-[#8C7B72]">Any amount toward {goal.title.toLowerCase()}.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B85C38] flex-shrink-0">
            Donate <ArrowRight size={16} />
          </span>
        </Link>

        {/* Parts */}
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#8C7B72] mb-4">
          Or fund a specific part
        </h2>
        <div className="space-y-3 mb-10">
          {goal.breakdown.map((part) => (
            <Link
              key={part.id}
              href={`/donate/${goal.id}?part=${part.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#EDD9B4] bg-white p-5 hover:border-[#B85C38] hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-semibold text-[#1C1410]">{part.title}</p>
                <p className="text-sm text-[#8C7B72] leading-relaxed">{part.note}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-serif)", color: "#C9952A" }}>
                  {formatAUDFull(part.amount)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B85C38]">
                  Donate <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <BankTransferPanel />
      </div>
    </div>
  );
}
