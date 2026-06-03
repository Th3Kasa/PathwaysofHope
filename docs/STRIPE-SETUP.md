# Turning on donations (Stripe) — step by step

The website's donation code is finished and tested. To start accepting real
donations you just need to create a Stripe account and give the site three pieces
of information. This takes about 15 minutes. No coding required.

> **Tell Alfred (Claude) your keys and I can set them in Vercel for you** — you do
> not have to do the dashboard steps yourself if you'd rather not. Just create the
> Stripe account (step 1–2) and paste me the keys; I'll wire up the rest.

---

## What the site actually needs

| Variable | Required? | Where it's used |
|---|---|---|
| `STRIPE_SECRET_KEY` | **Yes** | Creating each checkout + reading donation totals |
| `STRIPE_WEBHOOK_SECRET` | **Yes (for live)** | Confirming completed payments securely |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Where Stripe sends donors back after paying |
| `STRIPE_PUBLISHABLE_KEY` | Optional | Not used by the current checkout (donors are redirected to Stripe's own hosted page), but harmless to set |

---

## 1. Create a Stripe account
Go to https://stripe.com → **Start now**. Use the charity's email. Choose
**Australia** as the country so donations are in AUD.

## 2. Get your API keys
In the Stripe Dashboard: **Developers → API keys**.
- Copy the **Secret key** (starts with `sk_live_…` for real money, or `sk_test_…`
  for safe testing) → this is `STRIPE_SECRET_KEY`.

> Start in **Test mode** (toggle top-right of the dashboard) to try everything with
> fake cards before going live. Test card: `4242 4242 4242 4242`, any future expiry,
> any CVC.

## 3. Set the keys on the live site (Vercel)
Two options:

**A. Let Alfred do it** — paste me the keys and I'll add them to the Vercel project
`pathwaysofhope` and redeploy.

**B. Do it yourself** — Vercel → project **pathwaysofhope** → **Settings →
Environment Variables**. Add, for the **Production** environment:
- `STRIPE_SECRET_KEY` = your secret key
- `NEXT_PUBLIC_SITE_URL` = `https://pathwaysofhope.vercel.app` (or your custom domain)
- `STRIPE_WEBHOOK_SECRET` = (from step 4)
Then **Redeploy**.

## 4. Set up the webhook (so totals update reliably)
Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
- **Endpoint URL:** `https://pathwaysofhope.vercel.app/api/webhook`
  (use your custom domain if you have one)
- **Events to send:** `checkout.session.completed`, `payment_intent.succeeded`,
  `invoice.paid`
- Save, then copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`
  (add it in Vercel as in step 3 and redeploy).

## 5. Test a donation
On the live site (in Test mode) make a small donation with the test card above.
You should be redirected to Stripe, then back to the **Thank you** page, and the
donation should appear in your Stripe Dashboard → **Payments**.

## 6. Go live
When you're happy, switch the Stripe Dashboard to **Live mode**, copy the
**live** secret key and create a **live** webhook (repeat steps 2–4 with the live
keys), update the Vercel variables, and redeploy. Real donations will now work.

---

## Good to know
- **Receipts:** Stripe automatically emails each donor a receipt. Turn this on under
  **Settings → Customer emails → Successful payments**.
- **Recurring gifts:** weekly/fortnightly/monthly donations are created as Stripe
  subscriptions automatically — donors can be cancelled from your Dashboard.
- **Fees:** donors are offered the option to cover the card processing fee so 100%
  of their gift reaches the field.
- **Totals on the site** read live from Stripe and start at A$0 — they are never
  pre-inflated. If Stripe is unreachable, meters safely show A$0 rather than a guess.
- For local development, copy `.env.example` to `.env.local` and fill in test keys.
