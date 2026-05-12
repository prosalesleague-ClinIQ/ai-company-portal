import Link from "next/link";
import { notFound } from "next/navigation";
import { getManifest } from "@/lib/manifest";
import { Card, CardBody } from "@/components/ui/card";

export async function generateStaticParams() {
  const m = await getManifest();
  return m.workflows.map((w) => ({ slug: w.slug }));
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = await getManifest();
  const wf = m.workflows.find((w) => w.slug === slug);
  if (!wf) notFound();

  const body = wf.body_html || "<p>No body content captured.</p>";

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/workflows"
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          ← All workflows
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">{wf.name}</h1>
        {wf.description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-3xl leading-relaxed">
            {wf.description}
          </p>
        )}
      </header>

      <Card>
        <CardBody>
          <article
            className="prose-doc max-w-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
