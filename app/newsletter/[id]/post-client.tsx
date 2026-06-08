"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { Calendar, User, ArrowLeft } from "lucide-react";

function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

export function NewsletterPostClient({ post }: { post: NewsletterPost }) {
  const t = useT();
  const title = post.titleEn;
  const body = post.bodyEn;
  const paragraphs = splitIntoParagraphs(body);
  const images = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];

  // Split paragraphs into three sections around images
  const third = Math.max(1, Math.floor(paragraphs.length / 3));
  const section1 = paragraphs.slice(0, third);
  const section2 = paragraphs.slice(third, third * 2);
  const section3 = paragraphs.slice(third * 2);

  return (
    <div className="bg-[#f5f5f4] min-h-screen">
      {/* Hero */}
      {images[0] && (
        <div className="relative w-full h-64 sm:h-96 overflow-hidden">
          <Image
            src={images[0]}
            alt={post.imageAlt || title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <h1
              className="text-3xl sm:text-5xl font-light text-white leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* If no hero image, show title here */}
        {!images[0] && (
          <h1
            className="text-3xl sm:text-5xl font-light text-[#1e293b] leading-tight mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h1>
        )}

        {/* Meta */}
        <div className="flex items-center gap-5 text-sm text-[#6b7280] mb-8 pb-6 border-b border-[#d6d3d1]">
          <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Section 1 */}
        {section1.map((p, i) => (
          <p key={i} className="text-[#374151] leading-relaxed text-lg mb-5">{p}</p>
        ))}

        {/* Images 2 + 3 side by side */}
        {(images[1] || images[2]) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-8">
            {images[1] && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src={images[1]} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
            {images[2] && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src={images[2]} alt="" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>
        )}

        {/* Section 2 */}
        {section2.map((p, i) => (
          <p key={i} className="text-[#374151] leading-relaxed text-lg mb-5">{p}</p>
        ))}

        {/* Image 4 full width */}
        {images[3] && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden my-8">
            <Image src={images[3]} alt="" fill className="object-cover" unoptimized />
          </div>
        )}

        {/* Section 3 */}
        {section3.map((p, i) => (
          <p key={i} className="text-[#374151] leading-relaxed text-lg mb-5">{p}</p>
        ))}

        <div className="mt-10 pt-6 border-t border-[#d6d3d1]">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#6366f1] transition-colors"
          >
            <ArrowLeft size={14} />
            {t({ en: "Back to Updates", ar: "العودة للأخبار" })}
          </Link>
        </div>
      </div>
    </div>
  );
}
