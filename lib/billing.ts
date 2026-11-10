import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { offices } from "@/db/schema";
import type { Payment } from "@/lib/payments/provider";

// Marks an office as paying. Safe to run more than once for the same payment: the success page and
// the Stripe webhook both call it, whichever arrives first.
export async function markOfficePaid(db: Db, payment: Payment) {
  await db
    .update(offices)
    .set({
      paid: true,
      paidUnits: payment.units || null,
      paidAt: new Date(),
      stripeCustomerId: payment.customerId,
      stripeSubscriptionId: payment.subscriptionId,
    })
    .where(eq(offices.id, payment.officeId));
}

// The subscription ended (cancelled in Stripe): back to the free plan. Imported data stays.
export async function markOfficeCancelled(db: Db, officeId: string) {
  await db.update(offices).set({ paid: false }).where(eq(offices.id, officeId));
}
