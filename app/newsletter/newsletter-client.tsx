"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useT } from "@/lib/i18n";
import type { NewsletterPost } from "@/lib/admin/store";
import { Calendar, User } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const PLACEHOLDER = "/images/kapoeta/field/children-large-group-activity-kapoeta.jpg";

export function NewsletterClient({ posts }: { posts: NewsletterPost[] }) {
  const t = useT();
  const lang = typeof document !== "undefined"
    ? (document.documentElement.lang as "en" | "ar") || "en"
    : "en";

  const title = (p: NewsletterPost) => lang === "ar" && p.titleAr ? p.titleAr : p.titleEn;
  const body  = (p: NewsletterPost) => lang === "ar" && p.bodyAr  ? p.bodyAr  : p.bodyEn;
  const stripMd = (text: string) => text.replace(/\*\*|__|~~|`|#{1,6}\s|>\s|---+|\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
  const excerpt = (text: string) => { const s = stripMd(text); return s.length > 180 ? s.slice(0, 177) + "…" : s; };

  return (
    <div className="bg-[#e7e5e4] min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-12 sm:pb-16 px-4 bg-[#f5f5f4]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-[#6366f1] text-sm uppercase tracking-widest mb-3 font-medium"
            initial="hidden" animate="visible" variants={fadeUp}
          >
            {t({ en: "Latest news", ar: "آخر الأخبار" })}
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl font-light text-[#1e293b] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
            initial="hidden" animate="visible" variants={fadeUp}
          >
            {t({ en: "Updates from the Field", ar: "أخبار من الميدان" })}
          </motion.h1>
          <motion.p
            className="text-[#6b7280] text-lg max-w-2xl"
            initial="hidden" animate="visible" variants={fadeUp}
          >
            {t({
              en: "Stories, progress reports, and moments from the Kapoeta shelter and our ongoing missions.",
              ar: "قصص وتقارير تقدّم ولحظات من ملجأ كاپويتا ومهامّنا المستمرة.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <motion.div
              className="text-center py-20 text-[#9ca3af]"
              initial="hidden" animate="visible" variants={fadeUp}
            >
              <p className="text-lg">{t({ en: "No updates yet — check back soon.", ar: "لا أخبار بعد — تفقّدنا قريبًا." })}</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              {posts.map((post) => (
                <motion.article key={post.id} variants={fadeUp}>
                  <Link
                    href={`/newsletter/${post.id}`}
                    className="group block bg-white rounded-2xl border border-[#d6d3d1] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Image */}
                    <div className="relative h-52 w-full bg-[#f5f5f4] overflow-hidden">
                      <Image
                        src={post.imageUrl || PLACEHOLDER}
                        alt={post.imageAlt || title(post)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2
                        className="text-lg font-semibold text-[#1e293b] mb-2 leading-snug group-hover:text-[#6366f1] transition-colors"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {title(post)}
                      </h2>
                      <p className="text-sm text-[#6b7280] leading-relaxed mb-4">
                        {excerpt(body(post))}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                        <span className="flex items-center gap-1.5">
                          <User size={12} />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
