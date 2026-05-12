import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";

function describeCron(c: string): string {
  if (!c) return "—";
  // Friday afternoon CI cluster
  if (c.match(/^\d+\s\d+\s\*\s\*\s5$/)) {
    const [m, h] = c.split(" ");
    return `Fridays ${h}:${String(m).padStart(2, "0")} PT`;
  }
  if (c.match(/^\d+\s\d+\s\*\s\*\s\*$/)) {
    const [m, h] = c.split(" ");
    return `Daily ${h}:${String(m).padStart(2, "0")}`;
  }
  return c;
}

export default async function CronPage() {
  const m = await getManifest();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Scheduled jobs</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.crons.length} cron jobs registered at <code>~/.claude/scheduled-tasks/</code>. Friday
          afternoon continuous-improvement cluster spans 3:00pm-4:45pm PT.
        </p>
      </header>

      <Card>
        <CardHeader title="All registered tasks" />
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-2.5 font-medium">Task</th>
                <th className="px-5 py-2.5 font-medium">Cron</th>
                <th className="px-5 py-2.5 font-medium">Schedule</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {m.crons.map((c) => (
                <tr
                  key={c.task_id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
                >
                  <td className="px-5 py-2.5 font-mono text-xs">{c.task_id}</td>
                  <td className="px-5 py-2.5 font-mono text-xs text-[var(--color-text-muted)] tabular-nums">
                    {c.cron || "—"}
                  </td>
                  <td className="px-5 py-2.5 text-[var(--color-text-muted)]">
                    {describeCron(c.cron)}
                  </td>
                  <td className="px-5 py-2.5">
                    <Badge tone="success">{c.status}</Badge>
                  </td>
                </tr>
              ))}
              {m.crons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-text-muted)]">
                    No cron jobs registered locally yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
