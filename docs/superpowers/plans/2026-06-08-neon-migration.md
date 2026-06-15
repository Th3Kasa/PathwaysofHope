# Neon PostgreSQL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Vercel Blob JSON config storage with Neon PostgreSQL so every admin write is instantly visible on the next read — no CDN caching, no repeated save/refresh cycle.

**Architecture:** Six PostgreSQL tables replace the single JSON blob. `getConfig()` assembles `AdminConfig` from parallel DB queries. Every PATCH operation calls a targeted `INSERT`/`UPDATE`/`DELETE` instead of the current load-entire-blob → mutate → save pattern. Images and PDFs stay in Vercel Blob (binary files); only their URLs move to the DB.

**Tech Stack:** `@neondatabase/serverless` (HTTP transport, no WebSockets), Neon PostgreSQL, Next.js 16 API routes (Node.js runtime)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `lib/db.ts` | **Create** | Neon SQL client singleton |
| `lib/admin/schema.ts` | **Create** | `ensureSchema()` — idempotent `CREATE TABLE IF NOT EXISTS` for all 6 tables |
| `lib/admin/store.ts` | **Rewrite** | Keep all types + `uploadFile()`; replace Blob logic with DB queries; add `db*` mutation functions |
| `app/api/admin/config/route.ts` | **Update** | Each PATCH branch calls a targeted `db*` function; remove `saveConfig()` |
| `app/api/admin/upload/route.ts` | **Update** | Replace `getConfig()`+`saveConfig()` with `dbAddReport()` / `dbSetImage()` |
| `app/api/admin/generate-image/route.ts` | **Update** | Replace `getConfig()`+`saveConfig()` with `dbSetImage()` |
| `scripts/migrate-blob-to-neon.ts` | **Create** | One-time script: reads Blob JSON → inserts into Neon |

---

## Task 1: Install package and create DB client

**Files:**
- Modify: `package.json` (via npm install)
- Create: `lib/db.ts`

- [ ] **Step 1: Install `@neondatabase/serverless`**

```bash
cd pathways-of-hope
npm install @neondatabase/serverless
```

Expected output: `added 1 package` (or similar), no errors.

- [ ] **Step 2: Create `lib/db.ts`**

```typescript
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);
```

- [ ] **Step 3: Add `DATABASE_URL` to `.env.local`**

Go to your Neon dashboard → your project → Connection Details → copy the **pooled connection string** (starts with `postgres://...`).

Add to `pathways-of-hope/.env.local`:
```
DATABASE_URL=postgres://your-neon-connection-string-here
```

- [ ] **Step 4: Verify TypeScript accepts the import**

```bash
cd pathways-of-hope
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors on `lib/db.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/db.ts package.json package-lock.json
git commit -m "Add Neon DB client (lib/db.ts)"
```

---

## Task 2: Create schema module

**Files:**
- Create: `lib/admin/schema.ts`

- [ ] **Step 1: Create `lib/admin/schema.ts`**

```typescript
import { sql } from "@/lib/db";

let initialized = false;

export async function ensureSchema(): Promise<void> {
  if (initialized) return;

  // site_images: image URL overrides + captions. Both nullable so either
  // can exist independently (caption without override, or override without caption).
  await sql`
    CREATE TABLE IF NOT EXISTS site_images (
      key     TEXT PRIMARY KEY,
      url     TEXT,
      caption TEXT
    )
  `;

  // site_config: single-row table for simple array flags.
  await sql`
    CREATE TABLE IF NOT EXISTS site_config (
      id                  INT  PRIMARY KEY DEFAULT 1,
      disabled_goal_ids   TEXT[] NOT NULL DEFAULT '{}',
      hidden_gallery_keys TEXT[] NOT NULL DEFAULT '{}',
      gallery_extra_ids   TEXT[] NOT NULL DEFAULT '{}'
    )
  `;
  await sql`INSERT INTO site_config(id) VALUES(1) ON CONFLICT DO NOTHING`;

  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      year        TEXT NOT NULL,
      url         TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS extra_goals (
      id           TEXT    PRIMARY KEY,
      mission_name TEXT    NOT NULL,
      title        TEXT    NOT NULL,
      short        TEXT    NOT NULL,
      description  TEXT    NOT NULL DEFAULT '',
      goal_amount  NUMERIC NOT NULL DEFAULT 0,
      recurring    BOOLEAN NOT NULL DEFAULT false,
      image        TEXT,
      image_alt    TEXT,
      added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS manual_donations (
      id       TEXT    PRIMARY KEY,
      goal_id  TEXT    NOT NULL,
      amount   NUMERIC NOT NULL,
      note     TEXT,
      added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_posts (
      id           TEXT PRIMARY KEY,
      title_en     TEXT NOT NULL,
      title_ar     TEXT,
      body_en      TEXT NOT NULL,
      body_ar      TEXT,
      image_url    TEXT,
      image_alt    TEXT,
      author       TEXT NOT NULL,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  initialized = true;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd pathways-of-hope
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/admin/schema.ts
git commit -m "Add schema initialisation module (lib/admin/schema.ts)"
```

---

## Task 3: Rewrite `lib/admin/store.ts`

**Files:**
- Rewrite: `lib/admin/store.ts`

Keep: all TypeScript interfaces (`ReportItem`, `ExtraGoal`, `ManualDonation`, `NewsletterPost`, `AdminConfig`), `defaultConfig()`, `uploadFile()`.
Remove: all Vercel Blob imports, `getConfig()` Blob logic, `saveConfig()`.
Add: DB-backed `getConfig()`, all `db*` mutation functions.

- [ ] **Step 1: Replace `lib/admin/store.ts` entirely**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd pathways-of-hope
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors on `lib/admin/store.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/admin/store.ts lib/admin/schema.ts
git commit -m "Rewrite store.ts: Neon DB backend, targeted mutation functions"
```

---

## Task 4: Update config API route

**Files:**
- Rewrite: `app/api/admin/config/route.ts`

- [ ] **Step 1: Replace `app/api/admin/config/route.ts`**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd pathways-of-hope
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/config/route.ts
git commit -m "Config API: replace load/mutate/save with targeted DB calls"
```

---

## Task 5: Update upload and generate-image routes

**Files:**
- Modify: `app/api/admin/upload/route.ts`
- Modify: `app/api/admin/generate-image/route.ts`

- [ ] **Step 1: Replace `app/api/admin/upload/route.ts`**

```typescript
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
```

- [ ] **Step 2: Replace `app/api/admin/generate-image/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { uploadFile, dbSetImage } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const MODEL = "flux-2-pro";

async function pollResult(requestId: string, apiKey: string): Promise<string> {
  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`${MUAPI_BASE}/predictions/${requestId}/result`, {
      headers: { "x-api-key": apiKey },
    });
    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();
    if (data.status === "succeeded" && data.output) {
      const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      return String(outputUrl);
    }
    if (data.status === "failed") throw new Error("Image generation failed");
  }
  throw new Error("Timed out waiting for image");
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.MUAPI_API_KEY_POH;
  if (!apiKey) return NextResponse.json({ error: "MUAPI not configured" }, { status: 503 });

  let goalId: string, prompt: string, commit: boolean;
  try {
    const body = await req.json();
    goalId = String(body.goalId ?? "");
    prompt = String(body.prompt ?? "");
    commit = body.commit !== false;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!goalId || !prompt) return NextResponse.json({ error: "Invalid goal or prompt" }, { status: 400 });

  const submitRes = await fetch(`${MUAPI_BASE}/${MODEL}`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio: "16:9", num_images: 1 }),
  });
  if (!submitRes.ok) {
    const err = await submitRes.text();
    return NextResponse.json({ error: `MUAPI submit failed: ${err}` }, { status: 502 });
  }
  const { request_id } = await submitRes.json();
  if (!request_id) return NextResponse.json({ error: "No request_id from MUAPI" }, { status: 502 });

  const imageUrl = await pollResult(String(request_id), apiKey);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Failed to download generated image");
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";

  const blobUrl = await uploadFile(`sections/${goalId}-ai.jpg`, imgBuffer, contentType);
  if (commit) await dbSetImage(goalId, blobUrl);

  return NextResponse.json({ ok: true, url: blobUrl, committed: commit });
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
cd pathways-of-hope
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/upload/route.ts app/api/admin/generate-image/route.ts
git commit -m "Upload + generate-image routes: use targeted dbSetImage / dbAddReport"
```

---

## Task 6: Create one-time Blob → Neon migration script

**Files:**
- Create: `scripts/migrate-blob-to-neon.ts`

- [ ] **Step 1: Create `scripts/migrate-blob-to-neon.ts`**

```typescript
// Run once to copy existing Vercel Blob config into Neon.
// Usage: npx tsx scripts/migrate-blob-to-neon.ts
// Safe to run multiple times — uses ON CONFLICT DO NOTHING.

import { config } from "dotenv";
config({ path: ".env.local" });

import { list } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
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
```

- [ ] **Step 2: Install `tsx` for running the script (if not already present)**

```bash
cd pathways-of-hope
npm install --save-dev tsx
```

- [ ] **Step 3: Commit**

```bash
git add scripts/migrate-blob-to-neon.ts package.json package-lock.json
git commit -m "Add Blob→Neon one-time migration script"
```

---

## Task 7: Add DATABASE_URL to Vercel and deploy

- [ ] **Step 1: Add `DATABASE_URL` to Vercel environment variables**

In Vercel dashboard → Project → Settings → Environment Variables → Add:
- Key: `DATABASE_URL`
- Value: your Neon **pooled** connection string
- Environments: Production, Preview, Development

- [ ] **Step 2: Push to trigger deployment**

```bash
cd pathways-of-hope
git push origin HEAD:main
```

Wait for the Vercel build to complete. Check build logs — expect green.

- [ ] **Step 3: Run the migration script locally**

This copies all existing Blob data into Neon. Run once:

```bash
cd pathways-of-hope
npx tsx scripts/migrate-blob-to-neon.ts
```

Expected output:
```
Reading from Vercel Blob...
Ensuring schema...
  site_images: N rows
  site_config: updated flags
  reports: N rows
  extra_goals: N rows
  manual_donations: N rows
  newsletter_posts: N rows
Migration complete.
```

- [ ] **Step 4: Smoke test the admin panel**

1. Open `https://pathwaysofhope.org.au/admin` (or preview URL)
2. Sign in
3. Verify all existing goals, photos, donations, reports are visible
4. Make a small change (e.g. toggle a goal's visibility)
5. Refresh the page immediately — change should be visible without repeated saves
6. Toggle it back

- [ ] **Step 5: Verify instant updates**

1. In the admin panel, record a manual donation on any goal
2. Open the public donations page in another tab
3. Reload — the new total should appear immediately

---

## Self-Review Checklist

- [x] **Spec coverage:** All 6 tables created ✓ | `getConfig()` assembles from DB ✓ | All 15 PATCH operations use targeted DB functions ✓ | Upload route updated ✓ | Generate-image route updated ✓ | Migration script created ✓ | `DATABASE_URL` env var documented ✓
- [x] **No placeholders:** All steps have complete code
- [x] **Type consistency:** `dbSetImage`, `dbSetCaption`, `dbResetImage` etc. match usage in config route ✓ | `ReportItem`, `ExtraGoal`, `ManualDonation`, `NewsletterPost` interfaces unchanged ✓
- [x] **`saveConfig()` fully removed:** Not called anywhere after Task 4 and 5
- [x] **`ensureSchema()` idempotent:** All tables use `CREATE TABLE IF NOT EXISTS` + `INSERT ... ON CONFLICT DO NOTHING`
