import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const TEXT_MODEL = "gpt-5-nano";

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

/** Pull text out of whatever shape MUAPI returns. */
function textFromResult(data: Record<string, unknown>): string | null {
  const candidates = [data.outputs, data.output, data.text, data.content, data.result, data.message];
  for (const c of candidates) {
    if (!c) continue;
    if (Array.isArray(c)) {
      if (c.length === 0) continue;
      return c.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join("");
    }
    if (typeof c === "string") return c;
    return JSON.stringify(c);
  }
  return null;
}

async function pollResult(requestId: string, apiKey: string): Promise<{ title: string; body: string }> {
  let last: Record<string, unknown> = {};
  for (let i = 0; i < 45; i++) {
    await new Promise((r) => setTimeout(r, i < 5 ? 800 : 1200)); // fast at first, then settle
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Poll failed ${res.status} at /predictions/${requestId}/result: ${errBody.slice(0, 200)}`);
    }
    const data = await res.json() as Record<string, unknown>;
    last = data;
    const text = textFromResult(data);
    if (text) {
      const result = extractTitleBody(text);
      // If it returned text but not our JSON shape, use the raw text as the body.
      return result ?? { title: "", body: text };
    }
    const failed = ["failed", "error", "cancelled"].includes(String(data.status).toLowerCase());
    if (failed) throw new Error(`MUAPI failed: ${JSON.stringify(data).slice(0, 300)}`);
  }
  // Surface the actual last response so the toast shows what the model returned.
  throw new Error(`Timed out. Last MUAPI response: ${JSON.stringify(last).slice(0, 400)}`);
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
    const submitRes = await fetch(`${MUAPI_BASE}/${TEXT_MODEL}`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!submitRes.ok) {
      lastError = `HTTP ${submitRes.status}: ${await submitRes.text()}`;
      continue;
    }

    submitData = await submitRes.json() as Record<string, unknown>;
    console.log(`[format-post] submit response: ${JSON.stringify(submitData).slice(0, 500)}`);

    // Synchronous response (openai-style choices, or direct text/outputs)
    const choices = submitData.choices;
    if (Array.isArray(choices) && (choices[0] as Record<string, unknown>)?.message) {
      const text = String(((choices[0] as Record<string, unknown>).message as Record<string, unknown>).content ?? "");
      const result = extractTitleBody(text);
      if (result || text) return NextResponse.json({ ok: true, ...(result ?? { title: "", body: text }) });
    }
    const sync = textFromResult(submitData);
    if (sync) {
      const result = extractTitleBody(sync);
      return NextResponse.json({ ok: true, ...(result ?? { title: "", body: sync }) });
    }

    // Async response
    const reqId = submitData.request_id ?? submitData.id ?? submitData.requestId ?? submitData.prediction_id;
    if (reqId) {
      try {
        const result = await pollResult(String(reqId), apiKey);
        return NextResponse.json({ ok: true, title: result.title, body: result.body });
      } catch (e) {
        lastError = `${(e as Error).message} | submit was: ${JSON.stringify(submitData).slice(0, 250)}`;
        continue;
      }
    }

    lastError = `Unexpected response shape: ${JSON.stringify(submitData).slice(0, 300)}`;
  }

  return NextResponse.json({ error: `MUAPI ${TEXT_MODEL} failed — ${lastError}` }, { status: 502 });
}
