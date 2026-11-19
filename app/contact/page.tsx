import type { Metadata } from "next";
import { Email, LegalPage } from "@/components/Legal";
import { T } from "@/lib/i18n";

export const metadata: Metadata = { title: "Contact · Aqdi | عقدي" };

export default function ContactPage() {
  return (
    <LegalPage page="contact" sections={0}>
      <div className="legal-card">
        <span className="form-label"><T k="legal.contact.email" /></span>
        <p className="legal-email"><Email /></p>
      </div>
      <section className="legal-section">
        <h2><T k="legal.contact.help" /></h2>
        <p><T k="legal.contact.helpBody" /></p>
      </section>
      <section className="legal-section">
        <h2><T k="legal.contact.who" /></h2>
        <p><T k="legal.contact.whoBody" /></p>
      </section>
    </LegalPage>
  );
}
