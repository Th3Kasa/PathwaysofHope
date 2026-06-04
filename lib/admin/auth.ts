import { cookies } from "next/headers";

const SESSION_COOKIE = "poh_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === "1";
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
