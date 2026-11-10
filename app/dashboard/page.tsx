import Link from "next/link";
import { Suspense } from "react";
import { logOut } from "@/app/actions/auth";
import { DualDate } from "@/components/DualDate";
import { SiteHeader } from "@/components/SiteHeader";
import { currentOffice } from "@/lib/dal";
import { T, type MessageKey } from "@/lib/i18n";
import { FREE_CONTRACT_LIMIT } from "@/lib/offices";

const SAR = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

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
  const [office, buildings, contracts] = await Promise.all([data.office(), data.buildingsOverview(), data.contracts()]);
  const unitCount = buildings.reduce((n, b) => n + b.unitCount, 0);

  return (
    <>
      <div className="dash-top">
        <div>
          <p className="dash-eyebrow">
            {office?.name} · <T k={member.role === "admin" ? "dashboard.role.admin" : "dashboard.role.staff"} />
          </p>
          <h1>
            <T k="dashboard.welcome" vars={{ name: member.name }} />
          </h1>
        </div>
        <Link href="/dashboard/import" className="btn btn-primary">
          <T k="dashboard.import" />
        </Link>
      </div>

      <div className="dash-stats">
        <div className="dash-card">
          <h2>
            <T k="dashboard.buildings" />
          </h2>
          <p className="dash-big">{buildings.length}</p>
        </div>
        <div className="dash-card">
          <h2>
            <T k="dashboard.units" />
          </h2>
          <p className="dash-big">{unitCount}</p>
        </div>
        <div className="dash-card">
          <h2>
            <T k="dashboard.contracts" />
          </h2>
          <p className="dash-big">{contracts.length}</p>
          {!office?.paid && (
            <p className="dash-muted">
              <T k="dashboard.freeLeft" vars={{ used: String(contracts.length), limit: String(FREE_CONTRACT_LIMIT) }} />
            </p>
          )}
        </div>
      </div>

      {contracts.length === 0 ? (
        <section className="dash-card dash-next">
          <p>
            <T k="dashboard.empty" />
          </p>
        </section>
      ) : (
        <>
          <section className="dash-section">
            <h2 className="dash-h2">
              <T k="dashboard.contracts" />
            </h2>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th><T k="col.contract" /></th>
                    <th><T k="col.tenant" /></th>
                    <th><T k="col.unit" /></th>
                    <th><T k="col.start" /></th>
                    <th><T k="col.end" /></th>
                    <th><T k="col.rent" /></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => (
                    <tr key={c.id}>
                      <td dir="ltr" className="cell-num">{c.contractNumber}</td>
                      <td>
                        {c.tenantName}
                        <small>
                          <bdi dir="ltr">••••••{c.tenantIdLast4}</bdi> · <T k={`idType.${c.tenantIdType}` as MessageKey} />
                        </small>
                      </td>
                      <td>
                        <T k="dashboard.unitLine" vars={{ type: c.unitType ?? "", number: c.unitNumber }} />
                        <small>
                          <T k="dashboard.buildingLine" vars={{ number: c.buildingNumber ?? "", district: c.district ?? "" }} />
                        </small>
                      </td>
                      <td><DualDate iso={c.startDate} /></td>
                      <td><DualDate iso={c.endDate} /></td>
                      <td className="cell-num">
                        <T k="currency" vars={{ amount: SAR.format(Number(c.annualRent)) }} />
                        <small>
                          <T k={`cycle.${c.paymentCycle}` as MessageKey} />
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dash-section">
            <h2 className="dash-h2">
              <T k="dashboard.buildings" />
            </h2>
            <div className="dash-grid">
              {buildings.map((b) => (
                <div key={b.id} className="dash-card">
                  <p className="dash-big">
                    <T k="dashboard.buildingLine" vars={{ number: b.buildingNumber ?? "", district: b.district ?? "" }} />
                  </p>
                  <p className="dash-muted">
                    <span lang="ar">{[b.street, b.city].filter(Boolean).join("، ")}</span>
                    <span lang="en">{[b.street, b.city].filter(Boolean).join(", ")}</span>
                  </p>
                  <p className="dash-muted">
                    <T k="dashboard.buildingCounts" vars={{ units: String(b.unitCount), contracts: String(b.contractCount) }} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
