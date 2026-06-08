import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { FORMAT_SYSTEM, extractJson, tryModels, translateToArabic } from "@/lib/translate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.MUAPI_API_KEY_POH;
  if (!apiKey) return NextResponse.json({ error: "MUAPI not configured" }, { status: 503 });

  let rawTitle: string, rawBody: string;
  try {
    const b = await req.json();
    rawTitle = String(b.title ?? "").trim();
    rawBody = String(b.body ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!rawTitle || !rawBody) return NextResponse.json({ error: "Title and body required" }, { status: 400 });

  // ── Step 1: Format to English ─────────────────────────────────────────────
  let title: string, body: string;
  try {
    const raw = await tryModels(`Title: ${rawTitle}\n\nBody: ${rawBody}`, FORMAT_SYSTEM, apiKey);
    const parsed = extractJson(raw);
    if (parsed && typeof parsed.title === "string" && typeof parsed.body === "string") {
      title = parsed.title;
      body = parsed.body;
    } else {
      title = rawTitle;
      body = raw;
    }
  } catch (e) {
    return NextResponse.json({ error: `Text formatting failed: ${(e as Error).message}` }, { status: 502 });
  }

  // ── Step 2: Translate to Arabic (best-effort) ─────────────────────────────
  // If this fails here, the public page translates lazily on first view instead.
  const ar = await translateToArabic(title, body);

  return NextResponse.json({ ok: true, title, body, titleAr: ar?.titleAr, bodyAr: ar?.bodyAr });
}
