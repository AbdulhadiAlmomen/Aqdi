"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getAuth } from "@/lib/auth";
import type { MessageKey } from "@/lib/i18n";
import { createOfficeWithAdmin } from "@/lib/offices";

export type FormState = {
  error?: MessageKey;
  // Typed values come back on error so the form doesn't empty itself. Never the password.
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorCode(error: unknown) {
  return error instanceof APIError ? (error.body as { code?: string } | undefined)?.code : undefined;
}

export async function signUp(_prev: FormState, form: FormData): Promise<FormState> {
  const officeName = field(form, "officeName");
  const name = field(form, "name");
  const email = field(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { officeName, name, email };

  if (!officeName || !name || !email || !password) return { error: "error.required", values };
  if (officeName.length > 120 || name.length > 120) return { error: "error.tooLong", values };
  if (!EMAIL.test(email)) return { error: "error.email", values };
  if (password.length < 8) return { error: "error.passwordShort", values };
  if (password.length > 128) return { error: "error.passwordLong", values };

  const auth = getAuth();
  let userId: string;
  try {
    // Creates the user with an argon2id password hash and signs them in (cookie set by nextCookies).
    const result = await auth.api.signUpEmail({ body: { name, email, password }, headers: await headers() });
    userId = result.user.id;
  } catch (error) {
    if (errorCode(error)?.startsWith("USER_ALREADY_EXISTS")) return { error: "error.emailTaken", values };
    console.error("sign-up failed", errorCode(error) ?? error);
    return { error: "error.generic", values };
  }

  try {
    await createOfficeWithAdmin(getDb(), userId, officeName);
  } catch (error) {
    // Don't leave an account with no office: undo the sign-up and let them try again.
    console.error("office creation failed", error);
    // Deleting the user also removes their session and password record (ON DELETE CASCADE).
    await getDb().delete(users).where(eq(users.id, userId)).catch(() => {});
    return { error: "error.generic", values };
  }

  redirect("/dashboard");
}

export async function logIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = field(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const values = { email };

  if (!email || !password) return { error: "error.required", values };

  try {
    await getAuth().api.signInEmail({ body: { email, password, rememberMe: true }, headers: await headers() });
  } catch (error) {
    if (errorCode(error) === "INVALID_EMAIL_OR_PASSWORD" || errorCode(error) === "INVALID_EMAIL") {
      return { error: "error.invalidCredentials", values };
    }
    console.error("log-in failed", errorCode(error) ?? error);
    return { error: "error.generic", values };
  }

  redirect("/dashboard");
}

export async function logOut() {
  await getAuth().api.signOut({ headers: await headers() });
  redirect("/");
}
