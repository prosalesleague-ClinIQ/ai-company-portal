import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.kb_docs.map((d) => ({ section: d.section, slug: d.slug }));
}

export default async function KBDocPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const m = await getManifest();
  const doc = m.kb_docs.find((d) => d.section === section && d.slug === slug);
  if (!doc) notFound();

  const sectionDocs = m.kb_docs.filter((d) => d.section === section);
  const idx = sectionDocs.findIndex(
    (d) => d.section === section && d.slug === slug,
  );
  const prev = idx > 0 ? sectionDocs[idx - 1] : null;
  const next = idx >= 0 && idx < sectionDocs.length - 1 ? sectionDocs[idx + 1] : null;

  return (
    <div className="space-y-6">
      <header>
        <Link
          href={`/kb/${doc.section}`}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          ← {doc.section_label}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{doc.title}</h1>
        {doc.description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl leading-relaxed">
            {doc.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {doc.voice_safe && <Badge tone="accent">voice-safe</Badge>}
          {doc.email_safe && <Badge tone="success">email-safe</Badge>}
          {doc.provider_only && <Badge tone="warning">provider-only</Badge>}
          {doc.counsel_review_required && (
            <Badge tone="danger">counsel review</Badge>
          )}
          {doc.compliance_pre_scrubbed && (
            <Badge tone="neutral">compliance scrubbed</Badge>
          )}
          <Badge>{doc.word_count.toLocaleString()} words</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <Card>
          <CardBody>
            <article
              className="prose-doc max-w-none"
              dangerouslySetInnerHTML={{ __html: doc.body_html || "<p>No body content captured.</p>" }}
            />
          </CardBody>

          {(prev || next) && (
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4 text-sm">
              {prev ? (
                <Link
                  href={`/kb/${prev.section}/${prev.slug}`}
                  className="hover:text-[var(--color-accent)] max-w-[45%]"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] font-medium">
                    ← Previous
                  </div>
                  <div className="text-sm font-medium truncate">{prev.title}</div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/kb/${next.section}/${next.slug}`}
                  className="hover:text-[var(--color-accent)] text-right max-w-[45%]"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] font-medium">
                    Next →
                  </div>
                  <div className="text-sm font-medium truncate">{next.title}</div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </Card>

        <aside className="space-y-4">
          <Card>
            <CardHeader title="Section" />
            <CardBody className="p-0">
              <ul className="text-xs">
                {sectionDocs.map((d) => (
                  <li
                    key={d.slug}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <Link
                      href={`/kb/${d.section}/${d.slug}`}
                      className={`block px-4 py-2 hover:bg-[var(--color-bg-subtle)] ${
                        d.slug === slug
                          ? "font-semibold text-[var(--color-accent)] bg-[var(--color-bg-subtle)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {doc.composed_by.length > 0 && (
            <Card>
              <CardHeader title="Composed by" />
              <CardBody>
                <ul className="space-y-1 text-xs">
                  {doc.composed_by.map((c) => (
                    <li key={c}>
                      <Link
                        href={`/skills/${c}`}
                        className="font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {doc.source_cited.length > 0 && (
            <Card>
              <CardHeader title="Sources cited" />
              <CardBody>
                <ul className="space-y-1 text-[11px] text-[var(--color-text-muted)] break-all">
                  {doc.source_cited.map((s) => (
                    <li key={s} className="font-mono">
                      {s}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {(doc.last_reviewed || doc.next_review) && (
            <Card>
              <CardHeader title="Review cadence" />
              <CardBody>
                <dl className="text-xs space-y-1.5">
                  {doc.last_reviewed && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-[var(--color-text-subtle)]">Last</dt>
                      <dd className="tabular-nums">{doc.last_reviewed}</dd>
                    </div>
                  )}
                  {doc.next_review && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-[var(--color-text-subtle)]">Next</dt>
                      <dd className="tabular-nums">{doc.next_review}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Source" />
            <CardBody>
              <code className="text-[11px] break-all text-[var(--color-text-muted)]">
                {doc.path}
              </code>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
