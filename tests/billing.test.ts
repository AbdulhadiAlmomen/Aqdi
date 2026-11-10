import Stripe from "stripe";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { users } from "@/db/schema";
import { markOfficeCancelled, markOfficePaid } from "@/lib/billing";
import { createOfficeWithAdmin, forOffice } from "@/lib/offices";
import { mockPayments } from "@/lib/payments/mock";
import { StripePayments } from "@/lib/payments/stripe";
import { priceBreakdown, yearlyTotal } from "@/lib/pricing";
import { createTestDb } from "./test-db";

describe("pricing (graduated brackets)", () => {
  it("matches the brief's totals", () => {
    expect(yearlyTotal(3)).toBe(150);
    expect(yearlyTotal(100)).toBe(5000);
    expect(yearlyTotal(150)).toBe(7000);
    expect(yearlyTotal(300)).toBe(13000);
    expect(yearlyTotal(500)).toBe(19000);
  });

  it("shows how the units split across brackets", () => {
    expect(priceBreakdown(150)).toEqual([
      { rate: 50, units: 100, total: 5000 },
      { rate: 40, units: 50, total: 2000 },
    ]);
  });
});

// Stripe's own test helper signs payloads with a made-up secret; no network, no real keys.
describe("Stripe webhook", () => {
  const secret = "whsec_test_not_a_real_secret";
  const payments = new StripePayments("sk_test_not_a_real_key", secret);
  const signer = new Stripe("sk_test_not_a_real_key");
  const event = (type: string, object: Record<string, unknown>) => JSON.stringify({ id: "evt_test", object: "event", type, data: { object } });
  const sign = (payload: string, withSecret = secret) => signer.webhooks.generateTestHeaderString({ payload, secret: withSecret });
  const completed = event("checkout.session.completed", {
    id: "cs_test_1", object: "checkout.session", status: "complete", payment_status: "paid",
    client_reference_id: "office-1", metadata: { officeId: "office-1", units: "150" }, customer: "cus_1", subscription: "sub_1",
  });

  it("knows it's in test mode with test keys", () => {
    expect(payments.testMode).toBe(true);
  });

  it("turns a signed, paid checkout into a payment for that office", async () => {
    expect(await payments.parseWebhook(completed, sign(completed))).toEqual({
      kind: "paid", officeId: "office-1", units: 150, customerId: "cus_1", subscriptionId: "sub_1",
    });
  });

  it("rejects a forged or unsigned call", async () => {
    await expect(payments.parseWebhook(completed, sign(completed, "whsec_someone_else"))).rejects.toThrow();
    await expect(payments.parseWebhook(completed, null)).rejects.toThrow();
    const tampered = completed.replace("office-1", "office-2");
    await expect(payments.parseWebhook(tampered, sign(completed))).rejects.toThrow();
  });

  it("ignores an unpaid checkout, and reports a cancelled subscription", async () => {
    const unpaid = event("checkout.session.completed", { status: "complete", payment_status: "unpaid", client_reference_id: "office-1", metadata: {} });
    expect(await payments.parseWebhook(unpaid, sign(unpaid))).toEqual({ kind: "ignored" });
    const ended = event("customer.subscription.deleted", { id: "sub_1", object: "subscription", metadata: { officeId: "office-1" } });
    expect(await payments.parseWebhook(ended, sign(ended))).toEqual({ kind: "cancelled", officeId: "office-1" });
  });

  it("refuses every webhook when no signing secret is configured", async () => {
    await expect(new StripePayments("sk_test_x", undefined).parseWebhook(completed, sign(completed))).rejects.toThrow();
  });
});

describe("billing records", () => {
  let t: Awaited<ReturnType<typeof createTestDb>>;
  let officeId: string;
  beforeAll(async () => {
    t = await createTestDb();
    await t.db.insert(users).values({ id: "u1", name: "Owner", email: "o@example.test" });
    officeId = (await createOfficeWithAdmin(t.db, "u1", "Office")).id;
  });
  afterAll(() => t.close());

  it("marks an office paid (twice is harmless) and back to free when cancelled", async () => {
    const office = forOffice(t.db, officeId);
    expect((await office.office())?.paid).toBe(false);
    const payment = { officeId, units: 150, customerId: "cus_1", subscriptionId: "sub_1" };
    await markOfficePaid(t.db, payment);
    await markOfficePaid(t.db, payment);
    expect(await office.office()).toMatchObject({ paid: true, paidUnits: 150, stripeSubscriptionId: "sub_1" });
    await markOfficeCancelled(t.db, officeId);
    expect((await office.office())?.paid).toBe(false);
  });

  it("the mock provider round-trips a checkout", async () => {
    const url = await mockPayments.startCheckout({ officeId, units: 12, email: "o@example.test", successUrl: "https://x/return?session_id={SESSION_ID}", cancelUrl: "https://x" });
    const sessionId = decodeURIComponent(new URL(url).searchParams.get("session_id")!);
    expect(await mockPayments.confirmCheckout(sessionId)).toEqual({ officeId, units: 12, customerId: null, subscriptionId: null });
  });
});
