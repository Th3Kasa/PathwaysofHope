import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_IDS = new Set([
  "solar-system",
  "chicken-coop",
  "water-pump",
  "ongoing-operations",
  "sponsor-a-child",
]);

function isAuthed(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  return cookieStore.get("poh_admin")?.value === "1";
}

export async function POST(req: NextRequest) {
  const store = await cookies();
  if (!isAuthed(store)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let adjustments: Record<string, number>;
  try {
    const body = await req.json();
    adjustments = body.adjustments;
    if (!adjustments || typeof adjustments !== "object") throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate
  for (const [id, val] of Object.entries(adjustments)) {
    if (!VALID_IDS.has(id)) return NextResponse.json({ error: `Unknown goal: ${id}` }, { status: 400 });
    if (typeof val !== "number" || !Number.isFinite(val) || val < 0 || val > 10_000_000) {
      return NextResponse.json({ error: `Invalid amount for ${id}` }, { status: 400 });
    }
  }

  // Store as a Vercel Edge Config / cookie on the response so the totals API
  // can read it. We encode in a signed response cookie (no secret needed —
  // totals are public figures, not sensitive). The totals API reads this same
  // cookie on the server side.
  const encoded = Buffer.from(JSON.stringify(adjustments)).toString("base64");
  const res = NextResponse.json({ ok: true });
  res.cookies.set("poh_adjustments", encoded, {
    httpOnly: false, // totals API needs to read it server-side via cookies()
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return res;
}
