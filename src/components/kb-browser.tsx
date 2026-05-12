"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { KBDoc } from "@/lib/manifest";
import { cn } from "@/lib/cn";

type Section = {
  slug: string;
  label: string;
  count: number;
  words: number;
};

type Filter = "all" | "voice_safe" | "email_safe" | "provider_only" | "counsel_review_required";

export function KBBrowser({
  kb_docs,
  sections,
}: {
  kb_docs: KBDoc[];
  sections: Section[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [section, setSection] = useState<string>("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return kb_docs.filter((d) => {
      if (section && d.section !== section) return false;
      if (filter === "voice_safe" && !d.voice_safe) return false;
      if (filter === "email_safe" && !d.email_safe) return false;
      if (filter === "provider_only" && !d.provider_only) return false;
      if (filter === "counsel_review_required" && !d.counsel_review_required) return false;
      if (!needle) return true;
      return (
        d.title.toLowerCase().includes(needle) ||
        d.slug.toLowerCase().includes(needle) ||
        d.description.toLowerCase().includes(needle) ||
        d.section_label.toLowerCase().includes(needle)
      );
    });
  }, [kb_docs, q, filter, section]);

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find any KB doc — title, description, section…"
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
          />
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All sections</option>
            {sections.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label} ({s.count})
              </option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="all">All flags</option>
            <option value="voice_safe">Voice-safe only</option>
            <option value="email_safe">Email-safe only</option>
            <option value="provider_only">Provider-only</option>
            <option value="counsel_review_required">Counsel review</option>
          </select>
          <div className="text-xs text-[var(--color-text-subtle)] tabular-nums">
            {filtered.length} / {kb_docs.length}
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((s) => (
          <Link
            key={s.slug}
            href={`/kb/${s.slug}`}
            className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 hover:border-[var(--color-accent)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight">{s.label}</h3>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] font-medium tabular-nums">
                {s.count} docs · {Math.round(s.words / 1000)}K words
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
              {SECTION_BLURBS[s.slug] || "Knowledge-base section."}
            </p>
          </Link>
        ))}
      </section>

      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-4 py-2.5 font-medium">Doc</th>
              <th className="px-4 py-2.5 font-medium">Section</th>
              <th className="px-4 py-2.5 font-medium">Flags</th>
              <th className="px-4 py-2.5 font-medium text-right tabular-nums">Words</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr
                key={`${d.section}/${d.slug}`}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
              >
                <td className="px-4 py-2.5">
                  <Link
                    href={`/kb/${d.section}/${d.slug}`}
                    className="font-medium hover:text-[var(--color-accent)]"
                  >
                    {d.title}
                  </Link>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1 max-w-2xl">
                    {d.description}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">
                  <Link href={`/kb/${d.section}`} className="hover:text-[var(--color-accent)]">
                    {d.section_label}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {d.voice_safe && <FlagPill tone="accent">voice</FlagPill>}
                    {d.email_safe && <FlagPill tone="success">email</FlagPill>}
                    {d.provider_only && <FlagPill tone="warning">provider</FlagPill>}
                    {d.counsel_review_required && (
                      <FlagPill tone="danger">counsel</FlagPill>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-[var(--color-text-subtle)] text-xs">
                  {d.word_count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-sm text-center text-[var(--color-text-muted)]">
            No KB docs match these filters.
          </div>
        )}
      </Card>
    </div>
  );
}

function FlagPill({
  tone,
  children,
}: {
  tone: "accent" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const tones = {
    accent: "bg-cyan-50 text-cyan-800 border-cyan-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export const SECTION_BLURBS: Record<string, string> = {
  peptides:
    "Every peptide Matrix sells or sources — GLP-1, GH secretagogues, aesthetic, recovery, adjunct, women-specific, safety.",
  "trt-hrt":
    "Testosterone esters, concentrations + vehicles, women's BHRT, AI stack, HCG, enclomiphene, DEA framing, pellets vs injection.",
  "matrix-offerings":
    "What Matrix sells, who it's for, how to buy — 503-A, 503-B, sub-brands, pricing, lab partners, ALM DT, vs Empower.",
  "objection-handling":
    "Every objection Mia and reps face — medspa, weight-loss, HRT, pricing, regulatory, competitor, timing, partnership.",
  "regulatory-framing":
    "Keep us legal + safe in conversation — current landscape, 503-A GLP-1 safe harbor, FDA enforcement, DEA, state regs, TCPA, claims discipline.",
  "clinical-evidence":
    "Defend with citations — Steve's 15-year portfolio, peptide research summary, GLP-1, HRT, citations library.",
  "sales-playbook":
    "Qualification → close patterns — discovery structure, MEDDPICC, close patterns, multi-thread, MAP, cert-gate rules, compliance coaching.",
  "voice-snippets":
    "Mia-ready conversational chunks — voice style guide, peptide / TRT / GLP-1 talking points, objection snippets, discovery questions, handoff.",
  "compliance-safe-phrasing":
    "Vocabulary library — approved vocabulary, banned-phrase substitutes, per-vertical claim discipline, relative-risk framing.",
};
