// The demo account's login, shared by the seed script (lib/demo.ts) and the app. No imports, so any
// page can use it without pulling in the database or password hashing.
export const DEMO_EMAIL = "demo@demo.com";
export const DEMO_PASSWORD = "password123!";

export function isDemoAccount(email: string) {
  return email.trim().toLowerCase() === DEMO_EMAIL;
}
