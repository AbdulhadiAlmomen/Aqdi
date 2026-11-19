import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { isDemoAccount } from "@/lib/demo-account";
import { mockPayments } from "@/lib/payments/mock";
import { DEMO_CHARGE, DEMO_CHARGE_KIND } from "@/lib/payments/provider";
import { StripePayments } from "@/lib/payments/stripe";

describe("$1 live payment check", () => {
  it("is offered to the demo account only", () => {
    expect(isDemoAccount("demo@demo.com")).toBe(true);
    expect(isDemoAccount(" Demo@Demo.com ")).toBe(true);
    expect(isDemoAccount("owner@office.test")).toBe(false);
  });

  it("is one dollar", () => {
    expect(DEMO_CHARGE).toEqual({ cents: 100, currency: "usd" });
  });

  it("never upgrades an office through the webhook", async () => {
    const secret = "whsec_test_not_a_real_secret";
    const payments = new StripePayments("sk_test_not_a_real_key", secret);
    const signer = new Stripe("sk_test_not_a_real_key");
    const payload = JSON.stringify({
      id: "evt_demo", object: "event", type: "checkout.session.completed",
      data: { object: { id: "cs_test_demo", object: "checkout.session", mode: "payment", status: "complete", payment_status: "paid",
        client_reference_id: "office-1", metadata: { kind: DEMO_CHARGE_KIND, officeId: "office-1" }, amount_total: 100, currency: "usd" } },
    });
    const outcome = await payments.parseWebhook(payload, signer.webhooks.generateTestHeaderString({ payload, secret }));
    expect(outcome).toEqual({ kind: "ignored" });
  });

  it("round-trips through the mock provider", async () => {
    const url = await mockPayments.startDemoCharge({ officeId: "office-1", email: "demo@demo.com", successUrl: "https://x/back?session_id={SESSION_ID}", cancelUrl: "https://x" });
    const sessionId = decodeURIComponent(new URL(url).searchParams.get("session_id")!);
    expect(await mockPayments.confirmDemoCharge(sessionId)).toEqual({ officeId: "office-1", cents: 100, currency: "usd" });
    // A subscription session id is not a $1 charge, and the other way round.
    expect(await mockPayments.confirmDemoCharge("mock_office-1_3")).toBeNull();
    expect(await mockPayments.confirmCheckout(sessionId)).toBeNull();
  });
});
