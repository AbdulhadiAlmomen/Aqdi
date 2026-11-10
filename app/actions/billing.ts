"use server";

import { headers } from "next/headers";
import { currentOffice } from "@/lib/dal";
import { getPaymentProvider, PaymentsNotConfigured } from "@/lib/payments/provider";
import { MAX_UNITS } from "@/lib/pricing";

export type CheckoutState = { url?: string; error?: "unitsInvalid" | "notConfigured" | "failed" };

// Starts the payment for the office's yearly subscription, priced by number of units, and returns the
// payment page URL. The browser goes there with a full page load (it's another site, e.g. Stripe Checkout).
export async function startCheckout(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const { member, data } = await currentOffice();
  const units = Number(form.get("units"));
  if (!Number.isInteger(units) || units < 1 || units > MAX_UNITS) return { error: "unitsInvalid" };

  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  let url: string;
  try {
    const payments = await getPaymentProvider();
    // A paid office checks out again only in test mode (the demo); a live plan change needs a subscription update.
    if (!payments.testMode && (await data.office())?.paid) return { error: "failed" };
    url = await payments.startCheckout({
      officeId: member.officeId,
      units,
      email: member.email,
      successUrl: `${origin}/api/payments/return?session_id={SESSION_ID}`,
      cancelUrl: `${origin}/dashboard/billing?status=cancelled`,
    });
  } catch (error) {
    if (error instanceof PaymentsNotConfigured) return { error: "notConfigured" };
    console.error("checkout could not start", error);
    return { error: "failed" };
  }
  return { url };
}
