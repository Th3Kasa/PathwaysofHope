"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useT } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { ArrowLeft } from "lucide-react";

const PLACEHOLDER = "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg";

export function NewsletterPostClient({ post }: { post: NewsletterPost }) {
  const t = useT();
  const lang = typeof document !== "undefined"
    ? (document.documentElement.lang as "en" | "ar") || "en"
    : "en";

  const titleText = lang === "ar" && post.titleAr ? post.titleAr : post.titleEn;
  const bodyText  = lang === "ar" && post.bodyAr  ? post.bodyAr  : post.bodyEn;

  const dateStr = new Date(post.publishedAt).toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Back link */}
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-1.5 text-sm text-[#9ca3af] hover:text-[#6366f1] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          {t({ en: "All updates", ar: "جميع الأخبار" })}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Masthead ── */}
          <div className="border-t-4 border-b border-[#1e293b] pt-3 pb-2 mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b7280] font-medium">
              Pathways of Hope · Field Dispatch
            </p>
          </div>

          {/* ── Headline ── */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {titleText}
          </h1>

          {/* ── Byline ── */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6b7280] border-b border-[#d6d3d1] pb-4 mb-8">
            <span className="font-medium text-[#374151]">By {post.author}</span>
            <span>·</span>
            <span>{dateStr}</span>
          </div>

          {/* ── Hero image ── */}
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-2 bg-[#e7e5e4]">
            <Image
              src={post.imageUrl || PLACEHOLDER}
              alt={post.imageAlt || titleText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized
              priority
            />
          </div>
          {post.imageAlt && (
            <p className="text-xs text-[#9ca3af] italic mb-8 pl-1">{post.imageAlt}</p>
          )}
          {!post.imageAlt && <div className="mb-8" />}

          {/* ── Body (newspaper prose) ── */}
          <div className="max-w-2xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-2xl font-bold text-[#0f172a] mt-10 mb-3 border-b border-[#e5e7eb] pb-2" style={{ fontFamily: "var(--font-serif)" }}>{children}</h2>
                ),
                h2: ({ children }) => (
                  <h3 className="text-xl font-bold text-[#0f172a] mt-8 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{children}</h3>
                ),
                h3: ({ children }) => (
                  <h4 className="text-base font-semibold uppercase tracking-wide text-[#6366f1] mt-6 mb-2">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="text-[1.05rem] leading-[1.85] text-[#374151] mb-5">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#1e293b]">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-[#4b5563]">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-none space-y-2 my-5 pl-0">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 my-5 text-[#374151]">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="flex gap-2 text-[1.05rem] leading-relaxed text-[#374151] before:content-['—'] before:text-[#6366f1] before:flex-shrink-0">{children}</li>
                ),
                hr: () => (
                  <div className="flex items-center gap-3 my-10">
                    <div className="flex-1 h-px bg-[#d6d3d1]" />
                    <span className="text-[#9ca3af] text-xs">✦</span>
                    <div className="flex-1 h-px bg-[#d6d3d1]" />
                  </div>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#6366f1] pl-5 py-1 my-6 italic text-xl text-[#374151] leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>{children}</blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-[#6366f1] underline underline-offset-2 hover:text-[#4f46e5]" target="_blank" rel="noopener noreferrer">{children}</a>
                ),
              }}
            >
              {bodyText}
            </ReactMarkdown>
          </div>

          {/* ── Footer rule ── */}
          <div className="max-w-2xl mx-auto mt-16 pt-6 border-t border-[#d6d3d1]">
            <p className="text-xs text-[#9ca3af] text-center">
              Pathways of Hope · <a href="/newsletter" className="hover:text-[#6366f1] transition-colors">More updates</a>
            </p>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
