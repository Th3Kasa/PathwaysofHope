# Neon PostgreSQL Migration — Design Spec
**Date:** 2026-06-08  
**Author:** Alfred  
**Status:** Approved for implementation

---

## Problem

Vercel Blob stores all admin config as a single JSON file. Even with `cacheControlMaxAge: 0`, Blob routes reads through a CDN edge layer that can serve stale data for several seconds after a write. Admins must repeatedly save, refresh, and verify before trusting that an update has taken effect.

## Goal

Replace Vercel Blob config storage with Neon PostgreSQL. Every read goes directly to the database — no CDN, no caching, instant consistency. Images and PDFs remain in Vercel Blob (binary files); only their URLs are stored in the DB.

---

## Architecture

### Connection

- Package: `@neondatabase/serverless`
- Transport: HTTP (works in Vercel serverless without WebSockets)
- Config: single `DATABASE_URL` env var added to Vercel project
- Client module: `lib/db.ts` — exports a configured `neon` SQL client

### Schema (6 tables)

```sql
-- Image URL overrides and captions, keyed by section key
CREATE TABLE IF NOT EXISTS site_images (
  key       TEXT PRIMARY KEY,
  url       TEXT NOT NULL,
  caption   TEXT
);

-- Simple array flags (single row, id always = 1)
CREATE TABLE IF NOT EXISTS site_config (
  id                  INT  PRIMARY KEY DEFAULT 1,
  disabled_goal_ids   TEXT[] NOT NULL DEFAULT '{}',
  hidden_gallery_keys TEXT[] NOT NULL DEFAULT '{}',
  gallery_extra_ids   TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS reports (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  year        TEXT NOT NULL,
  url         TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS extra_goals (
  id           TEXT PRIMARY KEY,
  mission_name TEXT    NOT NULL,
  title        TEXT    NOT NULL,
  short        TEXT    NOT NULL,
  description  TEXT    NOT NULL DEFAULT '',
  goal_amount  NUMERIC NOT NULL DEFAULT 0,
  recurring    BOOLEAN NOT NULL DEFAULT false,
  image        TEXT,
  image_alt    TEXT,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manual_donations (
  id       TEXT PRIMARY KEY,
  goal_id  TEXT    NOT NULL,
  amount   NUMERIC NOT NULL,
  note     TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
);
```

---

## Code Changes

### `lib/db.ts` (new)
Exports a configured `neon` SQL tagged-template client. Used by all DB query functions.

### `lib/admin/store.ts` (rewritten)
- Removes all Vercel Blob imports and JSON read/write logic
- Keeps the `AdminConfig` TypeScript interface unchanged (so no component changes needed)
- `getConfig()` assembles `AdminConfig` from parallel DB queries across all 6 tables
- `saveConfig()` removed — replaced by targeted per-operation functions
- New exported functions, one per mutation type:
  - `dbSetImage(key, url)` / `dbSetCaption(key, value)` / `dbResetImage(key)`
  - `dbAddReport(report)` / `dbRemoveReport(id)`
  - `dbToggleGoalVisibility(id)` 
  - `dbAddExtraGoal(goal)` / `dbRemoveExtraGoal(id)`
  - `dbAddManualDonation(d)` / `dbRemoveManualDonation(id)`
  - `dbToggleGalleryItem(key)` / `dbAddGalleryExtra(id)` / `dbRemoveGalleryExtra(id)`
  - `dbAddNewsletterPost(post)` / `dbUpdateNewsletterPost(id, fields)` / `dbRemoveNewsletterPost(id)`
- `uploadFile()` stays unchanged (still writes binary files to Blob)

### `app/api/admin/config/route.ts` (updated)
- `GET`: calls `getConfig()` — now DB-backed, always current
- `PATCH`: each branch calls the corresponding targeted DB function instead of load-blob → mutate → save-blob
- No change to the request/response shape (UI is unaffected)

### `app/api/admin/upload/route.ts` (minor update)
- After uploading to Blob, calls `dbSetImage(key, url)` directly instead of loading and saving the full config

### `app/api/admin/generate-image/route.ts` (minor update)
- Same as upload: calls `dbSetImage(key, url)` when `commit: true`

### Schema initialisation (`lib/admin/migrate.ts`, new)
- `ensureSchema()` runs `CREATE TABLE IF NOT EXISTS` for all 6 tables
- Called once at cold start from `getConfig()` (guards with a module-level boolean so it only runs once per process)

### One-time data migration (`scripts/migrate-blob-to-neon.ts`, new)
- Reads existing JSON from Vercel Blob
- Inserts all records into Neon tables
- Safe to run multiple times (uses `INSERT ... ON CONFLICT DO NOTHING`)
- Run locally with `npx tsx scripts/migrate-blob-to-neon.ts` before removing Blob

---

## What Does Not Change

- Password auth (`lib/admin/auth.ts`) — untouched
- All admin UI components — untouched
- All public-facing pages — untouched
- Vercel Blob (still used for image/PDF binary storage)
- `uploadFile()` function signature

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Vercel + local `.env.local` | Neon connection string (pooled endpoint) |
| `BLOB_READ_WRITE_TOKEN` | Already set | Still needed for file uploads |

---

## Deployment Order

1. Create Neon project, copy `DATABASE_URL`
2. Add `DATABASE_URL` to Vercel environment variables
3. Deploy new code (schema auto-initialises on first request)
4. Run migration script to copy existing Blob data into Neon
5. Verify admin panel — all data present, updates instant
6. Remove Blob config read/write code (upload still uses Blob for files)

---

## Success Criteria

- Admin saves a change → refreshing the page immediately shows the update (no repeated save/refresh cycle)
- All existing data (images, goals, donations, newsletter posts, reports) visible after migration
- No changes required to any UI component
- Build passes TypeScript checks
