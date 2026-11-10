import Link from "next/link";
import { Suspense } from "react";
import { currentOffice } from "@/lib/dal";
import { T } from "@/lib/i18n";
import { FREE_CONTRACT_LIMIT } from "@/lib/offices";
import { ImportFlow } from "./ImportFlow";

// Reading a contract with AI can take a while; allow the page's server actions up to 5 minutes.
export const maxDuration = 300;

export default function ImportPage() {
  return (
    <>

        <h1>
          <T k="import.title" />
        </h1>
        <p className="dash-lede">
          <T k="import.subtitle" />
        </p>
        <Suspense fallback={<p className="dash-loading"><T k="dashboard.loading" /></p>}>
          <ImportGate />
        </Suspense>
    </>
  );
}

async function ImportGate() {
  const { data } = await currentOffice();
  const office = await data.office();
  const used = await data.contractCount();
  const left = office?.paid ? null : Math.max(0, FREE_CONTRACT_LIMIT - used);
  if (left === 0) {
    return (
      <div className="limit-box">
        <p className="form-error">
          <T k="import.limitReached" vars={{ limit: String(FREE_CONTRACT_LIMIT) }} />
        </p>
        <Link href="/dashboard/billing" className="btn btn-primary">
          <T k="dashboard.upgrade" />
        </Link>
      </div>
    );
  }
  return (
    <>
      {left !== null && (
        <p className="dash-muted">
          <T k="dashboard.freeLeft" vars={{ used: String(used), limit: String(FREE_CONTRACT_LIMIT) }} />
        </p>
      )}
      <ImportFlow />
    </>
  );
}
