"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, type MessageKey } from "@/lib/i18n";

type Item = { k: MessageKey; href?: string };

// The office's sections. Items without a link aren't built yet and show "Soon".
const GROUPS: { k: MessageKey; items: Item[] }[] = [
  {
    k: "nav.group.work",
    items: [
      { k: "nav.overview", href: "/dashboard" },
      { k: "nav.import", href: "/dashboard/import" },
      { k: "nav.maintenance" },
      { k: "nav.messages" },
      { k: "nav.renewals" },
    ],
  },
  {
    k: "nav.group.property",
    items: [{ k: "nav.buildings" }, { k: "nav.contracts" }, { k: "nav.tenants" }, { k: "nav.owners" }, { k: "nav.documents" }],
  },
  {
    k: "nav.group.money",
    items: [{ k: "nav.rent" }, { k: "nav.reports" }, { k: "nav.services" }],
  },
  {
    k: "nav.group.account",
    items: [{ k: "nav.billing", href: "/dashboard/billing" }, { k: "nav.team" }, { k: "nav.settings" }],
  },
];

export function DashNav() {
  const path = usePathname();
  return (
    <aside className="side-nav" role="navigation" aria-label="Aqdi">
      {GROUPS.map((g) => (
        <div key={g.k} className="side-group">
          <p className="side-group-title">
            <T k={g.k} />
          </p>
          <ul>
            {g.items.map((item) => (
              <li key={item.k}>
                {item.href ? (
                  <Link href={item.href} className="side-link" aria-current={path === item.href ? "page" : undefined}>
                    <T k={item.k} />
                  </Link>
                ) : (
                  <span className="side-link is-soon" aria-disabled="true">
                    <T k={item.k} />
                    <small>
                      <T k="nav.soon" />
                    </small>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
