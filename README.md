# Aqdi (عقدي)

Arabic-first platform for Saudi real estate offices and their tenants: leases, rent, maintenance and announcements in one place.

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. What's being built now is in `docs/BUILD_PLAN.md`.

## Run it

Needs Node 24.

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build; `npm run lint` checks the code; `npm test` runs the tests (they bring their own in-memory Postgres, no setup needed).

## Local settings (`.env.local`, never committed)

- `BETTER_AUTH_SECRET`: any long random string, e.g. `openssl rand -base64 32`.
- `DATABASE_URL`: optional. Without it, `npm run db:migrate` and `npm run dev` use an embedded Postgres stored in `.pglite/`, so you can work offline with throwaway data.

To use the Neon database locally instead, copy its URL from Vercel without it ever appearing on screen:

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.vercel --environment=production --yes
grep -E '^DATABASE_URL(_UNPOOLED)?=' .env.vercel >> .env.local && rm .env.vercel
```

That is the live database: anything you create locally shows up for real. `vercel env pull` writes the whole file it's given, which is why it goes to `.env.vercel` first and only the two database lines are copied into `.env.local`.

On Vercel, `DATABASE_URL` comes from the Neon integration, `BETTER_AUTH_SECRET` is set in Project Settings, and migrations run automatically before every build (`vercel.json`).

## Where things are

- `app/page.tsx`: the homepage. Its markup (`app/_home/markup.tsx`) and script (`app/_home/home-script.js`) are ported from the original static `index.html`; styles are in `app/globals.css`.
- `app/signup`, `app/login`: account pages (placeholders until step 2).
- `messages/ar.json`, `messages/en.json`: text for new pages. Arabic is the default.
- `lib/lang.ts`: the language switch. Pages render both languages and CSS shows the chosen one, so switching needs no reload.
