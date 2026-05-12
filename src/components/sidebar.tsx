"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Layers,
  GitBranch,
  Users,
  Factory,
  CheckSquare,
  Clock,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/departments", label: "Departments", icon: Building2, key: "departments" },
  { href: "/skills", label: "Skills", icon: Layers, key: "skills" },
  { href: "/workflows", label: "Workflows", icon: GitBranch, key: "workflows" },
  { href: "/leads", label: "Leads", icon: Users, key: "leads" },
  { href: "/suppliers", label: "Suppliers", icon: Factory, key: "suppliers" },
  { href: "/approvals", label: "Approvals", icon: CheckSquare, key: "approvals" },
  { href: "/cron", label: "Scheduled", icon: Clock, key: "crons" },
  { href: "/search", label: "Search", icon: Search, key: "search" },
] as const;

type StatsMap = Record<string, number | Record<string, number>>;

export function Sidebar({
  stats,
}: {
  stats: StatsMap;
  builtAt: string;
  version: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col shrink-0 transition-all duration-150",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="px-4 py-5 flex items-center justify-between border-b border-[var(--color-border)]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-gradient-to-br from-[var(--color-brand-purple)] to-[var(--color-brand-cyan)]" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Matrix</span>
              <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider">
                AI Company OS
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="size-7 rounded-md bg-gradient-to-br from-[var(--color-brand-purple)] to-[var(--color-brand-cyan)]" />
          </Link>
        )}
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            "p-1 rounded-md hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-subtle)]",
            collapsed && "absolute right-1 top-3",
          )}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          const rawCount = stats[item.key];
          const count = typeof rawCount === "number" ? rawCount : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-text)] font-medium shadow-sm border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text)]",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && count != null && (
                <span className="text-[10px] font-medium text-[var(--color-text-subtle)] tabular-nums px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 py-3 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider">
          Matrix Advanced Solutions
        </div>
      )}
    </aside>
  );
}
