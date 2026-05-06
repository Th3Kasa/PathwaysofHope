import { Heart, Shield, Users, Globe } from "lucide-react";

const items = [
  {
    icon: Heart,
    heading: "100% to the Children",
    body: "Every dollar donated reaches Kapoeta. Our volunteers self-fund all travel and operational costs.",
  },
  {
    icon: Shield,
    heading: "Registered Charity",
    body: "Pathways of Hope is a registered Australian charity. Donations are tax-deductible.",
  },
  {
    icon: Users,
    heading: "On-the-Ground Leadership",
    body: "Brother Hakim Peter lives and works in Kapoeta — this is local leadership, not outsider management.",
  },
  {
    icon: Globe,
    heading: "Community Partnership",
    body: "Toongabbie Evangelical Church, Sudanese Grace Church Melbourne, and partners across three continents.",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-[#1C1410] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p
          className="text-center text-[#C4AE9A] text-sm uppercase tracking-widest mb-10"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Why trust us with your giving
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.heading} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B85C38]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#D4785A]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{item.heading}</h3>
                  <p className="text-[#9A8578] text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
