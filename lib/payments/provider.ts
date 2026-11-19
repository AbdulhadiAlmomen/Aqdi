// Subscription payments, behind an interface. Stripe (test mode) for this version; the real launch
// will use a Saudi gateway (Tap or Moyasar), since Stripe isn't available to Saudi-registered companies.

export type CheckoutInput = {
  officeId: string;
  units: number;
  email: string;
  successUrl: string; // must contain {SESSION_ID}, replaced by the provider
  cancelUrl: string;
};

// The one-time $1 live payment check (demo account only). Never touches the subscription or plan.
export const DEMO_CHARGE = { cents: 100, currency: "usd" } as const;
export const DEMO_CHARGE_KIND = "demo_charge";
export type DemoChargeInput = { officeId: string; email: string; successUrl: string; cancelUrl: string };
export type DemoCharge = { officeId: string; cents: number; currency: string };

export type Payment = { officeId: string; units: number; customerId: string | null; subscriptionId: string | null };

export type WebhookOutcome = ({ kind: "paid" } & Payment) | { kind: "cancelled"; officeId: string } | { kind: "ignored" };

export interface PaymentProvider {
  // True when no real money can move (Stripe test keys, or the mock).
  readonly testMode: boolean;
  // Where to send the office to pay.
  startCheckout(input: CheckoutInput): Promise<string>;
  // The finished checkout behind a session id, or null if it isn't paid.
  confirmCheckout(sessionId: string): Promise<Payment | null>;
  // The $1 live payment check: where to pay, and the paid charge behind a session id (or null).
  startDemoCharge(input: DemoChargeInput): Promise<string>;
  confirmDemoCharge(sessionId: string): Promise<DemoCharge | null>;
  // A verified webhook call, turned into what it means for an office. Throws if the signature is wrong.
  parseWebhook(body: string, signature: string | null): Promise<WebhookOutcome>;
}

export class PaymentsNotConfigured extends Error {}

export async function getPaymentProvider(): Promise<PaymentProvider> {
  if (process.env.AQDI_MOCK_PAYMENTS === "1") {
    const { mockPayments } = await import("./mock");
    return mockPayments;
  }
  if (!process.env.STRIPE_SECRET_KEY) throw new PaymentsNotConfigured("STRIPE_SECRET_KEY is not set");
  const { StripePayments } = await import("./stripe");
  return new StripePayments(process.env.STRIPE_SECRET_KEY, process.env.STRIPE_WEBHOOK_SECRET);
}
