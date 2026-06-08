"use client";

import Image from "next/image";
import Link from "next/link";
import { useT, useLang } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { Calendar, User, ArrowLeft } from "lucide-react";

function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

export function NewsletterPostClient({ post }: { post: NewsletterPost }) {
  const t = useT();
  const { lang } = useLang();
  // Show the Arabic version when the site is in Arabic and a translation exists.
  const isAr = lang === "ar" && Boolean(post.bodyAr?.trim());
  const title = isAr ? (post.titleAr || post.titleEn) : post.titleEn;
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

  const dateStr = new Date(post.publishedAt).toLocaleDateString(isAr ? "ar-EG" : "en-AU", { day: "numeric", month: "long", year: "numeric" });

  const para = (p: string, i: number) => (
    <p key={i} className="text-[#2a2a28] leading-[1.85] text-[1.075rem] sm:text-lg mb-5">
      {p}
    </p>
  );

  return (
    <div className="bg-[#f5f5f4] min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        {/* Masthead kicker */}
        <div className="text-center">
          <p className="text-[#6366f1] text-xs uppercase tracking-[0.25em] font-semibold mb-4">
            {t({ en: "Pathways of Hope · Field Update", ar: "دروب الأمل · من الميدان" })}
          </p>
          <h1
            className="text-[2rem] sm:text-[3.25rem] font-semibold text-[#161513] leading-[1.08] tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h1>
        </div>

        {/* Byline rule */}
        <div className="flex items-center justify-center gap-5 text-sm text-[#6b7280] mt-6 pb-6 mb-8 border-y border-[#d6d3d1] py-3">
          <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
          <span className="w-px h-3.5 bg-[#d6d3d1]" />
          <span className="flex items-center gap-1.5"><Calendar size={14} />{dateStr}</span>
        </div>

        {/* Hero image with caption */}
        {images[0] && (
          <figure className="mb-9">
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-sm">
              <Image src={images[0]} alt={post.imageAlt || title} fill className="object-cover" priority unoptimized />
            </div>
            <figcaption className="text-xs text-[#9ca3af] mt-2 italic text-center">
              {t({ en: "Kapoeta Children's Shelter, South Sudan", ar: "ملجأ كاپويتا للأطفال، جنوب السودان" })}
            </figcaption>
          </figure>
        )}

        {/* Standfirst lead */}
        {lead && (
          <p className="text-xl sm:text-2xl text-[#1e293b] leading-snug font-light mb-8" style={{ fontFamily: "var(--font-serif)" }}>
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
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm">
                  <Image src={images[1]} alt="" fill className="object-cover" unoptimized />
                </div>
              )}
              {images[2] && (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm">
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
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-sm">
              <Image src={images[3]} alt="" fill className="object-cover" unoptimized />
            </div>
          </figure>
        )}

        {/* Run 3 */}
        {run3.map((p, i) => para(p, i))}

        {/* End mark */}
        <div className="text-center text-[#c9952a] text-lg mt-8 mb-2">❦</div>

        <div className="mt-6 pt-6 border-t border-[#d6d3d1]">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#6366f1] transition-colors"
          >
            <ArrowLeft size={14} />
            {t({ en: "Back to Updates", ar: "العودة للأخبار" })}
          </Link>
        </div>
      </article>
    </div>
  );
}
