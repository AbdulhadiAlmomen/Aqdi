import { boolean, date, index, integer, numeric, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
const newId = () => crypto.randomUUID();

// ---- Accounts (managed by Better Auth: users, sessions, accounts, verifications) ----

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)],
);

// One row per way of signing in. For email + password, `password` holds the argon2id hash.
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    password: text("password"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("accounts_user_id_idx").on(t.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("verifications_identifier_idx").on(t.identifier)],
);

// ---- Offices ----

// The paying account. Buildings, units, tenants and contracts hang off office_id.
export const offices = pgTable("offices", {
  id: text("id").primaryKey().$defaultFn(newId),
  name: text("name").notNull(),
  // Set when a subscription payment succeeds (lib/billing.ts). Free offices can import up to FREE_CONTRACT_LIMIT contracts.
  paid: boolean("paid").notNull().default(false),
  paidUnits: integer("paid_units"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const MEMBERSHIP_ROLES = ["admin", "staff"] as const;

// Who belongs to which office, and as what. Every office-owned row carries office_id.
export const memberships = pgTable(
  "memberships",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: text("office_id")
      .notNull()
      .references(() => offices.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: MEMBERSHIP_ROLES }).notNull().default("admin"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("memberships_office_user_idx").on(t.officeId, t.userId),
    index("memberships_user_id_idx").on(t.userId),
  ],
);

// ---- Properties and leases (all office-owned: every row carries office_id) ----

const officeId = () =>
  text("office_id")
    .notNull()
    .references(() => offices.id, { onDelete: "cascade" });

// One building per title deed (or, without a deed number, per national address).
export const buildings = pgTable(
  "buildings",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: officeId(),
    city: text("city"),
    district: text("district"),
    street: text("street"),
    buildingNumber: text("building_number"),
    postalCode: text("postal_code"),
    additionalNumber: text("additional_number"),
    deedNumber: text("deed_number"),
    createdAt: createdAt(),
  },
  (t) => [index("buildings_office_idx").on(t.officeId)],
);

export const units = pgTable(
  "units",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: officeId(),
    buildingId: text("building_id")
      .notNull()
      .references(() => buildings.id, { onDelete: "cascade" }),
    unitNumber: text("unit_number").notNull(),
    unitType: text("unit_type"),
    floor: text("floor"),
    areaSqm: numeric("area_sqm", { precision: 10, scale: 2 }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("units_building_number_idx").on(t.buildingId, t.unitNumber), index("units_office_idx").on(t.officeId)],
);

export const ID_TYPES = ["national_id", "iqama", "other"] as const;

// Only the last 4 digits of the ID or iqama number are ever stored.
export const tenants = pgTable(
  "tenants",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: officeId(),
    name: text("name").notNull(),
    nationality: text("nationality"),
    idType: text("id_type", { enum: ID_TYPES }).notNull(),
    idLast4: text("id_last4").notNull(),
    mobile: text("mobile").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("tenants_office_idx").on(t.officeId)],
);

export const PAYMENT_CYCLES = ["monthly", "quarterly", "semi_annual", "annual", "other"] as const;

export const contracts = pgTable(
  "contracts",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: officeId(),
    unitId: text("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    contractNumber: text("contract_number").notNull(),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    annualRent: numeric("annual_rent", { precision: 12, scale: 2 }).notNull(),
    paymentCycle: text("payment_cycle", { enum: PAYMENT_CYCLES }).notNull(),
    source: text("source").notNull().default("ejar_import"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("contracts_office_number_idx").on(t.officeId, t.contractNumber), index("contracts_unit_idx").on(t.unitId)],
);

export const installments = pgTable(
  "installments",
  {
    id: text("id").primaryKey().$defaultFn(newId),
    officeId: officeId(),
    contractId: text("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  },
  (t) => [index("installments_contract_idx").on(t.contractId)],
);
