import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { markOfficeCancelled, markOfficePaid } from "@/lib/billing";
import { getPaymentProvider } from "@/lib/payments/provider";

// Stripe calls this when a checkout completes or a subscription ends. The signature is checked against
// STRIPE_WEBHOOK_SECRET before anything is trusted, so only Stripe can mark an office as paid here.
export async function POST(request: Request) {
  const body = await request.text();
  let outcome;
  try {
    outcome = await (await getPaymentProvider()).parseWebhook(body, request.headers.get("stripe-signature"));
  } catch (error) {
    console.error("rejected webhook:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "invalid webhook" }, { status: 400 });
  }

  if (outcome.kind === "paid") await markOfficePaid(getDb(), outcome);
  if (outcome.kind === "cancelled") await markOfficeCancelled(getDb(), outcome.officeId);
  return NextResponse.json({ received: true });
}
