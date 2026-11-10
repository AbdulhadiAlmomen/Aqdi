"use client";

import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { saveContract, type SaveState } from "@/app/actions/import";
import { DualDate } from "@/components/DualDate";
import { BLOCKING, type Draft, type Flag, type Flags, type TextField } from "@/lib/contracts/checks";
import { isValidIsoDate } from "@/lib/dates";
import { messages, T, type MessageKey } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";

const CYCLES = ["monthly", "quarterly", "semi_annual", "annual", "other"] as const;
// Warnings from the first read stay visible after a save attempt; they don't block saving.
const WARNINGS: Flag[] = ["lowConfidence", "hijriMismatch", "idOther"];

function FlagList({ flags }: { flags?: Flag[] }) {
  if (!flags?.length) return null;
  return (
    <>
      {flags.map((f) => (
        <small key={f} className={BLOCKING.has(f) ? "flag flag-block" : "flag"}>
          <T k={`flag.${f}` as MessageKey} />
        </small>
      ))}
    </>
  );
}

function withWarnings(current: Flags, first: Flags): Flags {
  const out: Flags = { ...current };
  for (const [key, list] of Object.entries(first) as [keyof Flags, Flag[]][]) {
    const kept = list.filter((f) => WARNINGS.includes(f));
    if (kept.length) out[key] = [...new Set([...(out[key] ?? []), ...kept])];
  }
  return out;
}

const tone = (flags?: Flag[]) => (flags?.some((f) => BLOCKING.has(f)) ? " is-block" : flags?.length ? " is-warn" : "");

export function ReviewCard({ draft, flags: initialFlags, onDiscard }: { draft: Draft; flags: Flags; onDiscard: () => void }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveContract, {});
  const [values, setValues] = useState(draft.fields);
  const [rows, setRows] = useState(draft.installments);
  const [typedId, setTypedId] = useState("");
  const lang = useLang();

  // After a save attempt, the server's checks replace the first ones; the read's warnings stay.
  const flags: Flags = state.flags ? withWarnings(state.flags, initialFlags) : initialFlags;
  const idNeedsEntry = draft.tenantId.needsEntry || !!flags.tenantId?.includes("idFormat");

  if (state.saved) {
    return (
      <div className="review review-saved">
        <p>
          <span aria-hidden="true">✓ </span>
          <T k="import.saved" />
        </p>
        <Link href="/dashboard" className="btn btn-quiet">
          <T k="import.back" />
        </Link>
      </div>
    );
  }

  const set = (key: TextField) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const text = (key: TextField, opts: { ltr?: boolean; type?: string } = {}) => (
    <label className={`form-field rv-field${tone(flags[key])}`}>
      <span className="form-label">
        <T k={`label.${key}` as MessageKey} />
      </span>
      <input name={key} type={opts.type ?? "text"} value={values[key]} onChange={set(key)} dir={opts.ltr ? "ltr" : undefined} inputMode={opts.type === "number" ? "decimal" : undefined} />
      <FlagList flags={flags[key]} />
    </label>
  );
  const date = (key: "startDate" | "endDate", printed: string | null) => (
    <label className={`form-field rv-field${tone(flags[key])}`}>
      <span className="form-label">
        <T k={`label.${key}` as MessageKey} />
      </span>
      <input name={key} type="date" value={values[key]} onChange={set(key)} />
      {isValidIsoDate(values[key]) && (
        <small className="rv-dual">
          <DualDate iso={values[key]} />
        </small>
      )}
      {printed && flags[key]?.includes("hijriMismatch") && (
        <small className="rv-dual">
          <T k="label.printedHijri" /> <span dir="ltr">{printed}</span>
        </small>
      )}
      <FlagList flags={flags[key]} />
    </label>
  );

  // Submitted by hand rather than through the form's action prop: React resets a form after an
  // action, which blanks a controlled <select> even though its value is still in state.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => action(form));
  }

  const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const hasBlockingNow = Object.values(flags).some((l) => l?.some((f) => BLOCKING.has(f)));

  return (
    <form onSubmit={submit} className="review">
      <p className="dash-muted">
        <T k={hasBlockingNow || Object.keys(flags).length ? "import.reviewHint" : "import.allGood"} />
      </p>

      <fieldset className="rv-section">
        <legend>
          <T k="section.contract" />
        </legend>
        <div className="rv-grid">
          {text("contractNumber", { ltr: true })}
          <label className={`form-field rv-field${tone(flags.paymentCycle)}`}>
            <span className="form-label">
              <T k="label.paymentCycle" />
            </span>
            <select name="paymentCycle" value={values.paymentCycle} onChange={set("paymentCycle")}>
              <option value="" />
              {CYCLES.map((c) => (
                <option key={c} value={c}>
                  {messages[lang][`cycle.${c}` as MessageKey]}
                </option>
              ))}
            </select>
            <FlagList flags={flags.paymentCycle} />
          </label>
          {date("startDate", draft.printedHijri.start)}
          {date("endDate", draft.printedHijri.end)}
          {text("annualRent", { type: "number", ltr: true })}
        </div>
      </fieldset>

      <fieldset className="rv-section">
        <legend>
          <T k="section.tenant" />
        </legend>
        <div className="rv-grid">
          {text("tenantName")}
          {text("tenantNationality")}
          <div className={`form-field rv-field${tone(flags.tenantId)}`}>
            <span className="form-label">
              <T k="label.tenantId" />
            </span>
            <p className="rv-static">
              <bdi dir="ltr">••••••{draft.tenantId.last4}</bdi> · <T k={`idType.${draft.tenantId.type}` as MessageKey} />
            </p>
            {idNeedsEntry && (
              <input name="tenantIdNumber" value={typedId} onChange={(e) => setTypedId(e.target.value)} dir="ltr" inputMode="numeric" aria-label={messages[lang]["label.tenantIdEnter"]} placeholder={messages[lang]["label.tenantIdEnter"]} />
            )}
            <FlagList flags={flags.tenantId} />
            <input type="hidden" name="tenantIdType" value={draft.tenantId.type} />
            <input type="hidden" name="tenantIdLast4" value={draft.tenantId.last4} />
            <input type="hidden" name="tenantIdNeedsEntry" value={draft.tenantId.needsEntry ? "1" : "0"} />
          </div>
          {text("tenantMobile", { ltr: true })}
        </div>
      </fieldset>

      <fieldset className="rv-section">
        <legend>
          <T k="section.property" />
        </legend>
        <div className="rv-grid">
          {text("propertyCity")}
          {text("propertyDistrict")}
          {text("propertyStreet")}
          {text("buildingNumber", { ltr: true })}
          {text("postalCode", { ltr: true })}
          {text("additionalNumber", { ltr: true })}
          {text("deedNumber", { ltr: true })}
          {text("unitNumber", { ltr: true })}
          {text("unitType")}
          {text("unitFloor", { ltr: true })}
          {text("unitArea", { type: "number", ltr: true })}
        </div>
      </fieldset>

      <fieldset className={`rv-section${tone(flags.installments)}`}>
        <legend>
          <T k="section.payments" />
        </legend>
        <table className="rv-pays">
          <thead>
            <tr>
              <th>#</th>
              <th>
                <T k="label.dueDate" />
              </th>
              <th>
                <T k="label.amount" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    name="installmentDue"
                    type="date"
                    value={r.dueDate}
                    onChange={(e) => setRows((all) => all.map((x, j) => (j === i ? { ...x, dueDate: e.target.value } : x)))}
                  />
                  {isValidIsoDate(r.dueDate) && (
                    <small className="rv-dual">
                      <DualDate iso={r.dueDate} />
                    </small>
                  )}
                </td>
                <td>
                  <input
                    name="installmentAmount"
                    type="number"
                    inputMode="decimal"
                    dir="ltr"
                    value={r.amount}
                    onChange={(e) => setRows((all) => all.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td>
                <T k="label.total" />
              </td>
              <td dir="ltr">{total.toLocaleString("en-US")}</td>
            </tr>
          </tfoot>
        </table>
        <FlagList flags={flags.installments} />
      </fieldset>

      {state.error && (
        <p className="form-error" role="alert">
          <T k={state.error === "fixFirst" ? "import.fixFirst" : state.error === "limit" ? "importError.limit" : "error.generic"} />
        </p>
      )}
      <div className="rv-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          <T k={pending ? "import.saving" : "import.approve"} />
        </button>
        <button type="button" className="btn btn-text" onClick={onDiscard} disabled={pending}>
          <T k="import.discard" />
        </button>
      </div>
    </form>
  );
}
