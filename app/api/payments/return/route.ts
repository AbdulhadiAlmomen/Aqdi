import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/db";
import { markOfficePaid } from "@/lib/billing";
import { getCurrentMember } from "@/lib/dal";
import { getPaymentProvider } from "@/lib/payments/provider";

// Where the payment page sends the office back. Checks the payment with the provider (never trusting
// the URL alone) and upgrades the office right away; the webhook does the same, whichever comes first.
export async function GET(request: NextRequest) {
  const back = (status: string) => NextResponse.redirect(new URL(`/dashboard/billing?status=${status}`, request.url));
  const member = await getCurrentMember();
  if (!member) return NextResponse.redirect(new URL("/login", request.url));

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) return back("failed");
  try {
    const payment = await (await getPaymentProvider()).confirmCheckout(sessionId);
    // A paid session for some other office doesn't upgrade this one.
    if (!payment || payment.officeId !== member.officeId) return back("failed");
    await markOfficePaid(getDb(), payment);
    return back("paid");
  } catch (error) {
    console.error("payment check failed", error);
    return back("failed");
  }
}
