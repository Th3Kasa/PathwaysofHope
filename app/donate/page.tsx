import { DonateClient } from "@/app/donate/donate-client";

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
  const totals = await getTotals();
  return <DonateClient totals={totals} />;
}
