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
