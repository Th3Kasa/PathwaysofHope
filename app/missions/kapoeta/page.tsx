import { KAPOETA_GOALS } from "@/lib/goals";
import { getConfig } from "@/lib/admin/store";
import { getEffectiveGoals } from "@/lib/admin/goals-helper";
import KapoetaClient from "./kapoeta-client";

export const metadata = {
  title: "Kapoeta Children's Shelter — Pathways of Hope",
  description:
    "A children's home in South Sudan, founded by Hakim and built by a community of supporters across four continents.",
};

// Render per request so admin photo/goal/donation changes appear immediately.
export const dynamic = "force-dynamic";

async function getTotals() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/totals`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    return null;
  }
}

export default async function KapoetaPage() {
  const [totals, config] = await Promise.all([getTotals(), getConfig()]);
  const effectiveGoals = getEffectiveGoals(config);
  // Only show original Kapoeta goals on the mission page (not extra goals from other missions)
  const staticIds = new Set(KAPOETA_GOALS.map((g) => g.id));
  const goals = effectiveGoals.filter((g) => staticIds.has(g.id));

  return (
    <KapoetaClient
      totals={totals}
      goals={goals}
      images={config.images}
      captions={config.captions}
      hiddenGalleryKeys={config.hiddenGalleryKeys ?? []}
      galleryExtraIds={config.galleryExtraIds ?? []}
    />
  );
}
