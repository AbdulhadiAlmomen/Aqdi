import Link from "next/link";
import type { ReactNode } from "react";
import { LangToggle } from "./LangToggle";
import { LogoMark } from "./LogoMark";
import { T } from "@/lib/i18n";

// Frame for the account pages: the site header, then one centered card.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>
        <div className="wrap">
          <Link href="/" className="logo">
            <LogoMark />
            <T k="brand" />
          </Link>
          <div className="nav-actions">
            <LangToggle />
          </div>
        </div>
      </nav>
      <main className="wrap flex min-h-[calc(100vh-68px)] items-start justify-center pt-16 pb-24 md:items-center md:pt-0">
        <div className="auth-card">{children}</div>
      </main>
    </>
  );
}
