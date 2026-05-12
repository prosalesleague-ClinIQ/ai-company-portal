"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function crumbs(pathname: string) {
  if (pathname === "/") return [{ label: "Dashboard", href: "/" }];
  const parts = pathname.split("/").filter(Boolean);
  const out: { label: string; href: string }[] = [{ label: "Dashboard", href: "/" }];
  let acc = "";
  for (const p of parts) {
    acc += "/" + p;
    out.push({
      label: p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: acc,
    });
  }
  return out;
}

export function TopBar() {
  const pathname = usePathname();
  const trail = crumbs(pathname);
  return (
    <header className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 lg:px-10 bg-[var(--color-bg)]/80 backdrop-blur sticky top-0 z-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] truncate">
        {trail.map((c, i) => (
          <span key={c.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-[var(--color-text-subtle)]">/</span>}
            <Link
              href={c.href}
              className={
                i === trail.length - 1
                  ? "text-[var(--color-text)] font-medium"
                  : "hover:text-[var(--color-text)]"
              }
            >
              {c.label}
            </Link>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--color-text-subtle)] hidden sm:inline">
          Operator: Chris
        </span>
        <div className="size-7 rounded-full bg-gradient-to-br from-[var(--color-brand-pink)] to-[var(--color-brand-purple)] flex items-center justify-center text-[11px] font-semibold text-white">
          C
        </div>
      </div>
    </header>
  );
}
