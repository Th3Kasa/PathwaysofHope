import { Resend } from "resend";
import { getGoalById } from "@/lib/goals";

// ─── Resend client (lazy, returns null if key not configured) ─────────────────
function getResend(): Resend | null {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

// ─── From address (must be a verified Resend domain) ─────────────────────────
const FROM = process.env.RESEND_FROM_EMAIL ?? "receipts@pathwaysofhope.org.au";
const ORG_NAME = "Pathways of Hope Ltd";
const ABN = "40 686 574 630";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pathwaysofhope.org.au";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(ts * 1000));
}

// ─── Receipt email HTML ────────────────────────────────────────────────────────
export function buildReceiptHtml(opts: {
  donorName: string;
  amountCents: number;
  goalTitle: string;
  referenceId: string;
  dateTs: number; // unix timestamp
  isRecurring: boolean;
  frequency?: string;
}) {
  const { donorName, amountCents, goalTitle, referenceId, dateTs, isRecurring, frequency } = opts;
  const amount = formatAUD(amountCents);
  const date = formatDate(dateTs);
  const firstName = donorName.split(" ")[0] || donorName;
  const freqLabel = frequency
    ? frequency.charAt(0).toUpperCase() + frequency.slice(1)
    : "One-time";

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Donation Receipt — ${ORG_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1C1410;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(28,20,16,0.08);">

          <!-- Header banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1410 0%,#3D2B1F 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#EDD9B4;font-weight:600;">
                ${ORG_NAME}
              </p>
              <h1 style="margin:0;font-size:26px;font-weight:300;color:#FFFFFF;letter-spacing:-0.5px;">
                Donation Receipt
              </h1>
              <p style="margin:8px 0 0 0;font-size:12px;color:#C9A870;letter-spacing:1px;">
                ABN ${ABN}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#3D2B1F;">
                Dear ${firstName},
              </p>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.7;color:#5A4034;">
                Thank you for your generous gift to <strong>${ORG_NAME}</strong>.
                Your support directly funds vital programs for vulnerable children in Kapoeta, South Sudan.
              </p>
            </td>
          </tr>

          <!-- Receipt details card -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F0;border:1px solid #EDD9B4;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;background:#B85C38;">
                    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FDF8F0;font-weight:700;">
                      Receipt Details
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${row("Donation amount", `<strong style="font-size:18px;color:#1C1410;">${amount}</strong>`)}
                      ${row("Project funded", goalTitle)}
                      ${row("Donation type", isRecurring ? `${freqLabel} gift` : "One-time gift")}
                      ${row("Date", date)}
                      ${row("Receipt / Reference", `<span style="font-family:monospace;font-size:12px;color:#5A4034;">${referenceId}</span>`)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tax note -->
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F7F0;border:1px solid #B8D4B8;border-radius:10px;padding:16px 20px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;line-height:1.7;color:#2D5A2D;">
                      <strong>Tax information:</strong> ${ORG_NAME} (ABN ${ABN}) is a registered charity with the Australian Charities and Not-for-profits Commission (ACNC).
                      Please retain this receipt for your tax records. Consult your tax adviser regarding the deductibility of your donation.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What your gift does -->
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#B85C38;">
                What your gift does
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#5A4034;">
                Pathways of Hope operates a shelter, education program, and daily meals service in
                Kapoeta, one of South Sudan's most under-resourced communities. Every dollar you
                give goes directly to the children we serve.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 36px 40px;text-align:center;">
              <a href="${SITE_URL}/impact" style="display:inline-block;padding:12px 28px;background:#B85C38;color:#FFFFFF;font-weight:600;font-size:14px;text-decoration:none;border-radius:8px;">
                See Our Impact
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5F0E8;padding:24px 40px;border-top:1px solid #EDD9B4;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:12px;color:#8C7B72;">
                Questions? Email us at
                <a href="mailto:contact@pathwaysofhope.org.au" style="color:#B85C38;text-decoration:none;">contact@pathwaysofhope.org.au</a>
              </p>
              <p style="margin:4px 0 0 0;font-size:11px;color:#A0918A;">
                ${ORG_NAME} &bull; ABN ${ABN} &bull;
                <a href="${SITE_URL}" style="color:#A0918A;">${SITE_URL.replace("https://", "")}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Row helper ───────────────────────────────────────────────────────────────
function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 20px;font-size:13px;color:#8C7B72;width:40%;border-bottom:1px solid #EDD9B4;">${label}</td>
    <td style="padding:10px 20px;font-size:13px;color:#1C1410;border-bottom:1px solid #EDD9B4;">${value}</td>
  </tr>`;
}

// ─── Public send function ─────────────────────────────────────────────────────
export async function sendDonationReceipt(opts: {
  to: string;
  donorName: string;
  amountCents: number;
  goalId: string;
  referenceId: string;
  dateTs: number;
  isRecurring: boolean;
  frequency?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping receipt email");
    return;
  }

  const goal = getGoalById(opts.goalId);
  const goalTitle = goal?.title ?? opts.goalId;

  const html = buildReceiptHtml({
    donorName: opts.donorName,
    amountCents: opts.amountCents,
    goalTitle,
    referenceId: opts.referenceId,
    dateTs: opts.dateTs,
    isRecurring: opts.isRecurring,
    frequency: opts.frequency,
  });

  const { error } = await resend.emails.send({
    from: `${ORG_NAME} <${FROM}>`,
    to: opts.to,
    subject: `Your donation receipt — ${ORG_NAME}`,
    html,
  });

  if (error) {
    console.error("[email] Resend send failed:", error);
  } else {
    console.log("[email] Receipt sent to:", opts.to, "ref:", opts.referenceId);
  }
}

// ─── Bank-transfer receipt (manual, donor self-serves) ────────────────────────
export function buildBankReceiptHtml(opts: {
  donorName: string;
  amountAud: number;
  goalTitle: string;
  dateStr: string; // e.g. "3 June 2026"
  referenceId: string;
}) {
  const { donorName, amountAud, goalTitle, dateStr, referenceId } = opts;
  const amount = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    amountAud
  );
  const firstName = donorName.split(" ")[0] || donorName;

  return buildReceiptHtml({
    donorName: firstName,
    amountCents: Math.round(amountAud * 100),
    goalTitle,
    referenceId,
    dateTs: Math.floor(Date.now() / 1000),
    isRecurring: false,
  }).replace(
    `<strong style="font-size:18px;color:#1C1410;">${amount}</strong>`,
    `<strong style="font-size:18px;color:#1C1410;">${amount}</strong>`
  );
}

export async function sendBankTransferReceipt(opts: {
  to: string;
  donorName: string;
  amountAud: number;
  goalTitle: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping bank receipt email");
    return { ok: false, error: "Email service not configured" };
  }

  const referenceId = `BT-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const html = buildReceiptHtml({
    donorName: opts.donorName,
    amountCents: Math.round(opts.amountAud * 100),
    goalTitle: opts.goalTitle,
    referenceId,
    dateTs: Math.floor(Date.now() / 1000),
    isRecurring: false,
  });

  const { error } = await resend.emails.send({
    from: `${ORG_NAME} <${FROM}>`,
    to: opts.to,
    subject: `Bank transfer receipt — ${ORG_NAME}`,
    html,
  });

  if (error) {
    console.error("[email] Bank receipt send failed:", error);
    return { ok: false, error: String(error) };
  }

  console.log("[email] Bank receipt sent to:", opts.to, "ref:", referenceId);
  return { ok: true };
}
