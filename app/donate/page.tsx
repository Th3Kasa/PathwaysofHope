import { DonateHub } from "@/components/donate-hub";

export const metadata = {
  title: "Donate — Pathways of Hope",
  description:
    "Choose where your gift goes. Give once or set up recurring giving — every dollar reaches the Kapoeta Children's Shelter. Tax-deductible for Australian taxpayers.",
};

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

  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28">
        <div className="text-center mb-14">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            Give with confidence
          </p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Choose where your gift goes.
          </h1>
          <p className="text-[#8C7B72] text-lg max-w-lg mx-auto">
            Every dollar reaches the Kapoeta Children&apos;s Shelter. Pick a project below to give.
          </p>
        </div>

        <DonateHub totals={totals} />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🔒", label: "Secure checkout via Stripe" },
            { icon: "🧾", label: "Tax-deductible receipt emailed" },
            { icon: "💯", label: "100% reaches the children" },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2 text-sm text-[#8C7B72]">
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
