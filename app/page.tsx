import Image from "next/image";
import Link from "next/link";
import { TrustStrip } from "@/components/trust-strip";
import { MissionCard } from "@/components/mission-card";
import { DonateButton } from "@/components/donate-button";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-end" aria-label="Hero">
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/children-group.jpg"
            alt="Children at the Kapoeta shelter — sixty young lives given safety, warmth, and hope"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
          <p className="text-[#D4785A] text-sm uppercase tracking-widest mb-4 font-medium">
            Faith · Partnership · Dignity
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-6 max-w-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Every child deserves a pathway to hope.
          </h1>
          <p className="text-xl text-[#C4AE9A] max-w-xl mb-8 leading-relaxed">
            In Kapoeta, South Sudan, sixty children now sleep safely, eat daily, and attend school — because communities across three continents refused to look away.
          </p>
          <div className="flex flex-wrap gap-4">
            <DonateButton size="lg">Give Now — A$25 feeds a child for a week</DonateButton>
            <Link
              href="/missions/kapoeta"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full border-2 border-white/50 text-white hover:bg-white/10 transition-colors"
            >
              Read the Story
            </Link>
          </div>
        </div>
      </section>

      {/* Mission introduction */}
      <section className="py-24 px-4 bg-[#FDFAF6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">
                What we do
              </p>
              <h2
                className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Not charity from a distance. Partnership from within.
              </h2>
              <p className="text-[#3D2B1F] text-lg leading-relaxed mb-6">
                Pathways of Hope partners with Brother Hakim Peter — a South Sudanese pastor who answered a calling in 2020 to return to his homeland and shelter children without families. We don&apos;t parachute in and leave. We walk alongside.
              </p>
              <p className="text-[#8C7B72] leading-relaxed mb-8">
                Every dollar donated by our supporters reaches Kapoeta directly. Our volunteers — doctors, engineers, teachers — fund their own airfares and accommodation. The shelter costs A$45,000 per year to run. Sixty children depend on it.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#B85C38] hover:text-[#8B3E23] transition-colors"
              >
                Meet the people behind the mission →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="/images/kapoeta/hakim.png"
                  alt="Brother Hakim Peter — founder and director of the Kapoeta Children's Shelter"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden mt-8">
                <Image
                  src="/images/kapoeta/children-meal.jpg"
                  alt="Children sharing a meal at the shelter"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <Image
                  src="/images/kapoeta/water-well.jpg"
                  alt="The water well funded by Toongabbie Evangelical Church"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden mt-4">
                <Image
                  src="/images/kapoeta/children-outdoor.jpg"
                  alt="Children at play in the shelter grounds"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Callout quote */}
      <section className="bg-[#B85C38] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote
            className="text-3xl sm:text-4xl font-light text-white leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;I left a comfortable life in Australia. But when God calls you, comfort is not the point.&rdquo;
          </blockquote>
          <cite className="block mt-6 text-[#EDD9B4] text-sm not-italic">
            — Brother Hakim Peter, Founder &amp; Director, Kapoeta Children&apos;s Shelter
          </cite>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { stat: "60", label: "Children sheltered" },
              { stat: "A$45k", label: "Annual operating cost" },
              { stat: "100%", label: "Donations reach children" },
              { stat: "2020", label: "Year the mission began" },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div
                  className="text-5xl font-light text-[#B85C38] mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {stat}
                </div>
                <div className="text-sm text-[#8C7B72] uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured mission */}
      <section className="py-24 px-4 bg-[#FDFAF6]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-2 font-medium">Our Mission</p>
              <h2
                className="text-4xl font-light text-[#1C1410]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Where your giving goes
              </h2>
            </div>
            <Link
              href="/missions"
              className="text-sm text-[#8C7B72] hover:text-[#B85C38] transition-colors"
            >
              View all missions →
            </Link>
          </div>

          <div className="max-w-lg">
            <MissionCard
              slug="kapoeta"
              country="South Sudan"
              title="Kapoeta Children's Shelter"
              summary="Sixty children. A converted shipping container. One pastor's calling. From crisis to community — the story of how Brother Hakim Peter is rebuilding futures in one of the world's most forgotten towns."
              imageSrc="/images/kapoeta/shelter-exterior.jpg"
              imageAlt="The Kapoeta children's shelter building"
              childCount={60}
              status="active"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Final CTA */}
      <section className="py-24 px-4 bg-[#FDFAF6] text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-4xl sm:text-5xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A$25. One week of meals. One life sustained.
          </h2>
          <p className="text-[#8C7B72] text-lg mb-8 leading-relaxed">
            Every amount matters. Every month matters. Join the community of Australians, Egyptians, South Sudanese, and Brits who already walk this path.
          </p>
          <DonateButton size="lg" className="mx-auto">
            Choose how to give
          </DonateButton>
        </div>
      </section>
    </>
  );
}
