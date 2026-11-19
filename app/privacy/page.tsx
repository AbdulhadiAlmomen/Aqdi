import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";

export const metadata: Metadata = { title: "Privacy · Aqdi | عقدي" };

export default function PrivacyPage() {
  return <LegalPage page="privacy" sections={5} />;
}
