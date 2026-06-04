import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getConfig, saveConfig } from "@/lib/admin/store";
import { KAPOETA_GOALS } from "@/lib/goals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await getConfig();
  const goals = KAPOETA_GOALS.map((g) => ({
    id: g.id,
    title: g.title,
    defaultImage: g.image,
  }));

  return NextResponse.json({
    images: config.images,
    reports: config.reports,
    goals,
    blobReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { removeReportId?: string; resetImageKey?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const config = await getConfig();

  if (body.removeReportId) {
    config.reports = config.reports.filter((r) => r.id !== body.removeReportId);
  }
  if (body.resetImageKey) {
    delete config.images[body.resetImageKey];
  }

  await saveConfig(config);
  return NextResponse.json({ ok: true });
}
