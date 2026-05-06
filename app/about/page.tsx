import Image from "next/image";
import { TrustStrip } from "@/components/trust-strip";
import { DonateButton } from "@/components/donate-button";

export const metadata = {
  title: "About — Pathways of Hope",
  description:
    "The people behind Pathways of Hope: Brother Hakim Peter, Elder Mamdouh Mansour, Philip Hanna, and the communities walking this path together.",
};

const TEAM = [
  {
    name: "Brother Hakim Peter",
    role: "Founder & Director, Kapoeta Shelter",
    image: "/images/kapoeta/hakim.png",
    bio: "A South Sudanese pastor who left a stable life in Australia to answer a calling he describes as impossible to ignore. Hakim has lived in Kapoeta since 2020, leading the shelter full-time. He knows every child by name. He is the mission.",
  },
  {
    name: "Elder Mamdouh Mansour",
    role: "Australian Coordinator",
    image: "/images/kapoeta/hakim-community.jpg",
    bio: "Elder Mamdouh coordinates Australian donations, logistics, and volunteer travel. He was instrumental in organising the original shipping container from Sydney, navigating customs across three countries to deliver supplies to Kapoeta.",
  },
  {
    name: "Philip Hanna",
    role: "Fundraising & Operations Lead",
    image: "/images/kapoeta/community-1.jpg",
    bio: "Philip oversees fundraising strategy, donor relationships, and the financial transparency that makes Pathways of Hope trustworthy. A committed volunteer, Philip has self-funded multiple visits to Kapoeta to see the impact firsthand.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FDFAF6]">
      {/* Header */}
      <section className="py-24 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">Who we are</p>
          <h1
            className="text-5xl sm:text-6xl font-light text-[#1C1410] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            A small team. An unshakeable conviction.
          </h1>
          <p className="text-[#3D2B1F] text-xl leading-relaxed max-w-2xl">
            Pathways of Hope is a registered Australian charity built on one principle: when you find a person doing extraordinary work with local trust and local knowledge, you fund them — and get out of the way.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How Pathways of Hope began
          </h2>
          <div className="space-y-5 text-[#3D2B1F] leading-relaxed text-lg">
            <p>
              In 2020, a group of Australian Christians learned of Brother Hakim Peter&apos;s mission in Kapoeta. What moved them wasn&apos;t a polished NGO pitch — it was the simplicity and immediacy of the need, and the quality of the person already responding to it.
            </p>
            <p>
              Hakim had gone to Kapoeta not because an organisation sent him, but because God called him. He found 320 children without shelter or food, and he stayed. The Australian community asked: how can we help?
            </p>
            <p>
              From that question, Pathways of Hope grew: a small, accountable structure that channels support to Hakim without bureaucratic overhead, political interference, or the loss that comes when organisations prioritise their own perpetuation over the mission.
            </p>
            <p>
              Today, the network spans Australia, Egypt, South Sudan, and the United Kingdom. Churches, families, and individuals give regularly. Every cent reaches Kapoeta — not because we say so, but because we&apos;ve built a structure where that is structurally true.
            </p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[#EDD9B4] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote
            className="text-3xl font-light text-[#1C1410] leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;We don&apos;t manage from Sydney. We serve from within.&rdquo;
          </blockquote>
          <cite className="block mt-4 text-[#8C7B72] text-sm not-italic">
            — Elder Mamdouh Mansour
          </cite>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">The team</p>
          <h2
            className="text-4xl font-light text-[#1C1410] mb-14"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            The people who make it possible
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TEAM.map((person) => (
              <div key={person.name}>
                <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={person.image}
                    alt={`${person.name} — ${person.role}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3
                  className="text-xl font-semibold text-[#1C1410] mb-1"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {person.name}
                </h3>
                <p className="text-[#B85C38] text-sm font-medium mb-3">{person.role}</p>
                <p className="text-[#8C7B72] text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">Our commitments</p>
          <h2
            className="text-4xl font-light text-[#1C1410] mb-12"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Why you can trust us with your giving
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                title: "Registered Australian Charity",
                body: "Pathways of Hope is registered with the Australian Charities and Not-for-profits Commission (ACNC). Donations are tax-deductible for Australian taxpayers.",
              },
              {
                title: "100% to the children — structurally guaranteed",
                body: "All volunteer travel costs — flights, accommodation, visas — are self-funded by the individuals involved. Not one cent of donor money is spent on getting people to and from Kapoeta.",
              },
              {
                title: "Full financial transparency",
                body: "We publish annual financial reports and make detailed statements available on request. If you want to see exactly how your donation was spent, ask us — we will show you.",
              },
              {
                title: "Local leadership, not outsider management",
                body: "Brother Hakim Peter is the decision-maker on the ground. We do not impose Australian management on a Sudanese community. We resource a leader the community already trusts.",
              },
              {
                title: "No overhead extraction",
                body: "Our administrative costs are covered by a small number of committed donors who specifically designate their gifts for operations. General donations are ringfenced for Kapoeta.",
              },
              {
                title: "Multi-church, multi-national accountability",
                body: "We are not a one-church project. Our accountability network spans Toongabbie Evangelical Church, Sudanese Grace Church Melbourne, UK partners, and Egyptian Christian communities.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-[#B85C38] mt-2.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-[#1C1410] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#8C7B72] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl font-light text-[#1C1410] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Join us. Walk this path.
          </h2>
          <p className="text-[#8C7B72] mb-8">
            Whether you give once, give monthly, or give your time — you are part of this story.
          </p>
          <DonateButton size="lg">Give to Kapoeta</DonateButton>
        </div>
      </section>
    </div>
  );
}
