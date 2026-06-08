// ─── Admin config store (Vercel Blob) ──────────────────────────────────────
// All admin-editable content (section photos, annual reports) lives in a
// single JSON blob. The Vercel filesystem is read-only at runtime, so we
// persist in Blob object storage instead.
// Requires BLOB_READ_WRITE_TOKEN (auto-injected once Vercel Blob is enabled).

import { put, list } from "@vercel/blob";

const CONFIG_PATH = "admin/config.json";

export interface ReportItem {
  id: string;
  title: string;
  year: string;
  url: string;
  uploadedAt: string;
}

export interface ExtraGoal {
  id: string;          // e.g. "extra-a1b2c3d4"
  missionName: string; // e.g. "Kapoeta", "Uganda Mission"
  title: string;
  short: string;
  description: string;
  goalAmount: number;  // AUD, 0 = open-ended
  recurring: boolean;
  image?: string;      // blob URL if uploaded
  imageAlt?: string;
  addedAt: string;     // ISO date
}

/**
 * A manually-recorded offline gift (bank transfer / direct debit) entered by
 * an admin. Each entry adds its amount to the goal's raised total and counts
 * as one supporter on the live progress bars.
 */
export interface ManualDonation {
  id: string;
  goalId: string;
  amount: number;   // AUD
  note?: string;
  addedAt: string;  // ISO date
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
  publishedAt: string; // ISO date
}

export interface AdminConfig {
  /** Per-section image URL overrides, keyed by goal ID or page section key. */
  images: Record<string, string>;
  /** Per-section caption/alt text, keyed by goal ID. */
  captions: Record<string, string>;
  /** Annual reports listed on the public /reports page. */
  reports: ReportItem[];
  disabledGoalIds: string[];
  extraGoals: ExtraGoal[];
  /** Manually-recorded offline donations (bank transfer / direct debit). */
  manualDonations: ManualDonation[];
  /** Built-in Kapoeta gallery image keys the admin has hidden from the site. */
  hiddenGalleryKeys: string[];
  /** IDs of extra photos the admin added to the Kapoeta gallery. */
  galleryExtraIds: string[];
  /** Newsletter / project update posts shown on /newsletter. */
  newsletterPosts: NewsletterPost[];
}

export function defaultConfig(): AdminConfig {
  return {
    images: {}, captions: {}, reports: [], disabledGoalIds: [], extraGoals: [],
    manualDonations: [], hiddenGalleryKeys: [], galleryExtraIds: [], newsletterPosts: [],
  };
}

export async function getConfig(): Promise<AdminConfig> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return defaultConfig();
    const { blobs } = await list({ prefix: CONFIG_PATH, limit: 1 });
    if (blobs.length === 0) return defaultConfig();
    // Append timestamp to bust Vercel Blob CDN cache — without this, overwrites
    // to the same path are served stale for several requests.
    const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return defaultConfig();
    const parsed = (await res.json()) as Partial<AdminConfig>;
    return sanitizeConfig(parsed);
  } catch {
    return defaultConfig();
  }
}

/**
 * Build a clean AdminConfig from stored JSON. Whitelists known fields (so stray
 * fields from older builds — e.g. a `titles` map — are dropped) and removes
 * orphaned image/caption keys left by a previous version of the admin
 * (`kapoeta-container-*`, `kapoeta-chapter1`). The next saveConfig persists the
 * cleaned result, so the config self-heals on the first admin action.
 */
function sanitizeConfig(parsed: Partial<AdminConfig>): AdminConfig {
  const base = defaultConfig();
  const isOrphanKey = (k: string) => k.startsWith("kapoeta-container-") || k.startsWith("kapoeta-chapter1");
  const clean = (rec?: Record<string, string>): Record<string, string> => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(rec ?? {})) if (!isOrphanKey(k)) out[k] = v;
    return out;
  };
  return {
    images: clean(parsed.images),
    captions: clean(parsed.captions),
    reports: parsed.reports ?? base.reports,
    disabledGoalIds: parsed.disabledGoalIds ?? base.disabledGoalIds,
    extraGoals: parsed.extraGoals ?? base.extraGoals,
    manualDonations: parsed.manualDonations ?? base.manualDonations,
    hiddenGalleryKeys: parsed.hiddenGalleryKeys ?? base.hiddenGalleryKeys,
    galleryExtraIds: parsed.galleryExtraIds ?? base.galleryExtraIds,
    newsletterPosts: parsed.newsletterPosts ?? base.newsletterPosts,
  };
}

export async function saveConfig(config: AdminConfig): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob not configured. Enable it in your Vercel dashboard.");
  }
  await put(CONFIG_PATH, JSON.stringify(config, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    // Never CDN-cache the config blob — admin edits must read back immediately.
    // Without this, Blob defaults to a 1-year immutable cache and serves stale
    // config (uploaded photos / edits appear to "not save").
    cacheControlMaxAge: 0,
  });
}

export async function uploadFile(
  pathname: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob not configured. Enable it in your Vercel dashboard.");
  }
  const blob = await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}
