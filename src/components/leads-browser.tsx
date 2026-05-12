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
import type { Lead } from "@/lib/manifest";
import { cn } from "@/lib/cn";

export function LeadsBrowser({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [vertical, setVertical] = useState("");
  const [tier, setTier] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "lead_score", desc: true },
  ]);

  const states = useMemo(() => uniq(leads.map((l) => l.state).filter(Boolean)).sort(), [leads]);
  const verticals = useMemo(() => uniq(leads.map((l) => l.vertical).filter(Boolean)).sort(), [leads]);
  const tiers = useMemo(() => uniq(leads.map((l) => l.geo_tier).filter(Boolean)).sort(), [leads]);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (state && l.state !== state) return false;
      if (vertical && l.vertical !== vertical) return false;
      if (tier && l.geo_tier !== tier) return false;
      if (!q) return true;
      return (
        l.clinic_name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
        (l.matrix_product_fit_top3 || "").toLowerCase().includes(q)
      );
    });
  }, [leads, search, state, vertical, tier]);

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: "clinic_name",
        header: "Clinic",
        cell: ({ row }) => (
          <Link
            href={`/leads/${row.original.id}`}
            className="font-medium hover:text-[var(--color-accent)]"
          >
            {row.original.clinic_name}
          </Link>
        ),
      },
      {
        id: "owner",
        header: "Owner",
        cell: ({ row }) =>
          `${row.original.first_name || ""} ${row.original.last_name || ""}`.trim() || "—",
      },
      { accessorKey: "city", header: "City" },
      { accessorKey: "state", header: "State" },
      { accessorKey: "vertical", header: "Vertical" },
      { accessorKey: "geo_tier", header: "Tier" },
      {
        accessorKey: "lead_score",
        header: "Score",
        cell: ({ getValue }) => (
          <span className="tabular-nums font-medium">{Number(getValue())}</span>
        ),
      },
      {
        accessorKey: "lead_tier",
        header: "Tier (qual)",
        cell: ({ getValue }) => {
          const v = String(getValue() || "");
          const tone =
            v === "hot"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : v === "warm"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : v === "qualified"
              ? "bg-cyan-50 border-cyan-200 text-cyan-800"
              : "bg-[var(--color-bg-subtle)] border-[var(--color-border)] text-[var(--color-text-muted)]";
          return (
            <span
              className={cn(
                "inline-block text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border",
                tone,
              )}
            >
              {v || "—"}
            </span>
          );
        },
      },
      { accessorKey: "practitioner_count", header: "Providers" },
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
            placeholder="Search clinic, owner, city, product fit…"
            className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
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
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <option value="">All verticals</option>
            {verticals.map((v) => (
              <option key={v} value={v}>
                {v}
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
                Tier {t}
              </option>
            ))}
          </select>
          <div className="text-xs text-[var(--color-text-subtle)] tabular-nums">
            {data.length} / {leads.length}
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
                    No leads match.
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
