import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/** True when the request carries a valid Better Auth admin session. */
export async function isAuthed(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return Boolean(session?.user);
  } catch {
    return false;
  }
}
