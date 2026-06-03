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
  const href = `/missions/${slug}`;
  const isLink = status === "active";
  return (
    <article className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-[#d6d3d1] hover:shadow-md transition-shadow">
      <ConditionalLink href={href} enabled={isLink} className="block relative h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 text-[#374151]">
            {country}
          </span>
          {status === "active" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#6366f1] text-white">
              {t({ en: "Active", ar: "نشطة" })}
            </span>
          )}
        </div>
      </ConditionalLink>
      <div className="p-6">
        {isLink ? (
          <Link href={href}>
            <h2
              className="text-xl font-semibold text-[#1e293b] mb-2 hover:text-[#6366f1] transition-colors"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {title}
            </h2>
          </Link>
        ) : (
          <h2
            className="text-xl font-semibold text-[#1e293b] mb-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h2>
        )}
        <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">
            {t({ en: `${childCount} children`, ar: `${childCount} طفلاً` })}
          </span>
          {isLink ? (
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#6366f1] hover:text-[#4f46e5] transition-colors"
            >
              {t({ en: "Read the story →", ar: "اقرأ القصة ←" })}
            </Link>
          ) : (
            <span className="text-xs text-[#6b7280] italic">
              {t({ en: "Coming soon", ar: "قريبًا" })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ConditionalLink({
  href,
  enabled,
  className,
  children,
}: {
  href: string;
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (enabled) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}
