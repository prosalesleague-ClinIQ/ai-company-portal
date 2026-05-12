import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";
import {
  CATEGORY_LABEL,
  CATEGORY_TONE,
  tierTone,
} from "@/lib/supplier-presentation";
import { cn } from "@/lib/cn";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.suppliers.map((s) => ({ slug: s.id }));
}

function fieldOrDash(v: string | number | undefined | null): string {
  if (v == null) return "—";
  const s = String(v).trim();
  if (!s) return "—";
  return s;
}

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = await getManifest();
  const supplier = m.suppliers.find((s) => s.id === slug);
  if (!supplier) notFound();

  const verifyItems = (supplier.verify_queue || "")
    .split(/[/;\n]|\s+\|\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const categoryLabel = CATEGORY_LABEL[supplier.category] || supplier.category;
  const categoryToneClass = CATEGORY_TONE[supplier.category] ||
    "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)]";

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/suppliers"
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          ← All suppliers
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">
          {supplier.company_name}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {[supplier.city, supplier.state, supplier.country]
            .filter(Boolean)
            .join(", ")}
          {supplier.address && ` · ${supplier.address}`}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span
            className={cn(
              "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border",
              categoryToneClass,
            )}
          >
            {categoryLabel}
          </span>
          <Badge tone="accent">Score {supplier.partnership_readiness_score}</Badge>
          {supplier.partner_tier && (
            <span
              className={cn(
                "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border",
                tierTone(supplier.partner_tier),
              )}
              title={supplier.partner_tier}
            >
              {supplier.partner_tier}
            </span>
          )}
          {supplier.country && supplier.country !== "US" && (
            <Badge tone="warning">{supplier.country}</Badge>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Identity" />
          <CardBody>
            <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
              <dt className="text-[var(--color-text-subtle)]">Company type</dt>
              <dd>{fieldOrDash(supplier.company_type)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Address</dt>
              <dd>{fieldOrDash(supplier.address)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Phone</dt>
              <dd className="tabular-nums">{fieldOrDash(supplier.phone)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Email</dt>
              <dd className="break-all">{fieldOrDash(supplier.email)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Website</dt>
              <dd className="break-all">
                {supplier.website ? (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {supplier.website}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt className="text-[var(--color-text-subtle)]">Contact</dt>
              <dd>
                {[
                  supplier.primary_contact_first,
                  supplier.primary_contact_last,
                ]
                  .filter(Boolean)
                  .join(" ") || "—"}
                {supplier.primary_contact_title &&
                  ` · ${supplier.primary_contact_title}`}
              </dd>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Regulatory" />
          <CardBody>
            <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
              <dt className="text-[var(--color-text-subtle)]">FDA reg #</dt>
              <dd className="font-mono text-xs">
                {fieldOrDash(supplier.fda_registration_number)}
              </dd>
              <dt className="text-[var(--color-text-subtle)]">FDA status</dt>
              <dd>{fieldOrDash(supplier.fda_registration_status)}</dd>
              <dt className="text-[var(--color-text-subtle)]">DEA</dt>
              <dd>{fieldOrDash(supplier.dea_registration)}</dd>
              <dt className="text-[var(--color-text-subtle)]">State license</dt>
              <dd>{fieldOrDash(supplier.state_pharmacy_license)}</dd>
              <dt className="text-[var(--color-text-subtle)]">State status</dt>
              <dd>{fieldOrDash(supplier.state_pharmacy_status)}</dd>
              <dt className="text-[var(--color-text-subtle)]">NABP</dt>
              <dd>{fieldOrDash(supplier.nabp_accreditation)}</dd>
              <dt className="text-[var(--color-text-subtle)]">PCAB</dt>
              <dd>{fieldOrDash(supplier.pcab_accreditation)}</dd>
              <dt className="text-[var(--color-text-subtle)]">ISO</dt>
              <dd>{fieldOrDash(supplier.iso_certification)}</dd>
              <dt className="text-[var(--color-text-subtle)]">cGMP</dt>
              <dd>{fieldOrDash(supplier.cgmp_certified)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Last audit</dt>
              <dd className="tabular-nums">{fieldOrDash(supplier.last_audit_date)}</dd>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Capability" />
          <CardBody>
            <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
              <dt className="text-[var(--color-text-subtle)]">Products carried</dt>
              <dd className="whitespace-pre-wrap">{fieldOrDash(supplier.products_carried)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Specialties</dt>
              <dd className="whitespace-pre-wrap">{fieldOrDash(supplier.specialties)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Capacity</dt>
              <dd>{fieldOrDash(supplier.capacity_signal)}</dd>
              <dt className="text-[var(--color-text-subtle)]">MOQ</dt>
              <dd>{fieldOrDash(supplier.moq)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Pricing tier</dt>
              <dd>{fieldOrDash(supplier.pricing_tier_signal)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Ship to (states)</dt>
              <dd>{fieldOrDash(supplier.ship_to_states)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Ship to (countries)</dt>
              <dd>{fieldOrDash(supplier.ship_to_countries)}</dd>
              <dt className="text-[var(--color-text-subtle)]">Existing clients</dt>
              <dd className="whitespace-pre-wrap">{fieldOrDash(supplier.existing_clients_signal)}</dd>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Partnership readiness" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[var(--color-text-muted)]">
                    Readiness score
                  </span>
                  <span className="tabular-nums font-medium">
                    {supplier.partnership_readiness_score} / 100
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-[var(--color-bg-subtle)] rounded">
                  <div
                    className="h-1.5 bg-[var(--color-accent)] rounded"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, supplier.partnership_readiness_score),
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                <dt className="text-[var(--color-text-subtle)]">Partner tier</dt>
                <dd>
                  {supplier.partner_tier ? (
                    <span
                      className={cn(
                        "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border",
                        tierTone(supplier.partner_tier),
                      )}
                    >
                      {supplier.partner_tier}
                    </span>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt className="text-[var(--color-text-subtle)]">Source CSV</dt>
                <dd className="font-mono text-xs">{supplier.source_csv}</dd>
                <dt className="text-[var(--color-text-subtle)]">Source URL</dt>
                <dd className="break-all">
                  {supplier.source_url ? (
                    <a
                      href={supplier.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      {supplier.source_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
                <dt className="text-[var(--color-text-subtle)]">Sourced at</dt>
                <dd className="tabular-nums">{fieldOrDash(supplier.sourced_at)}</dd>
              </dl>
            </div>
          </CardBody>
        </Card>
      </div>

      {supplier.notes && (
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {supplier.notes}
            </p>
          </CardBody>
        </Card>
      )}

      {verifyItems.length > 0 && (
        <Card>
          <CardHeader
            title="Verify queue"
            subtitle="Open items before partnership outreach. Per supplier-discovery-policy.md."
          />
          <CardBody>
            <ul className="space-y-1.5 text-sm">
              {verifyItems.map((v, i) => (
                <li
                  key={i}
                  className="border-l-2 border-amber-300 pl-3 text-[var(--color-text)]"
                >
                  {v}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
