import { Suspense } from "react";
import { logOut } from "@/app/actions/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { currentOffice } from "@/lib/dal";
import { T } from "@/lib/i18n";

export default function DashboardPage() {
  return (
    <>
      <SiteHeader>
        <form action={logOut}>
          <button className="btn btn-text" type="submit">
            <T k="dashboard.logout" />
          </button>
        </form>
      </SiteHeader>
      <main className="wrap dash">
        {/* The page frame is static; the signed-in part streams in once the session is checked. */}
        <Suspense fallback={<p className="dash-loading"><T k="dashboard.loading" /></p>}>
          <OfficeOverview />
        </Suspense>
      </main>
    </>
  );
}

async function OfficeOverview() {
  const { member, data } = await currentOffice();
  const office = await data.office();
  return (
    <>
      <p className="dash-eyebrow">
        <T k="dashboard.title" />
      </p>
      <h1>
        <T k="dashboard.welcome" vars={{ name: member.name }} />
      </h1>
      <div className="dash-grid">
        <section className="dash-card">
          <h2>
            <T k="dashboard.office" />
          </h2>
          <p className="dash-big">{office?.name}</p>
          <p className="dash-muted">
            <T k={member.role === "admin" ? "dashboard.role.admin" : "dashboard.role.staff"} />
          </p>
        </section>
        <section className="dash-card">
          <h2>
            <T k="dashboard.account" />
          </h2>
          <p className="dash-big">{member.name}</p>
          <p className="dash-muted" dir="ltr">
            {member.email}
          </p>
        </section>
        <section className="dash-card dash-next">
          <h2>
            <T k="dashboard.next" />
          </h2>
          <p>
            <T k="dashboard.nextBody" />
          </p>
        </section>
      </div>
    </>
  );
}
