import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";
import { SECTION_BLURBS } from "@/components/kb-browser";

export async function generateStaticParams() {
  const m = await getManifest();
  const seen = new Set<string>();
  return m.kb_docs
    .filter((d) => {
      if (seen.has(d.section)) return false;
      seen.add(d.section);
      return true;
    })
    .map((d) => ({ section: d.section }));
}

export default async function KBSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const m = await getManifest();
  const docs = m.kb_docs.filter((d) => d.section === section);
  if (docs.length === 0) notFound();
  const sectionLabel = docs[0].section_label;

  const totalWords = docs.reduce((a, d) => a + d.word_count, 0);
  const voiceSafe = docs.filter((d) => d.voice_safe).length;
  const emailSafe = docs.filter((d) => d.email_safe).length;
  const providerOnly = docs.filter((d) => d.provider_only).length;

  return (
    <div className="space-y-6">
      <header>
        <Link href="/kb" className="text-xs text-[var(--color-accent)] hover:underline">
          ← All sections
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{sectionLabel}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl">
          {SECTION_BLURBS[section] || "Knowledge-base section."}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-[var(--color-text-subtle)]">
          <Badge>{docs.length} docs</Badge>
          <Badge>{totalWords.toLocaleString()} words</Badge>
          {voiceSafe > 0 && <Badge tone="accent">{voiceSafe} voice-safe</Badge>}
          {emailSafe > 0 && <Badge tone="success">{emailSafe} email-safe</Badge>}
          {providerOnly > 0 && (
            <Badge tone="warning">{providerOnly} provider-only</Badge>
          )}
        </div>
      </header>

      <Card>
        <CardHeader title="Documents in this section" />
        <CardBody className="p-0">
          <ul>
            {docs.map((d) => (
              <li
                key={d.slug}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <Link
                  href={`/kb/${d.section}/${d.slug}`}
                  className="block px-5 py-3.5 hover:bg-[var(--color-bg-subtle)]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-tight">{d.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] tabular-nums">
                      {d.word_count.toLocaleString()} words
                    </span>
                  </div>
                  {d.description && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2 max-w-3xl">
                      {d.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.voice_safe && <Badge tone="accent">voice-safe</Badge>}
                    {d.email_safe && <Badge tone="success">email-safe</Badge>}
                    {d.provider_only && <Badge tone="warning">provider-only</Badge>}
                    {d.counsel_review_required && (
                      <Badge tone="danger">counsel review</Badge>
                    )}
                    {d.compliance_pre_scrubbed && (
                      <Badge tone="neutral">compliance scrubbed</Badge>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
