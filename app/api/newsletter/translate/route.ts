import { NextRequest, NextResponse } from "next/server";
import { getConfig, dbUpdateNewsletterPost } from "@/lib/admin/store";
import { translateToArabic } from "@/lib/translate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// On-demand Arabic translation for a newsletter post. Called by the public
// article page the first time a visitor views it in Arabic. The result is
// persisted, so it's one translation per post, ever — every later view reuses it.
export async function POST(req: NextRequest) {
  let id = "";
  try {
    id = String((await req.json()).id ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const config = await getConfig();
  const post = (config.newsletterPosts ?? []).find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Already translated — return the stored Arabic.
  if (post.bodyAr?.trim()) {
    return NextResponse.json({ titleAr: post.titleAr, bodyAr: post.bodyAr });
  }

  const ar = await translateToArabic(post.titleEn, post.bodyEn);
  if (!ar) return NextResponse.json({ error: "Translation unavailable" }, { status: 502 });

  try {
    await dbUpdateNewsletterPost(post.id, { titleAr: ar.titleAr, bodyAr: ar.bodyAr });
  } catch {
    // Persisting failed, but we can still return the translation for this view.
  }
  return NextResponse.json(ar);
}
