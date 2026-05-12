import Link from "next/link";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody } from "@/components/ui/card";

export default async function DepartmentsPage() {
  const m = await getManifest();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.departments.length} departments active across the Matrix AI Company OS.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {m.departments.map((d) => (
          <Link key={d.slug} href={`/departments/${d.slug}`} className="group">
            <Card className="h-full hover:border-[var(--color-accent)] transition-colors">
              <CardBody>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold tracking-tight group-hover:text-[var(--color-accent)]">
                    {d.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] border border-[var(--color-border)] rounded px-1.5 py-0.5">
                    {d.status}
                  </span>
                </div>
                {d.description && (
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-snug">
                    {d.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs">
                  <div>
                    <span className="tabular-nums font-semibold">{d.skill_count}</span>
                    <span className="text-[var(--color-text-subtle)]"> specialists</span>
                  </div>
                  <div>
                    <span className="tabular-nums font-semibold">{d.workflow_count}</span>
                    <span className="text-[var(--color-text-subtle)]"> workflows</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
