import Image from "next/image";
import Link from "next/link";
import { GoalMeter } from "@/components/goal-meter";
import { DonateButton } from "@/components/donate-button";
import { KAPOETA_GOALS } from "@/lib/goals";

export const metadata = {
  title: "Kapoeta Children's Shelter — Pathways of Hope",
  description:
    "The full story of the Kapoeta mission: how one pastor's calling became a shelter for 60 children in South Sudan, and what it takes to keep it running.",
};

// Fetch live totals from Stripe — falls back gracefully if unavailable
async function getTotals() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/totals`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    // Return null — GoalMeter uses fallback values from goals.ts
    return null;
  }
}

const MILESTONES = [
  {
    year: "2020",
    title: "The Calling",
    body: "Brother Hakim Peter, a South Sudanese pastor living comfortably in Australia, felt a clear and persistent call to return to Kapoeta — one of South Sudan's most remote and conflict-scarred towns. He left. He went. He stayed.",
    icon: "✦",
  },
  {
    year: "2021",
    title: "320 Children, No Resources",
    body: "In those first months, Hakim encountered 320 children without shelter, families, or food. With nothing but faith and a borrowed space, he began feeding and housing them — drawing on whatever the local community could spare.",
    icon: "◉",
  },
  {
    year: "2022",
    title: "The Container Arrives",
    body: "Supporters in Australia — led by Elder Mamdouh Mansour and Philip Hanna — organised a 40-foot shipping container from Sydney, filled with beds, clothing, medical supplies, and educational materials. It crossed two oceans and the customs of three countries to reach Kapoeta.",
    icon: "⬡",
  },
  {
    year: "2023",
    title: "Water Well & Livestock",
    body: "Toongabbie Evangelical Church funded a water well — ending the daily walk to contaminated sources. Sudanese Grace Church Melbourne donated livestock, giving the shelter its first sustainable food source and a small income stream.",
    icon: "◈",
  },
  {
    year: "2024",
    title: "UK Partnership & Tuk-Tuk",
    body: "British supporters funded a motorised tuk-tuk — the shelter's first vehicle — allowing Hakim to transport children to medical care and collect supplies from the market 12km away. The UK connection deepened the international web of partnership.",
    icon: "◎",
  },
  {
    year: "2026",
    title: "46 Students Enrolled",
    body: "As of early 2026, 46 children are formally enrolled in the shelter's education programme. The goal: all 60 in school by year's end. The remaining campaign targets — water tower, poultry coop — will make that sustainable.",
    icon: "★",
  },
];

export default async function KapoetaPage() {
  const totals = await getTotals();

  return (
    <div className="bg-[#FDFAF6]">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/kapoeta/shelter-exterior.jpg"
            alt="The Kapoeta children's shelter — a converted space that became a home for sixty children"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/85 via-[#1C1410]/30 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/missions" className="text-[#C4AE9A] text-sm hover:text-white transition-colors">
              Missions
            </Link>
            <span className="text-[#6B5A52]">/</span>
            <span className="text-white text-sm">Kapoeta, South Sudan</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-light text-white leading-tight mb-4 max-w-2xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Kapoeta Children&apos;s Shelter
          </h1>
          <p className="text-[#C4AE9A] text-xl max-w-lg">
            Sixty children. One pastor&apos;s calling. A community that refused to let them fall.
          </p>
        </div>
      </section>

      {/* Opening narrative */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-6 font-medium">The story</p>

          <p
            className="text-3xl sm:text-4xl font-light text-[#1C1410] leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Kapoeta sits near the border of Kenya and Ethiopia, in a region of South Sudan that the world has largely forgotten. There is no reliable electricity. No running water. No functioning hospital. And yet — this is where Brother Hakim Peter chose to go.
          </p>

          <div className="prose prose-lg max-w-none text-[#3D2B1F] space-y-6">
            <p>
              In 2020, Hakim was living in Australia, serving his church community, building a stable life. But something wouldn&apos;t leave him alone — the faces of children he&apos;d seen on visits home. Children who had survived South Sudan&apos;s decades of civil war, only to be left without parents, without shelter, without any adult to notice when they were hungry.
            </p>
            <p>
              He went back. And what he found when he arrived defied even his expectations: more than 320 children in desperate need of shelter. He had no funds. No building. No government support. He had his faith, his knowledge of the community, and the trust of local elders who recognised a man who had come to stay — not to visit.
            </p>
            <p>
              He began with a borrowed space. Children slept on the floor. Meals were whatever the community could pool together. And slowly — through prayer, persistence, and the generosity of a small Australian church community — the shelter began to take shape.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-16 px-4 bg-[#F5EFE6]">
        <div className="max-w-3xl mx-auto">
          <blockquote
            className="text-3xl sm:text-4xl font-light text-[#1C1410] leading-relaxed border-l-4 border-[#B85C38] pl-8"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;These children had nothing. No family name. No birth certificate. Nothing. We gave them the most important thing — someone who would not leave.&rdquo;
          </blockquote>
          <cite className="block mt-6 text-[#8C7B72] text-sm not-italic pl-8">
            — Brother Hakim Peter
          </cite>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">How we got here</p>
          <h2
            className="text-4xl font-light text-[#1C1410] mb-16"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Six years of tangible transformation
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[#DDD0C0] hidden sm:block" />

            <div className="flex flex-col gap-12">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-6 sm:gap-10">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#B85C38] flex items-center justify-center text-white text-lg z-10 relative">
                      {m.icon}
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-[#B85C38] uppercase tracking-widest">
                        {m.year}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-semibold text-[#1C1410] mb-2"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {m.title}
                    </h3>
                    <p className="text-[#8C7B72] leading-relaxed">{m.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="py-16 px-4 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">Gallery</p>
          <h2
            className="text-3xl font-light text-[#1C1410] mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Life at the shelter
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { src: "/images/kapoeta/children-meal.jpg", alt: "Children sharing a communal meal" },
              { src: "/images/kapoeta/classroom-1.jpg", alt: "Learning sessions in the shelter classroom" },
              { src: "/images/kapoeta/water-well.jpg", alt: "The water well that changed daily life" },
              { src: "/images/kapoeta/food-prep.jpg", alt: "Food preparation for sixty hungry children" },
              { src: "/images/kapoeta/container.png", alt: "The shipping container from Australia arriving" },
              { src: "/images/kapoeta/daily-life-1.jpg", alt: "Daily life at the shelter" },
              { src: "/images/kapoeta/children-learning.jpg", alt: "Children engaged in learning activities" },
              { src: "/images/kapoeta/shelter-interior.jpg", alt: "Inside the shelter" },
              { src: "/images/kapoeta/livestock.jpg", alt: "Livestock donated by Sudanese Grace Church Melbourne" },
              { src: "/images/kapoeta/community-1.jpg", alt: "The Kapoeta community gathering" },
              { src: "/images/kapoeta/daily-life-2.jpg", alt: "Children in daily routines" },
              { src: "/images/kapoeta/children-2025.jpg", alt: "Children at the shelter, 2025" },
            ].map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">See it yourself</p>
          <h2
            className="text-3xl font-light text-[#1C1410] mb-10"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            From the ground in Kapoeta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-[#8C7B72] uppercase tracking-wider mb-3">2024 Update</h3>
              <video
                controls
                className="w-full rounded-2xl bg-black"
                preload="metadata"
                aria-label="Kapoeta shelter video update 2024"
              >
                <source src="/videos/kapoeta-2024.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#8C7B72] uppercase tracking-wider mb-3">2025 Update</h3>
              <video
                controls
                className="w-full rounded-2xl bg-black"
                preload="metadata"
                aria-label="Kapoeta shelter video update 2025"
              >
                <source src="/videos/kapoeta-2025.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 2026 Campaign Goals */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">2026 Campaign</p>
          <h2
            className="text-4xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Two projects. One transforming goal.
          </h2>
          <p className="text-[#8C7B72] text-lg mb-12 max-w-2xl leading-relaxed">
            Two targeted campaigns will make the shelter genuinely self-sustaining — clean water piped on-site, and a poultry project that generates both nutrition and income. A$25,000 total. Every dollar tracked.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {KAPOETA_GOALS.slice(0, 2).map((goal) => (
              <GoalMeter
                key={goal.id}
                goal={goal}
                raised={totals?.[goal.id]?.raised}
                supporters={totals?.[goal.id]?.supporters}
              />
            ))}
          </div>

          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-6 font-medium">Ongoing needs</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KAPOETA_GOALS.slice(2).map((goal) => (
              <GoalMeter
                key={goal.id}
                goal={goal}
                raised={totals?.[goal.id]?.raised}
                supporters={totals?.[goal.id]?.supporters}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Financials */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">Transparency</p>
          <h2
            className="text-4xl font-light text-[#1C1410] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Where the money goes — exactly.
          </h2>
          <p className="text-[#8C7B72] mb-10 leading-relaxed">
            We believe in radical transparency. Here is how the A$45,000 annual operating budget is used. Full financial statements are available on request.
          </p>

          <div className="overflow-hidden rounded-2xl border border-[#DDD0C0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5EFE6]">
                  <th className="text-left px-6 py-4 text-[#3D2B1F] font-semibold">Line item</th>
                  <th className="text-right px-6 py-4 text-[#3D2B1F] font-semibold">Annual (AUD)</th>
                  <th className="text-right px-6 py-4 text-[#3D2B1F] font-semibold">Per child</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDD9B4]">
                {[
                  { item: "Food & nutrition (3 meals/day, 60 children)", annual: 18000, perChild: 300 },
                  { item: "Shelter maintenance & utilities", annual: 8000, perChild: 133 },
                  { item: "Education materials & school fees", annual: 6000, perChild: 100 },
                  { item: "Medical care & health supplies", annual: 5000, perChild: 83 },
                  { item: "Staff & community caretakers", annual: 5000, perChild: 83 },
                  { item: "Transport & logistics", annual: 3000, perChild: 50 },
                ].map((row) => (
                  <tr key={row.item} className="bg-white hover:bg-[#FDFAF6] transition-colors">
                    <td className="px-6 py-4 text-[#3D2B1F]">{row.item}</td>
                    <td className="px-6 py-4 text-right font-medium text-[#1C1410]">
                      A${row.annual.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-[#8C7B72]">A${row.perChild}</td>
                  </tr>
                ))}
                <tr className="bg-[#B85C38]">
                  <td className="px-6 py-4 font-bold text-white">Total annual cost</td>
                  <td className="px-6 py-4 text-right font-bold text-white">A$45,000</td>
                  <td className="px-6 py-4 text-right font-bold text-white">A$750</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#8C7B72] mt-4 text-center">
            Volunteer travel costs (flights, accommodation) are 100% self-funded by volunteers.
          </p>
        </div>
      </section>

      {/* Hakim profile */}
      <section className="py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/kapoeta/hakim.png"
                alt="Brother Hakim Peter, founder and director of the Kapoeta Children's Shelter"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-[#B85C38] text-sm uppercase tracking-widest mb-4 font-medium">The man behind the mission</p>
              <h2
                className="text-3xl font-light text-[#1C1410] mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Brother Hakim Peter
              </h2>
              <p className="text-[#3D2B1F] leading-relaxed mb-4">
                A South Sudanese pastor and community leader, Hakim returned to Kapoeta in 2020 after a calling he describes as impossible to ignore. He is not an outsider administering charity — he is a son of this land, known and trusted by local elders, families, and the children themselves.
              </p>
              <p className="text-[#8C7B72] leading-relaxed mb-6">
                He lives at the shelter. He knows every child by name. He advocates for them with local authorities, sources their food, and teaches them — in the classroom and by example — what it means to be valued.
              </p>
              <Link
                href="/about"
                className="text-sm font-semibold text-[#B85C38] hover:text-[#8B3E23] transition-colors"
              >
                Meet the full team →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-24 px-4 bg-[#1C1410] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#D4785A] text-sm uppercase tracking-widest mb-6 font-medium">
            Partner with us
          </p>
          <h2
            className="text-4xl sm:text-5xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Sixty children. Fourteen more months of winter.
          </h2>
          <p className="text-[#C4AE9A] text-lg mb-10 leading-relaxed">
            A$25 feeds a child for a week. A$600 sponsors a full year. A$12,500 builds the water tower that changes everything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/donate?goal=water-tower"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full bg-[#B85C38] text-white hover:bg-[#D4785A] transition-colors"
            >
              Give to Water Tower
            </Link>
            <Link
              href="/donate?goal=general-support"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full border-2 border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              Monthly Support
            </Link>
          </div>
          <p className="text-[#6B5A52] text-sm mt-8">
            All donations are tax-deductible. 100% reaches Kapoeta.
          </p>
        </div>
      </section>
    </div>
  );
}
