import Link from "next/link";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, StatCard, Badge } from "@/components/ui/card";

export default async function DashboardPage() {
  const m = await getManifest();

  // Top departments by skill count
  const topDepts = m.departments.slice(0, 8);
  // Approvals queue preview
  const approvalsPreview = m.approvals.slice(0, 4);
  // Friday cron cluster
  const fridayCrons = m.crons.filter((c) => c.cron?.includes(" 5") || c.task_id.includes("friday"));
  // Top leads
  const topLeads = [...m.leads]
    .sort((a, b) => b.lead_score - a.lead_score)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Company Portal</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Operator view of the Matrix Advanced Solutions AI Company OS. Read-only browse of every
          specialist, workflow, lead, approval gate, and scheduled job.
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Specialists" value={m.stats.skills} hint="across departments" />
        <StatCard label="Workflows" value={m.stats.workflows} hint="end-to-end chains" />
        <StatCard label="Departments" value={m.stats.departments} hint="active" />
        <StatCard label="Leads" value={m.stats.leads} hint="prospect rows" />
        <StatCard label="Scheduled" value={m.stats.crons} hint="cron jobs" />
        <StatCard label="Approvals" value={m.stats.approvals} hint="pending" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Top departments by specialist count"
            subtitle="From _Shared Context/agent-registry.md + scanned SKILL.md frontmatter"
            right={
              <Link
                href="/departments"
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            }
          />
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-5 py-2.5 font-medium">Department</th>
                  <th className="px-5 py-2.5 font-medium text-right tabular-nums">Skills</th>
                  <th className="px-5 py-2.5 font-medium text-right tabular-nums">Workflows</th>
                </tr>
              </thead>
              <tbody>
                {topDepts.map((d) => (
                  <tr
                    key={d.slug}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
                  >
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/departments/${d.slug}`}
                        className="hover:text-[var(--color-accent)] font-medium"
                      >
                        {d.name}
                      </Link>
                      <div className="text-xs text-[var(--color-text-subtle)] mt-0.5 line-clamp-1">
                        {d.description}
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-right tabular-nums">{d.skill_count}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">{d.workflow_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Pending approvals"
            right={
              <Link
                href="/approvals"
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            }
          />
          <CardBody>
            <ul className="space-y-3">
              {approvalsPreview.map((a) => (
                <li
                  key={a.id}
                  className="text-sm border-l-2 border-[var(--color-brand-cyan)] pl-3"
                >
                  <div className="font-medium leading-tight">{a.title}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    <Badge tone="warning">{a.category}</Badge> · {a.who}
                  </div>
                  <div className="text-xs text-[var(--color-text-subtle)] mt-1">
                    {a.blocker}
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader
            title="Top scored leads"
            subtitle={`From ${m.stats.leads} prospect rows`}
            right={
              <Link
                href="/leads"
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            }
          />
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-5 py-2.5 font-medium">Clinic</th>
                  <th className="px-5 py-2.5 font-medium">Location</th>
                  <th className="px-5 py-2.5 font-medium">Vertical</th>
                  <th className="px-5 py-2.5 font-medium text-right tabular-nums">Score</th>
                </tr>
              </thead>
              <tbody>
                {topLeads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
                  >
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/leads/${l.id}`}
                        className="font-medium hover:text-[var(--color-accent)]"
                      >
                        {l.clinic_name}
                      </Link>
                    </td>
                    <td className="px-5 py-2.5 text-[var(--color-text-muted)]">
                      {l.city}, {l.state}
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge>{l.vertical}</Badge>
                    </td>
                    <td className="px-5 py-2.5 text-right tabular-nums font-medium">
                      {l.lead_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Scheduled jobs"
            subtitle={`${m.crons.length} jobs registered at ~/.claude/scheduled-tasks`}
            right={
              <Link
                href="/cron"
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                View all →
              </Link>
            }
          />
          <CardBody>
            <ul className="space-y-2 text-sm">
              {(fridayCrons.length ? fridayCrons : m.crons).slice(0, 8).map((c) => (
                <li
                  key={c.task_id}
                  className="flex items-baseline justify-between border-b border-[var(--color-border)] last:border-0 py-1.5"
                >
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">
                    {c.task_id}
                  </span>
                  {c.cron && (
                    <span className="font-mono text-[10px] text-[var(--color-text-subtle)] tabular-nums">
                      {c.cron}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
