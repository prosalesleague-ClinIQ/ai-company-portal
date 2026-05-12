"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { Lead, Skill, Workflow } from "@/lib/manifest";

export function GlobalSearch({
  skills,
  workflows,
  leads,
}: {
  skills: Skill[];
  workflows: Workflow[];
  leads: Lead[];
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n)
      return { skills: [] as Skill[], workflows: [] as Workflow[], leads: [] as Lead[] };
    return {
      skills: skills
        .filter(
          (s) =>
            s.name.toLowerCase().includes(n) ||
            s.slug.toLowerCase().includes(n) ||
            s.description.toLowerCase().includes(n),
        )
        .slice(0, 25),
      workflows: workflows
        .filter(
          (w) =>
            w.name.toLowerCase().includes(n) ||
            w.slug.toLowerCase().includes(n) ||
            w.description.toLowerCase().includes(n),
        )
        .slice(0, 25),
      leads: leads
        .filter(
          (l) =>
            l.clinic_name.toLowerCase().includes(n) ||
            l.city.toLowerCase().includes(n) ||
            `${l.first_name} ${l.last_name}`.toLowerCase().includes(n),
        )
        .slice(0, 25),
    };
  }, [q, skills, workflows, leads]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-3">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills, workflows, leads…"
            autoFocus
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      </Card>

      {q.trim() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader title={`Skills (${results.skills.length})`} />
            <CardBody className="p-0">
              <ul>
                {results.skills.map((s) => (
                  <li
                    key={s.slug}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/skills/${s.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-[var(--color-bg-subtle)]"
                    >
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                        {s.description}
                      </div>
                    </Link>
                  </li>
                ))}
                {results.skills.length === 0 && (
                  <li className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    No skill matches.
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={`Workflows (${results.workflows.length})`} />
            <CardBody className="p-0">
              <ul>
                {results.workflows.map((w) => (
                  <li
                    key={w.slug}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/workflows/${w.slug}`}
                      className="block px-4 py-2.5 text-sm hover:bg-[var(--color-bg-subtle)]"
                    >
                      <div className="font-medium">{w.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                        {w.description}
                      </div>
                    </Link>
                  </li>
                ))}
                {results.workflows.length === 0 && (
                  <li className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    No workflow matches.
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={`Leads (${results.leads.length})`} />
            <CardBody className="p-0">
              <ul>
                {results.leads.map((l) => (
                  <li
                    key={l.id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/leads/${l.id}`}
                      className="block px-4 py-2.5 text-sm hover:bg-[var(--color-bg-subtle)]"
                    >
                      <div className="font-medium">{l.clinic_name}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {l.city}, {l.state} · {l.vertical}
                      </div>
                    </Link>
                  </li>
                ))}
                {results.leads.length === 0 && (
                  <li className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    No lead matches.
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {!q.trim() && (
        <Card>
          <CardBody className="text-sm text-[var(--color-text-muted)]">
            Type to search across skills, workflows, and leads. Indexes the manifest on the client
            — no network round-trip.
          </CardBody>
        </Card>
      )}
    </div>
  );
}
