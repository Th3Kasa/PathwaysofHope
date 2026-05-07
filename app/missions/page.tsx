import { MissionCard } from "@/components/mission-card";
import { DonateButton } from "@/components/donate-button";

export const metadata = {
  title: "Missions — Pathways of Hope",
  description: "Our active and planned missions, bringing restored dignity and hope to children around the world.",
};

export default function MissionsPage() {
  return (
    <div className="bg-[#FDFAF6]">
      {/* Header */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">Where we work</p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 max-w-2xl leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Missions grounded in place, led by locals.
          </h1>
          <p className="text-[#8C7B72] text-lg max-w-xl leading-relaxed">
            Each Pathways of Hope mission is led by a local partner with deep roots in their community. We come alongside — not to manage, but to resource and support.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MissionCard
              slug="kapoeta"
              country="South Sudan"
              title="Kapoeta Children's Shelter"
              summary="Brother Hakim Peter shelters 60 children in Kapoeta — providing food, safety, and schooling to children who had none. Supported by communities across Australia, the UK, and Egypt."
              imageSrc="/images/kapoeta/field/children-group-portrait-shelter.jpg"
              imageAlt="Children gathered at the Kapoeta shelter"
              childCount={60}
              status="active"
            />
            {/* Future missions will be added here as MissionCard entries */}
            <div className="rounded-2xl border-2 border-dashed border-[#DDD0C0] flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
              <div className="text-4xl mb-4 opacity-30">✦</div>
              <p className="text-[#8C7B72] font-medium mb-2">Next mission coming</p>
              <p className="text-sm text-[#8C7B72]">We are prayerfully discerning where God calls us next. Stay connected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center border-t border-[#DDD0C0]">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-3xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to partner with us?
          </h2>
          <p className="text-[#8C7B72] mb-8">100% of what you give reaches the children. No exceptions.</p>
          <DonateButton size="lg">Give to Kapoeta</DonateButton>
        </div>
      </section>
    </div>
  );
}
