# Aqdi (عقدي): Product Brief v2

Updated 5 Nov 2026. This is a copy of the planning doc in Claude chat. Why things are the way they are: `docs/DECISIONS.md`. Import and login details: `docs/IMPORT_AND_ACCESS.md`.

## 1. What Aqdi is

**Aqdi is the daily operating system for small and mid-size Saudi real estate offices that manage buildings for owners.** It works on top of Ejar, not instead of it.

**The problem.** Ejar already handles contract registration, renewals, official notices, and rent payment for residential leases (since 15 Jan 2024, residential rent must be paid through Ejar's channels: mada or SADAD biller 153). What Ejar doesn't do is run the office. Someone still chases late tenants, sends technicians, reports to each building owner, and answers tenant questions, mostly on WhatsApp and Excel.

**The message.** Fewer calls for the office, full clarity for the owner. Landing page copy: `docs/LANDING_COPY.md`.

**What Aqdi does**
1. The office uploads its Ejar lease PDFs. AI sets up every building, unit, tenant and rent schedule in minutes; the office confirms anything flagged.
2. One dashboard for every building: who's paid, who's late, which leases end soon, what's broken.
3. Rent tracking against each lease's schedule, with automatic WhatsApp reminders to late tenants.
4. Maintenance: tenant reports a problem, office assigns a technician, cost is recorded.
5. Monthly owner statements: income, late payments, vacancies and repair costs per owner, as a PDF.
6. Tenants get a WhatsApp link to report repairs, read announcements, message the office, and see their lease and rent schedule.

**What Aqdi does not do**
- Collect or move residential rent. Tenants pay through Ejar; Aqdi tracks it.
- Register, renew or replace contracts. That stays in Ejar.
- Run a services marketplace (cleaning, AC, moving). Postponed.

**Who pays.** The office, once a year, per unit. Tenants and owners never pay.

## 2. First customer

A licensed office managing **30 to 300 units for several owners**, in one city, running operations on WhatsApp and Excel. Not leasing-only brokers, not large developers.

## 3. Users and roles

| Role | Who | Sees |
| --- | --- | --- |
| Office manager | Runs the office | Everything across all buildings |
| Leasing staff | Handles tenants and renewals | Assigned buildings: tenants, leases, rent status |
| Maintenance staff | Haris or technician | Only jobs for assigned buildings |
| Tenant | Person on the lease | Own lease, rent schedule and status, repairs, announcements, messages |
| Owner | Owns buildings the office manages | No login in v1; receives monthly PDF statement |
| Aqdi admin (internal) | Aqdi team | Offices, import review queue, subscriptions, audited support access |

The office is the account. An office has many owners and buildings; each building has one owner. Staff are assigned to all or some buildings. New maintenance requests go to the maintenance staff of that building.

## 4. Pricing and billing

- One yearly payment per office, based on units in the system (rented or vacant), across all buildings.
- 50 SAR per unit per year for the first 100 units, 40 for units 101 to 300, 30 above 300, bracketed like tax. No minimum. Example: 150 units = 7,000 SAR.
- Billing year starts at signup. Units added mid-year are free until renewal; recount at renewal. Removed units are not refunded.
- Prices exclude 15% VAT. Aqdi must issue ZATCA-compliant e-invoices for its own subscriptions.
- Pay by Saudi gateway (Tap or Moyasar, mada supported) or bank transfer. Stripe is not available to Saudi companies.
- Pilot offer: 60 days free with agreed success goals, then a founding price (about 30% off) locked for 2 years.
- Website calculator shows the bracket breakdown so pricing never feels like a trick.

## 5. Onboarding

Details in `docs/IMPORT_AND_ACCESS.md`. Summary: upload Ejar PDFs or Excel, AI extracts, code validates, office reviews flagged fields, approves, then tenants get a WhatsApp invite and log in with an SMS code. The founder sets up data for the first 10 offices.

## 6. App structure

- Login screen (phone + SMS code; admins can also use email + password), then the right view for the role: office dashboard, staff job list, or tenant portal.
- Tenants normally arrive through a WhatsApp link, not the homepage.
- No public services page in v1.

## 7. MVP features

The first version needs: AI import, portfolio dashboard, rent tracking with reminders, renewal pipeline, maintenance, owner statements, light tenant portal.

### Office
- **Import:** AI import of Ejar PDFs and Excel import, both with a review screen.
- **Properties:** owners, buildings, units (number, floor, type, size, status).
- **Leases:** created from import, editable. Ejar contract number stored and unique per office.
- **Rent tracking:** installments generated from each lease's payment schedule; status due, paid, late. Paid is set by the office manually, or by uploading Ejar's payment report (format to confirm with pilot offices). Later: Ejar integration.
- **Late reminders:** WhatsApp message to the tenant N days after due (office sets N), with how to pay through Ejar.
- **Renewal pipeline:** leases ending in 90 / 60 / 30 days, auto-renew flag, office notes. The renewal itself happens in Ejar; Aqdi tracks and reminds.
- **Maintenance:** requests with photos, auto-assigned by building, status, cost, rating.
- **Owner approvals:** the office sets a cost limit per owner. Any repair above it is sent to the owner by WhatsApp with the photo and price; he approves or rejects with one tap. The decision is logged.
- **Owner statements:** per owner per month: rent expected vs received, late tenants, vacancies, maintenance cost, office notes. PDF, sent by WhatsApp or email.
- **Announcements and messages:** to one building or all; message threads with tenants.
- **Dashboard home and reports (free, no add-on):** collected vs expected this month, collection rate over time, late list, vacancy days, maintenance cost per building, repeat repairs, leases ending soon. Charts, in both languages.
- **Renewal rent check:** for leases ending in 90 days, show the unit's rent next to the district average for that unit type from Ejar's public rental index (rei.rega.gov.sa). No API exists, so in v1 the Aqdi team keeps a district table for the pilot city, updated quarterly. Check the index's terms of use before relying on it.

### Tenant (through WhatsApp link)
- Lease details (read-only) with a note that the official copy is in the Ejar app.
- Rent schedule and status, plus how to pay (Ejar app, mada, or SADAD 153).
- Repair request with photo, and its status.
- Announcements and messages with the office.

### Maintenance staff
- Mobile list of assigned jobs; update status, add photo and note, mark done.

### Aqdi admin
- Offices and subscription status, import review queue, audited support access.

## 8. Saudi-specific requirements

- **Arabic first**, full RTL, English toggle. All text through i18n.
- **Dates:** Hijri first, then Gregorian with month name. English "1 Rajab 1448 · 10 Dec 2026". Arabic "١ رجب ١٤٤٨هـ · 10 ديسمبر 2026م": Hijri in Arabic digits (`ar-SA-u-ca-islamic-umalqura-nu-arab`), Gregorian in Western digits (`ar-SA-u-ca-gregory-nu-latn`).
- **Numbers and money:** Western digits with a normal comma in both languages, e.g. "5,000 ريال" (`ar-SA-u-nu-latn`).
- **Login:** Saudi mobile + SMS code from a registered sender name, plus last 4 digits of national ID (starts with 1) or iqama (starts with 2) on first login.
- **Messaging:** WhatsApp for invites, reminders, updates; SMS for codes and automatic fallback; one provider (e.g. Unifonic).
- **Rent:** residential rent goes through Ejar only. Aqdi never holds tenant money.
- **Ejar:** no public API. Integration is by application (keyaccounts@nhc.sa) and needs a licensed real estate partner; months, not weeks. v1 works from PDFs and reports.
- **Privacy (PDPL):** ID and iqama numbers encrypted, only last 4 shown. Legal review on hosting location before the pilot.

## 9. Data model

Every table except `users` has `office_id`; every query filters by it.

| Entity | Key fields |
| --- | --- |
| Office | name (ar, en), CR number, logo, plan |
| User | phone, name, email (optional), language |
| Membership | user, office, role (manager, leasing, maintenance, tenant) |
| BuildingAssignment | staff user, building, role |
| Owner | name, phone, email, statement preferences |
| Building | owner, name, city, district, national address, deed number |
| Unit | building, number, floor, type, size, status |
| Lease | unit, tenant user, Ejar number, start, end, annual rent, payment cycle, deposit, auto-renew, PDF |
| RentInstallment | lease, due date, amount, status (due, paid, late) |
| PaymentRecord | installment, amount, date, source (manual, ejar_report, integration), evidence file |
| MaintenanceRequest | unit, tenant, category, description, photos, assignee, status, cost, rating |
| OwnerStatement | owner, month, figures snapshot, PDF, sent at |
| Announcement, Message | target or thread, body, attachments |
| ImportBatch, ImportItem | source PDF, extracted JSON, confidence per field, validation errors, review status, edits |
| NotificationLog | user, channel (whatsapp, sms), template, status |
| Subscription | office, period, units billed, amount, invoice, payment status |
| AuditLog | who, what, when, before and after |

## 10. Later or postponed

- Official Ejar integration (apply early through a licensed partner).
- AI tier: drafting tenant replies, renewal follow-ups, monthly Arabic summary, "ask your portfolio" questions (paid add-on).
- Package handling: either a partnership with RedBox Community lockers or a haris package log (photo, WhatsApp alert, pickup code). Only if interviews show offices hear complaints about it.
- Owner login portal.
- Services marketplace and public booking page.
- Rent financing partner (e.g. Ejari).
- Accounting, native apps, reading handwritten notebooks.

## 11. Tech and build order

Stack: Next.js + TypeScript, Tailwind with logical properties for RTL, next-intl (Arabic default), PostgreSQL via Supabase with office scoping, object storage for PDFs and photos, Claude Sonnet 5.5 for contract reading and Haiku 5.5 for small tasks, one WhatsApp + SMS provider, Tap or Moyasar for subscriptions. All external services behind interfaces with mocks first.

Build order (each phase working before the next):

0. **Discovery first.** No product code beyond the import prototype until office interviews confirm the pain (see the assessment).
1. Import prototype: extraction, validation rules, review screen, tested on 30 to 50 real Ejar PDFs with accuracy measured per field.
2. Setup: auth (mocked SMS), roles, office scoping, i18n with RTL.
3. Office core: owners, buildings, units, tenants, leases from import; Excel import.
4. Rent tracking, late reminders (mocked WhatsApp), renewal pipeline.
5. Maintenance, staff job view, light tenant portal with WhatsApp-link login.
6. Owner statements.
7. Dashboard home and Aqdi admin.
8. Real providers (messaging, subscription payments) and pilot hardening.

Seed data: one office, two owners, three buildings, about 30 units, leases at different stages, some late installments, a few open repairs.
