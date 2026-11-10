# Aqdi (عقدي)

Arabic-first platform for Saudi real estate offices and their tenants: leases, rent, maintenance and announcements in one place.

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. What's being built now is in `docs/BUILD_PLAN.md`.

## Run it

Needs Node 24.

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build; `npm run lint` checks the code.

## Where things are

- `app/page.tsx`: the homepage. Its markup (`app/_home/markup.tsx`) and script (`app/_home/home-script.js`) are ported from the original static `index.html`; styles are in `app/globals.css`.
- `app/signup`, `app/login`: account pages (placeholders until step 2).
- `messages/ar.json`, `messages/en.json`: text for new pages. Arabic is the default.
- `lib/lang.ts`: the language switch. Pages render both languages and CSS shows the chosen one, so switching needs no reload.
