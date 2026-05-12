import { getManifest } from "@/lib/manifest";
import { StatCard } from "@/components/ui/card";
import { KBBrowser } from "@/components/kb-browser";

export default async function KBPage() {
  const m = await getManifest();

  const sectionCounts = m.stats.kb_section_counts || {};
  const sectionWords: Record<string, number> = {};
  const sectionLabels: Record<string, string> = {};
  for (const d of m.kb_docs) {
    sectionWords[d.section] = (sectionWords[d.section] || 0) + d.word_count;
    sectionLabels[d.section] = d.section_label;
  }
  const sections = Object.keys(sectionCounts)
    .map((slug) => ({
      slug,
      label: sectionLabels[slug] || slug,
      count: sectionCounts[slug] || 0,
      words: sectionWords[slug] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const voiceSafe = m.kb_docs.filter((d) => d.voice_safe).length;
  const emailSafe = m.kb_docs.filter((d) => d.email_safe).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl">
          Matrix Domain KB — the single source of truth for what Matrix sells, peptide
          + TRT/HRT chemistry, objection handling, regulatory framing, and how Mia +
          outreach-writer + roleplay-coach talk about it. Source:
          {" "}
          <code>_Knowledge Base/Matrix Domain/</code>.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Docs" value={m.stats.kb_docs} hint="across all sections" />
        <StatCard
          label="Words"
          value={m.stats.kb_words.toLocaleString()}
          hint="total"
        />
        <StatCard
          label="Sections"
          value={m.stats.kb_sections}
          hint="thematic"
        />
        <StatCard label="Voice-safe" value={voiceSafe} hint="Mia-ready" />
        <StatCard label="Email-safe" value={emailSafe} hint="outreach-ready" />
      </section>

      <KBBrowser kb_docs={m.kb_docs} sections={sections} />
    </div>
  );
}
