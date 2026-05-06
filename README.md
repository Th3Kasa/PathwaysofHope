# Pathways of Hope — Fundraising Website

Production Next.js 14 fundraising site for the Kapoeta Children's Shelter, South Sudan.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Stripe Checkout (one-off + monthly subscriptions)
- Vercel deployment
- No database — Stripe is the source of truth for donation totals

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, mission intro, trust strip |
| `/missions` | Mission grid |
| `/missions/kapoeta` | Full Kapoeta story, timeline, gallery, videos, goal meters |
| `/donate` | Donation form — goal picker, amount presets, one-off/monthly toggle |
| `/about` | Team, origin story, trust signals |
| `/thank-you` | Stripe success redirect |

## Local Development

```bash
# 1. Clone
git clone https://github.com/Th3Kasa/PathwaysofHope.git
cd pathways-of-hope

# 2. Install
npm install

# 3. Set env vars
cp .env.example .env.local
# Edit .env.local and fill in your Stripe keys

# 4. Run
npm run dev
```

Open http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_... or sk_test_...) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_live_... or pk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe dashboard |
| `NEXT_PUBLIC_SITE_URL` | Full URL of deployed site, e.g. https://pathwaysofhope.org.au |
| `FALLBACK_RAISED_*` | Pre-Stripe donation totals used as base offset when Stripe fetch succeeds |

## Stripe Setup Walkthrough

### 1. Create a Stripe account
Go to https://stripe.com and create an account. Enable AUD as your currency.

### 2. Get your API keys
Dashboard → Developers → API keys
- Copy `Secret key` → `STRIPE_SECRET_KEY`
- Copy `Publishable key` → `STRIPE_PUBLISHABLE_KEY`

### 3. Set up Products (for attribution)
The checkout route creates prices on the fly. However, for clean Stripe reporting, create Products manually:

Dashboard → Products → Add Product for each goal:
- "Water Tower & Solar Pump — Kapoeta" — add metadata key `goal_id` = `water-tower`
- "Chicken Coop & Layers — Kapoeta" — metadata `goal_id` = `chicken-coop`
- "Sponsor a Child — Kapoeta" — metadata `goal_id` = `sponsor-a-child`
- "General Annual Support — Kapoeta" — metadata `goal_id` = `general-support`

### 4. Set up Webhook
Dashboard → Developers → Webhooks → Add endpoint

- URL: `https://your-domain.com/api/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `invoice.paid`
- Copy the Signing secret → `STRIPE_WEBHOOK_SECRET`

For local testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 5. Test mode vs Live mode
Use `sk_test_` / `pk_test_` keys for local dev — Stripe won't charge real money.
Switch to `sk_live_` / `pk_live_` for production.

## How Donation Totals Work

`/api/totals` queries Stripe PaymentIntents and Invoices, groups them by `metadata.goal_id`, and returns totals. It caches for 60 seconds.

Fallback values from env vars are added as a base offset (for cash donations, pre-Stripe gifts, etc.). Set them to `0` once you've entered all historical donations into Stripe.

The Kapoeta mission page (`/missions/kapoeta`) fetches these totals server-side with 60s revalidation and passes them to `GoalMeter` components. If the fetch fails, `GoalMeter` falls back to values in `lib/goals.ts`.

## Deploy to Vercel

### First deploy
```bash
# Push to GitHub
git remote add origin https://github.com/Th3Kasa/PathwaysofHope.git
git branch -M main
git push -u origin main
```

Then go to https://vercel.com/new, import the repo, and add all env vars from `.env.example`.

### Subsequent deploys
```bash
git add .
git commit -m "your message"
git push
```
Vercel auto-deploys on push to main.

## Project Structure

```
app/
  page.tsx              — Home
  missions/
    page.tsx            — Missions list
    kapoeta/page.tsx    — Full Kapoeta story
  donate/page.tsx       — Donation flow
  about/page.tsx        — About page
  thank-you/page.tsx    — Post-donation success
  api/
    checkout/route.ts   — POST: creates Stripe Checkout Session
    totals/route.ts     — GET: returns raised amounts per goal
    webhook/route.ts    — POST: handles Stripe webhook events
  globals.css
  layout.tsx

components/
  nav.tsx               — Sticky header navigation
  footer.tsx            — Site footer
  goal-meter.tsx        — Animated fundraising progress bar
  donate-button.tsx     — Reusable CTA link button
  donate-form.tsx       — Client-side donation form (goal + amount + frequency)
  mission-card.tsx      — Mission grid card
  trust-strip.tsx       — "Why trust us" section
  ui/                   — shadcn/ui components

lib/
  utils.ts              — cn(), formatAUD helpers
  goals.ts              — Goal definitions and fallback values

public/
  images/kapoeta/       — Photos and logos
  videos/               — kapoeta-2024.mp4, kapoeta-2025.mp4
```

