import { FinancialsClient } from "./financials-client";
import { getConfig } from "@/lib/admin/store";

export default async function FinancialsPage() {
  const { reports } = await getConfig();
  return <FinancialsClient reports={reports} />;
}
