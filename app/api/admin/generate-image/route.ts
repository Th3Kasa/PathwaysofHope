import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getConfig, saveConfig, uploadFile } from "@/lib/admin/store";
import { KAPOETA_GOALS } from "@/lib/goals";
import { ALL_SECTION_KEYS } from "@/lib/admin/sections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// MUAPI image generation can take up to ~60 seconds
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const MODEL = "flux-kontext-max-t2i"; // photorealistic/cinematic, less restrictive than Imagen
const MAX_ATTEMPTS = 3; // retry transient "Internal Error" failures

/** Error thrown when MUAPI reports the generation itself failed (vs a transient network/poll error). */
class GenerationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenerationFailedError";
  }
}

/** Pull the meaningful body out of a MUAPI response, which may wrap data under `detail`. */
function unwrap(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object" && "detail" in data) {
    const d = (data as { detail: unknown }).detail;
    if (d && typeof d === "object") return d as Record<string, unknown>;
  }
  return (data ?? {}) as Record<string, unknown>;
}

function extractUrl(obj: Record<string, unknown>): string | null {
  if (Array.isArray(obj.outputs) && obj.outputs.length) return String(obj.outputs[0]);
  if (Array.isArray(obj.output) && obj.output.length) return String(obj.output[0]);
  if (typeof obj.image_url === "string") return obj.image_url;
  if (typeof obj.url === "string") return obj.url;
  return null;
}

async function pollResult(requestId: string, apiKey: string): Promise<string> {
  const maxPolls = 25;
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });

    const raw = await res.text();
    let data: unknown;
    try { data = JSON.parse(raw); } catch { data = {}; }
    const body = unwrap(data);
    const status = String(body.status ?? "");

    // MUAPI reports a failed generation either with a "failed" status or a 4xx + detail.
    if (status === "failed") {
      throw new GenerationFailedError(String(body.error ?? "Image generation failed"));
    }
    if (status === "completed") {
      const url = extractUrl(body);
      if (!url) throw new GenerationFailedError("Generation completed but no output URL was returned");
      return url;
    }
    // Non-OK with no recognised status — surface what we can, then keep polling once more in case it's transient.
    if (!res.ok && !status) {
      throw new GenerationFailedError(String(body.error ?? raw.slice(0, 200) ?? `Poll failed (${res.status})`));
    }
    // otherwise still processing — keep polling
  }
  throw new Error("Timed out waiting for image");
}

/** Submit + poll once. Throws GenerationFailedError if the model rejected/failed the request. */
async function generateOnce(prompt: string, apiKey: string): Promise<string> {
  const submitRes = await fetch(`${MUAPI_BASE}/${MODEL}`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio: "16:9" }),
  });
  const submitRaw = await submitRes.text();
  let submitData: unknown;
  try { submitData = JSON.parse(submitRaw); } catch { submitData = {}; }
  const submitBody = unwrap(submitData);

  if (!submitRes.ok) {
    throw new GenerationFailedError(String(submitBody.error ?? submitRaw.slice(0, 200) ?? `Submit failed (${submitRes.status})`));
  }

  // Some endpoints return the image directly on submit.
  const syncUrl = extractUrl(submitBody);
  if (syncUrl) return syncUrl;

  const requestId = submitBody.request_id ?? submitBody.id;
  if (!requestId) {
    throw new GenerationFailedError(`No request_id from MUAPI. Response: ${submitRaw.slice(0, 200)}`);
  }
  return pollResult(String(requestId), apiKey);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.MUAPI_API_KEY_POH;
  if (!apiKey) return NextResponse.json({ error: "MUAPI not configured" }, { status: 503 });

  let sectionKey: string, prompt: string;
  try {
    const body = await req.json();
    sectionKey = String(body.sectionKey ?? "");
    prompt = String(body.prompt ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const validKeys = [...ALL_SECTION_KEYS, ...KAPOETA_GOALS.map((g) => g.id)];
  if (!validKeys.includes(sectionKey) || !prompt) {
    return NextResponse.json({ error: "Invalid section key or missing prompt" }, { status: 400 });
  }

  // Retry transient failures (e.g. "Internal Error, Please try again later").
  let imageUrl: string | null = null;
  let lastError = "Generation failed";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      imageUrl = await generateOnce(prompt, apiKey);
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Generation failed";
      // Don't burn retries on clearly non-transient problems.
      const transient = /internal error|try again|timeout|timed out|temporarily|503|502|500/i.test(lastError);
      if (!transient || attempt === MAX_ATTEMPTS) break;
    }
  }

  if (!imageUrl) {
    return NextResponse.json({ error: lastError, attempts: MAX_ATTEMPTS }, { status: 502 });
  }

  // Download the generated image and save it to Blob storage.
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Failed to download generated image (${imgRes.status})`);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const contentType = imgRes.headers.get("content-type") || "image/jpeg";

    const blobUrl = await uploadFile(`sections/${sectionKey}-ai.jpg`, imgBuffer, contentType);
    const config = await getConfig();
    config.images[sectionKey] = blobUrl;
    await saveConfig(config);

    return NextResponse.json({ ok: true, url: blobUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save generated image";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
