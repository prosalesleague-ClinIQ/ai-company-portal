import { getManifest } from "@/lib/manifest";
import { LeadsBrowser } from "@/components/leads-browser";

export default async function LeadsPage() {
  const m = await getManifest();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.leads.length} prospect rows from <code>_Logs/outreach/prospect-lists/</code>
          {" "} (NorCal Q2 2026 + Multistate Q2-Q3 2026).
        </p>
      </header>
      <LeadsBrowser leads={m.leads} />
    </div>
  );
}
