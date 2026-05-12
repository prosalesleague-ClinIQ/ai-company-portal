import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.departments.map((d) => ({ slug: d.slug }));
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = await getManifest();
  const dept = m.departments.find((d) => d.slug === slug);
  if (!dept) notFound();

  const skills = m.skills.filter((s) => s.department === slug);
  // workflows by name heuristic
  const workflows = m.workflows.filter((w) => {
    const k = w.slug;
    if (slug === "voice-ai") return k.includes("voice");
    if (slug === "ghl") return k.includes("ghl");
    if (slug === "ecommerce") return k.includes("ecommerce");
    if (slug === "formulation") return k.includes("formulation");
    if (slug === "ip") return k.includes("ip-");
    if (slug === "nexus") return k.includes("nexus");
    if (slug === "customer-success") return k.includes("customer") || k.includes("expansion") || k.includes("refund");
    if (slug === "seo") return k.includes("seo");
    if (slug === "hr") return k.includes("new-hire") || k.includes("certification");
    if (slug === "finance") return k.includes("monthly-close");
    if (slug === "content") return k.includes("marketing-campaign") || k.includes("product-launch");
    if (slug === "sales") return k.includes("sales") || k.includes("pipeline") || k.includes("outbound") || k.includes("lead-to");
    if (slug === "label-design") return k.includes("label");
    if (slug === "engineering") return k.includes("ai-command-center") || k.includes("software");
    return false;
  });

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/departments"
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          ← All departments
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{dept.name}</h1>
        {dept.description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl">
            {dept.description}
          </p>
        )}
        <div className="mt-3 flex gap-4 text-xs">
          <div>
            <span className="tabular-nums font-semibold">{skills.length}</span>
            <span className="text-[var(--color-text-subtle)]"> specialists</span>
          </div>
          <div>
            <span className="tabular-nums font-semibold">{workflows.length}</span>
            <span className="text-[var(--color-text-subtle)]"> workflows</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Specialists" subtitle={`${skills.length} agents in this department`} />
          <CardBody className="p-0">
            {skills.length === 0 ? (
              <div className="p-5 text-sm text-[var(--color-text-muted)]">
                No specialists classified into this department yet.
              </div>
            ) : (
              <ul>
                {skills.map((s) => (
                  <li
                    key={s.slug}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/skills/${s.slug}`}
                      className="block px-5 py-3 hover:bg-[var(--color-bg-subtle)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">
                            {s.name}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                            {s.description}
                          </div>
                        </div>
                        <Badge tone={s.type === "orchestrator" ? "accent" : "neutral"}>
                          {s.type || "specialist"}
                        </Badge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Workflows" />
          <CardBody className="p-0">
            {workflows.length === 0 ? (
              <div className="p-5 text-sm text-[var(--color-text-muted)]">
                No workflows scoped to this department.
              </div>
            ) : (
              <ul>
                {workflows.map((w) => (
                  <li
                    key={w.slug}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/workflows/${w.slug}`}
                      className="block px-5 py-3 hover:bg-[var(--color-bg-subtle)]"
                    >
                      <div className="text-sm font-medium">{w.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
                        {w.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
