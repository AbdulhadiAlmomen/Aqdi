import Link from "next/link";
import { Suspense } from "react";
import { currentOffice } from "@/lib/dal";
import { T } from "@/lib/i18n";
import { FREE_CONTRACT_LIMIT } from "@/lib/offices";
import { getPaymentProvider } from "@/lib/payments/provider";
import { BillingForm } from "./BillingForm";

export default function BillingPage({ searchParams }: PageProps<"/dashboard/billing">) {
  return (
    <>

        <h1>
          <T k="billing.title" />
        </h1>
        <Suspense fallback={<p className="dash-loading"><T k="dashboard.loading" /></p>}>
          <BillingContent searchParams={searchParams} />
        </Suspense>
    </>
  );
}

async function BillingContent({ searchParams }: { searchParams: PageProps<"/dashboard/billing">["searchParams"] }) {
  const { status } = await searchParams;
  const { data } = await currentOffice();
  const [office, unitCount] = await Promise.all([data.office(), data.unitCount()]);
  const testMode = await getPaymentProvider().then((p) => p.testMode).catch(() => false);

  return (
    <>
      {status === "paid" && <p className="notice notice-ok"><T k="billing.success" /></p>}
      {status === "cancelled" && <p className="notice"><T k="billing.cancelled" /></p>}
      {status === "failed" && <p className="form-error"><T k="billing.verifyFailed" /></p>}

      {office?.paid ? (
        <section className="dash-card billing-paid">
          <p className="dash-eyebrow">
            <T k="billing.paidTitle" />
          </p>
          <p className="dash-big">
            <T k="billing.paidBody" vars={{ units: String(office.paidUnits ?? unitCount) }} />
          </p>
          <Link href="/dashboard/import" className="btn btn-primary">
            <T k="dashboard.import" />
          </Link>
        </section>
      ) : null}

      {/* While payments are in test mode, a paid office (like the demo) can still try checkout.
          With live keys this is hidden: changing a live plan needs a subscription update instead. */}
      {office?.paid && testMode && (
        <section className="billing-retry">
          <h2 className="dash-h2">
            <T k="billing.retryTitle" />
          </h2>
          <p className="dash-muted">
            <T k="billing.retryBody" />
          </p>
          <BillingForm defaultUnits={office.paidUnits ?? Math.max(1, unitCount)} testMode />
        </section>
      )}

      {!office?.paid && (
        <>
          <p className="dash-lede">
            <T k="billing.free" vars={{ limit: String(FREE_CONTRACT_LIMIT) }} />
          </p>
          <BillingForm defaultUnits={Math.max(1, unitCount)} testMode={testMode} />
        </>
      )}
    </>
  );
}
