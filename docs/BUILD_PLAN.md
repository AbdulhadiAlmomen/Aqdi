# Build plan: first working version

Updated 9 Nov 2026. This is the first slice of the real app. It follows `docs/BRIEF.md`, with the changes listed under "Differences from the brief". Build the steps in order. Get each one working, deployed and pushed before starting the next.

## What "done" means

A stranger can:
1. Open the homepage and understand what Aqdi does, who it's for and why it's worth paying for.
2. Create an office account, log out, come back later and log in.
3. Upload an Ejar contract PDF and get the building, unit, tenant and contract set up by AI, with a review screen.
4. Pay through a Stripe checkout.
5. Log in as `demo@demo.com` / `password123!` through the normal login, with no email check and full paid access.

## Step 1: Move to Next.js, keep the homepage

- Next.js (App Router) + TypeScript + Tailwind, deployed on the same Vercel project.
- Port the current `index.html` to the homepage without losing anything: same copy, sections, styles, motion and the Arabic/English toggle. It's fine to keep its CSS as a global stylesheet at first.
- Homepage buttons "Start" / "ابدأ" go to sign-up; add "Log in" / "تسجيل الدخول" in the header.
- Arabic is the default, right-to-left. All new text goes through translation files, never hard-coded.
- Done when the live URL looks the same as before and the new pages are reachable.

## Step 2: Office accounts with Neon

- Add a Neon Postgres database from the Vercel dashboard (Storage tab), so `DATABASE_URL` is set for you.
- Sign-up form: office name, your name, email, password. Log in, log out, stay logged in between visits.
- Passwords hashed (bcrypt or argon2). Sessions in a secure, httpOnly cookie. Use a maintained auth library (Better Auth or Auth.js); say which one and why in one line.
- Tables: `users`, `offices`, `memberships` (user, office, role). The `users` table must be clearly named so it can be screenshotted in Neon.
- Every office-owned row has `office_id`, and every query filters by the logged-in user's office. Add a test that one office can't read another office's data.
- Email verification is optional for now. If you add it, the demo account must skip it.
- Done when a new account can sign up, log out, and log back in on the live site, and the row shows in Neon.

## Step 3: The AI feature: Ejar contract import

This is the core. Follow `docs/IMPORT_AND_ACCESS.md` part 1 for the fields and flow.

1. **Upload:** the office uploads one or more Ejar contract PDFs (typed PDFs, not scans or handwriting).
2. **Extract:** send each PDF to the Anthropic API (Claude Sonnet model) and ask for strict JSON: contract number, start and end dates (Hijri and Gregorian), tenant name, nationality, ID type and number, mobile, property address, unit number, type, floor and area, annual rent, payment cycle, and each installment's date and amount. Each field also gets a confidence level.
3. **Check in code**, not by trusting the AI:
   - ID is 10 digits; starts with 1 (national ID) or 2 (iqama); other IDs are allowed but flagged.
   - Saudi mobile format.
   - End date after start date; Hijri and Gregorian dates agree.
   - Installments add up to the annual rent.
   - Contract number isn't already in this office's account.
4. **Review screen:** shows every extracted field. Low-confidence or failed-check fields are highlighted for the office to fix. Nothing is saved until the office approves.
5. **Save:** approved data creates or updates the building, unit, tenant and contract. Show the result in a simple dashboard: buildings, units and contracts, with dates in Hijri and Gregorian.

Rules:
- `ANTHROPIC_API_KEY` lives in Vercel environment variables and `.env.local`, never in code. `.env*` is in `.gitignore`.
- Put the AI call behind an interface so it can be mocked in tests.
- Privacy: store only the last 4 digits of the ID or iqama number. Don't keep the PDF itself in this version.
- **Never commit real Ejar contracts.** Make one or two fake sample contracts (made-up names and numbers) in the same layout, under `samples/`, for testing and for the demo.
- Free accounts can import up to 3 contracts. Paid accounts have no limit.

## Step 4: Stripe checkout

- Stripe in test mode for now. Keys in environment variables.
- Plan: yearly subscription, priced per unit with Stripe's graduated tiers: 50 SAR per unit for units 1 to 100, 40 for 101 to 300, 30 above 300. The office enters its number of units and sees the total before paying.
- Checkout through Stripe Checkout. A webhook marks the office as paid; the app checks that flag to lift the import limit.
- Payments sit behind an interface. Stripe is for this version only: it isn't available to Saudi-registered companies, so the real launch will use a Saudi gateway (Tap or Moyasar).
- Week 4 needs a live $1 charge. Plan for a separate $1 test product then, not now.

## Step 5: Demo account

- A seed script (safe to run more than once) creates `demo@demo.com` / `password123!` with email marked verified, its own office "مكتب تجريبي" / "Demo Office", paid status, and sample data: 2 buildings, about 10 units, a few contracts at different stages.
- Run it against the production database. Confirm it logs in on the live site through the normal login.

## Differences from the brief

| Brief says | This version | Why |
| --- | --- | --- |
| Phone number + SMS code login | Email + password for office accounts | Course requirement; the brief already allows email + password for admins. Tenant phone login comes later |
| Mock payment gateway, then a Saudi gateway | Stripe in test mode | Course requirement. Swap later through the payments interface |
| PostgreSQL | Neon Postgres | Same database type, set up through Vercel |
| Full MVP phases | Only homepage, office accounts, AI import, payment, demo | First slice. The rest of the brief comes after |

## Working rules

- Commit and push after each step works, not after every small edit. Don't open and merge many pull requests in a row; push the working step to `main` so Vercel deploys it.
- Check the live site after each push.
- Tell me what you tested and what you didn't.
