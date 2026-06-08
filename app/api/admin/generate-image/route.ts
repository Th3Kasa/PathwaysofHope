import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { uploadFile, dbSetImage } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const MODEL = "flux-2-pro";

async function pollResult(requestId: string, apiKey: string): Promise<string> {
  const maxAttempts = 20; // 20 × 2s = 40s max, leaving headroom within the 60s function limit
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();
    // If output is present, use it — don't rely on status string which varies by provider
    if (data.output) {
      const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      return String(outputUrl);
    }
    const failed = ["failed", "error", "cancelled"].includes(String(data.status).toLowerCase());
    if (failed) throw new Error(`Image generation failed (status: ${data.status})`);
  }
  throw new Error("Timed out waiting for image");
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.MUAPI_API_KEY_POH;
  if (!apiKey) return NextResponse.json({ error: "MUAPI not configured" }, { status: 503 });

  let goalId: string, prompt: string, commit: boolean;
  try {
    const body = await req.json();
    goalId = String(body.goalId ?? "");
    prompt = String(body.prompt ?? "");
    commit = body.commit !== false;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!goalId || !prompt) return NextResponse.json({ error: "Invalid goal or prompt" }, { status: 400 });

  const submitRes = await fetch(`${MUAPI_BASE}/${MODEL}`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio: "16:9", num_images: 1 }),
  });
  if (!submitRes.ok) {
    const err = await submitRes.text();
    return NextResponse.json({ error: `MUAPI submit failed: ${err}` }, { status: 502 });
  }
  const { request_id } = await submitRes.json();
  if (!request_id) return NextResponse.json({ error: "No request_id from MUAPI" }, { status: 502 });

  const imageUrl = await pollResult(String(request_id), apiKey);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Failed to download generated image");
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

  const blobUrl = await uploadFile(`sections/${goalId}-ai.jpg`, imgBuffer, contentType);
  if (commit) await dbSetImage(goalId, blobUrl);

  return NextResponse.json({ ok: true, url: blobUrl, committed: commit });
}
