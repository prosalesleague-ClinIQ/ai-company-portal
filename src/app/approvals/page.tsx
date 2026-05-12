import Link from "next/link";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";

export default async function ApprovalsPage() {
  const m = await getManifest();

  const byCategory = m.approvals.reduce<Record<string, typeof m.approvals>>(
    (acc, a) => {
      (acc[a.category] = acc[a.category] || []).push(a);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl">
          Pending approvals that block live operations. Read-only view in this build — each item
          links to the skill or page where action happens. Curated from cross-department blockers in
          the agent registry.
        </p>
      </header>

      {Object.entries(byCategory).map(([cat, items]) => (
        <Card key={cat}>
          <CardHeader title={cat} subtitle={`${items.length} pending`} />
          <CardBody className="p-0">
            <ul>
              {items.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-[var(--color-border)] last:border-0 px-5 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{a.title}</div>
                      <div className="text-xs text-[var(--color-text-subtle)] mt-0.5">
                        Owner: <span className="text-[var(--color-text-muted)]">{a.who}</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1.5">{a.blocker}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <Badge tone="warning">pending</Badge>
                      {a.link && (
                        <Link
                          href={a.link}
                          className="text-xs text-[var(--color-accent)] hover:underline"
                        >
                          Open →
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
