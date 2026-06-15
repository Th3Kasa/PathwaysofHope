import { getConfig } from "@/lib/admin/store";
import { ReportsClient } from "./reports-client";

export const metadata = {
  title: "Annual Reports",
  description:
    "Download Pathways of Hope annual reports and financial statements — full transparency for every supporter.",
};

// Render per request so reports uploaded in the admin panel appear immediately.
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { reports } = await getConfig();
  // Newest first — by year, then upload time.
  const sorted = [...reports].sort(
    (a, b) => b.year.localeCompare(a.year) || b.uploadedAt.localeCompare(a.uploadedAt)
  );
  return <ReportsClient reports={sorted} />;
}
