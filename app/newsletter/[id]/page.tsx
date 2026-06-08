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
  return <NewsletterPostClient post={post} />;
}
