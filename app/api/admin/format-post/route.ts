import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";

const SYSTEM_PROMPT = `You are a professional editor for a charity newsletter.
Format the provided raw title and body into a polished, engaging article.
- Keep the author's voice and facts intact
- Break the body into clear paragraphs (2-4 sentences each)
- Add natural paragraph breaks where the topic shifts
- Make it warm, human and compelling — this is a charity helping children in South Sudan
- Return ONLY a JSON object with keys "title" and "body" (body uses \\n\\n between paragraphs)
- Do not add any commentary, just the JSON`;

async function pollResult(requestId: string, apiKey: string): Promise<{ title: string; body: string }> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();
    if (data.status === "succeeded" && data.output) {
      const text = Array.isArray(data.output) ? data.output.join("") : String(data.output);
      const match = text.match(/\{[\s\S]*"title"[\s\S]*"body"[\s\S]*\}/);
      if (!match) throw new Error("Could not parse formatted output");
      return JSON.parse(match[0]);
    }
    if (data.status === "failed") throw new Error("Formatting failed");
  }
  throw new Error("Timed out");
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.MUAPI_API_KEY_POH;
  if (!apiKey) return NextResponse.json({ error: "MUAPI not configured" }, { status: 503 });

  let title: string, body: string;
  try {
    const b = await req.json();
    title = String(b.title ?? "").trim();
    body = String(b.body ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!title || !body) return NextResponse.json({ error: "Title and body required" }, { status: 400 });

  const prompt = `${SYSTEM_PROMPT}\n\nTitle: ${title}\n\nBody: ${body}`;

  const submitRes = await fetch(`${MUAPI_BASE}/gpt-codex`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    return NextResponse.json({ error: `MUAPI error: ${err}` }, { status: 502 });
  }

  const submitData = await submitRes.json();

  // Handle synchronous response (some MUAPI models return immediately)
  if (submitData.output || submitData.text || submitData.content) {
    const text = submitData.output ?? submitData.text ?? submitData.content ?? "";
    const raw = Array.isArray(text) ? text.join("") : String(text);
    const match = raw.match(/\{[\s\S]*"title"[\s\S]*"body"[\s\S]*\}/);
    if (match) {
      const result = JSON.parse(match[0]);
      return NextResponse.json({ ok: true, title: result.title, body: result.body });
    }
  }

  // Handle async (polling) response
  if (submitData.request_id) {
    const result = await pollResult(String(submitData.request_id), apiKey);
    return NextResponse.json({ ok: true, title: result.title, body: result.body });
  }

  return NextResponse.json({ error: "Unexpected MUAPI response" }, { status: 502 });
}
