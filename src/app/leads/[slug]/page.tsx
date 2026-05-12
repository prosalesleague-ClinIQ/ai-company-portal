import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.leads.map((l) => ({ slug: l.id }));
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = await getManifest();
  const lead = m.leads.find((l) => l.id === slug);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <header>
        <Link href="/leads" className="text-xs text-[var(--color-accent)] hover:underline">
          ← All leads
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{lead.clinic_name}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {[lead.first_name, lead.last_name].filter(Boolean).join(" ")}
          {lead.title && ` · ${lead.title}`}
          {" · "}
          {lead.city}, {lead.state}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="accent">Score {lead.lead_score}</Badge>
          <Badge>Fit {lead.fit_score}</Badge>
          <Badge>{lead.vertical}</Badge>
          <Badge>Tier {lead.geo_tier}</Badge>
          {lead.lead_tier && <Badge tone="warning">{lead.lead_tier}</Badge>}
          {lead.dnc_status && lead.dnc_status !== "clean" && (
            <Badge tone="danger">DNC: {lead.dnc_status}</Badge>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Contact" />
          <CardBody>
            <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
              <dt className="text-[var(--color-text-subtle)]">Phone</dt>
              <dd className="tabular-nums">{lead.phone || "—"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Email</dt>
              <dd className="break-all">{lead.email || "—"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Website</dt>
              <dd className="break-all">
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {lead.website}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt className="text-[var(--color-text-subtle)]">Specialty</dt>
              <dd>{lead.provider_specialty || "—"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Providers</dt>
              <dd className="tabular-nums">{lead.practitioner_count || 0}</dd>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Sales intel" />
          <CardBody>
            <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
              <dt className="text-[var(--color-text-subtle)]">Clinic type</dt>
              <dd>{lead.clinic_type_primary || "—"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Sub-brand</dt>
              <dd>{lead.sub_brand_alignment || "Matrix"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Product fit</dt>
              <dd>{lead.matrix_product_fit_top3 || "—"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Multi-location</dt>
              <dd>{lead.multi_location_signal ? "Yes" : "No"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Cash-pay</dt>
              <dd>{lead.cash_pay_signal ? "Yes" : "No"}</dd>
              <dt className="text-[var(--color-text-subtle)]">Source</dt>
              <dd className="font-mono text-xs">{lead.source || "—"}</dd>
            </dl>
          </CardBody>
        </Card>
      </div>

      {lead.notes && (
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Scoring" />
        <CardBody>
          <div className="grid grid-cols-3 gap-4">
            <ScoreBar label="Lead score" value={lead.lead_score} />
            <ScoreBar label="Fit score" value={lead.fit_score} />
            <ScoreBar label="Intent score" value={lead.intent_score} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span className="tabular-nums font-medium">{value}</span>
      </div>
      <div className="mt-1 h-1.5 bg-[var(--color-bg-subtle)] rounded">
        <div
          className="h-1.5 bg-[var(--color-accent)] rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
