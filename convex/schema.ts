import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ─── Application data model ─────────────────────────────────────────────────
// Replaces the single Vercel Blob config.json + per-browser cookies. All admin
// content and donation figures now live in Convex, so every change pushes to
// connected clients instantly (no cache window, no redeploy).
//
// Better Auth's own tables (users, sessions, accounts, verification) are owned
// by the @convex-dev/better-auth component and are NOT declared here.

export default defineSchema({
  // Admin-managed section images (uploaded or AI-generated), keyed by the
  // section key from lib/admin/sections.ts or a goal id. The file itself lives
  // in Convex file storage; we keep the storageId and resolve a URL on read.
  siteImages: defineTable({
    key: v.string(),
    storageId: v.id("_storage"),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  // Admin-managed captions / alt text, keyed by section key.
  sectionTitles: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  // Annual report PDFs listed on /financials.
  reports: defineTable({
    title: v.string(),
    year: v.string(),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }),

  // Each successful Stripe gift, mirrored from the webhook. Reactive queries
  // over this table drive the live progress meters. stripeId makes the mirror
  // idempotent against webhook retries.
  donations: defineTable({
    goalId: v.string(),
    amount: v.number(), // AUD dollars
    kind: v.union(v.literal("oneoff"), v.literal("recurring")),
    stripeId: v.string(),
    createdAt: v.number(),
  })
    .index("by_stripeId", ["stripeId"])
    .index("by_goal", ["goalId"]),

  // Manual offline / bank-transfer gifts entered by an admin, added on top of
  // the live Stripe totals. One row per goal.
  adjustments: defineTable({
    goalId: v.string(),
    amount: v.number(),
  }).index("by_goal", ["goalId"]),
});
