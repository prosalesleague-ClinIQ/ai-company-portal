import Link from "next/link";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody } from "@/components/ui/card";

export default async function WorkflowsPage() {
  const m = await getManifest();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Workflows</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.workflows.length} executable chains in <code>_Workflows/</code>.
        </p>
      </header>

      <Card>
        <ul>
          {m.workflows.map((w) => (
            <li
              key={w.slug}
              className="border-b border-[var(--color-border)] last:border-0"
            >
              <Link
                href={`/workflows/${w.slug}`}
                className="block px-5 py-3 hover:bg-[var(--color-bg-subtle)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{w.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2 max-w-3xl">
                      {w.description}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)] shrink-0">
                    {w.slug}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {m.workflows.length === 0 && (
          <CardBody>
            <p className="text-sm text-[var(--color-text-muted)]">
              No workflows found.
            </p>
          </CardBody>
        )}
      </Card>
    </div>
  );
}
