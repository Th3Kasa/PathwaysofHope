import { getConfig } from "@/lib/admin/store";
import { NewsletterClient } from "./newsletter-client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Updates — Pathways of Hope",
  description: "Latest news and updates from the Pathways of Hope mission in Kapoeta, South Sudan.",
};

export default async function NewsletterPage() {
  const config = await getConfig();
  return <NewsletterClient posts={config.newsletterPosts ?? []} />;
}
