import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// Better Auth mounts all its endpoints (sign-in, sign-up, sign-out, session…)
// under /api/auth/*.
export const { GET, POST } = toNextJsHandler(auth);
