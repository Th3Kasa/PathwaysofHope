# Statistics & Data on the Website — for your fact-check

> ## ✅ VERIFIED CORRECTIONS APPLIED — 3 June 2026
> The owner fact-checked every figure against the official Kapoeta newsletter
> (EN + AR, signed by Elders Mamdouh Mansour & Philip Hanna) and confirmed the
> corrections below. **All are now live on the site.** The tables further down
> are the *original* pre-correction audit and are kept only for history.
>
> | What changed | Old (was on site) | New (verified & applied) |
> |---|---|---|
> | Children first gathered from the streets | 150–200 | **~320** |
> | Children in school | 26 (+18 preschool) = 44 | **46** in the local Catholic school system for the 2026 academic year (preschoolers taught on-site, uncounted) |
> | Children still waiting for sponsorship | 60 | **24** (70 in care − 46 in school) |
> | Sponsor-a-Child goal total | A$36,000 | **A$14,400** (24 × A$600) |
> | Founder Brother Hakim's return to Kapoeta | (year not stated) | **2020** |
> | December 2024 build team countries | Australia, US, UK, **Egypt** | **Australia, US, UK** (Egypt was the nationality of the volunteer engineer Michael Elmasri, not a partner team) |
> | Land parcel | 10,000 m² (100 × 100) | **20,000 m² (100 m × 200 m)** |
> | "Water tank tower" | listed as Already Delivered (A$11,000) | **moved to 2026 goals** — only the foundation is built |
> | Operating costs shown | two itemised monthly statements (Jul 2025, Mar 2026) | **verified annual budget**: Food A$30k/yr · Education A$6k/yr · Staff salaries A$7k/yr → **≈ A$45,000/yr for 70 children** |
>
> **Kept as-is** (owner confirmed correct): A$85,000 raised · 100% reaches the field ·
> 70 children in care · 16 m × 9 m building · 6 cows + a young bull · bread oven ·
> tuk-tuk · A$600/child/year · A$45,000/yr ongoing operations · all governance/legal
> details · the five separate donation goals and their breakdowns (kept as fundraising
> targets — "to collect the amount and more").

---

Every number, figure and factual claim currently shown on the site, grouped by
page, with where it appears and how it lines up with `KAPOETA-FACTS.md` (your
source-of-truth extract). Tick or correct each row; tell me the corrections and
I'll update the site (and `KAPOETA-FACTS.md`) in one pass.

Legend: ✅ = matches the source doc · ⚠️ = differs from / not found in the source
doc (you confirmed on 2 Jun 2026 that the higher figures are real — listed here so
you can still verify the exact numbers) · ℹ️ = newer info not in the source extract.

---

## Home page (`app/page.tsx`)

| Claim shown | Value | Source-doc check |
|---|---|---|
| Children served since 2024 | **150+** | ✅ 150–200 first encountered (MEPC letter) |
| Raised in first campaign | **A$85,000** | ✅ ~A$85,000 (Final Report) |
| Of donations reach the field | **100%** | ✅ volunteers self-fund travel |
| Children in education today | **44** | ✅ 18 preschool + 26 in local school = 44 |
| Pull-quote: "tattered clothes, eating from trash bins… thriving centre of hope" | — | ✅ Vision doc wording |

## Kapoeta mission page (`app/missions/kapoeta/kapoeta-client.tsx`)

| Claim shown | Value | Source-doc check |
|---|---|---|
| Children currently in care | **70** | ⚠️ source implies ~62–70; please confirm exact current number |
| Already sponsored | **10** | ✅ Vision doc |
| Still waiting for sponsorship | **60** | ⚠️ source says 45 *need* sponsorship (35 waiting after 10 sponsored). You confirmed 60 is current — please reconfirm |
| Youngest taught on-site (preschool) | **18** | ✅ Vision doc |
| Older children in local school | **26** (aged 8–16) | ✅ Vision doc |
| Children first encountered | **150–200** | ✅ MEPC letter |
| Raised, opening campaign | **A$85,000** (≈US$56,000) | ✅ Final Report |
| Main building dimensions | **16 m × 9 m** | ✅ all docs |
| Dairy herd | **5 cows + 1 bull** | ⚠️ Vision doc says "5 cows + young bull"; Final Report says "7 cows" — confirm |
| Founder | **Brother Hakim Peter**, native of Kapoeta, migrated to the **United States** | ✅ Vision doc |
| Partners across | **Australia, US, UK, Egypt** | ✅ Letter to Aman sponsors |
| Container | **40-foot**, Sydney → Mombasa → Kapoeta | ✅ Triple L letter |
| On-the-ground contacts | stmarknubianfoundation@gmail.com · Mamdouh Mansour 0402 747 292 · Philip Hanna 0411 401 217 | ⚠️ source lists Mamdouh's phone as 0466 967 154 and 0402 747 292 as Adel Mansour's — confirm the number↔name mapping |

## Donation goals (`lib/goals.ts`, shown on `/donate`, `/financials`, Kapoeta)

| Goal | Target | Notes / source-doc check |
|---|---|---|
| Solar Power System | **A$25,000** | ℹ️ 2026 estimate (component breakdown on donate page) |
| Chicken Coop & 200 Chicks | **A$5,000** | ℹ️ Vision doc mentions planned coop + "10 chickens and a rooster" — site says 200 chicks; confirm scale |
| Water Pump | **A$1,500** | ℹ️ Final Report lists pump at US$953.45; site figure likely includes install — confirm |
| Ongoing Operations | **A$45,000 / year** | ⚠️ no annual total in source; monthly statements imply ~A$50–90k/yr — confirm the annual figure |
| Sponsor a Child | **A$600 / child / year**, goal **A$36,000** (= 60 children) | ⚠️ ties to the "60 waiting" figure above |
| **2026 goals total** | **A$112,500** | sum of the above |

## "Already delivered" (`lib/goals.ts` → shown on `/financials`)

| Item | Value | Source-doc check |
|---|---|---|
| Deep water well with manual pump | A$18,000 | ⚠️ no explicit cost in source — confirm |
| 40-foot container, shipped Sydney → Kapoeta | A$45,000 | ⚠️ source shows purchase A$3,751 + delivery A$10,125 + clearance ~A$7,850 ≈ A$21.7k — confirm what A$45k covers |
| Main shelter building | A$20,000 | ⚠️ source building-related lines total higher (~A$50k incl. steel, bricks, beds) — confirm scope |
| Water tank tower | A$11,000 | ⚠️ Vision doc says tower was *begun/incomplete* — confirm |
| Bread oven & bakery | A$6,000 | ⚠️ Final Report: A$3,177.80 — confirm |
| 6 cows and a bull (dairy) | A$5,000 | ⚠️ Final Report: 7 cows A$1,900 — confirm count & cost |
| Tricycle for transport | A$3,000 | ℹ️ tuk-tuk in Vision doc; cost not stated — confirm |
| Renovation of two rooms | A$3,000 | ℹ️ boys' dormitory rooms (Vision doc); cost not stated |
| Fencing the land | A$1,800 | ✅ fencing done (Final Report); cost not stated |
| **Delivered total** | **A$112,800** | ⚠️ source Final Report table totals ~A$75,675 — you confirmed higher is real; please verify line items |

## Monthly operating statements (`app/financials/page.tsx`)

| Month | Total | Line items |
|---|---|---|
| **July 2025** | **A$4,160** | Matron (Mrs Jackie) 240 · Evangelist (Mr Simon) 160 · Cook 160 · Food 2,400 · School shoes 200 · Bakery flour 1,000 |
| **March 2026** | **A$7,560** | Staff salaries 560 · Food 1,280 · School 1,600 · Medication 80 · Building materials 2,540 · Workmanship 1,500 |

> Note: the July 2025 line items sum to A$4,160 ✅. The March 2026 line items sum to A$7,560 ✅. Please confirm these are the real statements you provided.

## Governance / legal (`app/governance/page.tsx`, footer, trust strip)

| Field | Value | Source-doc check |
|---|---|---|
| Legal name | **Pathways of Hope Ltd** | ℹ️ not in source extract — you confirmed accurate |
| ABN | **40 686 574 630** | ℹ️ passes ATO checksum; you confirmed accurate |
| ACN | **686 574 630** | ℹ️ you confirmed accurate |
| Structure | Public company limited by guarantee | ℹ️ confirmed |
| Registered | NSW · **28 April 2025** | ℹ️ confirmed |
| Regulator | Registered with the **ACNC** | ℹ️ confirmed (source said "in process" as of Jan 2025) |
| Donations | **tax-deductible** | ℹ️ confirmed — verify DGR endorsement is current |
| Safeguarding Officer | **Sally Exander** (trained teacher) | ℹ️ confirmed |
| Policies adopted | Board, **30 November 2025** | ℹ️ confirmed |
| Charitable objects (7 listed) | education, healthcare, food, orphanage running, training for refugees in Egypt, basic needs, relocation | ℹ️ from Constitution — confirm wording |

## About page (`app/about/page.tsx`)

| Field | Value | Note |
|---|---|---|
| Board members | **Waleed**, **Sylvia**, **Hanan** (Mansour) | ℹ️ you asked to keep these, reorder to Waleed → Sylvia → Hanan, and remove their photos/icons — being applied |

---

### How to use this
Reply with corrections in any form — e.g. "children in care = 68", "delivered total
is right", "sponsor goal = 45 children". I'll update the website **and** record your
confirmation in `KAPOETA-FACTS.md` so nothing is ever flagged as unverified again.
