import type { PaymentProvider } from "./provider";

// Local work and browser tests without Stripe (AQDI_MOCK_PAYMENTS=1): checkout "succeeds" at once by
// sending the visitor straight to the success URL with a made-up session id.
export const mockPayments: PaymentProvider = {
  testMode: true,
  async startCheckout({ officeId, units, successUrl }) {
    return successUrl.replace("{SESSION_ID}", encodeURIComponent(`mock_${officeId}_${units}`));
  },
  async confirmCheckout(sessionId) {
    const match = /^mock_(.+)_(\d+)$/.exec(sessionId);
    return match ? { officeId: match[1], units: Number(match[2]), customerId: null, subscriptionId: null } : null;
  },
  async parseWebhook() {
    return { kind: "ignored" };
  },
};
