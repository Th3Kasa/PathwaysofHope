# Pathways of Hope — Site Audit & Donation Revamp

**Date:** 2026-06-02
**Status:** Approved-pending-build

## 1. Goals

1. Restructure donation data into **verified, corrected figures** (no invented numbers, no mock totals).
2. Replace the single flat donate form with a **three-stage flow**: hub → (bundle breakdown) → structured item page.
3. Make "Donate now" buttons land directly in the giving flow.
4. Add Stripe fee opt-in, recurring-frequency notice, sponsor-a-child quantity selector, item/amount-aware fun facts, and a bank-transfer panel on every donation screen.
5. Audit all site copy against `KAPOETA-FACTS.md` and fix unverified/broken claims and assets.

## 2. Donation data model (`lib/goals.ts` rewrite)

### Donation targets (2026 goals — the only donatable items)

| id | title | total (AUD) | kind | recurring |
|---|---|---|---|---|
| `solar-system` | Solar System | 25,000 | bundle | no |
| `chicken-coop` | Chicken Coop + 200 Chicks | 5,000 | bundle | no |
| `water-pump` | Water Pump | 1,500 | leaf | no |
| `ongoing-operations` | Ongoing Operations | 45,000/yr | leaf | yes |
| `sponsor-a-child` | Sponsor a Child | 600 × children | leaf-qty | yes (annual) |

**No `fallbackRaised` / `fallbackSupporters` fields.** Meters start at A$0 and reflect only live Stripe data.

### Bundle breakdowns (educated estimates — flagged as such)

**Solar System (A$25,000)**
- Solar panel array — 9,000
- Battery storage bank — 7,000
- Inverter & charge controller — 3,000
- Wiring, lights & distribution to centre — 3,500
- Mounting, installation & labour — 2,500

**Chicken Coop + 200 Chicks (A$5,000)**
- Coop structure & predator fencing — 2,500
- 200 chicks — 1,200
- Feed (first 3 months) — 800
- Feeders, waterers & equipment — 500

Each breakdown part is individually donatable; breakdown page also offers "give any amount toward the whole project."

### Already delivered (achievements — NOT donatable)

Shown on the Kapoeta mission page as proof of delivery. Total **A$112,800**.
Well + pump 18,000 · Container 45,000 · Shelter building 20,000 · Water tank tower 11,000 ·
Bread oven 6,000 · 6 cows + bull 5,000 · Tricycle 3,000 · Two-room renovation 3,000 · Fencing 1,800.

## 3. Routes & components

- `/donate` — hub grid of 5 targets, live meters from `/api/totals`, A$0 baseline.
- `/donate/[goal]` — structured donation page (leaf items + "whole project" bundles).
- `/donate/[goal]/parts` — bundle breakdown page (Solar, Coop only); each part links to `/donate/[goal]?part=<partId>`.
- Components: `DonateHub`, `BundleBreakdown`, `DonationPanel` (the structured form), `BankTransferPanel`, `FunFact`.

### Structured donation panel (`DonationPanel`)

1. Item title + image + short description.
2. **Frequency:** Give Once · Weekly · Fortnightly · Monthly (segmented control).
3. Recurring notice: when a recurring frequency is chosen, show a checkbox
   *"I understand this will be set up as a recurring payment starting today."* — required to continue. Hidden on Give Once.
4. **Sponsor a Child only:** quantity stepper (1–35), amount = 600 × qty, locked preset.
5. **Choose an amount (AUD):** presets + custom (presets vary per item).
6. **Fun fact:** changes by item + amount tier.
7. **Fee opt-in checkbox (default ON):** "Add 1.75% + A$0.30 so 100% of my gift reaches the children." Adds `amount × 0.0175 + 0.30`.
8. **Continue button (dynamic):** `Continue — A$X` (once) / `Continue — A$X per week|fortnight|month`.
9. **BankTransferPanel** (always, at bottom):
   - PATHWAYS OF HOPE LTD · BSB 062-217 · Acct 1102 4438
   - "Prefer to give directly and save the card fee?"

## 4. Stripe integration changes

- Keys via env only (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`). **Live mode.**
  ⚠️ The live secret key was exposed in chat → must be rotated post-launch.
- `/api/checkout` accepts: `goalId`, `partId?`, `amountAud`, `frequency` (once|weekly|fortnightly|monthly), `quantity?`, `coverFee` (bool).
  - Recurring → subscription with interval mapped (weekly→`week`, fortnightly→`week`/interval_count 2, monthly→`month`).
  - Fee added server-side from the same formula (never trust client total alone; recompute).
  - Metadata: `goal_id`, `part_id`, `mission:kapoeta`, `quantity`.
- `/api/totals` — remove `FALLBACK_TOTALS`; group live Stripe data by `goal_id`; missing goals = `{raised:0,supporters:0}`.

## 5. Copy/asset audit fixes

- Keep "registered Australian charity (ACNC)" + "tax-deductible" — **user confirmed ACNC + DGR**.
- Fix broken images: checkout `/images/kapoeta/logo.jpg` → `/logo.png`; kapoeta `/images/kapoeta/classroom-1.jpg` → real `field/` photo.
- Reconcile child counts/figures with `KAPOETA-FACTS.md` (45 in care, 44 in education, ~A$85k opening campaign). Remove any lingering unverified figures.
- Bank details across site updated to PATHWAYS OF HOPE LTD / 062-217 / 1102 4438.

## 6. Out of scope

Database for donations (Stripe is source of truth), email receipts beyond Stripe's, CMS, multi-mission expansion.
