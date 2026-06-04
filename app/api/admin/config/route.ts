import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getConfig, saveConfig } from "@/lib/admin/store";
import { KAPOETA_GOALS } from "@/lib/goals";
import { ALL_SITE_SECTIONS } from "@/lib/admin/sections";

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

  const sections = ALL_SITE_SECTIONS.map((s) => ({
    key: s.key,
    label: s.label,
    page: s.page,
    defaultImage: s.defaultImage,
    aiPrompt: s.aiPrompt,
  }));

  return NextResponse.json({
    images: config.images,
    titles: config.titles,
    reports: config.reports,
    goals,
    sections,
    blobReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { removeReportId?: string; resetImageKey?: string; setTitle?: { key: string; value: string }; resetTitleKey?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const config = await getConfig();

  if (body.removeReportId) {
    config.reports = config.reports.filter((r) => r.id !== body.removeReportId);
  }
  if (body.resetImageKey) {
    delete config.images[body.resetImageKey];
  }
  if (body.setTitle) {
    config.titles[body.setTitle.key] = String(body.setTitle.value ?? "").trim();
    if (!config.titles[body.setTitle.key]) delete config.titles[body.setTitle.key];
  }
  if (body.resetTitleKey) {
    delete config.titles[body.resetTitleKey];
  }

  await saveConfig(config);
  return NextResponse.json({ ok: true });
}
