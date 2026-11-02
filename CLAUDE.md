# Aqdi (عقدي)

Read `docs/BRIEF.md` before any work. It's the product spec. If something there conflicts with a request, ask before going ahead.

## Where things stand

- Right now this repo is a static landing page (`index.html`), deployed on Vercel.
- The app itself (dashboard, tenant portal) hasn't been started. When it is, follow the stack and build order in the brief, one phase at a time.

## Main rules

- Arabic first (right-to-left), English second. No hard-coded text: everything goes through translations.
- The real estate office is the paying account. Buildings and units live inside it. Staff can be limited to specific buildings.
- Dates always show both calendars: Hijri first, then Gregorian with the month name. English: "1 Rajab 1448 · 10 Dec 2026". Arabic uses Arabic digits for dates: "١ رجب ١٤٤٨هـ · ١٠ ديسمبر ٢٠٢٦م" (format with `ar-SA-u-ca-islamic-umalqura-nu-arab` and `ar-SA-u-ca-gregory-nu-arab`). Never one calendar alone.
- Prices, totals and calculations use Western digits (0–9) in both languages, e.g. "5,000 ريال" (format Arabic with `ar-SA-u-nu-latn`). Dates on the Arabic side are the only place with Arabic digits.
- Billing is once a year, per unit. Tenants never pay.
- The portal (contracts, rent, maintenance) is the main product. Bookable services are a small side feature.
- Visual direction: warm and trustworthy, like a good Saudi real estate office. Not a tech or telecom look: no dark mode by default, no glowing gradients, no pill labels above headings.
- Ask before making product decisions the brief doesn't cover.

## Keeping the brief in sync

`docs/BRIEF.md` is a copy of a planning doc kept in Claude chat. Don't rewrite it on your own. If a decision changes during coding, mention it so the planning doc gets updated too.
