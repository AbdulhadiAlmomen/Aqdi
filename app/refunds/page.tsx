import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";

export const metadata: Metadata = { title: "Refunds · Aqdi | عقدي" };

export default function RefundsPage() {
  return <LegalPage page="refunds" sections={5} />;
}
