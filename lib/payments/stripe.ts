import Stripe from "stripe";
import { BRACKETS } from "@/lib/pricing";
import { DEMO_CHARGE, DEMO_CHARGE_KIND, type CheckoutInput, type DemoChargeInput, type Payment, type PaymentProvider, type WebhookOutcome } from "./provider";

// The yearly per-unit price, found by this key or created on first use, so nothing has to be set up
// by hand in the Stripe dashboard. Bump the version suffix if the brackets change.
const PRICE_LOOKUP_KEY = "aqdi_yearly_per_unit_v1";
const CURRENCY = "sar";
// The separate $1 product for the live payment check (one-time, not a subscription).
const DEMO_LOOKUP_KEY = "aqdi_live_check_usd_1";

export class StripePayments implements PaymentProvider {
  readonly testMode: boolean;
  private stripe: Stripe;

  constructor(
    secretKey: string,
    private webhookSecret: string | undefined,
  ) {
    this.stripe = new Stripe(secretKey);
    this.testMode = secretKey.startsWith("sk_test_") || secretKey.startsWith("rk_test_");
  }

  private async priceId() {
    const found = await this.stripe.prices.list({ lookup_keys: [PRICE_LOOKUP_KEY], active: true, limit: 1 });
    if (found.data[0]) return found.data[0].id;
    const price = await this.stripe.prices.create({
      lookup_key: PRICE_LOOKUP_KEY,
      currency: CURRENCY,
      product_data: { name: "Aqdi yearly subscription (per unit)" },
      recurring: { interval: "year", usage_type: "licensed" },
      billing_scheme: "tiered",
      tiers_mode: "graduated",
      // Amounts in halalas (1 SAR = 100).
      tiers: BRACKETS.map((b) => ({ up_to: Number.isFinite(b.upTo) ? b.upTo : "inf", unit_amount: b.rate * 100 })),
    });
    return price.id;
  }

  private async demoPriceId() {
    const found = await this.stripe.prices.list({ lookup_keys: [DEMO_LOOKUP_KEY], active: true, limit: 1 });
    if (found.data[0]) return found.data[0].id;
    const price = await this.stripe.prices.create({
      lookup_key: DEMO_LOOKUP_KEY,
      currency: DEMO_CHARGE.currency,
      unit_amount: DEMO_CHARGE.cents,
      product_data: { name: "Aqdi live payment check" },
    });
    return price.id;
  }

  async startDemoCharge({ officeId, email, successUrl, cancelUrl }: DemoChargeInput) {
    const metadata = { kind: DEMO_CHARGE_KIND, officeId };
    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: await this.demoPriceId(), quantity: 1 }],
      customer_email: email,
      client_reference_id: officeId,
      metadata,
      payment_intent_data: { description: "Aqdi live payment check", metadata },
      success_url: successUrl.replace("{SESSION_ID}", "{CHECKOUT_SESSION_ID}"),
      cancel_url: cancelUrl,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return session.url;
  }

  async confirmDemoCharge(sessionId: string) {
    const s = await this.stripe.checkout.sessions.retrieve(sessionId);
    const officeId = s.metadata?.officeId;
    if (s.metadata?.kind !== DEMO_CHARGE_KIND || s.status !== "complete" || s.payment_status !== "paid" || !officeId) return null;
    return { officeId, cents: s.amount_total ?? DEMO_CHARGE.cents, currency: s.currency ?? DEMO_CHARGE.currency };
  }

  async startCheckout({ officeId, units, email, successUrl, cancelUrl }: CheckoutInput) {
    const metadata = { officeId, units: String(units) };
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: await this.priceId(), quantity: units }],
      customer_email: email,
      client_reference_id: officeId,
      metadata,
      subscription_data: { metadata },
      success_url: successUrl.replace("{SESSION_ID}", "{CHECKOUT_SESSION_ID}"),
      cancel_url: cancelUrl,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return session.url;
  }

  async confirmCheckout(sessionId: string) {
    return paidFrom(await this.stripe.checkout.sessions.retrieve(sessionId));
  }

  async parseWebhook(body: string, signature: string | null): Promise<WebhookOutcome> {
    if (!this.webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    if (!signature) throw new Error("missing Stripe-Signature header");
    const event = this.stripe.webhooks.constructEvent(body, signature, this.webhookSecret);
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const paid = paidFrom(event.data.object);
      return paid ? { kind: "paid", ...paid } : { kind: "ignored" };
    }
    if (event.type === "customer.subscription.deleted") {
      const officeId = event.data.object.metadata?.officeId;
      return officeId ? { kind: "cancelled", officeId } : { kind: "ignored" };
    }
    return { kind: "ignored" };
  }
}

function paidFrom(session: Stripe.Checkout.Session): Payment | null {
  // The $1 live payment check is a one-time charge, never a subscription payment.
  if (session.metadata?.kind === DEMO_CHARGE_KIND) return null;
  const officeId = session.client_reference_id ?? session.metadata?.officeId;
  const paid = session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
  if (!paid || !officeId) return null;
  const id = (v: string | { id: string } | null) => (typeof v === "string" ? v : (v?.id ?? null));
  return {
    officeId,
    units: Number(session.metadata?.units) || 0,
    customerId: id(session.customer),
    subscriptionId: id(session.subscription),
  };
}
