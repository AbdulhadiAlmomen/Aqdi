import { NextResponse, type NextRequest } from "next/server";
import { getCurrentMember } from "@/lib/dal";
import { isDemoAccount } from "@/lib/demo-account";
import { getPaymentProvider } from "@/lib/payments/provider";

// Back from the $1 live payment check. Confirms the charge with the provider (never the URL alone) and
// shows the result. Nothing is written: the charge doesn't change the office's plan.
export async function GET(request: NextRequest) {
  const back = (status: string) => NextResponse.redirect(new URL(`/dashboard/billing?status=${status}`, request.url));
  const member = await getCurrentMember();
  if (!member) return NextResponse.redirect(new URL("/login", request.url));
  if (!isDemoAccount(member.email)) return back("demo_failed");

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) return back("demo_failed");
  try {
    const charge = await (await getPaymentProvider()).confirmDemoCharge(sessionId);
    return back(charge && charge.officeId === member.officeId ? "demo_paid" : "demo_failed");
  } catch (error) {
    console.error("demo charge check failed", error);
    return back("demo_failed");
  }
}
