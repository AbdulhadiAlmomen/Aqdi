"use client";

import { useActionState, useEffect } from "react";
import { startDemoCharge, type CheckoutState } from "@/app/actions/billing";
import { T, type MessageKey } from "@/lib/i18n";

// The $1 live payment check button (demo account only), then off to Stripe with a full page load.
export function DemoChargeForm({ testMode }: { testMode: boolean }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startDemoCharge, {});
  const leaving = !!state.url;
  useEffect(() => {
    if (state.url) window.location.assign(state.url);
  }, [state.url]);

  return (
    <form action={action} className="demo-charge-form">
      {state.error && (
        <p className="form-error" role="alert">
          <T k={`billing.${state.error}` as MessageKey} />
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={pending || leaving}>
        <T k={pending || leaving ? "common.wait" : "billing.demo.pay"} />
      </button>
      <p className={testMode ? "billing-test" : "demo-live"}>
        <T k={testMode ? "billing.testMode" : "billing.demo.live"} />
      </p>
    </form>
  );
}
