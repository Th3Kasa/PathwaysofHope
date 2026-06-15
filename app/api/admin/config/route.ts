import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import {
  getConfig,
  type ExtraGoal, type ManualDonation, type NewsletterPost,
  dbSetImage, dbSetCaption, dbResetImage,
  dbAddReport, dbRemoveReport,
  dbToggleGoalVisibility,
  dbAddExtraGoal, dbRemoveExtraGoal,
  dbAddManualDonation, dbRemoveManualDonation,
  dbToggleGalleryItem, dbAddGalleryExtra, dbRemoveGalleryExtra,
  dbAddNewsletterPost, dbUpdateNewsletterPost, dbRemoveNewsletterPost,
} from "@/lib/admin/store";
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
    disabledGoalIds: config.disabledGoalIds,
    extraGoals: config.extraGoals,
    manualDonations: config.manualDonations,
    hiddenGalleryKeys: config.hiddenGalleryKeys,
    galleryExtraIds: config.galleryExtraIds,
    newsletterPosts: config.newsletterPosts,
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
    addNewsletterPost?: Omit<NewsletterPost, "id">;
    updateNewsletterPost?: { id: string } & Partial<Omit<NewsletterPost, "id">>;
    removeNewsletterPost?: { id: string };
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  if (body.removeReportId) {
    await dbRemoveReport(body.removeReportId);
  }
  if (body.resetImageKey) {
    await dbResetImage(body.resetImageKey);
  }
  if (body.saveCaption) {
    const { key, value } = body.saveCaption;
    await dbSetCaption(key, value);
  }
  if (body.setImage) {
    const { key, url } = body.setImage;
    if (!key || !/^[a-z0-9-]+$/.test(key) || typeof url !== "string" || !url.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    await dbSetImage(key, url);
  }
  if (body.toggleGoalVisibility) {
    await dbToggleGoalVisibility(body.toggleGoalVisibility.id);
  }
  if (body.addExtraGoal) {
    await dbAddExtraGoal(body.addExtraGoal);
  }
  if (body.removeExtraGoal) {
    await dbRemoveExtraGoal(body.removeExtraGoal.id);
  }
  if (body.addManualDonation) {
    const { goalId, amount, note } = body.addManualDonation;
    if (!goalId || typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
    }
    await dbAddManualDonation({
      id: randomBytes(6).toString("hex"),
      goalId,
      amount: Math.round(amount * 100) / 100,
      note: note?.trim() || undefined,
      addedAt: new Date().toISOString(),
    });
  }
  if (body.removeManualDonation) {
    await dbRemoveManualDonation(body.removeManualDonation.id);
  }
  if (body.toggleGalleryItem) {
    await dbToggleGalleryItem(body.toggleGalleryItem.key);
  }
  if (body.addGalleryExtra) {
    const { id } = body.addGalleryExtra;
    if (id && /^[a-z0-9]+$/.test(id)) await dbAddGalleryExtra(id);
  }
  if (body.removeGalleryExtra) {
    await dbRemoveGalleryExtra(body.removeGalleryExtra.id);
  }
  if (body.addNewsletterPost) {
    await dbAddNewsletterPost({
      id: randomBytes(6).toString("hex"),
      ...body.addNewsletterPost,
    });
  }
  if (body.updateNewsletterPost) {
    const { id, ...fields } = body.updateNewsletterPost;
    await dbUpdateNewsletterPost(id, fields);
  }
  if (body.removeNewsletterPost) {
    await dbRemoveNewsletterPost(body.removeNewsletterPost.id);
  }

  return NextResponse.json({ ok: true });
}
