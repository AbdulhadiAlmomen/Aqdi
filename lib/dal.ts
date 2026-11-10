import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { getAuth } from "./auth";
import { findMembership, forOffice } from "./offices";

export type CurrentMember = {
  userId: string;
  name: string;
  email: string;
  officeId: string;
  officeName: string;
  role: "admin" | "staff";
};

// The signed-in user and their office, checked against the database on every call
// (the cookie alone is never trusted). Null when signed out or the session expired.
export async function getCurrentMember(): Promise<CurrentMember | null> {
  // Read the request first: it marks this as per-request work, so the build never runs past it.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) return null;
  const membership = await findMembership(getDb(), session.user.id);
  if (!membership) return null;
  return { userId: session.user.id, name: session.user.name, email: session.user.email, ...membership };
}

export async function requireMember(): Promise<CurrentMember> {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  return member;
}

// Office data for the signed-in user only. Pages should get office data through this.
export async function currentOffice() {
  const member = await requireMember();
  return { member, data: forOffice(getDb(), member.officeId) };
}
