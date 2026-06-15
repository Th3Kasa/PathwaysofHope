import { notFound } from "next/navigation";
import { getConfig } from "@/lib/admin/store";
import { NewsletterPostClient } from "./post-client";

export const dynamic = "force-dynamic";

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
  // Render English immediately. Arabic is fetched on-demand by the client when
  // the visitor switches to Arabic (and cached in the DB after the first time),
  // so the article always loads fast and never blocks on translation.
  return <NewsletterPostClient post={post} />;
}
