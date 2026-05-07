import { Heart, ShieldCheck, Users, Globe } from "lucide-react";

const items = [
  {
    icon: Heart,
    heading: "100% to the children",
    body: "Every dollar reaches Kapoeta. Our volunteers self-fund all travel and operational costs — structurally, not just by promise.",
  },
  {
    icon: ShieldCheck,
    heading: "Registered Australian charity",
    body: "ABN 29 168 959 966. Donations are tax-deductible for Australian taxpayers.",
  },
  {
    icon: Users,
    heading: "On-the-ground leadership",
    body: "Brother Hakim lives and works in Kapoeta — local leadership, not outsider management.",
  },
  {
    icon: Globe,
    heading: "Multi-continental partnership",
    body: "Toongabbie Evangelical Church, Sudanese Grace Church Melbourne, and partners across Australia, the US, UK, and Egypt.",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-[#F5EFE6] border-y border-[#DDD0C0] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center text-[#B85C38] text-xs font-semibold uppercase tracking-widest mb-10"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Why trust us with your giving
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.heading} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B85C38]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#B85C38]" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[#1C1410] font-semibold text-sm mb-1">{item.heading}</h3>
                  <p className="text-[#8C7B72] text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
