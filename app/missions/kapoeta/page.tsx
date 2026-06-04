import { KAPOETA_GOALS } from "@/lib/goals";
import KapoetaClient from "./kapoeta-client";
import { getConfig } from "@/lib/admin/store";

export const metadata = {
  title: "Kapoeta Children's Shelter — Pathways of Hope",
  description:
    "A children's home in South Sudan, founded by Brother Hakim and built by a community of believers across four continents.",
};

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
  const [totals, { images, titles }] = await Promise.all([getTotals(), getConfig()]);
  return <KapoetaClient totals={totals} goals={KAPOETA_GOALS} imageOverrides={images} titleOverrides={titles} />;
}
