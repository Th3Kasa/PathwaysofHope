import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { ensureSchema } from "@/lib/admin/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Better Auth mounts all its endpoints (sign-in, sign-up, sign-out, session…)
// under /api/auth/*. We run ensureSchema() first so the Better Auth tables are
// guaranteed to exist before any auth operation — no manual SQL migration.
const handlers = toNextJsHandler(auth);

export async function GET(req: Request) {
  await ensureSchema();
  return handlers.GET(req);
}

export async function POST(req: Request) {
  await ensureSchema();
  return handlers.POST(req);
}
