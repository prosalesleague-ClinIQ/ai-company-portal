"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Department, Skill } from "@/lib/manifest";
import { cn } from "@/lib/cn";

export function SkillsBrowser({
  skills,
  departments,
}: {
  skills: Skill[];
  departments: Department[];
}) {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("");
  const [type, setType] = useState<string>("");

  const types = useMemo(() => {
    const s = new Set<string>();
    for (const sk of skills) if (sk.type) s.add(sk.type);
    return Array.from(s).sort();
  }, [skills]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return skills.filter((s) => {
      if (dept && s.department !== dept) return false;
      if (type && s.type !== type) return false;
      if (!needle) return true;
      return (
        s.name.toLowerCase().includes(needle) ||
        s.slug.toLowerCase().includes(needle) ||
        s.description.toLowerCase().includes(needle) ||
        s.triggers.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [skills, dept, type, q]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, description, or trigger phrase…"
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
          />
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.skill_count})
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="text-xs text-[var(--color-text-subtle)] tabular-nums">
            {filtered.length} / {skills.length}
          </div>
        </div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-2.5 font-medium">Skill</th>
              <th className="px-4 py-2.5 font-medium">Department</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.slug}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
              >
                <td className="px-4 py-2.5">
                  <Link
                    href={`/skills/${s.slug}`}
                    className="font-medium hover:text-[var(--color-accent)]"
                  >
                    {s.name}
                  </Link>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1 max-w-2xl">
                    {s.description}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">
                  {departments.find((d) => d.slug === s.department)?.name || s.department}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border",
                      s.type === "orchestrator"
                        ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                        : s.type === "atomic"
                        ? "bg-violet-50 border-violet-200 text-violet-800"
                        : "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)]",
                    )}
                  >
                    {s.type || "specialist"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-subtle)] text-xs">
                  {s.estimated_time || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-sm text-center text-[var(--color-text-muted)]">
            No skills match these filters.
          </div>
        )}
      </Card>
    </div>
  );
}
