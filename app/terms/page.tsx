import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";

export const metadata: Metadata = { title: "Terms · Aqdi | عقدي" };

export default function TermsPage() {
  return <LegalPage page="terms" sections={9} />;
}
