// Run once to copy existing Vercel Blob config into Neon.
// Usage: npx tsx scripts/migrate-blob-to-neon.ts
// Safe to run multiple times — uses ON CONFLICT DO NOTHING.

import { list } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const CONFIG_PATH = "admin/config.json";

interface BlobConfig {
  images?: Record<string, string>;
  captions?: Record<string, string>;
  reports?: Array<{ id: string; title: string; year: string; url: string; uploadedAt: string }>;
  disabledGoalIds?: string[];
  extraGoals?: Array<{
    id: string; missionName: string; title: string; short: string; description: string;
    goalAmount: number; recurring: boolean; image?: string; imageAlt?: string; addedAt: string;
  }>;
  manualDonations?: Array<{ id: string; goalId: string; amount: number; note?: string; addedAt: string }>;
  hiddenGalleryKeys?: string[];
  galleryExtraIds?: string[];
  newsletterPosts?: Array<{
    id: string; titleEn: string; titleAr?: string; bodyEn: string; bodyAr?: string;
    imageUrl?: string; imageAlt?: string; author: string; publishedAt: string;
  }>;
}

async function readBlob(): Promise<BlobConfig> {
  const { blobs } = await list({ prefix: CONFIG_PATH, limit: 1 });
  if (blobs.length === 0) { console.log("No Blob config found — nothing to migrate."); return {}; }
  const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);
  return res.json();
}

async function run() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set — run: npx vercel env pull .env.local --environment=production");
  const sql = neon(process.env.DATABASE_URL);

  console.log("Reading from Vercel Blob...");
  const cfg = await readBlob();

  console.log("Ensuring schema...");
  await sql`CREATE TABLE IF NOT EXISTS site_images (key TEXT PRIMARY KEY, url TEXT, caption TEXT)`;
  await sql`CREATE TABLE IF NOT EXISTS site_config (id INT PRIMARY KEY DEFAULT 1, disabled_goal_ids TEXT[] NOT NULL DEFAULT '{}', hidden_gallery_keys TEXT[] NOT NULL DEFAULT '{}', gallery_extra_ids TEXT[] NOT NULL DEFAULT '{}')`;
  await sql`INSERT INTO site_config(id) VALUES(1) ON CONFLICT DO NOTHING`;
  await sql`CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, title TEXT NOT NULL, year TEXT NOT NULL, url TEXT NOT NULL, uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS extra_goals (id TEXT PRIMARY KEY, mission_name TEXT NOT NULL, title TEXT NOT NULL, short TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', goal_amount NUMERIC NOT NULL DEFAULT 0, recurring BOOLEAN NOT NULL DEFAULT false, image TEXT, image_alt TEXT, added_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS manual_donations (id TEXT PRIMARY KEY, goal_id TEXT NOT NULL, amount NUMERIC NOT NULL, note TEXT, added_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS newsletter_posts (id TEXT PRIMARY KEY, title_en TEXT NOT NULL, title_ar TEXT, body_en TEXT NOT NULL, body_ar TEXT, image_url TEXT, image_alt TEXT, author TEXT NOT NULL, published_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;

  // Images + captions
  const imageKeys = new Set([...Object.keys(cfg.images ?? {}), ...Object.keys(cfg.captions ?? {})]);
  for (const key of imageKeys) {
    const url = cfg.images?.[key] ?? null;
    const caption = cfg.captions?.[key] ?? null;
    await sql`INSERT INTO site_images(key, url, caption) VALUES(${key}, ${url}, ${caption}) ON CONFLICT(key) DO NOTHING`;
  }
  console.log(`  site_images: ${imageKeys.size} rows`);

  // Config flags
  await sql`
    UPDATE site_config SET
      disabled_goal_ids   = ${cfg.disabledGoalIds ?? []},
      hidden_gallery_keys = ${cfg.hiddenGalleryKeys ?? []},
      gallery_extra_ids   = ${cfg.galleryExtraIds ?? []}
    WHERE id = 1
  `;
  console.log(`  site_config: updated flags`);

  // Reports
  for (const r of cfg.reports ?? []) {
    await sql`INSERT INTO reports(id, title, year, url, uploaded_at) VALUES(${r.id}, ${r.title}, ${r.year}, ${r.url}, ${r.uploadedAt}) ON CONFLICT DO NOTHING`;
  }
  console.log(`  reports: ${(cfg.reports ?? []).length} rows`);

  // Extra goals
  for (const g of cfg.extraGoals ?? []) {
    await sql`INSERT INTO extra_goals(id, mission_name, title, short, description, goal_amount, recurring, image, image_alt, added_at) VALUES(${g.id}, ${g.missionName}, ${g.title}, ${g.short}, ${g.description}, ${g.goalAmount}, ${g.recurring}, ${g.image ?? null}, ${g.imageAlt ?? null}, ${g.addedAt}) ON CONFLICT DO NOTHING`;
  }
  console.log(`  extra_goals: ${(cfg.extraGoals ?? []).length} rows`);

  // Manual donations
  for (const d of cfg.manualDonations ?? []) {
    await sql`INSERT INTO manual_donations(id, goal_id, amount, note, added_at) VALUES(${d.id}, ${d.goalId}, ${d.amount}, ${d.note ?? null}, ${d.addedAt}) ON CONFLICT DO NOTHING`;
  }
  console.log(`  manual_donations: ${(cfg.manualDonations ?? []).length} rows`);

  // Newsletter posts
  for (const p of cfg.newsletterPosts ?? []) {
    await sql`INSERT INTO newsletter_posts(id, title_en, title_ar, body_en, body_ar, image_url, image_alt, author, published_at) VALUES(${p.id}, ${p.titleEn}, ${p.titleAr ?? null}, ${p.bodyEn}, ${p.bodyAr ?? null}, ${p.imageUrl ?? null}, ${p.imageAlt ?? null}, ${p.author}, ${p.publishedAt}) ON CONFLICT DO NOTHING`;
  }
  console.log(`  newsletter_posts: ${(cfg.newsletterPosts ?? []).length} rows`);

  console.log("Migration complete.");
}

run().catch((e) => { console.error(e); process.exit(1); });
