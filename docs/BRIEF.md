# Aqdi (عقدي): Product Brief for Development

Last synced from the planning doc: Nov 1, 2026. The planning doc is the source of truth; this file is a copy for Claude Code.

## What Aqdi is

Aqdi is a web app that gives Saudi real estate offices and their tenants one place to handle leases, rent, maintenance and communication. Think of the resident portals US apartment complexes use, built Arabic-first for how renting works in Saudi.

**The problem.** Most Saudi rentals still run on paper, phone calls and WhatsApp groups. Tenants chase the office for renewal dates, pay rent in large yearly or six-month chunks, and report a broken AC by calling the haris. Offices track all of it in notebooks or spreadsheets and have no clear view of who paid, which contracts end soon, or which repairs are still open.

**What Aqdi does.** The office signs up, adds its buildings, units and tenants, and runs the day-to-day from one dashboard. Tenants log in to see their contract, pay rent, request maintenance and get announcements. As a side feature, the office can list paid services (cleaning, AC repair, moving) that anyone can book, tenant or not.

**Who pays.** The real estate office, once a year, based on how many units it manages. Tenants use it free. Details under Pricing and billing.

## Users and roles

Four roles, each with its own view. One real estate office is one account (tenant in the multi-tenant sense), and all data is scoped to it.

| Role | Who they are | What they see |
| --- | --- | --- |
| Office admin | Owner or manager of the real estate office | Full dashboard: buildings, units, tenants, contracts, payments, maintenance, services, announcements, staff |
| Maintenance staff | The haris or technician | Only jobs assigned to them, with photos, address and unit; can update status and mark done |
| Tenant | Someone with an active lease in one of the office's units | Their contract, payments, maintenance requests, announcements, messages, and services at tenant price |
| Guest customer | Anyone who books a service without a lease | Only the services page and their own bookings |

A person can be a guest first and become a tenant later. Same phone number, same account, and the role gets upgraded when the office links them to a lease.

### Offices with many buildings

The office is the account, not the building. An office like Anwar with 10 buildings has one account, one annual bill, and all 10 buildings inside it.

Staff are assigned to buildings so each person only sees their own work:

| Staff role | Scope | Sees |
| --- | --- | --- |
| Office manager | All buildings | Everything: contracts, payments, maintenance, staff, reports |
| Leasing | All or selected buildings | Contracts and renewals for their buildings |
| Maintenance | Selected buildings | Repair jobs and service bookings for their buildings only |

A new maintenance request is auto-assigned to the maintenance staff for that unit's building. The manager can reassign any job.

## Pricing and billing

One yearly payment, based on the total number of units the office manages across all its buildings. Billed yearly, like the leases themselves. This matches the industry: US platforms like Entrata, AppFolio and Yardi all charge per unit, usually on an annual agreement.

- **What counts:** every unit in the system, rented or vacant. Not contracts, which change all year.
- **Minimum:** none. An office with 3 units pays for 3 units. Onboarding must be self-serve so small offices can set up without help.
- **Volume rate:** a lower per-unit price above a threshold (e.g. above 100 units).
- **Growth mid-year:** units added during the year are free until renewal. At renewal, the office pays for its new total.
- **Tenants:** always free.
- **Prices:** working proposal is 50 SAR per unit per year for the first 100 units, 40 SAR for units 101–300, 30 SAR above 300 (100 units = 5,000 SAR, 300 units = 13,000 SAR), applied like tax brackets. Not final until tested with real offices. The website shows a calculator where an office enters its unit count and sees the yearly price.

## App structure and entry flow

Aqdi is a portal first. The homepage is a login screen, like the resident portals in the US, and the services page is a side entrance.

```
Login screen (aqdi.sa)                Office's shared link (WhatsApp, Instagram, QR)
   |        \                                   |
   |         "Not a tenant? Book a service" --> Public services page
   v                                            |
Phone number + OTP                              v
   |                                        Guest booking (book and pay)
   opens by role:
   - Office dashboard
   - Staff job list
   - Tenant portal
```

- **Login screen.** Phone number and OTP. After login, the app opens the right view for the user's role: office dashboard, staff job list, or tenant portal.
- **Side link.** Under the login button: "Not a tenant? Book a service." It opens the office's public services page.
- **Shared link.** Most guests won't come through the login screen. They'll come from a link or QR code the office shares. That link goes straight to the services page.
- **Guests** only see services and their own bookings. They never see contracts, payments or anything from the portal.

## MVP features

The first version needs five things working well: contracts with renewal reminders, rent payments, maintenance, notifications, and the office dashboard. Everything else waits.

### Office admin

- **Properties.** Add buildings, then units inside each (unit number, floor, type, size, monthly or yearly rent, status: vacant, occupied, under maintenance).
- **Tenants.** Add a tenant by phone number and national ID or iqama number, link them to a unit.
- **Contracts.** Create a lease: start and end date, rent amount, payment schedule (yearly, 6-month, quarterly, monthly), deposit, uploaded PDF of the signed contract, optional Ejar contract number.
- **Renewals.** Contracts ending in the next 90, 60 and 30 days appear on the dashboard. The office can send a renewal offer (new rent, new dates), and the tenant accepts or declines in the app.
- **Payments.** Auto-generate rent invoices from the payment schedule. Show paid, due, and late. Allow the office to record a cash or bank transfer payment by hand.
- **Maintenance.** See all requests across buildings, assign each to a staff member, track status, see cost if any.
- **Announcements.** Post to one building or all buildings (water cut, elevator service, Ramadan hours). Tenants get notified.
- **Dashboard home.** Occupancy rate, rent collected this month vs expected, late payers, contracts ending soon, open maintenance jobs.

### Tenant

- **My contract.** Dates, rent, schedule, deposit, downloadable PDF, days until expiry.
- **Pay rent.** See upcoming and past invoices, pay online, download receipts.
- **Maintenance request.** Pick a category (AC, plumbing, electrical, appliance, other), describe it, attach photos or a short video, pick preferred time. Track status: submitted, assigned, scheduled, in progress, done. Rate the job after.
- **Renewal.** Get the office's renewal offer and accept or decline.
- **Announcements and messages.** Read building announcements and message the office directly.

### Maintenance staff

- Mobile-friendly list of assigned jobs with unit, tenant contact, photos and preferred time.
- Update status, add a note or photo when done.

### Services (small side feature)

- Office lists services with name, description, price, and whether tenants get a different price.
- Each office has a public link (e.g. `aqdi.sa/s/office-name`) it can share on WhatsApp, Instagram or a QR code.
- Guests book with phone number and OTP, pick a time, pay or pay on arrival. Tenants see the same services inside their portal.
- Bookings show up for the office next to maintenance jobs and can be assigned to staff the same way.

## Saudi-specific requirements

These are what make Aqdi different from a US portal. Build them in from day one, not as a later translation layer.

- **Arabic first, English second.** Default language is Arabic with full right-to-left layout. A toggle switches to English (left-to-right). Every string goes through i18n from the start, no hard-coded text.
- **Dates.** Every date shows both calendars, everywhere: contracts, invoices, renewals, the dashboard and the website mockups. Hijri first, then Gregorian with the month written out, e.g. "1 Rajab 1448 · 10 Dec 2026" (Arabic: "١ رجب ١٤٤٨هـ · ١٠ ديسمبر ٢٠٢٦م"). Use the Umm al-Qura calendar for Hijri. Never show a date in only one calendar, and never use number-only formats like 10/12/2026.
- **Currency.** SAR everywhere, formatted for Arabic and English.
- **Login by phone.** Saudi mobile number (+966) with a one-time SMS code. No passwords for tenants and guests. Office admins can also use email and password.
- **Payments.** Support mada, Apple Pay, STC Pay and cards through a Saudi payment gateway (Moyasar, HyperPay or Tap are the usual options). Keep the gateway behind an interface so it can be swapped.
- **Flexible rent.** Even if the contract is yearly, the office can let the tenant pay monthly. Later, a buy-now-pay-later partner (Tabby or Tamara) can split payments while the office gets paid upfront.
- **WhatsApp notifications.** Renewal reminders, rent due, maintenance updates and announcements go out on WhatsApp (WhatsApp Business API) as the main channel, with SMS as backup and in-app as the record.
- **Ejar.** Residential leases in Saudi are registered on Ejar. For the MVP, store the Ejar contract number and let the office upload the Ejar PDF. A real API integration comes later and depends on getting official access.
- **Data and compliance.** Saudi's Personal Data Protection Law applies, so plan to host in-region and store national ID and iqama numbers encrypted. Check ZATCA e-invoicing rules before charging for services.

## Data model

Every table except `users` carries an `office_id`, and every query filters by it. One office must never see another office's data.

| Entity | Key fields | Belongs to |
| --- | --- | --- |
| Office | name (ar, en), commercial registration number, logo, public slug, plan | top level |
| User | phone, name, email (optional), language preference | can have roles in many offices |
| Membership | user, office, role (admin, staff, tenant, guest) | Office + User |
| Building | name, city, district, address, location pin | Office |
| Unit | number, floor, type, size (m²), base rent, status | Building |
| Contract | unit, tenant, start, end, rent amount, payment schedule, deposit, Ejar number, PDF, status (active, ending, renewed, ended) | Unit + tenant User |
| Invoice | contract, amount (SAR), due date, status (due, paid, late), paid at, method | Contract |
| Payment | invoice, amount, gateway reference, method (mada, Apple Pay, STC Pay, card, cash, transfer) | Invoice |
| Renewal offer | contract, new rent, new start and end, status (sent, accepted, declined) | Contract |
| Maintenance request | unit, tenant, category, description, photos or video, preferred time, assigned staff, status, cost, rating | Unit |
| Service | name (ar, en), description, price, tenant price, active | Office |
| Booking | service, customer user, time, address, price, payment status, assigned staff, status | Service |
| Announcement | title, body, target (all or specific buildings), sent at | Office |
| Message | thread between tenant and office, body, attachments | Office + User |
| Notification log | user, channel (WhatsApp, SMS, in-app), template, status | User |

Two more tables support the structure above: **Building assignment** (staff user, building, role: leasing or maintenance) for scoping staff to buildings, and **Subscription** (office, period start and end, units billed, rate, amount, payment status) for annual billing.

## Later features (not in MVP)

Design the data model so these can be added without a rewrite, but don't build them yet.

- Real Ejar API integration for contract registration and status
- Buy-now-pay-later rent splitting with Tabby or Tamara
- Digital contract signing inside the app
- Visitor and delivery gate passes (family visitors, Jahez or HungerStation drivers)
- Move-in and move-out inspections with photo checklists, tied to the deposit
- Water tank refill and gas delivery requests
- Amenity booking (gym, majlis hall, pool)
- Native iOS and Android apps (the MVP is a mobile-first web app)
- Owner view for property owners who use an office to manage their units
- Reports and exports for accounting

## Tech guidance and build order

A suggested stack, open to change if there's a good reason:

- **Frontend and backend:** Next.js with TypeScript, mobile-first, one codebase for all roles
- **Styling:** Tailwind CSS with logical properties so RTL and LTR both work cleanly
- **Translations:** next-intl or similar, Arabic as the default locale
- **Database:** PostgreSQL with Prisma, row-level scoping by `office_id`
- **Auth:** phone number + OTP for tenants and guests, email + password option for admins
- **Files:** object storage for contract PDFs and maintenance photos
- **External services behind interfaces:** payment gateway, SMS, WhatsApp, Ejar. Start each one with a mock implementation so the app runs end to end before any real integration is set up.

Build in this order, and get each phase working before moving on:

1. Project setup, i18n with Arabic RTL, auth with phone OTP (mocked SMS), roles and office scoping
2. Office admin: buildings, units, tenants, contracts
3. Tenant portal: login, my contract, announcements
4. Invoices generated from contracts, payments with a mock gateway, receipts
5. Maintenance requests, staff assignment, staff job view
6. Renewal reminders and offers, notification system (mock WhatsApp and SMS, real in-app)
7. Office dashboard with occupancy, collections, late payers, contracts ending, open jobs
8. Services page, public office link, guest booking
9. Swap mocks for real providers (payment gateway, SMS, WhatsApp)

Seed the database with one sample office, two buildings, about 20 units and a few tenants with contracts at different stages, so every screen has something to show.
