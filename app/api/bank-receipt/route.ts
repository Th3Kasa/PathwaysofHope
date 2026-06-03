import { NextRequest, NextResponse } from "next/server";
import { sendBankTransferReceipt } from "@/lib/email";
import { getGoalById } from "@/lib/goals";

interface Body {
  name: string;
  email: string;
  amountAud: number;
  goalId?: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Receipt emails are not yet configured. Please email us directly." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, amountAud, goalId } = body;

  if (!name?.trim() || !email?.trim() || typeof amountAud !== "number") {
    return NextResponse.json({ error: "Name, email, and amount are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (amountAud < 1 || amountAud > 100_000) {
    return NextResponse.json({ error: "Amount out of range" }, { status: 400 });
  }

  const goal = goalId ? getGoalById(goalId) : undefined;
  const goalTitle = goal?.title ?? "Pathways of Hope — General Fund";

  const result = await sendBankTransferReceipt({
    to: email.trim(),
    donorName: name.trim(),
    amountAud,
    goalTitle,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Failed to send receipt. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
