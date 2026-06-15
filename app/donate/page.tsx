import { DonateClient } from "@/app/donate/donate-client";
import { getConfig } from "@/lib/admin/store";
import { getEffectiveGoals } from "@/lib/admin/goals-helper";

// Render per request so admin photo/goal/donation changes appear immediately.
export const dynamic = "force-dynamic";

async function getTotals() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/totals`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    return null;
  }
}

export default async function DonatePage() {
  const [totals, config] = await Promise.all([getTotals(), getConfig()]);
  const goals = getEffectiveGoals(config);
  return <DonateClient totals={totals} imageOverrides={config.images} captionOverrides={config.captions} goals={goals} />;
}
