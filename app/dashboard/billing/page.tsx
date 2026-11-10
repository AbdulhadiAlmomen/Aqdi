import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { currentOffice } from "@/lib/dal";
import { T } from "@/lib/i18n";
import { FREE_CONTRACT_LIMIT } from "@/lib/offices";
import { getPaymentProvider } from "@/lib/payments/provider";
import { BillingForm } from "./BillingForm";

export default function BillingPage({ searchParams }: PageProps<"/dashboard/billing">) {
  return (
    <>
      <SiteHeader>
        <Link href="/dashboard" className="btn btn-text">
          <T k="import.back" />
        </Link>
      </SiteHeader>
      <main className="wrap dash">
        <h1>
          <T k="billing.title" />
        </h1>
        <Suspense fallback={<p className="dash-loading"><T k="dashboard.loading" /></p>}>
          <BillingContent searchParams={searchParams} />
        </Suspense>
      </main>
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
      ) : (
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
