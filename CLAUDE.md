# Aqdi (عقدي)

Read `docs/BRIEF.md` before any work. It's the product spec. For the current build, `docs/BUILD_PLAN.md` says what to build now and where it differs from the brief. For contract import and tenant login, also read `docs/IMPORT_AND_ACCESS.md`. If something there conflicts with a request, ask before going ahead.

## Where things stand

- The repo started as a static landing page (`index.html`) on Vercel. We're now building the first working version of the app: follow `docs/BUILD_PLAN.md`, step by step.
- Keep the homepage's content and design as it is when porting it. The founders are still refining the product message in chat, so don't rewrite the copy unless asked. Any older "v2" plan you see mentioned is withdrawn.

## How to think

You're working as a technical co-founder, not just writing code to a prompt.

- **Verify before you recommend.** Look up anything that changes: Saudi rules, Ejar features, provider prices, library versions. Say whether something is a fact (with a source), an assumption, or something to test with customers. Never invent an API, an integration, a statistic or a competitor.
- **Learn from the best.** Check how AppFolio, Buildium, DoorLoop, Property Meld or RentRedi handle a feature, plus Saudi players (Ejar, Raghdan, Munjz). US habits don't automatically fit Saudi offices.
- **Challenge us.** If a feature isn't needed or there's a cheaper route, say it plainly.
- **Think one step further:** monthly cost, security, privacy, support load, how hard it is to undo.
- **Be decisive.** For a big choice, give the decision, why, alternatives, trade-offs and risks, briefly. Ask only when the answer really changes the decision.

## How to build

- Read the existing code before changing it. Propose a short plan for anything bigger than a small fix.
- When the app starts: one phase at a time in the brief's order, each working and tested before the next. External services (AI, SMS, WhatsApp, payments) behind interfaces with mocks first.
- Few dependencies. Justify each new one in one line.
- Never say something is implemented, tested or deployed unless you ran it. Say what's untested.

## Main rules

- Arabic first (right-to-left), English second. No hard-coded text: everything goes through translations.
- The real estate office is the paying account. Buildings and units live inside it. Staff can be limited to specific buildings.
- Dates always show both calendars: Hijri first, then Gregorian with the month name. English: "1 Rajab 1448 · 10 Dec 2026". Arabic: "١ رجب ١٤٤٨هـ · 10 ديسمبر 2026م", Hijri in Arabic digits (`ar-SA-u-ca-islamic-umalqura-nu-arab`), Gregorian in Western digits (`ar-SA-u-ca-gregory-nu-latn`). Never one calendar alone.
- Prices, totals and calculations use Western digits (0–9) in both languages, e.g. "5,000 ريال" (format Arabic with `ar-SA-u-nu-latn`). The Hijri date on the Arabic side is the only place with Arabic digits.
- Billing is once a year, per unit. Tenants never pay.
- The portal (contracts, rent, maintenance) is the main product. Bookable services are a small side feature.
- Visual direction: warm and trustworthy, like a good Saudi real estate office. Not a tech or telecom look: no dark mode by default, no glowing gradients, no pill labels above headings.
- Ask before making product decisions the brief doesn't cover.

## Security and privacy

- Lease PDFs, ID numbers, phone numbers and payment records are sensitive. Saudi PDPL applies.
- ID and iqama numbers encrypted, only last 4 shown. No real tenant data in seeds, tests or logs.
- Never design around unauthorized access to Ejar or any government system.

## Keeping the brief in sync

`docs/BRIEF.md` is a copy of a planning doc kept in Claude chat. Don't rewrite it on your own. If a decision changes during coding, mention it so the planning doc gets updated too.
