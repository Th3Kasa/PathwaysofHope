import Image from "next/image";
import Link from "next/link";
import { KAPOETA_GOALS } from "@/lib/goals";
import { TrustStrip } from "@/components/trust-strip";
import KapoetaClient from "./kapoeta-client";

export const metadata = {
  title: "Kapoeta Children's Shelter — Pathways of Hope",
  description:
    "The full story of the Kapoeta mission: how one pastor's calling became a shelter for 60 children in South Sudan, and what it takes to keep it running.",
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
  const totals = await getTotals();
  return <KapoetaClient totals={totals} goals={KAPOETA_GOALS} />;
}
