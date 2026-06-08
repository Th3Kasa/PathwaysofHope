"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { Calendar, User, ArrowLeft } from "lucide-react";

const PLACEHOLDER = "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg";

export function NewsletterPostClient({ post }: { post: NewsletterPost }) {
  const t = useT();
  const lang = typeof document !== "undefined"
    ? (document.documentElement.lang as "en" | "ar") || "en"
    : "en";

  const titleText = lang === "ar" && post.titleAr ? post.titleAr : post.titleEn;
  const bodyText  = lang === "ar" && post.bodyAr  ? post.bodyAr  : post.bodyEn;

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        {/* Back */}
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#6366f1] transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          {t({ en: "All updates", ar: "جميع الأخبار" })}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Hero image */}
          {post.imageUrl && (
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-[#f5f5f4]">
              <Image
                src={post.imageUrl || PLACEHOLDER}
                alt={post.imageAlt || titleText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#9ca3af] mb-4">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-light text-[#1e293b] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {titleText}
          </h1>

          {/* Body */}
          <div className="prose prose-lg max-w-none text-[#374151] leading-relaxed whitespace-pre-wrap">
            {bodyText}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
