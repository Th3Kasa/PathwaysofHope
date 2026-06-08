import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const TEXT_MODELS = ["gemini-2-5-flash", "claude-haiku-4-5"];

const FORMAT_SYSTEM = `You are the editor of a charity's newspaper. Rewrite the raw title and body into a polished feature article for "Pathways of Hope", a charity helping children at the Kapoeta Children's Shelter in South Sudan.

TITLE: Rewrite as a compelling newspaper headline — short, vivid, specific (6–10 words). Do NOT echo the raw title.

BODY:
- Open with a strong one-sentence standfirst/lead.
- Then 4–7 paragraphs (2–4 sentences each) in clear journalistic prose.
- Keep all facts, names and numbers intact. Do not invent facts.
- Warm, human, dignified tone. No clichés.

OUTPUT: Return ONLY valid JSON: {"title": "...", "body": "..."} — use \\n\\n between paragraphs in body. No markdown, no commentary, just the JSON object.`;

const TRANSLATE_SYSTEM = `You are a professional Arabic translator. Translate the given English newspaper title and body into natural Modern Standard Arabic (فصحى).

Rules:
- Translate faithfully — do not add or remove content.
- Keep the same paragraph structure (same number of paragraphs).
- Use formal, dignified journalistic Arabic.

OUTPUT FORMAT — return EXACTLY this structure and nothing else (no JSON, no markdown, no commentary):
TITLE: <the Arabic headline on one line>
BODY:
<the Arabic body — keep a blank line between each paragraph>`;

interface Formatted { title: string; body: string; titleAr?: string; bodyAr?: string }

/** Pull the first complete JSON object out of a string. */
function extractJson(raw: string): Record<string, unknown> | null {
  // Find the outermost {...} block
  const start = raw.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  for (let i = start; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) return null;
  const jsonStr = raw.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    // Try fixing unescaped newlines inside string values
    try {
      return JSON.parse(jsonStr.replace(/\n/g, "\\n")) as Record<string, unknown>;
    } catch { return null; }
  }
}

/** Parse a "TITLE: ...\nBODY:\n..." plain-text response. */
function parseTitleBody(raw: string): { title: string; body: string } | null {
  const text = raw.replace(/^```\w*\n?/, "").replace(/```\s*$/, "").trim();
  const titleMatch = text.match(/TITLE\s*:\s*(.+)/i);
  const bodyMatch = text.match(/BODY\s*:/i);
  if (bodyMatch) {
    const body = text.slice(bodyMatch.index! + bodyMatch[0].length).trim();
    if (body) return { title: (titleMatch?.[1] ?? "").trim(), body };
  }
  // No usable BODY marker — if there's substantial text, treat it all as the body.
  return text.length > 20 ? { title: "", body: text } : null;
}

/** Pull text out of whatever shape MUAPI returns. */
function textFromResult(data: Record<string, unknown>): string | null {
  const candidates = [data.outputs, data.output, data.text, data.content, data.result, data.message];
  for (const c of candidates) {
    if (!c) continue;
    if (Array.isArray(c)) { if (c.length === 0) continue; return c.map(x => typeof x === "string" ? x : JSON.stringify(x)).join(""); }
    if (typeof c === "string") return c;
    return JSON.stringify(c);
  }
  return null;
}

async function pollText(requestId: string, apiKey: string): Promise<string> {
  let last: Record<string, unknown> = {};
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, i < 5 ? 800 : 1200));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, { headers: { "x-api-key": apiKey } });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Poll failed ${res.status}: ${errBody.slice(0, 200)}`);
    }
    const data = await res.json() as Record<string, unknown>;
    last = data;
    const text = textFromResult(data);
    if (text) return text;
    const failed = ["failed", "error", "cancelled"].includes(String(data.status).toLowerCase());
    if (failed) throw new Error(`MUAPI failed: ${JSON.stringify(data).slice(0, 300)}`);
  }
  throw new Error(`Timed out. Last: ${JSON.stringify(last).slice(0, 300)}`);
}

async function callModel(model: string, prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const submitRes = await fetch(`${MUAPI_BASE}/${model}`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system_prompt: systemPrompt }),
  });
  if (!submitRes.ok) throw new Error(`submit HTTP ${submitRes.status}: ${(await submitRes.text()).slice(0, 150)}`);
  const submitData = await submitRes.json() as Record<string, unknown>;
  const sync = textFromResult(submitData);
  if (sync) return sync;
  const reqId = submitData.request_id ?? submitData.id ?? submitData.requestId ?? submitData.prediction_id;
  if (reqId) return pollText(String(reqId), apiKey);
  throw new Error(`unexpected response: ${JSON.stringify(submitData).slice(0, 200)}`);
}

async function tryModels(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const errors: string[] = [];
  for (const model of TEXT_MODELS) {
    try { return await callModel(model, prompt, systemPrompt, apiKey); }
    catch (e) { errors.push(`${model}: ${(e as Error).message}`); }
  }
  throw new Error(errors.join(" | "));
}

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
      // Fallback: raw text as body
      title = rawTitle;
      body = raw;
    }
  } catch (e) {
    return NextResponse.json({ error: `Text formatting failed: ${(e as Error).message}` }, { status: 502 });
  }

  // ── Step 2: Translate to Arabic (non-fatal if it fails) ───────────────────
  // Uses a plain-text TITLE:/BODY: format instead of JSON — long multi-paragraph
  // Arabic text breaks JSON escaping, so a delimiter is far more reliable.
  let titleAr: string | undefined;
  let bodyAr: string | undefined;
  let arDebug = "not attempted";
  try {
    const raw = await tryModels(`Title: ${title}\n\nBody: ${body}`, TRANSLATE_SYSTEM, apiKey);
    const parsed = parseTitleBody(raw);
    if (parsed) {
      titleAr = parsed.title;
      bodyAr = parsed.body;
      arDebug = "ok";
    } else {
      arDebug = `unparseable: ${raw.slice(0, 120)}`;
    }
  } catch (e) {
    arDebug = `error: ${(e as Error).message}`;
  }
  console.log(`[format-post] arabic: ${arDebug} | titleAr len=${titleAr?.length ?? 0} bodyAr len=${bodyAr?.length ?? 0}`);

  return NextResponse.json({ ok: true, title, body, titleAr, bodyAr });
}
