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

  // Add image_urls column to existing tables (idempotent)
  await sql`ALTER TABLE newsletter_posts ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}'`;

  // ── Better Auth tables (email + password admin login) ──────────────────────
  // Created here so no manual SQL migration is needed. Names are camelCase and
  // quoted to match what Better Auth's Postgres adapter expects.
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id"            TEXT PRIMARY KEY,
      "name"          TEXT NOT NULL,
      "email"         TEXT NOT NULL UNIQUE,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "image"         TEXT,
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id"        TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "token"     TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId"    TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      "id"                    TEXT PRIMARY KEY,
      "accountId"             TEXT NOT NULL,
      "providerId"            TEXT NOT NULL,
      "userId"                TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accessToken"           TEXT,
      "refreshToken"          TEXT,
      "idToken"               TEXT,
      "accessTokenExpiresAt"  TIMESTAMPTZ,
      "refreshTokenExpiresAt" TIMESTAMPTZ,
      "scope"                 TEXT,
      "password"              TEXT,
      "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id"         TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value"      TEXT NOT NULL,
      "expiresAt"  TIMESTAMPTZ NOT NULL,
      "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  initialized = true;
}
