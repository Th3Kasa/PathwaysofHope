import { isAuthed } from "@/lib/admin/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin — Pathways of Hope", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthed();
  return <AdminDashboard initialAuthed={authed} />;
}
