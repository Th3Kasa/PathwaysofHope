// ─── Admin store — Neon PostgreSQL backend ───────────────────────────────────
// getConfig() reads from DB (always current, no CDN caching).
// Each mutation function targets one operation — no load-all / save-all.
// uploadFile() still writes binary files to Vercel Blob.

import { put } from "@vercel/blob";
import { sql } from "@/lib/db";
import { ensureSchema } from "@/lib/admin/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportItem {
  id: string;
  title: string;
  year: string;
  url: string;
  uploadedAt: string;
}

export interface ExtraGoal {
  id: string;
  missionName: string;
  title: string;
  short: string;
  description: string;
  goalAmount: number;
  recurring: boolean;
  image?: string;
  imageAlt?: string;
  addedAt: string;
}

export interface ManualDonation {
  id: string;
  goalId: string;
  amount: number;
  note?: string;
  addedAt: string;
}

export interface NewsletterPost {
  id: string;
  titleEn: string;
  titleAr?: string;
  bodyEn: string;
  bodyAr?: string;
  imageUrl?: string;
  imageAlt?: string;
  author: string;
  publishedAt: string;
}

export interface AdminConfig {
  images: Record<string, string>;
  captions: Record<string, string>;
  reports: ReportItem[];
  disabledGoalIds: string[];
  extraGoals: ExtraGoal[];
  manualDonations: ManualDonation[];
  hiddenGalleryKeys: string[];
  galleryExtraIds: string[];
  newsletterPosts: NewsletterPost[];
}

export function defaultConfig(): AdminConfig {
  return {
    images: {}, captions: {}, reports: [], disabledGoalIds: [], extraGoals: [],
    manualDonations: [], hiddenGalleryKeys: [], galleryExtraIds: [], newsletterPosts: [],
  };
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getConfig(): Promise<AdminConfig> {
  await ensureSchema();

  const [imageRows, configRows, reportRows, goalRows, donationRows, postRows] =
    await Promise.all([
      sql`SELECT key, url, caption FROM site_images`,
      sql`SELECT disabled_goal_ids, hidden_gallery_keys, gallery_extra_ids FROM site_config WHERE id = 1`,
      sql`SELECT id, title, year, url, uploaded_at FROM reports ORDER BY uploaded_at DESC`,
      sql`SELECT id, mission_name, title, short, description, goal_amount, recurring, image, image_alt, added_at FROM extra_goals ORDER BY added_at ASC`,
      sql`SELECT id, goal_id, amount, note, added_at FROM manual_donations ORDER BY added_at ASC`,
      sql`SELECT id, title_en, title_ar, body_en, body_ar, image_url, image_alt, author, published_at FROM newsletter_posts ORDER BY published_at DESC`,
    ]);

  const images: Record<string, string> = {};
  const captions: Record<string, string> = {};
  for (const row of imageRows) {
    if (row.url) images[row.key as string] = row.url as string;
    if (row.caption) captions[row.key as string] = row.caption as string;
  }

  const cfg = configRows[0] ?? { disabled_goal_ids: [], hidden_gallery_keys: [], gallery_extra_ids: [] };
  const toStr = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

  return {
    images,
    captions,
    reports: reportRows.map((r) => ({
      id: r.id as string,
      title: r.title as string,
      year: r.year as string,
      url: r.url as string,
      uploadedAt: toStr(r.uploaded_at),
    })),
    disabledGoalIds: (cfg.disabled_goal_ids as string[]) ?? [],
    extraGoals: goalRows.map((g) => ({
      id: g.id as string,
      missionName: g.mission_name as string,
      title: g.title as string,
      short: g.short as string,
      description: g.description as string,
      goalAmount: Number(g.goal_amount),
      recurring: g.recurring as boolean,
      image: (g.image as string) ?? undefined,
      imageAlt: (g.image_alt as string) ?? undefined,
      addedAt: toStr(g.added_at),
    })),
    manualDonations: donationRows.map((d) => ({
      id: d.id as string,
      goalId: d.goal_id as string,
      amount: Number(d.amount),
      note: (d.note as string) ?? undefined,
      addedAt: toStr(d.added_at),
    })),
    hiddenGalleryKeys: (cfg.hidden_gallery_keys as string[]) ?? [],
    galleryExtraIds: (cfg.gallery_extra_ids as string[]) ?? [],
    newsletterPosts: postRows.map((p) => ({
      id: p.id as string,
      titleEn: p.title_en as string,
      titleAr: (p.title_ar as string) ?? undefined,
      bodyEn: p.body_en as string,
      bodyAr: (p.body_ar as string) ?? undefined,
      imageUrl: (p.image_url as string) ?? undefined,
      imageAlt: (p.image_alt as string) ?? undefined,
      author: p.author as string,
      publishedAt: toStr(p.published_at),
    })),
  };
}

// ─── Image / caption mutations ────────────────────────────────────────────────

export async function dbSetImage(key: string, url: string): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO site_images(key, url) VALUES(${key}, ${url})
    ON CONFLICT(key) DO UPDATE SET url = ${url}
  `;
}

export async function dbSetCaption(key: string, value: string): Promise<void> {
  await ensureSchema();
  if (value.trim()) {
    await sql`
      INSERT INTO site_images(key, caption) VALUES(${key}, ${value.trim()})
      ON CONFLICT(key) DO UPDATE SET caption = ${value.trim()}
    `;
  } else {
    await sql`UPDATE site_images SET caption = NULL WHERE key = ${key}`;
    await sql`DELETE FROM site_images WHERE key = ${key} AND url IS NULL AND caption IS NULL`;
  }
}

export async function dbResetImage(key: string): Promise<void> {
  await ensureSchema();
  await sql`UPDATE site_images SET url = NULL WHERE key = ${key}`;
  await sql`DELETE FROM site_images WHERE key = ${key} AND url IS NULL AND caption IS NULL`;
}

// ─── Report mutations ─────────────────────────────────────────────────────────

export async function dbAddReport(report: ReportItem): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO reports(id, title, year, url, uploaded_at)
    VALUES(${report.id}, ${report.title}, ${report.year}, ${report.url}, ${report.uploadedAt})
  `;
}

export async function dbRemoveReport(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM reports WHERE id = ${id}`;
}

// ─── Goal visibility mutations ────────────────────────────────────────────────

export async function dbToggleGoalVisibility(id: string): Promise<void> {
  await ensureSchema();
  const rows = await sql`SELECT disabled_goal_ids FROM site_config WHERE id = 1`;
  const current: string[] = (rows[0]?.disabled_goal_ids as string[]) ?? [];
  const updated = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  await sql`UPDATE site_config SET disabled_goal_ids = ${updated} WHERE id = 1`;
}

// ─── Extra goal mutations ─────────────────────────────────────────────────────

export async function dbAddExtraGoal(goal: ExtraGoal): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO extra_goals(id, mission_name, title, short, description, goal_amount, recurring, image, image_alt, added_at)
    VALUES(${goal.id}, ${goal.missionName}, ${goal.title}, ${goal.short}, ${goal.description},
           ${goal.goalAmount}, ${goal.recurring}, ${goal.image ?? null}, ${goal.imageAlt ?? null}, ${goal.addedAt})
  `;
}

export async function dbRemoveExtraGoal(id: string): Promise<void> {
  await ensureSchema();
  await Promise.all([
    sql`DELETE FROM extra_goals WHERE id = ${id}`,
    sql`DELETE FROM site_images WHERE key = ${id}`,
    sql`DELETE FROM manual_donations WHERE goal_id = ${id}`,
  ]);
}

// ─── Manual donation mutations ────────────────────────────────────────────────

export async function dbAddManualDonation(donation: ManualDonation): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO manual_donations(id, goal_id, amount, note, added_at)
    VALUES(${donation.id}, ${donation.goalId}, ${donation.amount}, ${donation.note ?? null}, ${donation.addedAt})
  `;
}

export async function dbRemoveManualDonation(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM manual_donations WHERE id = ${id}`;
}

// ─── Gallery mutations ────────────────────────────────────────────────────────

export async function dbToggleGalleryItem(key: string): Promise<void> {
  await ensureSchema();
  const rows = await sql`SELECT hidden_gallery_keys FROM site_config WHERE id = 1`;
  const current: string[] = (rows[0]?.hidden_gallery_keys as string[]) ?? [];
  const updated = current.includes(key)
    ? current.filter((x) => x !== key)
    : [...current, key];
  await sql`UPDATE site_config SET hidden_gallery_keys = ${updated} WHERE id = 1`;
}

export async function dbAddGalleryExtra(id: string): Promise<void> {
  await ensureSchema();
  const rows = await sql`SELECT gallery_extra_ids FROM site_config WHERE id = 1`;
  const current: string[] = (rows[0]?.gallery_extra_ids as string[]) ?? [];
  if (!current.includes(id)) {
    const updated = [...current, id];
    await sql`UPDATE site_config SET gallery_extra_ids = ${updated} WHERE id = 1`;
  }
}

export async function dbRemoveGalleryExtra(id: string): Promise<void> {
  await ensureSchema();
  const rows = await sql`SELECT gallery_extra_ids FROM site_config WHERE id = 1`;
  const current: string[] = (rows[0]?.gallery_extra_ids as string[]) ?? [];
  const updated = current.filter((x) => x !== id);
  await sql`UPDATE site_config SET gallery_extra_ids = ${updated} WHERE id = 1`;
  const key = `kapoeta-gallery-extra-${id}`;
  await sql`DELETE FROM site_images WHERE key = ${key}`;
}

// ─── Newsletter mutations ─────────────────────────────────────────────────────

export async function dbAddNewsletterPost(post: NewsletterPost): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO newsletter_posts(id, title_en, title_ar, body_en, body_ar, image_url, image_alt, author, published_at)
    VALUES(${post.id}, ${post.titleEn}, ${post.titleAr ?? null}, ${post.bodyEn}, ${post.bodyAr ?? null},
           ${post.imageUrl ?? null}, ${post.imageAlt ?? null}, ${post.author}, ${post.publishedAt})
  `;
}

export async function dbUpdateNewsletterPost(
  id: string,
  fields: Partial<Omit<NewsletterPost, "id">>
): Promise<void> {
  await ensureSchema();
  if (fields.titleEn !== undefined)    await sql`UPDATE newsletter_posts SET title_en    = ${fields.titleEn}              WHERE id = ${id}`;
  if (fields.titleAr !== undefined)    await sql`UPDATE newsletter_posts SET title_ar    = ${fields.titleAr ?? null}      WHERE id = ${id}`;
  if (fields.bodyEn !== undefined)     await sql`UPDATE newsletter_posts SET body_en     = ${fields.bodyEn}               WHERE id = ${id}`;
  if (fields.bodyAr !== undefined)     await sql`UPDATE newsletter_posts SET body_ar     = ${fields.bodyAr ?? null}       WHERE id = ${id}`;
  if (fields.imageUrl !== undefined)   await sql`UPDATE newsletter_posts SET image_url   = ${fields.imageUrl ?? null}     WHERE id = ${id}`;
  if (fields.imageAlt !== undefined)   await sql`UPDATE newsletter_posts SET image_alt   = ${fields.imageAlt ?? null}     WHERE id = ${id}`;
  if (fields.author !== undefined)     await sql`UPDATE newsletter_posts SET author      = ${fields.author}               WHERE id = ${id}`;
  if (fields.publishedAt !== undefined) await sql`UPDATE newsletter_posts SET published_at = ${fields.publishedAt}        WHERE id = ${id}`;
}

export async function dbRemoveNewsletterPost(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM newsletter_posts WHERE id = ${id}`;
}

// ─── File upload (still uses Vercel Blob for binary storage) ──────────────────

export async function uploadFile(
  pathname: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob not configured.");
  }
  const blob = await put(pathname, data, { access: "public", contentType, addRandomSuffix: true });
  return blob.url;
}
