import { getManifest } from "@/lib/manifest";
import { GlobalSearch } from "@/components/global-search";

export default async function SearchPage() {
  const m = await getManifest();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Global search</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Search across {m.skills.length} skills + {m.workflows.length} workflows + {m.leads.length} leads.
        </p>
      </header>
      <GlobalSearch
        skills={m.skills}
        workflows={m.workflows}
        leads={m.leads}
      />
    </div>
  );
}
