import { getManifest } from "@/lib/manifest";
import { SkillsBrowser } from "@/components/skills-browser";

export default async function SkillsPage() {
  const m = await getManifest();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {m.skills.length} specialists indexed from <code>_Skills Library/Company-OS-Skills</code>.
        </p>
      </header>
      <SkillsBrowser skills={m.skills} departments={m.departments} />
    </div>
  );
}
