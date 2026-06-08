import { notFound } from "next/navigation";
import { getConfig, dbUpdateNewsletterPost, type NewsletterPost } from "@/lib/admin/store";
import { translateToArabic } from "@/lib/translate";
import { NewsletterPostClient } from "./post-client";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // first-view translation may need a few seconds

/**
 * Ensure the post has an Arabic translation. If it's missing, translate once
 * via MUAPI, persist it to the DB, and return the updated post. Every later
 * view (in any language) reuses the stored Arabic — one API call per post, ever.
 */
async function withArabic(post: NewsletterPost): Promise<NewsletterPost> {
  if (post.bodyAr?.trim()) return post;
  const ar = await translateToArabic(post.titleEn, post.bodyEn);
  if (!ar) return post; // translation failed — page falls back to English
  await dbUpdateNewsletterPost(post.id, { titleAr: ar.titleAr, bodyAr: ar.bodyAr });
  return { ...post, titleAr: ar.titleAr, bodyAr: ar.bodyAr };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = await getConfig();
  const post = (config.newsletterPosts ?? []).find((p) => p.id === id);
  if (!post) return { title: "Update — Pathways of Hope" };
  return {
    title: `${post.titleEn} — Pathways of Hope`,
    description: post.bodyEn.slice(0, 160),
  };
}

export default async function NewsletterPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = await getConfig();
  const post = (config.newsletterPosts ?? []).find((p) => p.id === id);
  if (!post) notFound();
  const ready = await withArabic(post);
  return <NewsletterPostClient post={ready} />;
}
