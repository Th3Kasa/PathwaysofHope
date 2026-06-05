import { revalidatePath } from "next/cache";

// ─── On-demand revalidation ─────────────────────────────────────────────────
// Public pages bake in admin-managed images, captions and reports at render
// time. They are otherwise cached (static or time-revalidated) for speed, so a
// content change in the admin panel would not appear until the cache expired or
// the site was redeployed. Calling this after every admin mutation invalidates
// those pages, so the next visitor sees the update immediately — no waiting, no
// repeated reloads.
const CONTENT_PAGES = [
  "/",
  "/missions/kapoeta",
  "/donate",
  "/financials",
] as const;

/**
 * Invalidate every public page that renders admin-managed content. Safe to call
 * from Route Handlers; revalidation takes effect on each page's next visit.
 */
export function revalidatePublicContent(): void {
  for (const path of CONTENT_PAGES) {
    revalidatePath(path);
  }
  // Donation goal + part pages are dynamic segments — revalidate by pattern.
  revalidatePath("/donate/[goal]", "page");
  revalidatePath("/donate/[goal]/parts", "page");
}

/**
 * Invalidate the cached donation totals and the pages whose progress meters
 * read them. Call after a successful Stripe payment so the meters reflect the
 * new gift on the next visit instead of waiting out the 60s cache window.
 */
export function revalidateDonationTotals(): void {
  revalidatePath("/api/totals");
  revalidatePath("/missions/kapoeta");
  revalidatePath("/donate");
}
