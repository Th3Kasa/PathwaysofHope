import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getConfig, saveConfig, type ExtraGoal, type ManualDonation } from "@/lib/admin/store";
import { randomBytes } from "node:crypto";
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
    captions: config.captions,
    reports: config.reports,
    goals,
    blobReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    disabledGoalIds: config.disabledGoalIds ?? [],
    extraGoals: config.extraGoals ?? [],
    manualDonations: config.manualDonations ?? [],
    hiddenGalleryKeys: config.hiddenGalleryKeys ?? [],
    galleryExtraIds: config.galleryExtraIds ?? [],
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    removeReportId?: string;
    resetImageKey?: string;
    saveCaption?: { key: string; value: string };
    setImage?: { key: string; url: string };
    toggleGoalVisibility?: { id: string };
    addExtraGoal?: ExtraGoal;
    removeExtraGoal?: { id: string };
    addManualDonation?: { goalId: string; amount: number; note?: string };
    removeManualDonation?: { id: string };
    toggleGalleryItem?: { key: string };
    addGalleryExtra?: { id: string };
    removeGalleryExtra?: { id: string };
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const config = await getConfig();
  if (!config.manualDonations) config.manualDonations = [];
  if (!config.hiddenGalleryKeys) config.hiddenGalleryKeys = [];
  if (!config.galleryExtraIds) config.galleryExtraIds = [];

  if (body.removeReportId) {
    config.reports = config.reports.filter((r) => r.id !== body.removeReportId);
  }
  if (body.resetImageKey) {
    delete config.images[body.resetImageKey];
  }
  if (body.saveCaption) {
    const { key, value } = body.saveCaption;
    if (value.trim()) { config.captions[key] = value.trim(); }
    else { delete config.captions[key]; }
  }
  if (body.setImage) {
    const { key, url } = body.setImage;
    if (key && /^[a-z0-9-]+$/.test(key) && typeof url === "string" && url.startsWith("https://")) {
      config.images[key] = url;
    } else {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
  }
  if (body.toggleGoalVisibility) {
    const { id } = body.toggleGoalVisibility;
    const disabled = config.disabledGoalIds ?? [];
    if (disabled.includes(id)) {
      config.disabledGoalIds = disabled.filter((d) => d !== id);
    } else {
      config.disabledGoalIds = [...disabled, id];
    }
  }
  if (body.addExtraGoal) {
    config.extraGoals = [...(config.extraGoals ?? []), body.addExtraGoal];
  }
  if (body.removeExtraGoal) {
    const { id } = body.removeExtraGoal;
    config.extraGoals = (config.extraGoals ?? []).filter((g) => g.id !== id);
    delete config.images[id];
    delete config.captions[id];
    // Drop any manual donations tied to a deleted goal.
    config.manualDonations = config.manualDonations.filter((d) => d.goalId !== id);
  }
  if (body.addManualDonation) {
    const { goalId, amount, note } = body.addManualDonation;
    if (!goalId || typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
    }
    const entry: ManualDonation = {
      id: randomBytes(6).toString("hex"),
      goalId,
      amount: Math.round(amount * 100) / 100,
      note: note?.trim() || undefined,
      addedAt: new Date().toISOString(),
    };
    config.manualDonations = [...config.manualDonations, entry];
  }
  if (body.removeManualDonation) {
    const { id } = body.removeManualDonation;
    config.manualDonations = config.manualDonations.filter((d) => d.id !== id);
  }
  if (body.toggleGalleryItem) {
    const { key } = body.toggleGalleryItem;
    if (config.hiddenGalleryKeys.includes(key)) {
      config.hiddenGalleryKeys = config.hiddenGalleryKeys.filter((k) => k !== key);
    } else {
      config.hiddenGalleryKeys = [...config.hiddenGalleryKeys, key];
    }
  }
  if (body.addGalleryExtra) {
    const { id } = body.addGalleryExtra;
    if (id && /^[a-z0-9]+$/.test(id) && !config.galleryExtraIds.includes(id)) {
      config.galleryExtraIds = [...config.galleryExtraIds, id];
    }
  }
  if (body.removeGalleryExtra) {
    const { id } = body.removeGalleryExtra;
    config.galleryExtraIds = config.galleryExtraIds.filter((x) => x !== id);
    delete config.images[`kapoeta-gallery-extra-${id}`];
    delete config.captions[`kapoeta-gallery-extra-${id}`];
  }

  await saveConfig(config);
  return NextResponse.json({ ok: true });
}
