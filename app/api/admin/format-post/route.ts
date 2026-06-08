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

function extractTitleBody(raw: string): { title: string; body: string } | null {
  const match = raw.match(/\{[\s\S]*?"title"[\s\S]*?"body"[\s\S]*?\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

async function pollResult(requestId: string, apiKey: string): Promise<{ title: string; body: string }> {
  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, i < 5 ? 800 : 1200)); // fast at first, then settle
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();
    const ok = ["succeeded", "completed", "success", "done", "finished"].includes(data.status);
    if ((ok || (!data.status && data.output)) && data.output) {
      const text = Array.isArray(data.output) ? data.output.join("") : String(data.output);
      const result = extractTitleBody(text);
      if (!result) throw new Error("Could not parse formatted output from: " + text.slice(0, 200));
      return result;
    }
    const failed = ["failed", "error", "cancelled"].includes(data.status);
    if (failed) throw new Error(`MUAPI reported failure (status: ${data.status})`);
    // Log current status to help debug unknown status values
    console.log(`[format-post] poll ${i}: status=${data.status}, hasOutput=${Boolean(data.output)}`);
  }
  throw new Error("Timed out waiting for gpt-codex");
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

  const userContent = `Title: ${title}\n\nBody: ${body}`;

  // Try chat completions format first (standard for GPT-based models),
  // then fall back to simple prompt format.
  const requestBodies = [
    { messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userContent }] },
    { prompt: `${SYSTEM_PROMPT}\n\n${userContent}` },
  ];

  let submitData: Record<string, unknown> | null = null;
  let lastError = "";

  for (const reqBody of requestBodies) {
    const submitRes = await fetch(`${MUAPI_BASE}/gpt-codex`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!submitRes.ok) {
      lastError = `HTTP ${submitRes.status}: ${await submitRes.text()}`;
      continue;
    }

    submitData = await submitRes.json() as Record<string, unknown>;

    // Synchronous response
    const rawSync = submitData.output ?? submitData.text ?? submitData.content ?? submitData.choices;
    if (rawSync) {
      // Handle openai-style choices array
      let text: string;
      if (Array.isArray(rawSync) && (rawSync[0] as Record<string, unknown>)?.message) {
        text = String(((rawSync[0] as Record<string, unknown>).message as Record<string, unknown>).content ?? "");
      } else {
        text = Array.isArray(rawSync) ? rawSync.join("") : String(rawSync);
      }
      const result = extractTitleBody(text);
      if (result) return NextResponse.json({ ok: true, title: result.title, body: result.body });
    }

    // Async response
    if (submitData.request_id) {
      const result = await pollResult(String(submitData.request_id), apiKey);
      return NextResponse.json({ ok: true, title: result.title, body: result.body });
    }

    lastError = `Unexpected response shape: ${JSON.stringify(submitData).slice(0, 300)}`;
  }

  return NextResponse.json({ error: `MUAPI gpt-codex failed — ${lastError}` }, { status: 502 });
}
