import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { isAuthed } from "@/lib/admin/auth";
import { uploadFile, dbSetImage, dbAddReport } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ error: "Invalid upload" }, { status: 400 }); }

  const kind = String(form.get("kind") ?? "");
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  if (kind === "report") {
    if (file.type !== "application/pdf") return NextResponse.json({ error: "Reports must be PDF" }, { status: 400 });
    const title = String(form.get("title") ?? "Annual Report").trim();
    const year = String(form.get("year") ?? new Date().getFullYear()).trim();
    const id = randomBytes(8).toString("hex");
    const url = await uploadFile(`reports/${id}.pdf`, buffer, "application/pdf");
    await dbAddReport({ id, title, year, url, uploadedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, url });
  }

  if (kind === "image") {
    const key = String(form.get("key") ?? "");
    if (!key || !/^[a-z0-9-]+$/.test(key)) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const url = await uploadFile(`sections/${key}-${randomBytes(4).toString("hex")}.${ext}`, buffer, file.type);
    const commit = String(form.get("commit") ?? "true") === "true";
    if (commit) await dbSetImage(key, url);
    return NextResponse.json({ ok: true, url, committed: commit });
  }

  return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
}
