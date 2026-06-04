import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getConfig, saveConfig, uploadFile } from "@/lib/admin/store";
import { KAPOETA_GOALS } from "@/lib/goals";
import { ALL_SECTION_KEYS } from "@/lib/admin/sections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// MUAPI image generation can take up to 60 seconds
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const MODEL = "google-imagen4"; // $0.03/image — photorealistic

async function pollResult(requestId: string, apiKey: string): Promise<string> {
  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      throw new Error(`Poll failed: ${res.status} — ${body}`);
    }
    const data = await res.json();
    // MUAPI uses "completed" (not "succeeded")
    if (data.status === "completed") {
      // Output can be in outputs[] or output field
      const url = Array.isArray(data.outputs) ? data.outputs[0]
        : Array.isArray(data.output) ? data.output[0]
        : (data.outputs ?? data.output ?? data.image_url ?? data.url);
      if (!url) throw new Error("Generation completed but no output URL found");
      return String(url);
    }
    if (data.status === "failed") throw new Error(data.error ?? "Image generation failed on server");
  }
  throw new Error("Timed out waiting for image");
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

  // Submit generation job
  const submitRes = await fetch(`${MUAPI_BASE}/${MODEL}`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio: "16:9" }),
  });
  if (!submitRes.ok) {
    const err = await submitRes.text();
    return NextResponse.json({ error: `MUAPI submit failed (${submitRes.status}): ${err}` }, { status: 502 });
  }
  const submitData = await submitRes.json();

  // Some endpoints return the result synchronously; handle that case too
  let imageUrl: string;
  try {
    const syncUrl = Array.isArray(submitData.outputs) ? submitData.outputs[0]
      : Array.isArray(submitData.output) ? submitData.output[0]
      : (submitData.image_url ?? submitData.url ?? null);

    if (syncUrl) {
      imageUrl = String(syncUrl);
    } else {
      const request_id = submitData.request_id ?? submitData.id;
      if (!request_id) {
        return NextResponse.json({ error: `No request_id from MUAPI. Response: ${JSON.stringify(submitData)}` }, { status: 502 });
      }
      imageUrl = await pollResult(String(request_id), apiKey);
    }

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
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
