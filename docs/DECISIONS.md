# Aqdi: Decision Log

Newest first. Add a row whenever a product, pricing, technical or legal decision changes. Status: Decided, Recommended (needs founder sign-off), Open.

| Date | Decision | Why | Status |
| --- | --- | --- | --- |
| 6 Nov 2026 | Message: less daily tenant work for the office, owner informed and approving. Rent tracking is no longer a headline | Ejar already sends payment reminders and shows status; Saudi owners often run their own offices, so "keep your owners" doesn't fit | Decided, confirm with pilot offices |
| 6 Nov 2026 | Owner approvals in the MVP: costs above a limit the office sets go to the owner by WhatsApp to approve | Ties maintenance, owner reporting and communication into one workflow | Decided |
| 5 Nov 2026 | Reports and charts are free for every office, and shown on the landing page | Every competitor has them; they help win offices, not a reason to charge more | Decided |
| 5 Nov 2026 | Renewal rent check against Ejar's rental index in the MVP, district table kept by hand for the pilot city | Saudi-specific, money for owners; no API, so manual in v1 | Decided, check index terms |
| 5 Nov 2026 | Parcel lockers: don't build hardware; RedBox partnership or haris package log later | RedBox already runs residential lockers integrated with carriers | Later, only if interviews confirm |
| 5 Nov 2026 | Aqdi is the operations layer on top of Ejar, not a tenant portal | Ejar already does contracts, renewals, notices, residential rent payment and a tenant app. The gap is office operations | Decided |
| 5 Nov 2026 | Track rent, never collect residential rent | Since 15 Jan 2024, residential rent must go through Ejar (mada or SADAD 153); holding money would also need payment licensing | Decided |
| 5 Nov 2026 | Owner monthly statements in the MVP | Offices report to owners monthly; Ejar gives nothing for this; likely strongest reason to pay | Decided, validate in interviews |
| 5 Nov 2026 | Services marketplace postponed | Separate business; distracts from the core | Decided |
| 5 Nov 2026 | First segment: offices managing 30 to 300 units for owners, one city | Most weekly pain Aqdi removes; leasing-only brokers have little ongoing work | Decided |
| 5 Nov 2026 | Interviews before more product code (15 offices) | Avoid building on unconfirmed assumptions | Decided |
| 5 Nov 2026 | Pilot: 60 days free with goals, then founding price locked 2 years | Forces a yes or no; rewards early offices | Decided |
| 2 Nov 2026 | WhatsApp for messages, SMS for codes and fallback, one provider | SMS is the Saudi norm for codes; WhatsApp cheaper and richer for messages; Arabic SMS splits after 70 characters | Decided |
| 2 Nov 2026 | Login: phone + SMS code, plus last 4 of national ID or iqama | Mobile is always on the Ejar contract; email often isn't; no passwords | Decided |
| 2 Nov 2026 | AI reads typed Ejar PDFs only, with a review screen | Same layout every time; handwritten notebooks too risky for rent and dates | Decided |
| 2 Nov 2026 | Pricing 50 / 40 / 30 SAR per unit per year, bracketed, no minimum | Benchmarks at about half of DoorLoop; brackets avoid a price cliff; no minimum keeps small offices in | Decided |
| 2 Nov 2026 | Billing year starts at signup; units recounted at renewal | Leases start all year; units are stable | Decided |
| 2 Nov 2026 | Subscription payments via Tap or Moyasar or bank transfer | Stripe not available to Saudi companies and can't route mada | Decided |
| 1 Nov 2026 | Hijri (Arabic digits on Arabic side) + Gregorian dates; prices in Western digits | Clear for Saudi readers | Decided |
| 1 Nov 2026 | Warm, light visual style, not tech or telecom | Trust with real estate offices | Decided |
| Open | Final name | "عقدي" is already used by a Saudi rental app; "Mithaq" is crowded | Open |
| Open | How Aqdi learns a tenant paid without Ejar integration | Manual or Ejar report upload in v1; confirm with offices | Open |
| Open | Who sells and onboards on the ground in Saudi | Founder is in the US | Open |
| Open | Hosting location under PDPL | Needs legal review before pilot | Open |
