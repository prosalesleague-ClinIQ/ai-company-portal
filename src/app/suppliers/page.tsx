import { getManifest } from "@/lib/manifest";
import { SuppliersBrowser } from "@/components/suppliers-browser";
import { StatCard } from "@/components/ui/card";
import { CATEGORY_LABEL } from "@/lib/supplier-presentation";

export default async function SuppliersPage() {
  const m = await getManifest();
  const cats = m.stats.supplier_categories || {};
  const tiers = m.stats.supplier_tiers || {};

  const tierP0 = Object.entries(tiers)
    .filter(([k]) => k.startsWith("P0"))
    .reduce((a, [, v]) => a + v, 0);
  const tierP1 = Object.entries(tiers)
    .filter(([k]) => k.startsWith("P1"))
    .reduce((a, [, v]) => a + v, 0);
  const tierP2 = Object.entries(tiers)
    .filter(([k]) => k.startsWith("P2"))
    .reduce((a, [, v]) => a + v, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Suppliers</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.suppliers.length} qualified supplier leads from the new Supplier Discovery & Partnership Department.
          Source CSVs in <code>_Logs/supplier-discovery/extracted/</code>. Policy:
          {" "}
          <code>_Shared Context/supplier-discovery-policy.md</code>.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Total" value={m.suppliers.length} />
        <StatCard label="P0 — Priority" value={tierP0} hint="outreach this quarter" />
        <StatCard label="P1 — Next" value={tierP1} hint="next quarter" />
        <StatCard label="P2 — Nurture" value={tierP2} hint="qualify further" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {Object.entries(cats)
          .sort((a, b) => b[1] - a[1])
          .map(([slug, n]) => (
            <div
              key={slug}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2"
            >
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)] font-medium">
                {CATEGORY_LABEL[slug] || slug}
              </div>
              <div className="text-lg font-semibold tabular-nums tracking-tight mt-0.5">
                {n}
              </div>
            </div>
          ))}
      </section>

      <SuppliersBrowser suppliers={m.suppliers} />
    </div>
  );
}
