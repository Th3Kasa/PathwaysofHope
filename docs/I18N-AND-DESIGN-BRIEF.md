# Translation & Polish Brief — for contributors/agents

This site is being made fully bilingual (English default, Arabic optional) with a
top-right toggle. This document is the single source of truth for HOW to translate
and polish a page. Read it fully before editing.

## Golden rules

1. **Never invent, alter, or remove a fact.** Numbers, money figures, dates, names,
   ABN/ACN, emails, phone numbers, and identifiers must stay byte-for-byte identical
   in both languages. You are translating prose only — not data.
2. **English is authoritative.** The Arabic must say exactly what the English says —
   no additions, no omissions, no softening, no embellishment.
3. **Do not change the design structure, layout, animations, or imagery.** This task
   is translation + light, safe polish only (see "Polish" below). Do NOT redesign.
4. **Preserve all `className`, motion props, and component structure.** Only wrap
   user-visible text so it switches language.
5. Modern Standard Arabic (فصحى), warm and dignified in tone — this is a charity for
   children. Avoid slang and machine-literal phrasing.

## The i18n pattern (already established)

`lib/i18n.tsx` exports:
- `useT()` → returns a function `t({ en, ar })` that returns the active-language value.
- `useLang()` → `{ lang, dir, setLang, toggle }`.
- `type Dict<T> = { en: T; ar: T }`.

Two ways to use it (match what the file already does):

```tsx
"use client";
import { useT, type Dict } from "@/lib/i18n";

// Inline, for one-off strings:
const t = useT();
<h1>{t({ en: "Give now", ar: "تبرّع الآن" })}</h1>

// Colocated dictionary, for data arrays — preferred for lists/cards:
const ITEMS: { heading: Dict<string>; body: Dict<string> }[] = [
  { heading: { en: "...", ar: "..." }, body: { en: "...", ar: "..." } },
];
{ITEMS.map((i) => <h3>{t(i.heading)}</h3>)}
```

- The page/component must be a client component (`"use client"`). Most already are.
- Reference example already translated: `components/trust-strip.tsx` and
  `components/footer.tsx`. Mirror their style.
- Do NOT add per-string keys to a global file — colocate `{en, ar}` in the same file.

## Glossary (use these exact Arabic renderings for consistency)

| English | Arabic |
|---|---|
| Pathways of Hope | دروب الأمل |
| Kapoeta | كاپويتا |
| Kapoeta Children's Shelter | ملجأ كاپويتا للأطفال |
| South Sudan | جنوب السودان |
| Donate / Give / Give now | تبرّع / تبرّع الآن |
| Donation | تبرّع |
| Sponsor a child | اكفل طفلاً |
| Brother Hakim Peter | الأخ حكيم بيتر |
| Triple L Orphanage and Vulnerable Children Organization | منظمة Triple L للأيتام والأطفال المستضعفين |
| St. Mark Nubian Foundation | مؤسسة القديس مرقس النوبية |
| Toongabbie Church | كنيسة تونغابي |
| Solar Power System | نظام الطاقة الشمسية |
| Water Pump | مضخة المياه |
| Chicken Coop & 200 Chicks | حظيرة الدجاج و200 كتكوت |
| Ongoing Operations | النفقات التشغيلية المستمرة |
| Mission(s) | مهمّة / مهامّنا |
| Impact | الأثر |
| About (us) | من نحن |
| Governance | الحوكمة |
| Safeguarding | حماية الطفل |
| Transparency | الشفافية |
| Financials | البيانات المالية |
| Frequently Asked Questions | الأسئلة الشائعة |
| Privacy Policy | سياسة الخصوصية |
| tax-deductible | معفاة من الضرائب |
| Registered Australian charity | جمعية خيرية أسترالية مسجّلة |
| volunteers | المتطوّعون |
| once / weekly / fortnightly / monthly | مرة واحدة / أسبوعيًا / كل أسبوعين / شهريًا |
| A$ (e.g. A$600) | keep as "A$600" (do not translate the figure or symbol) |
| ABN / ACN / ACNC / DGR / Stripe | keep in Latin script as-is |

Keep proper nouns that appear in Latin on the source (emails, ABN, "Stripe",
"ACNC", "Colorbond", place names already in Latin) in Latin within the Arabic text.

## Numerals
Use Western Arabic numerals (0-9), e.g. "A$600", "70", "2024" — do NOT convert to
Eastern Arabic numerals (٦٠٠). This keeps figures consistent with the data and the
English version.

## Polish (light and safe only)
While translating, you MAY also:
- Fix obvious accessibility gaps: add `aria-label` to icon-only buttons/links,
  ensure images have meaningful `alt`, ensure interactive elements are focusable.
- Improve colour contrast ONLY if clearly failing (e.g. light gold text on white) —
  prefer the existing palette tokens.
- Tidy inconsistent spacing to match sibling sections.

You may NOT: restructure sections, remove content, change the colour palette,
swap images, change copy meaning, or alter any figure.

## Build
Do NOT run `next build` (it would collide with other concurrent work on `.next`).
You may run `npx tsc --noEmit` to type-check your own changes. Leave the working
tree edited but uncommitted — the lead will build, verify, and commit centrally.
