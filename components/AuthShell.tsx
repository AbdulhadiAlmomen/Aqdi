import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

// Frame for the account pages: the site header, then one centered card.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="wrap flex min-h-[calc(100vh-68px)] items-start justify-center pt-12 pb-24 md:items-center md:pt-0">
        <div className="auth-card">{children}</div>
      </main>
    </>
  );
}
