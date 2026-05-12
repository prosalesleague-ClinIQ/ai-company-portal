"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import type { Supplier } from "@/lib/manifest";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LABEL,
  CATEGORY_TONE,
  tierTone,
} from "@/lib/supplier-presentation";

export function SuppliersBrowser({ suppliers }: { suppliers: Supplier[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stateF, setStateF] = useState("");
  const [tier, setTier] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "partnership_readiness_score", desc: true },
  ]);

  const categories = useMemo(
    () => uniq(suppliers.map((s) => s.category).filter(Boolean)).sort(),
    [suppliers],
  );
  const states = useMemo(
    () => uniq(suppliers.map((s) => s.state).filter(Boolean)).sort(),
    [suppliers],
  );
  const tiers = useMemo(() => {
    const all = uniq(suppliers.map((s) => s.partner_tier.split(" ")[0]).filter(Boolean));
    return ["P0", "P1", "P2", "P3"].filter((t) => all.includes(t));
  }, [suppliers]);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suppliers.filter((s) => {
      if (category && s.category !== category) return false;
      if (stateF && s.state !== stateF) return false;
      if (tier && !s.partner_tier.startsWith(tier)) return false;
      if (!q) return true;
      return (
        s.company_name.toLowerCase().includes(q) ||
        (s.city || "").toLowerCase().includes(q) ||
        (s.specialties || "").toLowerCase().includes(q) ||
        (s.products_carried || "").toLowerCase().includes(q)
      );
    });
  }, [suppliers, search, category, stateF, tier]);

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "company_name",
        header: "Company",
        cell: ({ row }) => (
          <Link
            href={`/suppliers/${row.original.id}`}
            className="font-medium hover:text-[var(--color-accent)]"
          >
            {row.original.company_name}
          </Link>
        ),
      },
      {
        accessorKey: "category",
        header: "Type",
        cell: ({ row }) => {
          const c = row.original.category;
          return (
            <span
              className={cn(
                "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border whitespace-nowrap",
                CATEGORY_TONE[c] || "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)]",
              )}
            >
              {CATEGORY_LABEL[c] || c}
            </span>
          );
        },
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => {
          const s = row.original;
          const parts = [s.city, s.state, s.country !== "US" ? s.country : ""].filter(Boolean);
          return parts.join(", ") || "—";
        },
      },
      {
        accessorKey: "partnership_readiness_score",
        header: "Score",
        cell: ({ getValue }) => (
          <span className="tabular-nums font-medium">{Number(getValue())}</span>
        ),
      },
      {
        accessorKey: "partner_tier",
        header: "Tier",
        cell: ({ row }) => {
          const t = row.original.partner_tier;
          if (!t) return <span className="text-[var(--color-text-subtle)]">—</span>;
          return (
            <span
              className={cn(
                "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border whitespace-nowrap",
                tierTone(t),
              )}
              title={t}
            >
              {t.split(" ")[0]}
            </span>
          );
        },
      },
      {
        accessorKey: "specialties",
        header: "Specialties",
        cell: ({ getValue }) => {
          const v = String(getValue() || "");
          if (!v) return <span className="text-[var(--color-text-subtle)]">—</span>;
          return (
            <span
              title={v}
              className="block max-w-[260px] truncate text-[var(--color-text-muted)]"
            >
              {v}
            </span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => {
          const v = String(getValue() || "");
          return v ? (
            <span className="tabular-nums text-xs">{v}</span>
          ) : (
            <span className="text-[var(--color-text-subtle)]">—</span>
          );
        },
      },
      {
        accessorKey: "website",
        header: "Website",
        cell: ({ getValue }) => {
          const v = String(getValue() || "");
          if (!v) return <span className="text-[var(--color-text-subtle)]">—</span>;
          return (
            <a
              href={v}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-accent)] hover:underline text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              link
            </a>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, city, specialty, product…"
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c] || c}
              </option>
            ))}
          </select>
          <select
            value={stateF}
            onChange={(e) => setStateF(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="text-xs text-[var(--color-text-subtle)] tabular-nums">
            {data.length} / {suppliers.length}
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-text-subtle)] text-xs uppercase tracking-wider">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-[var(--color-border)]">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-2.5 font-medium cursor-pointer select-none whitespace-nowrap"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && " ↑"}
                      {h.column.getIsSorted() === "desc" && " ↓"}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]"
                  >
                    No suppliers match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
          <div className="text-[var(--color-text-subtle)] tabular-nums">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 rounded border border-[var(--color-border)] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 rounded border border-[var(--color-border)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
