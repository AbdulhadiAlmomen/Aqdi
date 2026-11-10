"use client";

import { useActionState } from "react";
import { logIn, signUp, type FormState } from "@/app/actions/auth";
import { T, type MessageKey } from "@/lib/i18n";

type FieldProps = {
  name: string;
  label: MessageKey;
  type?: "text" | "email" | "password";
  autoComplete: string;
  defaultValue?: string;
  hint?: MessageKey;
};

function Field({ name, label, type = "text", autoComplete, defaultValue, hint }: FieldProps) {
  // Email and password are typed left to right even on the Arabic page.
  const ltr = type === "email" || type === "password";
  return (
    <label className="form-field">
      <span className="form-label">
        <T k={label} />
      </span>
      <input name={name} type={type} autoComplete={autoComplete} defaultValue={defaultValue} dir={ltr ? "ltr" : undefined} />
      {hint && (
        <small className="form-hint">
          <T k={hint} />
        </small>
      )}
    </label>
  );
}

function Submit({ label, pending }: { label: MessageKey; pending: boolean }) {
  return (
    <button className="btn btn-primary form-submit" type="submit" disabled={pending}>
      <T k={pending ? "common.wait" : label} />
    </button>
  );
}

function FormError({ state }: { state: FormState }) {
  if (!state.error) return null;
  return (
    <p className="form-error" role="alert">
      <T k={state.error} />
    </p>
  );
}

// noValidate: the server checks every field and answers in the page's language,
// instead of the browser's own messages in whatever language the browser uses.
export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, {});
  const v = state.values ?? {};
  return (
    <form action={action} noValidate className="auth-form">
      <Field name="officeName" label="field.officeName" autoComplete="organization" defaultValue={v.officeName} />
      <Field name="name" label="field.name" autoComplete="name" defaultValue={v.name} />
      <Field name="email" label="field.email" type="email" autoComplete="email" defaultValue={v.email} />
      <Field name="password" label="field.password" type="password" autoComplete="new-password" hint="field.passwordHint" />
      <FormError state={state} />
      <Submit label="signup.submit" pending={pending} />
    </form>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(logIn, {});
  return (
    <form action={action} noValidate className="auth-form">
      <Field name="email" label="field.email" type="email" autoComplete="email" defaultValue={state.values?.email} />
      <Field name="password" label="field.password" type="password" autoComplete="current-password" />
      <FormError state={state} />
      <Submit label="login.submit" pending={pending} />
    </form>
  );
}
