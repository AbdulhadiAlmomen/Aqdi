"use client";

import { useActionState, useEffect, useState } from "react";
import { startCheckout, type CheckoutState } from "@/app/actions/billing";
import { T, type MessageKey } from "@/lib/i18n";
import { MAX_UNITS, priceBreakdown, yearlyTotal } from "@/lib/pricing";

const SAR = new Intl.NumberFormat("en-US");

// Units in, yearly total out (same brackets as the homepage), then off to the payment page.
export function BillingForm({ defaultUnits, testMode }: { defaultUnits: number; testMode: boolean }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(startCheckout, {});
  const [units, setUnits] = useState(String(defaultUnits));
  const n = Math.floor(Number(units));
  const valid = Number.isInteger(n) && n >= 1 && n <= MAX_UNITS;
  const leaving = !!state.url;

  // Off to the payment page with a full page load.
  useEffect(() => {
    if (state.url) window.location.assign(state.url);
  }, [state.url]);

  return (
    <form action={action} className="billing-form">
      <label className="form-field">
        <span className="form-label">
          <T k="billing.units" />
        </span>
        <input name="units" type="number" inputMode="numeric" min={1} max={MAX_UNITS} value={units} onChange={(e) => setUnits(e.target.value)} dir="ltr" />
        <small className="form-hint">
          <T k="billing.unitsHint" />
        </small>
      </label>

      <div className="billing-total">
        <span className="form-label">
          <T k="billing.total" />
        </span>
        <b>{valid ? <T k="currency" vars={{ amount: SAR.format(yearlyTotal(n)) }} /> : "—"}</b>
        {valid && (
          <ul>
            {priceBreakdown(n).map((row) => (
              <li key={row.rate}>
                <T k="billing.tier" vars={{ units: SAR.format(row.units), rate: String(row.rate), total: SAR.format(row.total) }} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          <T k={`billing.${state.error}` as MessageKey} />
        </p>
      )}
      <button type="submit" className="btn btn-primary form-submit" disabled={!valid || pending || leaving}>
        <T k={pending || leaving ? "common.wait" : "billing.pay"} />
      </button>
      {testMode && (
        <p className="billing-test">
          <T k="billing.testMode" />
        </p>
      )}
    </form>
  );
}
