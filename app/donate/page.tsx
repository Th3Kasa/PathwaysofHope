import { Suspense } from "react";
import { DonateForm } from "@/components/donate-form";

export const metadata = {
  title: "Donate — Pathways of Hope",
  description:
    "Choose how you want to give. One-off or monthly, every dollar reaches Kapoeta. Tax-deductible for Australian taxpayers.",
};

export default function DonatePage() {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
            Give with confidence
          </p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Every dollar reaches Kapoeta.
          </h1>
          <p className="text-[#8C7B72] text-lg max-w-lg mx-auto">
            No overhead. No management fees. 100% to the children — structurally guaranteed.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-10 text-[#8C7B72]">Loading...</div>}>
          <DonateForm />
        </Suspense>

        {/* Trust signals below form */}
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
