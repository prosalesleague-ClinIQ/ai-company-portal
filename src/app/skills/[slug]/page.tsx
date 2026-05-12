import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody, CardHeader, Badge } from "@/components/ui/card";
import { renderMarkdown } from "@/lib/markdown";

const AI_COMPANY =
  process.env.AI_COMPANY_PATH || "/Users/christomac/Projects/AI Company";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.skills.map((s) => ({ slug: s.slug }));
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = await getManifest();
  const skill = m.skills.find((s) => s.slug === slug);
  if (!skill) notFound();

  let body = "";
  try {
    const filePath = path.join(AI_COMPANY, skill.path);
    const raw = await fs.readFile(filePath, "utf-8");
    const { content } = matter(raw);
    body = await renderMarkdown(content);
  } catch (e) {
    body = `<p>Could not load SKILL.md body. (${String(e)})</p>`;
  }

  const dept = m.departments.find((d) => d.slug === skill.department);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/skills"
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          ← All skills
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{skill.name}</h1>
        {skill.description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl leading-relaxed">
            {skill.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="accent">{skill.type || "specialist"}</Badge>
          {dept && (
            <Link href={`/departments/${dept.slug}`}>
              <Badge>{dept.name}</Badge>
            </Link>
          )}
          {skill.theme && <Badge>{skill.theme}</Badge>}
          {skill.estimated_time && <Badge>{skill.estimated_time}</Badge>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <Card>
          <CardBody>
            <article
              className="prose-doc max-w-none"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </CardBody>
        </Card>

        <aside className="space-y-4">
          {skill.triggers.length > 0 && (
            <Card>
              <CardHeader title="Triggers" />
              <CardBody>
                <ul className="space-y-1 text-xs">
                  {skill.triggers.map((t) => (
                    <li
                      key={t}
                      className="font-mono text-[var(--color-text-muted)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          {skill.best_for.length > 0 && (
            <Card>
              <CardHeader title="Best for" />
              <CardBody>
                <ul className="space-y-1.5 text-xs text-[var(--color-text-muted)] list-disc list-inside">
                  {skill.best_for.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Source" />
            <CardBody>
              <code className="text-[11px] break-all text-[var(--color-text-muted)]">
                {skill.path}
              </code>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
