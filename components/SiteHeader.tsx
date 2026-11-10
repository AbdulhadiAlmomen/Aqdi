import Link from "next/link";
import type { ReactNode } from "react";
import { LangToggle } from "./LangToggle";
import { LogoMark } from "./LogoMark";
import { T } from "@/lib/i18n";

// Header for the app pages: logo home, language switch, and any page actions after it.
export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <nav>
      <div className="wrap">
        <Link href="/" className="logo">
          <LogoMark />
          <T k="brand" />
        </Link>
        <div className="nav-actions">
          <LangToggle />
          {children}
        </div>
      </div>
    </nav>
  );
}
