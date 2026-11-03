# Aqdi: Contract Import and Tenant Access

How an office gets its leases into Aqdi in minutes, and how its tenants get in without a password. This is a copy of the planning doc; don't rewrite it on your own.

## The flow at a glance

```
OFFICE:  Upload Ejar PDFs  ->  AI reads and groups  ->  Office reviews
         (one folder)          (by building and unit)   (fixes flagged fields)
                                                              |
                                          office clicks approve, invites go out
                                                              |
TENANT:  WhatsApp invite  ->  Taps the link  ->  SMS code  ->  Logged in
         (SMS if it fails)    (expires 7 days)   (+ last 4 of ID)  (stays 90 days)
```

## Part 1: Importing Ejar contracts

The office uploads its Ejar PDFs once, and Aqdi builds its buildings, units, tenants and rent schedules from them. Nothing is saved until the office approves it.

1. **Upload.** The office drags in a folder of Ejar lease PDFs, one or a few hundred.
2. **Read.** AI reads each contract separately and pulls out the fields below.
3. **Group.** Contracts are grouped into buildings by the property's national address or title deed number, then into units by unit number. If a building doesn't exist in Aqdi yet, it's created.
4. **Clean up.** If one unit has two contracts (last year's and this year's), Aqdi keeps the active one and marks the old one as history.
5. **Review.** The office sees everything in one table. Any field the AI is unsure about, or that's missing, is highlighted in amber.
6. **Approve.** The office fixes the highlighted fields and clicks approve. Only then is anything saved.

**What AI reads from each Ejar contract**

| Group | Fields | Always there? |
| --- | --- | --- |
| Tenant | Name, nationality, ID type and number, mobile | Yes |
| Tenant | Email | Often empty |
| Property | National address, title deed number | Yes |
| Unit | Unit type, unit number, floor, area | Yes |
| Lease | Start and end date, annual rent | Yes |
| Payments | Payment cycle, number of payments, amount of each | Yes |

The mobile number is the field Aqdi relies on. Email is optional because many contracts leave it blank.

**Why typed Ejar PDFs, not notebook photos:** official Ejar PDFs have the same layout every time, so AI reads them very reliably. Handwritten notebooks are too risky for rent amounts and dates, so they're not part of the first version.

## Part 2: Giving tenants access

Tenants never sign up and never make a password. Their account already exists from the contract; they just confirm it's them with a code.

1. **Account created.** When the office approves the import, Aqdi creates each tenant's account, linked to their unit and the mobile number on the contract.
2. **Office sends invites.** One button sends every tenant an invite, or the office can pick which ones.
3. **Invite on WhatsApp.** The message comes in the office's name: "Al Noor Real Estate has added you to Aqdi. See your contract and pay rent here: [link]." If WhatsApp fails, the same invite goes by SMS.
4. **Tenant taps the link.** The link only works for that phone number and expires after 7 days.
5. **Code by SMS.** Aqdi sends a 6-digit code by SMS from the registered sender name "Aqdi". Most phones fill it in automatically.
6. **Extra check, first time only.** The tenant enters the last 4 digits of their ID or iqama, which Aqdi already has from the contract.
7. **In.** The tenant sees their contract, payments and maintenance. They stay logged in for 90 days, and can add Aqdi to their home screen like an app.

**Logging in later:** enter phone number, get an SMS code, done.

**Which channel does what**

| Message | Channel | Why |
| --- | --- | --- |
| Login codes | SMS | Standard for codes in Saudi; banks and apps all use it |
| Invites, rent reminders, repair updates, announcements | WhatsApp | Everyone reads it; can include buttons like "Pay rent" |
| Backup when WhatsApp fails | SMS | Reaches every phone |

**Setup needed:** a registered SMS sender name with the CST (about 230 SAR, a few weeks, needs a Saudi commercial registration), and an approved WhatsApp Business account with message templates approved by Meta. Use one provider that handles both (for example Unifonic), so it's one account, one integration and one bill.

**Nothing here is manual.** Codes are sent automatically when the tenant asks to log in, and most phones fill them in with one tap. If WhatsApp doesn't deliver, the provider switches to SMS on its own. You only pay for the SMS that actually get sent. The office only steps in if both fail, which means the number is wrong: it fixes the number and taps resend.

## Edge cases

| What happens | What Aqdi does |
| --- | --- |
| Tenant changed their number | Invite fails, the office sees "not delivered" and updates the number, then resends |
| Tenant has no WhatsApp | Invite goes by SMS automatically |
| Family members want access | Tenant adds up to 2 extra numbers to their unit, each confirmed by SMS code |
| Lease is in a company's name | Use the tenant representative's mobile from the contract, or the office enters the resident's number |
| Contract field missing or unclear | Highlighted on the review screen; nothing saved until the office fills it |
| Same unit, two contracts | Active one kept, older one stored as history |
| PDF is a scan, not text | AI still reads it; more fields may be flagged for review |

## Check before building

- [ ] Can the office download all its contracts from Ejar as PDFs easily, or is it one at a time?
- [ ] Are most of their contracts typed PDFs, or scans and photos?
- [ ] Is the mobile number on the contract usually still correct?
- [ ] Will the office agree to Aqdi messaging its tenants in the office's name?

**Privacy:** contracts contain ID and iqama numbers. Store them encrypted and only show the last 4 digits in the app, in line with Saudi's Personal Data Protection Law.
