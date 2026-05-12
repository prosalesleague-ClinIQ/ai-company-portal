import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { getManifest } from "@/lib/manifest";

export const metadata: Metadata = {
  title: "AI Company Portal — Matrix Advanced Solutions",
  description:
    "Operator dashboard for the Matrix AI Company OS — skills, workflows, leads, approvals, schedule.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const manifest = await getManifest();
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="flex min-h-screen">
          <Sidebar
            stats={manifest.stats}
            builtAt={manifest.built_at}
            version={manifest.version}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1600px] w-full mx-auto">
              {children}
            </main>
            <footer className="px-6 lg:px-10 py-4 text-xs text-[var(--color-text-subtle)] border-t border-[var(--color-border)]">
              Manifest {manifest.version} · built {new Date(manifest.built_at).toLocaleString()}
              {" · "}
              <a
                href="https://github.com/prosalesleague-ClinIQ/ai-company-portal"
                className="hover:text-[var(--color-accent)] underline-offset-2 hover:underline"
              >
                source
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
