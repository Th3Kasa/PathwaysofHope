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
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();
    if (data.status === "succeeded" && data.output) {
      const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      return String(outputUrl);
    }
    if (data.status === "failed") throw new Error("Image generation failed");
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
    body: JSON.stringify({ prompt, aspect_ratio: "16:9", num_images: 1 }),
  });
  if (!submitRes.ok) {
    const err = await submitRes.text();
    return NextResponse.json({ error: `MUAPI submit failed: ${err}` }, { status: 502 });
  }
  const { request_id } = await submitRes.json();
  if (!request_id) return NextResponse.json({ error: "No request_id from MUAPI" }, { status: 502 });

  // Poll, download, and save — all wrapped so errors return JSON not HTML
  try {
    const imageUrl = await pollResult(String(request_id), apiKey);

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
