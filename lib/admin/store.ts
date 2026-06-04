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

export interface AdminConfig {
  /** Per-section image URL overrides, keyed by goal ID or page section key. */
  images: Record<string, string>;
  /** Per-section caption/alt text overrides, keyed by section key. */
  titles: Record<string, string>;
  /** Annual reports listed on the public /reports page. */
  reports: ReportItem[];
}

export function defaultConfig(): AdminConfig {
  return { images: {}, titles: {}, reports: [] };
}

export async function getConfig(): Promise<AdminConfig> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return defaultConfig();
    const { blobs } = await list({ prefix: CONFIG_PATH, limit: 1 });
    if (blobs.length === 0) return defaultConfig();
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return defaultConfig();
    const parsed = (await res.json()) as Partial<AdminConfig>;
    return { ...defaultConfig(), ...parsed, titles: { ...{}, ...(parsed.titles ?? {}) } };
  } catch {
    return defaultConfig();
  }
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
