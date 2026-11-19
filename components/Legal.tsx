import Link from "next/link";
import type { ReactNode } from "react";
import { DualDate } from "@/components/DualDate";
import { SiteHeader } from "@/components/SiteHeader";
import { messages, T, type MessageKey } from "@/lib/i18n";

export const CONTACT_EMAIL = "hadimomen04@gmail.com";
// When these pages last changed (shown in both calendars).
const UPDATED = "2026-11-19";

// A message with {placeholders} filled by elements (links), in both languages.
export function RichT({ k, parts }: { k: MessageKey; parts: Record<string, (lang: "ar" | "en") => ReactNode> }) {
  const render = (lang: "ar" | "en") =>
    messages[lang][k].split(/(\{\w+\})/).map((piece, i) => {
      const name = piece.match(/^\{(\w+)\}$/)?.[1];
      return name && parts[name] ? <span key={i}>{parts[name](lang)}</span> : piece;
    });
  return (
    <>
      <span lang="ar">{render("ar")}</span>
      <span lang="en">{render("en")}</span>
    </>
  );
}

const Email = () => (
  <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
    {CONTACT_EMAIL}
  </a>
);

export function LegalLinks() {
  return (
    <nav className="legal-links" aria-label="Legal">
      <Link href="/contact"><T k="legal.footer.contact" /></Link>
      <Link href="/refunds"><T k="legal.footer.refunds" /></Link>
      <Link href="/terms"><T k="legal.footer.terms" /></Link>
      <Link href="/privacy"><T k="legal.footer.privacy" /></Link>
    </nav>
  );
}

// One policy page: title, intro, numbered sections from the message files, then contact.
export function LegalPage({ page, sections, children }: { page: "contact" | "refunds" | "terms" | "privacy"; sections: number; children?: ReactNode }) {
  const key = (s: string) => `legal.${page}.${s}` as MessageKey;
  return (
    <>
      <SiteHeader>
        <Link href="/" className="btn btn-text">
          <T k="legal.back" />
        </Link>
      </SiteHeader>
      <main className="wrap legal">
        <h1>
          <T k={key("title")} />
        </h1>
        <p className="legal-updated">
          <T k="legal.updated" />: <DualDate iso={UPDATED} />
        </p>
        <p className="legal-intro">
          <T k={key("intro")} />
        </p>
        {children}
        {Array.from({ length: sections }, (_, i) => (
          <section key={i} className="legal-section">
            <h2>
              <T k={key(`${i + 1}.h`)} />
            </h2>
            <p>
              <T k={key(`${i + 1}.p`)} />
            </p>
          </section>
        ))}
        {page !== "contact" && (
          <p className="legal-contact">
            <RichT k="legal.questions" parts={{ email: () => <Email /> }} />
          </p>
        )}
        <LegalLinks />
      </main>
    </>
  );
}

export { Email };
