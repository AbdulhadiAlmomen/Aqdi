import type { ReactNode } from "react";
import { logOut } from "@/app/actions/auth";
import { DashNav } from "@/components/DashNav";
import { SiteHeader } from "@/components/SiteHeader";
import { T } from "@/lib/i18n";

// Every office page: header with log out, the sections sidebar (start side: right in Arabic,
// left in English), and the page itself.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader>
        <form action={logOut}>
          <button className="btn btn-text" type="submit">
            <T k="dashboard.logout" />
          </button>
        </form>
      </SiteHeader>
      <div className="wrap dash-shell">
        <DashNav />
        <main className="dash">{children}</main>
      </div>
    </>
  );
}
