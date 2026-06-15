"use client";

import Image from "next/image";
import Link from "next/link";
import { useT, useLang } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { DonateButton } from "@/components/donate-button";
import { Calendar, User, ArrowLeft, MapPin } from "lucide-react";

function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

export function NewsletterPostClient({ post }: { post: NewsletterPost }) {
  const t = useT();
  const { lang } = useLang();
  // Show the Arabic version when the site is in Arabic and a translation exists.
  const isAr = lang === "ar" && Boolean(post.bodyAr?.trim());
  const title = isAr ? post.titleAr || post.titleEn : post.titleEn;
  const paragraphs = splitIntoParagraphs(isAr ? post.bodyAr! : post.bodyEn);
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];

  // Editorial structure: first paragraph = standfirst lead; rest = body.
  const lead = paragraphs[0] ?? "";
  const rest = paragraphs.slice(1);

  // Split the remaining body into three runs, placing images between them.
  const third = Math.max(1, Math.ceil(rest.length / 3));
  const run1 = rest.slice(0, third);
  const run2 = rest.slice(third, third * 2);
  const run3 = rest.slice(third * 2);

  const dateStr = new Date(post.publishedAt).toLocaleDateString(isAr ? "ar-EG" : "en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const para = (p: string, i: number) => (
    <p key={i} className="text-[#3a322a] leading-[1.9] text-[1.075rem] sm:text-lg mb-5">
      {p}
    </p>
  );

  return (
    <div className="bg-[#f5f1ea] min-h-screen">
      {/* ── Branded masthead ───────────────────────────────────────────── */}
      <div className="border-b border-[#e4dccb] bg-[#fbf8f2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-5 flex items-center justify-center gap-3">
          <span className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-[#e4dccb] shadow-sm flex-shrink-0">
            <Image src="/logo.png" alt="Pathways of Hope" fill className="object-cover" priority />
          </span>
          <span className="leading-tight">
            <span className="block text-[#1f2917] font-semibold text-base" style={{ fontFamily: "var(--font-serif)" }}>
              {t({ en: "Pathways of Hope", ar: "دروب الأمل" })}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-[#C9952A] font-semibold">
              {t({ en: "Kapoeta Children's Shelter", ar: "ملجأ كاپويتا للأطفال" })}
            </span>
          </span>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {/* Kicker */}
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 text-[#b45309] text-xs uppercase tracking-[0.25em] font-semibold mb-4">
            <MapPin size={13} className="text-[#C9952A]" />
            {t({ en: "Field Update · Kapoeta, South Sudan", ar: "من الميدان · كاپويتا، جنوب السودان" })}
          </p>
          <h1
            className="text-[2rem] sm:text-[3.25rem] font-semibold text-[#1f1a14] leading-[1.08] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h1>
        </div>

        {/* Byline rule */}
        <div className="flex items-center justify-center gap-5 text-sm text-[#7a6f63] mt-6 mb-8 border-y border-[#e4dccb] py-3">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-[#C9952A]" />
            {post.author}
          </span>
          <span className="w-px h-3.5 bg-[#e4dccb]" />
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#C9952A]" />
            {dateStr}
          </span>
        </div>

        {/* Hero image with caption */}
        {images[0] && (
          <figure className="mb-9">
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md ring-1 ring-black/5">
              <Image src={images[0]} alt={post.imageAlt || title} fill className="object-cover" priority unoptimized />
            </div>
            <figcaption className="text-xs text-[#9a8f80] mt-2 italic text-center">
              {t({ en: "Kapoeta Children's Shelter, South Sudan", ar: "ملجأ كاپويتا للأطفال، جنوب السودان" })}
            </figcaption>
          </figure>
        )}

        {/* Standfirst lead */}
        {lead && (
          <p
            className="text-xl sm:text-2xl text-[#2a2218] leading-snug font-light mb-8 pl-5 border-l-2 border-[#C9952A]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {lead}
          </p>
        )}

        {/* Run 1 */}
        {run1.map((p, i) => para(p, i))}

        {/* Images 2 + 3 side by side */}
        {(images[1] || images[2]) && (
          <figure className="my-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images[1] && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md ring-1 ring-black/5">
                  <Image src={images[1]} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
              {images[2] && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md ring-1 ring-black/5">
                  <Image src={images[2]} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
          </figure>
        )}

        {/* Run 2 */}
        {run2.map((p, i) => para(p, i))}

        {/* Image 4 full width */}
        {images[3] && (
          <figure className="my-9">
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md ring-1 ring-black/5">
              <Image src={images[3]} alt="" fill className="object-cover" unoptimized />
            </div>
          </figure>
        )}

        {/* Run 3 */}
        {run3.map((p, i) => para(p, i))}

        {/* End mark */}
        <div className="text-center text-[#C9952A] text-lg mt-8 mb-2">❦</div>
      </article>

      {/* ── Branded donate footer ──────────────────────────────────────── */}
      <section className="bg-[#271d14] text-[#e9ddca]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14 text-center">
          <span className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/15 mx-auto mb-4 block">
            <Image src="/logo.png" alt="Pathways of Hope" fill className="object-cover" unoptimized />
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            {t({ en: "Your donation, in good hands.", ar: "تبرّعك في أيادٍ أمينة." })}
          </h2>
          <p className="text-sm sm:text-base text-[#c4b39a] max-w-xl mx-auto mb-7 leading-relaxed">
            {t({
              en: "Every volunteer serves at their own expense, so 100% of your gift reaches the children of Kapoeta.",
              ar: "يخدم كل متطوّع على نفقته الخاصة، ليصل 100% من تبرّعك إلى أطفال كاپويتا.",
            })}
          </p>
          <DonateButton size="lg" className="bg-[#b45309] text-white hover:bg-[#92400e] shadow-sm">
            {t({ en: "Donate today — change a life", ar: "تبرّع اليوم — غيّر حياة" })}
          </DonateButton>

          <div className="mt-9 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-1.5 text-[#c4b39a] hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              {t({ en: "Back to Updates", ar: "العودة للأخبار" })}
            </Link>
            <span className="text-[#8a7a64] uppercase tracking-[0.18em]">
              {t({ en: "Pathways of Hope", ar: "دروب الأمل" })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
