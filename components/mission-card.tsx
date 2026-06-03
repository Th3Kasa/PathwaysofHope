"use client";

import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n";

interface MissionCardProps {
  slug: string;
  country: string;
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  childCount: number;
  status: "active" | "coming-soon";
}

export function MissionCard({
  slug,
  country,
  title,
  summary,
  imageSrc,
  imageAlt,
  childCount,
  status,
}: MissionCardProps) {
  const t = useT();
  return (
    <article className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-[#EDD9B4] hover:shadow-md transition-shadow">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-[#3D2B1F]">
            {country}
          </span>
          {status === "active" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#B85C38] text-white">
              {t({ en: "Active", ar: "نشطة" })}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h2
          className="text-xl font-semibold text-[#1C1410] mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h2>
        <p className="text-sm text-[#8C7B72] leading-relaxed mb-4">{summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8C7B72]">
            {t({ en: `${childCount} children`, ar: `${childCount} طفلاً` })}
          </span>
          {status === "active" ? (
            <Link
              href={`/missions/${slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#B85C38] hover:text-[#8B3E23] transition-colors"
            >
              {t({ en: "Read the story →", ar: "اقرأ القصة ←" })}
            </Link>
          ) : (
            <span className="text-xs text-[#8C7B72] italic">
              {t({ en: "Coming soon", ar: "قريبًا" })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
