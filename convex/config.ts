import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Admin mutations require an authenticated identity (issued by Better Auth and
// verified by Convex). Public queries are open — the content they return is
// already public on the site.
async function requireAdmin(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
}

// ─── Public read: everything the public pages render ────────────────────────
// Reactive: any image/title/report change re-runs this for every subscriber.
export const get = query({
  args: {},
  handler: async (ctx) => {
    const [images, titles, reports] = await Promise.all([
      ctx.db.query("siteImages").collect(),
      ctx.db.query("sectionTitles").collect(),
      ctx.db.query("reports").collect(),
    ]);

    const imageMap: Record<string, string> = {};
    for (const img of images) {
      const url = await ctx.storage.getUrl(img.storageId);
      if (url) imageMap[img.key] = url;
    }

    const titleMap: Record<string, string> = {};
    for (const t of titles) titleMap[t.key] = t.value;

    const reportList = await Promise.all(
      reports.map(async (r) => ({
        id: r._id as string,
        title: r.title,
        year: r.year,
        url: (await ctx.storage.getUrl(r.storageId)) ?? "",
        uploadedAt: r.uploadedAt,
      }))
    );
    reportList.sort((a, b) => b.uploadedAt - a.uploadedAt);

    return { images: imageMap, titles: titleMap, reports: reportList };
  },
});

// ─── Image overrides ────────────────────────────────────────────────────────
export const setImage = mutation({
  args: { key: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { key, storageId }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteImages")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (existing) {
      // Free the old file before replacing it.
      await ctx.storage.delete(existing.storageId).catch(() => {});
      await ctx.db.patch(existing._id, { storageId, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("siteImages", { key, storageId, updatedAt: Date.now() });
    }
  },
});

export const resetImage = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("siteImages")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (existing) {
      await ctx.storage.delete(existing.storageId).catch(() => {});
      await ctx.db.delete(existing._id);
    }
  },
});

// ─── Caption / alt text ─────────────────────────────────────────────────────
export const setTitle = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, { key, value }) => {
    await requireAdmin(ctx);
    const trimmed = value.trim();
    const existing = await ctx.db
      .query("sectionTitles")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (!trimmed) {
      if (existing) await ctx.db.delete(existing._id);
      return;
    }
    if (existing) await ctx.db.patch(existing._id, { value: trimmed });
    else await ctx.db.insert("sectionTitles", { key, value: trimmed });
  },
});

export const resetTitle = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("sectionTitles")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

// ─── Annual reports ─────────────────────────────────────────────────────────
export const addReport = mutation({
  args: { title: v.string(), year: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { title, year, storageId }) => {
    await requireAdmin(ctx);
    await ctx.db.insert("reports", { title, year, storageId, uploadedAt: Date.now() });
  },
});

export const removeReport = mutation({
  args: { id: v.id("reports") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const r = await ctx.db.get(id);
    if (r) {
      await ctx.storage.delete(r.storageId).catch(() => {});
      await ctx.db.delete(id);
    }
  },
});

// ─── Uploads ────────────────────────────────────────────────────────────────
// The admin client asks for a short-lived upload URL, POSTs the file straight
// to Convex storage, then calls setImage/addReport with the returned storageId.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
