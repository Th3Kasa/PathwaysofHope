// ─── Admin config store (Vercel Blob) ──────────────────────────────────────
// All admin-editable content (section photos, annual reports) lives in a
// single JSON blob. The Vercel filesystem is read-only at runtime, so we
// persist in Blob object storage instead.
// Requires a Blob read-write token. Vercel injects BLOB_READ_WRITE_TOKEN when
// a Blob store is connected, but the Marketplace integration sometimes names
// it with a store-specific prefix (e.g. SomeStore_READ_WRITE_TOKEN), so we
// detect the token under any matching name and pass it explicitly to the SDK.

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

/**
 * Find the Vercel Blob read-write token. Prefers the standard name, then falls
 * back to any env var ending in READ_WRITE_TOKEN (Marketplace integrations may
 * prefix it with the store name). Returns undefined if none is configured.
 */
export function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    console.log("[blob] found token via BLOB_READ_WRITE_TOKEN");
    return process.env.BLOB_READ_WRITE_TOKEN;
  }
  // Marketplace integrations may prefix the token with the store name,
  // e.g. pathwaysofhope-blob_READ_WRITE_TOKEN. Match by name only — no
  // value-prefix check, since token formats differ across Vercel products.
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /READ_WRITE_TOKEN$/i.test(name)) {
      console.log(`[blob] found token via ${name}`);
      return value;
    }
  }
  // Last resort: any var whose name mentions BLOB and TOKEN.
  for (const [name, value] of Object.entries(process.env)) {
    if (value && /BLOB/i.test(name) && /TOKEN/i.test(name)) {
      console.log(`[blob] found token via ${name} (fallback)`);
      return value;
    }
  }
  // Log all env var names to help diagnose missing token.
  const blobish = Object.keys(process.env).filter(
    (k) => /blob|token|storage/i.test(k)
  );
  console.log("[blob] no token found. Blob-related env vars:", blobish.length ? blobish.join(", ") : "(none)");
  return undefined;
}

export function blobReady(): boolean {
  return Boolean(getBlobToken());
}

export async function getConfig(): Promise<AdminConfig> {
  try {
    const token = getBlobToken();
    if (!token) return defaultConfig();
    const { blobs } = await list({ prefix: CONFIG_PATH, limit: 1, token });
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
  const token = getBlobToken();
  if (!token) {
    throw new Error("Vercel Blob not configured. Enable it in your Vercel dashboard.");
  }
  await put(CONFIG_PATH, JSON.stringify(config, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}

export async function uploadFile(
  pathname: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("Vercel Blob not configured. Enable it in your Vercel dashboard.");
  }
  const blob = await put(pathname, data, {
    access: "public",
    contentType,
    addRandomSuffix: true,
    token,
  });
  return blob.url;
}
